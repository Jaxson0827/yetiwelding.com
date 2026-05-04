'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShopProduct } from '@/lib/shop/types';

export default function ProductCard({ product }: { product: ShopProduct }) {
  return (
    <Link
      href={`/shop/products/${product.slug}`}
      className="group block rounded border border-white/10 bg-white/[0.03] transition-all hover:-translate-y-0.5 hover:border-white/20 hover:shadow-xl"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-t bg-white/[0.06] p-6">
        <motion.div
          className="relative h-full w-full"
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.4 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        </motion.div>
      </div>
      <div className="flex items-center justify-between gap-2 px-3 py-3">
        <p className="min-w-0 truncate text-sm font-medium text-white">
          {product.name}
        </p>
        <span className="shrink-0 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white">
          ${product.basePrice}
        </span>
      </div>
    </Link>
  );
}
