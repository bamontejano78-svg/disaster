import type { Faction, FactionId } from '../types/game';

export const FACTIONS: Faction[] = [
  {
    id: 'survivors',
    name: 'Red de Supervivientes',
    icon: '🤝',
    description: 'Gente corriente unida para ayudarse mutuamente. Creen en la solidaridad por encima de todo.',
    color: '#10b981',
    perks: [
      {
        reputationMin: 3,
        name: 'Miembro reconocido',
        description: 'Los supervivientes comparten contigo. +1 comida/día.',
        bonus: { food: 1 },
      },
      {
        reputationMin: 6,
        name: 'Aliado de confianza',
        description: 'Te dan acceso a sus reservas. +1 comida y +1 agua/día.',
        bonus: { food: 1, water: 1 },
      },
      {
        reputationMin: 10,
        name: 'Pilar de la comunidad',
        description: 'La comunidad te respalda. +2 comida, +1 agua y +1 medicina/día.',
        bonus: { food: 2, water: 1, medicine: 1 },
      },
    ],
  },
  {
    id: 'merchants',
    name: 'Gremio de Mercaderes',
    icon: '⚖️',
    description: 'Comerciantes que prosperan en el caos. Valoran el intercambio justo y los contactos.',
    color: '#f59e0b',
    perks: [
      {
        reputationMin: 3,
        name: 'Cliente habitual',
        description: 'Mejores precios en trueques. +1 materiales/día.',
        bonus: { materials: 1 },
      },
      {
        reputationMin: 6,
        name: 'Socio comercial',
        description: 'Acceso a suministros raros. +1 materiales y +1 combustible/día.',
        bonus: { materials: 1, fuel: 1 },
      },
      {
        reputationMin: 10,
        name: 'Magnate del yermo',
        description: 'Los mejores tratos. +2 materiales, +1 combustible y +1 comida/día.',
        bonus: { materials: 2, fuel: 1, food: 1 },
      },
    ],
  },
  {
    id: 'military',
    name: 'Remanente Militar',
    icon: '🎖️',
    description: 'Soldados que mantienen el orden. Respetan la disciplina y la lealtad.',
    color: '#3b82f6',
    perks: [
      {
        reputationMin: 3,
        name: 'Recluta',
        description: 'Entrenamiento básico. +5% defensa en desastres.',
        bonus: {},
        effect: 'defenseBonus5',
      },
      {
        reputationMin: 6,
        name: 'Soldado',
        description: 'Equipo táctico. +10% defensa y +1 combustible/día.',
        bonus: { fuel: 1 },
        effect: 'defenseBonus10',
      },
      {
        reputationMin: 10,
        name: 'Comandante honorario',
        description: 'Máxima protección. +15% defensa y +2 combustible, +1 medicina/día.',
        bonus: { fuel: 2, medicine: 1 },
        effect: 'defenseBonus15',
      },
    ],
  },
  {
    id: 'outlaws',
    name: 'Forajidos del Yermo',
    icon: '💀',
    description: 'Bandidos que viven sin reglas. Respetan la fuerza y la astucia. Peligrosos pero útiles.',
    color: '#ef4444',
    perks: [
      {
        reputationMin: 3,
        name: 'Conocido',
        description: 'Los bandidos te dejan en paz. Evitas eventos de saqueo.',
        bonus: {},
        effect: 'avoidLooting',
      },
      {
        reputationMin: 6,
        name: 'Respetado',
        description: 'Te pasan información del mercado negro. +1 materiales/día.',
        bonus: { materials: 1 },
      },
      {
        reputationMin: 10,
        name: 'Capo del yermo',
        description: 'Los forajidos trabajan para ti. +2 materiales y +1 combustible/día.',
        bonus: { materials: 2, fuel: 1 },
      },
    ],
  },
];

export function getFaction(id: string): Faction | undefined {
  return FACTIONS.find((f) => f.id === id);
}

export function getFactionPerkBonus(factionId: string, reputation: number): {
  resources: Partial<Record<string, number>>;
  effect?: string;
} {
  const faction = getFaction(factionId);
  if (!faction) return { resources: {} };

  const activePerks = faction.perks
    .filter((p) => reputation >= p.reputationMin)
    .sort((a, b) => b.reputationMin - a.reputationMin);

  if (activePerks.length === 0) return { resources: {} };

  const best = activePerks[0];
  return { resources: best.bonus, effect: best.effect };
}

