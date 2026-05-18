import type { Metadata } from 'next';
import FireflyArchCaseStudy from '@/components/projects/FireflyArchCaseStudy';

export const metadata: Metadata = {
  title: 'Firefly Entrance Arch — Case Study | Yeti Welding',
  description:
    'A monumental Corten steel entrance arch featuring 46,500 CNC-laser-cut holes that create a signature firefly glow effect at night. 400 hours of precision fabrication by Yeti Welding in Utah.',
  keywords: [
    'Corten steel arch',
    'custom metal entrance arch',
    'CNC laser cut steel',
    'monument structure Utah',
    'Firefly Entrance Arch',
    'custom fabrication Utah',
    'Yeti Welding case study',
    'HSS structural steel',
    'decorative steel gate',
  ],
  openGraph: {
    title: 'Firefly Entrance Arch — Case Study | Yeti Welding',
    description:
      '46,500 laser-cut holes. 400 hours of precision fabrication. A Corten steel arch that transforms at night.',
    url: 'https://yetiwelding.com/projects/firefly-arch',
    siteName: 'Yeti Welding',
    images: [
      {
        url: 'https://yetiwelding.com/homepage/featuredproject.JPG',
        width: 1200,
        height: 800,
        alt: 'Firefly Entrance Arch — Corten steel monument structure by Yeti Welding',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Firefly Entrance Arch — Case Study | Yeti Welding',
    description:
      '46,500 laser-cut holes. 400 hours of precision fabrication. A Corten steel arch that transforms at night.',
    images: ['https://yetiwelding.com/homepage/featuredproject.JPG'],
  },
  alternates: {
    canonical: 'https://yetiwelding.com/projects/firefly-arch',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://yetiwelding.com' },
    { '@type': 'ListItem', position: 2, name: 'Projects', item: 'https://yetiwelding.com/projects' },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Firefly Entrance Arch',
      item: 'https://yetiwelding.com/projects/firefly-arch',
    },
  ],
};

const creativeWorkSchema = {
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name: 'Firefly Entrance Arch',
  description:
    'A monumental Corten steel entrance arch featuring 46,500 CNC-laser-cut perforations that create a signature firefly glow effect at night. Fabricated by Yeti Welding in Utah.',
  creator: {
    '@type': 'Organization',
    name: 'Yeti Welding',
    url: 'https://yetiwelding.com',
    telephone: '801-995-8906',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '1680 W 1600 S',
      addressLocality: 'Springville',
      addressRegion: 'UT',
      postalCode: '84663',
      addressCountry: 'US',
    },
  },
  material: '3/16" COR-TEN Weathering Steel with HSS structural core',
  image: 'https://yetiwelding.com/homepage/featuredproject.JPG',
  url: 'https://yetiwelding.com/projects/firefly-arch',
  locationCreated: {
    '@type': 'Place',
    name: 'Springville, Utah, USA',
  },
  keywords: 'Corten steel, CNC laser cutting, monument structure, custom fabrication, entrance arch',
};

export default function FireflyArchPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }}
      />
      <FireflyArchCaseStudy />
    </>
  );
}
