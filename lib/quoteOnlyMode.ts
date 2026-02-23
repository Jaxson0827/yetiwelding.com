/**
 * Feature flag for quote-only mode.
 * Set NEXT_PUBLIC_QUOTE_ONLY_MODE=true in .env.local to enable.
 */
export const QUOTE_ONLY_MODE = process.env.NEXT_PUBLIC_QUOTE_ONLY_MODE === 'true';
