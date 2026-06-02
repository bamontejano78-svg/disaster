import { useState, useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';

interface GameHeaderProps {
  onOpenInventory: () => void;
  onOpenShelter: () => void;
  onOpenMissions: () => void;
  onOpenTrading: () => void;
  onOpenCommunityHub: () => void;
  onOpenCompanions: () => void;
  onOpenJournal: () => void;
}

export default function GameHeader({ onOpenInventory, onOpenShelter, onOpenMissions, onOpenTrading, onOpenCommunityHub, onOpenCompanions, onOpenJournal }: GameHeaderProps) {
  const { state, resetGame } = useGame();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const totalResources = Object.values(state.resources).reduce(
    (a, b) => a + b,
    0
  );

  // Cerrar el menú "Más" al hacer click fuera
  useEffect(() => {
    if (!showMoreMenu) return;
    const handler = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showMoreMenu]);

  const handleMoreAction = (fn: () => void) => {
    fn();
    setShowMoreMenu(false);
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-[1500] pointer-events-none">
      <div className="pointer-events-auto glass-strong" style={{ borderRadius: '0 0 20px 20px', margin: '0 0 0 0' }}>
        {/* Top accent line */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />

        <div className="px-3 pt-3 pb-3">
          <div className="flex items-center justify-between">
            {/* Game title */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/5 flex items-center justify-center text-lg border border-red-500/20 animate-float-slow">
                🌍
              </div>
              <div>
                <h1 className="text-sm font-black text-white tracking-tight leading-tight">
                  <span className="text-gradient-red">7</span>
                  <span className="text-white/60 font-light mx-1">·</span>
                  <span className="text-white/80">DAYS FOR</span>
                  <span className="text-gradient-red ml-1">DISASTER</span>
                </h1>
                <p className="text-[10px] text-white/30 tracking-wider">
                  <span className="text-gradient-cyan font-bold">Semana {state.week}</span>
                  <span className="mx-1.5">·</span>
                  Día {state.day}/7
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1.5">
              {/* Siempre visibles */}
              <button
                onClick={onOpenShelter}
                className="group relative bg-blue-900/40 hover:bg-blue-800/60 rounded-full px-3 py-1.5 flex items-center gap-1.5 transition-all duration-200 text-xs font-bold text-white border border-blue-700/30 hover:border-blue-600/50 hover:shadow-lg hover:shadow-blue-500/10 active:scale-95"
                title="Refugio"
              >
                <span className="text-sm">🏠</span>
                <span className="hidden sm:inline">Refugio</span>
              </button>
              <button
                onClick={onOpenInventory}
                className="group relative bg-gray-800/60 hover:bg-gray-700/80 rounded-full px-3 py-1.5 flex items-center gap-1.5 transition-all duration-200 text-xs font-bold text-white border border-white/10 hover:border-white/20 hover:shadow-lg active:scale-95"
                title="Inventario"
              >
                <span className="text-sm">🎒</span>
                <span className="font-mono text-gradient-amber">{totalResources}</span>
              </button>

              {/* Botones extra visibles solo en pantallas sm+ */}
              <button
                onClick={onOpenMissions}
                className="hidden sm:flex bg-gray-800/60 hover:bg-gray-700/80 rounded-full w-8 h-8 items-center justify-center text-xs transition-all duration-200 border border-white/10 hover:border-white/20 active:scale-90"
                title="Misiones"
              >
                📋
              </button>
              <button
                onClick={onOpenTrading}
                className="hidden sm:flex bg-gray-800/60 hover:bg-amber-900/40 rounded-full w-8 h-8 items-center justify-center text-xs transition-all duration-200 border border-white/10 hover:border-amber-500/30 active:scale-90"
                title="Trueque"
              >
                ⚖️
              </button>
              <button
                onClick={onOpenCommunityHub}
                className="hidden sm:flex bg-gray-800/60 hover:bg-purple-900/40 rounded-full w-8 h-8 items-center justify-center text-xs transition-all duration-200 border border-white/10 hover:border-purple-500/30 active:scale-90"
                title="Centro Comunitario"
              >
                🏛️
              </button>
              <button
                onClick={onOpenCompanions}
                className="hidden sm:flex bg-gray-800/60 hover:bg-purple-900/40 rounded-full w-8 h-8 items-center justify-center text-xs transition-all duration-200 border border-white/10 hover:border-purple-500/30 active:scale-90"
                title="Compañeros"
              >
                🐾
              </button>
              <button
                onClick={onOpenJournal}
                className="hidden sm:flex bg-gray-800/60 hover:bg-amber-900/40 rounded-full w-8 h-8 items-center justify-center text-xs transition-all duration-200 border border-white/10 hover:border-amber-500/30 active:scale-90"
                title="Diario"
              >
                📖
              </button>

              {/* Botón "Más" — solo en móvil */}
              <div className="relative sm:hidden" ref={moreMenuRef}>
                <button
                  onClick={() => setShowMoreMenu(v => !v)}
                  className={`bg-gray-800/60 rounded-full w-8 h-8 flex items-center justify-center text-xs transition-all duration-200 border active:scale-90 ${showMoreMenu ? 'border-white/30 bg-white/10' : 'border-white/10 hover:border-white/20'}`}
                  title="Más opciones"
                >
                  ⋯
                </button>
                {showMoreMenu && (
                  <div className="absolute right-0 top-10 z-[2000] glass-strong rounded-2xl border border-white/10 p-2 flex flex-col gap-1 min-w-[160px] shadow-2xl animate-zoom-in">
                    <button onClick={() => handleMoreAction(onOpenMissions)} className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-white text-xs font-bold transition-all active:scale-95 text-left">
                      <span>📋</span> Misiones
                    </button>
                    <button onClick={() => handleMoreAction(onOpenTrading)} className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-amber-900/30 text-white text-xs font-bold transition-all active:scale-95 text-left">
                      <span>⚖️</span> Trueque
                    </button>
                    <button onClick={() => handleMoreAction(onOpenCommunityHub)} className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-purple-900/30 text-white text-xs font-bold transition-all active:scale-95 text-left">
                      <span>🏛️</span> Hub Comunitario
                    </button>
                    <button onClick={() => handleMoreAction(onOpenCompanions)} className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-purple-900/30 text-white text-xs font-bold transition-all active:scale-95 text-left">
                      <span>🐾</span> Compañeros
                    </button>
                    <button onClick={() => handleMoreAction(onOpenJournal)} className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-amber-900/30 text-white text-xs font-bold transition-all active:scale-95 text-left">
                      <span>📖</span> Diario
                    </button>
                  </div>
                )}
              </div>

              {/* Reset con confirmación */}
              <button
                onClick={() => setShowResetConfirm(true)}
                className="bg-gray-800/60 hover:bg-red-900/40 rounded-full w-8 h-8 flex items-center justify-center text-xs transition-all duration-200 border border-white/10 hover:border-red-500/30 active:scale-90"
                title="Reiniciar juego"
              >
                <span>🔄</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación de reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/70 backdrop-blur-sm pointer-events-auto animate-fade-in">
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 border border-red-500/30 rounded-2xl p-6 max-w-xs w-full mx-4 shadow-2xl animate-zoom-in">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🔄</div>
              <h3 className="text-white font-black text-lg">¿Reiniciar partida?</h3>
              <p className="text-gray-400 text-xs mt-2 leading-relaxed">
                Se perderá el progreso de la semana actual. Tu <span className="text-amber-400 font-bold">récord</span> y <span className="text-purple-400 font-bold">logros</span> se conservan.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 font-bold text-sm transition-all border border-white/10 active:scale-95"
              >
                Cancelar
              </button>
              <button
                onClick={() => { resetGame(); setShowResetConfirm(false); }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold text-sm transition-all shadow-lg shadow-red-500/20 active:scale-95"
              >
                Reiniciar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
