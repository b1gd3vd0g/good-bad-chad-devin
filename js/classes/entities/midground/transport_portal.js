class TransportPortal {
    /**
     * @param {Vector} blockPos The position of the block the portal is on
     * @param {Number} type The type of portal (e.g. TransportPortal.PURPLE or TransportPortal.YELLOW)
     * @author Nathan Hinthorne
     */
    constructor(blockPos, type) {
        this.pos = Vector.blockToWorldSpace(blockPos);
        this.type = type;

        /** The number of enemies to release at once. */
        this.spawnGroupSize = TransportPortal.SPAWN_GROUP_SIZE;

        this.animations = [];
        this.loadAnimations();

        /** Whether the portal is active, in the middle of activating, or inactive */
        this.action = "inactive";

        switch (this.type) {
            case TransportPortal.PURPLE:
                this.particleType = ParticleEffect.AURA_PURPLE;
                this.borderColor = COLORS.PURPLE;
                break;
            case TransportPortal.YELLOW:
                this.particleType = ParticleEffect.AURA_YELLOW;
                this.borderColor = COLORS.YELLOW;
                break;
        }

        this.activationTimer = TransportPortal.ACTIVATION_DELAY;
        this.particleTimer = 0;
        this.center = Vector.add(this.pos, new Vector(TransportPortal.SCALED_SIZE.x / 2, TransportPortal.SCALED_SIZE.y / 2));
    };

    activate() {
        this.action = "activating";
        ASSET_MGR.playSFX(SFX.PORTAL_ACTIVATE.path, SFX.PORTAL_ACTIVATE.volume);

        // hardcode this portal's border to bring you to the endzone
        this.border = new Border(
            Vector.add(this.pos, new Vector(16, 23)),
            Vector.blockToWorldSpace(new Vector(1, 3)),
            Zone.getZones().end.endZone
        );

        GAME.addEntity(this.border);
    }

    update() {
        // if in the middle of activating, count down to activation
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


        if (this.particleTimer > 0) {
            this.particleTimer -= GAME.clockTick;
        }

        // release portal particles every 2 seconds
        if (this.particleTimer <= 0) {
            GAME.addEntity(new ParticleEffect(this.center, this.particleType));
            this.particleTimer = TransportPortal.PARTICLE_DELAY;
        }
    };

    draw() {
        this.animations[this.action].drawFrame(Vector.worldToCanvasSpace(this.pos), TransportPortal.SCALE);
    };

    loadAnimations() {
        this.animations["inactive"] = new Animator(
            TransportPortal.SPRITESHEET,
            new Vector(0, this.type * TransportPortal.SIZE.y),
            TransportPortal.SIZE,
            4, 0.5, true);

        this.animations["activating"] = new Animator(
            TransportPortal.SPRITESHEET,
            new Vector(TransportPortal.SIZE.x * 4, this.type * TransportPortal.SIZE.y),
            TransportPortal.SIZE,
            1, 0.5, true);

        this.animations["active"] = new Animator(
            TransportPortal.SPRITESHEET,
            new Vector(TransportPortal.SIZE.x * 5, this.type * TransportPortal.SIZE.y),
            TransportPortal.SIZE,
            2, 0.5, true);
    }

    static get PARTICLE_DELAY() {
        return 2;
    }

    static get ACTIVATION_DELAY() {
        return 0.5;
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
        return Vector.multiply(TransportPortal.SIZE, TransportPortal.SCALE);
    }

    static get PURPLE() {
        return 0;
    }

    static get YELLOW() {
        return 1;
    }
};