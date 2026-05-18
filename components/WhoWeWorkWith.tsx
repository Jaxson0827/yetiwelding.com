'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';

const audiences = [
  {
    id: 'homeowners',
    title: 'Homeowners',
    tagline: 'Your vision, built to last.',
    description:
      "You have an idea — a gate, a railing, a pergola, something custom you've been thinking about for years. We'll sit down with you, design something that fits your space and budget, and build it the right way. No subcontracted guesswork. Our crew does the work.",
    bullets: [
      'Design consultation included',
      'Clear pricing before any work starts',
      'Gallery of finished residential projects to browse',
      'We install — no handoff to a third party',
    ],
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 22V12h6v10" />
      </svg>
    ),
    cta: { label: 'Start a Project', href: '/contact' },
  },
  {
    id: 'general-contractors',
    title: 'General Contractors',
    tagline: "We won't blow your schedule.",
    description:
      "You need a fabrication shop that shows up, hits the timeline, and doesn't create a punch list. We hold Clark County (Nevada) and DFCM (Utah) certifications — which means our shop work passes state and municipality inspections without headaches. We've pulled GCs out of tight spots before. That's why they come back.",
    bullets: [
      'Clark County and DFCM certified shop',
      'Works from stamped engineer drawings',
      'Clear lead times quoted upfront',
      'Available for field measurement and install',
    ],
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    cta: { label: 'Talk to Us', href: '/contact' },
  },
  {
    id: 'developers',
    title: 'Commercial Developers',
    tagline: 'Scale is not a problem.',
    description:
      "Our 2025 expansion gave us a larger shop and a bigger crew specifically to handle commercial-scale work. Structural steel packages, monument entry features, shade structures for amenity areas — we have the capacity and the certifications to take on projects that require serious fabrication infrastructure.",
    bullets: [
      'Commercial-scale shop capacity',
      'Structural steel and ornamental in one shop',
      'Monument and landmark feature fabrication',
      'Experience with multi-unit residential and mixed-use',
    ],
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    cta: { label: 'Discuss Your Project', href: '/contact' },
  },
  {
    id: 'architects',
    title: 'Architects & Designers',
    tagline: 'We speak your language.',
    description:
      "Bring us your drawings. We work from CAD files, shop drawings, and hand sketches alike. CNC laser cutting lets us execute complex pattern work with precision you won't find at a standard fab shop. We understand material behavior, finishing options, and the difference between what looks good in a rendering and what works in the field.",
    bullets: [
      'Works directly from CAD and shop drawings',
      'CNC laser cutting for complex pattern work',
      'Corten, stainless, aluminum, and mild steel',
      'Finishing: powder coat, patina, galvanize, raw',
    ],
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    cta: { label: 'Submit Drawings', href: '/contact' },
  },
];

export default function WhoWeWorkWith() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      className="w-full py-20 md:py-28 px-4 bg-gradient-to-b from-black via-gray-950 to-black relative overflow-hidden"
    >
      {/* Background accent */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-accent-red rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-accent-red rounded-full blur-3xl -translate-y-1/2" />
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-px bg-white/30 mr-4" />
            <span className="text-white/60 uppercase text-xs tracking-[0.2em] font-light">
              WHO WE WORK WITH
            </span>
            <div className="w-16 h-px bg-white/30 ml-4" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white uppercase mb-4">
            WE SPEAK YOUR LANGUAGE
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Whoever you are, we've built something for someone like you — and we know what you actually care about.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {audiences.map((audience, index) => (
            <motion.div
              key={audience.id}
              className="group glass rounded-lg p-8 hover:border-accent-red/40 transition-all duration-300 flex flex-col"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.7, ease: [0.6, -0.05, 0.01, 0.99] as [number, number, number, number] }}
              whileHover={{ y: -4 }}
            >
              {/* Icon + Title */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-accent-red/15 rounded-lg flex items-center justify-center text-accent-red flex-shrink-0 group-hover:bg-accent-red/25 transition-colors">
                  {audience.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-wide leading-tight">
                    {audience.title}
                  </h3>
                  <p className="text-accent-red text-sm font-medium mt-0.5">{audience.tagline}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-white/70 text-sm leading-relaxed mb-5">
                {audience.description}
              </p>

              {/* Bullets */}
              <ul className="space-y-2 mb-6 flex-1">
                {audience.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2 text-white/60 text-sm">
                    <span className="w-1.5 h-1.5 bg-accent-red rounded-full mt-1.5 flex-shrink-0" />
                    {bullet}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={audience.cta.href}
                className="text-white/50 hover:text-accent-red uppercase text-xs tracking-[0.15em] transition-colors inline-flex items-center gap-2 mt-auto w-fit"
              >
                {audience.cta.label}
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
