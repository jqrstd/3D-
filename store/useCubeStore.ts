import { create } from 'zustand';
import { Vector3, Euler, Quaternion } from 'three';
import { CubieState, Move } from '../types';

interface CubeStore {
  cubies: CubieState[];
  isAnimating: boolean;
  currentMove: Move | null;
  moveQueue: Move[];
  animationProgress: number;
  
  // Actions
  addMove: (move: Move) => void;
  setAnimating: (isAnimating: boolean) => void;
  processNextMove: () => void;
  updateAnimationProgress: (delta: number) => void;
  finishMove: () => void;
  reset: () => void;
  scramble: () => void;
}

const generateInitialState = (): CubieState[] => {
  const cubies: CubieState[] = [];
  let id = 0;
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const pos = new Vector3(x, y, z);
        cubies.push({
          id: id++,
          position: pos,
          rotation: new Euler(0, 0, 0),
          initialPosition: pos.clone(),
        });
      }
    }
  }
  return cubies;
};

const POSSIBLE_MOVES: Move[] = [
  { axis: 'x', slice: 1, direction: -1, name: 'R' },
  { axis: 'x', slice: 1, direction: 1, name: "R'" },
  { axis: 'x', slice: -1, direction: 1, name: 'L' },
  { axis: 'x', slice: -1, direction: -1, name: "L'" },
  { axis: 'y', slice: 1, direction: -1, name: 'U' },
  { axis: 'y', slice: 1, direction: 1, name: "U'" },
  { axis: 'y', slice: -1, direction: 1, name: 'D' },
  { axis: 'y', slice: -1, direction: -1, name: "D'" },
  { axis: 'z', slice: 1, direction: -1, name: 'F' },
  { axis: 'z', slice: 1, direction: 1, name: "F'" },
  { axis: 'z', slice: -1, direction: 1, name: 'B' },
  { axis: 'z', slice: -1, direction: -1, name: "B'" },
];

export const useCubeStore = create<CubeStore>((set, get) => ({
  cubies: generateInitialState(),
  isAnimating: false,
  currentMove: null,
  moveQueue: [],
  animationProgress: 0,

  addMove: (move) => {
    const { isAnimating, moveQueue } = get();
    if (!isAnimating && moveQueue.length === 0) {
      set({ currentMove: move, isAnimating: true, animationProgress: 0 });
    } else {
      set({ moveQueue: [...moveQueue, move] });
    }
  },

  setAnimating: (isAnimating) => set({ isAnimating }),

  processNextMove: () => {
    const { moveQueue } = get();
    if (moveQueue.length > 0) {
      const nextMove = moveQueue[0];
      set({
        currentMove: nextMove,
        moveQueue: moveQueue.slice(1),
        isAnimating: true,
        animationProgress: 0,
      });
    } else {
      set({ isAnimating: false, currentMove: null });
    }
  },

  updateAnimationProgress: (delta) => {
    set((state) => ({ animationProgress: state.animationProgress + delta }));
  },

  finishMove: () => {
    const { cubies, currentMove } = get();
    if (!currentMove) return;

    // Apply the rotation mathematically to the static state
    const angle = (Math.PI / 2) * currentMove.direction;
    const axisVector = new Vector3(
      currentMove.axis === 'x' ? 1 : 0,
      currentMove.axis === 'y' ? 1 : 0,
      currentMove.axis === 'z' ? 1 : 0
    );

    const newCubies = cubies.map((cubie) => {
      // Check if cubie is in the moving slice
      const posComponent = cubie.position[currentMove.axis] as number;
      // Use small epsilon for float comparison
      if (Math.abs(posComponent - currentMove.slice) < 0.1) {
        
        // Rotate Position
        const newPos = cubie.position.clone();
        newPos.applyAxisAngle(axisVector, angle);
        newPos.x = Math.round(newPos.x);
        newPos.y = Math.round(newPos.y);
        newPos.z = Math.round(newPos.z);

        // Rotate Orientation (Quaternion)
        const q = new Quaternion();
        q.setFromEuler(cubie.rotation);
        const qRot = new Quaternion();
        qRot.setFromAxisAngle(axisVector, angle);
        q.premultiply(qRot); // Apply rotation in world space equivalent
        
        const newEuler = new Euler();
        newEuler.setFromQuaternion(q);

        return {
          ...cubie,
          position: newPos,
          rotation: newEuler,
        };
      }
      return cubie;
    });

    set({ cubies: newCubies });
    get().processNextMove();
  },

  reset: () => {
    set({
      cubies: generateInitialState(),
      moveQueue: [],
      currentMove: null,
      isAnimating: false,
      animationProgress: 0
    });
  },

  scramble: () => {
    const moves: Move[] = [];
    for (let i = 0; i < 20; i++) {
      const randomMove = POSSIBLE_MOVES[Math.floor(Math.random() * POSSIBLE_MOVES.length)];
      moves.push(randomMove);
    }
    // Append to queue
    const { isAnimating, moveQueue } = get();
    if (!isAnimating && moveQueue.length === 0) {
      set({ currentMove: moves[0], moveQueue: moves.slice(1), isAnimating: true, animationProgress: 0 });
    } else {
      set({ moveQueue: [...moveQueue, ...moves] });
    }
  },
}));