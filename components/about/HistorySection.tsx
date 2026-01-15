'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { timelineItems } from '@/lib/aboutData';

export default function HistorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Split timeline items into two columns
  const leftColumnItems = timelineItems.filter((_, index) => index % 2 === 0);
  const rightColumnItems = timelineItems.filter((_, index) => index % 2 === 1);

  // Get icon based on category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'founding':
        return (
          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
      case 'growth':
        return (
          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case 'achievement':
        return (
          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        );
      case 'milestone':
        return (
          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        );
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99] as [number, number, number, number],
      },
    },
  };

  return (
    <section
      id="history"
      ref={sectionRef}
      className="relative w-full py-20 md:py-32 px-4 overflow-hidden bg-[#0F0F0F]"
      aria-labelledby="history-heading"
    >
      {/* Spider Crane Outline Background - Left Side */}
      <div className="absolute left-0 top-0 bottom-0 w-full opacity-[0.45] pointer-events-none overflow-hidden">
        <img
          src="/spider-crane.svg"
          alt=""
          className="w-full h-full object-contain"
          style={{ filter: 'invert(1) grayscale(1) brightness(1.6) contrast(1.4)' }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-accent-red/20" aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2
            id="history-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white uppercase mb-4 leading-tight"
          >
            HISTORY
          </h2>
          {/* Yellow underline */}
          <div className="flex justify-center mt-2">
            <div className="w-24 h-1 bg-accent-red" />
          </div>
        </motion.div>

        {/* Two Column Timeline */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Left Column Timeline */}
          <div className="relative">
            {/* Vertical Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/15" />
            
            {/* Timeline Items */}
            <div className="space-y-8 md:space-y-12">
              {leftColumnItems.map((item, index) => (
                <motion.div
                  key={item.year}
                  className="relative pl-16"
                  variants={itemVariants}
                >
                  {/* Red Square Icon with Category Icon */}
                  <div className="absolute left-0 top-0 w-12 h-12 bg-accent-red flex items-center justify-center">
                    {getCategoryIcon(item.category)}
                  </div>
                  
                  {/* Connector Line to Timeline */}
                  <div className="absolute left-6 top-6 w-6 h-0.5 bg-white/15" />
                  
                  {/* Year */}
                  <div className="text-accent-red text-2xl md:text-3xl font-bold mb-2">
                    {item.year}
                  </div>
                  
                  {/* Title and Description */}
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-base md:text-lg text-white/70 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column Timeline */}
          <div className="relative">
            {/* Vertical Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/15" />
            
            {/* Timeline Items */}
            <div className="space-y-8 md:space-y-12">
              {rightColumnItems.map((item, index) => (
                <motion.div
                  key={item.year}
                  className="relative pl-16"
                  variants={itemVariants}
                >
                  {/* Red Square Icon with Category Icon */}
                  <div className="absolute left-0 top-0 w-12 h-12 bg-accent-red flex items-center justify-center">
                    {getCategoryIcon(item.category)}
                  </div>
                  
                  {/* Connector Line to Timeline */}
                  <div className="absolute left-6 top-6 w-6 h-0.5 bg-white/15" />
                  
                  {/* Year */}
                  <div className="text-accent-red text-2xl md:text-3xl font-bold mb-2">
                    {item.year}
                  </div>
                  
                  {/* Title and Description */}
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-base md:text-lg text-white/70 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}








