import type { AnimConfig } from "../types/game";
import { useEffect, useRef} from "react";
export function AttackComboAnimator({
  anims,
  flip = false,
}: {
  anims: AnimConfig[];
  flip?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cnv: HTMLCanvasElement = canvas;
    const context = cnv.getContext("2d");
    if (!context) return;
    const ctx: CanvasRenderingContext2D = context;

    if (!anims || anims.length === 0) {
      return;
    }

    let segmentIndex = 0;
    let sprite: HTMLImageElement | null = null;
    let rafId: number | null = null;
    let cancelled = false;

    function playSegment(index: number) {
      const cfg = anims[index];
      if (!cfg) return;

      sprite = new Image();
      sprite.src = cfg.spriteSheetSrc;

      const frameWidth = cfg.frameWidth;
      const frameHeight = cfg.frameHeight;
      const framesPerRow = cfg.framesPerRow;
      const frameCount = cfg.totalFrames;
      const firstFrame = cfg.startFrame ?? 0;
      const lastFrame = firstFrame + frameCount - 1;

      const fps = cfg.fps || 10;
      const frameDuration = 1000 / fps;
      const scale = cfg.scale || 1;
      const backgroundColor = cfg.backgroundColor;

      const dw = frameWidth * scale;
      const dh = frameHeight * scale;
      cnv.width = dw;
      cnv.height = dh;

      let currentFrame = firstFrame;
      let lastTime = 0;

      function drawFrame() {
        if (!sprite) return;
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
        if (cancelled) return;

        if (!lastTime) lastTime = timestamp;
        const delta = timestamp - lastTime;

        if (delta >= frameDuration) {
          lastTime = timestamp;
          currentFrame++;

          if (currentFrame > lastFrame) {
            segmentIndex = (index + 1) % anims.length;
            playSegment(segmentIndex);
            return;
          }
        }

        drawFrame();
        rafId = requestAnimationFrame(loopFn);
      }

      sprite.onload = () => {
        if (cancelled) return;
        rafId = requestAnimationFrame(loopFn);
      };

      sprite.onerror = (e) => {
        console.error("Failed to load attack sprite:", cfg.spriteSheetSrc, e);
      };
    }

    playSegment(0);

    return () => {
      cancelled = true;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [anims, flip]);

  return <canvas ref={canvasRef} />;
}
