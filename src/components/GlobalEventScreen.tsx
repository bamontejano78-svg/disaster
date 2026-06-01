import { useState, useEffect } from 'react';
import type { GlobalEventInfo } from '../types/game';
import { getCurrentGlobalEvent, getUnlockedCosmetics, saveUnlockedCosmetic } from '../data/globalEvents';

interface Props { playerScore?: number; onClose: () => void; }

const TIER_BG: Record<string, string> = {
  gold: 'bg-gradient-to-r from-yellow-900/60 to-yellow-700/30 border-yellow-500/50',
  silver: 'bg-gradient-to-r from-gray-700/60 to-gray-500/30 border-gray-400/50',
  bronze: 'bg-gradient-to-r from-amber-900/60 to-amber-700/30 border-amber-500/50',
  participation: 'bg-gradient-to-r from-blue-900/60 to-blue-700/30 border-blue-400/50',
};
export default function GlobalEventScreen({ playerScore = 0, onClose }: Props) {
  const [eventInfo, setEventInfo] = useState<GlobalEventInfo | null>(null);
  const [activeTab, setActiveTab] = useState<'leaderboard'|'rewards'>('leaderboard');
  const [showRewardAnim, setShowRewardAnim] = useState(false);

  useEffect(() => {
    const info = getCurrentGlobalEvent(playerScore);
    setEventInfo(info);
    if (info.cosmeticUnlocked) {
      const existing = getUnlockedCosmetics();
      if (!existing.find(c => c.id === info.cosmeticUnlocked!.id)) {
        saveUnlockedCosmetic(info.cosmeticUnlocked);
        setTimeout(() => setShowRewardAnim(true), 500);
      }
    }
  }, [playerScore]);

  if (!eventInfo) return null;
  return (
    <div className='fixed inset-0 z-[5000] bg-[#0a0a1a] flex flex-col overflow-hidden'>
      <div className='relative flex-shrink-0 px-4 pt-8 pb-4 text-center bg-gradient-to-b from-[#1a1a3e] to-[#0a0a1a]'>
        <div className='text-5xl mb-2 animate-float'>'{eventInfo.disasterIcon}'</div>
        <h1 className='text-xl font-bold text-white'>Evento Global de la Semana</h1>
        <p className='text-sm text-gray-400 mt-1'>'{eventInfo.startDate}'+' a '+'{eventInfo.endDate}'</p>
        <div className='mt-3 inline-block px-4 py-2 rounded-xl bg-red-900/30 border border-red-500/30'>
          <span className='text-lg font-bold text-red-400'>'{eventInfo.disasterIcon} {eventInfo.disasterName}'</span>
          <p className='text-xs text-gray-400 mt-1'>'{eventInfo.description}'</p>
        </div>
      </div>
      <div className='flex gap-1 px-4 py-2'>
        <button onClick={()=>setActiveTab('leaderboard')}
          className={'flex-1 py-2 rounded-lg text-sm font-medium transition-all '+
            (activeTab==='leaderboard'?'bg-red-600 text-white shadow-lg shadow-red-600/30 ':'bg-gray-800 text-gray-400 hover:bg-gray-700')}>
          Leaderboard
        </button>
        <button onClick={()=>setActiveTab('rewards')}
          className={'flex-1 py-2 rounded-lg text-sm font-medium transition-all '+
            (activeTab==='rewards'?'bg-red-600 text-white shadow-lg shadow-red-600/30 ':'bg-gray-800 text-gray-400 hover:bg-gray-700')}>
          Recompensas
        </button>
      </div>
      <div className='flex-1 overflow-y-auto px-4 pb-4 space-y-3'>
        {activeTab==='leaderboard'?(
          <div className='text-center py-3'>
            <p className='text-gray-400 text-xs'>Tu puntuación</p>
            <p className='text-3xl font-bold text-white'>'{eventInfo.playerScore.toLocaleString()}'</p>
            <div className='mt-1 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800'>
              <span className='text-red-400 font-bold'>#'{eventInfo.playerRank}'</span>
              <span className='text-gray-400 text-xs'>de '{eventInfo.totalParticipants}'</span>
            </div>
          </div>
        ):(<div className='space-y-3'>
          {showRewardAnim&&eventInfo.cosmeticUnlocked&&(
            <div className='text-center py-4 animate-fade-in-up'>
              <div className='text-5xl mb-2'>'{eventInfo.cosmeticUnlocked.icon}'</div>
              <p className='text-emerald-400 font-bold text-lg'>Desbloqueado!</p>
              <p className='text-white text-sm'>'{eventInfo.cosmeticUnlocked.name}'</p>
            </div>
          )}
          {eventInfo.rewards.map((r,i)=>{
            const earned = eventInfo.playerRank/eventInfo.totalParticipants<=r.minRankPercent;
            return (
              <div key={i} className={'rounded-xl p-3 border transition-all '+TIER_BG[r.tier]+(earned?' opacity-100':' opacity-50')}>
                <div className='flex items-center gap-3'>
                  <span className='text-2xl'>'{r.cosmetic.icon}'</span>
                  <div className='flex-1'>
                    <p className='text-sm font-bold text-white'>'{r.label}'</p>
                    <p className='text-xs text-gray-400'>'{r.cosmetic.name}'</p>
                  </div>
                  {earned&&<span className='text-emerald-400'>✓</span>}
                </div>
              </div>
            );})}
        </div>)}
      </div>
      <div className='flex-shrink-0 px-4 py-4 bg-[#0a0a1a] border-t border-gray-800'>
        <button onClick={onClose}
          className='w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-800 text-white font-bold hover:from-red-500 hover:to-red-700 transition-all'>
            Continuar
        </button>
      </div>
    </div>
  );
}
