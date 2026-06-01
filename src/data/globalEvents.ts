import type { DisasterType, GameState, LeaderboardEntry, WeeklyCosmetic, GlobalEventInfo } from '../types/game';

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

const DISASTERS_FOR_WEEK = [
  { type: 'earthquake' as DisasterType, name: 'Terremoto', icon: '🌍', desc: 'La tierra tiembla sin piedad', minWeek: 1 },
  { type: 'flood' as DisasterType, name: 'Inundación', icon: '🌊', desc: 'Las aguas suben imparablemente', minWeek: 1 },
  { type: 'storm' as DisasterType, name: 'Tormenta Eléctrica', icon: '⛈️', desc: 'Rayos caen del cielo', minWeek: 2 },
  { type: 'wildfire' as DisasterType, name: 'Incendio Forestal', icon: '🔥', desc: 'El fuego avanza sin control', minWeek: 2 },
  { type: 'tornado' as DisasterType, name: 'Tornado', icon: '🌪️', desc: 'El viento arrasa todo', minWeek: 2 },
  { type: 'heatwave' as DisasterType, name: 'Ola de Calor Extrema', icon: '🥵', desc: 'El sol abrasador no da tregua', minWeek: 3 },
  { type: 'plague' as DisasterType, name: 'Plaga', icon: '🦠', desc: 'Una enfermedad se propaga', minWeek: 3 },
  { type: 'tsunami' as DisasterType, name: 'Tsunami', icon: '🌊', desc: 'Una ola gigante se acerca', minWeek: 4 },
  { type: 'blizzard' as DisasterType, name: 'Nevasca', icon: '❄️', desc: 'Tormenta de hielo azota la región', minWeek: 5 },
];

const PLAYER_NAMES: string[] = [
  'SupervivienteX', 'LaLobaSolitari4', 'ElRecolector', 'ZonaSegura_42',
  'ApocalipsisNow', 'Refugio77', 'Radioactivo', 'Sobreviviente_00',
  'DesastreTotal', 'UltimoHombre', 'Cazador_de_recursos', 'Bunker_Alfa',
  'Centinela', 'Vagabundo_Digital', 'Resistencia', 'Supervivencia_MAX',
  'Nucleo_Duro', 'Plan_B', 'Estratega_93', 'Ghost_Survivor',
];

export function getCurrentGlobalEvent(playerScore: number = 0): GlobalEventInfo {
  const now = new Date();
  const weekNum = getISOWeekNumber(now);
  const year = now.getFullYear();

  const rng = seededRandom(weekNum + year * 52);
  const disasterIdx = Math.floor(rng() * DISASTERS_FOR_WEEK.length);
  const disaster = DISASTERS_FOR_WEEK[disasterIdx];

  const dayOfWeek = now.getDay() || 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - dayOfWeek + 1);
  monday.setHours(0,0,0,0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const startDate = monday.toLocaleDateString('es-ES',{day:'numeric',month:'short'});
  const endDate = sunday.toLocaleDateString('es-ES',{day:'numeric',month:'short'});

  const leaderboard = getLeaderboard(weekNum, year, playerScore);
  const playerEntry = leaderboard.find(e => e.isPlayer);
  const playerRank = playerEntry?.rank ?? leaderboard.length;
  const totalParticipants = leaderboard.length;

  const rewards = [
    { tier: 'gold' as const, label: 'Oro (Top 10%)', minRankPercent: 0.1, cosmetic: { id: 'gold_marker_'+weekNum, name: 'Marcador Dorado Semana '+weekNum, description: 'Marcador exclusivo del evento global', icon: '🌟', type: 'marker_skin' as const, weekUnlocked: weekNum } },
    { tier: 'silver' as const, label: 'Plata (Top 25%)', minRankPercent: 0.25, cosmetic: { id: weekNum+'_warrior', name: 'Guerrero Semana '+weekNum, description: 'Título exclusivo del evento global', icon: '️', type: 'title' as const, weekUnlocked: weekNum } },
    { tier: 'bronze' as const, label: 'Bronce (Top 50%)', minRankPercent: 0.5, cosmetic: { id: weekNum+'_effect', name: 'Efecto Élite Semana '+weekNum, description: 'Efecto visual exclusivo del evento global', icon: '✨', type: 'effect' as const, weekUnlocked: weekNum } },
    { tier: 'participation' as const, label: 'Participación', minRankPercent: 1.0, cosmetic: { id: weekNum+'_badge', name: 'Insignia Semana '+weekNum, description: 'Por participar en el evento global', icon: '⭐', type: 'badge' as const, weekUnlocked: weekNum } },
  ];

  let cosmeticUnlocked: WeeklyCosmetic | null = null;
  const rankPercent = totalParticipants > 0 ? playerRank / totalParticipants : 1;
  for (const r of rewards) {
    if (rankPercent <= r.minRankPercent) { cosmeticUnlocked = r.cosmetic; break; }
  }

  return { weekNumber: weekNum, disasterType: disaster.type, disasterName: disaster.name, disasterIcon: disaster.icon, description: disaster.desc, startDate, endDate, playerScore, playerRank, totalParticipants, rewards, cosmeticUnlocked };
}

