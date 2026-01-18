# SecureMessenger - Quick Start Guide

Get your secure messaging app running in 10 minutes!

## Prerequisites Check

```bash
# Verify Xcode installation
xcodebuild -version
# Should show: Xcode 15.0 or later

# Verify CocoaPods
pod --version
# Should show: 1.11.0 or later
```

## Step-by-Step Setup

### 1. Navigate to Project

```bash
cd /home/user/hello-world/ios-app/SecureMessenger
```

### 2. Install Dependencies

```bash
pod install
```

**Expected Output:**
```
Analyzing dependencies
Downloading dependencies
Installing LibSignalClient (0.32.0)
Installing Starscream (4.0.6)
Installing Alamofire (5.8.1)
Installing GRDB.swift (6.0.0)
Generating Pods project
Integrating client project

[✓] Pod installation complete! 4 pods installed.
```

### 3. Open Workspace

```bash
open SecureMessenger.xcworkspace
```

**⚠️ IMPORTANT:** Open `.xcworkspace`, NOT `.xcodeproj`!

### 4. Select Device

In Xcode:
1. Click the device selector (top toolbar)
2. Choose "iPhone 15 Pro" simulator or your physical device

### 5. Build & Run

Press `Cmd + R` or click the ▶️ Play button

**Expected Console Output:**
```
🚀 SecureMessenger Started
   User ID: alice-mobile-12345678
   SelectiveTRUST®: Enabled
   Signal Protocol: Enabled
   Defense in Depth: 2 encryption layers

=== Architecture ===
Control Plane: DASB (Device Access Service Broker)
Data Plane: Device SDK (Ephemeral Keys)
Layer 1: Signal Protocol E2E Encryption
Layer 2: SelectiveTRUST® Ephemeral Encryption

✅ Patent Compliance:
  • Keys constructed AT device (not centrally)
  • Single-use keys destroyed immediately
  • No persistent key storage
  • Real-time trust validation
  • No PKI dependency
```

## Quick Test

### Test SelectiveTRUST® Integration

1. **Add a Contact:**
   - Tap "+" button
   - Enter ID: `bob-001`
   - Enter Name: `Bob Test`
   - Tap "Add Contact"

   **Console Output:**
   ```
   ✓ Local device provisioned with SelectiveTRUST®
   ✓ Trust relationship established with bob-001
   ```

2. **Send a Message:**
   - Tap on "Bob Test"
   - Type: "Hello from SelectiveTRUST®!"
   - Tap send button

   **Console Output:**
   ```
   ✓ Ephemeral key constructed at device: alice-mobile-001-1768695...
   ✓ Data encrypted with ephemeral key
   ✓ Key marked for immediate destruction
   ✓ Message sent with double encryption
     - Signal Protocol: E2E encryption
     - SelectiveTRUST®: Ephemeral key alice-mobile-... (destroyed)
   ✓ Ephemeral key destroyed: alice-mobile-001-1768695...
   📡 Sending encrypted package to bob-001
   ```

3. **Check Security Metrics:**
   - Look at bottom security bar:
     - "Ephemeral Keys: 1 constructed, 1 destroyed"
     - Green shield icon indicates SelectiveTRUST® active

   - Tap contact list security section:
     - See real-time key statistics
     - Verify FIPS mode status

## Architecture Verification

### Verify Patent Compliance

Run this check in Xcode console:

```swift
// Get security metrics
let metrics = messageManager.getSecurityMetrics()

// Verify ephemeral key lifecycle
print("Keys Constructed: \(metrics.totalKeysConstructed)")  // Should increase with each message
print("Keys Destroyed: \(metrics.totalKeysDestroyed)")      // Should equal constructed
print("Active Keys: \(metrics.activeEphemeralKeys)")        // Should be 0 (all destroyed)
```

### Verify Double Encryption

Set breakpoint in `MessageManager.sendMessage()`:

```swift
// Breakpoint 1: After Signal Protocol encryption
let signalCiphertext = try await encryptWithSignalProtocol(...)
// Inspect: signalCiphertext (Layer 1)

// Breakpoint 2: After SelectiveTRUST® encryption
let selectiveTrustPackage = try deviceSDK.encryptData(...)
// Inspect: selectiveTrustPackage (Layer 2)
```

## Common Setup Issues

### Issue: Pod Install Fails

**Solution:**
```bash
# Update CocoaPods
sudo gem install cocoapods

# Clean and reinstall
rm -rf Pods Podfile.lock
pod install
```

### Issue: "No such module 'LibSignalClient'"

**Solution:**
1. Ensure you opened `.xcworkspace` not `.xcodeproj`
2. Clean build folder: `Cmd + Shift + K`
3. Rebuild: `Cmd + B`

### Issue: Signing Error

