'use client';

// UNITS: 1 Three.js unit = 1 inch (DO NOT auto-scale or normalize)
// NO CSG/boolean operations - holes are visual markers only
// Placement is illustrative only - does not represent exact field locations

import React, { useMemo } from 'react';
import { BoxGeometry, CylinderGeometry, MeshStandardMaterial } from 'three';
import { EmbedSpec } from '@/lib/steelEmbeds/types';

interface EmbedGeometryProps {
  spec: Partial<EmbedSpec>;
  highlightedStudIndex?: number | null;
  onStudHover?: (index: number | null) => void;
}

const STUD_SEGMENTS = 32;
const HEAD_DIAMETER_MULTIPLIER = 1.6; // visual-only: headed stud look
const MIN_HEAD_THICKNESS_IN = 0.125;

export default function EmbedGeometry({ spec, highlightedStudIndex, onStudHover }: EmbedGeometryProps) {
  const { plate, studs } = spec;

  // Strict check: ALL THREE plate dimensions must be present and > 0
  if (!plate?.length || !plate?.width || !plate?.thickness) {
    return null;
  }

  const length = plate.length;
  const width = plate.width;
  const thickness = plate.thickness;

  // Plate material (steel: lighter gray, reduced metalness for visibility without env map)
  const plateMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: 0xa8a8a8,
        metalness: 0.55,
        roughness: 0.3,
      }),
    []
  );

  // Stud material (same steel look as plate)
  const studMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: 0xa8a8a8,
        metalness: 0.55,
        roughness: 0.3,
      }),
    []
  );

  // Highlighted stud material (crimson for selection feedback)
  const studHighlightMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: 0xdc143c,
        metalness: 0.55,
        roughness: 0.3,
        emissive: 0x330808,
      }),
    []
  );

  // Get stud positions from spec (using actual coordinates)
  const studPositions = useMemo(() => {
    if (!studs || !studs.positions || studs.positions.length === 0) {
      return [];
    }
    return studs.positions;
  }, [studs]);

  // Plate geometry
  const plateGeometry = useMemo(
    () => new BoxGeometry(length, width, thickness),
    [length, width, thickness]
  );

  // Geometry caches (avoid allocating new geometries on every render)
  const rodGeometryCache = useMemo(() => new Map<string, CylinderGeometry>(), []);
  const headGeometryCache = useMemo(() => new Map<string, CylinderGeometry>(), []);

  const getRodGeometry = (radius: number, rodLength: number) => {
    const key = `${radius}:${rodLength}`;
    const cached = rodGeometryCache.get(key);
    if (cached) return cached;
    const geom = new CylinderGeometry(radius, radius, rodLength, STUD_SEGMENTS);
    rodGeometryCache.set(key, geom);
    return geom;
  };

  const getHeadGeometry = (radius: number, headThickness: number) => {
    const key = `${radius}:${headThickness}`;
    const cached = headGeometryCache.get(key);
    if (cached) return cached;
    const geom = new CylinderGeometry(radius, radius, headThickness, STUD_SEGMENTS);
    headGeometryCache.set(key, geom);
    return geom;
  };

  return (
    <group>
      {/* Plate */}
      <mesh geometry={plateGeometry} material={plateMaterial} position={[0, 0, 0]} />

      {/* Studs - protruding cylinders from top surface, with headed-stud disc */}
      {studPositions.map((stud, index) => {
        const rodRadius = stud.diameter / 2;
        const rodLength = stud.length;
        const isHighlighted = highlightedStudIndex === index;
        const mat = isHighlighted ? studHighlightMaterial : studMaterial;

        // Visual-only head proportions derived from diameter
        const headDiameter = stud.diameter * HEAD_DIAMETER_MULTIPLIER;
        const headRadius = headDiameter / 2;
        const headThickness = Math.max(MIN_HEAD_THICKNESS_IN, stud.diameter * 0.25);

        const rodZ = thickness / 2 + rodLength / 2;
        const headZ = thickness / 2 + rodLength + headThickness / 2;

        return (
          <group
            key={`stud-${index}`}
            onPointerOver={() => onStudHover?.(index)}
            onPointerOut={() => onStudHover?.(null)}
          >
            <mesh
              geometry={getRodGeometry(rodRadius, rodLength)}
              material={mat}
              position={[stud.x, stud.y, rodZ]}
              rotation={[Math.PI / 2, 0, 0]}
            />
            <mesh
              geometry={getHeadGeometry(headRadius, headThickness)}
              material={mat}
              position={[stud.x, stud.y, headZ]}
              rotation={[Math.PI / 2, 0, 0]}
            />
          </group>
        );
      })}
    </group>
  );
}

