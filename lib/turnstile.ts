/**
 * Dummy secret that pairs with `turnstileClient` dummy site key (opt-in only).
 * @see https://developers.cloudflare.com/turnstile/troubleshooting/testing/
 */
const TURNSTILE_DUMMY_SECRET_KEY = '1x0000000000000000000000000000000AA';

function getTurnstileSecret(): string | undefined {
  const fromEnv = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (fromEnv) return fromEnv;
  const useDummy =
    process.env.NODE_ENV === 'development' &&
    process.env.NEXT_PUBLIC_TURNSTILE_USE_DUMMY === 'true';
  if (useDummy) return TURNSTILE_DUMMY_SECRET_KEY;
  return undefined;
}

/** True when verification can run (prod keys or dev dummy). */
export function isTurnstileVerificationConfigured(): boolean {
  return getTurnstileSecret() !== undefined;
}

/**
 * Server-side Cloudflare Turnstile verification.
 * @see https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */
export async function verifyTurnstileToken(
  token: string | null | undefined,
  remoteip?: string
): Promise<boolean> {
  const secret = getTurnstileSecret();
  if (!secret || !token || typeof token !== 'string' || token.trim().length === 0) {
    return false;
  }

  const body = new URLSearchParams();
  body.set('secret', secret);
  body.set('response', token.trim());
  if (remoteip && remoteip !== 'unknown') {
    body.set('remoteip', remoteip);
  }

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    return false;
  }

  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}
