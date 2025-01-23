/**
 * A physics component for an entity.
 * 
 * The physics component is responsible for handling the physics of an entity.
 * It stores the mass, velocity, and acceleration of the entity.
 * 
 * How to use:
 * - Call updateMovement() in the entity's update() method, after applying all forces and drag.
 * - Call applyForce(PhysicsComponent.GRAVITY) to apply gravity.
 * - Call applyDrag(PhysicsComponent.AIR_RESISTANCE) to apply air resistance when in the air.
 * - Call applyDrag(friction) to apply friction when standing on a block.
 * 
 * @author Nathan Hinthorne
 */
class PhysicsComponent {
    /**
     * Constructor for the physics component.
     * 
     * @param {number} mass The mass of the entity. 
     */
    constructor(mass) {
        this.mass = mass;
        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);
    }

    /**
     * Use the current net force to update the entity's movement.
     */
    updateMovement() {
        this.velocity = Vector.add(this.velocity, this.acceleration);
        this.acceleration = new Vector(0, 0); // Reset acceleration

        // perform terminal velocity check
        if (this.velocity.y > PhysicsComponent.TERMINAL_Y_VELOCITY) {
            this.velocity = new Vector(this.velocity.x, -PhysicsComponent.TERMINAL_Y_VELOCITY);
        }

        // Finally, update the position
        this.pos = Vector.add(this.pos, this.velocity);
    }

    /**
     * Apply a force to the entity.
     * 
     * Use PhysicsComponent.GRAVITY for gravity.
     * 
     * @param {Vector} force The force to apply.
     */
    applyForce(force) {
        // Newton's second law: F = ma  =>  a = F / m
        const acceleration = Vector.divide(force, this.mass);
        this.acceleration = this.acceleration.add(acceleration); // net force
    }

    /**
     * Apply drag to the entity.
     * 
     * - For air resistance, call whenever in the air. 
     *   - (Use PhysicsComponent.AIR_RESISTANCE).
     * 
     * - For friction, call whenever standing on block. 
     *   - (Use current block's friction property).
     * 
     * @param {number} dragCoefficient The drag coefficient to apply.
     */
    applyDrag(dragCoefficient) {
        const dragForce = Vector.multiply(this.velocity, -dragCoefficient);
        this.applyForce(dragForce);
    }


    /** 
     * Gravity acceleration in pixels/seconds^2
     */
    static get GRAVITY() {
        return new Vector(0, 0.3);
    }

    /**
     * Air resistance coefficient
     */
    static get AIR_RESISTANCE() {
        return 0.1;
    }

    /**
     * Terminal velocity in pixels/second
     */
    static get TERMINAL_Y_VELOCITY() {
        return 10;
    }
}