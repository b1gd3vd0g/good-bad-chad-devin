/**
 * Class that handles functionality for flying enemies that move randomly along a 
 * preset path. 
 * 
 * @author Trae Claar
 */
class FlyingEnemyBase {

    /**
     * Constructor for a FlyingEnemyBase.
     * 
     * @param {Entity} enemy the enemy associated with this EnemyBase
     * @param {Vector} pos the initial position of the enemy
     * @param {number} scaledSize the size of the enemy
     * @param {number} speed the speed of the enemy
     * @param {number} health the initial health of the enemy
     * @param {function} onDeath callback function invoked when the enemy dies
     * @param {Vector[]} path array of ordered Vectors that delineate the enemy's path RELATIVE TO ITS SPAWN POSITION
     */
    constructor(enemy, pos, scaledSize, speed, health, onDeath, path) {
        this.enemy = enemy;
        this.base = new EnemyBase(enemy, pos, scaledSize, speed, health, onDeath);

        this.path = this.relativeToAbsolute(path, pos);

        enemy.getDirection = () => this.getDirection();

        // set the enemy's target position as the nearest path node
        for (let i = 0; i < path.length; i++) {
            if (!this.target || Vector.distance(enemy.pos, path[i])
                < Vector.distance(enemy.pos, this.target)) {

                this.target = i;
            }
        }

        if (!enemy.takeDamage) {
            enemy.takeDamage = (amount) => this.takeDamage(amount);
        }
    }

    /**
     * Convert the relative path to an absolute path.
     * 
     * @param {Vector[]} path the relative path
     * @param {Vector} pos the position of the enemy
     * @returns {Vector[]} the absolute path
     */
    relativeToAbsolute(path, pos) {
        return path.map((node) => Vector.add(node, pos));
    }

    /**
     * Get the direction in which the enemy is currently facing.
     * 
     * @returns {number} -1 for left and 1 for right
     */
    getDirection() {
        return this.path[this.target].x - this.enemy.getCenter().x > 0 ? 1 : -1;
    }

    /**
     * Does nothing. For compatibility with StatusEffect.
     */
    flee() {

    }

    /**
     * Update the enemy's position and target.
     */
    update() {
        if (this.enemy.isDead) return;

        this.base.updateBoundingBox();

        // if we've reached the target position, select a new target position
        if (Vector.distance(this.enemy.pos, this.path[this.target]) < this.enemy.scaledSize.x / 2) {
            const hasPrev = this.target > 0;
            const hasNext = this.target < this.path.length - 1

            // if there are previous AND next nodes in the path, randomly choose between them
            // otherwise, choose whichever is available
            if (hasPrev && hasNext) {
                this.target += ((Math.random() > 0.5) ? -1 : 1);
            } else if (hasPrev) {
                this.target -= 1;
            } else if (hasNext) {
                this.target += 1;
            }
        }

        const velocity = Vector.multiply(Vector.unit(Vector.subtract(
            this.path[this.target], this.enemy.pos)), this.enemy.speed * GAME.clockTick);
        this.enemy.pos = Vector.add(this.enemy.pos, velocity);
    }



    // presets for paths

    static get STRAIGHT_LINE() {
        return [new Vector(0, 0), new Vector(400, 0)];
    }

    static get ZIG_ZAG() {
        return [new Vector(0, 0), new Vector(200, 200), new Vector(400, 0), new Vector(200, -200), new Vector(0, 0)];
    }

    static get SINE_WAVE() {
        return [new Vector(0, 0), new Vector(200, 200), new Vector(400, 0), new Vector(600, -200), new Vector(800, 0)];
    }

    static get CIRCLE() {
        return [new Vector(0, 0), new Vector(200, 200), new Vector(400, 0), new Vector(200, -200), new Vector(0, 0)];
    }

    static get UP_AND_DOWN() {
        return [new Vector(0, 0), new Vector(0, 200), new Vector(0, 0)];
    }

    static get LEFT_AND_RIGHT() {
        return [new Vector(0, 0), new Vector(200, 0), new Vector(0, 0)];
    }

    static get JUMP() {
        return [new Vector(0, 0), new Vector(0, -200), new Vector(0, 0)];
    }

}