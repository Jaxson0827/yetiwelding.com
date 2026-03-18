import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeaturedProject from '@/components/FeaturedProject';
import CertificationsSection from '@/components/CertificationsSection';
import ProcessSection from '@/components/ProcessSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import AboutSection from '@/components/AboutSection';
import PartnerLogos from '@/components/PartnerLogos';
import Footer from '@/components/Footer';
import HomeServicesPreview from '@/components/HomeServicesPreview';
import BackToTopButton from '@/components/BackToTopButton';
import SectionDivider from '@/components/ui/SectionDivider';

export default function Home() {
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
            description: 'Professional welding and fabrication services. Founded in 2016. Specializing in custom fabrication, structural welding, and ornamental work.',
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

      <main id="main-content" className="min-h-screen bg-black">
        <Header />
        <Hero />
        <SectionDivider />
        <HomeServicesPreview />
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

      <BackToTopButton />
    </>
  );
}

