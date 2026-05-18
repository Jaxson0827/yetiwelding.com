import type { Metadata } from 'next';
import ServicesPageClient from '@/components/ServicesPageClient';

export const metadata: Metadata = {
  title: 'Services | Yeti Welding — Custom Fabrication & Structural Welding',
  description:
    'Custom gates, architectural railings, monument structures, structural steel, shade structures, and ornamental work. Clark County & DFCM certified. Serving Utah and Nevada.',
  openGraph: {
    title: 'Services | Yeti Welding',
    description:
      'Custom fabrication engineered for work that has to be done right the first time. Gates, railings, monument structures, structural steel, and more.',
    url: 'https://yetiwelding.com/services',
    images: [{ url: '/projects/firefly-arch/hero-day.JPG', width: 1200, height: 630, alt: 'Yeti Welding — Firefly Entrance Arch' }],
  },
};

export default function ServicesPage() {
  return <ServicesPageClient />;
}
