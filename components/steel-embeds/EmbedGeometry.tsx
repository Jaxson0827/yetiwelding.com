'use client';

// UNITS: 1 Three.js unit = 1 inch (DO NOT auto-scale or normalize)
// NO CSG/boolean operations - holes are visual markers only
// Placement is illustrative only - does not represent exact field locations

import React, { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { BoxGeometry, CylinderGeometry, MeshStandardMaterial } from 'three';
import { EmbedSpec } from '@/lib/steelEmbeds/types';

interface EmbedGeometryProps {
  spec: Partial<EmbedSpec>;
}

export default function EmbedGeometry({ spec }: EmbedGeometryProps) {
  const { plate, studs } = spec;

  // Strict check: ALL THREE plate dimensions must be present and > 0
  if (!plate?.length || !plate?.width || !plate?.thickness) {
    return null;
  }

  const length = plate.length;
  const width = plate.width;
  const thickness = plate.thickness;

  // Plate material (metallic steel)
  const plateMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: 0x808080,
        metalness: 0.7,
        roughness: 0.3,
      }),
    []
  );

  // Stud material (similar to plate, metallic)
  const studMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: 0x808080,
        metalness: 0.7,
        roughness: 0.3,
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

  return (
    <group>
      {/* Plate */}
      <mesh geometry={plateGeometry} material={plateMaterial} position={[0, 0, 0]} />

      {/* Studs - protruding cylinders from top surface */}
      {studPositions.map((stud, index) => {
        const radius = stud.diameter / 2;
        const studLength = stud.length;

        // Position stud on top surface of plate
        // CylinderGeometry is oriented along Y-axis by default, so we rotate 90° around X-axis to make it vertical (Z-axis)
        // The base of the stud should be at the top of the plate (z = thickness/2)
        // Since the cylinder extends from -studLength/2 to +studLength/2 along its axis (now Z after rotation),
        // we position the center at thickness/2 + studLength/2
        const zPosition = thickness / 2 + studLength / 2;

        return (
          <mesh
            key={`stud-${index}`}
            geometry={new CylinderGeometry(radius, radius, studLength, 32)}
            material={studMaterial}
            position={[stud.x, stud.y, zPosition]}
            rotation={[Math.PI / 2, 0, 0]} // Rotate 90° around X-axis to make cylinder vertical (Z-axis aligned)
          />
        );
      })}
    </group>
  );
}

