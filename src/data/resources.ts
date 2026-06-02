import type { ResourceLocation } from '../types/game';

/**
 * Genera ubicaciones de recursos alrededor de una posición central.
 * En producción, estas vendrían de una API de lugares reales (Google Places, OSM, etc.)
 */
export function generateNearbyLocations(
  centerLat: number,
  centerLng: number
): ResourceLocation[] {
  const jitter = () => (Math.random() - 0.5) * 0.02; // ~1km de variación

  const templates: Omit<ResourceLocation, 'lat' | 'lng'>[] = [
    {
      id: 'supermarket_1',
      name: 'Supermercado Central',
      type: 'supermarket',
      icon: '🏪',
      resources: { food: 12, water: 8 },
      description: 'Estanterías con comida enlatada y botellas de agua.',
      maxPerDay: 1,
      rarity: 'common',
    },
    {
      id: 'supermarket_2',
      name: 'Mercado Local',
      type: 'supermarket',
      icon: '🛒',
      resources: { food: 8, water: 5 },
      description: 'Un pequeño mercado con suministros básicos.',
      maxPerDay: 1,
      rarity: 'common',
    },
    {
      id: 'pharmacy_1',
      name: 'Farmacia Salud',
      type: 'pharmacy',
      icon: '💊',
      resources: { medicine: 12 },
      description: 'Medicamentos, vendajes y antisépticos.',
      maxPerDay: 1,
      rarity: 'common',
    },
    {
      id: 'pharmacy_2',
      name: 'Botica Natural',
      type: 'pharmacy',
      icon: '🌿',
      resources: { medicine: 8, food: 3 },
      description: 'Remedios naturales y algunos alimentos.',
      maxPerDay: 1,
      rarity: 'common',
    },
    {
      id: 'hardware_1',
      name: 'Ferretería El Martillo',
      type: 'hardware',
      icon: '🔧',
      resources: { materials: 15, fuel: 5 },
      description: 'Herramientas, madera y combustible para herramientas.',
      maxPerDay: 1,
      rarity: 'common',
    },
    {
      id: 'hardware_2',
      name: 'Almacén de Construcción',
      type: 'hardware',
      icon: '🏗️',
      resources: { materials: 20 },
      description: 'Materiales de construcción: madera, clavos, lonas.',
      maxPerDay: 1,
      rarity: 'common',
    },
    {
      id: 'gas_station_1',
      name: 'Gasolinera Ruta 7',
      type: 'gas_station',
      icon: '⛽',
      resources: { fuel: 15 },
      description: 'Combustible para generadores y vehículos.',
      maxPerDay: 2,
      rarity: 'common',
    },
    {
      id: 'gas_station_2',
      name: 'Estación de Servicio Norte',
      type: 'gas_station',
      icon: '⛽',
      resources: { fuel: 12, water: 5 },
      description: 'Combustible y algunas botellas de agua.',
      maxPerDay: 1,
      rarity: 'common',
    },
    {
      id: 'park_1',
      name: 'Parque Municipal',
      type: 'park',
      icon: '🌳',
      resources: { water: 8, food: 5 },
      description: 'Fuente de agua y árboles frutales.',
      maxPerDay: 2,
      rarity: 'common',
    },
    {
      id: 'hospital_1',
      name: 'Hospital Regional',
      type: 'hospital',
      icon: '🏥',
      resources: { medicine: 15, food: 5, water: 5 },
      description: 'Suministros médicos y cafetería del hospital.',
      maxPerDay: 1,
      rarity: 'common',
    },
    // ─── New locations ───
    {
      id: 'mechanical_workshop_1',
      name: 'Taller Mecánico',
      type: 'mechanical_workshop',
      icon: '🔩',
      resources: { materials: 10, fuel: 5 },
      description: 'Herramientas, piezas de repuesto y algo de combustible.',
      maxPerDay: 1,
      rarity: 'common',
    },
    {
      id: 'construction_site_1',
      name: 'Obra Abandonada',
      type: 'construction_site',
      icon: '🏗️',
      resources: { materials: 12 },
      description: 'Un edificio en construcción abandonado. Madera, ladrillos y tuberías.',
      maxPerDay: 1,
      rarity: 'common',
    },
    {
      id: 'urban_garden_1',
      name: 'Huerta Urbana',
      type: 'urban_garden',
      icon: '🥬',
      resources: { food: 8, water: 3 },
      description: 'Un huerto comunitario con verduras frescas y un grifo de agua.',
      maxPerDay: 1,
      rarity: 'common',
    },
    {
      id: 'bakery_1',
      name: 'Panadería',
      type: 'bakery',
      icon: '🥖',
      resources: { food: 10 },
      description: 'Una panadería con harina, pan envasado y conservas.',
      maxPerDay: 1,
      rarity: 'common',
    },
    // ─── New: Restaurants ───
    {
      id: 'restaurant_1',
      name: 'Restaurante La Plaza',
      type: 'restaurant',
      icon: '🍽️',
      resources: { food: 10, water: 5 },
      description: 'Restaurante con despensa llena de conservas y cocina industrial.',
      maxPerDay: 1,
      rarity: 'common',
    },
    {
      id: 'restaurant_2',
      name: 'Cafetería Central',
      type: 'restaurant',
      icon: '☕',
      resources: { food: 6, water: 6 },
      description: 'Cafetería con café envasado, galletas y botellas de agua.',
      maxPerDay: 1,
      rarity: 'common',
    },
    {
      id: 'restaurant_3',
      name: 'Fast Food El Paso',
      type: 'restaurant',
      icon: '🍔',
      resources: { food: 8, water: 4 },
      description: 'Local de comida rápida con congelados y bebidas.',
      maxPerDay: 1,
      rarity: 'common',
    },
    // ─── New: Tiendas de conveniencia ───
    {
      id: 'convenience_store_1',
      name: 'Tienda 24h',
      type: 'convenience_store',
      icon: '🛒',
      resources: { food: 6, water: 4, medicine: 2 },
      description: 'Pequeña tienda de barrio con comida, bebida y botiquín básico.',
      maxPerDay: 1,
      rarity: 'common',
    },
    {
      id: 'convenience_store_2',
      name: 'Bazar Todo a 1€',
      type: 'convenience_store',
      icon: '🎯',
      resources: { food: 5, water: 3, materials: 3 },
      description: 'Bazar con artículos variados, latas de comida y herramientas básicas.',
      maxPerDay: 1,
      rarity: 'common',
    },
    // ─── New: Tiendas de ropa ───
    {
      id: 'clothing_1',
      name: 'Moda Urbana',
      type: 'clothing_store',
      icon: '👕',
      resources: { materials: 10 },
      description: 'Tienda de ropa con telas, cuerdas y materiales textiles aprovechables.',
      maxPerDay: 1,
      rarity: 'common',
    },
    {
      id: 'clothing_2',
      name: 'Zapatería Sport',
      type: 'clothing_store',
      icon: '👟',
      resources: { materials: 8 },
      description: 'Zapatería con cuero, suelas de goma y cordones.',
      maxPerDay: 1,
      rarity: 'common',
    },
    // ─── Rare locations ───
    {
      id: 'bunker_1',
      name: 'Búnker de Emergencia',
      type: 'bunker',
      icon: '🛡️',
      resources: { food: 20, water: 20, medicine: 15, fuel: 10 },
      description: 'Un búnker militar abandonado con suministros de supervivencia. ¡Un gran hallazgo!',
      maxPerDay: 1,
      rarity: 'rare',
    },
    {
      id: 'military_base_1',
      name: 'Base Militar',
      type: 'military_base',
      icon: '🎖️',
      resources: { materials: 25, fuel: 20, medicine: 10, food: 10 },
      description: 'Una base militar evacuada con equipo táctico y suministros.',
      maxPerDay: 1,
      rarity: 'rare',
    },
    {
      id: 'shelter_1',
      name: 'Refugio de Emergencia',
      type: 'shelter',
      icon: '🏕️',
      resources: { food: 25, water: 15, materials: 10, medicine: 5 },
      description: 'Un refugio de la Cruz Roja completamente equipado. Generadores, comida y agua.',
      maxPerDay: 1,
      rarity: 'legendary',
    },
  ];

  return templates.map((t, i) => ({
    ...t,
    id: `${t.id}_${i}`,
    lat: centerLat + jitter(),
    lng: centerLng + jitter(),
  }));
}

