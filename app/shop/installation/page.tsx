import { Metadata } from 'next';
import EditorialHero from '@/components/shop/editorial/EditorialHero';

export const metadata: Metadata = {
  title: 'Installation Guide | Yeti Steel Goods',
  description:
    'A comprehensive guide to installing your Yeti landscape edging with precision and care.',
  alternates: { canonical: 'https://yetiwelding.com/shop/installation' },
};

const tools = [
  {
    title: 'Wood Block',
    subtitle: 'For hammering COR-TEN landscape edging',
    image: '/projects/photo38.jpg',
  },
  {
    title: 'Hammer',
    subtitle: 'For securing the edging in place',
    image: '/projects/photo39.jpg',
  },
  {
    title: 'Knee Pads',
    subtitle: 'For comfortable installation',
    image: '/projects/photo40.jpg',
  },
  {
    title: 'Safety Gear',
    subtitle: 'Safety glasses and gloves',
    image: '/projects/photo41.jpg',
  },
];

const steps = [
  {
    number: '01',
    title: 'Prepare',
    body:
      'Use an edger or shovel to help loosen the soil and define the path where edging will be installed.',
    image: '/projects/photo28.jpg',
  },
  {
    number: '02',
    title: 'Position',
    body:
      'Position the edging with the teeth down along the defined path. Start in the most visible corners for best results.',
    image: '/projects/photo29.jpg',
  },
  {
    number: '03',
    title: 'Hammer',
    body:
      'Place wood block over the spine of the edging and drive down with a hammer.',
    image: '/projects/photo30.jpg',
  },
  {
    number: '04',
    title: 'Connect',
    body:
      'Place edging end to end, attach clamp between the notch on both ends. Drive down to secure clamp.',
    image: '/projects/photo31.jpg',
  },
];

export default function InstallationPage() {
  return (
    <>
      <EditorialHero
        title="Installation Guide"
        subtitle="A comprehensive guide to installing your landscape edging with precision and care"
        image="/projects/photo38.jpg"
      />

      {/* Essential Tools */}
      <section className="px-4 py-16 md:py-20">
        <div className="container mx-auto max-w-6xl">
          <header className="text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Essential Tools
            </h2>
            <p className="mt-2 text-sm text-white/60 md:text-base">
              Gather these tools before beginning your installation for the best
              results
            </p>
          </header>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
            {tools.map((t) => (
              <div
                key={t.title}
                className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]"
              >
                <div className="aspect-square w-full overflow-hidden bg-white/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.image}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <p className="text-base font-semibold text-white">{t.title}</p>
                  <p className="mt-1 text-xs text-white/55">{t.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Promo insert */}
          <div className="mt-10 flex flex-col items-start gap-5 rounded-lg border border-white/10 bg-white/[0.04] p-5 md:flex-row md:items-center md:p-6">
            <div className="aspect-square w-24 shrink-0 overflow-hidden rounded-md bg-white/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/projects/photo42.jpg"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-base font-semibold text-white">
                Need the right tools?
              </p>
              <p className="mt-1 text-sm text-white/65">
                Get our complete Installation Kit with a premium wood block and
                heavy-duty hammer in one convenient package.
              </p>
            </div>
            <a
              href="/shop/edging-accessories"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent-red px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-accent-red-light"
            >
              Shop Installation Kit
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Installation Process */}
      <section className="border-t border-white/10 bg-gray-cool-100 px-4 py-16 md:py-20">
        <div className="container mx-auto max-w-6xl">
          <header className="text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Installation Process
            </h2>
            <p className="mt-2 text-sm text-white/60 md:text-base">
              Follow these steps carefully for a professional installation
            </p>
          </header>

          <div className="mt-12 space-y-12 md:space-y-20">
            {steps.map((s, i) => {
              const reverse = i % 2 === 1;
              return (
                <div
                  key={s.number}
                  className={`grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12 ${
                    reverse ? 'md:[&>*:first-child]:order-2' : ''
                  }`}
                >
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-white/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.image}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <span className="font-playfair text-7xl font-bold leading-none text-accent-red md:text-8xl">
                      {s.number}
                    </span>
                    <h3 className="mt-3 text-2xl font-bold text-white md:text-3xl">
                      {s.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/70 md:text-base">
                      {s.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Advanced Techniques */}
      <section className="border-t border-white/10 px-4 py-16 md:py-20">
        <div className="container mx-auto max-w-3xl">
          <header className="text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Advanced Techniques
            </h2>
            <p className="mt-2 text-sm text-white/60 md:text-base">
              Master these techniques for professional results
            </p>
          </header>

          <div className="mt-10 space-y-10">
            <div>
              <h3 className="text-xl font-semibold text-white">
                Bending Techniques
              </h3>
              <ul className="mt-4 space-y-4 text-sm leading-relaxed text-white/75">
                <li>
                  <strong className="text-white">Sharp Bends:</strong> Place the
                  block across the valley of the teeth, bend material to the
                  desired angle while applying pressure to the block.
                </li>
                <li>
                  <strong className="text-white">Gradual Bends:</strong> Stand
                  the material on end and apply pressure to the middle in order
                  to flex the material to the desired radius.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">
                Additional Tips
              </h3>
              <ul className="mt-4 space-y-4 text-sm leading-relaxed text-white/75">
                <li>
                  <strong className="text-white">Elevation Changes:</strong> You
                  can accommodate for slight hills or elevation changes by
                  gapping the material at the joint and using the connector to
                  cover the space.
                </li>
                <li>
                  <strong className="text-white">Achieving Exact Length:</strong>{' '}
                  Steel landscape edging can be cut to length using standard
                  metal cutting tools.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
