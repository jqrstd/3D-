import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import RubiksCube from './components/RubiksCube';
import Controls from './components/Controls';
import { Loader } from '@react-three/drei';

function App() {
  return (
    <div className="relative w-full h-screen">
      <Controls />
      
      <Canvas 
        camera={{ position: [6, 6, 8], fov: 40 }}
        dpr={[1, 2]} // Support high-res displays
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <RubiksCube />
        </Suspense>
      </Canvas>
      <Loader 
        containerStyles={{ background: 'radial-gradient(circle at 50% 0%, #2e3b4e 0%, #111827 80%)' }}
        dataInterpolation={(p) => `Loading ${p.toFixed(0)}%`} 
        initialState={(active) => active}
      />
    </div>
  );
}

export default App;