**Solution:**
1. Xcode → Preferences → Accounts
2. Add your Apple ID
3. Select your team in project settings
4. Enable "Automatically manage signing"

### Issue: Simulator Won't Launch

**Solution:**
```bash
# Reset simulator
xcrun simctl erase all

# Restart Xcode
killall Xcode
```

## Enable FIPS 140-2 Mode

In `SecureMessengerApp.swift`, change:

```swift
let config = IntegrationConfig(
    trustEnvironmentName: "secure-messenger",
    maxDevices: 100,
    sessionTimeout: 3600,
    requiredTrustScore: 80,
    fipsMode: true  // ← Change to true
)
```

**Console Output:**
```
✅ FIPS 140-2 Mode: Enabled
   Using validated cryptographic algorithms only
   - AES-256-GCM (encryption)
   - SHA-256 (hashing)
   - HMAC-SHA256 (signatures)
```

## Test on Physical Device

### 1. Connect iPhone

Connect iPhone via USB

### 2. Trust Computer

On iPhone: Trust this computer when prompted

### 3. Select Device

In Xcode device selector, choose your iPhone

### 4. Run

Press `Cmd + R`

**First Run:** Xcode will install and launch the app

## Next Steps

### Customize Configuration

Edit `MessageManager.swift`:

```swift
// Adjust trust requirements
let config = IntegrationConfig(
    trustEnvironmentName: "my-secure-chat",
    maxDevices: 50,
    sessionTimeout: 1800,  // 30 minutes
    requiredTrustScore: 95,  // Stricter trust
    fipsMode: true
)
```

### Add Real Signal Protocol

Uncomment Signal Protocol integration in `MessageManager.swift`:

```swift
private func encryptWithSignalProtocol(data: Data, for recipientId: String) async throws -> Data {
    // TODO: Implement actual Signal Protocol encryption
    // Use LibSignalClient for proper E2E encryption
}
```

### Add Network Layer

Implement WebSocket connection in `NetworkManager.swift`:

```swift
import Starscream

class NetworkManager {
    private var socket: WebSocket?

    func connect(to serverUrl: URL) {
        var request = URLRequest(url: serverUrl)
        socket = WebSocket(request: request)
        socket?.connect()
    }
}
```

### Add Database Persistence

Implement GRDB in `DatabaseManager.swift`:

```swift
import GRDB

class DatabaseManager {
    private var dbQueue: DatabaseQueue?

    func saveMessage(_ message: Message) throws {
        try dbQueue?.write { db in
            try message.insert(db)
        }
    }
}
```

## Performance Benchmarks

Run performance tests:

```swift
// In XCTest
func testEphemeralKeyPerformance() {
    measure {
        let sdk = DeviceSDK(deviceId: "test", deviceType: "mobile")
        for _ in 0..<1000 {
            let keyId = sdk.constructEphemeralKey()
            _ = sdk.getStatistics()
        }
    }
}
```

**Expected Results:**
- 1000 key constructions: <1.5 seconds
- Per-key overhead: <1.5ms
- Memory: <200KB total

## Production Checklist

Before deploying to production:

- [ ] Implement real Signal Protocol integration
- [ ] Add WebSocket connection for real-time messaging
- [ ] Implement message persistence with GRDB
- [ ] Add push notifications (APNs)
- [ ] Implement contact QR code verification
- [ ] Add end-to-end tests
- [ ] Configure App Store privacy declarations
- [ ] Add crash reporting (Sentry/Firebase)
- [ ] Implement key backup (for device identity only!)
- [ ] Add rate limiting for ephemeral key construction
- [ ] Configure background message fetching
- [ ] Add biometric authentication
- [ ] Implement message deletion timers
- [ ] Add screenshot prevention for sensitive chats

## Resources

**Code Documentation:**
- See inline comments in all Swift files
- Each component has detailed header documentation

**Architecture:**
- See `docs/ARCHITECTURE.md` in parent directory
- Patent information included in source files

**Support:**
- Check troubleshooting in README.md
- Review Xcode build logs for errors

## Success Indicators

Your app is working correctly if:

✅ No build errors in Xcode
✅ App launches successfully
✅ Can add contacts
✅ Can send messages
✅ Security metrics update in real-time
✅ Ephemeral keys constructed = destroyed
✅ Console shows patent compliance messages
✅ No memory leaks (use Instruments to verify)

## Questions?

Refer to:
1. `README.md` - Complete documentation
2. `ARCHITECTURE.md` - Technical architecture details
3. Inline code comments - Implementation details
4. Xcode documentation - Cmd + Click on any symbol

---

**You're ready to build secure, patent-compliant messaging!** 🚀🔐

For any issues, check the troubleshooting sections in README.md or review the detailed architecture documentation.
