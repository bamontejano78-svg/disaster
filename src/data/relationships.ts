import type { NPCRelationship, LocationType, RelationshipLevel } from '../types/game';

export const RELATIONSHIP_THRESHOLDS: { level: RelationshipLevel; minPoints: number; label: string }[] = [
  { level: 'stranger', minPoints: 0, label: 'Desconocido' },
  { level: 'acquaintance', minPoints: 20, label: 'Conocido' },
  { level: 'friend', minPoints: 50, label: 'Amigo' },
  { level: 'ally', minPoints: 80, label: 'Aliado' },
];

export function getRelationshipLevel(points: number): RelationshipLevel {
  const sorted = [...RELATIONSHIP_THRESHOLDS].sort((a, b) => b.minPoints - a.minPoints);
  for (const t of sorted) {
    if (points >= t.minPoints) return t.level;
  }
  return 'stranger';
}

export function getRelationshipLabel(level: RelationshipLevel): string {
  return RELATIONSHIP_THRESHOLDS.find((t) => t.level === level)?.label ?? 'Desconocido';
}

export function createRelationship(
  npcId: string,
  name: string,
  icon: string,
  factionId: string | undefined,
  locationTypes: LocationType[],
  initialPoints: number
): NPCRelationship {
  return {
    npcId,
    name,
    icon,
    factionId: factionId as NPCRelationship['factionId'],
    level: getRelationshipLevel(initialPoints),
    points: Math.min(100, Math.max(0, initialPoints)),
    timesMet: 1,
    lastMetWeek: 1,
    locationTypes,
  };
}

export function updateRelationshipPoints(
  relationship: NPCRelationship,
  pointsDelta: number,
  currentWeek: number
): NPCRelationship {
  const newPoints = Math.min(100, Math.max(0, relationship.points + pointsDelta));
  return {
    ...relationship,
    points: newPoints,
    level: getRelationshipLevel(newPoints),
    timesMet: relationship.timesMet + 1,
    lastMetWeek: currentWeek,
  };
}

export const RELATIONSHIP_LEVEL_COLORS: Record<RelationshipLevel, string> = {
  stranger: '#6b7280',
  acquaintance: '#f59e0b',
  friend: '#10b981',
  ally: '#8b5cf6',
};

export const RELATIONSHIP_LEVEL_ICONS: Record<RelationshipLevel, string> = {
  stranger: '👤',
  acquaintance: '👋',
  friend: '🤝',
  ally: '💜',
};

// ─── NPCs PERSISTENTES (recurrentes con memoria) ───

export interface PersistentNPC {
  id: string;
  name: string;
  icon: string;
  factionId?: string;
  encounterIds: string[]; // ids de encuentros que puede generar
  locationTypes: LocationType[];
  description: string;
}

export const PERSISTENT_NPCS: PersistentNPC[] = [
  {
    id: 'nurse_elena',
    name: 'Elena, la Enfermera',
    icon: '👩‍⚕️',
    factionId: 'survivors',
    encounterIds: ['nurse_clinic', 'nurse_friend', 'nurse_ally'],
    locationTypes: ['clinic', 'hospital', 'pharmacy'],
    description: 'Enfermera que montó un consultorio en la clínica.',
  },
  {
    id: 'teacher_marcos',
    name: 'Marcos, el Profesor',
    icon: '👨‍🏫',
    factionId: 'survivors',
    encounterIds: ['guardian_teacher', 'teacher_friend', 'teacher_ally'],
    locationTypes: ['educational'],
    description: 'Profesor armado protegiendo a sus alumnos.',
  },
  {
    id: 'merchant_rodrigo',
    name: 'Rodrigo, el Comerciante',
    icon: '🧳',
    factionId: 'merchants',
    encounterIds: ['trader_offer', 'trader_friend', 'trader_ally'],
    locationTypes: ['supermarket', 'convenience_store', 'gas_station'],
    description: 'Comerciante ambulante con un carro lleno de suministros.',
  },
  {
    id: 'bartender_lucia',
    name: 'Lucía, la Camarera',
    icon: '🍸',
    factionId: 'merchants',
    encounterIds: ['bartender_storyteller', 'bartender_friend', 'bartender_ally'],
    locationTypes: ['bar', 'restaurant', 'hotel'],
    description: 'Camarera que mantiene el bar como refugio social.',
  },
  {
    id: 'librarian_carmen',
    name: 'Carmen, la Bibliotecaria',
    icon: '👩‍🏫',
    factionId: 'survivors',
    encounterIds: ['librarian_guardian', 'librarian_friend', 'librarian_ally'],
    locationTypes: ['library', 'museum'],
    description: 'Bibliotecaria que convirtió la biblioteca en refugio.',
  },
  {
    id: 'engineer_rosa',
    name: 'Rosa, la Ingeniera',
    icon: '👩‍🔧',
    factionId: 'military',
    encounterIds: ['tech_expert', 'tech_friend', 'tech_ally'],
    locationTypes: ['electronics_store', 'mechanical_workshop'],
    description: 'Ingeniera electrónica montando un taller.',
  },
  {
    id: 'guard_miguel',
    name: 'Miguel, el Guardia',
    icon: '💂',
    factionId: 'military',
    encounterIds: ['monument_guard', 'guard_friend', 'guard_ally'],
    locationTypes: ['landmark', 'military_base'],
    description: 'Guardia de seguridad protegiendo el monumento.',
  },
  {
    id: 'bandit_raúl',
    name: 'Raúl, el Bandido',
    icon: '🗡️',
    factionId: 'outlaws',
    encounterIds: ['looters_confrontation', 'bandit_friend', 'bandit_ally'],
    locationTypes: ['hardware', 'construction_site', 'gas_station'],
    description: 'Líder de un grupo de saqueadores.',
  },
  {
    id: 'priest_antonio',
    name: 'Antonio, el Sacerdote',
    icon: '⛪',
    factionId: 'survivors',
    encounterIds: ['priest_shelter', 'priest_friend', 'priest_ally'],
    locationTypes: ['place_of_worship', 'community_centre'],
    description: 'Sacerdote que abrió el templo a los desamparados.',
  },
  {
    id: 'volunteer_maria',
    name: 'María, la Voluntaria',
    icon: '👩‍🍳',
    factionId: 'survivors',
    encounterIds: ['community_volunteer', 'volunteer_friend', 'volunteer_ally'],
    locationTypes: ['community_centre', 'restaurant', 'bakery'],
    description: 'Voluntaria organizando una olla común.',
  },
];

export function getPersistentNPC(npcId: string): PersistentNPC | undefined {
  return PERSISTENT_NPCS.find((n) => n.id === npcId);
}
