'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image, { type StaticImageData } from 'next/image';
import photoAngle from '@/public/projects/photo35.jpg';
import photoLong from '@/public/projects/photo6.jpg';

// photo3/photo4 have uppercase .JPG extensions, which Next's static image imports don't type; use paths.
const photoClosed = '/projects/photo3.JPG';
const photoStone = '/projects/photo4.JPG';

type Slide = {
  src: StaticImageData | string;
  alt: string;
  title: string;
  detail: string;
};

/** Real installs only. Order = best photo first. */
const SLIDES: Slide[] = [
  {
    src: photoAngle,
    alt: 'Black double-swing steel gate with ribbed panels and strap hinges on a split-face block enclosure at an apartment building',
    title: 'Split-face block enclosure',
    detail: 'Apartment complex. Strap hinges on steel posts and a drop rod on each leaf.',
  },
  {
    src: photoClosed,
    alt: 'Closed double-swing steel gate between stone-capped walls, with center latch and drop rods',
    title: 'Closed and latched',
    detail: 'Ribbed steel panels hide the bins. Center latch and drop rods hold it shut.',
  },
  {
    src: photoStone,
    alt: 'Double-swing steel gate with ribbed panels, strap hinges and drop rods, between stone-veneer walls',
    title: 'Stacked-stone enclosure',
    detail: 'Steel posts set in front of stone-veneer walls.',
  },
  {
    src: photoLong,
    alt: 'Long double-swing steel gate across a wide block trash enclosure',
    title: 'Wide enclosure',
    detail: 'A long pair of leaves across a wide block enclosure.',
  },
];

const pad = (n: number) => String(n).padStart(2, '0');

function Arrow({ dir }: { dir: 'prev' | 'next' }) {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true">
      <path
        d={dir === 'prev' ? 'M12.5 4 6.5 10l6 6' : 'M7.5 4l6 6-6 6'}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="square"
      />
    </svg>
  );
}

export default function GateGallery() {
  const trackRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // Slides after the first load once the gallery is near the screen (not on page load, and not
  // lazily mid-swipe, which would flash an empty frame).
  const [primed, setPrimed] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setPrimed(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setPrimed(true);
          io.disconnect();
        }
      },
      { rootMargin: '800px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // While a button/thumbnail scroll is animating, hold the active slide at its target so the
  // counter doesn't flick through the slides it passes.
  const targetRef = useRef<number | null>(null);
  const targetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Track position -> active slide (covers swipes and trackpads).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const w = Math.max(1, track.clientWidth);
        const target = targetRef.current;
        if (target !== null) {
          if (Math.abs(track.scrollLeft - target * w) > 2) return;
          targetRef.current = null;
        }
        const i = Math.round(track.scrollLeft / w);
        setActive(Math.min(SLIDES.length - 1, Math.max(0, i)));
      });
    };
    // A swipe or wheel takes over from any button scroll in progress.
    const release = () => {
      targetRef.current = null;
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    track.addEventListener('pointerdown', release, { passive: true });
    track.addEventListener('wheel', release, { passive: true });
    return () => {
      track.removeEventListener('scroll', onScroll);
      track.removeEventListener('pointerdown', release);
      track.removeEventListener('wheel', release);
      cancelAnimationFrame(frame);
      clearTimeout(targetTimer.current);
    };
  }, []);

  const goTo = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const n = (i + SLIDES.length) % SLIDES.length;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    targetRef.current = n;
    clearTimeout(targetTimer.current);
    targetTimer.current = setTimeout(() => {
      targetRef.current = null;
    }, 1500);
    track.scrollTo({ left: n * track.clientWidth, behavior: reduce ? 'auto' : 'smooth' });
    setActive(n);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo(active + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo(active - 1);
    }
  };

  const current = SLIDES[active];

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Photos of gates we've built"
      className="grid gap-5 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] lg:gap-8"
    >
      {/* Main photo */}
      <div className="relative border border-gate-rule bg-gate-plate">
        <div
          ref={trackRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          aria-label="Gate photos. Use the arrow keys to change photos."
          className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-red [&::-webkit-scrollbar]:hidden"
        >
          {SLIDES.map((s, i) => (
            <div
              key={s.title}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${SLIDES.length}`}
              className="relative aspect-[4/3] w-full shrink-0 snap-center snap-always"
            >
              {(i === 0 || primed) && (
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  loading={i === 0 ? 'lazy' : 'eager'}
                  placeholder={typeof s.src === 'string' ? 'empty' : 'blur'}
                  sizes="(min-width: 1024px) 760px, 100vw"
                  className="object-cover"
                  draggable={false}
                />
              )}
            </div>
          ))}
        </div>

        {/* Counter */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 bg-black/75 px-3 py-1.5 font-drafting text-xs tracking-[0.08em] text-white"
        >
          {pad(active + 1)} <span className="text-white/45">/ {pad(SLIDES.length)}</span>
        </div>

        {/* Prev / next */}
        <div className="absolute bottom-0 right-0 flex">
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            aria-label="Previous photo"
            className="flex h-11 w-11 items-center justify-center bg-black/80 text-white transition-colors hover:bg-accent-red focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white"
          >
            <Arrow dir="prev" />
          </button>
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            aria-label="Next photo"
            className="flex h-11 w-11 items-center justify-center border-l border-white/15 bg-black/80 text-white transition-colors hover:bg-accent-red focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white"
          >
            <Arrow dir="next" />
          </button>
        </div>
      </div>

      {/* Caption + thumbnails */}
      <div className="flex flex-col gap-5">
        <div aria-live="polite" className="min-h-[5.5rem] border-t border-white/70 pt-4">
          <p className="font-drafting text-xs font-bold tracking-[0.08em] text-accent-red">
            PHOTO {pad(active + 1)}
          </p>
          <h3 className="mt-1.5 text-lg font-semibold text-white">{current.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-gate-mute">{current.detail}</p>
        </div>

        <div className="grid grid-cols-4 gap-2 lg:grid-cols-2">
          {SLIDES.map((s, i) => {
            const on = i === active;
            return (
              <button
                key={s.title}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show photo ${i + 1}: ${s.title}`}
                aria-current={on ? 'true' : undefined}
                className={`relative aspect-[4/3] overflow-hidden bg-gate-plate outline outline-2 transition focus-visible:outline-white ${
                  on ? 'outline-accent-red' : 'opacity-55 outline-transparent hover:opacity-100'
                }`}
              >
                <Image
                  src={s.src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 180px, 25vw"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
