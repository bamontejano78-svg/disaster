import { useGame } from '../context/GameContext';

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

export default function JournalModal({ onClose }: Props) {
  const { state } = useGame();
  const { journalEntries } = state;

  // Ordenar por semana y día (más reciente primero)
  const sorted = [...journalEntries].sort((a, b) => {
    if (a.week !== b.week) return b.week - a.week;
    return b.day - a.day;
  });

  return (
    <div className="fixed inset-0 z-[4000] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-600/40 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl shadow-gray-900/50 animate-zoom-in max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 shrink-0">
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

        {/* Entries */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {sorted.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">📖</div>
              <p className="text-gray-400 text-sm">Diario vacío</p>
              <p className="text-gray-600 text-xs mt-2">
                Tus encuentros y decisiones se registrarán aquí.
                ¡Explora el mundo y conoce gente!
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
