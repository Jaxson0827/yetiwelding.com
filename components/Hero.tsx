'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

export default function Hero() {
  const heroPath = '/homepage/hero.JPG';
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Floating particles effect - disabled on mobile and for users who prefer reduced motion
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Detect mobile devices and reduced motion preference
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    const checkReducedMotion = () => {
      setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    };
    
    checkMobile();
    checkReducedMotion();
    window.addEventListener('resize', checkMobile);
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', checkReducedMotion);
    
    // Only create particles on desktop and if user doesn't prefer reduced motion
    if (!isMobile && !prefersReducedMotion) {
      const particleCount = 20;
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
      }));
      setParticles(newParticles);
    }
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      mediaQuery.removeEventListener('change', checkReducedMotion);
    };
  }, [isMobile, prefersReducedMotion]);

  // Character-by-character reveal for title
  const title = 'YETI WELDING';
  const titleChars = title.split('');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
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

  const charVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -90 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: [0.6, -0.05, 0.01, 0.99] as [number, number, number, number],
      },
    }),
  };

  return (
    <section 
      ref={sectionRef}
      className="relative w-full min-h-[75vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <motion.div 
        className="absolute inset-0 w-full h-full"
        style={{ y }}
      >
        <Image
          src={heroPath}
          alt="Yeti Welding professional metal fabrication workshop in Springville, Utah, showcasing skilled welders creating custom steel structures and ornamental metalwork"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={90}
        />
        {/* Enhanced Multi-Stop Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 via-black/40 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Animated Light Rays */}
        <motion.div
          className="absolute inset-0 opacity-20"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <div 
            className="absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(220, 20, 60, 0.3) 0%, transparent 70%)',
            }}
          />
        </motion.div>
      </motion.div>

      {/* Floating Particles/Sparkles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-accent-red rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            y: [0, -100, -200],
            x: [0, Math.random() * 40 - 20],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Geometric Shapes */}
      <motion.div
        className="absolute top-20 right-20 w-32 h-32 border border-white/10 rounded-lg"
        initial={{ opacity: 0, rotate: 0, scale: 0.8 }}
        animate={{ opacity: 0.3, rotate: 45, scale: 1 }}
        transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-24 h-24 border border-accent-red/20 rounded-full"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.3, scale: 1.2 }}
        transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse', delay: 1 }}
      />

      {/* Content Overlay with Fade */}
      <motion.div 
        className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto"
        style={{ opacity }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p 
          className="text-base md:text-lg mb-6 uppercase tracking-[0.2em] font-light text-white/90 text-shadow-medium"
          variants={itemVariants}
        >
          WELCOME TO
        </motion.p>
        
        {/* Character-by-character title reveal */}
        <motion.h1 
          className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-12 uppercase tracking-tight leading-none text-glow text-shadow-strong flex flex-wrap justify-center gap-1 md:gap-2"
          variants={containerVariants}
        >
          {titleChars.map((char, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={charVariants}
              style={{ display: 'inline-block' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.h1>
        
        {/* Dual CTAs */}
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6"
          variants={itemVariants}
        >
          {/* Primary CTA - Get Quote */}
          <motion.a
            href="/contact"
            className="group relative inline-flex items-center justify-center px-10 py-4 bg-accent-red text-white uppercase text-sm font-semibold tracking-[0.15em] overflow-hidden ripple"
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(220, 20, 60, 0.6)' }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              className="relative z-10"
              initial={{ opacity: 1 }}
              whileHover={{ opacity: 0 }}
            >
              GET QUOTE
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
              GET QUOTE
            </motion.span>
          </motion.a>

          {/* Secondary CTA - View Projects */}
          <motion.a
            href="/projects"
            className="group relative inline-flex items-center justify-center px-10 py-4 border-2 border-white bg-transparent text-white uppercase text-sm font-semibold tracking-[0.15em] overflow-hidden ripple"
            whileHover={{ scale: 1.05, borderColor: 'rgba(220, 20, 60, 0.8)' }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              className="relative z-10"
              initial={{ opacity: 1 }}
              whileHover={{ opacity: 0 }}
            >
              VIEW PROJECTS
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
              VIEW PROJECTS
            </motion.span>
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}

