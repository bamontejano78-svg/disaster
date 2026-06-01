import { useState, useCallback, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { FACTIONS } from '../data/factions';
import type { CommunityEvent, FactionId } from '../types/game';

interface Props {
  event: CommunityEvent;
  onClose: () => void;
}

export default function CommunityEventModal({ event, onClose }: Props) {
  const { state, dispatch } = useGame();
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

  const handleChoice = useCallback(
    (choiceIndex: number) => {
      setSelectedChoice(choiceIndex);

      const choice = event.choices[choiceIndex];
      if (!choice) return;

      setTimeout(() => {
        // Apply resource effects
        if (Object.keys(choice.effect).length > 0) {
          dispatch({
            type: 'COLLECT_RESOURCES',
            locationId: 'community_' + event.id,
            resources: choice.effect,
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
            if (amount === 0) continue;
            dispatch({
              type: 'CHANGE_FACTION_REPUTATION',
              factionId: factionId as FactionId,
              amount: amount as number,
            });
          }
        }

        // Recruit companion
        if (choice.companionJoinId) {
          dispatch({ type: 'RECRUIT_COMPANION', companionId: choice.companionJoinId });
        }

        // Unlock rumor
        if (choice.unlockRumorId) {
          import('../data/rumors').then(({ getRumorById }) => {
            const rumor = getRumorById(choice.unlockRumorId!);
            if (rumor) {
              dispatch({
                type: 'ADD_RUMOR',
                rumor: { ...rumor, expiresWeek: state.week + 2, claimed: false },
              });
            }
          });
        }

        // Record completion
        dispatch({
          type: 'RECORD_COMMUNITY_EVENT',
          eventId: event.id,
          chosenOption: choiceIndex,
        });

        // Add journal entry
        dispatch({
          type: 'ADD_JOURNAL_ENTRY',
          entry: {
            id: 'community_' + event.id + '_' + Date.now(),
            week: state.week,
            day: state.day,
            text: `Participé en el evento comunitario "${event.title}".`,
            icon: event.icon,
            type: 'community',
          },
        });

        onClose();
      }, 300);
    },
    [event, dispatch, state, onClose]
  );

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      const num = parseInt(e.key);
      if (num >= 1 && num <= event.choices.length) {
        handleChoice(num - 1);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [event, onClose, handleChoice]);

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-gradient-to-b from-purple-900/90 to-gray-900 border border-purple-500/40 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl shadow-purple-900/50 animate-zoom-in max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-1">
          <span className="text-3xl">{event.icon}</span>
          <div>
            <h2 className="text-lg font-bold text-white">
              <span className="text-purple-400 text-xs font-bold uppercase tracking-wider block">
                Evento Comunitario
              </span>
              {event.title}
            </h2>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-300 leading-relaxed mb-5">{event.description}</p>

        {/* Choices */}
        <div className="space-y-2">
          {event.choices.map((choice, i) => {
            const isSelected = selectedChoice === i;
            return (
              <button
                key={i}
                onClick={() => handleChoice(i)}
                disabled={selectedChoice !== null}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 group ${
                  isSelected
                    ? 'bg-purple-900/40 border-purple-500/50'
                    : 'bg-gray-800/50 hover:bg-gray-700/50 border-gray-600/30 hover:border-gray-500/50'
                } ${selectedChoice !== null && !isSelected ? 'opacity-40' : ''}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-sm font-semibold transition-colors ${
                        isSelected ? 'text-purple-300' : 'text-white group-hover:text-purple-300'
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
          Presiona 1-{event.choices.length} para elegir rápidamente
        </p>
      </div>
    </div>
  );
}
