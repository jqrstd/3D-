import { Vector3, Euler } from 'three';

export type Axis = 'x' | 'y' | 'z';

export interface CubieState {
  id: number;
  position: Vector3;
  rotation: Euler;
  initialPosition: Vector3; // To track original color mapping
}

export interface Move {
  axis: Axis;
  slice: number; // -1, 0, 1
  direction: number; // 1 (clockwise) or -1 (counter-clockwise)
  name: string;
}

export const CUBE_GAP = 0.02;
export const CUBE_SIZE = 1;
export const ANIMATION_SPEED = 0.5; // Seconds per move