export function getAllFactionDailyBonuses(
  reputation: Record<string, number>
): Partial<Record<string, number>> {
  const bonuses: Partial<Record<string, number>> = {};

  for (const faction of FACTIONS) {
    const rep = reputation[faction.id] ?? 0;
    const result = getFactionPerkBonus(faction.id, rep);
    for (const [key, value] of Object.entries(result.resources)) {
      bonuses[key] = (bonuses[key] ?? 0) + (value as number);
    }
  }

  return bonuses;
}

export function getFactionDefenseBonus(reputation: Record<string, number>): number {
  let bonus = 0;
  const militaryPerk = getFactionPerkBonus('military', reputation.military ?? 0);
  if (militaryPerk.effect === 'defenseBonus5') bonus = 5;
  else if (militaryPerk.effect === 'defenseBonus10') bonus = 10;
  else if (militaryPerk.effect === 'defenseBonus15') bonus = 15;
  return bonus;
}

export function hasOutlawProtection(reputation: Record<string, number>): boolean {
  const outlawPerk = getFactionPerkBonus('outlaws', reputation.outlaws ?? 0);
  return outlawPerk.effect === 'avoidLooting';
}

// ══════════════════════════════════════════════════
// SISTEMA DE ALIANZAS
// ══════════════════════════════════════════════════

/** Umbral de reputación necesario para poder jurar alianza */
export const ALLIANCE_REP_THRESHOLD = 7;

/** Semanas de enfriamiento para volver a aliarse tras romper */
export const ALLIANCE_COOLDOWN_WEEKS = 2;

/** Facción rival: aliarse con una facción penaliza a su rival */
export const FACTION_RIVALS: Partial<Record<FactionId, FactionId[]>> = {
  survivors: ['outlaws'],
  outlaws: ['survivors', 'military'],
  military: ['outlaws'],
  // merchants no tiene rivales — son neutrales
};

/** Penalización de reputación al rival cuando te alías (por facción rival) */
export const ALLIANCE_RIVAL_PENALTY = -3;

/** Perks exclusivos por alianza (se suman a los perks normales de reputación) */
export interface AlliancePerk {
  name: string;
  icon: string;
  description: string;
  dailyBonus: Partial<Record<string, number>>;
  defenseBonus: number;
  specialEffect: string;
}

export const ALLIANCE_PERKS: Record<FactionId, AlliancePerk> = {
  survivors: {
    name: 'Protector de la Comunidad',
    icon: '🤝',
    description: 'La Red te considera familia. Recibes raciones de emergencia y protección vecinal.',
    dailyBonus: { food: 3, water: 2 },
    defenseBonus: 5,
    specialEffect: 'Inmunidad a eventos de saqueo y bonus de +1 comida al recolectar de cualquier ubicación.',
  },
  merchants: {
    name: 'Socio Fundador',
    icon: '⚖️',
    description: 'Eres accionista del Gremio. Flujo constante de materiales y descuentos exclusivos.',
    dailyBonus: { materials: 3, fuel: 2 },
    defenseBonus: 0,
    specialEffect: 'Bonus de trueque +50% total y -20% coste en mejoras de refugio.',
  },
  military: {
    name: 'Oficial de Campo',
    icon: '🎖️',
    description: 'El Remanente te ha otorgado rango. Equipo táctico y protocolos de defensa avanzados.',
    dailyBonus: { fuel: 2, medicine: 1 },
    defenseBonus: 20,
    specialEffect: '+20% defensa total y acceso a exploración de zonas militares restringidas.',
  },
  outlaws: {
    name: 'Señor del Yermo',
    icon: '💀',
    description: 'Los forajidos te respetan como a un igual. El yermo es tuyo.',
    dailyBonus: { materials: 3, food: 2 },
    defenseBonus: 0,
    specialEffect: 'Saqueo automático: +1 recurso extra al recolectar. Inmunidad a eventos de Forajidos.',
  },
};

export function getAlliancePerk(factionId: FactionId): AlliancePerk | undefined {
  return ALLIANCE_PERKS[factionId];
}

export function getRivalFactions(factionId: FactionId): FactionId[] {
  return FACTION_RIVALS[factionId] ?? [];
}
