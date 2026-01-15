'use client';

import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { philosophyItems } from '@/lib/aboutData';

export default function PhilosophySection() {
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
    hidden: { opacity: 0, y: 50 },
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
      id="philosophy"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black"
      aria-labelledby="philosophy-heading"
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

      <motion.div
        className="container mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {/* Section Header */}
        <motion.div
          className="text-center py-16 px-4"
          variants={itemVariants}
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-px bg-white/30 mr-4" />
            <span className="text-white/60 uppercase text-xs tracking-[0.2em] font-light">
              OUR APPROACH
            </span>
            <div className="w-16 h-px bg-white/30 ml-4" />
          </div>
          <h2 id="philosophy-heading" className="text-4xl md:text-5xl lg:text-6xl font-bold text-white uppercase mb-4 leading-tight">
            OUR PHILOSOPHY
          </h2>
        </motion.div>

        {/* Philosophy Items */}
        {philosophyItems.map((item, index) => (
          <motion.div
            key={item.title}
            className={`flex flex-col ${
              item.imageSide === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'
            } overflow-hidden`}
            variants={itemVariants}
          >
            {/* Image Side */}
            <div className="w-full lg:w-1/2 relative h-[400px] lg:h-[600px]">
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
              {item.imageSide === 'left' && (
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
              )}
              {item.imageSide === 'right' && (
                <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-transparent to-transparent" />
              )}
            </div>

            {/* Content Side */}
            <div className="w-full lg:w-1/2 bg-black p-10 lg:p-16 flex flex-col justify-center relative">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-900/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-900/5 rounded-full blur-3xl" />

              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white uppercase mb-6 leading-tight">
                  {item.title}
                </h3>
                <p className="text-white/90 text-base md:text-lg leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </section>
  );
}







