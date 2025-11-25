import type { AnimConfig } from "../types/game";
import { useEffect, useRef} from "react";

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