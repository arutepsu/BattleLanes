import { useCallback, useEffect, useState } from "react";
import type {
  MatchState,
  HeroCatalog,
  HeroId,
  PlayerSide,
  LaneId,
  UnitState,
  AnimConfig,
} from "./types/game";
import { fetchHeroes, createMatch, spawnUnit, stepMatch } from "./types/gameApi";
import "./App.css";
import { DeadSprite, SpriteAnimator } from "./components/SpriteAnimator";

const LANES: LaneId[] = [0, 1, 2];


export default function App() {
  const [heroCatalog, setHeroCatalog] = useState<HeroCatalog | null>(null);
  const [match, setMatch] = useState<MatchState | null>(null);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [selectedHeroId, setSelectedHeroId] = useState<HeroId | null>(null);

  const [isRunning, setIsRunning] = useState(true);

  // 👇 NEW: which player is currently spawning units
  const [activeSide, setActiveSide] = useState<PlayerSide>("left");

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
        // 👇 use activeSide instead of always LEFT
        const res = await spawnUnit(matchId, activeSide, lane, selectedHeroId);
        setMatch(res.state);
      } catch (err) {
        console.error("Spawn error:", err);
      }
    },
    [matchId, selectedHeroId, activeSide]
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

      {/* 👇 NEW: side selector for spawns */}
      <SpawnSideToggle activeSide={activeSide} onChange={setActiveSide} />

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
function SpawnSideToggle({
  activeSide,
  onChange,
}: {
  activeSide: PlayerSide;
  onChange: (side: PlayerSide) => void;
}) {
  return (
    <div className="spawn-toggle">
      <span>Spawning for:&nbsp;</span>
      <button
        className={activeSide === "left" ? "spawn-btn spawn-btn--active" : "spawn-btn"}
        onClick={() => onChange("left")}
      >
        Left
      </button>
      <button
        className={activeSide === "right" ? "spawn-btn spawn-btn--active" : "spawn-btn"}
        onClick={() => onChange("right")}
      >
        Right
      </button>
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
type DerivedAnimState = "walk" | "attack" | "dead";


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
      {unitsOnLane.map((u) => {
      const animState: DerivedAnimState =
        u.hp <= 0 || u.phase === "dead"
          ? "dead"
          : u.phase === "attackingUnit" || u.phase === "attackingTower"
          ? "attack"
          : "walk";

        return (
          <UnitView
            key={u.id}
            unit={u}
            heroCatalog={heroCatalog}
            animState={animState}
          />
        );
      })}
    </div>
  );
}


function UnitView({
  unit,
  heroCatalog,
  animState,
}: {
  unit: UnitState;
  heroCatalog: HeroCatalog;
  animState: DerivedAnimState;
}) {
  const hero = heroCatalog[unit.heroId];
  if (!hero) {
    console.warn("UnitView: missing hero for", unit.heroId);
    return null;
  }

  const a = hero.animations;
  const flip = unit.side === "right";
  const xPercent = unit.x * 100;
  const hpRatio = unit.maxHp > 0 ? unit.hp / unit.maxHp : 0;

  // 🔥 DEAD: use DeadSprite (static last frame)
  if (animState === "dead") {
    const deadCandidate = a.dead ?? a.idle ?? a.walk;
    const deadAnim = toSingleAnim(deadCandidate);
    if (!deadAnim) {
      console.warn("UnitView: no dead animation for", unit.heroId);
      return null;
    }

    console.log("DEAD anim config for", unit.heroId, {
      src: deadAnim.spriteSheetSrc,
      totalFrames: deadAnim.totalFrames,
      startFrame: deadAnim.startFrame,
      loop: deadAnim.loop,
    });

    return (
      <div
        className="unit"
        style={{
          left: `${xPercent}%`,
        }}
      >
        <DeadSprite anim={deadAnim} flip={flip} />
        <div className="unit-hpbar">
          <div
            className="unit-hpfill"
            style={{ width: `${hpRatio * 100}%` }}
          />
        </div>
      </div>
    );
  }

  // ✅ WALK / ATTACK: still use SpriteAnimator
  let candidate: AnimConfig | AnimConfig[] | undefined;
  if (animState === "attack") {
    candidate = a.attack ?? a.walk ?? a.idle;
  } else {
    candidate = a.walk ?? a.idle;
  }

  const anim = toSingleAnim(candidate);
  if (!anim) {
    console.warn("UnitView: no animation found for", unit.heroId, animState);
    return null;
  }

  return (
    <div
      className="unit"
      style={{
        left: `${xPercent}%`,
      }}
    >
      <SpriteAnimator anim={anim} flip={flip} />
      <div className="unit-hpbar">
        <div
          className="unit-hpfill"
          style={{ width: `${hpRatio * 100}%` }}
        />
      </div>
    </div>
  );
}

function toSingleAnim(
  cfg?: AnimConfig | AnimConfig[] | null
): AnimConfig | null {
  if (!cfg) return null;
  return Array.isArray(cfg) ? cfg[0] : cfg;
}