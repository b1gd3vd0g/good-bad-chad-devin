/** 
 * Overseer Bots are flying enemies that shoot missiles and sonic waves at Chad.
 * They have a shorter attack range than Oculi Bots, but have more health.
 * 
 * @author Nathan Hinthorne
 */
class OverseerBot {
    /**
     * Constructor for a OverseerBot.
     * 
     * @param {Vector} pos the position at which the OverseerBot should start
     * @param {Array<Vector>} path array of ordered Vectors that delineate the enemy's path
     */
    constructor(pos, path) {
        this.base = new FlyingEnemyBase(
            this,
            pos,
            OverseerBot.SCALED_SIZE,
            OverseerBot.SPEED,
            OverseerBot.MAX_HEALTH,
            () => this.handleDeath(),
            path
        );

        /** An associative array of the animations for this OverseerBot. Arranged [facing][action]. */
        this.animations = [];
        this.loadAnimations();

        this.lastAttack = 0;
        this.dealtDamage = false;
        this.action = "moving"
    };

    /** The size, in pixels, of the OverseerBot ON THE SPRITESHEET. */
    static get SIZE() {
        return new Vector(32, 32);
    }

    /** How much bigger should the OverseerBot be drawn on the canvas than it is on the spritesheet? */
    static get SCALE() {
        return 4;
    };

    /** This will be the size of the OverseerBot ON THE CANVAS. */
    static get SCALED_SIZE() {
        return Vector.multiply(OverseerBot.SIZE, OverseerBot.SCALE);
    }

    /** The speed of the OverseerBot. */
    static get SPEED() {
        return OverseerBot.SCALE * 20;
    }

    /** The filepath to the spritesheet of the OverseerBot. */
    static get SPRITESHEET() {
        return "./sprites/overseer_bot.png";
    };

    /** The maximum health of the OverseerBot. */
    static get MAX_HEALTH() {
        return 20;
    };

    /** The distance the OverseerBot will "pace" back and forth. */
    static get ATTACK_DISTANCE() {
        return OverseerBot.SCALED_SIZE.x * 6;
    };

    /** The number of seconds between attacks. */
    static get ATTACK_COOLDOWN() {
        return 2.4;
    };

    /** The amount of damage a OverseerBot deals during an attack. */
    static get ATTACK_DAMAGE() {
        return 10;
    };

    /** Number of seconds after the start of the attack animation when damage should be dealt. */
    static get DAMAGE_DELAY() {
        return 0.4;
    }

    /**
     * Perform any necessary operations when the OverseerBot dies.
     */
    handleDeath() {
        this.action = "dying";

        GAME.addEntity(new ParticleEffect(this.getCenter(), ParticleEffect.GRAY_SPARKLE));

        const rand = Math.random();
        if (rand < 0.33) {
            ASSET_MGR.playSFX(SFX.ROBOT_DEATH1.path, SFX.ROBOT_DEATH1.volume);
        } else if (rand < 0.66) {
            ASSET_MGR.playSFX(SFX.ROBOT_DEATH2.path, SFX.ROBOT_DEATH2.volume);
        } else {
            ASSET_MGR.playSFX(SFX.ROBOT_DEATH3.path, SFX.ROBOT_DEATH3.volume);
        }

        const pos = Vector.add(this.getCenter(), new Vector(0, -80));
        // add a piece of food in the bot's place at bottom-center of bot
        if (Math.random() < 0.3) {
            GAME.addEntity(new FoodDrop(pos, FoodDrop.ENERGY_DRINK));
        }

        if (Math.random() < 0.5) {
            GAME.addEntity(new AmmoDrop(pos, AmmoDrop.BOMB, 3));
        }

        if (Math.random() < 0.5) {
            GAME.addEntity(new RuneDrop(pos, RuneDrop.GREEN));
        } else {
            GAME.addEntity(new RuneDrop(pos, RuneDrop.RED));
        }
    }

