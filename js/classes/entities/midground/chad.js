/**
 * Chad is the main character controller by the player.
 * Chad has advanced movement and the ability to fight.
 * 
 * @author Devin Peevy
 * @author Caleb Krauter
 * @author Nathan Hinthorne
 * @author Trae Claar
 */
class Chad {
    /**
     * @param {Vector} pos The position at which CHAD should spawn.
     */
    constructor(pos) {
        /** Checks if CHAD has collided with the ground. */
        this.isOnGround = false;
        /** Checks if CHAD can double jump. */
        this.canDoubleJump = false;
        /** Checks if CHAD has double jumped. */
        this.hasDoubleJumped = false;
        /** Checks if CHAD has dashed. */
        this.hasDashed = false;
        /** Checks if CHAD is dashing. */
        this.isDashing = false;
        /** Gets the the y position of CHAD from the last time he was on the ground. */
        this.prevYPosOnGround = 0;
        /** The position of the Chad (in the game world). */
        this.pos = pos;
        /** An associative array of the animations for this Chad. Arranged [facing][action]. */
        this.animations = [];
        this.loadAnimations();
        /** What way is the Chad looking? */
        this.facing = "right";
        /** What is the Chad doing? */
        this.action = "idle";
        /** The velocity at which Chad is moving. */
        this.velocity = new Vector(0, 0);
        /** Name of character. */
        this.name = "Chad";
        /** The health of Chad. */
        this.health = Chad.DEFAULT_MAX_HEALTH;
        /** The maximum health of Chad. */
        this.maxHealth = Chad.DEFAULT_MAX_HEALTH;
        /** Chad's base speed */
        this.speed = Chad.DEFAULT_SPEED;
        /** Chad's damage multiplier (applied on sword/slingshot hit) */
        this.damageMultiplier = 1;
        /** level of sword */
        this.swordLevel = 1; 

        /** The size of Chad on the canvas */
        this.scaledSize = new Vector(Chad.DEFAULT_BOUNDING_BOX_SIZE.x * Chad.DEFAULT_SCALE.x,
            Chad.DEFAULT_BOUNDING_BOX_SIZE.y * Chad.DEFAULT_SCALE.y);
        /** Used to check how to deal with collisions with other applicable entities. */
        this.lastBoundingBox = this.boundingBox;
        /** The force of Chad's first jump. */
        this.firstJumpVelocity = Chad.DEFAULT_FIRST_JUMP_VELOCITY;
        /** The force of Chad's second jump. */
        this.secondJumpVelocity = Chad.DEFAULT_SECOND_JUMP_VELOCITY;
        /** If Chad is currently jumping. */
        this.isJumping = false;
        /** The timer for the jump. Used to ensure the jump velocity is applied for a minimum amount of time. */
        this.firstJumpTimer = 0;
        /** Dashes are reset based off a timer  */
        this.canDash = true;
        /** The cooldown timer for the dash. */
        this.dashCooldownTimer = Chad.DASH_COOLDOWN;
        /** The timer for how long Chad has been dashing. */
        this.dashStopTimer = 0;
        /** If Chad has landed on the ground. Used to determine when Chad first hit the ground. */
        this.alreadyLanded = false;
        /** The scale of Chad on the canvas. A VECTOR */
        this.scale = Chad.DEFAULT_SCALE;
        /** Used to check for collisions with other applicable entities. */
        this.boundingBox = this.createBoundingBox();
    };

    /** The size, in pixels of the sprite ON THE SPRITESHEET. */
    static get SIZE() {
        return new Vector(96, 64);
    }

    /** The size, in pixels of the boundingbox of Chad. */
    static get DEFAULT_BOUNDING_BOX_SIZE() {
        return new Vector(28, 49);
    }

    /** The offset applied to the bounding box's position from Chad's position. */
    static get DEFAULT_BOUNDING_BOX_OFFSET() {
        return new Vector(33, 15);
    }

    /** The default scale factor applied to Chad. */
    static get DEFAULT_SCALE() {
        return new Vector(2.2, 2.2);
    };

    /** The filepath to Chad's spritesheet. */
    static get SPRITESHEET() {
        return "./sprites/CHAD1.png";
    };

