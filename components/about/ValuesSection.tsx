'use client';

import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { values } from '@/lib/aboutData';

export default function ValuesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = (index: number) => ({
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: index % 2 === 0 ? -10 : 10, // Alternate stagger: even cards go up, odd cards go down
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.6, -0.05, 0.01, 0.99] as [number, number, number, number],
      },
    },
  });

  return (
    <section
      id="values"
      ref={sectionRef}
      className="relative w-full py-20 md:py-32 px-4 overflow-hidden bg-black"
      aria-labelledby="values-heading"
    >
      {/* Content */}
      <div className="container mx-auto max-w-7xl">
        {/* Section Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 id="values-heading" className="text-4xl md:text-5xl lg:text-6xl font-bold text-white uppercase mb-4 leading-tight">
            OUR CORE{' '}
            <span className="text-accent-red">VALUES</span>
          </h2>
        </motion.div>

        {/* Values Grid - Horizontal row of vertical cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              className="relative flex flex-col bg-gray-900 overflow-hidden h-full transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:shadow-accent-red/20"
              variants={itemVariants(index)}
              whileHover={{ y: -5 }}
            >
              {/* Square Image at Top */}
              {value.image ? (
                <div className="relative w-full aspect-square flex-shrink-0">
                  <Image
                    src={value.image}
                    alt={value.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                </div>
              ) : (
                <div className="relative w-full aspect-square flex-shrink-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center">
                  <div className="text-accent-red/20 w-16 h-16 md:w-20 md:h-20 [&>svg]:w-full [&>svg]:h-full">
                    {value.icon}
                  </div>
                </div>
              )}
              
              {/* Content Area */}
              <div className="flex flex-col flex-grow p-4 md:p-6">
                {/* Title with Underline */}
                <h3 className="text-lg md:text-xl font-bold text-white uppercase mb-2">
                  {value.title}
                </h3>
                {/* Red Underline */}
                <div className="w-10 md:w-12 h-0.5 bg-accent-red mb-3 md:mb-4" />
                
                {/* Tagline - White text */}
                <p className="text-xs md:text-sm font-semibold text-white uppercase leading-tight mb-4 flex-grow whitespace-pre-line">
                  {value.tagline}
                </p>
              </div>
              
              {/* Red Bar at Bottom with Icon */}
              <div className="bg-accent-red p-3 md:p-4 flex items-center justify-center flex-shrink-0 min-h-[60px] md:min-h-[80px]">
                <div className="text-white w-6 h-6 md:w-8 md:h-8 [&>svg]:w-full [&>svg]:h-full [&>svg]:text-white">
                  {value.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}








