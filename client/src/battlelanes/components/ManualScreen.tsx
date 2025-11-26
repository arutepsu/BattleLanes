import type {
  HeroCatalog,
  HeroId,
  MatchState,
  PlayerSide,
} from "../../types/game";
import { HeroPicker } from "./HeroPicker";
import PlayableHero from "../hero/PlayableHero";

type ManualScreenProps = {
  heroCatalog: HeroCatalog;
  match: MatchState;
  selectedHeroId: HeroId | null;
  onSelectHero: (id: HeroId) => void;
};

export function ManualScreen({
  heroCatalog,
  match,
  selectedHeroId,
  onSelectHero,
}: ManualScreenProps) {
  const selectedHero =
    selectedHeroId != null ? heroCatalog[selectedHeroId] : null;

  return (
    <>
      {/* same top HUD bar as GameScreen */}
      <div className="top-bar">
        <ManaBar match={match} side="left" />
        <TowerBar match={match} side="left" />
        <TowerBar match={match} side="right" />
        <ManaBar match={match} side="right" />
      </div>

      {/* reuse the same hero picker */}
      <HeroPicker
        heroCatalog={heroCatalog}
        selectedHeroId={selectedHeroId}
        onSelectHero={onSelectHero}
      />

      {/* manual playground area */}
      <div className="manual-playground">
        {selectedHero ? (
          <>
            <PlayableHero
              hero={selectedHero}
              side="left"
              lane={1}
              initialX={300}
              onAttackStart={() => {
                console.log("Manual hero ATTACK start");
              }}
              onAttackEnd={() => {
                console.log("Manual hero ATTACK end");
              }}
            />
            <div className="manual-help">
              <p>
                Controls: <strong>A</strong> / <strong>D</strong> to move,{" "}
                <strong>Left Mouse</strong> to attack.
              </p>
            </div>
          </>
        ) : (
          <div className="manual-help">
            <p>Select a hero above to spawn and control it.</p>
          </div>
        )}
      </div>
    </>
  );
}


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
