'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function ProjectsHero() {
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
      className="relative w-full py-16 md:py-20 lg:py-24 flex items-center justify-center overflow-hidden border-b-[10px] border-black"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(220, 20, 60, 0.8) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <motion.div
          className="w-16 h-px bg-white mx-auto mb-6"
          initial={{ width: 0 }}
          animate={isInView ? { width: 64 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
        />
        <motion.p
          className="text-sm md:text-base mb-4 uppercase tracking-[0.2em] font-light text-white/90"
          variants={itemVariants}
        >
          OUR WORK
        </motion.p>
        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 uppercase tracking-tight leading-none text-glow"
          variants={itemVariants}
        >
          OUR PROJECTS
        </motion.h1>
        <motion.p
          className="text-base md:text-lg text-white/80 max-w-2xl mx-auto"
          variants={itemVariants}
        >
          Showcasing decades of exceptional craftsmanship and custom fabrication expertise
        </motion.p>
      </motion.div>
    </section>
  );
}


