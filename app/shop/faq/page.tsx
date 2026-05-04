import { Metadata } from 'next';
import EditorialHero from '@/components/shop/editorial/EditorialHero';
import FaqAccordion from '@/components/shop/editorial/FaqAccordion';
import { faqSections } from '@/lib/shop/faq';
import { EDITORIAL_FAQ_HERO } from '@/lib/shop/images';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Yeti Steel Goods',
  description:
    'Find answers to common questions about Yeti Welding landscape edging, COR-TEN steel, and ordering.',
  alternates: { canonical: 'https://yetiwelding.com/shop/faq' },
};

export default function FaqPage() {
  return (
    <>
      <EditorialHero
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about Yeti landscape edging"
        image={EDITORIAL_FAQ_HERO}
      />

      <section className="container mx-auto max-w-5xl space-y-12 px-4 py-16 md:py-20">
        {faqSections.map((s) => (
          <FaqAccordion key={s.title} section={s} />
        ))}
      </section>
    </>
  );
}
