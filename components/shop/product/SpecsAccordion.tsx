'use client';

import { ProductSpec } from '@/lib/shop/types';
import Accordion from './Accordion';

export default function SpecsAccordion({ specs }: { specs: ProductSpec[] }) {
  if (specs.length === 0) return null;
  return (
    <Accordion title="Product Specifications">
      <dl className="divide-y divide-white/10">
        {specs.map((s) => (
          <div
            key={s.label}
            className="flex items-start justify-between gap-4 py-2.5 text-sm"
          >
            <dt className="text-white/55">{s.label}:</dt>
            <dd className="text-right font-medium text-white">{s.value}</dd>
          </div>
        ))}
      </dl>
    </Accordion>
  );
}
