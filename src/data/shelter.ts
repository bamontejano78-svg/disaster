import type { ShelterLevel, CraftingRecipe } from '../types/game';

// ══════════════════════════════════════════════════
// SHELTER LEVELS
// ══════════════════════════════════════════════════
export const SHELTER_LEVELS: ShelterLevel[] = [
  {
    level: 0,
    name: 'Campamento Básico',
    icon: '⛺',
    description: 'Una tienda de campaña improvisada. Apenas te protege de los elementos.',
    cost: {},
    defenseBonus: 0,
    passiveProduction: {},
  },
  {
    level: 1,
    name: 'Refugio Rudimentario',
    icon: '🏚️',
    description: 'Cuatro paredes de madera contrachapada y un techo de lona. Algo es algo.',
    cost: { materials: 10, food: 5, fuel: 2 },
    defenseBonus: 8,
    passiveProduction: { food: 1 },
  },
  {
    level: 2,
    name: 'Cabaña Básica',
    icon: '🛖',
    description: 'Una cabaña de madera sólida con estufa de leña. Casi acogedora.',
    cost: { materials: 20, food: 10, fuel: 5 },
    defenseBonus: 12,
    passiveProduction: { food: 1, water: 1 },
  },
  {
    level: 3,
    name: 'Refugio Fortificado',
    icon: '🏠',
    description: 'Muros reforzados, generador eléctrico y sistema de recolección de agua de lluvia.',
    cost: { materials: 30, food: 15, fuel: 10, medicine: 5 },
    defenseBonus: 15,
    passiveProduction: { food: 2, water: 1, materials: 1 },
  },
  {
    level: 4,
    name: 'Búnker Reforzado',
    icon: '🏢',
    description: 'Estructura de hormigón armado con ventilación, filtros de aire y huerto interior.',
    cost: { materials: 45, food: 20, fuel: 15, medicine: 10 },
    defenseBonus: 20,
    passiveProduction: { food: 2, water: 2, materials: 1, medicine: 1 },
  },
  {
    level: 5,
    name: 'Búnker Subterráneo',
    icon: '🛡️',
    description: 'El refugio definitivo. Autosuficiente, camuflado y prácticamente indestructible.',
    cost: { materials: 40, food: 25, fuel: 15, medicine: 10 },
    defenseBonus: 25,
    passiveProduction: { food: 3, water: 2, materials: 1, medicine: 1, fuel: 1 },
  },
];

export const MAX_SHELTER_LEVEL = SHELTER_LEVELS.length - 1;

export function getShelterLevel(level: number): ShelterLevel {
  return SHELTER_LEVELS[Math.min(level, MAX_SHELTER_LEVEL)];
}

export function getNextShelterLevel(level: number): ShelterLevel | null {
  if (level >= MAX_SHELTER_LEVEL) return null;
  return SHELTER_LEVELS[level + 1];
}

