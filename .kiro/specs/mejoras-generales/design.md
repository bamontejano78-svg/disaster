# Diseño: Mejoras Generales del Juego

## Visión general

Este documento describe las decisiones de diseño técnico para implementar los requisitos del spec de mejoras. Se mantiene la arquitectura existente (React + useReducer + GameContext) y se extiende de forma incremental.

---

## Área 1 — UX e Interfaz

### REQ-1: Menú de navegación colapsable

**Componente afectado:** `GameHeader.tsx`

Se añade un estado local `showMoreMenu: boolean`. Los botones de Misiones, Trueque, Hub Comunitario, Compañeros y Diario se mueven a un panel desplegable que aparece debajo del header al pulsar el botón "Más" (icono `⋯` o `☰`).

```
Header visible siempre:
  [🌍 Título] ... [🏠 Refugio] [🎒 Inventario] [⋯ Más]

Panel "Más" (desplegable):
  [📋 Misiones] [⚖️ Trueque] [🏛️ Hub] [🐾 Compañeros] [📖 Diario]
```

El panel se cierra al pulsar cualquier botón dentro de él o al pulsar fuera. En pantallas ≥640px se muestran todos los botones directamente (sin menú "Más").

### REQ-2: Confirmación de reset

**Componente afectado:** `GameHeader.tsx`

Se añade un estado local `showResetConfirm: boolean`. El botón 🔄 activa `showResetConfirm = true`. Se renderiza un modal de confirmación inline (no un `window.confirm`) con dos botones: "Cancelar" y "Reiniciar". El modal menciona que el high score y logros se conservan.

### REQ-3: Modo simulación siempre accesible

**Componente afectado:** `GameMap.tsx`

Se añade un botón flotante en la esquina inferior derecha del mapa (sobre el zoom de Leaflet), siempre visible. El botón alterna `simulationMode`. Su estado visual cambia según si el modo está activo o no. El banner de error de GPS existente se mantiene para informar del problema, pero ya no es el único punto de entrada al modo simulación.

### REQ-4: Eliminar popup duplicado de Leaflet

**Componente afectado:** `GameMap.tsx`

Se elimina el bloque `{selectedLocation?.id === loc.id && (<Popup>...</Popup>)}` dentro de cada `<Marker>`. El `eventHandlers.click` del marker solo llama a `setSelectedLocation(loc)`. El modal personalizado existente (el `div` con `absolute inset-0`) ya maneja la visualización completa.

---

## Área 2 — Diseño de Juego y Mecánicas

### REQ-5: Sistema de Energía

**Tipos afectados:** `game.ts` — `GameState`, `GameAction`

Se añaden dos campos al `GameState`:
```ts
energyMax: number;   // máximo de energía del día (base: 5)
energyCurrent: number; // energía restante hoy
```

**Acciones nuevas:**
```ts
| { type: 'USE_ENERGY'; amount: number }
| { type: 'RESTORE_ENERGY'; amount: number }
```

**Lógica de cambio:**
- `END_DAY` resetea `energyCurrent = energyMax`.
- `COLLECT_RESOURCES` llama internamente a `USE_ENERGY` con amount 1.
- `UPGRADE_SHELTER` al nivel 3+ aumenta `energyMax` en 1.
- Compañeros con `defenseBonus >= 10` aumentan `energyMax` en 1 mientras están activos (calculado en `END_DAY`).

**UI:** El HUD muestra la energía como iconos de bota (🥾) o una barra pequeña junto al contador de visitas. El texto "Visitas hoy: X/5" se reemplaza por "Energía: X/Y 🥾".

**Migración:** El campo `visitedLocations.length < 5` en `canVisit` se reemplaza por `state.energyCurrent > 0`.

### REQ-6: Estados intermedios en desastres

**Tipos afectados:** `game.ts` — `GameState`, `SurvivalRecord`, `GameAction`

Se añade al `GameState`:
```ts
injuredUntilDay: number | null; // día hasta el que el jugador está herido
shelterDamaged: boolean;        // si el refugio está dañado esta semana
```

Se añade a `SurvivalRecord`:
```ts
outcome: 'clean' | 'damaged' | 'injured' | 'both' | 'failed';
```

**Lógica en `APPLY_DISASTER_RESULT`:**

```
ratio = recursos_disponibles / recursos_requeridos (promedio ponderado)

ratio >= 1.0  → outcome: 'clean'
ratio >= 0.6  → outcome: 'damaged' o 'injured' (50/50 aleatorio)
ratio >= 0.3  → outcome: 'both'
ratio < 0.3   → outcome: 'failed' (game over)
```

Efectos:
- `damaged`: `shelterDefenseBoost` se reduce a 0 y `shelterLevel` baja 1 (mínimo 0).
- `injured`: `injuredUntilDay` = día 2 de la semana siguiente; mientras esté activo, `energyMax` se reduce en 2.
- `both`: ambos efectos.

