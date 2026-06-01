import type { SocialMission, GameState } from '../types/game';

export const SOCIAL_MISSIONS: SocialMission[] = [
  // ─── Daily Social Missions ───
  {
    id: 'social_daily_help_npc',
    title: 'Buen Samaritano',
    description: 'Ayuda a un superviviente hoy (completa un encuentro NPC con karma positivo).',
    icon: '🤲',
    type: 'daily',
    condition: (state: GameState) => {
      // Se verifica externamente: se completa cuando un encuentro da karma positivo
      return state.karma > 0;
    },
    reward: { food: 2, water: 1 },
    globalScoreBonus: 50,
  },
  {
    id: 'social_daily_talk',
    title: 'Socializador',
    description: 'Interactúa con al menos 2 NPCs hoy.',
    icon: '💬',
    type: 'daily',
    condition: (state: GameState) => {
      return state.npcRelationships.filter((r) => r.lastMetWeek === state.week).length >= 2;
    },
    reward: { materials: 2 },
    globalScoreBonus: 40,
  },
  {
    id: 'social_daily_donate',
    title: 'Donante',
    description: 'Dona al menos 3 recursos a la comunidad (pierde recursos en un encuentro voluntariamente).',
    icon: '🎁',
    type: 'daily',
    condition: (state: GameState) => {
      // Completado si tienes buena reputación con los survivors
      return (state.factionReputation.survivors ?? 0) >= 2;
    },
    reward: { medicine: 2 },
    globalScoreBonus: 50,
  },
  {
    id: 'social_daily_trade',
    title: 'Negociante',
    description: 'Realiza un intercambio con un NPC mercader.',
    icon: '🤝',
    type: 'daily',
    condition: (state: GameState) => {
      return (state.factionReputation.merchants ?? 0) >= 1;
    },
    reward: { materials: 2 },
    globalScoreBonus: 40,
  },
  // ─── Weekly Social Missions ───
  {
    id: 'social_weekly_ally',
    title: 'Forjador de Alianzas',
    description: 'Consigue reputación positiva con al menos 3 facciones esta semana.',
    icon: '🤝',
    type: 'weekly',
    condition: (state: GameState) => {
      const positiveFactions = Object.values(state.factionReputation).filter((r) => r >= 2);
      return positiveFactions.length >= 3;
    },
    reward: { food: 4, water: 3, materials: 3 },
    factionRepReward: { survivors: 1, merchants: 1, military: 1 },
    globalScoreBonus: 300,
  },
  {
    id: 'social_weekly_best_friend',
    title: 'Mejor Amigo',
    description: 'Alcanza nivel de "Amigo" o superior con al menos 2 NPCs.',
    icon: '💜',
    type: 'weekly',
    condition: (state: GameState) => {
      const friends = state.npcRelationships.filter(
        (r) => r.level === 'friend' || r.level === 'ally'
      );
      return friends.length >= 2;
    },
    reward: { medicine: 3, food: 3 },
    globalScoreBonus: 300,
  },
  {
    id: 'social_weekly_companion',
    title: 'En Buena Compañía',
    description: 'Ten un compañero activo durante al menos 3 días.',
    icon: '🐕',
    type: 'weekly',
    condition: (state: GameState) => {
      return state.activeCompanions.length > 0 && state.day >= 4;
    },
    reward: { food: 3, water: 2, materials: 2 },
    globalScoreBonus: 250,
  },
  {
    id: 'social_weekly_peacemaker',
    title: 'Pacificador',
    description: 'Resuelve un conflicto sin violencia (karma +2 o más en un encuentro comunitario o con forajidos).',
    icon: '☮️',
    type: 'weekly',
    condition: (state: GameState) => {
      return state.karma >= 3;
    },
    reward: { food: 3, medicine: 2 },
    factionRepReward: { survivors: 2 },
    globalScoreBonus: 250,
  },
  {
    id: 'social_weekly_network',
    title: 'Red de Contactos',
    description: 'Conoce al menos 5 NPCs diferentes (acumulativo).',
    icon: '🌐',
    type: 'weekly',
    condition: (state: GameState) => {
      return state.metNPCs.length >= 5;
    },
    reward: { materials: 3, fuel: 2 },
    globalScoreBonus: 200,
  },
  {
    id: 'social_weekly_diplomat',
    title: 'Diplomático',
    description: 'Alcanza reputación 5+ con al menos una facción.',
    icon: '🎖️',
    type: 'weekly',
    condition: (state: GameState) => {
      return Object.values(state.factionReputation).some((r) => r >= 5);
    },
    reward: { food: 5, medicine: 3 },
    globalScoreBonus: 350,
  },
  {
    id: 'social_weekly_rumor_hunter',
    title: 'Cazador de Rumores',
    description: 'Descubre y verifica al menos 2 rumores esta semana.',
    icon: '🔍',
    type: 'weekly',
    condition: (state: GameState) => {
      return state.completedRumors.length >= 2;
    },
    reward: { materials: 3, fuel: 2 },
    globalScoreBonus: 250,
  },
];

export function getSocialMissionById(id: string): SocialMission | undefined {
  return SOCIAL_MISSIONS.find((m) => m.id === id);
}

export function generateSocialMissions(week: number, rng?: () => number): string[] {
  const rand = rng || Math.random;
  // A mayor semana, más misiones sociales disponibles
  void week;
  const dailies = SOCIAL_MISSIONS.filter((m) => m.type === 'daily');
  const weeklies = SOCIAL_MISSIONS.filter((m) => m.type === 'weekly');

  const shuffledDailies = [...dailies].sort(() => rand() - 0.5);
  const shuffledWeeklies = [...weeklies].sort(() => rand() - 0.5);

  const selected: string[] = [];
  if (shuffledDailies.length > 0) selected.push(shuffledDailies[0].id);
  if (shuffledDailies.length > 1) selected.push(shuffledDailies[1].id);
  if (shuffledWeeklies.length > 0) selected.push(shuffledWeeklies[0].id);
  if (shuffledWeeklies.length > 1) selected.push(shuffledWeeklies[1].id);

  return selected;
}

export function checkSocialMissionCondition(missionId: string, state: GameState): boolean {
  const mission = getSocialMissionById(missionId);
  if (!mission) return false;
  return mission.condition(state);
}
