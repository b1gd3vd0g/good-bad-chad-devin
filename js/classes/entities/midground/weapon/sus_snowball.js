/**
 * A SusSnowball is a type of projectile that sticks to blocks and enemies.
 * 
 * @author Nathan Hinthorne
 */
class SusSnowball {
    /**
     * @param {Vector} startPos The starting position of the SusSnowball.
     * @param {Vector} targetPos The target position of the SusSnowball.
     */
    constructor(startPos, targetPos) {
        this.base = new ProjectileBase(
            this,
            startPos,
            targetPos,
            SusSnowball.SCALED_SIZE,
            SusSnowball.INITIAL_SPEED,
            SusSnowball.WEIGHT,
            (block) => this.onBlockCollision(block),
            (enemy) => this.onEnemyCollision(enemy),
            (player) => this.onPlayerCollision(player)
        );

        this.animations = [];
        this.loadAnimations();

        this.aliveTimer = 0;
        this.action = "firing";
    }

    /** The size, in pixels, of the SusSnowball on its spritesheet. */
    static get SIZE() {
        return new Vector(27, 27);
    }

    /** The scale factor applied to the SusSnowball when drawing. */
    static get SCALE() {
        return 1.1;
    }

    /** The size, in pixels, of the SusSnowball on the canvas. */
    static get SCALED_SIZE() {
        return Vector.multiply(SusSnowball.SIZE, SusSnowball.SCALE);
    }

    /** The speed of the SusSnowball projectile as flies through the air */
    static get INITIAL_SPEED() {
        return 11;
    }

    /** The weight of the SusSnowball. */
    static get WEIGHT() {
        return 0.02;
    }

    /** The file path to the SusSnowball's spritesheet. */
    static get SPRITESHEET() {
        return "./sprites/projectile_sus_snowball.png";
    }

    static get ALIVE_TIME() {
        return 2;
    }

    /** Called when the sus snowball collides with a block. */
    onBlockCollision(block) {
        // checkBlockCollisions() is NOT stopping the sus snowball's movement, but rather resetting its yVelocity to 0.
        // This produces a slight bounce effect, but only when the sus snowball was launched upward and on its way down, NOT when Chad is aiming downward.
        const collisions = checkBlockCollisions(this, SusSnowball.SCALED_SIZE);
        this.speed = 0; // reduce speed after each bounce

        if (!this.hasHit) {
            if (Math.random() < 0.5) {
                ASSET_MGR.playSFX(SFX.SNOW_CRUNCH1.path, SFX.SNOW_CRUNCH1.volume);
            } else {
                ASSET_MGR.playSFX(SFX.SNOW_CRUNCH2.path, SFX.SNOW_CRUNCH2.volume);
            }
            
            // release a particle effect
            const center = Vector.add(this.pos, Vector.divide(SusSnowball.SCALED_SIZE, 2));
            GAME.addEntity(new ParticleEffect(center, ParticleEffect.SNOW_SPLAT));
            
            this.hasHit = true;
            this.action = "landed";
        }
    }

    /** Called when the sus snowball collides with an enemy. */
    onEnemyCollision(enemy) {
        if (!this.hasHit) {
            if (Math.random() < 0.5) {
                ASSET_MGR.playSFX(SFX.SNOW_CRUNCH1.path, SFX.SNOW_CRUNCH1.volume);
            } else {
                ASSET_MGR.playSFX(SFX.SNOW_CRUNCH2.path, SFX.SNOW_CRUNCH2.volume);
            }

            enemy.statusEffect.apply(StatusEffect.POISONED);            
            
            this.hasHit = true;
            this.removeFromWorld = true;
        }
    }

    /** Called when the sus snowball collides with the player. */
    onPlayerCollision(player) {
        // do nothing
    }

    loadAnimations() {
        this.animations["firing"] = new Animator(SusSnowball.SPRITESHEET, new Vector(0, 0), SusSnowball.SIZE, 1, 0.5); // idle, moving through air
        this.animations["landed"] = new Animator(SusSnowball.SPRITESHEET, new Vector(SusSnowball.SIZE.x, 0), SusSnowball.SIZE, 1, 0.5); // landing, squishing
    }

    update() {
        this.base.update();

        if (this.hasHit) {
            this.aliveTimer += GAME.clockTick;
            if (this.aliveTimer >= SusSnowball.ALIVE_TIME) {
                this.removeFromWorld = true;

                // spawn a sus snowball ammo drop on the ground because Chad missed
                const dropPos = Vector.add(this.pos, new Vector(0, -60));
                if (Math.random())
                GAME.addEntity(new AmmoDrop(dropPos, AmmoDrop.SUS_SNOWBALL));
            }
        }

        if (this.action == "firing" && !this.hasHit && GAME.gameTime % 0.1 < 0.01) {
            // release particle trail
            const center = Vector.add(this.pos, Vector.divide(SusSnowball.SCALED_SIZE, 2));
            GAME.addEntity(new ParticleEffect(center, ParticleEffect.WIND_TRAIL));
        }
    }

    draw() {
        this.animations[this.action].drawFrame(Vector.worldToCanvasSpace(this.pos), SusSnowball.SCALE);
    }
}