/**
 * A class used to display a health bar next to an entity in the game world.
 * 
 * @author Trae Claar
 */
class HealthBar {
    /**
     * Constructor for a HealthBar. The target must be an entity with a field named "health" that
     * is a number.
     * 
     * @param {Entity} target the entity to assign to the HealthBar (must have a health field)
     * @param {number} targetMaxHealth the maximum health of target
     * @param {number} targetWidth the width of target
     * @param {number} [barWidth] (OPTIONAL) the width of the HealthBar
     * @throws {Error} Will throw an error if target has no numeric health field.
     */
    constructor(target, targetMaxHealth, targetWidth, barWidth = HealthBar.DEFAULT_SIZE.x) {
        if (!target.health || !typeof(target.health) === "number") {
            throw new TypeError("HealthBar target does not contain a valid health field: target.health"
            + " must not be null and must be a number.");
        }

        this.target = target;
        this.maxHealth = targetMaxHealth;
        this.targetWidth = targetWidth;
        this.size = new Vector(barWidth, HealthBar.DEFAULT_SIZE.y);
    };

    /** The default size (in pixels) of the HealthBar on the canvas. */
    static get DEFAULT_SIZE() {
        return new Vector(100, 20);
    };

    /** The padding between the actual health bar and the outer edge of the border. */
    static get PADDING() {
        return 5;
    };

    /** The vertical offset applied to the HealthBar. */
    static get Y_OFFSET() {
        return -HealthBar.DEFAULT_SIZE.y - 5;
    };

    /** Update the HealthBar. */
    update() {
        if (this.target.health <= 0) {
            this.removeFromWorld = true;
        }
    };

    /** Draw the HealthBar. */
    draw() {
        if (this.target.health < this.maxHealth) {
            const xPos = this.target.pos.x + (this.targetWidth - this.size.x) / 2;
            const canvasPos = Vector.worldToCanvasSpace(new Vector(xPos, 
                this.target.pos.y + HealthBar.Y_OFFSET));
            
            // draw background
            CTX.fillStyle = "#000000";// "#696969";
            CTX.fillRect(canvasPos.x, canvasPos.y, this.size.x, this.size.y);
    
            // draw the actual health bar
            CTX.fillStyle = "#ff0000";
            CTX.fillRect(canvasPos.x + HealthBar.PADDING, canvasPos.y + HealthBar.PADDING, 
                (this.size.x - HealthBar.PADDING * 2) * this.target.health / this.maxHealth,
                this.size.y - HealthBar.PADDING * 2);
        }
        
    };
}