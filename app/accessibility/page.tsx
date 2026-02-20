import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Accessibility | Yeti Welding',
  description:
    'Yeti Welding Accessibility Statement. Our commitment to digital accessibility and how we work to ensure our website is usable by everyone.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://yetiwelding.com/accessibility' },
};

const sections = [
  {
    id: 'commitment',
    title: 'Our Commitment',
    content: (
      <>
        <p>
          Yeti Welding is committed to ensuring digital accessibility for people with disabilities. We
          continually improve the user experience for everyone and apply relevant accessibility standards.
        </p>
        <p className="mt-4">
          We believe that everyone should be able to access our website and services, regardless of how
          they interact with the web. This statement describes our efforts and how you can get in touch if
          you encounter barriers.
        </p>
      </>
    ),
  },
  {
    id: 'conformance',
    title: 'Conformance Status',
    content: (
      <>
        <p>
          We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.2 at Level AA. WCAG defines
          requirements for designers and developers to improve accessibility for people with a wide range of
          disabilities, including visual, auditory, physical, speech, cognitive, and neurological.
        </p>
        <p className="mt-4">
          Conformance is evaluated through self-assessment and user feedback. We are working toward full
          conformance and welcome feedback to help us identify and address gaps.
        </p>
      </>
    ),
  },
  {
    id: 'measures',
    title: 'Measures We Take',
    content: (
      <>
        <p>We take the following measures to support accessibility:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-white/80">
          <li>Include accessibility as part of our design and development process</li>
          <li>Use semantic HTML and ARIA attributes where appropriate</li>
          <li>Provide skip-to-content links for keyboard and screen reader users</li>
          <li>Ensure sufficient color contrast and visible focus indicators</li>
          <li>Test with keyboard navigation and assistive technologies</li>
          <li>Solicit and address feedback from users with disabilities</li>
        </ul>
      </>
    ),
  },
  {
    id: 'limitations',
    title: 'Known Limitations',
    content: (
      <>
        <p>
          Some third-party content on our site (e.g., embedded maps, Stripe checkout) may have varying
          levels of accessibility. We are not responsible for the accessibility of third-party services,
          but we encourage them to meet accessibility standards.
        </p>
        <p className="mt-4">
          If you encounter accessibility barriers with any part of our site, including third-party
          components, please contact us. We will work with you to find an alternative or workaround when
          possible.
        </p>
      </>
    ),
  },
  {
    id: 'compatibility',
    title: 'Assistive Technologies and Compatibility',
    content: (
      <>
        <p>
          Our site is designed to work with modern browsers and assistive technologies, including screen
          readers, keyboard navigation, and voice control. Supported browsers include Chrome, Firefox,
          Safari, and Edge (recent versions).
        </p>
        <p className="mt-4">
          We recommend keeping your assistive technology and browser up to date for the best experience.
          Some older combinations may not fully support all features.
        </p>
      </>
    ),
  },
  {
    id: 'feedback',
    title: 'Feedback and Contact',
    content: (
      <>
        <p>
          We welcome your feedback on the accessibility of yetiwelding.com. If you encounter accessibility
          barriers or have suggestions for improvement, please contact us:
        </p>
        <p className="mt-4">
          <strong>Yeti Welding</strong>
          <br />
          1680 W 1600 S, Springville, UT 84663
          <br />
          Email:{' '}
          <Link href="/contact" className="text-accent-red hover:underline">
            Contact form
          </Link>{' '}
          or{' '}
          <a
            href="mailto:office@yetiwelding.com"
            className="text-accent-red hover:underline"
          >
            office@yetiwelding.com
          </a>
          <br />
          Phone: 801-995-8906
        </p>
        <p className="mt-4">
          We aim to respond to accessibility feedback within 5 business days and to propose a solution
          when applicable.
        </p>
      </>
    ),
  },
  {
    id: 'complaints',
    title: 'Formal Complaints',
    content: (
      <>
        <p>
          If you are not satisfied with our response to your accessibility feedback, you may escalate to
          relevant authorities. In the United States, you can find resources at{' '}
          <a
            href="https://www.ada.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-red hover:underline"
          >
            ADA.gov
          </a>
          . You may also contact your local disability rights organization for guidance.
        </p>
      </>
    ),
  },
];

export default function AccessibilityPage() {
  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <main id="main-content" className="min-h-screen bg-black">
        <Header />

        {/* Hero */}
        <section className="w-full pt-32 pb-16 px-4 bg-black">
          <div className="container mx-auto max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-glow">
              Accessibility Statement
            </h1>
            <p className="mt-4 text-white/70 text-lg">
              Last Updated: February 19, 2025
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="w-full pb-24 px-4 bg-black">
          <div className="container mx-auto max-w-3xl">
            <div className="space-y-12">
              {sections.map((section) => (
                <article key={section.id} id={section.id}>
                  <h2 className="text-2xl font-bold text-white uppercase tracking-tight border-b border-white/20 pb-2 mb-4">
                    {section.title}
                  </h2>
                  <div className="prose prose-invert max-w-none text-white/80 space-y-4">
                    {section.content}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
