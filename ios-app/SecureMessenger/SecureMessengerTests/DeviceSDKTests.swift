//
//  DeviceSDKTests.swift
//  SecureMessengerTests
//
//  Tests for DeviceSDK ephemeral key construction and encryption
//

import XCTest
@testable import SecureMessenger

final class DeviceSDKTests: XCTestCase {

    var deviceSDK: DeviceSDK!

    override func setUp() {
        super.setUp()
        let config = SecurityConfiguration(mode: .development)
        deviceSDK = DeviceSDK(
            deviceId: "test-device-001",
            deviceType: "iPhone",
            capabilities: ["messaging", "voice"],
            mode: config.mode
        )
    }

    override func tearDown() {
        deviceSDK = nil
        super.tearDown()
    }

    // MARK: - Ephemeral Key Construction Tests

    func testEphemeralKeyConstruction() {
        // Test that ephemeral keys are constructed at device
        let keyId = deviceSDK.constructEphemeralKey()

        XCTAssertFalse(keyId.isEmpty, "Key ID should not be empty")
        XCTAssertTrue(keyId.hasPrefix("eph_"), "Key ID should have ephemeral prefix")
        XCTAssertEqual(deviceSDK.getKeyConstructionCount(), 1, "Should have constructed 1 key")
    }

    func testMultipleKeyConstruction() {
        // Test that multiple unique keys can be constructed
        let key1 = deviceSDK.constructEphemeralKey()
        let key2 = deviceSDK.constructEphemeralKey()
        let key3 = deviceSDK.constructEphemeralKey()

        XCTAssertNotEqual(key1, key2, "Keys should be unique")
        XCTAssertNotEqual(key2, key3, "Keys should be unique")
        XCTAssertNotEqual(key1, key3, "Keys should be unique")
        XCTAssertEqual(deviceSDK.getKeyConstructionCount(), 3, "Should have constructed 3 keys")
    }

