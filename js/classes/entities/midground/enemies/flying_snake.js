/** 
 * Flying snake !!
 * (mostly just copy pasted from Snake)
 * 
 * @author Trae Claar
 */
class FlyingSnake {
    /**
     * Constructor for a Snake.
     * 
     * @param {Vector} pos the position at which the Snake should start
     */
    constructor(pos) {
        this.base = new FlyingEnemyBase(
            this, 
            pos, 
            FlyingSnake.SCALED_SIZE, 
            FlyingSnake.SPEED, 
            FlyingSnake.MAX_HEALTH, 
            () => this.handleDeath(),
            [new Vector(20, 0), new Vector(500, 100), new Vector(1000, -200)]
        );

        /** An associative array of the animations for this Snake. Arranged [facing][action]. */
        this.animations = [];
        this.loadAnimations();

        this.lastAttack = 0;
        this.dealtDamage = false;
        this.action = "moving"
    };

    /** The size, in pixels, of the Snake ON THE SPRITESHEET. */
    static get SIZE() {
        return new Vector(40, 13);
    }

    /** How much bigger should the Snake be drawn on the canvas than it is on the spritesheet? */
    static get SCALE() {
        return 3;
    };

    /** This will be the size of the Snake ON THE CANVAS. */
    static get SCALED_SIZE() {
        return Vector.multiply(Snake.SIZE, Snake.SCALE);
    }

    /** The speed of the Snake. */
    static get SPEED() {
        return Snake.SCALE * 80;
    }

    /** The filepath to the spritesheet of the Snake. */
    static get SPRITESHEET() {
        return "./sprites/snake.png";
    };

    /** The maximum health of the Snake. */
    static get MAX_HEALTH() {
        return 20;
    };

    /** The distance the Snake will "pace" back and forth. */
    static get ATTACK_DISTANCE() {
        return Snake.SCALED_SIZE.x * 4;
    };

    /** The number of seconds between attacks. */
    static get ATTACK_COOLDOWN() {
        return 0.5;
    };

    /** The amount of damage a Snake deals during an attack. */
    static get ATTACK_DAMAGE() {
        return 10;
    };

    /** Number of seconds after the start of the attack animation when damage should be dealt. */
    static get DAMAGE_DELAY() {
        return 0.4;
    }

    /**
     * Perform any necessary operations when the Snake dies.
     */
    handleDeath() {
        this.action = "dying";

        // add a piece of food in the snake's place at bottom-center of snake
        if (Math.random() < 0.6) {
            const pos = Vector.add(this.getCenter(), new Vector(0, -80));
            GAME.addEntity(new FoodDrop(pos, FoodDrop.STEAK));
        }
    }
    
    /** Change what the Snake is doing and where it is. */
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
    
            // if Chad is close enough, shoot him (lol)
            if (Vector.distance(CHAD.pos, this.pos) < FlyingSnake.ATTACK_DISTANCE) {
                if (secondsSinceLastAttack > FlyingSnake.ATTACK_COOLDOWN) {
                    // if it's been long enough, start a new attack 
                    this.animations[this.getFacing()]["attacking"].elapsedTime = 0;
                    this.action = "attacking";
                    this.lastAttack = Date.now() / 1000;
                    this.dealtDamage = false;
                } else if (this.action === "attacking" 
                    && secondsSinceLastAttack > FlyingSnake.DAMAGE_DELAY && !this.dealtDamage) {
                    // if we're at the proper point in our attack animation, deal damage
    
                    GAME.addEntity(ProjectileFactory.create(ProjectileFactory.BOMB, this.pos, CHAD.pos));
                    this.dealtDamage = true;
                }
            }
        } else if (deathAnim.currentFrame() === deathAnim.frameCount - 1) {
            this.removeFromWorld = true;
            if (STORY.snakesKilled) {
                STORY.snakesKilled++;
            } else {
                STORY.snakesKilled = 1;
            }
        }
        

    };

    /** Draw the Snake on the canvas. */
    draw() {
        this.animations[this.getFacing()][this.action].drawFrame(Vector.worldToCanvasSpace(this.pos), Snake.SCALE);
    };

    /** Called by the constructor. Fills up the animations array. */
    loadAnimations() {
        this.animations["left"] = [];
        this.animations["right"] = [];

        this.animations["right"]["idle"] = new Animator(
            Snake.SPRITESHEET,
            new Vector(0, 0),
            Snake.SIZE,
            1, 1);
        this.animations["left"]["idle"] = new Animator(
            Snake.SPRITESHEET,
            new Vector(0, Snake.SIZE.y),
            Snake.SIZE,
            1, 1);
        
        // SLITHERING ANIMATIONS
        // (it takes him 1s to slither)
        this.animations["right"]["moving"] = new Animator(
            Snake.SPRITESHEET,
            new Vector(0, 0),
            Snake.SIZE,
            9, 1/9);
        this.animations["left"]["moving"] = new Animator(
            Snake.SPRITESHEET,
            new Vector(0, Snake.SIZE.y),
            Snake.SIZE,
            9, 1/9);

        // ATTACKING ANIMATIONS
        this.animations["right"]["attacking"] = new Animator(
            Snake.SPRITESHEET,
            new Vector(0, Snake.SIZE.y * 2),
            Snake.SIZE,
            10, 0.05);
        this.animations["left"]["attacking"] = new Animator(
            Snake.SPRITESHEET,
            new Vector(0, Snake.SIZE.y * 3),
            Snake.SIZE,
            10, 0.05);

        // DEATH ANIMATIONS
        this.animations["right"]["dying"] = new Animator(
            Snake.SPRITESHEET,
            new Vector(0, Snake.SIZE.y * 4),
            Snake.SIZE,
            7, 1/14);
        this.animations["left"]["dying"] = new Animator(
            Snake.SPRITESHEET,
            new Vector(0, Snake.SIZE.y * 5),
            Snake.SIZE,
            7, 1/14);
        
    };
};