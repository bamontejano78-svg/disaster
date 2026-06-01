import type { Weather, WeatherType } from '../types/game';

const WEATHERS: Record<WeatherType, Omit<Weather, 'type'>> = {
  sunny: {
    name: 'Despejado',
    icon: '☀️',
    description: 'Cielo despejado. Condiciones ideales para explorar.',
    resourceMultiplier: 1.2,
    locationVisibility: 1.0,
    explorationEventBonus: 0.05,
  },
  cloudy: {
    name: 'Nublado',
    icon: '☁️',
    description: 'Cielo cubierto. Sin lluvia por ahora.',
    resourceMultiplier: 1.0,
    locationVisibility: 0.9,
    explorationEventBonus: 0.0,
  },
  rainy: {
    name: 'Lluvioso',
    icon: '🌧️',
    description: 'Lluvia constante. El barro dificulta la exploración.',
    resourceMultiplier: 0.75,
    locationVisibility: 0.7,
    explorationEventBonus: -0.05,
  },
  foggy: {
    name: 'Niebla',
    icon: '🌫️',
    description: 'Niebla espesa. Apenas se ve a unos metros.',
    resourceMultiplier: 0.6,
    locationVisibility: 0.4,
    explorationEventBonus: 0.1, // misterio = más eventos
  },
  stormy: {
    name: 'Tormenta',
    icon: '⛈️',
    description: 'Tormenta eléctrica. Muy peligroso salir.',
    resourceMultiplier: 0.4,
    locationVisibility: 0.3,
    explorationEventBonus: -0.15,
  },
};

const WEATHER_WEIGHTS: Record<WeatherType, number> = {
  sunny: 30,
  cloudy: 30,
  rainy: 20,
  foggy: 12,
  stormy: 8,
};

const ALL_WEATHERS: WeatherType[] = ['sunny', 'cloudy', 'rainy', 'foggy', 'stormy'];

export function getWeather(weatherType: WeatherType): Weather {
  return { type: weatherType, ...WEATHERS[weatherType] };
}

export function getDailyWeather(week: number, day: number): Weather {
  const seed = week * 7 + day;
  const pseudoRandom = ((seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;

  // Weighted random selection
  let totalWeight = 0;
  const weights = ALL_WEATHERS.map(w => WEATHER_WEIGHTS[w] || 10);
  totalWeight = weights.reduce((a, b) => a + b, 0);

  let roll = pseudoRandom * totalWeight;
  for (let i = 0; i < ALL_WEATHERS.length; i++) {
    roll -= weights[i];
    if (roll <= 0) {
      return { type: ALL_WEATHERS[i], ...WEATHERS[ALL_WEATHERS[i]] };
    }
  }

  return { type: 'cloudy', ...WEATHERS.cloudy };
}

// Week-based modifier: later weeks are harder (more storms, less sun)
export function getAdjustedWeather(week: number, day: number): Weather {
  const base = getDailyWeather(week, day);

  // After week 3, gradually worsen weather
  if (week >= 3 && base.type === 'sunny') {
    const worsenRoll = ((week * 13 + day * 7) & 0x7fffffff) / 0x7fffffff;
    if (worsenRoll < 0.3 * (week - 2)) {
      return { type: 'cloudy', ...WEATHERS.cloudy };
    }
  }

  if (week >= 4 && base.type === 'cloudy') {
    const worsenRoll = ((week * 17 + day * 11) & 0x7fffffff) / 0x7fffffff;
    if (worsenRoll < 0.25 * (week - 3)) {
      return { type: 'rainy', ...WEATHERS.rainy };
    }
  }

  return base;
}

export function getWeatherForecast(week: number, currentDay: number): { today: Weather; tomorrow: Weather | null } {
  const today = getAdjustedWeather(week, currentDay);
  const tomorrow = currentDay < 7 ? getAdjustedWeather(week, currentDay + 1) : null;
  return { today, tomorrow };
}
