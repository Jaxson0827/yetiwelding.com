'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project, getAllMaterials } from '@/lib/projectsData';
import { useRef, useEffect, useState } from 'react';
import { useInView } from 'framer-motion';

interface CounterProps {
  end: number;
  suffix?: string;
  duration?: number;
  prefix?: string;
  key?: string | number;
}

function Counter({ end, suffix = '', duration = 0.8, prefix = '' }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: '-100px' });
  const prevEndRef = useRef<number | null>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (!isInView && isInitialMount.current) {
      // If not in view on initial mount, set to 0
      setCount(0);
      return;
    }

    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;
    const startValue = prevEndRef.current ?? 0;
    prevEndRef.current = end;
    isInitialMount.current = false;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const newCount = Math.floor(startValue + (end - startValue) * easeOutQuart);
      setCount(newCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, end, duration]);

  return (
    <div ref={ref} className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#DC143C] leading-none">
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
}

interface ProjectStatsDashboardProps {
  projects: Project[];
}

export default function ProjectStatsDashboard({ projects }: ProjectStatsDashboardProps) {
  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const uniqueCategories = new Set(
      projects.flatMap((project) => project.categories)
    ).size;
    const uniqueMaterials = getAllMaterials(projects).length;
    const yearsOfExperience = 15; // Static value or calculate from project dates

    return {
      totalProjects,
      uniqueCategories,
      uniqueMaterials,
      yearsOfExperience,
    };
  }, [projects]);

  const statCards = [
    {
      label: 'Total Projects',
      value: stats.totalProjects,
      description: 'projects completed',
    },
    {
      label: 'Categories',
      value: stats.uniqueCategories,
      description: 'project types',
    },
    {
      label: 'Materials Used',
      value: stats.uniqueMaterials,
      description: 'unique materials',
      suffix: '+',
    },
    {
      label: 'Years Experience',
      value: stats.yearsOfExperience,
      description: 'in the industry',
      suffix: '+',
    },
  ];

  return (
    <motion.div
      className="w-full relative overflow-hidden border-b border-white/10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(220, 20, 60, 0.8) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Glassmorphism Background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(40, 10, 10, 0.95) 50%, rgba(60, 15, 15, 0.95) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        }}
      />

      {/* Red Accent Border Glow on Stats Change */}
      <motion.div
        className="absolute inset-0 border-2 border-[#DC143C]/30 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 0.6, repeat: 0 }}
        key={`${stats.totalProjects}-${stats.uniqueCategories}`}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <Counter
                end={stat.value}
                suffix={stat.suffix}
                duration={0.8}
                key={`${stat.label}-${stat.value}`}
              />
              <div className="text-xs md:text-sm text-white/90 uppercase tracking-wider mt-2">
                {stat.label}
              </div>
              <div className="text-[10px] md:text-xs text-white/70 uppercase mt-1">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

