import "./App.css";
import { useState } from "react";

import { useBattleLanesGame } from "./battlelanes/hooks/useBattleLanesGame";
import { GameScreen } from "./battlelanes/components/GameScreen";
import { ManualScreen } from "./battlelanes/components/ManualScreen";

type ViewMode = "match" | "manual";

export default function App() {
  const {
    heroCatalog,
    match,
    selectedHeroId,
    setSelectedHeroId,
    activeSide,
    setActiveSide,
    isRunning,
    toggleRunning,
    handleSpawn,
  } = useBattleLanesGame();

  const [viewMode, setViewMode] = useState<ViewMode>("match");

  if (
    !heroCatalog ||
    !match ||
    !match.players ||
    !match.players.left ||
    !match.players.right ||
    !Array.isArray(match.units)
  ) {
    console.log("Match state not ready / malformed:", match);
    return <div style={{ color: "white" }}>Loading match...</div>;
  }

  return (
    <div className="app-root">
      <h1>Battle Lanes</h1>

      {/* simple mode toggle */}
      <div className="mode-toggle">
        <button
          className={viewMode === "match" ? "active" : ""}
          onClick={() => setViewMode("match")}
        >
          Match Mode
        </button>
        <button
          className={viewMode === "manual" ? "active" : ""}
          onClick={() => setViewMode("manual")}
        >
          Manual / Training
        </button>
      </div>

      {viewMode === "match" ? (
        <GameScreen
          heroCatalog={heroCatalog}
          match={match}
          selectedHeroId={selectedHeroId}
          onSelectHero={setSelectedHeroId}
          activeSide={activeSide}
          onChangeActiveSide={setActiveSide}
          isRunning={isRunning}
          onToggleRunning={toggleRunning}
          onLaneClick={handleSpawn}
        />
      ) : (
        <ManualScreen
          heroCatalog={heroCatalog}
          match={match}
          selectedHeroId={selectedHeroId}
          onSelectHero={setSelectedHeroId}
        />
      )}
    </div>
  );
}
