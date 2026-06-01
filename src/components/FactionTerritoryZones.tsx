import { useState, useEffect, useRef } from 'react';
import { Circle, Tooltip } from 'react-leaflet';
import type { FactionId, FactionReputation } from '../types/game';
import { FACTIONS } from '../data/factions';

// ─── Territory zone definitions ───
// Each faction controls zones at specific offsets from the player's INITIAL position.
// Zones are generated once and pinned — they don't follow the player.

interface ZoneDefinition {
  id: string;
  offsetMeters: { lat: number; lng: number };
  radiusMeters: number;
  name: string;
  description: string;
}

/** Approximate degrees per meter at typical latitudes */
const METERS_TO_DEG_LAT = 1 / 111_320;
function metersToDegLng(meters: number, lat: number): number {
  return meters / (111_320 * Math.cos((lat * Math.PI) / 180));
}

const FACTION_ZONES: Record<FactionId, ZoneDefinition[]> = {
  survivors: [
    {
      id: 'survivors_residential',
      offsetMeters: { lat: 300, lng: -200 },
      radiusMeters: 250,
      name: 'Barrio Residencial',
      description: 'Zona controlada por la Red de Supervivientes',
    },
    {
      id: 'survivors_garden',
      offsetMeters: { lat: -150, lng: 350 },
      radiusMeters: 200,
      name: 'Huerto Comunitario',
      description: 'Cultivos protegidos por los supervivientes',
    },
    {
      id: 'survivors_shelter',
      offsetMeters: { lat: -350, lng: -100 },
      radiusMeters: 180,
      name: 'Refugio Vecinal',
      description: 'Punto de reunión improvisado',
    },
  ],
  merchants: [
    {
      id: 'merchants_market',
      offsetMeters: { lat: 200, lng: 300 },
      radiusMeters: 300,
      name: 'Mercado Ambulante',
      description: 'Territorio comercial del Gremio de Mercaderes',
    },
    {
      id: 'merchants_warehouse',
      offsetMeters: { lat: -250, lng: -300 },
      radiusMeters: 220,
      name: 'Almacén del Gremio',
      description: 'Depósito de suministros custodiado',
    },
    {
      id: 'merchants_caravan',
      offsetMeters: { lat: 400, lng: -50 },
      radiusMeters: 200,
      name: 'Ruta de Caravanas',
      description: 'Corredor seguro para mercaderes',
    },
  ],
  military: [
    {
      id: 'military_checkpoint',
      offsetMeters: { lat: -100, lng: 400 },
      radiusMeters: 280,
      name: 'Punto de Control',
      description: 'Perímetro vigilado por el Remanente Militar',
    },
    {
      id: 'military_compound',
      offsetMeters: { lat: 350, lng: 150 },
      radiusMeters: 320,
      name: 'Base Avanzada',
      description: 'Instalación militar fortificada',
    },
    {
      id: 'military_depot',
      offsetMeters: { lat: -400, lng: 200 },
      radiusMeters: 200,
      name: 'Depósito de Suministros',
      description: 'Material táctico bajo custodia militar',
    },
  ],
  outlaws: [
    {
      id: 'outlaws_den',
      offsetMeters: { lat: 150, lng: -400 },
      radiusMeters: 260,
      name: 'Guarida de los Forajidos',
      description: 'Territorio hostil — entra bajo tu propio riesgo',
    },
    {
      id: 'outlaws_ambush',
      offsetMeters: { lat: -300, lng: 300 },
      radiusMeters: 200,
      name: 'Zona de Emboscada',
      description: 'Zona de saqueo frecuente',
    },
    {
      id: 'outlaws_scrapyard',
      offsetMeters: { lat: 400, lng: -300 },
      radiusMeters: 220,
      name: 'Desguace Ilegal',
      description: 'Chatarra y piezas del mercado negro',
    },
  ],
};

/** Calculate base fill opacity based on reputation (0-10 → 0.04-0.4) */
function getBaseFillOpacity(rep: number): number {
  if (rep <= 0) return 0.03;
  return Math.min(0.4, 0.04 + (rep / 10) * 0.36);
}

/** Calculate border weight based on reputation */
function getZoneWeight(rep: number, isAllied: boolean): number {
  if (isAllied) return 3;
  return rep >= 7 ? 2 : 1;
}

/** Calculate dash array — allied gets solid, others get dashed */
function getZoneDash(rep: number, isAllied: boolean): string | undefined {
  if (isAllied) return undefined; // solid
  return rep >= 5 ? '6 3' : '4 6';
}

