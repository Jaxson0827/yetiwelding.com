import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Yeti Welding - 40+ Years of Excellence in Metal Fabrication',
  description: 'Learn about Yeti Welding\'s 40+ year legacy of craftsmanship, integrity, and innovation in metal fabrication. Discover our mission, values, history, and the story behind The Way of the Yeti. Quality, Integrity, Craftsmanship, Experience, Innovation, and Dedication guide everything we do.',
  keywords: [
    'about yeti welding',
    'welding company history',
    'metal fabrication team',
    'Utah welding company',
    'Springville welding',
    'welding craftsmanship',
    'welding company values',
    'welding expertise',
  ],
  openGraph: {
    title: 'About Us | Yeti Welding - 40+ Years of Excellence',
    description: 'Discover the story behind Yeti Welding. 40+ years of craftsmanship, integrity, and innovation in metal fabrication.',
    url: 'https://yetiwelding.com/about',
    siteName: 'Yeti Welding',
    images: [
      {
        url: 'https://yetiwelding.com/homepage/team_photo.jpeg',
        width: 1200,
        height: 630,
        alt: 'Yeti Welding Team - 40+ Years of Excellence',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Yeti Welding - 40+ Years of Excellence',
    description: 'Discover the story behind Yeti Welding. 40+ years of craftsmanship, integrity, and innovation.',
    images: ['https://yetiwelding.com/homepage/team_photo.jpeg'],
  },
  alternates: {
    canonical: 'https://yetiwelding.com/about',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}




