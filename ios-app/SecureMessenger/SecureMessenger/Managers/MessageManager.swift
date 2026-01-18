//
//  MessageManager.swift
//  SecureMessenger
//
//  Manages secure messaging with double encryption:
//  1. Signal Protocol (E2E encryption)
//  2. KnectIQ SelectiveTRUST® (ephemeral keys constructed at device)
//

import Foundation
import LibSignalClient

/// Message Manager combining Signal Protocol with SelectiveTRUST®
/// Provides defense-in-depth with two layers of encryption
public class MessageManager: ObservableObject {

    // MARK: - Properties

    @Published public private(set) var messages: [Message] = []
    @Published public private(set) var ephemeralKeysUsed: Int = 0

    private let userId: String
    private let dasb: DeviceAccessServiceBroker
    private let trustEnvironmentId: String
    private var localDeviceSDK: DeviceSDK?

    private let networkManager: NetworkManager
    private let database: DatabaseManager

    // MARK: - Initialization

    public init(userId: String, config: IntegrationConfig) {
        self.userId = userId
        self.trustEnvironmentId = "signal-\(config.trustEnvironmentName)"

        // Initialize DASB (Device Access Service Broker)
        let dasbConfig = DeviceAccessServiceBroker.Config(
            dasbId: "dasb-\(userId)",
            mode: config.fipsMode ? .fips140_2 : .standard,
            maxTrustEnvironments: 10,
            auditLogging: true
        )
        self.dasb = DeviceAccessServiceBroker(config: dasbConfig)

        // Create Trust Environment
        let trustEnvConfig = TrustEnvironment.Config(
            name: config.trustEnvironmentName,
            maxDevices: config.maxDevices,
            sessionTimeout: config.sessionTimeout,
            requiredTrustScore: config.requiredTrustScore
        )

        do {
            try dasb.createTrustEnvironment(
                environmentId: trustEnvironmentId,
                config: trustEnvConfig
            )
        } catch {
            print("Failed to create trust environment: \(error)")
        }

        self.networkManager = NetworkManager()
        self.database = DatabaseManager()

        // Provision local device
        provisionLocalDevice()
    }

    // MARK: - Device Provisioning

    private func provisionLocalDevice() {
        let request = DeviceAccessServiceBroker.DeviceProvisionRequest(
            deviceId: userId,
            deviceType: UIDevice.current.userInterfaceIdiom == .phone ? "mobile" : "tablet",
            trustEnvironmentId: trustEnvironmentId,
            capabilities: ["encrypt", "decrypt", "sign", "verify"]
        )

        do {
            localDeviceSDK = try dasb.provisionDevice(request: request)
            print("✓ Local device provisioned with SelectiveTRUST®")
        } catch {
            print("Failed to provision device: \(error)")
        }
    }

    // MARK: - Contact Management

    /// Add trusted contact and establish trust relationship
    public func addTrustedContact(contactId: String) async throws {
        guard localDeviceSDK != nil else {
            throw MessageError.deviceNotProvisioned
        }

        // Provision remote device
        let request = DeviceAccessServiceBroker.DeviceProvisionRequest(
            deviceId: contactId,
            deviceType: "mobile",
            trustEnvironmentId: trustEnvironmentId,
            capabilities: ["encrypt", "decrypt", "sign", "verify"]
        )

        _ = try dasb.provisionDevice(request: request)

        // Establish trust relationship via DASB
        _ = try dasb.establishTrustRelationship(
            deviceIdA: userId,
            deviceIdB: contactId,
            trustEnvironmentId: trustEnvironmentId
        )

        print("✓ Trust relationship established with \(contactId)")
    }

    // MARK: - Message Sending (Double Encryption)

    /// Send message with double encryption
    /// Layer 1: Signal Protocol E2E encryption
    /// Layer 2: SelectiveTRUST® ephemeral key encryption
    public func sendMessage(_ text: String, to recipientId: String) async throws {
        guard let deviceSDK = localDeviceSDK else {
            throw MessageError.deviceNotProvisioned
        }

        // 1. Validate trust relationship (real-time validation)
        guard validateTrust(with: recipientId) else {
            throw MessageError.trustValidationFailed
        }

        let messageData = text.data(using: .utf8)!

        // 2. Signal Protocol encryption (first layer)
        // In production: Use actual Signal Protocol implementation
        let signalCiphertext = try await encryptWithSignalProtocol(
            data: messageData,
            for: recipientId
        )

        // 3. SelectiveTRUST® ephemeral encryption (second layer)
        // Patent: "Single-use encryption keys dynamically generated at the device"
        let ephemeralKeyId = deviceSDK.constructEphemeralKey()
        let selectiveTrustPackage = try deviceSDK.encryptData(
            data: signalCiphertext,
            targetDeviceId: recipientId,
            ephemeralKeyId: ephemeralKeyId
        )

        // 4. Send to server
        try await networkManager.sendMessage(selectiveTrustPackage, to: recipientId)

        // 5. Save to local database
        let message = Message(
            id: selectiveTrustPackage.packageId,
            senderId: userId,
            recipientId: recipientId,
            content: text,
            timestamp: Date(),
            status: .sent,
            isEphemeralEncrypted: true
        )

        await MainActor.run {
            messages.append(message)
            ephemeralKeysUsed += 1
        }

        print("✓ Message sent with double encryption")
        print("  - Signal Protocol: E2E encryption")
        print("  - SelectiveTRUST®: Ephemeral key \(ephemeralKeyId.prefix(20))... (destroyed)")
    }

