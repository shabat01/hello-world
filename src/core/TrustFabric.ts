/**
 * KnectIQ SelectiveTRUST® - Programmable Trust Fabric
 *
 * Implements programmable trust validation:
 * - Machine-to-machine trust orchestration
 * - Dynamic trust policy enforcement
 * - Real-time breach prevention
 * - Secure data in motion with ephemeral encryption
 */

import crypto from 'crypto';
import { EphemeralKeyManager, EphemeralKey } from './EphemeralKeyManager';
import { TrustEnclave, TrustPolicy, TrustSession } from './TrustEnclave';

export interface TrustContext {
  sourceDevice: string;
  targetDevice: string;
  operation: string;
  payload: Buffer;
  timestamp: number;
}

export interface SecureEnvelope {
  envelopeId: string;
  sessionId: string;
  encryptedPayload: Buffer;
  ephemeralKeyId: string;
  signature: Buffer;
  timestamp: number;
  iv: Buffer;
  authTag: Buffer;
}

export interface TrustValidationRule {
  name: string;
  condition: (context: TrustContext) => boolean;
  action: 'allow' | 'deny' | 'challenge';
  priority: number;
}

export class TrustFabric {
  private keyManager: EphemeralKeyManager;
  private trustEnclave: TrustEnclave;
  private validationRules: TrustValidationRule[] = [];
  private deviceId: string;

  constructor(
    deviceId: string,
    trustPolicy: TrustPolicy,
    keyManager?: EphemeralKeyManager
  ) {
    this.deviceId = deviceId;
    this.keyManager = keyManager || new EphemeralKeyManager();
    this.trustEnclave = new TrustEnclave(deviceId, trustPolicy, this.keyManager);
    this.initializeDefaultRules();
  }

  /**
   * Initialize default trust validation rules
   */
  private initializeDefaultRules(): void {
    // Rule: Deny if device not in trusted list
    this.addValidationRule({
      name: 'device-allowlist',
      condition: (context) => {
        // This would check against the trust policy
        return true;
      },
      action: 'allow',
      priority: 100
    });

    // Rule: Rate limiting
    this.addValidationRule({
      name: 'rate-limit',
      condition: (context) => {
        // Implement rate limiting logic
        return true;
      },
      action: 'allow',
      priority: 90
    });
  }

