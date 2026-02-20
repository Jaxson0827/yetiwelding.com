'use client';

/**
 * Panel dimension diagrams for garden box steel panels.
 * Shows 4' side panel, 6' side panel, and 18" end panel.
 * Scroll-in animation when section enters viewport.
 */

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const PANEL_COLOR = '#9ca3af';
const DIM_COLOR = '#d1d5db';
const STROKE_WIDTH = 1.5;

function PanelSvg({
  width,
  height,
  label,
  dimW,
  dimH,
}: {
  width: number;
  height: number;
  label: string;
  dimW: string;
  dimH: string;
}) {
  const scale = 3;
  const w = width * scale;
  const h = height * scale;
  const pad = 24;
  const svgW = w + pad * 2;
  const svgH = h + pad * 2 + 20;

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="w-full max-w-[180px]"
        style={{ minHeight: 120 }}
      >
        {/* Panel rectangle */}
        <rect
          x={pad}
          y={pad}
          width={w}
          height={h}
          fill={PANEL_COLOR}
          fillOpacity={0.3}
          stroke={PANEL_COLOR}
          strokeWidth={STROKE_WIDTH}
        />
        {/* Width dimension line (top) */}
        <line x1={pad} y1={pad - 8} x2={pad + w} y2={pad - 8} stroke={DIM_COLOR} strokeWidth={1} />
        <line x1={pad} y1={pad - 4} x2={pad} y2={pad - 12} stroke={DIM_COLOR} strokeWidth={1} />
        <line x1={pad + w} y1={pad - 4} x2={pad + w} y2={pad - 12} stroke={DIM_COLOR} strokeWidth={1} />
        <text x={pad + w / 2} y={pad - 14} fill={DIM_COLOR} fontSize={10} textAnchor="middle" fontFamily="system-ui">
          {dimW}
        </text>
        {/* Height dimension line (left) */}
        <line x1={pad - 8} y1={pad} x2={pad - 8} y2={pad + h} stroke={DIM_COLOR} strokeWidth={1} />
        <line x1={pad - 4} y1={pad} x2={pad - 12} y2={pad} stroke={DIM_COLOR} strokeWidth={1} />
        <line x1={pad - 4} y1={pad + h} x2={pad - 12} y2={pad + h} stroke={DIM_COLOR} strokeWidth={1} />
        <text
          x={pad - 14}
          y={pad + h / 2}
          fill={DIM_COLOR}
          fontSize={10}
          textAnchor="middle"
          fontFamily="system-ui"
          transform={`rotate(-90, ${pad - 14}, ${pad + h / 2})`}
        >
          {dimH}
        </text>
      </svg>
      <span className="mt-2 text-xs text-white/80">{label}</span>
    </div>
  );
}

export default function GardenBoxPanelDiagrams() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, ease: [0.6, -0.05, 0.01, 0.99] }}
      className="mt-8 border border-white/10 rounded-lg p-4"
    >
      <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">
        Panel Dimensions
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        <PanelSvg width={48} height={18} label="4' side panel" dimW={'48"'} dimH={'18"'} />
        <PanelSvg width={72} height={18} label="6' side panel" dimW={'72"'} dimH={'18"'} />
        <PanelSvg width={24} height={18} label={'18" end panel'} dimW={'24"'} dimH={'18"'} />
      </div>
    </motion.div>
  );
}
