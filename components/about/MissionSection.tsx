'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { missionContent } from '@/lib/aboutData';

export default function MissionSection() {
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
      className="relative w-full py-20 md:py-32 px-4 overflow-hidden bg-black"
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
      <div className="container mx-auto max-w-4xl">
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white uppercase mb-8 leading-tight"
            variants={itemVariants}
          >
            {missionContent.title}
          </motion.h2>

          <motion.p
            className="text-white/90 text-xl md:text-2xl lg:text-3xl leading-relaxed mb-10 font-light max-w-3xl mx-auto"
            variants={itemVariants}
          >
            {missionContent.primaryStatement}
          </motion.p>

          <motion.p
            className="text-white/70 text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
            variants={itemVariants}
          >
            {missionContent.supportingStatement}
          </motion.p>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </section>
  );
}








