/** Base URL for absolute links in emails (no trailing slash). */
export function getNewsletterSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://yetiwelding.com').replace(/\/+$/, '');
}
