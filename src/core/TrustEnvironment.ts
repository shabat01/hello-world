/**
 * KnectIQ SelectiveTRUST® - Trust Environment
 *
 * A Trust Environment manages a collection of trust relationships
 * between provisioned devices. Part of the DASB control plane.
 *
 * Key Principles:
 * - Manages trust relationships, not data
 * - Real-time validation
 * - No access to encrypted data pathways
 * - Device-level trust without centralized key storage
 */

import crypto from 'crypto';

export interface TrustEnvironmentConfig {
  name: string;
  maxDevices: number;
  sessionTimeout: number;
  requiredTrustScore: number;
  allowedOperations: Set<string>;
}

export interface DeviceIdentity {
  deviceId: string;
  publicIdentity: Buffer;
  capabilities: string[];
  registered: number;
  lastSeen: number;
  trustScore: number;
}

export interface RelationshipMetadata {
  relationshipId: string;
  deviceA: string;
  deviceB: string;
  established: number;
  lastValidated: number;
  active: boolean;
}

/**
 * Trust Environment
 *
 * Manages collections of trust relationships between devices.
 * Does NOT handle encryption or data - only trust management.
 */
export class TrustEnvironment {
  private environmentId: string;
  private config: TrustEnvironmentConfig;
  private mode: 'fips-140-2' | 'standard';
  private devices: Map<string, DeviceIdentity> = new Map();
  private relationships: Map<string, RelationshipMetadata> = new Map();
  private validationCache: Map<string, { valid: boolean; timestamp: number }> = new Map();

  constructor(
    environmentId: string,
    config: TrustEnvironmentConfig,
    mode: 'fips-140-2' | 'standard' = 'standard'
  ) {
    this.environmentId = environmentId;
    this.config = config;
    this.mode = mode;
  }

  /**
   * Register a device in this trust environment
   */
  public registerDevice(
    deviceId: string,
    publicIdentity: Buffer,
    capabilities: string[] = []
  ): void {
    if (this.devices.size >= this.config.maxDevices) {
      throw new Error('Trust environment has reached maximum device capacity');
    }

    if (this.devices.has(deviceId)) {
      throw new Error(`Device ${deviceId} already registered in this environment`);
    }

    const identity: DeviceIdentity = {
      deviceId,
      publicIdentity,
      capabilities,
      registered: Date.now(),
      lastSeen: Date.now(),
      trustScore: 100 // Initial trust score
    };

    this.devices.set(deviceId, identity);
  }

  /**
   * Unregister a device from this trust environment
   */
  public unregisterDevice(deviceId: string): void {
    // Remove all relationships involving this device
    for (const [relationshipId, relationship] of this.relationships.entries()) {
      if (relationship.deviceA === deviceId || relationship.deviceB === deviceId) {
        this.revokeRelationship(relationshipId);
      }
    }

    this.devices.delete(deviceId);
  }

  /**
   * Check if device is registered in this environment
   */
  public hasDevice(deviceId: string): boolean {
    return this.devices.has(deviceId);
  }

  /**
   * Get device identity
   */
  public getDevice(deviceId: string): DeviceIdentity | undefined {
    return this.devices.get(deviceId);
  }

  /**
   * Establish a relationship between two devices
   */
  public establishRelationship(
    deviceIdA: string,
    deviceIdB: string,
    relationshipId: string
  ): void {
    if (!this.devices.has(deviceIdA) || !this.devices.has(deviceIdB)) {
      throw new Error('Both devices must be registered in this environment');
    }

    if (deviceIdA === deviceIdB) {
      throw new Error('Cannot establish relationship with self');
    }

    const metadata: RelationshipMetadata = {
      relationshipId,
      deviceA: deviceIdA,
      deviceB: deviceIdB,
      established: Date.now(),
      lastValidated: Date.now(),
      active: true
    };

    this.relationships.set(relationshipId, metadata);
  }

  /**
   * Validate a relationship in real-time
   *
   * Per SelectiveTRUST® patent: "real-time validation for every
   * communication/transaction"
   */
  public validateRelationship(relationshipId: string): boolean {
    const relationship = this.relationships.get(relationshipId);

    if (!relationship || !relationship.active) {
      return false;
    }

    // Check if devices still exist
    const deviceA = this.devices.get(relationship.deviceA);
    const deviceB = this.devices.get(relationship.deviceB);

    if (!deviceA || !deviceB) {
      relationship.active = false;
      return false;
    }

    // Check trust scores meet requirements
    if (
      deviceA.trustScore < this.config.requiredTrustScore ||
      deviceB.trustScore < this.config.requiredTrustScore
    ) {
      return false;
    }

    // Update last validated timestamp
    relationship.lastValidated = Date.now();

    // Update device last seen
    deviceA.lastSeen = Date.now();
    deviceB.lastSeen = Date.now();

    return true;
  }

  /**
   * Revoke a relationship
   */
  public revokeRelationship(relationshipId: string): void {
    const relationship = this.relationships.get(relationshipId);

    if (relationship) {
      relationship.active = false;
    }

    this.relationships.delete(relationshipId);
    this.validationCache.delete(relationshipId);
  }

  /**
   * Update device trust score
   *
   * Trust scores can be updated based on device behavior,
   * security posture, compliance status, etc.
   */
  public updateDeviceTrustScore(deviceId: string, newScore: number): void {
    const device = this.devices.get(deviceId);

    if (device) {
      device.trustScore = Math.max(0, Math.min(100, newScore));

      // If trust score falls below threshold, invalidate relationships
      if (device.trustScore < this.config.requiredTrustScore) {
        for (const [relationshipId, relationship] of this.relationships.entries()) {
          if (relationship.deviceA === deviceId || relationship.deviceB === deviceId) {
            relationship.active = false;
          }
        }
      }
    }
  }

  /**
   * Get all relationships for a device
   */
  public getDeviceRelationships(deviceId: string): RelationshipMetadata[] {
    const relationships: RelationshipMetadata[] = [];

    for (const relationship of this.relationships.values()) {
      if (
        (relationship.deviceA === deviceId || relationship.deviceB === deviceId) &&
        relationship.active
      ) {
        relationships.push(relationship);
      }
    }

    return relationships;
  }

  /**
   * Validate operation is allowed under trust policy
   */
  public validateOperation(operation: string): boolean {
    return this.config.allowedOperations.has(operation);
  }

  /**
   * Get environment statistics
   */
  public getStatistics(): {
    environmentId: string;
    devices: number;
    relationships: number;
    mode: string;
  } {
    return {
      environmentId: this.environmentId,
      devices: this.devices.size,
      relationships: this.relationships.size,
      mode: this.mode
    };
  }

  /**
   * Get environment configuration
   */
  public getConfig(): TrustEnvironmentConfig {
    return { ...this.config };
  }

  /**
   * Cleanup expired validation cache
   */
  private cleanupCache(): void {
    const now = Date.now();
    const cacheTimeout = 60000; // 1 minute

    for (const [key, value] of this.validationCache.entries()) {
      if (now - value.timestamp > cacheTimeout) {
        this.validationCache.delete(key);
      }
    }
  }

  /**
   * Shutdown trust environment
   */
  public shutdown(): void {
    // Revoke all relationships
    for (const relationshipId of this.relationships.keys()) {
      this.revokeRelationship(relationshipId);
    }

    // Clear devices
    this.devices.clear();
    this.validationCache.clear();
  }
}
