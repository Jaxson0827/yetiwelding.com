'use client';

import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { EmbedSpec } from '@/lib/steelEmbeds/types';
import EmbedGeometry from './EmbedGeometry';
import { Box3, MathUtils, Sphere, Vector3, type Object3D } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

interface PreviewCanvasProps {
  spec: Partial<EmbedSpec>;
  fitRequest?: number;
  resetRequest?: number;
}

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

    // Wait a frame so geometry updates are reflected in world matrices.
    const raf = window.requestAnimationFrame(() => {
      if (!objectRef.current || !controlsRef.current) return;

      const box = new Box3().setFromObject(objectRef.current);
      if (box.isEmpty()) return;

      const center = box.getCenter(new Vector3());
      const sphere = box.getBoundingSphere(new Sphere());
      const radius = Math.max(sphere.radius, 0.0001);

      const aspect = size.width / Math.max(size.height, 1);
      const fovV = MathUtils.degToRad((camera as any).fov ?? 50);
      const fovH = 2 * Math.atan(Math.tan(fovV / 2) * aspect);

      const distV = radius / Math.tan(fovV / 2);
      const distH = radius / Math.tan(fovH / 2);

      // Slight padding so it feels breathable.
      const padding = 1.25;
      const distance = Math.max(distV, distH) * padding;

      // Scene uses Z as "up" (plate thickness axis). Make camera + controls agree.
      camera.up.set(0, 0, 1);

      // Top-slight-tilt direction (mostly above the plate, with a gentle diagonal).
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

export default function PreviewCanvas({ spec, fitRequest, resetRequest }: PreviewCanvasProps) {
  const objectRef = useRef<Object3D | null>(null);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [fitNonce, setFitNonce] = useState(0);

  // When the parent requests a fit/reset, allow AutoFrame to run again.
  React.useEffect(() => {
    if (fitRequest === undefined) return;
    setHasUserInteracted(false);
    setFitNonce((n) => n + 1);
  }, [fitRequest]);

  React.useEffect(() => {
    if (resetRequest === undefined) return;
    setHasUserInteracted(false);
    setFitNonce((n) => n + 1);
  }, [resetRequest]);

  const plateKey = useMemo(() => {
    const plate = spec.plate;
    if (!plate) return 'no-plate';
    return `${plate.length ?? ''}:${plate.width ?? ''}:${plate.thickness ?? ''}`;
  }, [spec.plate]);

  const studsKey = useMemo(() => {
    const studs = spec.studs?.positions;
    if (!studs || studs.length === 0) return 'no-studs';
    // Keep this stable and compact; include the geometry-affecting fields.
    return studs
      .map((s) => `${s.x},${s.y},${s.diameter},${s.length}`)
      .join('|');
  }, [spec.studs?.positions]);

  const fitKey = `${plateKey}::${studsKey}::${fitNonce}`;

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }} style={{ width: '100%', height: '100%' }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <directionalLight position={[-10, 10, -10]} intensity={0.5} />

        <group ref={objectRef}>
          <EmbedGeometry spec={spec} />
        </group>

        <OrbitControls
          ref={controlsRef}
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
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


