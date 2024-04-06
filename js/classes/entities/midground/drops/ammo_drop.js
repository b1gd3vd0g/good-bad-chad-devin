/**
 * A type of ammo that can be dropped by enemies or found in the world.
 * Can be collected by Chad to fire out of slingshot
 * 
 * @author Nathan Hinthorne
 */
class AmmoDrop {

    /**
     * @param {Vector} pos The position at which the AmmoDrop should start.
     * @param {number} type The type of AmmoDrop that should be generated. AmmoDrop.ROCK, .BOMB, etc.
     */
    constructor(pos, type, amount = 1, hasGravity = true, popInAir = true) {

        this.type = type;
        this.pos = pos;
        this.amount = amount;
        this.hasGravity = hasGravity;
        this.yVelocity = 0;
        if (popInAir) {
            // give the drop a little pop in the air when it spawns
            this.yVelocity = -100;
        }
        this.scale = AmmoDrop.SCALE;
        this.scaledSize = Vector.multiply(AmmoDrop.SIZE, this.scale);
        this.boundingBox = new BoundingBox(this.pos, this.scaledSize);
        this.lastBoundingBox = this.boundingBox;

        const yCoordinate = AmmoDrop.SPRITESHEET_COORDINATES[type];
        this.animation = new Animator(AmmoDrop.SPRITESHEET, 
            new Vector(0, yCoordinate * AmmoDrop.SIZE.y),
            AmmoDrop.SIZE, 7, 0.15);
    }

    collect() {
        // create a particle effect
        const center = Vector.add(this.pos, Vector.divide(this.scaledSize, 2));
        GAME.addEntity(new ParticleEffect(center, ParticleEffect.AMMO_PICKUP));
        ASSET_MGR.playSFX(SFX.AMMO_COLLECT.path, SFX.AMMO_COLLECT.volume);
        
        this.removeFromWorld = true;

        //TODO send ammo to inventory
        INVENTORY.adjustAmmo(this.type, this.amount);
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

        CTX.fillStyle = "white";
        CTX.font = ItemLabel.TEXT_SIZE + "px vt323";

        const text = "x" + this.amount;
        const textWidth = CTX.measureText(text).width;
        const worldPos = Vector.worldToCanvasSpace(this.pos);
        CTX.fillText(text, worldPos.x + this.scaledSize.x - textWidth, worldPos.y + ItemLabel.TEXT_SIZE);
    }

    /** The ammo spritesheet. */
    static get SPRITESHEET() {
        return "./sprites/ammo_drops.png";
    };

    /** The scale at which an AmmoDrop is drawn. */
    static get SCALE() {
        return 2;
    };


    /** The size (in pixels) of the space allotted to each AmmoDrop type on the spritesheet. */
    static get SIZE() {
        return new Vector(32, 32);
    }



    // TYPES
    static get ROCK() {
        return "rock";
    }

    static get SLIMEBALL() {
        return "slimeball";
    }

    static get BOMB() {
        return "bomb";
    }

    static get SNOWBALL() {
        return "snowball";
    }

    static get SUS_SNOWBALL() {
        return "sus_snowball";
    }

    static get BROCCOLI() {
        return "broccoli";
    }

    static get WATER_BALLOON() {
        return "water_balloon";
    }

    static get SPRITESHEET_COORDINATES() {
        return {
            "rock": 0,
            "slimeball": 1,
            "bomb": 2,
            "snowball": 3,
            "sus_snowball": 4,
            "broccoli": 5,
            "water_balloon": 6
        };
    }

}