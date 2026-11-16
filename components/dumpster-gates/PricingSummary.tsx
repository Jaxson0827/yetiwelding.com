'use client';

import React from 'react';
import Link from 'next/link';
import type { DumpsterGateConfig, PriceBreakdown } from '@/lib/dumpsterGates/types';
import { formatDimension } from '@/lib/dumpsterGates/validation';
import { getFinishLabel, getGateHeightFt } from '@/lib/dumpsterGates/display';

export function formatUsd(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: n % 1 === 0 ? 0 : 2 });
}

interface PricingSummaryProps {
  config: DumpsterGateConfig;
  priceBreakdown: PriceBreakdown;
  /** Gates can be bought online (switch in lib/onlineCheckout.ts). */
  online: boolean;
  /** Reasons this configuration needs a quote. Empty = can check out. */
  quoteReasons: string[];
  onAddToCart: () => void;
  onRequestQuote: () => void;
  justAdded: boolean;
}

export default function PricingSummary({
  config,
  priceBreakdown,
  online,
  quoteReasons,
  onAddToCart,
  onRequestQuote,
  justAdded,
}: PricingSummaryProps) {
  const canBuy = online && quoteReasons.length === 0;

  const rows: Array<[string, React.ReactNode]> = [
    ['Enclosure', formatDimension(config.enclosureLengthFt)],
    ['Gate height', formatDimension(getGateHeightFt(config))],
    ['Style', 'Double swing'],
    ['Finish', getFinishLabel(config)],
    ['Posts', config.mounting === 'with-posts' ? 'Included' : 'Gate only'],
    ['Quantity', config.quantity],
  ];

  return (
    <section aria-labelledby="summary-heading" className="border border-gate-rule bg-gate-plate">
      <div className="p-5 sm:p-6">
        <h3 id="summary-heading" className="font-display text-xl font-extrabold text-white [font-stretch:115%]">
          Your gate
        </h3>

        <dl className="mt-4 divide-y divide-gate-rule border-y border-gate-rule text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-4 py-2">
              <dt className="text-gate-mute">{label}</dt>
              <dd className="text-right font-medium text-white">{value}</dd>
            </div>
          ))}
          <div className="flex items-baseline justify-between gap-4 py-2">
            <dt className="text-gate-mute">Lead time</dt>
            <dd className="text-right font-medium text-white">
              {priceBreakdown.leadTime === 'Extended lead time'
                ? 'Extended, ask us'
                : `${priceBreakdown.leadTime.replace(/-/g, '–')} after approval`}
            </dd>
          </div>
        </dl>

        <p className="mt-3 text-xs leading-relaxed text-gate-mute">
          Free pickup at our Springville shop, or free delivery within about 3 hours.
        </p>

        {canBuy ? (
          <div className="mt-5">
            <div className="flex items-end justify-between gap-4">
              <span className="text-sm text-gate-mute">
                {config.quantity > 1 ? `${formatUsd(priceBreakdown.unitPrice)} each × ${config.quantity}` : 'Price'}
              </span>
              <span className="font-display text-3xl font-extrabold tabular-nums text-white [font-stretch:110%]">
                {formatUsd(priceBreakdown.totalPrice)}
              </span>
            </div>
            <p className="mt-1 text-right text-xs text-gate-mute">Plus sales tax. Pickup and delivery are free.</p>
            <button
              type="button"
              onClick={onAddToCart}
              className="mt-4 w-full bg-accent-red px-5 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-accent-red-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Add to cart
            </button>
            <div aria-live="polite" className="min-h-[1.5rem]">
              {justAdded && (
                <p className="mt-3 text-center text-sm text-white">
                  Added to your cart.{' '}
                  <Link href="/checkout" className="font-semibold underline decoration-accent-red underline-offset-4">
                    Go to checkout
                  </Link>
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-5">
            {quoteReasons.length > 0 ? (
              <ul className="space-y-1.5 border-l-2 border-accent-red pl-3 text-sm text-white/85">
                {quoteReasons.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-white/85">We&apos;ll send you a price after we look over your dimensions.</p>
            )}
            <button
              type="button"
              onClick={onRequestQuote}
              className="mt-4 w-full bg-accent-red px-5 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-accent-red-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Request a quote
            </button>
            <p className="mt-2 text-center text-xs text-gate-mute">Your dimensions are sent with the request.</p>
          </div>
        )}
      </div>
      <p className="border-t border-gate-rule px-5 py-3 text-xs leading-relaxed text-gate-mute sm:px-6">
        Built to your dimensions. Custom gates can&apos;t be returned once fabrication starts, so we confirm every
        dimension with you on a drawing first.
      </p>
    </section>
  );
}
