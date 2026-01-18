/**
 * Signal + KnectIQ SelectiveTRUST® Integration
 *
 * Integrates Signal messaging with KnectIQ's patented SelectiveTRUST®
 * architecture for ephemeral trust management.
 *
 * Architecture based on KnectIQ patents:
 * - DASB (Device Access Service Broker) manages trust environments
 * - Devices use SDK to construct ephemeral keys locally
 * - Data encrypted at device, travels via separate pathways
 * - No PKI dependency, no centralized key storage
 * - Real-time trust validation for every transaction
 *
 * This enhances Signal's E2E encryption with an additional layer of
 * ephemeral trust management and device-constructed single-use keys.
 */

import {
  DeviceAccessServiceBroker,
  DASBConfig,
  DeviceProvisionRequest
} from '../core/DeviceAccessServiceBroker';
import { TrustEnvironmentConfig } from '../core/TrustEnvironment';
import { DeviceSDK, SecureDataPackage } from '../core/DeviceSDK';

export interface SignalMessage {
  messageId: string;
  sender: string;
  recipient: string;
  content: string;
  timestamp: number;
}

export interface SignalDevice {
  deviceId: string;
  phoneNumber: string;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  capabilities: string[];
}

export interface IntegrationConfig {
  trustEnvironmentName: string;
  maxDevices?: number;
  sessionTimeout?: number;
  requiredTrustScore?: number;
  fipsMode?: boolean;
}

/**
 * Signal + KnectIQ SelectiveTRUST® Integration
 *
 * Main integration class that sets up SelectiveTRUST® architecture
 * for Signal messaging with ephemeral keys and sovereign trust.
 */
export class SignalKnectIQIntegration {
  private dasb: DeviceAccessServiceBroker;
  private trustEnvironmentId: string;
  private localDeviceSDK: DeviceSDK | null = null;
  private localDeviceId: string;
  private remoteDevices: Map<string, { sdk: DeviceSDK; phoneNumber: string }> = new Map();

  constructor(localDevice: SignalDevice, config: IntegrationConfig) {
    this.localDeviceId = localDevice.deviceId;
    this.trustEnvironmentId = `signal-${config.trustEnvironmentName}`;

    // Initialize DASB (Device Access Service Broker)
    const dasbConfig: DASBConfig = {
      dasbId: `dasb-${localDevice.deviceId}`,
      mode: config.fipsMode ? 'fips-140-2' : 'standard',
      maxTrustEnvironments: 10,
      auditLogging: true
    };

    this.dasb = new DeviceAccessServiceBroker(dasbConfig);

    // Create Trust Environment for Signal messaging
    const trustEnvConfig: TrustEnvironmentConfig = {
      name: config.trustEnvironmentName,
      maxDevices: config.maxDevices || 100,
      sessionTimeout: config.sessionTimeout || 3600000, // 1 hour default
      requiredTrustScore: config.requiredTrustScore || 80,
      allowedOperations: new Set(['send', 'receive', 'read'])
    };

    this.dasb.createTrustEnvironment(this.trustEnvironmentId, trustEnvConfig);

    // Provision local device
    this.provisionLocalDevice(localDevice);
  }

  /**
   * Provision the local Signal device
   */
  private async provisionLocalDevice(device: SignalDevice): Promise<void> {
    const provisionRequest: DeviceProvisionRequest = {
      deviceId: device.deviceId,
      deviceType: device.deviceType,
      trustEnvironmentId: this.trustEnvironmentId,
      capabilities: ['encrypt', 'decrypt', 'sign', 'verify', ...device.capabilities]
    };

    this.localDeviceSDK = await this.dasb.provisionDevice(provisionRequest);
  }

