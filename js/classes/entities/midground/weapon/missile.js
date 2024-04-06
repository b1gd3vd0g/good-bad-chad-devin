/**
 * A Missile is a basic type of projectile that has no weight.
 * 
 * @author Nathan Hinthorne
 */
class Missile {
    /**
     * @param {Vector} startPos The starting position of the Missile.
     * @param {Vector} targetPos The target position of the Missile.
     */
    constructor(startPos, targetPos) {
        this.base = new ProjectileBase(
            this,
            startPos,
            targetPos,
            Missile.SCALED_SIZE,
            Missile.INITIAL_SPEED,
            Missile.WEIGHT,
            (block) => this.onBlockCollision(block),
            (enemy) => this.onEnemyCollision(enemy),
            (player) => this.onPlayerCollision(player)
        );

        this.animations = [];
        this.loadAnimations();

        this.aliveTimer = 0;
        this.action = "firing";
        this.facing = "right";

        ASSET_MGR.playSFX(SFX.MISSILE_LAUNCH.path, SFX.MISSILE_LAUNCH.volume);
    }

    /** The size, in pixels, of the Missile on its spritesheet. */
    static get SIZE() {
        return new Vector(42, 42);
    }

    /** The scale factor applied to the Missile when drawing. */
    static get SCALE() {
        return 2;
    }

    /** The size, in pixels, of the Missile on the canvas. */
    static get SCALED_SIZE() {
        return Vector.multiply(Missile.SIZE, Missile.SCALE);
    }

    /** The speed of the Missile projectile as flies through the air */
    static get INITIAL_SPEED() {
        return 2.5;
    }

    /** The weight of the Missile. */
    static get WEIGHT() {
        return 0;
    }

    /** The amount of time the missile will stay alive after firing */
    static get ALIVE_TIME() {
        return 10;
    }

    /** The file path to the Missile's spritesheet. */
    static get SPRITESHEET() {
        return "./sprites/projectile_missile.png";
    }

    static get DAMAGE() {
        return 12;
    }

    /** Called when the missile collides with a block. */
    onBlockCollision(block) {
        if (!this.hasHit) {
            this.hasHit = true;
            this.explode();        
        }
    }

    /** Called when the missile collides with an enemy. */
    onEnemyCollision(enemy) {
        // do nothing
    }

    /** Called when the missile collides with the player. */
    onPlayerCollision(player) {
        if (!this.hasHit) {
            this.hasHit = true;
            this.explode();
        }
    }

    explode() {
        ASSET_MGR.playSFX(SFX.EXPLOSION_BIG.path, SFX.EXPLOSION_BIG.volume);
        GAME.addEntity(new ParticleEffect(this.pos, ParticleEffect.MISSILE_EXPLOSION));

        // deal damage to nearby enemies
        // NOTE: Yes, we could just expand the bomb's bounding box. I realized that after I implemented the getNearbyEntities function.
        const nearbyEntities = getNearbyEntities(this.pos, 100);
        for (const entity of nearbyEntities) {
            if (entity == CHAD) { // ensure entity has a takeDamage method
                entity.takeDamage(Missile.DAMAGE);
            }
        }

        this.removeFromWorld = true;
    }

    loadAnimations() {
        this.animations["firing"] = [];

        this.animations["firing"]["right"] = new Animator(
            Missile.SPRITESHEET, 
            new Vector(0, Missile.SIZE.y * 0), 
            Missile.SIZE, 2, 0.5); // 0 degree angle

        this.animations["firing"]["rightDown"] = new Animator(
            Missile.SPRITESHEET, 
            new Vector(0, Missile.SIZE.y * 1), 
            Missile.SIZE, 2, 0.5); // 45 degree angle

        this.animations["firing"]["down"] = new Animator(
            Missile.SPRITESHEET, 
            new Vector(0, Missile.SIZE.y * 2), 
            Missile.SIZE, 2, 0.5); // 90 degree angle

        this.animations["firing"]["leftDown"] = new Animator(
            Missile.SPRITESHEET, 
            new Vector(0, Missile.SIZE.y * 3), 
            Missile.SIZE, 2, 0.5); // 135 degree angle

        this.animations["firing"]["left"] = new Animator(
            Missile.SPRITESHEET, 
            new Vector(0, Missile.SIZE.y * 4), 
            Missile.SIZE, 2, 0.5); // 180 degree angle

        this.animations["firing"]["leftUp"] = new Animator(
            Missile.SPRITESHEET, 
            new Vector(0, Missile.SIZE.y * 5), 
            Missile.SIZE, 2, 0.5); // 225 degree angle

        this.animations["firing"]["up"] = new Animator(
            Missile.SPRITESHEET,
            new Vector(0, Missile.SIZE.y * 6), 
            Missile.SIZE, 2, 0.5); // 270 degree angle

        this.animations["firing"]["rightUp"] = new Animator(
            Missile.SPRITESHEET, 
            new Vector(0, Missile.SIZE.y * 7), 
            Missile.SIZE, 2, 0.5); // 315 degree angle
    }

    update() {
        this.base.update();

        this.aliveTimer += GAME.clockTick;
        if (this.aliveTimer >= Missile.ALIVE_TIME) {
            this.removeFromWorld = true;
        }

        if (this.action == "firing" && !this.hasHit && GAME.gameTime % 0.1 < 0.01) {
            // release particle trail
            const center = Vector.add(this.pos, Vector.divide(Missile.SCALED_SIZE, 2));
            GAME.addEntity(new ParticleEffect(center, ParticleEffect.WIND_TRAIL));
        }
    }

    draw() {
        this.animations[this.action][this.facing].drawFrame(Vector.worldToCanvasSpace(this.pos), Missile.SCALE);
    }
}