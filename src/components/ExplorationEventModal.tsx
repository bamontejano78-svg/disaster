import { useEffect } from 'react';
import type { ExplorationEvent } from '../data/explorationEvents';
import type { RoamingEvent } from '../data/roamingEvents';
import { getFaction } from '../data/factions';
import { getCompanion } from '../data/companions';

interface Props {
  event: ExplorationEvent | RoamingEvent;
  onClose: () => void;
}

const EVENT_STYLES: Record<string, { bg: string; border: string; glow: string; btn: string }> = {
  positive: {
    bg: 'from-emerald-900/50 to-emerald-800/20',
    border: 'border-emerald-500/40',
    glow: 'shadow-emerald-500/20',
    btn: 'bg-emerald-600 hover:bg-emerald-500 text-white',
  },
  negative: {
    bg: 'from-red-900/50 to-red-800/20',
    border: 'border-red-500/40',
    glow: 'shadow-red-500/20',
    btn: 'bg-red-600 hover:bg-red-500 text-white',
  },
  neutral: {
    bg: 'from-blue-900/50 to-blue-800/20',
    border: 'border-blue-500/40',
    glow: 'shadow-blue-500/20',
    btn: 'bg-blue-600 hover:bg-blue-500 text-white',
  },
  discovery: {
    bg: 'from-purple-900/50 to-purple-800/20',
    border: 'border-purple-500/40',
    glow: 'shadow-purple-500/20',
    btn: 'bg-purple-600 hover:bg-purple-500 text-white',
  },
};

// ─── Sub-componente para efectos sociales ───
function SocialEffects({ event }: { event: ExplorationEvent | RoamingEvent }) {
  // Solo los RoamingEvent tienen efectos sociales
  const roaming = event as RoamingEvent;
  const hasSocial =
    roaming.factionChanges ||
    roaming.karmaChange ||
    roaming.unlockRumorId ||
    roaming.companionJoinId ||
    roaming.journalEntry;

  if (!hasSocial) return null;

  const companionData = roaming.companionJoinId ? getCompanion(roaming.companionJoinId) : null;

  return (
    <div className="border-t border-white/10 mt-3 pt-3 space-y-2">
      {/* Cambios de reputación de facción */}
      {roaming.factionChanges && Object.keys(roaming.factionChanges).length > 0 && (
        <div className="flex gap-1.5 justify-center flex-wrap">
          {Object.entries(roaming.factionChanges).map(([fid, amount]) => {
            if (!amount) return null;
            const faction = getFaction(fid);
            if (!faction) return null;
            const sign = amount > 0 ? '+' : '';
            return (
              <span
                key={fid}
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                  amount > 0
                    ? 'bg-white/5 border-white/20 text-white/80'
                    : 'bg-red-900/30 border-red-500/20 text-red-300'
                }`}
                title={faction.name}
              >
                {faction.icon} {sign}{amount} rep.
              </span>
            );
          })}
        </div>
      )}

      {/* Cambio de karma */}
      {roaming.karmaChange != null && roaming.karmaChange !== 0 && (
        <div className="flex justify-center">
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
              roaming.karmaChange > 0
                ? 'bg-blue-900/30 border-blue-500/20 text-blue-300'
                : 'bg-red-900/30 border-red-500/20 text-red-300'
            }`}
          >
            {roaming.karmaChange > 0 ? '☯️' : '💀'} Karma {roaming.karmaChange > 0 ? '+' : ''}{roaming.karmaChange}
          </span>
        </div>
      )}

      {/* Rumor desbloqueado */}
      {roaming.unlockRumorId && (
        <div className="flex justify-center">
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-purple-900/40 text-purple-300 border border-purple-500/20">
            📜 Nuevo rumor
          </span>
        </div>
      )}

      {/* Compañero reclutado */}
      {roaming.companionJoinId && (
        <div className="flex justify-center">
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-amber-900/40 text-amber-300 border border-amber-500/20">
            {companionData ? `${companionData.icon} ${companionData.name}` : '👥'} — ¡Nuevo compañero!
          </span>
        </div>
      )}

      {/* Entrada de diario */}
      {roaming.journalEntry && (
        <div className="flex justify-center">
          <span className="text-[9px] text-white/25 italic">
            📓 Añadido al diario
          </span>
        </div>
      )}
    </div>
  );
}

export default function ExplorationEventModal({ event, onClose }: Props) {
  const style = EVENT_STYLES[event.type] || EVENT_STYLES.neutral;

  useEffect(() => {
    const timer = setTimeout(onClose, 6000);
    return () => clearTimeout(timer);
  }, [onClose]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className={`bg-gradient-to-b ${style.bg} border ${style.border} rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl ${style.glow} animate-in zoom-in-95 duration-300`}
      >
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">{event.icon}</div>
          <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">{event.description}</p>
          {/* Efectos de recursos */}
          {event.effect && (
            <div className="flex gap-2 justify-center flex-wrap mb-2">
              {Object.entries(event.effect).map(([key, val]) => {
                if (!val || val === 0) return null;
                const sign = val > 0 ? '+' : '';
                return (
                  <span
                    key={key}
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      val > 0
                        ? 'bg-emerald-900/60 text-emerald-300'
                        : 'bg-red-900/60 text-red-300'
                    }`}
                  >
                    {sign}{val} {key}
                  </span>
                );
              })}
              {event.defenseBoost && event.defenseBoost > 0 && (
                <span className="text-xs px-2 py-1 rounded-full font-medium bg-amber-900/60 text-amber-300">
                  +{event.defenseBoost} defensa
                </span>
              )}
            </div>
          )}
          {/* Efectos sociales (solo RoamingEvent) */}
          <SocialEffects event={event} />
          <button
            onClick={onClose}
            className={`${style.btn} px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95`}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
