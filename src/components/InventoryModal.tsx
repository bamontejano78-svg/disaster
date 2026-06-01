import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import {
  RESOURCE_LABELS,
  RESOURCE_ICONS,
  RESOURCE_COLORS,
  DISASTER_LABELS,
} from '../types/game';
import type { ResourceType, SurvivalRecord } from '../types/game';
import { DISASTERS } from '../data/disasters';
import { ACHIEVEMENTS } from '../data/achievements';

// ─── Max threshold for progress bars (scales with week) ───
function getResourceMax(week: number): Record<ResourceType, number> {
  const base = {
    food: 50,
    water: 50,
    medicine: 40,
    materials: 50,
    fuel: 40,
  };
  const scale = 1 + (week - 1) * 0.3;
  return {
    food: Math.round(base.food * scale),
    water: Math.round(base.water * scale),
    medicine: Math.round(base.medicine * scale),
    materials: Math.round(base.materials * scale),
    fuel: Math.round(base.fuel * scale),
  };
}

// ─── Resource Bar ───
function ResourceBar({
  type,
  value,
  max,
}: {
  type: ResourceType;
  value: number;
  max: number;
}) {
  const pct = Math.min(100, (value / max) * 100);
  const color = RESOURCE_COLORS[type];

  // Color gradient based on level
  const statusColor =
    pct >= 60
      ? color
      : pct >= 30
        ? '#f59e0b'
        : '#ef4444';

  return (
    <div className="bg-gray-800/60 rounded-xl p-3 border border-gray-700/40 hover:border-gray-600/60 transition-all duration-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{RESOURCE_ICONS[type]}</span>
          <div>
            <div className="text-sm font-bold text-white">
              {RESOURCE_LABELS[type]}
            </div>
            <div className="text-[10px] text-gray-500">
              {pct >= 60 ? '✅ Abundante' : pct >= 30 ? '⚠️ Moderado' : '🔴 Escaso'}
            </div>
          </div>
        </div>
        <div className="text-right">
          <span
            className="text-xl font-black font-mono"
            style={{ color }}
          >
            {value}
          </span>
          <div className="text-[10px] text-gray-600">/ {max}</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2.5 bg-gray-700/50 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${pct}%`,
            backgroundColor: statusColor,
            boxShadow: `0 0 8px ${statusColor}40`,
          }}
        />
      </div>

      {/* Tick marks */}
      <div className="flex justify-between mt-1 px-0.5">
        <span className="text-[8px] text-gray-600">|</span>
        <span className="text-[8px] text-gray-600">|</span>
        <span className="text-[8px] text-gray-600">|</span>
        <span className="text-[8px] text-gray-600">|</span>
        <span className="text-[8px] text-gray-600">|</span>
      </div>
    </div>
  );
}

// ─── History Record ───
function HistoryCard({ record }: { record: SurvivalRecord }) {
  const disaster = DISASTERS.find((d) => d.type === record.disaster);
  const resourcesBefore = Object.values(record.resourcesBefore).reduce(
    (a, b) => a + b,
    0
  );
  const resourcesAfter = Object.values(record.resourcesAfter).reduce(
    (a, b) => a + b,
    0
  );
  const delta = resourcesAfter - resourcesBefore;

  return (
    <div
      className={`rounded-xl p-3 border transition-all duration-200 ${
        record.survived
          ? 'bg-emerald-900/20 border-emerald-700/30 hover:border-emerald-600/50'
          : 'bg-red-900/20 border-red-700/30 hover:border-red-600/50'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{disaster?.icon ?? '❓'}</span>
          <div>
            <div className="text-sm font-bold text-white">
              Semana {record.week} · {DISASTER_LABELS[record.disaster]}
            </div>
            <div
              className={`text-xs font-bold ${
                record.survived ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {record.survived ? '✅ Sobreviviste' : '💀 No sobreviviste'}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400">Recursos</div>
          <div className="flex items-center gap-1 text-xs font-mono">
            <span className="text-gray-500">{resourcesBefore}</span>
            <span className="text-gray-600">→</span>
            <span
              className={
                delta >= 0 ? 'text-emerald-400' : 'text-red-400'
              }
            >
              {resourcesAfter}
            </span>
            <span
              className={`text-[10px] ${
                delta >= 0 ? 'text-emerald-500' : 'text-red-500'
              }`}
            >
              ({delta >= 0 ? '+' : ''}
              {delta})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Achievement Card ───
function AchievementCard({
  achievementId,
  unlocked,
}: {
  achievementId: string;
  unlocked: boolean;
}) {
  const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);
  if (!achievement) return null;

  return (
    <div
      className={`rounded-xl p-3 border transition-all duration-200 ${
        unlocked
          ? 'bg-amber-900/20 border-amber-700/30 hover:border-amber-600/50'
          : 'bg-gray-800/30 border-gray-700/20 opacity-50'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl">
          {unlocked ? achievement.icon : '🔒'}
        </span>
        <div>
          <div className={`text-sm font-bold ${unlocked ? 'text-white' : 'text-gray-500'}`}>
            {unlocked ? achievement.name : '???'}
          </div>
          <div className={`text-[10px] ${unlocked ? 'text-gray-400' : 'text-gray-600'}`}>
            {unlocked
              ? achievement.description
              : achievement.secret
                ? 'Logro secreto'
                : achievement.description}
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// INVENTORY MODAL
// ══════════════════════════════════════════════════
interface InventoryModalProps {
  onClose: () => void;
}

export default function InventoryModal({ onClose }: InventoryModalProps) {
  const { state } = useGame();
  const [tab, setTab] = useState<'resources' | 'history' | 'stats' | 'achievements'>(
    'resources'
  );

  // Escape key to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const resourceMax = getResourceMax(state.week);

  const totalResources = Object.values(state.resources).reduce(
    (a, b) => a + b,
    0
  );
  const survivedWeeks = state.history.filter((r) => r.survived).length;
  const resourceEntries = Object.entries(state.resources) as [
    ResourceType,
    number,
  ][];

  const unlockedCount = state.achievements.length;
  const totalAchievements = ACHIEVEMENTS.length;

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
        <div className="h-0.5 bg-gradient-to-r from-transparent via-red-500/60 to-transparent shrink-0" />

        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center text-lg border border-amber-500/20">
              🎒
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Inventario</h2>
              <p className="text-[10px] text-white/30 tracking-wider">
                Semana {state.week} · Día {state.day}/7
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
          {(
            [
              ['resources', '📦 Recursos'],
              ['history', '📜 Historial'],
              ['stats', '📊 Stats'],
              ['achievements', `🏆 Logros`],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-3 py-2 text-xs font-bold transition-all duration-200 whitespace-nowrap rounded-xl ${
                tab === key
                  ? 'text-white bg-red-500/15 border border-red-500/20 shadow-lg shadow-red-500/5'
                  : 'text-white/40 hover:text-white/60 bg-white/5 border border-transparent hover:border-white/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* ─── Resources Tab ─── */}
          {tab === 'resources' && (
            <>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500 uppercase tracking-wider">
                  Tus suministros
                </span>
                <span className="text-xs text-gray-500">
                  Total:{' '}
                  <span className="text-white font-bold font-mono">
                    {totalResources}
                  </span>
                </span>
              </div>
              {resourceEntries.map(([key, val]) => (
                <ResourceBar key={key} type={key} value={val} max={resourceMax[key]} />
              ))}
              <div className="text-center text-[10px] text-gray-600 pt-2">
                Explora ubicaciones en el mapa para conseguir más recursos
              </div>
            </>
          )}

          {/* ─── History Tab ─── */}
          {tab === 'history' && (
            <>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500 uppercase tracking-wider">
                  Historial de supervivencia
                </span>
                <span className="text-xs text-gray-500">
                  {survivedWeeks}/{state.history.length} semanas
                </span>
              </div>
              {state.history.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-3">📜</div>
                  <p className="text-gray-400 text-sm">
                    Aún no hay historial
                  </p>
                  <p className="text-gray-600 text-xs mt-1">
                    Sobrevive a tu primer desastre para verlo aquí
                  </p>
                </div>
              ) : (
                [...state.history].reverse().map((record, i) => (
                  <HistoryCard key={i} record={record} />
                ))
              )}
            </>
          )}

          {/* ─── Stats Tab ─── */}
          {tab === 'stats' && (
            <>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                Estadísticas de la partida
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-gray-700/30">
                  <div className="text-3xl font-black text-amber-400">
                    {state.week}
                  </div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">
                    Semana actual
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-gray-700/30">
                  <div className="text-3xl font-black text-purple-400">
                    {state.highScore}
                  </div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">
                    Mejor récord
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-gray-700/30">
                  <div className="text-3xl font-black text-emerald-400">
                    {survivedWeeks}
                  </div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">
                    Semanas sobrevividas
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-gray-700/30">
                  <div className="text-3xl font-black text-blue-400">
                    {totalResources}
                  </div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">
                    Recursos totales
                  </div>
                </div>
              </div>

              {/* Resource breakdown */}
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30 mt-3">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                  Desglose de recursos
                </div>
                <div className="space-y-2">
                  {resourceEntries.map(([key, val]) => {
                    const pct =
                      totalResources > 0
                        ? Math.round((val / totalResources) * 100)
                        : 0;
                    return (
                      <div
                        key={key}
                        className="flex items-center gap-2"
                      >
                        <span className="text-lg w-7 text-center">
                          {RESOURCE_ICONS[key]}
                        </span>
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-0.5">
                            <span className="text-gray-400">
                              {RESOURCE_LABELS[key]}
                            </span>
                            <span
                              className="font-mono font-bold"
                              style={{ color: RESOURCE_COLORS[key] }}
                            >
                              {val} ({pct}%)
                            </span>
                          </div>
                          <div className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: RESOURCE_COLORS[key],
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Achievement progress */}
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30 mt-3">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                  Progreso de logros
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">
                    Logros desbloqueados
                  </span>
                  <span className="text-sm font-mono font-bold text-amber-400">
                    {unlockedCount}/{totalAchievements}
                  </span>
                </div>
                <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${(unlockedCount / totalAchievements) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </>
          )}

          {/* ─── Achievements Tab ─── */}
          {tab === 'achievements' && (
            <>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500 uppercase tracking-wider">
                  Logros
                </span>
                <span className="text-xs text-gray-500">
                  <span className="text-amber-400 font-bold font-mono">
                    {unlockedCount}
                  </span>
                  /{totalAchievements} desbloqueados
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
                  style={{
                    width: `${(unlockedCount / totalAchievements) * 100}%`,
                  }}
                />
              </div>

              <div className="space-y-2">
                {ACHIEVEMENTS.map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    achievementId={achievement.id}
                    unlocked={state.achievements.includes(achievement.id)}
                  />
                ))}
              </div>

              {unlockedCount === 0 && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🏆</div>
                  <p className="text-gray-400 text-sm">
                    Completa acciones en el juego para desbloquear logros
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
