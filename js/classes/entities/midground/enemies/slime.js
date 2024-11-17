/** 
 * A Slime can appear in all dimensions except village.
 * He is able to face right or left, move, launch, and die.
 * @author Devin Peevy
 * @author Trae Claar
 */
class Slime {
    // TODO: edit the Slime spritesheet so that idle is first, making the walking animation flow better.
    /**
     * Constructor for a Slime.
     * 
     * @param {Vector} pos The position at which the Slime should start.
     * @param {number} type The type of Slime that should be generated. Slime.SAP, .POLLUTED, .FROST, .MAGMA, or .EVIL.
     */
    constructor(pos, type) {
        // Did we pass in a type? Is it valid?
        if (type && (type % 1 !== 0 || type < 0 || type > 4)) {
            throw new Error("Invalid Slime type: try Slime.SAP, .POLLUTED, .FROST, .MAGMA, or .EVIL.");
        }
        /** The type of Slime that this is. Slime.SAP, .POLLUTED, .FROST, .MAGMA, or .EVIL. Default SAP. */
        this.type = type ?? Slime.SAP; // If no type parameter input, assume SAP.

        this.base = new GroundEnemyBase(
            this, 
            pos, 
            Slime.SCALED_SIZE, 
            Slime.SPEED, 
            Slime.MAX_HEALTH, 
            Slime.PACE_DISTANCE, 
            () => this.handleDeath(),
            GroundEnemyBase.AGGRESSIVE_STANCE
        );

        /** An associative array of the animations for this Snake. Arranged [facing][action]. */
        this.animations = [];
        this.loadAnimations();

        this.lastAttack = 0;
    };

    // Types:
   /** A constant for the Sap type that can be passed to the constructor. */
    static get SAP() {
        return 0;
    }

    /** A constant for the Polluted type that can be passed to the constructor. */
    static get POLLUTED() {
        return 1;
    }

    /** A constant for the Frost type that can be passed to the constructor. */
    static get FROST() {
        return 2;
    };

    /** A constant for the Magma type that can be passed to the constructor. */
    static get MAGMA() {
        return 3;
    };

    /** A constant for the Evil type that can be passed to the constructor. */
    static get EVIL() {
        return 4;
    };

    /** The height, in pixels, of the Slime ON THE SPRITESHEET. */
    static get SIZE() {
        return new Vector(29, 21);
    }

    /** How much bigger should the Slime be drawn on the canvas than it is on the spritesheet? */
    static get SCALE() {
        // TODO: return when we have the game world properly set up.
        return 3;
    };

    /** This will be the size of the Slime ON THE CANVAS. */
    static get SCALED_SIZE() {
        return Vector.multiply(Slime.SIZE, Slime.SCALE);
    }

    /** The speed of a Slime in pixels/s. */
    static get SPEED() {
        return Slime.SCALE * 30;
    }

    /** The maximum health of a Slime. */
    static get MAX_HEALTH() {
        return 20;
    }

    /** The distance (in pixels) that a Slime will stray from its initial position when roaming. */
    static get PACE_DISTANCE() {
        return Slime.SCALED_SIZE.x * 5;
    }

     /** The number of seconds between attacks. */
     static get ATTACK_COOLDOWN() {
        return 1;
    };

    /** The amount of damage a Slime deals during an attack. */
    static get ATTACK_DAMAGE() {
        return 5;
    };

    /** The filepath to the spritesheet of the Slime. */
    static get SPRITESHEET() {
        // TODO: make Slime death sprite.
        return "./sprites/slimes.png";
    };

    /**
     * Perform any necessary operations when the Slime dies.
     */
    handleDeath() {
        this.action = "dying";

        const pos = Vector.add(this.base.getCenter(), new Vector(0, -40));

        const rand = Math.random();
        if (rand < 0.4) {
            if (this.type === Slime.FROST) {
                GAME.addEntity(new AmmoDrop(pos, AmmoDrop.SNOWBALL, 2));
            } else {
                GAME.addEntity(new AmmoDrop(pos, AmmoDrop.SLIMEBALL, 1));
            }
        } else if (rand < 0.7) {
            if (this.type === Slime.FROST) {
                GAME.addEntity(new AmmoDrop(pos, AmmoDrop.SUS_SNOWBALL, 2));
            } else {
                GAME.addEntity(new AmmoDrop(pos, AmmoDrop.SLIMEBALL, 2));
            }
        }
    }
    
    /** Change what the Slime is doing and where it is. */
    update() {
        this.base.update();

        const deathAnim = this.animations[this.base.getFacing()]["dying"];
        console.log("deathAnim: ", deathAnim);

        if (this.health > 0) {
            if (this.base.chadDistance() < Slime.SCALED_SIZE.x / 2
                && Date.now() - Slime.ATTACK_COOLDOWN * 1000 > this.lastAttack) {

                this.lastAttack = Date.now();
                CHAD.takeDamage(Slime.ATTACK_DAMAGE);
                ASSET_MGR.playSFX(SFX.SLIME_ATTACK.path, SFX.SLIME_ATTACK.volume);
            }
        } else if (deathAnim.currentFrame === deathAnim.frameCount - 1) {
            this.removeFromWorld = true;
            if (STORY.slimesKilled) {
                STORY.slimesKilled++;
            } else {
                STORY.slimesKilled = 1;
            }
        }
    };

    /** Draw the Slime on the canvas. */
    draw() {
        this.animations[this.base.getFacing()][this.action].drawFrame(Vector.worldToCanvasSpace(this.pos), Slime.SCALE);
    };

    /** Called by the constructor. Fills up the animations array. */
    loadAnimations() {
        this.animations["left"] = [];
        this.animations["right"] = [];

        // Idle Animations
        this.animations["right"]["idle"] = new Animator(
            Slime.SPRITESHEET,
            new Vector(Slime.SIZE.x, this.type * 4 * Slime.SIZE.y),
            Slime.SIZE,
            1, 1);
        this.animations["left"]["idle"] = new Animator(
            Slime.SPRITESHEET,
            new Vector(Slime.SIZE.x, this.type * 4 * Slime.SIZE.y + Slime.SIZE.y),
            Slime.SIZE,
            1, 1);
        
        // Moving animations
        this.animations["right"]["moving"] = new Animator(
            Slime.SPRITESHEET,
            new Vector(0, this.type * 4 * Slime.SIZE.y),
            Slime.SIZE,
            4, 0.25);
        this.animations["left"]["moving"] = new Animator(
            Slime.SPRITESHEET,
            new Vector(0, this.type * 4 * Slime.SIZE.y + Slime.SIZE.y),
            Slime.SIZE,
            4, 0.25);
        
        // Death animations
        this.animations["right"]["dying"] = new Animator(
            Slime.SPRITESHEET,
            new Vector(0, this.type * 4 * Slime.SIZE.y + 2 * Slime.SIZE.y),
            Slime.SIZE,
            7, 1/14);
        this.animations["left"]["dying"] = new Animator(
            Slime.SPRITESHEET,
            new Vector(0, this.type * 4 * Slime.SIZE.y + 3 * Slime.SIZE.y),
            Slime.SIZE,
            7, 1/14);
    };
};