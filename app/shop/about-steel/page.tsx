import { Metadata } from 'next';
import EditorialHero from '@/components/shop/editorial/EditorialHero';
import {
  EDITORIAL_ABOUT_STEEL_HERO,
  EDITORIAL_ABOUT_DETAIL_1,
  EDITORIAL_ABOUT_DETAIL_2,
} from '@/lib/shop/images';

export const metadata: Metadata = {
  title: 'What is COR-TEN Steel? | Yeti Steel Goods',
  description:
    'Discover the timeless beauty and durability of weathering steel — the material behind every Yeti Steel Good.',
  alternates: { canonical: 'https://yetiwelding.com/shop/about-steel' },
};

export default function AboutSteelPage() {
  return (
    <>
      <EditorialHero
        title="What is COR-TEN Steel?"
        subtitle="Discover the timeless beauty and durability of weathering steel"
        image={EDITORIAL_ABOUT_STEEL_HERO}
      />

      <article className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-2xl space-y-12 text-white/80">
          <section className="rounded-lg border border-white/10 bg-white/[0.04] p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              The Story of COR-TEN Steel
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed">
              COR-TEN is a family of weathering steels developed in the 1930s to
              eliminate the need for painting and provide longer service life
              than ordinary carbon steel. Its breakthrough is a stable, dense
              oxide layer that forms on the surface and slows further corrosion
              to a crawl. The result is a material that ages into a deep,
              variegated rust patina — rich, earthy, and protective.
            </p>
          </section>

          <figure className="overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={EDITORIAL_ABOUT_DETAIL_1}
              alt="COR-TEN architectural detail"
              className="h-72 w-full object-cover md:h-96"
              loading="lazy"
            />
          </figure>

          <section>
            <h3 className="text-xl font-semibold text-white">Longevity</h3>
            <p className="mt-3 text-[15px] leading-relaxed">
              Where mild steel rusts continuously and weakens, COR-TEN
              self-protects. A typical landscape installation can last 50+ years
              outdoors with virtually no maintenance.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-white">Unique Appearance</h3>
            <p className="mt-3 text-[15px] leading-relaxed">
              No two pieces patina exactly the same. Sun, shade, rainfall,
              proximity to plants, and even the soil chemistry of your yard all
              influence how each piece develops its character over time.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-white">
              Minimal Maintenance
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed">
              No painting. No staining. No sealing required. Just install and
              let the weather do the work.
            </p>
          </section>

          <figure className="overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={EDITORIAL_ABOUT_DETAIL_2}
              alt="Iconic weathering-steel architecture"
              className="h-72 w-full object-cover md:h-96"
              loading="lazy"
            />
          </figure>

          <section>
            <h3 className="text-xl font-semibold text-white">
              Iconic Architectural Projects
            </h3>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-[15px] leading-relaxed marker:text-accent-red">
              <li>
                <strong className="text-white">U.S. Steel Tower</strong>,
                Pittsburgh — one of the first major commercial uses.
              </li>
              <li>
                <strong className="text-white">Angel of the North</strong>,
                Gateshead, UK — the iconic Antony Gormley sculpture.
              </li>
              <li>
                <strong className="text-white">Barclays Center</strong>,
                Brooklyn — a famous example of weathering-steel architecture in
                contemporary design.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-white">
              A Landscape Option That Surpasses Competitors
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed">
              Most landscape products rely on plastic, painted steel, or
              powder-coated finishes that chip, crack, and fade. COR-TEN is the
              opposite — its surface improves with age and outlasts the
              alternatives by decades.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-white">
              Yeti Has Perfected the Art of Using Weathering Steel
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed">
              Every Yeti Steel Good is fabricated from US-made A606-T4 weathering
              steel and engineered for the long haul. We&apos;ve refined our
              tooling, weld profiles, and packaging so what arrives at your door
              installs cleanly and ages beautifully — for decades.
            </p>
          </section>
        </div>
      </article>
    </>
  );
}
