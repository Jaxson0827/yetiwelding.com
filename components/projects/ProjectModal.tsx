'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/lib/projectsData';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
      // Update URL hash when modal opens
      window.history.replaceState(null, '', `#${project.id}`);
    } else {
      document.body.style.overflow = 'unset';
      // Remove hash when modal closes
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [project]);

  const handleClose = () => {
    // Remove hash from URL when closing
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-4 md:inset-8 lg:inset-16 z-50 overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.6, -0.05, 0.01, 0.99] as [number, number, number, number] }}
          >
            <div
              className="relative w-full min-h-full rounded-lg overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(40, 10, 10, 0.95) 50%, rgba(60, 15, 15, 0.95) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(220, 20, 60, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 60px rgba(220, 20, 60, 0.2)',
              }}
            >
              {/* Pattern Overlay */}
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(220, 20, 60, 0.8) 1px, transparent 0)',
                  backgroundSize: '40px 40px',
                }}
              />

              {/* Close Button */}
              <motion.button
                onClick={handleClose}
                className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close modal"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>

              {/* Content */}
              <div className="relative z-10 p-8 md:p-12 lg:p-16">
                {/* Project Image */}
                <motion.div
                  className="mb-8 relative w-full h-64 md:h-96 rounded-lg overflow-hidden"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                >
                  <Image
                    src={project.image}
                    alt={project.title || `${project.category} project`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 80vw"
                  />
                </motion.div>

                {/* Header */}
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <div className="mb-6">
                    <div className="inline-block px-3 py-1 mb-4 bg-[#DC143C]/90 backdrop-blur-sm text-white text-xs uppercase tracking-wider font-semibold">
                      {project.category}
                    </div>
                    {project.title && (
                      <>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white uppercase mb-2 leading-tight">
                          {project.title}
                        </h2>
                        <div className="w-24 h-px bg-accent-red" />
                      </>
                    )}
                  </div>
                  
                  {/* Project Info */}
                  <div className="flex flex-wrap gap-4 mt-4">
                    {project.year && (
                      <div className="px-4 py-2 bg-accent-red/20 border border-accent-red/50 rounded">
                        <p className="text-accent-red text-sm font-semibold uppercase tracking-wide">
                          Year: {project.year}
                        </p>
                      </div>
                    )}
                    {project.location && (
                      <div className="px-4 py-2 bg-white/5 border border-white/20 rounded">
                        <p className="text-white/80 text-sm uppercase tracking-wide">
                          Location: {project.location}
                        </p>
                      </div>
                    )}
                    {project.client && (
                      <div className="px-4 py-2 bg-white/5 border border-white/20 rounded">
                        <p className="text-white/80 text-sm uppercase tracking-wide">
                          Client: {project.client}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Description */}
                {project.description && (
                  <motion.div
                    className="mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    <p className="text-white/90 text-base md:text-lg leading-relaxed max-w-3xl">
                      {project.description}
                    </p>
                  </motion.div>
                )}

                {/* Materials */}
                {project.materials && project.materials.length > 0 && (
                  <motion.div
                    className="mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    <h3 className="text-white uppercase text-sm tracking-[0.2em] font-light mb-6">
                      MATERIALS USED
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {project.materials.map((material, index) => (
                        <motion.div
                          key={index}
                          className="px-4 py-2 bg-white/5 backdrop-blur-sm rounded border border-white/10 text-white/90 text-sm uppercase tracking-wide"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                          whileHover={{
                            scale: 1.05,
                            borderColor: 'rgba(220, 20, 60, 0.5)',
                            backgroundColor: 'rgba(220, 20, 60, 0.1)',
                          }}
                        >
                          {material}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* CTA Section */}
                <motion.div
                  className="flex flex-col md:flex-row gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <Link
                    href="/contact"
                    className="group relative inline-flex items-center justify-center px-10 py-4 border-2 border-white bg-transparent text-white uppercase text-sm font-semibold tracking-[0.15em] overflow-hidden"
                  >
                    <motion.span
                      className="relative z-10"
                      initial={{ opacity: 1 }}
                      whileHover={{ opacity: 0 }}
                    >
                      GET A QUOTE
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
                      GET A QUOTE
                    </motion.span>
                  </Link>

                  <motion.a
                    href="tel:8019958906"
                    className="group relative inline-flex items-center justify-center px-10 py-4 border-2 border-white/30 bg-white/5 backdrop-blur-sm text-white uppercase text-sm font-semibold tracking-[0.15em]"
                    whileHover={{ scale: 1.05, borderColor: 'rgba(255, 255, 255, 0.6)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    CALL US
                  </motion.a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}