  /**
   * Add custom validation rule to trust fabric
   */
  public addValidationRule(rule: TrustValidationRule): void {
    this.validationRules.push(rule);
    this.validationRules.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Establish trust relationship with remote device
   */
  public async establishTrust(
    remoteDeviceId: string,
    remotePublicKey: Buffer
  ): Promise<TrustSession> {
    return this.trustEnclave.establishTrustSession(remoteDeviceId, remotePublicKey);
  }

  /**
   * Create secure envelope with ephemeral encryption
   * Each message gets a new key that is destroyed after use
   */
  public async createSecureEnvelope(
    sessionId: string,
    payload: Buffer,
    operation: string
  ): Promise<SecureEnvelope> {
    // Validate session
    if (!this.trustEnclave.validateSession(sessionId)) {
      throw new Error('Invalid or expired session');
    }

    // Validate operation is allowed
    if (!this.trustEnclave.validateOperation(sessionId, operation)) {
      throw new Error(`Operation '${operation}' not allowed by trust policy`);
    }

    // Generate ephemeral key for this message
    const ephemeralKey = await this.keyManager.generateKeyPair({ algorithm: 'x25519' });

    // Derive symmetric key from ephemeral key pair
    const symmetricKey = crypto
      .createHash('sha256')
      .update(ephemeralKey.privateKey)
      .digest();

    // Generate IV for AES-GCM
    const iv = crypto.randomBytes(12);

    // Encrypt payload with AES-256-GCM using ephemeral-derived key
    const cipher = crypto.createCipheriv('aes-256-gcm', symmetricKey, iv);
    const encryptedPayload = Buffer.concat([
      cipher.update(payload),
      cipher.final()
    ]);

    // Get authentication tag
    const authTag = cipher.getAuthTag();

    // Create signature of encrypted payload
    const signature = this.signPayload(encryptedPayload, ephemeralKey.privateKey);

    // Use the key (marks it for destruction)
    this.keyManager.useKey(ephemeralKey.id);

    const envelope: SecureEnvelope = {
      envelopeId: this.generateEnvelopeId(),
      sessionId,
      encryptedPayload,
      ephemeralKeyId: ephemeralKey.id,
      signature,
      timestamp: Date.now(),
      iv,
      authTag
    };

    // Overwrite symmetric key
    crypto.randomFillSync(symmetricKey);

    return envelope;
  }

  /**
   * Unwrap secure envelope and validate
   */
  public async unwrapSecureEnvelope(
    envelope: SecureEnvelope,
    senderPublicKey: Buffer
  ): Promise<Buffer> {
    // Validate session
    if (!this.trustEnclave.validateSession(envelope.sessionId)) {
      throw new Error('Invalid or expired session');
    }

    // Validate envelope age (prevent replay attacks)
    const envelopeAge = Date.now() - envelope.timestamp;
    if (envelopeAge > 60000) { // 60 seconds max
      throw new Error('Envelope expired - replay attack prevented');
    }

    // Verify signature
    const signatureValid = this.verifySignature(
      envelope.encryptedPayload,
      envelope.signature,
      senderPublicKey
    );

    if (!signatureValid) {
      throw new Error('Invalid signature - envelope integrity check failed');
    }

    // For decryption, we would need the ephemeral key
    // In a real implementation, the key exchange would happen through
    // the trust establishment phase
    // Here we demonstrate the concept with a derived key

    try {
      // Derive symmetric key (in practice, this would use ECDH key agreement)
      const symmetricKey = crypto
        .createHash('sha256')
        .update(senderPublicKey)
        .digest();

      // Decrypt with AES-256-GCM
      const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        symmetricKey,
        envelope.iv
      );
      decipher.setAuthTag(envelope.authTag);

      const decryptedPayload = Buffer.concat([
        decipher.update(envelope.encryptedPayload),
        decipher.final()
      ]);

      // Overwrite symmetric key
      crypto.randomFillSync(symmetricKey);

      return decryptedPayload;

    } catch (error) {
      throw new Error('Decryption failed - possible tampering detected');
    }
  }

  /**
   * Validate trust context against programmable rules
   */
  public validateTrustContext(context: TrustContext): boolean {
    for (const rule of this.validationRules) {
      try {
        const result = rule.condition(context);

        if (!result && rule.action === 'deny') {
          return false;
        }

        if (!result && rule.action === 'challenge') {
          // Trigger additional authentication
          // In production, this would involve multi-factor auth
          return false;
        }

      } catch (error) {
        // Rule execution error - fail secure
        return false;
      }
    }

    return true;
  }

  /**
   * Sign payload with ephemeral private key
   */
  private signPayload(payload: Buffer, privateKey: Buffer): Buffer {
    const hash = crypto.createHash('sha256').update(payload).digest();

    try {
      const sign = crypto.createSign('SHA256');
      sign.update(payload);
      sign.end();

      // For demonstration - in production use proper signing
      return crypto
        .createHmac('sha256', privateKey)
        .update(payload)
        .digest();
    } catch {
      // Fallback to HMAC
      return crypto
        .createHmac('sha256', privateKey)
        .update(payload)
        .digest();
    }
  }

  /**
   * Verify payload signature
   */
  private verifySignature(
    payload: Buffer,
    signature: Buffer,
    publicKey: Buffer
  ): boolean {
    try {
      const expectedSignature = crypto
        .createHmac('sha256', publicKey)
        .update(payload)
        .digest();

      return crypto.timingSafeEqual(signature, expectedSignature);
    } catch {
      return false;
    }
  }

  /**
   * Generate unique envelope identifier
   */
  private generateEnvelopeId(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * Get trust enclave for advanced operations
   */
  public getTrustEnclave(): TrustEnclave {
    return this.trustEnclave;
  }

  /**
   * Get key manager for monitoring
   */
  public getKeyManager(): EphemeralKeyManager {
    return this.keyManager;
  }

  /**
   * Shutdown trust fabric
   */
  public shutdown(): void {
    this.trustEnclave.shutdown();
    this.keyManager.shutdown();
    this.validationRules = [];
  }
}
