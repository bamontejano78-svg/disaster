# Requisitos: Mejoras Generales del Juego

## Introducción

Este spec cubre un conjunto de mejoras de diseño, UX, balance y contenido para *Seven Days for Disaster*. Se excluye deliberadamente cualquier cambio al sistema de tiempo real, que es el núcleo de la propuesta de valor del juego.

Las mejoras se agrupan en cuatro áreas: UX e interfaz, diseño de juego y mecánicas, balance de recursos, y profundidad de contenido.

---

## Requisitos

### Área 1 — UX e Interfaz

**REQ-1: Menú de navegación colapsable en el header**
- El header debe mostrar como máximo 3 botones visibles en todo momento (Refugio, Inventario, y un botón "Más").
- El botón "Más" abre un panel o menú con el resto de opciones: Misiones, Trueque, Hub Comunitario, Compañeros, Diario.
- En pantallas anchas (≥640px) se pueden mostrar más botones directamente.
- El diseño debe ser usable con el pulgar en móvil.

**REQ-2: Confirmación antes de resetear la partida**
- El botón de reset (🔄) debe mostrar un diálogo de confirmación antes de ejecutar `resetGame`.
- El diálogo debe indicar claramente que se perderá el progreso de la semana actual.
- El high score y los logros se conservan tras el reset (comportamiento actual), y el diálogo debe mencionarlo.

**REQ-3: Modo simulación siempre accesible**
- Debe existir un botón o control permanente en el mapa para activar/desactivar el modo simulación, independientemente de si hay error de GPS.
- El botón puede estar en la esquina del mapa, discreto pero visible.
- Al activar el modo simulación, el marcador del jugador debe ser arrastrable inmediatamente.

**REQ-4: Eliminar el popup duplicado de Leaflet**
- El `<Popup>` de Leaflet dentro de cada `<Marker>` debe eliminarse.
- Toda la información de ubicación debe mostrarse únicamente en el modal personalizado que ya existe (`selectedLocation`).
- El click en un marcador solo debe actualizar `selectedLocation`, no abrir un popup de Leaflet.

---

### Área 2 — Diseño de Juego y Mecánicas

**REQ-5: Sistema de energía/stamina narrativo**
- Reemplazar el límite arbitrario de "5 visitas por día" por un sistema de Energía visible.
- El jugador empieza cada día con 5 puntos de Energía.
- Cada visita a una ubicación cuesta 1 punto de Energía.
- Ciertos compañeros, el nivel del refugio, o eventos pueden aumentar la Energía máxima o restaurarla.
- La Energía se muestra en el HUD de forma clara (ej. iconos de bota o barra).
- El mensaje de "no puedes visitar más" debe referenciar la Energía, no un límite invisible.

**REQ-6: Desastres con estados intermedios**
- El resultado del desastre no debe ser solo binario (sobreviviste / no sobreviviste).
- Se añaden dos estados intermedios:
  - **Dañado**: sobreviviste pero el refugio sufre daño (se reduce `shelterDefenseBoost` o `shelterLevel` temporalmente).
  - **Herido**: sobreviviste pero pierdes capacidad de Energía el día siguiente (máximo -2 puntos).
- Los umbrales para cada estado se calculan en función del ratio de recursos disponibles vs. requeridos:
  - ≥100%: supervivencia limpia.
  - 60–99%: supervivencia con estado Dañado o Herido (aleatorio).
  - 30–59%: supervivencia con ambos estados.
  - <30%: game over.
- El componente `SurvivalResult` debe mostrar el estado resultante con iconografía clara.

**REQ-7: Karma con consecuencias visibles**
- El karma debe afectar activamente el gameplay, no solo filtrar encuentros:
  - Karma ≤ -5: los NPCs de facciones `survivors` y `military` tienen 30% de probabilidad de rechazar interacción (mostrar encuentro hostil en lugar del normal).
  - Karma ≥ 5: los eventos de exploración tienen +15% de probabilidad de ser positivos.
  - Karma ≤ -8: los Forajidos (`outlaws`) ofrecen tratos exclusivos que no están disponibles con karma alto.
  - Karma ≥ 8: los Supervivientes (`survivors`) ofrecen tratos exclusivos que no están disponibles con karma bajo.
