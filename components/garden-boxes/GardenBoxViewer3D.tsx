'use client';

/**
 * Garden Box 3D Viewer – Bolt-together steel raised bed with lifestyle feel.
 * Grass ground plane, soft shadows, material updates by finish.
 * Postprocessing: SSAO, Bloom, Vignette for product-render quality.
 */

import React, { useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three';
import { Bloom, EffectComposer, SMAA, SSAO, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import type { GardenBoxConfig } from '@/lib/gardenBoxes/types';
import { getDimensionsFt } from '@/lib/gardenBoxes/types';
import { GARDEN_BOX_FINISHES } from '@/lib/gardenBoxes/types';

const IN = 1 / 12; // 1 inch in feet
const PANEL_THICKNESS_FT = 0.01; // thin wall for visual

function getColorHex(finishId: string): string {
  const f = GARDEN_BOX_FINISHES.find((x) => x.id === finishId);
  return f?.hex ?? '#6b7280';
}

function BoxPanels({
  config,
}: {
  config: GardenBoxConfig;
}) {
  const { lengthFt, widthFt } = getDimensionsFt(config.size);
  const heightFt = config.height * IN;

  const color = getColorHex(config.finish);
  const mat = useMemo(() => {
    const isRaw = config.finish === 'raw';
    const isCorten = config.finish === 'corten';
    const isPowder = config.finish === 'powder-black' || config.finish === 'powder-bronze';
    return new THREE.MeshStandardMaterial({
      color,
      metalness: isRaw ? 0.5 : isPowder ? 0.25 : 0.2,
      roughness: isCorten ? 0.8 : isRaw ? 0.55 : 0.6,
      emissive: isCorten ? new THREE.Color(0x2a1810) : undefined,
      emissiveIntensity: isCorten ? 0.08 : 0,
    });
  }, [color, config.finish]);

  const hL = lengthFt / 2;
  const hW = widthFt / 2;
  const hH = heightFt / 2;
  const t = PANEL_THICKNESS_FT / 2;

  return (
    <group>
      {/* 4 side panels */}
      <mesh position={[0, hH, -hW - t]} material={mat} castShadow receiveShadow>
        <boxGeometry args={[lengthFt + t * 2, heightFt, PANEL_THICKNESS_FT]} />
      </mesh>
      <mesh position={[0, hH, hW + t]} material={mat} castShadow receiveShadow>
        <boxGeometry args={[lengthFt + t * 2, heightFt, PANEL_THICKNESS_FT]} />
      </mesh>
      <mesh position={[-hL - t, hH, 0]} material={mat} castShadow receiveShadow>
        <boxGeometry args={[PANEL_THICKNESS_FT, heightFt, widthFt + t * 2]} />
      </mesh>
      <mesh position={[hL + t, hH, 0]} material={mat} castShadow receiveShadow>
        <boxGeometry args={[PANEL_THICKNESS_FT, heightFt, widthFt + t * 2]} />
      </mesh>
      {/* Bottom plate (optional) */}
      {config.addOns?.bottomPlate && (
        <mesh position={[0, -t, 0]} material={mat} castShadow receiveShadow>
          <boxGeometry args={[lengthFt, PANEL_THICKNESS_FT, widthFt]} />
        </mesh>
      )}
      {/* Trellis (simple vertical bars) */}
      {config.addOns?.trellis && (
        <Trellis lengthFt={lengthFt} widthFt={widthFt} heightFt={heightFt} color={color} />
      )}
    </group>
  );
}

function Trellis({
  lengthFt,
  widthFt,
  heightFt,
  color,
}: {
  lengthFt: number;
  widthFt: number;
  heightFt: number;
  color: string;
}) {
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        metalness: 0.3,
        roughness: 0.6,
      }),
    [color]
  );
  const barW = 0.05;
  const barH = heightFt * 0.8;
  const spacing = 0.5;
  const bars: [number, number][] = [];
  for (let x = -lengthFt / 2 + spacing; x < lengthFt / 2; x += spacing) {
    bars.push([x, widthFt / 2 + 0.02]);
    bars.push([x, -widthFt / 2 - 0.02]);
  }
  return (
    <group>
      {bars.map(([x, z], i) => (
        <mesh key={i} position={[x, barH / 2, z]} material={mat} castShadow>
          <boxGeometry args={[barW, barH, barW]} />
        </mesh>
      ))}
    </group>
  );
}

