// src/game/components/LaneView.tsx
import type {
  AnimConfig,
  HeroCatalog,
  LaneId,
  MatchState,
  UnitState,
} from "../../types/game";
import { SpriteAnimator } from "../../components/SpriteAnimator";
import { DeadSprite } from "../../components/DeadSpriteAnimator";
import { AttackComboAnimator } from "../../components/AttackComboAnimator";

type LaneViewProps = {
  lane: LaneId;
  match: MatchState;
  heroCatalog: HeroCatalog;
  onClick: () => void;
};

type DerivedAnimState = "walk" | "attack" | "dead";

export function LaneView({
  lane,
  match,
  heroCatalog,
  onClick,
}: LaneViewProps) {
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

  if (animState === "dead") {
    const deadCfg = toSingleAnim(a.dead ?? a.idle ?? a.walk);
    if (!deadCfg) return null;

    return (
      <div className="unit" style={{ left: `${xPercent}%` }}>
        <DeadSprite anim={deadCfg} flip={flip} />
      </div>
    );
  }

  if (animState === "attack") {
    const attackCfg = a.attack;

    if (Array.isArray(attackCfg)) {
      return (
        <div className="unit" style={{ left: `${xPercent}%` }}>
          <AttackComboAnimator key={unit.id} anims={attackCfg} flip={flip} />
          <HpBar ratio={hpRatio} />
        </div>
      );
    } else if (attackCfg) {
      return (
        <div className="unit" style={{ left: `${xPercent}%` }}>
          <SpriteAnimator anim={attackCfg} flip={flip} />
          <HpBar ratio={hpRatio} />
        </div>
      );
    }
  }

  const walkOrIdle = a.walk ?? a.idle ?? null;
  if (!walkOrIdle) return null;

  return (
    <div className="unit" style={{ left: `${xPercent}%` }}>
      <SpriteAnimator anim={walkOrIdle} flip={flip} />
      <HpBar ratio={hpRatio} />
    </div>
  );
}

function HpBar({ ratio }: { ratio: number }) {
  return (
    <div className="unit-hpbar">
      <div className="unit-hpfill" style={{ width: `${ratio * 100}%` }} />
    </div>
  );
}

function toSingleAnim(
  cfg?: AnimConfig | AnimConfig[] | null
): AnimConfig | null {
  if (!cfg) return null;
  return Array.isArray(cfg) ? cfg[0] : cfg;
}
