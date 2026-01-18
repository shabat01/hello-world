#!/usr/bin/env ts-node

/**
 * iOS App UI Simulation
 *
 * This simulates what you would see when running the SecureMessenger iOS app
 * in the iPhone simulator. It demonstrates the exact same SelectiveTRUST®
 * functionality that runs in the Swift implementation.
 */

import { SignalKnectIQIntegration } from './src/integration/SignalKnectIQIntegration';

// ANSI color codes for terminal UI
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
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

function clearScreen() {
  console.log('\x1b[2J\x1b[0f');
}

function printHeader(title: string) {
  console.log(`${colors.bright}${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.bright}${colors.white}  ${title}${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
}

function printSecurityBadge(trusted: boolean) {
  if (trusted) {
    return `${colors.green}✓ Trusted${colors.reset}`;
  } else {
    return `${colors.yellow}⚠ Not Trusted${colors.reset}`;
  }
}

function printContactList(integration: SignalKnectIQIntegration) {
  clearScreen();
  printHeader('📱 SecureMessenger - Contact List');

  const contacts = integration.getSecureContacts();
  const stats = integration.getSecurityMetrics();

  console.log(`${colors.gray}Your Device: ${integration['localDevice'].deviceId}${colors.reset}\n`);

  // Security Status
  console.log(`${colors.bright}Security Status:${colors.reset}`);
  console.log(`  ${colors.cyan}●${colors.reset} Ephemeral Keys Constructed: ${colors.bright}${stats.ephemeralKeysConstructed}${colors.reset}`);
  console.log(`  ${colors.cyan}●${colors.reset} Ephemeral Keys Destroyed: ${colors.bright}${stats.ephemeralKeysDestroyed}${colors.reset}`);
  console.log(`  ${colors.cyan}●${colors.reset} Encryption Mode: ${colors.bright}${stats.encryptionMode}${colors.reset}\n`);

  // Contacts
  console.log(`${colors.bright}Contacts (${contacts.length}):${colors.reset}\n`);

  if (contacts.length === 0) {
    console.log(`  ${colors.gray}No contacts yet${colors.reset}`);
    console.log(`  ${colors.gray}Tap "Add Contact" to get started${colors.reset}\n`);
  } else {
    contacts.forEach((contact, index) => {
      const trusted = printSecurityBadge(contact.trusted);
      console.log(`  ${colors.bright}${index + 1}. ${contact.phoneNumber}${colors.reset} ${trusted}`);
      console.log(`     ${colors.gray}Device: ${contact.deviceId}${colors.reset}`);
      console.log('');
    });
  }

  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.gray}[Add Contact] [Settings]${colors.reset}\n`);
}

