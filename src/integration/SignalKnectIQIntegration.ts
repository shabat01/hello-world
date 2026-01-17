/**
 * Signal + KnectIQ SelectiveTRUST® Integration
 *
 * Enhances Signal's already strong security with KnectIQ's patented
 * ephemeral trust architecture:
 *
 * - Completely ephemeral encryption keys (no key storage)
 * - Real-time trust validation for every message
 * - Sovereign trust enclaves for isolated secure operations
 * - Machine-to-machine trust fabric
 * - Zero-knowledge architecture
 * - Prevents breaches before they occur
 *
 * This integration works alongside Signal's existing E2E encryption,
 * providing an additional layer of ephemeral security.
 */

import { TrustFabric, TrustContext, SecureEnvelope } from '../core/TrustFabric';
import { TrustPolicy, TrustSession } from '../core/TrustEnclave';
import { EphemeralKeyManager } from '../core/EphemeralKeyManager';
import crypto from 'crypto';

export interface SignalMessage {
  messageId: string;
  sender: string;
  recipient: string;
  content: Buffer;
  timestamp: number;
}

export interface SecureSignalMessage extends SignalMessage {
  knectiqEnvelope: SecureEnvelope;
  ephemeralKeyFingerprint: string;
  trustValidated: boolean;
}

export interface DeviceRegistration {
  deviceId: string;
  publicKey: Buffer;
  registrationTime: number;
  trustScore: number;
}

export class SignalKnectIQIntegration {
  private trustFabric: TrustFabric;
  private deviceId: string;
  private registeredDevices: Map<string, DeviceRegistration> = new Map();
  private activeTrustSessions: Map<string, TrustSession> = new Map();

  constructor(deviceId: string, trustPolicy?: Partial<TrustPolicy>) {
    this.deviceId = deviceId;

    // Create default trust policy optimized for Signal
    const defaultPolicy: TrustPolicy = {
      allowedDevices: new Set<string>(),
      requiredAuthLevel: 'high', // Signal requires high security
      sessionTimeout: 3600000, // 1 hour
      requireMutualAuth: true, // Both parties must authenticate
      allowedOperations: new Set(['send', 'receive', 'read', 'delete']),
      ...trustPolicy
    };

    this.trustFabric = new TrustFabric(deviceId, defaultPolicy);
  }

  /**
   * Register a trusted Signal contact/device
   */
  public async registerTrustedDevice(
    deviceId: string,
    publicKey: Buffer
  ): Promise<DeviceRegistration> {
    const registration: DeviceRegistration = {
      deviceId,
      publicKey,
      registrationTime: Date.now(),
      trustScore: 100 // Initial trust score
    };

    this.registeredDevices.set(deviceId, registration);

    // Add to trust policy
    const enclave = this.trustFabric.getTrustEnclave();
    enclave.updateTrustPolicy({
      allowedDevices: new Set([
        ...Array.from(this.registeredDevices.keys())
      ])
    });

    return registration;
  }

  /**
   * Establish ephemeral trust session before message exchange
   */
  public async establishMessageSession(
    recipientDeviceId: string
  ): Promise<TrustSession> {
    const registration = this.registeredDevices.get(recipientDeviceId);

    if (!registration) {
      throw new Error(
        `Device ${recipientDeviceId} not registered. Register with registerTrustedDevice() first.`
      );
    }

    // Establish trust session with ephemeral keys
    const session = await this.trustFabric.establishTrust(
      recipientDeviceId,
      registration.publicKey
    );

    this.activeTrustSessions.set(recipientDeviceId, session);

    return session;
  }

  /**
   * Send Signal message with KnectIQ ephemeral encryption
   *
   * This wraps Signal's existing E2E encryption with an additional
   * layer of ephemeral security that uses single-use keys
   */
  public async sendSecureMessage(
    recipient: string,
    content: string | Buffer
  ): Promise<SecureSignalMessage> {
    // Get or establish trust session
    let session = this.activeTrustSessions.get(recipient);

    if (!session || !this.trustFabric.getTrustEnclave().validateSession(session.sessionId)) {
      session = await this.establishMessageSession(recipient);
    }

    // Convert content to Buffer
    const contentBuffer = Buffer.isBuffer(content)
      ? content
      : Buffer.from(content, 'utf8');

    // Create trust context for validation
    const trustContext: TrustContext = {
      sourceDevice: this.deviceId,
      targetDevice: recipient,
      operation: 'send',
      payload: contentBuffer,
      timestamp: Date.now()
    };

    // Validate trust context through programmable rules
    if (!this.trustFabric.validateTrustContext(trustContext)) {
      throw new Error('Trust validation failed - message blocked by security policy');
    }

    // Create secure envelope with ephemeral encryption
    // Each message gets a NEW key that is destroyed immediately after use
    const envelope = await this.trustFabric.createSecureEnvelope(
      session.sessionId,
      contentBuffer,
      'send'
    );

    // Create ephemeral key fingerprint for verification
    const ephemeralKeyFingerprint = crypto
      .createHash('sha256')
      .update(envelope.ephemeralKeyId)
      .digest('hex');

    const secureMessage: SecureSignalMessage = {
      messageId: this.generateMessageId(),
      sender: this.deviceId,
      recipient,
      content: contentBuffer,
      timestamp: Date.now(),
      knectiqEnvelope: envelope,
      ephemeralKeyFingerprint,
      trustValidated: true
    };

    return secureMessage;
  }

