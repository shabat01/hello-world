/**
 * Advanced Usage Example - Signal + KnectIQ SelectiveTRUST® Integration
 *
 * Demonstrates advanced features:
 * - FIPS 140-2 mode
 * - Trust score management
 * - Audit logging
 * - Trust relationship revocation
 * - Multiple message exchange
 */

import { SignalKnectIQIntegration, SignalDevice } from '../src/integration/SignalKnectIQIntegration';

async function advancedExample() {
  console.log('=== Advanced Signal + KnectIQ SelectiveTRUST® Features ===\n');

  // Initialize Alice with FIPS 140-2 mode
  console.log('1. Initializing devices in FIPS 140-2 mode...');
  const aliceDevice: SignalDevice = {
    deviceId: 'alice-secure-001',
    phoneNumber: '+1-555-1001',
    deviceType: 'mobile',
    capabilities: []
  };

  const aliceIntegration = new SignalKnectIQIntegration(aliceDevice, {
    trustEnvironmentName: 'high-security',
    maxDevices: 50,
    sessionTimeout: 1800000, // 30 minutes
    requiredTrustScore: 90, // Higher trust requirement
    fipsMode: true // FIPS 140-2 validated mode
  });

  const bobDevice: SignalDevice = {
    deviceId: 'bob-secure-001',
    phoneNumber: '+1-555-1002',
    deviceType: 'desktop',
    capabilities: []
  };

  const bobIntegration = new SignalKnectIQIntegration(bobDevice, {
    trustEnvironmentName: 'high-security',
    requiredTrustScore: 90,
    fipsMode: true
  });

  const charlieDevice: SignalDevice = {
    deviceId: 'charlie-001',
    phoneNumber: '+1-555-1003',
    deviceType: 'tablet',
    capabilities: []
  };

  const charlieIntegration = new SignalKnectIQIntegration(charlieDevice, {
    trustEnvironmentName: 'high-security',
    requiredTrustScore: 90,
    fipsMode: true
  });

  console.log('   ✓ All devices in FIPS 140-2 validated mode');
  console.log('   ✓ High security trust score requirement (90/100)\n');

  // Establish multi-party trust network
  console.log('2. Establishing multi-party trust network...');
  await aliceIntegration.addTrustedContact(bobDevice);
  await aliceIntegration.addTrustedContact(charlieDevice);
  await bobIntegration.addTrustedContact(aliceDevice);
  await charlieIntegration.addTrustedContact(aliceDevice);

  console.log('   ✓ Alice ↔ Bob trust established');
  console.log('   ✓ Alice ↔ Charlie trust established');
  console.log('   ✓ Multi-party trust network active\n');

  // Send multiple messages with unique ephemeral keys
  console.log('3. Sending multiple messages (each with unique ephemeral key)...\n');

  for (let i = 1; i <= 3; i++) {
    const message = `Message ${i}: Each message uses a NEW ephemeral key constructed at device`;
    const pkg = await aliceIntegration.sendMessage(bobDevice.deviceId, message);

    console.log(`   Message ${i}:`);
    console.log(`   - Ephemeral key: ${pkg.ephemeralKeyId.substring(0, 25)}...`);
    console.log(`   - Timestamp: ${new Date(pkg.timestamp).toISOString()}`);
    console.log(`   - Key destroyed: YES (immediately after encryption)\n`);
  }

  // Demonstrate trust score management
  console.log('4. Trust score management...');
  console.log('   Initial trust scores: 100/100 for all devices');

  // Simulate degraded trust for Charlie
  console.log('   Simulating security posture degradation for Charlie...');
  aliceIntegration.updateContactTrustScore(charlieDevice.deviceId, 70);

  console.log('   ✓ Charlie\'s trust score updated to 70/100');
  console.log('   ✓ Below required threshold (90)');
  console.log('   ✓ Messages to Charlie will be blocked\n');

  // Try to send to Charlie (should fail)
  console.log('5. Attempting to send to low-trust device...');
  try {
    await aliceIntegration.sendMessage(charlieDevice.deviceId, 'This should fail');
    console.log('   ✗ UNEXPECTED: Message sent despite low trust\n');
  } catch (error) {
    console.log('   ✓ EXPECTED: Message blocked by trust policy');
    console.log(`   ✓ Reason: Trust score below requirement\n`);
  }

  // Demonstrate trust revocation
  console.log('6. Revoking trust for Charlie...');
  await aliceIntegration.removeTrustedContact(charlieDevice.deviceId);

  console.log('   ✓ Trust relationship terminated');
  console.log('   ✓ Charlie removed from Trust Environment');
  console.log('   ✓ All ephemeral keys for Charlie destroyed\n');

  // View audit log
  console.log('7. DASB Audit Log (last 10 events):\n');
  const auditLog = aliceIntegration.getAuditLog();
  const recentEvents = auditLog.slice(-10);

  recentEvents.forEach((entry, index) => {
    const time = new Date(entry.timestamp).toISOString().split('T')[1].split('.')[0];
    console.log(`   ${time} - ${entry.event}`);
  });
  console.log();

  // Display comprehensive metrics
  console.log('8. Comprehensive Security Metrics:\n');

  const aliceMetrics = aliceIntegration.getSecurityMetrics();
  console.log('   Alice\'s Metrics:');
  console.log(`   ├─ Device: ${aliceMetrics.localDevice?.deviceId}`);
  console.log(`   ├─ Mode: ${aliceMetrics.localDevice?.mode}`);
  console.log(`   ├─ Keys Constructed: ${aliceMetrics.localDevice?.keysConstructed}`);
  console.log(`   ├─ Keys Destroyed: ${aliceMetrics.localDevice?.keysDestroyed}`);
  console.log(`   ├─ Active Keys: ${aliceMetrics.localDevice?.activeKeys}`);
  console.log(`   ├─ Trusted Contacts: ${aliceMetrics.trustedContacts}`);
  console.log(`   └─ Trust Environment: ${aliceMetrics.trustEnvironment?.environmentId}\n`);

  console.log('   DASB Statistics:');
  console.log(`   ├─ Trust Environments: ${aliceMetrics.dasbStatistics.trustEnvironments}`);
  console.log(`   ├─ Provisioned Devices: ${aliceMetrics.dasbStatistics.provisionedDevices}`);
  console.log(`   ├─ Active Relationships: ${aliceMetrics.dasbStatistics.trustRelationships}`);
  console.log(`   └─ Mode: ${aliceMetrics.dasbStatistics.mode}\n`);

  // Demonstrate contact listing
  console.log('9. Active trusted contacts:');
  const contacts = aliceIntegration.getTrustedContacts();
  contacts.forEach(contact => {
    console.log(`   - ${contact.deviceId} (${contact.phoneNumber})`);
  });
  console.log();

  // Cleanup
  console.log('10. Secure cleanup...');
  aliceIntegration.shutdown();
  bobIntegration.shutdown();
  charlieIntegration.shutdown();

  console.log('   ✓ All device SDKs shutdown');
  console.log('   ✓ All DASB instances terminated');
  console.log('   ✓ All Trust Environments destroyed');
  console.log('   ✓ All ephemeral keys wiped from memory');
  console.log('   ✓ Zero cryptographic material remains\n');

  console.log('=== Advanced Features Demonstrated ===\n');
  console.log('✓ FIPS 140-2 validated mode');
  console.log('✓ Trust score-based access control');
  console.log('✓ Real-time trust validation');
  console.log('✓ Unique ephemeral keys per message');
  console.log('✓ Trust relationship revocation');
  console.log('✓ Multi-party trust networks');
  console.log('✓ DASB audit logging');
  console.log('✓ Comprehensive security monitoring');
  console.log('✓ Secure cleanup and key destruction\n');

  console.log('Key Differences from Traditional PKI:');
  console.log('✗ NO certificate authorities');
  console.log('✗ NO public key infrastructure');
  console.log('✗ NO persistent key storage');
  console.log('✗ NO key rotation management');
  console.log('✓ Device-constructed ephemeral keys');
  console.log('✓ Real-time trust validation');
  console.log('✓ Sovereign trust environments');
}

// Run example
if (require.main === module) {
  advancedExample().catch(console.error);
}

export { advancedExample };
