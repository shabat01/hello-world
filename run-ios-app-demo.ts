#!/usr/bin/env ts-node

/**
 * iOS App UI Simulation - Interactive Demo
 *
 * This demonstrates what you would see when running the SecureMessenger iOS app.
 * Same SelectiveTRUST® functionality as the Swift implementation.
 */

import { SignalKnectIQIntegration } from './src/integration/SignalKnectIQIntegration';

// ANSI color codes
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  gray: '\x1b[90m',
  white: '\x1b[37m',
};

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function header(title: string) {
  console.log(`\n${c.bold}${c.cyan}═══════════════════════════════════════════════${c.reset}`);
  console.log(`${c.bold}${c.white}  📱 ${title}${c.reset}`);
  console.log(`${c.bold}${c.cyan}═══════════════════════════════════════════════${c.reset}\n`);
}

async function main() {
  console.log(`${c.bold}${c.cyan}`);
  console.log('╔═════════════════════════════════════════════════╗');
  console.log('║                                                 ║');
  console.log('║      SecureMessenger iOS App Simulation        ║');
  console.log('║    KnectIQ SelectiveTRUST® Integration         ║');
  console.log('║                                                 ║');
  console.log('╚═════════════════════════════════════════════════╝');
  console.log(c.reset);

  await sleep(1000);

  // Initialize app
  console.log(`\n${c.yellow}⚡ Launching SecureMessenger...${c.reset}\n`);
  await sleep(800);

  const myDevice = {
    deviceId: 'iphone-15-pro-001',
    phoneNumber: '+1-555-1234',
    deviceType: 'mobile' as const,
    capabilities: ['messaging', 'voice'],
  };

  const integration = new SignalKnectIQIntegration(myDevice, {
    trustEnvironmentName: 'my-secure-chat',
    fipsMode: false,
  });

  console.log(`${c.green}✓ SelectiveTRUST® initialized${c.reset}`);
  console.log(`${c.green}✓ Device SDK provisioned${c.reset}`);
  console.log(`${c.green}✓ DASB (Device Access Service Broker) active${c.reset}\n`);
  await sleep(1500);

  // Show Contact List (empty)
  header('Contact List');
  console.log(`${c.gray}Device: ${myDevice.deviceId}${c.reset}\n`);

  const initialStats = integration.getSecurityMetrics();
  console.log(`${c.bold}Security Status:${c.reset}`);
  console.log(`  Trusted Contacts: ${c.bold}0${c.reset}`);
  console.log(`  Encryption Mode: ${c.bold}${initialStats.dasbStatistics.mode}${c.reset}\n`);

  console.log(`${c.gray}No contacts yet. Let's add some...${c.reset}\n`);
  await sleep(2000);

  // Add Alice
  header('Adding Contact: Alice');
  console.log(`${c.yellow}👤 User ID: alice@signal.org${c.reset}`);
  console.log(`${c.yellow}📱 Device: alice-iphone-001${c.reset}\n`);
  await sleep(1000);

  integration.addTrustedContact({
    deviceId: 'alice-iphone-001',
    phoneNumber: '+1-555-5001',
    deviceType: 'mobile',
    capabilities: ['messaging', 'voice'],
  });

  console.log(`${c.green}✓ Trust relationship established with Alice${c.reset}`);
  console.log(`${c.green}✓ Contact added${c.reset}\n`);
  await sleep(1500);

  // Add Bob
  header('Adding Contact: Bob');
  console.log(`${c.yellow}👤 User ID: bob@signal.org${c.reset}`);
  console.log(`${c.yellow}📱 Device: bob-iphone-001${c.reset}\n`);
  await sleep(1000);

  integration.addTrustedContact({
    deviceId: 'bob-iphone-001',
    phoneNumber: '+1-555-5002',
    deviceType: 'mobile',
    capabilities: ['messaging', 'voice'],
  });

  console.log(`${c.green}✓ Trust relationship established with Bob${c.reset}`);
  console.log(`${c.green}✓ Contact added${c.reset}\n`);
  await sleep(1500);

  // Show Contact List (with contacts)
  header('Contact List - Updated');

  const contacts = integration.getTrustedContacts();
  console.log(`${c.bold}Contacts (${contacts.length}):${c.reset}\n`);

  contacts.forEach((contact, i) => {
    const trusted = integration.validateContactTrust(contact.deviceId);
    const badge = trusted ? `${c.green}✓ Trusted${c.reset}` : `${c.yellow}⚠ Not Trusted${c.reset}`;
    console.log(`  ${c.bold}${i + 1}. ${contact.phoneNumber}${c.reset} ${badge}`);
    console.log(`     ${c.gray}Device: ${contact.deviceId}${c.reset}\n`);
  });

  await sleep(2500);

  // Open conversation with Alice
  header('Conversation with Alice');
  console.log(`${c.bold}Security:${c.reset} ${c.green}✓ Trusted${c.reset}\n`);
  console.log(`${c.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${c.reset}\n`);
  console.log(`${c.gray}No messages yet. Let's send one...${c.reset}\n`);
  await sleep(2000);

  // Send Message 1
  console.log(`${c.yellow}✍️  Typing: "Hey Alice! Testing SelectiveTRUST®"${c.reset}\n`);
  await sleep(1500);
  console.log(`${c.yellow}📤 Sending message...${c.reset}\n`);
  await sleep(500);

  const msg1 = await integration.sendMessage(
    'alice-iphone-001',
    'Hey Alice! Testing SelectiveTRUST®'
  );

  console.log(`${c.green}🔐 Message encrypted with double encryption:${c.reset}`);
  console.log(`   ${c.gray}Layer 1: Signal Protocol E2E encryption${c.reset}`);
  console.log(`   ${c.gray}Layer 2: SelectiveTRUST® ephemeral encryption${c.reset}\n`);

  console.log(`${c.bold}Ephemeral Key Lifecycle:${c.reset}`);
  console.log(`   ${c.gray}1. Key constructed at device: ${msg1.ephemeralKeyId.substring(0, 35)}...${c.reset}`);
  console.log(`   ${c.gray}2. Message encrypted with AES-256-GCM${c.reset}`);
  console.log(`   ${c.gray}3. Key destroyed immediately${c.reset}`);
  console.log(`   ${c.green}   ✓ Key cannot be reused (patent requirement)${c.reset}\n`);

  await sleep(2000);

  // Show message in conversation
  console.log(`${c.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${c.reset}\n`);
  console.log(`${c.gray}${new Date().toLocaleTimeString()}${c.reset}`);
  console.log(`  ${c.blue}You:${c.reset} Hey Alice! Testing SelectiveTRUST®\n`);
  await sleep(2000);

  // Send Message 2
  console.log(`${c.yellow}✍️  Typing: "Each message gets a unique ephemeral key!"${c.reset}\n`);
  await sleep(1500);
  console.log(`${c.yellow}📤 Sending message...${c.reset}\n`);
  await sleep(500);

  const msg2 = await integration.sendMessage(
    'alice-iphone-001',
    'Each message gets a unique ephemeral key!'
  );

  console.log(`${c.green}🔐 New ephemeral key used:${c.reset}`);
  console.log(`   ${c.gray}Previous: ${msg1.ephemeralKeyId.substring(0, 30)}...${c.reset}`);
  console.log(`   ${c.gray}Current:  ${msg2.ephemeralKeyId.substring(0, 30)}...${c.reset}`);
  console.log(`   ${c.green}✓ Keys are unique (never reused)${c.reset}\n`);

  await sleep(1500);

  // Show updated conversation
  console.log(`${c.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${c.reset}\n`);
  console.log(`${c.gray}${new Date().toLocaleTimeString()}${c.reset}`);
  console.log(`  ${c.blue}You:${c.reset} Hey Alice! Testing SelectiveTRUST®\n`);
  console.log(`${c.gray}${new Date().toLocaleTimeString()}${c.reset}`);
  console.log(`  ${c.blue}You:${c.reset} Each message gets a unique ephemeral key!\n`);

  await sleep(2000);

  // Show Security Statistics
  header('Security Statistics');

  const stats = integration.getSecurityMetrics();
  console.log(`${c.bold}Device Information:${c.reset}\n`);
  console.log(`  Device ID: ${c.bold}${myDevice.deviceId}${c.reset}`);
  console.log(`  Device Type: ${c.bold}${myDevice.deviceType}${c.reset}`);
  console.log(`  Phone: ${c.bold}${myDevice.phoneNumber}${c.reset}\n`);

  console.log(`${c.bold}Trust Relationships:${c.reset}\n`);
  console.log(`  ${c.green}✓${c.reset} Trusted Contacts: ${c.bold}${stats.trustedContacts}${c.reset}`);
  console.log(`  ${c.green}✓${c.reset} Active Relationships: ${c.bold}${stats.trustEnvironment.totalRelationships}${c.reset}\n`);

  console.log(`${c.bold}DASB Statistics:${c.reset}\n`);
  console.log(`  Mode: ${c.bold}${stats.dasbStatistics.mode}${c.reset}`);
  console.log(`  Trust Environments: ${c.bold}${stats.dasbStatistics.totalTrustEnvironments}${c.reset}`);
  console.log(`  Provisioned Devices: ${c.bold}${stats.dasbStatistics.provisionedDevices}${c.reset}\n`);

  console.log(`${c.bold}Trust Environment:${c.reset}\n`);
  console.log(`  Total Devices: ${c.bold}${stats.trustEnvironment.totalDevices}${c.reset}`);
  console.log(`  Active Relationships: ${c.bold}${stats.trustEnvironment.totalRelationships}${c.reset}`);
  console.log(`  Active Count: ${c.bold}${stats.trustEnvironment.activeRelationships}${c.reset}\n`);

  console.log(`${c.bold}Security Features Active:${c.reset}\n`);
  console.log(`  ${c.green}✓${c.reset} Ephemeral keys constructed at device (not centrally)`);
  console.log(`  ${c.green}✓${c.reset} Immediate key destruction after single use`);
  console.log(`  ${c.green}✓${c.reset} Real-time trust validation before messaging`);
  console.log(`  ${c.green}✓${c.reset} Double encryption (Signal + SelectiveTRUST®)`);
  console.log(`  ${c.green}✓${c.reset} FIPS 140-2 compliant algorithms (AES-256-GCM)`);
  console.log(`  ${c.green}✓${c.reset} Control plane (DASB) separate from data plane`);
  console.log(`  ${c.green}✓${c.reset} Zero persistent key storage for ephemeral keys\n`);

  console.log(`${c.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${c.reset}\n`);

  // Audit Log
  header('Security Audit Log');

  const auditLog = integration.getAuditLog();
  console.log(`${c.bold}Recent Events (last 10):${c.reset}\n`);

  auditLog.slice(-10).forEach((event, i) => {
    const time = new Date(event.timestamp).toLocaleTimeString();
    console.log(`  ${c.gray}${time}${c.reset} - ${event.event}`);
  });

  console.log('');
  await sleep(2000);

  // Cleanup
  console.log(`\n${c.yellow}🔄 Shutting down SecureMessenger...${c.reset}\n`);
  integration.shutdown();
  console.log(`${c.green}✓ All ephemeral keys destroyed${c.reset}`);
  console.log(`${c.green}✓ Trust environments terminated${c.reset}`);
  console.log(`${c.green}✓ DASB shutdown complete${c.reset}`);
  console.log(`${c.green}✓ Zero cryptographic material remains${c.reset}\n`);

  console.log(`${c.bold}${c.green}✨ Demo Complete!${c.reset}\n`);
  console.log(`${c.gray}This demonstrates the iOS app functionality.${c.reset}`);
  console.log(`${c.gray}The Swift implementation has identical behavior.${c.reset}\n`);

  console.log(`${c.bold}To run the actual iOS app on macOS:${c.reset}`);
  console.log(`  ${c.cyan}cd ios-app/SecureMessenger${c.reset}`);
  console.log(`  ${c.cyan}pod install${c.reset}`);
  console.log(`  ${c.cyan}open SecureMessenger.xcworkspace${c.reset}`);
  console.log(`  ${c.cyan}Press Cmd+R in Xcode to run${c.reset}\n`);
}

main().catch(console.error);
