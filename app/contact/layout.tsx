import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Yeti Welding - Get a Quote | Springville, Utah',
  description:
    'Contact Yeti Welding for welding and fabrication quotes. Call 801-995-8906, email, or use our form. Based in Springville, Utah. Serving the Intermountain West.',
  keywords: [
    'contact yeti welding',
    'welding quote',
    'fabrication quote',
    'Utah welding contact',
    'Springville welding',
    'get a quote',
  ],
  openGraph: {
    title: 'Contact Us | Yeti Welding',
    description: 'Get a quote for your welding or fabrication project. Call, email, or fill out our contact form.',
    url: 'https://yetiwelding.com/contact',
    siteName: 'Yeti Welding',
    images: [
      {
        url: '/og/yeti-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Yeti Welding - Contact Us',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | Yeti Welding',
    description: 'Get a quote for your welding or fabrication project.',
    images: ['/og/yeti-og.jpg'],
  },
  alternates: {
    canonical: 'https://yetiwelding.com/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
