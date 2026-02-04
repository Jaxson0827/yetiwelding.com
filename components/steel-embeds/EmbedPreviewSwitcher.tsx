'use client';

import Image from 'next/image';
import React, { useMemo, useState } from 'react';
import EmbedPreview3D from './EmbedPreview3D';
import type { EmbedSpec } from '@/lib/steelEmbeds/types';
import type { PreviewViewState } from './PreviewCanvas';

type PreviewMode = '3d' | 'photos';

const PHOTO_SOURCES = [
  { src: '/uploads/steel-embeds/embed_1.png', alt: 'Steel embed photo 1' },
  { src: '/uploads/steel-embeds/embed_2.png', alt: 'Steel embed photo 2' },
  { src: '/uploads/steel-embeds/embed_3.png', alt: 'Steel embed photo 3' },
] as const;

export default function EmbedPreviewSwitcher({ spec }: { spec: Partial<EmbedSpec> }) {
  const [mode, setMode] = useState<PreviewMode>('3d');
  const [activeSrc, setActiveSrc] = useState<(typeof PHOTO_SOURCES)[number]['src']>(PHOTO_SOURCES[0].src);
  const [viewState, setViewState] = useState<PreviewViewState | null>(null);

  const active = useMemo(() => PHOTO_SOURCES.find((p) => p.src === activeSrc) ?? PHOTO_SOURCES[0], [activeSrc]);

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-white font-semibold uppercase tracking-wider text-sm">Preview</h3>

        <div className="inline-flex rounded-lg border border-white/15 bg-white/5 p-1">
          <button
            type="button"
            onClick={() => setMode('3d')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              mode === '3d' ? 'bg-[#DC143C] text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
            aria-pressed={mode === '3d'}
          >
            3D
          </button>
          <button
            type="button"
            onClick={() => setMode('photos')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              mode === 'photos' ? 'bg-[#DC143C] text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
            aria-pressed={mode === 'photos'}
          >
            Photos
          </button>
        </div>
      </div>

      <div className="w-full">
        <div className="relative h-[320px] sm:h-[400px] lg:h-[520px]">
          {/* Keep 3D mounted at all times so it doesn't reset */}
          <div className="absolute inset-0">
            <EmbedPreview3D
              glbUrl={null}
              previewStatus="none"
              spec={spec}
              viewState={viewState}
              onViewStateChange={setViewState}
            />
          </div>

          {/* Photo layer overlays 3D when selected */}
          <div
            className={`absolute inset-0 transition-opacity ${
              mode === 'photos' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            aria-hidden={mode !== 'photos'}
          >
            <div className="w-full h-full rounded-xl overflow-hidden relative border border-white/10 bg-gradient-to-br from-[#0b0b0c] via-[#101013] to-black shadow-[0_12px_40px_rgba(0,0,0,0.55)]">
            <Image
              src={active.src}
              alt={active.alt}
              fill
              className="object-contain"
              sizes="(min-width: 1024px) 55vw, 100vw"
              priority={false}
            />
          </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {PHOTO_SOURCES.map((p) => {
          const isActive = p.src === active.src;
          return (
            <button
              key={p.src}
              type="button"
              onClick={() => {
                setActiveSrc(p.src);
                setMode('photos');
              }}
              className={`relative w-[72px] h-[54px] rounded-md overflow-hidden border transition-colors ${
                isActive && mode === 'photos'
                  ? 'border-[#DC143C]/70 ring-1 ring-[#DC143C]/25'
                  : 'border-white/15 hover:border-white/30'
              }`}
              aria-label={`View photo: ${p.alt}`}
            >
              <Image src={p.src} alt={p.alt} fill className="object-cover" sizes="72px" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

