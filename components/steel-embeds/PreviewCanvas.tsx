'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Group } from 'three';
import { EmbedSpec } from '@/lib/steelEmbeds/types';
import EmbedGeometry from './EmbedGeometry';

const VIEW_PRESETS = {
  isometric: { position: [6, 6, 6] as [number, number, number], label: 'Isometric' },
  top: { position: [0, 0, 12] as [number, number, number], label: 'Top' },
  side: { position: [12, 0, 4] as [number, number, number], label: 'Side' },
} as const;

type ViewPresetKey = keyof typeof VIEW_PRESETS;

function CameraController({
  viewPreset,
  autoRotate,
  onUserInteract,
}: {
  viewPreset: ViewPresetKey;
  autoRotate: boolean;
  onUserInteract: () => void;
}) {
  const { camera } = useThree();
  const lerpRef = useRef(1);
  const thetaRef = useRef(0);

  useFrame((_, delta) => {
    const target = VIEW_PRESETS[viewPreset].position;
    const speed = 2 * delta;

    if (autoRotate) {
      thetaRef.current += 0.15 * delta;
      const r = 10;
      camera.position.x = r * Math.sin(thetaRef.current);
      camera.position.y = 4;
      camera.position.z = r * Math.cos(thetaRef.current);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      return;
    }

    lerpRef.current = Math.min(1, lerpRef.current + speed);
    camera.position.x += (target[0] - camera.position.x) * 0.08;
    camera.position.y += (target[1] - camera.position.y) * 0.08;
    camera.position.z += (target[2] - camera.position.z) * 0.08;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  });

  return null;
}

function Model({ url }: { url: string }) {
  const groupRef = useRef<Group>(null);
  const [model, setModel] = React.useState<Group | null>(null);

  React.useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(url, (gltf) => {
      setModel(gltf.scene);
    }, undefined, (error) => {
      console.error('Error loading GLB:', error);
    });
  }, [url]);

  useFrame(() => {
    if (groupRef.current && model) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  if (!model) {
    return null;
  }

  return (
    <group ref={groupRef}>
      <primitive object={model} />
    </group>
  );
}

interface PreviewCanvasProps {
  glbUrl?: string | null;
  spec?: Partial<EmbedSpec>;
  highlightedStudIndex?: number | null;
  onStudHover?: (index: number | null) => void;
}

export default function PreviewCanvas({ glbUrl, spec, highlightedStudIndex, onStudHover }: PreviewCanvasProps) {
  const [viewPreset, setViewPreset] = useState<ViewPresetKey>('isometric');
  const [autoRotate, setAutoRotate] = useState(true);

  const hasValidSpec =
    spec?.plate?.length &&
    spec?.plate?.width &&
    spec?.plate?.thickness &&
    spec.plate.length > 0 &&
    spec.plate.width > 0 &&
    spec.plate.thickness > 0;

  const renderFromGlb = !!glbUrl;
  const renderFromSpec = hasValidSpec && !glbUrl;

  const handleViewClick = (preset: ViewPresetKey) => {
    setViewPreset(preset);
    setAutoRotate(false);
  };

  return (
    <div className="w-full h-full flex flex-col" style={{ minHeight: '400px' }}>
      <div className="flex items-center gap-2 mb-2 flex-shrink-0">
        <span className="text-white/60 text-xs font-semibold uppercase tracking-wider">View:</span>
        {(Object.keys(VIEW_PRESETS) as ViewPresetKey[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => handleViewClick(key)}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              viewPreset === key
                ? 'bg-[#DC143C] text-white'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            {VIEW_PRESETS[key].label}
          </button>
        ))}
      </div>
      <div className="flex-1 min-h-0" style={{ width: '100%' }}>
        <Canvas
          camera={{ position: [6, 6, 6], fov: 50 }}
          style={{ width: '100%', height: '100%' }}
          onPointerDown={() => setAutoRotate(false)}
          onWheel={() => setAutoRotate(false)}
        >
          <color attach="background" args={['#1a1a1a']} />
          <ambientLight intensity={0.75} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-8, 8, 8]} intensity={0.6} />
          <directionalLight position={[-10, 10, -10]} intensity={0.5} />
          {renderFromGlb && glbUrl && <Model url={glbUrl} />}
          {renderFromSpec && spec && (
            <EmbedGeometry
              spec={spec}
              highlightedStudIndex={highlightedStudIndex ?? undefined}
              onStudHover={onStudHover}
            />
          )}
          <CameraController
            viewPreset={viewPreset}
            autoRotate={autoRotate}
            onUserInteract={() => setAutoRotate(false)}
          />
        </Canvas>
      </div>
    </div>
  );
}
