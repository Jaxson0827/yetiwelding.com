import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Projects | Yeti Welding - Showcase of Excellence in Metal Fabrication',
  description: 'Explore our portfolio of completed welding and fabrication projects. From custom railings to structural work, see examples of our craftsmanship and attention to detail.',
  keywords: [
    'welding projects',
    'metal fabrication projects',
    'custom welding portfolio',
    'welding showcase',
    'fabrication examples',
    'Utah welding projects',
    'Springville welding',
    'custom metalwork',
  ],
  openGraph: {
    title: 'Our Projects | Yeti Welding',
    description: 'Showcasing decades of exceptional craftsmanship and custom fabrication expertise in metalwork and welding.',
    url: 'https://yetiwelding.com/projects',
    siteName: 'Yeti Welding',
    images: [
      {
        url: 'https://yetiwelding.com/homepage/hero.JPG',
        width: 1200,
        height: 630,
        alt: 'Yeti Welding Projects Portfolio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Projects | Yeti Welding',
    description: 'Showcasing decades of exceptional craftsmanship and custom fabrication expertise.',
    images: ['https://yetiwelding.com/homepage/hero.JPG'],
  },
  alternates: {
    canonical: 'https://yetiwelding.com/projects',
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}




