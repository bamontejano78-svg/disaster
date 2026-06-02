import type { Disaster, LocationType } from '../types/game';

export const DISASTERS: Disaster[] = [
  {
    type: 'earthquake',
    name: 'Terremoto',
    description:
      '¡Un terremoto de magnitud 7.8 sacude la región! Los edificios colapsan y necesitas materiales para reforzar tu refugio y medicina para atender heridos.',
    icon: '🌍',
    requiredResources: { materials: 30, medicine: 15 },
    penalty: { food: 5, water: 5, fuel: 5 },
    minWeek: 1,
    hints: [
      'Los perros del vecindario no dejan de ladrar sin motivo aparente...',
      'Has notado pequeñas grietas en el suelo que antes no estaban allí.',
    ],
  },
  {
    type: 'flood',
    name: 'Inundación',
    description:
      '¡Lluvias torrenciales causan una inundación masiva! Necesitas materiales para construir barreras y comida para resistir hasta que baje el agua.',
    icon: '🌊',
    requiredResources: { materials: 25, food: 20 },
    penalty: { water: 5, fuel: 10, medicine: 5 },
    minWeek: 1,
    hints: [
      'El nivel del río cercano ha subido misteriosamente durante la noche.',
      'El cielo está encapotado y el viento huele a humedad y barro.',
    ],
  },
  {
    type: 'storm',
    name: 'Tormenta Eléctrica',
    description:
      '¡Una supertormenta con vientos huracanados azota la zona! Necesitas combustible para mantener el calor y materiales para reparar los daños.',
    icon: '⛈️',
    requiredResources: { fuel: 25, materials: 20 },
    penalty: { food: 10, water: 5, medicine: 5 },
    minWeek: 2,
    hints: [
      'El aire está cargado de electricidad estática y se te eriza el vello.',
      'Las nubes en el horizonte tienen un tono verdoso que no has visto antes.',
    ],
  },
  {
    type: 'wildfire',
    name: 'Incendio Forestal',
    description:
      '¡Un incendio forestal avanza rápidamente hacia tu posición! Necesitas agua para combatir el fuego, medicina para quemaduras y combustible para evacuar.',
    icon: '🔥',
    requiredResources: { water: 30, medicine: 20, fuel: 15 },
    penalty: { food: 10, materials: 15 },
    minWeek: 2,
    hints: [
      'El viento arrastra un olor a humo lejano. Los pájaros huyen en dirección contraria.',
      'Una fina capa de ceniza gris cubre tu ropa al amanecer.',
    ],
  },
  {
    type: 'heatwave',
    name: 'Ola de Calor Extrema',
    description:
      '¡Temperaturas extremas de 50°C azotan la región! Necesitas agua y comida para mantenerte hidratado y con energía durante la ola de calor.',
    icon: '🥵',
    requiredResources: { water: 35, food: 15 },
    penalty: { medicine: 10, fuel: 5, materials: 5 },
    minWeek: 3,
    hints: [
      'El termómetro marcó 38°C a la sombra hoy. Nunca había hecho tanto calor tan temprano.',
      'Las plantas del jardín están marchitas y el asfalto parece derretirse.',
    ],
  },
  {
    type: 'tsunami',
    name: 'Tsunami',
    description:
      '¡Una ola gigante se acerca a la costa! Necesitas materiales para construir barreras, comida para resistir y medicina para atender heridos tras el impacto.',
    icon: '🌋',
    requiredResources: { materials: 35, food: 15, medicine: 10 },
    penalty: { water: 15, fuel: 10, food: 5 },
    minWeek: 4,
    hints: [
      'El mar está sospechosamente en calma. Los pescadores locales han recogido sus redes temprano.',
      'Se escucha un rumor sordo desde el horizonte, como un trueno lejano y constante.',
    ],
  },
  {
    type: 'plague',
    name: 'Plaga',
    description:
      '¡Un brote epidémico se propaga rápidamente! Necesitas grandes cantidades de medicina para tratar a los enfermos y comida para mantener las defensas altas.',
    icon: '🦠',
    requiredResources: { medicine: 40, food: 20 },
    penalty: { water: 5, materials: 10, fuel: 10 },
    minWeek: 3,
    hints: [
      'Tu vecino tose sin parar. En la radio hablan de una "gripe rara" que circula por la zona.',
      'Los hospitales están saturados. Las mascarillas escasean en las farmacias.',
    ],
  },
  {
    type: 'tornado',
    name: 'Tornado',
    description:
      '¡Un tornado categoría F4 arrasa todo a su paso! Necesitas materiales para reconstruir, combustible para el generador y agua para sobrevivir al caos.',
    icon: '🌪️',
    requiredResources: { materials: 30, fuel: 20, water: 15 },
    penalty: { food: 15, medicine: 10 },
    minWeek: 2,
    hints: [
      'El cielo tiene un tono amarillento y el viento viene en ráfagas erráticas.',
      'Las sirenas de emergencia sonarán en cualquier momento. El aire está en absoluta calma.',
    ],
  },
  {
    type: 'blizzard',
    name: 'Nevasca',
    description:
      '¡Una tormenta de nieve congela la región! Necesitas combustible para mantener el calor, comida para resistir el aislamiento y materiales para reparar los daños del hielo.',
    icon: '❄️',
    requiredResources: { fuel: 35, food: 20, materials: 10 },
    penalty: { water: 15, medicine: 5 },
    minWeek: 5,
    hints: [
      'La temperatura ha caído de golpe esta noche. Escuchas crujir los árboles por la helada.',
      'Se acerca una tormenta de nieve. Puedes ver la cortina blanca en el horizonte.',
    ],
  },
];

export function getDisastersForWeek(week: number): Disaster[] {
  return DISASTERS.filter((d) => d.minWeek <= week);
}

export function getRandomDisaster(week: number): Disaster {
  const available = getDisastersForWeek(week);
  return available[Math.floor(Math.random() * available.length)];
}

export function calculateDisasterDifficulty(
  baseRequirements: Partial<Record<string, number>>,
  week: number
): Partial<Record<string, number>> {
  const multiplier = 1 + (week - 1) * 0.25; // +25% por semana
  const scaled: Partial<Record<string, number>> = {};
  for (const [key, value] of Object.entries(baseRequirements)) {
    if (typeof value === 'number') {
      scaled[key] = Math.round(value * multiplier);
    }
  }
  return scaled;
}

/**
 * Devuelve los tipos de ubicación debilitados por un desastre específico.
 * Las ubicaciones de estos tipos tendrán recursos reducidos al 50% la semana siguiente.
 */
export function getWeakenedTypesByDisaster(disaster: DisasterType | null): LocationType[] {
  if (!disaster) return [];
  const map: Partial<Record<DisasterType, LocationType[]>> = {
    flood: ['park', 'urban_garden', 'water_facility'],
    wildfire: ['park', 'urban_garden'],
    earthquake: ['construction_site', 'hardware'],
    storm: ['gas_station', 'mechanical_workshop'],
    heatwave: ['park', 'urban_garden', 'water_facility'],
    tsunami: ['park', 'water_facility', 'gas_station'],
    plague: ['pharmacy', 'hospital', 'clinic'],
    tornado: ['construction_site', 'hardware', 'mechanical_workshop'],
    blizzard: ['park', 'urban_garden', 'gas_station'],
  };
  return map[disaster] ?? [];
}
