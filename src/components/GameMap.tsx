import { useEffect, useRef, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useGame } from '../context/GameContext';
import { generateNearbyLocations, LOCATION_COLORS, scaleResourcesByWeek } from '../data/resources';
import { generateExplorationEventWithBonus } from '../data/explorationEvents';
import type { ExplorationEvent } from '../data/explorationEvents';
import { generateRoamingEvent } from '../data/roamingEvents';
import type { RoamingEvent } from '../data/roamingEvents';
import { getRumorById } from '../data/rumors';
import { getCompanion } from '../data/companions';
import { getRandomNPCEncounter } from '../data/npcEncounters';
import type { NPCEncounter } from '../types/game';
import { getWeather } from '../data/weather';
import { fetchNearbyLocations, MIN_REAL_LOCATIONS } from '../data/overpassApi';
import RadarMinimap from './RadarMinimap';
import ExplorationEventModal from './ExplorationEventModal';
import EncounterModal from './EncounterModal';
import FactionTerritoryZones from './FactionTerritoryZones';
import { haversineDistance, formatDistance, COLLECTION_RADIUS_METERS } from '../utils/geo';
import type { ResourceLocation, ResourceType, Resources } from '../types/game';
import { RESOURCE_ICONS } from '../types/game';

// Fix default marker icon issue with bundlers
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

