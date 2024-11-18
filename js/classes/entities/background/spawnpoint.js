/**
 * Spawnpoint which shows up for a few seconds before getting removed.
 * 
 * @author Nathan Hinthorne
 */
class Spawnpoint {
    /**
     * Constructor for a Spawnpoint
     */
    constructor(pos) {
        this.pos = pos;
        this.animator = new Animator(
            Spawnpoint.SPRITESHEET,
            new Vector(0, 0),
            Spawnpoint.SIZE,
            6, 0.5);
        
        ASSET_MGR.playSFX(SFX.REVIVE.path, SFX.REVIVE.volume);

        GAME.addEntity(new ParticleEffect(this.pos, ParticleEffect.AURA_YELLOW));
        GAME.addEntity(new ParticleEffect(this.pos, ParticleEffect.AURA_YELLOW));
        GAME.addEntity(new ParticleEffect(this.pos, ParticleEffect.AURA_YELLOW));
        GAME.addEntity(new ParticleEffect(this.pos, ParticleEffect.AURA_YELLOW));

        this.timer = 0;
    };

    static get SPRITESHEET() {
        return "./sprites/spawnpoint.png";
    };

    static get SIZE() {
        return new Vector(16, 16);
    };

    static get SCALE() {
        return 2;
    };

    update() {
        this.timer += GAME.clockTick;

        if (this.timer < 0.5) {
            // GAME.addEntity(new ParticleEffect(this.pos, ParticleEffect.AURA_YELLOW));
        } else {
            this.removeFromWorld;
        }
    };

    draw() {
        // NOT SHOWING UP ON SCREEN
        this.animator.drawFrame(this.pos, Spawnpoint.SCALE);
    };

};