  /**
   * Add a trusted Signal contact
   *
   * Provisions the remote device and establishes trust relationship
   */
  public async addTrustedContact(
    contactDevice: SignalDevice
  ): Promise<void> {
    if (!this.localDeviceSDK) {
      throw new Error('Local device not provisioned');
    }

    // Provision remote device
    const provisionRequest: DeviceProvisionRequest = {
      deviceId: contactDevice.deviceId,
      deviceType: contactDevice.deviceType,
      trustEnvironmentId: this.trustEnvironmentId,
      capabilities: ['encrypt', 'decrypt', 'sign', 'verify', ...contactDevice.capabilities]
    };

    const remoteSDK = await this.dasb.provisionDevice(provisionRequest);

    // Establish trust relationship via DASB
    await this.dasb.establishTrustRelationship(
      this.localDeviceId,
      contactDevice.deviceId,
      this.trustEnvironmentId
    );

    // Store remote device info
    this.remoteDevices.set(contactDevice.deviceId, {
      sdk: remoteSDK,
      phoneNumber: contactDevice.phoneNumber
    });
  }

  /**
   * Send secure Signal message with ephemeral encryption
   *
   * Process:
   * 1. Construct ephemeral key AT THE LOCAL DEVICE (not centrally)
   * 2. Encrypt message locally with single-use key
   * 3. Key is destroyed immediately after encryption
   * 4. Encrypted data travels via Signal's pathways
   * 5. SelectiveTRUST provides trust management, not data transport
   */
  public async sendMessage(
    recipientDeviceId: string,
    message: string
  ): Promise<SecureDataPackage> {
    if (!this.localDeviceSDK) {
      throw new Error('Local device not provisioned');
    }

    const remoteDevice = this.remoteDevices.get(recipientDeviceId);

    if (!remoteDevice) {
      throw new Error(`Recipient ${recipientDeviceId} not in trusted contacts`);
    }

    // Validate trust relationship before sending
    const trustEnv = this.dasb.getTrustEnvironment(this.trustEnvironmentId);
    if (!trustEnv) {
      throw new Error('Trust environment not found');
    }

    // Real-time trust validation
    const relationships = trustEnv.getDeviceRelationships(this.localDeviceId);
    const hasValidRelationship = relationships.some(
      r => (r.deviceA === recipientDeviceId || r.deviceB === recipientDeviceId) && r.active
    );

    if (!hasValidRelationship) {
      throw new Error('No valid trust relationship with recipient');
    }

    // Construct ephemeral key AT THIS DEVICE (core patent concept)
    const ephemeralKeyId = this.localDeviceSDK.constructEphemeralKey();

    // Encrypt message locally using device SDK
    const messageBuffer = Buffer.from(message, 'utf8');
    const securePackage = this.localDeviceSDK.encryptData(
      messageBuffer,
      recipientDeviceId,
      ephemeralKeyId
    );

    // Note: At this point, the ephemeral key is already destroyed
    // The encrypted package would now travel via Signal's infrastructure
    // SelectiveTRUST does NOT touch or see the encrypted data

    return securePackage;
  }

  /**
   * Receive and decrypt secure Signal message
   *
   * Process:
   * 1. Receive encrypted package via Signal infrastructure
   * 2. Validate trust relationship
   * 3. Decrypt AT THE LOCAL DEVICE using ephemeral key reconstruction
   * 4. Return plaintext message
   */
  public async receiveMessage(
    securePackage: SecureDataPackage
  ): Promise<SignalMessage> {
    if (!this.localDeviceSDK) {
      throw new Error('Local device not provisioned');
    }

    // Validate sender is in trusted contacts
    if (!this.remoteDevices.has(securePackage.sourceDeviceId)) {
      throw new Error(`Sender ${securePackage.sourceDeviceId} not in trusted contacts`);
    }

    // Real-time trust validation
    const trustEnv = this.dasb.getTrustEnvironment(this.trustEnvironmentId);
    if (!trustEnv) {
      throw new Error('Trust environment not found');
    }

    const relationships = trustEnv.getDeviceRelationships(this.localDeviceId);
    const hasValidRelationship = relationships.some(
      r => (r.deviceA === securePackage.sourceDeviceId || r.deviceB === securePackage.sourceDeviceId) && r.active
    );

    if (!hasValidRelationship) {
      throw new Error('No valid trust relationship with sender');
    }

    // Decrypt at local device
    const decryptedBuffer = this.localDeviceSDK.decryptData(securePackage);
    const messageContent = decryptedBuffer.toString('utf8');

    const message: SignalMessage = {
      messageId: securePackage.packageId,
      sender: securePackage.sourceDeviceId,
      recipient: this.localDeviceId,
      content: messageContent,
      timestamp: securePackage.timestamp
    };

    return message;
  }

