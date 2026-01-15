'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface ProcessStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  timeline?: string;
  href?: string;
}

const processSteps: ProcessStep[] = [
  {
    id: 1,
    title: 'Consultation',
    description: 'We discuss your project requirements, vision, and budget to understand your needs.',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    timeline: '1-3 days',
    href: '/contact',
  },
  {
    id: 2,
    title: 'Design & Planning',
    description: 'Our team creates detailed plans and designs tailored to your specifications.',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    timeline: '1-2 weeks',
  },
  {
    id: 3,
    title: 'Fabrication',
    description: 'Skilled craftsmen bring your project to life with precision and quality.',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    timeline: '2-3 weeks',
  },
  {
    id: 4,
    title: 'Installation & Delivery',
    description: 'Professional installation ensures your project is completed to perfection.',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    timeline: '1-3 days',
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
                <div className="glass rounded-lg p-8 pt-12 h-full flex flex-col items-center text-center hover:border-accent-red/50 transition-all duration-300">
                  {/* Icon */}
                  <div className="text-accent-red mb-4">
                    {step.icon}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-white uppercase mb-4 tracking-wide">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/70 text-sm leading-relaxed mb-4 flex-grow">
                    {step.description}
                  </p>
                  
                  {/* Timeline */}
                  {step.timeline && (
                    <p className="text-accent-red text-xs uppercase tracking-wide font-semibold">
                      {step.timeline}
                    </p>
                  )}
                  
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

