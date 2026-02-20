'use client';

import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PergolaConfigurator from '@/components/pergolas/PergolaConfigurator';

export default function PergolasPage() {
  return (
    <main className="min-h-screen bg-black">
      <Header />

      <section id="configurator" className="w-full pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-10">
            <h1 className="text-white text-4xl md:text-5xl font-bold uppercase tracking-tight leading-none">
              Custom Pergolas
            </h1>
            <p className="text-white/75 text-lg mt-4">
              Design your steel shade structure. Choose size, height, color, and roof design. Live 3D preview.
            </p>
          </div>
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
  );
}
