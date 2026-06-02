import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import type {
  GameState,
  GameAction,
  Resources,
  ResourceType,
  DisasterType,
  FactionReputation,
  NPCRelationship,
  CompanionInstance,
  CommunityEventRecord,
} from '../types/game';
import {
  getRandomDisaster,
  calculateDisasterDifficulty,
  getWeakenedTypesByDisaster,
  DISASTERS,
} from '../data/disasters';
import {
  getRandomDailyEvent,
  checkAchievements,
} from '../data/achievements';
import {
  getShelterLevel,
  getNextShelterLevel,
  CRAFTING_RECIPES,
} from '../data/shelter';
import { getAdjustedWeather } from '../data/weather';
import { generateWeeklyMissions } from '../data/missions';
import { generateSocialMissions, checkSocialMissionCondition } from '../data/socialMissions';
import { getAllFactionDailyBonuses, getFactionDefenseBonus, hasOutlawProtection, getAlliancePerk, getRivalFactions, ALLIANCE_RIVAL_PENALTY } from '../data/factions';
import { getCompanion } from '../data/companions';
import { updateRelationshipPoints } from '../data/relationships';
import { createRelationship } from '../data/relationships';

const DAY_DURATION_MS = 24 * 60 * 60 * 1000;

function loadSavedState(): Partial<GameState> & { highScore: number; achievements: string[] } {
  try {
    const saved = localStorage.getItem('seven_days_save');
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<GameState>;
      return {
        ...parsed,
        highScore: parsed.highScore ?? 0,
        achievements: parsed.achievements ?? [],
      };
    }
  } catch {
    // ignorar errores de parse
  }
  return { highScore: 0, achievements: [] };
}

const INITIAL_RESOURCES: Resources = {
  food: 10,
  water: 10,
  medicine: 5,
  materials: 10,
  fuel: 5,
};

const INITIAL_FACTION_REPUTATION: FactionReputation = {
  survivors: 0,
  merchants: 0,
  military: 0,
  outlaws: 0,
};

function advanceByElapsedTime(state: GameState): GameState {
  if (state.phase !== 'playing') return state;
  if (!state.dayStartTime) return { ...state, dayStartTime: Date.now() };

  const now = Date.now();
  const elapsed = now - state.dayStartTime;
  const fullDaysPassed = Math.floor(elapsed / DAY_DURATION_MS);

  if (fullDaysPassed <= 0) return state;

  let current = { ...state };

  for (let i = 0; i < fullDaysPassed; i++) {
    const nextDay = current.day + 1;

    if (nextDay === 5 && !current.predictedDisaster) {
      const disaster = getRandomDisaster(current.week);
      current = { ...current, predictedDisaster: disaster.type };
    }

    if (nextDay > 7) {
      const disasterType = current.predictedDisaster ?? getRandomDisaster(current.week).type;
      current = {
        ...current,
        day: 7,
        currentDisaster: disasterType,
        phase: 'disaster_warning',
        dailyEvent: null,
        dayStartTime: now,
      };
      break;
    }

    const dailyEvent = getRandomDailyEvent();
    let newResources = { ...current.resources };
    for (const [key, value] of Object.entries(dailyEvent.effect)) {
      newResources[key as ResourceType] = Math.max(
        0,
        newResources[key as ResourceType] + value
      );
    }

    newResources = applyDailyConsumption(newResources, current);

    // Aplicar bonus de facciones y compañeros
    const factionBonuses = getAllFactionDailyBonuses(current.factionReputation);
    for (const [key, value] of Object.entries(factionBonuses)) {
      newResources[key as ResourceType] = (newResources[key as ResourceType] ?? 0) + (value as number);
    }

    // Aplicar bonus de compañeros y su coste
    for (const comp of current.activeCompanions) {
      const companion = getCompanion(comp.companionId);
      if (companion) {
        // Bonus
        for (const [key, value] of Object.entries(companion.passiveBonus)) {
          newResources[key as ResourceType] = (newResources[key as ResourceType] ?? 0) + value;
        }
        // Coste
        for (const [key, value] of Object.entries(companion.cost)) {
          newResources[key as ResourceType] = Math.max(0, (newResources[key as ResourceType] ?? 0) - value);
        }
      }
    }

    // Protección contra saqueo de los forajidos
    if (hasOutlawProtection(current.factionReputation)) {
      // Evitar eventos negativos de saqueo
    }

    // Aplicar bonus de alianza
    newResources = applyAllianceDailyBonus(newResources, current);

    current = {
      ...current,
      day: nextDay,
      visitedLocations: [],
      resources: newResources,
      dailyEvent: null,
      dayStartTime: state.dayStartTime + DAY_DURATION_MS * (i + 1),
    };

    const newAch = checkAchievements(current);
    if (newAch.length > 0) {
      current.achievements = [
        ...current.achievements,
        ...newAch.filter((id) => !current.achievements.includes(id)),
      ];
    }
  }

  return current;
}

