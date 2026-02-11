'use client';

import Image from 'next/image';

export default function AboutHero() {
  return (
    <section
      id="about-hero"
      className="relative w-full min-h-[70vh] md:min-h-[80vh] flex items-end overflow-hidden"
      aria-label="About Yeti Welding"
    >
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/about/dome_about_hero.jpg"
          alt="Yeti Welding team members working together in the shop"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={90}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Hero Copy */}
      <div className="relative z-10 w-full">
        <div className="container mx-auto max-w-7xl px-4 pb-10 md:pb-14">
          <h1 className="text-white uppercase font-bold text-4xl md:text-6xl lg:text-7xl tracking-tight">
            THE WAY OF THE YETI
          </h1>
          <p className="mt-4 text-white/80 text-base md:text-lg max-w-2xl leading-relaxed">
            Quality. Integrity. Craftsmanship. The standard behind every weld we put
            our name on.
          </p>
        </div>
      </div>
    </section>
  );
}








