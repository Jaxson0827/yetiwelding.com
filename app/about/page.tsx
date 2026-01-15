'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AboutHero from '@/components/about/AboutHero';
import ValuesSection from '@/components/about/ValuesSection';
import MissionVisionSection from '@/components/about/MissionVisionSection';
import HistorySection from '@/components/about/HistorySection';
import PhilosophySection from '@/components/about/PhilosophySection';
import ServicesCTA from '@/components/ServicesCTA';
import SectionDivider from '@/components/ui/SectionDivider';
import { companyStats } from '@/lib/aboutData';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AboutPage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (scrollPx / winHeightPx) * 100;
      setScrollProgress(scrolled);
      setShowBackToTop(scrollPx > 200);
    };

    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
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
            '@type': 'AboutPage',
            mainEntity: {
              '@type': 'Organization',
              name: 'Yeti Welding',
              foundingDate: `${companyStats.foundingYear}-01-01`,
              description: 'Professional welding and fabrication services with 40+ years of experience. Specializing in custom fabrication, structural welding, and ornamental work.',
              url: 'https://yetiwelding.com',
              telephone: '801-995-8906',
              email: 'office@yetiwelding.com',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '1680 W 1600 S',
                addressLocality: 'Springville',
                addressRegion: 'UT',
                postalCode: '84663',
                addressCountry: 'US',
              },
              numberOfEmployees: {
                '@type': 'QuantitativeValue',
                value: companyStats.teamMembers,
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '5',
                reviewCount: '13',
              },
              award: companyStats.certifications.join(', '),
              sameAs: [
                'https://www.instagram.com/yeti_welding/',
                'https://www.youtube.com/@yetiwelding6975',
                'https://www.tiktok.com/@yetiwelding',
              ],
            },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: 'https://yetiwelding.com',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'About',
                  item: 'https://yetiwelding.com/about',
                },
              ],
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
        <AboutHero />
        <SectionDivider />
        <ValuesSection />
        <SectionDivider />
        <MissionVisionSection />
        <SectionDivider />
        <HistorySection />
        <SectionDivider />
        <PhilosophySection />
        <SectionDivider />
        <ServicesCTA />
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

