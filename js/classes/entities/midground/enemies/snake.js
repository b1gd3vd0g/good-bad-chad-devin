/** 
 * A Snake can appear in the village <or the lava> dimension(s).
 * He is able to face right or left, slither, attack and die.
 * 
 * @author Devin Peevy
 * @author Trae Claar
 */
class Snake {
    /**
     * Constructor for a Snake.
     * 
     * @param {Vector} pos the position at which the Snake should start
     */
    constructor(pos) {
        this.base = new GroundEnemyBase(
            this, 
            pos, 
            Snake.SCALED_SIZE, 
            Snake.SPEED, 
            Snake.MAX_HEALTH, 
            Snake.PACE_DISTANCE, 
            () => this.handleDeath(),
            GroundEnemyBase.DEFENSIVE_STANCE
        );

        /** An associative array of the animations for this Snake. Arranged [facing][action]. */
        this.animations = [];
        this.loadAnimations();

        this.lastAttack = 0;
        this.dealtDamage = false;
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
        return Snake.SCALE * 30;
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
    static get PACE_DISTANCE() {
        return Snake.SCALED_SIZE.x * 2;
    };

    /** The number of seconds between attacks. */
    static get ATTACK_COOLDOWN() {
        return 1;
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

        const pos = Vector.add(this.base.getCenter(), new Vector(0, -80));

        // add a piece of food in the snake's place at bottom-center of snake
        if (Math.random() < 0.6) {
            GAME.addEntity(new FoodDrop(pos, FoodDrop.STEAK, true, true));
        }
        if (Math.random() < 0.5) {
            GAME.addEntity(new RuneDrop(pos, RuneDrop.GREEN, true, true));
        }
    }
    
    /** Change what the Snake is doing and where it is. */
    update() {
        this.base.update();

        const deathAnim = this.animations[this.base.getFacing()]["dying"];

        if (this.health > 0) {
            const secondsSinceLastAttack = Date.now() / 1000 - this.lastAttack;

            // if we've finished our current attack, change action to idle
            if (this.action === "attacking" 
                && this.animations[this.base.getFacing()]["attacking"].totalTime < secondsSinceLastAttack) {
                    
                this.action = "idle";
            }
    
            // if Chad is close enough, bite him
            if (this.base.chadDistance() < Snake.SCALED_SIZE.x / 2) {
                if (secondsSinceLastAttack > Snake.ATTACK_COOLDOWN) {
                    // if it's been long enough, start a new attack 
                    this.state = "pursue";
                    this.base.setTargetX(CHAD.getCenter().x);
                    this.animations[this.base.getFacing()]["attacking"].elapsedTime = 0;
                    this.action = "attacking";
                    this.lastAttack = Date.now() / 1000;
                    this.dealtDamage = false;
                } else if (this.action === "attacking" 
                    && secondsSinceLastAttack > Snake.DAMAGE_DELAY && !this.dealtDamage) {
                    // if we're at the proper point in our attack animation, deal damage
    
                    ASSET_MGR.playSFX(SFX.SNAKE_HISS.path, SFX.SNAKE_HISS.volume);
                    CHAD.takeDamage(Snake.ATTACK_DAMAGE);
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
        this.animations[this.base.getFacing()][this.action].drawFrame(Vector.worldToCanvasSpace(this.pos), Snake.SCALE);
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