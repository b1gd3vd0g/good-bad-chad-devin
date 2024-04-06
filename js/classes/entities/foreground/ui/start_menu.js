/**
 * Class for the game's start menu.
 * 
 * @author Trae Claar
 */
class StartMenu {
    /**
     * Constructor for the StartMenu.
     */
    constructor() {
        this.title = new Animator(StartMenu.TITLE_SPRITESHEET, new Vector(0, 0), 
            StartMenu.TITLE_SIZE, 1, 1);
        this.startButton = new Button(new Vector((Camera.SIZE.x - StartMenu.BUTTON_SIZE.x) / 2, 
            Camera.SIZE.y / 2 + StartMenu.BUTTON_MARGIN), StartMenu.BUTTON_SIZE, 
            StartMenu.START_BUTTON_TEXT, StartMenu.BUTTON_FONT_SIZE, () => this.handleStartClick());
        
        this.controlsButton = new Button(new Vector((Camera.SIZE.x - StartMenu.BUTTON_SIZE.x) / 2, 
            Camera.SIZE.y / 2 + StartMenu.BUTTON_SIZE.y + 2 * StartMenu.BUTTON_MARGIN), StartMenu.BUTTON_SIZE, 
            StartMenu.CONTROLS_BUTTON_TEXT, StartMenu.BUTTON_FONT_SIZE, () => this.handleControlsClick());

        this.controls = null;

        this.controlsOKButton = new Button(new Vector((Camera.SIZE.x - StartMenu.BUTTON_SIZE.x) / 2, 
            (Camera.SIZE.y + Controls.SIZE.y) / 2 + StartMenu.BUTTON_MARGIN), StartMenu.BUTTON_SIZE, 
            "OK", StartMenu.BUTTON_FONT_SIZE, () => this.handleControlsOKClick());
    }

    /** The title's spritesheet. */
    static get TITLE_SPRITESHEET() {
        return "./sprites/title.png";
    }

    /** The size, in pixels, of the title on the spritesheet. */
    static get TITLE_SIZE() {
        return new Vector(150, 100);
    }

    /** The scale applied to the title when drawn on the canvas. */
    static get TITLE_SCALE() {
        return 4;
    }

    /** The size, in pixels, of a button. */
    static get BUTTON_SIZE() {
        return new Vector(200, 50);
    }

    /** The text to be displayed on the start button. */
    static get START_BUTTON_TEXT() {
        return "Start";
    }
    
    /** The text to be displayed on the controls button. */
    static get CONTROLS_BUTTON_TEXT() {
        return "Controls";
    }

    /** The font size of a button's text. */
    static get BUTTON_FONT_SIZE() {
        return 48;
    }

    /** The margin width, in pixels, of a button. */
    static get BUTTON_MARGIN() {
        return 20;
    }

    /** The size, in pixels, of the title on the canvas. */
    static get TITLE_SCALED_SIZE() {
        return Vector.multiply(StartMenu.TITLE_SIZE, StartMenu.TITLE_SCALE);
    }

    /** Respond to the start button being clicked. */
    handleStartClick() {
        GAME.mode = GameEngine.GAMEPLAY_MODE;
        HUD.addComponents();
        this.removeFromWorld = true;
        // setTimeout(() => {
        //     ASSET_MGR.playMusic(MUSIC.PEACEFUL_CHIPTUNE.path, MUSIC.PEACEFUL_CHIPTUNE.volume);
        // }, 1000);
    }

    /** Respond to a controls button click. */
    handleControlsClick() {
        this.controls = new Controls();
    }

    /** Respond to the control menu's ok button being clicked. */
    handleControlsOKClick() {
        this.controls = null;
    }

    /** Update the start menu. */
    update() {
    
    }

    /** Draw the start menu. */
    draw() {
        // draw the background
        CTX.fillStyle = "rgba(0, 0, 0, 0.5)";
        CTX.fillRect(0, 0, Camera.SIZE.x, Camera.SIZE.y);

        if (this.controls) {
            this.controls.draw();
            this.controlsOKButton.draw();
        } else {
            this.title.drawFrame(new Vector((Camera.SIZE.x - StartMenu.TITLE_SCALED_SIZE.x) / 2,
            Camera.SIZE.y / 2 - StartMenu.TITLE_SCALED_SIZE.y), StartMenu.TITLE_SCALE);
            this.startButton.draw();
            this.controlsButton.draw();
        }
    }
}