// ─── Alliance daily bonuses ───
function applyAllianceDailyBonus(resources: Resources, state: GameState): Resources {
  if (!state.factionAlliance) return resources;
  const perk = getAlliancePerk(state.factionAlliance);
  if (!perk) return resources;
  const newResources = { ...resources };
  for (const [key, value] of Object.entries(perk.dailyBonus)) {
    newResources[key as ResourceType] = (newResources[key as ResourceType] ?? 0) + (value as number);
  }
  return newResources;
}

function calculateSurvivalProbability(
  resources: Resources,
  required: Partial<Resources>
): number {
  const entries = Object.entries(required);
  if (entries.length === 0) return 100;

  let totalRatio = 0;
  for (const [key, value] of entries) {
    const actual = resources[key as ResourceType];
    const needed = value as number;
    totalRatio += Math.min(1, needed > 0 ? actual / needed : 1);
  }

  const averageRatio = totalRatio / entries.length;
  return Math.round(Math.pow(averageRatio, 0.5) * 100);
}

const DAILY_FOOD_COST = 2;
const DAILY_WATER_COST = 2;

function applyDailyConsumption(resources: Resources, state: GameState): Resources {
  const newResources = { ...resources };

  const shelter = getShelterLevel(state.shelterLevel);
  for (const [key, value] of Object.entries(shelter.passiveProduction)) {
    newResources[key as ResourceType] += value as number;
  }

  const foodBefore = newResources.food;
  newResources.food = Math.max(0, newResources.food - DAILY_FOOD_COST);
  const waterBefore = newResources.water;
  newResources.water = Math.max(0, newResources.water - DAILY_WATER_COST);

  if (foodBefore < DAILY_FOOD_COST) {
    newResources.materials = Math.max(0, newResources.materials - 1);
    newResources.fuel = Math.max(0, newResources.fuel - 1);
  }
  if (waterBefore < DAILY_WATER_COST) {
    newResources.medicine = Math.max(0, newResources.medicine - 1);
    newResources.fuel = Math.max(0, newResources.fuel - 1);
  }

  return newResources;
}

function buildInitialState(): GameState {
  const savedData = loadSavedState();

  if (savedData.week && savedData.day && savedData.resources && savedData.phase) {
    const restored: GameState = {
      week: savedData.week,
      day: savedData.day,
      resources: savedData.resources,
      playerLat: savedData.playerLat ?? null,
      playerLng: savedData.playerLng ?? null,
      visitedLocations: savedData.visitedLocations ?? [],
      currentDisaster: savedData.currentDisaster ?? null,
      predictedDisaster: (savedData as GameState).predictedDisaster ?? null,
      phase: savedData.phase,
      history: savedData.history ?? [],
      highScore: savedData.highScore ?? 0,
      achievements: savedData.achievements ?? [],
      dailyEvent: savedData.dailyEvent ?? null,
      karma: (savedData as any).karma ?? 0,
      currentWeather: (savedData as any).currentWeather ?? null,
      activeMissions: (savedData as any).activeMissions ?? [],
      completedMissions: (savedData as any).completedMissions ?? [],
      dayStartTime: savedData.dayStartTime ?? Date.now(),
      shelterLevel: (savedData as GameState).shelterLevel ?? 0,
      shelterDefenseBoost: (savedData as GameState).shelterDefenseBoost ?? 0,
      factionReputation: (savedData as any).factionReputation ?? { ...INITIAL_FACTION_REPUTATION },
      npcRelationships: (savedData as any).npcRelationships ?? [],
      activeCompanions: (savedData as any).activeCompanions ?? [],
      activeRumors: (savedData as any).activeRumors ?? [],
      completedRumors: (savedData as any).completedRumors ?? [],
      journalEntries: (savedData as any).journalEntries ?? [],
      communityEvents: (savedData as any).communityEvents ?? [],
      metNPCs: (savedData as any).metNPCs ?? [],
      factionAlliance: (savedData as any).factionAlliance ?? null,
      factionAllianceWeek: (savedData as any).factionAllianceWeek ?? 0,
      craftedToday: (savedData as any).craftedToday ?? false,
      energyMax: (savedData as any).energyMax ?? 5,
      energyCurrent: (savedData as any).energyCurrent ?? 5,
      injuredUntilDay: (savedData as any).injuredUntilDay ?? null,
      shelterDamaged: (savedData as any).shelterDamaged ?? false,
      depletedLocationIds: (savedData as any).depletedLocationIds ?? [],
      weakenedLocationTypes: (savedData as any).weakenedLocationTypes ?? [],
      activeFactionTensions: (savedData as any).activeFactionTensions ?? [],
    };

    return advanceByElapsedTime(restored);
  }

  // ─── Nuevo jugador: detectar día real para catch-up ───
  const now = new Date();
  // getDay(): 0=Domingo, 1=Lunes, ..., 6=Sábado
  // Lo mapeamos a días de juego: Lunes=1, ..., Sábado=6, Domingo=7
  const realWeekday = now.getDay();
  const currentGameDay = realWeekday === 0 ? 7 : realWeekday;
  const missedDays = currentGameDay - 1; // días ya pasados de esta semana

  let catchUpResources = { ...INITIAL_RESOURCES };
  let predictedDisaster: DisasterType | null = null;

  if (missedDays > 0) {
    // Bonus de catch-up por cada día perdido:
    // Simula un día conservador de exploración: +3 comida, +2 agua, +1 materiales
    // Menos consumo diario: -2 comida, -2 agua
    // Neto por día: +1 comida, 0 agua, +1 materiales
    const PER_DAY_CATCHUP: Partial<Resources> = {
      food: 3,
      water: 2,
      materials: 1,
    };

    for (let d = 0; d < missedDays; d++) {
      // Recursos de exploración simulada
      for (const [key, value] of Object.entries(PER_DAY_CATCHUP)) {
        catchUpResources[key as ResourceType] += value as number;
      }
      // Aplicar consumo diario de los días perdidos
      catchUpResources.food = Math.max(0, catchUpResources.food - DAILY_FOOD_COST);
      catchUpResources.water = Math.max(0, catchUpResources.water - DAILY_WATER_COST);
    }

    // Bonus pequeño de medicina y combustible (1 por cada 3 días perdidos)
    const rareBonus = Math.floor(missedDays / 3);
    catchUpResources.medicine += rareBonus;
    catchUpResources.fuel += rareBonus;
  }

  // Si el jugador empieza en día 5+, darle la predicción del desastre
  if (currentGameDay >= 5) {
    predictedDisaster = getRandomDisaster(1).type;
  }

  return {
    week: 1,
    day: currentGameDay,
    resources: catchUpResources,
    playerLat: null,
    playerLng: null,
    visitedLocations: [],
    currentDisaster: null,
    predictedDisaster,
    phase: 'playing',
    history: [],
    highScore: savedData.highScore,
    achievements: savedData.achievements,
    dailyEvent: null,
    dayStartTime: Date.now(),
    shelterLevel: 0,
    shelterDefenseBoost: 0,
    karma: 0,
    currentWeather: null,
    activeMissions: [],
    completedMissions: [],
    factionReputation: { ...INITIAL_FACTION_REPUTATION },
    npcRelationships: [],
    activeCompanions: [],
    activeRumors: [],
    completedRumors: [],
    journalEntries: [],
    communityEvents: [],
    metNPCs: [],
    factionAlliance: null,
    factionAllianceWeek: 0,
    craftedToday: false,
    energyMax: 5,
    energyCurrent: 5,
    injuredUntilDay: null,
    shelterDamaged: false,
    depletedLocationIds: [],
    weakenedLocationTypes: [],
    activeFactionTensions: [],
  };
}

