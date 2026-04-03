'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactMethods, { ContactSocial } from '@/components/contact/ContactMethods';
import ContactForm from '@/components/contact/ContactForm';
import FAQSection from '@/components/contact/FAQSection';
import TeamSection from '@/components/contact/TeamSection';
import MapSection from '@/components/contact/MapSection';
import ContactCTA from '@/components/contact/ContactCTA';
import { faqData } from '@/lib/faqData';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactPageClient({ turnstileSiteKey }: { turnstileSiteKey: string }) {
  const [showBackToTop, setShowBackToTop] = useState(false);

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

  const handleFormSuccess = () => {
    const formSection = document.getElementById('contact-form');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://yetiwelding.com' },
              { '@type': 'ListItem', position: 2, name: 'Contact', item: 'https://yetiwelding.com/contact' },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqData.map((f) => ({
              '@type': 'Question',
              name: f.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: f.answer,
              },
            })),
          }),
        }}
      />

      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <main id="main-content" className="min-h-screen bg-black">
        <Header />

        <section id="contact-form" className="w-full pt-32 pb-20 px-4 bg-black">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 uppercase tracking-tight text-glow">
                Contact Us
              </h1>
              <h2 className="text-3xl md:text-4xl font-semibold mb-4 uppercase tracking-tight text-glow/90">
                Send Us a Message
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Fill out the form below and we’ll get back to you soon.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div
                className="p-8 rounded-lg"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(40, 10, 10, 0.6) 50%, rgba(60, 15, 15, 0.6) 100%)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  border: '1px solid rgba(220, 20, 60, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 60px rgba(220, 20, 60, 0.1)',
                }}
              >
                <ContactForm onSuccess={handleFormSuccess} turnstileSiteKey={turnstileSiteKey} />
              </div>
            </motion.div>
          </div>
        </section>

        <div className="-mt-20">
          <TeamSection />
        </div>

        <ContactSocial />

        <FAQSection />

        <MapSection />

        <ContactMethods />

        <ContactCTA />

        <Footer />
      </main>

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
