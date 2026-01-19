'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Three.js components to avoid SSR issues
const PreviewCanvas = dynamic(() => import('./PreviewCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] bg-gradient-to-br from-black via-gray-900 to-black rounded-lg overflow-hidden relative flex items-center justify-center">
      <div className="text-white/40 text-sm">Loading 3D preview...</div>
    </div>
  ),
});

import { EmbedSpec } from '@/lib/steelEmbeds/types';

interface EmbedPreview3DProps {
  spec?: Partial<EmbedSpec>;
}

export default function EmbedPreview3D({ spec }: EmbedPreview3DProps) {
  // STRICT CHECK: Verify ALL THREE plate dimensions are defined and > 0
  const hasValidSpec =
    spec?.plate?.length &&
    spec?.plate?.width &&
    spec?.plate?.thickness &&
    spec.plate.length > 0 &&
    spec.plate.width > 0 &&
    spec.plate.thickness > 0;

  // Show spec-based preview if valid spec exists
  if (hasValidSpec && spec) {
    return (
      <div className="w-full bg-gradient-to-br from-black via-gray-900 to-black rounded-lg overflow-hidden relative" style={{ height: '100%', minHeight: '500px', flex: '1 1 0%' }}>
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-white/40 text-sm">Loading 3D preview...</div>
          </div>
        }>
          <PreviewCanvas spec={spec} />
        </Suspense>
        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <div className="bg-black/60 backdrop-blur-sm rounded px-3 py-2">
            <p className="text-white/80 text-xs text-center font-semibold">
              Configured Preview
            </p>
          </div>
          <div className="bg-black/60 backdrop-blur-sm rounded px-3 py-2">
            <p className="text-white/70 text-xs text-center">
              Preview is representative. Final layout per approved drawings.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Default: no valid spec yet
  return (
    <div className="w-full h-full min-h-[500px] bg-gradient-to-br from-black via-gray-900 to-black rounded-lg overflow-hidden relative flex items-center justify-center">
      <div className="text-center space-y-2">
        <p className="text-white/60 text-sm">Configure dimensions to see preview</p>
      </div>
    </div>
  );
}


