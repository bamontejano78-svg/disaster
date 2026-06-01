import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { RESOURCE_ICONS } from '../types/game';
import type { ResourceType, Resources } from '../types/game';
import {
  SHELTER_LEVELS,
  getNextShelterLevel,
  getRecipesForLevel,
  CRAFTING_RECIPES,
  MAX_SHELTER_LEVEL,
} from '../data/shelter';
import type { ShelterLevel } from '../types/game';

// ─── Resource Cost Display ───
function CostList({ cost }: { cost: Record<string, number> }) {
  const entries = Object.entries(cost).filter(([, v]) => v > 0);
  if (entries.length === 0)
    return <span className="text-gray-500 text-xs">Gratuito</span>;

  return (
    <div className="flex flex-wrap gap-1.5">
      {entries.map(([key, val]) => (
        <span
          key={key}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono bg-gray-800/60 border border-gray-700/30"
        >
          <span className="text-sm">{RESOURCE_ICONS[key as ResourceType]}</span>
          <span className="text-gray-300">{val}</span>
        </span>
      ))}
    </div>
  );
}

// ─── Resource Benefit Display ───
function BenefitList({
  resources,
  prefix = '+',
  suffix = '/día',
}: {
  resources: Partial<Resources>;
  prefix?: string;
  suffix?: string;
}) {
  const entries = Object.entries(resources).filter(([, v]) => v > 0);
  if (entries.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {entries.map(([key, val]) => (
        <span
          key={key}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono bg-emerald-900/30 border border-emerald-700/30 text-emerald-300"
        >
          <span>{RESOURCE_ICONS[key as ResourceType]}</span>
          <span>
            {prefix}
            {val}{suffix}
          </span>
        </span>
      ))}
    </div>
  );
}

