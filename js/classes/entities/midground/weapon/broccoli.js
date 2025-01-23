/**
 * A Broccoli is a type of projectile that causes enemies to change their stance to AVOID_STANCE, fleeing from Chad
 * 
 * @author Nathan Hinthorne
 */
class Broccoli {
    /**
     * @param {Vector} startPos The starting position of the Broccoli.
     * @param {Vector} targetPos The target position of the Broccoli.
     */
    constructor(startPos, targetPos) {
        this.base = new ProjectileBase(
            this,
            startPos,
            targetPos,
            Broccoli.SCALED_SIZE,
            Broccoli.INITIAL_SPEED,
            Broccoli.WEIGHT,
            (block) => this.onBlockCollision(block),
            (enemy) => this.onEnemyCollision(enemy),
            (player) => this.onPlayerCollision(player)
        );

        this.animations = [];
        this.loadAnimations();

        this.hasHitEnemy = false;

        this.aliveTimer = 0;
        this.action = "firing";
    }

    /** The size, in pixels, of the Broccoli on its spritesheet. */
    static get SIZE() {
        return new Vector(72, 78);
    }

    /** The scale factor applied to the Broccoli when drawing. */
    static get SCALE() {
        return 0.8;
    }

    /** The size, in pixels, of the Broccoli on the canvas. */
    static get SCALED_SIZE() {
        return Vector.multiply(Broccoli.SIZE, Broccoli.SCALE);
    }

    /** The speed of the Broccoli projectile as flies through the air */
    static get INITIAL_SPEED() {
        return 17;
    }

    /** The weight of the Broccoli. */
    static get WEIGHT() {
        return 0.03;
    }

    /** The file path to the Broccoli's spritesheet. */
    static get SPRITESHEET() {
        return "./sprites/projectile_broccoli.png";
    }

    static get BOUNCINESS() {
        return 0.8;
    }

    static get ALIVE_TIME() {
        return 2;
    }

    /** Called when the broccoli collides with a block. */
    onBlockCollision(block) {
        // checkBlockCollisions() is NOT stopping the broccoli's movement, but rather resetting its yVelocity to 0.
        // This produces a slight bounce effect, but only when the broccoli was launched upward and on its way down, NOT when Chad is aiming downward.
        const collisions = checkBlockCollisions(this, Broccoli.SCALED_SIZE);
        this.speed *= Broccoli.BOUNCINESS; // reduce speed after each bounce

        if (!this.hasHit) {
            ASSET_MGR.playSFX(SFX.RICOCHET2.path, SFX.RICOCHET2.volume);
            // release a particle effect
            const center = Vector.add(this.pos, Vector.divide(Broccoli.SCALED_SIZE, 2));
            GAME.addEntity(new ParticleEffect(center, ParticleEffect.BIG_DUST));

            this.hasHit = true;
        }

    }

    /** Called when the broccoli collides with an enemy. */
    onEnemyCollision(enemy) {
        if (!this.hasHitEnemy) {
            ASSET_MGR.playSFX(SFX.BLEH.path, SFX.BLEH.volume);
            console.log("Vile weed!");
            enemy.statusEffect.apply(StatusEffect.FLEEING);
            this.hasHitEnemy = true;
            this.removeFromWorld = true;
        }
    }

    /** Called when the broccoli collides with the player. */
    onPlayerCollision(player) {
        // do nothing
    }

    loadAnimations() {
        this.animations["firing"] = new Animator(Broccoli.SPRITESHEET, new Vector(0, 0), Broccoli.SIZE, 1, 0.5); // idle, moving through air
    }

    update() {
        this.base.update();

        if (this.hasHit) {
            this.aliveTimer += GAME.clockTick;
            if (this.aliveTimer >= Broccoli.ALIVE_TIME) {
                this.removeFromWorld = true;

                // spawn a broccoli ammo drop on the ground because Chad missed
                const dropPos = Vector.add(this.pos, new Vector(0, -60));
                GAME.addEntity(new AmmoDrop(dropPos, AmmoDrop.BROCCOLI));
            }
        }

        if (this.action == "firing" && !this.hasHit && GAME.gameTime % 0.1 < 0.01) {
            // release particle trail
            const center = Vector.add(this.pos, Vector.divide(Broccoli.SCALED_SIZE, 2));
            GAME.addEntity(new ParticleEffect(center, ParticleEffect.VEGGIE_TRAIL));
        }
    }

    draw() {
        this.animations[this.action].drawFrame(Vector.worldToCanvasSpace(this.pos), Broccoli.SCALE);
    }

}