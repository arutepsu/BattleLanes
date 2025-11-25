// src/game/components/GameScreen.tsx
import type {
  HeroCatalog,
  HeroId,
  MatchState,
  PlayerSide,
  LaneId,
} from "../../types/game";
import { ControlsPanel } from "./ControlsPanel";
import { HeroPicker } from "./HeroPicker";
import { LanesView } from "./LanesView";

type GameScreenProps = {
  heroCatalog: HeroCatalog;
  match: MatchState;
  selectedHeroId: HeroId | null;
  onSelectHero: (id: HeroId) => void;
  activeSide: PlayerSide;
  onChangeActiveSide: (side: PlayerSide) => void;
  isRunning: boolean;
  onToggleRunning: () => void;
  onLaneClick: (lane: LaneId) => void;
};

export function GameScreen({
  heroCatalog,
  match,
  selectedHeroId,
  onSelectHero,
  activeSide,
  onChangeActiveSide,
  isRunning,
  onToggleRunning,
  onLaneClick,
}: GameScreenProps) {
  return (
    <>
      <div className="top-bar">
        <ManaBar match={match} side="left" />
        <TowerBar match={match} side="left" />
        <TowerBar match={match} side="right" />
        <ManaBar match={match} side="right" />
      </div>

      <ControlsPanel
        activeSide={activeSide}
        onChangeActiveSide={onChangeActiveSide}
        isRunning={isRunning}
        onToggleRunning={onToggleRunning}
      />

      <HeroPicker
        heroCatalog={heroCatalog}
        selectedHeroId={selectedHeroId}
        onSelectHero={onSelectHero}
      />

      <LanesView
        match={match}
        heroCatalog={heroCatalog}
        onLaneClick={onLaneClick}
      />
    </>
  );
}

// ---------- HUD bits (can be split later if you want) ----------

function ManaBar({ match, side }: { match: MatchState; side: PlayerSide }) {
  const players = match.players;
  const p = players && players[side];

  if (!p) {
    console.warn("ManaBar: missing player for side", side, players);
    return null;
  }

  const ratio = p.maxMana > 0 ? p.mana / p.maxMana : 0;

  return (
    <div className="mana-bar">
      <div className="mana-fill" style={{ width: `${ratio * 100}%` }} />
      <span>
        {side.toUpperCase()} Mana: {p.mana.toFixed(1)} / {p.maxMana}
      </span>
    </div>
  );
}

function TowerBar({ match, side }: { match: MatchState; side: PlayerSide }) {
  const players = match.players;
  const player = players && players[side];

  if (!player) {
    console.warn("TowerBar: missing player for side", side, players);
    return null;
  }

  const t = player.tower;
  const ratio = t.maxHp > 0 ? t.hp / t.maxHp : 0;

  return (
    <div className="tower-bar">
      <div className="tower-fill" style={{ width: `${ratio * 100}%` }} />
      <span>
        {side.toUpperCase()} Tower: {Math.round(t.hp)} / {t.maxHp}
      </span>
    </div>
  );
}
