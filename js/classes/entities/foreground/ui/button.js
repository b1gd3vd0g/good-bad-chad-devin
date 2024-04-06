/**
 * Generic text button class for menus.
 * 
 * @author Trae Claar
 */
class Button {
    /**
     * Constructor for a Button.
     * 
     * @param {Vector} pos the position, in pixels, of the Button on the canvas
     * @param {Vector} size the size, in pixels, of the Button on the canvas
     * @param {string} text the text displayed on the Button
     * @param {number} fontSize the font size of the Button's text
     * @param {function} onClick the function to call when the button is clicked
     * @param {boolean} [selfDestruct] whether or not the Button should destroy itself once clicked
     */
    constructor(pos, size, text, fontSize, onClick, selfDestruct = true) {
        this.pos = pos;
        this.size = size;
        this.text = text;
        this.fontSize = fontSize;
        this.listener = () => {
            const mouseOverButton = GAME.mousePos.x > this.pos.x
                && GAME.mousePos.y > this.pos.y
                && GAME.mousePos.x < this.pos.x + this.size.x
                && GAME.mousePos.y < this.pos.y + this.size.y;
            if (mouseOverButton) {
                onClick();
                if (selfDestruct) {
                    document.body.removeEventListener("click", this.listener);
                    this.removeFromWorld = true;
                }
            }
        }
        document.body.addEventListener("click", this.listener);
    }

    /** The width, in pixels, of the Button's border. */
    static get BORDER_WIDTH() {
        return 2;
    }

    /** Update the button. */
    update() {
        
    }
    
    /** Draw the button. */
    draw() {
        // draw a translucent background for the button
        CTX.fillStyle = "rgba(32, 32, 32, 0.5)";
        CTX.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
        // draw a border around the respawn button
        CTX.lineWidth = Button.BORDER_WIDTH;
        CTX.strokeStyle = "white";
        CTX.strokeRect(this.pos.x, this.pos.y, this.size.x, this.size.y);

        // draw the respawn button text
        CTX.fillStyle = "white";
        CTX.font = this.fontSize + "px vt323";
        const buttonTextSize = CTX.measureText(this.text);
        CTX.fillText(
            this.text, this.pos.x + (this.size.x - buttonTextSize.width) / 2,
            this.pos.y + this.size.y - (this.size.y - buttonTextSize.actualBoundingBoxAscent
                + buttonTextSize.actualBoundingBoxDescent) / 2
        );
    }
}