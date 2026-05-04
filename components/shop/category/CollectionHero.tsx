'use client';

import Link from 'next/link';
import { ShopCategory } from '@/lib/shop/types';

export default function CollectionHero({ category }: { category: ShopCategory }) {
  return (
    <section className="relative w-full overflow-hidden bg-black">
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={category.heroImage}
          alt=""
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      </div>
      <div className="container relative z-10 mx-auto flex min-h-[260px] flex-col justify-end px-4 py-10 md:py-14">
        <nav aria-label="breadcrumb" className="mb-3 text-xs text-white/70">
          <Link href="/shop" className="hover:text-white">
            Home
          </Link>
          <span className="mx-2 text-white/40">/</span>
          <span className="text-white">{category.name}</span>
        </nav>
        <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
          {category.name}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80 md:text-base">
          {category.longDescription}
        </p>
      </div>
    </section>
  );
}
