# Signal + KnectIQ SelectiveTRUST® Integration

A cutting-edge integration that enhances Signal's secure messaging with KnectIQ's patented SelectiveTRUST® security architecture, providing completely ephemeral and sovereign trust environments.

## Overview

This integration combines:
- **Signal's End-to-End Encryption**: Industry-leading secure messaging
- **KnectIQ's SelectiveTRUST®**: Patented ephemeral key technology and sovereign trust enclaves

The result is a defense-in-depth security architecture that prevents breaches before they occur through:
- ✅ **Ephemeral Keys**: Single-use encryption keys that are destroyed immediately after use
- ✅ **Zero Persistence**: No keys to store, manage, or rotate
- ✅ **Real-time Validation**: Every message validated through programmable trust fabric
- ✅ **Sovereign Trust**: Isolated trust enclaves for tamper-resistant security
- ✅ **Machine-to-Machine Trust**: Automated trust establishment and validation

## Key Features

### 1. Ephemeral Key Management
- Keys generated dynamically at time of need
- Used exactly once, then destroyed
- No persistent key storage
- Automatic memory overwriting
- Forward secrecy per message

### 2. Sovereign Trust Enclaves
- Isolated execution environment for cryptographic operations
- Real-time trust validation
- Dynamic trust scoring
- Configurable authentication levels
- Session timeout management

### 3. Programmable Trust Fabric
- Custom validation rules
- Machine-to-machine trust orchestration
- Replay attack prevention
- Authenticated encryption (AES-256-GCM)
- HMAC signature verification

### 4. Security Monitoring
- Real-time metrics
- Active key tracking
- Session monitoring
- Trust score auditing

## Quick Start

### Installation

```bash
npm install
```

### Basic Usage

```typescript
import { SignalKnectIQIntegration } from './src/integration/SignalKnectIQIntegration';
import crypto from 'crypto';

// Initialize for your device
const integration = new SignalKnectIQIntegration('my-device-id', {
  requiredAuthLevel: 'high',
  sessionTimeout: 3600000, // 1 hour
  requireMutualAuth: true
});

// Register a trusted contact
const contactKeys = crypto.generateKeyPairSync('x25519', {
  publicKeyEncoding: { type: 'spki', format: 'der' },
  privateKeyEncoding: { type: 'pkcs8', format: 'der' }
});

await integration.registerTrustedDevice('contact-device-id', contactKeys.publicKey);

// Establish ephemeral trust session
const session = await integration.establishMessageSession('contact-device-id');

// Send secure message with ephemeral encryption
const secureMessage = await integration.sendSecureMessage(
  'contact-device-id',
  'Hello! This message uses a unique ephemeral key.'
);

// Each message gets a NEW key that is destroyed after use
console.log('Ephemeral key fingerprint:', secureMessage.ephemeralKeyFingerprint);

// Cleanup (destroys all ephemeral keys)
integration.shutdown();
```

### Advanced Usage

```typescript
// Custom trust policy
const strictPolicy = {
  requiredAuthLevel: 'critical' as const,
  sessionTimeout: 300000, // 5 minutes
  requireMutualAuth: true,
  allowedOperations: new Set(['send', 'receive'])
};

const integration = new SignalKnectIQIntegration('secure-device', strictPolicy);

// Security monitoring
const metrics = integration.getSecurityMetrics();
console.log({
  activeEphemeralKeys: metrics.activeKeys,
  activeTrustSessions: metrics.activeSessions,
  trustedDevices: metrics.trustedDevices
});

// Trust revocation (immediate)
await integration.revokeTrust('compromised-device-id');
```

## Architecture

```
┌─────────────────────────────────────┐
│      Signal Application             │
└─────────────────────────────────────┘
              ▼
┌─────────────────────────────────────┐
│   SignalKnectIQIntegration          │
│   - Device management               │
│   - Secure messaging API            │
└─────────────────────────────────────┘
              ▼
    ┌─────────┴─────────┐
    ▼                   ▼
┌─────────────┐   ┌──────────────────┐
│TrustFabric  │   │EphemeralKeyMgr   │
│- Validation │◄──┤- Key generation  │
│- Envelopes  │   │- Key destruction │
└─────────────┘   └──────────────────┘
    ▼
┌─────────────┐
│TrustEnclave │
│- Sessions   │
│- Scoring    │
└─────────────┘
```

See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed technical documentation.

## Examples

