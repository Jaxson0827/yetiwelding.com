import Image from 'next/image';
import Link from 'next/link';
import type { BlogPost } from '@/lib/blogData';
import { formatBlogDateParts } from '@/lib/blogData';

interface BlogPostCardProps {
  post: BlogPost;
  showConnectorBelow: boolean;
}

export default function BlogPostCard({ post, showConnectorBelow }: BlogPostCardProps) {
  const { dayMonth, year } = formatBlogDateParts(post.publishedAt);

  return (
    <div className="flex gap-4 sm:gap-6 md:gap-8">
      <div className="flex flex-col items-center w-[4.5rem] sm:w-24 shrink-0">
        <div
          className="w-[4.5rem] h-[4.5rem] sm:w-[5.5rem] sm:h-[5.5rem] rounded-full bg-gray-warm-200 border-2 border-accent-red flex flex-col items-center justify-center text-center shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
          aria-hidden="true"
        >
          <span className="text-white font-bold text-sm sm:text-base leading-tight">{dayMonth}</span>
        </div>
        <div className="mt-2 px-2 py-1 min-w-[3rem] rounded-sm bg-accent-red text-white text-xs sm:text-sm font-semibold text-center">
          {year}
        </div>
        {showConnectorBelow && (
          <div
            className="w-px flex-1 min-h-[2rem] mt-3 bg-white/20"
            aria-hidden="true"
          />
        )}
      </div>

      <article className="flex-1 min-w-0 border border-white/10 rounded-sm bg-gray-warm-200/80 overflow-hidden mb-10 sm:mb-12 shadow-lg shadow-black/20">
        <Link href={`/blog/${post.slug}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-red focus-visible:ring-offset-2 focus-visible:ring-offset-black">
          <div className="relative aspect-[16/9] w-full bg-black/40">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 65vw"
            />
          </div>
        </Link>
        <div className="p-5 sm:p-7 md:p-8">
          <p className="text-accent-red font-semibold text-sm sm:text-base mb-2">{post.kicker}</p>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
            <Link
              href={`/blog/${post.slug}`}
              className="hover:text-accent-red transition-colors focus:outline-none focus-visible:text-accent-red"
            >
              {post.title}
            </Link>
          </h2>
          <p className="text-white/50 text-sm mb-4">{post.author}</p>
          <p className="text-white/75 leading-relaxed mb-6">{post.excerpt}</p>
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center justify-center px-5 py-2.5 border border-accent-red text-accent-red text-sm font-semibold uppercase tracking-wider hover:bg-accent-red/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-red focus-visible:ring-offset-2 focus-visible:ring-offset-gray-warm-200"
          >
            Read more
          </Link>
        </div>
      </article>
    </div>
  );
}