  /**
   * Remove a trusted contact
   *
   * Revokes trust relationship and deprovisions device
   */
  public async removeTrustedContact(contactDeviceId: string): Promise<void> {
    // Find and revoke trust relationship
    const trustEnv = this.dasb.getTrustEnvironment(this.trustEnvironmentId);
    if (trustEnv) {
      const relationships = trustEnv.getDeviceRelationships(this.localDeviceId);
      for (const relationship of relationships) {
        if (relationship.deviceA === contactDeviceId || relationship.deviceB === contactDeviceId) {
          this.dasb.revokeTrustRelationship(relationship.relationshipId);
        }
      }
    }

    // Remove from local cache
    this.remoteDevices.delete(contactDeviceId);

    // Deprovision device
    await this.dasb.deprovisionDevice(contactDeviceId);
  }

  /**
   * Get security metrics and monitoring data
   */
  public getSecurityMetrics(): {
    localDevice: any;
    trustedContacts: number;
    dasbStatistics: any;
    trustEnvironment: any;
  } {
    const localStats = this.localDeviceSDK?.getStatistics() || null;
    const dasbStats = this.dasb.getStatistics();
    const trustEnv = this.dasb.getTrustEnvironment(this.trustEnvironmentId);
    const trustEnvStats = trustEnv?.getStatistics() || null;

    return {
      localDevice: localStats,
      trustedContacts: this.remoteDevices.size,
      dasbStatistics: dasbStats,
      trustEnvironment: trustEnvStats
    };
  }

  /**
   * Get audit log from DASB
   */
  public getAuditLog(): Array<{ timestamp: number; event: string; details: any }> {
    return this.dasb.getAuditLog();
  }

  /**
   * Validate a contact's trust status
   */
  public validateContactTrust(contactDeviceId: string): boolean {
    const trustEnv = this.dasb.getTrustEnvironment(this.trustEnvironmentId);
    if (!trustEnv) {
      return false;
    }

    const relationships = trustEnv.getDeviceRelationships(this.localDeviceId);
    return relationships.some(
      r => (r.deviceA === contactDeviceId || r.deviceB === contactDeviceId) && r.active
    );
  }

  /**
   * Update contact trust score
   */
  public updateContactTrustScore(contactDeviceId: string, newScore: number): void {
    const trustEnv = this.dasb.getTrustEnvironment(this.trustEnvironmentId);
    if (trustEnv) {
      trustEnv.updateDeviceTrustScore(contactDeviceId, newScore);
    }
  }

  /**
   * Get list of trusted contacts
   */
  public getTrustedContacts(): Array<{ deviceId: string; phoneNumber: string }> {
    return Array.from(this.remoteDevices.entries()).map(([deviceId, info]) => ({
      deviceId,
      phoneNumber: info.phoneNumber
    }));
  }

  /**
   * Shutdown integration
   *
   * Properly cleans up all resources and destroys all ephemeral keys
   */
  public shutdown(): void {
    // Shutdown local device SDK
    if (this.localDeviceSDK) {
      this.localDeviceSDK.shutdown();
    }

    // Shutdown all remote device SDKs
    for (const { sdk } of this.remoteDevices.values()) {
      sdk.shutdown();
    }

    // Shutdown DASB (handles trust environments)
    this.dasb.shutdown();

    // Clear caches
    this.remoteDevices.clear();
  }
}
