'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

const PreviewCanvas = dynamic(() => import('./PreviewCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[340px] rounded-xl overflow-hidden relative border border-black/10 bg-white flex items-center justify-center">
      <div className="w-[70%] max-w-md h-28 rounded-lg border border-white/10 bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:1000px_100%] animate-[shimmer_2.2s_infinite_linear]" />
    </div>
  ),
});

import { EmbedSpec } from '@/lib/steelEmbeds/types';
import type { PreviewViewState } from './PreviewCanvas';

interface EmbedPreview3DProps {
  glbUrl: string | null;
  previewStatus: 'loading' | 'available' | 'unavailable' | 'none';
  spec?: Partial<EmbedSpec>;
  viewState?: PreviewViewState | null;
  onViewStateChange?: (next: PreviewViewState) => void;
}

export default function EmbedPreview3D({ glbUrl, previewStatus, spec, viewState, onViewStateChange }: EmbedPreview3DProps) {
  const hasValidSpec =
    spec?.plate?.length &&
    spec?.plate?.width &&
    spec?.plate?.thickness &&
    spec.plate.length > 0 &&
    spec.plate.width > 0 &&
    spec.plate.thickness > 0;

  const hasGlbPreview = !!(glbUrl && previewStatus === 'available');
  const hasSpecPreview = !!(hasValidSpec && spec);
  const showCanvas = hasGlbPreview || hasSpecPreview;

  if (previewStatus === 'loading') {
    return (
      <div className="w-full h-full min-h-[340px] rounded-xl overflow-hidden relative border border-black/10 bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-[70%] max-w-md h-28 rounded-lg border border-white/10 bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:1000px_100%] animate-[shimmer_2.2s_infinite_linear]" />
          <p className="text-black/60 text-sm">Preparing 3D preview…</p>
        </div>
      </div>
    );
  }

  if (previewStatus === 'unavailable') {
    return (
      <div className="w-full h-full min-h-[340px] rounded-xl overflow-hidden relative border border-yellow-500/30 bg-white flex items-center justify-center">
        <div className="text-center space-y-2 max-w-md px-4">
          <svg className="w-12 h-12 text-yellow-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-black font-medium">Preview unavailable</p>
          <p className="text-black/60 text-sm">We couldn’t generate a preview for this configuration yet.</p>
          <p className="text-black/40 text-xs mt-2">
            You can still proceed with your order. Preview is for visualization only.
          </p>
        </div>
      </div>
    );
  }

  if (showCanvas) {
    return (
      <div className="w-full h-full min-h-[340px] rounded-xl overflow-hidden relative border border-black/10 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.55)]">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-[70%] max-w-md h-28 rounded-lg border border-white/10 bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:1000px_100%] animate-[shimmer_2.2s_infinite_linear]" />
            </div>
          }
        >
          <PreviewCanvas
            glbUrl={hasGlbPreview ? glbUrl : null}
            spec={spec}
            viewState={viewState}
            onViewStateChange={onViewStateChange}
          />
        </Suspense>

        {/* Single allowed button (disclaimer) */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-end">
          <button
            type="button"
            className="pointer-events-auto w-full sm:w-auto sm:max-w-[70%] text-left sm:text-right text-[11px] leading-snug text-black/70 bg-white/80 hover:bg-white/90 backdrop-blur-md border border-black/10 rounded-md px-3 py-2 transition-colors"
          >
            Preview is representative. Final layout per approved drawings.
          </button>
        </div>
      </div>
    );
  }

  if (previewStatus === 'none' && !hasValidSpec) {
    return (
      <div className="w-full h-full min-h-[340px] rounded-xl overflow-hidden relative border border-black/10 bg-white flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-black font-medium">3D preview</p>
          <p className="text-black/60 text-sm">Enter plate dimensions to generate a preview.</p>
        </div>
      </div>
    );
  }

  return null;
}


