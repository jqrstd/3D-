import React from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float } from '@react-three/drei';
import { useCubeStore } from '../store/useCubeStore';
import Cubie from './Cubie';
import { ANIMATION_SPEED } from '../types';

const easeInOutCubic = (x: number): number => {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

const RubiksCube: React.FC = () => {
  const { cubies, currentMove, animationProgress, updateAnimationProgress, finishMove, isAnimating } = useCubeStore();

  useFrame((state, delta) => {
    if (isAnimating) {
        const progressInc = delta / ANIMATION_SPEED;
        const nextProgress = animationProgress + progressInc;

        if (nextProgress >= 1) {
            finishMove();
        } else {
            updateAnimationProgress(progressInc);
        }
    }
  });

  const smoothedProgress = easeInOutCubic(Math.min(animationProgress, 1));

  return (
    <>
      {/* Main Key Light */}
      <directionalLight position={[5, 10, 7]} intensity={1.5} castShadow />
      {/* Fill Light */}
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4c6ef5" />
      
      {/* High quality environment map for reflections */}
      <Environment preset="city" />

      {/* Float animation makes the cube feel alive */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
        <group>
          {cubies.map((cubie) => (
            <Cubie 
              key={cubie.id} 
              data={cubie} 
              currentMove={currentMove}
              animationProgress={smoothedProgress}
            />
          ))}
        </group>
      </Float>

      {/* Soft, realistic shadow below the cube */}
      <ContactShadows 
        position={[0, -2.8, 0]} 
        opacity={0.4} 
        scale={15} 
        blur={2} 
        far={5} 
        color="#000000"
      />
      
      <OrbitControls 
        enablePan={false} 
        minDistance={6} 
        maxDistance={20} 
        dampingFactor={0.05}
        autoRotate={!isAnimating} // Auto rotate when idle for aesthetic showcase
        autoRotateSpeed={0.5}
      />
    </>
  );
};

export default RubiksCube;