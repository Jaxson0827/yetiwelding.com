'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { teamMembers } from '@/lib/aboutData';

export default function LeadersSection() {
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

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99] as [number, number, number, number],
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-20 md:py-32 px-4 overflow-hidden bg-gray-100"
    >
      {/* Content */}
      <div className="container mx-auto max-w-7xl">
        {/* Section Heading */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 uppercase mb-4 leading-tight">
            LEADERS IN THE{' '}
            <span className="relative inline-block">
              WELDING INDUSTRY
              <span className="absolute bottom-0 left-0 right-0 h-1 bg-accent-red" />
            </span>
          </h2>
          
          {/* Descriptive Paragraph */}
          <p className="text-base md:text-lg text-gray-700 max-w-4xl mt-6 leading-relaxed">
            Yeti Welding is the true definition of precision craftsmanship. Our welders, fabricators, project managers, and crews - all under one roof - promote daily collaboration on design, quality, scheduling, and fabrication methods.
          </p>
        </motion.div>

        {/* Team Members Grid - Show exactly 4 cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {Array.from({ length: 4 }).map((_, index) => {
            const member = teamMembers[index];
            return (
              <motion.div
                key={member?.name || `placeholder-${index}`}
                className="bg-white rounded-lg shadow-md overflow-hidden"
                variants={itemVariants}
              >
                {/* Photo Container with Gradient Background */}
                <div className="relative w-full aspect-square bg-gradient-to-b from-gray-200 to-gray-100">
                  {member?.image ? (
                    <>
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                      />
                      {/* Gradient overlay for better icon visibility */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/20" />
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-b from-gray-200 to-gray-100" />
                  )}
                  
                  {/* LinkedIn Icon - Bottom Right */}
                  {member?.linkedinUrl && (
                    <Link
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-3 right-3 w-10 h-10 bg-accent-red rounded flex items-center justify-center hover:bg-[#B01030] transition-colors shadow-lg"
                    >
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </Link>
                  )}
                  
                  {/* Email Icon - Next to LinkedIn if both exist */}
                  {member?.email && (
                    <Link
                      href={`mailto:${member.email}`}
                      className="absolute bottom-3 right-14 w-10 h-10 bg-accent-red rounded flex items-center justify-center hover:bg-[#B01030] transition-colors shadow-lg"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </Link>
                  )}
                </div>
                
                {/* Name and Title */}
                <div className="p-6">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
                    {member?.name || 'Name'}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600">
                    {member?.title || 'Title'}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* View All Team Button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          <Link
            href="#team"
            className="inline-block px-8 py-4 bg-accent-red text-white uppercase text-sm font-semibold tracking-wide rounded-lg hover:bg-[#B01030] transition-colors shadow-md"
          >
            VIEW ALL TEAM
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

