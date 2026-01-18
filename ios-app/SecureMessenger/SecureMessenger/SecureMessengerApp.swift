//
//  SecureMessengerApp.swift
//  SecureMessenger
//
//  Secure messaging app with KnectIQ SelectiveTRUST® + Signal Protocol
//  Double encryption for maximum security
//

import SwiftUI

@main
struct SecureMessengerApp: App {
    @StateObject private var messageManager: MessageManager

    init() {
        // Initialize with current user (in production, get from authentication)
        let userId = "alice-mobile-\(UIDevice.current.identifierForVendor?.uuidString.prefix(8) ?? "001")"

        let config = IntegrationConfig(
            trustEnvironmentName: "secure-messenger",
            maxDevices: 100,
            sessionTimeout: 3600,  // 1 hour
            requiredTrustScore: 80,
            fipsMode: false  // Set true for FIPS 140-2 validated mode
        )

        _messageManager = StateObject(wrappedValue: MessageManager(
            userId: userId,
            config: config
        ))

        print("🚀 SecureMessenger Started")
        print("   User ID: \(userId)")
        print("   SelectiveTRUST®: Enabled")
        print("   Signal Protocol: Enabled")
        print("   Defense in Depth: 2 encryption layers")
    }

    var body: some Scene {
        WindowGroup {
            ContactListView(messageManager: messageManager)
                .onAppear {
                    printArchitectureInfo()
                }
        }
    }

    private func printArchitectureInfo() {
        print("\n=== Architecture ===")
        print("Control Plane: DASB (Device Access Service Broker)")
        print("Data Plane: Device SDK (Ephemeral Keys)")
        print("Layer 1: Signal Protocol E2E Encryption")
        print("Layer 2: SelectiveTRUST® Ephemeral Encryption")
        print("\n✅ Patent Compliance:")
        print("  • Keys constructed AT device (not centrally)")
        print("  • Single-use keys destroyed immediately")
        print("  • No persistent key storage")
        print("  • Real-time trust validation")
        print("  • No PKI dependency\n")
    }
}
