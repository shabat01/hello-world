/**
 * KnectIQ SelectiveTRUST® - Ephemeral Key Manager
 *
 * Implements patented ephemeral key technology:
 * - Single-use encryption keys dynamically generated at time of need
 * - Keys are used once and immediately destroyed
 * - No persistent keys to manage, store, or rotate
 * - Prevents key compromise and replay attacks
 */

import crypto from 'crypto';

export interface EphemeralKey {
  id: string;
  publicKey: Buffer;
  privateKey: Buffer;
  timestamp: number;
  used: boolean;
}

export interface KeyPairOptions {
  algorithm?: 'rsa' | 'ec' | 'x25519';
  keySize?: number;
  curve?: string;
}

export class EphemeralKeyManager {
  private activeKeys: Map<string, EphemeralKey> = new Map();
  private readonly keyLifetimeMs: number = 5000; // 5 seconds max lifetime
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(keyLifetimeMs: number = 5000) {
    this.keyLifetimeMs = keyLifetimeMs;
    this.startCleanupTimer();
  }

  /**
   * Generate a new ephemeral key pair
   * Keys are single-use and self-destruct after use or timeout
   */
  public async generateKeyPair(options: KeyPairOptions = {}): Promise<EphemeralKey> {
    const keyId = this.generateKeyId();
    const algorithm = options.algorithm || 'x25519';

    let publicKey: Buffer;
    let privateKey: Buffer;

    if (algorithm === 'x25519') {
      // X25519 for Signal's modern elliptic curve cryptography
      const { publicKey: pubKey, privateKey: privKey } = crypto.generateKeyPairSync('x25519', {
        publicKeyEncoding: { type: 'spki', format: 'der' },
        privateKeyEncoding: { type: 'pkcs8', format: 'der' }
      });
      publicKey = pubKey;
      privateKey = privKey;
    } else if (algorithm === 'ec') {
      // Elliptic Curve for backward compatibility
      const curve = options.curve || 'secp256k1';
      const { publicKey: pubKey, privateKey: privKey } = crypto.generateKeyPairSync('ec', {
        namedCurve: curve,
        publicKeyEncoding: { type: 'spki', format: 'der' },
        privateKeyEncoding: { type: 'pkcs8', format: 'der' }
      });
      publicKey = pubKey;
      privateKey = privKey;
    } else {
      // RSA fallback
      const keySize = options.keySize || 2048;
      const { publicKey: pubKey, privateKey: privKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: keySize,
        publicKeyEncoding: { type: 'spki', format: 'der' },
        privateKeyEncoding: { type: 'pkcs8', format: 'der' }
      });
      publicKey = pubKey;
      privateKey = privKey;
    }

    const ephemeralKey: EphemeralKey = {
      id: keyId,
      publicKey,
      privateKey,
      timestamp: Date.now(),
      used: false
    };

    this.activeKeys.set(keyId, ephemeralKey);

    // Schedule automatic destruction
    setTimeout(() => this.destroyKey(keyId), this.keyLifetimeMs);

    return ephemeralKey;
  }

  /**
   * Use a key for a single operation, then immediately destroy it
   */
  public useKey(keyId: string): EphemeralKey | null {
    const key = this.activeKeys.get(keyId);

    if (!key) {
      return null;
    }

    if (key.used) {
      throw new Error('Key has already been used - ephemeral keys are single-use only');
    }

    // Mark as used
    key.used = true;

    // Schedule immediate destruction after use
    setImmediate(() => this.destroyKey(keyId));

    return key;
  }

  /**
   * Securely destroy a key by overwriting memory and removing reference
   */
  private destroyKey(keyId: string): void {
    const key = this.activeKeys.get(keyId);

    if (key) {
      // Overwrite sensitive key material with random data
      crypto.randomFillSync(key.privateKey);
      crypto.randomFillSync(key.publicKey);

      // Remove from active keys
      this.activeKeys.delete(keyId);
    }
  }

  /**
   * Cleanup expired keys that haven't been used
   */
  private cleanupExpiredKeys(): void {
    const now = Date.now();

    for (const [keyId, key] of this.activeKeys.entries()) {
      if (now - key.timestamp > this.keyLifetimeMs) {
        this.destroyKey(keyId);
      }
    }
  }

  /**
   * Start periodic cleanup of expired keys
   */
  private startCleanupTimer(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredKeys();
    }, 1000); // Cleanup every second
  }

  /**
   * Stop the cleanup timer and destroy all keys
   */
  public shutdown(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }

    // Destroy all remaining keys
    for (const keyId of this.activeKeys.keys()) {
      this.destroyKey(keyId);
    }
  }

  /**
   * Generate a unique key identifier
   */
  private generateKeyId(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * Get active key count (for monitoring)
   */
  public getActiveKeyCount(): number {
    return this.activeKeys.size;
  }
}
