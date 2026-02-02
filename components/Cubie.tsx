import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Group, Quaternion } from 'three';
import { RoundedBox } from '@react-three/drei';
import { CubieState, CUBE_GAP, CUBE_SIZE, Move } from '../types';

interface CubieProps {
  data: CubieState;
  currentMove: Move | null;
  animationProgress: number; // 0 to 1
}

// Modern Vibrant "Stickerless" Colors
const COLORS = {
  U: '#ecf0f1', // White (Soft)
  D: '#f1c40f', // Yellow (Vibrant)
  R: '#e74c3c', // Red (Flat UI)
  L: '#e67e22', // Orange (Carrot)
  F: '#2ecc71', // Green (Emerald)
  B: '#3498db', // Blue (Peter River)
  CORE: '#2c3e50' // Dark Blue-Grey Core (more aesthetically pleasing than pure black)
};

const Cubie: React.FC<CubieProps> = ({ data, currentMove, animationProgress }) => {
  const groupRef = useRef<Group>(null);

  const isMoving = useMemo(() => {
    if (!currentMove) return false;
    const pos = data.position[currentMove.axis] as number;
    return Math.abs(pos - currentMove.slice) < 0.1;
  }, [currentMove, data.position]);

  useFrame(() => {
    if (!groupRef.current) return;

    groupRef.current.position.copy(data.position).multiplyScalar(CUBE_SIZE + CUBE_GAP);
    groupRef.current.rotation.copy(data.rotation);

    if (isMoving && currentMove) {
        const angle = (Math.PI / 2) * currentMove.direction * animationProgress;
        const axisVector = new Vector3(
            currentMove.axis === 'x' ? 1 : 0,
            currentMove.axis === 'y' ? 1 : 0,
            currentMove.axis === 'z' ? 1 : 0
        );
        
        const tempPos = data.position.clone().multiplyScalar(CUBE_SIZE + CUBE_GAP);
        tempPos.applyAxisAngle(axisVector, angle);
        groupRef.current.position.copy(tempPos);

        const q = new Quaternion().setFromEuler(data.rotation);
        const qRot = new Quaternion().setFromAxisAngle(axisVector, angle);
        q.premultiply(qRot);
        groupRef.current.rotation.setFromQuaternion(q);
    }
  });

  const { x, y, z } = data.initialPosition;
  
  // Shared material props for that nice plastic look
  const materialProps = {
    roughness: 0.1,  // Glossy
    metalness: 0.0,  // Plastic
    envMapIntensity: 1.5, // Reflect environment
  };

  return (
    <group ref={groupRef}>
      {/* Increased smoothness and slightly larger radius for a friendlier look */}
      <RoundedBox args={[CUBE_SIZE, CUBE_SIZE, CUBE_SIZE]} radius={0.12} smoothness={8}>
        <meshStandardMaterial attach="material-0" color={x === 1 ? COLORS.R : COLORS.CORE} {...materialProps} />
        <meshStandardMaterial attach="material-1" color={x === -1 ? COLORS.L : COLORS.CORE} {...materialProps} />
        <meshStandardMaterial attach="material-2" color={y === 1 ? COLORS.U : COLORS.CORE} {...materialProps} />
        <meshStandardMaterial attach="material-3" color={y === -1 ? COLORS.D : COLORS.CORE} {...materialProps} />
        <meshStandardMaterial attach="material-4" color={z === 1 ? COLORS.F : COLORS.CORE} {...materialProps} />
        <meshStandardMaterial attach="material-5" color={z === -1 ? COLORS.B : COLORS.CORE} {...materialProps} />
      </RoundedBox>
    </group>
  );
};

export default Cubie;