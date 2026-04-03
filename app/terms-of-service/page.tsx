import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | Yeti Welding',
  description:
    'Yeti Welding Terms of Service. Read the terms governing your use of our website, orders, payment, shipping, and more.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://yetiwelding.com/terms-of-service' },
};

const sections = [
  {
    id: 'introduction',
    title: 'Introduction and Acceptance',
    content: (
      <>
        <p>
          Yeti Welding (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates https://yetiwelding.com (the
          &quot;Site&quot;). These Terms of Service (&quot;Terms&quot;) govern your use of the Site and any orders
          you place. By using the Site or placing an order, you agree to these Terms.
        </p>
        <p>
          <strong>Effective Date:</strong> February 19, 2025. We may modify these Terms from time to time. The
          &quot;Last Updated&quot; date at the bottom will reflect changes. Your continued use of the Site or
          placement of orders after changes constitutes acceptance of the revised Terms.
        </p>
      </>
    ),
  },
  {
    id: 'use-of-website',
    title: 'Use of the Website',
    content: (
      <>
        <p>
          We grant you a limited, non-exclusive, revocable license to access and use the Site for lawful
          purposes. No account is required; we offer guest checkout.
        </p>
        <p className="mt-4">You agree not to:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-white/80">
          <li>Use the Site for any fraudulent, illegal, or unauthorized purpose</li>
          <li>Attempt to gain unauthorized access to our systems, networks, or other users&apos; data</li>
          <li>Scrape, harvest, or collect data from the Site without our permission</li>
          <li>Interfere with or disrupt the Site or its security</li>
          <li>Use the Site in any way that could harm, disable, or overburden our infrastructure</li>
        </ul>
      </>
    ),
  },
  {
    id: 'products-and-orders',
    title: 'Products and Orders',
    content: (
      <>
        <p>
          Our products (steel plate embeds, dumpster gates, and related fabrication) are configure-to-order.
          Specifications and pricing are shown during configuration and at checkout.
        </p>
        <h3 className="mt-4 font-semibold text-white">Order Acceptance</h3>
        <p className="mt-2">
          We reserve the right to accept or decline any order. We may decline orders due to product
          availability, custom fabrication review, pricing errors, or other business reasons. If we decline
          an order after payment, we will refund you in full.
        </p>
        <h3 className="mt-4 font-semibold text-white">Pricing</h3>
        <p className="mt-2">
          Prices shown are estimates; the final price is confirmed at checkout. We may correct pricing
          errors. If we discover an error after you have paid, we will contact you to resolve or refund as
          appropriate.
        </p>
        <h3 className="mt-4 font-semibold text-white">Quote Requests</h3>
        <p className="mt-2">
          The &quot;Request Quote&quot; flow creates a non-binding inquiry. We will contact you with a formal
          quote. These Terms apply when you accept a quote and complete payment.
        </p>
      </>
    ),
  },
  {
    id: 'payment-terms',
    title: 'Payment Terms',
    content: (
      <>
        <p>
          <strong>Pay Online:</strong> Payment is processed via Stripe at checkout. Your order is binding upon
          successful payment. We do not store full credit card numbers.
        </p>
        <p className="mt-4">
          <strong>Request Quote:</strong> No payment is required at submission. When you accept a quote and
          pay, these Terms apply to that transaction.
        </p>
        <p className="mt-4">
          All prices are in USD. Sales tax is applied where required by law. Stripe&apos;s terms apply to
          payment processing:{' '}
          <a
            href="https://stripe.com/legal"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-red hover:underline"
          >
            stripe.com/legal
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: 'shipping-delivery',
    title: 'Shipping and Delivery',
    content: (
      <>
        <p>
          Shipping is calculated at checkout based on your delivery address and product dimensions and
          weight. Delivery times are estimates and not guarantees.
        </p>
        <p className="mt-4">
          Risk of loss of goods passes to you upon delivery to the carrier. You are responsible for
          providing an accurate delivery address and for being available to receive delivery (or arranging
          for someone to accept on your behalf).
        </p>
      </>
    ),
  },
  {
    id: 'returns-refunds',
    title: 'Returns, Refunds, and Cancellations',
    content: (
      <>
        <p>
          Our products are custom and fabricated to your specifications. They are generally non-returnable
          unless defective or non-conforming.
        </p>
        <p className="mt-4">
          <strong>Cancellation:</strong> Before fabrication begins, we may allow cancellation subject to any
          restocking or processing fees we communicate to you.
        </p>
        <p className="mt-4">
          <strong>Refunds:</strong> Refunds are processed in accordance with Stripe and our policies. Contact
          us for any payment or order issues.
        </p>
        <p className="mt-4">
          <strong>Defective or non-conforming goods:</strong> If you receive goods that are defective or do not
          conform to the order, notify us promptly. We will work with you to resolve the issue.
        </p>
      </>
    ),
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    content: (
      <>
        <p>
          The Site and its content, including logos, text, graphics, and materials, are owned by Yeti Welding
          or our licensors. You are not granted any license to copy, modify, distribute, or use our
          intellectual property except as necessary to use the Site for its intended purpose.
        </p>
      </>
    ),
  },
  {
    id: 'warranty',
    title: 'Warranty and Disclaimers',
    content: (
      <>
        <p>
          We warrant that products will be manufactured to the specifications in your order and will be free
          from defects in materials and workmanship under normal use. This warranty is limited to the extent
          permitted by law.
        </p>
        <p className="mt-4">
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL IMPLIED WARRANTIES, INCLUDING
          MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. Some jurisdictions do not allow disclaimer
          of implied warranties; in such jurisdictions, our liability is limited to the warranty period
          permitted by law.
        </p>
        <p className="mt-4">
          For custom fabrication, you warrant that the specifications you provide are suitable for your
          intended use. We are not responsible for design choices that do not meet your intended
          application.
        </p>
      </>
    ),
  },
  {
    id: 'limitation-of-liability',
    title: 'Limitation of Liability',
    content: (
      <>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE ARE NOT LIABLE FOR ANY INDIRECT, INCIDENTAL,
          CONSEQUENTIAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, LOST DATA, OR BUSINESS
          INTERRUPTION, ARISING FROM YOUR USE OF THE SITE OR PRODUCTS.
        </p>
        <p className="mt-4">
          OUR TOTAL LIABILITY FOR ANY CLAIMS ARISING FROM OR RELATED TO THESE TERMS OR YOUR ORDERS SHALL NOT
          EXCEED THE AMOUNT YOU PAID FOR THE RELEVANT ORDER (OR THE MAXIMUM AMOUNT PERMITTED BY LAW).
        </p>
        <p className="mt-4">
          These limitations apply regardless of the theory of liability. Some jurisdictions do not allow
          limitation of liability for certain damages; in such jurisdictions, our liability is limited to
          the maximum extent permitted by law.
        </p>
      </>
    ),
  },
  {
    id: 'indemnification',
    title: 'Indemnification',
    content: (
      <>
        <p>
          You agree to indemnify, defend, and hold harmless Yeti Welding and its officers, directors,
          employees, and agents from and against any claims, damages, losses, liabilities, costs, and expenses
          (including reasonable attorneys&apos; fees) arising from: (a) your breach of these Terms; (b) your
          misuse of the Site; (c) your violation of any law or third-party rights; or (d) any dispute
          between you and a third party related to your use of the Site or products.
        </p>
      </>
    ),
  },
  {
    id: 'governing-law',
    title: 'Governing Law and Disputes',
    content: (
      <>
        <p>
          These Terms are governed by the laws of the State of Utah, without regard to conflict of laws
          principles. Any dispute arising from these Terms or your use of the Site shall be resolved in the
          state or federal courts located in Utah, and you consent to the personal jurisdiction of such
          courts.
        </p>
        <p className="mt-4">
          Before initiating litigation, we encourage you to contact us to attempt informal resolution. Many
          disputes can be resolved through direct communication.
        </p>
      </>
    ),
  },
  {
    id: 'general-provisions',
    title: 'General Provisions',
    content: (
      <>
        <p>
          <strong>Severability:</strong> If any provision of these Terms is held invalid or unenforceable, the
          remaining provisions remain in effect.
        </p>
        <p className="mt-4">
          <strong>Waiver:</strong> Our failure to enforce any right or provision does not constitute a waiver
          of that right or provision.
        </p>
        <p className="mt-4">
          <strong>Entire Agreement:</strong> These Terms, together with our Privacy Policy and any order
          confirmations, constitute the entire agreement between you and Yeti Welding regarding the Site and
          orders.
        </p>
        <p className="mt-4">
          <strong>No Agency:</strong> Nothing in these Terms creates an agency, partnership, joint venture,
          or employment relationship between you and Yeti Welding.
        </p>
        <p className="mt-4">
          <strong>Assignment:</strong> We may assign our rights and obligations under these Terms. You may
          not assign your rights or obligations without our prior written consent.
        </p>
      </>
    ),
  },
  {
    id: 'contact',
    title: 'Contact',
    content: (
      <>
        <p>
          For questions about these Terms or to resolve a dispute, contact us:
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

export default function TermsOfServicePage() {
  return (
    <>
      <main id="main-content" className="min-h-screen bg-black">
        <Header />

        {/* Hero */}
        <section className="w-full pt-32 pb-16 px-4 bg-black">
          <div className="container mx-auto max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-glow">
              Terms of Service
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
              These Terms are provided for informational purposes. They do not constitute legal advice. We
              recommend consulting a qualified attorney for guidance specific to your business and
              jurisdiction.
            </p>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
