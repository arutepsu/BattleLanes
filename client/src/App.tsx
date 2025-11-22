// src/App.tsx
import { useCallback, useEffect, useState } from "react";
import type {
  MatchState,
  HeroCatalog,
  HeroId,
  PlayerSide,
  LaneId,
  UnitState,
} from "./types/game";
import { fetchHeroes, createMatch, spawnUnit, stepMatch } from "./types/gameApi";
import "./App.css";
import { SpriteAnimator } from "./components/SpriteAnimator";


const LANES: LaneId[] = [0, 1, 2];
const LEFT: PlayerSide = "left";

export default function App() {
  const [heroCatalog, setHeroCatalog] = useState<HeroCatalog | null>(null);
  const [match, setMatch] = useState<MatchState | null>(null);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [selectedHeroId, setSelectedHeroId] = useState<HeroId | null>(null);
  const [isRunning, setIsRunning] = useState(true);

  // Load heroes + create match on mount
  useEffect(() => {
    (async () => {
      try {
        const heroes = await fetchHeroes();
        setHeroCatalog(heroes);

        const { matchId, state } = await createMatch("Player1", "Player2");
        setMatchId(matchId);
        setMatch(state);
      } catch (err) {
        console.error("Error initializing game:", err);
      }
    })();
  }, []);

  // Game loop
  useEffect(() => {
    if (!matchId || !isRunning) return;

    const TICK_MS = 100;
    let cancelled = false;

    const run = async () => {
      if (cancelled) return;
      try {
        const { state /*, events */ } = await stepMatch(matchId, TICK_MS);
        setMatch({ ...state });
        // later: handle events for attack/hit/dead animations
      } catch (err) {
        console.error(err);
      }
      if (!cancelled) {
        setTimeout(run, TICK_MS);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [matchId, isRunning]);

  const handleSpawn = useCallback(
    async (lane: LaneId) => {
      if (!matchId || !selectedHeroId) return;
      try {
        const res = await spawnUnit(matchId, LEFT, lane, selectedHeroId);
        setMatch(res.state);
      } catch (err) {
        console.error("Spawn error:", err);
      }
    },
    [matchId, selectedHeroId]
  );

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

      <div className="top-bar">
        <ManaBar match={match} side="left" />
        <TowerBar match={match} side="left" />
        <TowerBar match={match} side="right" />
        <ManaBar match={match} side="right" />
      </div>

      <HeroBar
        heroCatalog={heroCatalog}
        selectedHeroId={selectedHeroId}
        onSelectHero={setSelectedHeroId}
      />

      <GameBoard
        match={match}
        heroCatalog={heroCatalog}
        onLaneClick={handleSpawn}
      />
    </div>
  );
}

// ----------------- Small components -----------------

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

function HeroBar({
  heroCatalog,
  selectedHeroId,
  onSelectHero,
}: {
  heroCatalog: HeroCatalog;
  selectedHeroId: HeroId | null;
  onSelectHero: (id: HeroId) => void;
}) {
  const entries = Object.entries(heroCatalog);

  return (
    <div className="hero-bar">
      {entries.map(([id, hero]) => (
        <button
          key={id}
          className={
            "hero-btn" + (selectedHeroId === id ? " hero-btn--selected" : "")
          }
          onClick={() => onSelectHero(id)}
        >
          <div>{hero.name}</div>
          <small>Cost: {hero.cost}</small>
        </button>
      ))}
    </div>
  );
}

function GameBoard({
  match,
  heroCatalog,
  onLaneClick,
}: {
  match: MatchState;
  heroCatalog: HeroCatalog;
  onLaneClick: (lane: LaneId) => void;
}) {
  return (
    <div className="board">
      {LANES.map((lane) => (
        <LaneView
          key={lane}
          lane={lane}
          match={match}
          heroCatalog={heroCatalog}
          onClick={() => onLaneClick(lane)}
        />
      ))}
    </div>
  );
}

function LaneView({
  lane,
  match,
  heroCatalog,
  onClick,
}: {
  lane: LaneId;
  match: MatchState;
  heroCatalog: HeroCatalog;
  onClick: () => void;
}) {
  const allUnits = Array.isArray(match.units) ? match.units : [];
  const unitsOnLane = allUnits.filter((u) => u.lane === lane);

  if (!Array.isArray(match.units)) {
    console.warn("LaneView: match.units is not an array", match.units);
  }

  return (
    <div className="lane" onClick={onClick}>
      {unitsOnLane.map((u) => (
        <UnitView key={u.id} unit={u} heroCatalog={heroCatalog} />
      ))}
    </div>
  );
}

function UnitView({
  unit,
  heroCatalog,
}: {
  unit: UnitState;
  heroCatalog: HeroCatalog;
}) {
  const hero = heroCatalog[unit.heroId];
  if (!hero) {
    console.warn("UnitView: missing hero for", unit.heroId);
    return null;
  }

  const animations = hero.animations;
  // For now: always use walk animation when unit is alive.
  // Later: switch between idle/walk/attack/hit/dead based on events.
  const walkAnim = animations.walk ?? animations.idle;
  const flip = unit.side === "right";

  // lane is horizontal: x in [0,1] → % in CSS
  const xPercent = unit.side === "left" ? unit.x * 100 : (1 - unit.x) * 100;
  const hpRatio = unit.hp / unit.maxHp;

  return (
    <div
      className="unit"
      style={{
        left: `${xPercent}%`,
      }}
    >
      <SpriteAnimator anim={walkAnim} flip={flip} />

      <div className="unit-hpbar">
        <div className="unit-hpfill" style={{ width: `${hpRatio * 100}%` }} />
      </div>
    </div>
  );
}
