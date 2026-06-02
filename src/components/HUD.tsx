import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { DISASTER_LABELS } from '../types/game';
import { DISASTERS } from '../data/disasters';
import { getFaction, getAlliancePerk } from '../data/factions';
import WeatherBanner from './WeatherBanner';
import AllianceModal from './AllianceModal';

const DAY_DURATION_MS = 24 * 60 * 60 * 1000;

function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return '00:00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export default function HUD() {
  const { state, endDay, dispatch } = useGame();
  const { resources, day, week, phase, dailyEvent, dayStartTime, predictedDisaster, currentWeather, karma } = state;
  const [remainingMs, setRemainingMs] = useState(() => {
    if (phase !== 'playing') return 0;
    return Math.max(0, DAY_DURATION_MS - (Date.now() - dayStartTime));
  });

  // Actualizar contador cada segundo
  useEffect(() => {
    if (phase !== 'playing') {
      setRemainingMs(0);
      return;
    }

    const tick = () => {
      const elapsed = Date.now() - dayStartTime;
      setRemainingMs(Math.max(0, DAY_DURATION_MS - elapsed));
    };

    tick(); // inmediato
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [phase, dayStartTime]);

  const daysLeft = 7 - day;
  const isDaytime = phase === 'playing';

  // Colores para la cuenta atrás del desastre
  const getDisasterCountdownColor = () => {
    if (daysLeft <= 1) return { bar: 'bg-red-500', glow: 'shadow-red-500/40', text: 'text-red-300', pulse: true };
    if (daysLeft <= 2) return { bar: 'bg-orange-500', glow: 'shadow-orange-500/30', text: 'text-orange-300', pulse: true };
    if (daysLeft <= 3) return { bar: 'bg-amber-500', glow: 'shadow-amber-500/20', text: 'text-amber-300', pulse: false };
    if (daysLeft <= 5) return { bar: 'bg-emerald-500', glow: 'shadow-emerald-500/20', text: 'text-emerald-300', pulse: false };
    return { bar: 'bg-emerald-400', glow: 'shadow-emerald-400/10', text: 'text-emerald-300', pulse: false };
  };
  const countdownColors = getDisasterCountdownColor();

  // Icono/nombre del desastre predicho (usando predictedDisaster directamente,
  // no predictedDisasterData, para cubrir días 5-7)
  const predictedDisasterIcon = predictedDisaster
    ? (DISASTERS.find((d) => d.type === predictedDisaster)?.icon ?? '🌪️')
    : '🌪️';
  const predictedDisasterName = predictedDisaster
    ? (DISASTERS.find((d) => d.type === predictedDisaster)?.name ?? 'Desconocido')
    : 'Desconocido';

  // ─── Estado del modal de alianzas ───
  const [showAllianceModal, setShowAllianceModal] = useState(false);

  // ─── Datos de alianza actual ───
  const allianceFaction = state.factionAlliance ? getFaction(state.factionAlliance) : null;
  const alliancePerk = state.factionAlliance ? getAlliancePerk(state.factionAlliance) : null;

  // Computar banner de señales de desastre para días 5-6
  const predictedDisasterData = predictedDisaster && phase === 'playing' && day >= 5 && day <= 6
    ? DISASTERS.find((d) => d.type === predictedDisaster)
    : null;
  const signIndex = day === 5 ? 0 : 1;
  const disasterSignBanner = predictedDisasterData ? (
    <div className="mx-3 mb-1.5 px-4 py-3 rounded-2xl glass-card border-purple-500/30 flex items-center gap-3 animate-slide-up text-xs text-purple-200">
      <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-lg shrink-0 animate-pulse-cyan">
        📡
      </div>
      <span className="flex-1 italic leading-relaxed">
        "{predictedDisasterData.hints[signIndex]}"
      </span>
      <span className="text-[10px] text-purple-400 font-mono whitespace-nowrap bg-purple-500/10 px-2 py-1 rounded-lg">
        {DISASTER_LABELS[predictedDisasterData.type]}?
      </span>
    </div>
  ) : null;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-[1500] pointer-events-none">
      <div className="pointer-events-auto">
        {/* Weather */}
        {currentWeather && <WeatherBanner weatherType={currentWeather} />}

        {/* ─── Barra de cuenta atrás del desastre ─── */}
        {isDaytime && (
          <div className="mx-3 mb-1.5 px-4 py-3 rounded-2xl glass-card border-white/10 animate-slide-up">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-lg ${countdownColors.pulse ? 'animate-pulse' : ''}`}>
                  {daysLeft <= 1 ? '⚠️' : daysLeft <= 2 ? '🔶' : '⏳'}
                </span>
                <span className="text-[11px] text-white/40 uppercase tracking-[0.12em] font-bold">
                  Días hasta el desastre
                </span>
                {predictedDisaster && (
                  <span className="text-[10px] text-white/20 flex items-center gap-1 ml-1">
                    <span>{predictedDisasterIcon}</span>
                    <span className="hidden sm:inline">{predictedDisasterName}</span>
                  </span>
                )}
              </div>
              <span
                className={`text-2xl font-black tabular-nums transition-colors duration-500 ${
                  countdownColors.text
                } ${countdownColors.pulse ? 'animate-pulse' : ''}`}
              >
                {daysLeft}
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out shadow-lg ${countdownColors.bar} ${countdownColors.glow}`}
                style={{ width: `${(day / 7) * 100}%` }}
              />
            </div>

            {/* Day markers */}
            <div className="flex justify-between mt-1.5 px-0.5">
              {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                <div
                  key={d}
                  className="flex flex-col items-center gap-0.5"
                  style={{ width: `${100 / 7}%` }}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                      d === 7
                        ? 'bg-red-500/60 shadow-red-500/20'
                        : d <= day
                          ? 'bg-white/20'
                          : 'bg-white/5'
                    }`}
                  />
                  <span
                    className={`text-[8px] font-mono transition-colors duration-500 ${
                      d === 7
                        ? 'text-red-400/60 font-bold'
                        : d === day
                          ? 'text-white/50'
                          : d < day
                            ? 'text-white/20'
                            : 'text-white/10'
                    }`}
                  >
                    {d === 7 ? '💀' : d === day ? d : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        {disasterSignBanner}

        {/* Daily Event Banner */}
        {dailyEvent && (
          <div
            className={`mx-3 mb-1.5 px-4 py-3 rounded-2xl border backdrop-blur-md flex items-center gap-3 animate-slide-up text-xs ${
              dailyEvent.type === 'bonus'
                ? 'glass-card border-emerald-600/30 text-emerald-200'
                : dailyEvent.type === 'penalty'
                  ? 'glass-card border-red-600/30 text-red-200'
                  : 'glass-card border-white/10 text-gray-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg shrink-0">
              {dailyEvent.icon}
            </div>
            <span className="flex-1 leading-relaxed">{dailyEvent.text}</span>
            <button
              onClick={() =>
                dispatch({ type: 'TRIGGER_DAILY_EVENT', event: dailyEvent })
              }
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all duration-200 whitespace-nowrap active:scale-95"
            >
              OK
            </button>
          </div>
        )}

        {/* Hunger/thirst warning banner */}
        {isDaytime && (resources.food < 6 || resources.water < 6) && (
          <div className="mx-3 mb-1.5 px-4 py-3 rounded-2xl glass-card border-red-500/30 flex items-center gap-3 animate-slide-up text-xs">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-lg shrink-0 animate-heartbeat">
              ⚠️
            </div>
            <span className="flex-1 text-red-200 leading-relaxed">
              {resources.food < 6 && resources.water < 6
                ? '¡Tienes poca comida y agua! Consigue suministros para sobrevivir unos 3 días.'
                : resources.food < 6
                  ? '¡La comida se está agotando! Te quedan pocos días.'
                  : '¡El agua se está agotando! Te quedan pocos días.'}
            </span>
          </div>
        )}

        {/* Injury banner */}
        {isDaytime && state.injuredUntilDay !== null && state.day <= state.injuredUntilDay && (
          <div className="mx-3 mb-1.5 px-4 py-3 rounded-2xl glass-card border-orange-500/30 flex items-center gap-3 animate-slide-up text-xs">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-lg shrink-0">
              🩹
            </div>
            <span className="flex-1 text-orange-200 leading-relaxed">
              Estás herido. Energía reducida hasta el día {state.injuredUntilDay}.
            </span>
          </div>
        )}

        {/* Rumor hint banners */}
        {isDaytime && state.activeRumors.filter(r => r.type === 'disaster_hint').map(rumor => (
          <div key={rumor.id} className="mx-3 mb-1.5 px-4 py-3 rounded-2xl glass-card border-blue-500/30 flex items-center gap-3 animate-slide-up text-xs text-blue-200">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-lg shrink-0">
              🔍
            </div>
            <span className="flex-1 italic leading-relaxed">"{rumor.text}"</span>
            <span className="text-[10px] text-blue-400 font-mono whitespace-nowrap bg-blue-500/10 px-2 py-1 rounded-lg">
              Rumor
            </span>
          </div>
        ))}          {/* ─── Alliance badge ─── */}
          {allianceFaction && alliancePerk && (
            <div className="mx-3 mb-1.5 px-4 py-3 rounded-2xl glass-card border-white/10 flex items-center gap-3 animate-slide-up text-xs">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                style={{ backgroundColor: allianceFaction.color + '20', border: '1px solid ' + allianceFaction.color + '40' }}
              >
                {allianceFaction.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-bold text-sm">{alliancePerk.name}</div>
                <div className="text-white/40 text-[10px] truncate">{alliancePerk.description}</div>
              </div>
              <button
                onClick={() => setShowAllianceModal(true)}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-bold text-white/60 hover:text-white transition-all shrink-0 border border-white/5"
              >
                Gestionar
              </button>
            </div>
          )}

          {/* Day counter + Countdown */}
        <div className="glass-strong rounded-2xl mx-3 mb-2 px-4 py-3 flex items-center justify-between">
          {/* Week & Day */}
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className="text-[9px] text-white/30 uppercase tracking-[0.15em] font-bold">
                Semana
              </div>
              <div className="text-xl font-black text-white leading-tight">
                {week}
              </div>
            </div>
            <div className="w-px h-9 bg-white/10" />
            <div className="text-center">
              <div className="text-[9px] text-white/30 uppercase tracking-[0.15em] font-bold">
                Día
              </div>
              <div className="text-xl font-black text-gradient-amber leading-tight">
                {day}/7
              </div>
            </div>
            <div className="w-px h-9 bg-white/10" />
            <div className="text-center">
              <div className="text-[9px] text-white/30 uppercase tracking-[0.15em] font-bold">
                Restan
              </div>
              <div
                className={`text-xl font-black leading-tight ${
                  daysLeft <= 2 ? 'text-red-400 animate-pulse' : 'text-white'
                }`}
              >
                {daysLeft}
              </div>
            </div>
          </div>

          {/* Karma indicator */}
          <div className="flex items-center gap-1.5 px-3 py-2 bg-white/5 rounded-xl border border-white/10 shrink-0 relative group">
            <span className="text-lg">
              {karma >= 5 ? '😇' : karma >= 2 ? '🙂' : karma >= -2 ? '😐' : karma >= -5 ? '😠' : '👿'}
            </span>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-white/30 font-bold">Karma</span>
                <span className={`text-sm font-black ${
                  karma > 0 ? 'text-emerald-400' : karma < 0 ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {karma > 0 ? '+' : ''}{karma}
                </span>
              </div>
              {/* Karma bar -10 to +10 */}
              <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${((karma + 10) / 20) * 100}%`,
                    background: karma > 0
                      ? 'linear-gradient(90deg, #34d399, #10b981)'
                      : karma < 0
                        ? 'linear-gradient(90deg, #f87171, #ef4444)'
                        : '#9ca3af',
                  }}
                />
              </div>
            </div>
            {/* Karma tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 glass-card rounded-xl px-3 py-2 text-[10px] text-white/70 leading-relaxed opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-10 border border-white/10">
              {karma >= 8 ? '😇 Los supervivientes confían en ti plenamente. Encuentros exclusivos disponibles.' :
               karma >= 5 ? '🙂 Tu reputación te abre puertas. +15% eventos positivos.' :
               karma >= -4 ? '😐 Neutro. Sin efectos especiales.' :
               karma >= -5 ? '😠 La gente desconfía de ti. Algunos NPCs te rechazan.' :
               '👿 Los forajidos te respetan, los demás te temen. Encuentros hostiles más frecuentes.'}
            </div>
          </div>

          {/* Countdown timer */}
          {isDaytime && (
            <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white/5 rounded-2xl border border-white/10">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 flex items-center justify-center text-sm border border-cyan-500/20">
                ⏳
              </div>
              <div className="text-center">
                <span
                  className={`font-mono font-black text-sm tabular-nums ${
                    remainingMs < 60 * 60 * 1000
                      ? 'text-red-400 animate-pulse'
                      : remainingMs < 6 * 60 * 60 * 1000
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                  }`}
                >
                  {formatTimeRemaining(remainingMs)}
                </span>
                <div className="text-[8px] text-white/30 uppercase tracking-wider">restante</div>
              </div>
            </div>
          )}

          {/* Fallback: manual end day */}
          {!isDaytime && phase === 'disaster_warning' && (
            <button
              onClick={endDay}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-black rounded-2xl text-sm shadow-lg shadow-red-500/25 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2.5"
            >
              <span className="animate-pulse">⚠️</span>
              <span>Enfrentar desastre</span>
            </button>
          )}
        </div>
      </div>

      {/* ─── Alliance Modal ─── */}
      {showAllianceModal && (
        <AllianceModal
          factionAlliance={state.factionAlliance}
          factionReputation={state.factionReputation}
          factionAllianceWeek={state.factionAllianceWeek}
          currentWeek={state.week}
          onAlly={(factionId: string) => dispatch({ type: 'ALLY_WITH_FACTION', factionId: factionId as 'survivors' | 'merchants' | 'military' | 'outlaws' })}
          onBreak={() => dispatch({ type: 'BREAK_ALLIANCE' })}
          onClose={() => setShowAllianceModal(false)}
        />
      )}
    </div>
  );
}
