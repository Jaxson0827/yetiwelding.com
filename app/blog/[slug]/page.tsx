import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  blogPosts,
  getPostBySlug,
  formatBlogDateParts,
  getPrevNextPosts,
  getRelatedPosts,
} from '@/lib/blogData';
import BlogArticleFooter from '@/components/blog/BlogArticleFooter';
import BlogScrollToTop from '@/components/blog/BlogScrollToTop';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return { title: 'Post not found | Yeti Welding' };
  }
  const url = `https://yetiwelding.com/blog/${post.slug}`;
  const imageUrl = `https://yetiwelding.com${post.coverImage}`;
  return {
    title: `${post.title} | Yeti Welding Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      images: [{ url: imageUrl }],
    },
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { dayMonth, year } = formatBlogDateParts(post.publishedAt);
  const { prev, next } = getPrevNextPosts(slug);
  const related = getRelatedPosts(slug, 3);
  const shareUrl = `https://yetiwelding.com/blog/${post.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: { '@type': 'Organization', name: post.author },
    image: `https://yetiwelding.com${post.coverImage}`,
    url: `https://yetiwelding.com/blog/${post.slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'Yeti Welding',
      url: 'https://yetiwelding.com',
    },
  };

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
              {
                '@type': 'ListItem',
                position: 3,
                name: post.title,
                item: `https://yetiwelding.com/blog/${post.slug}`,
              },
            ],
          }),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <main id="main-content" className="min-h-screen bg-black">
        <Header />
        <article>
          <div className="relative w-full aspect-[21/9] min-h-[200px] max-h-[480px] bg-gray-warm-100">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          </div>

          <div className="container mx-auto max-w-3xl px-4 py-10 md:py-14">
            <Link
              href="/blog"
              className="inline-flex text-sm font-semibold text-accent-red hover:text-accent-red-light mb-8 focus:outline-none focus-visible:underline"
            >
              ← Back to blog
            </Link>

            <p className="text-accent-red font-semibold mb-2">{post.kicker}</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              {post.title}
            </h1>
            <p className="text-white/50 text-sm md:text-base mb-10">
              {post.author} · {dayMonth}, {year}
            </p>

            <div
              className="blog-article-body text-white/80 space-y-4 leading-relaxed [&_h2]:text-xl [&_h2]:md:text-2xl [&_h2]:font-semibold [&_h2]:text-white [&_h2]:mt-10 [&_h2]:mb-3 [&_p]:leading-relaxed [&_a]:text-accent-red [&_a]:underline hover:[&_a]:text-accent-red-light [&_figure]:max-w-none"
              dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
            />

            <BlogArticleFooter post={post} prev={prev} next={next} related={related} shareUrl={shareUrl} />
          </div>
        </article>
        <Footer />
      </main>

      <BlogScrollToTop />
    </>
  );
}
