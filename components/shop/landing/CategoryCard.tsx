'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShopCategory } from '@/lib/shop/types';

interface Props {
  category: ShopCategory;
  className?: string;
}

export default function CategoryCard({ category, className = '' }: Props) {
  return (
    <Link
      href={`/shop/${category.slug}`}
      className={`group relative block overflow-hidden rounded-lg bg-gray-warm-100 ${className}`}
    >
      {/* Photo */}
      <motion.div
        className="absolute inset-0"
        whileHover={{ scale: 1.04 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={category.thumbImage}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </motion.div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* Top-left badge */}
      {category.badge && (
        <div className="absolute left-4 top-4">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            {category.badge}
          </span>
        </div>
      )}

      {/* Bottom content */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
        <div className="min-w-0">
          <h3 className="text-xl font-bold leading-tight text-white drop-shadow md:text-2xl">
            {category.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-white/80">
            {category.shortDescription}
          </p>
          <p className="mt-2 text-sm font-medium text-white">
            {category.priceFrom}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1 text-xs text-white/75 transition-colors group-hover:text-accent-red">
          <span>{category.productCountLabel}</span>
          <motion.svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            initial={{ x: 0 }}
            whileHover={{ x: 4 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </motion.svg>
        </div>
      </div>

      {/* Subtle hover ring */}
      <div className="pointer-events-none absolute inset-0 rounded-lg ring-0 ring-accent-red/0 transition-all group-hover:ring-2 group-hover:ring-accent-red/40" />
    </Link>
  );
}
