'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

export default function ServicesHero() {
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
    <section
      ref={sectionRef}
      className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden pt-32"
    >
      {/* Background Photo */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/projects/firefly-arch/hero-day.JPG"
          alt="Yeti Welding — Firefly Entrance Arch"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Dark gradient overlay — heavier at top and bottom so text is always legible */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/80" />
        {/* Subtle red accent */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 60%, rgba(220, 20, 60, 0.4) 0%, transparent 65%)',
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <motion.div
          className="flex items-center justify-center mb-6"
          variants={itemVariants}
        >
          <div className="w-16 h-px bg-white/40 mr-4" />
          <span className="text-white/70 uppercase text-xs tracking-[0.2em] font-light">
            WHAT WE BUILD
          </span>
          <div className="w-16 h-px bg-white/40 ml-4" />
        </motion.div>

        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 uppercase tracking-tight leading-none text-glow text-shadow-strong"
          variants={itemVariants}
        >
          CUSTOM METALWORK.
          <br />
          <span className="text-accent-red">BUILT TO OUTLAST.</span>
        </motion.h1>

        <motion.p
          className="text-white/85 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10"
          variants={itemVariants}
        >
          From residential railings to monumental commercial structures — custom fabrication
          engineered for work that has to be done right the first time.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-14"
        >
          <motion.a
            href="/contact"
            className="group relative inline-flex items-center justify-center px-10 py-4 border-2 border-white bg-transparent text-white uppercase text-sm font-semibold tracking-[0.15em] overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              className="relative z-10"
              initial={{ opacity: 1 }}
              whileHover={{ opacity: 0 }}
            >
              GET A QUOTE
            </motion.span>
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="absolute inset-0 flex items-center justify-center text-black z-10"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              GET A QUOTE
            </motion.span>
          </motion.a>

          <motion.a
            href="/projects"
            className="group relative inline-flex items-center justify-center px-10 py-4 border-2 border-white/30 bg-white/5 backdrop-blur-sm text-white uppercase text-sm font-semibold tracking-[0.15em]"
            whileHover={{ scale: 1.05, borderColor: 'rgba(255, 255, 255, 0.6)' }}
            whileTap={{ scale: 0.95 }}
          >
            VIEW PROJECTS
          </motion.a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="flex flex-col items-center gap-2"
          variants={itemVariants}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        >
          <span className="text-white/40 uppercase text-[10px] tracking-[0.2em]">SCROLL</span>
          <svg
            className="w-5 h-5 text-white/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </section>
  );
}
