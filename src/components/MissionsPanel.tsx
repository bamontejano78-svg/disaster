import { useGame } from '../context/GameContext';
import { getMissionById, checkMissionCondition } from '../data/missions';
import { getWeather } from '../data/weather';

interface Props {
  onClose: () => void;
}

export default function MissionsPanel({ onClose }: Props) {
  const { state, dispatch } = useGame();
  const { activeMissions, completedMissions, karma, currentWeather } = state;

  const handleCompleteMission = (missionId: string) => {
    const mission = getMissionById(missionId);
    if (!mission) return;

    // Apply reward
    if (Object.keys(mission.reward).length > 0) {
      dispatch({
        type: 'COLLECT_RESOURCES',
        locationId: 'mission_' + missionId,
        resources: mission.reward,
      });
    }

    // Complete mission
    dispatch({ type: 'COMPLETE_MISSION', missionId });
  };

  const weather = currentWeather ? getWeather(currentWeather) : null;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="glass-strong rounded-2xl p-6 max-w-sm w-full mx-4 max-h-[80vh] overflow-y-auto animate-zoom-in" style={{borderRadius: '20px', boxShadow: '0 0 40px rgba(0,0,0,0.5)'}}>
        {/* Accent line */}
        <div className="relative mb-4 -mx-6">
          <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center text-lg border border-amber-500/20">
              📋
            </div>
            <h2 className="text-lg font-black text-white">Misiones</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all duration-200 text-sm border border-white/5 hover:border-white/20 active:scale-90"
          >
            ✕
          </button>
        </div>

        {/* Weather info */}
        {weather && (
          <div className="mb-4 px-3 py-2 rounded-xl bg-gray-800/50 border border-gray-700/30 flex items-center gap-2">
            <span>{weather.icon}</span>
            <span className="text-xs text-gray-300">
              Clima: <span className="font-semibold">{weather.name}</span>
            </span>
            {weather.resourceMultiplier !== 1.0 && (
              <span className="text-[10px] text-gray-500 ml-auto">
                Recursos: {Math.round(weather.resourceMultiplier * 100)}%
              </span>
            )}
          </div>
        )}

        {/* Karma */}
        <div className="mb-4 px-3 py-2 rounded-xl bg-gray-800/50 border border-gray-700/30 flex items-center gap-2">
          <span>⚖️</span>
          <span className="text-xs text-gray-300">
            Karma:
          </span>
          <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                karma >= 0
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                  : 'bg-gradient-to-r from-red-500 to-red-400'
              }`}
              style={{ width: `${Math.abs(karma) * 10}%` }}
            />
          </div>
          <span
            className={`text-xs font-bold ${
              karma >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {karma > 0 ? '+' : ''}{karma}
          </span>
        </div>

        {/* Active Missions */}
        <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2">
          Activas ({activeMissions.length})
        </h3>
        {activeMissions.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-4">
            No hay misiones activas. Vuelve al inicio de la próxima semana.
          </p>
        ) : (
          <div className="space-y-2 mb-4">
            {activeMissions.map((missionId) => {
              const mission = getMissionById(missionId);
              if (!mission) return null;
              const isComplete = checkMissionCondition(missionId, state);
              return (
                <div
                  key={missionId}
                  className={`px-3 py-2.5 rounded-xl border transition-all ${
                    isComplete
                      ? 'bg-emerald-900/20 border-emerald-500/40'
                      : 'bg-gray-800/50 border-gray-700/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg shrink-0">{mission.icon}</span>
                      <div>
                        <div className="text-sm font-semibold text-white">
                          {mission.title}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          {mission.description}
                        </div>
                      </div>
                    </div>
                    {isComplete ? (
                      <button
                        onClick={() => handleCompleteMission(missionId)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all shrink-0"
                      >
                        Cobrar
                      </button>
                    ) : (
                      <span className="text-[10px] text-gray-600 font-mono shrink-0">
                        {mission.type === 'daily' ? 'Hoy' : 'Semanal'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Completed Missions */}
        {completedMissions.length > 0 && (
          <>
            <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2">
              Completadas ({completedMissions.length})
            </h3>
            <div className="space-y-1">
              {completedMissions.map((missionId) => {
                const mission = getMissionById(missionId);
                if (!mission) return null;
                return (
                  <div
                    key={missionId}
                    className="px-3 py-1.5 rounded-xl bg-gray-800/30 border border-gray-700/20 opacity-60 flex items-center gap-2"
                  >
                    <span className="text-sm">{mission.icon}</span>
                    <span className="text-xs text-gray-400">{mission.title}</span>
                    <span className="text-[10px] text-emerald-500 ml-auto">✓</span>
                  </div>
                );
              })}
            </div>
          </>
        )}

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
