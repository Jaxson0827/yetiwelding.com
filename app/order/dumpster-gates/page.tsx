import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DumpsterGateHero from '@/components/dumpster-gates/DumpsterGateHero';
import DumpsterGateConfigurator from '@/components/dumpster-gates/DumpsterGateConfigurator';
import {
  ClosingCta,
  Faq,
  GATE_FAQ,
  Gallery,
  HowItWorks,
  MeasuringGuide,
  Specs,
} from '@/components/dumpster-gates/GatePageSections';
import ProductPageSchema from '@/components/seo/ProductPageSchema';
import { getOrderProductBySlug } from '@/lib/orderProductData';
import { GATE_ONLINE_CHECKOUT } from '@/lib/onlineCheckout';
import { archivo, b612 } from '@/lib/fonts';

export default function DumpsterGatesPage() {
  const product = getOrderProductBySlug('dumpster-gates')!;
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: GATE_FAQ.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <>
      <ProductPageSchema product={product} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <main className={`${archivo.variable} ${b612.variable} min-h-screen bg-black`}>
        <Header showCart />

        <DumpsterGateHero online={GATE_ONLINE_CHECKOUT} />

        <section id="configurator" aria-labelledby="configure-heading" className="scroll-mt-20 border-t border-gate-rule bg-black pb-20 pt-16">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <h2
                id="configure-heading"
                className="font-display text-3xl font-extrabold leading-tight text-white [font-stretch:115%] sm:text-4xl"
              >
                Configure your gate
              </h2>
              <p className="max-w-md text-sm leading-relaxed text-gate-mute sm:text-right">
                Numbers in red are yours. Change any of them and the drawing follows.{' '}
                <a href="#measure-heading" className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">
                  How to measure
                </a>
              </p>
            </div>
            <DumpsterGateConfigurator />
          </div>
        </section>

        <HowItWorks online={GATE_ONLINE_CHECKOUT} />
        <MeasuringGuide />
        <Gallery />
        <Specs />
        <Faq />
        <ClosingCta />

        <Footer />
      </main>
    </>
  );
}
