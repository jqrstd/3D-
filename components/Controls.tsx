import React, { useEffect } from 'react';
import { useCubeStore } from '../store/useCubeStore';
import { Move } from '../types';

const Controls: React.FC = () => {
  const { addMove, scramble, reset, isAnimating, moveQueue } = useCubeStore();

  const handleMove = (name: string, axis: 'x'|'y'|'z', slice: number, direction: number) => {
    const move: Move = { name, axis, slice, direction };
    addMove(move);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const shift = e.shiftKey;
      const key = e.key.toUpperCase();
      switch(key) {
        case 'R': handleMove(shift ? "R'" : "R", 'x', 1, shift ? 1 : -1); break;
        case 'L': handleMove(shift ? "L'" : "L", 'x', -1, shift ? -1 : 1); break;
        case 'U': handleMove(shift ? "U'" : "U", 'y', 1, shift ? 1 : -1); break;
        case 'D': handleMove(shift ? "D'" : "D", 'y', -1, shift ? -1 : 1); break;
        case 'F': handleMove(shift ? "F'" : "F", 'z', 1, shift ? 1 : -1); break;
        case 'B': handleMove(shift ? "B'" : "B", 'z', -1, shift ? -1 : 1); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isBusy = isAnimating || moveQueue.length > 0;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 z-10 font-sans">
      
      {/* Header */}
      <div className="pointer-events-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 drop-shadow-sm">
            3D 魔方
          </h1>
          <p className="text-white/60 text-sm mt-1 font-medium tracking-wide">
            极简 · 顺滑 · 互动
          </p>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="pointer-events-auto w-full flex flex-col items-center gap-6 mb-4">
        
        {/* Main Actions */}
        <div className="flex gap-4 p-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
          <ActionButton onClick={scramble} disabled={isBusy} label="随机打乱" icon="🎲" primary />
          <ActionButton onClick={reset} disabled={isBusy} label="重置魔方" icon="🔄" />
        </div>

        {/* Control Pad */}
        <div className="bg-black/40 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-2xl">
          <div className="grid grid-cols-6 gap-3">
             {/* Labels Row */}
             {['L', 'R', 'U', 'D', 'F', 'B'].map(label => (
                <div key={label} className="text-center text-[10px] text-white/40 font-bold uppercase tracking-widest">{label}</div>
             ))}

            {/* Standard Moves */}
            <MoveBtn move="L" onClick={() => handleMove('L', 'x', -1, 1)} />
            <MoveBtn move="R" onClick={() => handleMove('R', 'x', 1, -1)} />
            <MoveBtn move="U" onClick={() => handleMove('U', 'y', 1, -1)} />
            <MoveBtn move="D" onClick={() => handleMove('D', 'y', -1, 1)} />
            <MoveBtn move="F" onClick={() => handleMove('F', 'z', 1, -1)} />
            <MoveBtn move="B" onClick={() => handleMove('B', 'z', -1, 1)} />

            {/* Inverse Moves */}
            <MoveBtn move="L'" inverse onClick={() => handleMove("L'", 'x', -1, -1)} />
            <MoveBtn move="R'" inverse onClick={() => handleMove("R'", 'x', 1, 1)} />
            <MoveBtn move="U'" inverse onClick={() => handleMove("U'", 'y', 1, 1)} />
            <MoveBtn move="D'" inverse onClick={() => handleMove("D'", 'y', -1, -1)} />
            <MoveBtn move="F'" inverse onClick={() => handleMove("F'", 'z', 1, 1)} />
            <MoveBtn move="B'" inverse onClick={() => handleMove("B'", 'z', -1, -1)} />
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionButton: React.FC<{ onClick: () => void, disabled: boolean, label: string, icon: string, primary?: boolean }> = ({ onClick, disabled, label, icon, primary }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 active:scale-95
      ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}
      ${primary 
        ? 'bg-white text-gray-900 hover:bg-gray-100' 
        : 'bg-white/10 text-white hover:bg-white/20'}
    `}
  >
    <span className="text-lg">{icon}</span>
    <span className="text-sm">{label}</span>
  </button>
);

const MoveBtn: React.FC<{ move: string, inverse?: boolean, onClick: () => void }> = ({ move, inverse, onClick }) => (
  <button
    onClick={onClick}
    className={`
      w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-bold text-sm sm:text-base transition-all duration-150
      border border-white/5 active:scale-90
      ${inverse 
        ? 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80' 
        : 'bg-white/10 text-white hover:bg-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'}
    `}
  >
    {move}
  </button>
);

export default Controls;