**UI:** `SurvivalResult.tsx` muestra el outcome con iconografía:
- 🏆 Supervivencia limpia
- 🏚️ Refugio dañado
- 🩹 Herido
- 💀 Game over

### REQ-7: Karma con consecuencias visibles

**Archivos afectados:** `npcEncounters.ts`, `explorationEvents.ts`, `GameMap.tsx`, `HUD.tsx`

**Lógica de karma en encuentros NPC** (en `getRandomNPCEncounter`):
- Si `karma <= -5` y el encuentro es de facción `survivors` o `military`: 30% de probabilidad de devolver `null` (sin encuentro) o un encuentro hostil alternativo.
- Si `karma >= 8`: filtrar encuentros exclusivos de karma alto (nuevo campo `karmaMin: 8` en algunos encuentros).
- Si `karma <= -8`: filtrar encuentros exclusivos de karma bajo (nuevo campo `karmaMax: -8` en algunos encuentros).

**Lógica en eventos de exploración** (en `generateExplorationEventWithBonus`):
- Si `karma >= 5`: el resultado del evento tiene +15% de probabilidad de ser positivo (se pasa `karma` como parámetro).

**UI en HUD:** El indicador de karma muestra un tooltip al hacer hover/tap con el efecto activo según el rango:
- karma ≥ 8: "Los supervivientes confían en ti plenamente"
- karma ≥ 5: "Tu reputación te abre puertas"
- karma entre -4 y 4: "Neutro"
- karma ≤ -5: "La gente desconfía de ti"
- karma ≤ -8: "Los forajidos te respetan, los demás te temen"

### REQ-8: Tensión dinámica entre facciones

**Archivos afectados:** `GameContext.tsx` (en `ADVANCE_WEEK`), `communityEvents.ts`, `game.ts`

Se añade lógica en `ADVANCE_WEEK` para detectar tensiones:

```ts
// Tensión survivors vs outlaws
if (rep.survivors >= 5 && rep.outlaws >= 5) {
  // Añadir evento comunitario de "conflicto de lealtad" a la cola
  // Añadir entrada de diario
}

// Tensión military vs outlaws
if (rep.military >= 5 && rep.outlaws >= 3) {
  // Marcar flag para que el próximo encuentro con outlaws tenga opción de delatar
}
```

Se añade al `GameState`:
```ts
activeFactionTensions: FactionTension[];
```

```ts
interface FactionTension {
  id: string;
  factionA: FactionId;
  factionB: FactionId;
  weekStarted: number;
}
```

Los eventos de tensión se implementan como `CommunityEvent` especiales con `karmaMin/Max` no requeridos pero con `factionRepMin` que activa la condición.

---

## Área 3 — Balance de Recursos

### REQ-9: Escala de recursos por semana

**Archivos afectados:** `resources.ts`, `overpassApi.ts`, `GameMap.tsx`

Se crea una función utilitaria:
```ts
export function scaleResourcesByWeek(
  resources: Partial<Resources>,
  week: number,
  rarity?: 'common' | 'rare' | 'legendary'
): Partial<Resources>
```

Fórmula:
```ts
const baseMultiplier = 1 + (week - 1) * 0.15;
const rarityBonus = rarity === 'rare' ? 0.1 : rarity === 'legendary' ? 0.2 : 0;
const multiplier = baseMultiplier + (week - 1) * rarityBonus;
// Aplicar a cada recurso, redondear al entero más cercano
```

Esta función se llama en `GameMap.tsx` al generar las ubicaciones, pasando `state.week` como parámetro. No modifica los datos base en `resources.ts`.

### REQ-10: Rebalanceo de compañeros

**Archivos afectados:** `companions.ts`, `CompanionPanel.tsx`

Cambios en datos:
```ts
// Teniente Vega
cost: { food: 1, water: 1 }  // eliminar fuel: 1
maxDuration: 3               // subir de 2 a 3

// Cualquier otro con maxDuration: 2 → 3
```

**UI en `CompanionPanel.tsx`:** Para cada compañero (activo y disponible), mostrar una fila de balance neto:
```
Bonus diario: 🍖+1 ⛽+1   Coste: 🍖-1 💧-1   Neto: ⛽+1 💧-1
```
Usar colores verde/rojo para positivo/negativo.

### REQ-11: Corrección de `daily_crafter`

**Archivos afectados:** `game.ts`, `GameContext.tsx`, `missions.ts`

Añadir a `GameState`:
```ts
craftedToday: boolean;
```

En el reducer:
- `CRAFT_ITEM` (si tiene éxito): `craftedToday: true`
- `END_DAY`: `craftedToday: false`
- `ADVANCE_WEEK`: `craftedToday: false`
- `RESET_GAME`: `craftedToday: false`

En `missions.ts`:
```ts
// daily_crafter
condition: (state: GameState) => state.craftedToday === true,
```

