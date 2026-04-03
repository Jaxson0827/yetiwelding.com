import crypto from 'crypto';

export function newNewsletterToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function normalizeNewsletterEmail(email: string): string {
  return email.trim().toLowerCase();
}
