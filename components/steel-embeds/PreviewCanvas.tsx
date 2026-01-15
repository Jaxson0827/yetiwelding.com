'use client';

import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Group, Mesh } from 'three';
import { EmbedSpec } from '@/lib/steelEmbeds/types';
import EmbedGeometry from './EmbedGeometry';

function Model({ url }: { url: string }) {
  const groupRef = useRef<Group>(null);
  const [model, setModel] = React.useState<Group | null>(null);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(url, (gltf) => {
      setModel(gltf.scene);
    }, undefined, (error) => {
      console.error('Error loading GLB:', error);
    });
  }, [url]);

  useFrame(() => {
    if (groupRef.current && model) {
      // Auto-rotate for better visualization
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
}

export default function PreviewCanvas({ glbUrl, spec }: PreviewCanvasProps) {
  // Determine if we should render from spec or from GLB URL
  const hasValidSpec =
    spec?.plate?.length &&
    spec?.plate?.width &&
    spec?.plate?.thickness &&
    spec.plate.length > 0 &&
    spec.plate.width > 0 &&
    spec.plate.thickness > 0;

  // Priority: GLB URL takes precedence if available
  // Otherwise, use spec-based preview if valid
  const renderFromGlb = !!glbUrl;
  const renderFromSpec = hasValidSpec && !glbUrl;

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }} style={{ width: '100%', height: '100%' }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <directionalLight position={[-10, 10, -10]} intensity={0.5} />
      {renderFromGlb && glbUrl && <Model url={glbUrl} />}
      {renderFromSpec && spec && <EmbedGeometry spec={spec} />}
      <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
      <Environment preset="warehouse" />
    </Canvas>
    </div>
  );
}


