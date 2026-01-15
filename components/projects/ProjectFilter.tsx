'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { categories, Category } from '@/lib/projectsData';

interface ProjectFilterProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function ProjectFilter({
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: ProjectFilterProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    // Check initial state
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className="w-full sticky z-40 bg-black/95 backdrop-blur-md border-b border-white/10"
      style={{ top: isScrolled ? '80px' : '100px' }}
    >
      <div className="container mx-auto px-4 py-4">
        {/* Search Bar */}
        <motion.div
          className="mb-4 max-w-md mx-auto"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search projects..."
              className="w-full px-4 py-3 pl-12 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#DC143C]/50 focus:ring-2 focus:ring-[#DC143C]/20 transition-all"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                aria-label="Clear search"
              >
                <svg
                  className="w-5 h-5"
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
              </button>
            )}
          </div>
        </motion.div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
          {categories.map((category, index) => {
            const isActive = activeCategory === category;
            return (
              <motion.button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`relative px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-semibold uppercase tracking-wider transition-all ${
                  isActive
                    ? 'text-white'
                    : 'text-white/70 hover:text-white'
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    layoutId="activeFilter"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(220, 20, 60, 1) 50%, transparent 100%)',
                      boxShadow: '0 0 10px rgba(220, 20, 60, 0.8)',
                    }}
                    initial={false}
                  />
                )}
                {/* Hover Glow */}
                {!isActive && (
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(220, 20, 60, 0.8) 50%, transparent 100%)',
                      boxShadow: '0 0 8px rgba(220, 20, 60, 0.6)',
                    }}
                    initial={{ width: 0, opacity: 0 }}
                    whileHover={{ width: '100%', opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

