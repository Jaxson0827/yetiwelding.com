import { kv } from '@vercel/kv';

export class KvNotConfiguredError extends Error {
  constructor() {
    super('KV is not configured');
  }
}

function kvConfigured(): boolean {
  // @vercel/kv expects these env vars (or equivalent integration config) at runtime.
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export function requireKv() {
  if (!kvConfigured()) {
    throw new KvNotConfiguredError();
  }
  return kv;
}

export async function kvSetJson(key: string, value: unknown, ttlSeconds?: number) {
  const client = requireKv();
  const payload = JSON.stringify(value);
  if (ttlSeconds && ttlSeconds > 0) {
    await client.set(key, payload, { ex: ttlSeconds });
    return;
  }
  await client.set(key, payload);
}

export async function kvGetJson<T>(key: string): Promise<T | null> {
  const client = requireKv();
  const raw = await client.get<string>(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function kvSetString(key: string, value: string, ttlSeconds?: number) {
  const client = requireKv();
  if (ttlSeconds && ttlSeconds > 0) {
    await client.set(key, value, { ex: ttlSeconds });
    return;
  }
  await client.set(key, value);
}

/**
 * Set a string key only if it does not already exist.
 * Returns true if the key was set, false otherwise.
 */
export async function kvSetStringIfNotExists(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
  const client = requireKv();
  // @vercel/kv (Upstash Redis) supports SET with NX/EX options.
  const result = await client.set(
    key,
    value,
    ttlSeconds && ttlSeconds > 0 ? ({ nx: true, ex: ttlSeconds } as any) : ({ nx: true } as any)
  );
  // Redis returns 'OK' if set, null otherwise.
  return Boolean(result);
}

export async function kvGetString(key: string): Promise<string | null> {
  const client = requireKv();
  const val = await client.get<string>(key);
  return val ?? null;
}

/**
 * Simple fixed-window rate limit helper.
 * Returns true if allowed, false if over limit.
 */
export async function kvRateLimitFixedWindow(key: string, limit: number, windowSeconds: number): Promise<boolean> {
  const client = requireKv();
  const count = await client.incr(key);
  if (count === 1) {
    await client.expire(key, windowSeconds);
  }
  return count <= limit;
}

