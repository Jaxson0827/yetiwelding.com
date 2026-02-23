'use client';

import React from 'react';

interface StudPosition {
  x: number;
  y: number;
  diameter: number;
}

interface Embed2DDiagramProps {
  plateLength: number;
  plateWidth: number;
  studs?: StudPosition[];
  dimensionA: number;
  dimensionB?: number;
  showDimensionB: boolean;
}

export default function Embed2DDiagram({
  plateLength,
  plateWidth,
  studs = [],
  dimensionA,
  dimensionB = 0,
  showDimensionB,
}: Embed2DDiagramProps) {
  const halfL = plateLength / 2;
  const halfW = plateWidth / 2;
  const padding = 2.5;
  const viewMinX = -halfL - padding;
  const viewMinY = -halfW - padding;
  const viewW = plateLength + padding * 2;
  const viewH = plateWidth + padding * 2;

  const leftEdge = -halfL;
  const bottomEdge = -halfW;
  const leftStudX = -halfL + dimensionA;
  const bottomStudY = -halfW + dimensionB;

  return (
    <svg
      viewBox={`${viewMinX} ${viewMinY} ${viewW} ${viewH}`}
      className="w-full max-w-[280px] h-40 text-white"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Plate rectangle */}
      <rect
        x={-halfL}
        y={-halfW}
        width={plateLength}
        height={plateWidth}
        fill="rgba(80,80,80,0.4)"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="0.25"
      />

      {/* Dimension A line (horizontal, from left edge to left stud column) */}
      <g stroke="rgba(255,255,255,0.7)" strokeWidth="0.15">
        <line x1={leftEdge} y1={0} x2={leftStudX} y2={0} />
        <line x1={leftEdge} y1={-0.3} x2={leftEdge} y2={0.3} />
        <line x1={leftStudX} y1={-0.3} x2={leftStudX} y2={0.3} />
      </g>
      <text
        x={(leftEdge + leftStudX) / 2}
        y={-0.8}
        textAnchor="middle"
        fill="rgba(255,255,255,0.9)"
        fontSize="1.2"
        fontWeight="bold"
      >
        A
      </text>

      {/* Dimension B line (vertical, from bottom edge to bottom stud row) - 4-stud only */}
      {showDimensionB && (
        <>
          <g stroke="rgba(255,255,255,0.7)" strokeWidth="0.15">
            <line x1={0} y1={bottomEdge} x2={0} y2={bottomStudY} />
            <line x1={-0.3} y1={bottomEdge} x2={0.3} y2={bottomEdge} />
            <line x1={-0.3} y1={bottomStudY} x2={0.3} y2={bottomStudY} />
          </g>
          <text
            x={-0.8}
            y={(bottomEdge + bottomStudY) / 2}
            textAnchor="middle"
            fill="rgba(255,255,255,0.9)"
            fontSize="1.2"
            fontWeight="bold"
            transform={`rotate(-90, -0.8, ${(bottomEdge + bottomStudY) / 2})`}
          >
            B
          </text>
        </>
      )}

      {/* Studs */}
      {studs.map((stud, i) => (
        <circle
          key={i}
          cx={stud.x}
          cy={stud.y}
          r={Math.max(stud.diameter / 2, 0.2)}
          fill="rgba(220,20,60,0.85)"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="0.15"
        />
      ))}
    </svg>
  );
}
