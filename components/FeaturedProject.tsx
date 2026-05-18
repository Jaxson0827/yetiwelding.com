'use client';

import Image from 'next/image';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Counter from './projects/Counter';

function TimeCounter({ timeString }: { timeString: string }) {
  const [display, setDisplay] = useState('0:0:0:0');
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;

    const [years, days, hours, minutes] = timeString.split(':').map(Number);
    const totalMinutes = years * 525600 + days * 1440 + hours * 60 + minutes;
    
    let current = 0;
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      current = Math.floor(easeOutQuart * totalMinutes);

      const y = Math.floor(current / 525600);
      const d = Math.floor((current % 525600) / 1440);
      const h = Math.floor((current % 1440) / 60);
      const m = current % 60;

      setDisplay(`${y}:${d}:${h}:${m}`);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplay(timeString);
      }
    };

    animate();
  }, [isInView, timeString]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold text-[#DC143C] mb-2 leading-none">
      {display}
    </div>
  );
}

export default function FeaturedProject() {
  const [isNightMode, setIsNightMode] = useState(false);
  const dayImage = '/homepage/featuredproject.JPG';
  const nightImage = '/homepage/featuredproject_night.jpg';

  // Featured project data - Firefly Entrance Arch
  const featuredProject = {
    title: 'Firefly Entrance Arch',
    category: 'Art/Sculpture',
    description: 'A monumental work of metal art that transforms a standard development entry into a sculptural landmark. Towering geometric forms rise from each side, joined by a custom-branded archway merging sculpture, structure, and architecture. Precision-fabricated from 3/16" Corten plate with 46,500 CNC-laser-cut holes creating the signature "firefly glow" effect.',
  };

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section 
      ref={sectionRef}
      className="w-full flex flex-col lg:flex-row border-t-[10px] border-black overflow-hidden"
    >
      {/* Left Column - Image */}
      <motion.div
        className="w-full lg:w-1/2 relative h-[500px] lg:h-auto lg:min-h-[600px] group"
        initial={{ opacity: 0, x: -50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] as [number, number, number, number] }}
      >
        <div className="relative w-full h-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={isNightMode ? 'night' : 'day'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
            >
              <Image
                src={isNightMode ? nightImage : dayImage}
                alt={`${featuredProject.title} - ${featuredProject.description.substring(0, 100)}...`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                loading="lazy"
              />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Day/Night toggle button */}
        <motion.button
          type="button"
          onClick={() => setIsNightMode(!isNightMode)}
          className="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-colors z-10"
          aria-label={isNightMode ? 'Switch to day view' : 'Switch to night view'}
          title={isNightMode ? 'Day view' : 'Night view'}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isNightMode ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.59-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.59-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
            </svg>
          )}
        </motion.button>
      </motion.div>

      {/* Right Column - Content */}
      <motion.div
        className="w-full lg:w-1/2 p-10 lg:p-14 flex flex-col justify-between min-h-[600px] relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #8B3A3A 0%, #6B2A2A 50%, #2C1A1A 100%)',
        }}
        initial={{ opacity: 0, x: 50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] as [number, number, number, number] }}
      >
        {/* Animated Background Pattern */}
        <motion.div 
          className="absolute inset-0 opacity-10"
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            repeatType: 'reverse',
            ease: 'linear'
          }}
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10">
          {/* Top Section */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <motion.div
              className="w-16 h-px bg-white mb-4"
              initial={{ width: 0 }}
              animate={isInView ? { width: 64 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
            />
            <p className="text-white uppercase text-xs tracking-[0.2em] font-light">
              FEATURED PROJECT
            </p>
          </motion.div>

          {/* Title */}
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white uppercase mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {featuredProject.title}
          </motion.h2>

          {/* Description */}
          <motion.p
            className="text-white/90 text-base md:text-lg leading-relaxed mb-8 max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            {featuredProject.description}
          </motion.p>

          {/* CTA Button */}
          <motion.a
            href="/projects/firefly-arch"
            className="group relative inline-flex items-center justify-center px-8 py-3 border border-white bg-black text-white uppercase text-xs font-semibold tracking-[0.15em] overflow-hidden mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)' }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              className="relative z-10"
              initial={{ opacity: 1 }}
              whileHover={{ opacity: 0 }}
            >
              VIEW FULL CASE STUDY
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
              VIEW FULL CASE STUDY
            </motion.span>
          </motion.a>

          {/* Statistics Section */}
          <motion.div
            className="grid grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {/* Left Column Stats */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Counter end={46500} />
                <div className="text-[10px] text-white/90 uppercase tracking-wider">
                  CNC-laser-cut holes
                </div>
                <div className="text-[10px] text-white/70 uppercase">
                  creating firefly glow effect
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <Counter end={400} />
                <div className="text-[10px] text-white/90 uppercase tracking-wider">
                  total labor hours
                </div>
              </motion.div>
            </div>

            {/* Right Column Stats */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-[#DC143C] mb-2 leading-none">
                  3/16"
                </div>
                <div className="text-[10px] text-white/90 uppercase tracking-wider">
                  corten steel plate
                </div>
                <div className="text-[10px] text-white/70 uppercase">
                  precision fabricated
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-[#DC143C] mb-2 leading-none">
                  HSS
                </div>
                <div className="text-[10px] text-white/90 uppercase tracking-wider">
                  hidden structural core
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

