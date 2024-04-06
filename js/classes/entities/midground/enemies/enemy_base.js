/**
 * Class which provides basic functionality for enemy entities, including taking damage and 
 * bounding box maintenance.
 * 
 * @author Trae Claar
 * @author Nathan Hinthorne
 */
class EnemyBase {
    
    /**
     * Constructor for an EnemyBase.
     * 
     * @param {Entity} enemy the enemy associated with this EnemyBase
     * @param {Vector} pos the initial position of the enemy
     * @param {number} scaledSize the size of the enemy, in pixels, in the game world
     * @param {number} speed the speed of the enemy
     * @param {number} health the initial health of the enemy
     * @param {function} onDeath callback function invoked when the enemy dies
     * @param {function} [onDamage] callback function invoked when the enemy takes damage
     */
    constructor(enemy, pos, scaledSize, speed, health, onDeath, onDamage) {
        this.enemy = enemy;

        enemy.pos = pos;
        enemy.scaledSize = scaledSize;
        enemy.speed = speed;
        enemy.baseSpeed = speed;
        enemy.health = health;
        enemy.isEnemy = true;
        enemy.statusEffect = new StatusEffect(enemy);
        GAME.addEntity(enemy.statusEffect);

        enemy.boundingBox = new BoundingBox(pos, scaledSize);
        enemy.lastBoundingBox = this.enemy.boundingBox;

        enemy.getCenter = () => this.getCenter(); // re-direct any references towards the enemy's getCenter to this one
        enemy.getTopLeft = () => this.getTopLeft(); // re-direct any references towards the enemy's getTopLeft to this one
        enemy.getFacing = () => this.getFacing();

        this.maxHealth = health; 
        this.onDeath = onDeath;
        this.onDamage = onDamage;
        this.isDead = false;

        if (!enemy.takeDamage) {
            enemy.takeDamage = (amount) => this.takeDamage(amount);
        }

        GAME.addEntity(new HealthBar(enemy, health, scaledSize.x));
    }

    /** 
     * Decrease the health of the enemy by the provided amount and perform any necessary operations
     * based on the new health value. If the enemy's health is less than or equal to 0, its onDeath 
     * callback will be invoked. Otherwise, it will invoke the onDamage callback, if it exists.
     * 
     * @param {number} amount the amount by which to decrease the enemy's health
     */
    takeDamage(amount) {
        this.enemy.health -= amount;
        if (this.enemy.health <= 0 && !this.isDead) {
            this.onDeath();
            this.isDead = true; // prevent multiple calls to onDeath
        } else {
            if (this.onDamage) this.onDamage();
        }
    };

    /**
     * NOTE: Slight bug where enemy is considered "out of view" when it's at the LEFT edge of the camera. Should be insignificant.
     * Fix with an offset if it becomes a problem.
     * 
     * @returns {boolean} true if the enemy is within the camera's view, false otherwise
     */
    isInView() {
        return this.enemy.pos.x > CAMERA.pos.x && this.enemy.pos.x < CAMERA.pos.x + Camera.SIZE.x;
    }

    /**
     * The direction in which the enemy is facing as a string, for animation use.
     * 
     * @returns {string} "left" or "right"
     */
    getFacing() {
        return (this.enemy.getDirection() < 0) ? "left" : "right";
    }

    /**
     * Get the center of the enemy.
     * 
     * @returns {Vector} the center of the enemy
     */
    getCenter() {
        return Vector.add(this.enemy.pos, new Vector(this.enemy.scaledSize.x / 2, this.enemy.scaledSize.y / 2));
    }

    /**
     * Used for status effect checks.
     * 
     * @returns {Vector} the top left corner of the enemy
     */
    getTopLeft() {
        return this.enemy.pos;
    }

    /**
     * Update the bounding box of the enemy.
     */
    updateBoundingBox() {
        this.enemy.lastBoundingBox = this.enemy.boundingBox;
        this.enemy.boundingBox = new BoundingBox(this.enemy.pos, this.enemy.scaledSize);
    }
}