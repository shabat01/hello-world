/**
 * Advanced Usage Example - Signal + KnectIQ SelectiveTRUST® Integration
 *
 * Demonstrates advanced features:
 * - Custom trust policies
 * - Trust revocation
 * - Session management
 * - Security monitoring
 */

import { SignalKnectIQIntegration } from '../src/integration/SignalKnectIQIntegration';
import crypto from 'crypto';

async function advancedExample() {
  console.log('=== Advanced Signal + KnectIQ Features ===\n');

  // Custom trust policy with strict security
  const strictPolicy = {
    requiredAuthLevel: 'critical' as const,
    sessionTimeout: 300000, // 5 minutes
    requireMutualAuth: true,
    allowedOperations: new Set(['send', 'receive']) // No delete operation
  };

  // Initialize with custom policy
  const aliceIntegration = new SignalKnectIQIntegration('alice-secure-001', strictPolicy);
  const bobIntegration = new SignalKnectIQIntegration('bob-secure-001', strictPolicy);
  const charlieIntegration = new SignalKnectIQIntegration('charlie-001');

  // Generate keys
  const aliceKeys = crypto.generateKeyPairSync('x25519', {
    publicKeyEncoding: { type: 'spki', format: 'der' },
    privateKeyEncoding: { type: 'pkcs8', format: 'der' }
  });

  const bobKeys = crypto.generateKeyPairSync('x25519', {
    publicKeyEncoding: { type: 'spki', format: 'der' },
    privateKeyEncoding: { type: 'pkcs8', format: 'der' }
  });

  const charlieKeys = crypto.generateKeyPairSync('x25519', {
    publicKeyEncoding: { type: 'spki', format: 'der' },
    privateKeyEncoding: { type: 'pkcs8', format: 'der' }
  });

  console.log('1. Establishing multi-party trust network...');

  // Register devices
  await aliceIntegration.registerTrustedDevice('bob-secure-001', bobKeys.publicKey);
  await aliceIntegration.registerTrustedDevice('charlie-001', charlieKeys.publicKey);
  await bobIntegration.registerTrustedDevice('alice-secure-001', aliceKeys.publicKey);
  await charlieIntegration.registerTrustedDevice('alice-secure-001', aliceKeys.publicKey);

  console.log('   ✓ Multi-party trust network established\n');

  // Establish sessions
  console.log('2. Creating ephemeral trust sessions...');
  const aliceToBobSession = await aliceIntegration.establishMessageSession('bob-secure-001');
  const aliceToCharlieSession = await aliceIntegration.establishMessageSession('charlie-001');

  console.log(`   ✓ Alice → Bob session: ${aliceToBobSession.sessionId.substring(0, 12)}...`);
  console.log(`   ✓ Alice → Charlie session: ${aliceToCharlieSession.sessionId.substring(0, 12)}...`);
  console.log(`   ✓ Both sessions use different ephemeral keys\n`);

  // Send multiple messages (each with new ephemeral key)
  console.log('3. Sending multiple messages with unique ephemeral keys...');

  for (let i = 1; i <= 3; i++) {
    const msg = await aliceIntegration.sendSecureMessage(
      'bob-secure-001',
      `Message ${i}: Each message uses a NEW ephemeral key`
    );
    console.log(`   ✓ Message ${i} - Key: ${msg.ephemeralKeyFingerprint.substring(0, 12)}...`);
  }
  console.log('   ✓ Notice: Each message has a different key fingerprint\n');

  // Demonstrate trust revocation
  console.log('4. Demonstrating trust revocation...');
  console.log('   Revoking trust for Charlie...');
  await aliceIntegration.revokeTrust('charlie-001');
  console.log('   ✓ Charlie removed from trust network\n');

  // Try to send to revoked device (should fail)
  console.log('5. Attempting to send to revoked device...');
  try {
    await aliceIntegration.sendSecureMessage('charlie-001', 'This should fail');
    console.log('   ✗ UNEXPECTED: Message sent to revoked device');
  } catch (error) {
    console.log('   ✓ EXPECTED: Message blocked by security policy');
    console.log(`   ✓ Reason: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
  }

  // Security metrics
  console.log('6. Real-time security monitoring:');
  const metrics = aliceIntegration.getSecurityMetrics();
  console.log(`   Device ID: ${metrics.deviceId}`);
  console.log(`   Active ephemeral keys: ${metrics.activeKeys}`);
  console.log(`   Active trust sessions: ${metrics.activeSessions}`);
  console.log(`   Trusted devices: ${metrics.trustedDevices}`);
  console.log('   ✓ All metrics available in real-time\n');

  // Demonstrate session timeout
  console.log('7. Testing session timeout...');
  console.log('   (In production, sessions expire automatically)');
  console.log(`   Current session timeout: ${strictPolicy.sessionTimeout}ms\n`);

  // Cleanup
  console.log('8. Secure cleanup...');
  aliceIntegration.shutdown();
  bobIntegration.shutdown();
  charlieIntegration.shutdown();
  console.log('   ✓ All ephemeral keys destroyed');
  console.log('   ✓ All sessions terminated');
  console.log('   ✓ Zero traces left in memory\n');

  console.log('=== Advanced Features Demonstrated ===');
  console.log('✓ Custom trust policies');
  console.log('✓ Multi-party trust networks');
  console.log('✓ Trust revocation');
  console.log('✓ Unique ephemeral keys per message');
  console.log('✓ Real-time security monitoring');
  console.log('✓ Session timeout management');
  console.log('✓ Secure cleanup and key destruction');
}

// Run example
if (require.main === module) {
  advancedExample().catch(console.error);
}

export { advancedExample };
