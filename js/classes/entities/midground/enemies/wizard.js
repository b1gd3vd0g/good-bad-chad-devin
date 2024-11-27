class Wizard {
   /**
     * @param {Vector} pos the position at which he should spawn. 
     * @param {Conversation} convo The conversation that will show if Wizard is interacted with.
     */
    constructor(pos, convo = null) {
        /** The position of the wizard (in the game world). */
        this.pos = pos;
        /** The velocity at which Wizard is moving. */
        this.velocity = new Vector(0, 0);

        /** An associative array of the animations for this Papa Chad. Arranged [facing][action]. */
        this.animations = [];
        this.loadAnimations();
        /** What way is the Papa Chad looking? */
        this.facing = "left";
        /** What is the Papa Chad doing? */
        this.action = "idle";
        /** Used to check for collisions with other applicable entities. */
        this.boundingBox = new BoundingBox(this.pos, Wizard.SCALED_SIZE);
        /** Used to check how to deal with collisions with other applicable entities. */
        this.lastBoundingBox = this.boundingBox;
        /** The conversation which will be displayed upon interacting with Papa Chad. */
        this.conversation = convo;
    };

    static get SPRITESHEET() {
      return './sprites/wizard.png';
    };
    
    static get SIZE() {
        return new Vector(33, 65);
    };

    static get SCALE() {
        return 2.8;
    };

    static get SCALED_SIZE() {
        return Vector.multiply(Wizard.SIZE, Wizard.SCALE);
    };

    /** Change what Papa Chad is doing and where it is. */
    update() {

        // Set the velocity, according to gravity.
        this.velocity = {
            x: this.velocity.x,
            y: this.velocity.y += PHYSICS.GRAVITY_ACC * GAME.clockTick
        };

        this.lastBoundingBox = this.boundingBox;

        this.pos = {
            x: this.pos.x,
            y: this.pos.y + this.velocity.y * GAME.clockTick
        };

        this.boundingBox = new BoundingBox(this.pos, Wizard.SCALED_SIZE);

        if (STORY.slimesKilled && STORY.slimesKilled >= 10) {
            if (ZONE.name === "Village Main" && this.conversation === null) {
                this.conversation = new Conversation(getAllConversationArrays().village.wizard.threateningIntroduction);
            }
        }

        if (ZONE.name === "Village Main" && STORY.villageAttackEnded) {
            this.removeFromWorld = true;
        }

        // Step 4: Have we collided with anything?
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

                        if (isOverlapX
                            && this.lastBoundingBox.bottom <= entity.boundingBox.top
                            && this.boundingBox.bottom > entity.boundingBox.top) {
                            // We are colliding with the top.

                            this.pos = new Vector(this.pos.x, entity.boundingBox.top - Wizard.SCALED_SIZE.y);
                            this.velocity = new Vector(this.velocity.x, 0);
                        } else if (isOverlapY
                            && this.lastBoundingBox.right <= entity.boundingBox.left
                            && this.boundingBox.right > entity.boundingBox.left) {
                            // We are colliding with the left side.

                            this.pos = new Vector(entity.boundingBox.left - Wizard.SCALED_SIZE.x, this.pos.y);
                        } else if (isOverlapY
                            && this.lastBoundingBox.left >= entity.boundingBox.right
                            && this.boundingBox.left < entity.boundingBox.right) {
                            // We are colliding with the right side.

                            this.pos = new Vector(entity.boundingBox.right, this.pos.y);
                        } else if (isOverlapX
                            && this.lastBoundingBox.top >= entity.boundingBox.bottom
                            && this.boundingBox.top < entity.boundingBox.bottom) {
                            // We are colliding with the bottom.
                            this.pos = new Vector(this.pos.x, entity.boundingBox.bottom);
                        }
                    }
                }
                // There's no collision - don't do anything!
            }
            // There's no bounding box, so who gives a shrek?
        });
        // Step 5: Now that your position is actually figured out, draw your correct bounding box.
        this.boundingBox = new BoundingBox(this.pos, Wizard.SCALED_SIZE);

        if (ZONE.name === "End Fight Section" && STORY.botsKilled >= 2) {
            this.conversation = new Conversation(getAllConversationArrays().end.wizard.victory)
        }
    };

    /** Draw Papa Chad on the canvas. */
    draw() {
        this.animations[this.facing][this.action].drawFrame(Vector.worldToCanvasSpace(this.pos), Wizard.SCALE);
        if (this.conversation && this.conversation.new) {
            const indicator = new OverheadIcon(this, Wizard.SCALED_SIZE.x, OverheadIcon.TRIANGLE, OverheadIcon.GREEN);
            indicator.draw();
        }
    };

    /** Called by the constructor. Fills up the animations array. */
    loadAnimations() {
        this.animations["left"] = [];

        this.animations["left"]["idle"] = new Animator(
            './sprites/wizard.png',
            new Vector(0, 0),
            Wizard.SIZE,
            1, 1);
    };
};