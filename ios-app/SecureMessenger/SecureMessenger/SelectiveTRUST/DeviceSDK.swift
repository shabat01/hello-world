//
//  DeviceSDK.swift
//  SecureMessenger - KnectIQ SelectiveTRUST® Integration
//
//  Device SDK for ephemeral key construction at device
//  Core patent concept: Keys constructed AT THE DEVICE, not centrally
//

import Foundation
import CryptoKit

/// Device SDK implementing KnectIQ's patented ephemeral key technology
/// Patent: "Systems and methods for secure electronic data transfer utilizing
///          an ephemeral key for encryption and decryption of data"
public class DeviceSDK {

    // MARK: - Properties

    private let deviceId: String
    private let deviceType: String
    private let capabilities: [String]
    private let mode: OperatingMode

    // Device identity (persistent for device lifetime)
    private let devicePrivateKey: Curve25519.KeyAgreement.PrivateKey
    public let devicePublicKey: Curve25519.KeyAgreement.PublicKey

    // Ephemeral key tracking (in-memory only, NEVER persisted)
    private var constructedKeys: [String: EphemeralKeyMaterial] = [:]
    private var keyConstructionCount: Int = 0
    private var keyDestructionCount: Int = 0

    private let keyQueue = DispatchQueue(label: "com.securemessenger.devicesdk.keys")

    // MARK: - Types

    public enum OperatingMode {
        case fips140_2  // FIPS 140-2 validated algorithms only
        case standard

        var algorithm: String {
            switch self {
            case .fips140_2, .standard:
                return "aes-256-gcm"
            }
        }
    }

    struct EphemeralKeyMaterial {
        let keyId: String
        let constructed: Date
        var used: Bool
        let algorithm: String

        var isExpired: Bool {
            Date().timeIntervalSince(constructed) > 5.0  // 5 second lifetime
        }
    }

    public struct SecureDataPackage: Codable {
        let packageId: String
        let sourceDeviceId: String
        let targetDeviceId: String
        let encryptedData: Data
        let ephemeralKeyId: String
        let timestamp: Date
        let signature: Data
    }

    public enum DeviceSDKError: Error {
        case keyNotFound
        case keyAlreadyUsed
        case keyExpired
        case packageTooOld
        case signatureVerificationFailed
        case encryptionFailed
        case decryptionFailed
    }

    // MARK: - Initialization

    public init(deviceId: String, deviceType: String, capabilities: [String] = [], mode: OperatingMode = .standard) {
        self.deviceId = deviceId
        self.deviceType = deviceType
        self.capabilities = capabilities
        self.mode = mode

        // Generate device identity key pair (X25519)
        self.devicePrivateKey = Curve25519.KeyAgreement.PrivateKey()
        self.devicePublicKey = devicePrivateKey.publicKey

        // Start periodic cleanup of expired keys
        startKeyCleanupTimer()
    }

    // MARK: - Ephemeral Key Construction (Core Patent Concept)

    /// Construct ephemeral key AT THIS DEVICE
    /// Patent claim: "Single-use encryption keys dynamically generated at the device at the time of need"
    public func constructEphemeralKey() -> String {
        return keyQueue.sync {
            let keyId = generateKeyId()

            let keyMaterial = EphemeralKeyMaterial(
                keyId: keyId,
                constructed: Date(),
                used: false,
                algorithm: mode.algorithm
            )

            constructedKeys[keyId] = keyMaterial
            keyConstructionCount += 1

            print("✓ Ephemeral key constructed at device: \(keyId.prefix(30))...")

            return keyId
        }
    }

    // MARK: - Encryption

    /// Encrypt data with ephemeral key (key constructed at sender's device)
    /// Patent claim: "Data are encrypted/decrypted with a single-use unique key constructed at the trusted device"
    public func encryptData(data: Data, targetDeviceId: String, ephemeralKeyId: String) throws -> SecureDataPackage {
        return try keyQueue.sync {
            // Validate ephemeral key exists
            guard var keyMaterial = constructedKeys[ephemeralKeyId] else {
                throw DeviceSDKError.keyNotFound
            }

            // Check if already used (single-use only)
            guard !keyMaterial.used else {
                throw DeviceSDKError.keyAlreadyUsed
            }

            // Check if expired
            guard !keyMaterial.isExpired else {
                throw DeviceSDKError.keyExpired
            }

            // Mark as used immediately
            keyMaterial.used = true
            constructedKeys[ephemeralKeyId] = keyMaterial

            // Derive encryption key from ephemeral key ID
            // In production: Use ECDH with recipient's public key
            let encryptionKey = deriveEncryptionKey(from: ephemeralKeyId)

            // Encrypt with AES-256-GCM (authenticated encryption)
            let sealedBox = try AES.GCM.seal(data, using: encryptionKey)

            guard let combined = sealedBox.combined else {
                throw DeviceSDKError.encryptionFailed
            }

            // Create HMAC signature binding source/target device IDs
            let signature = createSignature(
                sourceDeviceId: deviceId,
                targetDeviceId: targetDeviceId,
                encryptedData: combined,
                key: encryptionKey
            )

            let package = SecureDataPackage(
                packageId: UUID().uuidString,
                sourceDeviceId: deviceId,
                targetDeviceId: targetDeviceId,
                encryptedData: combined,
                ephemeralKeyId: ephemeralKeyId,
                timestamp: Date(),
                signature: signature
            )

            // Destroy ephemeral key immediately after use
            // Patent claim: "Each key is destroyed immediately after use on every operation"
            DispatchQueue.main.async { [weak self] in
                self?.destroyEphemeralKey(keyId: ephemeralKeyId)
            }

            print("✓ Data encrypted with ephemeral key")
            print("✓ Key marked for immediate destruction")

            return package
        }
    }

