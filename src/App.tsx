import { useState, useCallback, useEffect, useRef, type JSX } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { DISASTERS, calculateDisasterDifficulty } from './data/disasters'
import { calculateGlobalScore, isNewGlobalEventWeek, markGlobalEventSeen } from './data/globalEvents';
import { getAvailableCommunityEvent } from './data/communityEvents';
import type { CommunityEvent } from './types/game';
import GameMap from './components/GameMap';
import HUD from './components/HUD';
import GameHeader from './components/GameHeader';
import GameIntro from './components/GameIntro';
import DisasterWarning from './components/DisasterModal';
import { DisasterEvent } from './components/DisasterModal';
import SurvivalResult from './components/SurvivalResult';
import InventoryModal from './components/InventoryModal'
import GlobalEventScreen from './components/GlobalEventScreen';
import ShelterModal from './components/ShelterModal';
import MissionsPanel from './components/MissionsPanel';
import TradingModal from './components/TradingModal';
import CommunityHub from './components/CommunityHub';
import CompanionPanel from './components/CompanionPanel';
import JournalModal from './components/JournalModal';
import CommunityEventModal from './components/CommunityEventModal';

// ─── Inner game content (needs GameContext) ───
function GameContent() {
  const { state, dispatch } = useGame();
  const [showIntro, setShowIntro] = useState(true);
  const [showInventory, setShowInventory] = useState(false);
  const [showShelter, setShowShelter] = useState(false);
  const [showMissions, setShowMissions] = useState(false);
  const [showTrading, setShowTrading] = useState(false);
  const [showCommunityHub, setShowCommunityHub] = useState(false);
  const [showCompanions, setShowCompanions] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [showCommunityEvent, setShowCommunityEvent] = useState<CommunityEvent | null>(null);
  const [showGlobalEvent, setShowGlobalEvent] = useState(() => isNewGlobalEventWeek());
  const lastCommunityCheckWeek = useRef(state.week);

  // Check for community events when a new week starts
  useEffect(() => {
    if (state.phase !== 'playing' || state.day !== 1) return;
    if (state.week === lastCommunityCheckWeek.current) return;
    lastCommunityCheckWeek.current = state.week;

    const communityEvent = getAvailableCommunityEvent(
      state.week,
      state.karma,
      state.factionReputation,
      state.communityEvents.map((c) => c.eventId)
    );
    if (communityEvent) {
      setShowCommunityEvent(communityEvent);
    }
  }, [state.week, state.day, state.phase, state.karma, state.communityEvents.length]);

  const handleDisasterResolve = useCallback(
    (survived: boolean) => {
      const disaster = DISASTERS.find(
        (d) => d.type === state.currentDisaster
      );
      if (!disaster) return;

      const penalty = calculateDisasterDifficulty(
        disaster.penalty,
        state.week
      );

      dispatch({
        type: 'APPLY_DISASTER_RESULT',
        survived,
        penalty,
      });
    },
    [state.currentDisaster, state.week, dispatch]
  );

  if (showIntro) {
    return <GameIntro onStart={() => setShowIntro(false)} highScore={state.highScore} />;
  }

  if (showGlobalEvent) {
    return <GlobalEventScreen playerScore={calculateGlobalScore(state)} onClose={() => { markGlobalEventSeen(); setShowGlobalEvent(false); }} />;
  }

  return (
    <div className="w-full h-full relative bg-[#0f0f23]">
      {/* Header */}
      <GameHeader
        onOpenInventory={() => setShowInventory(true)}
        onOpenShelter={() => setShowShelter(true)}
        onOpenMissions={() => setShowMissions(true)}
        onOpenTrading={() => setShowTrading(true)}
        onOpenCommunityHub={() => setShowCommunityHub(true)}
        onOpenCompanions={() => setShowCompanions(true)}
        onOpenJournal={() => setShowJournal(true)}
      />

      {/* Map */}
      <GameMap />

      {/* Inventory Modal */}
      {showInventory && (
        <InventoryModal onClose={() => setShowInventory(false)} />
      )}

      {/* Shelter Modal */}
      {showShelter && (
        <ShelterModal onClose={() => setShowShelter(false)} />
      )}

      {/* Missions Panel */}
      {showMissions && (
        <MissionsPanel onClose={() => setShowMissions(false)} />
      )}

      {/* Trading Modal */}
      {showTrading && (
        <TradingModal onClose={() => setShowTrading(false)} />
      )}

      {/* Community Hub */}
      {showCommunityHub && (
        <CommunityHub onClose={() => setShowCommunityHub(false)} />
      )}

      {/* Companion Panel */}
      {showCompanions && (
        <CompanionPanel onClose={() => setShowCompanions(false)} />
      )}

      {/* Journal */}
      {showJournal && (
        <JournalModal onClose={() => setShowJournal(false)} />
      )}

      {/* Community Event Modal */}
      {showCommunityEvent && (
        <CommunityEventModal
          event={showCommunityEvent}
          onClose={() => setShowCommunityEvent(null)}
        />
      )}

      {/* HUD */}
      <HUD />

      {/* Disaster Warning */}
      {state.phase === 'disaster_warning' && (
        <DisasterWarning
          onClose={() => {
            dispatch({
              type: 'TRIGGER_DISASTER',
              disaster: state.currentDisaster!,
            });
          }}
        />
      )}

      {/* Disaster Event */}
      {state.phase === 'disaster_event' && (
        <DisasterEvent onComplete={handleDisasterResolve} />
      )}

      {/* Survival Result */}
      {state.phase === 'survival_result' && <SurvivalResult />}
    </div>
  );
}

// ─── Root App ───
export default function App(): JSX.Element {
  return (
    <GameProvider>
      <div className="w-screen h-screen overflow-hidden bg-[#0f0f23] text-white font-sans">
        <GameContent />
      </div>
    </GameProvider>
  );
}
