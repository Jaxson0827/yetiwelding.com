'use client';

import { ShopProduct } from '@/lib/shop/types';
import StarRating from '@/components/shop/landing/StarRating';

interface Props {
  product: ShopProduct;
  computedPrice: number;
  children?: React.ReactNode;
}

export default function PurchasePanel({ product, computedPrice, children }: Props) {
  return (
    <div className="space-y-6">
      {/* Rating row */}
      <div className="flex items-center gap-2 text-sm">
        <StarRating value={product.rating} />
        <span className="font-medium text-white">({product.rating})</span>
        <span className="text-white/40">·</span>
        <a href="#reviews" className="text-white/70 underline-offset-2 hover:text-white hover:underline">
          {product.reviewCount} reviews
        </a>
      </div>

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
