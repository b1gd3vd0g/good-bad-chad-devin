/**
 * This class creates bounding boxes, which are used to check for collisions within the gameplay.
 * The collisions will include blocking movement (like running into a wall), taking damage (either the player or an enemy), etc.
 * @author Chris Marriott, Devin Peevy
 */
class BoundingBox {
    /**
     * @param {Vector} pos The position of the top left corner of the bounding box.
     * @param {Vector} size The size of the bounding box.
     */
    constructor(pos, size) {
        /** The position of the top left corner of the bounding box. */
        this.pos = pos;
        /** The size of the bounding box. */
        this.size = size;
        /** The x coordinate of the left boundary of the box. */
        this.left = pos.x;
        /** The x coordinate of the  right boundary of the box. */
        this.right = pos.x + size.x;
        /** The y coordinate of the top boundary of the box. */
        this.top = pos.y;
        /** The y coordinate of the bottom boundary of the box. */
        this.bottom = pos.y + size.y;
    };

    /**
     * This method checks for the collision between two bounding boxes.
     * @param {BoundingBox} other The bounding box which we are comparing to check for a collision.
     * @returns true if the two bounding boxes intersect; else false.
     */
    collide(other) {
        return (this.top < other.bottom) && (this.left < other.right) && (this.bottom > other.top) && (this.right > other.left);
    };
};