    /** The mulitiplier that allows CHAD to run. */
    static get RUN_MULTIPLIER() {
        return 1.4;
    }
    /** How much faster Chad is while dashing than walking */
    static get DASH_MULTIPLIER() {
        return 3.5;
    }

    /** The barrier that limits the time of the longest dash. */
    static get DASH_TIME_LIMIT() {
        return 0.32;
    }

    /** The delay between dashes in seconds. */
    static get DASH_COOLDOWN() {
        return 1.3;
    }

    /** The maximum amount of health Chad can have. */
    static get DEFAULT_MAX_HEALTH() {
        return 100;
    };

    /** Chad's default speed, in pixels/s. */
    static get DEFAULT_SPEED() {
        return Chad.DEFAULT_SCALE.x * 110;
    }

    /** Chad's default damage multiplier. */
    static get DEFAULT_DAMAGE_MULTIPLIER() {
        return 1;
    }

    /**
     * @returns {number} the force of Chad's first jump
     */
    static get DEFAULT_FIRST_JUMP_VELOCITY() {
        return Chad.DEFAULT_SCALE.y * 360;
    }

    /**
     * @returns {number} the force of Chad's second jump
    */
    static get DEFAULT_SECOND_JUMP_VELOCITY() {
        return Chad.DEFAULT_SCALE.y * 380;
    }

    /**
     * Update the scale of Chad along with his scaled size.
     * @param {Vector} newScale the new scale of Chad
     */
    set scale(newScale) {
        this._scale = newScale;

        // we need to update the scaled size of Chad when we change his scale
        // this is the reason we have a getter and setter for scale
        this.scaledSize = new Vector(Chad.DEFAULT_BOUNDING_BOX_SIZE.x * this._scale.x, Chad.DEFAULT_BOUNDING_BOX_SIZE.y * this._scale.y);
    }

    /**
     * Get the scale of Chad.
     * @returns {Vector} the scale of Chad
     */
    get scale() {
        return this._scale;
    }


    /** 
     * Initialize Chad's slingshot and sword.
     */
    initWeapons() {
        this.sword = new Sword(this.swordLevel);
        GAME.addEntity(this.sword, 1);

        this.slingshot = new Slingshot();
        GAME.addEntity(this.slingshot);
    }

    /**
     * Initialize Chad's status effect.
     */
    initStatusEffect() {
        // if we don't have a status effect, create one
        if (!this.statusEffect) {
            this.statusEffect = new StatusEffect(this);
        }
        GAME.addEntity(this.statusEffect);
    }

    /** 
     * Generate the bounding box for Chad based on his current position. 
     * 
     * @returns {BoundingBox} Chad's new bounding box
     */
    createBoundingBox() {
        return new BoundingBox(Vector.add(this.pos, this.getBoundingBoxOffset()), this.scaledSize);
    }

    /**
     * Calculate the offset that should be applied to Chad's bounding box position based on his 
     * current scale factor.
     * 
     * @returns {Vector} Chad's current bounding box offset
     */
    getBoundingBoxOffset() {
        return new Vector(Chad.DEFAULT_BOUNDING_BOX_OFFSET.x * this.scale.x,
            Chad.DEFAULT_BOUNDING_BOX_OFFSET.y * this.scale.y);
    }

    getCenter() {
        return new Vector(this.pos.x + this.getBoundingBoxOffset().x + this.scaledSize.x / 2,
            this.pos.y + this.getBoundingBoxOffset().y + this.scaledSize.y / 2);
    }

    getTopLeft() {
        return new Vector(this.pos.x + this.getBoundingBoxOffset().x, this.pos.y + this.getBoundingBoxOffset().y);
    }


    /** 
     * Decrease the health of Chad by the provided amount and perform any necessary operations
     * based on the new health value.
     * 
     * @param {number} amount the amount by which to decrease Chad's health
     */
    takeDamage(amount) {
        if (this.health > 0) {
            if (this.statusEffect.invincible) {
                ASSET_MGR.playSFX(SFX.DING.path, SFX.DING.volume);
                return;
            }

            this.health -= amount;
            if (this.health <= 0) {
                // Chad should die here
                ASSET_MGR.playSFX(SFX.GAME_OVER.path, SFX.GAME_OVER.volume);
                //TODO rotate chad 90 degrees on his back?
                GAME.addEntity(new DeathScreen(), 1);
                this.animations[this.facing]["death"].elapsedTime = 0;
                this.action = "death";
            }
        }
    };

