//
//  DeviceAccessServiceBroker.swift
//  SecureMessenger - KnectIQ SelectiveTRUST® Integration
//
//  DASB: Control plane software that manages Trust Environments
//  Patent-based: Manages trust, NOT data encryption
//

import Foundation

/// Device Access Service Broker (DASB)
/// Core control plane component from KnectIQ's patented architecture
/// "Control plane software that manages one or more Trust Environments"
public class DeviceAccessServiceBroker {

    // MARK: - Properties

    private let dasbId: String
    private let mode: DeviceSDK.OperatingMode
    private let maxTrustEnvironments: Int
    private let auditLogging: Bool

    private var trustEnvironments: [String: TrustEnvironment] = [:]
    private var provisionedDevices: [String: DeviceSDK] = [:]
    private var trustRelationships: [String: TrustRelationship] = [:]
    private var auditLog: [AuditEntry] = []

    private let queue = DispatchQueue(label: "com.securemessenger.dasb")

    // MARK: - Types

    public struct Config {
        let dasbId: String
        let mode: DeviceSDK.OperatingMode
        let maxTrustEnvironments: Int
        let auditLogging: Bool

        public init(dasbId: String, mode: DeviceSDK.OperatingMode = .standard,
                   maxTrustEnvironments: Int = 10, auditLogging: Bool = true) {
            self.dasbId = dasbId
            self.mode = mode
            self.maxTrustEnvironments = maxTrustEnvironments
            self.auditLogging = auditLogging
        }
    }

    public struct DeviceProvisionRequest {
        let deviceId: String
        let deviceType: String
        let trustEnvironmentId: String
        let capabilities: [String]
    }

    public struct TrustRelationship {
        let relationshipId: String
        let deviceA: String
        let deviceB: String
        let trustEnvironmentId: String
        let established: Date
        var validated: Bool
        var trustScore: Int
    }

    struct AuditEntry {
        let timestamp: Date
        let event: String
        let details: [String: Any]
    }

    // MARK: - Initialization

    public init(config: Config) {
        self.dasbId = config.dasbId
        self.mode = config.mode
        self.maxTrustEnvironments = config.maxTrustEnvironments
        self.auditLogging = config.auditLogging

        logAudit(event: "dasb_initialized", details: ["dasbId": dasbId, "mode": "\(mode)"])
    }

    // MARK: - Trust Environment Management

    /// Create a new Trust Environment
    /// Patent: "Trust Environments manage collections of trust relationships"
    @discardableResult
    public func createTrustEnvironment(environmentId: String, config: TrustEnvironment.Config) throws -> TrustEnvironment {
        try queue.sync {
            guard trustEnvironments.count < maxTrustEnvironments else {
                throw DASBError.maxTrustEnvironmentsReached
            }

            guard trustEnvironments[environmentId] == nil else {
                throw DASBError.trustEnvironmentAlreadyExists
            }

            let trustEnv = TrustEnvironment(environmentId: environmentId, config: config, mode: mode)
            trustEnvironments[environmentId] = trustEnv

            logAudit(event: "trust_environment_created", details: ["environmentId": environmentId])

            return trustEnv
        }
    }

    public func getTrustEnvironment(environmentId: String) -> TrustEnvironment? {
        queue.sync {
            trustEnvironments[environmentId]
        }
    }

    // MARK: - Device Provisioning

    /// Provision a device into a Trust Environment
    /// Patent: "Once provisioned, the device uses the KnectIQ SDK"
    public func provisionDevice(request: DeviceProvisionRequest) throws -> DeviceSDK {
        try queue.sync {
            guard let trustEnv = trustEnvironments[request.trustEnvironmentId] else {
                throw DASBError.trustEnvironmentNotFound
            }

            guard provisionedDevices[request.deviceId] == nil else {
                throw DASBError.deviceAlreadyProvisioned
            }

            // Create SDK instance for the device
            let deviceSDK = DeviceSDK(
                deviceId: request.deviceId,
                deviceType: request.deviceType,
                capabilities: request.capabilities,
                mode: mode
            )

            // Register device with trust environment
            try trustEnv.registerDevice(
                deviceId: request.deviceId,
                publicIdentity: deviceSDK.getPublicIdentity()
            )

            // Store provisioned device
            provisionedDevices[request.deviceId] = deviceSDK

            logAudit(event: "device_provisioned", details: [
                "deviceId": request.deviceId,
                "trustEnvironmentId": request.trustEnvironmentId
            ])

            return deviceSDK
        }
    }

    public func getDeviceSDK(deviceId: String) -> DeviceSDK? {
        queue.sync {
            provisionedDevices[deviceId]
        }
    }

    // MARK: - Trust Relationship Management

