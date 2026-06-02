import { useGame } from '../context/GameContext';
import { COMPANIONS, getCompanion } from '../data/companions';
import { RESOURCE_ICONS } from '../types/game';
import type { ResourceType } from '../types/game';

interface Props {
  onClose: () => void;
}

function NetBalance({ passiveBonus, cost }: { passiveBonus: Partial<Record<string, number>>; cost: Partial<Record<string, number>> }) {
  const net: Record<string, number> = {};
  for (const [k, v] of Object.entries(passiveBonus)) {
    net[k] = (net[k] ?? 0) + (v as number);
  }
  for (const [k, v] of Object.entries(cost)) {
    net[k] = (net[k] ?? 0) - (v as number);
  }
  const entries = Object.entries(net).filter(([, v]) => v !== 0);
  if (entries.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {entries.map(([k, v]) => (
        <span key={k} className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded ${v > 0 ? 'text-emerald-400 bg-emerald-900/30' : 'text-red-400 bg-red-900/30'}`}>
          {RESOURCE_ICONS[k as ResourceType] ?? '📦'}{v > 0 ? '+' : ''}{v}
        </span>
      ))}
    </div>
  );
}

export default function CompanionPanel({ onClose }: Props) {
  const { state, dispatch } = useGame();
  const { activeCompanions } = state;

  const handleDismiss = (companionId: string) => {
    dispatch({ type: 'DISMISS_COMPANION', companionId });
  };

  // Compañeros disponibles (no activos)
  const availableCompanions = COMPANIONS.filter(
    c => !activeCompanions.find(ac => ac.companionId === c.id)
  );

  return (
    <div className="fixed inset-0 z-[4000] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-600/40 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl shadow-gray-900/50 animate-zoom-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 flex items-center justify-center text-lg border border-purple-500/20">
              🐾
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Compañeros</h2>
              <p className="text-[10px] text-gray-500">
                {activeCompanions.length} activo{activeCompanions.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all duration-200 text-sm border border-white/5"
          >
            ✕
          </button>
        </div>

        {activeCompanions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🐾</div>
            <p className="text-gray-400 text-sm">Sin compañeros activos</p>
            <p className="text-gray-600 text-xs mt-2">
              Mejora tus relaciones con NPCs para reclutar compañeros.
              Algunos se unirán tras encuentros especiales.
            </p>
          </div>
        ) : (
          <div className="space-y-3 mb-4">
            {activeCompanions.map((comp) => {
              const companion = getCompanion(comp.companionId);
              if (!companion) return null;

              const passiveEntries = Object.entries(companion.passiveBonus).filter(
                ([, v]) => v > 0
              );
              const costEntries = Object.entries(companion.cost).filter(([, v]) => v > 0);

              return (
                <div
                  key={comp.companionId}
                  className="p-4 rounded-xl bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-700/30"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{companion.icon}</span>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-white">{companion.name}</div>
                      <div className="text-[11px] text-gray-400">{companion.description}</div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 text-[10px] mb-3">
                    <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                      <div className="text-gray-500">Duración</div>
                      <div className="text-white font-bold">
                        {comp.weeksRemaining} sem
                      </div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                      <div className="text-gray-500">Defensa</div>
                      <div className="text-purple-400 font-bold">
                        +{companion.defenseBonus}%
                      </div>
                    </div>
                  </div>

                  {/* Passive bonus */}
                  {passiveEntries.length > 0 && (
                    <div className="text-[10px] text-emerald-400 mb-1">
                      ✦ Bonus diario:{' '}
                      {passiveEntries.map(([k, v]) => `+${v} ${k}`).join(', ')}
                    </div>
                  )}

                  {/* Cost */}
                  {costEntries.length > 0 && (
                    <div className="text-[10px] text-red-400 mb-2">
                      ✦ Coste diario:{' '}
                      {costEntries.map(([k, v]) => `-${v} ${k}`).join(', ')}
                    </div>
                  )}

                  {/* Net balance */}
                  <div className="mb-2">
                    <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Balance neto/día</div>
                    <NetBalance passiveBonus={companion.passiveBonus} cost={companion.cost} />
                  </div>

                  {/* Dismiss button */}
                  <button
                    onClick={() => handleDismiss(comp.companionId)}
                    className="w-full mt-2 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs transition-all border border-red-500/20"
                  >
                    Despedir
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Available companions section */}
        {availableCompanions.length > 0 && (
          <div className="mb-4">
            <div className="text-[10px] text-white/30 uppercase tracking-wider font-bold mb-2">Compañeros disponibles</div>
            <div className="space-y-2">
              {availableCompanions.map(companion => (
                <div key={companion.id} className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{companion.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white/70 truncate">{companion.name}</div>
                      <div className="text-[10px] text-white/30 truncate">{companion.description}</div>
                    </div>
                  </div>
                  <div className="text-[10px] text-white/30 mb-1">Balance neto/día:</div>
                  <NetBalance passiveBonus={companion.passiveBonus} cost={companion.cost} />
                  <div className="text-[10px] text-white/20 mt-1">Relación mínima: {companion.relationshipMin} pts · Duración: {companion.maxDuration} sem</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/70 font-bold transition-all duration-200 text-xs border border-white/5"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}