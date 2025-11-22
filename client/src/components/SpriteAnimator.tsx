import { useEffect, useRef } from "react";
import type { AnimConfig } from "../types/game";

interface SpriteAnimatorProps {
  anim: AnimConfig;
  playing?: boolean;
  flip?: boolean;
}

export function SpriteAnimator({
  anim,
  playing = true,
  flip = false,
}: SpriteAnimatorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const frameRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const requestRef = useRef<number | null>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    const rawCanvas = canvasRef.current;
    if (!rawCanvas) return;
    const canvas: HTMLCanvasElement = rawCanvas;

    const rawCtx = canvas.getContext("2d");
    if (!rawCtx) return;
    const ctx: CanvasRenderingContext2D = rawCtx;

    const img = new Image();
    img.src = anim.spriteSheetSrc; // <- now a clean "/sprites/...".
    imgRef.current = img;
    loadedRef.current = false;

    const frameWidth = anim.frameWidth;
    const frameHeight = anim.frameHeight;
    const totalFrames = anim.totalFrames;
    const fps = anim.fps || 8;
    const frameDuration = 1000 / fps;
    const scale = anim.scale || 1;

    const scaledWidth = frameWidth * scale;
    const scaledHeight = frameHeight * scale;
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;

    frameRef.current = anim.startFrame ?? 0;
    lastTimeRef.current = null;

    function draw(timestamp: number) {
      if (!playing) {
        requestRef.current = requestAnimationFrame(draw);
        return;
      }

      if (!loadedRef.current || !img.complete || img.naturalWidth === 0) {
        requestRef.current = requestAnimationFrame(draw);
        return;
      }

      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }

      const elapsed = timestamp - lastTimeRef.current;

      if (elapsed >= frameDuration) {
        lastTimeRef.current = timestamp;
        frameRef.current++;

        if (frameRef.current >= totalFrames) {
          frameRef.current = anim.loop ? 0 : totalFrames - 1;
        }
      }

      const currentFrame = frameRef.current;
      const col = currentFrame % anim.framesPerRow;
      const row = Math.floor(currentFrame / anim.framesPerRow);
      const sx = col * frameWidth;
      const sy = row * frameHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      if (flip) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }

      ctx.drawImage(
        img,
        sx,
        sy,
        frameWidth,
        frameHeight,
        0,
        0,
        scaledWidth,
        scaledHeight
      );

      ctx.restore();

      requestRef.current = requestAnimationFrame(draw);
    }

    img.onload = () => {
      loadedRef.current = true;
      requestRef.current = requestAnimationFrame(draw);
    };

    img.onerror = (e) => {
      console.error("Failed to load sprite image:", anim.spriteSheetSrc, e);
    };

    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [anim, playing, flip]);

  return <canvas ref={canvasRef} />;
}
