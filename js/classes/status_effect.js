/**
 * General-purpose status effect class for Chad and enemies.
 * Status effects include invincibility, strength, speed, and giant size.
 * 
 * @author Nathan Hinthorne
 */
class StatusEffect {
    /**
     * Create a new StatusEffect object.
     * 
     * @param {Entity} entity The entity to apply the status effect to.
     */
    constructor(entity) {
        /** The entity to apply the status effect to. */
        this.entity = entity;
        /** The default scale of the entity. */
        this.defaultScale = entity.scale;
        /** The default speed of the entity. */
        this.defaultSpeed = entity.speed;
        /** The default damage multiplier of the entity. */
        this.defaultDamageMultiplier = entity.damageMultiplier;

        /** Whether the entity is invincible. */
        this.invincible = false;
        /** Whether the entity is strong. */
        this.strong = false;
        /** Whether the entity is fast. */
        this.fast = false;
        /** Whether the entity is slow. */
        this.slow = false;
        /** Whether the entity is giant. */
        this.giant = false;
        /** Whether the entity is poisoned. */
        this.poisoned = false;
        /** Whether the entity is fleeing. Doesn't work for Chad */
        this.fleeing = false;

        /** The duration of the invincibility status effect in seconds. */
        this.invincibleTimer = 0;
        /** The duration of the strong status effect in seconds. */
        this.strongTimer = 0;
        /** The duration of the fast status effect in seconds. */
        this.fastTimer = 0;
        /** The duration of the slow status effect in seconds. */
        this.slowTimer = 0;
        /** The duration of the giant size status effect in seconds. */
        this.giantTimer = 0;
        /** The duration of the poisoned status effect in seconds. */
        this.poisonedTimer = 0;
        /** The duration of the fleeing status effect in seconds. */
        this.fleeingTimer = 0;

        /** The duration of the giant size status effect in seconds. */
        this.canCrushTimer = 0;

        /** The delay before the entity takes poison damage again. */
        this.poisonDamageTimer = 0;
    }

    /**
     * Apply a status effect to the entity.
     * 
     * @param {string} effect The effect to apply (e.g. StatusEffect.INVINCIBLE)
     * @param {number} duration The duration of the effect in milliseconds. If not provided, a default duration will be used.
     */
    apply(effect, duration) {
        console.log("applying status effect: " + effect);

        switch(effect) {
            case StatusEffect.INVINCIBLE:
                this.invincibleTimer = duration ? duration : StatusEffect.INVINCIBLE_DURATION;
                if (!this.invincible) { // if already invincible, don't take the same effect again
                    this.invincible = true;
                    this.entity.pos = Vector.add(this.entity.getTopLeft(), new Vector(-this.entity.scaledSize.x * 2, -this.entity.scaledSize.y));

                    if (this.entity === CHAD) {
                        this.restoreScale();
                    }
                }
                break;

            case StatusEffect.STRONG:
                this.strongTimer = duration ? duration : StatusEffect.STRONG_DURATION;
                if (!this.strong) { // if already strong, don't take the same effect again
                    this.strong = true;
                    this.entity.damageMultiplier = 3;
                    if (this.entity === CHAD) {
                        console.log("BIG CHUNGUS");
                        this.restoreScale();
                    }
                }
                break;

            case StatusEffect.FAST:
                this.fastTimer = duration ? duration : StatusEffect.FAST_DURATION;
                if (!this.fast) { // if already fast, don't take the same effect again
                    this.fast = true;
                    this.entity.speed *= 1.5;
    
                    if (this.entity === CHAD) {
                        this.entity.firstJumpVelocity = Chad.DEFAULT_FIRST_JUMP_VELOCITY * 1.2;
                        this.entity.secondJumpVelocity = Chad.DEFAULT_SECOND_JUMP_VELOCITY * 1.2;
                    }
                }
                break;

            case StatusEffect.SLOW:
                this.slowTimer = duration ? duration : StatusEffect.SLOW_DURATION;
                if (!this.slow) { // if already slow, don't take the same effect again
                    this.slow = true;
                    this.entity.speed *= 0.3;
                }
                break;

            case StatusEffect.GIANT:
                ASSET_MGR.playSFX(SFX.MEGA_MUSHROOM.path, SFX.MEGA_MUSHROOM.volume);
                this.giantTimer = duration ? duration : StatusEffect.GIANT_DURATION;
                if (!this.giant) { // if already giant, don't take the same effect again
                    this.giant = true;
                    this.entity.pos = Vector.add(this.entity.getTopLeft(), new Vector(-this.entity.scaledSize.x * 5, -this.entity.scaledSize.y * 5));
                    this.restoreScale();
                }
                break;

            case StatusEffect.POISONED:
                this.poisonedTimer = duration ? duration : StatusEffect.POISONED_DURATION;
                if (!this.poisoned) { // if already poisoned, don't take the same effect again
                    this.poisoned = true;
                }
                break;

            case StatusEffect.FLEEING:
                this.fleeingTimer = duration ? duration : StatusEffect.FLEEING_DURATION;
                if (!this.fleeing) { // if already fleeing, don't take the same effect again
                    this.fleeing = true;
                    if (this.entity.isEnemy) {
                        this.entity.base.flee();
                    }
                }
                break;

            default:
                throw new Error("Invalid status effect: " + effect);
        }
    }

