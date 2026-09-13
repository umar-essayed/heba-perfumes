import crypto from 'crypto';

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'heba_perfumes_super_secret_salt_2026';
export const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'heba2026';

// In-memory rate limiting map for login attempts
interface RateLimitRecord {
  attempts: number;
  lockedUntil: number;
}
const loginAttempts = new Map<string, RateLimitRecord>();

export function checkRateLimit(ip: string): { allowed: boolean; waitSeconds?: number } {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record) return { allowed: true };

  if (record.lockedUntil > now) {
    const waitSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { allowed: false, waitSeconds };
  }

  // If lockout period has expired, reset
  if (record.lockedUntil <= now && record.attempts >= 5) {
    loginAttempts.delete(ip);
    return { allowed: true };
  }

  return { allowed: true };
}

export function recordFailedAttempt(ip: string) {
  const now = Date.now();
  const record = loginAttempts.get(ip) || { attempts: 0, lockedUntil: 0 };
  record.attempts += 1;

  if (record.attempts >= 5) {
    // Lock for 5 minutes
    record.lockedUntil = now + 5 * 60 * 1000;
  }

  loginAttempts.set(ip, record);
}

export function clearFailedAttempts(ip: string) {
  loginAttempts.delete(ip);
}

// Token generation & verification using HMAC SHA-256
export function generateAdminToken(): string {
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac('sha256', ADMIN_SECRET)
    .update(`admin_session_${timestamp}`)
    .digest('hex');
  return `${timestamp}.${signature}`;
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [timestamp, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', ADMIN_SECRET)
    .update(`admin_session_${timestamp}`)
    .digest('hex');

  if (signature !== expectedSignature) return false;

  // Session valid for 7 days
  const sessionAge = Date.now() - parseInt(timestamp, 10);
  const maxAge = 7 * 24 * 60 * 60 * 1000;
  return sessionAge < maxAge;
}
