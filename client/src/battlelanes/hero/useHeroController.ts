import { useEffect, useState } from "react";
import type {
  HeroDefinition,
  AnimConfig,
} from "../../types/game";

type FacingDirection = "left" | "right";


interface KeyState {
  left: boolean;
  right: boolean;
}

export interface HeroControllerState {
  x: number;
  direction: FacingDirection;
  attacking: boolean;
  isMoving: boolean;
}

export function useHeroController(
  hero: HeroDefinition,
  initialX: number,
  initialDirection: FacingDirection
): HeroControllerState {
  const [x, setX] = useState(initialX);
  const [direction, setDirection] = useState<FacingDirection>(initialDirection);
  const [keys, setKeys] = useState<KeyState>({ left: false, right: false });
  const [attacking, setAttacking] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;

      if (e.key === "a" || e.key === "A") {
        setKeys((prev) => ({ ...prev, left: true }));
        setDirection("left");
        setAttacking(false);
      }
      if (e.key === "d" || e.key === "D") {
        setKeys((prev) => ({ ...prev, right: true }));
        setDirection("right");
        setAttacking(false);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "a" || e.key === "A") {
        setKeys((prev) => ({ ...prev, left: false }));
      }
      if (e.key === "d" || e.key === "D") {
        setKeys((prev) => ({ ...prev, right: false }));
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        setKeys((currentKeys) => {
          const isMoving = currentKeys.left || currentKeys.right;
          if (!isMoving) {
            setAttacking(true);
          }
          return currentKeys;
        });
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 0) {
        setAttacking(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    let frameId: number;
    let lastTime = performance.now();
    const speedPxPerSec = hero.speed * 10;

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      setX((prevX) => {
        let nextX = prevX;
        setKeys((k) => {
          if (k.left) nextX -= speedPxPerSec * dt;
          if (k.right) nextX += speedPxPerSec * dt;
          return k;
        });
        return nextX;
      });

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [hero.speed]);

  const isMoving = keys.left || keys.right;

  return {
    x,
    direction,
    attacking,
    isMoving,
  };
}