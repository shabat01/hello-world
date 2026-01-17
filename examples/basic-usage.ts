/**
 * Basic Usage Example - Signal + KnectIQ SelectiveTRUST® Integration
 *
 * This example demonstrates how to use the Signal-KnectIQ integration
 * to send and receive messages with ephemeral trust security.
 */

import { SignalKnectIQIntegration } from '../src/integration/SignalKnectIQIntegration';
import crypto from 'crypto';

async function basicExample() {
  console.log('=== Signal + KnectIQ SelectiveTRUST® Integration Example ===\n');

  // Step 1: Initialize integration for Alice's device
  console.log('1. Initializing Alice\'s device...');
  const aliceDeviceId = 'alice-device-001';
  const aliceIntegration = new SignalKnectIQIntegration(aliceDeviceId, {
    requiredAuthLevel: 'high',
    sessionTimeout: 3600000, // 1 hour
    requireMutualAuth: true
  });

  // Step 2: Initialize integration for Bob's device
  console.log('2. Initializing Bob\'s device...');
  const bobDeviceId = 'bob-device-001';
  const bobIntegration = new SignalKnectIQIntegration(bobDeviceId);

  // Step 3: Generate device keys (in production, these would be persistent identity keys)
  console.log('3. Generating device identity keys...');
  const aliceKeys = crypto.generateKeyPairSync('x25519', {
    publicKeyEncoding: { type: 'spki', format: 'der' },
    privateKeyEncoding: { type: 'pkcs8', format: 'der' }
  });

  const bobKeys = crypto.generateKeyPairSync('x25519', {
    publicKeyEncoding: { type: 'spki', format: 'der' },
    privateKeyEncoding: { type: 'pkcs8', format: 'der' }
  });

  // Step 4: Register trusted devices (mutual registration)
  console.log('4. Registering trusted devices...');
  await aliceIntegration.registerTrustedDevice(bobDeviceId, bobKeys.publicKey);
  await bobIntegration.registerTrustedDevice(aliceDeviceId, aliceKeys.publicKey);
  console.log('   ✓ Devices registered in trust network\n');

  // Step 5: Establish ephemeral trust session
  console.log('5. Establishing ephemeral trust session...');
  const session = await aliceIntegration.establishMessageSession(bobDeviceId);
  console.log(`   ✓ Trust session established: ${session.sessionId.substring(0, 16)}...`);
  console.log(`   ✓ Trust score: ${session.trustScore}\n`);

  // Step 6: Send secure message with ephemeral encryption
  console.log('6. Sending secure message...');
  const message = 'Hello Bob! This message is protected by KnectIQ ephemeral encryption.';
  const secureMessage = await aliceIntegration.sendSecureMessage(bobDeviceId, message);
  console.log(`   ✓ Message encrypted with ephemeral key`);
  console.log(`   ✓ Key fingerprint: ${secureMessage.ephemeralKeyFingerprint.substring(0, 16)}...`);
  console.log(`   ✓ Message ID: ${secureMessage.messageId}`);
  console.log(`   ✓ Trust validated: ${secureMessage.trustValidated}\n`);

  // Step 7: Verify message trust
  console.log('7. Verifying message trust...');
  const trustVerified = await bobIntegration.verifyMessageTrust(secureMessage);
  console.log(`   ✓ Message trust verified: ${trustVerified}\n`);

  // Step 8: Receive and decrypt message
  console.log('8. Receiving and decrypting message...');
  const decryptedMessage = await bobIntegration.receiveSecureMessage(secureMessage);
  console.log(`   ✓ Message decrypted: "${decryptedMessage.content.toString('utf8')}"\n`);

  // Step 9: Display security metrics
  console.log('9. Security metrics:');
  const aliceMetrics = aliceIntegration.getSecurityMetrics();
  console.log(`   Alice's device:`);
  console.log(`   - Active ephemeral keys: ${aliceMetrics.activeKeys}`);
  console.log(`   - Active sessions: ${aliceMetrics.activeSessions}`);
  console.log(`   - Trusted devices: ${aliceMetrics.trustedDevices}\n`);

  const bobMetrics = bobIntegration.getSecurityMetrics();
  console.log(`   Bob's device:`);
  console.log(`   - Active ephemeral keys: ${bobMetrics.activeKeys}`);
  console.log(`   - Active sessions: ${bobMetrics.activeSessions}`);
  console.log(`   - Trusted devices: ${bobMetrics.trustedDevices}\n`);

  // Step 10: Cleanup (destroys all ephemeral keys)
  console.log('10. Shutting down and destroying ephemeral keys...');
  aliceIntegration.shutdown();
  bobIntegration.shutdown();
  console.log('   ✓ All ephemeral keys destroyed');
  console.log('   ✓ No persistent key material remains\n');

  console.log('=== Example Complete ===');
  console.log('\nKey Security Features Demonstrated:');
  console.log('✓ Ephemeral keys generated dynamically');
  console.log('✓ Single-use encryption (keys destroyed after use)');
  console.log('✓ Real-time trust validation');
  console.log('✓ Sovereign trust enclaves');
  console.log('✓ Zero persistent key storage');
  console.log('✓ Prevention of key compromise');
}

// Run example
if (require.main === module) {
  basicExample().catch(console.error);
}

export { basicExample };
