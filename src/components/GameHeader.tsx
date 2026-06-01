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

  const totalResources = Object.values(state.resources).reduce(
    (a, b) => a + b,
    0
  );

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
              <button
                onClick={onOpenMissions}
                className="bg-gray-800/60 hover:bg-gray-700/80 rounded-full w-8 h-8 flex items-center justify-center text-xs transition-all duration-200 border border-white/10 hover:border-white/20 active:scale-90"
                title="Misiones"
              >
                📋
              </button>
              <button
                onClick={onOpenTrading}
                className="bg-gray-800/60 hover:bg-amber-900/40 rounded-full w-8 h-8 flex items-center justify-center text-xs transition-all duration-200 border border-white/10 hover:border-amber-500/30 active:scale-90"
                title="Trueque"
              >
                ⚖️
              </button>
              <button
                onClick={onOpenCommunityHub}
                className="bg-gray-800/60 hover:bg-purple-900/40 rounded-full w-8 h-8 flex items-center justify-center text-xs transition-all duration-200 border border-white/10 hover:border-purple-500/30 active:scale-90"
                title="Centro Comunitario"
              >
                🏛️
              </button>
              <button
                onClick={onOpenCompanions}
                className="bg-gray-800/60 hover:bg-purple-900/40 rounded-full w-8 h-8 flex items-center justify-center text-xs transition-all duration-200 border border-white/10 hover:border-purple-500/30 active:scale-90"
                title="Compañeros"
              >
                🐾
              </button>
              <button
                onClick={onOpenJournal}
                className="bg-gray-800/60 hover:bg-amber-900/40 rounded-full w-8 h-8 flex items-center justify-center text-xs transition-all duration-200 border border-white/10 hover:border-amber-500/30 active:scale-90"
                title="Diario"
              >
                📖
              </button>
              <button
                onClick={resetGame}
                className="bg-gray-800/60 hover:bg-red-900/40 rounded-full w-8 h-8 flex items-center justify-center text-xs transition-all duration-200 border border-white/10 hover:border-red-500/30 active:scale-90"
                title="Reiniciar juego"
              >
                <span className="hover:animate-spin">🔄</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