    knockback(direction, amount) {
        // this.pos = Vector.add(this.pos, Vector.multiply(direction, amount));

        this.knockbackForce = Vector.multiply(direction, amount * 100);
        this.isKnockedBack = true;
    }

    manageKnockback() {
        if (this.isKnockedBack) {
            this.knockbackForce = Vector.multiply(this.knockbackForce, 0.5);
            this.velocity = Vector.add(this.velocity, this.knockbackForce);

            // If velocity is below a certain threshold, end knockback
            if (Vector.magnitude(this.knockbackForce) < 0.1) {
                this.isKnockedBack = false;
            }
        }
    }


    /**
     * Increase the health of Chad by the provided amount
     * 
     * @param {number} amount the amount by which to increase Chad's health
     */
    restoreHealth(amount) {
        if (this.health + amount > this.maxHealth) {
            this.health = this.maxHealth;
        } else {
            this.health += amount;
        }
    }

    /**
     * Increase the maximum health of Chad by the provided amount
     * 
     * @param {number} amount the amount by which to increase Chad's max health
     */
    increaseMaxHealth(amount) {
        this.maxHealth += amount;
    }

    /**
     * Deals with movement in the x direction including walking, running and dashing.
     * 
     * @returns {number} the x velocity of Chad
     */
    manageXDirectionMovement() {
        if (this.isKnockedBack) {
            // don't allow movement while knocked back
            return this.velocity.x;
        }

        let xVelocity = this.velocity.x;

        let dirSign = 0;

        if (GAME.user.movingLeft) {
            this.facing = "left";
            dirSign = -1;
        } else if (GAME.user.movingRight) {
            this.facing = "right";
            dirSign = 1;
        }

        xVelocity = dirSign * this.speed;

        // Run action
        if (GAME.user.movingLeft || GAME.user.movingRight) {
            if (GAME.user.running) {
                this.action = "running";
                xVelocity = dirSign * this.speed * Chad.RUN_MULTIPLIER;

                // if you're on the ground, running, AND moving, release dust particles
                if (this.isOnGround) {
                    GAME.addEntity(new ParticleEffect(
                        Vector.add(this.getCenter(), new Vector(0, this.scaledSize.y / 2 - 10)),
                        ParticleEffect.LITTLE_DUST)
                    );
                }
            } else {
                // Walk action
                this.action = "walking";
            }
        }


        // Dash action

        // update dash conditions
        if (this.dashCooldownTimer > 0) {
            this.dashCooldownTimer = Math.max(this.dashCooldownTimer - GAME.clockTick, 0);
        }

        if (this.isDashing) {
            this.dashStopTimer += GAME.clockTick;
        }

        if (this.dashCooldownTimer <= 0 && this.dashStopTimer < Chad.DASH_TIME_LIMIT) {
            this.canDash = true;
        }

        // do the dash
        if (GAME.user.dashing && this.canDash) {
            if (!this.isDashing) {
                // we just started dashing
                this.isDashing = true;
            }

            // release wind particles every 0.07 seconds
            if (GAME.gameTime % 0.07 < 0.01) { // we use `< 0.01` instead of `== 0` to avoid floating point errors
                GAME.addEntity(new ParticleEffect(this.getCenter(), ParticleEffect.WIND));
            }

            this.action = "dashing";
            xVelocity = dirSign * this.speed * Chad.DASH_MULTIPLIER;

            if (this.dashStopTimer >= Chad.DASH_TIME_LIMIT) {
                // we just finished dashing
                this.canDash = false;
                this.hasDashed = true;
                this.isDashing = false;
                this.dashCooldownTimer = Chad.DASH_COOLDOWN;
                this.dashStopTimer = 0;
            }
        }
        // Prevents continuing a dash after lifting the dash key.
        if (!GAME.user.dashing && this.isDashing) {
            // we just finished dashing
            this.canDash = false;
            this.hasDashed = true;
            this.isDashing = false;
            this.dashCooldownTimer = Chad.DASH_COOLDOWN;
            this.dashStopTimer = 0;
        }

        return xVelocity;
    }

