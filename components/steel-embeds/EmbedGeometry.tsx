'use client';

// UNITS: 1 Three.js unit = 1 inch (DO NOT auto-scale or normalize)
// NO CSG/boolean operations - holes are visual markers only
// Placement is illustrative only - does not represent exact field locations

import React, { useMemo } from 'react';
import { BoxGeometry, CylinderGeometry, MeshPhysicalMaterial } from 'three';
import { Select } from '@react-three/postprocessing';
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

  // Plate material (steel look: relies on environment reflections)
  const plateMaterial = useMemo(
    () =>
      new MeshPhysicalMaterial({
        color: 0x6f7377, // darker, more realistic base steel
        metalness: 0.98,
        roughness: 0.34,
        clearcoat: 0.15,
        clearcoatRoughness: 0.2,
        envMapIntensity: 1.05,
      }),
    []
  );

  // Stud material (same steel look as plate, slightly different roughness for readability)
  const studMaterial = useMemo(
    () =>
      new MeshPhysicalMaterial({
        color: 0x7a7f84,
        metalness: 0.98,
        roughness: 0.28,
        clearcoat: 0.12,
        clearcoatRoughness: 0.22,
        envMapIntensity: 1.05,
      }),
    []
  );

  // Highlighted stud material (crimson tint + subtle emissive; outline will be added via post-processing)
  const studHighlightMaterial = useMemo(
    () =>
      new MeshPhysicalMaterial({
        color: 0xdc143c,
        metalness: 0.85,
        roughness: 0.32,
        clearcoat: 0.18,
        clearcoatRoughness: 0.25,
        envMapIntensity: 1.05,
        emissive: 0x220306,
        emissiveIntensity: 0.65,
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
      <mesh geometry={plateGeometry} material={plateMaterial} position={[0, 0, 0]} castShadow receiveShadow />

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
          <Select
            key={`stud-${index}`}
            enabled={!!isHighlighted}
          >
            <group
              onPointerOver={() => onStudHover?.(index)}
              onPointerOut={() => onStudHover?.(null)}
            >
              <mesh
                geometry={getRodGeometry(rodRadius, rodLength)}
                material={mat}
                position={[stud.x, stud.y, rodZ]}
                rotation={[Math.PI / 2, 0, 0]}
                castShadow
                receiveShadow
              />
              <mesh
                geometry={getHeadGeometry(headRadius, headThickness)}
                material={mat}
                position={[stud.x, stud.y, headZ]}
                rotation={[Math.PI / 2, 0, 0]}
                castShadow
                receiveShadow
              />
            </group>
          </Select>
        );
      })}
    </group>
  );
}

