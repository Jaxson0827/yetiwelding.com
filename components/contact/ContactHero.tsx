'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function ContactHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

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

  const titleVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.6, -0.05, 0.01, 0.99] as [number, number, number, number],
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden pt-32"
    >
      {/* Animated Background with Parallax */}
      <motion.div
        className="absolute inset-0"
        style={{ y }}
      >
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />
        
        {/* Red accent glow with animation */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(220, 20, 60, 0.3) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(220, 20, 60, 0.8) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </motion.div>

      {/* Content Overlay with Fade */}
      <motion.div
        className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto"
        style={{ opacity }}
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
            GET IN TOUCH
          </span>
          <div className="w-16 h-px bg-white/30 ml-4" />
        </motion.div>

        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 uppercase tracking-tight leading-none text-glow text-shadow-strong"
          variants={titleVariants}
        >
          CONTACT US
        </motion.h1>

        <motion.p
          className="text-white/80 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
          variants={itemVariants}
        >
          Ready to bring your vision to life? We're here to help. Reach out and let's
          discuss how we can turn your ideas into exceptional metalwork.
        </motion.p>

      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </section>
  );
}











