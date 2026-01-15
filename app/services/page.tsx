'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServicesHero from '@/components/ServicesHero';
import ServiceCard from '@/components/ServiceCard';
import ServiceModal from '@/components/ServiceModal';
import ServicesCTA from '@/components/ServicesCTA';
import SectionDivider from '@/components/ui/SectionDivider';
import { services } from '@/lib/servicesData';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/cd5489ff-eedc-4e2e-941b-60915ad9b8e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/services/page.tsx:14',message:'ServicesPage mounted',data:{url:typeof window!=='undefined'?window.location.href:'SSR',hash:typeof window!=='undefined'?window.location.hash:'SSR'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion

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

  // Handle URL hash to open modal when navigating from homepage or other pages
  useEffect(() => {
    const handleHashChange = () => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/cd5489ff-eedc-4e2e-941b-60915ad9b8e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/services/page.tsx:36',message:'handleHashChange called',data:{url:window.location.href,hash:window.location.hash,hashWithoutHash:window.location.hash.slice(1)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      const hash = window.location.hash.slice(1); // Remove the # symbol
      if (hash) {
        const validServiceIds = services.map(s => s.id);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/cd5489ff-eedc-4e2e-941b-60915ad9b8e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/services/page.tsx:40',message:'Hash validation check',data:{hash,validServiceIds,isValid:validServiceIds.includes(hash)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        if (validServiceIds.includes(hash)) {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/cd5489ff-eedc-4e2e-941b-60915ad9b8e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/services/page.tsx:41',message:'Setting selectedService',data:{hash},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
          // #endregion
          setSelectedService(hash);
          // Scroll to top to show the modal
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        // Clear selected service if hash is removed
        setSelectedService(null);
      }
    };

    // Check hash on mount (with a small delay to ensure DOM is ready for client-side navigation)
    const timeoutId = setTimeout(() => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/cd5489ff-eedc-4e2e-941b-60915ad9b8e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/services/page.tsx:52',message:'Timeout callback executing',data:{url:window.location.href,hash:window.location.hash},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      handleHashChange();
    }, 50);

    // Listen for hash changes
    const hashChangeHandler = () => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/cd5489ff-eedc-4e2e-941b-60915ad9b8e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/services/page.tsx:57',message:'hashchange event fired',data:{url:window.location.href,hash:window.location.hash},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      handleHashChange();
    };
    window.addEventListener('hashchange', hashChangeHandler);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('hashchange', hashChangeHandler);
    };
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
            areaServed: {
              '@type': 'State',
              name: 'Utah',
            },
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
        <ServicesHero />
        <SectionDivider />
        <section className="w-full py-20 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className={index === 2 ? 'md:col-span-2 lg:col-span-1 md:mx-auto md:max-w-[600px] lg:max-w-none' : ''}
                >
                  <ServiceCard
                    service={service}
                    index={index}
                    onSelect={() => setSelectedService(service.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
        <SectionDivider />
        <ServicesCTA />
        <Footer />
      </main>

      {/* Service Modal */}
      {/* #region agent log */}
      {(() => {
        const foundService = services.find(s => s.id === selectedService);
        fetch('http://127.0.0.1:7242/ingest/cd5489ff-eedc-4e2e-941b-60915ad9b8e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/services/page.tsx:155',message:'ServiceModal render check',data:{selectedService,foundService:foundService?foundService.name:null,willRender:!!foundService},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
        return null;
      })()}
      {/* #endregion */}
      <ServiceModal
        service={services.find(s => s.id === selectedService) || null}
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

