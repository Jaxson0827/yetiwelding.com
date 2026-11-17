import Link from 'next/link';
import GateGallery from './GateGallery';

const H2 = 'font-display text-3xl font-extrabold leading-tight text-white [font-stretch:115%] sm:text-4xl';
const RED = '#DC143C';
const INK = '#1B1D1F';

/* ------------------------------------------------------------------ */
/* How ordering works                                                  */
/* ------------------------------------------------------------------ */

export function HowItWorks({ online }: { online: boolean }) {
  const steps = [
    ['Configure', 'Enter your enclosure width and wall heights, then pick a finish and posts.'],
    online
      ? ['Order', 'Pay online, or request a quote for anything unusual. Tax is calculated at checkout.']
      : ['Request a quote', 'Send your configuration and we reply with a price.'],
    ['Approve the drawing', "We email a shop drawing with your dimensions. Nothing gets cut until you approve it."],
    ['We build it', 'Fabricated and finished in our Springville shop, about 2–3 weeks after approval.'],
    ['Pickup or delivery', "Free pickup at the shop, or free delivery within about 3 hours. We call to set a day."],
  ];
  return (
    <section aria-labelledby="how-heading" className="border-t border-gate-rule bg-black py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <h2 id="how-heading" className={H2}>
          How ordering works
        </h2>
        <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          {steps.map(([title, body], i) => (
            <li key={title} className="border-t border-white/70 pt-4">
              <span className="font-drafting text-sm font-bold text-accent-red">{i + 1}</span>
              <h3 className="mt-2 text-base font-semibold text-white">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gate-mute">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Measuring guide                                                     */
/* ------------------------------------------------------------------ */

function DimTick({ x, y }: { x: number; y: number }) {
  return <line x1={x - 6} y1={y + 6} x2={x + 6} y2={y - 6} stroke={RED} strokeWidth={1.5} />;
}

function Tag({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <g>
      <rect x={x - 11} y={y - 11} width={22} height={22} fill="#fff" stroke={RED} strokeWidth={1.25} />
      <text
        x={x}
        y={y + 5}
        textAnchor="middle"
        fill={RED}
        style={{ fontFamily: 'var(--font-b612), Arial, sans-serif', fontSize: 14, fontWeight: 700 }}
      >
        {children}
      </text>
    </g>
  );
}

function PlanView() {
  // Top-down: U-shaped CMU enclosure, opening at the bottom (front).
  return (
    <svg viewBox="0 0 360 250" className="h-auto w-full" role="img" aria-labelledby="plan-title">
      <title id="plan-title">Plan view of an enclosure showing where to measure width (A) and wall thickness (B)</title>
      <g fill="#cfd4ce" stroke={INK} strokeWidth={1.5}>
        <rect x="60" y="30" width="240" height="20" />
        <rect x="60" y="50" width="20" height="140" />
        <rect x="280" y="50" width="20" height="140" />
      </g>
      <rect x="110" y="72" width="140" height="90" fill="none" stroke={INK} strokeWidth={1} strokeDasharray="5 4" />
      <text x="180" y="122" textAnchor="middle" fill={INK} style={{ fontFamily: 'var(--font-b612), Arial', fontSize: 11 }}>
        BINS
      </text>
      <line x1="80" y1="190" x2="280" y2="190" stroke={INK} strokeWidth={1} strokeDasharray="10 4 2 4" />
      {/* A: outside to outside */}
      <line x1="60" y1="194" x2="60" y2="232" stroke={RED} strokeWidth={1} />
      <line x1="300" y1="194" x2="300" y2="232" stroke={RED} strokeWidth={1} />
      <line x1="60" y1="222" x2="300" y2="222" stroke={RED} strokeWidth={1.5} />
      <DimTick x={60} y={222} />
      <DimTick x={300} y={222} />
      <Tag x={180} y={222}>A</Tag>
      {/* B: wall thickness */}
      <line x1="60" y1="176" x2="34" y2="176" stroke={RED} strokeWidth={1} />
      <line x1="80" y1="176" x2="80" y2="176" stroke={RED} strokeWidth={1} />
      <line x1="40" y1="160" x2="100" y2="160" stroke={RED} strokeWidth={1.5} />
      <DimTick x={60} y={160} />
      <DimTick x={80} y={160} />
      <Tag x={28} y={160}>B</Tag>
      <text x="180" y="246" textAnchor="middle" fill={INK} style={{ fontFamily: 'var(--font-b612), Arial', fontSize: 11, letterSpacing: '0.08em' }}>
        PLAN
      </text>
    </svg>
  );
}

function ElevationView() {
  // Front: two walls on a pad, gate shown dashed between them.
  return (
    <svg viewBox="0 0 360 250" className="h-auto w-full" role="img" aria-labelledby="elev-title">
      <title id="elev-title">Front view showing left (C) and right (D) wall heights measured from the pad</title>
      <line x1="20" y1="200" x2="340" y2="200" stroke={INK} strokeWidth={2} />
      <g fill="#cfd4ce" stroke={INK} strokeWidth={1.5}>
        <rect x="60" y="62" width="20" height="138" />
        <rect x="280" y="70" width="20" height="130" />
      </g>
      <rect x="86" y="74" width="92" height="116" fill="none" stroke={INK} strokeWidth={1} strokeDasharray="5 4" />
      <rect x="182" y="74" width="92" height="116" fill="none" stroke={INK} strokeWidth={1} strokeDasharray="5 4" />
      {/* C: left height */}
      <line x1="36" y1="62" x2="60" y2="62" stroke={RED} strokeWidth={1} />
      <line x1="42" y1="62" x2="42" y2="200" stroke={RED} strokeWidth={1.5} />
      <DimTick x={42} y={62} />
      <DimTick x={42} y={200} />
      <Tag x={42} y={131}>C</Tag>
      {/* D: right height */}
      <line x1="300" y1="70" x2="324" y2="70" stroke={RED} strokeWidth={1} />
      <line x1="318" y1="70" x2="318" y2="200" stroke={RED} strokeWidth={1.5} />
      <DimTick x={318} y={70} />
      <DimTick x={318} y={200} />
      <Tag x={318} y={135}>D</Tag>
      <text x="180" y="226" textAnchor="middle" fill={INK} style={{ fontFamily: 'var(--font-b612), Arial', fontSize: 11, letterSpacing: '0.08em' }}>
        FRONT
      </text>
    </svg>
  );
}

export function MeasuringGuide() {
  const steps: Array<[string, string, string]> = [
    ['A', 'Enclosure width', 'Across the front, from the outside face of the left wall to the outside face of the right wall.'],
    ['B', 'Wall thickness', 'Measure one wall at the opening.'],
    ['C', 'Left wall height', 'From the concrete pad to the top of the wall (or cap), at the front corner.'],
    ['D', 'Right wall height', "Same as C on the other side. If C and D differ by more than 3\", we'll quote it."],
  ];
  return (
    <section aria-labelledby="measure-heading" className="border-t border-gate-rule bg-black py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
          <div>
            <h2 id="measure-heading" className={H2}>
              Measure your enclosure
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/75">
              Four measurements and a tape measure. Take each one twice. We check every number with you on the
              drawing before we build.
            </p>
            <ol className="mt-8 space-y-5">
              {steps.map(([tag, title, body]) => (
                <li key={tag} className="grid grid-cols-[2rem_1fr] gap-3">
                  <span className="flex h-7 w-7 items-center justify-center border border-accent-red font-drafting text-sm font-bold text-accent-red">
                    {tag}
                  </span>
                  <div>
                    <h3 className="text-[15px] font-semibold text-white">{title}</h3>
                    <p className="mt-0.5 text-sm leading-relaxed text-gate-mute">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="grid gap-px self-start bg-gate-paper-rule sm:grid-cols-2">
            <div className="bg-gate-paper p-4">
              <PlanView />
            </div>
            <div className="bg-gate-paper p-4">
              <ElevationView />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Specs                                                               */
/* ------------------------------------------------------------------ */

export function Specs() {
  const specs: Array<[string, string]> = [
    ['Frame', 'Fully welded steel'],
    ['Infill', 'Ribbed steel panels that screen the bins from view'],
    ['Hinges', 'Heavy-duty, installed before it leaves the shop'],
    ['Hardware', 'Center latch and a drop rod on each leaf'],
    ['Posts', "Optional steel posts, set about 3' deep in concrete"],
    ['Ground clearance', '4" to 7", your choice'],
    ['Finish', 'Primed, black powder coat, galvanized, or raw steel. Other powder coat colors by quote.'],
    ['Sizes', "Enclosures 8' to 20' wide. Gates 5' to 8' tall."],
    ['Shop drawing', 'Included with every order, for your approval'],
    ['Not included', 'Installation, concrete and anchors'],
  ];
  return (
    <section aria-labelledby="specs-heading" className="border-t border-gate-rule bg-black py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
          <h2 id="specs-heading" className={H2}>
            What you get
          </h2>
          <dl className="border-t border-gate-rule">
            {specs.map(([k, v]) => (
              <div key={k} className="grid gap-1 border-b border-gate-rule py-3.5 sm:grid-cols-[11rem_1fr] sm:gap-6">
                <dt className="text-sm text-gate-mute">{k}</dt>
                <dd className="text-[15px] text-white">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Gallery                                                             */
/* ------------------------------------------------------------------ */

export function Gallery() {
  return (
    <section id="installs" aria-labelledby="installs-heading" className="scroll-mt-24 border-t border-gate-rule bg-black py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <h2 id="installs-heading" className={H2}>
          Gates we&apos;ve built
        </h2>
        <p className="mt-3 max-w-xl text-base text-white/75">
          A few of the enclosure gates we&apos;ve fabricated.
        </p>
        <div className="mt-10">
          <GateGallery />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

export const GATE_FAQ: Array<[string, string]> = [
  [
    'How long does it take?',
    'About 2–3 weeks after you approve the shop drawing. Powder coat adds 3–5 business days. Galvanizing takes longer, so ask us if your schedule is tight.',
  ],
  [
    'Where do you deliver?',
    "Pickup at our Springville shop is free, and so is delivery within about a 3-hour drive. That covers most of Utah plus a few nearby towns in Idaho, Wyoming and Nevada. We confirm it from your ZIP code.",
  ],
  [
    'My pad slopes. Will the gate fit?',
    'Enter both wall heights. A difference of up to 3" is handled in the build. More than that, request a quote and we\'ll plan for it.',
  ],
  [
    'Do you install?',
    "Online orders don't include installation, concrete or anchors. If you need it installed, ask us when you request a quote.",
  ],
  [
    'Can the gate hang on my CMU walls?',
    'Most enclosures use steel posts set in concrete right beside the walls, which you can add in step 4. If you already have steel posts or embeds, choose gate only.',
  ],
  [
    'Can I return a gate?',
    "Each gate is built to your measurements, so it can't be returned once fabrication starts. That's why we send a drawing for you to approve first, and you can cancel for a full refund until you approve it.",
  ],
  [
    'Do I get drawings for my contractor or city?',
    'Every order includes a dimensioned shop drawing. If you need something specific for a submittal, tell us in your order notes or quote request.',
  ],
];

export function Faq() {
  return (
    <section aria-labelledby="faq-heading" className="border-t border-gate-rule bg-black py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
          <h2 id="faq-heading" className={H2}>
            Questions
          </h2>
          <div className="border-t border-gate-rule">
            {GATE_FAQ.map(([q, a]) => (
              <details key={q} className="group border-b border-gate-rule">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-[15px] font-semibold text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-accent-red [&::-webkit-details-marker]:hidden">
                  {q}
                  <span aria-hidden="true" className="relative h-3 w-3 shrink-0">
                    <span className="absolute left-0 top-1/2 h-px w-3 bg-white" />
                    <span className="absolute left-1/2 top-0 h-3 w-px bg-white transition-transform group-open:scale-y-0" />
                  </span>
                </summary>
                <p className="max-w-[62ch] pb-5 text-sm leading-relaxed text-white/75">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Closing                                                             */
/* ------------------------------------------------------------------ */

export function ClosingCta() {
  return (
    <section className="border-t border-gate-rule bg-black py-16">
      <div className="container mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-extrabold text-white [font-stretch:115%] sm:text-3xl">
            Odd-shaped enclosure, several sites, or need it installed?
          </h2>
          <p className="mt-2 text-base text-white/75">
            Call us at{' '}
            <a href="tel:+18019958906" className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">
              801-995-8906
            </a>{' '}
            or send the details and we&apos;ll quote it.
          </p>
        </div>
        <Link
          href="/contact"
          className="shrink-0 border border-white px-6 py-3.5 text-center text-[15px] font-semibold text-white transition-colors hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-red"
        >
          Contact us
        </Link>
      </div>
    </section>
  );
}
