'use client';

import Link from 'next/link';
import { homepageReviews, aggregate } from '@/lib/shop/reviews';
import ReviewCard from './ReviewCard';
import TrustpilotMock from './TrustpilotMock';

export default function SocialProof() {
  return (
    <section className="bg-gray-cool-100 px-4 py-16 md:py-24">
      <div className="container mx-auto max-w-6xl">
        {/* Pill badge */}
        <div className="mb-5 flex justify-center">
          <span className="inline-flex items-center rounded-full border border-accent-gold/30 bg-accent-gold/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-gold">
            Trusted by Thousands
          </span>
        </div>

        {/* Two-tone heading */}
        <h2 className="text-center text-3xl font-bold leading-tight text-white md:text-5xl">
          Real Customer <span className="text-accent-red">Stories</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-white/60 md:text-base">
          Join <span className="font-semibold text-white">100,000+</span>{' '}
          satisfied landscapers and homeowners
        </p>

        {/* Trustpilot widget */}
        <div className="mt-10 flex justify-center">
          <TrustpilotMock />
        </div>

        {/* Reviews grid */}
        <div className="mt-12 columns-1 gap-5 md:columns-2 lg:columns-3 [&>*]:mb-5">
          {homepageReviews.map((r, i) => (
            <ReviewCard key={i} review={r} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 flex justify-center">
          <Link
            href="#"
            className="inline-flex items-center gap-2 rounded-full bg-accent-red px-8 py-3 text-sm font-semibold uppercase tracking-wider text-white shadow-lg transition-colors hover:bg-accent-red-light"
          >
            Read {aggregate.remainingReviews.toLocaleString()} More Reviews
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
