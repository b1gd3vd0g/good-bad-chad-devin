/**
 * A SonicWave is a basic type of projectile that has no weight.
 * 
 * @author Nathan Hinthorne
 */
class SonicWave {
    /**
     * @param {Vector} startPos The starting position of the SonicWave.
     * @param {Vector} targetPos The target position of the SonicWave.
     */
    constructor(startPos, targetPos) {
        this.base = new ProjectileBase(
            this,
            startPos,
            targetPos,
            SonicWave.SCALED_SIZE,
            SonicWave.INITIAL_SPEED,
            SonicWave.WEIGHT,
            (block) => this.onBlockCollision(block),
            (enemy) => this.onEnemyCollision(enemy),
            (player) => this.onPlayerCollision(player)
        );

        this.animations = [];
        this.loadAnimations();

        this.aliveTimer = 0;
        this.action = "firing";
        this.facing = "right";

        ASSET_MGR.playSFX(SFX.SONIC_WAVE.path, SFX.SONIC_WAVE.volume);
    }

    /** The size, in pixels, of the SonicWave on its spritesheet. */
    static get SIZE() {
        return new Vector(32, 32);
    }

    /** The scale factor applied to the SonicWave when drawing. */
    static get SCALE() {
        return 3.5;
    }

    /** The size, in pixels, of the SonicWave on the canvas. */
    static get SCALED_SIZE() {
        return Vector.multiply(SonicWave.SIZE, SonicWave.SCALE);
    }

    /** The speed of the SonicWave projectile as flies through the air */
    static get INITIAL_SPEED() {
        return 4;
    }

    /** The weight of the SonicWave. */
    static get WEIGHT() {
        return 0;
    }

    /** The amount of time the wave will stay alive after firing */
    static get ALIVE_TIME() {
        return 10;
    }

    /** The file path to the SonicWave's spritesheet. */
    static get SPRITESHEET() {
        return "./sprites/projectile_sonic_wave.png";
    }

    static get DAMAGE() {
        return 0;
    }

    /** Called when the wave collides with a block. */
    onBlockCollision(block) {
        this.removeFromWorld = true;
    }

    /** Called when the wave collides with an enemy. */
    onEnemyCollision(enemy) {
        // do nothing
    }

    /** Called when the wave collides with the player. */
    onPlayerCollision(player) {
        if (!this.hasHit) {
            player.takeDamage(SonicWave.DAMAGE);
            player.knockback(this.dir, 30);

            this.hasHit = true;
            this.removeFromWorld = true;
        }
    }

    loadAnimations() {
        this.animations["firing"] = [];

        this.animations["firing"]["right"] = new Animator(
            SonicWave.SPRITESHEET, 
            new Vector(0, SonicWave.SIZE.y * 0), 
            SonicWave.SIZE, 2, 0.5); // 0 degree angle

        this.animations["firing"]["rightDown"] = new Animator(
            SonicWave.SPRITESHEET, 
            new Vector(0, SonicWave.SIZE.y * 1), 
            SonicWave.SIZE, 2, 0.5); // 45 degree angle

        this.animations["firing"]["down"] = new Animator(
            SonicWave.SPRITESHEET, 
            new Vector(0, SonicWave.SIZE.y * 2), 
            SonicWave.SIZE, 2, 0.5); // 90 degree angle

        this.animations["firing"]["leftDown"] = new Animator(
            SonicWave.SPRITESHEET, 
            new Vector(0, SonicWave.SIZE.y * 3), 
            SonicWave.SIZE, 2, 0.5); // 135 degree angle

        this.animations["firing"]["left"] = new Animator(
            SonicWave.SPRITESHEET, 
            new Vector(0, SonicWave.SIZE.y * 4), 
            SonicWave.SIZE, 2, 0.5); // 180 degree angle

        this.animations["firing"]["leftUp"] = new Animator(
            SonicWave.SPRITESHEET, 
            new Vector(0, SonicWave.SIZE.y * 5), 
            SonicWave.SIZE, 2, 0.5); // 225 degree angle

        this.animations["firing"]["up"] = new Animator(
            SonicWave.SPRITESHEET,
            new Vector(0, SonicWave.SIZE.y * 6), 
            SonicWave.SIZE, 2, 0.5); // 270 degree angle

        this.animations["firing"]["rightUp"] = new Animator(
            SonicWave.SPRITESHEET, 
            new Vector(0, SonicWave.SIZE.y * 7), 
            SonicWave.SIZE, 2, 0.5); // 315 degree angle
    }

    update() {
        this.base.update();

        this.aliveTimer += GAME.clockTick;
        if (this.aliveTimer >= SonicWave.ALIVE_TIME) {
            this.removeFromWorld = true;
        }

        if (this.action == "firing" && !this.hasHit && GAME.gameTime % 0.1 < 0.01) {
            // release particle trail
            const center = Vector.add(this.pos, Vector.divide(SonicWave.SCALED_SIZE, 2));
            GAME.addEntity(new ParticleEffect(center, ParticleEffect.WAVE_TRAIL));
        }
    }

    draw() {
        this.animations[this.action][this.facing].drawFrame(Vector.worldToCanvasSpace(this.pos), SonicWave.SCALE);
    }
}