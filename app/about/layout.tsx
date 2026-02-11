import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Yeti Welding - Founded 2016',
  description: 'Learn about Yeti Welding—our mission, values, and the story behind our growth from hands-on beginnings to a full-scale operation. Founded in 2016 in Springville, Utah.',
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
    title: 'About Us | Yeti Welding - Founded 2016',
    description: 'Discover the story behind Yeti Welding—founded in 2016, built on craftsmanship, integrity, and problem-solving.',
    url: 'https://yetiwelding.com/about',
    siteName: 'Yeti Welding',
    images: [
      {
        url: 'https://yetiwelding.com/homepage/team_photo.jpeg',
        width: 1200,
        height: 630,
        alt: 'Yeti Welding Team',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Yeti Welding - Founded 2016',
    description: 'Discover the story behind Yeti Welding—founded in 2016, built on craftsmanship and problem-solving.',
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




