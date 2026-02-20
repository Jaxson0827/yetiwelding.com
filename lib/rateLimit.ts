import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export function getClientIp(request: NextRequest): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

/**
 * Postgres-backed fixed-window rate limit.
 * Returns true if the request is allowed, false if rate limit exceeded.
 */
export async function pgFixedWindowRateLimit(opts: {
  keyPrefix: string;
  identity: string;
  limit: number;
  windowSeconds: number;
}): Promise<boolean> {
  const now = Date.now();
  const windowMs = opts.windowSeconds * 1000;
  const windowStartMs = Math.floor(now / windowMs) * windowMs;
  const bucketKey = `${opts.keyPrefix}:${opts.identity}:${Math.floor(windowStartMs / 1000)}`;
  const expiresAt = new Date(windowStartMs + windowMs);

  // Opportunistic cleanup; safe to ignore failures.
  try {
    await prisma.rateLimitBucket.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  } catch {
    // ignore
  }

  const bucket = await prisma.rateLimitBucket.upsert({
    where: { key: bucketKey },
    create: {
      key: bucketKey,
      count: 1,
      expiresAt,
    },
    update: {
      count: { increment: 1 },
      expiresAt,
    },
  });

  return bucket.count <= opts.limit;
}
