import { useEffect, useRef } from "react";
import type { AnimConfig } from "../types/game";

interface SpriteAnimatorProps {
  anim: AnimConfig;
  playing?: boolean;
  flip?: boolean;
  onComplete?: () => void;
}

export function SpriteAnimator({
  anim,
  playing = true,
  flip = false,
  onComplete,
}: SpriteAnimatorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cnv: HTMLCanvasElement = canvas;
    const context = cnv.getContext("2d");
    if (!context) return;
    const ctx: CanvasRenderingContext2D = context;

    ctx.imageSmoothingEnabled = false;

    const sprite = new Image();
    sprite.src = anim.spriteSheetSrc;

    const frameWidth = anim.frameWidth;
    const frameHeight = anim.frameHeight;
    const framesPerRow = anim.framesPerRow;
    const frameCount = anim.totalFrames;
    const firstFrame = anim.startFrame ?? 0;
    const lastFrame = firstFrame + frameCount - 1;

    const fps = anim.fps || 10;
    const frameDuration = 1000 / fps;
    const scale = anim.scale || 1;
    const loop = anim.loop ?? true;
    const backgroundColor = anim.backgroundColor || null;

    const dw = frameWidth * scale;
    const dh = frameHeight * scale;
    cnv.width = dw;
    cnv.height = dh;

    let currentFrame = firstFrame;
    let lastTime = 0;
    let playingInternal = true;
    let rafId: number | null = null;

    function drawFrame() {
      const col = currentFrame % framesPerRow;
      const row = Math.floor(currentFrame / framesPerRow);
      const sx = col * frameWidth;
      const sy = row * frameHeight;

      ctx.clearRect(0, 0, cnv.width, cnv.height);

      if (backgroundColor) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, cnv.width, cnv.height);
      }

      ctx.save();
      if (flip) {
        ctx.translate(cnv.width, 0);
        ctx.scale(-1, 1);
      }

      ctx.drawImage(
        sprite,
        sx,
        sy,
        frameWidth,
        frameHeight,
        0,
        0,
        dw,
        dh
      );

      ctx.restore();
    }

    function loopFn(timestamp: number) {
      if (!playingInternal) return;

      if (!lastTime) lastTime = timestamp;
      const delta = timestamp - lastTime;

      if (delta >= frameDuration && playing) {
        lastTime = timestamp;
        currentFrame++;

        if (currentFrame > lastFrame) {
          if (loop) {
            currentFrame = firstFrame;
          } else {
            currentFrame = lastFrame;
            playingInternal = false;
            drawFrame();
            if (onComplete) {
              onComplete();
            }
            return;
          }
        }
      }

      drawFrame();
      rafId = requestAnimationFrame(loopFn);
    }

    sprite.onload = () => {
      playingInternal = true;
      rafId = requestAnimationFrame(loopFn);
    };

    sprite.onerror = (e) => {
      console.error("Failed to load sprite image:", anim.spriteSheetSrc, e);
    };

    return () => {
      playingInternal = false;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [anim, flip, playing, onComplete]);

  return <canvas ref={canvasRef} />;
}
