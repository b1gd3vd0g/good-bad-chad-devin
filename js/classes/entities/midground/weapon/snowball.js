/**
 * A Snowball is a type of projectile that sticks to the ground and deals damage to enemies.
 * 
 * @author Nathan Hinthorne
 */
class Snowball {
    /**
     * @param {Vector} startPos The starting position of the Snowball.
     * @param {Vector} targetPos The target position of the Snowball.
     */
    constructor(startPos, targetPos) {
        this.base = new ProjectileBase(
            this,
            startPos,
            targetPos,
            Snowball.SCALED_SIZE,
            Snowball.INITIAL_SPEED,
            Snowball.WEIGHT,
            (block) => this.onBlockCollision(block),
            (enemy) => this.onEnemyCollision(enemy),
            (player) => this.onPlayerCollision(player)
        );

        this.animations = [];
        this.loadAnimations();

        this.aliveTimer = 0;
        this.action = "firing";
    }

    /** The size, in pixels, of the Snowball on its spritesheet. */
    static get SIZE() {
        return new Vector(27, 27);
    }

    /** The scale factor applied to the Snowball when drawing. */
    static get SCALE() {
        return 1.1;
    }

    /** The size, in pixels, of the Snowball on the canvas. */
    static get SCALED_SIZE() {
        return Vector.multiply(Snowball.SIZE, Snowball.SCALE);
    }

    /** The speed of the Snowball projectile as flies through the air */
    static get INITIAL_SPEED() {
        return 11;
    }

    /** The weight of the Snowball. */
    static get WEIGHT() {
        return 0.02;
    }

    /** The file path to the Snowball's spritesheet. */
    static get SPRITESHEET() {
        return "./sprites/projectile_snowball.png";
    }

    static get ALIVE_TIME() {
        return 2;
    }

    static get DAMAGE() {
        return 10;
    }

    /** Called when the snowball collides with a block. */
    onBlockCollision(block) {
        // checkBlockCollisions() is NOT stopping the snowball's movement, but rather resetting its yVelocity to 0.
        // This produces a slight bounce effect, but only when the snowball was launched upward and on its way down, NOT when Chad is aiming downward.
        const collisions = checkBlockCollisions(this, Snowball.SCALED_SIZE);
        this.speed = 0; // reduce speed after each bounce

        if (!this.hasHit) {
            if (Math.random() < 0.5) {
                ASSET_MGR.playSFX(SFX.SNOW_CRUNCH1.path, SFX.SNOW_CRUNCH1.volume);
            } else {
                ASSET_MGR.playSFX(SFX.SNOW_CRUNCH2.path, SFX.SNOW_CRUNCH2.volume);
            }
            
            // release a particle effect
            const center = Vector.add(this.pos, Vector.divide(Snowball.SCALED_SIZE, 2));
            GAME.addEntity(new ParticleEffect(center, ParticleEffect.SNOW_SPLAT));
            
            this.hasHit = true;
            this.action = "landed";
        }
    }

    /** Called when the snowball collides with an enemy. */
    onEnemyCollision(enemy) {
        if (!this.hasHit) {
            if (Math.random() < 0.5) {
                ASSET_MGR.playSFX(SFX.SNOW_CRUNCH1.path, SFX.SNOW_CRUNCH1.volume);
            } else {
                ASSET_MGR.playSFX(SFX.SNOW_CRUNCH2.path, SFX.SNOW_CRUNCH2.volume);
            }
            enemy.takeDamage(Snowball.DAMAGE);
            
            this.hasHit = true;
            this.removeFromWorld = true;
        }
    }

    /** Called when the snowball collides with the player. */
    onPlayerCollision(player) {
        // do nothing
    }

    loadAnimations() {
        this.animations["firing"] = new Animator(Snowball.SPRITESHEET, new Vector(0, 0), Snowball.SIZE, 1, 0.5); // idle, moving through air
        this.animations["landed"] = new Animator(Snowball.SPRITESHEET, new Vector(Snowball.SIZE.x, 0), Snowball.SIZE, 1, 0.5); // landing, squishing
    }

    update() {
        this.base.update();

        if (this.hasHit) {
            this.aliveTimer += GAME.clockTick;
            if (this.aliveTimer >= Snowball.ALIVE_TIME) {
                this.removeFromWorld = true;

                // spawn a snowball ammo drop on the ground because Chad missed
                const dropPos = Vector.add(this.pos, new Vector(0, -60));
                GAME.addEntity(new AmmoDrop(dropPos, AmmoDrop.SNOWBALL));
            }
        }

        if (this.action == "firing" && !this.hasHit && GAME.gameTime % 0.1 < 0.01) {
            // release particle trail
            const center = Vector.add(this.pos, Vector.divide(Snowball.SCALED_SIZE, 2));
            GAME.addEntity(new ParticleEffect(center, ParticleEffect.WIND_TRAIL));
        }
    }

    draw() {
        this.animations[this.action].drawFrame(Vector.worldToCanvasSpace(this.pos), Snowball.SCALE);
    }
}