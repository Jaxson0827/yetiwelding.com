'use client';

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ServicesPreview from '@/components/ServicesPreview';
import FeaturedProject from '@/components/FeaturedProject';
import CertificationsSection from '@/components/CertificationsSection';
import ProcessSection from '@/components/ProcessSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import AboutSection from '@/components/AboutSection';
import PartnerLogos from '@/components/PartnerLogos';
import Footer from '@/components/Footer';
import ServiceModal from '@/components/ServiceModal';
import SectionDivider from '@/components/ui/SectionDivider';
import { services } from '@/lib/servicesData';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);

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
            '@type': 'LocalBusiness',
            name: 'Yeti Welding',
            description: 'Professional welding services with 40+ years of experience. Specializing in custom fabrication, structural welding, and ornamental work.',
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
            geo: {
              '@type': 'GeoCoordinates',
              latitude: '40.1653',
              longitude: '-111.6107',
            },
            priceRange: '$$',
            image: 'https://yetiwelding.com/homepage/hero.JPG',
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '5',
              reviewCount: '13',
            },
            sameAs: [
              'https://www.instagram.com/yeti_welding/',
              'https://www.youtube.com/@yetiwelding6975',
              'https://www.tiktok.com/@yetiwelding',
            ],
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
        <Hero />
        <SectionDivider />
        <ServicesPreview onSelect={(serviceId) => setSelectedService(serviceId)} />
        <SectionDivider />
        <FeaturedProject />
        <SectionDivider />
        <CertificationsSection />
        <SectionDivider />
        <ProcessSection />
        <SectionDivider />
        <TestimonialsSection />
        <SectionDivider />
        <AboutSection />
        <SectionDivider />
        <PartnerLogos />
        <Footer />
      </main>

      <ServiceModal
        service={services.find((service) => service.id === selectedService) || null}
        onClose={() => setSelectedService(null)}
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

