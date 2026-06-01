import { useMemo } from 'react';
import type { ResourceLocation } from '../types/game';
import { LOCATION_COLORS } from '../data/resources';

// ─── Math constants ───
const METERS_PER_DEG_LAT = 111320;
function metersPerDegLng(lat: number): number {
  return METERS_PER_DEG_LAT * Math.cos((lat * Math.PI) / 180);
}

// ─── Radar config ───
const RADAR_SIZE = 140;          // px diameter
const RADAR_RADIUS_PX = RADAR_SIZE / 2;
const MAX_RANGE_M = 800;         // meters visible on radar
const SCALE = RADAR_RADIUS_PX / MAX_RANGE_M; // px per meter
const RINGS = [200, 400, 600];   // distance ring labels (meters)

// ─── Dot sizes ───
const PLAYER_DOT_R = 4;
const LOCATION_DOT_R = 3;
const HOVER_DOT_R = 5;

interface RadarProps {
  playerLat: number | null;
  playerLng: number | null;
  locations: ResourceLocation[];
  selectedLocation: ResourceLocation | null;
  visitedLocations: string[];
  canVisit: boolean;
  onSelectLocation: (loc: ResourceLocation) => void;
}

interface RadarPoint {
  loc: ResourceLocation;
  x: number;
  y: number;
  distM: number;
  angle: number;
  inRange: boolean;
}

export default function RadarMinimap({
  playerLat,
  playerLng,
  locations,
  selectedLocation,
  visitedLocations,
  canVisit,
  onSelectLocation,
}: RadarProps) {
  const points = useMemo<RadarPoint[]>(() => {
    if (playerLat === null || playerLng === null) return [];

    const degLng = metersPerDegLng(playerLat);

    return locations
      .map((loc) => {
        const dLat = loc.lat - playerLat;
        const dLng = loc.lng - playerLng;

        const dy = dLat * METERS_PER_DEG_LAT;  // meters north (+ = north)
        const dx = dLng * degLng;               // meters east  (+ = east)

        const distM = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dx, dy);       // radians from north

        const px = dx * SCALE;   // screen x (+ = right/east)
        const py = -dy * SCALE;  // screen y (+ = up/north, but SVG y is down)

        return {
          loc,
          x: px,
          y: py,
          distM: Math.round(distM),
          angle,
          inRange: distM <= MAX_RANGE_M,
        };
      })
      .sort((a, b) => a.distM - b.distM); // closest first
  }, [playerLat, playerLng, locations]);

  const center = RADAR_RADIUS_PX;

  if (playerLat === null || playerLng === null) return null;

  return (
    <div className="absolute top-[4.5rem] right-3 z-[1000] group">
      {/* Radar container */}
      <div className="relative w-[140px] h-[140px]">
        <svg
          width={RADAR_SIZE}
          height={RADAR_SIZE}
          viewBox={`0 0 ${RADAR_SIZE} ${RADAR_SIZE}`}
          className="overflow-visible"
        >
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={RADAR_RADIUS_PX - 1}
            fill="rgba(15,15,35,0.85)"
            stroke="rgba(75,85,99,0.5)"
            strokeWidth={1}
          />

          {/* Distance rings */}
          {RINGS.map((r) => {
            const ringR = r * SCALE;
            return (
              <g key={r}>
                <circle
                  cx={center}
                  cy={center}
                  r={ringR}
                  fill="none"
                  stroke="rgba(75,85,99,0.25)"
                  strokeWidth={0.5}
                  strokeDasharray="2 3"
                />
                <text
                  x={center}
                  y={center - ringR + 6}
                  textAnchor="middle"
                  fill="rgba(156,163,175,0.5)"
                  fontSize={7}
                  fontFamily="monospace"
                >
                  {r}m
                </text>
              </g>
            );
          })}

          {/* Crosshair lines */}
          <line
            x1={center} y1={4} x2={center} y2={RADAR_SIZE - 4}
            stroke="rgba(75,85,99,0.2)" strokeWidth={0.5}
          />
          <line
            x1={4} y1={center} x2={RADAR_SIZE - 4} y2={center}
            stroke="rgba(75,85,99,0.2)" strokeWidth={0.5}
          />

          {/* Compass N */}
          <text
            x={center}
            y={10}
            textAnchor="middle"
            fill="rgba(239,68,68,0.7)"
            fontSize={8}
            fontFamily="monospace"
            fontWeight="bold"
          >
            N
          </text>

          {/* Resource dots */}
          {points.map((p) => {
            if (!p.inRange) return null;

            const isSelected = selectedLocation?.id === p.loc.id;
            const isVisited = visitedLocations.includes(p.loc.id);
            const color = LOCATION_COLORS[p.loc.type] || '#888';
            const r = isSelected ? HOVER_DOT_R : LOCATION_DOT_R;
            const opacity = isVisited ? 0.3 : 0.9;

            const sx = center + p.x;
            const sy = center + p.y;

            return (
              <g key={p.loc.id}>
                {/* Glow ring */}
                {isSelected && (
                  <circle
                    cx={sx}
                    cy={sy}
                    r={r + 3}
                    fill="none"
                    stroke={color}
                    strokeWidth={1}
                    opacity={0.5}
                    className="animate-pulse"
                  />
                )}
                {/* Dot */}
                <circle
                  cx={sx}
                  cy={sy}
                  r={r}
                  fill={color}
                  opacity={opacity}
                  stroke="white"
                  strokeWidth={isSelected ? 1.5 : 0.5}
                  style={{ cursor: isVisited || !canVisit ? 'default' : 'pointer', transition: 'r 0.15s' }}
                  onClick={() => {
                    if (!isVisited && canVisit) onSelectLocation(p.loc);
                  }}
                />
              </g>
            );
          })}

          {/* Player dot (on top) */}
          <circle
            cx={center}
            cy={center}
            r={PLAYER_DOT_R}
            fill="#3b82f6"
            stroke="white"
            strokeWidth={1.5}
          />
          <circle
            cx={center}
            cy={center}
            r={PLAYER_DOT_R + 2}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={0.5}
            opacity={0.5}
          >
            <animate
              attributeName="r"
              from={PLAYER_DOT_R + 1}
              to={PLAYER_DOT_R + 5}
              dur="1.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              from={0.6}
              to={0}
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>

      {/* Tooltip on hover */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-gray-900/95 backdrop-blur-sm text-[10px] text-gray-400 px-2 py-1 rounded-md border border-gray-700 whitespace-nowrap text-center font-mono">
          <span className="text-white font-bold">{points.filter(p => p.inRange).length}</span> lugares
          <br />
          📡 {MAX_RANGE_M}m radio
        </div>
      </div>
    </div>
  );
}
