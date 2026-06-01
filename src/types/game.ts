// ─── Tipos de Recursos ───
export interface Resources {
  food: number;
  water: number;
  medicine: number;
  materials: number;
  fuel: number;
}

export type ResourceType = keyof Resources;

export const RESOURCE_LABELS: Record<ResourceType, string> = {
  food: 'Comida',
  water: 'Agua',
  medicine: 'Medicina',
  materials: 'Materiales',
  fuel: 'Combustible',
};

export const RESOURCE_ICONS: Record<ResourceType, string> = {
  food: '🍖',
  water: '💧',
  medicine: '💊',
  materials: '🪓',
  fuel: '⛽',
};

export const RESOURCE_COLORS: Record<ResourceType, string> = {
  food: '#f59e0b',
  water: '#3b82f6',
  medicine: '#ef4444',
  materials: '#8b5cf6',
  fuel: '#10b981',
};

// ─── Tipos de Desastres ───
export type DisasterType =
  | 'earthquake'
  | 'flood'
  | 'storm'
  | 'wildfire'
  | 'heatwave'
  | 'tsunami'
  | 'plague'
  | 'tornado'
  | 'blizzard';

export interface Disaster {
  type: DisasterType;
  name: string;
  description: string;
  icon: string;
  requiredResources: Partial<Resources>;
  penalty: Partial<Resources>;
  minWeek: number;
  hints: [string, string];
}

export const DISASTER_LABELS: Record<DisasterType, string> = {
  earthquake: 'Terremoto',
  flood: 'Inundación',
  storm: 'Tormenta',
  wildfire: 'Incendio Forestal',
  heatwave: 'Ola de Calor',
  tsunami: 'Tsunami',
  plague: 'Plaga',
  tornado: 'Tornado',
  blizzard: 'Nevasca',
};

// ─── Ubicaciones de Recursos ───
export type LocationType =
  | 'supermarket'
  | 'pharmacy'
  | 'hardware'
  | 'gas_station'
  | 'park'
  | 'hospital'
  | 'bunker'
  | 'military_base'
  | 'shelter'
  | 'mechanical_workshop'
  | 'construction_site'
  | 'urban_garden'
  | 'bakery'
  | 'restaurant'
  | 'convenience_store'
  | 'clothing_store'
  | 'educational'
  | 'clinic'
  | 'hotel'
  | 'bank'
  | 'museum'
  | 'entertainment'
  | 'sports_centre'
  | 'library'
  | 'bar'
  | 'post_office'
  | 'community_centre'
  | 'place_of_worship'
  | 'electronics_store'
  | 'water_facility'
  | 'landmark';

export interface ResourceLocation {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  icon: string;
  resources: Partial<Resources>;
  description: string;
  maxPerDay: number;
  rarity?: 'common' | 'rare' | 'legendary';
}

// ─── Estado del Juego ───
export type GamePhase =
  | 'playing'
  | 'disaster_warning'
  | 'disaster_event'
  | 'survival_result'
  | 'game_over';

export interface GameState {
  week: number;
  day: number;
  resources: Resources;
  playerLat: number | null;
  playerLng: number | null;
  visitedLocations: string[];
  currentDisaster: DisasterType | null;
  predictedDisaster: DisasterType | null;
  phase: GamePhase;
  history: SurvivalRecord[];
  highScore: number;
  achievements: string[];
  dailyEvent: DailyEvent | null;
  dayStartTime: number;
  shelterLevel: number;
  shelterDefenseBoost: number;
  karma: number;
  currentWeather: WeatherType | null;
  activeMissions: string[];
  completedMissions: string[];
  // ─── Nuevos sistemas sociales ───
  factionReputation: FactionReputation;
  npcRelationships: NPCRelationship[];
  activeCompanions: CompanionInstance[];
  activeRumors: Rumor[];
  completedRumors: string[];
  journalEntries: JournalEntry[];
  communityEvents: CommunityEventRecord[];
  metNPCs: string[]; // ids de NPCs ya encontrados
  factionAlliance: FactionId | null; // facción a la que el jugador ha jurado lealtad
  factionAllianceWeek: number; // semana en la que se formó la alianza
}

