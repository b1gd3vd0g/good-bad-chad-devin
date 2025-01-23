/**
 * A WaterBalloon is a type of projectile that hits an enemy and can bounce off of blocks.
 * 
 * @author Nathan Hinthorne
 */
class WaterBalloon {
    /**
     * @param {Vector} startPos The starting position of the WaterBalloon.
     * @param {Vector} targetPos The target position of the WaterBalloon.
     */
    constructor(startPos, targetPos) {
        this.base = new ProjectileBase(
            this,
            startPos,
            targetPos,
            WaterBalloon.SCALED_SIZE,
            WaterBalloon.INITIAL_SPEED,
            WaterBalloon.WEIGHT,
            (block) => this.onBlockCollision(block),
            (enemy) => this.onEnemyCollision(enemy),
            (player) => this.onPlayerCollision(player)
        );

        this.animations = [];
        this.loadAnimations();

        this.aliveTimer = 0;
        this.action = "firing";
    }

    /** The size, in pixels, of the WaterBalloon on its spritesheet. */
    static get SIZE() {
        return new Vector(32, 32);
    }

    /** The scale factor applied to the WaterBalloon when drawing. */
    static get SCALE() {
        return 1.8;
    }

    /** The size, in pixels, of the WaterBalloon on the canvas. */
    static get SCALED_SIZE() {
        return Vector.multiply(WaterBalloon.SIZE, WaterBalloon.SCALE);
    }

    /** The speed of the WaterBalloon projectile as flies through the air */
    static get INITIAL_SPEED() {
        return 14;
    }

    /** The weight of the WaterBalloon. */
    static get WEIGHT() {
        return 0.04;
    }

    /** The file path to the WaterBalloon's spritesheet. */
    static get SPRITESHEET() {
        return "./sprites/projectile_water_balloon.png";
    }

    static get DAMAGE() {
        return 12;
    }

    static get ALIVE_TIME_AFTER_HIT() {
        return 0.2;
    }

    /** Called when the waterballoon collides with a block. */
    onBlockCollision(block) {
        // checkBlockCollisions() is NOT stopping the waterballoon's movement, but rather resetting its yVelocity to 0.
        // This produces a slight bounce effect, but only when the waterballoon was launched upward and on its way down, NOT when Chad is aiming downward.
        const collisions = checkBlockCollisions(this, WaterBalloon.SCALED_SIZE);

        this.explode();
    }

    /** Called when the waterballoon collides with an enemy. */
    onEnemyCollision(enemy) {
        this.explode();
    }

    /** Called when the waterballoon collides with the player. */
    onPlayerCollision(player) {
        // do nothing
    }

    explode() {
        if (this.hasHit) return;
        // release a particle effect
        const center = Vector.add(this.pos, Vector.divide(WaterBalloon.SCALED_SIZE, 2));
        GAME.addEntity(new ParticleEffect(center, ParticleEffect.WATER_EXPLOSION));
        ASSET_MGR.playSFX(SFX.WATER_BALLOON.path, SFX.WATER_BALLOON.volume);
        
        const nearbyEntities = getNearbyEntities(this.pos, 120);
        for (const entity of nearbyEntities) {
            if (entity.takeDamage && entity != CHAD) {
                entity.takeDamage(WaterBalloon.DAMAGE);
            }
        }

        this.action = "exploding";
        this.speed = 0;
        this.hasHit = true;
    }

    loadAnimations() {
        this.animations["firing"] = new Animator(WaterBalloon.SPRITESHEET, new Vector(0, 0), WaterBalloon.SIZE, 1, 0.5); // idle, moving through air
        this.animations["exploding"] = new Animator(WaterBalloon.SPRITESHEET, new Vector(WaterBalloon.SIZE.x, 0), WaterBalloon.SIZE, 2, 0.1, false); // flashes white then red
    }

    update() {
        this.base.update();

        if (this.hasHit) {
            this.aliveTimer += GAME.clockTick;

            if (this.aliveTimer > WaterBalloon.ALIVE_TIME_AFTER_HIT) {
                this.removeFromWorld = true;
            }
        }

        if (this.action == "firing" && !this.hasHit && GAME.gameTime % 0.1 < 0.01) {
            // release particle trail
            const center = Vector.add(this.pos, Vector.divide(WaterBalloon.SCALED_SIZE, 2));
            GAME.addEntity(new ParticleEffect(center, ParticleEffect.WIND_TRAIL));
        }
    }

    draw() {
        this.animations[this.action].drawFrame(Vector.worldToCanvasSpace(this.pos), WaterBalloon.SCALE);
    }
}