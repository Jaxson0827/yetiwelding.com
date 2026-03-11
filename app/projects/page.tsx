'use client';

import { useState, useMemo, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  ProjectsHero,
  ProjectFilter,
  ProjectsGrid,
} from '@/components/projects';
import { projects, Category } from '@/lib/projectsData';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);

  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Filter by category
    if (activeCategory !== 'All') {
      filtered = filtered.filter((project) => project.categories.includes(activeCategory));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((project) => {
        // Search in title (if it exists)
        const titleMatch = project.title?.toLowerCase().includes(query) || false;
        
        // Search in category
        const categoryMatch = project.categories.some((category) =>
          category.toLowerCase().includes(query)
        );
        
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
      setShowBackToTop(scrollPx > 300);
    };

    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://yetiwelding.com' },
              { '@type': 'ListItem', position: 2, name: 'Projects', item: 'https://yetiwelding.com/projects' },
            ],
          }),
        }}
      />
      {/* Structured Data (JSON-LD) for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Our Projects | Yeti Welding',
            description: 'Showcasing exceptional craftsmanship and custom fabrication expertise in metalwork and welding.',
            url: 'https://yetiwelding.com/projects',
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: projects.map((project, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                  '@type': 'CreativeWork',
                  name: project.title || `${project.categories[0]} Project`,
                  description:
                    project.description ||
                    `A ${project.categories[0].toLowerCase()} project by Yeti Welding`,
                  image: `https://yetiwelding.com${project.image}`,
                  category: project.categories.join(', '),
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

      <main id="main-content" className="min-h-screen bg-black">
        <Header />
        <ProjectsHero />
        <ProjectFilter
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <ProjectsGrid
          projects={filteredProjects}
          showFeatured={activeCategory === 'All'}
        />
        <Footer />
      </main>

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