    /** Change what the OverseerBot is doing and where it is. */
    update() {
        this.base.update();

        const deathAnim = this.animations[this.getFacing()]["dying"];

        if (this.health > 0) {
            const secondsSinceLastAttack = Date.now() / 1000 - this.lastAttack;

            // if we've finished our current attack, change action to idle
            if (this.action === "attacking"
                && this.animations[this.getFacing()]["attacking"].totalTime < secondsSinceLastAttack) {

                this.action = "moving";
            }

            // if Chad is close enough, shoot him
            if (Vector.distance(CHAD.pos, this.pos) < OverseerBot.ATTACK_DISTANCE) {
                if (secondsSinceLastAttack > OverseerBot.ATTACK_COOLDOWN) {
                    // if it's been long enough, start a new attack 
                    this.animations[this.getFacing()]["attacking"].elapsedTime = 0;
                    this.action = "attacking";
                    this.lastAttack = Date.now() / 1000;
                    this.dealtDamage = false;
                } else if (this.action === "attacking"
                    && secondsSinceLastAttack > OverseerBot.DAMAGE_DELAY && !this.dealtDamage) {
                    // if we're at the proper point in our attack animation, deal damage

                    const misdirectVector = new Vector(Math.random() * 20 - 10, Math.random() * 20 - 10);
                    const target = Vector.add(CHAD.getCenter(), misdirectVector);
                    if (Math.random() < 0.5) {
                        GAME.addEntity(ProjectileFactory.create(ProjectileFactory.MISSILE, this.pos, target));
                    } else {
                        GAME.addEntity(ProjectileFactory.create(ProjectileFactory.SONIC_WAVE, this.pos, target));
                    }


                    this.dealtDamage = true;
                }
            }
        } else if (deathAnim.currentFrame === deathAnim.frameCount - 1) {
            this.removeFromWorld = true;
            if (STORY.botsKilled) {
                STORY.botsKilled++;
            } else {
                STORY.botsKilled = 1;
            }
        }


    };

    /** Draw the OverseerBot on the canvas. */
    draw() {
        this.animations[this.getFacing()][this.action].drawFrame(Vector.worldToCanvasSpace(this.pos), OverseerBot.SCALE);
    };

    /** Called by the constructor. Fills up the animations array. */
    loadAnimations() {
        this.animations["left"] = [];
        this.animations["right"] = [];

        // idle animations
        this.animations["right"]["idle"] = new Animator(
            OverseerBot.SPRITESHEET,
            new Vector(0, 0),
            OverseerBot.SIZE,
            2, 0.5);
        this.animations["left"]["idle"] = new Animator(
            OverseerBot.SPRITESHEET,
            new Vector(0, OverseerBot.SIZE.y),
            OverseerBot.SIZE,
            2, 0.5);

        // moving animations (same as idle)
        this.animations["right"]["moving"] = new Animator(
            OverseerBot.SPRITESHEET,
            new Vector(0, 0),
            OverseerBot.SIZE,
            2, 0.5);
        this.animations["left"]["moving"] = new Animator(
            OverseerBot.SPRITESHEET,
            new Vector(0, OverseerBot.SIZE.y),
            OverseerBot.SIZE,
            2, 0.5);

        // attacking animations
        this.animations["right"]["attacking"] = new Animator(
            OverseerBot.SPRITESHEET,
            new Vector(0, OverseerBot.SIZE.y * 2),
            OverseerBot.SIZE,
            2, 0.3);
        this.animations["left"]["attacking"] = new Animator(
            OverseerBot.SPRITESHEET,
            new Vector(0, OverseerBot.SIZE.y * 3),
            OverseerBot.SIZE,
            2, 0.3);

        // dying animations (same as idle)
        this.animations["right"]["dying"] = new Animator(
            OverseerBot.SPRITESHEET,
            new Vector(0, OverseerBot.SIZE.y * 4),
            OverseerBot.SIZE,
            2, 0.3);
        this.animations["left"]["dying"] = new Animator(
            OverseerBot.SPRITESHEET,
            new Vector(0, OverseerBot.SIZE.y * 5),
            OverseerBot.SIZE,
            2, 0.3);
    };
};