/** 
 * A bunny can appear in the village <or the ice> dimension(s).
 * He is able to face right or left, hop, and die.
 * 
 * @author Devin Peevy
 * @author Trae Claar
 */
class Bunny {
    /**
     * Constructor for a Bunny.
     * 
     * @param {Vector} pos The position at which the Bunny should start.
     */
    constructor(pos) {
        this.base = new GroundEnemyBase(
            this, 
            pos, 
            Bunny.SCALED_SIZE, 
            Bunny.SPEED, 
            Bunny.MAX_HEALTH, 
            Bunny.PACE_DISTANCE, 
            () => this.handleDeath(),
            GroundEnemyBase.PASSIVE_STANCE
        );

        /** An associative array of the animations for this Bunny. Arranged [facing][action]. */
        this.animations = [];
        this.loadAnimations();
    };

    /** The size, in pixels, of the Bunny ON THE SPRITESHEET. */
    static get SIZE() {
        return new Vector(27, 24);
    }

    /** How much bigger should the Bunny be drawn on the canvas than it is on the spritesheet? */
    static get SCALE() {
        return 3;
    };

    /** The size of the Bunny on the Canvas. */
    static get SCALED_SIZE() {
        return Vector.multiply(Bunny.SIZE, Bunny.SCALE);
    };

    /** The speed of the Bunny. */
    static get SPEED() {
        return Bunny.SCALE * 30;
    };

    /** The maximum health of the Bunny. */
    static get MAX_HEALTH() {
        return 20;
    };
    
    /** The distance from the Bunny's original position that it will wander when roaming.*/
    static get PACE_DISTANCE() {
        return 3 * Bunny.SCALED_SIZE.x
    }

    /** The filepath to the spritesheet of the Bunny. */
    static get SPRITESHEET() {
        // TODO: make bunny death sprite.
        return "./sprites/bunny.png";
    };

    /**
     * Perform any necessary operations on Bunny death.
     */
    handleDeath() {
        this.action = "dying";

        const pos = Vector.add(this.base.getCenter(), new Vector(0, -60));

        // add a piece of food in the bunny's place at bottom-center of bunny
        if (Math.random() < 0.6) {
            GAME.addEntity(new FoodDrop(pos, FoodDrop.CHICKEN, true, true));
        }
        // add a rune drop in the bunny's place at bottom-center of bunny
        if (Math.random() < 0.5) {
            GAME.addEntity(new RuneDrop(pos, RuneDrop.WHITE, true, true));
        }
    }
    
    /** Change what the Bunny is doing and where it is. */
    update() {
        this.base.update();

        const deathAnim = this.animations[this.base.getFacing()]["dying"];
        if (this.health <= 0 && deathAnim.currentFrame() === deathAnim.frameCount - 1) {
            this.removeFromWorld = true;
            if (STORY.bunniesKilled) {
                STORY.bunniesKilled++;
            } else {
                STORY.bunniesKilled = 1;
            }
        }
    };

    /** Draw the Bunny on the canvas. */
    draw() {
        this.animations[this.base.getFacing()][this.action].drawFrame(Vector.worldToCanvasSpace(this.pos), Bunny.SCALE);
        if (GAME.debug) {
            CTX.strokeStyle = "red";
            const pos = Vector.worldToCanvasSpace(this.boundingBox.pos);
            CTX.strokeRect(pos.x, pos.y, this.boundingBox.size.x, this.boundingBox.size.y);
        }
    };

    /** Called by the constructor. Fills up the animations array. */
    loadAnimations() {
        this.animations["left"] = [];
        this.animations["right"] = [];

        this.animations["left"]["idle"] = new Animator(
            Bunny.SPRITESHEET,
            new Vector(0, 0),
            Bunny.SIZE,
            1, 1);
        this.animations["right"]["idle"] = new Animator(
            Bunny.SPRITESHEET,
            new Vector(0, Bunny.SIZE.y),
            Bunny.SIZE,
            1, 1);
        
        // HOPPING ANIMATIONS
        // (it takes him 0.5s to hop)
        this.animations["left"]["moving"] = new Animator(
            Bunny.SPRITESHEET,
            new Vector(Bunny.SIZE.x, 0),
            Bunny.SIZE,
            4, 0.125);
        this.animations["right"]["moving"] = new Animator(
            Bunny.SPRITESHEET,
            Bunny.SIZE,
            Bunny.SIZE,
            4, 0.125);

         // DEATH ANIMATIONS
        this.animations["left"]["dying"] = new Animator(
            Bunny.SPRITESHEET,
            new Vector(0, 2 * Bunny.SIZE.y),
            Bunny.SIZE,
            7, 1/14);
        this.animations["right"]["dying"] = new Animator(
            Bunny.SPRITESHEET,
            new Vector(0, 3 * Bunny.SIZE.y),
            Bunny.SIZE,
            7, 1/14);
    };
};