/**
 * Basic Usage Example - Signal + KnectIQ SelectiveTRUST® Integration
 *
 * Demonstrates the patented SelectiveTRUST® architecture:
 * - DASB (Device Access Service Broker) for trust management
 * - Trust Environments managing device relationships
 * - Device SDK for local ephemeral key construction
 * - Separation of trust management (control plane) and data encryption (data plane)
 */

import { SignalKnectIQIntegration, SignalDevice } from '../src/integration/SignalKnectIQIntegration';

async function basicExample() {
  console.log('=== Signal + KnectIQ SelectiveTRUST® Integration Example ===\n');
  console.log('Demonstrating KnectIQ\'s patented architecture:\n');

  // Step 1: Initialize Alice's device with SelectiveTRUST®
  console.log('1. Setting up Alice\'s device with SelectiveTRUST®...');
  const aliceDevice: SignalDevice = {
    deviceId: 'alice-mobile-001',
    phoneNumber: '+1-555-0101',
    deviceType: 'mobile',
    capabilities: []
  };

  const aliceIntegration = new SignalKnectIQIntegration(aliceDevice, {
    trustEnvironmentName: 'secure-chat',
    maxDevices: 100,
    sessionTimeout: 3600000, // 1 hour
    requiredTrustScore: 80,
    fipsMode: false
  });

  console.log('   ✓ DASB (Device Access Service Broker) initialized');
  console.log('   ✓ Trust Environment "secure-chat" created');
  console.log('   ✓ Device SDK provisioned for Alice\n');

  // Step 2: Initialize Bob's device
  console.log('2. Setting up Bob\'s device with SelectiveTRUST®...');
  const bobDevice: SignalDevice = {
    deviceId: 'bob-desktop-001',
    phoneNumber: '+1-555-0102',
    deviceType: 'desktop',
    capabilities: []
  };

  const bobIntegration = new SignalKnectIQIntegration(bobDevice, {
    trustEnvironmentName: 'secure-chat',
    maxDevices: 100,
    sessionTimeout: 3600000,
    requiredTrustScore: 80,
    fipsMode: false
  });

  console.log('   ✓ DASB initialized for Bob');
  console.log('   ✓ Device SDK provisioned for Bob\n');

  // Step 3: Establish trust relationships (bidirectional)
  console.log('3. Establishing trust relationships...');
  console.log('   (Trust managed by DASB, not data pathways)');

  await aliceIntegration.addTrustedContact(bobDevice);
  await bobIntegration.addTrustedContact(aliceDevice);

  console.log('   ✓ Trust relationship established');
  console.log('   ✓ Both devices provisioned in Trust Environment');
  console.log('   ✓ Real-time validation enabled\n');

  // Step 4: Send message with ephemeral encryption
  console.log('4. Alice sends message to Bob...');
  console.log('   Key Concept: Ephemeral key constructed AT ALICE\'S DEVICE');
  console.log('   (Not pre-generated or centrally managed)\n');

  const message = 'Hello Bob! This uses KnectIQ ephemeral encryption.';
  const securePackage = await aliceIntegration.sendMessage(bobDevice.deviceId, message);

  console.log('   ✓ Ephemeral key constructed at Alice\'s device');
  console.log(`   ✓ Key ID: ${securePackage.ephemeralKeyId.substring(0, 30)}...`);
  console.log('   ✓ Message encrypted locally at device');
  console.log('   ✓ Key destroyed immediately after encryption');
  console.log('   ✓ Encrypted data ready to travel via Signal pathways');
  console.log('   ✓ SelectiveTRUST does NOT touch the encrypted data\n');

  // Step 5: Receive and decrypt message
  console.log('5. Bob receives message from Alice...');
  console.log('   Decryption happens AT BOB\'S DEVICE\n');

  const receivedMessage = await bobIntegration.receiveMessage(securePackage);

  console.log('   ✓ Trust relationship validated in real-time');
  console.log('   ✓ Message decrypted at Bob\'s device');
  console.log(`   ✓ Content: "${receivedMessage.content}"\n`);

  // Step 6: Display security metrics
  console.log('6. Security Metrics:');
  const aliceMetrics = aliceIntegration.getSecurityMetrics();
  console.log('\n   Alice\'s Device:');
  console.log(`   - Device ID: ${aliceMetrics.localDevice?.deviceId}`);
  console.log(`   - Mode: ${aliceMetrics.localDevice?.mode}`);
  console.log(`   - Ephemeral keys constructed: ${aliceMetrics.localDevice?.keysConstructed}`);
  console.log(`   - Ephemeral keys destroyed: ${aliceMetrics.localDevice?.keysDestroyed}`);
  console.log(`   - Active keys: ${aliceMetrics.localDevice?.activeKeys}`);
  console.log(`   - Trusted contacts: ${aliceMetrics.trustedContacts}`);

  const bobMetrics = bobIntegration.getSecurityMetrics();
  console.log('\n   Bob\'s Device:');
  console.log(`   - Device ID: ${bobMetrics.localDevice?.deviceId}`);
  console.log(`   - Mode: ${bobMetrics.localDevice?.mode}`);
  console.log(`   - Ephemeral keys constructed: ${bobMetrics.localDevice?.keysConstructed}`);
  console.log(`   - Ephemeral keys destroyed: ${bobMetrics.localDevice?.keysDestroyed}`);
  console.log(`   - Active keys: ${bobMetrics.localDevice?.activeKeys}`);
  console.log(`   - Trusted contacts: ${bobMetrics.trustedContacts}\n`);

  // Step 7: Demonstrate trust validation
  console.log('7. Trust validation:');
  const isBobTrusted = aliceIntegration.validateContactTrust(bobDevice.deviceId);
  console.log(`   - Bob trusted by Alice: ${isBobTrusted}`);
  const isAliceTrusted = bobIntegration.validateContactTrust(aliceDevice.deviceId);
  console.log(`   - Alice trusted by Bob: ${isAliceTrusted}\n`);

  // Step 8: Cleanup
  console.log('8. Shutting down...');
  aliceIntegration.shutdown();
  bobIntegration.shutdown();
  console.log('   ✓ All ephemeral keys destroyed');
  console.log('   ✓ DASB shutdown');
  console.log('   ✓ Trust Environments terminated');
  console.log('   ✓ No persistent key material remains\n');

  console.log('=== Example Complete ===\n');
  console.log('Key Architecture Components Demonstrated:');
  console.log('✓ DASB (Device Access Service Broker) - Control plane');
  console.log('✓ Trust Environments - Manage device relationships');
  console.log('✓ Device SDK - Keys constructed at device');
  console.log('✓ Ephemeral keys - Single-use, immediately destroyed');
  console.log('✓ Separation of trust and data - SelectiveTRUST manages trust, not data');
  console.log('✓ No PKI dependency - Device-level trust');
  console.log('✓ Real-time validation - Every transaction validated');
}

// Run example
if (require.main === module) {
  basicExample().catch(console.error);
}

export { basicExample };
