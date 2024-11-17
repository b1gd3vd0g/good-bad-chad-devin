/** 
 * Eels are enemies that jump out of the water and bite Chad.
 * 
 * @author Nathan Hinthorne
 */
class Eel {
    /**
     * Constructor for a Eel.
     * 
     * @param {Vector} pos the position at which the Eel should start
     * @param {Array<Vector>} path array of ordered Vectors that delineate the enemy's path
     * @param {number} speed the speed at which the Eel should move
     */
    constructor(pos, path, speed) {
        this.base = new FlyingEnemyBase(
            this,
            pos,
            Eel.SCALED_SIZE,
            speed,
            Eel.MAX_HEALTH,
            () => this.handleDeath(),
            path
        );

        /** An associative array of the animations for this Eel. Arranged [facing][action]. */
        this.animations = [];
        this.loadAnimations();

        this.action = "moving";

        this.isJumping = false;

        this.lastAttack = 0;
        this.dealtDamage = false;
    };

    /** The size, in pixels, of the Eel ON THE SPRITESHEET. */
    static get SIZE() {
        return new Vector(40, 13);
    }

    /** How much bigger should the Eel be drawn on the canvas than it is on the spritesheet? */
    static get SCALE() {
        return 3;
    };

    /** This will be the size of the Eel ON THE CANVAS. */
    static get SCALED_SIZE() {
        return Vector.multiply(Eel.SIZE, Eel.SCALE);
    }


    /** The filepath to the spritesheet of the Eel. */
    static get SPRITESHEET() {
        return "./sprites/snake_blue.png";
    };

    /** The maximum health of the Eel. */
    static get MAX_HEALTH() {
        return 20;
    };

    /** The distance the Eel will "pace" back and forth. */
    static get PACE_DISTANCE() {
        return Eel.SCALED_SIZE.x * 2;
    };

    /** The number of seconds between attacks. */
    static get ATTACK_COOLDOWN() {
        return 1;
    };

    /** The amount of damage a Eel deals during an attack. */
    static get ATTACK_DAMAGE() {
        return 10;
    };

    /** Number of seconds after the start of the attack animation when damage should be dealt. */
    static get DAMAGE_DELAY() {
        return 0.3;
    }

    /**
     * Perform any necessary operations when the Eel dies.
     */
    handleDeath() {
        this.action = "dying";

        const center = Vector.add(this.pos, new Vector(Eel.SCALED_SIZE.x / 2, Eel.SCALED_SIZE.y / 2 - 80));

        // add a piece of food in the snake's place at bottom-center of snake
        if (Math.random() < 0.6) {
            GAME.addEntity(new FoodDrop(center, FoodDrop.STEAK));
        }
        if (Math.random() < 0.5) {
            GAME.addEntity(new RuneDrop(center, RuneDrop.RED));
        }
        GAME.addEntity(new AmmoDrop(center, AmmoDrop.WATER_BALLOON, 5));
    }

    /**
     * The direction in which the enemy is facing as a string, for animation use.
     * 
     * @returns {string} "left" or "right"
     */
    getFacing() {
        return (this.getDirection() < 0) ? "left" : "right";
    }

    /**
     * Get the direction in which the enemy is currently facing.
     * 
     * @returns {number} -1 for left and 1 for right
     */
    getDirection() {
        return this.targetX - this.getCenter().x > 0 ? 1 : -1;
    }

    /**
     * Get the center of the enemy.
     * @returns {Vector} the center of the enemy
     */
    getCenter() {
        return Vector.add(this.pos, new Vector(Eel.SCALED_SIZE.x / 2, Eel.SCALED_SIZE.y / 2));
    }

