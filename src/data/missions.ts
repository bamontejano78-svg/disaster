import type { Mission, GameState } from '../types/game';

export const MISSIONS: Mission[] = [
  // --- Daily Missions ---
  {
    id: 'daily_collector',
    title: 'Recluta de Recursos',
    description: 'Recolecta al menos 15 unidades de recursos en un día.',
    icon: '📦',
    type: 'daily',
    condition: (state: GameState) => {
      const total = state.resources.food + state.resources.water + state.resources.medicine + state.resources.materials + state.resources.fuel;
      return total >= 15;
    },
    reward: { food: 3, water: 2 },
    globalScoreBonus: 50,
  },
  {
    id: 'daily_explorer',
    title: 'Explorador',
    description: 'Visita al menos 3 ubicaciones diferentes en un día.',
    icon: '🗺️',
    type: 'daily',
    condition: (state: GameState) => state.visitedLocations.length >= 3,
    reward: { materials: 2, fuel: 1 },
    globalScoreBonus: 50,
  },
  {
    id: 'daily_crafter',
    title: 'Manos a la Obra',
    description: 'Craftea un objeto en el refugio.',
    icon: '🔧',
    type: 'daily',
    condition: (state: GameState) => state.visitedLocations.length > 0 && state.day > 1,
    reward: { materials: 2 },
    globalScoreBonus: 30,
  },
  {
    id: 'daily_medicine',
    title: 'Farmacéutico',
    description: 'Ten al menos 8 de medicina al final del día.',
    icon: '💊',
    type: 'daily',
    condition: (state: GameState) => state.resources.medicine >= 8,
    reward: { medicine: 2 },
    globalScoreBonus: 40,
  },
  // --- Weekly Missions ---
  {
    id: 'weekly_survivor',
    title: 'Superviviente',
    description: 'Supera el desastre de la semana.',
    icon: '🏆',
    type: 'weekly',
    condition: (state: GameState) => state.history.length > 0 && state.history[state.history.length - 1].survived,
    reward: { food: 5, water: 5, medicine: 3 },
    globalScoreBonus: 200,
  },
  {
    id: 'weekly_collector',
    title: 'Acumulador',
    description: 'Termina la semana con más de 50 unidades totales de recursos.',
    icon: '📊',
    type: 'weekly',
    condition: (state: GameState) => {
      const total = state.resources.food + state.resources.water + state.resources.medicine + state.resources.materials + state.resources.fuel;
      return total >= 50;
    },
    reward: { materials: 5, fuel: 3 },
    globalScoreBonus: 300,
  },
  {
    id: 'weekly_shelter',
    title: 'Arquitecto',
    description: 'Mejora el refugio al menos un nivel esta semana.',
    icon: '🏠',
    type: 'weekly',
    condition: (state: GameState) => state.shelterLevel >= 1,
    reward: { materials: 8 },
    globalScoreBonus: 250,
  },
  {
    id: 'weekly_scavenger',
    title: 'Carroñero',
    description: 'Visita al menos 10 ubicaciones diferentes en la semana.',
    icon: '🦝',
    type: 'weekly',
    condition: (state: GameState) => state.visitedLocations.length >= 10,
    reward: { fuel: 4, food: 4 },
    globalScoreBonus: 250,
  },
];

export function getMissionById(id: string): Mission | undefined {
  return MISSIONS.find(m => m.id === id);
}

export function generateWeeklyMissions(_week: number, rng?: () => number): string[] {
  const rand = rng || Math.random;
  const dailies = MISSIONS.filter(m => m.type === 'daily');
  const weeklies = MISSIONS.filter(m => m.type === 'weekly');

  // Pick 2 random dailies + 2 random weeklies
  const shuffledDailies = [...dailies].sort(() => rand() - 0.5);
  const shuffledWeeklies = [...weeklies].sort(() => rand() - 0.5);

  const selected: string[] = [];
  if (shuffledDailies.length > 0) selected.push(shuffledDailies[0].id);
  if (shuffledDailies.length > 1) selected.push(shuffledDailies[1].id);
  if (shuffledWeeklies.length > 0) selected.push(shuffledWeeklies[0].id);
  if (shuffledWeeklies.length > 1) selected.push(shuffledWeeklies[1].id);

  return selected;
}

// Check if a mission condition is met (used for externally-tracked missions)
export function checkMissionCondition(missionId: string, state: GameState): boolean {
  const mission = getMissionById(missionId);
  if (!mission) return false;
  return mission.condition(state);
}
