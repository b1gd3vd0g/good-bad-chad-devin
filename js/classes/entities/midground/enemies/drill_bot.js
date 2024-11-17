/**
 * Class that represents a Drill Bot.
 * 
 * @author Nathan Hinthorne
 */
class DrillBot {
    /**
     * Constructor for a DrillBot.
     * 
     * @param {Vector} pos the initial position of the DrillBot
     */
    constructor(pos) {
        this.base = new GroundEnemyBase(
            this, 
            pos, 
            DrillBot.SCALED_SIZE, 
            DrillBot.SPEED, 
            DrillBot.MAX_HEALTH, 
            DrillBot.ROAM_DISTANCE, 
            () => this.handleDeath(),
            GroundEnemyBase.AGGRESSIVE_STANCE
        );

        this.animations = [];
        this.loadAnimations();

        this.lastAttack = 0;

        this.performedFirstAttack = false;
        this.performedSecondAttack = false;
    };

    /** The size, in pixels, of the DrillBot on its spritesheet. */
    static get SIZE() {
        return new Vector(32, 32);
    }

    /** The scale factor applied to the DrillBot when drawing. */
    static get SCALE() {
        return 5.5;
    };

    /** The size, in pixels, of the DrillBot on the canvas. */
    static get SCALED_SIZE() {
        return Vector.multiply(DrillBot.SIZE, DrillBot.SCALE);
    }

    /** The speed of the DrillBot. */
    static get SPEED() {
        return DrillBot.SCALE * 30;
    }

    /** The file path to the DrillBot's spritesheet. */
    static get SPRITESHEET() {
        return "./sprites/drill_bot.png";
    };

    /** The maximum health of the DrillBot. */
    static get MAX_HEALTH() {
        return 50;
    };

    /** The distance the DrillBot will wander from its original position when roaming. */
    static get ROAM_DISTANCE() {
        return DrillBot.SCALED_SIZE.x * 2;
    };
    
    /** The number of seconds between attacks. */
    static get ATTACK_COOLDOWN() {
        return 2;
    }

    /** The amount of damage a DrillBot deals during an attack (applied twice in one whole attack pattern) */
    static get ATTACK_DAMAGE() {
        return 3;
    };

    /** Number of seconds after the start of the attack animation when first damage should be dealt. */
    static get FIRST_DAMAGE_DELAY() {
        return 0.5;
    }

    /** Number of seconds after the start of the attack animation when second damage should be dealt. */
    static get SECOND_DAMAGE_DELAY() {
        return 0.5;
    }



    /**
     * @returns true if the DrillBot is within attack range of Chad, false otherwise.
     */
    withinAttackRange() {
        return this.base.chadDistance() < DrillBot.SCALED_SIZE.x / 2;
    }

