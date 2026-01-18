//
//  TrustEnvironment.swift
//  SecureMessenger - KnectIQ SelectiveTRUST® Integration
//
//  Manages collections of trust relationships between provisioned devices
//  Patent-based: Device-level trust without PKI dependency
//

import Foundation

public class TrustEnvironment {

    // MARK: - Properties

    private let environmentId: String
    private var config: Config
    private let mode: DeviceSDK.OperatingMode

    private var devices: [String: DeviceIdentity] = [:]
    private var relationships: [String: RelationshipMetadata] = [:]

    private let queue = DispatchQueue(label: "com.securemessenger.trustenv")

    // MARK: - Types

    public struct Config {
        let name: String
        let maxDevices: Int
        let sessionTimeout: TimeInterval
        let requiredTrustScore: Int
        var allowedOperations: Set<String>

        public init(name: String, maxDevices: Int = 100, sessionTimeout: TimeInterval = 3600,
                    requiredTrustScore: Int = 80, allowedOperations: Set<String> = ["send", "receive", "read"]) {
            self.name = name
            self.maxDevices = maxDevices
            self.sessionTimeout = sessionTimeout
            self.requiredTrustScore = requiredTrustScore
            self.allowedOperations = allowedOperations
        }
    }

    public struct DeviceIdentity {
        let deviceId: String
        let publicIdentity: Data
        let capabilities: [String]
        let registered: Date
        var lastSeen: Date
        var trustScore: Int
    }

    public struct RelationshipMetadata {
        let relationshipId: String
        let deviceA: String
        let deviceB: String
        let established: Date
        var lastValidated: Date
        var active: Bool
    }

    // MARK: - Initialization

    public init(environmentId: String, config: Config, mode: DeviceSDK.OperatingMode = .standard) {
        self.environmentId = environmentId
        self.config = config
        self.mode = mode
    }

    // MARK: - Device Registration

    public func registerDevice(deviceId: String, publicIdentity: Data, capabilities: [String] = []) throws {
        try queue.sync {
            guard devices.count < config.maxDevices else {
                throw TrustEnvironmentError.maxDevicesReached
            }

            guard devices[deviceId] == nil else {
                throw TrustEnvironmentError.deviceAlreadyRegistered
            }

            let identity = DeviceIdentity(
                deviceId: deviceId,
                publicIdentity: publicIdentity,
                capabilities: capabilities,
                registered: Date(),
                lastSeen: Date(),
                trustScore: 100  // Initial perfect trust score
            )

            devices[deviceId] = identity
        }
    }

    public func unregisterDevice(deviceId: String) {
        queue.sync {
            // Remove all relationships involving this device
            let deviceRelationships = relationships.filter {
                $0.value.deviceA == deviceId || $0.value.deviceB == deviceId
            }

            for (relationshipId, _) in deviceRelationships {
                relationships.removeValue(forKey: relationshipId)
            }

            devices.removeValue(forKey: deviceId)
        }
    }

    public func hasDevice(deviceId: String) -> Bool {
        queue.sync {
            devices[deviceId] != nil
        }
    }

    public func getDevice(deviceId: String) -> DeviceIdentity? {
        queue.sync {
            devices[deviceId]
        }
    }

    // MARK: - Relationship Management

    public func establishRelationship(deviceIdA: String, deviceIdB: String, relationshipId: String) throws {
        try queue.sync {
            guard devices[deviceIdA] != nil && devices[deviceIdB] != nil else {
                throw TrustEnvironmentError.deviceNotFound
            }

            guard deviceIdA != deviceIdB else {
                throw TrustEnvironmentError.cannotEstablishSelfRelationship
            }

            let metadata = RelationshipMetadata(
                relationshipId: relationshipId,
                deviceA: deviceIdA,
                deviceB: deviceIdB,
                established: Date(),
                lastValidated: Date(),
                active: true
            )

            relationships[relationshipId] = metadata
        }
    }

    /// Real-time trust validation
    /// Patent claim: "Real-time validation for every communication/transaction"
    public func validateRelationship(relationshipId: String) -> Bool {
        queue.sync {
            guard var relationship = relationships[relationshipId],
                  relationship.active else {
                return false
            }

            // Check if devices still exist
            guard let deviceA = devices[relationship.deviceA],
                  let deviceB = devices[relationship.deviceB] else {
                relationship.active = false
                relationships[relationshipId] = relationship
                return false
            }

            // Check trust scores meet requirements
            guard deviceA.trustScore >= config.requiredTrustScore &&
                  deviceB.trustScore >= config.requiredTrustScore else {
                return false
            }

            // Update validation timestamp
            relationship.lastValidated = Date()
            relationships[relationshipId] = relationship

            // Update device last seen
            devices[relationship.deviceA]?.lastSeen = Date()
            devices[relationship.deviceB]?.lastSeen = Date()

            return true
        }
    }

    public func revokeRelationship(relationshipId: String) {
        queue.sync {
            if var relationship = relationships[relationshipId] {
                relationship.active = false
                relationships[relationshipId] = relationship
            }
            relationships.removeValue(forKey: relationshipId)
        }
    }

    public func getDeviceRelationships(deviceId: String) -> [RelationshipMetadata] {
        queue.sync {
            relationships.values.filter {
                ($0.deviceA == deviceId || $0.deviceB == deviceId) && $0.active
            }
        }
    }

    // MARK: - Trust Score Management

    public func updateDeviceTrustScore(deviceId: String, newScore: Int) {
        queue.sync {
            guard var device = devices[deviceId] else { return }

            device.trustScore = max(0, min(100, newScore))
            devices[deviceId] = device

            // If trust score falls below threshold, deactivate relationships
            if device.trustScore < config.requiredTrustScore {
                for (relationshipId, var relationship) in relationships {
                    if relationship.deviceA == deviceId || relationship.deviceB == deviceId {
                        relationship.active = false
                        relationships[relationshipId] = relationship
                    }
                }
            }
        }
    }

    // MARK: - Operations

    public func validateOperation(operation: String) -> Bool {
        config.allowedOperations.contains(operation)
    }

    // MARK: - Statistics

    public func getStatistics() -> Statistics {
        queue.sync {
            Statistics(
                environmentId: environmentId,
                devices: devices.count,
                relationships: relationships.count,
                mode: mode
            )
        }
    }

    public struct Statistics {
        public let environmentId: String
        public let devices: Int
        public let relationships: Int
        public let mode: DeviceSDK.OperatingMode
    }

    public func getConfig() -> Config {
        config
    }

    // MARK: - Shutdown

    public func shutdown() {
        queue.sync {
            // Revoke all relationships
            for relationshipId in relationships.keys {
                revokeRelationship(relationshipId: relationshipId)
            }

            devices.removeAll()
        }
    }

    // MARK: - Errors

    public enum TrustEnvironmentError: Error {
        case maxDevicesReached
        case deviceAlreadyRegistered
        case deviceNotFound
        case cannotEstablishSelfRelationship
    }
}