- El indicador de karma en el HUD debe mostrar un tooltip o descripción del efecto activo.

**REQ-8: Tensión dinámica entre facciones**
- Las facciones rivales deben generar eventos de tensión pasivos, sin necesidad de que el jugador haga una alianza:
  - Si la reputación con `survivors` ≥ 5 y con `outlaws` ≥ 5 simultáneamente, aparece un evento semanal de "conflicto de lealtad" que obliga a elegir a quién ayudar.
  - Si la reputación con `military` ≥ 5 y con `outlaws` ≥ 3, los encuentros con Forajidos tienen una opción adicional de "delatarlos al militar" con consecuencias.
- Estas tensiones deben registrarse en el diario automáticamente.

---

### Área 3 — Balance de Recursos

**REQ-9: Escala de recursos de ubicaciones según semana**
- Los recursos que generan las ubicaciones deben escalar con la semana actual del juego.
- Fórmula base: `valor_base * (1 + (semana - 1) * 0.15)` (escala más suave que los desastres).
- Esto aplica tanto a ubicaciones OSM como a las simuladas.
- Las ubicaciones `legendary` y `rare` escalan un 10% adicional por semana.

**REQ-10: Rebalanceo de compañeros costosos**
- El coste de mantenimiento diario de los compañeros debe revisarse para que el beneficio neto sea siempre positivo o neutro en al menos un recurso:
  - Teniente Vega: reducir coste de `fuel` de 1 a 0 (ya cobra comida y agua).
  - Todos los compañeros con `maxDuration: 2` deben subir a mínimo 3 semanas.
- El panel de compañeros debe mostrar el balance neto diario (bonus - coste) para cada compañero activo y disponible.

**REQ-11: Corrección de la misión `daily_crafter`**
- La condición de la misión `daily_crafter` debe verificar si realmente se crafteó algo ese día.
- Se añade al `GameState` un campo `craftedToday: boolean` que se pone a `true` cuando se ejecuta `CRAFT_ITEM` y se resetea a `false` en `END_DAY`.
- La condición de la misión pasa a ser `state.craftedToday === true`.

---

### Área 4 — Profundidad de Contenido

**REQ-12: Progresión del mundo entre semanas**
- Al avanzar de semana, algunas ubicaciones deben cambiar de estado:
  - 20% de las ubicaciones `common` se marcan como "agotadas" permanentemente (sin recursos, solo exploración).
  - Las ubicaciones agotadas muestran un icono diferente en el mapa (gris, con símbolo de vacío).
  - Las ubicaciones `rare` y `legendary` nunca se agotan.
- El desastre de la semana anterior debe dejar una "huella" visual: las ubicaciones del tipo más afectado por ese desastre (ej. `park` tras inundación) tienen recursos reducidos al 50% la semana siguiente.

**REQ-13: Rumores con marcadores en el mapa**
- Los rumores de tipo `hidden_supply` y `location_bonus` deben mostrar un marcador especial en el mapa.
- El marcador debe ser visualmente distinto (ej. icono de interrogación con brillo pulsante).
- Al recolectar en esa ubicación, el rumor se marca como `claimed` automáticamente.
- Los rumores de tipo `disaster_hint` deben aparecer como una entrada destacada en el HUD (similar al banner de señales de desastre existente).

**REQ-14: Diario interactivo**
- Las entradas del diario de tipo `encounter` deben mostrar un botón "Recordar" que abre el encuentro NPC original en modo solo lectura (sin opciones de elección).
- Las entradas de tipo `milestone` relacionadas con compañeros deben mostrar el estado actual del compañero (activo / expirado).
- Las entradas de tipo `disaster` deben mostrar un resumen de recursos antes/después del desastre.
- Se añade un filtro por tipo de entrada en el `JournalModal`.