// ══════════════════════════════════════════════════
// CRAFTING RECIPES
// ══════════════════════════════════════════════════
export const CRAFTING_RECIPES: CraftingRecipe[] = [
  {
    id: 'bandage',
    name: 'Vendajes',
    icon: '🩹',
    description: 'Confecciona vendajes con gasa y antiséptico. Más eficiente que usar medicina suelta.',
    cost: { medicine: 3 },
    result: {
      resources: { medicine: 5 }, // net +2 medicine
    },
    minShelterLevel: 1,
  },
  {
    id: 'tool',
    name: 'Herramientas',
    icon: '🔧',
    description: 'Fabrica herramientas básicas con materiales y combustible. Más eficiente que recolectar a mano.',
    cost: { materials: 4, fuel: 1 },
    result: {
      resources: { materials: 6 }, // net +2 materials, -1 fuel
    },
    minShelterLevel: 1,
  },
  {
    id: 'medkit',
    name: 'Botiquín',
    icon: '🧰',
    description: 'Un botiquín completo con medicamentos avanzados. Mucho más efectivo.',
    cost: { medicine: 5, materials: 2 },
    result: {
      resources: { medicine: 8, materials: 1 }, // net +3 medicine, -1 materials
    },
    minShelterLevel: 2,
  },
  {
    id: 'barricade',
    name: 'Barricada',
    icon: '🧱',
    description: 'Refuerza las entradas de tu refugio con barricadas. Reduce el daño del próximo desastre.',
    cost: { materials: 6 },
    result: {
      defenseBoost: 10, // +10% defensa para el próximo desastre
    },
    minShelterLevel: 2,
  },
  {
    id: 'water_filter',
    name: 'Filtro de Agua',
    icon: '🚰',
    description: 'Construye un sistema de filtración que purifica grandes cantidades de agua.',
    cost: { materials: 5, fuel: 3 },
    result: {
      resources: { water: 10 }, // net +10 water, -5 materials, -3 fuel
    },
    minShelterLevel: 3,
  },
  {
    id: 'reinforced_walls',
    name: 'Muros Reforzados',
    icon: '🧱',
    description: 'Refuerza las paredes con escombros y cemento. Protege contra impactos.',
    cost: { materials: 10, fuel: 5 },
    result: {
      defenseBoost: 15, // +15% defensa acumulable con barricadas
    },
    minShelterLevel: 4,
  },
  {
    id: 'emergency_rations',
    name: 'Raciones de Emergencia',
    icon: '🥫',
    description: 'Prepara raciones concentradas de larga duración. Ocupan poco espacio.',
    cost: { food: 8, materials: 2 },
    result: {
      resources: { food: 12 }, // net +4 food, -2 materials
    },
    minShelterLevel: 3,
  },
  {
    id: 'camp_stove',
    name: 'Cocina Portátil',
    icon: '🔥',
    description: 'Cocina de campaña eficiente que rinde más con menos combustible.',
    cost: { materials: 3, fuel: 2 },
    result: {
      resources: { food: 4, water: 2 },
    },
    minShelterLevel: 1,
  },
  {
    id: 'lantern',
    name: 'Linterna Recargable',
    icon: '🔦',
    description: 'Una linterna LED de largo alcance. Esencial para explorar de noche.',
    cost: { materials: 2, fuel: 1 },
    result: {
      resources: { fuel: 3 },
    },
    minShelterLevel: 1,
  },
  {
    id: 'animal_trap',
    name: 'Trampa para Animales',
    icon: '🪤',
    description: 'Trampas artesanales para cazar pequeños animales cerca del refugio.',
    cost: { materials: 5 },
    result: {
      resources: { food: 8 },
    },
    minShelterLevel: 2,
  },
  {
    id: 'air_purifier',
    name: 'Purificador de Aire',
    icon: '💨',
    description: 'Filtros de carbón activado que protegen contra contaminación y patógenos.',
    cost: { materials: 4, medicine: 3 },
    result: {
      resources: { medicine: 4 },
      defenseBoost: 8,
    },
    minShelterLevel: 2,
  },
  {
    id: 'irrigation',
    name: 'Sistema de Riego',
    icon: '💧',
    description: 'Canaliza agua residual para cultivar alimentos en el refugio.',
    cost: { materials: 8, fuel: 2 },
    result: {
      resources: { food: 6, water: 6 },
    },
    minShelterLevel: 3,
  },
  {
    id: 'insulation_kit',
    name: 'Kit de Aislamiento',
    icon: '🧤',
    description: 'Aísla paredes y ventanas para proteger contra temperaturas extremas.',
    cost: { materials: 7 },
    result: {
      defenseBoost: 12,
    },
    minShelterLevel: 3,
  },
  {
    id: 'solar_panel',
    name: 'Panel Solar',
    icon: '☀️',
    description: 'Genera electricidad limpia y silenciosa. Produce combustible de forma pasiva.',
    cost: { materials: 12, fuel: 8 },
    result: {
      resources: { fuel: 5 },
    },
    minShelterLevel: 4,
  },
  {
    id: 'watchtower',
    name: 'Torre de Vigilancia',
    icon: '🗼',
    description: 'Estructura elevada que permite avisar con antelación de los desastres.',
    cost: { materials: 15, fuel: 5 },
    result: {
      defenseBoost: 20,
    },
    minShelterLevel: 4,
  },
  {
    id: 'lab_equipment',
    name: 'Equipo de Laboratorio',
    icon: '🔬',
    description: 'Instrumentos científicos para sintetizar medicamentos de alta calidad.',
    cost: { materials: 8, medicine: 8, fuel: 3 },
    result: {
      resources: { medicine: 15 },
    },
    minShelterLevel: 5,
  },
  {
    id: 'geothermal_probe',
    name: 'Sonda Geotérmica',
    icon: '🌋',
    description: 'Aprovecha el calor terrestre para generar recursos constantemente.',
    cost: { materials: 20, fuel: 10 },
    result: {
      resources: { food: 5, water: 5, fuel: 5 },
    },
    minShelterLevel: 5,
  },
];

export function getRecipesForLevel(level: number): CraftingRecipe[] {
  return CRAFTING_RECIPES.filter((r) => r.minShelterLevel <= level);
}