    /**
     * Deals with movement in the y direction including all types of jumping.
     * 
     * @returns {number} the y velocity of Chad
     */
    manageYDirectionMovement() {
        let yVelocity = this.velocity.y;

        if (this.isDashing && !this.isOnGround) {
            yVelocity = 0; // anti-gravity when dashing
        } else {
            yVelocity += PHYSICS.GRAVITY_ACC * GAME.clockTick;
        }

        if (this.isOnGround && !this.alreadyLanded) {
            ASSET_MGR.playSFX(SFX.LAND.path, SFX.LAND.volume);
            // this.groundDashTimer = 0; // let the player dash immediately after landing

            // TODO add a landing animation?
            // TODO more things related to landing

            this.alreadyLanded = true;
        }

        if (!this.isOnGround) {
            this.alreadyLanded = false;
        }

        if (GAME.user.jumping && this.isOnGround) {
            yVelocity = -this.firstJumpVelocity;
            ASSET_MGR.playSFX(SFX.JUMP1.path, SFX.JUMP1.volume);
            this.action = "jumping";
            this.isJumping = true; // Set jumping state to true
            this.isOnGround = false;
            this.firstJumpTimer = 0.13;
        }

        // If the jump button is released early and the character is still moving upward, reduce the jump force
        if (!GAME.user.jumping && this.isJumping && yVelocity < 0) {
            this.firstJumpTimer -= GAME.clockTick; // Decrease the jump timer
            if (this.firstJumpTimer <= 0) { // If the jump timer has run out
                yVelocity /= 2;
            }
        }

        // The change in distance from the origin of Chad's second jump and his current height.
        let deltaHeight = Math.abs(this.pos.y - this.prevYPosOnGround);


        // This allows chad to jump if he is falling and has not jumped. 
        // Let's call it his recovery jump.
        if (!this.isOnGround && yVelocity >= 0) {
            if (this.hasDoubleJumped) {
                this.canDoubleJump = false;
            } else {
                this.canDoubleJump = true;
            }
        }


        // Check that Chad has jumped high enough to jump again and allow a second jump if so.
        // Note that if chad has jumped and is falling he can jump at any point on the way down.
        if (!this.isOnGround && deltaHeight >= Math.abs(this.firstJumpVelocity / 5) + 32) {
            if (this.hasDoubleJumped) {
                this.canDoubleJump = false;
            } else {
                this.canDoubleJump = true;
            }
        }

        // If Chad can double jump and user is trying to jump than do it!
        if (this.canDoubleJump && GAME.user.jumping && !this.isOnGround) {
            ASSET_MGR.playSFX(SFX.JUMP2.path, SFX.JUMP2.volume);

            GAME.addEntity(new ParticleEffect(
                Vector.add(this.getCenter(), new Vector(0, this.scaledSize.y / 2 - 10)),
                ParticleEffect.CLOUD)
            );

            this.action = "jumping";
            yVelocity = -this.secondJumpVelocity;
            this.canDoubleJump = false;
            this.hasDoubleJumped = true;
            this.isOnGround = false;
        }

        if (yVelocity > PHYSICS.TERMINAL_VELOCITY) {
            yVelocity = PHYSICS.TERMINAL_VELOCITY;
        }

        return yVelocity;
    }

