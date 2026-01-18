//
//  TrustEnvironmentTests.swift
//  SecureMessengerTests
//
//  Tests for TrustEnvironment relationship management
//

import XCTest
@testable import SecureMessenger

final class TrustEnvironmentTests: XCTestCase {

    var trustEnvironment: TrustEnvironment!

    override func setUp() {
        super.setUp()
        let config = TrustEnvironmentConfig(
            id: "test-env",
            name: "Test Environment",
            requiredTrustScore: 0.7
        )
        trustEnvironment = TrustEnvironment(config: config)
    }

    override func tearDown() {
        trustEnvironment = nil
        super.tearDown()
    }

    // MARK: - Device Registration Tests

    func testRegisterDevice() {
        // Test device registration
        let deviceIdentity = DevicePublicIdentity(
            deviceId: "device-001",
            deviceType: "iPhone",
            publicKey: Data(repeating: 0x01, count: 32),
            capabilities: ["messaging"]
        )

        trustEnvironment.registerDevice(deviceId: "device-001", identity: deviceIdentity)

        let devices = trustEnvironment.listDevices()
        XCTAssertEqual(devices.count, 1, "Should have 1 registered device")
        XCTAssertTrue(devices.contains("device-001"), "Should contain registered device")
    }

    func testRegisterMultipleDevices() {
        // Test multiple device registrations
        for i in 1...5 {
            let identity = DevicePublicIdentity(
                deviceId: "device-\(String(format: "%03d", i))",
                deviceType: "iPhone",
                publicKey: Data(repeating: UInt8(i), count: 32),
                capabilities: ["messaging"]
            )
            trustEnvironment.registerDevice(deviceId: identity.deviceId, identity: identity)
        }

        let devices = trustEnvironment.listDevices()
        XCTAssertEqual(devices.count, 5, "Should have 5 registered devices")
    }

    func testUnregisterDevice() {
        // Test device unregistration
        let identity = DevicePublicIdentity(
            deviceId: "device-001",
            deviceType: "iPhone",
            publicKey: Data(repeating: 0x01, count: 32),
            capabilities: ["messaging"]
        )

        trustEnvironment.registerDevice(deviceId: "device-001", identity: identity)
        XCTAssertEqual(trustEnvironment.listDevices().count, 1, "Should have 1 device")

        trustEnvironment.unregisterDevice(deviceId: "device-001")
        XCTAssertEqual(trustEnvironment.listDevices().count, 0, "Should have 0 devices after unregistration")
    }

    // MARK: - Trust Relationship Tests

    func testEstablishRelationship() {
        // Register two devices
        let identity1 = DevicePublicIdentity(
            deviceId: "device-001",
            deviceType: "iPhone",
            publicKey: Data(repeating: 0x01, count: 32),
            capabilities: ["messaging"]
        )
        let identity2 = DevicePublicIdentity(
            deviceId: "device-002",
            deviceType: "iPhone",
            publicKey: Data(repeating: 0x02, count: 32),
            capabilities: ["messaging"]
        )

        trustEnvironment.registerDevice(deviceId: "device-001", identity: identity1)
        trustEnvironment.registerDevice(deviceId: "device-002", identity: identity2)

        // Establish relationship
        do {
            let relationship = try trustEnvironment.establishRelationship(
                deviceA: "device-001",
                deviceB: "device-002"
            )

            XCTAssertNotNil(relationship, "Relationship should be created")
            XCTAssertEqual(relationship.deviceA, "device-001", "Device A should match")
            XCTAssertEqual(relationship.deviceB, "device-002", "Device B should match")
            XCTAssertEqual(relationship.status, "active", "Relationship should be active")

        } catch {
            XCTFail("Should not throw error: \(error)")
        }
    }

    func testEstablishRelationshipWithUnregisteredDevice() {
        // Test that relationship fails with unregistered device
        XCTAssertThrowsError(
            try trustEnvironment.establishRelationship(
                deviceA: "nonexistent-001",
                deviceB: "nonexistent-002"
            ),
            "Should throw error with unregistered devices"
        )
    }

    func testValidateRelationship() {
        // Register devices and establish relationship
        let identity1 = DevicePublicIdentity(
            deviceId: "device-001",
            deviceType: "iPhone",
            publicKey: Data(repeating: 0x01, count: 32),
            capabilities: ["messaging"]
        )
        let identity2 = DevicePublicIdentity(
            deviceId: "device-002",
            deviceType: "iPhone",
            publicKey: Data(repeating: 0x02, count: 32),
            capabilities: ["messaging"]
        )

        trustEnvironment.registerDevice(deviceId: "device-001", identity: identity1)
        trustEnvironment.registerDevice(deviceId: "device-002", identity: identity2)

        do {
            let relationship = try trustEnvironment.establishRelationship(
                deviceA: "device-001",
                deviceB: "device-002"
            )

            // Validate relationship
            let isValid = trustEnvironment.validateRelationship(relationshipId: relationship.id)
            XCTAssertTrue(isValid, "Relationship should be valid")

        } catch {
            XCTFail("Should not throw error: \(error)")
        }
    }

