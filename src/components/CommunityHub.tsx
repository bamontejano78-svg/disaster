import { useGame } from '../context/GameContext';
import { FACTIONS } from '../data/factions';
import { getCompanion } from '../data/companions';
import { getRelationshipLabel, RELATIONSHIP_LEVEL_COLORS, RELATIONSHIP_LEVEL_ICONS } from '../data/relationships';
import type { FactionId } from '../types/game';

interface Props {
  onClose: () => void;
}

export default function CommunityHub({ onClose }: Props) {
  const { state } = useGame();
  const { factionReputation, npcRelationships, activeCompanions, metNPCs } = state;

  return (
    <div className="fixed inset-0 z-[4000] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-600/40 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl shadow-gray-900/50 animate-zoom-in max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 flex items-center justify-center text-lg border border-purple-500/20">
              🏛️
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Centro Comunitario</h2>
              <p className="text-[10px] text-gray-500">Semana {state.week} · Día {state.day}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all duration-200 text-sm border border-white/5"
          >
            ✕
          </button>
        </div>

        {/* Factions */}
        <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
          🏴 Facciones
        </h3>
        <div className="space-y-2 mb-5">
          {FACTIONS.map((faction) => {
            const rep = factionReputation[faction.id as FactionId] ?? 0;
            const perk = faction.perks.find((p) => rep >= p.reputationMin);
            return (
              <div
                key={faction.id}
                className="p-3 rounded-xl border transition-all"
                style={{
                  backgroundColor: faction.color + '10',
                  borderColor: faction.color + '30',
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{faction.icon}</span>
                    <span className="text-sm font-bold text-white">{faction.name}</span>
                  </div>
                  <span className="text-xs font-mono font-bold" style={{ color: faction.color }}>
                    {rep}/10
                  </span>
                </div>
                <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(rep / 10) * 100}%`,
                      backgroundColor: faction.color,
                    }}
                  />
                </div>
                {perk && (
                  <div className="text-[10px] mt-1.5" style={{ color: faction.color }}>
                    ✦ {perk.name}: {perk.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* NPC Relationships */}
        <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
          👥 Relaciones con NPCs
        </h3>
        {npcRelationships.length === 0 && metNPCs.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-3">
            Aún no has conocido a nadie. Explora el mapa para encontrar supervivientes.
          </p>
        ) : (
          <div className="space-y-2 mb-5">
            {npcRelationships.map((rel) => {
              const levelColor = RELATIONSHIP_LEVEL_COLORS[rel.level];
              const levelIcon = RELATIONSHIP_LEVEL_ICONS[rel.level];
              return (
                <div
                  key={rel.npcId}
                  className="p-3 rounded-xl bg-gray-800/50 border border-gray-700/30"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{rel.icon}</span>
                      <span className="text-sm font-semibold text-white">{rel.name}</span>
                    </div>
                    <span className="text-[10px] font-bold" style={{ color: levelColor }}>
                      {levelIcon} {getRelationshipLabel(rel.level)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${rel.points}%`,
                        backgroundColor: levelColor,
                      }}
                    />
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">
                    Encontrado {rel.timesMet} veces · Última vez: semana {rel.lastMetWeek}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Active Companions */}
        {activeCompanions.length > 0 && (
          <>
            <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              🐾 Compañeros ({activeCompanions.length})
            </h3>
          <div className="space-y-2 mb-5">
            {activeCompanions.map((comp) => {
              const companion = getCompanion(comp.companionId);
              if (!companion) return null;
                return (
                  <div
                    key={comp.companionId}
                    className="p-3 rounded-xl bg-purple-900/20 border border-purple-700/30"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{companion.icon}</span>
                        <div>
                          <div className="text-sm font-semibold text-white">{companion.name}</div>
                          <div className="text-[10px] text-gray-400">{companion.description}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-2 text-[10px] text-gray-400">
                      <span>
                        🗓️ {comp.weeksRemaining} semanas restantes
                      </span>
                      <span>🛡️ +{companion.defenseBonus}% def</span>
                      <span>
                        📦 +{Object.entries(companion.passiveBonus)
                          .filter(([, v]) => (v as number) > 0)
                          .map(([k, v]) => `${v} ${k}`)
                          .join(', ')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Met NPCs count */}
        <div className="text-center text-[10px] text-gray-600">
          NPCs conocidos: {metNPCs.length} · Relaciones establecidas: {npcRelationships.length}
        </div>
      </div>
    </div>
  );
}
