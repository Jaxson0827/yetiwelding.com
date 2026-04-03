import Link from 'next/link';
import type { BlogPost } from '@/lib/blogData';
import { formatBlogDateLong, getPostTags } from '@/lib/blogData';

interface BlogArticleFooterProps {
  post: BlogPost;
  prev: BlogPost | null;
  next: BlogPost | null;
  related: BlogPost[];
  shareUrl: string;
}

function TagIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-white/45" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2l 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
      />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg className="mt-1 h-4 w-4 shrink-0 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function shareLinks(shareUrl: string, title: string) {
  const encUrl = encodeURIComponent(shareUrl);
  const encTitle = encodeURIComponent(title);
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encUrl}&text=${encTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}`,
  };
}

export default function BlogArticleFooter({ post, prev, next, related, shareUrl }: BlogArticleFooterProps) {
  const tags = getPostTags(post);
  const links = shareLinks(shareUrl, post.title);

  return (
    <footer className="mt-14 space-y-8 border-t border-white/10 pt-10">
      {/* Tags */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-white/80">
        <TagIcon />
        <span className="font-medium text-white/60">Tags:</span>
        {tags.map((tag, i) => (
          <span key={tag} className="inline-flex items-center">
            {i > 0 && <span className="text-white/30 mx-1" aria-hidden="true">,</span>}
            <Link
              href={`/blog?q=${encodeURIComponent(tag)}`}
              className="text-accent-red hover:text-accent-red-light font-medium focus:outline-none focus-visible:underline"
            >
              {tag}
            </Link>
          </span>
        ))}
      </div>

      {/* Share */}
      <div className="flex flex-col sm:flex-row sm:items-stretch border border-white/10 rounded-sm overflow-hidden bg-gray-warm-200/30">
        <div className="px-4 py-3 sm:py-3.5 text-sm text-white/70 bg-white/[0.03] sm:border-r border-white/10 flex items-center shrink-0">
          Share this post on:
        </div>
        <div className="flex flex-1 flex-wrap items-center gap-2 px-3 py-3 sm:px-4">
          <a
            href={links.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#1877F2] text-white hover:opacity-90 transition-opacity"
            aria-label="Share on Facebook"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
          <a
            href={links.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-sm bg-black text-white border border-white/15 hover:opacity-90 transition-opacity"
            aria-label="Share on X"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a
            href={links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#0A66C2] text-white hover:opacity-90 transition-opacity"
            aria-label="Share on LinkedIn"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <a
            href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(shareUrl)}`}
            className="flex h-10 w-10 items-center justify-center rounded-sm bg-white/10 text-white hover:bg-white/15 transition-colors"
            aria-label="Share by email"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Prev / Next */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="border border-white/10 rounded-sm bg-gray-warm-200/25 p-5 min-h-[5.5rem]">
          {prev ? (
            <>
              <Link
                href={`/blog/${prev.slug}`}
                className="text-sm font-semibold text-accent-red hover:text-accent-red-light focus:outline-none focus-visible:underline"
              >
                ← Previous post
              </Link>
              <p className="mt-2 text-white/85 text-sm md:text-base leading-snug line-clamp-2">{prev.title}</p>
            </>
          ) : (
            <p className="text-white/40 text-sm">No older post</p>
          )}
        </div>
        <div className="border border-white/10 rounded-sm bg-gray-warm-200/25 p-5 min-h-[5.5rem] text-right flex flex-col items-end">
          {next ? (
            <>
              <Link
                href={`/blog/${next.slug}`}
                className="text-sm font-semibold text-accent-red hover:text-accent-red-light focus:outline-none focus-visible:underline"
              >
                Next post →
              </Link>
              <p className="mt-2 text-white/85 text-sm md:text-base leading-snug line-clamp-2">{next.title}</p>
            </>
          ) : (
            <p className="text-white/40 text-sm">No newer post</p>
          )}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section aria-labelledby="related-posts-heading">
          <h2
            id="related-posts-heading"
            className="flex items-center gap-3 text-lg font-bold text-white mb-6 border-l-4 border-accent-red pl-4"
          >
            Related posts
          </h2>
          <ul className="divide-y divide-white/10 border border-white/10 rounded-sm overflow-hidden bg-gray-warm-200/20">
            {related.map((r) => (
              <li key={r.slug} className="flex gap-3 px-4 py-4 hover:bg-white/[0.04] transition-colors">
                <DocIcon />
                <div className="min-w-0">
                  <Link
                    href={`/blog/${r.slug}`}
                    className="font-bold text-accent-red hover:text-accent-red-light uppercase text-sm md:text-base leading-snug focus:outline-none focus-visible:underline block"
                  >
                    {r.title}
                  </Link>
                  <p className="mt-1.5 text-xs md:text-sm text-white/45">
                    By: {r.author}, Posted on: {formatBlogDateLong(r.publishedAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </footer>
  );
}
