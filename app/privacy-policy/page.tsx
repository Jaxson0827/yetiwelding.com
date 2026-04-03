import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Yeti Welding',
  description:
    'Yeti Welding Privacy Policy. Learn how we collect, use, and protect your personal information when you use our website and services.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://yetiwelding.com/privacy-policy' },
};

const sections = [
  {
    id: 'introduction',
    title: 'Introduction',
    content: (
      <>
        <p>
          Yeti Welding (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates https://yetiwelding.com (the
          &quot;Site&quot;). This Privacy Policy explains how we collect, use, disclose, and safeguard your
          information when you visit our Site, place orders, or contact us. Please read this policy carefully.
        </p>
        <p>
          <strong>Effective Date:</strong> February 19, 2025. We may update this policy from time to time; the
          &quot;Last Updated&quot; date at the bottom will reflect any changes.
        </p>
      </>
    ),
  },
  {
    id: 'information-we-collect',
    title: 'Information We Collect',
    content: (
      <>
        <p>We collect information you provide directly and information collected automatically:</p>
        <h3 className="mt-4 font-semibold text-white">Information You Provide</h3>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-white/80">
          <li>
            <strong>Contact form:</strong> Name, email address, phone number, company (optional), and message
          </li>
          <li>
            <strong>Orders and checkout:</strong> Name, email, phone, company (optional), shipping and billing
            addresses, delivery preferences (e.g., liftgate, commercial vs. residential), and special
            instructions
          </li>
          <li>
            <strong>Payment:</strong> Payment is processed by Stripe. We do not store full credit card numbers.
            Stripe&apos;s privacy policy applies to payment data:{' '}
            <a
              href="https://stripe.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-red hover:underline"
            >
              stripe.com/privacy
            </a>
          </li>
        </ul>
        <h3 className="mt-4 font-semibold text-white">Information Collected Automatically</h3>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-white/80">
          <li>
            <strong>Device and usage data:</strong> IP address, browser type, device type, pages visited, and
            referring URLs
          </li>
          <li>
            <strong>Local storage:</strong> Cart contents (product configurations, quantities) stored in your
            browser to preserve your selections between visits
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'how-we-use',
    title: 'How We Use Your Information',
    content: (
      <>
        <p>We use the information we collect to:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-white/80">
          <li>Process and fulfill orders, including shipping and delivery</li>
          <li>Respond to contact form submissions and customer inquiries</li>
          <li>Send order confirmations, shipping updates, and related transactional emails</li>
          <li>Improve our Site, products, and services</li>
          <li>Comply with legal obligations and protect our rights</li>
          <li>Prevent fraud and enforce our terms</li>
        </ul>
      </>
    ),
  },
  {
    id: 'third-parties',
    title: 'Third-Party Services',
    content: (
      <>
        <p>We share information with trusted service providers who assist our operations:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-white/80">
          <li>
            <strong>Stripe:</strong> Payment processing. Stripe&apos;s privacy policy:{' '}
            <a
              href="https://stripe.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-red hover:underline"
            >
              stripe.com/privacy
            </a>
          </li>
          <li>
            <strong>Shippo:</strong> Shipping rate quotes and label generation. Shippo&apos;s privacy policy:{' '}
            <a
              href="https://goshippo.com/privacy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-red hover:underline"
            >
              goshippo.com/privacy
            </a>
          </li>
          <li>
            <strong>Resend:</strong> Transactional email delivery. Resend&apos;s privacy policy:{' '}
            <a
              href="https://resend.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-red hover:underline"
            >
              resend.com/legal/privacy-policy
            </a>
          </li>
          <li>
            <strong>Hosting and analytics:</strong> Our Site is hosted on Vercel. We may use analytics tools that
            collect anonymized usage data.
          </li>
        </ul>
        <p className="mt-4">
          We do not sell your personal information to third parties for marketing purposes.
        </p>
      </>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies and Local Storage',
    content: (
      <>
        <p>
          We use browser local storage to persist your shopping cart so you can return to complete an order.
          This data stays on your device and is not sent to our servers except when you submit an order.
        </p>
        <p className="mt-4">
          We may use cookies for essential site functionality (e.g., session management). You can disable
          cookies in your browser settings, but some features may not work correctly.
        </p>
      </>
    ),
  },
  {
    id: 'data-retention',
    title: 'Data Retention',
    content: (
      <>
        <p>
          We retain order and contact information as long as needed to fulfill orders, provide customer
          support, comply with legal obligations (e.g., tax records), and resolve disputes. Cart data in your
          browser is under your control and can be cleared at any time.
        </p>
      </>
    ),
  },
  {
    id: 'security',
    title: 'Security',
    content: (
      <>
        <p>
          We use industry-standard measures to protect your information, including HTTPS encryption, secure
          payment processing through Stripe, and access controls. No method of transmission over the Internet
          is 100% secure; we cannot guarantee absolute security.
        </p>
      </>
    ),
  },
  {
    id: 'children',
    title: "Children's Privacy",
    content: (
      <>
        <p>
          Our Site is not directed to individuals under 16. We do not knowingly collect personal information
          from children. If you believe we have collected such information, please contact us and we will
          delete it promptly.
        </p>
      </>
    ),
  },
  {
    id: 'california',
    title: 'California Privacy Rights (CCPA)',
    content: (
      <>
        <p>
          If you are a California resident, you have additional rights under the California Consumer Privacy
          Act (CCPA):
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-white/80">
          <li>Right to know what personal information we collect and how it is used</li>
          <li>Right to delete personal information (subject to certain exceptions)</li>
          <li>Right to opt out of the &quot;sale&quot; of personal information (we do not sell personal information)</li>
          <li>Right to non-discrimination for exercising your privacy rights</li>
        </ul>
        <p className="mt-4">
          To exercise these rights, contact us at the email or address below. We will verify your identity
          before processing requests.
        </p>
      </>
    ),
  },
  {
    id: 'international',
    title: 'International Users (GDPR)',
    content: (
      <>
        <p>
          If you are in the European Economic Area (EEA) or United Kingdom, you have rights under the General
          Data Protection Regulation (GDPR), including:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-white/80">
          <li>Right of access to your personal data</li>
          <li>Right to rectification of inaccurate data</li>
          <li>Right to erasure (&quot;right to be forgotten&quot;)</li>
          <li>Right to restrict processing</li>
          <li>Right to data portability</li>
          <li>Right to object to processing</li>
          <li>Right to withdraw consent where processing is based on consent</li>
          <li>Right to lodge a complaint with a supervisory authority</li>
        </ul>
        <p className="mt-4">
          Our legal bases for processing include: performance of a contract (order fulfillment), legitimate
          interests (customer service, fraud prevention), and compliance with legal obligations.
        </p>
      </>
    ),
  },
  {
    id: 'contact',
    title: 'Contact Us',
    content: (
      <>
        <p>
          For questions about this Privacy Policy or to exercise your privacy rights, contact us:
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
          or office@yetiwelding.com
          <br />
          Phone: 801-995-8906
        </p>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <main id="main-content" className="min-h-screen bg-black">
        <Header />

        {/* Hero */}
        <section className="w-full pt-32 pb-16 px-4 bg-black">
          <div className="container mx-auto max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-glow">
              Privacy Policy
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

            <p className="mt-16 text-white/60 text-sm">
              This privacy policy is provided for informational purposes. It does not constitute legal advice.
              We recommend consulting a qualified attorney for guidance specific to your business and
              jurisdiction.
            </p>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
