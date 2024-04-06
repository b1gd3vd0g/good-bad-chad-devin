/**
 * A Laser is a basic type of projectile that has no weight.
 * 
 * @author Nathan Hinthorne
 */
class Laser {
    /**
     * @param {Vector} startPos The starting position of the Laser.
     * @param {Vector} targetPos The target position of the Laser.
     */
    constructor(startPos, targetPos) {
        this.base = new ProjectileBase(
            this,
            startPos,
            targetPos,
            Laser.SCALED_SIZE,
            Laser.INITIAL_SPEED,
            Laser.WEIGHT,
            (block) => this.onBlockCollision(block),
            (enemy) => this.onEnemyCollision(enemy),
            (player) => this.onPlayerCollision(player)
        );

        this.animations = [];
        this.loadAnimations();

        this.aliveTimer = 0;
        this.action = "firing";
        this.facing = "right";

        ASSET_MGR.playSFX(SFX.LASER_FIRE.path, SFX.LASER_FIRE.volume);
    }

    /** The size, in pixels, of the Laser on its spritesheet. */
    static get SIZE() {
        return new Vector(32, 32);
    }

    /** The scale factor applied to the Laser when drawing. */
    static get SCALE() {
        return 2.5;
    }

    /** The size, in pixels, of the Laser on the canvas. */
    static get SCALED_SIZE() {
        return Vector.multiply(Laser.SIZE, Laser.SCALE);
    }

    /** The speed of the Laser projectile as flies through the air */
    static get INITIAL_SPEED() {
        return 6;
    }

    /** The weight of the Laser. */
    static get WEIGHT() {
        return 0;
    }

    /** The amount of time the laser will stay alive after firing */
    static get ALIVE_TIME() {
        return 7;
    }

    /** The file path to the Laser's spritesheet. */
    static get SPRITESHEET() {
        return "./sprites/projectile_laser_yellow.png";
    }

    static get DAMAGE() {
        return 7;
    }

    /** Called when the laser collides with a block. */
    onBlockCollision(block) {
        this.removeFromWorld = true;
    }

    /** Called when the laser collides with an enemy. */
    onEnemyCollision(enemy) {
        // do nothing
    }

    /** Called when the laser collides with the player. */
    onPlayerCollision(player) {
        if (!this.hasHit) {
            player.takeDamage(Laser.DAMAGE);
            this.hasHit = true;
            this.removeFromWorld = true;
        }
    }

    loadAnimations() {
        this.animations["firing"] = [];

        this.animations["firing"]["right"] = new Animator(
            Laser.SPRITESHEET, 
            new Vector(0, Laser.SIZE.y * 0), 
            Laser.SIZE, 1, 0.5); // 0 degree angle

        this.animations["firing"]["rightDown"] = new Animator(
            Laser.SPRITESHEET, 
            new Vector(0, Laser.SIZE.y * 1), 
            Laser.SIZE, 1, 0.5); // 45 degree angle

        this.animations["firing"]["down"] = new Animator(
            Laser.SPRITESHEET, 
            new Vector(0, Laser.SIZE.y * 2), 
            Laser.SIZE, 1, 0.5); // 90 degree angle

        this.animations["firing"]["leftDown"] = new Animator(
            Laser.SPRITESHEET, 
            new Vector(0, Laser.SIZE.y * 3), 
            Laser.SIZE, 1, 0.5); // 135 degree angle

        this.animations["firing"]["left"] = new Animator(
            Laser.SPRITESHEET, 
            new Vector(0, Laser.SIZE.y * 4), 
            Laser.SIZE, 1, 0.5); // 180 degree angle

        this.animations["firing"]["leftUp"] = new Animator(
            Laser.SPRITESHEET, 
            new Vector(0, Laser.SIZE.y * 5), 
            Laser.SIZE, 1, 0.5); // 225 degree angle

        this.animations["firing"]["up"] = new Animator(
            Laser.SPRITESHEET,
            new Vector(0, Laser.SIZE.y * 6), 
            Laser.SIZE, 1, 0.5); // 270 degree angle

        this.animations["firing"]["rightUp"] = new Animator(
            Laser.SPRITESHEET, 
            new Vector(0, Laser.SIZE.y * 7), 
            Laser.SIZE, 1, 0.5); // 315 degree angle
    }

    update() {
        this.base.update();

        this.aliveTimer += GAME.clockTick;
        if (this.aliveTimer >= Laser.ALIVE_TIME) {
            this.removeFromWorld = true;
        }

        if (this.action == "firing" && !this.hasHit && GAME.gameTime % 0.1 < 0.01) {
            // release particle trail
            const center = Vector.add(this.pos, Vector.divide(Laser.SCALED_SIZE, 2));
            GAME.addEntity(new ParticleEffect(center, ParticleEffect.YELLOW_LASER_TRAIL));
        }
    }

    draw() {
        this.animations[this.action][this.facing].drawFrame(Vector.worldToCanvasSpace(this.pos), Laser.SCALE);
    }
}