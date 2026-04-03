import { blogPosts } from '@/lib/blogData';

const SITE = 'https://yetiwelding.com';
const BLOG_URL = `${SITE}/blog`;

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** RFC 822 style date for RSS (uses UTC). */
function rssPubDate(isoDateYmd: string): string {
  const d = new Date(`${isoDateYmd}T12:00:00.000Z`);
  return d.toUTCString();
}

export function GET() {
  const channelDescription =
    'News, tips, and project insights from Yeti Welding — custom fabrication and structural steel in Utah.';

  const itemsXml = blogPosts
    .map((post) => {
      const link = `${SITE}/blog/${post.slug}`;
      const desc = escapeXml(post.excerpt);
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${rssPubDate(post.publishedAt)}</pubDate>
      <description>${desc}</description>
    </item>`;
    })
    .join('\n');

  const latestPub =
    blogPosts.length > 0 ? rssPubDate(blogPosts[0]!.publishedAt) : rssPubDate(new Date().toISOString().slice(0, 10));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Yeti Welding Blog</title>
    <link>${BLOG_URL}</link>
    <description>${escapeXml(channelDescription)}</description>
    <language>en-us</language>
    <lastBuildDate>${latestPub}</lastBuildDate>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
