import { QUOTE_ONLY_MODE } from '@/lib/quoteOnlyMode';

/**
 * Which products can be bought online (cart + Stripe checkout).
 *
 * - NEXT_PUBLIC_QUOTE_ONLY_MODE=false  -> every product can be bought online (legacy behavior).
 * - NEXT_PUBLIC_QUOTE_ONLY_MODE=true   -> everything is quote-only EXCEPT the products listed in
 *   NEXT_PUBLIC_ONLINE_CHECKOUT_PRODUCTS (comma-separated product types).
 *
 * Example (dumpster gates on sale, everything else quote-only):
 *   NEXT_PUBLIC_QUOTE_ONLY_MODE=true
 *   NEXT_PUBLIC_ONLINE_CHECKOUT_PRODUCTS=dumpster-gate
 *
 * NEXT_PUBLIC_* values are inlined at build time, so a change needs a redeploy.
 * The same check runs on the server (checkout session route) so a stale or tampered cart
 * can't check out a product that isn't on sale.
 */
export type OnlineProductType = 'steel-plate-embeds' | 'dumpster-gate' | 'pergola' | 'garden-box';

const ENABLED_PRODUCTS: ReadonlySet<string> = new Set(
  (process.env.NEXT_PUBLIC_ONLINE_CHECKOUT_PRODUCTS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
);

export function isOnlineCheckoutEnabled(productType: string): boolean {
  if (!QUOTE_ONLY_MODE) return true;
  return ENABLED_PRODUCTS.has(productType);
}

/** True when at least one product can be bought online (controls cart icon, /cart and /checkout). */
export const ANY_ONLINE_CHECKOUT = !QUOTE_ONLY_MODE || ENABLED_PRODUCTS.size > 0;

/** Dumpster gates are on sale online: prices show on the page and "Add to cart" replaces "Get a quote". */
export const GATE_ONLINE_CHECKOUT = isOnlineCheckoutEnabled('dumpster-gate');
