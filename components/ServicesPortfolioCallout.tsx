'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const portfolioItems = [
  {
    id: 'firefly',
    title: 'Firefly Entrance Arch',
    category: 'Monument & Landmark',
    image: '/projects/firefly-arch/gallery-01.JPG',
    href: '/projects/firefly-arch',
    stats: [
      { value: '46,500', label: 'CNC-laser-cut holes' },
      { value: '400', label: 'Labor hours' },
      { value: '3/16"', label: 'Corten plate' },
    ],
    featured: true,
  },
  {
    id: 'shade',
    title: 'Commercial Shade Structure',
    category: 'Shade Structures',
    image: '/projects/photo1.JPG',
    href: '/projects',
    featured: false,
  },
  {
    id: 'railing',
    title: 'Architectural Stair Railing',
    category: 'Railing Systems',
    image: '/projects/photo19.JPG',
    href: '/projects',
    featured: false,
  },
  {
    id: 'gate',
    title: 'Custom Entry Gate',
    category: 'Gates & Enclosures',
    image: '/projects/photo4.JPG',
    href: '/projects',
    featured: false,
  },
];

export default function ServicesPortfolioCallout() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const featured = portfolioItems.find(p => p.featured)!;
  const thumbnails = portfolioItems.filter(p => !p.featured);

  return (
    <section ref={sectionRef} className="w-full py-20 md:py-28 px-4 bg-black">
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-px bg-white/30 mr-4" />
            <span className="text-white/60 uppercase text-xs tracking-[0.2em] font-light">
              FROM OUR PORTFOLIO
            </span>
            <div className="w-16 h-px bg-white/30 ml-4" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white uppercase mb-4">
            WORK THAT SPEAKS
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Every project is a problem solved. Here's what that looks like.
          </p>
        </motion.div>

        {/* Grid: featured left, thumbnails right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Featured Card — Firefly Arch */}
          <motion.div
            className="group relative overflow-hidden rounded-lg"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] as [number, number, number, number] }}
          >
            <div className="relative h-[480px] lg:h-full min-h-[480px] overflow-hidden">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
            </div>

            {/* Content overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
              <p className="text-accent-red uppercase text-xs tracking-[0.2em] font-semibold mb-2">
                {featured.category}
              </p>
              <h3 className="text-3xl md:text-4xl font-bold text-white uppercase mb-4 leading-tight">
                {featured.title}
              </h3>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {featured.stats?.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-bold text-accent-red leading-none mb-1">{stat.value}</p>
                    <p className="text-white/60 text-xs uppercase tracking-wide leading-tight">{stat.label}</p>
                  </div>
                ))}
              </div>

              <Link
                href={featured.href}
                className="group/btn relative inline-flex items-center justify-center px-8 py-3 border border-white/40 bg-white/10 backdrop-blur-sm text-white uppercase text-xs font-semibold tracking-[0.15em] hover:bg-white hover:text-black transition-all duration-300 w-fit"
              >
                VIEW FULL CASE STUDY
              </Link>
            </div>
          </motion.div>

          {/* Thumbnail Column */}
          <div className="flex flex-col gap-6">
            {thumbnails.map((item, index) => (
              <motion.div
                key={item.id}
                className="group relative overflow-hidden rounded-lg flex-1"
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.1 + index * 0.1, duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] as [number, number, number, number] }}
              >
                <div className="relative h-[140px] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20 group-hover:from-black/50 transition-all duration-500" />
                </div>

                <div className="absolute inset-0 flex flex-col justify-center px-6">
                  <p className="text-accent-red uppercase text-[10px] tracking-[0.2em] font-semibold mb-1">
                    {item.category}
                  </p>
                  <h4 className="text-white font-bold uppercase text-sm leading-tight">{item.title}</h4>
                </div>

                <Link href={item.href} className="absolute inset-0" aria-label={`View ${item.title}`} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer link */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Link
            href="/projects"
            className="text-white/50 hover:text-white uppercase text-xs tracking-[0.2em] transition-colors inline-flex items-center gap-2"
          >
            View all projects
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
