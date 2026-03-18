import { Metadata } from 'next';
import { getOrderProductBySlug } from '@/lib/orderProductData';

const product = getOrderProductBySlug('steel-embeds')!;

export const metadata: Metadata = {
  title: `Steel Plate Embeds | Order Custom Steel Embeds | Yeti Welding`,
  description: product.description,
  keywords: product.keywords,
  openGraph: {
    title: `Steel Plate Embeds | Yeti Welding`,
    description: product.description,
    url: product.url,
    siteName: 'Yeti Welding',
    images: [
      {
        url: product.ogImage,
        width: 1200,
        height: 630,
        alt: 'Yeti Welding - Steel Plate Embeds',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Steel Plate Embeds | Yeti Welding`,
    description: product.description,
    images: [product.ogImage],
  },
  alternates: {
    canonical: product.url,
  },
};

export default function SteelEmbedsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
