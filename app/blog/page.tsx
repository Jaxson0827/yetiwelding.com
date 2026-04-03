import BlogPageClient from './BlogPageClient';
import { getTurnstileSiteKeyFromServerEnv } from '@/lib/turnstileSiteKey.server';

export default function BlogPage() {
  const turnstileSiteKey = getTurnstileSiteKeyFromServerEnv();
  return <BlogPageClient turnstileSiteKey={turnstileSiteKey} />;
}
