import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function Model({ url }) {
  const gltf = useGLTF(url);
  return <primitive object={gltf.scene} />;
}

export default function ModelViewer({ modelUrl }) {
  const memoizedUrl = useMemo(() => modelUrl, [modelUrl]);

  return (
    <div style={{ width: '100%', height: '700px', marginTop: '2rem' }}>
      <Suspense fallback={<div style={{ color: 'white' }}>Loading...</div>}>
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 2, 2]} />
          <Model url={memoizedUrl} />
          <OrbitControls />
        </Canvas>
      </Suspense>
    </div>
  );
}