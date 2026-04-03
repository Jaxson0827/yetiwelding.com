import ContactPageClient from './ContactPageClient';
import { getTurnstileSiteKeyFromServerEnv } from '@/lib/turnstileSiteKey.server';

export default function ContactPage() {
  const turnstileSiteKey = getTurnstileSiteKeyFromServerEnv();
  return <ContactPageClient turnstileSiteKey={turnstileSiteKey} />;
}
