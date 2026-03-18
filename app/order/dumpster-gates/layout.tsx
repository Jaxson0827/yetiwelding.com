import { Metadata } from 'next';
import { getOrderProductBySlug } from '@/lib/orderProductData';

const product = getOrderProductBySlug('dumpster-gates')!;

export const metadata: Metadata = {
  title: `Dumpster Gates | Order Custom Steel Dumpster Gates | Yeti Welding`,
  description: product.description,
  keywords: product.keywords,
  openGraph: {
    title: `Dumpster Gates | Yeti Welding`,
    description: product.description,
    url: product.url,
    siteName: 'Yeti Welding',
    images: [
      {
        url: product.ogImage,
        width: 1200,
        height: 630,
        alt: 'Yeti Welding - Dumpster Gates',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Dumpster Gates | Yeti Welding`,
    description: product.description,
    images: [product.ogImage],
  },
  alternates: {
    canonical: product.url,
  },
};

export default function DumpsterGatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