    /** Change what Chad is doing and where it is. */
    update() {
        if (this.health <= 0) {
            return;
        }

        this.manageKnockback();

        // Chad shouldn't be able to double jump by default.
        this.canDoubleJump = false;

        // Reset double jump and dash if Chad is on the ground.
        if (this.isOnGround) {
            this.hasDoubleJumped = false;
            this.hasDashed = false;
        }

        this.action = "idle"; // default action

        // Step 1: Listen for user input.
        const newXVelocity = this.manageXDirectionMovement();
        const newYVelocity = this.manageYDirectionMovement();
        this.velocity = new Vector(newXVelocity, newYVelocity);

        // Step 2: Face in the direction of a mouse click
        if (GAME.user.aiming || this.sword.isSlicing()) {
            // determine if mouse is to the right or left of Chad
            // remember, the mouse is in screen coordinates, not world coordinates
            const mouseX = GAME.mousePos.x + CAMERA.pos.x;
            const chadCenterX = this.pos.x + this.scaledSize.x / 2;
            if (mouseX > chadCenterX) {
                this.facing = "right";
            } else {
                this.facing = "left";
            }
        }

        if (this.sword.isSlicing()) {
            this.action = "slicing";
        }

        if (this.isOnGround && !(GAME.user.movingRight || GAME.user.movingLeft)) {
            if (this.sword.isSlicing()) {
                this.action = "slicingStill";
            }
        } else if (!(this.isOnGround) && GAME.user.jumping && !(GAME.user.dashing)) {
            this.action = "jumping"
            if (this.sword.isSlicing()) {
                this.action = "slicingStill";
            }
        }

        // leave it up to the slingshot to decide where chad is aiming
        const slingshotAction = this.slingshot != null ? this.slingshot.getAction() : "none";
        if (slingshotAction != "none") {
            // provided the slingshot is doing something, override chad's action to a combination of the two
            switch (this.action) {
                case "idle":
                    this.action = "idle" + slingshotAction;
                    break;
                case "walking":
                    this.action = "walking" + slingshotAction;
                    break;
                case "running":
                    this.action = "running" + slingshotAction;
                    break;
                case "jumping":
                    this.action = "idle" + slingshotAction; // no jumping animations for aiming
                    break;
            }
        }


        // Step 3: Account for gravity, which is always going to push you downward.
        this.velocity.y += PHYSICS.GRAVITY_ACC * GAME.clockTick;

        // Step 4: Now move.
        this.pos = Vector.add(this.pos, Vector.multiply(this.velocity, GAME.clockTick));
        this.lastBoundingBox = this.boundingBox;
        this.boundingBox = this.createBoundingBox();

        this.isOnGround = false;

        // Step 5: Have we collided with anything?
        GAME.entities.midground.forEach((entity) => {
            // Does entity even have a BB?
            if (entity.boundingBox) {

                // Are they even colliding?
                if (this.boundingBox.collide(entity.boundingBox)) {
                    if (entity instanceof Block) {

                        // Is there overlap with the block on the x or y-axes?
                        const isOverlapX = this.lastBoundingBox.left < entity.boundingBox.right
                            && this.lastBoundingBox.right > entity.boundingBox.left;
                        const isOverlapY = this.lastBoundingBox.bottom > entity.boundingBox.top
                            && this.lastBoundingBox.top < entity.boundingBox.bottom;
                        const bbOffset = this.getBoundingBoxOffset();

                        // First, check for X-axis collisions
                        if (isOverlapY) {
                            if (this.lastBoundingBox.right <= entity.boundingBox.left
                                && this.boundingBox.right > entity.boundingBox.left
                            ) { //&& !entity.canPassThru.left
                                // We are colliding with the left side.
                                this.pos = new Vector(entity.boundingBox.left - this.scaledSize.x - bbOffset.x, this.pos.y);
                            } else if (this.lastBoundingBox.left >= entity.boundingBox.right
                                && this.boundingBox.left < entity.boundingBox.right
                            ) { //&& !entity.canPassThru.right
                                // We are colliding with the right side.
                                this.pos = new Vector(entity.boundingBox.right - bbOffset.x, this.pos.y);
                            }
                        }

                        // Updating the bounding box after resolving X-axis collisions 
                        // is necessary to ensure that the bounding box accurately represents
                        // the new position of the entity after the collision.
                        this.boundingBox = this.createBoundingBox();

                        // Then, check for Y-axis collisions
                        if (isOverlapX) {
                            if (this.lastBoundingBox.bottom <= entity.boundingBox.top
                                && this.boundingBox.bottom > entity.boundingBox.top
                            ) { //&& !entity.canPassThru.top
                                // We are colliding with the top.
                                this.pos = new Vector(this.pos.x, entity.boundingBox.top - this.scaledSize.y - bbOffset.y);
                                this.velocity = new Vector(this.velocity.x, 0);
                                this.isOnGround = true;
                                this.prevYPosOnGround = this.pos.y;
                            } else if (this.lastBoundingBox.top >= entity.boundingBox.bottom
                                && this.boundingBox.top < entity.boundingBox.bottom
                            ) { //&& !entity.canPassThru.bottom
                                // We are colliding with the bottom.
                                this.pos = new Vector(this.pos.x, entity.boundingBox.bottom - bbOffset.y);
                            }
                        }
                    }
                    else if (entity instanceof Border) {
                        if (!entity.locked) {
                            LAST_ZONE = ZONE;
                            ZONE = entity.target;
                            ZONE.load();
                            setTimeout(() => {
                                HUD.addComponents();
                            }, 1000);
                        } else {
                            // Is there overlap with the block on the x or y-axes?
                            const isOverlapX = this.lastBoundingBox.left < entity.boundingBox.right
                                && this.lastBoundingBox.right > entity.boundingBox.left;
                            const isOverlapY = this.lastBoundingBox.bottom > entity.boundingBox.top
                                && this.lastBoundingBox.top < entity.boundingBox.bottom;
                            const bbOffset = this.getBoundingBoxOffset();

                            // First, check for X-axis collisions
                            if (isOverlapY) {
                                if (this.lastBoundingBox.right <= entity.boundingBox.left
                                    && this.boundingBox.right > entity.boundingBox.left
                                ) { //&& !entity.canPassThru.left
                                    // We are colliding with the left side.
                                    this.pos = new Vector(entity.boundingBox.left - this.scaledSize.x - bbOffset.x, this.pos.y);
                                } else if (this.lastBoundingBox.left >= entity.boundingBox.right
                                    && this.boundingBox.left < entity.boundingBox.right
                                ) { //&& !entity.canPassThru.right
                                    // We are colliding with the right side.
                                    this.pos = new Vector(entity.boundingBox.right - bbOffset.x, this.pos.y);
                                }
                            }

                            // Updating the bounding box after resolving X-axis collisions 
                            // is necessary to ensure that the bounding box accurately represents
                            // the new position of the entity after the collision.
                            this.boundingBox = this.createBoundingBox();

                            // Then, check for Y-axis collisions
                            if (isOverlapX) {
                                if (this.lastBoundingBox.bottom <= entity.boundingBox.top
                                    && this.boundingBox.bottom > entity.boundingBox.top
                                ) { //&& !entity.canPassThru.top
                                    // We are colliding with the top.
                                    this.pos = new Vector(this.pos.x, entity.boundingBox.top - this.scaledSize.y - bbOffset.y);
                                    this.velocity = new Vector(this.velocity.x, 0);
                                    this.isOnGround = true;
                                    this.prevYPosOnGround = this.pos.y;
                                } else if (this.lastBoundingBox.top >= entity.boundingBox.bottom
                                    && this.boundingBox.top < entity.boundingBox.bottom
                                ) { //&& !entity.canPassThru.bottom
                                    // We are colliding with the bottom.
                                    this.pos = new Vector(this.pos.x, entity.boundingBox.bottom - bbOffset.y);
                                }
                            }
                        }
                    }
                    else if (entity.conversation) {
                        if (GAME.user.interacting) {
                            entity.conversation.initiateConversation();
                        }
                    } else if (entity.isEnemy) {
                        if (this.statusEffect.giant && this.statusEffect.canCrush) { // every 0.5 seconds
                            entity.takeDamage(5);
                            this.statusEffect.didSomeStomping();
                        }
                    }
                }
                // There's no collision - don't do anything!
            }
            // There's no bounding box, so who gives a shrek?
        });

        // Step 5: Now that your position is actually figured out, draw your correct bounding box.
        this.boundingBox = this.createBoundingBox();

        // Step 6: Check for any zone-specific conditions
        if (ZONE.name === "River Start") {
            if (this.pos.y > Vector.blockToWorldSpace(new Vector(0, 28)).y) {
                this.takeDamage(this.maxHealth);
            }
        }

        // Step 7: Check general zone conditions
        // if (this.pos.y > Vector.blockToWorldSpace(new Vector(0, 75)).y) {
        //     this.takeDamage(this.maxHealth);
        // }
    };

