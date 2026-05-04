'use client';

import StarRating from '@/components/shop/landing/StarRating';
import Avatar from '@/components/shop/landing/Avatar';
import TrustpilotMock from '@/components/shop/landing/TrustpilotMock';
import { homepageReviews } from '@/lib/shop/reviews';
import { ShopProduct } from '@/lib/shop/types';
import { UGC_PHOTOS as ugcPhotos } from '@/lib/shop/images';

export default function CustomerReviews({ product }: { product: ShopProduct }) {
  const featured = homepageReviews.slice(0, 2).map((r, i) => ({
    ...r,
    photos: [
      ugcPhotos[(i * 2) % ugcPhotos.length],
      ugcPhotos[(i * 2 + 1) % ugcPhotos.length],
    ],
  }));

  return (
    <section
      id="reviews"
      className="border-t border-white/10 bg-gray-cool-100 px-4 py-12 md:py-20"
    >
      <div className="container mx-auto max-w-6xl">
        <header className="text-center">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            Customer Reviews
          </h2>
          <p className="mt-2 text-sm text-white/60">
            What our customers are saying about {product.name}
          </p>
        </header>

        <div className="mt-8 flex flex-col items-center gap-4">
          <TrustpilotMock />
          <div className="flex items-center gap-2 text-sm text-white/70">
            <StarRating value={product.rating} />
            <span className="font-medium text-white">{product.rating}</span>
            <span>({product.reviewCount} reviews)</span>
          </div>
        </div>

        {/* Customer photos & videos */}
        <div className="mt-12">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">
            Customer Photos &amp; Videos ({ugcPhotos.length * 10})
          </h3>
          <div className="mt-3 grid grid-cols-4 gap-1.5 sm:grid-cols-6 md:grid-cols-8">
            {ugcPhotos.map((src, i) => (
              <button
                key={i}
                type="button"
                className="group relative aspect-square overflow-hidden rounded bg-white/5"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {i === ugcPhotos.length - 1 && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-sm font-bold text-white">
                    +145
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Featured photo review cards */}
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
          {featured.map((r, i) => (
            <article
              key={i}
              className="rounded-lg border border-white/10 bg-white/[0.04] p-5"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="inline-flex items-center rounded-full bg-accent-red/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-red">
                  Customer Photo Review
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-white/50">
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3l-2-3H10L8 7H5a2 2 0 00-2 2v8z"
                    />
                  </svg>
                  {r.photos?.length} · {r.timeAgo}
                </span>
              </div>
              <StarRating value={r.stars} />
              <h4 className="mt-2 text-sm font-semibold text-white">{r.title}</h4>
              {r.photos && r.photos.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {r.photos.map((p, j) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={j}
                      src={p}
                      alt=""
                      className="aspect-square w-full rounded object-cover"
                    />
                  ))}
                </div>
              )}
              <p className="mt-3 text-sm leading-relaxed text-white/65">{r.body}</p>
              <div className="mt-4 flex items-center gap-2.5">
                <Avatar name={r.authorName} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {r.authorName}
                  </p>
                  <p className="text-[11px] text-white/45">
                    {r.authorReviewCount}{' '}
                    {r.authorReviewCount === 1 ? 'review' : 'reviews'}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
