
import React from "react";
import type { AnimConfig } from "../../types/game";
import {SpriteAnimator} from "../../components/SpriteAnimator";
import { AttackComboAnimator } from "../../components/AttackComboAnimator";

type FacingDirection = "left" | "right";

export interface HeroSpriteProps {
  x: number;
  laneY?: number;
  direction: FacingDirection;
  baseAnim: AnimConfig;
  attackAnims?: AnimConfig[];
  attacking: boolean;
}

export const HeroSprite: React.FC<HeroSpriteProps> = ({
  x,
  laneY = 0,
  direction,
  baseAnim,
  attackAnims,
  attacking,
}) => {
  const flip = direction === "left";

  const showAttackCombo = attacking && attackAnims && attackAnims.length > 0;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        bottom: laneY,
        pointerEvents: "none",
      }}
    >
      {showAttackCombo ? (
        <AttackComboAnimator anims={attackAnims} flip={flip} />
      ) : (
        <SpriteAnimator anim={baseAnim} playing={true} flip={flip} />
      )}
    </div>
  );
};

export default HeroSprite;