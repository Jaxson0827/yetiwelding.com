import { Metadata } from 'next';
import { getOrderProductBySlug } from '@/lib/orderProductData';

const product = getOrderProductBySlug('garden-boxes')!;

export const metadata: Metadata = {
  title: `Custom Garden Boxes | Order Steel Raised Garden Beds | Yeti Welding`,
  description: product.description,
  keywords: product.keywords,
  openGraph: {
    title: `Custom Garden Boxes | Yeti Welding`,
    description: product.description,
    url: product.url,
    siteName: 'Yeti Welding',
    images: [
      {
        url: product.ogImage,
        width: 1200,
        height: 630,
        alt: 'Yeti Welding - Custom Garden Boxes',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Custom Garden Boxes | Yeti Welding`,
    description: product.description,
    images: [product.ogImage],
  },
  alternates: {
    canonical: product.url,
  },
};

export default function GardenBoxesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
