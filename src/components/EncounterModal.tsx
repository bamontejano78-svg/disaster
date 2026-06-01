import { useEffect, useCallback, useState } from 'react';
import { useGame } from '../context/GameContext';
import { getFaction } from '../data/factions';
import { FACTIONS } from '../data/factions';
import { getRumorById } from '../data/rumors';
import type { NPCEncounter, ResourceType, FactionId } from '../types/game';

interface Props {
  encounter: NPCEncounter;
  onClose: () => void;
}

export default function EncounterModal({ encounter, onClose }: Props) {
  const { state, dispatch } = useGame();
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showFactionInfo, setShowFactionInfo] = useState(false);

  // El karma modifica los efectos de los encuentros
  function applyKarmaToEffect(
    effect: Partial<{ [key in ResourceType]: number }>
  ): Partial<{ [key in ResourceType]: number }> {
    if (state.karma === 0) return effect;

    const modified: Partial<{ [key in ResourceType]: number }> = {};
    const karmaBonus = Math.floor(state.karma / 3);

    for (const [key, value] of Object.entries(effect)) {
      const typedKey = key as ResourceType;
      if (value > 0) {
        modified[typedKey] = Math.max(1, value + karmaBonus);
      } else if (value < 0) {
        modified[typedKey] = Math.min(value + karmaBonus, 0);
      } else {
        modified[typedKey] = value;
      }
    }
    return modified;
  }

  const handleChoice = useCallback(
    (choiceIndex: number) => {
      setSelectedChoice(choiceIndex);

      const choice = encounter.choices[choiceIndex];
      if (!choice) return;

      setTimeout(() => {
        // Apply resource effects
        const modifiedEffect = applyKarmaToEffect(choice.effect);
        if (Object.keys(modifiedEffect).length > 0) {
          dispatch({
            type: 'COLLECT_RESOURCES',
            locationId: 'npc_' + encounter.id,
            resources: modifiedEffect,
          });
        }

        // Apply karma change
        if (choice.karmaChange !== 0) {
          dispatch({
            type: 'SET_KARMA',
            karma: state.karma + choice.karmaChange,
          });
        }

        // Apply faction reputation changes
        if (choice.factionChanges) {
          for (const [factionId, amount] of Object.entries(choice.factionChanges)) {
            dispatch({
              type: 'CHANGE_FACTION_REPUTATION',
              factionId: factionId as FactionId,
              amount: amount as number,
            });
          }
        }

        // Update NPC relationship
        if (encounter.npcId && choice.relationshipChange !== undefined) {
          const npc = state.npcRelationships.find((r) => r.npcId === encounter.npcId);
          if (npc) {
            dispatch({
              type: 'UPDATE_NPC_RELATIONSHIP',
              npcId: encounter.npcId,
              name: npc.name,
              icon: npc.icon,
              factionId: npc.factionId,
              points: choice.relationshipChange,
              locationTypes: npc.locationTypes,
            });
          }
          // Marcar NPC como conocido
          if (!state.metNPCs.includes(encounter.npcId)) {
            dispatch({ type: 'ADD_MET_NPC', npcId: encounter.npcId });
          }
        }

        // Recruit companion
        if (choice.companionJoinId) {
          dispatch({ type: 'RECRUIT_COMPANION', companionId: choice.companionJoinId });
        }

        // Unlock rumor
        if (choice.unlockRumorId) {
          const rumor = getRumorById(choice.unlockRumorId);
          if (rumor) {
            dispatch({
              type: 'ADD_RUMOR',
              rumor: { ...rumor, expiresWeek: state.week + 2, claimed: false },
            });
          }
        }

        // Add journal entry
        if (encounter.journalEntry) {
          dispatch({
            type: 'ADD_JOURNAL_ENTRY',
            entry: {
              id: 'enc_' + encounter.id + '_' + Date.now(),
              week: state.week,
              day: state.day,
              text: encounter.journalEntry,
              icon: encounter.icon,
              type: 'encounter',
            },
          });
        }

        onClose();
      }, 300);
    },
    [encounter, dispatch, state, onClose]
  );

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      const num = parseInt(e.key);
      if (num >= 1 && num <= encounter.choices.length) {
        handleChoice(num - 1);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [encounter, onClose, handleChoice]);

  const faction = encounter.factionId ? getFaction(encounter.factionId) : null;

  // Relación actual si el NPC tiene ID persistente
  const relationship = encounter.npcId
    ? state.npcRelationships.find((r) => r.npcId === encounter.npcId)
    : null;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-600/40 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl shadow-gray-900/50 animate-zoom-in max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-1">
          <span className="text-3xl">{encounter.icon}</span>
          <h2 className="text-lg font-bold text-white">{encounter.title}</h2>
        </div>

        {/* Faction badge */}
        {faction && (
          <button
            onClick={() => setShowFactionInfo(!showFactionInfo)}
            className="mb-3 px-2 py-0.5 rounded-full text-[10px] font-bold transition-all inline-flex items-center gap-1"
            style={{
              backgroundColor: faction.color + '20',
              color: faction.color,
              border: '1px solid ' + faction.color + '40',
            }}
          >
            {faction.icon} {faction.name}
            <span className="text-[8px] opacity-60">
              ({state.factionReputation[encounter.factionId!] ?? 0} rep)
            </span>
          </button>
        )}

        {/* Faction info expand */}
        {showFactionInfo && faction && (
          <div
            className="mb-3 p-3 rounded-xl text-[11px] border"
            style={{
              backgroundColor: faction.color + '10',
              borderColor: faction.color + '30',
              color: '#d1d5db',
            }}
          >
            <p className="mb-2">{faction.description}</p>
            <div className="text-[10px]" style={{ color: faction.color }}>
              Reputación actual: {state.factionReputation[encounter.factionId!] ?? 0}/10
            </div>
            <div className="h-1.5 bg-gray-700 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${((state.factionReputation[encounter.factionId!] ?? 0) / 10) * 100}%`,
                  backgroundColor: faction.color,
                }}
              />
            </div>
          </div>
        )}

        {/* Relationship info */}
        {relationship && (
          <div className="mb-3 flex items-center gap-2 text-[11px] text-gray-400">
            <span>
              Relación: {relationship.level === 'stranger' ? 'Desconocido' : relationship.level === 'acquaintance' ? 'Conocido' : relationship.level === 'friend' ? 'Amigo' : 'Aliado'}
            </span>
            <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-purple-500"
                style={{ width: `${relationship.points}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-500">{relationship.points}/100</span>
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-gray-300 leading-relaxed mb-5">{encounter.description}</p>

        {/* Choices */}
        <div className="space-y-2">
          {encounter.choices.map((choice, i) => {
            const isSelected = selectedChoice === i;
            return (
              <button
                key={i}
                onClick={() => handleChoice(i)}
                disabled={selectedChoice !== null}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 group ${
                  isSelected
                    ? 'bg-amber-900/30 border-amber-500/50'
                    : 'bg-gray-800/50 hover:bg-gray-700/50 border-gray-600/30 hover:border-gray-500/50'
                } ${selectedChoice !== null && !isSelected ? 'opacity-40' : ''}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-sm font-semibold transition-colors ${
                        isSelected ? 'text-amber-300' : 'text-white group-hover:text-amber-300'
                      }`}
                    >
                      {i + 1}. {choice.label}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{choice.description}</div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 flex-wrap justify-end">
                    {choice.karmaChange !== 0 && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          choice.karmaChange > 0
                            ? 'text-emerald-400 bg-emerald-900/30'
                            : 'text-red-400 bg-red-900/30'
                        }`}
                      >
                        {choice.karmaChange > 0 ? '+' : ''}
                        {choice.karmaChange} karma
                      </span>
                    )}
                    {choice.companionJoinId && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-purple-400 bg-purple-900/30">
                        +aliado
                      </span>
                    )}
                    {choice.unlockRumorId && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-blue-400 bg-blue-900/30">
                        rumor
                      </span>
                    )}
                    {choice.factionChanges &&
                      Object.entries(choice.factionChanges).map(([fId, val]) => {
                        if (val === 0) return null;
                        const f = FACTIONS.find((fa) => fa.id === fId);
                        if (!f) return null;
                        return (
                          <span
                            key={fId}
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                            style={{
                              backgroundColor: f.color + '20',
                              color: f.color,
                            }}
                          >
                            {val > 0 ? '+' : ''}
                            {val} {f.icon}
                          </span>
                        );
                      })}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer hint */}
        <p className="text-[10px] text-gray-600 text-center mt-4">
          Presiona 1-{encounter.choices.length} para elegir rápidamente
        </p>
      </div>
    </div>
  );
}
