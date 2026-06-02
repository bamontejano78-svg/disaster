import type { Resources, LocationType } from '../types/game';

export interface ExplorationEvent {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'positive' | 'negative' | 'neutral' | 'discovery';
  probability: number;
  locationTypes?: LocationType[];
  rarityFilter?: 'common' | 'rare' | 'legendary';
  effect?: Partial<Resources>;
  defenseBoost?: number;
}

export const EXPLORATION_EVENTS: ExplorationEvent[] = [
  // === POSITIVE EVENTS ===
  {
    id: 'supply_cache',
    title: '¡Caché de Suministros!',
    description: 'Detrás de unos escombros encuentras una caja de suministros olvidada. ¡Todo un hallazgo!',
    icon: '📦',
    type: 'positive',
    probability: 0.15,
    effect: { food: 3, water: 2, materials: 2 },
  },
  {
    id: 'medicinal_herbs',
    title: 'Hierbas Medicinales',
    description: 'Encuentras un pequeño lote de hierbas con propiedades curativas.',
    icon: '🌿',
    type: 'positive',
    probability: 0.12,
    effect: { medicine: 2 },
    locationTypes: ['park', 'urban_garden', 'restaurant'],
  },
  {
    id: 'friendly_survivor',
    title: 'Superviviente Amigable',
    description: 'Un superviviente te ofrece recursos a cambio de nada. La solidaridad aún existe.',
    icon: '🤝',
    type: 'positive',
    probability: 0.08,
    effect: { food: 2, water: 1, materials: 1 },
  },
  {
    id: 'rainwater',
    title: 'Agua de Lluvia',
    description: 'Encuentras un depósito natural de agua de lluvia. Está limpia y es potable.',
    icon: '💧',
    type: 'positive',
    probability: 0.18,
    effect: { water: 4 },
  },
  {
    id: 'tool_stash',
    title: 'Herramientas Abandonadas',
    description: 'Una caja de herramientas en buen estado. Te serán muy útiles.',
    icon: '🔧',
    type: 'positive',
    probability: 0.10,
    effect: { materials: 3 },
  },
  {
    id: 'bunker_supplies',
    title: 'Suministros de Búnker',
    description: '¡Increíble! Encuentras un búnker abandonado con provisiones militares.',
    icon: '🏪',
    type: 'positive',
    probability: 0.04,
    rarityFilter: 'legendary',
    effect: { food: 6, water: 5, medicine: 4, materials: 4, fuel: 3 },
  },

  // === NUEVOS POSITIVES ===
  {
    id: 'lab_supplies',
    title: 'Laboratorio de Ciencias',
    description: 'El laboratorio del instituto tiene material médico y productos químicos aprovechables.',
    icon: '🔬',
    type: 'positive',
    probability: 0.10,
    locationTypes: ['educational'],
    effect: { medicine: 3, materials: 2 },
  },
  {
    id: 'school_pantry',
    title: 'Despensa Escolar',
    description: 'El comedor escolar tiene provisiones enlatadas y leche en polvo.',
    icon: '🍎',
    type: 'positive',
    probability: 0.12,
    locationTypes: ['educational'],
    effect: { food: 4 },
  },
  {
    id: 'minibar',
    title: 'Minibar Intacto',
    description: 'El minibar de la habitación está lleno de bebidas y frutos secos.',
    icon: '🧊',
    type: 'positive',
    probability: 0.12,
    locationTypes: ['hotel'],
    effect: { water: 3, food: 3 },
  },
  {
    id: 'safe_deposit',
    title: 'Caja de Seguridad',
    description: 'Una caja de seguridad abierta contiene objetos de valor y materiales útiles.',
    icon: '🔐',
    type: 'positive',
    probability: 0.08,
    locationTypes: ['bank'],
    effect: { materials: 5 },
  },
  {
    id: 'staff_kitchen',
    title: 'Cocina del Personal',
    description: 'Encuentras la cocina del personal con café, galletas y agua embotellada.',
    icon: '☕',
    type: 'positive',
    probability: 0.10,
    locationTypes: ['library', 'museum', 'post_office', 'community_centre', 'place_of_worship'],
    effect: { food: 3, water: 2 },
  },
  {
    id: 'cinema_snacks',
    title: 'Dulcería Abandonada',
    description: 'La dulcería del cine todavía tiene palomitas, golosinas y refrescos.',
    icon: '🍿',
    type: 'positive',
    probability: 0.12,
    locationTypes: ['entertainment'],
    effect: { food: 4, water: 2 },
  },
  {
    id: 'locker_room',
    title: 'Vestuario Olvidado',
    description: 'Las taquillas del vestuario contienen ropa, toallas y objetos personales.',
    icon: '👟',
    type: 'positive',
    probability: 0.10,
    locationTypes: ['sports_centre'],
    effect: { materials: 3 },
  },
  {
    id: 'well_stocked_bar',
    title: 'Barra Bien Surtida',
    description: 'Detrás de la barra hay botellas de alcohol, refrescos y aperitivos.',
    icon: '🍸',
    type: 'positive',
    probability: 0.12,
    locationTypes: ['bar'],
    effect: { water: 4, food: 2 },
  },
  {
    id: 'unclaimed_parcel',
    title: 'Paquete Sin Reclamar',
    description: 'Encuentras un paquete perdido en la oficina con suministros dentro.',
    icon: '📦',
    type: 'positive',
    probability: 0.10,
    locationTypes: ['post_office'],
    effect: { materials: 3, food: 2 },
  },
  {
    id: 'parish_pantry',
    title: 'Despensa Parroquial',
    description: 'La iglesia tiene una despensa de ayuda con comida y agua envasada.',
    icon: '🕯️',
    type: 'positive',
    probability: 0.14,
    locationTypes: ['place_of_worship'],
    effect: { food: 4, water: 2 },
  },
  {
    id: 'batteries_cables',
    title: 'Baterías y Cables',
    description: 'Encuentras un lote de baterías, cargadores y cables útiles.',
    icon: '🔋',
    type: 'positive',
    probability: 0.10,
    locationTypes: ['electronics_store'],
    effect: { materials: 3 },
  },
  {
    id: 'clean_water_tank',
    title: 'Agua Filtrada',
    description: 'El depósito tiene un sistema de filtración aún operativo. Agua cristalina.',
    icon: '💧',
    type: 'positive',
    probability: 0.12,
    locationTypes: ['water_facility'],
    effect: { water: 5 },
  },
  {
    id: 'community_pantry',
    title: 'Despensa Comunitaria',
    description: 'El centro comunitario almacenaba comida para emergencias. ¡Aún está ahí!',
    icon: '🥫',
    type: 'positive',
    probability: 0.12,
    locationTypes: ['community_centre'],
    effect: { food: 4, water: 2 },
  },
  {
    id: 'clinic_bandages',
    title: 'Botiquín de Emergencia',
    description: 'Encuentras un botiquín completo con vendas, antisépticos y analgésicos.',
    icon: '🩹',
    type: 'positive',
    probability: 0.12,
    locationTypes: ['clinic'],
    effect: { medicine: 3 },
  },

  // === NEGATIVE EVENTS ===
  {
    id: 'contaminated',
    title: 'Zona Contaminada',
    description: 'El área está contaminada. Respiras polvo tóxico y empiezas a sentirte mal.',
    icon: '☣️',
    type: 'negative',
    probability: 0.06,
    effect: { medicine: -3 },
  },
  {
    id: 'collapsed_building',
    title: 'Estructura Inestable',
    description: 'Parte del edificio se derrumba. Apenas logras ponerte a salvo.',
    icon: '🏚️',
    type: 'negative',
    probability: 0.05,
    effect: { materials: -2 },
  },
  {
    id: 'looters',
    title: 'Saqueadores',
    description: 'Un grupo de saqueadores te sorprende y te roba parte de tus recursos.',
    icon: '🔫',
    type: 'negative',
    probability: 0.07,
    effect: { food: -2, water: -1, medicine: -1 },
  },
  {
    id: 'radiation_leak',
    title: 'Fuga Radiactiva',
    description: 'Los niveles de radiación son peligrosamente altos. Tu equipo de protección se daña.',
    icon: '☢️',
    type: 'negative',
    probability: 0.03,
    rarityFilter: 'rare',
    effect: { medicine: -4 },
  },
  {
    id: 'trap',
    title: 'Trampa',
    description: 'Caes en una trampa colocada por otro superviviente. Logras liberarte pero pierdes tiempo y recursos.',
    icon: '🪤',
    type: 'negative',
    probability: 0.04,
    effect: { food: -1, water: -1 },
  },

  // === NUEVOS NEGATIVES ===
  {
    id: 'chemical_spill',
    title: 'Derrame Químico',
    description: 'Un derrame de productos químicos en el laboratorio contamina la zona. Tienes que usar tus medicinas para desinfectarte.',
    icon: '🧪',
    type: 'negative',
    probability: 0.06,
    locationTypes: ['educational'],
    effect: { medicine: -3 },
  },
  {
    id: 'bar_fight',
    title: 'Riña de Supervivientes',
    description: 'Dos grupos se enfrentan en el bar. Intentas mediar pero pierdes recursos en el caos.',
    icon: '🥊',
    type: 'negative',
    probability: 0.05,
    locationTypes: ['bar', 'entertainment'],
    effect: { food: -2, water: -1 },
  },
  {
    id: 'gym_hazard',
    title: 'Equipo Oxidado',
    description: 'El equipo del gimnasio está en mal estado. Una barra cae y daña tu equipo.',
    icon: '🏋️',
    type: 'negative',
    probability: 0.04,
    locationTypes: ['sports_centre'],
    effect: { materials: -2 },
  },
  {
    id: 'contaminated_water',
    title: 'Agua Contaminada',
    description: 'El agua del depósito está contaminada con bacterias. Necesitas medicamentos.',
    icon: '🦠',
    type: 'negative',
    probability: 0.05,
    locationTypes: ['water_facility'],
    effect: { medicine: -2 },
  },
  {
    id: 'church_scavengers',
    title: 'Saquearon la Iglesia',
    description: 'Llegas demasiado tarde. Alguien saqueó el lugar antes que tú.',
    icon: '💔',
    type: 'negative',
    probability: 0.04,
    locationTypes: ['place_of_worship'],
    effect: { food: -1 },
  },

  // === NEUTRAL EVENTS ===
  {
    id: 'wild_animals',
    title: 'Encuentro Salvaje',
    description: 'Un grupo de animales salvajes merodea la zona. Te quedas quieto y pasan de largo.',
    icon: '🐾',
    type: 'neutral',
    probability: 0.09,
    locationTypes: ['park', 'urban_garden', 'restaurant', 'convenience_store'],
  },
  {
    id: 'distant_explosion',
    title: 'Explosión Lejana',
    description: 'Escuchas una explosión a lo lejos. El suelo tiembla brevemente pero no hay peligro inmediato.',
    icon: '💥',
    type: 'neutral',
    probability: 0.08,
  },
  {
    id: 'distress_signal',
    title: 'Señal de Auxilio',
    description: 'Escuchas una transmisión de radio débil pidiendo ayuda, pero no puedes determinar la procedencia.',
    icon: '📡',
    type: 'neutral',
    probability: 0.05,
  },
  {
    id: 'helicopter',
    title: 'Helicóptero',
    description: 'Un helicóptero militar pasa sobrevolando la zona. No te ven, pero hay esperanza.',
    icon: '🚁',
    type: 'neutral',
    probability: 0.03,
    rarityFilter: 'rare',
  },

  // === NUEVOS NEUTRALS ===
  {
    id: 'silent_classroom',
    title: 'Aulas Vacías',
    description: 'Las aulas están vacías y en silencio. Los pupitres están ordenados, como si la vida se hubiera detenido.',
    icon: '📝',
    type: 'neutral',
    probability: 0.08,
    locationTypes: ['educational'],
  },
  {
    id: 'abandoned_lobby',
    title: 'Vestíbulo Silencioso',
    description: 'El vestíbulo del hotel está en penumbra. El silencio es sobrecogedor.',
    icon: '🏨',
    type: 'neutral',
    probability: 0.08,
    locationTypes: ['hotel'],
  },
  {
    id: 'exhibition_hall',
    title: 'Exhibición Abandonada',
    description: 'Las vitrinas del museo están rotas. Los objetos de valor ya no están.',
    icon: '🖼️',
    type: 'neutral',
    probability: 0.07,
    locationTypes: ['museum', 'library'],
  },
  {
    id: 'panoramic_view',
    title: 'Vista Panorámica',
    description: 'Desde lo alto del monumento contemplas la ciudad devastada. Es hermoso y devastador a la vez.',
    icon: '🌅',
    type: 'neutral',
    probability: 0.09,
    locationTypes: ['landmark'],
  },
  {
    id: 'broken_atm',
    title: 'Cajero Fuera de Servicio',
    description: 'El cajero automático está vandalizado. El dinero ya no sirve de nada.',
    icon: '🏧',
    type: 'neutral',
    probability: 0.06,
    locationTypes: ['bank'],
  },
  {
    id: 'empty_stage',
    title: 'Escenario Vacío',
    description: 'El escenario está vacío. El equipo de sonido y luces fue desmantelado.',
    icon: '🎤',
    type: 'neutral',
    probability: 0.06,
    locationTypes: ['entertainment'],
  },
  {
    id: 'mail_piles',
    title: 'Montaña de Correo',
    description: 'Hay pilas de cartas y paquetes sin clasificar. Nada útil, solo recuerdos.',
    icon: '✉️',
    type: 'neutral',
    probability: 0.07,
    locationTypes: ['post_office'],
  },
  {
    id: 'community_board',
    title: 'Tablón de Anuncios',
    description: 'El tablón muestra avisos de cuando todo funcionaba. Ofertas de empleo, clases de yoga... otro mundo.',
    icon: '📋',
    type: 'neutral',
    probability: 0.08,
    locationTypes: ['community_centre'],
  },
  {
    id: 'cold_examination',
    title: 'Sala de Espera',
    description: 'La sala de espera está desierta. Revistas viejas y un silencio incómodo.',
    icon: '🪑',
    type: 'neutral',
    probability: 0.07,
    locationTypes: ['clinic'],
  },

  // === DISCOVERY EVENTS ===
  {
    id: 'hidden_garden',
    title: 'Jardín Secreto',
    description: 'Descubres un jardín oculto con vegetación comestible. ¡Podrías volver aquí!',
    icon: '🌺',
    type: 'discovery',
    probability: 0.06,
    locationTypes: ['park', 'urban_garden', 'restaurant'],
    effect: { food: 3 },
  },
  {
    id: 'underground_spring',
    title: 'Manantial Subterráneo',
    description: 'Encuentras un manantial de agua cristalina bajo los escombros. ¡Agua ilimitada si proteges el acceso!',
    icon: '⛲',
    type: 'discovery',
    probability: 0.04,
    rarityFilter: 'legendary',
    effect: { water: 6 },
  },
  {
    id: 'solar_panel',
    title: 'Panel Solar',
    description: 'Encuentras un panel solar en buen estado. Podrías usarlo para generar electricidad.',
    icon: '☀️',
    type: 'discovery',
    probability: 0.05,
    effect: { fuel: 2 },
    defenseBoost: 1,
  },
  {
    id: 'old_map',
    title: 'Mapa Antiguo',
    description: 'Encuentras un mapa con anotaciones. Marca ubicaciones de posibles suministros.',
    icon: '🗺️',
    type: 'discovery',
    probability: 0.07,
    effect: { food: 1, water: 1, materials: 1 },
  },
  {
    id: 'radio_equipment',
    title: 'Equipo de Radio',
    description: 'Encuentras un equipo de radioaficionado. Podría servir para contactar con otros supervivientes.',
    icon: '📻',
    type: 'discovery',
    probability: 0.04,
    rarityFilter: 'rare',
    defenseBoost: 2,
  },

  // === NUEVOS DISCOVERIES ===
  {
    id: 'survival_library',
    title: 'Sección de Supervivencia',
    description: 'Encuentras una sección de la biblioteca con manuales de supervivencia, botánica y primeros auxilios. ¡Conocimiento invaluable!',
    icon: '📖',
    type: 'discovery',
    probability: 0.07,
    locationTypes: ['library'],
    effect: { materials: 2 },
    defenseBoost: 2,
  },
  {
    id: 'valuable_artifact',
    title: 'Artefacto Valioso',
    description: 'Descubres una pieza de museo que podría intercambiarse por suministros.',
    icon: '🏺',
    type: 'discovery',
    probability: 0.05,
    locationTypes: ['museum'],
    effect: { materials: 4 },
  },
  {
    id: 'generator_room',
    title: 'Generador del Estadio',
    description: 'El generador de emergencia del estadio tiene combustible sin usar.',
    icon: '⚡',
    type: 'discovery',
    probability: 0.05,
    locationTypes: ['sports_centre'],
    effect: { fuel: 3 },
    defenseBoost: 1,
  },
  {
    id: 'surgical_kit',
    title: 'Equipo Quirúrgico',
    description: 'Encuentras un kit quirúrgico sellado y medicamentos de alta especialidad.',
    icon: '🏥',
    type: 'discovery',
    probability: 0.04,
    locationTypes: ['clinic'],
    rarityFilter: 'rare',
    effect: { medicine: 4 },
    defenseBoost: 1,
  },
  {
    id: 'display_solar',
    title: 'Panel Solar de Exhibición',
    description: 'La tienda tenía un panel solar de exhibición completamente funcional.',
    icon: '☀️',
    type: 'discovery',
    probability: 0.05,
    locationTypes: ['electronics_store'],
    effect: { fuel: 2 },
    defenseBoost: 1,
  },
  {
    id: 'pumping_system',
    title: 'Sistema de Bombeo',
    description: 'El sistema de bombeo manual aún funciona. Podrías usarlo para asegurar agua limpia.',
    icon: '⛲',
    type: 'discovery',
    probability: 0.06,
    locationTypes: ['water_facility'],
    effect: { water: 3 },
    defenseBoost: 1,
  },
  {
    id: 'hidden_bunker_hotel',
    title: 'Búnker Secreto',
    description: 'Detrás de un armario encuentras una puerta sellada. ¡Es un búnker privado con provisiones!',
    icon: '🚪',
    type: 'discovery',
    probability: 0.03,
    locationTypes: ['hotel'],
    rarityFilter: 'legendary',
    effect: { food: 6, water: 4, materials: 3, medicine: 2 },
    defenseBoost: 2,
  },
  {
    id: 'chapel_sanctuary',
    title: 'Santuario Escondido',
    description: 'Descubres una cripta o capilla subterránea. Es un lugar seguro y tranquilo.',
    icon: '✝️',
    type: 'discovery',
    probability: 0.04,
    locationTypes: ['place_of_worship'],
    rarityFilter: 'rare',
    effect: { food: 3 },
    defenseBoost: 2,
  },
  {
    id: 'survival_notes',
    title: 'Notas de Supervivencia',
    description: 'Encuentras un cuaderno con anotaciones de otro superviviente. Consejos útiles sobre la zona.',
    icon: '📓',
    type: 'discovery',
    probability: 0.06,
    locationTypes: ['bank', 'post_office', 'community_centre'],
    effect: { materials: 2 },
  },
  {
    id: 'time_capsule',
    title: 'Cápsula del Tiempo',
    description: 'Encuentras una cápsula del tiempo enterrada cerca del monumento. Contiene objetos históricos.',
    icon: '⏳',
    type: 'discovery',
    probability: 0.04,
    locationTypes: ['landmark'],
    rarityFilter: 'rare',
    effect: { materials: 3 },
  },
];

