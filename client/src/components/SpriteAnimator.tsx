import { useEffect, useRef, useState } from "react";
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
    const backgroundColor = anim.backgroundColor;

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
            currentFrame = firstFrame; // loop within range
          } else {
            currentFrame = lastFrame;
            playingInternal = false;
            drawFrame();
            if (onComplete) {
              onComplete(); // ✅ will now actually fire
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
  }, [anim, flip]); // 👈 only restart when sprite or flip changes

  return <canvas ref={canvasRef} />;
}

// ---------- DeadSprite: static last frame (for dead heroes) ----------

export function DeadSprite({
  anim,
  flip = false,
}: {
  anim: AnimConfig;
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

    const img = new Image();
    img.src = anim.spriteSheetSrc;

    const frameWidth = anim.frameWidth;
    const frameHeight = anim.frameHeight;
    const framesPerRow = anim.framesPerRow;
    const frameCount = anim.totalFrames;
    const firstFrame = anim.startFrame ?? 0;
    const lastFrame = firstFrame + frameCount - 1;

    const scale = anim.scale || 1;
    const dw = frameWidth * scale;
    const dh = frameHeight * scale;
    cnv.width = dw;
    cnv.height = dh;

    img.onload = () => {
      const col = lastFrame % framesPerRow;
      const row = Math.floor(lastFrame / framesPerRow);
      const sx = col * frameWidth;
      const sy = row * frameHeight;

      ctx.clearRect(0, 0, cnv.width, cnv.height);

      ctx.save();
      if (flip) {
        ctx.translate(cnv.width, 0);
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
        dw,
        dh
      );

      ctx.restore();
    };

    img.onerror = (e) => {
      console.error("Failed to load dead sprite:", anim.spriteSheetSrc, e);
    };
  }, [anim, flip]);

  return <canvas ref={canvasRef} />;
}

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
            // 👉 segment finished: move to next segment in the combo
            segmentIndex = (index + 1) % anims.length;
            playSegment(segmentIndex);
            return; // stop this loop; new one will start
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

    // start with first attack segment (e.g. "attack.png")
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
