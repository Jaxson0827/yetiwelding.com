'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

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
            WHAT WE OFFER
          </span>
          <div className="w-16 h-px bg-white/30 ml-4" />
        </motion.div>

        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 uppercase tracking-tight leading-none text-glow text-shadow-strong"
          variants={itemVariants}
        >
          OUR SERVICES
        </motion.h1>

        <motion.p
          className="text-white/80 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-8"
          variants={itemVariants}
        >
          Professional welding and fabrication services delivered with precision,
          craftsmanship, and attention to detail. With 40+ years of experience, we specialize
          in custom fabrication, structural welding, and ornamental work.
        </motion.p>

        {/* Primary CTA */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.a
            href="#main-content"
            className="group relative inline-flex items-center justify-center px-10 py-4 border-2 border-white bg-transparent text-white uppercase text-sm font-semibold tracking-[0.15em] overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              className="relative z-10"
              initial={{ opacity: 1 }}
              whileHover={{ opacity: 0 }}
            >
              EXPLORE SERVICES
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
              EXPLORE SERVICES
            </motion.span>
          </motion.a>

          <motion.a
            href="/contact"
            className="group relative inline-flex items-center justify-center px-10 py-4 border-2 border-white/30 bg-white/5 backdrop-blur-sm text-white uppercase text-sm font-semibold tracking-[0.15em]"
            whileHover={{ scale: 1.05, borderColor: 'rgba(255, 255, 255, 0.6)' }}
            whileTap={{ scale: 0.95 }}
          >
            GET A QUOTE
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </section>
  );
}



