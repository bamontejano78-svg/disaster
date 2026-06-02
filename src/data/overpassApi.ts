import type { ResourceLocation, Resources } from '../types/game';

// ─── OSM Tag → Game Type Mapping ───
interface OsmCategory {
  type: string;
  icon: string;
  resources: Partial<Resources>;
  description: string;
  maxPerDay: number;
}

const TAG_CATEGORY_MAP: Record<string, OsmCategory> = {
  'shop=supermarket': { type: 'supermarket', icon: '🏪', resources: { food: 12, water: 8 }, description: 'Estanterías con comida enlatada y botellas de agua.', maxPerDay: 1 },
  'shop=department_store': { type: 'supermarket', icon: '🏬', resources: { food: 10, water: 6, materials: 5 }, description: 'Grandes almacenes con comida, ropa y utensilios.', maxPerDay: 1 },
  'shop=wholesale': { type: 'supermarket', icon: '📦', resources: { food: 15, water: 10 }, description: 'Almacén mayorista con palés de comida y bebida.', maxPerDay: 1 },
  'shop=beverages': { type: 'supermarket', icon: '🧃', resources: { water: 12, food: 3 }, description: 'Botellas de agua, refrescos y bebidas envasadas.', maxPerDay: 1 },
  'amenity=pharmacy': { type: 'pharmacy', icon: '💊', resources: { medicine: 12 }, description: 'Medicamentos, vendajes y antisépticos.', maxPerDay: 1 },
  'shop=hardware': { type: 'hardware', icon: '🔧', resources: { materials: 15, fuel: 5 }, description: 'Herramientas, madera y suministros de construcción.', maxPerDay: 1 },
  'shop=doityourself': { type: 'hardware', icon: '🔧', resources: { materials: 20 }, description: 'Materiales de bricolaje: madera, clavos, lonas.', maxPerDay: 1 },
  'amenity=fuel': { type: 'gas_station', icon: '⛽', resources: { fuel: 15 }, description: 'Combustible para generadores y vehículos.', maxPerDay: 2 },
  'leisure=park': { type: 'park', icon: '🌳', resources: { water: 8, food: 5 }, description: 'Parque público con fuentes y posible fuente de alimentos.', maxPerDay: 2 },
  'leisure=garden': { type: 'park', icon: '🌺', resources: { water: 6, food: 8 }, description: 'Jardín con plantas comestibles, hierbas y fuente de agua.', maxPerDay: 2 },
  'landuse=allotments': { type: 'park', icon: '🥕', resources: { food: 12, water: 5, materials: 3 }, description: 'Huertos urbanos con verduras, agua y herramientas.', maxPerDay: 2 },
  'amenity=fountain': { type: 'park', icon: '⛲', resources: { water: 10 }, description: 'Fuente pública con agua potable.', maxPerDay: 3 },
  'amenity=drinking_water': { type: 'park', icon: '🚰', resources: { water: 8 }, description: 'Punto de agua potable público.', maxPerDay: 3 },
  'amenity=hospital': { type: 'hospital', icon: '🏥', resources: { medicine: 15, food: 5, water: 5 }, description: 'Suministros médicos y cafetería del hospital.', maxPerDay: 1 },
  'military=bunker': { type: 'bunker', icon: '🛡️', resources: { food: 20, water: 20, medicine: 15, fuel: 10 }, description: 'Búnker militar con suministros de supervivencia.', maxPerDay: 1 },
  'amenity=police': { type: 'military_base', icon: '🚔', resources: { materials: 15, food: 5, medicine: 5 }, description: 'Comisaría abandonada con radios y suministros.', maxPerDay: 1 },
  'amenity=fire_station': { type: 'military_base', icon: '🚒', resources: { materials: 12, water: 10, medicine: 5 }, description: 'Parque de bomberos con mangueras y botiquín.', maxPerDay: 1 },
  'amenity=social_facility': { type: 'shelter', icon: '🏕️', resources: { food: 25, water: 15, materials: 10, medicine: 5 }, description: 'Refugio de emergencia completamente equipado.', maxPerDay: 1 },
  'shop=car_repair': { type: 'mechanical_workshop', icon: '🔩', resources: { materials: 10, fuel: 5 }, description: 'Herramientas, piezas de repuesto y algo de combustible.', maxPerDay: 1 },
  'landuse=construction': { type: 'construction_site', icon: '🏗️', resources: { materials: 12 }, description: 'Edificio en construcción abandonado con materiales.', maxPerDay: 1 },
  'shop=greengrocer': { type: 'urban_garden', icon: '🥬', resources: { food: 8, water: 3 }, description: 'Frutería con verduras frescas.', maxPerDay: 1 },
  'shop=garden_centre': { type: 'urban_garden', icon: '🌱', resources: { food: 6, water: 5, materials: 3 }, description: 'Centro de jardinería con plantas y herramientas.', maxPerDay: 1 },
  'shop=bakery': { type: 'bakery', icon: '🥖', resources: { food: 10 }, description: 'Panadería con harina, pan y conservas.', maxPerDay: 1 },
  'shop=butcher': { type: 'bakery', icon: '🥩', resources: { food: 12 }, description: 'Carnicería con carne envasada y conservas.', maxPerDay: 1 },
  'amenity=restaurant': { type: 'restaurant', icon: '🍽️', resources: { food: 10, water: 5 }, description: 'Restaurante con despensa y cocina industrial.', maxPerDay: 1 },
  'amenity=cafe': { type: 'restaurant', icon: '☕', resources: { food: 6, water: 6 }, description: 'Cafetería con café, agua y algo de comida.', maxPerDay: 1 },
  'amenity=fast_food': { type: 'restaurant', icon: '🍔', resources: { food: 8, water: 4 }, description: 'Fast food con conservas y bebidas.', maxPerDay: 1 },
  'shop=convenience': { type: 'convenience_store', icon: '🏪', resources: { food: 6, water: 4, medicine: 2 }, description: 'Tienda 24h con comida, bebida y botiquín.', maxPerDay: 1 },
  'shop=clothes': { type: 'clothing_store', icon: '👕', resources: { materials: 10 }, description: 'Tienda de ropa con telas y materiales textiles.', maxPerDay: 1 },
  'amenity=school': { type: 'educational', icon: '🏫', resources: { food: 8, materials: 5 }, description: 'Colegio con comedor escolar y material.', maxPerDay: 1 },
  'amenity=university': { type: 'educational', icon: '🎓', resources: { food: 10, materials: 8, water: 5 }, description: 'Universidad con cafetería y laboratorios.', maxPerDay: 1 },
  'amenity=clinic': { type: 'clinic', icon: '🩺', resources: { medicine: 10 }, description: 'Clínica con suministros médicos básicos.', maxPerDay: 1 },
  'amenity=doctors': { type: 'clinic', icon: '🩻', resources: { medicine: 8 }, description: 'Consultorio médico con botiquín.', maxPerDay: 1 },
  'tourism=hotel': { type: 'hotel', icon: '🏨', resources: { food: 10, water: 8, materials: 5 }, description: 'Hotel con restaurante y minibares.', maxPerDay: 1 },
  'tourism=hostel': { type: 'hotel', icon: '🛏️', resources: { food: 6, water: 5, materials: 3 }, description: 'Hostal con cocina compartida.', maxPerDay: 1 },
  'amenity=bank': { type: 'bank', icon: '🏦', resources: { materials: 15 }, description: 'Banco con cajas de seguridad y material.', maxPerDay: 1 },
  'tourism=museum': { type: 'museum', icon: '🏛️', resources: { materials: 12 }, description: 'Museo con objetos valiosos.', maxPerDay: 1 },
  'tourism=attraction': { type: 'landmark', icon: '🗿', resources: { materials: 5 }, description: 'Atracción turística con tienda de recuerdos.', maxPerDay: 1 },
  'amenity=cinema': { type: 'entertainment', icon: '🎬', resources: { food: 6, materials: 5 }, description: 'Cine con dulcería y material.', maxPerDay: 1 },
  'amenity=theatre': { type: 'entertainment', icon: '🎭', resources: { materials: 8 }, description: 'Teatro con utilería aprovechable.', maxPerDay: 1 },
  'leisure=sports_centre': { type: 'sports_centre', icon: '🏋️', resources: { water: 8, materials: 5 }, description: 'Centro deportivo con vestuarios y fuentes.', maxPerDay: 1 },
  'leisure=stadium': { type: 'sports_centre', icon: '🏟️', resources: { materials: 10, water: 5 }, description: 'Estadio con almacenes y vestuarios.', maxPerDay: 1 },
  'leisure=swimming_pool': { type: 'sports_centre', icon: '🏊', resources: { water: 10 }, description: 'Piscina con agua y productos de limpieza.', maxPerDay: 1 },
  'amenity=library': { type: 'library', icon: '📚', resources: { materials: 10 }, description: 'Biblioteca con libros y papelería.', maxPerDay: 1 },
  'amenity=bar': { type: 'bar', icon: '🍺', resources: { water: 8, food: 3 }, description: 'Bar con bebidas y algo de comida.', maxPerDay: 1 },
  'amenity=pub': { type: 'bar', icon: '🍻', resources: { water: 10, food: 5 }, description: 'Pub con barra completa y alimentos.', maxPerDay: 1 },
  'amenity=post_office': { type: 'post_office', icon: '📮', resources: { materials: 8 }, description: 'Oficina de correos con paquetes.', maxPerDay: 1 },
  'amenity=community_centre': { type: 'community_centre', icon: '🏘️', resources: { food: 6, water: 5, materials: 3 }, description: 'Centro comunitario con cocina y suministros.', maxPerDay: 1 },
  'amenity=place_of_worship': { type: 'place_of_worship', icon: '⛪', resources: { food: 5, materials: 3 }, description: 'Iglesia con despensa parroquial.', maxPerDay: 2 },
  'shop=computer': { type: 'electronics_store', icon: '💻', resources: { materials: 12 }, description: 'Tienda de informática con componentes y baterías.', maxPerDay: 1 },
  'man_made=water_tower': { type: 'water_facility', icon: '🚰', resources: { water: 20 }, description: 'Depósito de agua potable.', maxPerDay: 2 },
  'man_made=water_well': { type: 'water_facility', icon: '🪣', resources: { water: 15 }, description: 'Pozo de agua con bomba manual.', maxPerDay: 2 },
  'amenity=marketplace': { type: 'supermarket', icon: '🏪', resources: { food: 10, water: 6, materials: 4 }, description: 'Mercado con puestos de comida y bebida.', maxPerDay: 1 },
  'tourism=camp_site': { type: 'shelter', icon: '🏕️', resources: { food: 10, water: 8, materials: 5 }, description: 'Camping con agua potable y zona de cocina.', maxPerDay: 1 },
  'amenity=townhall': { type: 'shelter', icon: '🏛️', resources: { food: 10, water: 8, materials: 12 }, description: 'Ayuntamiento con suministros de emergencia.', maxPerDay: 1 },
};