    /// Establish trust relationship between two devices
    /// Note: DASB manages relationship metadata, NOT encryption keys
    /// Patent: "The DASB manages the relationship metadata, while actual encryption keys are constructed at the devices"
    public func establishTrustRelationship(deviceIdA: String, deviceIdB: String, trustEnvironmentId: String) throws -> TrustRelationship {
        try queue.sync {
            guard let trustEnv = trustEnvironments[trustEnvironmentId] else {
                throw DASBError.trustEnvironmentNotFound
            }

            guard provisionedDevices[deviceIdA] != nil && provisionedDevices[deviceIdB] != nil else {
                throw DASBError.deviceNotProvisioned
            }

            guard trustEnv.hasDevice(deviceId: deviceIdA) && trustEnv.hasDevice(deviceId: deviceIdB) else {
                throw DASBError.deviceNotInEnvironment
            }

            // Create trust relationship
            let relationshipId = UUID().uuidString
            let relationship = TrustRelationship(
                relationshipId: relationshipId,
                deviceA: deviceIdA,
                deviceB: deviceIdB,
                trustEnvironmentId: trustEnvironmentId,
                established: Date(),
                validated: true,
                trustScore: 100
            )

            trustRelationships[relationshipId] = relationship

            // Notify trust environment
            try trustEnv.establishRelationship(
                deviceIdA: deviceIdA,
                deviceIdB: deviceIdB,
                relationshipId: relationshipId
            )

            logAudit(event: "trust_relationship_established", details: [
                "relationshipId": relationshipId,
                "deviceA": deviceIdA,
                "deviceB": deviceIdB,
                "trustEnvironmentId": trustEnvironmentId
            ])

            return relationship
        }
    }

    /// Validate trust relationship in real-time
    /// Patent claim: "Real-time validation for every communication/transaction"
    public func validateTrustRelationship(relationshipId: String) -> Bool {
        queue.sync {
            guard let relationship = trustRelationships[relationshipId],
                  let trustEnv = trustEnvironments[relationship.trustEnvironmentId] else {
                return false
            }

            let valid = trustEnv.validateRelationship(relationshipId: relationshipId)

            if !valid {
                trustRelationships[relationshipId]?.validated = false
            }

            logAudit(event: "trust_relationship_validated", details: [
                "relationshipId": relationshipId,
                "valid": valid
            ])

            return valid
        }
    }

    public func revokeTrustRelationship(relationshipId: String) {
        queue.sync {
            guard let relationship = trustRelationships[relationshipId],
                  let trustEnv = trustEnvironments[relationship.trustEnvironmentId] else {
                return
            }

            trustEnv.revokeRelationship(relationshipId: relationshipId)
            trustRelationships.removeValue(forKey: relationshipId)

            logAudit(event: "trust_relationship_revoked", details: ["relationshipId": relationshipId])
        }
    }

    // MARK: - Device Deprovisioning

    public func deprovisionDevice(deviceId: String) {
        queue.sync {
            guard let device = provisionedDevices[deviceId] else {
                return
            }

            // Revoke all relationships involving this device
            let deviceRelationships = trustRelationships.filter {
                $0.value.deviceA == deviceId || $0.value.deviceB == deviceId
            }

            for (relationshipId, _) in deviceRelationships {
                revokeTrustRelationship(relationshipId: relationshipId)
            }

            // Remove from trust environments
            for trustEnv in trustEnvironments.values {
                trustEnv.unregisterDevice(deviceId: deviceId)
            }

            // Shutdown device SDK
            device.shutdown()

            // Remove from provisioned devices
            provisionedDevices.removeValue(forKey: deviceId)

            logAudit(event: "device_deprovisioned", details: ["deviceId": deviceId])
        }
    }

    // MARK: - Statistics

    public func getStatistics() -> Statistics {
        queue.sync {
            Statistics(
                trustEnvironments: trustEnvironments.count,
                provisionedDevices: provisionedDevices.count,
                trustRelationships: trustRelationships.count,
                mode: mode
            )
        }
    }

    public struct Statistics {
        public let trustEnvironments: Int
        public let provisionedDevices: Int
        public let trustRelationships: Int
        public let mode: DeviceSDK.OperatingMode
    }

    // MARK: - Audit Logging

    private func logAudit(event: String, details: [String: Any]) {
        guard auditLogging else { return }

        let entry = AuditEntry(
            timestamp: Date(),
            event: event,
            details: details
        )

        auditLog.append(entry)

        // Keep only last 1000 entries
        if auditLog.count > 1000 {
            auditLog.removeFirst()
        }
    }

    public func getAuditLog() -> [(timestamp: Date, event: String, details: [String: Any])] {
        queue.sync {
            auditLog.map { (timestamp: $0.timestamp, event: $0.event, details: $0.details) }
        }
    }

    // MARK: - Shutdown

    public func shutdown() {
        queue.sync {
            // Deprovision all devices
            for deviceId in provisionedDevices.keys {
                deprovisionDevice(deviceId: deviceId)
            }

            // Shutdown all trust environments
            for trustEnv in trustEnvironments.values {
                trustEnv.shutdown()
            }

            trustEnvironments.removeAll()
            trustRelationships.removeAll()

            logAudit(event: "dasb_shutdown", details: ["dasbId": dasbId])
        }
    }

    // MARK: - Errors

    public enum DASBError: Error {
        case maxTrustEnvironmentsReached
        case trustEnvironmentAlreadyExists
        case trustEnvironmentNotFound
        case deviceAlreadyProvisioned
        case deviceNotProvisioned
        case deviceNotInEnvironment
    }
}
