/**
 * Class for a death screen that has a message and a respawn button.
 * 
 * @author Trae Claar
 */
class DeathScreen {
    /**
     * DeathScreen constructor.
     */
    constructor() {
        this.message = DeathScreen.MESSAGES[Math.floor(Math.random() * DeathScreen.MESSAGES.length)];
        this.respawnButton = new Button(new Vector(0, 0), DeathScreen.RESPAWN_BUTTON_SIZE, 
            DeathScreen.RESPAWN_BUTTON_TEXT, DeathScreen.BUTTON_FONT_SIZE, () => this.handleRespawnButtonClick())
    }

    /** The font size of the DeathScreen message. */
    static get MESSAGE_FONT_SIZE() {
        return 128;
    }

    /** An array of messages from which the DeathScreen message will be randomly selected. */
    static get MESSAGES() {
        return [
            "FATALITY",
            "YOU DIED",
            "game over",
            "wasted",
            "wow you suck",
            "press F to pay respects",
            "you were killed by a Grunt"
        ];
    }

    /** The size, in pixels, of the respawn button. */
    static get RESPAWN_BUTTON_SIZE() {
        return new Vector(200, 50);
    }

    /** The text to be displayed on the respawn button. */
    static get RESPAWN_BUTTON_TEXT() {
        return "Respawn";
    }

    /** The font size of the respawn button's text. */
    static get BUTTON_FONT_SIZE() {
        return 48;
    }

    /** The width, in pixels, of the respawn button's border. */
    static get BUTTON_BORDER_WIDTH() {
        return 2
    }

    /** The padding between the respawn button's border and its text. */
    static get BUTTON_PADDING() {
        return 5;
    }

    /**
     * Respond to the respawn button click.
     */
    handleRespawnButtonClick() {
        CHAD.health = CHAD.maxHealth;
        LAST_ZONE = null;
        ZONE = SAVED_ZONE; // Restore the last saved zone
        ZONE.load();
        // create spawnpoint for 3 seconds before it gets removed from world
        GAME.addEntity(new Spawnpoint(CHAD.getCenter()), 0);
        this.removeFromWorld = true;
    }

    /** Update the DeathScreen. */
    update() {

    }

    draw() {
        // draw the death screen background
        CTX.fillStyle = "rgba(0, 0, 0, 0.5)";
        CTX.fillRect(0, 0, Camera.SIZE.x, Camera.SIZE.y);

        // draw the death screen message
        CTX.fillStyle = "FireBrick";
        CTX.font = DeathScreen.MESSAGE_FONT_SIZE + "px vt323";
        const messageSize = CTX.measureText(this.message);
        const messagePos = new Vector((Camera.SIZE.x - messageSize.width) / 2,
            (Camera.SIZE.y - messageSize.actualBoundingBoxAscent) / 2);
        CTX.fillText(this.message, messagePos.x, messagePos.y);

        // calculate position and size of the respawn button
        const buttonSize = DeathScreen.RESPAWN_BUTTON_SIZE;
        this.respawnButton.pos = new Vector((Camera.SIZE.x - buttonSize.x) / 2,
            messagePos.y + messageSize.actualBoundingBoxAscent);

        this.respawnButton.draw();
    }
}