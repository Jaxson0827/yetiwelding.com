'use client';

import React, { useRef, useCallback, useState, useEffect } from 'react';

interface StudPosition {
  x: number;
  y: number;
  diameter: number;
  length: number;
  grade: 'A307' | 'A325';
}

interface DefaultStud {
  diameter: number;
  length: number;
  grade: 'A307' | 'A325';
}

interface CoordinateEditorProps {
  plateLength: number;
  plateWidth: number;
  studs: StudPosition[];
  defaultStud?: DefaultStud;
  onStudUpdate: (index: number, stud: StudPosition) => void;
  onStudAdd: (x: number, y: number) => void;
  onStudRemove: (index: number) => void;
  /** Add multiple studs at once (for snap presets). Parent adds each with default stud props. */
  onAddStudPositions?: (positions: Array<{ x: number; y: number }>) => void;
  onStudHover?: (index: number | null) => void;
  highlightedStudIndex?: number | null;
}

const EDGE_WARN_YELLOW = 1;   // inches - yellow ring
const EDGE_WARN_RED = 0.5;    // inches - red ring

export default function CoordinateEditor({
  plateLength,
  plateWidth,
  studs,
  defaultStud: _defaultStud,
  onStudUpdate,
  onStudAdd,
  onStudRemove,
  onAddStudPositions,
  onStudHover,
  highlightedStudIndex = null,
}: CoordinateEditorProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedStud, setSelectedStud] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showDimensions, setShowDimensions] = useState(true);
  const [showCenterlines, setShowCenterlines] = useState(true);
  const roundToTwoDecimals = useCallback((value: number) => {
    return Math.round(value * 100) / 100;
  }, []);

  // Min distance from stud center to plate edge (plate center at 0,0; edges at ±length/2, ±width/2)
  const minEdgeDistance = useCallback((x: number, y: number) => {
    const toLeft = x + plateLength / 2;
    const toRight = plateLength / 2 - x;
    const toTop = plateWidth / 2 - y;
    const toBottom = y + plateWidth / 2;
    return Math.min(toLeft, toRight, toTop, toBottom);
  }, [plateLength, plateWidth]);

  // Convert plate coordinates to SVG coordinates
  // Plate center is at (0, 0), SVG center is at (width/2, height/2)
  const plateToSvg = useCallback((x: number, y: number, svgWidth: number, svgHeight: number) => {
    const scaleX = svgWidth / (plateLength * 1.2); // Add 20% padding
    const scaleY = svgHeight / (plateWidth * 1.2);
    const scale = Math.min(scaleX, scaleY);
    
    const svgX = svgWidth / 2 + x * scale;
    const svgY = svgHeight / 2 - y * scale; // Flip Y axis (SVG Y increases downward)
    
    return { x: svgX, y: svgY, scale };
  }, [plateLength, plateWidth]);

  // Convert SVG coordinates to plate coordinates
  const svgToPlate = useCallback((svgX: number, svgY: number, svgWidth: number, svgHeight: number) => {
    const scaleX = svgWidth / (plateLength * 1.2);
    const scaleY = svgHeight / (plateWidth * 1.2);
    const scale = Math.min(scaleX, scaleY);
    
    const x = (svgX - svgWidth / 2) / scale;
    const y = (svgHeight / 2 - svgY) / scale; // Flip Y axis
    
    return { x, y };
  }, [plateLength, plateWidth]);

  const handleSvgClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = e.clientX - rect.left;
    const svgY = e.clientY - rect.top;
    const { x, y } = svgToPlate(svgX, svgY, rect.width, rect.height);
    
    // Check if click is within plate bounds
    if (Math.abs(x) <= plateLength / 2 && Math.abs(y) <= plateWidth / 2) {
      onStudAdd(roundToTwoDecimals(x), roundToTwoDecimals(y));
    }
  }, [svgToPlate, plateLength, plateWidth, onStudAdd, roundToTwoDecimals]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || selectedStud === null || !svgRef.current) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = e.clientX - rect.left;
    const svgY = e.clientY - rect.top;
    const { x, y } = svgToPlate(svgX, svgY, rect.width, rect.height);
    
    // Constrain to plate bounds
    const constrainedX = roundToTwoDecimals(
      Math.max(-plateLength / 2, Math.min(plateLength / 2, x))
    );
    const constrainedY = roundToTwoDecimals(
      Math.max(-plateWidth / 2, Math.min(plateWidth / 2, y))
    );
    
    const stud = studs[selectedStud];
    if (stud) {
      onStudUpdate(selectedStud, { ...stud, x: constrainedX, y: constrainedY });
    }
  }, [
    isDragging,
    selectedStud,
    svgToPlate,
    plateLength,
    plateWidth,
    studs,
    onStudUpdate,
    roundToTwoDecimals,
  ]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setSelectedStud(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleAddFourStudSquare = useCallback(() => {
    if (!onAddStudPositions) return;
    const spacing = 1; // 1" from center each way -> 2" between studs
    const positions = [
      { x: roundToTwoDecimals(-spacing), y: roundToTwoDecimals(spacing) },
      { x: roundToTwoDecimals(spacing), y: roundToTwoDecimals(spacing) },
      { x: roundToTwoDecimals(spacing), y: roundToTwoDecimals(-spacing) },
      { x: roundToTwoDecimals(-spacing), y: roundToTwoDecimals(-spacing) },
    ];
    onAddStudPositions(positions);
  }, [onAddStudPositions, roundToTwoDecimals]);

  const handleAddTwoStudInline = useCallback(() => {
    if (!onAddStudPositions) return;
    const spacing = 1;
    const positions = [
      { x: roundToTwoDecimals(-spacing), y: 0 },
      { x: roundToTwoDecimals(spacing), y: 0 },
    ];
    onAddStudPositions(positions);
  }, [onAddStudPositions, roundToTwoDecimals]);

  if (!plateLength || !plateWidth || plateLength <= 0 || plateWidth <= 0) {
    return (
      <div className="w-full h-64 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
        <p className="text-white/40 text-sm">Enter plate dimensions to view coordinate editor</p>
      </div>
    );
  }

  const svgWidth = 600;
  const svgHeight = 400;
  const { scale } = plateToSvg(0, 0, svgWidth, svgHeight);
  const plateSvgWidth = plateLength * scale;
  const plateSvgHeight = plateWidth * scale;
  const plateSvgX = svgWidth / 2 - plateSvgWidth / 2;
  const plateSvgY = svgHeight / 2 - plateSvgHeight / 2;

  return (
    <div className="w-full bg-white/5 rounded-lg border border-white/10 p-4">
      <div className="mb-3">
        <h4 className="text-white font-semibold mb-1">Visual Editor</h4>
        <p className="text-white/60 text-xs">
          Click on the plate to add a stud, or use snap presets. Drag studs to reposition.
        </p>
      </div>

      {/* Snap presets and toggles */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <span className="text-white/60 text-xs font-semibold uppercase tracking-wider">Add:</span>
        {onAddStudPositions && (
          <>
            <button
              type="button"
              onClick={handleAddFourStudSquare}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs rounded transition-colors"
            >
              4-stud square
            </button>
            <button
              type="button"
              onClick={handleAddTwoStudInline}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs rounded transition-colors"
            >
              2-stud inline
            </button>
          </>
        )}
        <span className="text-white/40 text-xs">|</span>
        <label className="flex items-center gap-2 text-white/80 text-xs cursor-pointer">
          <input
            type="checkbox"
            checked={showDimensions}
            onChange={(e) => setShowDimensions(e.target.checked)}
            className="rounded border-white/20"
          />
          Show dimensions
        </label>
        <label className="flex items-center gap-2 text-white/80 text-xs cursor-pointer">
          <input
            type="checkbox"
            checked={showCenterlines}
            onChange={(e) => setShowCenterlines(e.target.checked)}
            className="rounded border-white/20"
          />
          Show centerlines
        </label>
      </div>

      <div className="relative">
        <svg
          ref={svgRef}
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          onClick={handleSvgClick}
          className="w-full h-auto cursor-crosshair border border-white/20 rounded"
        >
          {/* Grid */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Plate outline */}
          <rect
            x={plateSvgX}
            y={plateSvgY}
            width={plateSvgWidth}
            height={plateSvgHeight}
            fill="rgba(128, 128, 128, 0.2)"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="2"
          />

          {/* Plate dimension labels */}
          {showDimensions && (
            <g>
              <text x={svgWidth / 2} y={plateSvgY - 8} fill="rgba(255,255,255,0.5)" fontSize="9" textAnchor="middle" fontFamily="monospace">{plateLength}"</text>
              <text x={plateSvgX + plateSvgWidth + 16} y={svgHeight / 2} fill="rgba(255,255,255,0.5)" fontSize="9" textAnchor="middle" fontFamily="monospace">{plateWidth}"</text>
            </g>
          )}

          {/* Center lines — only when toggle on */}
          {showCenterlines && (
            <>
              <line x1={svgWidth / 2} y1={0} x2={svgWidth / 2} y2={svgHeight} stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" strokeDasharray="4 4" />
              <line x1={0} y1={svgHeight / 2} x2={svgWidth} y2={svgHeight / 2} stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx={svgWidth / 2} cy={svgHeight / 2} r="3" fill="rgba(255, 255, 255, 0.5)" />
              <text x={svgWidth / 2 + 8} y={svgHeight / 2 - 8} fill="rgba(255, 255, 255, 0.5)" fontSize="9" fontFamily="monospace">(0, 0)</text>
            </>
          )}

          {/* Studs */}
          {studs.map((stud, index) => {
            const { x: svgX, y: svgY } = plateToSvg(stud.x, stud.y, svgWidth, svgHeight);
            const radius = (stud.diameter / 2) * scale;
            const displayRadius = Math.max(radius, 8);
            const isSelected = selectedStud === index;
            const isHighlighted = highlightedStudIndex === index;
            const edgeDist = minEdgeDistance(stud.x, stud.y);
            const ringColor = edgeDist < EDGE_WARN_RED ? '#ef4444' : edgeDist < EDGE_WARN_YELLOW ? '#eab308' : 'transparent';
            const fromLeft = (plateLength / 2 + stud.x).toFixed(1);
            const fromBottom = (plateWidth / 2 + stud.y).toFixed(1);

            return (
              <g
                key={index}
                onMouseEnter={() => onStudHover?.(index)}
                onMouseLeave={() => onStudHover?.(null)}
              >
                {/* Edge warning ring */}
                {ringColor !== 'transparent' && (
                  <circle cx={svgX} cy={svgY} r={displayRadius + 6} fill="none" stroke={ringColor} strokeWidth="2" opacity={0.9} pointerEvents="none" />
                )}
                {/* Stud circle */}
                <circle
                  cx={svgX}
                  cy={svgY}
                  r={displayRadius}
                  fill={isSelected || isHighlighted ? '#DC143C' : 'rgba(220, 20, 60, 0.6)'}
                  stroke="white"
                  strokeWidth={isSelected || isHighlighted ? 2 : 1}
                  className="cursor-move"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setSelectedStud(index);
                    setIsDragging(true);
                  }}
                />
                {/* Stud label */}
                <text x={svgX} y={svgY - displayRadius - 5} fill="white" fontSize="10" fontFamily="monospace" textAnchor="middle" pointerEvents="none">
                  {index + 1}
                </text>
                {/* Edge-distance hints (primary) */}
                <text x={svgX} y={svgY + displayRadius + 12} fill="rgba(255,255,255,0.85)" fontSize="8" textAnchor="middle" pointerEvents="none">
                  {fromLeft}" from left, {fromBottom}" from bottom
                </text>
                {/* Coordinates (de-emphasized) */}
                <text x={svgX} y={svgY + displayRadius + 24} fill="rgba(255,255,255,0.45)" fontSize="8" fontFamily="monospace" textAnchor="middle" pointerEvents="none">
                  ({stud.x.toFixed(2)}, {stud.y.toFixed(2)})
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      
      {/* Coordinate info */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-white/60">Plate Size: </span>
            <span className="text-white font-mono">{plateLength}" × {plateWidth}"</span>
          </div>
          <div>
            <span className="text-white/60">Studs: </span>
            <span className="text-white font-mono">{studs.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

