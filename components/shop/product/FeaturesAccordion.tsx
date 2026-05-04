'use client';

import { ShopProduct, SelectionMap } from '@/lib/shop/types';
import Accordion from './Accordion';

interface Props {
  product: ShopProduct;
  selection: SelectionMap;
}

export default function FeaturesAccordion({ product, selection }: Props) {
  // Pick first variant group's selected option as the "primary" selection for callouts.
  const primaryGroupId = product.variantGroups[0]?.id;
  const primarySelectionId = primaryGroupId ? selection[primaryGroupId] : undefined;
  const callout =
    (primarySelectionId && product.variantCallouts?.[primarySelectionId]) || undefined;

  // Apply features: a feature applies if no `appliesTo`, OR if any selected option id is in `appliesTo`.
  const selectedIds = Object.values(selection);

  return (
    <Accordion title="Product Features" defaultOpen>
      <div className="space-y-4">
        {callout && (
          <div className="rounded-lg border border-accent-gold/30 bg-accent-gold/[0.07] p-4">
            <p className="text-sm leading-relaxed text-white/90">{callout}</p>
          </div>
        )}

        <ul className="space-y-2.5">
          {product.features.map((f, i) => {
            const applies =
              !f.appliesTo || f.appliesTo.some((id) => selectedIds.includes(id));
            return (
              <li
                key={i}
                className={`flex items-start gap-3 text-sm ${
                  applies ? 'text-white/85' : 'text-white/35 line-through'
                }`}
              >
                <span
                  className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                    applies ? 'bg-accent-red text-white' : 'bg-white/10 text-white/40'
                  }`}
                  aria-hidden
                >
                  {applies ? (
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </span>
                <span>{f.text}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </Accordion>
  );
}
