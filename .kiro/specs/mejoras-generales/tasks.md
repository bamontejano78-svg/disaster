# Tareas de Implementación: Mejoras Generales

## Grupo 1 — Correcciones rápidas (sin riesgo)

- [ ] 1. **Eliminar popup duplicado de Leaflet** (REQ-4)
  - En `GameMap.tsx`, eliminar el bloque `{selectedLocation?.id === loc.id && (<Popup>...</Popup>)}` dentro del `<Marker>` de cada ubicación
  - Verificar que el modal personalizado (`selectedLocation && canVisit`) sigue funcionando correctamente
  - Asegurarse de que el click en el marcador solo llama a `setSelectedLocation(loc)`

- [ ] 2. **Confirmación antes de resetear** (REQ-2)
  - En `GameHeader.tsx`, añadir estado local `showResetConfirm: boolean`
  - Reemplazar la llamada directa a `resetGame` por `setShowResetConfirm(true)`
  - Crear un modal de confirmación inline con botones "Cancelar" y "Reiniciar"
  - El modal debe indicar que el high score y logros se conservan

- [ ] 3. **Corrección de la misión `daily_crafter`** (REQ-11)
  - En `game.ts`, añadir `craftedToday: boolean` al interface `GameState`
  - En `GameContext.tsx`, inicializar `craftedToday: false` en `buildInitialState` y en `RESET_GAME`
  - En el reducer, poner `craftedToday: true` en el case `CRAFT_ITEM` (solo si el craft tiene éxito)
  - En los cases `END_DAY` y `ADVANCE_WEEK`, resetear `craftedToday: false`
  - En `missions.ts`, actualizar la condición de `daily_crafter` a `state.craftedToday === true`

## Grupo 2 — Mejoras de UI

- [ ] 4. **Modo simulación siempre accesible** (REQ-3)
  - En `GameMap.tsx`, añadir un botón flotante en la esquina inferior derecha del mapa (z-index sobre el mapa, debajo de los modales)
  - El botón alterna `simulationMode` independientemente del estado del GPS
  - Mostrar estado visual diferente según si el modo está activo (ej. color ámbar cuando activo)
  - Mantener el banner de error de GPS existente para informar del problema

- [ ] 5. **Menú de navegación colapsable en el header** (REQ-1)
  - En `GameHeader.tsx`, añadir estado local `showMoreMenu: boolean`
  - Mantener visibles siempre: botón Refugio, botón Inventario, botón "⋯ Más", botón Reset
  - Mover a panel desplegable: Misiones, Trueque, Hub Comunitario, Compañeros, Diario
  - El panel se cierra al pulsar cualquier botón dentro o al pulsar fuera (click outside)
  - En pantallas ≥640px (`sm:` en Tailwind), mostrar todos los botones directamente sin menú "Más"

## Grupo 3 — Balance de recursos

- [ ] 6. **Escala de recursos de ubicaciones según semana** (REQ-9)
  - En `resources.ts`, crear y exportar la función `scaleResourcesByWeek(resources, week, rarity?)`
  - Fórmula: `multiplier = 1 + (week - 1) * 0.15 + (week - 1) * rarityBonus` donde rarityBonus es 0.1 para rare y 0.2 para legendary
  - En `GameMap.tsx`, aplicar `scaleResourcesByWeek` a los recursos de cada ubicación al renderizar, usando `state.week`
  - Verificar que los recursos mostrados en el popup/modal reflejan los valores escalados

- [ ] 7. **Rebalanceo de compañeros y UI de balance neto** (REQ-10)
  - En `companions.ts`, actualizar el Teniente Vega: eliminar `fuel: 1` del coste, subir `maxDuration` de 2 a 3
  - Revisar todos los compañeros con `maxDuration: 2` y subirlos a 3
  - En `CompanionPanel.tsx`, añadir para cada compañero una sección de "Balance diario" que muestre bonus - coste con colores verde/rojo

## Grupo 4 — Mecánicas de juego

- [ ] 8. **Sistema de Energía/Stamina** (REQ-5)
  - En `game.ts`, añadir `energyMax: number` y `energyCurrent: number` al interface `GameState`
  - Añadir acciones `USE_ENERGY` y `RESTORE_ENERGY` al tipo `GameAction`
  - En `GameContext.tsx`, inicializar `energyMax: 5, energyCurrent: 5` en `buildInitialState`
  - En el reducer, implementar los cases `USE_ENERGY` y `RESTORE_ENERGY`
  - En `END_DAY` y `ADVANCE_WEEK`, resetear `energyCurrent = energyMax`
  - En `COLLECT_RESOURCES`, despachar `USE_ENERGY` con amount 1 (o hacerlo dentro del reducer directamente)
  - En `UPGRADE_SHELTER` al nivel 3+, incrementar `energyMax` en 1
  - Reemplazar la lógica `canVisit` en `GameMap.tsx` por `state.energyCurrent > 0`
  - En el HUD, reemplazar el contador "Visitas hoy: X/5" por "Energía: X/Y 🥾"