    /** Draw Chad on the canvas. */
    draw() {
        this.animations[this.facing][this.action].drawFrame(Vector.worldToCanvasSpace(this.pos), this.scale);

        //* draw spritesheet box in blue
        // CTX.strokeStyle = "blue";
        // const pos = Vector.worldToCanvasSpace(this.pos);
        // const scale = this.scale || Chad.DEFAULT_SCALE;
        // CTX.strokeRect(pos.x, pos.y, Chad.SIZE.x * scale.x, Chad.SIZE.y * scale.y);

        //* draw bounding box in red
        // CTX.strokeStyle = "red";
        // const pos2 = Vector.worldToCanvasSpace(this.boundingBox.pos);
        // CTX.strokeRect(pos2.x, pos2.y, this.boundingBox.size.x, this.boundingBox.size.y);
    };



    /** Called by the constructor. Fills up the animations array. */
    loadAnimations() {
        this.animations["left"] = [];
        this.animations["right"] = [];

        this.animations["right"]["idle"] = new Animator(
            Chad.SPRITESHEET,
            new Vector(0, 0),
            Chad.SIZE,
            1, 1);
        this.animations["left"]["idle"] = new Animator(
            Chad.SPRITESHEET,
            new Vector(0, Chad.SIZE.y),
            Chad.SIZE,
            1, 1);

        this.animations["right"]["walking"] = new Animator(
            Chad.SPRITESHEET,
            new Vector(0, 0),
            Chad.SIZE,
            31, 1 / 10);
        this.animations["left"]["walking"] = new Animator(
            Chad.SPRITESHEET,
            new Vector(96, 64),
            Chad.SIZE,
            31, 1 / 10, true, true);
        this.animations["right"]["running"] = new Animator(
            Chad.SPRITESHEET,
            new Vector(0, 0),
            Chad.SIZE,
            31, 1 / 10);
        this.animations["left"]["running"] = new Animator(
            Chad.SPRITESHEET,
            new Vector(96, 64),
            Chad.SIZE,
            31, 1 / 10, true, true);

        this.animations["right"]["dashing"] = new Animator(
            Chad.SPRITESHEET,
            new Vector(32, 1600),
            Chad.SIZE,
            1, 1);
        this.animations["left"]["dashing"] = new Animator(
            Chad.SPRITESHEET,
            new Vector(144, 1600),
            Chad.SIZE,
            1, 1);

        this.animations["right"]["jumping"] = new Animator(
            Chad.SPRITESHEET,
            new Vector(0, 1664),
            Chad.SIZE,
            1, 1);
        this.animations["left"]["jumping"] = new Animator(
            Chad.SPRITESHEET,
            new Vector(96, 1664),
            Chad.SIZE,
            1, 1);
        this.animations["right"]["slicing"] = new Animator(
            Chad.SPRITESHEET,
            new Vector(0, 128),
            Chad.SIZE,
            32, 1 / 20);
        this.animations["left"]["slicing"] = new Animator(
            Chad.SPRITESHEET,
            new Vector(
                0, 192),
            Chad.SIZE,
            32, 1 / 20, true, true);

        this.animations["right"]["slicingStill"] = new Animator(
            Chad.SPRITESHEET,
            new Vector(0, 1824),
            Chad.SIZE,
            8, 1 / 20);
        this.animations["left"]["slicingStill"] = new Animator(
            Chad.SPRITESHEET,
            new Vector(
                0, 1888),
            Chad.SIZE,
            8, 1 / 20);

        this.animations["right"]["idleUpAiming"] = new Animator(
            Chad.SPRITESHEET,
            new Vector(0, Chad.SIZE.y * 6),
            Chad.SIZE,
            1, 1, true);
        this.animations["left"]["idleUpAiming"] = new Animator(
            Chad.SPRITESHEET,
            new Vector(0, Chad.SIZE.y * 7),
            Chad.SIZE,
            1, 1, true);
        this.animations["right"]["idleUpFiring"] = new Animator(
            Chad.SPRITESHEET,
            new Vector(0, Chad.SIZE.y * 8),
            Chad.SIZE,
            1, 1, true);
        this.animations["left"]["idleUpFiring"] = new Animator(
            Chad.SPRITESHEET,
            new Vector(0, Chad.SIZE.y * 9),
            Chad.SIZE,
            1, 1, true);
        this.animations["right"]["idleDownAiming"] = new Animator(
            Chad.SPRITESHEET,
            new Vector(0, Chad.SIZE.y * 10),
            Chad.SIZE,
            1, 1, true);
        this.animations["left"]["idleDownAiming"] = new Animator(
            Chad.SPRITESHEET,
            new Vector(0, Chad.SIZE.y * 11),
            Chad.SIZE,
            1, 1, true);
        this.animations["right"]["idleDownFiring"] = new Animator(
            Chad.SPRITESHEET,
            new Vector(0, Chad.SIZE.y * 12),
            Chad.SIZE,
            1, 1, true);
        this.animations["left"]["idleDownFiring"] = new Animator(
            Chad.SPRITESHEET,
            new Vector(0, Chad.SIZE.y * 13),
            Chad.SIZE,
            1, 1, true);

        this.animations["right"]["walkingUpAiming"] = new Animator(
            Chad.SPRITESHEET,
            new Vector(0, Chad.SIZE.y * 6),
            Chad.SIZE,
            32, 1 / 10, true);
        this.animations["left"]["walkingUpAiming"] = new Animator(
            Chad.SPRITESHEET,
            new Vector(0, Chad.SIZE.y * 7),
            Chad.SIZE,
            32, 1 / 10, true);
        this.animations["right"]["walkingUpFiring"] = new Animator(
            Chad.SPRITESHEET,
            new Vector(0, Chad.SIZE.y * 8),
            Chad.SIZE,
            32, 1 / 10, true);
        this.animations["left"]["walkingUpFiring"] = new Animator(
            Chad.SPRITESHEET,
            new Vector(0, Chad.SIZE.y * 9),
            Chad.SIZE,
            32, 1 / 10, true);
        this.animations["right"]["walkingDownAiming"] = new Animator(
            Chad.SPRITESHEET,
            new Vector(0, Chad.SIZE.y * 10),
            Chad.SIZE,
            32, 1 / 10, true);
        this.animations["left"]["walkingDownAiming"] = new Animator(
            Chad.SPRITESHEET,
            new Vector(0, Chad.SIZE.y * 11),
            Chad.SIZE,
            32, 1 / 10, true);
        this.animations["right"]["walkingDownFiring"] = new Animator(
            Chad.SPRITESHEET,
            new Vector(0, Chad.SIZE.y * 12),
            Chad.SIZE,
            32, 1 / 10, true);
        this.animations["left"]["walkingDownFiring"] = new Animator(
            Chad.SPRITESHEET,
            new Vector(0, Chad.SIZE.y * 13),
            Chad.SIZE,
            32, 1 / 10, true);

        this.animations["right"]["runningUpAiming"] = new Animator(
            Chad.SPRITESHEET,
            new Vector(0, Chad.SIZE.y * 6),
            Chad.SIZE,
            32, 1 / 20, true);
        this.animations["left"]["runningUpAiming"] = new Animator(
            Chad.SPRITESHEET,
            new Vector(0, Chad.SIZE.y * 7),
            Chad.SIZE,
            32, 1 / 20, true);
        this.animations["right"]["runningUpFiring"] = new Animator(
            Chad.SPRITESHEET,
            new Vector(0, Chad.SIZE.y * 8),
            Chad.SIZE,
            32, 1 / 20, true);
        this.animations["left"]["runningUpFiring"] = new Animator(
            Chad.SPRITESHEET,
            new Vector(0, Chad.SIZE.y * 9),
            Chad.SIZE,
            32, 1 / 20, true);
        this.animations["right"]["runningDownAiming"] = new Animator(
            Chad.SPRITESHEET,
            new Vector(0, Chad.SIZE.y * 10),
            Chad.SIZE,
            32, 1 / 20, true);
        this.animations["left"]["runningDownAiming"] = new Animator(
            Chad.SPRITESHEET,
            new Vector(0, Chad.SIZE.y * 11),
            Chad.SIZE,
            32, 1 / 20, true);
        this.animations["right"]["runningDownFiring"] = new Animator(
            Chad.SPRITESHEET,
            new Vector(0, Chad.SIZE.y * 12),
            Chad.SIZE,
            32, 1 / 20, true);
        this.animations["left"]["runningDownFiring"] = new Animator(
            Chad.SPRITESHEET,
            new Vector(0, Chad.SIZE.y * 13),
            Chad.SIZE,
            32, 1 / 20, true);

        this.animations["right"]["death"] = new Animator(
            Chad.SPRITESHEET,
            new Vector(432, 1664),
            Chad.SIZE,
            15, 1 / 10, false);
        this.animations["left"]["death"] = new Animator(
            Chad.SPRITESHEET,
            new Vector(432, 1728),
            Chad.SIZE,
            15, 1 / 10, false, true);
    };
};
