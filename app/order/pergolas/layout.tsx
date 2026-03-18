import { Metadata } from 'next';
import { getOrderProductBySlug } from '@/lib/orderProductData';

const product = getOrderProductBySlug('pergolas')!;

export const metadata: Metadata = {
  title: `Custom Pergolas | Order Steel Shade Structures | Yeti Welding`,
  description: product.description,
  keywords: product.keywords,
  openGraph: {
    title: `Custom Pergolas | Yeti Welding`,
    description: product.description,
    url: product.url,
    siteName: 'Yeti Welding',
    images: [
      {
        url: product.ogImage,
        width: 1200,
        height: 630,
        alt: 'Yeti Welding - Custom Pergolas',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Custom Pergolas | Yeti Welding`,
    description: product.description,
    images: [product.ogImage],
  },
  alternates: {
    canonical: product.url,
  },
};

export default function PergolasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
