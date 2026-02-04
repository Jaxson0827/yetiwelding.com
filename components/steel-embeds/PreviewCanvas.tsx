'use client';

import React, { Suspense, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer, OrbitControls, useGLTF } from '@react-three/drei';
import { ACESFilmicToneMapping, Box3, MathUtils, Sphere, SRGBColorSpace, Vector3, type Object3D } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { Bloom, EffectComposer, SMAA, SSAO, Vignette } from '@react-three/postprocessing';
import { EmbedSpec } from '@/lib/steelEmbeds/types';
import EmbedGeometry from './EmbedGeometry';

export type PreviewViewState = {
  cameraPosition: [number, number, number];
  target: [number, number, number];
  hasUserInteracted: boolean;
};

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
  const { camera, size, invalidate } = useThree();

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
      invalidate();
    });

    return () => window.cancelAnimationFrame(raf);
  }, [enabled, fitKey, size.width, size.height, camera, objectRef, controlsRef]);

  return null;
}

function GLBModel({ url, onLoaded }: { url: string; onLoaded?: () => void }) {
  const gltf = useGLTF(url);

  React.useEffect(() => {
    onLoaded?.();
  }, [url, gltf, onLoaded]);

  React.useLayoutEffect(() => {
    gltf.scene.traverse((obj) => {
      const anyObj = obj as any;
      if (anyObj.isMesh) {
        anyObj.castShadow = true;
        anyObj.receiveShadow = true;
        if (anyObj.material) {
          const materials = Array.isArray(anyObj.material) ? anyObj.material : [anyObj.material];
          for (const mat of materials) {
            if (mat && typeof (mat as any).envMapIntensity === 'number') {
              (mat as any).envMapIntensity = 1.0;
            }
            if (mat && typeof (mat as any).needsUpdate === 'boolean') {
              (mat as any).needsUpdate = true;
            }
          }
        }
      }
    });
  }, [gltf.scene]);

  return <primitive object={gltf.scene} />;
}

interface PreviewCanvasProps {
  glbUrl?: string | null;
  spec?: Partial<EmbedSpec>;
  viewState?: PreviewViewState | null;
  onViewStateChange?: (next: PreviewViewState) => void;
}

export default function PreviewCanvas({ glbUrl, spec, viewState, onViewStateChange }: PreviewCanvasProps) {
  const objectRef = useRef<Object3D | null>(null);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const [hasUserInteracted, setHasUserInteracted] = useState<boolean>(viewState?.hasUserInteracted ?? false);
  const [glbLoaded, setGlbLoaded] = useState(false);
  const invalidateRef = useRef<(() => void) | null>(null);
  const cameraRef = useRef<{ position: Vector3; up: Vector3; near: number; far: number; lookAt: (...args: any[]) => void; updateProjectionMatrix: () => void } | null>(null);

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

  React.useEffect(() => {
    if (!glbUrl) return;
    // Hint the loader cache early for quicker first render
    useGLTF.preload(glbUrl);
  }, [glbUrl]);

  const requestRender = useCallback(() => {
    invalidateRef.current?.();
  }, []);

  const captureViewState = useCallback(
    (nextHasUserInteracted: boolean): PreviewViewState | null => {
      const cam = cameraRef.current as any;
      const ctrls = controlsRef.current as any;
      if (!cam || !ctrls) return null;

      return {
        cameraPosition: [cam.position.x, cam.position.y, cam.position.z],
        target: [ctrls.target.x, ctrls.target.y, ctrls.target.z],
        hasUserInteracted: nextHasUserInteracted,
      };
    },
    []
  );

  const applyViewState = useCallback(
    (state: PreviewViewState) => {
      const cam = cameraRef.current as any;
      const ctrls = controlsRef.current as any;
      if (!cam || !ctrls) return;

      ctrls.target.set(state.target[0], state.target[1], state.target[2]);
      cam.position.set(state.cameraPosition[0], state.cameraPosition[1], state.cameraPosition[2]);
      cam.updateProjectionMatrix();
      ctrls.update();
      requestRender();
    },
    [requestRender]
  );

  useLayoutEffect(() => {
    if (!viewState) return;
    // If the canvas remounts after switching away, restore the last camera/target.
    setHasUserInteracted(viewState.hasUserInteracted);
    applyViewState(viewState);
  }, [applyViewState, viewState]);

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '400px' }}>
      <Canvas
        shadows
        frameloop="demand"
        dpr={[1, 2]}
        camera={{ position: [5, 5, 5], fov: 45 }}
        gl={{
          antialias: true,
          toneMapping: ACESFilmicToneMapping,
          outputColorSpace: SRGBColorSpace,
        }}
        onCreated={(state) => {
          invalidateRef.current = state.invalidate;
          cameraRef.current = state.camera as any;
          if (viewState) {
            setHasUserInteracted(viewState.hasUserInteracted);
            applyViewState(viewState);
          }
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <color attach="background" args={['#0b0b0c']} />

        {/* Studio-style environment lighting (key/fill/rim) */}
        <ambientLight intensity={0.15} />
        <Environment resolution={256}>
          <Lightformer
            form="rect"
            intensity={4.5}
            position={[8, -6, 10]}
            rotation={[0.35, 0.65, 0]}
            scale={[18, 8, 1]}
          />
          <Lightformer
            form="rect"
            intensity={2.5}
            position={[-10, 4, 7]}
            rotation={[0.1, -0.75, 0]}
            scale={[14, 6, 1]}
          />
          <Lightformer
            form="ring"
            intensity={1.2}
            position={[0, 14, 10]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[12, 12, 1]}
          />
        </Environment>

        {/* Grounding shadow */}
        <ContactShadows
          opacity={0.18}
          blur={3.4}
          resolution={1024}
          frames={1}
          scale={70}
          far={28}
          position={[0, 0, -0.001]}
        />

        <EffectComposer multisampling={0}>
          <SMAA />
          <SSAO
            samples={12}
            radius={0.85}
            intensity={2.6}
            luminanceInfluence={0.22}
            worldDistanceThreshold={60}
            worldDistanceFalloff={8}
          />
          <Bloom
            intensity={0.18}
            luminanceThreshold={0.82}
            luminanceSmoothing={0.22}
          />
          <Vignette eskil={false} offset={0.1} darkness={0.42} />
        </EffectComposer>

        <group ref={objectRef}>
          {renderFromGlb && glbUrl && (
            <Suspense fallback={null}>
              <GLBModel
                url={glbUrl}
                onLoaded={() => {
                  setGlbLoaded(true);
                  requestRender();
                }}
              />
            </Suspense>
          )}
          {renderFromSpec && spec && <EmbedGeometry spec={spec} />}
        </group>

        <OrbitControls
          ref={controlsRef}
          enableZoom
          enablePan
          enableRotate
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.8}
          zoomSpeed={0.9}
          panSpeed={0.75}
          minPolarAngle={0.25}
          maxPolarAngle={Math.PI * 0.88}
          minDistance={1}
          maxDistance={250}
          onStart={() => {
            setHasUserInteracted(true);
            const snapshot = captureViewState(true);
            if (snapshot) onViewStateChange?.(snapshot);
          }}
          onChange={() => requestRender()}
          onEnd={() => {
            const snapshot = captureViewState(true);
            if (snapshot) onViewStateChange?.(snapshot);
          }}
        />

        <AutoFrame
          enabled={!hasUserInteracted}
          objectRef={objectRef}
          controlsRef={controlsRef}
          fitKey={fitKey}
        />
      </Canvas>
    </div>
  );
}
