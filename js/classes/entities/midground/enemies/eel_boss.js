/** 
 * 
 * @author Devin Peevy
 * @author Trae Claar
 */
class EelBoss {
    /**
     * Constructor for a EelBoss.
     * 
     * @param {Vector} pos the position at which the EelBoss should start
     */
    constructor(pos) {
        this.base = new EnemyBase(
            this, 
            pos, 
            EelBoss.SCALED_SIZE, 
            EelBoss.SPEED, 
            EelBoss.MAX_HEALTH, 
            EelBoss.PACE_DISTANCE, 
            () => this.handleDeath(),
            EnemyBase.DEFENSIVE_STANCE
        );

        /** An associative array of the animations for this EelBoss. Arranged [facing][action]. */
        this.animations = [];
        this.loadAnimations();

        this.lastAttack = 0;
        this.dealtDamage = false;
    };

    /** The size, in pixels, of the EelBoss ON THE SPRITESHEET. */
    static get SIZE() {
        return new Vector(40, 13);
    }

    /** How much bigger should the EelBoss be drawn on the canvas than it is on the spritesheet? */
    static get SCALE() {
        return 10;
    };

    /** This will be the size of the EelBoss ON THE CANVAS. */
    static get SCALED_SIZE() {
        return Vector.multiply(EelBoss.SIZE, EelBoss.SCALE);
    }

    /** The speed of the EelBoss. */
    static get SPEED() {
        return 50;
    }

    /** The filepath to the spritesheet of the EelBoss. */
    static get SPRITESHEET() {
        return "./sprites/snake_red.png";
    };

    /** The maximum health of the EelBoss. */
    static get MAX_HEALTH() {
        return 150;
    };

    /** The distance the EelBoss will "pace" back and forth. */
    static get PACE_DISTANCE() {
        return EelBoss.SCALED_SIZE.x * 2;
    };

    /** The number of seconds between attacks. */
    static get ATTACK_COOLDOWN() {
        return 2;
    };

    /** The amount of damage a EelBoss deals during an attack. */
    static get ATTACK_DAMAGE() {
        return 30;
    };

    /** Number of seconds after the start of the attack animation when damage should be dealt. */
    static get DAMAGE_DELAY() {
        return 0.6;
    }

    /**
     * Perform any necessary operations when the EelBoss dies.
     */
    handleDeath() {
        this.action = "dying";

        const pos = Vector.add(this.base.getCenter(), new Vector(0, -60));

        // add a piece of food in the eel_boss's place at bottom-center of eel_boss
        GAME.addEntity(new FoodDrop(pos, FoodDrop.BURGER, true, true));

        GAME.addEntity(new RuneDrop(pos, RuneDrop.RED, true, true));
        GAME.addEntity(new RuneDrop(Vector.add(pos, new Vector(5, 0)), RuneDrop.GREEN, true, true));
        GAME.addEntity(new RuneDrop(Vector.add(pos, new Vector(-5, 0)), RuneDrop.GREEN, true, true));
        GAME.addEntity(new RuneDrop(Vector.add(pos, new Vector(2, -2)), RuneDrop.GREEN, true, true));

        ASSET_MGR.stopAudio(MUSIC.RIVER_BOSS.path);
    }
    
    /** Change what the EelBoss is doing and where it is. */
    update() {
        this.base.update();

        if (!this.playingBossMusic && this.base.isInView()) {
            ASSET_MGR.playMusic(MUSIC.RIVER_BOSS.path, MUSIC.RIVER_BOSS.volume);
            this.playingBossMusic = true;
        }

        const deathAnim = this.animations[this.base.getFacing()]["dying"];

        if (this.health > 0) {
            const secondsSinceLastAttack = Date.now() / 1000 - this.lastAttack;

            // if we've finished our current attack, change action to idle
            if (this.action === "attacking" 
                && this.animations[this.base.getFacing()]["attacking"].totalTime < secondsSinceLastAttack) {
                    
                this.action = "idle";
            }
    
            // if Chad is close enough, bite him
            if (this.base.chadDistance() < EelBoss.SCALED_SIZE.x) {
                if (secondsSinceLastAttack > EelBoss.ATTACK_COOLDOWN) {
                    // if it's been long enough, start a new attack 
                    this.state = "pursue";
                    this.base.setTargetX(CHAD.getCenter().x);
                    this.animations[this.base.getFacing()]["attacking"].elapsedTime = 0;
                    this.action = "attacking";
                    this.lastAttack = Date.now() / 1000;
                    this.dealtDamage = false;
                } else if (this.action === "attacking" 
                    && secondsSinceLastAttack > EelBoss.DAMAGE_DELAY && !this.dealtDamage) {
                    // if we're at the proper point in our attack animation, deal damage
    
                    CHAD.takeDamage(EelBoss.ATTACK_DAMAGE);
                    this.dealtDamage = true;
                }
            }
        } else if (deathAnim.currentFrame() === deathAnim.frameCount - 1) {
            this.removeFromWorld = true;
        }
        

    };

    /** Draw the EelBoss on the canvas. */
    draw() {
        this.animations[this.base.getFacing()][this.action].drawFrame(Vector.worldToCanvasSpace(this.pos), EelBoss.SCALE);
    };

    /** Called by the constructor. Fills up the animations array. */
    loadAnimations() {
        this.animations["left"] = [];
        this.animations["right"] = [];

        this.animations["right"]["idle"] = new Animator(
            EelBoss.SPRITESHEET,
            new Vector(0, 0),
            EelBoss.SIZE,
            1, 1);
        this.animations["left"]["idle"] = new Animator(
            EelBoss.SPRITESHEET,
            new Vector(0, EelBoss.SIZE.y),
            EelBoss.SIZE,
            1, 1);
        
        // SLITHERING ANIMATIONS
        // (it takes him 1s to slither)
        this.animations["right"]["moving"] = new Animator(
            EelBoss.SPRITESHEET,
            new Vector(0, 0),
            EelBoss.SIZE,
            9, 1/9);
        this.animations["left"]["moving"] = new Animator(
            EelBoss.SPRITESHEET,
            new Vector(0, EelBoss.SIZE.y),
            EelBoss.SIZE,
            9, 1/9);

        // ATTACKING ANIMATIONS
        this.animations["right"]["attacking"] = new Animator(
            EelBoss.SPRITESHEET,
            new Vector(0, EelBoss.SIZE.y * 2),
            EelBoss.SIZE,
            10, 0.05);
        this.animations["left"]["attacking"] = new Animator(
            EelBoss.SPRITESHEET,
            new Vector(0, EelBoss.SIZE.y * 3),
            EelBoss.SIZE,
            10, 0.05);

        // DEATH ANIMATIONS
        this.animations["right"]["dying"] = new Animator(
            EelBoss.SPRITESHEET,
            new Vector(0, EelBoss.SIZE.y * 4),
            EelBoss.SIZE,
            7, 1/14);
        this.animations["left"]["dying"] = new Animator(
            EelBoss.SPRITESHEET,
            new Vector(0, EelBoss.SIZE.y * 5),
            EelBoss.SIZE,
            7, 1/14);
        
    };
};