'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { EmbedSpec } from '@/lib/steelEmbeds/types';
import EmbedGeometry from './EmbedGeometry';

interface PreviewCanvasProps {
  spec: Partial<EmbedSpec>;
}

export default function PreviewCanvas({ spec }: PreviewCanvasProps) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }} style={{ width: '100%', height: '100%' }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <directionalLight position={[-10, 10, -10]} intensity={0.5} />
      <EmbedGeometry spec={spec} />
      <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
      <Environment preset="warehouse" />
    </Canvas>
    </div>
  );
}


