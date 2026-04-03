import { MetadataRoute } from 'next';
import { blogPosts } from '@/lib/blogData';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://yetiwelding.com';
  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.65,
  }));

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/projects`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.75 },
    { url: `${base}/order`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/order/dumpster-gates`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/order/steel-embeds`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/order/pergolas`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/order/garden-boxes`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms-of-service`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/accessibility`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    ...blogEntries,
  ];
}
