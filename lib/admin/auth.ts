import crypto from 'crypto';
import type { NextRequest } from 'next/server';

export function isAdminRequest(request: NextRequest): boolean {
  const expected = process.env.ADMIN_API_KEY || '';
  if (!expected) return false;
  const provided = request.headers.get('x-admin-key') || '';
  if (!provided) return false;

  try {
    // Timing-safe compare
    const a = Buffer.from(provided);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

