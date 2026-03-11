import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/checkout/', '/cart', '/api/'],
    },
    sitemap: 'https://yetiwelding.com/sitemap.xml',
  };
}
