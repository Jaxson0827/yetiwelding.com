'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Counter from './Counter';

// ---------------------------------------------------------------------------
// Image paths — update as photos are added to /public/projects/firefly-arch/
// ---------------------------------------------------------------------------
const HERO_DAY = '/projects/firefly-arch/hero-day.JPG';
const HERO_NIGHT = '/projects/firefly-arch/hero-night.jpg';

// 4 gallery shots available so far; add gallery-05.jpg and gallery-06.jpg when ready
const GALLERY = [
  '/projects/firefly-arch/gallery-01.JPG',
  '/projects/firefly-arch/gallery-02.JPG',
  '/projects/firefly-arch/gallery-03.JPG',
  '/projects/firefly-arch/gallery-04.JPG',
];

// process-02 and process-03 set to null until fabrication photos are added
const PROCESS: (string | null)[] = [
  '/projects/firefly-arch/plan-shot.png',
  null,
  null,
];

const DETAIL_HOLES = '/projects/firefly-arch/detail-holes.jpg';
const DETAIL_STRUCTURE = '/projects/firefly-arch/detail-structure.jpg';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
interface ProcessStep {
  number: string;
  title: string;
  description: string;
  image: string | null;
}

const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Design & Engineering',
    description:
      'Every one of the 46,500 perforations was placed with intent. Our team began with structural calculations — mapping load paths through the HSS core and determining the panel geometry that would generate the firefly light pattern after dark. CAD models were iterated until every weld joint, bolt pattern, and cut array aligned with both the structural and artistic requirements.',
    image: PROCESS[0],
  },
  {
    number: '02',
    title: 'Precision Fabrication',
    description:
      '3/16" Corten plate was CNC-laser-cut to tight tolerances, then formed and fitted to the HSS structural skeleton. Each panel was fully welded in our Springville facility before transport. 400 hours of skilled labor — cutting, forming, fitting, and welding — went into the arch before it ever left the shop.',
    image: PROCESS[1],
  },
  {
    number: '03',
    title: 'Installation & Weathering',
    description:
      'The arch was craned into position in sections and bolted to foundation embedments. Corten steel self-patinates over 12–18 months, developing the distinctive rust-amber surface that eliminates paint and coating entirely. The arch looks better with every passing season — and at night, those 46,500 holes do exactly what they were designed to do.',
    image: PROCESS[2],
  },
];

const materialSpecs = [
  { label: 'Primary material', value: '3/16" COR-TEN Weathering Steel' },
  { label: 'Structural core', value: 'HSS (Hollow Structural Section) steel' },
  { label: 'Perforations', value: '46,500 CNC laser-cut holes' },
  { label: 'Surface finish', value: 'Natural Corten patina — no paint or coating' },
  { label: 'Fabrication', value: 'CNC laser cutting, press brake forming, MIG/TIG welding' },
];

const projectVitals = [
  { label: 'Total labor', value: '400 hours' },
  { label: 'Category', value: 'Monument Structure' },
  { label: 'Location', value: 'Utah, USA' },
  { label: 'Scope', value: 'Design, fabrication & installation' },
];

// ---------------------------------------------------------------------------
// Shared animation wrapper
// ---------------------------------------------------------------------------
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'left' | 'right' | 'none';
}

function FadeIn({ children, delay = 0, className = '', direction = 'up' }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const initial =
    direction === 'up'
      ? { opacity: 0, y: 28 }
      : direction === 'left'
        ? { opacity: 0, x: -28 }
        : direction === 'right'
          ? { opacity: 0, x: 28 }
          : { opacity: 0 };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={initial}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Section label
// ---------------------------------------------------------------------------
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[#DC143C] uppercase text-xs tracking-[0.25em] font-semibold mb-4">
      {children}
    </p>
  );
}