    /**
     * Perform any necessary operations when the DrillBot dies.
     */
    handleDeath() {

        this.action = "dying";

        if (Math.random() < 0.5) {
            ASSET_MGR.playSFX(SFX.ROBOT_DEATH3.path, SFX.ROBOT_DEATH3.volume);
        } else {
            ASSET_MGR.playSFX(SFX.ROBOT_DEATH1.path, SFX.ROBOT_DEATH1.volume);
        }

        const pos = Vector.add(this.base.getCenter(), new Vector(0, -40));

        // add a piece of bacon in the DrillBot's place at bottom-center of drill_bot
        if (Math.random() < 0.5) {
            GAME.addEntity(new FoodDrop(pos, FoodDrop.ENERGY_DRINK, true, true));
        } else if (Math.random() < 0.5) {
            GAME.addEntity(new AmmoDrop(pos, AmmoDrop.BOMB));
        }

        if (Math.random() < 0.5) {
            GAME.addEntity(new RuneDrop(pos, RuneDrop.RED));
        }

        if (STORY.botsKilled) {
            STORY.botsKilled++;
        } else {
            STORY.botsKilled = 1;
        }
    }

    
    /** Update the DrillBot. */
    update() {
        this.base.update();

        const deathAnim = this.animations[this.getFacing()]["dying"];

        if (this.health > 0) {

            const secondsSinceLastAttack = Date.now() / 1000 - this.lastAttack;

            // if we've finished our current attack, change action to idle
            if (this.action === "attacking" 
                && this.animations[this.base.getFacing()]["attacking"].totalTime < secondsSinceLastAttack) {
                    
                this.action = "idle";
            }

            // if Chad is close enough and we want to beat him up, react accordingly
            if (this.withinAttackRange() && this.state === "pursue") {
                if (secondsSinceLastAttack > DrillBot.ATTACK_COOLDOWN) {
                    // if it's been long enough, start a new attack 
                    this.animations[this.base.getFacing()]["attacking"].elapsedTime = 0;
                    this.action = "attacking"
                    this.lastAttack = Date.now() / 1000;
                    this.performedFirstAttack = false;
                    this.performedSecondAttack = false;
                }
                if (this.action === "attacking" 
                    && secondsSinceLastAttack > DrillBot.FIRST_DAMAGE_DELAY && !this.performedFirstAttack) {
                    // if we're at the proper point in our attack animation, deal damage the first time

                    ASSET_MGR.playSFX(SFX.DRILL2.path, SFX.DRILL2.volume);
                    CHAD.takeDamage(DrillBot.ATTACK_DAMAGE);
                    this.performedFirstAttack = true;
                    this.timeOfFirstAttack = Date.now() / 1000; // Record the time of the first attack
                }
                const secondsSinceFirstAttack = Date.now() / 1000 - this.timeOfFirstAttack;
                if (this.action === "attacking" 
                    && secondsSinceFirstAttack > DrillBot.SECOND_DAMAGE_DELAY && !this.performedSecondAttack) {
                    // if we're at the proper point in our attack animation, deal damage the second time

                    ASSET_MGR.playSFX(SFX.DRILL1.path, SFX.DRILL1.volume);
                    CHAD.takeDamage(DrillBot.ATTACK_DAMAGE);
                    this.performedSecondAttack = true;
                }
            }
        } else {
            if (deathAnim.currentFrame === deathAnim.frameCount - 1) {
                this.removeFromWorld = true;
                if (STORY.botsKilled) {
                    STORY.botsKilled++;
                } else {
                    STORY.botsKilled = 1;
                }
            }
        }
    };

    /** Draw the DrillBot. */
    draw() {
        this.animations[this.base.getFacing()][this.action].drawFrame(Vector.worldToCanvasSpace(this.pos), DrillBot.SCALE);

        //* draw bounding box in red
        // CTX.strokeStyle = "red";
        // const pos2 = Vector.worldToCanvasSpace(this.boundingBox.pos);
        // CTX.strokeRect(pos2.x, pos2.y, this.boundingBox.size.x, this.boundingBox.size.y);
    };

    /** Called by the constructor. Fills up the animations array. */
    loadAnimations() {
        this.animations["left"] = [];
        this.animations["right"] = [];

        this.animations["left"]["idle"] = new Animator(
            DrillBot.SPRITESHEET,
            new Vector(0, DrillBot.SIZE.y),
            DrillBot.SIZE,
            1, 1);
        this.animations["right"]["idle"] = new Animator(
            DrillBot.SPRITESHEET,
            new Vector(0, 0),
            DrillBot.SIZE,
            1, 1);
        
        // moving animations
        this.animations["left"]["moving"] = new Animator(
            DrillBot.SPRITESHEET,
            new Vector(0, DrillBot.SIZE.y),
            DrillBot.SIZE,
            2, 1/2);
        this.animations["right"]["moving"] = new Animator(
            DrillBot.SPRITESHEET,
            new Vector(0, 0),
            DrillBot.SIZE,
            2, 1/2);

        // attacking animations
        this.animations["left"]["attacking"] = new Animator(
            DrillBot.SPRITESHEET,
            new Vector(DrillBot.SIZE.x * 2, DrillBot.SIZE.y),
            DrillBot.SIZE,
            8, 1/8);
        this.animations["right"]["attacking"] = new Animator(
            DrillBot.SPRITESHEET,
            new Vector(DrillBot.SIZE.x * 2, 0),
            DrillBot.SIZE,
            8, 1/8);
        
        
        // dying animations
        this.animations["left"]["dying"] = new Animator(
            DrillBot.SPRITESHEET,
            new Vector(DrillBot.SIZE.x * 10, DrillBot.SIZE.y),
            DrillBot.SIZE,
            2, 1/2);
        this.animations["right"]["dying"] = new Animator(
            DrillBot.SPRITESHEET,
            new Vector(DrillBot.SIZE.x * 10, 0),
            DrillBot.SIZE,
            2, 1/2);
    };
};