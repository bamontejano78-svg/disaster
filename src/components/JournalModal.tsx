import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { RESOURCE_ICONS, RESOURCE_COLORS } from '../types/game';
import type { ResourceType, JournalEntry } from '../types/game';
import { getCompanion } from '../data/companions';

interface Props {
  onClose: () => void;
}

const TYPE_ICONS: Record<string, string> = {
  encounter: '💬',
  decision: '⚖️',
  milestone: '🏆',
  disaster: '🌪️',
  community: '🏛️',
};

const TYPE_LABELS: Record<string, string> = {
  encounter: 'Encuentro',
  decision: 'Decisión',
  milestone: 'Hito',
  disaster: 'Desastre',
  community: 'Comunidad',
};

type FilterType = 'all' | 'encounter' | 'decision' | 'milestone' | 'disaster' | 'community';

function DisasterSummary({ entry, history }: { entry: JournalEntry; history: { week: number; survived: boolean; resourcesBefore: Record<string, number>; resourcesAfter: Record<string, number> }[] }) {
  const record = history.find(h => h.week === entry.week);
  if (!record) return null;
  const resources = ['food', 'water', 'medicine', 'materials', 'fuel'] as ResourceType[];
  return (
    <div className="mt-2 p-2 rounded-lg bg-white/5 border border-white/5">
      <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1.5">Recursos antes → después</div>
      <div className="flex flex-wrap gap-1.5">
        {resources.map(r => {
          const before = (record.resourcesBefore as Record<string, number>)[r] ?? 0;
          const after = (record.resourcesAfter as Record<string, number>)[r] ?? 0;
          const diff = after - before;
          return (
            <span key={r} className="inline-flex items-center gap-1 text-[10px] bg-white/5 px-2 py-1 rounded-lg border border-white/5">
              <span>{RESOURCE_ICONS[r]}</span>
              <span style={{ color: RESOURCE_COLORS[r] }}>{before}</span>
              <span className="text-white/20">→</span>
              <span style={{ color: RESOURCE_COLORS[r] }}>{after}</span>
              {diff !== 0 && (
                <span className={`font-bold ${diff > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  ({diff > 0 ? '+' : ''}{diff})
                </span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function MilestoneCompanionStatus({ entry, activeCompanions }: { entry: JournalEntry; activeCompanions: { companionId: string; weeksRemaining: number }[] }) {
  // Check if this milestone is about a companion
  const companionId = entry.id.startsWith('companion_') ? entry.id.split('_')[1] : null;
  if (!companionId) return null;
  const companion = getCompanion(companionId);
  if (!companion) return null;
  const active = activeCompanions.find(c => c.companionId === companionId);
  return (
    <div className="mt-1.5 flex items-center gap-1.5">
      {active ? (
        <span className="text-[10px] text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded-full font-bold">
          ✓ Activo · {active.weeksRemaining} sem restantes
        </span>
      ) : (
        <span className="text-[10px] text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded-full">
          Expirado
        </span>
      )}
    </div>
  );
}

export default function JournalModal({ onClose }: Props) {
  const { state } = useGame();
  const { journalEntries } = state;
  const [filterType, setFilterType] = useState<FilterType>('all');

  // Ordenar por semana y día (más reciente primero)
  const sorted = [...journalEntries]
    .filter(e => filterType === 'all' || e.type === filterType)
    .sort((a, b) => {
      if (a.week !== b.week) return b.week - a.week;
      return b.day - a.day;
    });

  const filterOptions: { value: FilterType; label: string; icon: string }[] = [
    { value: 'all', label: 'Todo', icon: '📖' },
    { value: 'encounter', label: 'Encuentros', icon: '💬' },
    { value: 'milestone', label: 'Hitos', icon: '🏆' },
    { value: 'disaster', label: 'Desastres', icon: '🌪️' },
    { value: 'community', label: 'Comunidad', icon: '🏛️' },
    { value: 'decision', label: 'Decisiones', icon: '⚖️' },
  ];

  return (
    <div className="fixed inset-0 z-[4000] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-600/40 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl shadow-gray-900/50 animate-zoom-in max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center text-lg border border-amber-500/20">
              📖
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Diario</h2>
              <p className="text-[10px] text-gray-500">
                {journalEntries.length} entrada{journalEntries.length !== 1 ? 's' : ''}
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

        {/* Filter chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 shrink-0 scrollbar-hide">
          {filterOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilterType(opt.value)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all border ${
                filterType === opt.value
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-white/5 border-white/5 text-white/40 hover:text-white/60'
              }`}
            >
              <span>{opt.icon}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>

        {/* Entries */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {sorted.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">📖</div>
              <p className="text-gray-400 text-sm">
                {filterType === 'all' ? 'Diario vacío' : `Sin entradas de tipo "${TYPE_LABELS[filterType] ?? filterType}"`}
              </p>
              <p className="text-gray-600 text-xs mt-2">
                Tus encuentros y decisiones se registrarán aquí.
              </p>
            </div>
          ) : (
            sorted.map((entry) => (
              <div
                key={entry.id}
                className="p-3 rounded-xl bg-gray-800/50 border border-gray-700/30 hover:border-gray-600/50 transition-all"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{entry.icon}</span>
                  <span className="text-xs font-bold text-white">
                    {TYPE_ICONS[entry.type] ?? '📝'}{' '}
                    {TYPE_LABELS[entry.type] ?? 'Nota'}
                  </span>
                  <span className="text-[10px] text-gray-600 ml-auto">
                    S{entry.week} D{entry.day}
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">{entry.text}</p>

                {/* Disaster summary */}
                {entry.type === 'disaster' && (
                  <DisasterSummary entry={entry} history={state.history as any} />
                )}

                {/* Companion status for milestones */}
                {entry.type === 'milestone' && (
                  <MilestoneCompanionStatus entry={entry} activeCompanions={state.activeCompanions} />
                )}
              </div>
            ))
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/70 font-bold transition-all duration-200 text-xs border border-white/5 shrink-0"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
