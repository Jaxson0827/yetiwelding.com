'use client';

interface Props {
  title: string;
  subtitle?: string;
  image: string;
  height?: string;
}

export default function EditorialHero({ title, subtitle, image, height = 'min-h-[380px]' }: Props) {
  return (
    <section className={`relative w-full overflow-hidden bg-black ${height}`}>
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <div className={`relative z-10 mx-auto flex w-full flex-col items-center justify-center px-4 py-16 text-center ${height}`}>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-xl text-sm text-white/80 md:text-base">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