/** Calculate stroke opacity */
function getStrokeOpacity(rep: number, isAllied: boolean): number {
  if (isAllied) return 0.9;
  return Math.min(0.7, 0.3 + rep * 0.05);
}

interface ZonePosition {
  lat: number;
  lng: number;
}

interface FactionTerritoryZonesProps {
  playerLat: number;
  playerLng: number;
  factionReputation: FactionReputation;
  factionAlliance: FactionId | null;
  visible: boolean;
}

export default function FactionTerritoryZones({
  playerLat,
  playerLng,
  factionReputation,
  factionAlliance,
  visible,
}: FactionTerritoryZonesProps) {
  // Pin zones to the player's initial position so they don't follow the player
  const pinnedZonesRef = useRef<Map<FactionId, ZonePosition[]> | null>(null);

  // Initialize pinned zones once from the first valid position
  if (pinnedZonesRef.current === null) {
    const map = new Map<FactionId, ZonePosition[]>();
    for (const faction of FACTIONS) {
      const zones = FACTION_ZONES[faction.id];
      map.set(
        faction.id,
        zones.map((z) => ({
          lat: playerLat + z.offsetMeters.lat * METERS_TO_DEG_LAT,
          lng: playerLng + metersToDegLng(z.offsetMeters.lng, playerLat),
        }))
      );
    }
    pinnedZonesRef.current = map;
  }

  // ─── React-based pulse for allied faction ───
  // Toggles a boolean every 1.5s to create a breathing effect without CSS animations
  const [pulseOn, setPulseOn] = useState(false);

  useEffect(() => {
    if (!visible || !factionAlliance) {
      setPulseOn(false);
      return;
    }
    const interval = setInterval(() => {
      setPulseOn((p) => !p);
    }, 1500);
    return () => clearInterval(interval);
  }, [visible, factionAlliance]);

  if (!visible) return null;

  return (
    <>
      {FACTIONS.map((faction) => {
        const rep = factionReputation[faction.id] ?? 0;
        const isAllied = factionAlliance === faction.id;
        const zones = FACTION_ZONES[faction.id];
        const positions = pinnedZonesRef.current?.get(faction.id);

        // Skip if reputation is 0 and not allied
        if (rep === 0 && !isAllied) return null;
        if (!positions) return null;

        const baseFill = getBaseFillOpacity(rep);
        // Allied faction gets a higher base plus the pulse boost
        const fillOpacity = isAllied
          ? pulseOn
            ? baseFill + 0.18
            : baseFill + 0.08
          : baseFill;
        const weight = getZoneWeight(rep, isAllied);
        const dashArray = getZoneDash(rep, isAllied);
        const strokeOpacity = isAllied
          ? pulseOn
            ? 1
            : 0.85
          : getStrokeOpacity(rep, isAllied);

        return zones.map((zone, idx) => {
          const pos = positions[idx];
          if (!pos) return null;

          return (
            <Circle
              key={zone.id}
              center={[pos.lat, pos.lng]}
              radius={zone.radiusMeters}
              pathOptions={{
                color: faction.color,
                fillColor: faction.color,
                fillOpacity,
                weight,
                dashArray,
                opacity: strokeOpacity,
              }}
            >
              <Tooltip
                direction="top"
                offset={[0, -zone.radiusMeters * 0.5]}
                opacity={0.95}
                sticky
              >
                <div
                  style={{
                    background: 'rgba(15, 15, 35, 0.92)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: `1px solid ${faction.color}40`,
                    borderRadius: '12px',
                    padding: '8px 12px',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 600,
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    boxShadow: `0 0 16px ${faction.color}20`,
                  }}
                >
                  <div style={{ fontSize: '16px', marginBottom: '2px' }}>
                    {faction.icon}
                  </div>
                  <div style={{ color: faction.color, fontWeight: 800 }}>
                    {faction.name}
                  </div>
                  <div
                    style={{
                      fontSize: '10px',
                      color: 'rgba(255,255,255,0.5)',
                      marginTop: '2px',
                    }}
                  >
                    {zone.name}
                  </div>
                  {isAllied && (
                    <div
                      style={{
                        fontSize: '9px',
                        color: faction.color,
                        fontWeight: 700,
                        marginTop: '2px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                      }}
                    >
                      ⭐ Territorio aliado
                    </div>
                  )}
                </div>
              </Tooltip>
            </Circle>
          );
        });
      })}
    </>
  );
}