export function calculateGlobalScore(state: GameState): number {
  const totalResources = state.resources.food + state.resources.water + state.resources.medicine + state.resources.materials + state.resources.fuel;
  return state.week * 1000 + totalResources * 10 + state.shelterLevel * 50;
}

export function getLeaderboard(weekNum: number, year: number, playerScore: number): LeaderboardEntry[] {
  const rng = seededRandom(weekNum + year * 52 + 999);
  const simulatedPlayers: LeaderboardEntry[] = [];
  const shuffledNames = [...PLAYER_NAMES].sort(() => rng() - 0.5);
  let simulatedScore = Math.max(playerScore - 2000, 100);
  for (let i = 0; i < 18; i++) {
    const idx = i % shuffledNames.length;
    simulatedScore += Math.floor(rng() * 400) + 50;
    simulatedPlayers.push({ rank: 0, name: shuffledNames[idx], score: simulatedScore, week: Math.floor(simulatedScore / 1000) || 1, disaster: 'earthquake' as DisasterType });
  }

  let savedScore = 0;
  try { const saved = localStorage.getItem('seven_days_leaderboard_'+year+'_w'+weekNum); if (saved) savedScore = JSON.parse(saved).score; } catch {}
  const finalPlayerScore = playerScore > 0 ? playerScore : savedScore;
  const allEntries: LeaderboardEntry[] = [...simulatedPlayers, { rank: 0, name: 'Tú', score: finalPlayerScore, week: Math.floor(finalPlayerScore / 1000) || 1, disaster: 'earthquake' as DisasterType, isPlayer: true }];
  allEntries.sort((a, b) => b.score - a.score);
  allEntries.forEach((e, i) => { e.rank = i + 1; });
  return allEntries;
}

export function savePlayerScore(state: GameState): void {
  const now = new Date();
  const weekNum = getISOWeekNumber(now);
  const year = now.getFullYear();
  const score = calculateGlobalScore(state);
  try {
    const key = 'seven_days_leaderboard_'+year+'_w'+weekNum;
    const existing = localStorage.getItem(key);
    const data = existing ? JSON.parse(existing) : {};
    data.score = Math.max(data.score || 0, score);
    data.week = state.week;
    data.lastPlayed = Date.now();
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

export function getUnlockedCosmetics(): WeeklyCosmetic[] {
  try { const saved = localStorage.getItem('seven_days_cosmetics'); return saved ? JSON.parse(saved) : []; } catch { return []; }
}

export function saveUnlockedCosmetic(cosmetic: WeeklyCosmetic): void {
  try {
    const existing = getUnlockedCosmetics();
    if (!existing.find(c => c.id === cosmetic.id)) {
      existing.push(cosmetic);
      localStorage.setItem('seven_days_cosmetics', JSON.stringify(existing));
    }
  } catch {}
}

export function getCurrentGlobalDisasterType(): DisasterType {
  const now = new Date();
  const weekNum = getISOWeekNumber(now);
  const year = now.getFullYear();
  const rng = seededRandom(weekNum + year * 52);
  const disasterIdx = Math.floor(rng() * DISASTERS_FOR_WEEK.length);
  return DISASTERS_FOR_WEEK[disasterIdx].type;
}

export function isNewGlobalEventWeek(): boolean {
  const now = new Date();
  const weekNum = getISOWeekNumber(now);
  const year = now.getFullYear();
  const key = 'seven_days_leaderboard_' + year + '_w' + weekNum;
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return true;
    const data = JSON.parse(saved);
    return !data.seen;
  } catch { return true; }
}

export function markGlobalEventSeen(): void {
  const now = new Date();
  const weekNum = getISOWeekNumber(now);
  const year = now.getFullYear();
  const key = 'seven_days_leaderboard_' + year + '_w' + weekNum;
  try {
    const existing = localStorage.getItem(key);
    const data = existing ? JSON.parse(existing) : {};
    data.seen = true;
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}
