import { trimbleLidarPostBodyHtml } from '@/lib/blog/trimbleLidarPostBody';
import { chooseFabricatorPostBodyHtml } from '@/lib/blog/chooseFabricatorPostBody';
import { miscMetalsGuidePostBodyHtml } from '@/lib/blog/miscMetalsGuidePostBody';

export interface BlogPost {
  slug: string;
  title: string;
  kicker: string;
  excerpt: string;
  author: string;
  /** ISO date string (YYYY-MM-DD) */
  publishedAt: string;
  coverImage: string;
  categories: string[];
  /** Optional keywords for the post footer; defaults to categories when omitted */
  tags?: string[];
  /** Trusted static HTML from blog content modules */
  bodyHtml: string;
}

const postsUnsorted: BlogPost[] = [
  {
    slug: 'what-is-a-miscellaneous-metals-contractor',
    title: 'What Is a Miscellaneous Metals Contractor? A Utah Fabricator\'s Complete Guide',
    kicker: 'Industry knowledge',
    excerpt:
      'Miscellaneous metals is one of the most misunderstood line items in commercial construction. Here is a complete guide to what the trade covers, how it differs from structural steel, and what qualifies a contractor to perform it.',
    author: 'Yeti Welding',
    publishedAt: '2026-03-01',
    coverImage: '/blog/misc_metals_guide/post_cover.JPG',
    categories: ['Resources', 'Fabrication'],
    tags: [
      'Utah',
      'Miscellaneous metals',
      'Steel fabrication',
      'Custom stairs',
      'Railings',
      'Commercial construction',
      'Division 05',
    ],
    bodyHtml: miscMetalsGuidePostBodyHtml,
  },
  {
    slug: 'choose-steel-fabricator-utah',
    title:
      'How to Choose a Custom Stair and Railing Fabricator in Utah: 10 Things Contractors and Architects Should Verify',
    kicker: 'Buying & vetting advice',
    excerpt:
      'Not every fabricator who bids your stair and railing scope has the experience, certifications, and process to deliver it. Here are 10 specific things to verify before awarding custom steel work in Utah.',
    author: 'Yeti Welding',
    publishedAt: '2026-05-15',
    coverImage: '/blog/choose_fabricator_post/post-cover.jpg',
    categories: ['Resources', 'Fabrication'],
    tags: [
      'Utah',
      'Steel fabrication',
      'Custom stairs',
      'Railings',
      'Contractors',
      'Architects',
      'Procurement',
    ],
    bodyHtml: chooseFabricatorPostBodyHtml,
  },
  {
    slug: 'trimble-lidar-sketchup-steel-detailing',
    title:
      'How We Use Trimble LiDAR Scanning and SketchUp Point Clouds to Detail Steel Projects Accurately the First Time',
    kicker: 'Reality capture & detailing',
    excerpt:
      'In steel fabrication, costly mistakes often come from bad measurements—not welding. Here is a practical workflow using Trimble LiDAR, SketchUp point clouds, and fabrication-minded field practices so you detail from real site data.',
    author: 'Yeti Welding',
    publishedAt: '2026-04-03',
    coverImage: '/blog/Lidar_post_1/blogpost_scannerimage1.jpg',
    categories: ['Detailing', 'Technology'],
    tags: [
      'LiDAR',
      'Trimble',
      'SketchUp',
      'Point cloud',
      'Steel fabrication',
      'Shop drawings',
      'Reality capture',
    ],
    bodyHtml: trimbleLidarPostBodyHtml,
  },
];

function sortByDateDesc(a: BlogPost, b: BlogPost): number {
  return b.publishedAt.localeCompare(a.publishedAt);
}

export const blogPosts: BlogPost[] = [...postsUnsorted].sort(sortByDateDesc);

/** Sidebar “featured” order; filled from newest posts if a slug is missing */
const FEATURED_SLUG_ORDER = [
  'what-is-a-miscellaneous-metals-contractor',
  'choose-steel-fabricator-utah',
  'trimble-lidar-sketchup-steel-detailing',
] as const;

export function getFeaturedBlogPosts(limit = 3): BlogPost[] {
  const bySlug = new Map(blogPosts.map((p) => [p.slug, p]));
  const out: BlogPost[] = [];
  for (const slug of FEATURED_SLUG_ORDER) {
    const p = bySlug.get(slug);
    if (p) out.push(p);
    if (out.length >= limit) return out;
  }
  const seen = new Set(out.map((p) => p.slug));
  for (const p of blogPosts) {
    if (!seen.has(p.slug)) {
      out.push(p);
      seen.add(p.slug);
    }
    if (out.length >= limit) break;
  }
  return out;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return blogPosts.map((p) => p.slug);
}

/** Distinct categories across all posts, sorted alphabetically */
export function getAllCategories(): string[] {
  const set = new Set<string>();
  for (const post of blogPosts) {
    for (const c of post.categories) {
      set.add(c);
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

const MONTH_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

export function formatBlogDateParts(isoDate: string): { dayMonth: string; year: string } {
  const [y, m, d] = isoDate.split('-').map(Number);
  const month = MONTH_SHORT[(m ?? 1) - 1] ?? 'Jan';
  const day = d ?? 1;
  return { dayMonth: `${day} ${month}`, year: String(y ?? '') };
}

/** e.g. "15 Mar 2026" for related posts / metadata lines */
export function formatBlogDateLong(isoDate: string): string {
  const { dayMonth, year } = formatBlogDateParts(isoDate);
  return `${dayMonth} ${year}`;
}

/**
 * `blogPosts` is newest-first. Previous = older (later index); Next = newer (earlier index).
 */
export function getPrevNextPosts(slug: string): { prev: BlogPost | null; next: BlogPost | null } {
  const idx = blogPosts.findIndex((p) => p.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  const prev = idx < blogPosts.length - 1 ? blogPosts[idx + 1]! : null;
  const next = idx > 0 ? blogPosts[idx - 1]! : null;
  return { prev, next };
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const post = getPostBySlug(slug);
  if (!post) return [];
  const cat = new Set(post.categories);
  const sameCat = blogPosts.filter((p) => p.slug !== slug && p.categories.some((c) => cat.has(c)));
  if (sameCat.length >= limit) return sameCat.slice(0, limit);
  const used = new Set<string>([slug, ...sameCat.map((p) => p.slug)]);
  const rest = blogPosts.filter((p) => !used.has(p.slug));
  return [...sameCat, ...rest].slice(0, limit);
}

export function getPostTags(post: BlogPost): string[] {
  return post.tags?.length ? post.tags : post.categories;
}
