'use client';

import { useState, useMemo, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  ProjectsHero,
  ProjectFilter,
  ProjectStatsDashboard,
  ProjectsGrid,
} from '@/components/projects';
import ProjectModal from '@/components/projects/ProjectModal';
import { projects, Category, Project } from '@/lib/projectsData';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Filter by category
    if (activeCategory !== 'All') {
      filtered = filtered.filter((project) => project.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((project) => {
        // Search in title (if it exists)
        const titleMatch = project.title?.toLowerCase().includes(query) || false;
        
        // Search in category
        const categoryMatch = project.category.toLowerCase().includes(query);
        
        // Search in materials
        const materialsMatch = project.materials?.some((material) =>
          material.toLowerCase().includes(query)
        ) || false;

        return titleMatch || categoryMatch || materialsMatch;
      });
    }

    return filtered;
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (scrollPx / winHeightPx) * 100;
      setScrollProgress(scrolled);
      setShowBackToTop(scrollPx > 300);
    };

    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  // Handle URL hash to open modal when navigating
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove the # symbol
      if (hash) {
        const project = projects.find((p) => p.id === hash);
        if (project) {
          setSelectedProject(project);
          // Scroll to top to show the modal
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    };

    // Check hash on mount
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Structured Data (JSON-LD) for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Our Projects | Yeti Welding',
            description: 'Showcasing decades of exceptional craftsmanship and custom fabrication expertise in metalwork and welding.',
            url: 'https://yetiwelding.com/projects',
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: projects.map((project, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                  '@type': 'CreativeWork',
                  name: project.title || `${project.category} Project`,
                  description: project.description || `A ${project.category.toLowerCase()} project by Yeti Welding`,
                  image: `https://yetiwelding.com${project.image}`,
                  category: project.category,
                },
              })),
            },
            publisher: {
              '@type': 'LocalBusiness',
              name: 'Yeti Welding',
              url: 'https://yetiwelding.com',
              telephone: '801-995-8906',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '1680 W 1600 S',
                addressLocality: 'Springville',
                addressRegion: 'UT',
                postalCode: '84663',
                addressCountry: 'US',
              },
            },
          }),
        }}
      />

      {/* Skip to Content Link */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* Scroll Progress Indicator */}
      <div
        className="scroll-progress"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      <main id="main-content" className="min-h-screen bg-black">
        <Header />
        <ProjectsHero />
        <ProjectFilter
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <ProjectStatsDashboard projects={filteredProjects} />
        <ProjectsGrid projects={filteredProjects} />
        <Footer />
      </main>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 w-12 h-12 bg-accent-red text-white rounded-full flex items-center justify-center shadow-lg z-50 hover:bg-[#B01030] transition-colors"
            aria-label="Scroll to top"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

