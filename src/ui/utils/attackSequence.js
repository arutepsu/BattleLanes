function playAttackSequence(canvasId, segments) {
  let index = 0;
  let localAnimator = null;

  function playNext() {
    const cfg = segments[index];

    // move to next, wrap around
    index = (index + 1) % segments.length;

    if (localAnimator) localAnimator.stop();

    localAnimator = createSpriteAnimator({
      canvasId,
      spriteSheetSrc: cfg.spriteSheetSrc,
      frameWidth: cfg.frameWidth,
      frameHeight: cfg.frameHeight,
      framesPerRow: cfg.framesPerRow,
      totalFrames: cfg.totalFrames,
      fps: cfg.fps || 10,
      scale: cfg.scale || 2,
      startFrame: cfg.startFrame || 0,
      loop: false,                 // ❗ play once, then trigger next
      backgroundColor: cfg.backgroundColor || null,
      onComplete: playNext,        // 🔁 loop next segment forever
    });
  }

  playNext(); // start the loop

  return {
    stop() {
      if (localAnimator) localAnimator.stop();
    }
  };
}
