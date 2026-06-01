/**
 * Radio de recolección en metros.
 * El jugador debe estar a esta distancia o menos de una ubicación para recolectar recursos.
 * Similar a Pokémon GO (~40-80m para PokéStops).
 */
export const COLLECTION_RADIUS_METERS = 30;

/**
 * Calcula la distancia en metros entre dos coordenadas geográficas
 * usando la fórmula de Haversine.
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6_371_000; // radio de la Tierra en metros
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Devuelve la distancia formateada para mostrar al jugador.
 * - Menos de 1000m: "Xm"
 * - 1000m o más: "X.Xkm"
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

/**
 * Comprueba si el jugador está dentro del radio de recolección de una ubicación.
 */
export function isInCollectionRange(
  playerLat: number,
  playerLng: number,
  locationLat: number,
  locationLng: number
): boolean {
  return (
    haversineDistance(playerLat, playerLng, locationLat, locationLng) <=
    COLLECTION_RADIUS_METERS
  );
}
