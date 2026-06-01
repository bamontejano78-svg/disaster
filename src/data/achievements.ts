import type { Achievement, DailyEvent, GameState } from '../types/game';

// ══════════════════════════════════════════════════
// ACHIEVEMENTS / LOGROS
// ══════════════════════════════════════════════════
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_day',
    name: 'Primer día',
    description: 'Sobrevive a tu primer día recolectando recursos.',
    icon: '🌅',
    condition: (state: GameState) => state.week === 1 && state.day >= 2,
  },
  {
    id: 'first_week',
    name: 'Superviviente novato',
    description: 'Sobrevive a tu primer desastre.',
    icon: '🏆',
    condition: (state: GameState) =>
      state.history.some((r) => r.survived && r.week === 1),
  },
  {
    id: 'survivor_5',
    name: 'Superviviente curtido',
    description: 'Sobrevive durante 5 semanas.',
    icon: '💪',
    condition: (state: GameState) =>
      state.history.filter((r) => r.survived).length >= 5,
  },
  {
    id: 'survivor_10',
    name: 'Leyenda de la supervivencia',
    description: 'Sobrevive durante 10 semanas.',
    icon: '👑',
    condition: (state: GameState) =>
      state.history.filter((r) => r.survived).length >= 10,
  },
  {
    id: 'collector_100',
    name: 'Recolector',
    description: 'Acumula 100 recursos totales en tu inventario.',
    icon: '📦',
    condition: (state: GameState) =>
      Object.values(state.resources).reduce((a, b) => a + b, 0) >= 100,
  },
  {
    id: 'collector_250',
    name: 'Acaparador',
    description: 'Acumula 250 recursos totales en tu inventario.',
    icon: '🏪',
    condition: (state: GameState) =>
      Object.values(state.resources).reduce((a, b) => a + b, 0) >= 250,
  },
  {
    id: 'food_hoarder',
    name: 'Despensa llena',
    description: 'Consigue 50 de comida.',
    icon: '🍖',
    condition: (state: GameState) => state.resources.food >= 50,
  },
  {
    id: 'water_reserve',
    name: 'Reserva de agua',
    description: 'Consigue 50 de agua.',
    icon: '💧',
    condition: (state: GameState) => state.resources.water >= 50,
  },
  {
    id: 'medicine_stock',
    name: 'Botiquín completo',
    description: 'Consigue 40 de medicina.',
    icon: '💊',
    condition: (state: GameState) => state.resources.medicine >= 40,
  },
  {
    id: 'all_disasters',
    name: 'Experto en desastres',
    description: 'Sobrevive a todos los tipos de desastre.',
    icon: '🌍',
    condition: (state: GameState) => {
      const survivedTypes = new Set(
        state.history.filter((r) => r.survived).map((r) => r.disaster)
      );
      return survivedTypes.size >= 9; // los 9 tipos de desastres
    },
    secret: true,
  },
  {
    id: 'perfect_week',
    name: 'Semana productiva',
    description: 'Llega al día 7 con 50+ recursos totales en tu inventario.',
    icon: '⭐',
    condition: (state: GameState) => {
      return (
        state.day === 7 &&
        Object.values(state.resources).reduce((a, b) => a + b, 0) >= 50
      );
    },
  },
  {
    id: 'close_call',
    name: 'Por los pelos',
    description:
      'Sobrevive a un desastre quedándote con menos de 5 unidades de algún recurso.',
    icon: '😰',
    // Esta condición requiere contexto del desastre (recursos antes/después del penalty).
    // Se evalúa en checkAchievements() cuando se pasa el contexto apropiado.
    condition: () => false,
    secret: true,
  },
  {
    id: 'no_damage',
    name: 'Intocable',
    description:
      'Sobrevive a un desastre teniendo al menos 35 de cada recurso (estabas más que preparado).',
    icon: '🛡️',
    // Requiere que TODOS los recursos estén ≥ 35, indicando preparación extrema.
    condition: (state: GameState) => {
      return (
        state.resources.food >= 35 &&
        state.resources.water >= 35 &&
        state.resources.medicine >= 35 &&
        state.resources.materials >= 35 &&
        state.resources.fuel >= 35
      );
    },
    secret: true,
  },
];

