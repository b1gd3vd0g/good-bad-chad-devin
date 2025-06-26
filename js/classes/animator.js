/**
 * This class is for animating a spritesheet.
 * An Animator is responsible for only ONE of the sprites Animations (i.e. jumping up, walking right, etc.),
 * therefore many sprites will have several Animators.
 * @author Chris Marriott
 * @uathor Devin Peevy
 * @uathor Nathan Hinthorne
 */
class Animator {
  /**
   * @param {string} spritesheet The path to the spritesheet that this specific Animator instance is going to be working with.
   * @param {Vector} start The starting position (on the SPRITESHEET!) of the first sprite of the animation.
   * @param {Vector} size The size in pixels of the sprites in this animation.
   * @param {number} frameCount The number of frames that are included in this animation.
   * @param {number} frameDuration The amount of time (in SECONDS!) between each change in frame.
   * @param {boolean} looped Whether or not the animation should be looped
   */
  constructor(
    spritesheet,
    start,
    size,
    frameCount,
    frameDuration,
    looped = true,
    reversed = false
  ) {
    /** The path to the spritesheet that this specific Animator instance is going to be working with. */
    this.spritesheet = spritesheet;
    /** The starting position (on the SPRITESHEET!) of the first sprite of the animation. */
    this.start = reversed
      ? Vector.add(start, new Vector(frameCount * size.x, 0))
      : start;
    /** The size in pixels of the sprites in this animation. */
    this.size = size;
    /** The number of frames that are included in this animation. */
    this.frameCount = frameCount;
    /** The amount of time (in SECONDS!) between each change in frame. */
    this.frameDuration = frameDuration;
    /** The amount of time which has elapsed since animation started. */
    this.elapsedTime = 0;
    /** The total amount of time that it takes to finish a single runthrough of an animation (no repeats!). */
    this.totalTime = frameCount * frameDuration;
    /** The frame the animator is currently displaying */
    this.currentFrame = 0;

    this.looped = looped;
    this.reversed = reversed;
  }

  /**
   * This method is going to draw the appropriate frame on the Canvas (to which ctx belongs to).
   * @param {Vector} pos The position (of the CANVAS!) at which we'd like our sprite to be drawn.
   * @param {number|Vector} scale How much the image should be scaled when drawing. 1 pixel on the spritesheet = (scale x scale) pixels on the canvas.
   */
  drawFrame(pos, scale) {
    if (GAME.running) {
      this.elapsedTime += GAME.clockTick;
    }

    if (this.elapsedTime > this.totalTime) {
      // The animation has completed
      if (this.looped) {
        this.elapsedTime -= this.totalTime;
        this.currentFrame = 0; // Reset current frame at the start of the loop
      } else {
        this.currentFrame = this.frameCount - 1; // Set current frame to the last frame if not looping
      }
    } else {
      // The animation is still running
      this.currentFrame = Math.floor(this.elapsedTime / this.frameDuration);
    }

    // if scale is a vector, use it as a scale vector, otherwise use it as a uniform scale
    if (typeof scale === 'number') {
      scale = new Vector(scale, scale);
    }

    CTX.drawImage(
      ASSET_MGR.getAsset(this.spritesheet),
      this.start.x + (this.reversed ? -1 : 1) * this.size.x * this.currentFrame,
      this.start.y,
      this.size.x,
      this.size.y,
      pos.x,
      pos.y,
      this.size.x * scale.x,
      this.size.y * scale.y
    );
  }

  /**
   * @returns True if this animation has been completed; else false.
   */
  isDone() {
    return this.elapsedTime >= this.totalTime;
  }
}