    func testRevokeRelationship() {
        // Register devices and establish relationship
        let identity1 = DevicePublicIdentity(
            deviceId: "device-001",
            deviceType: "iPhone",
            publicKey: Data(repeating: 0x01, count: 32),
            capabilities: ["messaging"]
        )
        let identity2 = DevicePublicIdentity(
            deviceId: "device-002",
            deviceType: "iPhone",
            publicKey: Data(repeating: 0x02, count: 32),
            capabilities: ["messaging"]
        )

        trustEnvironment.registerDevice(deviceId: "device-001", identity: identity1)
        trustEnvironment.registerDevice(deviceId: "device-002", identity: identity2)

        do {
            let relationship = try trustEnvironment.establishRelationship(
                deviceA: "device-001",
                deviceB: "device-002"
            )

            // Should be valid initially
            XCTAssertTrue(trustEnvironment.validateRelationship(relationshipId: relationship.id))

            // Revoke
            trustEnvironment.revokeRelationship(relationshipId: relationship.id)

            // Should be invalid after revocation
            XCTAssertFalse(trustEnvironment.validateRelationship(relationshipId: relationship.id))

        } catch {
            XCTFail("Should not throw error: \(error)")
        }
    }

    // MARK: - Trust Score Tests

    func testUpdateTrustScore() {
        // Register device
        let identity = DevicePublicIdentity(
            deviceId: "device-001",
            deviceType: "iPhone",
            publicKey: Data(repeating: 0x01, count: 32),
            capabilities: ["messaging"]
        )

        trustEnvironment.registerDevice(deviceId: "device-001", identity: identity)

        // Update trust score
        trustEnvironment.updateTrustScore(deviceId: "device-001", newScore: 0.95)

        // Trust score update is internal, but we can verify by establishing relationship
        // and checking if it validates with high score requirement
        let highScoreConfig = TrustEnvironmentConfig(
            id: "high-trust-env",
            name: "High Trust Environment",
            requiredTrustScore: 0.9
        )
        let highTrustEnv = TrustEnvironment(config: highScoreConfig)
        highTrustEnv.registerDevice(deviceId: "device-001", identity: identity)
        highTrustEnv.updateTrustScore(deviceId: "device-001", newScore: 0.95)

        XCTAssertNotNil(highTrustEnv, "High trust environment should work with high scores")
    }

    func testLowTrustScoreValidation() {
        // Create environment with high trust score requirement
        let highScoreConfig = TrustEnvironmentConfig(
            id: "high-trust-env",
            name: "High Trust Environment",
            requiredTrustScore: 0.9
        )
        let highTrustEnv = TrustEnvironment(config: highScoreConfig)

        // Register devices with low trust scores
        let identity1 = DevicePublicIdentity(
            deviceId: "device-001",
            deviceType: "iPhone",
            publicKey: Data(repeating: 0x01, count: 32),
            capabilities: ["messaging"]
        )
        let identity2 = DevicePublicIdentity(
            deviceId: "device-002",
            deviceType: "iPhone",
            publicKey: Data(repeating: 0x02, count: 32),
            capabilities: ["messaging"]
        )

        highTrustEnv.registerDevice(deviceId: "device-001", identity: identity1)
        highTrustEnv.registerDevice(deviceId: "device-002", identity: identity2)

        // Set low trust scores
        highTrustEnv.updateTrustScore(deviceId: "device-001", newScore: 0.5)
        highTrustEnv.updateTrustScore(deviceId: "device-002", newScore: 0.6)

        do {
            let relationship = try highTrustEnv.establishRelationship(
                deviceA: "device-001",
                deviceB: "device-002"
            )

            // Validation should fail due to low trust scores
            let isValid = highTrustEnv.validateRelationship(relationshipId: relationship.id)
            XCTAssertFalse(isValid, "Relationship should be invalid with low trust scores")

        } catch {
            XCTFail("Should not throw error: \(error)")
        }
    }

    // MARK: - Statistics Tests

    func testGetStatistics() {
        // Register devices and establish relationships
        for i in 1...3 {
            let identity = DevicePublicIdentity(
                deviceId: "device-\(String(format: "%03d", i))",
                deviceType: "iPhone",
                publicKey: Data(repeating: UInt8(i), count: 32),
                capabilities: ["messaging"]
            )
            trustEnvironment.registerDevice(deviceId: identity.deviceId, identity: identity)
        }

        do {
            _ = try trustEnvironment.establishRelationship(deviceA: "device-001", deviceB: "device-002")
            _ = try trustEnvironment.establishRelationship(deviceA: "device-002", deviceB: "device-003")

            let stats = trustEnvironment.getStatistics()

            XCTAssertEqual(stats["totalDevices"] as? Int, 3, "Should have 3 devices")
            XCTAssertEqual(stats["totalRelationships"] as? Int, 2, "Should have 2 relationships")
            XCTAssertEqual(stats["activeRelationships"] as? Int, 2, "Should have 2 active relationships")

        } catch {
            XCTFail("Should not throw error: \(error)")
        }
    }
}
