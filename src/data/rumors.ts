import type { Rumor } from '../types/game';

export const RUMORS: Rumor[] = [
  // ─── Rumores de pista de desastre ───
  {
    id: 'rumor_earthquake_hint',
    text: '"He oído temblores raros viniendo del este. Algo gordo se avecina..."',
    icon: '🌍',
    sourceNpcId: 'nurse_elena',
    type: 'disaster_hint',
    disasterHint: 'earthquake',
    expiresWeek: 0,
    claimed: false,
  },
  {
    id: 'rumor_flood_hint',
    text: '"Los niveles del río están subiendo más rápido de lo normal. Mal asunto."',
    icon: '🌊',
    sourceNpcId: 'guard_miguel',
    type: 'disaster_hint',
    disasterHint: 'flood',
    expiresWeek: 0,
    claimed: false,
  },
  {
    id: 'rumor_storm_hint',
    text: '"Los pájaros emigraron de golpe anoche. Eso solo pasa antes de una tormenta eléctrica."',
    icon: '⛈️',
    sourceNpcId: 'teacher_marcos',
    type: 'disaster_hint',
    disasterHint: 'storm',
    expiresWeek: 0,
    claimed: false,
  },
  {
    id: 'rumor_plague_hint',
    text: '"En el hospital vieron varios casos de una enfermedad nueva. Ten cuidado."',
    icon: '🦠',
    sourceNpcId: 'nurse_elena',
    type: 'disaster_hint',
    disasterHint: 'plague',
    expiresWeek: 0,
    claimed: false,
  },
  // ─── Rumores de bonificación de ubicación ───
  {
    id: 'rumor_hidden_pharmacy',
    text: '"Hay una farmacia que no saquearon. Está detrás de la clínica vieja."',
    icon: '💊',
    sourceNpcId: 'librarian_carmen',
    type: 'location_bonus',
    effect: { medicine: 5 },
    locationType: 'pharmacy',
    expiresWeek: 0,
    claimed: false,
  },
  {
    id: 'rumor_abandoned_truck',
    text: '"Un camión de reparto volcó cerca del supermercado. Nadie lo ha tocado."',
    icon: '🚛',
    sourceNpcId: 'merchant_rodrigo',
    type: 'location_bonus',
    effect: { food: 4, water: 3 },
    locationType: 'supermarket',
    expiresWeek: 0,
    claimed: false,
  },
  {
    id: 'rumor_fuel_depot',
    text: '"La gasolinera del sur tiene el depósito subterráneo casi lleno."',
    icon: '⛽',
    sourceNpcId: 'bandit_raúl',
    type: 'location_bonus',
    effect: { fuel: 6 },
    locationType: 'gas_station',
    expiresWeek: 0,
    claimed: false,
  },
  {
    id: 'rumor_garden_harvest',
    text: '"El huerto urbano dio una cosecha enorme. Date prisa antes de que lo pillen."',
    icon: '🥬',
    sourceNpcId: 'volunteer_maria',
    type: 'location_bonus',
    effect: { food: 6 },
    locationType: 'urban_garden',
    expiresWeek: 0,
    claimed: false,
  },
  // ─── Rumores de suministro oculto ───
  {
    id: 'rumor_hidden_bunker',
    text: '"Hay un búnker de la guerra fría bajo el banco central. Dicen que está lleno de provisiones."',
    icon: '🏪',
    sourceNpcId: 'guard_miguel',
    type: 'hidden_supply',
    effect: { food: 8, water: 6, medicine: 4 },
    expiresWeek: 0,
    claimed: false,
  },
  {
    id: 'rumor_military_cache',
    text: '"Un convoy militar abandonó suministros al norte del cuartel."',
    icon: '🎖️',
    sourceNpcId: 'engineer_rosa',
    type: 'hidden_supply',
    effect: { fuel: 5, materials: 5, medicine: 3 },
    expiresWeek: 0,
    claimed: false,
  },
  // ─── Rumores de evento de facción ───
  {
    id: 'rumor_trade_caravan',
    text: '"Una caravana de mercaderes pasará por aquí pronto. Traen de todo."',
    icon: '🐫',
    sourceNpcId: 'merchant_rodrigo',
    type: 'faction_event',
    effect: { materials: 3, food: 3 },
    expiresWeek: 0,
    claimed: false,
  },
  {
    id: 'rumor_militia_forming',
    text: '"Los militares están reclutando. Si les caes bien, igual compartes su equipo."',
    icon: '🪖',
    sourceNpcId: 'guard_miguel',
    type: 'faction_event',
    effect: { fuel: 3, materials: 2 },
    expiresWeek: 0,
    claimed: false,
  },
];

export function getRumorById(id: string): Rumor | undefined {
  return RUMORS.find((r) => r.id === id);
}

export function getRumorsByType(type: Rumor['type']): Rumor[] {
  return RUMORS.filter((r) => r.type === type);
}

export function getAvailableRumors(
  activeRumors: Rumor[],
  completedRumors: string[],
  _currentWeek: number,
  karma: number
): Rumor[] {
  // Rumores que no están activos ni completados, y que no han expirado
  const activeIds = new Set(activeRumors.map((r) => r.id));
  const completedIds = new Set(completedRumors);

  return RUMORS.filter(
    (r) =>
      !activeIds.has(r.id) &&
      !completedIds.has(r.id) &&
      // Mayor karma = más probabilidad de recibir rumores
      Math.random() < 0.3 + karma * 0.03
  );
}
