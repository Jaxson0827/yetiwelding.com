'use client';

/**
 * Pergola 3D Viewer – Smart-Fit panels with symmetric edge strips.
 * Panels tint to the chosen frame color.
 */

import React, {
  useMemo,
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { ContactShadows, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { SVGLoader } from 'three-stdlib';
import { colorHex } from '@/lib/pergolas/colors';
import { getDesign } from '@/lib/pergolas/panels';
import type { PergolaConfig } from '@/lib/pergolas/types';

const IN = 1 / 12;
const THICK_IN = 0.125;
const PANEL_W_FT = 5;
const ALLOWED_LENGTHS_FT = [10, 8, 7.5, 7, 6.5, 6];
const SEAM_IN = 0.25;
const SEAM_FT = SEAM_IN * IN;
const EDGE_MIN_FT = 0.5;
const EDGE_TARGET_FT = 1.0;
const EDGE_MAX_FT = 1.5;

function Frame({
  spanFt,
  depthFt,
  heightFt,
  color,
}: {
  spanFt: number;
  depthFt: number;
  heightFt: number;
  color: string;
}) {
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ color, metalness: 0.1, roughness: 0.7 }),
    [color]
  );
  const POST = 4 * IN;
  const BEAM = 4 * IN;
  const hw = spanFt / 2;
  const hd = depthFt / 2;

  return (
    <group>
      {[
        [-hw + POST / 2, 0, -hd + POST / 2],
        [hw - POST / 2, 0, -hd + POST / 2],
        [-hw + POST / 2, 0, hd - POST / 2],
        [hw - POST / 2, 0, hd - POST / 2],
      ].map((p, i) => (
        <mesh key={i} position={[p[0], heightFt / 2, p[2]]} material={mat} castShadow receiveShadow>
          <boxGeometry args={[POST, heightFt, POST]} />
        </mesh>
      ))}
      {[
        [0, heightFt - BEAM / 2, -hd + BEAM / 2, spanFt, BEAM, BEAM],
        [0, heightFt - BEAM / 2, hd - BEAM / 2, spanFt, BEAM, BEAM],
        [-hw + BEAM / 2, heightFt - BEAM / 2, 0, BEAM, BEAM, depthFt],
        [hw - BEAM / 2, heightFt - BEAM / 2, 0, BEAM, BEAM, depthFt],
      ].map((b, i) => (
        <mesh key={i} position={[b[0], b[1], b[2]]} material={mat} castShadow receiveShadow>
          <boxGeometry args={[b[3], b[4], b[5]]} />
        </mesh>
      ))}
    </group>
  );
}

function buildPlateMaterial(hex: string) {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(hex),
    metalness: 0.2,
    roughness: 0.65,
    side: THREE.DoubleSide,
  });
}