const initialState = buildInitialState();

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_PLAYER_POSITION':
      return { ...state, playerLat: action.lat, playerLng: action.lng };

    case 'COLLECT_RESOURCES': {
      const newResources = { ...state.resources };
      for (const [key, value] of Object.entries(action.resources)) {
        newResources[key as ResourceType] += value;
      }
      // Consume 1 energy for real location visits (not events/roaming)
      const isRealVisit = !action.locationId.startsWith('roaming_') && !action.locationId.startsWith('event_') && !action.locationId.startsWith('npc_');
      const newEnergy = isRealVisit ? Math.max(0, state.energyCurrent - 1) : state.energyCurrent;
      const updated: GameState = {
        ...state,
        resources: newResources,
        visitedLocations: [...state.visitedLocations, action.locationId],
        energyCurrent: newEnergy,
      };
      const newAch = checkAchievements(updated);
      if (newAch.length > 0) {
        updated.achievements = [
          ...state.achievements,
          ...newAch.filter((id) => !state.achievements.includes(id)),
        ];
      }
      return updated;
    }

    case 'END_DAY': {
      const nextDay = state.day + 1;

      let predicted = state.predictedDisaster;
      if (nextDay === 5 && !predicted) {
        const disaster = getRandomDisaster(state.week);
        predicted = disaster.type;
      }

      if (nextDay > 7) {
        const disasterType = predicted ?? state.predictedDisaster ?? getRandomDisaster(state.week).type;
        return {
          ...state,
          day: 7,
          currentDisaster: disasterType,
          phase: 'disaster_warning',
          dailyEvent: null,
          dayStartTime: Date.now(),
          currentWeather: getAdjustedWeather(state.week, 7).type,
        };
      }

      const dailyEvent = getRandomDailyEvent();
      let newResources = { ...state.resources };

      if (action.auto) {
        for (const [key, value] of Object.entries(dailyEvent.effect)) {
          newResources[key as ResourceType] = Math.max(
            0,
            newResources[key as ResourceType] + value
          );
        }
      }

      newResources = applyDailyConsumption(newResources, state);

      // Aplicar bonus de facciones
      const factionBonuses = getAllFactionDailyBonuses(state.factionReputation);
      for (const [key, value] of Object.entries(factionBonuses)) {
        newResources[key as ResourceType] = (newResources[key as ResourceType] ?? 0) + (value as number);
      }

      // Aplicar bonus/coste de compañeros
      for (const comp of state.activeCompanions) {
        const companion = getCompanion(comp.companionId);
        if (companion) {
          for (const [key, value] of Object.entries(companion.passiveBonus)) {
            newResources[key as ResourceType] = (newResources[key as ResourceType] ?? 0) + value;
          }
          for (const [key, value] of Object.entries(companion.cost)) {
            newResources[key as ResourceType] = Math.max(0, (newResources[key as ResourceType] ?? 0) - value);
          }
        }
      }

      // Aplicar bonus de alianza
      newResources = applyAllianceDailyBonus(newResources, state);

      // Verificar misiones sociales cada día
      const socialCompleted: string[] = [];
      for (const missionId of state.activeMissions) {
        if (checkSocialMissionCondition(missionId, state)) {
          socialCompleted.push(missionId);
        }
      }

      // Calcular energía máxima (base 5, reducida si herido)
      const isInjured = state.injuredUntilDay !== null && nextDay <= state.injuredUntilDay;
      const newEnergyMax = isInjured ? Math.max(1, state.energyMax - 2) : state.energyMax;
      // Limpiar lesión si ya pasó
      const newInjuredUntilDay = (state.injuredUntilDay !== null && nextDay > state.injuredUntilDay) ? null : state.injuredUntilDay;

      const updated: GameState = {
        ...state,
        day: nextDay,
        visitedLocations: [],
        resources: newResources,
        predictedDisaster: predicted,
        dailyEvent: action.auto ? null : dailyEvent,
        dayStartTime: Date.now(),
        currentWeather: getAdjustedWeather(state.week, nextDay).type,
        activeMissions: state.activeMissions.filter((m) => !socialCompleted.includes(m)),
        completedMissions: [...state.completedMissions, ...socialCompleted],
        craftedToday: false,
        energyMax: newEnergyMax,
        energyCurrent: newEnergyMax,
        injuredUntilDay: newInjuredUntilDay,
      };

      const newAch = checkAchievements(updated);
      if (newAch.length > 0) {
        updated.achievements = [
          ...state.achievements,
          ...newAch.filter((id) => !state.achievements.includes(id)),
        ];
      }
      return updated;
    }

    case 'TRIGGER_DAILY_EVENT': {
      const newResources = { ...state.resources };
      for (const [key, value] of Object.entries(action.event.effect)) {
        newResources[key as ResourceType] = Math.max(
          0,
          newResources[key as ResourceType] + value
        );
      }
      return {
        ...state,
        resources: newResources,
        dailyEvent: null,
      };
    }

    case 'TRIGGER_DISASTER':
      return {
        ...state,
        currentDisaster: action.disaster,
        phase: 'disaster_event',
      };

    case 'APPLY_DISASTER_RESULT': {
      const newResources = { ...state.resources };
      if (action.survived) {
        for (const [key, value] of Object.entries(action.penalty)) {
          newResources[key as ResourceType] = Math.max(
            0,
            newResources[key as ResourceType] - value
          );
        }

        // Calcular outcome intermedio basado en ratio de recursos
        const disaster = DISASTERS.find(d => d.type === state.currentDisaster);
        let outcome: 'clean' | 'damaged' | 'injured' | 'both' = 'clean';
        if (disaster) {
          const required = disaster.requiredResources;
          const entries = Object.entries(required);
          if (entries.length > 0) {
            let totalRatio = 0;
            for (const [key, value] of entries) {
              const actual = state.resources[key as ResourceType] ?? 0;
              const needed = value as number;
              totalRatio += Math.min(1, needed > 0 ? actual / needed : 1);
            }
            const avgRatio = totalRatio / entries.length;
            if (avgRatio < 0.3) outcome = 'both';
            else if (avgRatio < 0.6) outcome = Math.random() < 0.5 ? 'damaged' : 'injured';
            else outcome = 'clean';
          }
        }

        // Aplicar efectos del outcome
        const newShelterLevel = (outcome === 'damaged' || outcome === 'both') ? Math.max(0, state.shelterLevel - 1) : state.shelterLevel;
        const newShelterDamaged = outcome === 'damaged' || outcome === 'both';
        const newInjuredUntilDay = (outcome === 'injured' || outcome === 'both') ? 2 : null; // herido hasta día 2 de la siguiente semana

        const newHighScore = Math.max(state.highScore, state.week);
        const outcomeIcon = outcome === 'clean' ? '🏆' : outcome === 'damaged' ? '🏚️' : outcome === 'injured' ? '🩹' : '💔';
        const outcomeText = outcome === 'clean'
          ? `Sobreviví al desastre de la semana ${state.week} sin daños.`
          : outcome === 'damaged'
          ? `Sobreviví al desastre de la semana ${state.week}, pero el refugio quedó dañado.`
          : outcome === 'injured'
          ? `Sobreviví al desastre de la semana ${state.week}, pero salí herido.`
          : `Sobreviví al desastre de la semana ${state.week}, pero el refugio quedó dañado y salí herido.`;

        const updatedState: GameState = {
          ...state,
          resources: newResources,
          phase: 'survival_result',
          highScore: newHighScore,
          shelterLevel: newShelterLevel,
          shelterDamaged: newShelterDamaged,
          injuredUntilDay: newInjuredUntilDay,
          history: [
            ...state.history,
            {
              week: state.week,
              disaster: state.currentDisaster!,
              survived: true,
              resourcesBefore: state.resources,
              resourcesAfter: newResources,
              outcome,
            },
          ],
          journalEntries: [
            ...state.journalEntries,
            {
              id: 'disaster_survived_' + state.week + '_' + Date.now(),
              week: state.week,
              day: 7,
              text: outcomeText,
              icon: outcomeIcon,
              type: 'disaster',
            },
          ],
        };

        const newAchievements = checkAchievements(updatedState, {
          survived: true,
          penalty: action.penalty as unknown as Record<string, number>,
          resourcesBefore: state.resources as unknown as Record<string, number>,
        });
        if (newAchievements.length > 0) {
          updatedState.achievements = [
            ...state.achievements,
            ...newAchievements.filter(
              (id) => !state.achievements.includes(id)
            ),
          ];
        }
        return updatedState;
      } else {
        const updatedStateFail: GameState = {
          ...state,
          phase: 'survival_result',
          highScore: Math.max(state.highScore, state.week - 1),
          history: [
            ...state.history,
            {
              week: state.week,
              disaster: state.currentDisaster!,
              survived: false,
              resourcesBefore: state.resources,
              resourcesAfter: state.resources,
            },
          ],
        };

        const newAchievements = checkAchievements(updatedStateFail);
        if (newAchievements.length > 0) {
          updatedStateFail.achievements = [
            ...state.achievements,
            ...newAchievements.filter(
              (id) => !state.achievements.includes(id)
            ),
          ];
        }
        return updatedStateFail;
      }
    }

    case 'UPGRADE_SHELTER': {
      const nextLevel = getNextShelterLevel(state.shelterLevel);
      if (!nextLevel) return state;

      const canAfford = Object.entries(nextLevel.cost).every(
        ([key, value]) => state.resources[key as ResourceType] >= (value as number)
      );
      if (!canAfford) return state;

      const newResources = { ...state.resources };
      for (const [key, value] of Object.entries(nextLevel.cost)) {
        newResources[key as ResourceType] = Math.max(0, newResources[key as ResourceType] - (value as number));
      }

      const newLevel = state.shelterLevel + 1;
      // Al llegar a nivel 3, aumentar energía máxima
      const energyMaxUpgrade = (newLevel >= 3 && state.energyMax < 6) ? state.energyMax + 1 : state.energyMax;

      return {
        ...state,
        shelterLevel: newLevel,
        resources: newResources,
        energyMax: energyMaxUpgrade,
        energyCurrent: Math.min(state.energyCurrent, energyMaxUpgrade),
      };
    }

    case 'CRAFT_ITEM': {
      const recipe = CRAFTING_RECIPES.find((r) => r.id === action.recipeId);
      if (!recipe) return state;

      if (state.shelterLevel < recipe.minShelterLevel) return state;

      const canAfford = Object.entries(recipe.cost).every(
        ([key, value]) => state.resources[key as ResourceType] >= (value as number)
      );
      if (!canAfford) return state;

      const newResources = { ...state.resources };
      for (const [key, value] of Object.entries(recipe.cost)) {
        newResources[key as ResourceType] = Math.max(0, newResources[key as ResourceType] - (value as number));
      }
      if (recipe.result.resources) {
        for (const [key, value] of Object.entries(recipe.result.resources)) {
          newResources[key as ResourceType] += value as number;
        }
      }

      // Aumentar energyMax al llegar a nivel 3 de refugio
      const newShelterLevel = state.shelterLevel; // no cambia en craft
      const newEnergyMaxCraft = (newShelterLevel >= 3 && state.energyMax < 6) ? state.energyMax + 1 : state.energyMax;

      return {
        ...state,
        resources: newResources,
        shelterDefenseBoost: state.shelterDefenseBoost + (recipe.result.defenseBoost ?? 0),
        craftedToday: true,
        energyMax: newEnergyMaxCraft,
      };
    }

    case 'UNLOCK_ACHIEVEMENT':
      if (state.achievements.includes(action.achievementId)) return state;
      return {
        ...state,
        achievements: [...state.achievements, action.achievementId],
      };

    case 'ADVANCE_WEEK': {
      const karmaMultiplier = 1 + state.karma / 20;
      const bonus: Partial<Resources> = {
        food: Math.round((5 + state.week * 2) * karmaMultiplier),
        water: Math.round((5 + state.week * 2) * karmaMultiplier),
        materials: Math.round((3 + state.week) * karmaMultiplier),
      };
      const newResources = { ...state.resources };
      for (const [key, value] of Object.entries(bonus)) {
        newResources[key as ResourceType] += value;
      }

      // Expirar rumores viejos
      const expiredRumorIds = state.activeRumors
        .filter((r) => r.expiresWeek > 0 && r.expiresWeek < state.week + 1)
        .map((r) => r.id);

      // Reducir semanas de compañeros
      const updatedCompanions = state.activeCompanions
        .map((c) => ({ ...c, weeksRemaining: c.weeksRemaining - 1 }))
        .filter((c) => c.weeksRemaining > 0);

      // Generar misiones sociales + normales
      const socialMissionIds = generateSocialMissions(state.week + 1);
      const normalMissionIds = generateWeeklyMissions(state.week + 1);

      // Calcular ubicaciones agotadas (20% de las common visitadas)
      const visitedCommonIds = state.visitedLocations.filter(
        id => !id.startsWith('roaming_') && !id.startsWith('event_') && !id.startsWith('npc_')
      );
      const toDeplete = visitedCommonIds.slice(0, Math.max(0, Math.floor(visitedCommonIds.length * 0.2)));
      const newDepletedIds = [...new Set([...state.depletedLocationIds, ...toDeplete])];

      // Calcular tipos debilitados por el desastre de esta semana
      const newWeakenedTypes = getWeakenedTypesByDisaster(state.currentDisaster);

      // Detectar tensiones entre facciones
      const rep = state.factionReputation;
      const newTensions = [...state.activeFactionTensions];
      if (rep.survivors >= 5 && rep.outlaws >= 5) {
        const tensionId = 'survivors_outlaws_' + (state.week + 1);
        if (!newTensions.find(t => t.id === tensionId)) {
          newTensions.push({ id: tensionId, factionA: 'survivors', factionB: 'outlaws', weekStarted: state.week + 1 });
        }
      }
      if (rep.military >= 5 && rep.outlaws >= 3) {
        const tensionId = 'military_outlaws_' + (state.week + 1);
        if (!newTensions.find(t => t.id === tensionId)) {
          newTensions.push({ id: tensionId, factionA: 'military', factionB: 'outlaws', weekStarted: state.week + 1 });
        }
      }

      return {
        ...state,
        week: state.week + 1,
        day: 1,
        resources: newResources,
        visitedLocations: [],
        currentDisaster: null,
        predictedDisaster: null,
        shelterDefenseBoost: 0,
        shelterDamaged: false,
        phase: 'playing',
        dayStartTime: Date.now(),
        currentWeather: getAdjustedWeather(state.week + 1, 1).type,
        activeMissions: [...normalMissionIds, ...socialMissionIds],
        completedMissions: [],
        activeRumors: state.activeRumors.filter((r) => !expiredRumorIds.includes(r.id)),
        completedRumors: [...state.completedRumors, ...expiredRumorIds],
        activeCompanions: updatedCompanions,
        craftedToday: false,
        energyCurrent: state.energyMax,
        depletedLocationIds: newDepletedIds,
        weakenedLocationTypes: newWeakenedTypes,
        activeFactionTensions: newTensions,
      };
    }

    case 'RESET_GAME':
      return {
        ...initialState,
        highScore: state.highScore,
        achievements: state.achievements,
        predictedDisaster: null,
        shelterLevel: 0,
        shelterDefenseBoost: 0,
        dayStartTime: Date.now(),
        karma: 0,
        currentWeather: null,
        activeMissions: [],
        completedMissions: [],
        factionReputation: { ...INITIAL_FACTION_REPUTATION },
        npcRelationships: [],
        activeCompanions: [],
        activeRumors: [],
        completedRumors: [],
        journalEntries: [],
        communityEvents: [],
        metNPCs: [],
        factionAlliance: null,
        factionAllianceWeek: 0,
              craftedToday: false,
        energyMax: 5,
        energyCurrent: 5,
        injuredUntilDay: null,
        shelterDamaged: false,
        depletedLocationIds: [],
        weakenedLocationTypes: [],
        activeFactionTensions: [],
      };

    case 'SET_WEATHER':
      return { ...state, currentWeather: action.weather };

    case 'SET_KARMA':
      return { ...state, karma: Math.max(-10, Math.min(10, action.karma)) };

    case 'COMPLETE_MISSION':
      return {
        ...state,
        activeMissions: state.activeMissions.filter((m) => m !== action.missionId),
        completedMissions: [...state.completedMissions, action.missionId],
      };

    case 'ADD_MISSIONS':
      return {
        ...state,
        activeMissions: [...state.activeMissions, ...action.missionIds],
      };

    // ─── Nuevas acciones sociales ───

    case 'CHANGE_FACTION_REPUTATION': {
      const currentRep = state.factionReputation[action.factionId] ?? 0;
      const newRep = Math.max(-10, Math.min(10, currentRep + action.amount));
      return {
        ...state,
        factionReputation: {
          ...state.factionReputation,
          [action.factionId]: newRep,
        },
      };
    }

    case 'UPDATE_NPC_RELATIONSHIP': {
      const existing = state.npcRelationships.find((r) => r.npcId === action.npcId);
      let updatedRelationships: NPCRelationship[];

      if (existing) {
        updatedRelationships = state.npcRelationships.map((r) =>
          r.npcId === action.npcId
            ? updateRelationshipPoints(r, action.points, state.week)
            : r
        );
      } else {
        const newRel = createRelationship(
          action.npcId,
          action.name,
          action.icon,
          action.factionId,
          action.locationTypes,
          Math.max(0, 5 + action.points) // base + change
        );
        updatedRelationships = [...state.npcRelationships, newRel];
      }

      return { ...state, npcRelationships: updatedRelationships };
    }

    case 'RECRUIT_COMPANION': {
      const companion = getCompanion(action.companionId);
      if (!companion) return state;

      // Ya está reclutado?
      if (state.activeCompanions.find((c) => c.companionId === action.companionId)) return state;

      const instance: CompanionInstance = {
        companionId: action.companionId,
        recruitedWeek: state.week,
        weeksRemaining: companion.maxDuration,
      };

      return {
        ...state,
        activeCompanions: [...state.activeCompanions, instance],
        journalEntries: [
          ...state.journalEntries,
          {
            id: 'companion_' + action.companionId + '_' + Date.now(),
            week: state.week,
            day: state.day,
            text: `${companion.name} se unió como compañero${companion.icon ? '' : ''}.`,
            icon: companion.icon,
            type: 'milestone',
          },
        ],
      };
    }

    case 'DISMISS_COMPANION': {
      const companion = getCompanion(action.companionId);
      return {
        ...state,
        activeCompanions: state.activeCompanions.filter((c) => c.companionId !== action.companionId),
        ...(companion ? {
          journalEntries: [
            ...state.journalEntries,
            {
              id: 'dismiss_' + action.companionId + '_' + Date.now(),
              week: state.week,
              day: state.day,
              text: `${companion.name} dejó el grupo.`,
              icon: '👋',
              type: 'milestone',
            },
          ],
        } : {}),
      };
    }

    case 'ADD_RUMOR': {
      if (state.activeRumors.find((r) => r.id === action.rumor.id)) return state;
      if (state.completedRumors.includes(action.rumor.id)) return state;
      return {
        ...state,
        activeRumors: [...state.activeRumors, action.rumor],
      };
    }

    case 'CLAIM_RUMOR': {
      const rumor = state.activeRumors.find((r) => r.id === action.rumorId);
      if (!rumor) return state;

      const newResources = { ...state.resources };
      if (rumor.effect) {
        for (const [key, value] of Object.entries(rumor.effect)) {
          newResources[key as ResourceType] = (newResources[key as ResourceType] ?? 0) + (value as number);
        }
      }

      return {
        ...state,
        resources: newResources,
        activeRumors: state.activeRumors.filter((r) => r.id !== action.rumorId),
        completedRumors: [...state.completedRumors, action.rumorId],
      };
    }

    case 'EXPIRE_RUMORS': {
      const expired = state.activeRumors.filter(
        (r) => r.expiresWeek > 0 && r.expiresWeek <= action.currentWeek
      );
      return {
        ...state,
        activeRumors: state.activeRumors.filter((r) => !expired.includes(r)),
        completedRumors: [...state.completedRumors, ...expired.map((r) => r.id)],
      };
    }

    case 'ADD_JOURNAL_ENTRY': {
      if (state.journalEntries.find((e) => e.id === action.entry.id)) return state;
      return {
        ...state,
        journalEntries: [...state.journalEntries, action.entry],
      };
    }

    case 'RECORD_COMMUNITY_EVENT': {
      const record: CommunityEventRecord = {
        eventId: action.eventId,
        week: state.week,
        chosenOption: action.chosenOption,
      };
      return {
        ...state,
        communityEvents: [...state.communityEvents, record],
      };
    }

    case 'ADD_MET_NPC': {
      if (state.metNPCs.includes(action.npcId)) return state;
      return {
        ...state,
        metNPCs: [...state.metNPCs, action.npcId],
      };
    }

    case 'UPDATE_COMPANION_WEEKS': {
      return {
        ...state,
        activeCompanions: state.activeCompanions
          .map((c) => ({ ...c, weeksRemaining: c.weeksRemaining - 1 }))
          .filter((c) => c.weeksRemaining > 0),
      };
    }

    case 'ALLY_WITH_FACTION': {
      // Solo una alianza a la vez
      if (state.factionAlliance) return state;
      const currentRep = state.factionReputation[action.factionId] ?? 0;
      if (currentRep < 7) return state;

      // Enfriamiento tras romper alianza
      if (state.factionAllianceWeek > 0 && (state.week - state.factionAllianceWeek) < 2) return state;

      // Penalizar facciones rivales
      const rivals = getRivalFactions(action.factionId);
      const newRep = { ...state.factionReputation };
      for (const rivalId of rivals) {
        newRep[rivalId] = Math.max(-10, (newRep[rivalId] ?? 0) + ALLIANCE_RIVAL_PENALTY);
      }

      const perk = getAlliancePerk(action.factionId);
      return {
        ...state,
        factionAlliance: action.factionId,
        factionAllianceWeek: state.week,
        factionReputation: newRep,
        journalEntries: [
          ...state.journalEntries,
          {
            id: 'alliance_' + action.factionId + '_' + Date.now(),
            week: state.week,
            day: state.day,
            text: `Juré lealtad a ${perk?.name ?? action.factionId}.`,
            icon: perk?.icon ?? '🤝',
            type: 'milestone',
          },
        ],
      };
    }

    case 'BREAK_ALLIANCE': {
      if (!state.factionAlliance) return state;
      const oldAlliance = state.factionAlliance;
      const perk = getAlliancePerk(oldAlliance);
      return {
        ...state,
        factionAlliance: null,
        factionAllianceWeek: state.week, // registra la semana para cooldown
        journalEntries: [
          ...state.journalEntries,
          {
            id: 'break_alliance_' + Date.now(),
            week: state.week,
            day: state.day,
            text: `Rompí mi alianza con ${perk?.name ?? oldAlliance}.`,
            icon: '💔',
            type: 'milestone',
          },
        ],
      };
    }

    case 'USE_ENERGY':
      return { ...state, energyCurrent: Math.max(0, state.energyCurrent - action.amount) };

    case 'RESTORE_ENERGY':
      return { ...state, energyCurrent: Math.min(state.energyMax, state.energyCurrent + action.amount) };

    default:
      return state;
  }
}

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  collectResources: (
    locationId: string,
    resources: Partial<Resources>
  ) => void;
  endDay: () => void;
  advanceWeek: () => void;
  resetGame: () => void;
  checkSurvival: (disaster: DisasterType) => {
    survived: boolean;
    required: Partial<Resources>;
    scaled: Partial<Resources>;
    probability: number;
    shelterDefense: number;
  };
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    localStorage.setItem('seven_days_save', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (state.phase !== 'playing') return;

    timerRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = now - state.dayStartTime;

      if (elapsed >= DAY_DURATION_MS) {
        dispatch({ type: 'END_DAY', auto: true });
      }
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [state.phase, state.dayStartTime, state.day]);

  const collectResources = useCallback(
    (locationId: string, resources: Partial<Resources>) => {
      dispatch({ type: 'COLLECT_RESOURCES', locationId, resources });
    },
    []
  );

  const endDay = useCallback(() => {
    dispatch({ type: 'END_DAY' });
  }, []);

  const advanceWeek = useCallback(() => {
    dispatch({ type: 'ADVANCE_WEEK' });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  const checkSurvival = useCallback(
    (disaster: DisasterType) => {
      const disasterDef = DISASTERS.find((d) => d.type === disaster);
      if (!disasterDef)
        return { survived: false, required: {}, scaled: {}, probability: 0, shelterDefense: 0 };

      const scaled = calculateDisasterDifficulty(
        disasterDef.requiredResources,
        state.week
      );

      const probability = calculateSurvivalProbability(state.resources, scaled);

      const shelter = getShelterLevel(state.shelterLevel);
      let defenseTotal = shelter.defenseBonus + state.shelterDefenseBoost;

      // Bonus de defensa de facción militar
      defenseTotal += getFactionDefenseBonus(state.factionReputation);

      // Bonus de defensa de compañeros
      for (const comp of state.activeCompanions) {
        const companion = getCompanion(comp.companionId);
        if (companion) {
          defenseTotal += companion.defenseBonus;
        }
      }

      // Bonus de defensa de alianza
      if (state.factionAlliance) {
        const alliancePerk = getAlliancePerk(state.factionAlliance);
        if (alliancePerk) {
          defenseTotal += alliancePerk.defenseBonus;
        }
      }

      const karmaBonus = state.karma * 2;

      const finalProbability = Math.min(100, Math.max(0, probability + defenseTotal + karmaBonus));

      const survived = finalProbability >= 100;

      return {
        survived,
        required: disasterDef.requiredResources,
        scaled,
        probability: finalProbability,
        shelterDefense: defenseTotal,
      };
    },
    [state.resources, state.week, state.shelterLevel, state.shelterDefenseBoost, state.karma, state.factionReputation, state.activeCompanions, state.factionAlliance]
  );

  return (
    <GameContext.Provider
      value={{
        state,
        dispatch,
        collectResources,
        endDay,
        advanceWeek,
        resetGame,
        checkSurvival,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextType {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return ctx;
}
