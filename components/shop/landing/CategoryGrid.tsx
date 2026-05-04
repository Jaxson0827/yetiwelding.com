'use client';

import { shopCategories } from '@/lib/shop/categories';
import CategoryCard from './CategoryCard';

export default function CategoryGrid() {
  // The mosaic pattern (Edge Right):
  //   Row 1: Edging (58%) | Edging Accessories (42%)
  //   Row 2: Planters | Fire Pits
  //   Row 3: The Sign | Tree Rings | Raised Beds
  // We use a 12-col grid so we can do 7+5 splits.
  const bySlug = (slug: string) => shopCategories.find((c) => c.slug === slug)!;

  return (
    <section className="bg-black px-4 py-16 md:py-24">
      <div className="container mx-auto max-w-7xl">
        <header className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-semibold text-white md:text-4xl">
            Shop by Category
          </h2>
          <p className="mt-3 text-sm text-white/60 md:text-base">
            Professional-grade solutions for every landscaping project
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
          {/* Row 1 */}
          <CategoryCard
            category={bySlug('landscape-edging')}
            className="aspect-[16/10] md:col-span-7 md:aspect-auto md:h-72"
          />
          <CategoryCard
            category={bySlug('edging-accessories')}
            className="aspect-[16/10] md:col-span-5 md:aspect-auto md:h-72"
          />
          {/* Row 2 */}
          <CategoryCard
            category={bySlug('planters')}
            className="aspect-[16/10] md:col-span-6 md:aspect-auto md:h-60"
          />
          <CategoryCard
            category={bySlug('fire-pits')}
            className="aspect-[16/10] md:col-span-6 md:aspect-auto md:h-60"
          />
          {/* Row 3 */}
          <CategoryCard
            category={bySlug('the-sign')}
            className="aspect-[16/10] md:col-span-4 md:aspect-auto md:h-60"
          />
          <CategoryCard
            category={bySlug('tree-rings')}
            className="aspect-[16/10] md:col-span-4 md:aspect-auto md:h-60"
          />
          <CategoryCard
            category={bySlug('raised-beds')}
            className="aspect-[16/10] md:col-span-4 md:aspect-auto md:h-60"
          />
        </div>
      </div>
    </section>
  );
}
