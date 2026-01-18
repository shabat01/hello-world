/**
 * KnectIQ SelectiveTRUST® - Device Access Service Broker (DASB)
 *
 * The DASB is the control plane software that manages Trust Environments.
 * It manages collections of trust relationships between provisioned devices
 * without touching or seeing the encrypted data that travels between them.
 *
 * Key Principles from KnectIQ Patents:
 * - Control plane separate from data plane
 * - Manages trust, not data flow
 * - No PKI dependency
 * - Ephemeral keys constructed at device, not centrally
 * - FIPS 140-2 validated operation
 */

import crypto from 'crypto';
import { TrustEnvironment, TrustEnvironmentConfig } from './TrustEnvironment';
import { DeviceSDK } from './DeviceSDK';

export interface DASBConfig {
  dasbId: string;
  mode: 'fips-140-2' | 'standard';
  maxTrustEnvironments: number;
  auditLogging: boolean;
}

export interface DeviceProvisionRequest {
  deviceId: string;
  deviceType: string;
  trustEnvironmentId: string;
  capabilities: string[];
}

export interface TrustRelationship {
  relationshipId: string;
  deviceA: string;
  deviceB: string;
  trustEnvironmentId: string;
  established: number;
  validated: boolean;
  trustScore: number;
}

/**
 * Device Access Service Broker
 *
 * Core control plane component that manages trust environments
 * and device relationships without accessing encrypted data.
 */
export class DeviceAccessServiceBroker {
  private config: DASBConfig;
  private trustEnvironments: Map<string, TrustEnvironment> = new Map();
  private provisionedDevices: Map<string, DeviceSDK> = new Map();
  private trustRelationships: Map<string, TrustRelationship> = new Map();
  private auditLog: Array<{ timestamp: number; event: string; details: any }> = [];

  constructor(config: DASBConfig) {
    this.config = config;
    this.logAudit('dasb_initialized', { dasbId: config.dasbId, mode: config.mode });
  }

  /**
   * Create a new Trust Environment
   *
   * Trust Environments manage collections of trust relationships
   * between provisioned devices.
   */
  public createTrustEnvironment(
    environmentId: string,
    config: TrustEnvironmentConfig
  ): TrustEnvironment {
    if (this.trustEnvironments.size >= this.config.maxTrustEnvironments) {
      throw new Error('Maximum trust environments reached');
    }

    if (this.trustEnvironments.has(environmentId)) {
      throw new Error(`Trust environment ${environmentId} already exists`);
    }

    const trustEnv = new TrustEnvironment(environmentId, config, this.config.mode);
    this.trustEnvironments.set(environmentId, trustEnv);

    this.logAudit('trust_environment_created', {
      environmentId,
      config
    });

    return trustEnv;
  }

  /**
   * Provision a device into a Trust Environment
   *
   * Once provisioned, the device uses the KnectIQ SDK to participate
   * in the trust environment.
   */
  public async provisionDevice(request: DeviceProvisionRequest): Promise<DeviceSDK> {
    const trustEnv = this.trustEnvironments.get(request.trustEnvironmentId);

    if (!trustEnv) {
      throw new Error(`Trust environment ${request.trustEnvironmentId} not found`);
    }

    if (this.provisionedDevices.has(request.deviceId)) {
      throw new Error(`Device ${request.deviceId} already provisioned`);
    }

    // Create SDK instance for the device
    const deviceSDK = new DeviceSDK(
      request.deviceId,
      request.deviceType,
      request.capabilities,
      this.config.mode
    );

    // Register device with trust environment
    await trustEnv.registerDevice(request.deviceId, deviceSDK.getPublicIdentity());

    // Store provisioned device
    this.provisionedDevices.set(request.deviceId, deviceSDK);

    this.logAudit('device_provisioned', {
      deviceId: request.deviceId,
      trustEnvironmentId: request.trustEnvironmentId
    });

    return deviceSDK;
  }

  /**
   * Establish trust relationship between two devices
   *
   * Creates a managed trust relationship within a Trust Environment.
   * The DASB manages the relationship metadata, while actual
   * encryption keys are constructed at the devices.
   */
  public async establishTrustRelationship(
    deviceIdA: string,
    deviceIdB: string,
    trustEnvironmentId: string
  ): Promise<TrustRelationship> {
    const trustEnv = this.trustEnvironments.get(trustEnvironmentId);

    if (!trustEnv) {
      throw new Error(`Trust environment ${trustEnvironmentId} not found`);
    }

    const deviceA = this.provisionedDevices.get(deviceIdA);
    const deviceB = this.provisionedDevices.get(deviceIdB);

    if (!deviceA || !deviceB) {
      throw new Error('Both devices must be provisioned before establishing trust');
    }

    // Validate devices are in the same trust environment
    if (!trustEnv.hasDevice(deviceIdA) || !trustEnv.hasDevice(deviceIdB)) {
      throw new Error('Both devices must be in the same trust environment');
    }

    // Create trust relationship
    const relationshipId = this.generateRelationshipId();
    const relationship: TrustRelationship = {
      relationshipId,
      deviceA: deviceIdA,
      deviceB: deviceIdB,
      trustEnvironmentId,
      established: Date.now(),
      validated: true,
      trustScore: 100 // Initial trust score
    };

    this.trustRelationships.set(relationshipId, relationship);

    // Notify trust environment
    await trustEnv.establishRelationship(deviceIdA, deviceIdB, relationshipId);

    this.logAudit('trust_relationship_established', {
      relationshipId,
      deviceA: deviceIdA,
      deviceB: deviceIdB,
      trustEnvironmentId
    });

    return relationship;
  }

