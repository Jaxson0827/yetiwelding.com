import { Metadata } from 'next';
import CartProviderWrapper from '@/components/CartProviderWrapper';

export const metadata: Metadata = {
  title: 'Shopping Cart | Yeti Welding',
  description: 'Review your Yeti Welding order. Custom fabrication products including dumpster gates, steel embeds, pergolas, and garden boxes.',
  robots: { index: false, follow: true },
  openGraph: {
    title: 'Shopping Cart | Yeti Welding',
    description: 'Review your Yeti Welding order.',
    url: 'https://yetiwelding.com/cart',
    siteName: 'Yeti Welding',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://yetiwelding.com/cart',
  },
};

export default function CartLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <CartProviderWrapper>{children}</CartProviderWrapper>;
}
