'use client';

import { Review } from '@/lib/shop/types';
import StarRating from './StarRating';
import Avatar from './Avatar';

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="break-inside-avoid rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <StarRating value={review.stars} />
        <span className="inline-flex items-center gap-1 text-[11px] text-white/45">
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {review.timeAgo}
        </span>
      </div>
      <h3 className="mt-3 text-sm font-semibold text-white">{review.title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-white/65">{review.body}</p>
      <div className="mt-4 flex items-center gap-2.5">
        <Avatar name={review.authorName} />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">
            {review.authorName}
          </p>
          <p className="text-[11px] text-white/45">
            {review.authorReviewCount}{' '}
            {review.authorReviewCount === 1 ? 'review' : 'reviews'}
          </p>
        </div>
      </div>
    </article>
  );
}
