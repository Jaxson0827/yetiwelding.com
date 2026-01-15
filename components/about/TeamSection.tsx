'use client';

import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function TeamSection() {
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
      className="relative w-full py-20 md:py-32 px-4 overflow-hidden bg-black"
    >
      {/* Background Gradient */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(220, 20, 60, 0.3) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] as [number, number, number, number] }}
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-px bg-white/30 mr-4" />
            <span className="text-white/60 uppercase text-xs tracking-[0.2em] font-light">
              OUR TEAM
            </span>
            <div className="w-16 h-px bg-white/30 ml-4" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white uppercase mb-4 leading-tight">
            THE PEOPLE BEHIND THE WORK
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Decades of combined experience. A shared commitment to excellence. The Yeti Welding team.
          </p>
        </motion.div>

        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <div className="relative w-full max-w-4xl mx-auto h-[500px] md:h-[600px] lg:h-[700px]">
            <Image
              src="/homepage/team_photo.jpeg"
              alt="Yeti Welding Team"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 896px"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            {/* Overlay content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
              <motion.p
                className="text-lg md:text-xl leading-relaxed max-w-2xl"
                variants={itemVariants}
              >
                Our team represents generations of knowledge and skill. From seasoned veterans
                to emerging talent, each member brings dedication and expertise to every project.
                Together, we embody the Way of the Yeti—excellence through experience.
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </section>
  );
}