    /** Change what the Eel is doing and where it is. */
    update() {
        this.base.update();

        this.targetX = CHAD.getCenter().x;
        const deathAnim = this.animations[this.getFacing()]["dying"];

        if (this.health > 0) {
            const secondsSinceLastAttack = Date.now() / 1000 - this.lastAttack;

            // if we've finished our current attack, change action to idle
            if (this.action === "attacking"
                && this.animations[this.getFacing()]["attacking"].totalTime < secondsSinceLastAttack) {
                this.action = "moving";
            }

            // if Chad is close enough, bite him
            if (this.base.chadDistance() < Eel.SCALED_SIZE.x / 2) {
                if (secondsSinceLastAttack > Eel.ATTACK_COOLDOWN) {
                    // if it's been long enough, start a new attack 
                    this.animations[this.getFacing()]["attacking"].elapsedTime = 0;
                    this.action = "attacking";
                    this.lastAttack = Date.now() / 1000;
                    this.dealtDamage = false;
                } else if (this.action === "attacking"
                    && secondsSinceLastAttack > Eel.DAMAGE_DELAY && !this.dealtDamage) {
                    // if we're at the proper point in our attack animation, deal damage

                    CHAD.takeDamage(Eel.ATTACK_DAMAGE);
                    this.dealtDamage = true;
                }
            }

            if (deathAnim.currentFrame === deathAnim.frameCount - 1) {
                this.removeFromWorld = true;
            }
        }

        if (this.currentJumpHeight <= 0) {
            this.isJumping = true;
        }

        if (this.currentJumpHeight >= this.maxJumpHeight) {
            this.isJumping = false;
        }

        // console.log("currentJumpHeight: " + this.currentJumpHeight, "maxJumpHeight: " + this.maxJumpHeight)

        if (this.isJumping) {
            // jump up
            this.pos = Vector.add(this.pos, new Vector(0, -this.speed * GAME.clockTick));
            this.currentJumpHeight += this.speed * GAME.clockTick;
        }
        else {
            // fall down
            this.pos = Vector.add(this.pos, new Vector(0, this.speed * GAME.clockTick));
            this.currentJumpHeight -= this.speed * GAME.clockTick;
        }
    };

    /** Draw the Eel on the canvas. */
    draw() {
        // console.log("facing: " + this.getFacing() + ", action: " + this.action + ", pos: " + this.pos.x + ", " + this.pos.y);
        this.animations[this.getFacing()][this.action].drawFrame(Vector.worldToCanvasSpace(this.pos), Eel.SCALE);
    };

    /** Called by the constructor. Fills up the animations array. */
    loadAnimations() {
        this.animations["left"] = [];
        this.animations["right"] = [];

        this.animations["right"]["idle"] = new Animator(
            Eel.SPRITESHEET,
            new Vector(0, 0),
            Eel.SIZE,
            1, 1);
        this.animations["left"]["idle"] = new Animator(
            Eel.SPRITESHEET,
            new Vector(0, Eel.SIZE.y),
            Eel.SIZE,
            1, 1);

        // SLITHERING ANIMATIONS
        // (it takes him 1s to slither)
        this.animations["right"]["moving"] = new Animator(
            Eel.SPRITESHEET,
            new Vector(0, 0),
            Eel.SIZE,
            9, 1 / 9);
        this.animations["left"]["moving"] = new Animator(
            Eel.SPRITESHEET,
            new Vector(0, Eel.SIZE.y),
            Eel.SIZE,
            9, 1 / 9);

        // ATTACKING ANIMATIONS
        this.animations["right"]["attacking"] = new Animator(
            Eel.SPRITESHEET,
            new Vector(0, Eel.SIZE.y * 2),
            Eel.SIZE,
            10, 0.05);
        this.animations["left"]["attacking"] = new Animator(
            Eel.SPRITESHEET,
            new Vector(0, Eel.SIZE.y * 3),
            Eel.SIZE,
            10, 0.05);

        // DEATH ANIMATIONS
        this.animations["right"]["dying"] = new Animator(
            Eel.SPRITESHEET,
            new Vector(0, Eel.SIZE.y * 4),
            Eel.SIZE,
            7, 1 / 14);
        this.animations["left"]["dying"] = new Animator(
            Eel.SPRITESHEET,
            new Vector(0, Eel.SIZE.y * 5),
            Eel.SIZE,
            7, 1 / 14);

    };
};