/**
 * Escala los recursos de una ubicación según la semana actual del juego.
 * Fórmula: multiplier = 1 + (week - 1) * 0.15 + rarityBonus * (week - 1)
 */
export function scaleResourcesByWeek(
  resources: Partial<Resources>,
  week: number,
  rarity?: 'common' | 'rare' | 'legendary'
): Partial<Resources> {
  if (week <= 1) return resources;
  const rarityBonus = rarity === 'legendary' ? 0.2 : rarity === 'rare' ? 0.1 : 0;
  const multiplier = 1 + (week - 1) * 0.15 + (week - 1) * rarityBonus;
  const scaled: Partial<Resources> = {};
  for (const [key, value] of Object.entries(resources)) {
    scaled[key as keyof Resources] = Math.max(1, Math.round((value as number) * multiplier));
  }
  return scaled;
}

export const LOCATION_COLORS: Record<string, string> = {
  supermarket: '#f59e0b',
  pharmacy: '#ef4444',
  hardware: '#8b5cf6',
  gas_station: '#10b981',
  park: '#22c55e',
  hospital: '#ec4899',
  bunker: '#6b7280',
  military_base: '#4b5563',
  shelter: '#f97316',
  mechanical_workshop: '#a855f7',
  construction_site: '#dc2626',
  urban_garden: '#84cc16',
  bakery: '#d97706',
  restaurant: '#f43f5e',
  convenience_store: '#14b8a6',
  clothing_store: '#8b5cf6',
  educational: '#3b82f6',
  clinic: '#f43f5e',
  hotel: '#a855f7',
  bank: '#f59e0b',
  museum: '#8b5cf6',
  entertainment: '#ec4899',
  sports_centre: '#22c55e',
  library: '#06b6d4',
  bar: '#f97316',
  post_office: '#64748b',
  community_centre: '#14b8a6',
  place_of_worship: '#eab308',
  electronics_store: '#6366f1',
  water_facility: '#0ea5e9',
  landmark: '#78716c',
};
