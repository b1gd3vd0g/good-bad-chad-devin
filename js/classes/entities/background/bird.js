/**
 * Class which represents a Bird background entity that flies continuously
 * across the screen.
 * 
 * @author Trae Claar
 */
class Bird {
    /**
     * Constructor for a Bird.
     * 
     * @param {number} minX the minimum x position (in pixels) a bird can achieve before resetting
     * @param {number} minY the minimum y position (in pixels) a bird can achieve before resetting
     * @param {number} maxX the maximum x position (in pixels) a bird can achieve before resetting
     * @param {number} maxY the maximum y position (in pixels) a bird can achieve before resetting
     */
    constructor(minX, minY, maxX, maxY) {
        this.minX = minX - this.actualWidth();
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
        this.animator = new Animator(Bird.SPRITESHEET, 0, 0, Bird.SIZE.x, Bird.SIZE.y, 8, 1/16);

        this.reset();
    };

    /** A Bird's spritesheet. */
    static get SPRITESHEET() {
        return "./sprites/bird.png";
    };

    /** The pixel dimensions of a Bird on its spritesheet. */
    static get SIZE() {
        return new Vector(32, 16);
    };

    /** The speed (in pixels/frame) of a Bird. */
    static get SPEED() {
        return 1.5;
    };

    /** The scale factor applied to the Bird's spritesheet when drawing. */
    static get SCALE() {
        return 1;
    };

    /** Update the Bird. */
    update() {
        this.pos = Vector.add(this.pos, Vector.multiply(this.dir, Bird.SPEED));
       
        if (this.pos.x <= this.minX || this.pos.x >= this.maxX) {
            this.reset();
        }
    };

    /** Draw the Bird. */
    draw() {
        this.animator.drawFrame(this.pos.x, this.pos.y, Bird.SCALE);
    };

    /** 
     * Helper function for getting a random valid y-position for the Bird.
     * 
     * @return {number} a random value between 0 and the Bird's maximum y-position 
     */
    randomY() {
        return this.minY + Math.random() * (this.maxY - this.minY);
    };

    /** 
     * Calculates the width (in pixels) of the Bird based on the scale. 
     * 
     * @return {number} the actual width of the Bird when drawn
     */
    actualWidth() {
        return Bird.SIZE.x * Bird.SCALE;
    };

    /**
     * Resets the Bird. That is, returns it to the left or right edge of its bounds
     * and selects a new direction.
     */
    reset() {
        // spawn on the left of the screen
        let originX = this.minX;
        let targetX = this.maxX;
        if (Math.random() > 0.5) {
            // or on the right
            originX = this.maxX;
            targetX = this.minX;
        }

        this.pos = new Vector(originX, this.randomY());
        this.dir = Vector.direction(this.pos, new Vector(targetX, this.randomY()));
    };
};