// ══════════════════════════════════════════════════
// DAILY EVENTS / EVENTOS DIARIOS
// ══════════════════════════════════════════════════
const DAILY_EVENTS: DailyEvent[] = [
  // ─── BONUS EVENTS ───
  {
    id: 'found_supplies',
    text: '¡Encontraste suministros abandonados en una casa!',
    icon: '🏚️',
    effect: { food: 5, water: 3 },
    type: 'bonus',
  },
  {
    id: 'friendly_trader',
    text: 'Un comerciante ambulante te ofrece recursos a cambio de historias.',
    icon: '🤝',
    effect: { food: 4, medicine: 3, materials: 2 },
    type: 'bonus',
  },
  {
    id: 'rain_collection',
    text: '¡Llovió durante la noche! Recogiste agua de lluvia.',
    icon: '🌧️',
    effect: { water: 8 },
    type: 'bonus',
  },
  {
    id: 'abandoned_vehicle',
    text: 'Encontraste un vehículo abandonado con combustible.',
    icon: '🚗',
    effect: { fuel: 8 },
    type: 'bonus',
  },
  {
    id: 'garden_harvest',
    text: 'Un huerto comunitario abandonado aún tiene vegetales frescos.',
    icon: '🥬',
    effect: { food: 8 },
    type: 'bonus',
  },
  {
    id: 'bakery_surplus',
    text: 'La panadería local reparte el pan que no se vendió ayer. ¡Sorpresa!',
    icon: '🥖',
    effect: { food: 4 },
    type: 'bonus',
  },
  {
    id: 'workshop_tools',
    text: 'Revisaste el taller mecánico y encontraste herramientas y combustible olvidados.',
    icon: '🔩',
    effect: { materials: 4, fuel: 2 },
    type: 'bonus',
  },
  {
    id: 'construction_lumber',
    text: 'La obra abandonada tiene tablones de madera que nadie reclamó.',
    icon: '🏗️',
    effect: { materials: 6 },
    type: 'bonus',
  },
  {
    id: 'urban_garden_harvest',
    text: 'La huerta urbana está en plena producción. Tomates, lechugas y calabacines.',
    icon: '🥗',
    effect: { food: 6, water: 2 },
    type: 'bonus',
  },
  {
    id: 'pharmacy_discount',
    text: 'Tu farmacia de confianza tiene oferta en productos de primeros auxilios.',
    icon: '💊',
    effect: { medicine: 4 },
    type: 'bonus',
  },
  {
    id: 'gas_station_sale',
    text: 'La gasolinera está liquidando existencias antes de que llegue el caos.',
    icon: '⛽',
    effect: { fuel: 6 },
    type: 'bonus',
  },
  {
    id: 'hospital_supplies',
    text: 'El hospital donó suministros médicos a la comunidad de supervivientes.',
    icon: '🏥',
    effect: { medicine: 5, food: 2 },
    type: 'bonus',
  },
  // ─── PENALTY EVENTS ───
  {
    id: 'rat_infestation',
    text: '¡Ratas invadieron tu despensa! Pierdes algo de comida.',
    icon: '🐀',
    effect: { food: -4 },
    type: 'penalty',
  },
  {
    id: 'pipe_leak',
    text: 'Una tubería rota hizo que perdieras agua.',
    icon: '🔧',
    effect: { water: -4 },
    type: 'penalty',
  },
  {
    id: 'fuel_evaporation',
    text: 'Parte de tu combustible se evaporó por el calor.',
    icon: '☀️',
    effect: { fuel: -3 },
    type: 'penalty',
  },
  {
    id: 'minor_theft',
    text: 'Alguien saqueó parte de tus materiales durante la noche.',
    icon: '🦹',
    effect: { materials: -4 },
    type: 'penalty',
  },
  {
    id: 'spoiled_medicine',
    text: 'Algunos medicamentos caducaron con el calor.',
    icon: '🌡️',
    effect: { medicine: -3 },
    type: 'penalty',
  },
  {
    id: 'workshop_looted',
    text: 'Saquearon el taller mecánico durante la noche. No quedan herramientas.',
    icon: '🔩',
    effect: { materials: -3, fuel: -2 },
    type: 'penalty',
  },
  {
    id: 'construction_collapse',
    text: 'Parte de la obra abandonada se derrumbó con el viento de anoche.',
    icon: '🏗️',
    effect: { materials: -4 },
    type: 'penalty',
  },
  {
    id: 'frost_kill',
    text: 'Una helada inesperada arruinó la cosecha de la huerta urbana.',
    icon: '❄️',
    effect: { food: -5 },
    type: 'penalty',
  },
  {
    id: 'bakery_closed',
    text: 'La panadería cerró definitivamente. Ya no habrá pan fresco.',
    icon: '🥖',
    effect: { food: -2 },
    type: 'penalty',
  },
  {
    id: 'park_contamination',
    text: 'El agua de la fuente del parque amaneció contaminada.',
    icon: '🌳',
    effect: { water: -3 },
    type: 'penalty',
  },
  {
    id: 'fuel_stolen',
    text: 'Alguien te sifoneó el combustible del generador mientras dormías.',
    icon: '⛽',
    effect: { fuel: -4 },
    type: 'penalty',
  },
  // ─── NEUTRAL EVENTS ───
  {
    id: 'quiet_day',
    text: 'Un día tranquilo... nada fuera de lo normal.',
    icon: '😌',
    effect: {},
    type: 'neutral',
  },
  {
    id: 'radio_signal',
    text: 'Captaste una señal de radio de otros supervivientes. Te da esperanza.',
    icon: '📻',
    effect: {},
    type: 'neutral',
  },
  {
    id: 'empty_workshop',
    text: 'El taller mecánico está vacío, pero al menos estás a salvo.',
    icon: '🔩',
    effect: {},
    type: 'neutral',
  },
  {
    id: 'distant_sirens',
    text: 'Se escuchan sirenas a lo lejos. Alguien más está sobreviviendo.',
    icon: '🚨',
    effect: {},
    type: 'neutral',
  },
  {
    id: 'birds_singing',
    text: 'Los pájaros cantan como si el mundo no estuviera colapsando.',
    icon: '🐦',
    effect: {},
    type: 'neutral',
  },
];

