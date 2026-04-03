'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const HERO_BG = '/blog/hero-background.png';

export default function BlogHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.06 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.72,
        ease: [0.6, -0.05, 0.01, 0.99] as [number, number, number, number],
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[280px] md:min-h-[360px] lg:min-h-[420px] flex items-center justify-center py-14 md:py-20 lg:py-24 overflow-hidden border-b border-white/10 bg-gray-cool-200"
      aria-label="Blog"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src={HERO_BG}
          alt="Yeti Welding fabrication and metalwork"
          fill
          className="object-cover object-center md:object-[center_40%]"
          priority
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 z-[1] bg-black/[0.52] pointer-events-none" />
      <div
        className="absolute inset-0 z-[1] opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 2px 2px, rgba(220, 20, 60, 0.85) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/[0.45] via-black/[0.35] to-black/[0.72] pointer-events-none" />

      <motion.div
        className="relative z-10 container mx-auto max-w-4xl px-4 text-center"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <motion.div
          className="mx-auto mb-5 h-px max-w-[4rem] origin-center"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(220, 20, 60, 0.95) 50%, transparent 100%)',
            boxShadow: '0 0 12px rgba(220, 20, 60, 0.35)',
          }}
          initial={{ width: 0, opacity: 0 }}
          animate={isInView ? { width: 64, opacity: 1 } : {}}
          transition={{ delay: 0.15, duration: 0.65, ease: [0.6, -0.05, 0.01, 0.99] }}
        />

        <motion.p
          className="text-xs md:text-sm mb-4 uppercase tracking-[0.28em] font-light text-white/80"
          variants={itemVariants}
        >
          News &amp; insights
        </motion.p>

        <motion.h1
          className="font-playfair text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.05] text-white mb-5 md:mb-6 drop-shadow-[0_6px_28px_rgba(0,0,0,0.5)]"
          variants={itemVariants}
        >
          Blog
        </motion.h1>

        <motion.p
          className="text-base md:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed font-normal tracking-normal mb-8 drop-shadow-[0_4px_16px_rgba(0,0,0,0.45)]"
          variants={itemVariants}
        >
          Project stories, fabrication tips, and shop updates from Springville, Utah — straight from the
          welders behind steel you can depend on.
        </motion.p>

        <motion.div className="text-sm" variants={itemVariants}>
          <Link
            href="/contact"
            className="text-white/60 hover:text-accent-red transition-colors focus:outline-none focus-visible:text-accent-red focus-visible:underline underline-offset-4"
          >
            Suggest a topic
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
