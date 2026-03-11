import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Custom Products | Yeti Welding - Dumpster Gates, Pergolas, Steel Embeds',
  description:
    'Order custom welding and fabrication products from Yeti Welding. Dumpster gates, steel embed plates, pergolas, and garden boxes. Configure and order online.',
  keywords: [
    'order welding',
    'custom fabrication order',
    'dumpster gates',
    'steel embeds',
    'pergolas',
    'garden boxes',
    'Yeti Welding order',
  ],
  openGraph: {
    title: 'Order | Yeti Welding',
    description: 'Order custom dumpster gates, steel embeds, pergolas, and garden boxes. Configure and order online.',
    url: 'https://yetiwelding.com/order',
    siteName: 'Yeti Welding',
    images: [
      {
        url: '/homepage/hero.JPG',
        width: 1200,
        height: 630,
        alt: 'Yeti Welding - Order Custom Products',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Order | Yeti Welding',
    description: 'Order custom welding and fabrication products online.',
    images: ['/homepage/hero.JPG'],
  },
  alternates: {
    canonical: 'https://yetiwelding.com/order',
  },
};

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