- [ ] 9. **Estados intermedios en desastres** (REQ-6)
  - En `game.ts`, añadir `injuredUntilDay: number | null` y `shelterDamaged: boolean` al `GameState`
  - Añadir campo `outcome: 'clean' | 'damaged' | 'injured' | 'both' | 'failed'` al interface `SurvivalRecord`
  - En `GameContext.tsx`, actualizar el case `APPLY_DISASTER_RESULT` para calcular el ratio de recursos y determinar el outcome
  - Aplicar efectos según outcome: damaged reduce shelterLevel, injured establece injuredUntilDay
  - En `END_DAY`, verificar si `injuredUntilDay` ha pasado y restaurar `energyMax` si corresponde
  - En `SurvivalResult.tsx`, mostrar el outcome con iconografía apropiada (🏆 / 🏚️ / 🩹 / ambos / 💀)

- [ ] 10. **Karma con consecuencias visibles** (REQ-7)
  - En `npcEncounters.ts`, actualizar `getRandomNPCEncounter` para recibir `karma` como parámetro (ya lo recibe, verificar uso)
  - Añadir lógica: si karma ≤ -5 y el encuentro es de facción survivors/military, 30% de probabilidad de retornar null
  - Añadir encuentros NPC exclusivos con `karmaMin: 8` (karma alto) y `karmaMax: -8` (karma bajo)
  - En `explorationEvents.ts`, actualizar `generateExplorationEventWithBonus` para recibir `karma` y aplicar +15% de probabilidad positiva si karma ≥ 5
  - En `HUD.tsx`, añadir un tooltip/descripción al indicador de karma que muestre el efecto activo según el rango

- [ ] 11. **Tensión dinámica entre facciones** (REQ-8)
  - En `game.ts`, añadir interface `FactionTension` y campo `activeFactionTensions: FactionTension[]` al `GameState`
  - En `GameContext.tsx`, en el case `ADVANCE_WEEK`, detectar tensiones activas (survivors≥5 + outlaws≥5, military≥5 + outlaws≥3)
  - Cuando se detecta tensión survivors/outlaws, añadir un `CommunityEvent` especial de "conflicto de lealtad" a la cola y una entrada de diario
  - Cuando se detecta tensión military/outlaws, marcar en `activeFactionTensions` para que el próximo encuentro con outlaws tenga opción de delatar
  - En `npcEncounters.ts`, añadir la opción de "delatar" condicionalmente si existe la tensión military/outlaws activa

## Grupo 5 — Profundidad de contenido

- [ ] 12. **Progresión del mundo entre semanas** (REQ-12)
  - En `game.ts`, añadir `depletedLocationIds: string[]` y `weakenedLocationTypes: string[]` al `GameState`
  - En `disasters.ts`, crear la función `getWeakenedTypesByDisaster(disaster: DisasterType): LocationType[]` con el mapeo desastre → tipos afectados
  - En `GameContext.tsx`, en `ADVANCE_WEEK`, calcular qué ubicaciones se agotan (20% de las common visitadas) y qué tipos se debilitan según el desastre de la semana
  - En `GameMap.tsx`, renderizar ubicaciones agotadas con icono gris y sin recursos
  - En `GameMap.tsx`, aplicar multiplicador 0.5 a los recursos de ubicaciones de tipos debilitados

- [ ] 13. **Rumores con marcadores en el mapa** (REQ-13)
  - En `GameMap.tsx`, iterar sobre `state.activeRumors` filtrando los de tipo `hidden_supply` y `location_bonus` con `locationType` definido
  - Para cada rumor relevante, buscar la primera ubicación del mapa con ese `locationType` y renderizar un `<Marker>` especial con un `DivIcon` de interrogación pulsante
  - En `handleCollect`, verificar si hay un rumor activo que coincide con el tipo de ubicación y despachar `CLAIM_RUMOR` automáticamente
  - En `HUD.tsx`, mostrar los rumores de tipo `disaster_hint` como un banner adicional con icono 🔍

- [ ] 14. **Diario interactivo** (REQ-14)
  - En `game.ts`, añadir campos opcionales `encounterId?: string` y `chosenOptionIndex?: number` al interface `JournalEntry`
  - En `JournalModal.tsx`, añadir estado local `filterType` con los valores posibles y renderizar chips/tabs de filtro
  - Para entradas de tipo `encounter` con `encounterId`, añadir botón "Recordar" que abre `EncounterModal` en modo solo lectura
  - En `EncounterModal.tsx`, añadir prop `readOnly?: boolean` que deshabilita los botones de elección y resalta la opción elegida
  - Para entradas de tipo `milestone` de compañeros, mostrar estado actual (activo/expirado) buscando en `state.activeCompanions`
  - Para entradas de tipo `disaster`, buscar en `state.history` el registro de esa semana y mostrar tabla de recursos antes/después
