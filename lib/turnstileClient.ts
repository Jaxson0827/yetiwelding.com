/**
 * Cloudflare dummy site key — **always passes** and shows a red “testing only” banner.
 * Use only when explicitly opted in (see `getTurnstileSiteKey`).
 * @see https://developers.cloudflare.com/turnstile/troubleshooting/testing/
 */
export const TURNSTILE_DUMMY_SITE_KEY = '1x00000000000000000000AA';

/**
 * Resolves the widget site key.
 * - Prefer `NEXT_PUBLIC_TURNSTILE_SITE_KEY` from `.env.local` / Vercel (your real widget).
 * - Dummy key is used **only** in development when you set `NEXT_PUBLIC_TURNSTILE_USE_DUMMY=true`
 *   (no Cloudflare keys needed for quick wiring tests). Do not use dummy for real QA.
 */
export function getTurnstileSiteKey(): string {
  const fromEnv = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  if (fromEnv) return fromEnv;
  const useDummy =
    process.env.NODE_ENV === 'development' &&
    process.env.NEXT_PUBLIC_TURNSTILE_USE_DUMMY === 'true';
  if (useDummy) return TURNSTILE_DUMMY_SITE_KEY;
  return '';
}