function GrassGround() {
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#4a7c59',
        metalness: 0,
        roughness: 1,
      }),
    []
  );
  return (
    <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={mat}>
      <planeGeometry args={[50, 50]} />
    </mesh>
  );
}

function SoilFill({
  lengthFt,
  widthFt,
  heightFt,
}: {
  lengthFt: number;
  widthFt: number;
  heightFt: number;
}) {
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#5c4033',
        metalness: 0,
        roughness: 1,
      }),
    []
  );
  const soilY = heightFt - 0.12;
  const soilL = Math.max(0.1, lengthFt - 0.2);
  const soilW = Math.max(0.1, widthFt - 0.2);
  return (
    <mesh position={[0, soilY, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={mat}>
      <planeGeometry args={[soilL, soilW]} />
    </mesh>
  );
}

function Rig({ heightFt }: { heightFt: number }) {
  const { camera } = useThree();
  const targetY = heightFt / 2;
  React.useEffect(() => {
    camera.position.set(4, targetY + 3.5, 5);
    camera.lookAt(0, targetY, 0);
  }, [camera, targetY]);

  return (
    <OrbitControls
      enableDamping
      dampingFactor={0.08}
      minDistance={2}
      maxDistance={20}
      minPolarAngle={0.2}
      maxPolarAngle={Math.PI / 2.05}
      target={[0, targetY, 0]}
      makeDefault
    />
  );
}

interface GardenBoxViewer3DProps {
  config: Partial<GardenBoxConfig>;
}

export default function GardenBoxViewer3D({ config }: GardenBoxViewer3DProps) {
  const fullConfig: GardenBoxConfig = {
    size: config.size ?? '4x2',
    height: config.height ?? 18,
    finish: config.finish ?? 'raw',
    addOns: config.addOns ?? {},
  };

  const { lengthFt, widthFt } = getDimensionsFt(fullConfig.size);
  const heightFt = fullConfig.height * IN;

  return (
    <div className="relative h-[600px] rounded-2xl border border-white/20 overflow-hidden bg-black/20">
      <Canvas
        gl={{
          antialias: true,
          toneMapping: ACESFilmicToneMapping,
          outputColorSpace: SRGBColorSpace,
        }}
        shadows
        dpr={[1, 2]}
        camera={{ fov: 45, near: 0.1, far: 1000, position: [4, heightFt / 2 + 3.5, 5] }}
      >
        <color attach="background" args={['#ffffff']} />
        <ambientLight intensity={0.55} />
        <hemisphereLight args={['#e8d4a0', '#6b8e6b', 0.4]} />
        <directionalLight
          position={[8, 15, 10]}
          intensity={1.0}
          color="#fff5e6"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-near={0.5}
          shadow-camera-far={50}
          shadow-camera-left={-25}
          shadow-camera-right={25}
          shadow-camera-top={25}
          shadow-camera-bottom={-25}
          shadow-bias={-0.0001}
        />
        <pointLight position={[-6, heightFt * 1.2, -6]} intensity={0.4} color="#fff0e0" />

        <Rig heightFt={heightFt} />
        <GrassGround />
        <ContactShadows
          position={[0, -0.015, 0]}
          opacity={0.4}
          scale={Math.max(lengthFt, widthFt) * 2.5}
          blur={2}
          far={1}
          color="#1a2a1a"
        />
        <BoxPanels config={fullConfig} />
        <SoilFill lengthFt={lengthFt} widthFt={widthFt} heightFt={heightFt} />

        <EffectComposer multisampling={0} enableNormalPass>
          <SMAA />
          <SSAO
            samples={32}
            radius={0.5}
            intensity={2}
            luminanceInfluence={0.22}
            worldDistanceThreshold={2}
            worldDistanceFalloff={0.5}
          />
          <Bloom
            intensity={0.18}
            luminanceThreshold={0.82}
            luminanceSmoothing={0.22}
          />
          <Vignette eskil={false} offset={0.1} darkness={0.42} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
