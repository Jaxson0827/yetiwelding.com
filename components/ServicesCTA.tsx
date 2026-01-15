'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function ServicesCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-20 md:py-32 px-4 overflow-hidden"
    >
      {/* Background Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.98) 0%, rgba(40, 10, 10, 0.98) 50%, rgba(60, 15, 15, 0.98) 100%)',
        }}
      />

      {/* Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(220, 20, 60, 0.8) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Content */}
      <div className="container mx-auto relative z-10">
        <motion.div
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] as [number, number, number, number] }}
        >
          <motion.div
            className="flex items-center justify-center mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="w-16 h-px bg-white/30 mr-4" />
            <span className="text-white/60 uppercase text-xs tracking-[0.2em] font-light">
              READY TO GET STARTED?
            </span>
            <div className="w-16 h-px bg-white/30 ml-4" />
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white uppercase mb-6 leading-tight text-glow"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            LET'S BUILD SOMETHING
            <br />
            <span className="text-accent-red">EXTRAORDINARY</span>
          </motion.h2>

          <motion.p
            className="text-white/80 text-lg md:text-xl leading-relaxed mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Contact us today to discuss your project. We're here to bring your vision to life
            with precision, craftsmanship, and attention to detail.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
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
              href="tel:8019958906"
              className="group relative inline-flex items-center justify-center px-10 py-4 border-2 border-white/30 bg-white/5 backdrop-blur-sm text-white uppercase text-sm font-semibold tracking-[0.15em]"
              whileHover={{ scale: 1.05, borderColor: 'rgba(255, 255, 255, 0.6)' }}
              whileTap={{ scale: 0.95 }}
            >
              CALL US: 801-995-8906
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </section>
  );
}




