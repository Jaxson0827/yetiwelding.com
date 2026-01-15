'use client';

import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function AboutSection() {
  const aboutPath = '/homepage/about.jpg';
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
      className="w-full flex flex-col lg:flex-row overflow-hidden"
    >
      {/* Left Column - Image */}
      <motion.div
        className="w-full lg:w-1/2 relative h-[500px] lg:h-[700px] overflow-hidden group"
        initial={{ opacity: 0, x: -50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
      >
        <Image
          src={aboutPath}
          alt="Yeti Welding founder mentoring the next generation of welders, demonstrating the company's commitment to passing down 40+ years of metal fabrication expertise and craftsmanship traditions"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 1024px) 100vw, 50vw"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
        />
        
        {/* Parallax effect on hover */}
        <motion.div
          className="absolute inset-0"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Right Column - Content */}
      <motion.div
        className="w-full lg:w-1/2 bg-black p-10 lg:p-16 flex flex-col justify-center relative"
        initial={{ opacity: 0, x: 50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
        variants={containerVariants}
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-900/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-900/5 rounded-full blur-3xl" />

        <div className="relative z-10">
          <motion.div
            className="mb-6"
            variants={itemVariants}
          >
            <div className="flex items-center mb-4">
              <motion.span
                className="text-white uppercase text-xs tracking-[0.2em] font-light mr-4 whitespace-nowrap"
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                ABOUT US
              </motion.span>
              <motion.div
                className="flex-1 h-px bg-white"
                initial={{ width: 0 }}
                animate={isInView ? { width: '100%' } : {}}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </div>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white uppercase mb-8 leading-tight"
            variants={itemVariants}
          >
            EXPERIENCE AND RESULTS
          </motion.h2>

          <motion.p
            className="text-white/90 text-base md:text-lg leading-relaxed mb-8 max-w-2xl"
            variants={itemVariants}
          >
            This photo tells our story—founder passing down knowledge to the next
            generation. With decades of experience and a legacy built on
            craftsmanship, we deliver results that speak for themselves.
          </motion.p>

          {/* Key Values/Statistics Grid */}
          <motion.div
            className="grid grid-cols-2 gap-6 mb-10"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <motion.div
              variants={itemVariants}
              className="border-l-2 border-accent-red pl-4"
            >
              <div className="text-3xl font-bold text-accent-red mb-1">40+</div>
              <div className="text-white/70 text-sm uppercase tracking-wide">Years Experience</div>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="border-l-2 border-accent-red pl-4"
            >
              <div className="text-3xl font-bold text-accent-red mb-1">1000+</div>
              <div className="text-white/70 text-sm uppercase tracking-wide">Projects Completed</div>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.a
              href="/about"
              className="group relative inline-flex items-center justify-center px-10 py-4 border-2 border-white bg-transparent text-white uppercase text-sm font-semibold tracking-[0.15em] overflow-hidden w-fit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className="relative z-10"
                initial={{ opacity: 1 }}
                whileHover={{ opacity: 0 }}
              >
                LEARN MORE
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
                LEARN MORE
              </motion.span>
            </motion.a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

