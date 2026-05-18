'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServicesHero from '@/components/ServicesHero';
import ServiceCard from '@/components/ServiceCard';
import ServiceModal from '@/components/ServiceModal';
import ServicesCTA from '@/components/ServicesCTA';
import SectionDivider from '@/components/ui/SectionDivider';
import CredibilityStrip from '@/components/CredibilityStrip';
import ServicesPortfolioCallout from '@/components/ServicesPortfolioCallout';
import WhoWeWorkWith from '@/components/WhoWeWorkWith';
import ProcessSection from '@/components/ProcessSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import { services } from '@/lib/servicesData';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function ServicesPageClient() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const updateScrollProgress = () => {
      setShowBackToTop(document.documentElement.scrollTop > 300);
    };
    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        const validServiceIds = services.map(s => s.id);
        if (validServiceIds.includes(hash)) {
          setSelectedService(hash);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        setSelectedService(null);
      }
    };

    const timeoutId = setTimeout(handleHashChange, 50);
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

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
              { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://yetiwelding.com/services' },
            ],
          }),
        }}
      />
      {/* Service Catalog Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            serviceType: 'Welding and Metal Fabrication Services',
            provider: {
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
            areaServed: { '@type': 'State', name: 'Utah' },
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'Welding Services',
              itemListElement: services.map((service, index) => ({
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: service.name,
                  description: service.shortDescription,
                  url: `https://yetiwelding.com${service.href}`,
                },
                position: index + 1,
              })),
            },
          }),
        }}
      />

      <main id="main-content" className="min-h-screen bg-black">
        <Header />

        {/* 1. Hero */}
        <ServicesHero />
        <SectionDivider />

        {/* 2. Service Grid */}
        <section className="w-full py-20 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {services.map((service, index) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  index={index}
                  onSelect={() => setSelectedService(service.id)}
                />
              ))}
            </div>
            {/* Soft catch-all CTA */}
            <p className="text-center text-white/50 mt-10 text-sm">
              Don&rsquo;t see what you need?{' '}
              <Link href="/contact" className="text-accent-red hover:text-white transition-colors">
                We&rsquo;ll figure it out together &rarr;
              </Link>
            </p>
          </div>
        </section>
        <SectionDivider />

        {/* 3. Credibility Strip */}
        <CredibilityStrip />
        <SectionDivider />

        {/* 4. Portfolio Callout */}
        <ServicesPortfolioCallout />
        <SectionDivider />

        {/* 5. Who We Work With */}
        <WhoWeWorkWith />
        <SectionDivider />

        {/* 6. Process */}
        <ProcessSection />
        <SectionDivider />

        {/* 7. Testimonials */}
        <TestimonialsSection />
        <SectionDivider />

        {/* 8. CTA */}
        <ServicesCTA />

        <Footer />
      </main>

      {/* Service Modal */}
      <ServiceModal
        service={services.find(s => s.id === selectedService) || null}
        onClose={() => setSelectedService(null)}
      />

      {/* Back to Top */}
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
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