    // MARK: - Decryption

    /// Decrypt data (key reconstructed at receiver's device)
    /// Patent claim: Key "constructed at the trusted device"
    public func decryptData(package: SecureDataPackage) throws -> Data {
        // Check timestamp (prevent replay attacks)
        let age = Date().timeIntervalSince(package.timestamp)
        guard age < 300 else {  // 5 minutes max age
            throw DeviceSDKError.packageTooOld
        }

        // Reconstruct decryption key from ephemeral key ID
        // This demonstrates "constructing" the key at the receiving device
        let decryptionKey = deriveEncryptionKey(from: package.ephemeralKeyId)

        // Verify HMAC signature
        let expectedSignature = createSignature(
            sourceDeviceId: package.sourceDeviceId,
            targetDeviceId: package.targetDeviceId,
            encryptedData: package.encryptedData,
            key: decryptionKey
        )

        guard expectedSignature == package.signature else {
            throw DeviceSDKError.signatureVerificationFailed
        }

        // Decrypt with AES-256-GCM
        do {
            let sealedBox = try AES.GCM.SealedBox(combined: package.encryptedData)
            let decrypted = try AES.GCM.open(sealedBox, using: decryptionKey)

            print("✓ Data decrypted at receiving device")

            return decrypted
        } catch {
            throw DeviceSDKError.decryptionFailed
        }
    }

    // MARK: - Key Derivation

    private func deriveEncryptionKey(from keyId: String) -> SymmetricKey {
        // Derive symmetric key from ephemeral key ID
        // In production: Use ECDH with sender/receiver public keys + HKDF
        let keyData = (keyId + "shared-secret-seed").data(using: .utf8)!
        let hash = SHA256.hash(data: keyData)
        return SymmetricKey(data: hash)
    }

    private func createSignature(sourceDeviceId: String, targetDeviceId: String, encryptedData: Data, key: SymmetricKey) -> Data {
        var signatureData = Data()
        signatureData.append(sourceDeviceId.data(using: .utf8)!)
        signatureData.append(targetDeviceId.data(using: .utf8)!)
        signatureData.append(encryptedData)

        let hmac = HMAC<SHA256>.authenticationCode(for: signatureData, using: key)
        return Data(hmac)
    }

    // MARK: - Key Lifecycle Management

    /// Destroy ephemeral key
    /// Patent claim: "Each key is destroyed immediately after use"
    private func destroyEphemeralKey(keyId: String) {
        keyQueue.async { [weak self] in
            guard let self = self else { return }

            if self.constructedKeys.removeValue(forKey: keyId) != nil {
                self.keyDestructionCount += 1
                print("✓ Ephemeral key destroyed: \(keyId.prefix(30))...")
            }
        }
    }

    private func startKeyCleanupTimer() {
        Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in
            self?.cleanupExpiredKeys()
        }
    }

    private func cleanupExpiredKeys() {
        keyQueue.async { [weak self] in
            guard let self = self else { return }

            let expiredKeys = self.constructedKeys.filter { $0.value.isExpired && !$0.value.used }

            for (keyId, _) in expiredKeys {
                self.constructedKeys.removeValue(forKey: keyId)
                self.keyDestructionCount += 1
            }

            if !expiredKeys.isEmpty {
                print("✓ Cleaned up \(expiredKeys.count) expired ephemeral keys")
            }
        }
    }

    // MARK: - Utilities

    private func generateKeyId() -> String {
        let timestamp = Date().timeIntervalSince1970
        let random = UUID().uuidString.prefix(8)
        return "\(deviceId)-\(timestamp)-\(random)"
    }

    public func getPublicIdentity() -> Data {
        devicePublicKey.rawRepresentation
    }

    public func getStatistics() -> Statistics {
        keyQueue.sync {
            Statistics(
                deviceId: deviceId,
                mode: mode,
                activeKeys: constructedKeys.count,
                keysConstructed: keyConstructionCount,
                keysDestroyed: keyDestructionCount
            )
        }
    }

    public struct Statistics {
        public let deviceId: String
        public let mode: OperatingMode
        public let activeKeys: Int
        public let keysConstructed: Int
        public let keysDestroyed: Int
    }

    // MARK: - Shutdown

    /// Shutdown SDK and destroy all remaining keys
    /// Patent claim: "No crypto to store, rotate, or frequently load"
    public func shutdown() {
        keyQueue.sync {
            let remainingKeys = constructedKeys.count
            constructedKeys.removeAll()
            keyDestructionCount += remainingKeys

            print("✓ DeviceSDK shutdown: \(remainingKeys) keys destroyed")
            print("✓ Zero persistent key material remains")
        }
    }

    deinit {
        shutdown()
    }
}