export function getRandomDailyEvent(): DailyEvent {
  const roll = Math.random();
  if (roll < 0.35) {
    // 35% chance bonus
    const bonuses = DAILY_EVENTS.filter((e) => e.type === 'bonus');
    return bonuses[Math.floor(Math.random() * bonuses.length)];
  } else if (roll < 0.65) {
    // 30% chance penalty
    const penalties = DAILY_EVENTS.filter((e) => e.type === 'penalty');
    return penalties[Math.floor(Math.random() * penalties.length)];
  } else {
    // 35% chance neutral
    const neutrals = DAILY_EVENTS.filter((e) => e.type === 'neutral');
    return neutrals[Math.floor(Math.random() * neutrals.length)];
  }
}

export function checkAchievements(
  state: GameState,
  context?: {
    survived?: boolean;
    penalty?: Partial<Record<string, number>>;
    resourcesBefore?: Record<string, number>;
  }
): string[] {
  const newAchievements: string[] = [];

  for (const achievement of ACHIEVEMENTS) {
    // Skip already unlocked
    if (state.achievements.includes(achievement.id)) continue;

    let unlocked = false;

    // Special condition: close_call — requiere contexto del desastre.
    // Se desbloquea si, tras aplicar el penalty, algún recurso queda entre 0 y 4
    // (el jugador "apenas" tenía suficiente para sobrevivir).
    if (
      achievement.id === 'close_call' &&
      context?.survived &&
      context?.penalty &&
      context?.resourcesBefore
    ) {
      for (const [key, penaltyVal] of Object.entries(context.penalty)) {
        const before =
          context.resourcesBefore[
            key as keyof typeof context.resourcesBefore
          ] ?? 0;
        const after = before - (penaltyVal as number);
        if (after >= 0 && after < 5 && before >= (penaltyVal as number)) {
          unlocked = true;
          break;
        }
      }
    }

    // Standard condition check
    if (!unlocked && achievement.condition(state)) {
      unlocked = true;
    }

    if (unlocked) {
      newAchievements.push(achievement.id);
    }
  }

  return newAchievements;
}

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