// ─── Types ───
interface OsmElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}
interface OverpassResponse { elements: OsmElement[]; }

// ─── Configuration ───
const OVERPASS_PROXY = '/api/overpass';
const SEARCH_RADIUS = 1500; // metros — más pequeño = respuesta más rápida
const MAX_LOCATIONS = 25;
const PROXY_TIMEOUT = 15000; // 15s — el proxy tiene 18s, dejamos margen
export const MIN_REAL_LOCATIONS = 3;

// ─── Cache ───
const locationCache = new Map<string, { locations: ResourceLocation[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

function getCacheKey(lat: number, lng: number): string {
  // Redondear a 3 decimales (~100m precisión) para reusar cache con pequeños movimientos
  return `${Math.round(lat * 1000) / 1000},${Math.round(lng * 1000) / 1000}`;
}

// ─── Build a SINGLE Overpass query for all tags at once ───
function buildUnifiedQuery(lat: number, lng: number): string {
  const tagPairs = Object.keys(TAG_CATEGORY_MAP);

  // Agrupar por prefijo (amenity, shop, leisure, etc.) para queries más eficientes
  const byKey: Record<string, string[]> = {};
  for (const pair of tagPairs) {
    const [key, value] = pair.split('=');
    if (!byKey[key]) byKey[key] = [];
    byKey[key].push(value);
  }

  const lines: string[] = [];
  for (const [key, values] of Object.entries(byKey)) {
    // Usar regex OR: ["key"~"val1|val2|val3"] — una sola línea por key
    const pattern = values.map(v => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    // nodes + ways con centro
    lines.push(`  node["${key}"~"^(${pattern})$"](around:${SEARCH_RADIUS},${lat},${lng});`);
    lines.push(`  way["${key}"~"^(${pattern})$"](around:${SEARCH_RADIUS},${lat},${lng});`);
  }

  return `[out:json][timeout:14];\n(\n${lines.join('\n')}\n);\nout body center;`;
}

// ─── Main fetch — una sola petición al proxy ───
export async function fetchNearbyLocations(lat: number, lng: number): Promise<ResourceLocation[]> {
  const cacheKey = getCacheKey(lat, lng);
  const cached = locationCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[OSM] Cache hit for ${cacheKey}: ${cached.locations.length} locations`);
    return cached.locations;
  }

  const query = buildUnifiedQuery(lat, lng);
  console.log(`[OSM] Single unified query for (${lat.toFixed(4)}, ${lng.toFixed(4)}), radius ${SEARCH_RADIUS}m`);

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), PROXY_TIMEOUT);

    let response: Response;
    try {
      response = await fetch(OVERPASS_PROXY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }

    if (!response.ok) {
      throw new Error(`Proxy HTTP ${response.status}`);
    }

    const data: OverpassResponse = await response.json();
    console.log(`[OSM] Got ${data.elements?.length ?? 0} raw elements`);

    if (!data.elements || data.elements.length === 0) {
      return [];
    }

    const locations = mapOsmToLocations(data.elements);
    console.log(`[OSM] Mapped to ${locations.length} game locations`);

    if (locations.length > 0) {
      locationCache.set(cacheKey, { locations, timestamp: Date.now() });
    }

    return locations;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[OSM] Fetch failed:', msg);
    return [];
  }
}

// ─── Map OSM elements → game locations ───
function mapOsmToLocations(elements: OsmElement[]): ResourceLocation[] {
  const locations: ResourceLocation[] = [];
  const seen = new Set<string>();

  for (const el of elements) {
    if (locations.length >= MAX_LOCATIONS) break;

    // Obtener coordenadas (nodes tienen lat/lon directamente, ways tienen center)
    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    if (!lat || !lon) continue;

    const tags = el.tags ?? {};
    const category = findCategory(tags);
    if (!category) continue;

    // Deduplicar por nombre+tipo o por id
    const name = tags.name ?? String(el.id);
    const dedupKey = `${name}-${category.type}`;
    if (seen.has(dedupKey)) continue;
    seen.add(dedupKey);

    locations.push({
      id: `osm_${el.id}`,
      name: formatName(tags.name ?? '', category.type),
      type: category.type,
      lat,
      lng: lon,
      icon: category.icon,
      resources: { ...category.resources },
      description: category.description,
      maxPerDay: category.maxPerDay,
    });
  }

  return locations;
}

function findCategory(tags: Record<string, string>): OsmCategory | null {
  for (const [pair, category] of Object.entries(TAG_CATEGORY_MAP)) {
    const [key, value] = pair.split('=');
    if (tags[key] === value) return category;
  }
  return null;
}

function formatName(name: string, type: string): string {
  if (!name || name.length < 2) {
    const friendly: Record<string, string> = {
      supermarket: 'Supermercado', pharmacy: 'Farmacia', hardware: 'Ferretería',
      gas_station: 'Gasolinera', park: 'Parque', hospital: 'Hospital',
      bunker: 'Búnker', military_base: 'Base Militar', shelter: 'Refugio',
      mechanical_workshop: 'Taller Mecánico', construction_site: 'Obra',
      urban_garden: 'Huerta', bakery: 'Panadería', restaurant: 'Restaurante',
      convenience_store: 'Tienda 24h', clothing_store: 'Tienda de Ropa',
      educational: 'Centro Educativo', clinic: 'Clínica', hotel: 'Hotel',
      bank: 'Banco', museum: 'Museo', entertainment: 'Local de Ocio',
      sports_centre: 'Centro Deportivo', library: 'Biblioteca', bar: 'Bar',
      post_office: 'Oficina de Correos', community_centre: 'Centro Comunitario',
      place_of_worship: 'Lugar de Culto', electronics_store: 'Tienda de Electrónica',
      water_facility: 'Depósito de Agua', landmark: 'Monumento',
    };
    return friendly[type] ?? 'Lugar';
  }
  return name.charAt(0).toUpperCase() + name.slice(1);
}
