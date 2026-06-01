import type { ResourceLocation, Resources } from '../types/game';

// ─── OSM Tag → Game Type Mapping ───
interface OsmCategory {
  type: string;
  icon: string;
  resources: Partial<Resources>;
  description: string;
  maxPerDay: number;
}

// Lookup: combine key=value as key → category
const TAG_CATEGORY_MAP: Record<string, OsmCategory> = {
  // ─── Supermercados y tiendas de comida ───
  'shop=supermarket': {
    type: 'supermarket',
    icon: '🏪',
    resources: { food: 12, water: 8 },
    description: 'Estanterías con comida enlatada y botellas de agua.',
    maxPerDay: 1,
  },
  'shop=department_store': {
    type: 'supermarket',
    icon: '🏬',
    resources: { food: 10, water: 6, materials: 5 },
    description: 'Grandes almacenes con comida, ropa y utensilios.',
    maxPerDay: 1,
  },
  'shop=wholesale': {
    type: 'supermarket',
    icon: '📦',
    resources: { food: 15, water: 10 },
    description: 'Almacén mayorista con palés de comida y bebida.',
    maxPerDay: 1,
  },
  'shop=frozen_food': {
    type: 'supermarket',
    icon: '❄️',
    resources: { food: 10 },
    description: 'Congelados y conservas en una cámara frigorífica.',
    maxPerDay: 1,
  },
  'shop=beverages': {
    type: 'supermarket',
    icon: '🧃',
    resources: { water: 12, food: 3 },
    description: 'Botellas de agua, refrescos y bebidas envasadas.',
    maxPerDay: 1,
  },
  'shop=alcohol': {
    type: 'supermarket',
    icon: '🍾',
    resources: { water: 8, medicine: 3 },
    description: 'Licores y alcohol que puede servir como antiséptico.',
    maxPerDay: 1,
  },

  // ─── Farmacias ───
  'amenity=pharmacy': {
    type: 'pharmacy',
    icon: '💊',
    resources: { medicine: 12 },
    description: 'Medicamentos, vendajes y antisépticos.',
    maxPerDay: 1,
  },

  // ─── Ferreterías y bricolaje ───
  'shop=hardware': {
    type: 'hardware',
    icon: '🔧',
    resources: { materials: 15, fuel: 5 },
    description: 'Herramientas, madera y suministros de construcción.',
    maxPerDay: 1,
  },
  'shop=doityourself': {
    type: 'hardware',
    icon: '🔧',
    resources: { materials: 20 },
    description: 'Materiales de bricolaje: madera, clavos, lonas.',
    maxPerDay: 1,
  },
  'shop=electronics': {
    type: 'hardware',
    icon: '🔌',
    resources: { materials: 12 },
    description: 'Componentes electrónicos, cables y baterías.',
    maxPerDay: 1,
  },
  'shop=furniture': {
    type: 'hardware',
    icon: '🪑',
    resources: { materials: 15 },
    description: 'Muebles y materiales de carpintería aprovechables.',
    maxPerDay: 1,
  },
  'shop=sports': {
    type: 'hardware',
    icon: '🏋️',
    resources: { materials: 8, fuel: 3 },
    description: 'Equipo deportivo, cuerdas y algo de combustible.',
    maxPerDay: 1,
  },
  'shop=toys': {
    type: 'hardware',
    icon: '🧸',
    resources: { materials: 8 },
    description: 'Juguetes y plásticos reciclables como materiales.',
    maxPerDay: 1,
  },

  // ─── Gasolineras ───
  'amenity=fuel': {
    type: 'gas_station',
    icon: '⛽',
    resources: { fuel: 15 },
    description: 'Combustible para generadores y vehículos.',
    maxPerDay: 2,
  },

  // ─── Parques ───
  'leisure=park': {
    type: 'park',
    icon: '🌳',
    resources: { water: 8, food: 5 },
    description: 'Fuente de agua y posible fuente de alimentos.',
    maxPerDay: 2,
  },

  // ─── Hospitales ───
  'amenity=hospital': {
    type: 'hospital',
    icon: '🏥',
    resources: { medicine: 15, food: 5, water: 5 },
    description: 'Suministros médicos y cafetería del hospital.',
    maxPerDay: 1,
  },

  // ─── Instalaciones militares y gubernamentales ───
  'military=bunker': {
    type: 'bunker',
    icon: '🛡️',
    resources: { food: 20, water: 20, medicine: 15, fuel: 10 },
    description: 'Un búnker militar con suministros de supervivencia. ¡Un gran hallazgo!',
    maxPerDay: 1,
  },
  'landuse=military': {
    type: 'military_base',
    icon: '🎖️',
    resources: { materials: 25, fuel: 20, medicine: 10, food: 10 },
    description: 'Una base militar evacuada con equipo táctico y suministros.',
    maxPerDay: 1,
  },
  'amenity=police': {
    type: 'military_base',
    icon: '🚔',
    resources: { materials: 15, food: 5, medicine: 5 },
    description: 'Comisaría abandonada con armas, radios y suministros.',
    maxPerDay: 1,
  },
  'amenity=fire_station': {
    type: 'military_base',
    icon: '🚒',
    resources: { materials: 12, water: 10, medicine: 5 },
    description: 'Parque de bomberos con mangueras, hachas y botiquín.',
    maxPerDay: 1,
  },

  // ─── Refugios ───
  'amenity=social_facility': {
    type: 'shelter',
    icon: '🏕️',
    resources: { food: 25, water: 15, materials: 10, medicine: 5 },
    description: 'Un refugio de emergencia completamente equipado.',
    maxPerDay: 1,
  },

  // ─── Talleres mecánicos ───
  'shop=car_repair': {
    type: 'mechanical_workshop',
    icon: '🔩',
    resources: { materials: 10, fuel: 5 },
    description: 'Herramientas, piezas de repuesto y algo de combustible.',
    maxPerDay: 1,
  },
  'shop=car_parts': {
    type: 'mechanical_workshop',
    icon: '⚙️',
    resources: { materials: 12, fuel: 3 },
    description: 'Piezas de automóvil, baterías y aceite.',
    maxPerDay: 1,
  },

  // ─── Obras ───
  'landuse=construction': {
    type: 'construction_site',
    icon: '🏗️',
    resources: { materials: 12 },
    description: 'Un edificio en construcción abandonado. Madera, ladrillos y tuberías.',
    maxPerDay: 1,
  },

  // ─── Alimentación ───
  'shop=greengrocer': {
    type: 'urban_garden',
    icon: '🥬',
    resources: { food: 8, water: 3 },
    description: 'Un huerto comunitario o frutería con verduras frescas.',
    maxPerDay: 1,
  },
  'shop=bakery': {
    type: 'bakery',
    icon: '🥖',
    resources: { food: 10 },
    description: 'Una panadería con harina, pan envasado y conservas.',
    maxPerDay: 1,
  },
  'shop=butcher': {
    type: 'bakery',
    icon: '🥩',
    resources: { food: 12 },
    description: 'Carnicería con carne envasada al vacío y conservas.',
    maxPerDay: 1,
  },
  'shop=seafood': {
    type: 'bakery',
    icon: '🐟',
    resources: { food: 10 },
    description: 'Pescadería con producto en conserva y salazón.',
    maxPerDay: 1,
  },

  // ─── NUEVOS TIPOS ───

  // Restaurantes (nuevo tipo)
  'amenity=restaurant': {
    type: 'restaurant',
    icon: '🍽️',
    resources: { food: 10, water: 5 },
    description: 'Restaurante abandonado con despensa y cocina industrial.',
    maxPerDay: 1,
  },
  'amenity=cafe': {
    type: 'restaurant',
    icon: '☕',
    resources: { food: 6, water: 6 },
    description: 'Cafetería con café envasado, agua y algo de comida.',
    maxPerDay: 1,
  },
  'amenity=fast_food': {
    type: 'restaurant',
    icon: '🍔',
    resources: { food: 8, water: 4 },
    description: 'Local de comida rápida con conservas y bebidas.',
    maxPerDay: 1,
  },

  // Tiendas de conveniencia (nuevo tipo)
  'shop=convenience': {
    type: 'convenience_store',
    icon: '🏪',
    resources: { food: 6, water: 4, medicine: 2 },
    description: 'Tienda 24h con comida, bebida y botiquín básico.',
    maxPerDay: 1,
  },
  'shop=variety_store': {
    type: 'convenience_store',
    icon: '🎯',
    resources: { food: 5, water: 3, materials: 3 },
    description: 'Bazar con artículos variados, comida y herramientas.',
    maxPerDay: 1,
  },

  // Tiendas de ropa (nuevo tipo)
  'shop=clothes': {
    type: 'clothing_store',
    icon: '👕',
    resources: { materials: 10 },
    description: 'Tienda de ropa con telas, cuerdas y materiales textiles.',
    maxPerDay: 1,
  },
  'shop=fabric': {
    type: 'clothing_store',
    icon: '🧵',
    resources: { materials: 12 },
    description: 'Tienda de telas con rollos de tela, hilo y botones.',
    maxPerDay: 1,
  },
  'shop=shoes': {
    type: 'clothing_store',
    icon: '👟',
    resources: { materials: 8 },
    description: 'Zapatería con cuero, suelas y materiales aprovechables.',
    maxPerDay: 1,
  },

  // ─── Centros educativos ───
  'amenity=school': {
    type: 'educational',
    icon: '🏫',
    resources: { food: 8, materials: 5 },
    description: 'Colegio abandonado con comedor escolar y material didáctico.',
    maxPerDay: 1,
  },
  'amenity=university': {
    type: 'educational',
    icon: '🎓',
    resources: { food: 10, materials: 8, water: 5 },
    description: 'Universidad con cafetería, laboratorios y biblioteca.',
    maxPerDay: 1,
  },
  'amenity=college': {
    type: 'educational',
    icon: '📘',
    resources: { food: 6, materials: 5 },
    description: 'Centro de formación con aulas y pequeña cafetería.',
    maxPerDay: 1,
  },

  // ─── Clínicas y consultorios ───
  'amenity=clinic': {
    type: 'clinic',
    icon: '🩺',
    resources: { medicine: 10 },
    description: 'Clínica con suministros médicos básicos y material de cura.',
    maxPerDay: 1,
  },
  'amenity=doctors': {
    type: 'clinic',
    icon: '🩻',
    resources: { medicine: 8 },
    description: 'Consultorio médico con botiquín y material sanitario.',
    maxPerDay: 1,
  },
  'amenity=dentist': {
    type: 'clinic',
    icon: '🦷',
    resources: { medicine: 6, materials: 3 },
    description: 'Clínica dental con anestésicos y material metálico aprovechable.',
    maxPerDay: 1,
  },
  'amenity=veterinary': {
    type: 'clinic',
    icon: '🐾',
    resources: { medicine: 7, food: 3 },
    description: 'Clínica veterinaria con medicamentos y algo de comida para animales.',
    maxPerDay: 1,
  },

  // ─── Hoteles y alojamientos ───
  'tourism=hotel': {
    type: 'hotel',
    icon: '🏨',
    resources: { food: 10, water: 8, materials: 5 },
    description: 'Hotel con restaurante, minibares y ropa de cama aprovechable.',
    maxPerDay: 1,
  },
  'tourism=hostel': {
    type: 'hotel',
    icon: '🛏️',
    resources: { food: 6, water: 5, materials: 3 },
    description: 'Hostal con cocina compartida y algunas provisiones.',
    maxPerDay: 1,
  },
  'tourism=motel': {
    type: 'hotel',
    icon: '🚗',
    resources: { water: 6, materials: 4 },
    description: 'Motel de carretera con máquinas expendedoras y sábanas.',
    maxPerDay: 1,
  },

  // ─── Bancos ───
  'amenity=bank': {
    type: 'bank',
    icon: '🏦',
    resources: { materials: 15 },
    description: 'Banco abandonado con cajas de seguridad y material de oficina.',
    maxPerDay: 1,
  },

  // ─── Museos y galerías ───
  'tourism=museum': {
    type: 'museum',
    icon: '🏛️',
    resources: { materials: 12 },
    description: 'Museo con objetos valiosos, vitrinas y material expositivo.',
    maxPerDay: 1,
  },
  'tourism=gallery': {
    type: 'museum',
    icon: '🖼️',
    resources: { materials: 10 },
    description: 'Galería de arte con marcos, lienzos y materiales aprovechables.',
    maxPerDay: 1,
  },
  'tourism=attraction': {
    type: 'landmark',
    icon: '🗿',
    resources: { materials: 5 },
    description: 'Atracción turística con tienda de recuerdos y pequeña cafetería.',
    maxPerDay: 1,
  },
  'tourism=viewpoint': {
    type: 'landmark',
    icon: '🔭',
    resources: { water: 3 },
    description: 'Mirador con fuente y pequeña área de descanso.',
    maxPerDay: 1,
  },
  'tourism=artwork': {
    type: 'landmark',
    icon: '🎨',
    resources: { materials: 4 },
    description: 'Obra de arte urbano con materiales reciclables alrededor.',
    maxPerDay: 1,
  },

  // ─── Ocio y entretenimiento ───
  'amenity=cinema': {
    type: 'entertainment',
    icon: '🎬',
    resources: { food: 6, materials: 5 },
    description: 'Cine con dulcería, butacas y material de proyección.',
    maxPerDay: 1,
  },
  'amenity=theatre': {
    type: 'entertainment',
    icon: '🎭',
    resources: { materials: 8 },
    description: 'Teatro con telones, utilería y material escénico aprovechable.',
    maxPerDay: 1,
  },
  'amenity=nightclub': {
    type: 'entertainment',
    icon: '🪩',
    resources: { water: 6, food: 3 },
    description: 'Discoteca con barra de bebidas y algo de comida congelada.',
    maxPerDay: 1,
  },
  'shop=music': {
    type: 'entertainment',
    icon: '🎵',
    resources: { materials: 6 },
    description: 'Tienda de música con CDs, vinilos y equipo de sonido.',
    maxPerDay: 1,
  },

  // ─── Instalaciones deportivas ───
  'leisure=sports_centre': {
    type: 'sports_centre',
    icon: '🏋️',
    resources: { water: 8, materials: 5 },
    description: 'Centro deportivo con vestuarios, fuentes y material deportivo.',
    maxPerDay: 1,
  },
  'leisure=stadium': {
    type: 'sports_centre',
    icon: '🏟️',
    resources: { materials: 10, water: 5 },
    description: 'Estadio con almacenes, vestuarios y puestos de comida.',
    maxPerDay: 1,
  },
  'leisure=pitch': {
    type: 'sports_centre',
    icon: '⚽',
    resources: { water: 3 },
    description: 'Campo deportivo al aire libre con fuente de agua.',
    maxPerDay: 1,
  },
  'leisure=swimming_pool': {
    type: 'sports_centre',
    icon: '🏊',
    resources: { water: 10 },
    description: 'Piscina municipal con agua almacenada y productos de limpieza.',
    maxPerDay: 1,
  },

  // ─── Bibliotecas ───
  'amenity=library': {
    type: 'library',
    icon: '📚',
    resources: { materials: 10 },
    description: 'Biblioteca con libros, muebles y material de papelería.',
    maxPerDay: 1,
  },

  // ─── Bares y pubs ───
  'amenity=bar': {
    type: 'bar',
    icon: '🍺',
    resources: { water: 8, food: 3 },
    description: 'Bar con bebidas, algo de comida y neveras con provisiones.',
    maxPerDay: 1,
  },
  'amenity=pub': {
    type: 'bar',
    icon: '🍻',
    resources: { water: 10, food: 5 },
    description: 'Pub con barra completa y cocina con alimentos en conserva.',
    maxPerDay: 1,
  },

  // ─── Correos ───
  'amenity=post_office': {
    type: 'post_office',
    icon: '📮',
    resources: { materials: 8 },
    description: 'Oficina de correos con paquetes, sellos y material de oficina.',
    maxPerDay: 1,
  },

  // ─── Centros comunitarios ───
  'amenity=community_centre': {
    type: 'community_centre',
    icon: '🏘️',
    resources: { food: 6, water: 5, materials: 3 },
    description: 'Centro comunitario con cocina, suministros y mobiliario.',
    maxPerDay: 1,
  },
  'amenity=social_centre': {
    type: 'community_centre',
    icon: '🤝',
    resources: { food: 8, water: 5 },
    description: 'Centro social con despensa y suministros básicos.',
    maxPerDay: 1,
  },

  // ─── Lugares de culto ───
  'amenity=place_of_worship': {
    type: 'place_of_worship',
    icon: '⛪',
    resources: { food: 5, materials: 3 },
    description: 'Iglesia con despensa parroquial y material de construcción.',
    maxPerDay: 2,
  },

  // ─── Tiendas de electrónica ───
  'shop=computer': {
    type: 'electronics_store',
    icon: '💻',
    resources: { materials: 12 },
    description: 'Tienda de informática con cables, componentes y baterías.',
    maxPerDay: 1,
  },
  'shop=mobile_phone': {
    type: 'electronics_store',
    icon: '📱',
    resources: { materials: 8 },
    description: 'Tienda de móviles con accesorios, cargadores y baterías.',
    maxPerDay: 1,
  },

  // ─── Instalaciones de agua ───
  'man_made=water_tower': {
    type: 'water_facility',
    icon: '🚰',
    resources: { water: 20 },
    description: 'Depósito de agua potable. ¡Una fuente limpia y abundante!',
    maxPerDay: 2,
  },
  'man_made=water_well': {
    type: 'water_facility',
    icon: '🪣',
    resources: { water: 15 },
    description: 'Pozo de agua con bomba manual. Agua fresca y potable.',
    maxPerDay: 2,
  },
  'man_made=water_works': {
    type: 'water_facility',
    icon: '⚙️',
    resources: { water: 25, materials: 5 },
    description: 'Planta de tratamiento de agua con grandes depósitos.',
    maxPerDay: 2,
  },

  // ─── Tiendas adicionales ───
  'shop=bookstore': {
    type: 'library',
    icon: '📖',
    resources: { materials: 8 },
    description: 'Librería con libros, papelería y material de escritura.',
    maxPerDay: 1,
  },
  'shop=jewelry': {
    type: 'bank',
    icon: '💎',
    resources: { materials: 10 },
    description: 'Joyería con objetos de valor y materiales reciclables.',
    maxPerDay: 1,
  },
  'shop=pawnbroker': {
    type: 'bank',
    icon: '🔑',
    resources: { materials: 8, food: 3 },
    description: 'Casa de empeños con objetos variados y algo de comida.',
    maxPerDay: 1,
  },
  'shop=second_hand': {
    type: 'bank',
    icon: '♻️',
    resources: { materials: 8 },
    description: 'Tienda de segunda mano con todo tipo de objetos aprovechables.',
    maxPerDay: 1,
  },
  'shop=florist': {
    type: 'urban_garden',
    icon: '💐',
    resources: { food: 4, water: 3 },
    description: 'Floristería con plantas, tierra y sistema de riego.',
    maxPerDay: 1,
  },
  'shop=garden_centre': {
    type: 'urban_garden',
    icon: '🌱',
    resources: { food: 6, water: 5, materials: 3 },
    description: 'Centro de jardinería con plantas, herramientas y tierra.',
    maxPerDay: 1,
  },
};

