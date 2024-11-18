class Portal {
    /**
     * @param {Vector} blockPos The position of the block the portal is on
     * @param {Number} type The type of portal (e.g. Portal.PURPLE or Portal.YELLOW)
     * @author Nathan Hinthorne
     */
    constructor(blockPos, type) {
        this.pos = Vector.blockToWorldSpace(blockPos);
        this.type = type;

        /** The number of enemies to release at once. */
        this.spawnGroupSize = Portal.SPAWN_GROUP_SIZE;

        this.animations = [];
        this.loadAnimations();

        /** The stock of enemies that the portal will release. */
        this.enemyStock = [];

        /** Whether the portal is active, in the middle of activating, or inactive */
        this.action = "inactive";

        switch (this.type) {
            case Portal.PURPLE:
                this.particleType = ParticleEffect.AURA_PURPLE;
                this.borderColor = COLORS.PURPLE;
                break;
            case Portal.YELLOW:
                this.particleType = ParticleEffect.AURA_YELLOW;
                this.borderColor = COLORS.YELLOW;
                break;
        }

        this.activationTimer = Portal.ACTIVATION_DELAY;
        this.particleTimer = 0;
        this.spawnTimer = 1;
        this.center = Vector.add(this.pos, new Vector(Portal.SCALED_SIZE.x / 2, Portal.SCALED_SIZE.y / 2));
    };

    chadDistance() {
        return Vector.distance(Vector.add(CHAD.getCenter(), new Vector(0, CHAD.scaledSize.y / 2)), this.center);
    }

    update() {
        //! BUG: if multiple portals are active, they cause conflicts with the music

        if (STORY.botsKilled >= 2) {
            ASSET_MGR.playSFX(SFX.PORTAL_IDLE.path, SFX.PORTAL_IDLE.volume);
            this.removeRomWorld = true;
        }

        // check if chad has come into portal range, then activate
        if (this.chadDistance() < Portal.ACTIVATION_RADIUS) {
            if (this.action === "inactive") {
                this.action = "activating";
                ASSET_MGR.playSFX(SFX.PORTAL_ACTIVATE.path, SFX.PORTAL_ACTIVATE.volume);
            }
            if (!ASSET_MGR.audioIsPlaying(SFX.PORTAL_IDLE.path)) {
                ASSET_MGR.playSFX(SFX.PORTAL_IDLE.path, SFX.PORTAL_IDLE.volume);
            }

        } else if (this.action === "active" && this.chadDistance() > Portal.ACTIVATION_RADIUS) {
            ASSET_MGR.stopAudio(SFX.PORTAL_IDLE.path);
        }

        // activate portal after a delay
        if (this.action === "activating") {
            this.activationTimer -= GAME.clockTick;
            if (this.activationTimer <= 0) {
                this.action = "active";
                ASSET_MGR.playSFX(SFX.PORTAL_IDLE.path, SFX.PORTAL_IDLE.volume);
            }
        }

        // make portal perform a circular motion
        this.pos.x += Math.cos(GAME.gameTime * 2) / 10;
        this.pos.y += Math.sin(GAME.gameTime * 2) / 10;

        if (this.action != "active") return;


        if (this.spawnTimer > 0) {
            this.spawnTimer -= GAME.clockTick;
        }
        if (this.particleTimer > 0) {
            this.particleTimer -= GAME.clockTick;
        }

        // release portal particles every 2 seconds
        if (this.particleTimer <= 0 && !STORY.ending) {
            GAME.addEntity(new ParticleEffect(this.center, this.particleType));
            this.particleTimer = Portal.PARTICLE_DELAY;
        }

        // release enemies every 8 seconds
        if (this.spawnTimer <= 0 && this.enemyStock.length > 0) {
            console.log("releasing enemies");
            for (let i = 0; i < this.spawnGroupSize; i++) {
                GAME.addEntity(this.enemyStock.pop());
                console.log("enemy released");
            }
            this.spawnTimer = Portal.SPAWN_DELAY;
        }
    };

    draw() {
        this.animations[this.action].drawFrame(Vector.worldToCanvasSpace(this.pos), Portal.SCALE);
    };

    loadAnimations() {
        this.animations["inactive"] = new Animator(
            Portal.SPRITESHEET,
            new Vector(0, this.type * Portal.SIZE.y),
            Portal.SIZE,
            4, 0.5, true);

        this.animations["activating"] = new Animator(
            Portal.SPRITESHEET,
            new Vector(Portal.SIZE.x * 4, this.type * Portal.SIZE.y),
            Portal.SIZE,
            1, 0.5, true);

        this.animations["active"] = new Animator(
            Portal.SPRITESHEET,
            new Vector(Portal.SIZE.x * 5, this.type * Portal.SIZE.y),
            Portal.SIZE,
            2, 0.5, true);
    }


    /**
     * Fills the portal with enemies.
     * @param {Array} enemies The enemies to fill the portal with
     */
    fillWithEnemies(enemies) {
        this.enemyStock.push(...enemies);
    }

    static get PARTICLE_DELAY() {
        return 2;
    }

    static get ACTIVATION_DELAY() {
        return 0.5;
    }

    static get ACTIVATION_RADIUS() {
        return 700;
    }

    /**
     * The delay between enemy spawns.
     * NOTE: consider only spawning new enemies when the previous ones are dead.
     */
    static get SPAWN_DELAY() {
        return 10;
    }

    static get SPAWN_GROUP_SIZE() {
        return 1;
    }

    static get SPRITESHEET() {
        return "./sprites/portals.png";
    }

    static get SIZE() {
        return new Vector(32, 50);
    }

    static get SCALE() {
        return 4;
    }

    static get SCALED_SIZE() {
        return Vector.multiply(Portal.SIZE, Portal.SCALE);
    }

    static get PURPLE() {
        return 0;
    }

    static get YELLOW() {
        return 1;
    }
};