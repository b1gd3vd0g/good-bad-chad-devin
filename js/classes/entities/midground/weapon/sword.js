/**
 * A class that represents Chad's sword. Because the sword sprite is a part of 
 * Chad's attack animation, the Sword does not draw itself. Instead, this class
 * is responsible for (1) waiting for the user to initiate a Sword attack,  
 * (2) dealing damage, and (3) drawing its bounding box in debug mode.
 * 
 * @author Trae Claar
 * @author Nathan Hinthorne
 */
class Sword {
    /**
     * Constructor for a Sword which takes an initial type.
     */
    constructor(swordLevel) {
        this.hasHit = false;
        this.lastAttack = 0;
        this.damage = Sword.LEVEL_1_DAMAGE;
        
        if (swordLevel === 1) {
            this.damage = Sword.LEVEL_1_DAMAGE;
        } else if (swordLevel === 2) {
             this.damage = Sword.LEVEL_2_DAMAGE;
        } else if (swordLevel === 3) {
             this.damage = Sword.LEVEL_3_DAMAGE;
        }
    };

    /** The size of the Sword in the game world before scaling. */
    static get SIZE() {
        return new Vector(40, Chad.DEFAULT_BOUNDING_BOX_SIZE.y);
    };

    /** The spritesheet containing all the Sword types. */
    static get SPRITESHEET() {
        // TODO: determine if this property still belongs here. The HUD still uses
        // it, but it is no longer used within this class.
        return "./sprites/swords.png";
    };

    /** The duration of an attack, in seconds. */
    static get DURATION() {
        return 2 / 5;
    }

    /** The amount of damage the Sword deals during an attack. */
    static get LEVEL_1_DAMAGE() {
        return 3;
    };

    /** The amount of damage the Sword deals during an attack. */
    static get LEVEL_2_DAMAGE() {
        return 5;
    };

    /** The amount of damage the Sword deals during an attack. */
    static get LEVEL_3_DAMAGE() {
        return 7;
    };

    upgrade() {
        if (this.damage === Sword.LEVEL_1_DAMAGE) {
            this.damage = Sword.LEVEL_2_DAMAGE;
        } else if (this.damage === Sword.LEVEL_2_DAMAGE) {
            this.damage = Sword.LEVEL_3_DAMAGE;
        } else {
            console.log("Sword is already at its maximum damage level.");
        }
    }

    /** 
     * Whether or not an attack is ongoing. 
     * 
     * @returns {boolean} true if a Sword attack is underway, false otherwise
     */
    isSlicing() {
        return (Date.now() - this.lastAttack) / 1000 < Sword.DURATION;
    }

    /**
     * Finds the position of the Sword's bounding box based on Chad's current position, 
     * scale, and direction.
     * 
     * @returns {Vector} the current position of the Sword's bounding box
     */
    calculatePosition() {
        const chadBBOffset = CHAD.getBoundingBoxOffset().x;
        const offset = (CHAD.facing === "left") ? -this.calculateSize().x + chadBBOffset : chadBBOffset + CHAD.scaledSize.x;
        return Vector.add(CHAD.pos, new Vector(offset, CHAD.getBoundingBoxOffset().y));
    }

    /**
     * Calculates the current size of the Sword's bounding box based on Chad's current
     * scale factor.
     * 
     * @returns {Vector} the size of the Sword's bounding box
     */
    calculateSize() {
        return new Vector(Sword.SIZE.x * CHAD.scale.x, Sword.SIZE.y * CHAD.scale.y);
    }

    /** Update the Sword. */
    update() {
        if (CHAD.health <= 0) return;

        if (!this.isSlicing()) {
            // the Sword is not currently attacking

            if (GAME.user.jabbing) { 
                // a new attack is starting

                this.hasHit = false;
                this.lastAttack = Date.now();

                // choose from 3 different swing sounds
                const rand = Math.floor(Math.random() * 3) + 8;
                const sfx = SFX["SWORD_SWING" + rand];
                ASSET_MGR.playSFX(sfx.path, sfx.volume);

                // reset Chad's attack animations
                CHAD.animations[CHAD.facing]["slicing"].elapsedTime = 0;
                CHAD.animations[CHAD.facing]["slicingStill"].elapsedTime = 0;
            }
        } else if (!this.hasHit) {
            // an attack is currently underway

            const bb = new BoundingBox(this.calculatePosition(), this.calculateSize());

            GAME.entities.midground.forEach((entity) => {
                if (this != entity && entity.boundingBox && entity.takeDamage) {
                    if (bb.collide(entity.boundingBox)) {
                        entity.takeDamage(this.damage * CHAD.damageMultiplier);
                        this.hasHit = true;

                        //TODO find a way to implement knockback that appears more natural
                        // if (entity.knockback) {
                        //     // if the entity has a knockback method, knock it back
                        //     entity.knockback(30);
                        // }
                        
                        // choose from 3 different hit sounds
                        const rand = Math.floor(Math.random() * 3) + 1;
                        const sfx = SFX["SWORD_HIT" + rand];
                        ASSET_MGR.playSFX(sfx.path, sfx.volume);
                    }
                }
            });
        }
    };

    /** Draw the Sword's bounding box when debug mode is on. */
    draw() {
        if (GAME.debug) {
            const basePos = Vector.worldToCanvasSpace(this.calculatePosition());
            CTX.strokeStyle = "purple";
            CTX.strokeRect(basePos.x, basePos.y, this.calculateSize().x, this.calculateSize().y)
        }
    };

};