// ─── Overpass API Types ───
interface OsmElement {
  type: 'node';
  id: number;
  lat: number;
  lon: number;
  tags?: Record<string, string>;
}

interface OverpassResponse {
  elements: OsmElement[];
}

// ─── API Configuration ───
const OVERPASS_ENDPOINT = 'https://overpass-api.de/api/interpreter';
const SEARCH_RADIUS = 1000; // meters
const REQUEST_TIMEOUT = 8000; // ms
const MIN_REAL_LOCATIONS = 5; // augment with simulated if fewer

function buildQuery(lat: number, lng: number, radius: number): string {
  const tagPairs = Object.keys(TAG_CATEGORY_MAP);
  const queries = tagPairs.map((pair) => {
    const [key, value] = pair.split('=');
    return `  node["${key}"="${value}"](around:${radius},${lat},${lng});`;
  }).join('\n');

  return `[out:json];\n(\n${queries}\n);\nout body;`;
}

// ─── Cache to avoid repeated API calls ───
const locationCache = new Map<string, { locations: ResourceLocation[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(lat: number, lng: number): string {
  // Round to ~100m for cache key
  const rLat = Math.round(lat * 1000) / 1000;
  const rLng = Math.round(lng * 1000) / 1000;
  return `${rLat},${rLng}`;
}

// ─── Main fetch function ───
export async function fetchNearbyLocations(
  lat: number,
  lng: number
): Promise<ResourceLocation[]> {
  // Check cache
  const cacheKey = getCacheKey(lat, lng);
  const cached = locationCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.locations;
  }

  const query = buildQuery(lat, lng, SEARCH_RADIUS);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(OVERPASS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `data=${encodeURIComponent(query)}`,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`);
    }

    const data: OverpassResponse = await response.json();
    const locations = mapOsmToLocations(data.elements);

    // Cache results
    locationCache.set(cacheKey, { locations, timestamp: Date.now() });

    return locations;
  } finally {
    clearTimeout(timeoutId);
  }
}

// ─── Map OSM elements to game locations ───
function mapOsmToLocations(elements: OsmElement[]): ResourceLocation[] {
  const locations: ResourceLocation[] = [];
  const seen = new Set<string>();

  for (const el of elements) {
    if (!el.lat || !el.lon) continue;

    // Find matching category by tags
    const category = findCategory(el.tags ?? {});
    if (!category) continue;

    // Deduplicate by name + type
    const name =
      el.tags?.name ??
      category.type;
    const dedupKey = `${name}-${category.type}`;
    if (seen.has(dedupKey)) continue;
    seen.add(dedupKey);

    // Limit to ~15 locations total
    if (locations.length >= 15) break;

    locations.push({
      id: `osm_${el.id}`,
      name: formatName(name, category.type),
      type: category.type,
      lat: el.lat,
      lng: el.lon,
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

// ─── Format display name ───
function formatName(name: string, type: string): string {
  // If name is just the type, make it friendlier
  if (name === type || name.length < 2) {
    const friendlyNames: Record<string, string> = {
      supermarket: 'Supermercado',
      pharmacy: 'Farmacia',
      hardware: 'Ferretería',
      gas_station: 'Gasolinera',
      park: 'Parque',
      hospital: 'Hospital',
      bunker: 'Búnker',
      military_base: 'Base Militar',
      shelter: 'Refugio',
      mechanical_workshop: 'Taller Mecánico',
      construction_site: 'Obra',
      urban_garden: 'Huerta',
      bakery: 'Panadería',
      restaurant: 'Restaurante',
      convenience_store: 'Tienda 24h',
      clothing_store: 'Tienda de Ropa',
      educational: 'Centro Educativo',
      clinic: 'Clínica',
      hotel: 'Hotel',
      bank: 'Banco',
      museum: 'Museo',
      entertainment: 'Local de Ocio',
      sports_centre: 'Centro Deportivo',
      library: 'Biblioteca',
      bar: 'Bar',
      post_office: 'Oficina de Correos',
      community_centre: 'Centro Comunitario',
      place_of_worship: 'Lugar de Culto',
      electronics_store: 'Tienda de Electrónica',
      water_facility: 'Depósito de Agua',
      landmark: 'Monumento',
    };
    return friendlyNames[type] ?? name;
  }
  // Capitalize first letter
  return name.charAt(0).toUpperCase() + name.slice(1);
}

// ─── Augment real locations with simulated if too few ───
export { MIN_REAL_LOCATIONS };