### Basic Example
```bash
ts-node examples/basic-usage.ts
```

Demonstrates:
- Device initialization
- Trust registration
- Session establishment
- Secure messaging
- Trust verification
- Security metrics

### Advanced Example
```bash
ts-node examples/advanced-usage.ts
```

Demonstrates:
- Custom trust policies
- Multi-party networks
- Trust revocation
- Unique keys per message
- Real-time monitoring

## Security Features

### Ephemeral Key Lifecycle

```
Generate → Use Once → Destroy
  (~1ms)    (<1ms)   (immediate)
```

### Multi-Layer Validation

Every message undergoes:
1. Device authentication
2. Session validation
3. Operation authorization
4. Timestamp verification
5. Signature verification
6. Trust score validation

### Threat Protection

| Threat | Protection |
|--------|------------|
| Key Compromise | No persistent keys |
| Replay Attacks | Timestamp + ephemeral keys |
| MITM | Mutual authentication |
| Device Impersonation | Trust enclaves |
| Message Tampering | HMAC signatures |
| Session Hijacking | Ephemeral sessions |
| Lateral Movement | Isolated enclaves |

## API Reference

### SignalKnectIQIntegration

#### Constructor
```typescript
new SignalKnectIQIntegration(deviceId: string, trustPolicy?: Partial<TrustPolicy>)
```

#### Methods

**registerTrustedDevice(deviceId, publicKey)**
- Register a device in the trust network
- Returns: `Promise<DeviceRegistration>`

**establishMessageSession(recipientDeviceId)**
- Establish ephemeral trust session
- Returns: `Promise<TrustSession>`

**sendSecureMessage(recipient, content)**
- Send message with ephemeral encryption
- Returns: `Promise<SecureSignalMessage>`

**receiveSecureMessage(secureMessage)**
- Decrypt and validate message
- Returns: `Promise<SignalMessage>`

**verifyMessageTrust(secureMessage)**
- Verify message integrity
- Returns: `Promise<boolean>`

**revokeTrust(deviceId)**
- Immediately revoke device trust
- Returns: `Promise<void>`

**getSecurityMetrics()**
- Get real-time security metrics
- Returns: Security metrics object

**shutdown()**
- Cleanup and destroy all ephemeral keys
- Returns: `void`

## Performance

### Key Generation Times
- X25519: ~1-2ms (recommended)
- EC secp256k1: ~2-5ms
- RSA-2048: ~10-50ms

### Memory Overhead
- Active key: ~200 bytes
- Trust session: ~500 bytes
- Secure envelope: Message size + ~300 bytes

## Use Cases

- **Government & Military**: Secure communications with zero key storage
- **Critical Infrastructure**: Energy, finance, healthcare messaging
- **Enterprise**: Executive communications, M&A, legal
- **Personal Privacy**: Enhanced security for everyday users

## Technical Specifications

### Cryptography
- **Key Exchange**: X25519 elliptic curve
- **Encryption**: AES-256-GCM
- **Signatures**: HMAC-SHA256
- **Hashing**: SHA-256

### Standards Compliance
- NIST approved algorithms
- Forward secrecy
- Authenticated encryption
- Timing-safe comparisons

## Contributing

This is a demonstration of integrating KnectIQ's patented SelectiveTRUST® technology with Signal's secure messaging protocol.

## References

- [KnectIQ SelectiveTRUST® Technology](https://www.knectiq.com/)
- [Signal Protocol](https://signal.org/docs/)
- [X25519 Key Exchange](https://cr.yp.to/ecdh.html)

## Sources

Research for this integration based on:
- [SRC UK and KnectIQ Licensing Agreement](https://srcuk.com/2025/10/22/press-release-src-uk-and-kinetiq-licensing-agreement/)
- [KnectIQ SelectiveTRUST® Technology Overview](https://www.knectiq.com/what-we-do/)
- [PR Newswire: KnectIQ and SRC UK Partnership](https://www.prnewswire.com/news-releases/knectiq-and-src-uk-forge-licensing-agreement-to-power-next-generation-intelligence-and-defense-platforms-with-selectivetrust-technology-302589760.html)

## License

This implementation is for demonstration purposes. KnectIQ SelectiveTRUST® is a patented technology.

---

**Built with**: TypeScript, Node.js Crypto API
**Powered by**: KnectIQ SelectiveTRUST® patented security architecture
**Enhanced**: Signal's end-to-end encryption