// ─── Shelter Level Card ───
function ShelterLevelCard({
  level,
  compact = false,
}: {
  level: ShelterLevel;
  compact?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border ${
        compact
          ? 'p-3 border-gray-700/30'
          : 'p-4 border-gray-600/50 bg-gray-800/60'
      }`}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">{level.icon}</span>
        <div>
          <div className="text-sm font-bold text-white">
            Nv. {level.level} — {level.name}
          </div>
          <div className="text-[10px] text-gray-500 leading-relaxed">
            {level.description}
          </div>
        </div>
      </div>
      <div className="space-y-1.5">
        {level.defenseBonus > 0 && (
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-gray-500">🛡️ Defensa:</span>
            <span className="text-blue-300 font-mono font-bold">
              +{level.defenseBonus}%
            </span>
          </div>
        )}
        {Object.keys(level.passiveProduction).length > 0 && (
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-gray-500">🏭 Producción:</span>
            <BenefitList resources={level.passiveProduction} />
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// SHELTER MODAL
// ══════════════════════════════════════════════════
interface ShelterModalProps {
  onClose: () => void;
}

export default function ShelterModal({ onClose }: ShelterModalProps) {
  const { state, dispatch } = useGame();
  const [tab, setTab] = useState<'upgrade' | 'craft'>('upgrade');

  // Escape key to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const currentLevel = SHELTER_LEVELS[state.shelterLevel];
  const nextLevel = getNextShelterLevel(state.shelterLevel);
  const availableRecipes = getRecipesForLevel(state.shelterLevel);

  // Check if can afford next upgrade
  const canAffordUpgrade = nextLevel
    ? Object.entries(nextLevel.cost).every(
        ([key, value]) => state.resources[key as ResourceType] >= (value as number)
      )
    : false;

  const handleUpgrade = () => {
    if (!canAffordUpgrade || !nextLevel) return;
    dispatch({ type: 'UPGRADE_SHELTER' });
  };

  const handleCraft = (recipeId: string) => {
    dispatch({ type: 'CRAFT_ITEM', recipeId });
  };

  return (
    <div
      className="absolute inset-0 z-[4000] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="animate-slide-up w-full sm:max-w-lg max-h-[85vh] glass-strong rounded-t-2xl sm:rounded-2xl flex flex-col overflow-hidden"
        style={{borderRadius: '20px 20px 0 0', boxShadow: '0 0 40px rgba(0,0,0,0.5)'}}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accent line */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-blue-500/60 to-transparent shrink-0" />

        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center text-lg border border-blue-500/20">
              {currentLevel.icon}
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Refugio</h2>
              <p className="text-[10px] text-white/30 tracking-wider">
                Nivel {state.shelterLevel} — {currentLevel.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all duration-200 text-sm border border-white/5 hover:border-white/20 active:scale-90"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-4 gap-1 shrink-0 overflow-x-auto pb-3 pt-2 border-b border-white/5">
          {[
            ['upgrade', '🔨 Mejora'],
            ['craft', '🔧 Crafteo'],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key as 'upgrade' | 'craft')}
              className={`px-4 py-2 text-xs font-bold transition-all duration-200 whitespace-nowrap rounded-xl ${
                tab === key
                  ? 'text-white bg-blue-500/15 border border-blue-500/20 shadow-lg shadow-blue-500/5'
                  : 'text-white/40 hover:text-white/60 bg-white/5 border border-transparent hover:border-white/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* ─── UPGRADE TAB ─── */}
          {tab === 'upgrade' && (
            <>
              {/* Current shelter info */}
              <ShelterLevelCard level={currentLevel} />

              {/* Current defense boost from crafting */}
              {state.shelterDefenseBoost > 0 && (
                <div className="bg-amber-900/20 border border-amber-700/30 rounded-xl px-3 py-2 text-xs text-amber-300">
                  🛡️ Bonus defensivo temporal: <span className="font-mono font-bold">+{state.shelterDefenseBoost}%</span> (se reinicia al comenzar la próxima semana)
                </div>
              )}

              {/* Next level upgrade */}
              {nextLevel ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-300 font-bold">⬆️ Siguiente nivel</span>
                    <span className="text-[10px] text-gray-500">(Nv. {nextLevel.level})</span>
                  </div>

                  {/* Preview next level */}
                  <ShelterLevelCard level={nextLevel} />

                  {/* Upgrade cost */}
                  <div className="bg-gray-800/40 rounded-xl p-3 border border-gray-700/30">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                      Costo de mejora
                    </div>
                    <CostList cost={nextLevel.cost as Record<string, number>} />
                  </div>

                  {/* Upgrade button */}
                  <button
                    onClick={handleUpgrade}
                    disabled={!canAffordUpgrade}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                      canAffordUpgrade
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98]'
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700/30'
                    }`}
                  >
                    {canAffordUpgrade
                      ? `🔨 Mejorar a ${nextLevel.name}`
                      : '❌ Recursos insuficientes'}
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-5xl mb-3">🛡️</div>
                  <p className="text-amber-400 font-bold text-sm">
                    ¡Refugio al máximo nivel!
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Tu refugio es prácticamente indestructible.
                  </p>
                </div>
              )}

              {/* All levels preview */}
              <details className="bg-gray-800/20 rounded-xl border border-gray-700/20">
                <summary className="px-3 py-2 text-xs text-gray-500 cursor-pointer hover:text-gray-300 transition-colors font-bold">
                  📖 Ver todos los niveles
                </summary>
                <div className="px-3 pb-3 space-y-2 mt-2">
                  {SHELTER_LEVELS.map((level) => (
                    <ShelterLevelCard
                      key={level.level}
                      level={level}
                      compact
                    />
                  ))}
                </div>
              </details>
            </>
          )}

          {/* ─── CRAFT TAB ─── */}
          {tab === 'craft' && (
            <>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500 uppercase tracking-wider">
                  Recetas disponibles
                </span>
                <span className="text-xs text-gray-500">
                  Nv. refugio {state.shelterLevel}
                </span>
              </div>

              {availableRecipes.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🔧</div>
                  <p className="text-gray-400 text-sm">
                    Mejora tu refugio al nivel 1 para desbloquear crafteo
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {availableRecipes.map((recipe) => {
                    const canAfford = Object.entries(recipe.cost).every(
                      ([key, value]) =>
                        state.resources[key as ResourceType] >= (value as number)
                    );

                    return (
                      <div
                        key={recipe.id}
                        className={`rounded-xl p-3 border transition-all duration-200 ${
                          canAfford
                            ? 'bg-gray-800/50 border-gray-700/40 hover:border-gray-600/60'
                            : 'bg-gray-800/20 border-gray-700/20 opacity-60'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl mt-1">{recipe.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-sm font-bold text-white">
                                {recipe.name}
                              </h4>
                              {recipe.result.defenseBoost && (
                                <span className="text-[10px] text-blue-300 font-bold font-mono bg-blue-900/30 px-2 py-0.5 rounded-full">
                                  🛡️ +{recipe.result.defenseBoost}%
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-gray-500 mb-2 leading-relaxed">
                              {recipe.description}
                            </p>

                            <div className="flex items-center gap-4 text-xs">
                              <div className="flex items-center gap-1">
                                <span className="text-gray-500">Costo:</span>
                                <CostList cost={recipe.cost as Record<string, number>} />
                              </div>
                              {recipe.result.resources && (
                                <div className="flex items-center gap-1">
                                  <span className="text-gray-500">→</span>
                                  <BenefitList
                                    resources={recipe.result.resources}
                                    prefix=""
                                    suffix=""
                                  />
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => handleCraft(recipe.id)}
                              disabled={!canAfford}
                              className={`mt-2 w-full py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                                canAfford
                                  ? 'bg-amber-600/80 hover:bg-amber-500 text-white active:scale-[0.98]'
                                  : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                              }`}
                            >
                              {canAfford ? '🔧 Craftear' : '❌ Recursos insuficientes'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Locked recipes preview */}
              {state.shelterLevel < MAX_SHELTER_LEVEL && (
                <details className="bg-gray-800/20 rounded-xl border border-gray-700/20 mt-2">
                  <summary className="px-3 py-2 text-xs text-gray-500 cursor-pointer hover:text-gray-300 transition-colors font-bold">
                    🔒 Recetas bloqueadas (Nv. {state.shelterLevel + 1}+)
                  </summary>
                  <div className="px-3 pb-3 space-y-2 mt-2">
                    {CRAFTING_RECIPES.filter(
                      (r) => r.minShelterLevel > state.shelterLevel
                    ).map((recipe) => (
                      <div
                        key={recipe.id}
                        className="rounded-xl p-3 bg-gray-800/20 border border-gray-700/20 opacity-40"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{recipe.icon}</span>
                          <div>
                            <div className="text-xs font-bold text-gray-400">
                              {recipe.name}
                            </div>
                            <div className="text-[10px] text-gray-600">
                              Requiere refugio Nv. {recipe.minShelterLevel}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
