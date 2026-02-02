'use client';

import React, { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import PreviewControlsOverlay, { type PreviewControlsApi } from './PreviewControlsOverlay';

const PreviewCanvas = dynamic(() => import('./PreviewCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[340px] rounded-xl overflow-hidden relative border border-white/10 bg-gradient-to-br from-[#0b0b0c] via-[#101013] to-black flex items-center justify-center">
      <div className="w-[70%] max-w-md h-28 rounded-lg border border-white/10 bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:1000px_100%] animate-[shimmer_2.2s_infinite_linear]" />
    </div>
  ),
});

import { EmbedSpec } from '@/lib/steelEmbeds/types';

interface EmbedPreview3DProps {
  glbUrl: string | null;
  previewStatus: 'loading' | 'available' | 'unavailable' | 'none';
  spec?: Partial<EmbedSpec>;
  highlightedStudIndex?: number | null;
  onStudHover?: (index: number | null) => void;
}

export default function EmbedPreview3D({ glbUrl, previewStatus, spec, highlightedStudIndex, onStudHover }: EmbedPreview3DProps) {
  const [previewApi, setPreviewApi] = useState<PreviewControlsApi | null>(null);
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
  const statusLabel =
    hasGlbPreview
      ? 'Model preview'
      : hasSpecPreview
      ? 'Configured preview'
      : previewStatus === 'loading'
      ? 'Loading'
      : previewStatus === 'unavailable'
      ? 'Preview unavailable'
      : 'Preview';

  if (previewStatus === 'loading') {
    return (
      <div className="w-full h-full min-h-[340px] rounded-xl overflow-hidden relative border border-white/10 bg-gradient-to-br from-[#0b0b0c] via-[#101013] to-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-[70%] max-w-md h-28 rounded-lg border border-white/10 bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:1000px_100%] animate-[shimmer_2.2s_infinite_linear]" />
          <p className="text-white/60 text-sm">Preparing 3D preview…</p>
        </div>
      </div>
    );
  }

  if (previewStatus === 'unavailable') {
    return (
      <div className="w-full h-full min-h-[340px] rounded-xl overflow-hidden relative border border-yellow-500/30 bg-gradient-to-br from-[#0b0b0c] via-[#101013] to-black flex items-center justify-center">
        <div className="text-center space-y-2 max-w-md px-4">
          <svg className="w-12 h-12 text-yellow-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-white font-medium">Preview unavailable</p>
          <p className="text-white/60 text-sm">We couldn’t generate a preview for this configuration yet.</p>
          <p className="text-white/40 text-xs mt-2">
            You can still proceed with your order. Preview is for visualization only.
          </p>
        </div>
      </div>
    );
  }

  if (showCanvas) {
    return (
      <div className="w-full h-full min-h-[340px] rounded-xl overflow-hidden relative border border-white/10 bg-gradient-to-br from-[#0b0b0c] via-[#101013] to-black shadow-[0_12px_40px_rgba(0,0,0,0.55)]">
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
            highlightedStudIndex={highlightedStudIndex}
            onStudHover={onStudHover}
            onApiReady={setPreviewApi}
          />
        </Suspense>

        <PreviewControlsOverlay api={previewApi} disabled={!hasSpecPreview && !hasGlbPreview} />

        {/* Status / disclaimer bar (non-interactive) */}
        <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-md bg-black/45 backdrop-blur-md border border-white/10 text-white/85 text-xs font-semibold uppercase tracking-wider">
              {statusLabel}
            </span>
            {highlightedStudIndex !== null && highlightedStudIndex !== undefined && (
              <span className="px-3 py-1.5 rounded-md bg-black/35 backdrop-blur-md border border-white/10 text-white/70 text-xs">
                Stud {highlightedStudIndex + 1}
              </span>
            )}
          </div>
          <div className="max-w-[60%] text-right text-[11px] leading-snug text-white/65 bg-black/30 backdrop-blur-md border border-white/10 rounded-md px-3 py-1.5">
            Preview is representative. Final layout per approved drawings.
          </div>
        </div>
      </div>
    );
  }

  if (previewStatus === 'none' && !hasValidSpec) {
    return (
      <div className="w-full h-full min-h-[340px] rounded-xl overflow-hidden relative border border-white/10 bg-gradient-to-br from-[#0b0b0c] via-[#101013] to-black flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-white font-medium">3D preview</p>
          <p className="text-white/60 text-sm">Enter plate dimensions to generate a preview.</p>
        </div>
      </div>
    );
  }

  return null;
}