---

## Área 4 — Profundidad de Contenido

### REQ-12: Progresión del mundo entre semanas

**Archivos afectados:** `game.ts`, `GameContext.tsx`, `GameMap.tsx`, `resources.ts`

Se añade al `GameState`:
```ts
depletedLocationIds: string[];   // IDs de ubicaciones agotadas permanentemente
weakenedLocationTypes: string[]; // tipos de ubicación debilitados por el desastre anterior
```

En `ADVANCE_WEEK`:
```ts
// Agotar 20% de ubicaciones common visitadas la semana anterior
const visitedCommon = state.visitedLocations.filter(id => {
  const loc = locations.find(l => l.id === id);
  return loc?.rarity === 'common' || !loc?.rarity;
});
const toDeplete = visitedCommon.slice(0, Math.floor(visitedCommon.length * 0.2));
newDepletedIds = [...state.depletedLocationIds, ...toDeplete];

// Calcular tipos debilitados según el desastre de esta semana
const weakened = getWeakenedTypesByDisaster(state.currentDisaster);
```

Se crea `getWeakenedTypesByDisaster(disaster: DisasterType): LocationType[]` en `disasters.ts`:
```ts
// flood → park, urban_garden, water_facility
// wildfire → park, urban_garden
// earthquake → construction_site, hardware
// etc.
```

En `GameMap.tsx`:
- Las ubicaciones en `depletedLocationIds` se renderizan con icono gris y sin recursos.
- Las ubicaciones de tipo en `weakenedLocationTypes` tienen sus recursos reducidos al 50% (usando `scaleResourcesByWeek` con multiplicador adicional 0.5).

### REQ-13: Rumores con marcadores en el mapa

**Archivos afectados:** `GameMap.tsx`, `HUD.tsx`, `game.ts`

En `GameMap.tsx`:
- Se itera sobre `state.activeRumors` filtrando los de tipo `hidden_supply` y `location_bonus`.
- Para cada uno, si tiene `locationType`, se busca la primera ubicación del mapa con ese tipo y se renderiza un `<Marker>` especial con un `DivIcon` de interrogación pulsante (CSS `animation: pulse`).
- Al recolectar en esa ubicación, se dispara `CLAIM_RUMOR` automáticamente si hay un rumor activo que coincide con el tipo de ubicación.

En `HUD.tsx`:
- Los rumores de tipo `disaster_hint` se muestran como un banner adicional (similar al banner de señales de desastre existente), con icono 🔍 y texto del rumor.

### REQ-14: Diario interactivo

**Archivos afectados:** `JournalModal.tsx`, `game.ts`

**Filtro por tipo:**
Se añade un estado local `filterType: 'all' | 'encounter' | 'decision' | 'milestone' | 'disaster' | 'community'` en `JournalModal`. Se renderiza una fila de chips/tabs para filtrar.

**Entradas de tipo `encounter` con botón "Recordar":**
- Se añade al `JournalEntry` un campo opcional `encounterId?: string`.
- Al pulsar "Recordar", se abre el `EncounterModal` en modo solo lectura (nueva prop `readOnly: boolean`).
- En modo `readOnly`, los botones de elección están deshabilitados y se muestra cuál fue la opción elegida (requiere guardar `chosenOptionIndex?: number` en `JournalEntry`).

**Entradas de tipo `milestone` de compañeros:**
- Se muestra el estado del compañero: si está en `state.activeCompanions`, mostrar "Activo (X semanas restantes)"; si no, "Expirado".

**Entradas de tipo `disaster`:**
- Se busca en `state.history` el registro correspondiente a la semana de la entrada.
- Se muestra una tabla compacta de recursos antes/después.

---

## Orden de implementación sugerido

1. REQ-4 (eliminar popup duplicado) — cambio pequeño, sin riesgo
2. REQ-2 (confirmación de reset) — cambio pequeño, sin riesgo
3. REQ-11 (corrección daily_crafter) — cambio pequeño en tipos y reducer
4. REQ-3 (modo simulación accesible) — cambio de UI aislado
5. REQ-1 (menú colapsable) — refactor de UI del header
6. REQ-9 (escala de recursos) — nueva función utilitaria
7. REQ-10 (rebalanceo compañeros) — cambio de datos + UI
8. REQ-5 (sistema de energía) — cambio de estado y lógica central
9. REQ-6 (estados intermedios desastres) — cambio de lógica de desastres
10. REQ-7 (karma con consecuencias) — cambio en filtros de encuentros
11. REQ-8 (tensión entre facciones) — nueva lógica en ADVANCE_WEEK
12. REQ-12 (progresión del mundo) — nuevo estado + lógica de mapa
13. REQ-13 (rumores en mapa) — nueva capa visual en GameMap
14. REQ-14 (diario interactivo) — refactor de JournalModal
