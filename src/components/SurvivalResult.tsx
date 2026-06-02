import { useGame } from '../context/GameContext';
import { DISASTERS } from '../data/disasters';
import { RESOURCE_ICONS, RESOURCE_COLORS } from '../types/game';
import type { ResourceType } from '../types/game';

export default function SurvivalResult() {
  const { state, advanceWeek, resetGame } = useGame();
  const lastRecord = state.history[state.history.length - 1];
  const disaster = DISASTERS.find((d) => d.type === state.currentDisaster);
  const survived = lastRecord?.survived ?? false;
  const outcome = lastRecord?.outcome ?? 'clean';

  if (!disaster) return null;

  const outcomeConfig = {
    clean: { icon: '🏆', label: 'Supervivencia limpia', color: 'text-emerald-300', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    damaged: { icon: '🏚️', label: 'Refugio dañado', color: 'text-amber-300', bg: 'bg-amber-500/10 border-amber-500/20' },
    injured: { icon: '🩹', label: 'Saliste herido', color: 'text-orange-300', bg: 'bg-orange-500/10 border-orange-500/20' },
    both: { icon: '💔', label: 'Refugio dañado y herido', color: 'text-red-300', bg: 'bg-red-500/10 border-red-500/20' },
    failed: { icon: '💀', label: 'Fin del juego', color: 'text-red-400', bg: 'bg-red-900/20 border-red-500/30' },
  };

  const oc = outcomeConfig[outcome] ?? outcomeConfig.clean;

  return (
    <div className="absolute inset-0 z-[3000] flex items-center justify-center p-4 bg-black/90">
      <div className="animate-fade-in-up w-full max-w-md bg-gray-900 rounded-2xl border overflow-hidden shadow-2xl">
        {/* Header */}
        <div
          className={`p-6 text-center ${
            survived
              ? 'bg-gradient-to-b from-emerald-900 to-emerald-800 border-emerald-500/50'
              : 'bg-gradient-to-b from-red-900 to-red-800 border-red-500/50'
          }`}
        >
          <div className="text-5xl mb-2">
            {survived ? oc.icon : '💀'}
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-wider">
            {survived
              ? '¡Sobreviviste a la semana!'
              : 'Fin del juego'}
          </h2>
          <p className="text-sm opacity-80 mt-1">
            {survived
              ? `Sobreviviste al ${disaster.name} de la Semana ${state.week}`
              : `El ${disaster.name} de la Semana ${state.week} fue demasiado`}
          </p>
        </div>

        {/* Outcome badge */}
        {survived && outcome !== 'clean' && (
          <div className={`mx-5 mt-4 px-4 py-3 rounded-xl border flex items-center gap-3 ${oc.bg}`}>
            <span className="text-2xl">{oc.icon}</span>
            <div>
              <div className={`text-sm font-bold ${oc.color}`}>{oc.label}</div>
              {outcome === 'damaged' && (
                <div className="text-xs text-white/50 mt-0.5">El nivel del refugio bajó 1. Necesitarás reconstruir.</div>
              )}
              {outcome === 'injured' && (
                <div className="text-xs text-white/50 mt-0.5">Estarás herido hasta el día 2 de la próxima semana. Energía reducida.</div>
              )}
              {outcome === 'both' && (
                <div className="text-xs text-white/50 mt-0.5">Refugio dañado y herido. Recupera fuerzas antes de explorar.</div>
              )}
            </div>
          </div>
        )}

        {/* Resources after */}
        <div className="p-5">
          <h4 className="text-xs text-gray-400 uppercase tracking-wider mb-3">
            Recursos restantes
          </h4>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {(Object.entries(state.resources) as [ResourceType, number][]).map(
              ([key, val]) => (
                <div
                  key={key}
                  className="flex flex-col items-center bg-gray-800/50 rounded-lg p-2 border border-gray-700/30"
                >
                  <span className="text-lg">
                    {RESOURCE_ICONS[key]}
                  </span>
                  <span
                    className="text-xs font-bold font-mono"
                    style={{ color: RESOURCE_COLORS[key] }}
                  >
                    {val}
                  </span>
                </div>
              )
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-800/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-black text-amber-400">
                {state.week}
              </div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">
                Semanas
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-black text-purple-400">
                {state.highScore}
              </div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">
                Récord
              </div>
            </div>
          </div>

          {/* Action buttons */}
          {survived ? (
            <button
              onClick={advanceWeek}
              className="w-full py-3 px-6 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold rounded-xl text-base shadow-lg shadow-amber-500/25 transition-all duration-200 active:scale-95"
            >
              🌅 Comenzar Semana {state.week + 1}
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={resetGame}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-xl text-base shadow-lg shadow-emerald-500/25 transition-all duration-200 active:scale-95"
              >
                🔄 Jugar de nuevo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
