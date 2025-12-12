import crypto from 'crypto';
import { adminDb } from '@/lib/firebaseAdmin';

export class HashBasedToken {
  private static readonly SECRET_KEY = process.env.TOKEN_SECRET || 'your-secret-key-make-it-long-and-random';

  static async generateToken(email: string): Promise<{ token: string; expiryTime: Date }> {
    const timestamp = Date.now();
    const randomBytes = crypto.randomBytes(16).toString('hex');
    
    // Create payload: email:timestamp:randomBytes
    const payload = `${email}:${timestamp}:${randomBytes}`;
    
    // Create HMAC signature to prevent tampering
    const signature = crypto
      .createHmac('sha256', this.SECRET_KEY)
      .update(payload)
      .digest('hex');
    
    // Combine: base64url(payload).signature
    const token = `${Buffer.from(payload).toString('base64url')}.${signature}`;
    
    const expiryTime = new Date(timestamp + 24 * 60 * 60 * 1000); // 24 hours for testing

    return { token, expiryTime };
  }

  static async verifyToken(email: string, token: string): Promise<{ valid: boolean; error?: string }> {
    try {
      // Split token into payload and signature
      const [payloadB64, signature] = token.split('.');
      
      if (!payloadB64 || !signature) {
        return { valid: false, error: 'Invalid token format' };
      }

      // Decode payload
      const payload = Buffer.from(payloadB64, 'base64url').toString();
      const [tokenEmail, timestampStr, randomBytes] = payload.split(':');
      
      if (!tokenEmail || !timestampStr || !randomBytes) {
        return { valid: false, error: 'Invalid token payload' };
      }

      // Verify email matches
      if (tokenEmail !== email) {
        return { valid: false, error: 'Token email mismatch' };
      }

      // Verify HMAC signature (prevents tampering)
      const expectedSignature = crypto
        .createHmac('sha256', this.SECRET_KEY)
        .update(payload)
        .digest('hex');
      
      if (signature !== expectedSignature) {
        return { valid: false, error: 'Invalid token signature' };
      }

      // Check if token is expired
      // const timestamp = parseInt(timestampStr);
      // if (isNaN(timestamp) || Date.now() > timestamp + 24 * 60 * 60 * 1000) {
      //   return { valid: false, error: 'Token expired' };
      // }

      // Check token in user document
      const userDoc = await adminDb.doc(`blog/centralparkNews/subscribeUsers/${email}`).get();

      if (!userDoc.exists) {
        return { valid: false, error: 'User not found' };
      }

      const userData = userDoc.data();

      if (!userData) {
        return { valid: false, error: 'User data not found' };
      }

      // Check if token matches stored token
      if (userData.unsubscribeToken !== token) {
        return { valid: false, error: 'Token not found or invalid' };
      }

      // Check if token has been used
      if (userData.tokenUsed) {
        return { valid: false, error: 'Token already used' };
      }

      // Check token expiry from database
      // if (userData.tokenExpiresAt && new Date() > userData.tokenExpiresAt.toDate()) {
      //   return { valid: false, error: 'Token expired' };
      // }

      return { valid: true };

    } catch (error) {
      console.error('Token verification error:', error);
      return { valid: false, error: 'Invalid token' };
    }
  }

  // Mark token as used (one-time use)
  static async markTokenAsUsed(email: string): Promise<void> {
    await adminDb.doc(`blog/centralparkNews/subscribeUsers/${email}`).set({
      tokenUsed: true,
      tokenUsedAt: new Date()
    }, { merge: true });
  }
} 