// ─── Player marker icon ───
const playerIcon = L.divIcon({
  html: `<div style="
    width:24px;height:24px;
    background:#3b82f6;
    border:3px solid white;
    border-radius:50%;
    box-shadow:0 0 10px rgba(59,130,246,0.8);
    animation:pulse-glow 2s infinite;
  "></div>`,
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// ─── Resource marker icons ───

// --- Location type display icons ---
const TYPE_ICONS: Record<string, string> = {
  supermarket: '🏪',
  pharmacy: '💊',
  hardware: '🔧',
  gas_station: '⛽',
  park: '🌳',
  hospital: '🏥',
  bunker: '🛡️',
  military_base: '🎖️',
  shelter: '🏕️',
  mechanical_workshop: '🔩',
  construction_site: '🏗️',
  urban_garden: '🥬',
  bakery: '🥖',
  restaurant: '🍽️',
  convenience_store: '🛒',
  clothing_store: '👕',
  educational: '🏫',
  clinic: '🩺',
  hotel: '🏨',
  bank: '🏦',
  museum: '🏛️',
  entertainment: '🎭',
  sports_centre: '🏋️',
  library: '📚',
  bar: '🍺',
  post_office: '📮',
  community_centre: '🏘️',
  place_of_worship: '⛪',
  electronics_store: '💻',
  water_facility: '🚰',
  landmark: '🗿',
};

function createLocationIcon(type: string, visited: boolean = false, depleted: boolean = false): L.DivIcon {
  const color = depleted ? '#374151' : visited ? '#4b5563' : (LOCATION_COLORS[type] || '#888');
  const iconChar = depleted ? '🚫' : (TYPE_ICONS[type] || '📍');
  const opacity = depleted ? '0.4' : visited ? '0.6' : '1';
  return L.divIcon({
    html: '<div style="' +
      'width:28px;height:28px;' +
      'background:' + color + ';' +
      'border:2px solid ' + (depleted ? '#4b5563' : visited ? '#6b7280' : 'white') + ';' +
      'border-radius:8px;display:flex;' +
      'align-items:center;justify-content:center;' +
      'font-size:14px;' +
      'box-shadow:0 2px 8px rgba(0,0,0,0.4);' +
      'transform:rotate(45deg);' +
      'opacity:' + opacity + ';' +
      'transition:all 0.3s ease;' +
    '><span style="transform:rotate(-45deg)">' + iconChar + '</span></div>',
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function MapController({
  playerLat,
  playerLng,
  recenterKey,
}: {
  playerLat: number | null;
  playerLng: number | null;
  recenterKey: number;
}) {
  const map = useMap();
  useEffect(() => {
    if (playerLat !== null && playerLng !== null) {
      map.setView([playerLat, playerLng], map.getZoom(), {
        animate: true,
      });
    }
  }, [playerLat, playerLng, recenterKey, map]);
  return null;
}

// ─── Location Info Panel ───
function LocationInfo({
  location,
  onCollect,
  visitedToday,
  playerLat,
  playerLng,
}: {
  location: ResourceLocation;
  onCollect: () => void;
  visitedToday: boolean;
  playerLat: number | null;
  playerLng: number | null;
}) {
  const rarityBadge =
    location.rarity === 'rare'
      ? { text: 'Raro', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' }
      : location.rarity === 'legendary'
        ? { text: 'Legendario', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' }
        : null;

  // Calcular distancia del jugador a la ubicación
  const distance =
    playerLat !== null && playerLng !== null
      ? haversineDistance(playerLat, playerLng, location.lat, location.lng)
      : null;
  const inRange = distance !== null && distance <= COLLECTION_RADIUS_METERS;

  return (
    <div className="glass-card rounded-2xl p-5 w-72 shadow-2xl border border-white/10" style={{maxWidth: '280px'}}>
      {/* Header with type icon */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg border border-white/10">
          {TYPE_ICONS[location.type] || '📍'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-white font-bold text-sm truncate">{location.name}</h3>
            {rarityBadge && (
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold border whitespace-nowrap ${rarityBadge.color}`}>
                {rarityBadge.text}
              </span>
            )}
          </div>
          <p className="text-white/40 text-[10px] leading-relaxed truncate">{location.description}</p>
        </div>
      </div>

      {/* Distance indicator */}
      {distance !== null && (
        <div className={`flex items-center gap-1.5 mb-3 text-xs font-mono px-3 py-1.5 rounded-xl ${
          inRange
            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
            : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
        }`}>
          <span>{inRange ? '📍' : '📌'}</span>
          <span>
            {inRange
              ? `A ${formatDistance(distance)} — ¡Al alcance!`
              : `A ${formatDistance(distance)} — demasiado lejos`}
          </span>
        </div>
      )}

      {/* Available resources */}
      {Object.keys(location.resources).length > 0 && (
        <div className="mb-3">
          <div className="text-[10px] text-white/30 uppercase tracking-wider font-bold mb-1.5 px-0.5">
            Recursos disponibles
          </div>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(location.resources).map(([key, val]) => (
              <span
                key={key}
                className="inline-flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg text-[11px] text-white border border-white/5"
              >
                <span>{RESOURCE_ICONS[key as keyof typeof RESOURCE_ICONS] || '📦'}</span>
                <span className="font-bold font-mono text-emerald-300">+{val}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Collect button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onCollect();
        }}
        disabled={visitedToday || !inRange}
        className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${
          visitedToday
            ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5'
            : !inRange
              ? 'bg-white/5 text-white/40 cursor-not-allowed border border-white/5'
              : 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-500 hover:to-emerald-400 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] border border-emerald-400/20'
        }`}
      >
        {visitedToday
          ? '✅ Ya recolectado hoy'
          : !inRange
            ? `📍 Acércate (${distance !== null ? formatDistance(distance) : '?'})`
            : '🎒 Recolectar recursos'}
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════
// MAP COMPONENT
// ══════════════════════════════════════════════════
export default function GameMap() {
  const { state, dispatch, collectResources } = useGame();
  const [locations, setLocations] = useState<ResourceLocation[]>([]);
  const [selectedLocation, setSelectedLocation] =
    useState<ResourceLocation | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [simulationMode, setSimulationMode] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [toasts, setToasts] = useState<Array<{id: number; icon: string; message: string; particles?: boolean}>>([]);
  const [particles, setParticles] = useState<Array<{id: number; x: number; y: number; icon: string}>>([]);
  const [recenterKey, setRecenterKey] = useState(0);
  const toastIdRef = useRef(0);
  const [dataSource, setDataSource] = useState<'osm' | 'simulated' | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const fetchingRef = useRef(false);
  const [explorationEvent, setExplorationEvent] = useState<ExplorationEvent | null>(null);
  const [roamingEvent, setRoamingEvent] = useState<RoamingEvent | null>(null);
  const [encounter, setEncounter] = useState<NPCEncounter | null>(null);
  const [showFactionZones, setShowFactionZones] = useState(true);
  const watchIdRef = useRef<number | null>(null);
  const prevLatRef = useRef<number | null>(null);
  const prevLngRef = useRef<number | null>(null);

  const showToast = useCallback((icon: string, message: string) => {
    const id = ++toastIdRef.current;
    setToasts(prev => [...prev, { id, icon, message, particles: true }]);
    // Spawn particles
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        setParticles(prev => [...prev, {
          id: ++toastIdRef.current,
          x: 20 + Math.random() * 60,
          y: 30 + Math.random() * 30,
          icon,
        }]);
        setTimeout(() => {
          setParticles(prev => prev.filter(p => p.id !== toastIdRef.current));
        }, 1200);
      }, i * 80);
    }
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  // ─── GPS tracking ───
  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsError('Tu navegador no soporta geolocalización.');
      // Default to a central location for demo
      dispatch({
        type: 'SET_PLAYER_POSITION',
        lat: 40.4168,
        lng: -3.7038,
      });
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        // Only update if moved significantly
        if (
          prevLatRef.current === null ||
          Math.abs(prevLatRef.current - latitude) > 0.0001 ||
          Math.abs(prevLngRef.current! - longitude) > 0.0001
        ) {
          prevLatRef.current = latitude;
          prevLngRef.current = longitude;
          dispatch({
            type: 'SET_PLAYER_POSITION',
            lat: latitude,
            lng: longitude,
          });
        }
        setGpsError(null);
      },
      (err) => {
        setGpsError(
          `Error de GPS: ${err.message}. Activa el modo simulación.`
        );
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 30000, // 30s — mobile GPS puede tardar más en obtener precisión alta
      }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // ─── Generate locations when player position changes (debounced) ───
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (state.playerLat === null || state.playerLng === null) return;

    // Debounce: esperar 1.5s después del último cambio de posición GPS
    // Evita hacer fetches en cada update rápido del GPS al arrancar
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {      debounceRef.current = null;

      // Si ya hay un fetch en curso, no lanzar otro
      if (fetchingRef.current) return;
      fetchingRef.current = true;

      const lat = state.playerLat!;
      const lng = state.playerLng!;

      setLoadingLocations(true);
      let active = true;

      fetchNearbyLocations(lat, lng)
        .then((osmLocations) => {
          if (!active) return;
          fetchingRef.current = false;
          setApiError(null);

          if (osmLocations.length >= MIN_REAL_LOCATIONS) {
            setLocations(osmLocations);
            setDataSource('osm');
          } else if (osmLocations.length > 0) {
            // Pocos resultados OSM — completar con simulados
            const simulated = generateNearbyLocations(lat, lng);
            const augmented = [...osmLocations, ...simulated.slice(0, 15 - osmLocations.length)];
            setLocations(augmented);
            setDataSource('osm');
          } else {
            // Sin resultados OSM — usar simulados
            setApiError('Sin datos OSM para esta zona');
            setLocations(generateNearbyLocations(lat, lng));
            setDataSource('simulated');
          }
          setLoadingLocations(false);
        })
        .catch((err: unknown) => {
          if (!active) return;
          fetchingRef.current = false;
          const msg = err instanceof Error ? err.message : String(err);
          console.error('[GameMap] OSM fetch error:', msg);
          setApiError(msg);
          setLocations(generateNearbyLocations(lat, lng));
          setDataSource('simulated');
          setLoadingLocations(false);
        });

      return () => {
        active = false;
        fetchingRef.current = false;
      };
    }, 2000); // 2s debounce — esperar a que el GPS se estabilice

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [state.playerLat, state.playerLng, state.week]);

  // ─── Default center ───
  const center: [number, number] =
    state.playerLat !== null && state.playerLng !== null
      ? [state.playerLat, state.playerLng]
      : [40.4168, -3.7038]; // Madrid por defecto

  const handleCollect = useCallback(
    (location: ResourceLocation) => {
      // Apply weather multiplier
      const weatherMultiplier = state.currentWeather
        ? getWeather(state.currentWeather).resourceMultiplier
        : 1.0;

      // Apply week scaling
      let scaledResources = scaleResourcesByWeek(location.resources, state.week, location.rarity);

      // Apply weakened type penalty (50% if type was affected by last disaster)
      const isWeakened = state.weakenedLocationTypes.includes(location.type);
      if (isWeakened) {
        const weakened: Partial<Resources> = {};
        for (const [key, value] of Object.entries(scaledResources)) {
          weakened[key as ResourceType] = Math.max(1, Math.round((value as number) * 0.5));
        }
        scaledResources = weakened;
      }

      const modifiedResources: Partial<Resources> = {};
      for (const [key, value] of Object.entries(scaledResources)) {
        modifiedResources[key as ResourceType] = Math.round((value as number) * weatherMultiplier);
      }

      collectResources(location.id, modifiedResources);
      setSelectedLocation(null);

      const entries = Object.entries(modifiedResources);
      if (entries.length > 0) {
        const [resType, resVal] = entries[0];
        showToast(RESOURCE_ICONS[resType as ResourceType] || '📦', (resVal as number) + ' ' + resType + (isWeakened ? ' ⚠️' : ''));
      }

      // Auto-claim matching rumors
      const matchingRumor = state.activeRumors.find(
        r => (r.type === 'hidden_supply' || r.type === 'location_bonus') && r.locationType === location.type && !r.claimed
      );
      if (matchingRumor) {
        dispatch({ type: 'CLAIM_RUMOR', rumorId: matchingRumor.id });
        showToast('🔍', 'Rumor confirmado');
      }

      // Posible evento de exploración
      const ev = generateExplorationEventWithBonus(location.type, location.rarity, state.karma);
      if (ev) {
        if (ev.effect) {
          collectResources('event_' + ev.id, ev.effect);
        }
        setExplorationEvent(ev);
      }
      // Posible encuentro NPC
      const npcEncounter = getRandomNPCEncounter(location.type, state.karma, state.factionReputation, state.npcRelationships, state.metNPCs);
      if (npcEncounter) {
        setEncounter(npcEncounter);
      }
    },
    [collectResources, showToast, dispatch, state.currentWeather, state.karma, state.week, state.weakenedLocationTypes, state.activeRumors, state.factionReputation, state.npcRelationships, state.metNPCs]
  );

  // Usar sistema de energía en lugar del límite fijo de 5 visitas
  const canVisit = state.energyCurrent > 0;

  // ─── Roaming events timer ───
  // Cada ~2 minutos, posibilidad de evento deambulante.
  // Zonas con pocas ubicaciones tienen más probabilidad.
  // Usamos refs para valores dinámicos y así evitar reiniciar el intervalo constantemente.
  const ROAMING_CHECK_MS = 120_000; // 2 min
  const DENSITY_RADIUS_M = 500; // radio para contar ubicaciones "cercanas"
  const roamingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const locationsRef = useRef(locations);
  const karmaRef = useRef(state.karma);
  const weekRef = useRef(state.week);
  const playerLatRef = useRef(state.playerLat);
  const playerLngRef = useRef(state.playerLng);
  const factionRepRef = useRef(state.factionReputation);
  const dayRef = useRef(state.day);
  const modalsOpenRef = useRef(false); // evita stacking de modales

  // Mantener refs actualizados en cada render
  locationsRef.current = locations;
  karmaRef.current = state.karma;
  weekRef.current = state.week;
  playerLatRef.current = state.playerLat;
  playerLngRef.current = state.playerLng;
  factionRepRef.current = state.factionReputation;
  dayRef.current = state.day;
  modalsOpenRef.current = !!(roamingEvent || explorationEvent || encounter);

  useEffect(() => {
    if (state.phase !== 'playing') {
      if (roamingIntervalRef.current) {
        clearInterval(roamingIntervalRef.current);
        roamingIntervalRef.current = null;
      }
      return;
    }

    // Solo iniciar si no hay ya un intervalo corriendo
    if (roamingIntervalRef.current) return;

    roamingIntervalRef.current = setInterval(() => {
      const lat = playerLatRef.current;
      const lng = playerLngRef.current;
      if (lat === null || lng === null) return;

      // No generar evento si ya hay un modal abierto
      if (modalsOpenRef.current) return;

      // Contar ubicaciones cercanas (dentro del radio de densidad)
      const locs = locationsRef.current;
      const nearbyCount = locs.filter((loc) => {
        const dist = haversineDistance(lat, lng, loc.lat, loc.lng);
        return dist <= DENSITY_RADIUS_M;
      }).length;

      const ev = generateRoamingEvent({
        karma: karmaRef.current,
        week: weekRef.current,
        nearbyLocationCount: nearbyCount,
        factionReputation: factionRepRef.current,
      });

      if (ev) {
        // Aplicar efecto de recursos si tiene
        if (ev.effect && Object.keys(ev.effect).length > 0) {
          collectResources('roaming_' + ev.id, ev.effect);
        }
        // Aplicar efectos sociales
        if (ev.factionChanges) {
          for (const [factionId, amount] of Object.entries(ev.factionChanges)) {
            if (amount) dispatch({ type: 'CHANGE_FACTION_REPUTATION', factionId: factionId as 'survivors' | 'merchants' | 'military' | 'outlaws', amount: amount as number });
          }
        }
        if (ev.karmaChange) {
          dispatch({ type: 'SET_KARMA', karma: karmaRef.current + ev.karmaChange });
        }
        if (ev.unlockRumorId) {
          const rumor = getRumorById(ev.unlockRumorId);
          if (rumor) {
            dispatch({ type: 'ADD_RUMOR', rumor: { ...rumor, claimed: false } });
          }
        }
        if (ev.companionJoinId) {
          const companion = getCompanion(ev.companionJoinId);
          if (companion) {
            dispatch({ type: 'RECRUIT_COMPANION', companionId: ev.companionJoinId });
          }
        }
        if (ev.journalEntry) {
          dispatch({
            type: 'ADD_JOURNAL_ENTRY',
            entry: {
              id: 'journal_roam_' + ev.id + '_' + Date.now(),
              week: weekRef.current,
              day: dayRef.current,
              text: ev.journalEntry,
              icon: ev.icon,
              type: 'encounter',
            },
          });
        }
        setRoamingEvent(ev);
      }
    }, ROAMING_CHECK_MS);

    return () => {
      if (roamingIntervalRef.current) {
        clearInterval(roamingIntervalRef.current);
        roamingIntervalRef.current = null;
      }
    };
  }, [state.phase, collectResources]);

  return (
    <div className="relative w-full h-full">
      {/* Simulation toggle button — always visible */}
      <button
        onClick={() => setSimulationMode(v => !v)}
        className={`absolute bottom-36 left-3 z-[1000] glass-card rounded-full w-11 h-11 flex items-center justify-center border transition-all duration-200 hover:scale-110 active:scale-90 ${
          simulationMode
            ? 'border-amber-500/50 bg-amber-500/20 text-amber-300'
            : 'border-white/10 hover:border-amber-500/30 text-white/50 hover:text-amber-300'
        }`}
        title={simulationMode ? 'Desactivar modo simulación' : 'Activar modo simulación'}
      >
        🕹️
      </button>

      {/* GPS Error Banner */}
      {gpsError && (
        <div className="absolute top-3 left-3 right-3 z-[1000] glass-card border-red-500/30 text-white text-xs px-4 py-3 rounded-2xl flex items-center justify-between animate-slide-up">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-sm">⚠️</div>
            <span className="text-red-100">{gpsError}</span>
          </div>
          {!simulationMode && (
            <button
              onClick={() => {
                setSimulationMode(true);
                setGpsError(null);
              }}
              className="ml-2 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95"
            >
              Simular
            </button>
          )}
        </div>
      )}

      {/* Simulation Mode Banner */}
      {simulationMode && (
        <div className="absolute top-3 left-3 right-3 z-[1000] glass-card border-amber-500/30 text-white text-xs px-4 py-3 rounded-2xl flex items-center justify-between animate-slide-up">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-sm">🕹️</div>
            <span className="text-amber-100">Modo simulación: arrastra el marcador azul para moverte</span>
          </div>
          <button
            onClick={() => {
              setSimulationMode(false);
              setGpsError(null);
            }}
            className="ml-2 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95"
          >
            GPS Real
          </button>
        </div>
      )}

      {/* Map overlay controls */}
      <div className="absolute top-16 left-3 right-3 z-[1000] flex items-center justify-between pointer-events-none">
        {/* Data source badge */}
        {dataSource && (
          <div
            className={`pointer-events-auto text-[10px] px-3 py-1.5 rounded-xl border font-mono font-bold transition-all duration-300 ${
              dataSource === 'osm'
                ? 'glass-card border-emerald-500/30 text-emerald-300'
                : 'glass-card border-amber-500/30 text-amber-300'
            }`}
            title={apiError || undefined}
          >
            {dataSource === 'osm' ? '📍 OSM real' : `🎲 Simulado${apiError ? ': ' + apiError : ''}`}
          </div>
        )}

        {/* Faction zones toggle */}
        <button
          onClick={() => setShowFactionZones(z => !z)}
          className={`pointer-events-auto text-[10px] px-3 py-1.5 rounded-xl border font-mono font-bold transition-all duration-300 ${
            showFactionZones
              ? 'glass-card border-purple-500/30 text-purple-300 hover:border-purple-500/50'
              : 'glass-card border-white/10 text-white/30 hover:text-white/50'
          }`}
          title={showFactionZones ? 'Ocultar territorios de facciones' : 'Mostrar territorios de facciones'}
        >
          {showFactionZones ? '🏴 Zonas visibles' : '🏳️ Zonas ocultas'}
        </button>

        {/* Energy counter */}
        <div className="pointer-events-auto glass-card rounded-xl px-3 py-1.5 text-xs font-mono border-white/10">
          <span className="text-white/50">Energía: </span>
          <span className={`font-bold ${
            !canVisit ? 'text-red-400' : 'text-gradient-cyan'
          }`}>
            {state.energyCurrent}/{state.energyMax} 🥾
          </span>
        </div>
      </div>

      {/* Radar Minimap */}
      {state.phase === 'playing' && (
        <RadarMinimap
          playerLat={state.playerLat}
          playerLng={state.playerLng}
          locations={locations}
          selectedLocation={selectedLocation}
          visitedLocations={state.visitedLocations}
          canVisit={canVisit}
          onSelectLocation={(loc) => {
            if (canVisit && !state.depletedLocationIds.includes(loc.id)) setSelectedLocation(loc);
          }}
        />
      )}

      {/* Loading overlay for locations */}
      {loadingLocations && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] glass-card rounded-2xl border-white/10 text-white text-sm px-5 py-3 flex items-center gap-3 animate-zoom-in">
          <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 flex items-center justify-center text-xs border border-cyan-500/20 animate-spin">⏳</span>
          <span className="font-medium">Buscando lugares cercanos...</span>
        </div>
      )}

      {/* Map */}
      <MapContainer
        center={center}
        zoom={16}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController
          playerLat={state.playerLat}
          playerLng={state.playerLng}
          recenterKey={recenterKey}
        />

        {/* Player marker */}
        {state.playerLat !== null && state.playerLng !== null && (
          <>
            {/* Collection radius circle */}
            <Circle
              center={[state.playerLat, state.playerLng]}
              radius={COLLECTION_RADIUS_METERS}
              pathOptions={{
                color: '#3b82f6',
                fillColor: '#3b82f6',
                fillOpacity: 0.08,
                weight: 2,
                dashArray: '6 4',
              }}
            />
            <Marker
              position={[state.playerLat, state.playerLng]}
              icon={playerIcon}
              draggable={simulationMode}
              eventHandlers={
                simulationMode
                  ? {
                      dragend: (e) => {
                        const marker = e.target;
                        const pos = marker.getLatLng();
                        dispatch({
                          type: 'SET_PLAYER_POSITION',
                          lat: pos.lat,
                          lng: pos.lng,
                        });
                      },
                    }
                  : undefined
              }
            />
          </>
        )}

        {/* Resource locations */}
        {locations.map((loc) => (
          <Marker
            key={loc.id}
            position={[loc.lat, loc.lng]}
            icon={createLocationIcon(
              loc.type,
              state.visitedLocations.includes(loc.id),
              state.depletedLocationIds.includes(loc.id)
            )}
            eventHandlers={{
              click: () => {
                if (canVisit && !state.depletedLocationIds.includes(loc.id)) setSelectedLocation(loc);
              },
            }}
          />
        ))}

        {/* Faction territory zones */}
        {state.playerLat !== null && state.playerLng !== null && (
          <FactionTerritoryZones
            playerLat={state.playerLat}
            playerLng={state.playerLng}
            factionReputation={state.factionReputation}
            factionAlliance={state.factionAlliance}
            visible={showFactionZones}
          />
        )}

        {/* Rumor markers for hidden_supply and location_bonus */}
        {state.activeRumors
          .filter(r => (r.type === 'hidden_supply' || r.type === 'location_bonus') && r.locationType)
          .map(rumor => {
            const targetLoc = locations.find(l => l.type === rumor.locationType);
            if (!targetLoc) return null;
            const rumorIcon = L.divIcon({
              html: '<div style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:20px;filter:drop-shadow(0 0 6px #fbbf24);animation:pulse 1.5s infinite;">❓</div>',
              className: '',
              iconSize: [32, 32],
              iconAnchor: [16, 16],
            });
            return (
              <Marker
                key={'rumor_' + rumor.id}
                position={[targetLoc.lat, targetLoc.lng]}
                icon={rumorIcon}
              />
            );
          })}
      </MapContainer>

      {/* Location detail modal (mobile friendly) */}
      {selectedLocation && canVisit && (
        <div
          className="absolute inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          onClick={() => setSelectedLocation(null)}
        >
          <div
            className="animate-slide-up w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <LocationInfo
              location={selectedLocation}
              onCollect={() => handleCollect(selectedLocation)}
              visitedToday={state.visitedLocations.includes(
                selectedLocation.id
              )}
              playerLat={state.playerLat}
              playerLng={state.playerLng}
            />
            <button
              onClick={() => setSelectedLocation(null)}
              className="mt-2 w-full py-3 glass-card rounded-2xl border-white/10 text-white/70 hover:text-white hover:bg-white/10 text-sm font-bold transition-all duration-200 active:scale-95"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Particle effects */}
      {particles.length > 0 && (
        <div className="fixed inset-0 z-[2999] pointer-events-none overflow-hidden">
          {particles.map(p => (
            <div
              key={p.id}
              className="absolute animate-particle"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
              }}
            >
              <span className="text-xl">{p.icon}</span>
            </div>
          ))}
        </div>
      )}

      {/* Toast notifications */}
      <div className="fixed top-4 right-4 z-[3000] flex flex-col gap-2.5 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="animate-slide-in-right glass-card rounded-2xl border-emerald-500/20 text-white px-5 py-4 shadow-2xl flex items-center gap-3.5 pointer-events-auto max-w-xs hover:border-emerald-500/40 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center text-lg border border-emerald-500/20 shrink-0">
              {toast.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{toast.message}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-emerald-400/70 font-mono">Recurso obtenido</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recenter button */}
      {state.playerLat !== null && state.playerLng !== null && (
        <button
          onClick={() => setRecenterKey(k => k + 1)}
          className="absolute bottom-36 right-3 z-[1000] glass-card rounded-full w-11 h-11 flex items-center justify-center border-white/10 hover:border-cyan-500/30 hover:bg-white/10 transition-all duration-200 hover:scale-110 active:scale-90 group"
          title="Centrar en mi ubicación"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/70 group-hover:text-cyan-300 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v4m0 12v4m10-10h-4M6 12H2" />
          </svg>
        </button>
      )}


      {explorationEvent && (
        <ExplorationEventModal
          event={explorationEvent}
          onClose={() => setExplorationEvent(null)}
        />
      )}
      {roamingEvent && (
        <ExplorationEventModal
          event={roamingEvent}
          onClose={() => setRoamingEvent(null)}
        />
      )}
      {encounter && (
        <EncounterModal
          encounter={encounter}
          onClose={() => setEncounter(null)}
        />
      )}
    </div>
  );
}
