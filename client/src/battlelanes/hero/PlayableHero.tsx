import React, { useEffect, useRef } from "react";
import type {
  HeroDefinition,
  PlayerSide,
  LaneId,
  AnimConfig,
} from "../../types/game";
import { useHeroController } from "./useHeroController";
import HeroSprite from "./HeroSprite";

export interface PlayableHeroProps {
  hero: HeroDefinition;
  side: PlayerSide;
  lane: LaneId;
  initialX?: number;
  onAttackStart?: () => void;
  onAttackEnd?: () => void;
}

export const PlayableHero: React.FC<PlayableHeroProps> = ({
  hero,
  side,
  lane,
  initialX,
  onAttackStart,
  onAttackEnd,
}) => {
  const spawnX = initialX ?? (side === "left" ? 100 : 600);
  const initialDir: "left" | "right" = side === "left" ? "right" : "left";

  const { x, direction, attacking, isMoving } = useHeroController(
    hero,
    spawnX,
    initialDir
  );

  const prevAttackingRef = useRef(attacking);
  useEffect(() => {
    const prev = prevAttackingRef.current;
    if (!prev && attacking) {
      onAttackStart?.();
    } else if (prev && !attacking) {
      onAttackEnd?.();
    }
    prevAttackingRef.current = attacking;
  }, [attacking, onAttackStart, onAttackEnd]);

  const baseAnim: AnimConfig = isMoving
    ? hero.animations.walk
    : hero.animations.idle;

  const attackConfig = hero.animations.attack;
  const attackAnims: AnimConfig[] = Array.isArray(attackConfig)
    ? attackConfig
    : [attackConfig];

  const laneY = 0;

  return (
    <HeroSprite
      x={x}
      laneY={laneY}
      direction={direction}
      baseAnim={baseAnim}
      attackAnims={attackAnims}
      attacking={attacking}
    />
  );
};

export default PlayableHero;