'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import type { Service } from '@/lib/servicesData';

interface ServiceCardProps {
  service: Service;
  index: number;
  onSelect: () => void;
}

export default function ServiceCard({ service, index, onSelect }: ServiceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={cardRef}
      className="group relative h-[500px] md:h-[600px] overflow-hidden rounded-lg cursor-pointer"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] as [number, number, number, number] }}
      whileHover={{ scale: 1.02 }}
      onClick={onSelect}
    >
      {/* Background Image */}
      {service.image && (
        <div className="absolute inset-0 z-0">
          <Image
            src={service.image}
            alt={service.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Enhanced gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/75 to-black/85 group-hover:from-black/70 group-hover:via-black/60 group-hover:to-black/70 transition-all duration-500" />
          {/* Accent overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent-red/0 via-accent-red/0 to-accent-red/0 group-hover:from-accent-red/15 group-hover:via-accent-red/8 group-hover:to-accent-red/20 transition-all duration-500" />
        </div>
      )}

      {/* Glassmorphism border */}
      <div className="absolute inset-0 z-10 rounded-lg border border-white/10 group-hover:border-accent-red/50 transition-all duration-500 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-8 md:p-10">
        {/* Top Section */}
        <div>
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white uppercase mb-4 leading-tight"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
          >
            {service.name}
          </motion.h2>

          <motion.p
            className="text-white/80 text-base md:text-lg leading-relaxed mb-4"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
          >
            {service.shortDescription}
          </motion.p>
        </div>

        {/* Bottom Section */}
        <div>
          {/* Features Preview */}
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.1 + 0.4, duration: 0.6 }}
          >
            <ul className="space-y-2 mb-4">
              {service.features.slice(0, 3).map((feature, idx) => (
                <motion.li
                  key={idx}
                  className="text-white/70 text-sm flex items-center"
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: index * 0.1 + 0.4 + idx * 0.1, duration: 0.4 }}
                >
                  <span className="w-1.5 h-1.5 bg-accent-red rounded-full mr-3" />
                  {feature}
                </motion.li>
              ))}
            </ul>
            {service.features.length > 3 && (
              <p className="text-white/50 text-xs uppercase tracking-wide">
                + {service.features.length - 3} more features
              </p>
            )}
          </motion.div>

          {/* CTA Button */}
          <motion.button
            className="group/btn relative inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 bg-white/5 backdrop-blur-sm text-white uppercase text-sm font-semibold tracking-[0.15em] overflow-hidden w-full md:w-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.1 + 0.7, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              className="relative z-10"
              initial={{ opacity: 1 }}
              whileHover={{ opacity: 0 }}
            >
              LEARN MORE
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
              LEARN MORE
            </motion.span>
          </motion.button>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            boxShadow: 'inset 0 0 100px rgba(220, 20, 60, 0.3)',
          }}
        />
      </div>
    </motion.div>
  );
}

