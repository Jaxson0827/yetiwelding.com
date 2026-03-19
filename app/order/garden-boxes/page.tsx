'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GardenBoxHero from '@/components/garden-boxes/GardenBoxHero';
import GardenBoxConfigurator from '@/components/garden-boxes/GardenBoxConfigurator';
import ProductPageSchema from '@/components/seo/ProductPageSchema';
import { getOrderProductBySlug } from '@/lib/orderProductData';

export default function GardenBoxesPage() {
  const product = getOrderProductBySlug('garden-boxes')!;
  return (
    <>
      <ProductPageSchema product={product} />
      <main className="min-h-screen bg-black">
      <Header showCart />

      {/* Trust Bar */}
      <section className="w-full py-6 px-4 border-b border-white/10">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-white/80 text-sm md:text-base">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#DC143C] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span>Ships flat-pack</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#DC143C] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <span>Parcel delivery for most sizes</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#DC143C] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>Made in Utah</span>
          </div>
        </div>
      </section>

      <GardenBoxHero />

      <div className="h-px bg-gradient-to-r from-transparent via-[#4a7c59]/20 to-transparent" />
      <section id="configurator" className="pt-12 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <GardenBoxConfigurator />
        </div>
      </section>

      {/* What's Included */}
      <section className="w-full py-20 px-4 bg-white/5">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-white text-3xl font-bold mb-8 text-center">What&apos;s Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#DC143C] flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white/80">11ga steel panels</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#DC143C] flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white/80">Bolt-together kit with hardware</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#DC143C] flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white/80">Pre-drilled flanges</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#DC143C] flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white/80">Install guide</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#DC143C] flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white/80">Fabricated in Utah</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
    </>
  );
}
