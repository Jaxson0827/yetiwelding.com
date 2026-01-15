'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Project } from '@/lib/projectsData';

interface ProjectCardProps {
  project: Project;
  index: number;
  onSelect?: () => void;
  isLarge?: boolean; // Deprecated, use sizeVariant instead
  colSpan?: string; // Custom column span classes
  sizeVariant?: 'large' | 'extraLarge'; // Size variant for featured boxes
}

export default function ProjectCard({ project, index, onSelect, isLarge = false, colSpan, sizeVariant }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && project.video) {
      if (isHovered) {
        videoRef.current.play().catch(() => {
          // Handle autoplay restrictions
        });
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovered, project.video]);

  // Determine column span: prefer colSpan prop, fall back to isLarge for backward compatibility
  const columnSpanClass = colSpan || (isLarge ? 'md:col-span-2' : '');
  
  // Determine if this is a featured box (for sizing calculations)
  const isFeatured = sizeVariant === 'large' || sizeVariant === 'extraLarge' || isLarge;
  
  // All boxes use the same height
  const heightClass = 'h-64 md:h-80';
  
  const isClickable = Boolean(onSelect);

  return (
    <motion.div
      className={`group relative overflow-hidden bg-black border border-white/10 ${
        isClickable ? 'cursor-pointer' : 'cursor-default'
      } ${columnSpanClass}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.1,
        duration: 0.5,
        ease: [0.6, -0.05, 0.01, 0.99] as [number, number, number, number],
      }}
      whileHover={{ y: -5 }}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image/Video Container */}
      <div className={`relative w-full overflow-hidden ${heightClass}`}>
        {/* Video (shown on hover if available) */}
        {project.video && (
          <video
            ref={videoRef}
            src={project.video}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              isHovered ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            muted
            loop
            playsInline
            preload="metadata"
          />
        )}
        
        {/* Image (always visible, hidden when video is playing) */}
        <Image
          src={project.image}
          alt={project.title || `${project.categories[0]} project`}
          fill
          className={`object-cover transition-all duration-700 ${
            isHovered && project.video 
              ? 'opacity-0 scale-110' 
              : 'opacity-100 group-hover:scale-110'
          }`}
          sizes={
            sizeVariant === 'extraLarge'
              ? "(max-width: 768px) 100vw, 100vw"
              : isFeatured
              ? "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
              : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          }
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />
        {/* Red Accent Overlay on Hover */}
        <div className="absolute inset-0 bg-[#DC143C]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />
      </div>

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 transform translate-y-0 group-hover:translate-y-0 transition-transform duration-300">
        {/* Title */}
        {project.title && (
          <motion.h3
            className="text-white text-lg md:text-xl font-bold uppercase tracking-tight mb-2 text-shadow-strong"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            {project.title}
          </motion.h3>
        )}
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 border-2 border-[#DC143C] opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
}


