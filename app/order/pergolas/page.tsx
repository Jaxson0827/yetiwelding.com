'use client';

import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PergolaHero from '@/components/pergolas/PergolaHero';
import PergolaConfigurator from '@/components/pergolas/PergolaConfigurator';
import ProductPageSchema from '@/components/seo/ProductPageSchema';
import { getOrderProductBySlug } from '@/lib/orderProductData';

export default function PergolasPage() {
  const product = getOrderProductBySlug('pergolas')!;
  return (
    <>
      <ProductPageSchema product={product} />
      <main className="min-h-screen bg-black">
      <Header />

      <PergolaHero />

      <div className="h-px bg-gradient-to-r from-transparent via-[#4a7c59]/20 to-transparent" />
      <section id="configurator" className="pt-12 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center text-white/60">Loading configurator...</div>}>
            <PergolaConfigurator />
          </Suspense>
        </div>
      </section>

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
              <p className="text-white/80">Pre-cut steel frame components</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#DC143C] flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white/80">Aluminum roof panels with pattern</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#DC143C] flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white/80">Hardware and anchors</p>
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
              <p className="text-white/80">Fabricated by Yeti Welding</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
    </>
  );
}
