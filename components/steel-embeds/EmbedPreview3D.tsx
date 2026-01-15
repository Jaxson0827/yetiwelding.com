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
  glbUrl: string | null;
  previewStatus: 'loading' | 'available' | 'unavailable' | 'none';
  spec?: Partial<EmbedSpec>;
}

export default function EmbedPreview3D({ glbUrl, previewStatus, spec }: EmbedPreview3DProps) {
  // STRICT CHECK: Verify ALL THREE plate dimensions are defined and > 0
  const hasValidSpec =
    spec?.plate?.length &&
    spec?.plate?.width &&
    spec?.plate?.thickness &&
    spec.plate.length > 0 &&
    spec.plate.width > 0 &&
    spec.plate.thickness > 0;

  // Priority: GLB URL takes precedence if available
  // Show uploaded model preview (highest priority)
  if (glbUrl && previewStatus === 'available') {
    return (
      <div className="w-full bg-gradient-to-br from-black via-gray-900 to-black rounded-lg overflow-hidden relative" style={{ height: '100%', minHeight: '500px', flex: '1 1 0%' }}>
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-white/40 text-sm">Loading 3D model...</div>
          </div>
        }>
          <PreviewCanvas glbUrl={glbUrl} spec={spec} />
        </Suspense>
        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <div className="bg-black/60 backdrop-blur-sm rounded px-3 py-2">
            <p className="text-white/80 text-xs text-center font-semibold">
              3D Model Preview
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

  if (previewStatus === 'loading') {
    return (
      <div className="w-full h-full min-h-[500px] bg-gradient-to-br from-black via-gray-900 to-black rounded-lg overflow-hidden relative flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-white/20 border-t-[#DC143C] rounded-full animate-spin mx-auto"></div>
          <p className="text-white/60 text-sm">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (previewStatus === 'unavailable') {
    // If file preview is unavailable but we have valid spec, show spec-based preview
    if (hasValidSpec && spec) {
      return (
        <div className="w-full bg-gradient-to-br from-black via-gray-900 to-black rounded-lg overflow-hidden relative" style={{ height: '100%', minHeight: '500px', flex: '1 1 0%' }}>
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-white/40 text-sm">Loading 3D preview...</div>
            </div>
          }>
            <PreviewCanvas spec={spec} glbUrl={null} />
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

    return (
      <div className="w-full h-full min-h-[500px] bg-gradient-to-br from-black via-gray-900 to-black rounded-lg overflow-hidden relative flex items-center justify-center border border-yellow-500/30">
        <div className="text-center space-y-2 max-w-md px-4">
          <svg className="w-12 h-12 text-yellow-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-white font-medium">Preview unavailable</p>
          <p className="text-white/60 text-sm">Configure dimensions to generate preview</p>
          <p className="text-white/40 text-xs mt-2">
            You can still proceed with your order. Preview is for visualization only.
          </p>
        </div>
      </div>
    );
  }

  // Show spec-based preview if valid spec exists (even when previewStatus === 'none')
  if (hasValidSpec && spec) {
    return (
      <div className="w-full bg-gradient-to-br from-black via-gray-900 to-black rounded-lg overflow-hidden relative" style={{ height: '100%', minHeight: '500px', flex: '1 1 0%' }}>
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-white/40 text-sm">Loading 3D preview...</div>
          </div>
        }>
          <PreviewCanvas spec={spec} glbUrl={null} />
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

  // Show "none" state when no valid spec
  if (previewStatus === 'none' && !hasValidSpec) {
    return (
      <div className="w-full h-full min-h-[500px] bg-gradient-to-br from-black via-gray-900 to-black rounded-lg overflow-hidden relative flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-white/60 text-sm">Configure dimensions to see preview</p>
        </div>
      </div>
    );
  }

  return null;
}


