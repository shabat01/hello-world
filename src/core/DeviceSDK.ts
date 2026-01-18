/**
 * KnectIQ SelectiveTRUST® - Device SDK
 *
 * SDK interface for devices to participate in SelectiveTRUST®.
 * Implements the key patented concept: "single-use unique key
 * constructed at the trusted device"
 *
 * Key Principles from Patents:
 * - Keys constructed AT THE DEVICE, not received from central authority
 * - Each key destroyed immediately after use
 * - No persistent key storage
 * - Data encrypted/decrypted at device, travels via separate pathways
 * - No dependency on PKI or shared cryptographic infrastructure
 */

import crypto from 'crypto';

export interface DeviceCapabilities {
  canEncrypt: boolean;
  canDecrypt: boolean;
  canSign: boolean;
  canVerify: boolean;
  supportedAlgorithms: string[];
}

export interface EphemeralKeyMaterial {
  keyId: string;
  constructed: number;
  used: boolean;
  algorithm: string;
}

export interface SecureDataPackage {
  packageId: string;
  sourceDeviceId: string;
  targetDeviceId: string;
  encryptedData: Buffer;
  ephemeralKeyId: string;
  timestamp: number;
  signature: Buffer;
}

/**
 * Device SDK
 *
 * Provides SDK interface for devices to:
 * 1. Construct ephemeral keys at the device
 * 2. Encrypt/decrypt data locally
 * 3. Manage trust relationships
 *
 * Critical: Data encryption happens at device, not in transit.
 * SelectiveTRUST manages trust, not data flow.
 */
export class DeviceSDK {
  private deviceId: string;
  private deviceType: string;
  private capabilities: string[];
  private mode: 'fips-140-2' | 'standard';
  private publicIdentity: Buffer;
  private privateIdentity: Buffer;
  private constructedKeys: Map<string, EphemeralKeyMaterial> = new Map();
  private keyConstructionCount: number = 0;
  private keyDestructionCount: number = 0;

  constructor(
    deviceId: string,
    deviceType: string,
    capabilities: string[],
    mode: 'fips-140-2' | 'standard' = 'standard'
  ) {
    this.deviceId = deviceId;
    this.deviceType = deviceType;
    this.capabilities = capabilities;
    this.mode = mode;

    // Generate device identity (persistent for device lifetime)
    const identity = crypto.generateKeyPairSync('x25519', {
      publicKeyEncoding: { type: 'spki', format: 'der' },
      privateKeyEncoding: { type: 'pkcs8', format: 'der' }
    });

    this.publicIdentity = identity.publicKey;
    this.privateIdentity = identity.privateKey;
  }

  /**
   * Construct ephemeral key AT THE DEVICE
   *
   * Core patented concept: "single-use unique key constructed at
   * the trusted device" - NOT received from a server or pre-generated.
   *
   * Per patent: "Data are encrypted/decrypted with a single-use unique
   * key constructed at the trusted device. Each key is destroyed
   * immediately after use on every operation, leaving no crypto to
   * store, rotate, or frequently load."
   */
  public constructEphemeralKey(algorithm: string = 'aes-256-gcm'): string {
    const keyId = this.generateKeyId();

    // Construct key material at device
    // In FIPS mode, use FIPS-approved algorithms
    const keyMaterial: EphemeralKeyMaterial = {
      keyId,
      constructed: Date.now(),
      used: false,
      algorithm: this.mode === 'fips-140-2' ? 'aes-256-gcm' : algorithm
    };

    this.constructedKeys.set(keyId, keyMaterial);
    this.keyConstructionCount++;

    // Schedule automatic destruction if not used within 5 seconds
    setTimeout(() => {
      if (!keyMaterial.used) {
        this.destroyEphemeralKey(keyId);
      }
    }, 5000);

    return keyId;
  }

  /**
   * Encrypt data using constructed ephemeral key
   *
   * Encryption happens AT THE DEVICE. Encrypted data then travels
   * via established pathways "unseen and untouched by SelectiveTRUST"
   */
  public encryptData(
    data: Buffer,
    targetDeviceId: string,
    ephemeralKeyId: string
  ): SecureDataPackage {
    const keyMaterial = this.constructedKeys.get(ephemeralKeyId);

    if (!keyMaterial) {
      throw new Error('Ephemeral key not found - may have been destroyed');
    }

    if (keyMaterial.used) {
      throw new Error('Ephemeral key already used - keys are single-use only');
    }

    // Mark key as used
    keyMaterial.used = true;

    // Construct actual encryption key from key material
    // In real implementation, this would use the ephemeral key ID as seed
    // for HKDF or similar key derivation
    const encryptionKey = crypto
      .createHash('sha256')
      .update(ephemeralKeyId)
      .update(this.privateIdentity)
      .digest();

    // Generate IV for AES-GCM
    const iv = crypto.randomBytes(12);

    // Encrypt data with AES-256-GCM
    const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey, iv);
    const encryptedData = Buffer.concat([
      iv, // Prepend IV
      cipher.update(data),
      cipher.final(),
      cipher.getAuthTag() // Append auth tag
    ]);

