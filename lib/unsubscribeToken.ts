import crypto from 'crypto';
import { getSubscribeUserByEmail, markSubscribeUserTokenUsed } from "@/lib/services";

export class HashBasedToken {
  private static readonly SECRET_KEY = process.env.TOKEN_SECRET || 'your-secret-key-make-it-long-and-random';

  static async generateToken(email: string): Promise<{ token: string; expiryTime: Date }> {
    const timestamp = Date.now();
    const randomBytes = crypto.randomBytes(16).toString('hex');

    const payload = `${email}:${timestamp}:${randomBytes}`;
    const signature = crypto
      .createHmac('sha256', this.SECRET_KEY)
      .update(payload)
      .digest('hex');

    const token = `${Buffer.from(payload).toString('base64url')}.${signature}`;
    const expiryTime = new Date(timestamp + 24 * 60 * 60 * 1000);

    return { token, expiryTime };
  }

  static async verifyToken(email: string, token: string): Promise<{ valid: boolean; error?: string }> {
    try {
      const [payloadB64, signature] = token.split('.');

      if (!payloadB64 || !signature) {
        return { valid: false, error: 'Invalid token format' };
      }

      const payload = Buffer.from(payloadB64, 'base64url').toString();
      const [tokenEmail] = payload.split(':');

      if (tokenEmail !== email) {
        return { valid: false, error: 'Token email mismatch' };
      }

      const expectedSignature = crypto
        .createHmac('sha256', this.SECRET_KEY)
        .update(payload)
        .digest('hex');

      if (signature !== expectedSignature) {
        return { valid: false, error: 'Invalid token signature' };
      }

      const user = await getSubscribeUserByEmail(email);
      if (!user) {
        return { valid: false, error: 'User not found' };
      }
      if (user.unsubscribeToken !== token) {
        return { valid: false, error: 'Token not found or invalid' };
      }
      if (user.tokenUsed) {
        return { valid: false, error: 'Token already used' };
      }

      return { valid: true };
    } catch (error) {
      console.error('Token verification error:', error);
      return { valid: false, error: 'Invalid token' };
    }
  }

  static async markTokenAsUsed(email: string): Promise<void> {
    await markSubscribeUserTokenUsed(email);
  }
}