    func testKeyDestructionAfterUse() {
        // Test that keys are destroyed after encryption
        let keyId = deviceSDK.constructEphemeralKey()
        let testData = "Hello, World!".data(using: .utf8)!

        do {
            _ = try deviceSDK.encryptData(
                data: testData,
                targetDeviceId: "recipient-001",
                ephemeralKeyId: keyId
            )

            // Wait a moment for async destruction
            let expectation = XCTestExpectation(description: "Key destruction")
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                expectation.fulfill()
            }
            wait(for: [expectation], timeout: 1.0)

            // Key should be destroyed
            XCTAssertEqual(deviceSDK.getKeyDestructionCount(), 1, "Key should be destroyed after use")

        } catch {
            XCTFail("Encryption should not fail: \(error)")
        }
    }

    func testKeyAutoDestructionOnTimeout() {
        // Test that unused keys are destroyed after timeout
        _ = deviceSDK.constructEphemeralKey()

        // Wait for auto-destruction (5 seconds + margin)
        let expectation = XCTestExpectation(description: "Key auto-destruction")
        DispatchQueue.main.asyncAfter(deadline: .now() + 5.5) {
            expectation.fulfill()
        }
        wait(for: [expectation], timeout: 6.0)

        XCTAssertEqual(deviceSDK.getKeyDestructionCount(), 1, "Unused key should auto-destruct")
    }

    // MARK: - Encryption Tests

    func testEncryptData() {
        // Test basic encryption
        let keyId = deviceSDK.constructEphemeralKey()
        let testData = "Secret message".data(using: .utf8)!

        do {
            let package = try deviceSDK.encryptData(
                data: testData,
                targetDeviceId: "recipient-001",
                ephemeralKeyId: keyId
            )

            XCTAssertFalse(package.encryptedData.isEmpty, "Encrypted data should not be empty")
            XCTAssertFalse(package.nonce.isEmpty, "Nonce should not be empty")
            XCTAssertFalse(package.authTag.isEmpty, "Auth tag should not be empty")
            XCTAssertEqual(package.sourceDeviceId, "test-device-001", "Source device ID should match")
            XCTAssertEqual(package.targetDeviceId, "recipient-001", "Target device ID should match")

        } catch {
            XCTFail("Encryption should not fail: \(error)")
        }
    }

    func testEncryptDecryptRoundTrip() {
        // Test that encryption and decryption work together
        let originalData = "Round trip test message".data(using: .utf8)!
        let keyId = deviceSDK.constructEphemeralKey()

        // Create recipient SDK
        let recipientSDK = DeviceSDK(
            deviceId: "recipient-001",
            deviceType: "iPhone",
            capabilities: ["messaging"],
            mode: .development
        )

        do {
            // Encrypt
            let package = try deviceSDK.encryptData(
                data: originalData,
                targetDeviceId: "recipient-001",
                ephemeralKeyId: keyId
            )

            // Decrypt (recipient would use same ephemeral key ID)
            let decryptedData = try recipientSDK.decryptData(package: package)

            XCTAssertEqual(originalData, decryptedData, "Decrypted data should match original")

            let decryptedString = String(data: decryptedData, encoding: .utf8)
            XCTAssertEqual(decryptedString, "Round trip test message", "Decrypted message should match")

        } catch {
            XCTFail("Round trip should not fail: \(error)")
        }
    }

    func testEncryptionWithInvalidKey() {
        // Test that encryption fails with invalid key ID
        let testData = "Test message".data(using: .utf8)!

        XCTAssertThrowsError(
            try deviceSDK.encryptData(
                data: testData,
                targetDeviceId: "recipient-001",
                ephemeralKeyId: "invalid-key-id"
            ),
            "Should throw error with invalid key ID"
        )
    }

    func testEncryptionWithUsedKey() {
        // Test that keys cannot be reused
        let keyId = deviceSDK.constructEphemeralKey()
        let testData = "Test message".data(using: .utf8)!

        do {
            // First use - should succeed
            _ = try deviceSDK.encryptData(
                data: testData,
                targetDeviceId: "recipient-001",
                ephemeralKeyId: keyId
            )

            // Wait for key destruction
            let expectation = XCTestExpectation(description: "Key destruction")
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                expectation.fulfill()
            }
            wait(for: [expectation], timeout: 1.0)

            // Second use - should fail (key destroyed)
            XCTAssertThrowsError(
                try deviceSDK.encryptData(
                    data: testData,
                    targetDeviceId: "recipient-001",
                    ephemeralKeyId: keyId
                ),
                "Should throw error when reusing destroyed key"
            )

        } catch {
            XCTFail("First encryption should succeed: \(error)")
        }
    }

    // MARK: - Statistics Tests

    func testKeyStatistics() {
        // Test that statistics are tracked correctly
        let stats = deviceSDK.getKeyStatistics()

        XCTAssertEqual(stats["constructed"] as? Int, 0, "Should start with 0 constructed keys")
        XCTAssertEqual(stats["destroyed"] as? Int, 0, "Should start with 0 destroyed keys")

        // Construct some keys
        let key1 = deviceSDK.constructEphemeralKey()
        let key2 = deviceSDK.constructEphemeralKey()

        let statsAfterConstruction = deviceSDK.getKeyStatistics()
        XCTAssertEqual(statsAfterConstruction["constructed"] as? Int, 2, "Should have 2 constructed keys")

        // Use one key
        let testData = "Test".data(using: .utf8)!
        do {
            _ = try deviceSDK.encryptData(
                data: testData,
                targetDeviceId: "recipient-001",
                ephemeralKeyId: key1
            )

            // Wait for destruction
            let expectation = XCTestExpectation(description: "Key destruction")
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                expectation.fulfill()
            }
            wait(for: [expectation], timeout: 1.0)

            let statsAfterUse = deviceSDK.getKeyStatistics()
            XCTAssertEqual(statsAfterUse["destroyed"] as? Int, 1, "Should have 1 destroyed key")

        } catch {
            XCTFail("Encryption should not fail: \(error)")
        }
    }

    // MARK: - FIPS Mode Tests

    func testFIPSMode() {
        // Test FIPS 140-2 mode configuration
        let fipsConfig = SecurityConfiguration(mode: .fips1402)
        let fipsSDK = DeviceSDK(
            deviceId: "fips-device",
            deviceType: "iPhone",
            capabilities: ["messaging"],
            mode: fipsConfig.mode
        )

        XCTAssertNotNil(fipsSDK, "FIPS mode SDK should initialize")

        // Test encryption in FIPS mode
        let keyId = fipsSDK.constructEphemeralKey()
        let testData = "FIPS test".data(using: .utf8)!

        do {
            let package = try fipsSDK.encryptData(
                data: testData,
                targetDeviceId: "recipient-001",
                ephemeralKeyId: keyId
            )

            XCTAssertEqual(package.algorithm, "aes-256-gcm", "FIPS mode should use AES-256-GCM")

        } catch {
            XCTFail("FIPS encryption should not fail: \(error)")
        }
    }

    // MARK: - Performance Tests

    func testKeyConstructionPerformance() {
        // Test that key construction is fast
        measure {
            for _ in 0..<100 {
                _ = deviceSDK.constructEphemeralKey()
            }
        }
    }

    func testEncryptionPerformance() {
        // Test encryption performance
        let testData = String(repeating: "A", count: 1024).data(using: .utf8)! // 1KB

        measure {
            for _ in 0..<50 {
                let keyId = deviceSDK.constructEphemeralKey()
                _ = try? deviceSDK.encryptData(
                    data: testData,
                    targetDeviceId: "recipient-001",
                    ephemeralKeyId: keyId
                )
            }
        }
    }
}
