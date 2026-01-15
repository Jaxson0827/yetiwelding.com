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
          src="/homepage/team_photo.jpeg"
          alt="Yeti Welding team members working together, representing 40+ years of combined experience in metal fabrication and welding services"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={90}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </div>
    </section>
  );
}








