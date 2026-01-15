'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface Certification {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  verificationUrl?: string;
}

const certifications: Certification[] = [
  {
    id: 'clark-county',
    name: 'Clark County Fabricator Certified',
    shortDescription: 'Nevada building code compliance',
    fullDescription: 'Certified fabricator in Clark County, Nevada, demonstrating compliance with building codes and standards. Our Quality Assurance Program (QAP) and Quality System Manual (QSM) ensure adherence to stringent quality and safety requirements for shop-welded construction.',
  },
  {
    id: 'nomma',
    name: 'NOMMA Member',
    shortDescription: 'Professional industry association',
    fullDescription: 'Official member of the National Ornamental and Miscellaneous Metals Association (NOMMA), a professional organization founded in 1958. Membership demonstrates our commitment to industry standards, professional development, and access to educational resources and networking opportunities.',
  },
  {
    id: 'dfcm',
    name: 'DFCM Certified',
    shortDescription: 'Utah state construction qualification',
    fullDescription: 'Certified by the Division of Facilities Construction and Management (DFCM) in Utah. This certification qualifies us for state construction projects and demonstrates compliance with Utah state building and construction standards.',
  },
];

export default function CertificationsSection() {
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
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-accent-red rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent-red rounded-full blur-3xl" />
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
              CREDENTIALS
            </span>
            <div className="w-16 h-px bg-white/30 ml-4" />
          </motion.div>
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white uppercase mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            CERTIFIED & QUALIFIED
          </motion.h2>
          <motion.p
            className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Our certifications and memberships demonstrate our commitment to quality, compliance, and industry excellence
          </motion.p>
        </motion.div>

        {/* Certifications Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {certifications.map((cert) => (
            <motion.div
              key={cert.id}
              variants={itemVariants}
              className="group relative"
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div className="glass rounded-lg p-8 h-full flex flex-col hover:border-accent-red/50 transition-all duration-300">
                {/* Badge Icon/Placeholder */}
                <motion.div
                  className="w-20 h-20 bg-accent-red/20 rounded-full flex items-center justify-center mb-6 mx-auto"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg
                    className="w-10 h-10 text-accent-red"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </motion.div>

                {/* Certification Name */}
                <h3 className="text-xl font-bold text-white uppercase mb-3 text-center tracking-wide">
                  {cert.name}
                </h3>

                {/* Short Description */}
                <p className="text-accent-red text-sm font-semibold uppercase tracking-wide mb-4 text-center">
                  {cert.shortDescription}
                </p>

                {/* Full Description (shown on hover) */}
                <motion.div
                  className="overflow-hidden"
                  initial={{ height: 0, opacity: 0 }}
                  whileHover={{ height: 'auto', opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-white/70 text-sm leading-relaxed">
                    {cert.fullDescription}
                  </p>
                </motion.div>

                {/* Verification Link */}
                {cert.verificationUrl && (
                  <motion.a
                    href={cert.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 text-accent-red text-xs uppercase tracking-wide hover:text-white transition-colors text-center"
                    whileHover={{ x: 5 }}
                  >
                    Verify Certification →
                  </motion.a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}











