'use client';

import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Group } from 'three';
import { Box3, MathUtils, Sphere, Vector3, type Object3D } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { EmbedSpec } from '@/lib/steelEmbeds/types';
import EmbedGeometry from './EmbedGeometry';

function AutoFrame({
  enabled,
  objectRef,
  controlsRef,
  fitKey,
}: {
  enabled: boolean;
  objectRef: React.RefObject<Object3D | null>;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  fitKey: string;
}) {
  const { camera, size } = useThree();

  useLayoutEffect(() => {
    if (!enabled) return;
    if (!objectRef.current) return;
    if (!controlsRef.current) return;

    const raf = window.requestAnimationFrame(() => {
      if (!objectRef.current || !controlsRef.current) return;

      const box = new Box3().setFromObject(objectRef.current);
      if (box.isEmpty()) return;

      const center = box.getCenter(new Vector3());
      const sphere = box.getBoundingSphere(new Sphere());
      const radius = Math.max(sphere.radius, 0.0001);

      const aspect = size.width / Math.max(size.height, 1);
      const fovV = MathUtils.degToRad((camera as { fov?: number }).fov ?? 50);
      const fovH = 2 * Math.atan(Math.tan(fovV / 2) * aspect);

      const distV = radius / Math.tan(fovV / 2);
      const distH = radius / Math.tan(fovH / 2);

      const padding = 1.25;
      const distance = Math.max(distV, distH) * padding;

      camera.up.set(0, 0, 1);

      const dir = new Vector3(0.35, -0.2, 1.0).normalize();

      controlsRef.current.target.copy(center);
      camera.position.copy(center).addScaledVector(dir, distance);
      camera.near = Math.max(0.01, distance / 100);
      camera.far = distance * 100;
      camera.lookAt(center);
      camera.updateProjectionMatrix();
      controlsRef.current.update();
    });

    return () => window.cancelAnimationFrame(raf);
  }, [enabled, fitKey, size.width, size.height, camera, objectRef, controlsRef]);

  return null;
}

function Model({ url, onLoaded }: { url: string; onLoaded?: () => void }) {
  const [model, setModel] = React.useState<Group | null>(null);

  React.useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        setModel(gltf.scene);
        onLoaded?.();
      },
      undefined,
      (error) => {
        console.error('Error loading GLB:', error);
      }
    );
  }, [url]);

  if (!model) {
    return null;
  }

  return <primitive object={model} />;
}

interface PreviewCanvasProps {
  glbUrl?: string | null;
  spec?: Partial<EmbedSpec>;
  highlightedStudIndex?: number | null;
  onStudHover?: (index: number | null) => void;
}

export default function PreviewCanvas({ glbUrl, spec, highlightedStudIndex, onStudHover }: PreviewCanvasProps) {
  const objectRef = useRef<Object3D | null>(null);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [glbLoaded, setGlbLoaded] = useState(false);

  const hasValidSpec =
    spec?.plate?.length &&
    spec?.plate?.width &&
    spec?.plate?.thickness &&
    spec.plate.length > 0 &&
    spec.plate.width > 0 &&
    spec.plate.thickness > 0;

  const renderFromGlb = !!glbUrl;
  const renderFromSpec = hasValidSpec && !glbUrl;

  const plateKey = useMemo(() => {
    const plate = spec?.plate;
    if (!plate) return 'no-plate';
    return `${plate.length ?? ''}:${plate.width ?? ''}:${plate.thickness ?? ''}`;
  }, [spec?.plate]);

  const studsKey = useMemo(() => {
    const studs = spec?.studs?.positions;
    if (!studs || studs.length === 0) return 'no-studs';
    return studs
      .map((s) => `${s.x},${s.y},${s.diameter},${s.length}`)
      .join('|');
  }, [spec?.studs?.positions]);

  const fitKey = renderFromGlb ? `glb:${glbUrl}:${glbLoaded}` : `${plateKey}::${studsKey}`;

  React.useEffect(() => {
    if (glbUrl) setGlbLoaded(false);
  }, [glbUrl]);

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '400px' }}>
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }} style={{ width: '100%', height: '100%' }}>
        <color attach="background" args={['#1a1a1a']} />
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-8, 8, 8]} intensity={0.5} />
        <directionalLight position={[-10, 10, -10]} intensity={0.5} />

        <group ref={objectRef}>
          {renderFromGlb && glbUrl && <Model url={glbUrl} onLoaded={() => setGlbLoaded(true)} />}
          {renderFromSpec && spec && (
            <EmbedGeometry
              spec={spec}
              highlightedStudIndex={highlightedStudIndex ?? undefined}
              onStudHover={onStudHover}
            />
          )}
        </group>

        <OrbitControls
          ref={controlsRef}
          enableZoom
          enablePan
          enableRotate
          onStart={() => setHasUserInteracted(true)}
        />

        <AutoFrame
          enabled={!hasUserInteracted}
          objectRef={objectRef}
          controlsRef={controlsRef}
          fitKey={fitKey}
        />

        <Environment preset="warehouse" />
      </Canvas>
    </div>
  );
}
