function createSpriteAnimator(config) {
    const {
        canvasId,
        spriteSheetSrc,
        frameWidth,
        frameHeight,
        framesPerRow,
        totalFrames,
        fps = 10,
        scale = 2,
        startFrame = 0,
        loop = true,
        backgroundColor = null,
        onComplete = null,
    } = config;

    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");

    const sprite = new Image();
    sprite.src = spriteSheetSrc;

    let currentFrame = startFrame;
    let lastTime = 0;
    const frameDuration = 1000 / fps;
    let playing = false;

    function drawFrame() {
        const col = currentFrame % framesPerRow;
        const row = Math.floor(currentFrame / framesPerRow);

        const sx = col * frameWidth;
        const sy = row * frameHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (backgroundColor) {
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        const dw = frameWidth * scale;
        const dh = frameHeight * scale;

        ctx.drawImage(
            sprite,
            sx, sy, frameWidth, frameHeight,
            (canvas.width - dw) / 2,
            (canvas.height - dh) / 2,
            dw, dh
        );
    }

    function loopFn(timestamp) {
        if (!playing) return;

        if (!lastTime) lastTime = timestamp;
        const delta = timestamp - lastTime;

        if (delta >= frameDuration) {
            currentFrame++;

            if (currentFrame >= totalFrames) {
                if (loop) {
                    // loop animation
                    currentFrame = 0;
                } else {
                    // stay on last frame and stop
                    currentFrame = totalFrames - 1;
                    playing = false;
                    drawFrame();

                    if (typeof onComplete === "function") {
                        onComplete();
                    }
                    return; // ❗ stop requesting more frames
                }
            }
            lastTime = timestamp;
        }

        drawFrame();
        requestAnimationFrame(loopFn);
    }

    sprite.onload = () => {
        playing = true;
        requestAnimationFrame(loopFn);
    };

    // Public API
    return {
        start() {
            if (!playing) {
                playing = true;
                lastTime = 0;
                requestAnimationFrame(loopFn);
            }
        },
        stop() {
            playing = false;
        },
        setFrame(index) {
            currentFrame = index % totalFrames;
        }
    };
}
