/**
 * A class which represents a 2-dimensional vector that can be used for positions,
 * sizes, or other constructs with two numerical fields.
 * 
 * While you should directly access the fields of this class to read their values, 
 * please avoid mutating them. Instead, make use of the provided methods to create
 * new instances.
 * 
 * @author Trae Claar
 * @author Nathan Hinthorne
 */
class Vector {
    /**
     * Constructor for a Vector. 
     * 
     * @param {number} x the x-component of the Vector
     * @param {number} y the y-component of the Vector
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    };

    /**
     * Add two Vector instances together.
     * 
     * @param {Vector} a the first Vector to add
     * @param {Vector} b the second Vector to add
     * @returns {Vector} the sum of a and b
     */
    static add(a, b) {
        return new Vector(a.x + b.x, a.y + b.y);
    };

    /**
     * Subtract one Vector instance from another.
     * 
     * @param {Vector} a the Vector from which to subtract the other
     * @param {Vector} b the Vector to subtract from the other
     * @returns {Vector} the quotient of a and b (a - b)
     */
    static subtract(a, b) {
        return new Vector(a.x - b.x, a.y - b.y);
    };

    /**
     * Multiplies a Vector by a scalar.
     * 
     * @param {Vector} v the Vector to multiply
     * @param {number} s the number by which to multiply the Vector
     * @returns {Vector} the product of v and s
     */
    static multiply(v, s) {
        return new Vector(s * v.x, s * v.y);
    };

    /**
     * Divides a Vector by a scalar.
     * 
     * @param {Vector} v the Vector to divide
     * @param {number} s the number by which to divide the Vector
     * @returns {Vector} the quotient of v and s
     * @throws {Error} Will throw an error if s is zero.
    */
    static divide(v, s) {
        if (s === 0) {
            throw new Error("Cannot divide by zero.");
        }
        return new Vector(v.x / s, v.y / s);
    }

    /**
     * Calculates the magnitude of the provided Vector. 
     * |v| = sqrt(x^2 + y^2), where x and y are v's x- and and y-component respectively.
     * 
     * @param v the Vector for which to calculate magnitude
     * @returns {number} the Vector's magnitude
     */
    static magnitude(v) {
        return Math.sqrt(v.x ** 2 + v.y ** 2);
    };

    /**
     * Calculates the unit vector for the provided Vector. 
     * u = v/|v| 
     * 
     * @param v the Vector for which to calculate the unit vector
     * @returns {Vector} the unit vector corresponding to the current instance
     */
    static unit(v) {
        const magnitude = Vector.magnitude(v);
        return new Vector(v.x / magnitude, v.y / magnitude);
    };

    /**
     * Finds the distance between two Vector instances.
     * 
     * @param {Vector} a the first Vector
     * @param {Vector} b the second Vector
     * @returns {number} the distance between a and b
     */
    static distance(a, b) {
        return Vector.magnitude(Vector.subtract(a, b));
    };

    /**
     * Calculates the vector corresponding to the direction between two Vector instances.
     * The returned vector will always be a unit vector.
     * 
     * @param {Vector} a the Vector to find the direction from
     * @param {Vector} b the Vector to find the direction to
     * @returns {Vector} the direction from a to b
     */
    static direction(a, b) {
        return Vector.unit(Vector.subtract(b, a));
    };

    /**
     * Reflects a Vector across another Vector.
     * 
     * @param {Vector} a the Vector to reflect
     * @param {Vector} b the Vector across which to reflect a
     * @returns {Vector} the reflection of a across b
     */
    static reflect(a, b) {
        return Vector.subtract(a, Vector.multiply(b, 2 * Vector.dot(a, b)));
    }

    static get HORIZONTAL() {
        return new Vector(1, 0);
    }

    static get VERTICAL() {
        return new Vector(0, 1);
    }

    /**
     * Calculates the dot product of two Vector instances.
     * 
     * @param {Vector} a the first Vector
     * @param {Vector} b the second Vector
     * @returns {number} the dot product of a and b
     */
    static dot(a, b) {
        return a.x * b.x + a.y * b.y;
    }

    /**
     * Round the provided Vector's fields.
     * 
     * @param {Vector} v the Vector to round
     * @returns {Vector} a Vector with integer field values
     */
    static round(v) {
        return new Vector(Math.round(v.x), Math.round(v.y));
    }

    /**
     * Translates the Vector from world coordinates to canvas coordinates.
     * 
     * @param v the Vector to translate
     * @returns {Vector} a new instance translated to canvas coordinates
     */
    static worldToCanvasSpace(v) {
        return new Vector(v.x - CAMERA.pos.x, v.y - CAMERA.pos.y);
    };

    /**
     * Translates the Vector from canvas coordinates to world coordinates.
     * 
     * @param v the Vector to translate
     * @returns {Vector} a new instance translated to world coordinates
     */
    static canvasToWorldSpace(v) {
        return new Vector(v.x + CAMERA.pos.x, v.y + CAMERA.pos.y);
    };

    /**
     * Translates the Vector from world coordinates to block coordinates. This operation 
     * is potentially lossy if the vector is not divisible by the block width as it will 
     * truncate any decimal results.
     * 
     * @param v the Vector to translate
     * @returns {Vector} a new instance translated to block coordinates
     */
    static worldToBlockSpace(v) {
        return new Vector(Math.floor(v.x / Block.SCALED_SIZE), Math.floor(v.y / Block.SCALED_SIZE));
    };

    /**
     * Translates the Vector from block coordinates to world coordinates.
     * 
     * @param v the Vector to translate
     * @returns {Vector} a new instance translated to world coordinates
     */
    static blockToWorldSpace(v) {
        return Vector.multiply(v, Block.SCALED_SIZE);
    };
}