    // Sign the encrypted package
    const signature = this.signData(encryptedData);

    // Destroy the ephemeral key immediately after use
    setImmediate(() => this.destroyEphemeralKey(ephemeralKeyId));

    // Overwrite encryption key
    crypto.randomFillSync(encryptionKey);

    const package_: SecureDataPackage = {
      packageId: this.generatePackageId(),
      sourceDeviceId: this.deviceId,
      targetDeviceId,
      encryptedData,
      ephemeralKeyId,
      timestamp: Date.now(),
      signature
    };

    return package_;
  }

  /**
   * Decrypt data using ephemeral key
   *
   * Decryption happens AT THE DEVICE. Device receives encrypted data
   * via established pathways.
   */
  public decryptData(package_: SecureDataPackage): Buffer {
    // Verify signature first
    if (!this.verifySignature(package_.encryptedData, package_.signature)) {
      throw new Error('Signature verification failed - data may be tampered');
    }

    // Check timestamp to prevent replay attacks
    const age = Date.now() - package_.timestamp;
    if (age > 300000) {
      // 5 minutes
      throw new Error('Package too old - possible replay attack');
    }

    // Reconstruct decryption key from ephemeral key ID
    // This demonstrates the concept of "constructing" the key at the device
    const decryptionKey = crypto
      .createHash('sha256')
      .update(package_.ephemeralKeyId)
      .update(this.privateIdentity)
      .digest();

    // Extract IV, ciphertext, and auth tag
    const iv = package_.encryptedData.slice(0, 12);
    const authTag = package_.encryptedData.slice(-16);
    const ciphertext = package_.encryptedData.slice(12, -16);

    try {
      // Decrypt with AES-256-GCM
      const decipher = crypto.createDecipheriv('aes-256-gcm', decryptionKey, iv);
      decipher.setAuthTag(authTag);

      const decrypted = Buffer.concat([
        decipher.update(ciphertext),
        decipher.final()
      ]);

      // Overwrite decryption key
      crypto.randomFillSync(decryptionKey);

      return decrypted;
    } catch (error) {
      // Overwrite decryption key even on error
      crypto.randomFillSync(decryptionKey);
      throw new Error('Decryption failed - data may be corrupted or tampered');
    }
  }

  /**
   * Destroy ephemeral key
   *
   * Per patent: "Each key is destroyed immediately after use"
   */
  private destroyEphemeralKey(keyId: string): void {
    const keyMaterial = this.constructedKeys.get(keyId);

    if (keyMaterial) {
      // Key material is already minimal, but mark as destroyed
      this.constructedKeys.delete(keyId);
      this.keyDestructionCount++;
    }
  }

  /**
   * Sign data with device private identity
   */
  private signData(data: Buffer): Buffer {
    return crypto
      .createHmac('sha256', this.privateIdentity)
      .update(data)
      .digest();
  }

  /**
   * Verify signature
   */
  private verifySignature(data: Buffer, signature: Buffer): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', this.privateIdentity)
      .update(data)
      .digest();

    try {
      return crypto.timingSafeEqual(signature, expectedSignature);
    } catch {
      return false;
    }
  }

  /**
   * Get device public identity
   */
  public getPublicIdentity(): Buffer {
    return this.publicIdentity;
  }

  /**
   * Get device capabilities
   */
  public getCapabilities(): DeviceCapabilities {
    return {
      canEncrypt: this.capabilities.includes('encrypt'),
      canDecrypt: this.capabilities.includes('decrypt'),
      canSign: this.capabilities.includes('sign'),
      canVerify: this.capabilities.includes('verify'),
      supportedAlgorithms: this.mode === 'fips-140-2'
        ? ['aes-256-gcm', 'aes-256-cbc']
        : ['aes-256-gcm', 'aes-256-cbc', 'aes-128-gcm']
    };
  }

  /**
   * Get SDK statistics
   */
  public getStatistics(): {
    deviceId: string;
    mode: string;
    activeKeys: number;
    keysConstructed: number;
    keysDestroyed: number;
  } {
    return {
      deviceId: this.deviceId,
      mode: this.mode,
      activeKeys: this.constructedKeys.size,
      keysConstructed: this.keyConstructionCount,
      keysDestroyed: this.keyDestructionCount
    };
  }

  /**
   * Generate unique key ID
   */
  private generateKeyId(): string {
    return `${this.deviceId}-${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
  }

  /**
   * Generate unique package ID
   */
  private generatePackageId(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * Shutdown SDK and destroy all keys
   */
  public shutdown(): void {
    // Destroy all remaining ephemeral keys
    for (const keyId of this.constructedKeys.keys()) {
      this.destroyEphemeralKey(keyId);
    }

    // Overwrite private identity
    crypto.randomFillSync(this.privateIdentity);
  }
}