export interface DailyEvent {
  id: string;
  text: string;
  icon: string;
  effect: Partial<Resources>;
  type: 'bonus' | 'penalty' | 'neutral';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (state: GameState) => boolean;
  secret?: boolean;
}

export interface SurvivalRecord {
  week: number;
  disaster: DisasterType;
  survived: boolean;
  resourcesBefore: Resources;
  resourcesAfter: Resources;
}

// ─── Refugio ───
export interface ShelterLevel {
  level: number;
  name: string;
  icon: string;
  description: string;
  cost: Partial<Resources>;
  defenseBonus: number;
  passiveProduction: Partial<Resources>;
}

export interface CraftingRecipe {
  id: string;
  name: string;
  icon: string;
  description: string;
  cost: Partial<Resources>;
  result: {
    resources?: Partial<Resources>;
    defenseBoost?: number;
  };
  minShelterLevel: number;
}

// ─── Clima ───
export type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'foggy' | 'stormy';

export interface Weather {
  type: WeatherType;
  name: string;
  icon: string;
  description: string;
  resourceMultiplier: number;
  locationVisibility: number;
  explorationEventBonus: number;
}

// ─── Encuentros NPC ───
export interface NPCChoice {
  label: string;
  description: string;
  effect: Partial<Resources>;
  karmaChange: number;
  factionChanges?: Partial<Record<FactionId, number>>; // cambios de reputación por facción
  relationshipChange?: number; // cambio de relación con este NPC
  companionJoinId?: string; // si esta elección recluta un compañero
  unlockRumorId?: string; // desbloquea un rumor
  nextEncounterBranch?: string; // id del siguiente encuentro (diálogos ramificados)
}

export interface NPCEncounter {
  id: string;
  title: string;
  description: string;
  icon: string;
  choices: NPCChoice[];
  locationTypes?: LocationType[];
  karmaMin?: number;
  karmaMax?: number;
  factionMin?: Partial<Record<FactionId, number>>; // reputación mínima de facción
  relationshipMin?: number; // nivel de relación mínimo
  npcId?: string; // id del NPC persistente (para relaciones recurrentes)
  factionId?: FactionId; // facción a la que pertenece este NPC
  isBranch?: boolean; // si es parte de un diálogo ramificado
  parentEncounterId?: string; // encuentro padre (para ramificaciones)
  repeatable?: boolean; // si se puede repetir
  journalEntry?: string; // texto para el diario al completar
}

// ─── Facciones ───
export type FactionId = 'survivors' | 'merchants' | 'military' | 'outlaws';

export interface Faction {
  id: FactionId;
  name: string;
  icon: string;
  description: string;
  color: string;
  perks: FactionPerk[];
}

export interface FactionPerk {
  reputationMin: number;
  name: string;
  description: string;
  bonus: Partial<Resources>;
  effect?: string;
}

export type FactionReputation = Record<FactionId, number>;

// ─── Relaciones con NPCs ───
export type RelationshipLevel = 'stranger' | 'acquaintance' | 'friend' | 'ally';

export interface NPCRelationship {
  npcId: string;
  name: string;
  icon: string;
  factionId?: FactionId;
  level: RelationshipLevel;
  points: number; // 0-100
  timesMet: number;
  lastMetWeek: number;
  locationTypes: LocationType[];
}

// ─── Compañeros ───
export interface Companion {
  id: string;
  name: string;
  icon: string;
  description: string;
  factionId?: FactionId;
  relationshipMin: number; // puntos de relación mínimos para reclutar
  passiveBonus: Partial<Resources>; // bonus diario
  defenseBonus: number; // % extra defensa
  cost: Partial<Resources>; // costo de mantenimiento diario
  maxDuration: number; // semanas máximas
}

export interface CompanionInstance {
  companionId: string;
  recruitedWeek: number;
  weeksRemaining: number;
}

// ─── Rumores ───
export interface Rumor {
  id: string;
  text: string;
  icon: string;
  sourceNpcId?: string;
  type: 'disaster_hint' | 'location_bonus' | 'faction_event' | 'hidden_supply';
  effect?: Partial<Resources>;
  locationType?: LocationType;
  disasterHint?: string;
  expiresWeek: number;
  claimed: boolean;
}

// ─── Eventos Comunitarios ───
export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  icon: string;
  minWeek: number;
  karmaMin?: number;
  karmaMax?: number;
  factionRepMin?: Partial<Record<FactionId, number>>;
  choices: CommunityEventChoice[];
}

