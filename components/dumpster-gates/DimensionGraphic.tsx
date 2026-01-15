'use client';

import Image from 'next/image';
import { DimensionDisplay, GateStyle } from '@/lib/dumpsterGates/types';
import EditableDimensionLabel from './EditableDimensionLabel';

interface DimensionGraphicProps {
  dimensions: DimensionDisplay;
  style: GateStyle;
  onWidthChange?: (value: string) => void;
  onHeightChange?: (value: string) => void;
  widthError?: string;
  heightError?: string;
}

export default function DimensionGraphic({
  dimensions,
  style,
  onWidthChange,
  onHeightChange,
  widthError,
  heightError,
}: DimensionGraphicProps) {
  const isDoubleSwing = style === 'double-swing';
  const isSingleSwingLeft = style === 'single-swing-left';
  const isSingleSwingRight = style === 'single-swing-right';

  return (
    <div className="w-full">
      <div className="relative w-full max-w-2xl mx-auto aspect-[4/3] bg-white rounded-lg overflow-hidden border border-gray-300">
        {/* Background Image */}
        <Image
          src="/dumpster-gate-elevation.png"
          alt="Dumpster gate elevation drawing"
          fill
          className="object-contain"
          priority
        />

        {/* Dimension Overlays */}
        {/* Overall Width - Top Center */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          {onWidthChange ? (
            <EditableDimensionLabel
              value={dimensions.overallWidth}
              onChange={onWidthChange}
              error={widthError}
            />
          ) : (
            <span className="font-mono tracking-tight text-gray-900 text-lg font-semibold bg-white/90 px-2 py-1 rounded border border-gray-300 shadow-sm">
              {dimensions.overallWidth}
            </span>
          )}
        </div>

        {/* Overall Height - Right Side */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          {onHeightChange ? (
            <EditableDimensionLabel
              value={dimensions.overallHeight}
              onChange={onHeightChange}
              error={heightError}
            />
          ) : (
            <span className="font-mono tracking-tight text-gray-900 text-lg font-semibold bg-white/90 px-2 py-1 rounded border border-gray-300 shadow-sm">
              {dimensions.overallHeight}
            </span>
          )}
        </div>

        {/* Left Leaf Width - Top Left of Left Panel (show for double swing or single swing left) */}
        {(isDoubleSwing || isSingleSwingLeft) && (
          <div className="absolute top-[20%] left-[25%] transform -translate-x-1/2">
            <span className="font-mono tracking-tight text-gray-900 text-sm font-semibold bg-white/90 px-2 py-1 rounded border border-gray-300 shadow-sm">
              {dimensions.leafWidth}
            </span>
          </div>
        )}

        {/* Right Leaf Width - Top Right of Right Panel (show for double swing or single swing right) */}
        {(isDoubleSwing || isSingleSwingRight) && (
          <div className="absolute top-[20%] right-[25%] transform translate-x-1/2">
            <span className="font-mono tracking-tight text-gray-900 text-sm font-semibold bg-white/90 px-2 py-1 rounded border border-gray-300 shadow-sm">
              {dimensions.leafWidth}
            </span>
          </div>
        )}

        {/* Ground Clearance - Bottom Center */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <span className="font-mono tracking-tight text-gray-900 text-sm font-semibold bg-white/90 px-2 py-1 rounded border border-gray-300 shadow-sm">
            {dimensions.groundClearance}
          </span>
        </div>
      </div>
      
      {/* Caption */}
      <p className="text-white/60 text-sm text-center mt-4">
        Illustration for reference. Dimensions shown reflect selected configuration.
      </p>
    </div>
  );
}

