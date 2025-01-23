/**
 * Class for displaying the game's controls on a menu.
 * 
 * @author Trae Claar
 */
class Controls {
    /** Controls constructor. */
    constructor() {

    }

    /** An array containing the controls to display. Each element will be displayed on a new line. */
    static get CONTROLS() {
        return [
            "Left/right movement: A/D",
            "Jump/double jump: space",
            "Sprint: shift",
            "Dash: Alt/X",
            "Left mouse: Fire slingshot",
            "Right mouse/Q: Swing sword",
            "Number keys: select ammo type"
        ];
    }

    /** The position, in pixels, of the Controls menu on the canvas. */
    static get POSITION() {
        return Vector.multiply(Vector.subtract(Camera.SIZE, Controls.SIZE), 1 / 2);
    }

    /** The font size of the Controls menu's text. */
    static get FONT_SIZE() {
        return 32;
    }

    /** The font size of the header. */
    static get HEADER_FONT_SIZE() {
        return 52;
    }

    /** The margin width, in pixels, of the header. */
    static get HEADER_MARGIN() {
        return 20;
    }

    /** The padding, in pixels, of the Controls menu. */
    static get PADDING() {
        return 10;
    }

    /** The size, in pixels, of the Controls menu on the canvas. */
    static get SIZE() {
        return new Vector(500, Controls.CONTROLS.length * Controls.FONT_SIZE + 3 * Controls.PADDING);
    }

    /** Update the Controls menu. */
    update() {
        
    }

    /** Draw the Controls menu. */
    draw() {
        const pos = Controls.POSITION;
        const size = Controls.SIZE;
        // draw a translucent background
        CTX.fillStyle = "rgba(32, 32, 32, 0.5)";
        CTX.fillRect(pos.x, pos.y, size.x, size.y);
        // draw a border
        CTX.lineWidth = Button.BORDER_WIDTH;
        CTX.strokeStyle = "white";
        CTX.strokeRect(pos.x, pos.y, size.x, size.y);

        // draw the header
        CTX.fillStyle = "white";
        CTX.font = Controls.HEADER_FONT_SIZE + "px vt323";
        const headerSize = CTX.measureText("Controls");
        CTX.fillText("Controls", (Camera.SIZE.x - headerSize.width) / 2, pos.y - Controls.HEADER_MARGIN);

        const textStart = new Vector(pos.x + Controls.PADDING, pos.y + Controls.PADDING + Controls.FONT_SIZE);
        // draw the text
        CTX.font = Controls.FONT_SIZE + "px vt323";
        for (let i = 0; i < Controls.CONTROLS.length; i++) {
            CTX.fillText(Controls.CONTROLS[i], textStart.x, textStart.y + Controls.FONT_SIZE * i);
        }
    }
}