// ---------------------------------------------------------------------------
// 1. Hero
// ---------------------------------------------------------------------------
function HeroSection() {
  const [isNightMode, setIsNightMode] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div ref={heroRef} className="relative h-screen overflow-hidden">
      {/* Parallax image */}
      <motion.div className="absolute inset-0 scale-110 origin-center" style={{ y: imageY }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={isNightMode ? 'night' : 'day'}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src={isNightMode ? HERO_NIGHT : HERO_DAY}
              alt="Firefly Entrance Arch — a monumental Corten steel gate structure featuring 46,500 laser-cut perforations"
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent pointer-events-none" />

      {/* Content */}
      <motion.div
        className="relative z-10 h-full flex flex-col justify-between px-6 md:px-12 lg:px-20"
        style={{ opacity: contentOpacity }}
      >
        {/* Breadcrumb — sits below header */}
        <motion.nav
          className="flex items-center gap-2 text-xs text-white/50 uppercase tracking-widest pt-24 md:pt-28"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span className="opacity-40">/</span>
          <Link href="/projects" className="hover:text-white transition-colors">Projects</Link>
          <span className="opacity-40">/</span>
          <span className="text-white/80">Firefly Entrance Arch</span>
        </motion.nav>

        {/* Title block */}
        <div className="pb-16 md:pb-20">
          <motion.div
            className="w-12 h-px bg-[#DC143C] mb-6"
            initial={{ width: 0 }}
            animate={{ width: 48 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          />
          <motion.p
            className="text-[#DC143C] uppercase text-xs tracking-[0.3em] mb-5 font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Featured Project · Monument Structure
          </motion.p>
          <motion.h1
            className="font-playfair text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white uppercase leading-[0.9] mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            Firefly<br />
            <span className="text-white/80">Entrance</span><br />
            Arch
          </motion.h1>
          <motion.p
            className="text-white/60 text-base md:text-lg max-w-md leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
          >
            46,500 CNC-laser-cut holes. 400 hours of precision fabrication.
            One arch that transforms at night.
          </motion.p>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <span className="text-white/30 text-[10px] uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Day / Night toggle */}
      <motion.button
        type="button"
        onClick={() => setIsNightMode(!isNightMode)}
        className="absolute bottom-8 right-8 z-20 w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
        aria-label={isNightMode ? 'Switch to day view' : 'Switch to night view'}
        title={isNightMode ? 'Day view' : 'Night view'}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        {isNightMode ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.59-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.59-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
          </svg>
        )}
      </motion.button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2. Stats bar
// ---------------------------------------------------------------------------
function StatsSection() {
  return (
    <section className="bg-[#0A0A0A] border-y border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
        {/* Stat 1 */}
        <FadeIn delay={0} className="border-l border-white/10 pl-6">
          <Counter end={46500} className="text-4xl md:text-5xl font-bold text-[#DC143C] mb-2 leading-none tabular-nums" />
          <p className="text-white/80 text-xs uppercase tracking-wider">CNC-laser-cut holes</p>
          <p className="text-white/40 text-[10px] uppercase tracking-wide mt-1">creating firefly glow</p>
        </FadeIn>
        {/* Stat 2 */}
        <FadeIn delay={0.1} className="border-l border-white/10 pl-6">
          <Counter end={400} className="text-4xl md:text-5xl font-bold text-[#DC143C] mb-2 leading-none tabular-nums" />
          <p className="text-white/80 text-xs uppercase tracking-wider">Total labor hours</p>
        </FadeIn>
        {/* Stat 3 */}
        <FadeIn delay={0.2} className="border-l border-white/10 pl-6">
          <div className="text-4xl md:text-5xl font-bold text-[#DC143C] mb-2 leading-none">3/16&quot;</div>
          <p className="text-white/80 text-xs uppercase tracking-wider">Corten steel plate</p>
          <p className="text-white/40 text-[10px] uppercase tracking-wide mt-1">precision fabricated</p>
        </FadeIn>
        {/* Stat 4 */}
        <FadeIn delay={0.3} className="border-l border-white/10 pl-6">
          <div className="text-4xl md:text-5xl font-bold text-[#DC143C] mb-2 leading-none">HSS</div>
          <p className="text-white/80 text-xs uppercase tracking-wider">Hidden structural core</p>
        </FadeIn>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 3. The Commission
// ---------------------------------------------------------------------------
function CommissionSection() {
  return (
    <section className="bg-black py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Text */}
        <FadeIn direction="left">
          <SectionLabel>The Commission</SectionLabel>
          {/* TODO: Update headline and copy below with the actual client story */}
          <h2 className="font-playfair text-4xl md:text-5xl text-white mb-8 leading-tight">
            Built for a Street Sign.<br />
            Designed to be a Landmark.
          </h2>
          <p className="text-white/65 text-lg leading-relaxed mb-6">
            A Utah residential developer came to Yeti Welding with a deceptively simple brief: build
            an entry arch for a new development. What emerged from that conversation was anything
            but simple.
          </p>
          <p className="text-white/65 text-lg leading-relaxed mb-6">
            The &ldquo;Firefly&rdquo; concept grew from a single question — what if an entry arch could come
            alive at night? The answer was 46,500 individual holes, CNC-laser-cut into 3/16&quot; Corten
            plate, each one calibrated to cast a specific pattern of light when the interior
            illumination fires up after sundown.
          </p>
          <p className="text-white/65 text-lg leading-relaxed">
            The structural challenge was equally demanding. The arch needed to carry its own
            considerable weight across a wide span with no visible bracing. The solution: a hidden
            HSS steel skeleton buried inside the sculpted Corten exterior — strength made invisible.
          </p>
        </FadeIn>

        {/* Image */}
        <FadeIn direction="right">
          <div className="relative h-[520px] lg:h-[660px] overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#DC143C]/50 z-10" />
            <Image
              src={GALLERY[0]}
              alt="Firefly Entrance Arch — completed installation"
              fill
              className="object-cover transition-transform duration-[1.2s] group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 4. Gallery
// ---------------------------------------------------------------------------
function GallerySection() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex(i => (i !== null ? (i + 1) % GALLERY.length : null));
      if (e.key === 'ArrowLeft') setLightboxIndex(i => (i !== null ? (i - 1 + GALLERY.length) % GALLERY.length : null));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex]);

  const openLightbox = (i: number) => setLightboxIndex(i);

  const GalleryItem = ({
    index,
    className,
    alt,
  }: {
    index: number;
    className: string;
    alt: string;
  }) => (
    <motion.div
      className={`relative overflow-hidden cursor-pointer group ${className}`}
      onClick={() => openLightbox(index)}
      whileHover="hover"
    >
      <Image
        src={GALLERY[index]}
        alt={alt}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
      />
      {/* Hover overlay */}
      <motion.div
        className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center"
      >
        <motion.div
          className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
          </svg>
        </motion.div>
      </motion.div>
    </motion.div>
  );

  return (
    <section className="bg-[#0A0A0A] py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <FadeIn className="mb-12">
          <SectionLabel>The Arch</SectionLabel>
          <h2 className="font-playfair text-3xl md:text-5xl text-white">
            Day and Night
          </h2>
        </FadeIn>

        {/* Editorial masonry grid — 4 photos */}
        {/* Mobile: 2-col uniform. lg: 3-col with intentional span layout */}
        {/* Layout: [1:tall] [2] [3] / [1:tall] [4:wide 2-col] */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 lg:auto-rows-[280px]">
          {/* Photo 1: tall — spans 2 rows on lg */}
          <GalleryItem
            index={0}
            alt="Firefly Entrance Arch — primary view"
            className="h-[240px] md:h-[280px] lg:h-auto lg:row-span-2"
          />
          {/* Photo 2 */}
          <GalleryItem
            index={1}
            alt="Firefly Entrance Arch — detail"
            className="h-[240px] md:h-[280px]"
          />
          {/* Photo 3 */}
          <GalleryItem
            index={2}
            alt="Firefly Entrance Arch — angle view"
            className="h-[240px] md:h-[280px]"
          />
          {/* Photo 4: wide — spans 2 cols on lg */}
          <GalleryItem
            index={3}
            alt="Firefly Entrance Arch — wide shot"
            className="h-[240px] md:h-[280px] col-span-2 lg:col-span-2"
          />
        </div>

        <FadeIn className="mt-6 text-center" delay={0.1}>
          <p className="text-white/30 text-xs uppercase tracking-widest">
            Click any photo to enlarge · Use ← → or arrow keys to navigate
          </p>
        </FadeIn>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setLightboxIndex(null)}
          >
            {/* Image container */}
            <motion.div
              className="relative w-full max-w-5xl max-h-[88vh] flex items-center justify-center"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={e => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={lightboxIndex}
                  className="relative w-full"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Use a fixed aspect ratio wrapper that adapts to content */}
                  <div className="relative w-full" style={{ paddingBottom: '66.66%' }}>
                    <Image
                      src={GALLERY[lightboxIndex]}
                      alt={`Firefly Entrance Arch — photo ${lightboxIndex + 1}`}
                      fill
                      className="object-contain"
                      sizes="100vw"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Counter */}
              <div className="absolute bottom-[-32px] left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-widest">
                {lightboxIndex + 1} / {GALLERY.length}
              </div>

              {/* Prev */}
              <button
                onClick={e => {
                  e.stopPropagation();
                  setLightboxIndex(i => (i !== null ? (i - 1 + GALLERY.length) % GALLERY.length : null));
                }}
                className="absolute left-[-52px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white"
                aria-label="Previous photo"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Next */}
              <button
                onClick={e => {
                  e.stopPropagation();
                  setLightboxIndex(i => (i !== null ? (i + 1) % GALLERY.length : null));
                }}
                className="absolute right-[-52px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white"
                aria-label="Next photo"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </motion.div>

            {/* Close */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white"
              aria-label="Close lightbox"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 5. The Craft (process)
// ---------------------------------------------------------------------------
function CraftSection() {
  return (
    <section className="bg-black py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <FadeIn className="mb-20">
          <SectionLabel>The Craft</SectionLabel>
          <h2 className="font-playfair text-4xl md:text-5xl text-white">How It Was Built</h2>
        </FadeIn>

        <div className="space-y-24 md:space-y-32">
          {processSteps.map((step, i) => (
            step.image ? (
              /* Two-column layout when a photo exists */
              <div
                key={step.number}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                  i % 2 === 1 ? 'lg:[&>*:first-child]:order-last' : ''
                }`}
              >
                {/* Image */}
                <FadeIn direction={i % 2 === 0 ? 'left' : 'right'} className="relative h-[360px] md:h-[440px] overflow-hidden group">
                  <Image
                    src={step.image}
                    alt={`Firefly Arch — ${step.title}`}
                    fill
                    className="object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                </FadeIn>

                {/* Text */}
                <FadeIn direction={i % 2 === 0 ? 'right' : 'left'}>
                  <span className="text-[#DC143C] text-8xl font-bold leading-none opacity-15 select-none block mb-2">
                    {step.number}
                  </span>
                  <h3 className="font-playfair text-3xl md:text-4xl text-white mb-6">{step.title}</h3>
                  <div className="w-10 h-px bg-[#DC143C]/60 mb-6" />
                  <p className="text-white/65 text-lg leading-relaxed">{step.description}</p>
                </FadeIn>
              </div>
            ) : (
              /* Text-only layout when photo hasn't been added yet */
              <FadeIn key={step.number} className="max-w-3xl border-l-2 border-white/10 pl-10">
                <span className="text-[#DC143C] text-8xl font-bold leading-none opacity-15 select-none block mb-2">
                  {step.number}
                </span>
                <h3 className="font-playfair text-3xl md:text-4xl text-white mb-6">{step.title}</h3>
                <div className="w-10 h-px bg-[#DC143C]/60 mb-6" />
                <p className="text-white/65 text-lg leading-relaxed">{step.description}</p>
              </FadeIn>
            )
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 6. Technical Specs
// ---------------------------------------------------------------------------
function SpecsSection() {
  return (
    <section className="bg-[#0A0A0A] py-24 md:py-32 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <FadeIn className="mb-16">
          <SectionLabel>Technical Specifications</SectionLabel>
          <h2 className="font-playfair text-4xl md:text-5xl text-white">
            Built to Endure
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
          {/* Material specs */}
          <FadeIn direction="left">
            <h3 className="text-white/50 text-xs uppercase tracking-widest mb-6">Materials &amp; Process</h3>
            <div className="space-y-0">
              {materialSpecs.map((spec, i) => (
                <div key={i} className="flex justify-between gap-4 py-4 border-b border-white/8">
                  <span className="text-white/50 text-sm">{spec.label}</span>
                  <span className="text-white text-sm text-right font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Project vitals */}
          <FadeIn direction="right">
            <h3 className="text-white/50 text-xs uppercase tracking-widest mb-6">Project Vitals</h3>
            <div className="space-y-0">
              {projectVitals.map((vital, i) => (
                <div key={i} className="flex justify-between gap-4 py-4 border-b border-white/8">
                  <span className="text-white/50 text-sm">{vital.label}</span>
                  <span className="text-white text-sm text-right font-medium">{vital.value}</span>
                </div>
              ))}
            </div>

            {/* Pull quote */}
            <blockquote className="mt-10 pl-5 border-l-2 border-[#DC143C]/60">
              <p className="text-white/70 text-lg leading-relaxed italic font-playfair">
                &ldquo;Strength made invisible. 400 hours of precision fabrication hidden inside a sculpture that weathers beautifully and never needs paint.&rdquo;
              </p>
            </blockquote>
          </FadeIn>
        </div>

        {/* Detail images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FadeIn direction="left" className="relative h-[300px] md:h-[400px] overflow-hidden group">
            <Image
              src={DETAIL_HOLES}
              alt="Close-up of the 3/16-inch Corten steel laser-cut perforation pattern"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <p className="text-white/80 text-xs uppercase tracking-widest">46,500 laser-cut holes — the firefly pattern</p>
            </div>
          </FadeIn>
          <FadeIn direction="right" className="relative h-[300px] md:h-[400px] overflow-hidden group">
            <Image
              src={DETAIL_STRUCTURE}
              alt="HSS structural core and Corten plate connection detail"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <p className="text-white/80 text-xs uppercase tracking-widest">HSS structural core — hidden inside the sculpture</p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 7. CTA
// ---------------------------------------------------------------------------
function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-black py-28 md:py-40 relative overflow-hidden">
      {/* Subtle animated background */}
      <motion.div
        className="absolute inset-0 opacity-5"
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ duration: 25, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <SectionLabel>Next Steps</SectionLabel>
          <h2 className="font-playfair text-4xl md:text-6xl text-white mb-6 leading-tight">
            Have a landmark project<br />
            in mind?
          </h2>
          <p className="text-white/55 text-xl mb-12 leading-relaxed max-w-xl mx-auto">
            Every Yeti Welding project starts with a conversation. Tell us what you&apos;re building —
            we&apos;ll tell you how to make it extraordinary.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/contact"
              className="group relative inline-flex items-center justify-center px-10 py-4 bg-[#DC143C] text-white uppercase text-sm font-semibold tracking-[0.15em] overflow-hidden hover:bg-[#E63950] transition-colors"
            >
              Get a Quote
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm uppercase tracking-widest transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              All Projects
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Root export
// ---------------------------------------------------------------------------
export default function FireflyArchCaseStudy() {
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <main id="main-content" className="min-h-screen bg-black">
      {/* Scroll progress bar */}
      <motion.div
        className="scroll-progress"
        style={{ width: progressWidth }}
        aria-hidden
      />

      <Header />
      <HeroSection />
      <StatsSection />
      <CommissionSection />
      <GallerySection />
      <CraftSection />
      <SpecsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
