/**
 * A type of food that can be dropped by enemies or found in the world.
 * Can be collected by Chad to restore health or gain temporary status effects.
 * 
 * @author Nathan Hinthorne
 */
class FoodDrop {

    /**
     * Constructor for a FoodDrop.
     * 
     * @param {Vector} pos The position at which the FoodDrop should start.
     * @param {number} type The type of FoodDrop that should be generated. FoodDrop.BACON, .BURGER, .ENERGY_DRINK, .STEAK, .HAM, or .CHICKEN. 
     */
    constructor(pos, type, hasGravity = true, popInAir = true) {
        if (typeof type !== "number" || type % 1 !== 0 || type < 0) {
            throw new Error("Invalid FoodDrop type: please use a FoodDrop member type (e.g. FoodDrop.STEAK).");
        }

        this.type = type;
        this.pos = pos;
        this.hasGravity = hasGravity;
        this.yVelocity = 0;
        if (popInAir) {
            // give the drop a little pop in the air when it spawns
            this.yVelocity = -200;
        }
        this.scale = FoodDrop.NORMAL_FOOD_SCALE;
        if (this.type == FoodDrop.BACON || this.type == FoodDrop.ROAST_TURKEY) {
            this.scale = FoodDrop.SPECIAL_FOOD_SCALE;
        }
        this.scaledSize = Vector.multiply(FoodDrop.SIZE, this.scale);
        this.boundingBox = new BoundingBox(this.pos, this.scaledSize);
        this.lastBoundingBox = this.boundingBox;
        this.animation = new Animator(FoodDrop.SPRITESHEET, 
            new Vector(FoodDrop.SIZE.x, type * FoodDrop.SIZE.y),
            FoodDrop.SIZE, 7, 0.15);
    }

    collect() {
        // create a particle effect
        const center = Vector.add(this.pos, Vector.divide(this.scaledSize, 2));
        GAME.addEntity(new ParticleEffect(center, ParticleEffect.FOOD_PICKUP));
        
        this.removeFromWorld = true;

        //TODO send food to inventory instead of taking effects immediately

        //! remove below code when HUD food-picker is implemented
        // play a randomly chosen sound effect
        const rand = Math.floor(Math.random() * 4) + 1;
        const sfx = SFX["FOOD_EAT" + rand];
        ASSET_MGR.playSFX(sfx.path, sfx.volume);

        switch (this.type) {
            case FoodItem.ROAST_TURKEY:
                // grant Chad extra max health
                CHAD.increaseMaxHealth(15);
                CHAD.restoreHealth(CHAD.maxHealth);
                console.log("Chad's max health is now " + CHAD.maxHealth + " HP.");
                ASSET_MGR.playSFX(SFX.LIFE_UP.path, SFX.LIFE_UP.volume);
                break;
            case FoodItem.GIANT_MUSHROOM:
                // grow chad total size by 3.5x 
                // allow him to crush enemies
                CHAD.statusEffect.apply(StatusEffect.GIANT);
                break;
            case FoodItem.BACON:
                // give chad invincibility for 10 seconds
                // grow chad total size by 1.2x 
                CHAD.statusEffect.apply(StatusEffect.INVINCIBLE);
                break;

            case FoodItem.BURGER:
                // give chad extra attack power for 20 seconds
                // grow chad's width by 1.3x
                CHAD.statusEffect.apply(StatusEffect.STRONG);
                break;

            case FoodItem.ENERGY_DRINK:
                // restore 10 HP
                CHAD.restoreHealth(10);

                // give chad extra speed and jump height for 30 seconds
                CHAD.statusEffect.apply(StatusEffect.FAST);
                break;

            case FoodItem.CHICKEN:
                // restore 20 HP
                CHAD.restoreHealth(20);
                break;

            case FoodItem.STEAK:
                // restore 40 HP
                CHAD.restoreHealth(40);
                break;

            case FoodItem.HAM:
                // restore 60 HP
                CHAD.restoreHealth(60);
                break;

            case FoodItem.BEEF:
                // restore 80 HP
                CHAD.restoreHealth(80);
                break;
        }
    }

    update() {
        if (this.boundingBox.collide(CHAD.boundingBox)) {
            this.collect();
        }

        if (this.hasGravity) {

            this.yVelocity += PHYSICS.GRAVITY_ACC * GAME.clockTick;

            // update position
            this.pos.y += this.yVelocity * GAME.clockTick;

            // update bounding box
            this.lastBoundingBox = this.boundingBox;
            this.boundingBox = new BoundingBox(this.pos, this.scaledSize);

            // check for collision with the ground
            checkBlockCollisions(this, this.scaledSize);
        }
    }

    draw() {
        this.animation.drawFrame(Vector.worldToCanvasSpace(this.pos), this.scale);
    }

    /** The Food spritesheet. */
    static get SPRITESHEET() {
        return "./sprites/food.png";
    };

    /** The scale at which a MEAT FoodDrop is drawn. */
    static get NORMAL_FOOD_SCALE() {
        return 2.5;
    };

    static get SPECIAL_FOOD_SCALE() {
        return 3.5;
    }



    /** The size (in pixels) of the space allotted to each FoodDrop type on the spritesheet. */
    static get SIZE() {
        return new Vector(32, 32);
    }



    // TYPES
    
    /** The Bacon FoodDrop type. */
    static get BACON() {
        return 0;
    };

    /** The Burger FoodDrop type. */
    static get BURGER() {
        return 1;
    };

    /** The Energy Drink FoodDrop type. */
    static get ENERGY_DRINK() {
        return 2;
    };

    /** The Steak FoodDrop type. */
    static get STEAK() {
        return 3;
    };

    /** The Ham FoodDrop type. */
    static get HAM() {
        return 4;
    };

    /** The Chicken FoodDrop type. */
    static get CHICKEN() {
        return 5;
    };

    /** The Beef FoodDrop type. */
    static get BEEF() {
        return 6;
    };

    /** The Giant Mushroom FoodDrop type. */
    static get GIANT_MUSHROOM() {
        return 7;
    }

    /** The Roast Turkey FoodDrop type. */
    static get ROAST_TURKEY() {
        return 8;
    }
}