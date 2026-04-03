import 'server-only';

import { TURNSTILE_DUMMY_SITE_KEY } from '@/lib/turnstileClient';

/**
 * Resolves the Turnstile widget site key on the server.
 * Use this when passing the key into client components (e.g. blog page is fully client-side,
 * so reading `NEXT_PUBLIC_*` only in a shared lib may not match `.env.local` reliably in dev).
 *
 * Order: `NEXT_PUBLIC_TURNSTILE_SITE_KEY` → `TURNSTILE_SITE_KEY` (alias) → optional dev dummy.
 */
export function getTurnstileSiteKeyFromServerEnv(): string {
  const fromPublic = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  if (fromPublic) return fromPublic;
  const fromPlain = process.env.TURNSTILE_SITE_KEY?.trim();
  if (fromPlain) return fromPlain;
  const useDummy =
    process.env.NODE_ENV === 'development' &&
    process.env.NEXT_PUBLIC_TURNSTILE_USE_DUMMY === 'true';
  if (useDummy) return TURNSTILE_DUMMY_SITE_KEY;
  return '';
}