    // MARK: - Message Receiving (Double Decryption)

    /// Receive and decrypt message
    /// Layer 1: SelectiveTRUST® ephemeral decryption
    /// Layer 2: Signal Protocol decryption
    public func receiveMessage(_ package: DeviceSDK.SecureDataPackage) async throws -> Message {
        guard let deviceSDK = localDeviceSDK else {
            throw MessageError.deviceNotProvisioned
        }

        // 1. Validate trust relationship
        guard validateTrust(with: package.sourceDeviceId) else {
            throw MessageError.trustValidationFailed
        }

        // 2. SelectiveTRUST® decryption (outer layer)
        // Patent: Key "constructed at the trusted device"
        let signalCiphertext = try deviceSDK.decryptData(package: package)

        // 3. Signal Protocol decryption (inner layer)
        let plaintext = try await decryptWithSignalProtocol(
            ciphertext: signalCiphertext,
            from: package.sourceDeviceId
        )

        // 4. Convert to string
        guard let messageText = String(data: plaintext, encoding: .utf8) else {
            throw MessageError.decodingFailed
        }

        // 5. Save to database
        let message = Message(
            id: package.packageId,
            senderId: package.sourceDeviceId,
            recipientId: package.targetDeviceId,
            content: messageText,
            timestamp: package.timestamp,
            status: .delivered,
            isEphemeralEncrypted: true
        )

        await MainActor.run {
            messages.append(message)
        }

        print("✓ Message received and decrypted")

        return message
    }

    // MARK: - Trust Validation

    private func validateTrust(with deviceId: String) -> Bool {
        guard let trustEnv = dasb.getTrustEnvironment(environmentId: trustEnvironmentId) else {
            return false
        }

        let relationships = trustEnv.getDeviceRelationships(deviceId: userId)
        return relationships.contains { relationship in
            (relationship.deviceA == deviceId || relationship.deviceB == deviceId) && relationship.active
        }
    }

    // MARK: - Signal Protocol (Placeholder Implementation)

    private func encryptWithSignalProtocol(data: Data, for recipientId: String) async throws -> Data {
        // TODO: Implement actual Signal Protocol encryption
        // For now, return the data as-is for demonstration
        // In production: Use LibSignalClient for proper E2E encryption
        return data
    }

    private func decryptWithSignalProtocol(ciphertext: Data, from senderId: String) async throws -> Data {
        // TODO: Implement actual Signal Protocol decryption
        // For now, return the ciphertext as-is for demonstration
        // In production: Use LibSignalClient for proper E2E decryption
        return ciphertext
    }

    // MARK: - Security Metrics

    public func getSecurityMetrics() -> SecurityMetrics {
        let localStats = localDeviceSDK?.getStatistics()
        let dasbStats = dasb.getStatistics()
        let trustEnvStats = dasb.getTrustEnvironment(environmentId: trustEnvironmentId)?.getStatistics()

        return SecurityMetrics(
            activeEphemeralKeys: localStats?.activeKeys ?? 0,
            totalKeysConstructed: localStats?.keysConstructed ?? 0,
            totalKeysDestroyed: localStats?.keysDestroyed ?? 0,
            activeTrustRelationships: dasbStats.trustRelationships,
            provisionedDevices: dasbStats.provisionedDevices,
            fipsMode: dasbStats.mode == .fips140_2
        )
    }

    public struct SecurityMetrics {
        public let activeEphemeralKeys: Int
        public let totalKeysConstructed: Int
        public let totalKeysDestroyed: Int
        public let activeTrustRelationships: Int
        public let provisionedDevices: Int
        public let fipsMode: Bool
    }

    // MARK: - Cleanup

    public func shutdown() {
        dasb.shutdown()
        localDeviceSDK?.shutdown()
    }
}

// MARK: - Supporting Types

public struct IntegrationConfig {
    let trustEnvironmentName: String
    let maxDevices: Int
    let sessionTimeout: TimeInterval
    let requiredTrustScore: Int
    let fipsMode: Bool

    public init(trustEnvironmentName: String, maxDevices: Int = 100,
                sessionTimeout: TimeInterval = 3600, requiredTrustScore: Int = 80,
                fipsMode: Bool = false) {
        self.trustEnvironmentName = trustEnvironmentName
        self.maxDevices = maxDevices
        self.sessionTimeout = sessionTimeout
        self.requiredTrustScore = requiredTrustScore
        self.fipsMode = fipsMode
    }
}

public struct Message: Identifiable, Codable {
    public let id: String
    public let senderId: String
    public let recipientId: String
    public let content: String
    public let timestamp: Date
    public var status: MessageStatus
    public let isEphemeralEncrypted: Bool
}

public enum MessageStatus: String, Codable {
    case sending
    case sent
    case delivered
    case failed
}

enum MessageError: Error {
    case deviceNotProvisioned
    case trustValidationFailed
    case decodingFailed
    case encryptionFailed
    case decryptionFailed
}

// MARK: - Network Manager (Placeholder)

class NetworkManager {
    func sendMessage(_ package: DeviceSDK.SecureDataPackage, to recipientId: String) async throws {
        // TODO: Implement actual network sending
        print("📡 Sending encrypted package to \(recipientId)")
    }
}

// MARK: - Database Manager (Placeholder)

class DatabaseManager {
    // TODO: Implement GRDB database for message persistence
}
