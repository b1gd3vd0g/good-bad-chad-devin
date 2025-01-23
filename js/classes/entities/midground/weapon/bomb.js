/**
 * A Bomb is a type of projectile that explodes after a period of time, dealing damage to nearby entities.
 * 
 * @author Nathan Hinthorne
 */
class Bomb {
    /**
     * @param {Vector} startPos The starting position of the Bomb.
     * @param {Vector} targetPos The target position of the Bomb.
     */
    constructor(startPos, targetPos) {
        this.base = new ProjectileBase(
            this,
            startPos,
            targetPos,
            Bomb.SCALED_SIZE,
            Bomb.INITIAL_SPEED,
            Bomb.WEIGHT,
            (block) => this.onBlockCollision(block),
            (enemy) => this.onEnemyCollision(enemy),
            (player) => this.onPlayerCollision(player)
        );

        this.animations = [];
        this.loadAnimations();

        // this.numBounces = 0;

        // this.bounceTimer = 0;

        this.timer = 0;
        this.action = "firing";
    }

    /** The size, in pixels, of the Bomb on its spritesheet. */
    static get SIZE() {
        return new Vector(26, 30);
    }

    /** The scale factor applied to the Bomb when drawing. */
    static get SCALE() {
        return 2;
    }

    /** The size, in pixels, of the Bomb on the canvas. */
    static get SCALED_SIZE() {
        return Vector.multiply(Bomb.SIZE, Bomb.SCALE);
    }

    /** The speed of the Bomb projectile as flies through the air */
    static get INITIAL_SPEED() {
        return 11;
    }

    /** The weight of the Bomb. */
    static get WEIGHT() {
        return 0.06;
    }

    /** The file path to the Bomb's spritesheet. */
    static get SPRITESHEET() {
        return "./sprites/projectile_bomb.png";
    }

    /** The time it takes for a bomb to explode in seconds. */
    static get EXPLODE_TIME() {
        return 2.4;
    }

    static get BOUNCINESS() {
        return 0.8;
    }

    // static get MAX_BOUNCES() {
    //     return 2;
    // }

    // static get BOUNCE_TIME() {
    //     return 0.09;
    // }

    static get DAMAGE() {
        return 40;
    }

    /** Called when the bomb collides with a block. */
    onBlockCollision(block) {
        // checkBlockCollisions() is NOT stopping the bomb's movement, but rather resetting its yVelocity to 0.
        // This produces a slight bounce effect, but only when the bomb was launched upward and on its way down, NOT when CHAD is aiming downward.
        const collisions = checkBlockCollisions(this, Bomb.SCALED_SIZE, true);
        this.speed *= Bomb.BOUNCINESS; // reduce speed after each bounce

        // explode if the bomb has not already hit something
        if (!this.hasHit) {
            this.action = "exploding";
            this.hasHit = true;
        }

        //* 2ND APPROACH: TAKE FURTHER ACTION TO PRODUCE BOUNCING EFFECT (unnecessary at the moment)
        /*if (this.numBounces < Bomb.MAX_BOUNCES) {
        
            // bounce off the block
            if (collisions.top || collisions.bottom) {
                this.dir = Vector.reflect(this.dir, Vector.VERTICAL);
            } else if (collisions.left || collisions.right) {
                this.dir = Vector.reflect(this.dir, Vector.HORIZONTAL);
            }
            this.speed *= 0.8; // reduce speed after each bounce
            
            console.log("bounce!");
            this.numBounces++;
            this.applyGravity = false;
            this.action = "bouncing";

            setTimeout(() => {
                this.applyGravity = true;
            }, Bomb.BOUNCE_TIME * 1000);
        }*/
    }

    /** Called when the bomb collides with an enemy. */
    onEnemyCollision(enemy) {
        // do nothing?
    }

    /** Called when the bomb collides with the player. */
    onPlayerCollision(player) {
        // do nothing?
    }

    /** Explodes the bomb dealing damage to nearby entities. */
    explode() {
        ASSET_MGR.playSFX(SFX.EXPLOSION_SMALL.path, SFX.EXPLOSION_SMALL.volume);
        GAME.addEntity(new ParticleEffect(this.pos, ParticleEffect.SMALL_EXPLOSION));

        // deal damage to nearby enemies
        // NOTE: Yes, we could just expand the bomb's bounding box. I realized that after I implemented the getNearbyEntities function.
        const nearbyEntities = getNearbyEntities(this.pos, 165);
        for (const entity of nearbyEntities) {
            if (entity.takeDamage) { // ensure entity has a takeDamage method
                entity.takeDamage(Bomb.DAMAGE);
            }
        }
        this.removeFromWorld = true;
    }

    loadAnimations() {
        this.animations["firing"] = new Animator(Bomb.SPRITESHEET, new Vector(0, 0), Bomb.SIZE, 1, 0.5); // idle, moving through air
        this.animations["exploding"] = new Animator(Bomb.SPRITESHEET, new Vector(Bomb.SIZE.x, 0), Bomb.SIZE, 4, 0.5, false); // flashes white then red
    }

    update() {
        this.base.update();

        if (this.action == "exploding") {
            this.timer += GAME.clockTick;
            if (this.timer > Bomb.EXPLODE_TIME) {
                this.explode();
            }
        }

        if (this.action == "firing" && !this.hasHit && GAME.gameTime % 0.1 < 0.01) {
            // release particle trail
            const center = Vector.add(this.pos, Vector.divide(Bomb.SCALED_SIZE, 2));
            GAME.addEntity(new ParticleEffect(center, ParticleEffect.WIND_TRAIL));
        }

        //* 2ND APPROACH: TAKE FURTHER ACTION TO PRODUCE BOUNCING EFFECT (unnecessary at the moment)
        // if (this.action == "bouncing") {
        //     this.bounceTimer += GAME.clockTick;
        //     if (this.bounceTimer > Bomb.BOUNCE_TIME) {
        //         this.applyGravity = true;
        //         this.bounceTimer = 0;
        //         this.action = "firing";
        //         console.log("bounce over");
        //     }
        // }
    }

    draw() {
        this.animations[this.action].drawFrame(Vector.worldToCanvasSpace(this.pos), Bomb.SCALE);
    }

}