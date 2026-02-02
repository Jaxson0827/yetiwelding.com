'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SteelEmbedsConfigurator from '@/components/steel-embeds/SteelEmbedsConfigurator';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function SteelEmbedsPage() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99] as [number, number, number, number],
      },
    },
  };

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      {/* Hero Section */}
      <section
        ref={sectionRef}
        className="relative w-full min-h-[50vh] flex items-center justify-center overflow-hidden pt-32 pb-16"
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(220, 20, 60, 0.3) 0%, transparent 70%)',
          }}
        />

        {/* Content */}
        <motion.div
          className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.div
            className="flex items-center justify-center mb-6"
            variants={itemVariants}
          >
            <div className="w-16 h-px bg-white/30 mr-4" />
            <span className="text-white/60 uppercase text-xs tracking-[0.2em] font-light">
              CUSTOM STEEL EMBEDS
            </span>
            <div className="w-16 h-px bg-white/30 ml-4" />
          </motion.div>

          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 uppercase tracking-tight leading-none text-glow text-shadow-strong"
            variants={itemVariants}
          >
            STEEL PLATE EMBEDS
          </motion.h1>

          <motion.p
            className="text-white/80 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Create a custom steel embed plate in minutes—no drawings required.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col items-center gap-5"
            variants={itemVariants}
          >
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/15 border border-green-500/40">
                <span className="text-green-200 text-xs font-semibold uppercase tracking-wider">
                  Instant quote on standard embeds
                </span>
              </div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-500/15 border border-yellow-500/40">
                <span className="text-yellow-200 text-xs font-semibold uppercase tracking-wider">
                  Some configurations require review
                </span>
              </div>
            </div>

            <a
              href="#configurator"
              className="inline-flex items-center justify-center px-10 py-4 rounded-lg bg-[#DC143C] text-white font-semibold hover:bg-[#B01030] transition-colors"
            >
              Configure &amp; Order
            </a>
          </motion.div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </section>

      {/* Contractor Trust Signals */}
      <section className="w-full py-6 px-4 border-b border-white/10">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-white/80 text-sm md:text-base">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#DC143C] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Reviewed by our shop before fabrication.</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#DC143C] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>Questions? We&apos;ll call you before cutting steel.</span>
          </div>
        </div>
      </section>

      {/* Configurator Section */}
      <section id="configurator" className="w-full py-20 px-4">
        <div className="container mx-auto">
          <SteelEmbedsConfigurator />
        </div>
      </section>

      {/* How it Works */}
      <section className="w-full py-20 px-4 bg-white/5">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-white text-3xl font-bold mb-10 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: '1) Plate', body: 'Enter plate length, width, thickness, and material.' },
              { title: '2) Studs', body: 'Choose a stud layout and set edge dimensions like your drawings.' },
              { title: '3) Finish & Quantity', body: 'Choose finish and tolerance, then set quantity and review pricing.' },
              { title: '4) Project Info', body: 'Add optional job details to help us process faster.' },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white/5 border-2 border-white/20 rounded-lg p-6"
              >
                <h3 className="text-white text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-white/80">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Need From You */}
      <section className="w-full py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-white text-3xl font-bold mb-8 text-center">What We Need From You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-2">Plate Dimensions</h3>
              <p className="text-white/80">
                Use inches. Plate dimensions drive pricing, lead time, and the 3D preview.
              </p>
            </div>
            <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-2">Stud Coordinates</h3>
              <p className="text-white/80">
                Coordinates are measured from the plate center: (0, 0). Positive X is right, positive Y is up.
                Use the visual editor to avoid layout mistakes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Time & Tolerances */}
      <section className="w-full py-20 px-4 bg-white/5">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-white text-3xl font-bold mb-8 text-center">Lead Time &amp; Tolerances</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-2">Standard vs Tight</h3>
              <p className="text-white/80">
                Tight tolerance may require additional setup or verification. If you’re not sure, select Standard and
                include notes in Special Instructions.
              </p>
            </div>
            <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-2">Standard vs Rush</h3>
              <p className="text-white/80">
                Rush increases price and may be limited by current production schedule. If we can’t meet the requested
                timeline, we’ll reach out before fabrication.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-white text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-2">Can you handle custom stud layouts?</h3>
              <p className="text-white/80">
                Yes. Use the visual editor to place studs, then adjust coordinates precisely in the list.
              </p>
            </div>
            <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-2">What does “review required” mean?</h3>
              <p className="text-white/80">
                Some configurations fall outside our instant-quote rules (e.g., high stud count or non-standard options).
                We may confirm details before fabrication and final pricing.
              </p>
            </div>
            <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-2">Is the 3D preview exact?</h3>
              <p className="text-white/80">
                It’s representative for visualization. Final layout is per approved drawings and order details.
              </p>
            </div>
            <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-2">Can I export documentation?</h3>
              <p className="text-white/80">
                Yes. You can export a quote PDF, and we can generate shop packet documents after checkout.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}