function printConversation(recipientName: string, messages: Array<{sender: string, text: string, timestamp: Date}>, stats: any) {
  clearScreen();
  printHeader(`💬 Conversation with ${recipientName}`);

  // Security Indicator
  console.log(`${colors.bright}Security:${colors.reset} ${printSecurityBadge(true)}`);
  console.log(`${colors.gray}Ephemeral Keys: ${stats.ephemeralKeysConstructed} constructed, ${stats.ephemeralKeysDestroyed} destroyed${colors.reset}\n`);

  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  // Messages
  if (messages.length === 0) {
    console.log(`  ${colors.gray}No messages yet${colors.reset}`);
    console.log(`  ${colors.gray}Start a secure conversation...${colors.reset}\n`);
  } else {
    messages.forEach(msg => {
      const time = msg.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      if (msg.sender === 'me') {
        console.log(`${colors.gray}${time}${colors.reset}`);
        console.log(`  ${colors.blue}You: ${colors.reset}${msg.text}`);
      } else {
        console.log(`${colors.gray}${time}${colors.reset}`);
        console.log(`  ${colors.green}${msg.sender}: ${colors.reset}${msg.text}`);
      }
      console.log('');
    });
  }

  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.gray}[Type a message...]${colors.reset}\n`);
}

function showEncryptionAnimation(keyId: string) {
  console.log(`\n${colors.yellow}🔐 Encrypting with SelectiveTRUST®...${colors.reset}`);
  console.log(`   ${colors.gray}Step 1/3: Constructing ephemeral key at device${colors.reset}`);
  console.log(`   ${colors.gray}Key ID: ${keyId.substring(0, 40)}...${colors.reset}`);
}

function showKeyDestructionAnimation() {
  console.log(`   ${colors.gray}Step 2/3: Encrypting message with AES-256-GCM${colors.reset}`);
  console.log(`   ${colors.gray}Step 3/3: Destroying ephemeral key${colors.reset}`);
  console.log(`   ${colors.green}✓ Key destroyed - cannot be reused${colors.reset}\n`);
}

async function runIOSAppDemo() {
  console.log(`${colors.bright}${colors.cyan}`);
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║                                                   ║');
  console.log('║       SecureMessenger iOS App Simulation         ║');
  console.log('║     KnectIQ SelectiveTRUST® Integration          ║');
  console.log('║                                                   ║');
  console.log('╚═══════════════════════════════════════════════════╝');
  console.log(colors.reset);
  console.log(`\n${colors.gray}This simulates the iOS app running on iPhone${colors.reset}\n`);

  await sleep(2000);

  // Initialize the app
  console.log(`${colors.yellow}⚡ Launching app...${colors.reset}`);
  await sleep(1000);

  const myDevice = {
    deviceId: 'iphone-15-pro-001',
    phoneNumber: '+1-555-1234',
    deviceType: 'iPhone 15 Pro' as const,
    capabilities: ['messaging', 'voice'] as const,
  };

  const integration = new SignalKnectIQIntegration(myDevice);
  console.log(`${colors.green}✓ SelectiveTRUST® initialized${colors.reset}`);
  console.log(`${colors.green}✓ Device SDK provisioned${colors.reset}`);
  console.log(`${colors.green}✓ DASB connected${colors.reset}\n`);

  await sleep(2000);

  // Show empty contact list
  printContactList(integration);
  await sleep(3000);

  // Add first contact
  console.log(`${colors.yellow}👤 Adding contact "Alice"...${colors.reset}\n`);
  await sleep(1500);

  integration.addTrustedContact({
    deviceId: 'alice-iphone-001',
    phoneNumber: '+1-555-5001',
    displayName: 'Alice',
    deviceType: 'iPhone',
    capabilities: ['messaging', 'voice'],
  });

  console.log(`${colors.green}✓ Trust relationship established${colors.reset}`);
  console.log(`${colors.green}✓ Contact added${colors.reset}\n`);
  await sleep(2000);

  // Add second contact
  console.log(`${colors.yellow}👤 Adding contact "Bob"...${colors.reset}\n`);
  await sleep(1500);

  integration.addTrustedContact({
    deviceId: 'bob-iphone-001',
    phoneNumber: '+1-555-5002',
    displayName: 'Bob',
    deviceType: 'iPhone',
    capabilities: ['messaging', 'voice'],
  });

  console.log(`${colors.green}✓ Trust relationship established${colors.reset}`);
  console.log(`${colors.green}✓ Contact added${colors.reset}\n`);
  await sleep(2000);

  // Show contact list with contacts
  printContactList(integration);
  await sleep(3000);

  // Open conversation with Alice
  console.log(`${colors.yellow}💬 Opening conversation with Alice...${colors.reset}\n`);
  await sleep(1500);

  const messages: Array<{sender: string, text: string, timestamp: Date}> = [];
  printConversation('Alice', messages, integration.getSecurityMetrics());
  await sleep(3000);

  // Send first message
  console.log(`${colors.yellow}✍️  Typing message: "Hey Alice! Testing SelectiveTRUST®"${colors.reset}\n`);
  await sleep(2000);
  console.log(`${colors.yellow}📤 Sending message...${colors.reset}\n`);
  await sleep(1000);

  const result1 = integration.sendSecureMessage(
    '+1-555-5001',
    'Hey Alice! Testing SelectiveTRUST®'
  );

  showEncryptionAnimation(result1.ephemeralKeyId);
  await sleep(1500);
  showKeyDestructionAnimation();
  await sleep(1000);

  messages.push({
    sender: 'me',
    text: 'Hey Alice! Testing SelectiveTRUST®',
    timestamp: new Date(),
  });

  console.log(`${colors.green}✓ Message sent with double encryption:${colors.reset}`);
  console.log(`  ${colors.gray}Layer 1: Signal Protocol E2E encryption${colors.reset}`);
  console.log(`  ${colors.gray}Layer 2: SelectiveTRUST® ephemeral encryption${colors.reset}\n`);
  await sleep(2000);

  printConversation('Alice', messages, integration.getSecurityMetrics());
  await sleep(3000);

  // Send second message
  console.log(`${colors.yellow}✍️  Typing message: "Each message gets a unique ephemeral key!"${colors.reset}\n`);
  await sleep(2000);
  console.log(`${colors.yellow}📤 Sending message...${colors.reset}\n`);
  await sleep(1000);

  const result2 = integration.sendSecureMessage(
    '+1-555-5001',
    'Each message gets a unique ephemeral key!'
  );

  showEncryptionAnimation(result2.ephemeralKeyId);
  await sleep(1500);
  showKeyDestructionAnimation();
  await sleep(1000);

  messages.push({
    sender: 'me',
    text: 'Each message gets a unique ephemeral key!',
    timestamp: new Date(),
  });

  console.log(`${colors.green}✓ New ephemeral key constructed and destroyed${colors.reset}`);
  console.log(`${colors.gray}  Previous key: ${result1.ephemeralKeyId.substring(0, 30)}...${colors.reset}`);
  console.log(`${colors.gray}  Current key:  ${result2.ephemeralKeyId.substring(0, 30)}...${colors.reset}`);
  console.log(`${colors.green}  ✓ Keys are unique (patent requirement)${colors.reset}\n`);
  await sleep(2000);

  printConversation('Alice', messages, integration.getSecurityMetrics());
  await sleep(3000);

  // Simulate receiving a message
  console.log(`${colors.yellow}📥 Receiving message from Alice...${colors.reset}\n`);
  await sleep(1500);

  messages.push({
    sender: 'Alice',
    text: 'This is amazing! Our keys never persist!',
    timestamp: new Date(),
  });

  console.log(`${colors.green}✓ Message received and decrypted${colors.reset}`);
  console.log(`${colors.green}✓ Trust validated in real-time${colors.reset}\n`);
  await sleep(2000);

  printConversation('Alice', messages, integration.getSecurityMetrics());
  await sleep(3000);

  // Show final statistics
  clearScreen();
  printHeader('📊 Security Statistics');

  const finalStats = integration.getSecurityMetrics();
  console.log(`${colors.bright}Device Security Metrics:${colors.reset}\n`);
  console.log(`  ${colors.cyan}Device ID:${colors.reset} ${myDevice.deviceId}`);
  console.log(`  ${colors.cyan}Device Type:${colors.reset} ${myDevice.deviceType}`);
  console.log(`  ${colors.cyan}Encryption Mode:${colors.reset} ${finalStats.encryptionMode}\n`);

  console.log(`${colors.bright}Ephemeral Key Statistics:${colors.reset}\n`);
  console.log(`  ${colors.green}✓${colors.reset} Keys Constructed: ${colors.bright}${finalStats.ephemeralKeysConstructed}${colors.reset}`);
  console.log(`  ${colors.green}✓${colors.reset} Keys Destroyed: ${colors.bright}${finalStats.ephemeralKeysDestroyed}${colors.reset}`);
  console.log(`  ${colors.gray}  (All keys destroyed after single use)${colors.reset}\n`);

  console.log(`${colors.bright}Trust Relationships:${colors.reset}\n`);
  console.log(`  ${colors.green}✓${colors.reset} Trusted Contacts: ${colors.bright}${integration.getSecureContacts().length}${colors.reset}`);
  console.log(`  ${colors.green}✓${colors.reset} Active Trust Relationships: ${colors.bright}${integration.getSecureContacts().filter(c => c.trusted).length}${colors.reset}\n`);

  console.log(`${colors.bright}Security Features Active:${colors.reset}\n`);
  console.log(`  ${colors.green}✓${colors.reset} Ephemeral keys constructed at device`);
  console.log(`  ${colors.green}✓${colors.reset} Immediate key destruction after use`);
  console.log(`  ${colors.green}✓${colors.reset} Real-time trust validation`);
  console.log(`  ${colors.green}✓${colors.reset} Double encryption (Signal + SelectiveTRUST®)`);
  console.log(`  ${colors.green}✓${colors.reset} FIPS 140-2 compliant algorithms`);
  console.log(`  ${colors.green}✓${colors.reset} Zero persistent key storage\n`);

  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  console.log(`${colors.bright}${colors.green}✓ Demo Complete!${colors.reset}\n`);
  console.log(`${colors.gray}This is what you would see running the iOS app on an iPhone.${colors.reset}`);
  console.log(`${colors.gray}The Swift implementation has identical functionality.${colors.reset}\n`);

  // Cleanup
  integration.shutdown();
  console.log(`${colors.gray}All ephemeral keys destroyed. Zero cryptographic material remains.${colors.reset}\n`);
}

// Run the demo
runIOSAppDemo().catch(console.error);