export interface CommunityEventChoice {
  label: string;
  description: string;
  effect: Partial<Resources>;
  karmaChange: number;
  factionChanges?: Partial<Record<FactionId, number>>;
  companionJoinId?: string;
  unlockRumorId?: string;
}

export interface CommunityEventRecord {
  eventId: string;
  week: number;
  chosenOption: number;
}

// ─── Diario del Superviviente ───
export interface JournalEntry {
  id: string;
  week: number;
  day: number;
  text: string;
  icon: string;
  type: 'encounter' | 'decision' | 'milestone' | 'disaster' | 'community';
}

// ─── Misiones ───
export interface Mission {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'daily' | 'weekly';
  condition: (state: GameState) => boolean;
  reward: Partial<Resources>;
  globalScoreBonus?: number;
}

// ─── Misiones Sociales ───
export interface SocialMission {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'daily' | 'weekly';
  condition: (state: GameState) => boolean;
  reward: Partial<Resources>;
  factionRepReward?: Partial<Record<FactionId, number>>;
  globalScoreBonus?: number;
}

// ─── Evento Global Semanal ───
export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  week: number;
  disaster: DisasterType;
  isPlayer?: boolean;
}

export interface WeeklyCosmetic {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'marker_skin' | 'title' | 'effect' | 'badge';
  weekUnlocked: number;
}

export interface GlobalEventInfo {
  weekNumber: number;
  disasterType: DisasterType;
  disasterName: string;
  disasterIcon: string;
  description: string;
  startDate: string;
  endDate: string;
  playerScore: number;
  playerRank: number;
  totalParticipants: number;
  rewards: {
    tier: 'gold' | 'silver' | 'bronze' | 'participation';
    label: string;
    minRankPercent: number;
    cosmetic: WeeklyCosmetic;
  }[];
  cosmeticUnlocked: WeeklyCosmetic | null;
}

// ─── Acciones del Juego ───
export type GameAction =
  | { type: 'SET_PLAYER_POSITION'; lat: number; lng: number }
  | { type: 'COLLECT_RESOURCES'; locationId: string; resources: Partial<Resources> }
  | { type: 'END_DAY'; auto?: boolean }
  | { type: 'TRIGGER_DAILY_EVENT'; event: DailyEvent }
  | { type: 'TRIGGER_DISASTER'; disaster: DisasterType }
  | { type: 'APPLY_DISASTER_RESULT'; survived: boolean; penalty: Partial<Resources> }
  | { type: 'ADVANCE_WEEK' }
  | { type: 'UPGRADE_SHELTER' }
  | { type: 'CRAFT_ITEM'; recipeId: string }
  | { type: 'UNLOCK_ACHIEVEMENT'; achievementId: string }
  | { type: 'SET_WEATHER'; weather: WeatherType }
  | { type: 'SET_KARMA'; karma: number }
  | { type: 'COMPLETE_MISSION'; missionId: string }
  | { type: 'ADD_MISSIONS'; missionIds: string[] }
  | { type: 'RESET_GAME' }
  // ─── Nuevas acciones sociales ───
  | { type: 'CHANGE_FACTION_REPUTATION'; factionId: FactionId; amount: number }
  | { type: 'UPDATE_NPC_RELATIONSHIP'; npcId: string; name: string; icon: string; factionId?: FactionId; points: number; locationTypes: LocationType[] }
  | { type: 'RECRUIT_COMPANION'; companionId: string }
  | { type: 'DISMISS_COMPANION'; companionId: string }
  | { type: 'ADD_RUMOR'; rumor: Rumor }
  | { type: 'CLAIM_RUMOR'; rumorId: string }
  | { type: 'EXPIRE_RUMORS'; currentWeek: number }
  | { type: 'ADD_JOURNAL_ENTRY'; entry: JournalEntry }
  | { type: 'RECORD_COMMUNITY_EVENT'; eventId: string; chosenOption: number }
  | { type: 'ADD_MET_NPC'; npcId: string }
  | { type: 'UPDATE_COMPANION_WEEKS' }
  | { type: 'ALLY_WITH_FACTION'; factionId: FactionId }
  | { type: 'BREAK_ALLIANCE' };
