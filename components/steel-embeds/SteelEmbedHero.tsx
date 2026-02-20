'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function SteelEmbedHero() {
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
      id="steel-embed-hero"
      className="relative w-full min-h-[40vh] flex items-center justify-center overflow-hidden pt-32 pb-16"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/steel_embed_plates/embed_plate_hero.png)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 40%, rgba(74, 124, 89, 0.2) 0%, rgba(220, 20, 60, 0.12) 40%, transparent 70%)',
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
            Custom Steel Plates
          </span>
          <div className="w-16 h-px bg-white/30 ml-4" />
        </motion.div>

        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 uppercase tracking-tight leading-tight"
          variants={itemVariants}
        >
          Steel Embed Plates
        </motion.h1>

        <motion.p
          className="text-white/80 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-3"
          variants={itemVariants}
        >
          Design your plate dimensions and stud layout. Live 3D preview.
        </motion.p>

        <motion.p
          className="text-white/90 text-lg font-medium max-w-2xl mx-auto"
          variants={itemVariants}
        >
          Reviewed before fabrication. Built to your specs.
        </motion.p>
      </motion.div>

      {/* Decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4a7c59]/30 to-transparent" />
    </section>
  );
}
