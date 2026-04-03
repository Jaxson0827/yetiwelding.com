'use client';

import { Suspense, useMemo, useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BlogHero, BlogPostCard, BlogSidebar } from '@/components/blog';
import SectionDivider from '@/components/ui/SectionDivider';
import { blogPosts, getAllCategories, getFeaturedBlogPosts, getPostTags } from '@/lib/blogData';
import { motion, AnimatePresence } from 'framer-motion';

const categories = getAllCategories();
const featuredPosts = getFeaturedBlogPosts(3);

const POSTS_PER_PAGE = 5;

const NEWSLETTER_BANNER_COPY: Record<string, { tone: 'ok' | 'warn' | 'bad'; text: string }> = {
  confirmed: { tone: 'ok', text: "You're subscribed to shop updates." },
  unsubscribed: { tone: 'ok', text: 'You have been unsubscribed from the newsletter.' },
  invalid: { tone: 'warn', text: 'That newsletter link is invalid or expired.' },
  error: { tone: 'bad', text: 'Something went wrong. Please try signing up again from the sidebar.' },
};

function BlogPageContent({ turnstileSiteKey }: { turnstileSiteKey: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [pagesShown, setPagesShown] = useState(1);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setSearchQuery(decodeURIComponent(q));
      setActiveCategory('All');
    }
  }, [searchParams]);

  const filteredPosts = useMemo(() => {
    let list = blogPosts;

    if (activeCategory !== 'All') {
      list = list.filter((p) => p.categories.includes(activeCategory));
    }

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => {
        const inTitle = p.title.toLowerCase().includes(q);
        const inExcerpt = p.excerpt.toLowerCase().includes(q);
        const inKicker = p.kicker.toLowerCase().includes(q);
        const inCats = p.categories.some((c) => c.toLowerCase().includes(q));
        const tagList = getPostTags(p);
        const inTags = tagList.some((t) => t.toLowerCase().includes(q));
        return inTitle || inExcerpt || inKicker || inCats || inTags;
      });
    }

    return list;
  }, [searchQuery, activeCategory]);

  useEffect(() => {
    setPagesShown(1);
  }, [searchQuery, activeCategory]);

  const visiblePosts = useMemo(
    () => filteredPosts.slice(0, pagesShown * POSTS_PER_PAGE),
    [filteredPosts, pagesShown]
  );

  const hasMorePosts = visiblePosts.length < filteredPosts.length;

  useEffect(() => {
    const onScroll = () => setShowBackToTop(document.documentElement.scrollTop > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const newsletterFlash = searchParams.get('newsletter');
  const newsletterBanner = newsletterFlash ? NEWSLETTER_BANNER_COPY[newsletterFlash] : null;

  const dismissNewsletterBanner = useCallback(() => {
    const p = new URLSearchParams(searchParams.toString());
    p.delete('newsletter');
    const q = p.toString();
    router.replace(q ? `/blog?${q}` : '/blog');
  }, [router, searchParams]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://yetiwelding.com' },
              { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://yetiwelding.com/blog' },
            ],
          }),
        }}
      />

      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <main id="main-content" className="min-h-screen bg-black">
        <Header />
        <BlogHero />
        <SectionDivider />

        {newsletterBanner && (
          <div className="container mx-auto max-w-7xl px-4 pt-6">
            <div
              role="status"
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-sm border px-4 py-3 text-sm ${
                newsletterBanner.tone === 'ok'
                  ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-100'
                  : newsletterBanner.tone === 'warn'
                    ? 'border-amber-500/40 bg-amber-950/30 text-amber-100'
                    : 'border-red-500/40 bg-red-950/40 text-red-100'
              }`}
            >
              <p>{newsletterBanner.text}</p>
              <button
                type="button"
                onClick={dismissNewsletterBanner}
                className="shrink-0 text-xs uppercase tracking-wide underline underline-offset-2 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-sm px-1 py-0.5 -mx-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        <div className="container mx-auto max-w-7xl px-4 py-10 md:py-14">
          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] lg:gap-12 xl:gap-16">
            <div className="order-2 lg:order-1">
              {filteredPosts.length === 0 ? (
                <p className="text-white/60 text-center py-16 border border-white/10 rounded-sm bg-gray-warm-200/40">
                  No posts match your search. Try another keyword or category.
                </p>
              ) : (
                <>
                  {(filteredPosts.length > POSTS_PER_PAGE ||
                    searchQuery.trim() !== '' ||
                    activeCategory !== 'All') && (
                    <div className="mb-8 pb-4 border-b border-white/10">
                      <p className="text-white/55 text-sm">
                        {filteredPosts.length > POSTS_PER_PAGE ? (
                          <>
                            Showing <span className="text-white/90 font-medium">{visiblePosts.length}</span> of{' '}
                            <span className="text-white/90 font-medium">{filteredPosts.length}</span> posts
                          </>
                        ) : (
                          <span className="uppercase tracking-widest text-xs text-white/45">
                            {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
                            {searchQuery.trim() || activeCategory !== 'All' ? ' — filtered' : ''}
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                  {visiblePosts.map((post, index) => (
                    <BlogPostCard
                      key={post.slug}
                      post={post}
                      showConnectorBelow={index < visiblePosts.length - 1}
                    />
                  ))}
                  {hasMorePosts && (
                    <div className="flex justify-center mt-8">
                      <button
                        type="button"
                        onClick={() => setPagesShown((p) => p + 1)}
                        className="px-8 py-3 border-2 border-accent-red text-accent-red font-semibold text-sm uppercase tracking-wide rounded-sm hover:bg-accent-red/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-red"
                      >
                        Load more posts
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="order-1 lg:order-2 mb-10 lg:mb-0">
              <BlogSidebar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                featuredPosts={featuredPosts}
                turnstileSiteKey={turnstileSiteKey}
              />
            </div>
          </div>
        </div>

        <Footer />
      </main>

      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            type="button"
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 w-12 h-12 bg-accent-red text-white rounded-full flex items-center justify-center shadow-lg z-50 hover:bg-[#B01030] transition-colors"
            aria-label="Scroll to top"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

export default function BlogPageClient({ turnstileSiteKey }: { turnstileSiteKey: string }) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-black flex items-center justify-center text-white/60">
          Loading…
        </main>
      }
    >
      <BlogPageContent turnstileSiteKey={turnstileSiteKey} />
    </Suspense>
  );
}
