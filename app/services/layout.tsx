import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Services | Yeti Welding - Professional Welding & Fabrication',
  description: 'Professional welding and fabrication services including custom fabrication, structural welding, and ornamental work. 40+ years of experience in Utah.',
  keywords: [
    'welding services',
    'metal fabrication',
    'custom fabrication',
    'structural welding',
    'ornamental work',
    'Utah welding',
    'Springville welding',
  ],
  openGraph: {
    title: 'Our Services | Yeti Welding',
    description: 'Professional welding and fabrication services delivered with precision, craftsmanship, and attention to detail.',
    url: 'https://yetiwelding.com/services',
    siteName: 'Yeti Welding',
    images: [
      {
        url: 'https://yetiwelding.com/homepage/hero.JPG',
        width: 1200,
        height: 630,
        alt: 'Yeti Welding Services',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Services | Yeti Welding',
    description: 'Professional welding and fabrication services delivered with precision, craftsmanship, and attention to detail.',
    images: ['https://yetiwelding.com/homepage/hero.JPG'],
  },
  alternates: {
    canonical: 'https://yetiwelding.com/services',
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}





