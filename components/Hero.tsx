import Image from 'next/image';

export default function Hero() {
  const heroPath = '/homepage/hero.JPG';

  return (
    <section className="relative w-full min-h-[75vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={heroPath}
          alt="Yeti Welding professional metal fabrication workshop in Springville, Utah, showcasing skilled welders creating custom steel structures and ornamental metalwork"
          fill
          className="object-cover"
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={72}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-black/35" />
        <div className="absolute inset-x-0 top-1/2 h-80 -translate-y-1/2 bg-black/35 blur-3xl" />
      </div>

      <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
        <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-black/35 px-6 py-10 backdrop-blur-sm md:px-10 md:py-12">
          <p className="text-base md:text-lg mb-6 uppercase tracking-[0.2em] font-light text-white">
            WELCOME TO
          </p>

          <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-8 uppercase tracking-tight leading-none text-shadow-strong">
            YETI WELDING
          </h1>

          <p className="mx-auto max-w-3xl text-lg md:text-xl text-white/90 leading-relaxed mb-10">
            Professional welding and fabrication built with the speed, precision, and craftsmanship your project demands.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-10 py-4 bg-accent-red text-white uppercase text-sm font-semibold tracking-[0.15em] rounded-lg shadow-glow-red transition-transform duration-200 hover:scale-[1.02] hover:bg-[#B01030]"
            >
              GET QUOTE
            </a>

            <a
              href="/projects"
              className="inline-flex items-center justify-center px-10 py-4 border-2 border-white/80 bg-black/45 text-white uppercase text-sm font-semibold tracking-[0.15em] rounded-lg backdrop-blur-sm transition-colors duration-200 hover:border-white hover:bg-black/60"
            >
              VIEW PROJECTS
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

