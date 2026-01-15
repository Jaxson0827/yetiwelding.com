'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface Partner {
  name: string;
  logo: string | null;
  url?: string;
}

export default function PartnerLogos() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-50px' });

  // Partner logos - add real partner data here
  // If no partners, this section will not render
  const partnerLogos: Partner[] = [
    // Example structure:
    // { name: 'Partner Name', logo: '/partners/partner-logo.png', url: 'https://partner.com' },
  ];

  // Don't render if no partners
  if (partnerLogos.length === 0) {
    return null;
  }

  // Duplicate for infinite scroll effect
  const duplicatedLogos = [...partnerLogos, ...partnerLogos];

  return (
    <section ref={sectionRef} className="w-full bg-black py-16 px-4 overflow-hidden">
      <div className="container mx-auto">
        <motion.h3
          className="text-center text-white/60 uppercase text-xs tracking-[0.2em] font-light mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          TRUSTED PARTNERS
        </motion.h3>

        {/* Infinite Scroll Carousel */}
        <div className="relative overflow-hidden hidden lg:block">
          <motion.div
            className="flex gap-8 md:gap-12"
            animate={{
              x: [0, -(partnerLogos.length * 216)], // 200px width + 16px gap
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 30,
                ease: 'linear',
              },
            }}
            style={{ width: 'max-content' }}
          >
            {duplicatedLogos.map((partner, index) => (
              <motion.a
                key={`${partner.name}-${index}`}
                href={partner.url || '#'}
                target={partner.url ? '_blank' : undefined}
                rel={partner.url ? 'noopener noreferrer' : undefined}
                className="flex-shrink-0 text-white/40 text-sm uppercase tracking-wider px-6 py-3 border border-white/20 rounded backdrop-blur-sm glass min-w-[200px] flex items-center justify-center text-center grayscale hover:grayscale-0 transition-all duration-300"
                whileHover={{
                  scale: 1.1,
                  borderColor: 'rgba(220, 20, 60, 0.5)',
                  color: 'rgba(220, 20, 60, 0.8)',
                  backgroundColor: 'rgba(220, 20, 60, 0.1)',
                  boxShadow: '0 0 20px rgba(220, 20, 60, 0.3)',
                }}
                transition={{ duration: 0.3 }}
              >
                {partner.logo ? (
                  <img src={partner.logo} alt={partner.name} className="max-w-full max-h-12 object-contain" />
                ) : (
                  partner.name
                )}
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Static Grid for Mobile */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mt-8 lg:hidden">
          {partnerLogos.slice(0, 4).map((partner, index) => (
            <motion.a
              key={index}
              href={partner.url || '#'}
              target={partner.url ? '_blank' : undefined}
              rel={partner.url ? 'noopener noreferrer' : undefined}
              className="text-white/40 text-xs uppercase tracking-wider px-4 py-2 border border-white/20 rounded grayscale hover:grayscale-0 transition-all duration-300"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{
                scale: 1.1,
                borderColor: 'rgba(220, 20, 60, 0.5)',
                color: 'rgba(220, 20, 60, 0.8)',
                boxShadow: '0 0 15px rgba(220, 20, 60, 0.3)',
              }}
            >
              {partner.logo ? (
                <img src={partner.logo} alt={partner.name} className="max-w-full max-h-10 object-contain" />
              ) : (
                partner.name
              )}
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

