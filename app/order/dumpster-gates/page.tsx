'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DumpsterGateConfigurator from '@/components/dumpster-gates/DumpsterGateConfigurator';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

export default function DumpsterGatesPage() {
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
        className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden pt-32 pb-20"
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
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Product Image */}
            <motion.div
              className="relative w-full aspect-square max-w-md mx-auto lg:mx-0"
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="relative w-full h-full bg-white/5 rounded-lg overflow-hidden border-2 border-white/20">
                <Image
                  src="/dumpster-gate-elevation.png"
                  alt="Steel Dumpster Gate"
                  fill
                  className="object-contain p-4"
                  priority
                />
              </div>
            </motion.div>

            {/* Right: Title, Value Prop, Price, CTA */}
            <motion.div
              className="relative z-10 text-center lg:text-left"
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
            >
              <motion.div
                className="flex items-center justify-center lg:justify-start mb-6"
                variants={itemVariants}
              >
                <div className="w-16 h-px bg-white/30 mr-4" />
                <span className="text-white/60 uppercase text-xs tracking-[0.2em] font-light">
                  STANDARD SIZES
                </span>
                <div className="w-16 h-px bg-white/30 ml-4" />
              </motion.div>

              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 uppercase tracking-tight leading-none text-white"
                variants={itemVariants}
              >
                Steel Dumpster Gate
              </motion.h1>

              <motion.p
                className="text-white/80 text-lg md:text-xl leading-relaxed mb-6"
                variants={itemVariants}
              >
                Built to spec. Fabricated in Utah. Ready to install.
              </motion.p>

              <motion.div
                className="mb-8"
                variants={itemVariants}
              >
                <p className="text-white/60 text-sm mb-2">Starting from</p>
                <p className="text-white text-3xl font-bold">$1,200</p>
              </motion.div>

              <motion.a
                href="#configurator"
                className="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                variants={itemVariants}
              >
                Configure & Order
              </motion.a>
            </motion.div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </section>

      {/* Configurator Section */}
      <section id="configurator" className="w-full py-20 px-4">
        <div className="container mx-auto">
          <DumpsterGateConfigurator />
        </div>
      </section>

      {/* What's Included Section */}
      <section className="w-full py-20 px-4 bg-white/5">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-white text-3xl font-bold mb-8 text-center">What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white/80">Fully welded steel frame</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white/80">Hinges installed</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white/80">Latch hardware included</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white/80">Shop drawings available on request</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white/80">Fabricated by Yeti Welding</p>
            </div>
          </div>
        </div>
      </section>

      {/* Installation Notes Section */}
      <section className="w-full py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-white text-3xl font-bold mb-6">Installation Notes</h2>
          <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6">
            <p className="text-white/80 mb-4">
              These gates are intended for steel or masonry dumpster enclosures.
            </p>
            <p className="text-white/80">
              Concrete embeds and anchors not included unless specified.
            </p>
            <a
              href="#"
              className="inline-block mt-4 text-red-500 hover:text-red-400 text-sm transition-colors"
            >
              Download install guidelines (PDF)
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-20 px-4 bg-white/5">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-white text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-2">Can you make custom sizes?</h3>
              <p className="text-white/80">
                Yes, we can fabricate custom sizes. Please contact us for a quote on non-standard dimensions.
              </p>
            </div>
            <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-2">Do you ship or local pickup only?</h3>
              <p className="text-white/80">
                We offer both shipping and local pickup. Shipping costs will be calculated at checkout.
              </p>
            </div>
            <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-2">What's the lead time?</h3>
              <p className="text-white/80">
                Standard lead time is 2-3 weeks. Powder coat adds 3-5 business days. Galvanized finishes may require extended lead time.
              </p>
            </div>
            <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-2">Are these code compliant?</h3>
              <p className="text-white/80">
                Yes, our gates are fabricated to meet standard building codes. For specific code requirements, please contact us.
              </p>
            </div>
            <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-2">Can I mount to CMU?</h3>
              <p className="text-white/80">
                Yes, these gates can be mounted to CMU (concrete masonry units). Proper anchors and installation methods should be used.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}






