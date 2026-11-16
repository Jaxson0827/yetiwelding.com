import Image from 'next/image';
import heroPhoto from '@/public/projects/photo9.jpg';

interface DumpsterGateHeroProps {
  online: boolean;
}

/**
 * Hero: a straight-on photo of a gate we built (it reads like an elevation drawing) with a
 * crimson dimension string across the opening. It sets up the drawing-based configurator below.
 * Overlay coordinates are in the photo's own pixel space (1100 × 825 at 4:3).
 */
export default function DumpsterGateHero({ online }: DumpsterGateHeroProps) {
  return (
    <section className="relative overflow-hidden bg-black pb-14 pt-28 sm:pt-36 lg:pb-20">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="order-2 lg:order-1">
            <h1 className="font-display text-[2.35rem] font-extrabold leading-[1.02] tracking-[-0.01em] text-white [font-stretch:110%] sm:text-5xl lg:text-[3.1rem]">
              Steel dumpster gates, built to your opening.
            </h1>
            <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-white/75">
              Enter your enclosure&apos;s dimensions and watch the drawing update as you go.{' '}
              {online ? 'Order online' : 'Request a quote online'}, and we build it in our Springville, Utah shop.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a
                href="#configurator"
                className="bg-accent-red px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-accent-red-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Configure your gate
              </a>
              <a
                href="#installs"
                className="text-[15px] font-medium text-white underline decoration-white/30 underline-offset-[6px] transition-colors hover:decoration-white"
              >
                See gates we&apos;ve built
              </a>
            </div>

            <dl className="mt-10 grid grid-cols-3 border-y border-gate-rule">
              {[
                ['Pickup', 'Free at our shop'],
                ['Delivery', 'Free within ~3 hours'],
                ['Lead time', '2–3 weeks'],
              ].map(([term, desc], i) => (
                <div key={term} className={`py-4 pr-3 ${i > 0 ? 'border-l border-gate-rule pl-4' : ''}`}>
                  <dt className="text-xs text-gate-mute">{term}</dt>
                  <dd className="mt-1 text-sm font-semibold leading-snug text-white">{desc}</dd>
                </div>
              ))}
            </dl>
          </div>

          <figure className="order-1 lg:order-2">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gate-plate">
              <Image
                src={heroPhoto}
                alt="Black steel double-swing dumpster gate built by Yeti Welding, photographed straight on"
                fill
                priority
                placeholder="blur"
                sizes="(min-width: 1024px) 640px, 100vw"
                className="object-cover"
              />
              <svg
                viewBox="0 0 1100 825"
                className="absolute inset-0 h-full w-full"
                aria-hidden="true"
                preserveAspectRatio="xMidYMid slice"
              >
                <g stroke="#DC143C" strokeWidth="3" fill="none" className="gate-dim-draw">
                  {/* Witness lines up from the outside of each post */}
                  <line x1="155" y1="316" x2="155" y2="232" />
                  <line x1="922" y1="300" x2="922" y2="232" />
                  {/* Dimension line with architectural ticks */}
                  <line x1="155" y1="252" x2="922" y2="252" />
                  <line x1="143" y1="264" x2="167" y2="240" />
                  <line x1="910" y1="264" x2="934" y2="240" />
                  {/* Height: right of the gate */}
                  <line x1="938" y1="318" x2="1000" y2="318" />
                  <line x1="938" y1="540" x2="1000" y2="540" />
                  <line x1="985" y1="318" x2="985" y2="540" />
                  <line x1="973" y1="330" x2="997" y2="306" />
                  <line x1="973" y1="552" x2="997" y2="528" />
                </g>
                <g className="gate-dim-label">
                  <rect x="433" y="230" width="212" height="44" fill="#fff" />
                  <text
                    x="539"
                    y="259"
                    textAnchor="middle"
                    fill="#DC143C"
                    style={{ fontFamily: 'var(--font-b612), Arial, sans-serif', fontSize: 22, fontWeight: 700, letterSpacing: '0.06em' }}
                  >
                    YOUR OPENING
                  </text>
                </g>
              </svg>
            </div>
            <figcaption className="mt-2 text-xs text-gate-mute">A double-swing enclosure gate from our shop.</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