  /**
   * Validate a trust relationship
   *
   * Real-time validation of trust relationships as per SelectiveTRUST®
   * "real-time validation for every communication/transaction"
   */
  public validateTrustRelationship(relationshipId: string): boolean {
    const relationship = this.trustRelationships.get(relationshipId);

    if (!relationship) {
      return false;
    }

    const trustEnv = this.trustEnvironments.get(relationship.trustEnvironmentId);

    if (!trustEnv) {
      return false;
    }

    // Validate both devices are still active in the environment
    const valid = trustEnv.validateRelationship(relationshipId);

    if (!valid) {
      relationship.validated = false;
    }

    this.logAudit('trust_relationship_validated', {
      relationshipId,
      valid
    });

    return valid;
  }

  /**
   * Revoke trust relationship
   *
   * Immediately terminates a trust relationship
   */
  public revokeTrustRelationship(relationshipId: string): void {
    const relationship = this.trustRelationships.get(relationshipId);

    if (relationship) {
      const trustEnv = this.trustEnvironments.get(relationship.trustEnvironmentId);

      if (trustEnv) {
        trustEnv.revokeRelationship(relationshipId);
      }

      this.trustRelationships.delete(relationshipId);

      this.logAudit('trust_relationship_revoked', { relationshipId });
    }
  }

  /**
   * Deprovision a device
   *
   * Removes device from trust environment and revokes all relationships
   */
  public async deprovisionDevice(deviceId: string): Promise<void> {
    const device = this.provisionedDevices.get(deviceId);

    if (!device) {
      return;
    }

    // Find and revoke all relationships involving this device
    for (const [relationshipId, relationship] of this.trustRelationships.entries()) {
      if (relationship.deviceA === deviceId || relationship.deviceB === deviceId) {
        this.revokeTrustRelationship(relationshipId);
      }
    }

    // Remove from trust environments
    for (const trustEnv of this.trustEnvironments.values()) {
      trustEnv.unregisterDevice(deviceId);
    }

    // Shutdown device SDK
    device.shutdown();

    // Remove from provisioned devices
    this.provisionedDevices.delete(deviceId);

    this.logAudit('device_deprovisioned', { deviceId });
  }

  /**
   * Get Trust Environment by ID
   */
  public getTrustEnvironment(environmentId: string): TrustEnvironment | undefined {
    return this.trustEnvironments.get(environmentId);
  }

  /**
   * Get provisioned device SDK
   */
  public getDeviceSDK(deviceId: string): DeviceSDK | undefined {
    return this.provisionedDevices.get(deviceId);
  }

  /**
   * Get DASB statistics for monitoring
   */
  public getStatistics(): {
    trustEnvironments: number;
    provisionedDevices: number;
    trustRelationships: number;
    mode: string;
  } {
    return {
      trustEnvironments: this.trustEnvironments.size,
      provisionedDevices: this.provisionedDevices.size,
      trustRelationships: this.trustRelationships.size,
      mode: this.config.mode
    };
  }

  /**
   * Get audit log
   */
  public getAuditLog(): Array<{ timestamp: number; event: string; details: any }> {
    return [...this.auditLog];
  }

  /**
   * Log audit event
   */
  private logAudit(event: string, details: any): void {
    if (this.config.auditLogging) {
      this.auditLog.push({
        timestamp: Date.now(),
        event,
        details
      });

      // Keep only last 1000 audit events
      if (this.auditLog.length > 1000) {
        this.auditLog.shift();
      }
    }
  }

  /**
   * Generate unique relationship ID
   */
  private generateRelationshipId(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * Shutdown DASB
   */
  public shutdown(): void {
    // Deprovision all devices
    for (const deviceId of this.provisionedDevices.keys()) {
      this.deprovisionDevice(deviceId);
    }

    // Clear all trust environments
    for (const trustEnv of this.trustEnvironments.values()) {
      trustEnv.shutdown();
    }

    this.trustEnvironments.clear();
    this.trustRelationships.clear();

    this.logAudit('dasb_shutdown', { dasbId: this.config.dasbId });
  }
}