    /**
     * Remove a status effect from the entity.
     * 
     * @param {string} effect The effect to remove (e.g. StatusEffect.INVINCIBLE)
     */
    remove(effect) {
        console.log("removing status effect: " + effect);

        switch(effect) {
            case StatusEffect.INVINCIBLE:
                this.invincible = false;
                if (this.entity === CHAD) {
                    this.restoreScale();
                }
                break;

            case StatusEffect.STRONG:
                this.strong = false;
                this.entity.damageMultiplier = this.defaultDamageMultiplier;
                if (this.entity === CHAD) {
                    this.restoreScale();
                }
                break;

            case StatusEffect.FAST:
                this.fast = false;
                this.entity.speed = this.defaultSpeed;

                if (this.entity === CHAD) {
                    this.entity.firstJumpVelocity = Chad.DEFAULT_FIRST_JUMP_VELOCITY;
                    this.entity.secondJumpVelocity = Chad.DEFAULT_SECOND_JUMP_VELOCITY;
                }
                break;

            case StatusEffect.SLOW:
                this.slow = false;
                this.entity.speed = this.defaultSpeed;
                break;

            case StatusEffect.GIANT:
                this.giant = false;
                this.restoreScale(); // this applies to all entities, not just Chad
                break;

            case StatusEffect.POISONED:
                this.poisoned = false;
                break;

            case StatusEffect.FLEEING:
                this.fleeing = false;
                if (this.entity.isEnemy) {
                    this.entity.base.pursue();
                }
                break;

            default:
                throw new Error("Invalid status effect: " + effect);
        }
    }


    /**
     * Update the status effect, decreasing timers and removing effects when they expire.
     */
    update() {
        if (this.invincible) {
            this.invincibleTimer -= GAME.clockTick;
            if (GAME.gameTime % 0.1 < 0.01) {
                GAME.addEntity(new ParticleEffect(
                    this.entity.getCenter(),
                    ParticleEffect.GOLD_SPARKLE)
                );
            }
            if (this.invincibleTimer <= 0) {
                this.remove(StatusEffect.INVINCIBLE);
            }
        }

        if (this.strong) {
            this.strongTimer -= GAME.clockTick;
            if (GAME.gameTime % 0.1 < 0.01) {
                GAME.addEntity(new ParticleEffect(
                    this.entity.getCenter(),
                    ParticleEffect.RED_SPARKLE)
                );
            }
            if (this.strongTimer <= 0) {
                this.remove(StatusEffect.STRONG);
            }
        }

        if (this.fast) {
            this.fastTimer -= GAME.clockTick;
            if (GAME.gameTime % 0.1 < 0.01) {
                GAME.addEntity(new ParticleEffect(
                    this.entity.getCenter(),
                    ParticleEffect.GREEN_SPARKLE)
                );
            }
            if (this.fastTimer <= 0) {
                this.remove(StatusEffect.FAST);
            }
        }

        if (this.slow) {
            this.slowTimer -= GAME.clockTick;
            if (GAME.gameTime % 0.1 < 0.01) {
                GAME.addEntity(new ParticleEffect(
                    this.entity.getCenter(),
                    ParticleEffect.GRAY_SPARKLE)
                );
            }
            if (this.slowTimer <= 0) {
                this.remove(StatusEffect.SLOW);
            }   
        }

        if (this.giant) {
            this.giantTimer -= GAME.clockTick;
            if (this.giantTimer <= 0) {
                this.remove(StatusEffect.GIANT);
            }
            if (this.canCrushTimer > 0) {
                this.canCrushTimer -= GAME.clockTick;
            } else {
                this.canCrush = true;
            }
        }

        if (this.poisoned) {
            this.poisonedTimer -= GAME.clockTick;
            this.poisonDamageTimer -= GAME.clockTick;
            if (GAME.gameTime % 0.1 < 0.01) {
                GAME.addEntity(new ParticleEffect(
                    this.entity.getCenter(),
                    ParticleEffect.IVY_GREEN_SPARKLE)
                );
            }
            if (this.poisonDamageTimer <= 0) {
                this.entity.takeDamage(StatusEffect.POISON_DAMAGE);
                this.poisonDamageTimer = StatusEffect.POISON_DELAY;
            }
            if (this.poisonedTimer <= 0) {
                this.remove(StatusEffect.POISONED);
            }
        }

        if (this.fleeing) {
            this.fleeingTimer -= GAME.clockTick;
            if (this.fleeingTimer <= 0) {
                this.remove(StatusEffect.FLEEING);
            }
        }
    }

