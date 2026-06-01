import { FACTIONS, getFaction, getAlliancePerk, getRivalFactions, ALLIANCE_REP_THRESHOLD, ALLIANCE_RIVAL_PENALTY, ALLIANCE_COOLDOWN_WEEKS } from '../data/factions';
import type { FactionId, FactionReputation } from '../types/game';

interface Props {
  factionAlliance: FactionId | null;
  factionReputation: FactionReputation;
  factionAllianceWeek: number;
  currentWeek: number;
  onAlly: (factionId: FactionId) => void;
  onBreak: () => void;
  onClose: () => void;
}

export default function AllianceModal({
  factionAlliance,
  factionReputation,
  factionAllianceWeek,
  currentWeek,
  onAlly,
  onBreak,
  onClose,
}: Props) {
  const isOnCooldown = !factionAlliance && factionAllianceWeek > 0 && (currentWeek - factionAllianceWeek) < ALLIANCE_COOLDOWN_WEEKS;
  const cooldownRemaining = isOnCooldown ? ALLIANCE_COOLDOWN_WEEKS - (currentWeek - factionAllianceWeek) : 0;

  return (
    <div className="fixed inset-0 z-[3500] flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div
        className="glass-strong rounded-2xl p-6 max-w-sm w-full mx-4 max-h-[85vh] overflow-y-auto animate-zoom-in"
        style={{ borderRadius: '20px', boxShadow: '0 0 40px rgba(0,0,0,0.5)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accent line */}
        <div className="relative mb-4 -mx-6">
          <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center text-lg border border-amber-500/20">
              🤝
            </div>
            <h2 className="text-lg font-black text-white">Alianzas</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all duration-200 text-sm border border-white/5 hover:border-white/20 active:scale-90"
          >
            ✕
          </button>
        </div>

        {/* Current alliance */}
        {factionAlliance && (
          <CurrentAllianceBanner
            factionId={factionAlliance}
            onBreak={onBreak}
          />
        )}

        {/* Cooldown notice */}
        {isOnCooldown && (
          <div className="mb-4 px-3 py-2 rounded-xl bg-amber-900/20 border border-amber-500/20 flex items-center gap-2 text-xs text-amber-300">
            <span>⏳</span>
            <span>Debes esperar {cooldownRemaining} semana{cooldownRemaining !== 1 ? 's' : ''} antes de poder aliarte de nuevo.</span>
          </div>
        )}

        {/* Faction list */}
        <h3 className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-bold mb-3">
          {factionAlliance ? 'Otras facciones' : 'Elige tu alianza'}
        </h3>

        <div className="space-y-2">
          {FACTIONS.map((faction) => {
            const rep = factionReputation[faction.id] ?? 0;
            const canAlly = !factionAlliance && !isOnCooldown && rep >= ALLIANCE_REP_THRESHOLD;
            const isCurrent = factionAlliance === faction.id;
            const perk = getAlliancePerk(faction.id);
            const rivals = getRivalFactions(faction.id);

            return (
              <div
                key={faction.id}
                className={`px-3 py-3 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-white/5 border-white/30'
                    : 'bg-gray-800/30 border-gray-700/20 hover:border-gray-600/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{faction.icon}</span>
                    <div>
                      <div className="text-sm font-bold text-white">{faction.name}</div>
                      <div className="text-[10px] text-white/40">
                        Reputación: <span className={rep >= ALLIANCE_REP_THRESHOLD ? 'text-emerald-400 font-bold' : 'text-white/60'}>{rep}/10</span>
                      </div>
                    </div>
                  </div>

                  {isCurrent ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900/40 text-emerald-300 border border-emerald-500/20 font-medium">
                      Aliado
                    </span>
                  ) : canAlly ? (
                    <button
                      onClick={() => onAlly(faction.id)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-bold rounded-lg transition-all shrink-0 active:scale-95"
                    >
                      Jurar lealtad
                    </button>
                  ) : (
                    <span className="text-[10px] text-white/20 font-mono">
                      {rep < ALLIANCE_REP_THRESHOLD ? `Rep. ${ALLIANCE_REP_THRESHOLD}+` : ''}
                    </span>
                  )}
                </div>

                {/* Alliance perks preview */}
                {perk && (
                  <div className="ml-7 space-y-1.5">
                    <div className="text-[10px] text-white/60 leading-relaxed">
                      <span className="text-white/80 font-bold">{perk.name}</span> — {perk.description}
                    </div>
                    {/* Daily bonuses */}
                    {Object.keys(perk.dailyBonus).length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {Object.entries(perk.dailyBonus).map(([key, val]) => (
                          <span key={key} className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-900/30 text-emerald-300 border border-emerald-500/20">
                            +{val} {key}
                          </span>
                        ))}
                        {perk.defenseBonus > 0 && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-900/30 text-blue-300 border border-blue-500/20">
                            +{perk.defenseBonus}% def
                          </span>
                        )}
                      </div>
                    )}
                    <div className="text-[9px] text-white/30 italic">{perk.specialEffect}</div>
                  </div>
                )}

                {/* Rival warning */}
                {rivals.length > 0 && !isCurrent && (
                  <div className="ml-7 mt-1.5 text-[9px] text-red-400/60">
                    ⚠️ Aliarte con esta facción penalizará a:{' '}
                    {rivals.map((r, i) => {
                      const rivalFaction = getFaction(r);
                      return (
                        <span key={r}>
                          {rivalFaction ? `${rivalFaction.icon} ${rivalFaction.name}` : r}
                          ({ALLIANCE_RIVAL_PENALTY} rep.){i < rivals.length - 1 ? ', ' : ''}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full mt-4 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white font-bold transition-all duration-200 text-sm border border-white/5 hover:border-white/20 active:scale-95"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

// ─── Sub-componente: banner de alianza actual ───
function CurrentAllianceBanner({
  factionId,
  onBreak,
}: {
  factionId: FactionId;
  onBreak: () => void;
}) {
  const faction = getFaction(factionId);
  const perk = getAlliancePerk(factionId);
  if (!faction || !perk) return null;

  return (
    <div
      className="mb-4 px-4 py-3 rounded-xl border flex flex-col gap-2"
      style={{ backgroundColor: faction.color + '10', borderColor: faction.color + '30' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{faction.icon}</span>
          <div>
            <div className="text-sm font-bold text-white">{faction.name}</div>
            <div className="text-[11px] text-white/60">{perk.name}</div>
          </div>
        </div>
        <button
          onClick={onBreak}
          className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 text-[10px] font-bold rounded-lg transition-all border border-red-500/20 active:scale-95"
        >
          Romper alianza
        </button>
      </div>
    </div>
  );
}
