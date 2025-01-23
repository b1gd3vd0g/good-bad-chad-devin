/**
 * A circular loading animation that represents the player's current dash charge.
 * Indicates when the player is able to dash.
 * 
 * @author Nathan Hinthorne
 */
class DashCooldown {
    /**
     * @param {Vector} pos The position of the cooldown animation.
     */
    constructor(pos) {
        /** The position of the cooldown animation. */
        this.pos = pos;

        /** Ranges from 0% to 100% */
        this.progress = 100;

        /** The animator for the cooldown animation. */
        this.animator = new Animator(DashCooldown.SPRITESHEET, 
            new Vector(0, 0), DashCooldown.SIZE, 
            DashCooldown.NUMBER_OF_FRAMES, 0 // 0 duration because don't want time-based animations
        );
    }

    update() {
        this.progress = (CHAD.dashCooldownTimer / Chad.DASH_COOLDOWN) * 100;
        
        if (this.progress < 0 || this.progress > 100) {
            throw new Error("DashCooldown progress out of bounds: " + this.progress);
        }
    }

    draw() {
        const currFrame = DashCooldown.NUMBER_OF_FRAMES - Math.floor(this.progress / (DashCooldown.MAX_CHARGE / DashCooldown.NUMBER_OF_FRAMES));
        
        // APPROACH 1: Using the animator
        // this.animator.drawGivenFrame(this.pos, DashCooldown.SCALED_SIZE, currFrame);

        // APPROACH 2: Using the context
        CTX.drawImage(ASSET_MGR.getAsset(DashCooldown.SPRITESHEET), 
            (DashCooldown.SIZE.x * (currFrame-1)), 0,
            DashCooldown.SIZE.x, DashCooldown.SIZE.y,
            this.pos.x, this.pos.y, 
            DashCooldown.SCALED_SIZE.x, DashCooldown.SCALED_SIZE.y);
    }

    static get NUMBER_OF_FRAMES() {
        return 7;
    }

    static get MAX_CHARGE() {
        return 100;
    }

    static get SPRITESHEET() {
        return "./sprites/dash-cooldown.png";
    }

    static get SIZE() {
        return new Vector(64, 64);
    }

    static get SCALE() {
        return 1.2;
    }

    static get SCALED_SIZE() {
        return Vector.multiply(DashCooldown.SIZE, DashCooldown.SCALE);
    }
}