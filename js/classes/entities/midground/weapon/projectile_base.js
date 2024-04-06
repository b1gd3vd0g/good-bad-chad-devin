/**
 * Class which provides basic functionality for enemy entities, including movement,
 * taking damage, and block collisions.
 * 
 * @author Nathan Hinthorne
 * @author Trae Claar
 */
class ProjectileBase {
    /**
     * Constructor for a ProjectileBase.
     * 
     * @param {Entity} projectile the projectile associated with this projectileBase
     * @param {Vector} startPos the initial position of the projectile
     * @param {Vector} targetPos the target position of the projectile
     * @param {number} scaledSize the size of the projectile on the CANVAS
     * @param {number} speed the speed of the projectile
     * @param {function} onBlockCollision callback function invoked when the projectile collides with a block
     * @param {function} onEnemyCollision callback function invoked when the projectile collides with an enemy
     */
    constructor(projectile, startPos, targetPos, scaledSize, speed, weight, onBlockCollision, onEnemyCollision, onPlayerCollision) {
        this.projectile = projectile;
        projectile.pos = startPos;
        projectile.targetPos = targetPos;
        
        projectile.action = "firing"; // or "idle" to start with?
        projectile.scaledSize = scaledSize;
        projectile.speed = speed;
        projectile.weight = weight;
        projectile.yVelocity = 0;
        
        projectile.applyGravity = true; // used for bouncing projectiles
        projectile.hasHit = false;
        
        projectile.boundingBox = new BoundingBox(startPos, scaledSize);
        projectile.lastBoundingBox = this.projectile.boundingBox;
        
        this.onBlockCollision = onBlockCollision;
        this.onEnemyCollision = onEnemyCollision;
        this.onPlayerCollision = onPlayerCollision;
        
        // determine what direction to travel in
        projectile.dir = Vector.direction(startPos, targetPos);

        const angleRadians = Math.atan2(projectile.dir.y, projectile.dir.x);
        const angleDegrees = angleRadians * (180 / Math.PI);
        projectile.rotation = angleDegrees;
    }

    /**
     * Updates the projectile's position and checks for collisions.
     */
    update() {
        // move the projectile
        if (!this.projectile.applyGravity) {
            this.projectile.yVelocity = 0;
        } else {
            this.projectile.yVelocity += PHYSICS.GRAVITY_ACC * GAME.clockTick * this.projectile.weight;

            // max out all downwards speed at the terminal velocity
            // if (this.yVelocity > PHYSICS.TERMINAL_VELOCITY) {
            //     this.yVelocity = PHYSICS.TERMINAL_VELOCITY;
            // }
        }

        const adjustedSpeed = this.projectile.speed * 140;
        const pos = Vector.multiply(this.projectile.dir, adjustedSpeed * GAME.clockTick);

        this.projectile.pos = Vector.add(this.projectile.pos, new Vector(pos.x, pos.y + this.projectile.yVelocity));

        // update the rotation
        let angle = Math.atan2(this.projectile.dir.y, this.projectile.dir.x);
        if (angle < 0) {
            angle += 2 * Math.PI; // convert to 0 to 2π range
        }
        this.projectile.rotation = angle;
        
        if (angle >= 0 && angle < Math.PI * 0.125 || angle >= Math.PI * 1.875) {
            this.projectile.facing = "right";
        } else if (angle >= Math.PI * 0.125 && angle < Math.PI * 0.375) {
            this.projectile.facing = "rightDown";
        } else if (angle >= Math.PI * 0.375 && angle < Math.PI * 0.625) {
            this.projectile.facing = "down";
        } else if (angle >= Math.PI * 0.625 && angle < Math.PI * 0.875) {
            this.projectile.facing = "leftDown";
        } else if (angle >= Math.PI * 0.875 && angle < Math.PI * 1.125) {
            this.projectile.facing = "left";
        } else if (angle >= Math.PI * 1.125 && angle < Math.PI * 1.375) {
            this.projectile.facing = "leftUp";
        } else if (angle >= Math.PI * 1.375 && angle < Math.PI * 1.625) {
            this.projectile.facing = "up";
        } else if (angle >= Math.PI * 1.625 && angle < Math.PI * 1.875) {
            this.projectile.facing = "rightUp";
        } else {
            throw new Error("Invalid rotation value: " + angle);
        }

        // update the bounding box
        this.projectile.lastBoundingBox = this.projectile.boundingBox;
        this.projectile.boundingBox = new BoundingBox(this.projectile.pos, this.projectile.scaledSize);

        // check for collisions
        if (this.projectile.boundingBox.collide(CHAD.boundingBox)) {
            this.onPlayerCollision(CHAD);
        }
        GAME.entities.midground.forEach((otherEntity) => {
            if (otherEntity instanceof Block) {
                if (this.projectile.boundingBox.collide(otherEntity.boundingBox)) {
                    this.onBlockCollision(otherEntity);
                }
            } else if (otherEntity.isEnemy) { // isEnemy is a property of all enemy entities that use BaseEnemy
                if (this.projectile.boundingBox.collide(otherEntity.boundingBox)) {
                    this.onEnemyCollision(otherEntity);
                }
            }
        });
    }

    getCenter() {
        return new Vector(
            this.projectile.pos.x + this.projectile.scaledSize.x / 2, 
            this.projectile.pos.y + this.projectile.scaledSize.y / 2);
    }

}