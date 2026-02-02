'use client';

import React from 'react';

export type PreviewControlsApi = {
  reset: () => void;
  fit: () => void;
  viewTop: () => void;
  viewIso: () => void;
};

export default function PreviewControlsOverlay({
  api,
  disabled,
}: {
  api: PreviewControlsApi | null;
  disabled?: boolean;
}) {
  const isDisabled = disabled || !api;

  const btnBase =
    'px-2.5 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider ' +
    'border border-white/15 bg-black/35 backdrop-blur-md text-white/80 ' +
    'hover:bg-black/55 hover:text-white transition-colors ' +
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-black/35 disabled:hover:text-white/80';

  return (
    <div className="pointer-events-none absolute inset-0">
      {/* Top-right controls */}
      <div className="pointer-events-auto absolute top-3 right-3 flex items-center gap-2">
        <button type="button" className={btnBase} onClick={() => api?.viewTop()} disabled={isDisabled} title="Top view">
          Top
        </button>
        <button type="button" className={btnBase} onClick={() => api?.viewIso()} disabled={isDisabled} title="Isometric view">
          Iso
        </button>
        <div className="w-px h-6 bg-white/10 mx-1" />
        <button type="button" className={btnBase} onClick={() => api?.fit()} disabled={isDisabled} title="Fit to model">
          Fit
        </button>
        <button type="button" className={btnBase} onClick={() => api?.reset()} disabled={isDisabled} title="Reset view">
          Reset
        </button>
      </div>

      {/* Bottom-left hint */}
      <div className="pointer-events-none absolute bottom-3 left-3">
        <div className="px-3 py-2 rounded-md bg-black/35 backdrop-blur-md border border-white/10 text-[11px] text-white/70">
          Drag to rotate • Scroll to zoom
        </div>
      </div>
    </div>
  );
}

