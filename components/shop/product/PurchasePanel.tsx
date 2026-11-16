'use client';

import { ShopProduct } from '@/lib/shop/types';

interface Props {
  product: ShopProduct;
  computedPrice: number;
  children?: React.ReactNode;
}

export default function PurchasePanel({ product, computedPrice, children }: Props) {
  return (
    <div className="space-y-6">
      {/* Rating row removed: product ratings were placeholder data. Restore once real reviews exist. */}

      {/* Name + price */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold leading-tight text-white md:text-3xl">
            {product.name}
          </h1>
          <p className="mt-1 text-sm text-white/60">{product.subtitle}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-2xl font-semibold text-white md:text-3xl">
            ${computedPrice}
          </p>
          <p className="text-[11px] text-white/55">with free shipping</p>
        </div>
      </div>

      {children}
    </div>
  );
}