function useExtrudedPlate({
  svgUrl,
  plateWidthIn = 60,
  plateLengthIn = 120,
  thicknessIn = THICK_IN,
  mirror = false,
  plateColorHex = '#0B0B0B',
}: {
  svgUrl: string;
  plateWidthIn?: number;
  plateLengthIn?: number;
  thicknessIn?: number;
  mirror?: boolean;
  plateColorHex?: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const plateMatRef = useRef(buildPlateMaterial(plateColorHex));

  useEffect(() => {
    if (!plateMatRef.current) return;
    plateMatRef.current.color.set(plateColorHex);
    if (groupRef.current) {
      groupRef.current.traverse((o) => {
        if (o instanceof THREE.Mesh) o.material = plateMatRef.current;
      });
    }
  }, [plateColorHex]);

  useEffect(() => {
    let cancelled = false;
    const loader = new SVGLoader();

    loader.load(
      svgUrl,
      (data) => {
        if (cancelled) return;

        const svgEl = data.xml instanceof XMLDocument ? data.xml.documentElement : (data.xml as SVGSVGElement | null);
        const vb = (svgEl as SVGSVGElement)?.viewBox?.baseVal || { width: 4320, height: 8640, x: 0, y: 0 };
        const sx = plateWidthIn / Math.max(1e-6, vb.width);
        const sy = plateLengthIn / Math.max(1e-6, vb.height);

        const group = new THREE.Group();

        data.paths.forEach((p) => {
          const fill = (p.userData as { style?: { fill?: string } })?.style?.fill;
          if (fill === 'none') return;

          const shapes = SVGLoader.createShapes(p);
          shapes.forEach((shape) => {
            const geom = new THREE.ExtrudeGeometry(shape, {
              depth: thicknessIn,
              bevelEnabled: false,
            });
            geom.scale(sx, sy, 1);
            geom.translate(-plateWidthIn / 2, -plateLengthIn / 2, 0);

            const mesh = new THREE.Mesh(geom, plateMatRef.current);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            group.add(mesh);
          });
        });

        if (mirror) group.scale.x = -1;

        if (groupRef.current) {
          while (groupRef.current.children.length) {
            groupRef.current.remove(groupRef.current.children[0]);
          }
          groupRef.current.add(group);
        }
      },
      undefined,
      (err) => console.error('SVG load error:', err)
    );

    return () => {
      cancelled = true;
      if (groupRef.current) {
        while (groupRef.current.children.length) {
          groupRef.current.remove(groupRef.current.children[0]);
        }
      }
    };
  }, [svgUrl, plateWidthIn, plateLengthIn, thicknessIn, mirror]);

  return groupRef;
}

function Plate({
  svgUrl,
  widthIn,
  lengthIn,
  mirror,
  plateColorHex,
}: {
  svgUrl: string;
  widthIn: number;
  lengthIn: number;
  mirror: boolean;
  plateColorHex: string;
}) {
  const ref = useExtrudedPlate({
    svgUrl,
    plateWidthIn: widthIn,
    plateLengthIn: lengthIn,
    thicknessIn: THICK_IN,
    mirror,
    plateColorHex,
  });
  return <group ref={ref} scale={[IN, IN, IN]} />;
}

function scoreEdge(edgeFt: number) {
  const within = edgeFt >= EDGE_MIN_FT && edgeFt <= EDGE_MAX_FT;
  const dist = Math.abs(edgeFt - EDGE_TARGET_FT);
  return { within, dist };
}

function pickWidthLayout(spanFt: number, seamFt: number) {
  const candidates: { N: number; edgeW: number; within: boolean; dist: number }[] = [];
  const maxInterior = Math.max(1, Math.floor((spanFt - seamFt) / (PANEL_W_FT + seamFt)));

  for (let N = 1; N <= maxInterior; N++) {
    const edgeW = (spanFt - N * PANEL_W_FT - (N + 1) * seamFt) / 2;
    if (edgeW < -1e-6) continue;
    const { within, dist } = scoreEdge(edgeW);
    candidates.push({ N, edgeW: Math.max(0, edgeW), within, dist });
  }

  if (candidates.length === 0) return { interiorCols: 1, edgeW: 0 };

  candidates.sort((a, b) => {
    if (a.within !== b.within) return a.within ? -1 : 1;
    if (a.dist !== b.dist) return a.dist - b.dist;
    return a.N - b.N;
  });

  return { interiorCols: candidates[0].N, edgeW: candidates[0].edgeW };
}

function pickDepthLayout(depthFt: number, seamFt: number) {
  const options: { L: number; interiorRows: number; edgeL: number; within: boolean; dist: number }[] = [];

  for (const L of ALLOWED_LENGTHS_FT) {
    const maxInterior = Math.max(1, Math.floor((depthFt - seamFt) / (L + seamFt)));

    for (let N = 1; N <= maxInterior; N++) {
      const edgeL = (depthFt - N * L - (N + 1) * seamFt) / 2;
      if (edgeL < -1e-6) continue;
      const { within, dist } = scoreEdge(edgeL);
      options.push({
        L,
        interiorRows: N,
        edgeL: Math.max(0, edgeL),
        within,
        dist,
      });
    }
  }

  if (options.length === 0) {
    return { L: ALLOWED_LENGTHS_FT[ALLOWED_LENGTHS_FT.length - 1], interiorRows: 1, edgeL: 0 };
  }

  options.sort((a, b) => {
    if (a.within !== b.within) return a.within ? -1 : 1;
    if (a.dist !== b.dist) return a.dist - b.dist;
    if (a.interiorRows !== b.interiorRows) return a.interiorRows - b.interiorRows;
    return b.L - a.L;
  });

  const best = options[0];
  return { L: best.L, interiorRows: best.interiorRows, edgeL: best.edgeL };
}

function Panels({
  spanFt,
  depthFt,
  roofY,
  svgUrl,
  plateColorHex,
}: {
  spanFt: number;
  depthFt: number;
  roofY: number;
  svgUrl: string;
  plateColorHex: string;
}) {
  const { interiorCols, edgeW } = useMemo(() => pickWidthLayout(spanFt, SEAM_FT), [spanFt]);

  const colWidthsFt = useMemo(() => {
    const arr: number[] = [];
    if (edgeW > 1e-6) arr.push(edgeW);
    for (let i = 0; i < interiorCols; i++) arr.push(PANEL_W_FT);
    if (edgeW > 1e-6) arr.push(edgeW);
    return arr;
  }, [interiorCols, edgeW]);

  const { L: panelL_FT, interiorRows, edgeL } = useMemo(() => pickDepthLayout(depthFt, SEAM_FT), [depthFt]);

  const rowLengthsFt = useMemo(() => {
    const arr: number[] = [];
    if (edgeL > 1e-6) arr.push(edgeL);
    for (let j = 0; j < interiorRows; j++) arr.push(panelL_FT);
    if (edgeL > 1e-6) arr.push(edgeL);
    return arr;
  }, [interiorRows, edgeL, panelL_FT]);

  const totalCols = colWidthsFt.length;
  const totalRows = rowLengthsFt.length;

  const xCenters = useMemo(() => {
    const centers: number[] = [];
    let x = -spanFt / 2;
    for (let i = 0; i < totalCols; i++) {
      const w = colWidthsFt[i];
      x += w / 2;
      centers.push(x);
      x += w / 2;
      if (i < totalCols - 1) x += SEAM_FT;
    }
    return centers;
  }, [colWidthsFt, spanFt, totalCols]);

  const zCenters = useMemo(() => {
    const centers: number[] = [];
    let z = -depthFt / 2;
    for (let j = 0; j < totalRows; j++) {
      const l = rowLengthsFt[j];
      z += l / 2;
      centers.push(z);
      z += l / 2;
      if (j < totalRows - 1) z += SEAM_FT;
    }
    return centers;
  }, [rowLengthsFt, depthFt, totalRows]);

  return (
    <group position={[0, roofY, 0]}>
      {xCenters.map((xc, i) =>
        zCenters.map((zc, j) => {
          const widthFt = colWidthsFt[i];
          const lengthFt = rowLengthsFt[j];
          const widthIn = widthFt * 12;
          const lengthIn = lengthFt * 12;
          const mirror = i % 2 === 1;

          return (
            <group key={`${i}-${j}`} position={[xc, 0, zc]} rotation={[-Math.PI / 2, 0, 0]}>
              <Plate
                svgUrl={svgUrl}
                widthIn={widthIn}
                lengthIn={lengthIn}
                mirror={mirror}
                plateColorHex={plateColorHex}
              />
            </group>
          );
        })
      )}
    </group>
  );
}

function Rig({ cfg, autoRotate }: { cfg: PergolaConfig; autoRotate?: boolean }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(10, 12, 16);
    camera.lookAt(0, (cfg?.height || 10) * 0.5, 0);
  }, [camera, cfg?.height]);

  return (
    <OrbitControls
      autoRotate={autoRotate}
      autoRotateSpeed={0.5}
      enableDamping
      dampingFactor={0.08}
      minDistance={6}
      maxDistance={50}
      minPolarAngle={0.2}
      maxPolarAngle={Math.PI / 2.05}
      target={[0, (cfg?.height || 10) / 2, 0]}
      makeDefault
    />
  );
}

function createConcreteTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#c4c4c0';
  ctx.fillRect(0, 0, size, size);
  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const n = (Math.random() - 0.5) * 18;
    data[i] = Math.max(0, Math.min(255, data[i] + n));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + n));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + n));
  }
  ctx.putImageData(imgData, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(40, 40);
  return tex;
}

function Ground() {
  const mat = useMemo(() => {
    const texture = createConcreteTexture();
    return new THREE.MeshStandardMaterial({
      map: texture ?? undefined,
      color: texture ? undefined : '#c4c4c0',
      metalness: 0,
      roughness: 1,
    });
  }, []);
  return (
    <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={mat}>
      <planeGeometry args={[200, 200]} />
    </mesh>
  );
}

function HouseBackdrop({ spanFt, depthFt, heightFt }: { spanFt: number; depthFt: number; heightFt: number }) {
  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#e8e4dc',
        transparent: true,
        opacity: 0.07,
        side: THREE.DoubleSide,
      }),
    []
  );
  const wallW = Math.max(spanFt * 2, 40);
  const wallH = heightFt * 2.5;
  const z = -depthFt / 2 - 12;
  return (
    <mesh position={[0, heightFt / 2, z]} material={mat}>
      <planeGeometry args={[wallW, wallH]} />
    </mesh>
  );
}

