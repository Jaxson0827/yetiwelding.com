import ShopHero from '@/components/shop/landing/ShopHero';
import CategoryGrid from '@/components/shop/landing/CategoryGrid';

export default function ShopLandingPage() {
  return (
    <>
      <ShopHero />
      <CategoryGrid />
      {/* Customer reviews section removed until we have real Yeti reviews to show (see components/shop/landing/SocialProof.tsx). */}
    </>
  );
}