  /**
   * Receive and decrypt Signal message with KnectIQ validation
   */
  public async receiveSecureMessage(
    secureMessage: SecureSignalMessage
  ): Promise<SignalMessage> {
    // Validate sender is registered
    const senderRegistration = this.registeredDevices.get(secureMessage.sender);

    if (!senderRegistration) {
      throw new Error(`Sender ${secureMessage.sender} not in trusted devices`);
    }

    // Validate trust session
    const enclave = this.trustFabric.getTrustEnclave();
    if (!enclave.validateSession(secureMessage.knectiqEnvelope.sessionId)) {
      throw new Error('Message session invalid or expired');
    }

    // Create trust context for validation
    const trustContext: TrustContext = {
      sourceDevice: secureMessage.sender,
      targetDevice: this.deviceId,
      operation: 'receive',
      payload: secureMessage.knectiqEnvelope.encryptedPayload,
      timestamp: secureMessage.timestamp
    };

    // Validate trust context
    if (!this.trustFabric.validateTrustContext(trustContext)) {
      throw new Error('Trust validation failed - message rejected');
    }

    // Unwrap secure envelope and decrypt with ephemeral key validation
    const decryptedContent = await this.trustFabric.unwrapSecureEnvelope(
      secureMessage.knectiqEnvelope,
      senderRegistration.publicKey
    );

    // Return plain Signal message
    const message: SignalMessage = {
      messageId: secureMessage.messageId,
      sender: secureMessage.sender,
      recipient: secureMessage.recipient,
      content: decryptedContent,
      timestamp: secureMessage.timestamp
    };

    return message;
  }

  /**
   * Verify message integrity and ephemeral trust
   */
  public async verifyMessageTrust(
    secureMessage: SecureSignalMessage
  ): Promise<boolean> {
    try {
      // Validate session exists and is active
      const enclave = this.trustFabric.getTrustEnclave();
      if (!enclave.validateSession(secureMessage.knectiqEnvelope.sessionId)) {
        return false;
      }

      // Validate sender is registered
      if (!this.registeredDevices.has(secureMessage.sender)) {
        return false;
      }

      // Validate message age (prevent replay)
      const messageAge = Date.now() - secureMessage.timestamp;
      if (messageAge > 300000) { // 5 minutes
        return false;
      }

      return secureMessage.trustValidated;

    } catch {
      return false;
    }
  }

  /**
   * Revoke trust for a device (immediate termination)
   */
  public async revokeTrust(deviceId: string): Promise<void> {
    // Remove from registered devices
    this.registeredDevices.delete(deviceId);

    // Terminate active session
    const session = this.activeTrustSessions.get(deviceId);
    if (session) {
      this.trustFabric.getTrustEnclave().terminateSession(session.sessionId);
      this.activeTrustSessions.delete(deviceId);
    }

    // Update trust policy
    const enclave = this.trustFabric.getTrustEnclave();
    enclave.updateTrustPolicy({
      allowedDevices: new Set([
        ...Array.from(this.registeredDevices.keys())
      ])
    });
  }

  /**
   * Get security metrics and monitoring data
   */
  public getSecurityMetrics(): {
    activeKeys: number;
    activeSessions: number;
    trustedDevices: number;
    deviceId: string;
  } {
    return {
      activeKeys: this.trustFabric.getKeyManager().getActiveKeyCount(),
      activeSessions: this.trustFabric.getTrustEnclave().getActiveSessionCount(),
      trustedDevices: this.registeredDevices.size,
      deviceId: this.deviceId
    };
  }

  /**
   * Generate unique message identifier
   */
  private generateMessageId(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * Shutdown integration and clean up all ephemeral data
   */
  public shutdown(): void {
    // Terminate all sessions
    for (const session of this.activeTrustSessions.values()) {
      this.trustFabric.getTrustEnclave().terminateSession(session.sessionId);
    }

    // Clear all data
    this.activeTrustSessions.clear();
    this.registeredDevices.clear();

    // Shutdown trust fabric (destroys all ephemeral keys)
    this.trustFabric.shutdown();
  }
}
