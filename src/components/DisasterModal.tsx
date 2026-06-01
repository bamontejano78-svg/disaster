import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { DISASTERS } from '../data/disasters';
import { RESOURCE_ICONS } from '../types/game';
import type { ResourceType } from '../types/game';

interface DisasterWarningProps {
  onClose: () => void;
}

export default function DisasterWarning({ onClose }: DisasterWarningProps) {
  const { state, checkSurvival } = useGame();
  const disaster = DISASTERS.find((d) => d.type === state.currentDisaster);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown <= 0) {
      onClose();
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, onClose]);

  if (!disaster || !state.currentDisaster) return null;

  const { scaled, probability } = checkSurvival(state.currentDisaster);
  const scaledEntries = Object.entries(scaled) as [string, number][];

  const canSurvive = probability >= 100;
  const needsLuck = probability > 0 && probability < 100;

  // Obtener la pista correspondiente al día (día 6 = hint[1], día 7 = hint[1] también)
  const hint = state.day === 7 ? disaster.hints[1] : null;

  return (
    <div className="absolute inset-0 z-[3000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="animate-shake w-full max-w-md bg-gray-900 rounded-2xl border-2 border-red-500/50 shadow-2xl shadow-red-500/20 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900 to-red-800 p-5 text-center">
          <div className="text-5xl mb-2">{disaster.icon}</div>
          <h2 className="text-2xl font-black text-white uppercase tracking-wider">
            ⚠️ ¡{disaster.name}!
          </h2>
          <p className="text-red-200 text-sm mt-1">
            Semana {state.week} · Día 7
          </p>
        </div>

        {/* Body */}
        <div className="p-5">
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            {disaster.description}
          </p>

          <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
            <h4 className="text-xs text-gray-400 uppercase tracking-wider mb-2">
              Recursos necesarios para sobrevivir
            </h4>
            <div className="flex flex-wrap gap-2">
              {scaledEntries.map(([key, val]) => {
                const current =
                  state.resources[key as ResourceType];
                const enough = current >= val;
                return (
                  <div
                    key={key}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono ${
                      enough
                        ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/30'
                        : 'bg-red-900/50 text-red-300 border border-red-700/30'
                    }`}
                  >
                    <span>{RESOURCE_ICONS[key as ResourceType]}</span>
                    <span>
                      {current}/{val}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Survival Probability */}
          <div
            className={`text-center py-3 rounded-lg font-bold text-sm mb-3 ${
              canSurvive
                ? 'bg-emerald-900/30 text-emerald-300 border border-emerald-700/30'
                : needsLuck
                  ? 'bg-amber-900/30 text-amber-300 border border-amber-700/30'
                  : 'bg-red-900/30 text-red-300 border border-red-700/30'
            }`}
          >
            {canSurvive
              ? '✅ ¡Tienes suficientes recursos! Supervivencia asegurada.'
              : needsLuck
                ? `🎲 Probabilidad de supervivencia: ${probability}% — ¡Necesitarás suerte!`
                : '❌ Será un milagro sobrevivir...'}
          </div>

          {/* Last hint before disaster */}
          {hint && (
            <div className="bg-purple-900/30 border border-purple-700/30 rounded-lg px-3 py-2 mb-3 text-xs text-purple-300 leading-relaxed">
              📡 <span className="italic">"{hint}"</span>
            </div>
          )}

          {/* Countdown */}
          <div className="text-center">
            <span className="text-gray-500 text-xs">
              El desastre comienza en...
            </span>
            <div className="text-4xl font-black text-red-400 animate-countdown mt-1">
              {countdown}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Disaster Event (animation) ───
interface DisasterEventProps {
  onComplete: (survived: boolean) => void;
}

export function DisasterEvent({ onComplete }: DisasterEventProps) {
  const { state, checkSurvival } = useGame();
  const disaster = DISASTERS.find((d) => d.type === state.currentDisaster);
  const [phase, setPhase] = useState<'incoming' | 'impact' | 'result'>(
    'incoming'
  );
  const [rolled, setRolled] = useState(false);

  useEffect(() => {
    const incomingTimer = setTimeout(() => setPhase('impact'), 2000);
    const impactTimer = setTimeout(() => setPhase('result'), 4000);
    return () => {
      clearTimeout(incomingTimer);
      clearTimeout(impactTimer);
    };
  }, []);

  if (!disaster || !state.currentDisaster) return null;

  const { probability, survived: deterministic } = checkSurvival(state.currentDisaster);
  const needsLuck = probability > 0 && probability < 100;

  const handleResultClick = () => {
    if (rolled) return;
    setRolled(true);

    let actualSurvival: boolean;
    if (deterministic) {
      // Probabilidad 100% o más → siempre sobrevive
      actualSurvival = true;
    } else if (probability <= 0) {
      // Sin recursos → no sobrevive
      actualSurvival = false;
    } else {
      // ¡Tirada de dados!
      actualSurvival = Math.random() * 100 < probability;
    }

    onComplete(actualSurvival);
  };

  // Color para el botón de resultado basado en probabilidad
  const resultColor =
    deterministic
      ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-xl shadow-emerald-500/30'
      : needsLuck
        ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-xl shadow-amber-500/30'
        : 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-xl shadow-red-500/30';

  return (
    <div className="absolute inset-0 z-[3000] flex items-center justify-center p-4">
      {phase === 'incoming' && (
        <div className="text-center animate-shake">
          <div className="text-8xl mb-4 animate-bounce">
            {disaster.icon}
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-wider">
            ¡{disaster.name} INMINENTE!
          </h2>
          <p className="text-gray-400 mt-2">Prepárate...</p>
        </div>
      )}

      {phase === 'impact' && (
        <div className="absolute inset-0 bg-red-500/20 animate-pulse flex items-center justify-center">
          <div className="text-center">
            <div className="text-8xl mb-4 animate-ping">
              💥
            </div>
            <h2 className="text-4xl font-black text-red-400 animate-pulse">
              ¡IMPACTO!
            </h2>
          </div>
        </div>
      )}

      {phase === 'result' && (
        <div className="text-center">
          {needsLuck && (
            <div className="mb-4 bg-amber-900/40 border border-amber-700/30 rounded-xl px-4 py-2 text-amber-300 text-sm font-bold">
              🎲 Probabilidad de sobrevivir: {probability}%
            </div>
          )}
          <button
            onClick={handleResultClick}
            disabled={rolled}
            className={`px-8 py-4 rounded-2xl font-black text-xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${resultColor}`}
          >
            {rolled
              ? '⏳ Procesando...'
              : deterministic
                ? '🎉 ¡Sobreviviste!'
                : needsLuck
                  ? '🎲 Probar suerte'
                  : '💀 No sobreviviste...'}
          </button>
        </div>
      )}
    </div>
  );
}

export { DisasterWarning };
