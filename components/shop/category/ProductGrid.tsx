'use client';

import { useMemo, useState } from 'react';
import { ShopProduct } from '@/lib/shop/types';
import ProductCard from './ProductCard';
import SortBar, { SortKey } from './SortBar';

export default function ProductGrid({ products }: { products: ShopProduct[] }) {
  const [sort, setSort] = useState<SortKey>('trending');

  const sorted = useMemo(() => {
    const copy = [...products];
    switch (sort) {
      case 'newest':
        return copy.reverse();
      case 'price-asc':
        return copy.sort((a, b) => a.basePrice - b.basePrice);
      case 'price-desc':
        return copy.sort((a, b) => b.basePrice - a.basePrice);
      case 'trending':
      default:
        return copy.sort((a, b) => b.reviewCount - a.reviewCount);
    }
  }, [products, sort]);

  if (products.length === 0) {
    return (
      <div className="px-4 py-16 text-center text-white/60">
        <p>No products in this category yet — check back soon.</p>
      </div>
    );
  }

  return (
    <div className="px-4">
      <SortBar value={sort} onChange={setSort} />
      <div className="grid grid-cols-1 gap-4 py-6 sm:grid-cols-2 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
        {sorted.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}
