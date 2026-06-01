import type { WeatherType } from '../types/game';
import { getWeather } from '../data/weather';

interface Props {
  weatherType: WeatherType;
}

const BORDER_COLORS: Record<WeatherType, string> = {
  sunny: 'border-amber-500/30',
  cloudy: 'border-gray-500/30',
  rainy: 'border-blue-600/30',
  foggy: 'border-slate-500/30',
  stormy: 'border-purple-600/30',
};

const ICON_BG: Record<WeatherType, string> = {
  sunny: 'bg-amber-500/15',
  cloudy: 'bg-gray-500/15',
  rainy: 'bg-blue-600/15',
  foggy: 'bg-slate-500/15',
  stormy: 'bg-purple-600/15',
};

const TEXT_COLORS: Record<WeatherType, string> = {
  sunny: 'text-amber-300',
  cloudy: 'text-gray-300',
  rainy: 'text-blue-300',
  foggy: 'text-slate-300',
  stormy: 'text-purple-300',
};

export default function WeatherBanner({ weatherType }: Props) {
  const weather = getWeather(weatherType);

  return (
    <div
      className={`mx-3 mb-1.5 px-3 py-2 rounded-2xl glass-card ${BORDER_COLORS[weatherType]} flex items-center gap-3 animate-slide-up text-xs`}
      title={weather.description}
    >
      <div className={`w-9 h-9 rounded-xl ${ICON_BG[weatherType]} flex items-center justify-center text-base shrink-0`}>
        {weather.icon}
      </div>
      <div className="flex-1 min-w-0">
        <span className={`font-bold ${TEXT_COLORS[weatherType]}`}>{weather.name}</span>
        <span className="text-white/40 ml-2 truncate">{weather.description}</span>
      </div>
      {weather.resourceMultiplier !== 1.0 && (
        <span className={`text-[10px] font-mono whitespace-nowrap px-2 py-1 rounded-lg ${
          weather.resourceMultiplier < 1
            ? 'bg-red-500/10 text-red-300'
            : 'bg-emerald-500/10 text-emerald-300'
        }`}>
          {weather.resourceMultiplier < 1 ? '⬇' : '⬆'} {Math.round(weather.resourceMultiplier * 100)}%
        </span>
      )}
    </div>
  );
}