export function generateExplorationEvent(
  locationType: string,
  rarity?: string
): ExplorationEvent | null {
  const eligible = EXPLORATION_EVENTS.filter((ev) => {
    if (ev.locationTypes && ev.locationTypes.length > 0) {
      if (!ev.locationTypes.includes(locationType as LocationType)) return false;
    }
    if (ev.rarityFilter && rarity) {
      if (ev.rarityFilter !== rarity) return false;
    }
    return true;
  });

  if (eligible.length === 0) return null;

  for (const ev of eligible) {
    const roll = Math.random();
    if (roll < ev.probability) return ev;
  }

  return null;
}

export function generateExplorationEventWithBonus(
  locationType: string,
  rarity?: string,
  karma?: number
): ExplorationEvent | null {
  const eligible = EXPLORATION_EVENTS.filter((ev) => {
    if (ev.locationTypes && ev.locationTypes.length > 0) {
      if (!ev.locationTypes.includes(locationType as LocationType)) return false;
    }
    if (ev.rarityFilter && rarity) {
      if (ev.rarityFilter !== rarity) return false;
    }
    return true;
  });

  if (eligible.length === 0) return null;

  // Higher rarity gives a probability bonus
  const rarityBonus = rarity === 'legendary' ? 0.2 : rarity === 'rare' ? 0.1 : 0;
  // Karma alto (+5 o más) da +15% de probabilidad a eventos positivos
  const karmaBonus = (karma !== undefined && karma >= 5) ? 0.15 : 0;

  for (const ev of eligible) {
    const roll = Math.random();
    const positiveBonus = (ev.type === 'positive' || ev.type === 'discovery') ? karmaBonus : 0;
    if (roll < ev.probability + rarityBonus + positiveBonus) return ev;
  }

  return null;
}
