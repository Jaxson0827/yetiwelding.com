'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { companyStats } from '@/lib/aboutData';

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-20 md:py-32 px-4 overflow-hidden bg-white"
    >
      {/* Content */}
      <div className="container mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Large Number */}
          <motion.div
            className="text-7xl md:text-8xl lg:text-9xl font-bold text-black mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {companyStats.yearsInBusiness}
          </motion.div>
          
          {/* Text Below */}
          <motion.p
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-black uppercase tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            YEARS OF Experience
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