interface PergolaViewer3DProps {
  config?: Partial<PergolaConfig>;
  autoRotate?: boolean;
  onScreenshot?: (dataUrl: string) => void;
  showSnapshot?: boolean;
}

const PergolaViewer3D = forwardRef<{ snapshot: () => string | null }, PergolaViewer3DProps>(function PergolaViewer3D(
  {
    config = { span: 12, depth: 12, height: 10, colorId: 'black', roofDesignId: 'palmleaf' },
    autoRotate = false,
    onScreenshot,
    showSnapshot = false,
  },
  ref
) {
  const [glCanvas, setGlCanvas] = useState<HTMLCanvasElement | null>(null);

  const doSnapshot = useCallback(() => {
    if (!glCanvas) return null;
    const dataURL = glCanvas.toDataURL('image/png');
    onScreenshot?.(dataURL);
    return dataURL;
  }, [glCanvas, onScreenshot]);

  useImperativeHandle(ref, () => ({ snapshot: () => doSnapshot() }), [doSnapshot]);

  const fullConfig: PergolaConfig = {
    span: config.span ?? 12,
    depth: config.depth ?? 12,
    height: config.height ?? 10,
    colorId: config.colorId ?? 'black',
    roofDesignId: config.roofDesignId ?? 'palmleaf',
  };

  const frameColor = colorHex(fullConfig.colorId) || '#111';
  const plateColorHex = frameColor;
  const design = getDesign(fullConfig.roofDesignId);
  const roofY = fullConfig.height;

  const envWantsSnapshot =
    typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SHOW_SNAPSHOT === 'true';

  return (
    <div className="relative h-[600px] rounded-2xl border border-white/20 overflow-hidden bg-black/20">
      <Canvas
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        onCreated={({ gl, scene }) => {
          setGlCanvas(gl.domElement);
          scene.background = new THREE.Color('#ffffff');
        }}
        shadows
        dpr={[1, 2]}
        camera={{ fov: 45, near: 0.1, far: 1000, position: [10, 12, 16] }}
      >
        <ambientLight intensity={0.45} />
        <hemisphereLight args={['#ffffff', '#b5b5b5', 0.5]} />
        <directionalLight
          position={[10, 18, 12]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-near={0.5}
          shadow-camera-far={80}
          shadow-camera-left={-40}
          shadow-camera-right={40}
          shadow-camera-top={40}
          shadow-camera-bottom={-40}
        />

        <Rig cfg={fullConfig} autoRotate={autoRotate} />
        <Ground />
        <ContactShadows
          position={[0, -0.015, 0]}
          opacity={0.35}
          scale={Math.max(fullConfig.span, fullConfig.depth) * 2.5}
          blur={2}
          far={1.5}
          color="#1a1a1a"
        />
        <HouseBackdrop
          spanFt={fullConfig.span}
          depthFt={fullConfig.depth}
          heightFt={fullConfig.height}
        />

        <group>
          <Frame
            spanFt={fullConfig.span}
            depthFt={fullConfig.depth}
            heightFt={fullConfig.height}
            color={frameColor}
          />
          <Panels
            spanFt={fullConfig.span}
            depthFt={fullConfig.depth}
            roofY={roofY}
            svgUrl={design.svg}
            plateColorHex={plateColorHex}
          />
        </group>
      </Canvas>

      {(showSnapshot || envWantsSnapshot) && (
        <button
          onClick={doSnapshot}
          className="absolute bottom-3 right-3 z-10 text-xs px-2 py-1 rounded border border-white/30 bg-white/10 text-white hover:bg-white/20"
        >
          Save Concept Image
        </button>
      )}
    </div>
  );
});

export default PergolaViewer3D;
