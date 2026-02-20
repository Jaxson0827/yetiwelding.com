'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GardenBoxConfigurator from '@/components/garden-boxes/GardenBoxConfigurator';

export default function GardenBoxesPage() {
  return (
    <main className="min-h-screen bg-black">
      <Header />

      <section className="pt-32 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 uppercase tracking-tight">
              Custom Steel Garden Boxes
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Design your raised garden bed in under a minute.
            </p>
            <p className="text-white/90 text-lg font-medium mt-3 max-w-2xl mx-auto">
              Grow your own food. Build it once. Keep it forever.
            </p>
          </div>

          <GardenBoxConfigurator />
        </div>
      </section>

      <Footer />
    </main>
  );
}
