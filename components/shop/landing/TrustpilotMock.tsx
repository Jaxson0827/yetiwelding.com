'use client';

import StarRating from './StarRating';
import { aggregate } from '@/lib/shop/reviews';

export default function TrustpilotMock() {
  return (
    <div className="mx-auto inline-flex flex-col items-center rounded-lg border border-white/10 bg-white/[0.04] px-8 py-6">
      <span className="font-playfair text-5xl font-bold leading-none text-white">
        {aggregate.rating}
      </span>
      <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">
        Rating
      </span>
      <StarRating value={aggregate.rating} size={22} className="mt-3" />
      <p className="mt-3 text-xs text-white/55">
        {aggregate.totalReviews.toLocaleString()} verified reviews
      </p>
    </div>
  );
}