    draw() {
        
    }

    /**
     * Remove all status effects from the entity.
     */
    removeAll() {
        this.remove(StatusEffect.INVINCIBLE);
        this.remove(StatusEffect.STRONG);
        this.remove(StatusEffect.FAST);
        this.remove(StatusEffect.SLOW);
        this.remove(StatusEffect.GIANT);
        this.remove(StatusEffect.POISONED);
        this.remove(StatusEffect.FLEEING);
    }

    /**
     * Notify the status effect that the entity has crushed another entity.
     */
    didSomeStomping() {
        this.canCrushTimer = StatusEffect.CRUSH_DELAY;
        this.canCrush = false;
    }

    /**
     * Restore the entity's scale to the value it should be based on the status effects that are active.
     */
    restoreScale() {
        if (this.giant) {
            // default to the giant's scale first
            this.entity.scale = new Vector(
                this.defaultScale.x * StatusEffect.GIANT_SCALE_MODIFIER.x, 
                this.defaultScale.y * StatusEffect.GIANT_SCALE_MODIFIER.y);

        } else if (this.invincible) {
            // default to the invincible's scale next if giant is not active
            this.entity.scale = new Vector(
                this.defaultScale.x * StatusEffect.INVINCIBLE_SCALE_MODIFIER.x, 
                this.defaultScale.y * StatusEffect.INVINCIBLE_SCALE_MODIFIER.y);
        } else if (this.strong) {
            // default to the strong's scale last if neither giant nor invincible are active
            this.entity.scale = new Vector(
                this.defaultScale.x * StatusEffect.STRONG_SCALE_MODIFIER.x, 
                this.defaultScale.y * StatusEffect.STRONG_SCALE_MODIFIER.y);
        } else {
            // lastly, default to the entity's default scale
            this.entity.scale = this.defaultScale;
        }
    }

    /**
     * The string representation of the invincibility status effect.
     */
    static get INVINCIBLE() {
        return "invincible";
    }

    /**
     * The string representation of the strength status effect.
     */
    static get STRONG() {
        return "strong";
    }

    /**
     * The string representation of the speed status effect.
     */
    static get FAST() {
        return "fast";
    }

    /**
     * The string representation of the giant size status effect.
     */
    static get GIANT() {
        return "giant";
    }

    /**
     * The string representation of the slow status effect.
     */
    static get SLOW() {
        return "slow";
    }

    /**
     * The string representation of the poisoned status effect.
     */
    static get POISONED() {
        return "poisoned";
    }

    /** 
     * The string representation of the fleeing status effect.
     * This is not used for Chad, only for enemies.
     */
    static get FLEEING() {
        return "fleeing";
    }


    /**
     * The duration of the invincibility status effect in seconds.
     */
    static get INVINCIBLE_DURATION() {
        return 20;
    }


    /**
     * The duration of the strength status effect in seconds.
     */
    static get STRONG_DURATION() {
        return 20;
    }

    /**
     * The duration of the speed status effect in seconds.
     */
    static get FAST_DURATION() {
        return 30;
    }

    /**
     * The duration of the slow status effect in seconds.
     */
    static get SLOW_DURATION() {
        return 10;
    }

    /**
     * The duration of the giant size status effect in seconds.
     */
    static get GIANT_DURATION() {
        return 20;
    }

    /**
     * The duration of the poisoned status effect in seconds.
     */
    static get POISONED_DURATION() {
        return 10;
    }

    /**
     * The duration of the fleeing status effect in seconds.
     * This is not used for Chad, only for enemies.
     */
    static get FLEEING_DURATION() {
        return 10;
    }



    /**
     * The scale modifier for the giant size status effect.
     */
    static get GIANT_SCALE_MODIFIER() {
        return new Vector(3.5, 3.5);
    }

    /**
     * The scale modifier for the invincibility status effect. Make the entity short and fat.
     */
    static get STRONG_SCALE_MODIFIER() {
        return new Vector(1.2, 1);
    }

    /**
     * The scale modifier for the speed status effect. Make the entity tall and lanky.
     */
    static get FAST_SCALE_MODIFIER() {
        return new Vector(1, 1.2);
    }

    /**
     * The scale modifier for the strength status effect.
     */
    static get INVINCIBLE_SCALE_MODIFIER() {
        return new Vector(1.2, 1.2);
    }

    /**
     * The delay before the giant entity can crush another entity
     */
    static get CRUSH_DELAY() {
        return 0.5;
    }


    static get POISON_DAMAGE() {
        return 4;
    }

    static get POISON_DELAY() {
        return 0.6;
    }
}