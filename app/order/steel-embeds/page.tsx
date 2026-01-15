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
        className="relative w-full min-h-[50vh] flex items-center justify-center overflow-hidden pt-32"
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
            Configure your custom steel plate embed with our ordering system.
            Specify dimensions and get an instant quote.
          </motion.p>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </section>

      {/* Configurator Section */}
      <section className="w-full py-20 px-4">
        <div className="container mx-auto">
          <SteelEmbedsConfigurator />
        </div>
      </section>

      <Footer />
    </main>
  );
}


