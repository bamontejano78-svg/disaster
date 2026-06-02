import type { ResourceLocation, Resources } from '../types/game';

// ─── OSM Tag → Game Type Mapping ───
interface OsmCategory {
  type: string;
  icon: string;
  resources: Partial<Resources>;
  description: string;
  maxPerDay: number;
}

// Mapa reducido y limpio — solo los tags más comunes en OSM real
const TAG_CATEGORY_MAP: Record<string, OsmCategory> = {
  // Supermercados / comida
  'shop=supermarket':      { type: 'supermarket',   icon: '🏪', resources: { food: 12, water: 8 },             description: 'Comida enlatada y botellas de agua.',      maxPerDay: 1 },
  'shop=convenience':      { type: 'convenience_store', icon: '🛒', resources: { food: 6, water: 4, medicine: 2 }, description: 'Tienda 24h con básicos.',                maxPerDay: 1 },
  'shop=bakery':           { type: 'bakery',         icon: '🥖', resources: { food: 10 },                       description: 'Panadería con harina y conservas.',         maxPerDay: 1 },
  'shop=butcher':          { type: 'bakery',         icon: '🥩', resources: { food: 12 },                       description: 'Carnicería con carne envasada.',             maxPerDay: 1 },
  'shop=greengrocer':      { type: 'urban_garden',   icon: '🥬', resources: { food: 8, water: 3 },              description: 'Frutería con verduras frescas.',             maxPerDay: 1 },
  'shop=beverages':        { type: 'supermarket',    icon: '🧃', resources: { water: 12, food: 3 },             description: 'Bebidas envasadas.',                         maxPerDay: 1 },
  'amenity=marketplace':   { type: 'supermarket',    icon: '🏪', resources: { food: 10, water: 6 },             description: 'Mercado con puestos de comida.',             maxPerDay: 1 },
  // Restaurantes / bares
  'amenity=restaurant':    { type: 'restaurant',     icon: '🍽️', resources: { food: 10, water: 5 },             description: 'Restaurante con despensa.',                  maxPerDay: 1 },
  'amenity=cafe':          { type: 'restaurant',     icon: '☕', resources: { food: 6, water: 6 },              description: 'Cafetería con agua y comida.',               maxPerDay: 1 },
  'amenity=fast_food':     { type: 'restaurant',     icon: '🍔', resources: { food: 8, water: 4 },              description: 'Fast food con conservas.',                   maxPerDay: 1 },
  'amenity=bar':           { type: 'bar',            icon: '🍺', resources: { water: 8, food: 3 },              description: 'Bar con bebidas y algo de comida.',          maxPerDay: 1 },
  'amenity=pub':           { type: 'bar',            icon: '🍻', resources: { water: 10, food: 5 },             description: 'Pub con barra completa.',                    maxPerDay: 1 },
  // Farmacias / salud
  'amenity=pharmacy':      { type: 'pharmacy',       icon: '💊', resources: { medicine: 12 },                   description: 'Medicamentos y antisépticos.',               maxPerDay: 1 },
  'amenity=hospital':      { type: 'hospital',       icon: '🏥', resources: { medicine: 15, food: 5, water: 5 }, description: 'Suministros médicos.',                      maxPerDay: 1 },
  'amenity=clinic':        { type: 'clinic',         icon: '🩺', resources: { medicine: 10 },                   description: 'Clínica con botiquín.',                      maxPerDay: 1 },
  'amenity=doctors':       { type: 'clinic',         icon: '🩻', resources: { medicine: 8 },                    description: 'Consultorio médico.',                        maxPerDay: 1 },
  'amenity=dentist':       { type: 'clinic',         icon: '🦷', resources: { medicine: 6 },                    description: 'Clínica dental.',                            maxPerDay: 1 },
  // Materiales / combustible
  'shop=hardware':         { type: 'hardware',       icon: '🔧', resources: { materials: 15, fuel: 5 },         description: 'Herramientas y materiales.',                 maxPerDay: 1 },
  'shop=doityourself':     { type: 'hardware',       icon: '🔧', resources: { materials: 20 },                  description: 'Bricolaje: madera, clavos, lonas.',          maxPerDay: 1 },
  'amenity=fuel':          { type: 'gas_station',    icon: '⛽', resources: { fuel: 15 },                       description: 'Combustible para generadores.',              maxPerDay: 2 },
  'shop=car_repair':       { type: 'mechanical_workshop', icon: '🔩', resources: { materials: 10, fuel: 5 },    description: 'Taller con piezas y combustible.',           maxPerDay: 1 },
  // Parques / agua
  'leisure=park':          { type: 'park',           icon: '🌳', resources: { water: 8, food: 5 },              description: 'Parque con fuentes y árboles frutales.',     maxPerDay: 2 },
  'leisure=garden':        { type: 'park',           icon: '🌺', resources: { water: 6, food: 8 },              description: 'Jardín con plantas y agua.',                 maxPerDay: 2 },
  'leisure=nature_reserve':{ type: 'park',           icon: '🏞️', resources: { water: 10, food: 8, materials: 5 }, description: 'Reserva natural.',                         maxPerDay: 2 },
  'landuse=allotments':    { type: 'park',           icon: '🥕', resources: { food: 12, water: 5, materials: 3 }, description: 'Huertos urbanos.',                         maxPerDay: 2 },
  'landuse=forest':        { type: 'park',           icon: '🌲', resources: { water: 5, food: 7, materials: 10 }, description: 'Zona forestal con madera y frutos.',       maxPerDay: 2 },
  'landuse=orchard':       { type: 'park',           icon: '🍎', resources: { food: 12, water: 4 },             description: 'Huerto de frutales.',                        maxPerDay: 2 },
  'amenity=fountain':      { type: 'park',           icon: '⛲', resources: { water: 10 },                      description: 'Fuente pública con agua potable.',           maxPerDay: 3 },
  'amenity=drinking_water':{ type: 'park',           icon: '🚰', resources: { water: 8 },                       description: 'Punto de agua potable.',                     maxPerDay: 3 },
  'man_made=water_tower':  { type: 'water_facility', icon: '🚰', resources: { water: 20 },                      description: 'Depósito de agua potable.',                  maxPerDay: 2 },
  // Refugios / seguridad
  'amenity=social_facility': { type: 'shelter',      icon: '🏕️', resources: { food: 25, water: 15, materials: 10, medicine: 5 }, description: 'Refugio de emergencia.', maxPerDay: 1 },
  'tourism=camp_site':     { type: 'shelter',        icon: '🏕️', resources: { food: 10, water: 8, materials: 5 }, description: 'Camping con agua y cocina.',               maxPerDay: 1 },
  'amenity=townhall':      { type: 'shelter',        icon: '🏛️', resources: { food: 10, water: 8, materials: 12 }, description: 'Ayuntamiento con reservas de emergencia.', maxPerDay: 1 },
  'amenity=police':        { type: 'military_base',  icon: '🚔', resources: { materials: 15, food: 5, medicine: 5 }, description: 'Comisaría con suministros.',            maxPerDay: 1 },
  'amenity=fire_station':  { type: 'military_base',  icon: '🚒', resources: { materials: 12, water: 10, medicine: 5 }, description: 'Parque de bomberos.',                 maxPerDay: 1 },
  // Educación / cultura
  'amenity=school':        { type: 'educational',    icon: '🏫', resources: { food: 8, materials: 5 },          description: 'Colegio con comedor escolar.',               maxPerDay: 1 },
  'amenity=university':    { type: 'educational',    icon: '🎓', resources: { food: 10, materials: 8, water: 5 }, description: 'Universidad con cafetería.',                maxPerDay: 1 },
  'amenity=library':       { type: 'library',        icon: '📚', resources: { materials: 10 },                  description: 'Biblioteca con libros y papelería.',         maxPerDay: 1 },
  'tourism=museum':        { type: 'museum',         icon: '🏛️', resources: { materials: 12 },                  description: 'Museo con objetos valiosos.',                maxPerDay: 1 },
  // Comercio general
  'shop=clothes':          { type: 'clothing_store', icon: '👕', resources: { materials: 10 },                  description: 'Ropa y materiales textiles.',                maxPerDay: 1 },
  'shop=garden_centre':    { type: 'urban_garden',   icon: '🌱', resources: { food: 6, water: 5, materials: 3 }, description: 'Centro de jardinería.',                    maxPerDay: 1 },
  'shop=computer':         { type: 'electronics_store', icon: '💻', resources: { materials: 12 },              description: 'Componentes y baterías.',                     maxPerDay: 1 },
  // Hostelería
  'tourism=hotel':         { type: 'hotel',          icon: '🏨', resources: { food: 10, water: 8, materials: 5 }, description: 'Hotel con restaurante y minibares.',       maxPerDay: 1 },
  'tourism=hostel':        { type: 'hotel',          icon: '🛏️', resources: { food: 6, water: 5, materials: 3 }, description: 'Hostal con cocina compartida.',             maxPerDay: 1 },
  // Bancos / servicios
  'amenity=bank':          { type: 'bank',           icon: '🏦', resources: { materials: 15 },                  description: 'Banco con cajas de seguridad.',              maxPerDay: 1 },
  'amenity=post_office':   { type: 'post_office',    icon: '📮', resources: { materials: 8 },                   description: 'Oficina de correos con paquetes.',           maxPerDay: 1 },
  'amenity=community_centre': { type: 'community_centre', icon: '🏘️', resources: { food: 6, water: 5, materials: 3 }, description: 'Centro comunitario.',               maxPerDay: 1 },
  'amenity=place_of_worship': { type: 'place_of_worship', icon: '⛪', resources: { food: 5, materials: 3 },     description: 'Iglesia con despensa parroquial.',           maxPerDay: 2 },
  // Deporte / ocio
  'leisure=sports_centre': { type: 'sports_centre',  icon: '🏋️', resources: { water: 8, materials: 5 },        description: 'Centro deportivo con vestuarios.',           maxPerDay: 1 },
  'leisure=stadium':       { type: 'sports_centre',  icon: '🏟️', resources: { materials: 10, water: 5 },       description: 'Estadio con almacenes.',                     maxPerDay: 1 },
  'leisure=swimming_pool': { type: 'sports_centre',  icon: '🏊', resources: { water: 10 },                      description: 'Piscina con agua.',                          maxPerDay: 1 },
  'amenity=cinema':        { type: 'entertainment',  icon: '🎬', resources: { food: 6, materials: 5 },          description: 'Cine con dulcería.',                         maxPerDay: 1 },
  'amenity=theatre':       { type: 'entertainment',  icon: '🎭', resources: { materials: 8 },                   description: 'Teatro con utilería.',                       maxPerDay: 1 },
  'tourism=attraction':    { type: 'landmark',       icon: '🗿', resources: { materials: 5 },                   description: 'Atracción turística.',                       maxPerDay: 1 },
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
// GitHub Pages es hosting estático — llamamos Overpass directamente.
// github.io no está bloqueado por CORS en los mirrors públicos de Overpass.
const OVERPASS_ENDPOINTS = [
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass-api.de/api/interpreter',
];
const SEARCH_RADIUS = 2000;
const MAX_LOCATIONS = 30;
const REQUEST_TIMEOUT = 20000; // 20s por endpoint
export const MIN_REAL_LOCATIONS = 3;

// ─── Cache ───
const locationCache = new Map<string, { locations: ResourceLocation[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

function getCacheKey(lat: number, lng: number): string {
  return `${Math.round(lat * 1000) / 1000},${Math.round(lng * 1000) / 1000}`;
}

// ─── Build Overpass query ───
// Query minimalista: solo los tags más comunes en OSM urbano
// Separada en dos llamadas paralelas para no exceder el timeout del servidor
function buildQuery(lat: number, lng: number, tagPairs: string[]): string {
  const byKey: Record<string, string[]> = {};
  for (const pair of tagPairs) {
    const eqIdx = pair.indexOf('=');
    const key = pair.substring(0, eqIdx);
    const value = pair.substring(eqIdx + 1);
    if (!byKey[key]) byKey[key] = [];
    byKey[key].push(value);
  }

  const lines: string[] = [];
  for (const [key, values] of Object.entries(byKey)) {
    const escaped = values.map(v => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const pattern = escaped.join('|');
    const filter = `["${key}"~"^(${pattern})$"]`;
    const around = `(around:${SEARCH_RADIUS},${lat},${lng})`;
    lines.push(`  node${filter}${around};`);
    lines.push(`  way${filter}${around};`);
    lines.push(`  relation${filter}${around};`);
  }

  return `[out:json][timeout:18];\n(\n${lines.join('\n')}\n);\nout center qt;`;
}

// Tags divididos en dos grupos para dos queries más ligeras en paralelo
const TAGS_A = [
  'amenity=restaurant', 'amenity=cafe', 'amenity=fast_food', 'amenity=bar',
  'amenity=pub', 'amenity=pharmacy', 'amenity=hospital', 'amenity=clinic',
  'amenity=fuel', 'amenity=school', 'amenity=library', 'amenity=bank',
  'amenity=post_office', 'amenity=place_of_worship', 'amenity=community_centre',
  'amenity=fountain', 'amenity=drinking_water', 'amenity=police',
];
const TAGS_B = [
  'shop=supermarket', 'shop=convenience', 'shop=bakery', 'shop=hardware',
  'shop=doityourself', 'shop=car_repair', 'shop=clothes', 'shop=greengrocer',
  'leisure=park', 'leisure=garden', 'leisure=sports_centre', 'leisure=swimming_pool',
  'tourism=hotel', 'tourism=museum', 'tourism=camp_site', 'tourism=attraction',
  'landuse=allotments', 'landuse=forest', 'man_made=water_tower',
];

// ─── Fetch una query contra endpoints con fallback ───
async function fetchQuery(query: string): Promise<OsmElement[]> {
  for (const endpoint of OVERPASS_ENDPOINTS) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`,
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!response.ok) {
        console.warn(`[OSM] ${endpoint} → HTTP ${response.status}`);
        continue;
      }
      const data: OverpassResponse = await response.json();
      return data.elements ?? [];
    } catch (err) {
      clearTimeout(timer);
      console.warn(`[OSM] ${endpoint} failed:`, err instanceof Error ? err.message : err);
    }
  }
  return [];
}

// ─── Main fetch ───
export async function fetchNearbyLocations(lat: number, lng: number): Promise<ResourceLocation[]> {
  const cacheKey = getCacheKey(lat, lng);
  const cached = locationCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[OSM] Cache hit: ${cached.locations.length} locs`);
    return cached.locations;
  }

  console.log(`[OSM] Querying (${lat.toFixed(4)}, ${lng.toFixed(4)}) r=${SEARCH_RADIUS}m`);

  // Dos queries paralelas más ligeras
  const queryA = buildQuery(lat, lng, TAGS_A);
  const queryB = buildQuery(lat, lng, TAGS_B);

  const [resA, resB] = await Promise.allSettled([
    fetchQuery(queryA),
    fetchQuery(queryB),
  ]);

  const allElements: OsmElement[] = [];
  if (resA.status === 'fulfilled') allElements.push(...resA.value);
  else console.warn('[OSM] Query A failed');
  if (resB.status === 'fulfilled') allElements.push(...resB.value);
  else console.warn('[OSM] Query B failed');

  console.log(`[OSM] Raw elements: ${allElements.length}`);
  if (allElements.length === 0) return [];

  const locations = mapOsmToLocations(allElements);
  console.log(`[OSM] Mapped: ${locations.length} game locations`);

  if (locations.length > 0) {
    locationCache.set(cacheKey, { locations, timestamp: Date.now() });
  }
  return locations;
}

// ─── Map OSM elements → game locations ───
function mapOsmToLocations(elements: OsmElement[]): ResourceLocation[] {
  const locations: ResourceLocation[] = [];
  const seen = new Set<string>();

  for (const el of elements) {
    if (locations.length >= MAX_LOCATIONS) break;

    // Coordenadas: nodes tienen lat/lon directos; ways/relations tienen .center
    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    if (!lat || !lon) continue;

    const tags = el.tags ?? {};
    const category = findCategory(tags);
    if (!category) continue;

    // Deduplicar por nombre+tipo para evitar el mismo lugar varias veces
    const nameKey = tags.name ?? `${el.type}_${el.id}`;
    const dedupKey = `${nameKey}__${category.type}`;
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
    const eqIdx = pair.indexOf('=');
    const key = pair.substring(0, eqIdx);
    const value = pair.substring(eqIdx + 1);
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
      place_of_worship: 'Lugar de Culto', electronics_store: 'Electrónica',
      water_facility: 'Depósito de Agua', landmark: 'Monumento',
    };
    return friendly[type] ?? 'Lugar';
  }
  return name.charAt(0).toUpperCase() + name.slice(1);
}
