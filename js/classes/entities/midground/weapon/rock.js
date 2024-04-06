/**
 * A Rock is a type of projectile that hits an enemy and can bounce off of blocks.
 * 
 * @author Nathan Hinthorne
 */
class Rock {
    /**
     * @param {Vector} startPos The starting position of the Rock.
     * @param {Vector} targetPos The target position of the Rock.
     */
    constructor(startPos, targetPos) {
        this.base = new ProjectileBase(
            this,
            startPos,
            targetPos,
            Rock.SCALED_SIZE,
            Rock.INITIAL_SPEED,
            Rock.WEIGHT,
            (block) => this.onBlockCollision(block),
            (enemy) => this.onEnemyCollision(enemy),
            (player) => this.onPlayerCollision(player)
        );

        this.animations = [];
        this.loadAnimations();

        this.aliveTimer = 0;
        this.action = "firing";
    }

    /** The size, in pixels, of the Rock on its spritesheet. */
    static get SIZE() {
        return new Vector(26, 30);
    }

    static get SIZE_EASTER_EGG() {
        return new Vector(75, 75);
    }

    /** The scale factor applied to the Rock when drawing. */
    static get SCALE() {
        return 0.9;
    }

    /** The size, in pixels, of the Rock on the canvas. */
    static get SCALED_SIZE() {
        return Vector.multiply(Rock.SIZE, Rock.SCALE);
    }

    /** The speed of the Rock projectile as flies through the air */
    static get INITIAL_SPEED() {
        return 14;
    }

    /** The weight of the Rock. */
    static get WEIGHT() {
        return 0.02;
    }

    /** The file path to the Rock's spritesheet. */
    static get SPRITESHEET() {
        return "./sprites/projectile_rock.png";
    }

    /** The file path to the Rock's easter egg spritesheet. */
    static get SPRITESHEET_EASTER_EGG() {
        return "./sprites/projectile_the_rock.png";
    }

    static get BOUNCINESS() {
        return 0.8;
    }

    static get ALIVE_TIME() {
        return 3;
    }

    static get DAMAGE() {
        return 7;
    }

    /** Called when the rock collides with a block. */
    onBlockCollision(block) {
        // checkBlockCollisions() is NOT stopping the rock's movement, but rather resetting its yVelocity to 0.
        // This produces a slight bounce effect, but only when the rock was launched upward and on its way down, NOT when Chad is aiming downward.
        // the upward movement is caused by the projectile's direction given by its target coordinates at intialization.
        this.speed *= Rock.BOUNCINESS; // reduce speed after each bounce
        const collisions = checkBlockCollisions(this, Rock.SCALED_SIZE);

        if (!this.hasHit) {
            ASSET_MGR.playSFX(SFX.RICOCHET2.path, SFX.RICOCHET2.volume);
            // release a particle effect
            const center = Vector.add(this.pos, Vector.divide(Rock.SCALED_SIZE, 2));
            GAME.addEntity(new ParticleEffect(center, ParticleEffect.BIG_DUST));

            this.hasHit = true;
        }

    }

    /** Called when the rock collides with an enemy. */
    onEnemyCollision(enemy) {
        if (!this.hasHit) {
            ASSET_MGR.playSFX(SFX.RICOCHET2.path, SFX.RICOCHET2.volume);
            enemy.takeDamage(Rock.DAMAGE);

            this.hasHit = true;
            this.removeFromWorld = true;
        }
    }

    /** Called when the rock collides with the player. */
    onPlayerCollision(player) {
        // do nothing
    }

    loadAnimations() {
        if (Math.random() < 0.03) {
            this.animations["firing"] = new Animator(Rock.SPRITESHEET_EASTER_EGG, new Vector(0, 0), Rock.SIZE_EASTER_EGG, 1, 0.5); // idle, moving through air
        } else {
            this.animations["firing"] = new Animator(Rock.SPRITESHEET, new Vector(0, 0), Rock.SIZE, 1, 0.5); // idle, moving through air
        }
    }

    update() {
        this.base.update();

        if (this.hasHit) {
            this.aliveTimer += GAME.clockTick;
            if (this.aliveTimer >= Rock.ALIVE_TIME) {
                this.removeFromWorld = true;

                // spawn a rock on the ground because chad missed
                const dropPos = Vector.add(this.pos, new Vector(0, -60));
                GAME.addEntity(new AmmoDrop(dropPos, AmmoDrop.ROCK));
            }
        }

        if (this.action == "firing" && !this.hasHit && GAME.gameTime % 0.1 < 0.01) {
            // release particle trail
            const center = Vector.add(this.pos, Vector.divide(Rock.SCALED_SIZE, 2));
            GAME.addEntity(new ParticleEffect(center, ParticleEffect.WIND_TRAIL));
        }


    }

    draw() {
        this.animations[this.action].drawFrame(Vector.worldToCanvasSpace(this.pos), Rock.SCALE);
    }
}