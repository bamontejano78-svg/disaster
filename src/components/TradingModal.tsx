import { useState, useCallback, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { RESOURCE_LABELS, RESOURCE_ICONS, RESOURCE_COLORS } from '../types/game';
import type { ResourceType } from '../types/game';

interface Props {
  onClose: () => void;
}

const TRADE_RATES: { from: ResourceType; to: ResourceType; rate: number; icon: string }[] = [
  { from: 'food', to: 'water', rate: 1.2, icon: '🍖→💧' },
  { from: 'food', to: 'medicine', rate: 0.5, icon: '🍖→💊' },
  { from: 'food', to: 'materials', rate: 0.7, icon: '🍖→🪓' },
  { from: 'food', to: 'fuel', rate: 0.4, icon: '🍖→⛽' },
  { from: 'water', to: 'food', rate: 0.8, icon: '💧→🍖' },
  { from: 'water', to: 'medicine', rate: 0.4, icon: '💧→💊' },
  { from: 'water', to: 'materials', rate: 0.6, icon: '💧→🪓' },
  { from: 'water', to: 'fuel', rate: 0.3, icon: '💧→⛽' },
  { from: 'materials', to: 'food', rate: 1.5, icon: '🪓→🍖' },
  { from: 'materials', to: 'water', rate: 1.5, icon: '🪓→💧' },
  { from: 'materials', to: 'medicine', rate: 0.8, icon: '🪓→💊' },
  { from: 'materials', to: 'fuel', rate: 0.6, icon: '🪓→⛽' },
  { from: 'fuel', to: 'food', rate: 2.0, icon: '⛽→🍖' },
  { from: 'fuel', to: 'water', rate: 2.5, icon: '⛽→💧' },
  { from: 'fuel', to: 'medicine', rate: 1.5, icon: '⛽→💊' },
  { from: 'fuel', to: 'materials', rate: 1.5, icon: '⛽→🪓' },
  { from: 'medicine', to: 'food', rate: 3.0, icon: '💊→🍖' },
  { from: 'medicine', to: 'water', rate: 3.0, icon: '💊→💧' },
  { from: 'medicine', to: 'materials', rate: 2.0, icon: '💊→🪓' },
  { from: 'medicine', to: 'fuel', rate: 1.5, icon: '💊→⛽' },
];

export default function TradingModal({ onClose }: Props) {
  const { state, dispatch } = useGame();
  const [fromResource, setFromResource] = useState<ResourceType>('food');
  const [toResource, setToResource] = useState<ResourceType>('materials');
  const [amount, setAmount] = useState(1);
  const [tradeMessage, setTradeMessage] = useState<string | null>(null);

  const availableRates = TRADE_RATES.filter((r) => r.from === fromResource);
  const selectedRate = availableRates.find((r) => r.to === toResource);
  const rate = selectedRate?.rate ?? 1;

  const merchantRep = state.factionReputation.merchants ?? 0;
  // Mercaderes mejoran los ratios (+3% por nivel de reputación)
  const adjustedRate = rate * (1 + merchantRep * 0.03);

  const cost = amount;
  const gain = Math.floor(amount * adjustedRate);
  const canAfford = state.resources[fromResource] >= cost && cost > 0 && gain > 0;

  const handleTrade = useCallback(() => {
    if (!canAfford) return;

    const effect: Partial<Record<ResourceType, number>> = {};
    effect[fromResource] = -cost;
    effect[toResource] = gain;

    dispatch({
      type: 'COLLECT_RESOURCES',
      locationId: 'trade_ui',
      resources: effect,
    });

    setTradeMessage(
      `¡Intercambiaste ${cost} ${RESOURCE_LABELS[fromResource]} por ${gain} ${RESOURCE_LABELS[toResource]}!`
    );
    setTimeout(() => setTradeMessage(null), 2000);
  }, [canAfford, fromResource, toResource, cost, gain, dispatch]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Siempre mantener un par válido
  useEffect(() => {
    if (fromResource === toResource) {
      setToResource(fromResource === 'food' ? 'materials' : 'food');
    }
  }, [fromResource, toResource]);

  // Ajustar availableRates cuando cambia fromResource
  const validToResources = availableRates.map((r) => r.to);
  useEffect(() => {
    if (!validToResources.includes(toResource)) {
      setToResource(validToResources[0] ?? 'food');
    }
  }, [fromResource]);

  return (
    <div className="fixed inset-0 z-[4000] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-600/40 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl shadow-gray-900/50 animate-zoom-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center text-lg border border-amber-500/20">
              ⚖️
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Trueque</h2>
              <p className="text-[10px] text-gray-500">
                Rep. mercaderes: {merchantRep}/10
                {merchantRep >= 3 && ' · Mejores precios'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all duration-200 text-sm border border-white/5"
          >
            ✕
          </button>
        </div>

        {/* Trade UI */}
        <div className="space-y-4">
          {/* From resource */}
          <div>
            <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">
              Das
            </label>
            <div className="flex gap-2">
              <select
                value={fromResource}
                onChange={(e) => setFromResource(e.target.value as ResourceType)}
                className="flex-1 bg-gray-800 border border-gray-600/40 rounded-xl px-3 py-2 text-sm text-white"
              >
                {Object.entries(RESOURCE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {RESOURCE_ICONS[key as ResourceType]} {label} (tienes: {state.resources[key as ResourceType]})
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                max={state.resources[fromResource]}
                value={amount}
                onChange={(e) => setAmount(Math.max(1, Math.min(state.resources[fromResource], parseInt(e.target.value) || 1)))}
                className="w-16 bg-gray-800 border border-gray-600/40 rounded-xl px-2 py-2 text-sm text-white text-center"
              />
            </div>
            {/* Quick amount buttons */}
            <div className="flex gap-1 mt-1">
              {[1, 2, 5, Math.min(10, state.resources[fromResource])].map((n) => (
                <button
                  key={n}
                  onClick={() => setAmount(n)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] border transition-all ${
                    amount === n
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                      : 'bg-gray-800/50 border-gray-600/20 text-gray-400 hover:border-gray-500/40'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setAmount(Math.min(state.resources[fromResource], state.resources[fromResource]))}
                className="px-2 py-0.5 rounded-lg text-[10px] bg-red-500/10 border border-red-500/20 text-red-400 hover:border-red-500/40"
              >
                MAX
              </button>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center text-2xl text-gray-500">⬇</div>

          {/* To resource */}
          <div>
            <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">
              Recibes
            </label>
            <select
              value={toResource}
              onChange={(e) => setToResource(e.target.value as ResourceType)}
              className="w-full bg-gray-800 border border-gray-600/40 rounded-xl px-3 py-2 text-sm text-white"
            >
              {availableRates.map((r) => (
                <option key={r.to} value={r.to}>
                  {r.icon} {RESOURCE_LABELS[r.to]} · Ratio: {adjustedRate.toFixed(1)}x
                </option>
              ))}
            </select>
          </div>

          {/* Summary */}
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Coste:</span>
              <span className="text-white font-bold font-mono" style={{ color: RESOURCE_COLORS[fromResource] }}>
                -{cost} {RESOURCE_LABELS[fromResource]}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-400">Ganancia:</span>
              <span className="text-white font-bold font-mono" style={{ color: RESOURCE_COLORS[toResource] }}>
                +{gain} {RESOURCE_LABELS[toResource]}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] mt-2 text-gray-500">
              <span>Ratio efectivo: {adjustedRate.toFixed(2)}x</span>
              <span>{merchantRep >= 3 ? '✨ Precio amigo' : ''}</span>
            </div>
          </div>

          {/* Trade message */}
          {tradeMessage && (
            <div className="bg-emerald-900/30 border border-emerald-500/40 rounded-xl p-3 text-sm text-emerald-300 text-center animate-fade-in">
              {tradeMessage}
            </div>
          )}

          {/* Action buttons */}
          <button
            onClick={handleTrade}
            disabled={!canAfford}
            className={`w-full py-3 rounded-xl font-bold transition-all duration-200 text-sm ${
              canAfford
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/20 active:scale-95'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            {canAfford ? 'Realizar trueque' : 'No tienes suficiente'}
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/70 font-bold transition-all duration-200 text-xs border border-white/5"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
