'use client';

import Image from 'next/image';

export default function AboutHero() {
  return (
    <section
      id="about-hero"
      className="relative w-full min-h-[70vh] md:min-h-[80vh] flex items-center overflow-hidden"
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
        {/* Overlays for contrast */}
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
      </div>

      {/* Hero Copy */}
      <div className="relative z-10 w-full">
        <div className="container mx-auto max-w-7xl px-4 py-14 md:py-20 text-center">
          <h1 className="text-white uppercase font-bold text-4xl md:text-6xl lg:text-7xl tracking-[0.06em] drop-shadow-[0_10px_30px_rgba(0,0,0,0.55)]">
            THE WAY OF THE YETI
          </h1>
          <div className="mx-auto mt-5 h-px w-24 bg-white/40" />
          <p className="mx-auto mt-5 text-white/85 text-base md:text-lg max-w-xl leading-relaxed drop-shadow-[0_6px_18px_rgba(0,0,0,0.55)]">
            Quality. Integrity. Craftsmanship. The standard behind every weld we put
            our name on.
          </p>
        </div>
      </div>
    </section>
  );
}








