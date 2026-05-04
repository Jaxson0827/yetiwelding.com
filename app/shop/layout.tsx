import { Metadata } from 'next';
import ShopSubNav from '@/components/shop/nav/ShopSubNav';
import ShopFooter from '@/components/shop/ShopFooter';

export const metadata: Metadata = {
  title: 'Yeti Steel Goods | Lawn & Garden Steel | Yeti Welding',
  description:
    'Premium COR-TEN steel landscape edging, planters, fire pits, raised beds, and signs from Yeti Welding. Built to last, designed to age beautifully.',
  keywords: [
    'cor-ten steel',
    'landscape edging',
    'steel planters',
    'steel fire pits',
    'raised garden beds',
    'yeti welding shop',
  ],
  openGraph: {
    title: 'Yeti Steel Goods',
    description:
      'Premium COR-TEN steel goods for the landscape — edging, planters, fire pits, and more.',
    url: 'https://yetiwelding.com/shop',
    siteName: 'Yeti Welding',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://yetiwelding.com/shop',
  },
};

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-black text-white">
      <ShopSubNav />
      <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
      <ShopFooter />
    </div>
  );
}
