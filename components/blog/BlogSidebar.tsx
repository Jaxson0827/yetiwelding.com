'use client';

import Link from 'next/link';
import type { BlogPost } from '@/lib/blogData';
import BlogNewsletterSignup from './BlogNewsletterSignup';

interface BlogSidebarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  featuredPosts: BlogPost[];
  turnstileSiteKey: string;
}

function CheckIcon() {
  return (
    <svg
      className="w-4 h-4 text-accent-red shrink-0 mt-0.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function BlogSidebar({
  searchQuery,
  onSearchChange,
  categories,
  activeCategory,
  onCategoryChange,
  featuredPosts,
  turnstileSiteKey,
}: BlogSidebarProps) {
  const allOptions = ['All', ...categories];

  return (
    <aside className="space-y-10 lg:sticky lg:top-28 self-start">
      <div className="border border-white/10 rounded-sm bg-gray-warm-200/60 p-5 sm:p-6">
        <h2 className="text-accent-red font-bold text-lg uppercase tracking-wide mb-4">Search</h2>
        <label htmlFor="blog-search" className="sr-only">
          Search blog posts
        </label>
        <div className="flex gap-2">
          <input
            id="blog-search"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Enter search keyword here..."
            className="flex-1 min-w-0 bg-black/40 border border-white/15 rounded-sm px-3 py-2.5 text-white placeholder:text-white/35 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-red"
          />
          <span
            className="flex items-center justify-center w-11 h-11 shrink-0 bg-accent-red text-white rounded-sm"
            aria-hidden="true"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
        </div>
      </div>

      <div className="border border-white/10 rounded-sm bg-gray-warm-200/60 p-5 sm:p-6">
        <h2 className="text-accent-red font-bold text-lg uppercase tracking-wide mb-2">Categories</h2>
        <ul className="divide-y divide-white/10">
          {allOptions.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <li key={cat}>
                <button
                  type="button"
                  onClick={() => onCategoryChange(cat)}
                  className={`w-full flex items-start gap-3 py-3.5 text-left text-sm sm:text-base transition-colors min-h-[44px] ${
                    isActive ? 'text-white' : 'text-white/75 hover:text-white'
                  }`}
                >
                  <CheckIcon />
                  <span className={isActive ? 'font-semibold' : ''}>{cat}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="border border-white/10 rounded-sm bg-gray-warm-200/60 p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-white font-bold text-base sm:text-lg uppercase tracking-tight shrink-0">
            Featured articles
          </h2>
          <div className="h-px flex-1 bg-white/15 min-w-0" aria-hidden="true" />
        </div>
        <ul className="space-y-6">
          {featuredPosts.map((post) => (
            <li key={post.slug}>
              <p className="text-white font-semibold text-sm leading-snug line-clamp-3 mb-2">{post.title}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-accent-red hover:text-accent-red-light focus:outline-none focus-visible:underline group"
              >
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-red text-white shadow-sm group-hover:bg-accent-red-light transition-colors"
                  aria-hidden="true"
                >
                  <svg className="h-3.5 w-3.5 -mr-px" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
                Read more
              </Link>
            </li>
          ))}
        </ul>

        <BlogNewsletterSignup turnstileSiteKey={turnstileSiteKey} />
      </div>
    </aside>
  );
}
