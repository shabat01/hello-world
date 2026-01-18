# Signal + KnectIQ SelectiveTRUST® Integration

Enhances Signal messaging with KnectIQ's patented SelectiveTRUST® architecture based on publicly available patent information.

## Patent Information

**Assignee:** KnectIQ Inc.
**Inventors:** Shailendra Jain, Andrew Lunstad, Kenneth Morris
**Grant Date:** June 11, 2019
**Title:** Systems and methods for secure electronic data transfer utilizing an ephemeral key for encryption and decryption of data

## Core Architecture (Patent-Based)

### 1. DASB (Device Access Service Broker)
**Control Plane** - Manages trust, NOT data
- Creates Trust Environments
- Provisions devices
- Manages trust relationships
- Real-time validation
- Audit logging

### 2. Trust Environment
**Relationship Management**
- Device registry
- Trust relationships
- Trust score management
- Session control

### 3. Device SDK
**Data Plane** - Keys constructed at device
- **Construct** ephemeral keys locally (core patent concept)
- Encrypt/decrypt at device
- Single-use keys
- Immediate destruction

## Key Patent Claims

✅ **"Single-use encryption keys dynamically generated at the device at the time of need"**
✅ **"Each key is destroyed immediately after use on every operation"**
✅ **"No crypto to store, rotate, or frequently load"**
✅ **"Encrypted data travels via established pathways, unseen and untouched by SelectiveTRUST"**
✅ **"Device-level trust without persistent keys or centralized storage"**
✅ **"No dependency on PKI or shared cryptographic infrastructure"**
✅ **"Real-time validation for every communication/transaction"**
✅ **"FIPS 140-2 validated mode of operation"**

## Installation

```bash
npm install
```

## Quick Start

```typescript
import { SignalKnectIQIntegration, SignalDevice } from './src/integration/SignalKnectIQIntegration';

// Define your device
const myDevice: SignalDevice = {
  deviceId: 'alice-mobile-001',
  phoneNumber: '+1-555-0101',
  deviceType: 'mobile',
  capabilities: []
};

// Initialize SelectiveTRUST®
const integration = new SignalKnectIQIntegration(myDevice, {
  trustEnvironmentName: 'secure-chat',
  requiredTrustScore: 80,
  fipsMode: false
});

// Add trusted contact
const contact: SignalDevice = {
  deviceId: 'bob-desktop-001',
  phoneNumber: '+1-555-0102',
  deviceType: 'desktop',
  capabilities: []
};

await integration.addTrustedContact(contact);

// Send message (key constructed AT YOUR DEVICE)
const pkg = await integration.sendMessage(
  contact.deviceId,
  'Hello! Key constructed at my device, destroyed immediately.'
);

console.log('Ephemeral key:', pkg.ephemeralKeyId);
// Key is already destroyed at this point

// Cleanup
integration.shutdown();
```

## Architecture

```
┌───────────────────┐
│ Signal App        │
└─────────┬─────────┘
          ▼
┌─────────────────────┐
│  Integration Layer  │
└─────────┬───────────┘
          ▼
    ┌─────┴─────┐
    ▼           ▼
┌────────┐  ┌──────────┐
│  DASB  │  │Device SDK│
│(Control│  │  (Data   │
│ Plane) │  │  Plane)  │
└────┬───┘  └─────┬────┘
     ▼            ▼
┌─────────┐  ┌──────────┐
│Trust Env│  │Encrypt @ │
│         │  │  Device  │
└─────────┘  └──────────┘
```

## Running Examples

### Basic Example
```bash
npm install  # Install dependencies
ts-node examples/basic-usage.ts
```

Demonstrates:
- DASB initialization
- Trust Environment creation
- Device provisioning with SDK
- Ephemeral key construction at device
- Message encryption/decryption locally
- Trust validation

### Advanced Example
```bash
ts-node examples/advanced-usage.ts
```

Demonstrates:
- FIPS 140-2 mode
- Trust score management
- Multi-party trust networks
- Trust revocation
- Audit logging
- Unique keys per message

## Key Differences from Traditional Systems

| Feature | Traditional PKI | SelectiveTRUST® |
|---------|-----------------|-----------------|
| Key Generation | Central CA | At device |
| Key Lifecycle | Long-lived, rotated | Single-use, ephemeral |
| Key Storage | Persistent | None |
| Trust Model | Certificate chains | Device relationships |
| Infrastructure | CA/RA/VA | DASB (control only) |
| Data Handling | Often centralized | Always at device |

## Security Features

### Ephemeral Key Lifecycle
```
Construct @ Device → Use Once → Destroy Immediately
      (~1ms)           (<1ms)      (instant)
```

### Multi-Layer Defense
1. Signal E2E encryption (base)
2. Device SDK ephemeral keys
3. Trust Environment validation
4. DASB policy enforcement
5. Trust score gating

### Threat Protection
- **Key Compromise**: No persistent keys
- **Replay Attacks**: Single-use keys + timestamps
- **MITM**: Trust relationship validation
- **Lateral Movement**: Isolated trust environments

## FIPS 140-2 Mode

Set `fipsMode: true` for validated operation:
- AES-256-GCM encryption
- SHA-256 hashing
- HMAC-SHA256 signatures
- NIST-approved algorithms

## API Reference

### SignalKnectIQIntegration

**Constructor**
```typescript
new SignalKnectIQIntegration(device: SignalDevice, config: IntegrationConfig)
```

**Methods**
- `addTrustedContact(device)` - Provision and establish trust
- `sendMessage(deviceId, message)` - Send with ephemeral encryption
- `receiveMessage(package)` - Decrypt and validate
- `removeTrustedContact(deviceId)` - Revoke trust
- `validateContactTrust(deviceId)` - Check trust status
- `updateContactTrustScore(deviceId, score)` - Modify trust score
- `getSecurityMetrics()` - Get statistics
- `getAuditLog()` - DASB audit events
- `shutdown()` - Clean up all resources

## Documentation

See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed technical documentation including:
- Complete component descriptions
- Message flow diagrams
- Patent alignment details
- Security properties
- Performance characteristics

## Sources

**Patent Research:**
- [Patents Assigned to KnectIQ Inc.](https://patents.justia.com/assignee/knectiq-inc)
- [KnectIQ Patent Award](https://www.knectiq.com/knectiq-awarded-patent-for-cyber-technology/)
- [Shailendra Jain Patents](https://patents.justia.com/inventor/shailendra-jain)
- [Andrew Lunstad Patents](https://patents.justia.com/inventor/andrew-lunstad)

**Technology Information:**
- [SelectiveTRUST® Overview](https://www.knectiq.com/what-we-do/)
- [SRC UK Partnership](https://srcuk.com/2025/10/22/press-release-src-uk-and-kinetiq-licensing-agreement/)
- [PR Newswire Release](https://www.prnewswire.com/news-releases/knectiq-and-src-uk-forge-licensing-agreement-to-power-next-generation-intelligence-and-defense-platforms-with-selectivetrust-technology-302589760.html)
- [Help Net Security](https://www.helpnetsecurity.com/2023/05/03/knectiq-selectivetrust/)

## License

This implementation is for demonstration and educational purposes based on publicly available patent information. SelectiveTRUST® is a registered trademark and patented technology of KnectIQ Inc.

---

**Built with:** TypeScript, Node.js Crypto API
**Based on:** KnectIQ's patented SelectiveTRUST® architecture
**Enhances:** Signal's end-to-end encryption
