import { getSubscribeUserByEmail, markSubscribeUserTokenUsed } from "@/lib/services";

const SECRET_KEY = process.env.TOKEN_SECRET || "your-secret-key-make-it-long-and-random";

async function hmacSha256Hex(key: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function randomHex(bytes: number): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(bytes)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function toBase64Url(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function fromBase64Url(str: string): string {
  return atob(str.replace(/-/g, "+").replace(/_/g, "/"));
}

export class HashBasedToken {
  static async generateToken(email: string): Promise<{ token: string; expiryTime: Date }> {
    const timestamp = Date.now();
    const randomBytes = randomHex(16);
    const payload = `${email}:${timestamp}:${randomBytes}`;
    const signature = await hmacSha256Hex(SECRET_KEY, payload);
    const token = `${toBase64Url(payload)}.${signature}`;
    const expiryTime = new Date(timestamp + 24 * 60 * 60 * 1000);
    return { token, expiryTime };
  }

  static async verifyToken(
    email: string,
    token: string
  ): Promise<{ valid: boolean; error?: string }> {
    try {
      const [payloadB64, signature] = token.split(".");
      if (!payloadB64 || !signature) {
        return { valid: false, error: "Invalid token format" };
      }

      const payload = fromBase64Url(payloadB64);
      const [tokenEmail] = payload.split(":");

      if (tokenEmail !== email) {
        return { valid: false, error: "Token email mismatch" };
      }

      const expectedSignature = await hmacSha256Hex(SECRET_KEY, payload);
      if (signature !== expectedSignature) {
        return { valid: false, error: "Invalid token signature" };
      }

      const user = await getSubscribeUserByEmail(email);
      if (!user) {
        return { valid: false, error: "User not found" };
      }
      if (user.unsubscribeToken !== token) {
        return { valid: false, error: "Token not found or invalid" };
      }
      if (user.tokenUsed) {
        return { valid: false, error: "Token already used" };
      }

      return { valid: true };
    } catch (error) {
      console.error("Token verification error:", error);
      return { valid: false, error: "Invalid token" };
    }
  }

  static async markTokenAsUsed(email: string): Promise<void> {
    await markSubscribeUserTokenUsed(email);
  }
}
