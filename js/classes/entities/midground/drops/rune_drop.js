/**
 * A type of rune that can be dropped by enemies or found in the world.
 * Can be collected by Chad to gain currency.
 * 
 * @author Nathan Hinthorne
 */
class RuneDrop {
    /**
     * @param {Vector} pos 
     * @param {number} type 
     */
    constructor(pos, type, hasGravity = true, popInAir = true) {
        this.pos = pos;
        this.type = type;
        this.amount = RuneDrop.VALUE_MAP[type];
        this.hasGravity = hasGravity;

        this.velocity = new Vector(0, 0);
        if (popInAir) {
            // give the drop a little pop in the air when it spawns
            this.yVelocity = -300;
        }
        this.scale = RuneDrop.SCALE;
        this.scaledSize = Vector.multiply(RuneDrop.SIZE, this.scale);
        this.center = Vector.add(this.pos, Vector.multiply(this.scaledSize, 0.5));
        this.boundingBox = new BoundingBox(this.pos, this.scaledSize);
        this.lastBoundingBox = this.boundingBox;

        this.animation = new Animator(RuneDrop.SPRITESHEET,
            new Vector(RuneDrop.SIZE.x, type * RuneDrop.SIZE.y),
            RuneDrop.SIZE, 8, 0.15);
    }

    collect() {
        // create a particle effect
        const center = Vector.add(this.pos, Vector.divide(this.scaledSize, 2));
        GAME.addEntity(new ParticleEffect(center, ParticleEffect.RUNE_PICKUP));
        ASSET_MGR.playSFX(SFX.COIN_COLLECT.path, SFX.COIN_COLLECT.volume);

        this.removeFromWorld = true;

        //TODO send ammo to inventory
        INVENTORY.collectRunes(this.amount);
    }

    update() {
        if (this.boundingBox.collide(CHAD.boundingBox)) {
            this.collect();
        }

        if (this.hasGravity) {

            // move toward player like a magnet when close enough
            const chadDist = Vector.distance(this.center, CHAD.getCenter());
            if (chadDist < 300) {
                const chadDir = Vector.direction(this.pos, CHAD.pos);
                const speedMultiplier = chadDist / 10; // make the speed increase as the distance decreases
                this.velocity = Vector.add(this.velocity, Vector.multiply(chadDir, speedMultiplier));
                console.log("CHAD SIGHTING. Moving towards player.");

            } else {
                this.velocity = Vector.add(this.velocity, new Vector(0, PHYSICS.GRAVITY_ACC * GAME.clockTick));
            }


            // update position
            this.pos = Vector.add(this.pos, Vector.multiply(this.velocity, GAME.clockTick));

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
        CTX.font = RuneDrop.TEXT_SIZE + "px vt323";

        const text = "$" + this.amount;
        const textWidth = CTX.measureText(text).width;
        const worldPos = Vector.worldToCanvasSpace(Vector.add(this.pos, new Vector(0, -ItemLabel.TEXT_SIZE)));
        CTX.fillText(text, worldPos.x + this.scaledSize.x - textWidth, worldPos.y + ItemLabel.TEXT_SIZE);
    }


    /** The Rune spritesheet. */
    static get SPRITESHEET() {
        return "./sprites/runes.png";
    }

    static get PURPLE() {
        return 0;
    }

    static get WHITE() {
        return 1;
    }

    static get GREEN() {
        return 2;
    }

    static get GRAY() {
        return 3;
    }

    static get RED() {
        return 4;
    }

    static get YELLOW() {
        return 5;
    }

    static get SCALE() {
        return 1.5;
    }

    static get SIZE() {
        return new Vector(36, 36);
    }

    static get TEXT_SIZE() {
        return 32;
    }

    //map for type of rune to value
    static get VALUE_MAP() {
        return {
            0: 1,
            1: 2,
            2: 5,
            3: 10,
            4: 20,
            5: 50
        }
    }
};