'use client';

import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';
import { HERO_LANDING } from '@/lib/shop/images';

export default function ShopHero() {
  return (
    <section className="relative w-full overflow-hidden bg-black">
      {/* Background photo */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_LANDING}
          alt=""
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[420px] max-w-4xl flex-col items-center justify-center px-4 py-16 text-center md:py-24">
        <motion.h1
          className="text-4xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-5xl md:text-7xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          Curb Appeal{' '}
          <span className="text-accent-red">on Steroids</span>
        </motion.h1>

        <motion.p
          className="mt-5 max-w-xl text-base leading-relaxed text-white/85 md:text-lg"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
        >
          Transform your landscape with premium Cor-Ten steel edging that
          installs in minutes and lasts a lifetime.
        </motion.p>

        <motion.ul
          className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs uppercase tracking-wider text-white/75 sm:text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <li>Installs in minutes</li>
          <li className="text-accent-red/70">·</li>
          <li>No paint, no chips or cracks</li>
          <li className="text-accent-red/70">·</li>
          <li>Free shipping &amp; returns</li>
        </motion.ul>

        <motion.div
          className="mt-10 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <AnimatedCounter
            to={93845}
            className="font-playfair text-5xl font-bold leading-none text-white md:text-6xl"
          />
          <span className="mt-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent-gold">
            Gardens Transformed
          </span>
        </motion.div>
      </div>
    </section>
  );
}
