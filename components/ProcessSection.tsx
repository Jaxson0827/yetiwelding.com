'use client';

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

interface ProcessStep {
  id: number;
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
  href?: string;
}

const processSteps: ProcessStep[] = [
  {
    id: 1,
    title: 'Consultation',
    description: 'We discuss your project requirements, vision, and budget to understand your needs.',
    imageSrc: '/homepage/consultation.png',
    imageAlt: 'Consultation',
    href: '/contact',
  },
  {
    id: 2,
    title: 'Design & Planning',
    description: 'Our team creates detailed plans and designs tailored to your specifications.',
    imageSrc: '/homepage/design-planning.png',
    imageAlt: 'Design and planning',
  },
  {
    id: 3,
    title: 'Fabrication',
    description: 'Skilled craftsmen bring your project to life with precision and quality.',
    imageSrc: '/homepage/fabrication-process.png',
    imageAlt: 'Fabrication process',
  },
  {
    id: 4,
    title: 'Installation & Delivery',
    description: 'Professional installation ensures your project is completed to perfection.',
    imageSrc: '/projects/photo16.JPG',
    imageAlt: 'Installation and delivery',
  },
];

export default function ProcessSection() {
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
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99] as [number, number, number, number],
      },
    },
  };

  return (
    <section 
      ref={sectionRef}
      className="w-full bg-black py-20 md:py-28 px-4 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent-red rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent-red rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="flex items-center justify-center mb-6"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="w-16 h-px bg-white/30 mr-4" />
            <span className="text-white/60 uppercase text-xs tracking-[0.2em] font-light">
              HOW WE WORK
            </span>
            <div className="w-16 h-px bg-white/30 ml-4" />
          </motion.div>
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white uppercase mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            OUR PROCESS
          </motion.h2>
          <motion.p
            className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            From concept to completion, we guide you through every step of your project
          </motion.p>
        </motion.div>

        {/* Process Steps */}
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {/* Connecting Line (Desktop) */}
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent-red/50 to-transparent" />

            {processSteps.map((step, index) => (
              <motion.div
                key={step.id}
                variants={itemVariants}
                className="relative group"
                whileHover={{ y: -10, scale: 1.02 }}
              >
                {/* Step Number Badge */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
                  <motion.div
                    className="w-12 h-12 bg-accent-red rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {step.id}
                  </motion.div>
                </div>

                {/* Step Card */}
                <div className="glass rounded-lg p-8 pt-12 min-h-[22rem] h-full flex flex-col items-center text-center hover:border-accent-red/50 transition-all duration-300 relative overflow-hidden">
                  {step.imageSrc && (
                    <Image
                      src={step.imageSrc}
                      alt={step.imageAlt || step.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 18rem, (min-width: 768px) 40vw, 80vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/55" />
                  <div className="relative z-10 flex flex-col items-center justify-center text-center h-full w-full">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-white uppercase mb-4 tracking-wide">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/70 text-sm leading-relaxed mb-4">
                    {step.description}
                  </p>
                  
                  {/* Link if available */}
                  {step.href && (
                    <a 
                      href={step.href}
                      className="mt-4 text-white/60 hover:text-accent-red text-xs uppercase tracking-wide transition-colors"
                    >
                      Get Started →
                    </a>
                  )}
                  </div>
                </div>

                {/* Arrow Connector (Desktop, between steps) */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-24 -right-4 z-10">
                    <motion.svg
                      className="w-8 h-8 text-accent-red/50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.5 + index * 0.2 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </motion.svg>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

