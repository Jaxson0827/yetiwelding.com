'use client';

import React, { useRef, useCallback, useState, useEffect } from 'react';

interface StudPosition {
  x: number;
  y: number;
  diameter: number;
  length: number;
  grade: 'A307' | 'A325';
}

interface CoordinateEditorProps {
  plateLength: number;
  plateWidth: number;
  studs: StudPosition[];
  onStudUpdate: (index: number, stud: StudPosition) => void;
  onStudAdd: (x: number, y: number) => void;
  onStudRemove: (index: number) => void;
}

export default function CoordinateEditor({
  plateLength,
  plateWidth,
  studs,
  onStudUpdate,
  onStudAdd,
  onStudRemove,
}: CoordinateEditorProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedStud, setSelectedStud] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const roundToTwoDecimals = useCallback((value: number) => {
    return Math.round(value * 100) / 100;
  }, []);

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
      <div className="mb-4">
        <h4 className="text-white font-semibold mb-2">Visual Coordinate Editor</h4>
        <p className="text-white/60 text-xs">
          Click on the plate to add a stud, or drag existing studs to reposition them.
          Coordinates are relative to the plate center (0, 0).
        </p>
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
          
          {/* Center lines */}
          <line
            x1={svgWidth / 2}
            y1={0}
            x2={svgWidth / 2}
            y2={svgHeight}
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <line
            x1={0}
            y1={svgHeight / 2}
            x2={svgWidth}
            y2={svgHeight / 2}
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          
          {/* Center point label */}
          <circle cx={svgWidth / 2} cy={svgHeight / 2} r="3" fill="rgba(255, 255, 255, 0.5)" />
          <text
            x={svgWidth / 2 + 8}
            y={svgHeight / 2 - 8}
            fill="rgba(255, 255, 255, 0.6)"
            fontSize="10"
            fontFamily="monospace"
          >
            (0, 0)
          </text>
          
          {/* Studs */}
          {studs.map((stud, index) => {
            const { x: svgX, y: svgY } = plateToSvg(stud.x, stud.y, svgWidth, svgHeight);
            const radius = (stud.diameter / 2) * scale;
            const isSelected = selectedStud === index;
            
            return (
              <g key={index}>
                {/* Stud circle */}
                <circle
                  cx={svgX}
                  cy={svgY}
                  r={Math.max(radius, 8)}
                  fill={isSelected ? '#DC143C' : 'rgba(220, 20, 60, 0.6)'}
                  stroke="white"
                  strokeWidth={isSelected ? 2 : 1}
                  className="cursor-move"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setSelectedStud(index);
                    setIsDragging(true);
                  }}
                />
                
                {/* Stud label */}
                <text
                  x={svgX}
                  y={svgY - radius - 5}
                  fill="white"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                  pointerEvents="none"
                >
                  {index + 1}
                </text>
                
                {/* Coordinate label */}
                <text
                  x={svgX}
                  y={svgY + radius + 15}
                  fill="rgba(255, 255, 255, 0.7)"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="middle"
                  pointerEvents="none"
                >
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

