/**
 * The Game Engine contains all entities, and puts them all through the update-render loop. It is also responsible for tracking user input.
 * @author Seth Ladd (original), Chris Marriott (modified), Devin Peevy (modified), Nathan Hinthorne (modified), Caleb Krauter (modified)
 */
class GameEngine {
    /**
     * This constructs a new GameEngine, initializing some necessary parameters.
     * @param {boolean} isSpanish ¿Debería estar en español este juego? Default: false.
     */
    constructor(isSpanish) {
        /** ¿Está el juego en español? Default: false. */
        this.spanish = isSpanish ?? false;
        /** Everything that will be updated and drawn each frame. */
        this.entities = {
            background: [],
            midground: [],
            foreground: []
        };

        /** A user object to define behaviors of Chad. */
        this.user = {
            movingDown: false,
            movingUp: false,
            movingRight: false,
            movingLeft: false,
            jumping: false,
            running: false,
            dashing: false,
            aiming: false,
            firing: false,
            jabbing: false,
            interacting: false,
            cycleFood: false,
            eatFood: false,
            // Dialog
            continuingConversation: false,
            choiceUp: false,
            choiceDown: false
        };

        /** used to detect double taps */
        this.lastKeyTime = { keyA: 0, keyD: 0 };

        // /** Where is the x coordinate of the user's mouse? */
        // this.mouseX = 0;
        // /** Where is the y coordinate of the user's mouse? */
        // this.mouseY = 0;
        this.mousePos = new Vector(0, 0);

        /** The timer tells you how long it's been since the last tick! */
        this.timer = new Timer();

        /** How long has the game been running? */
        this.gameTime = 0;

        this.conversation = null;

        this._mode = GameEngine.MENU_MODE;
    }

    /**
     * The threshold in seconds at which a double tap is recognized.
     */
    static get DOUBLE_TAP_THRESHOLD() {
        return 0.25;
    }

    /** The current mode of the GameEngine. */
    get mode() {
        return this._mode;
    }

    /**
     * Set the GameEngine's mode.
     *
     * @param {string} newMode the mode of the game engine - should be one of GameEngine.GAMEPLAY_MODE,
     *      .DIALOG_MODE, or .MENU_MODE
     */
    set mode(newMode) {
        this._mode = newMode;
        this.configureEventListeners();
    }

    /**
     * This adds a new entity to the entities array.
     * @param {Object} entity The entity (sprite) that you want to add to the Game.
     * @param {number} zIndex negative for background, zero (default) for midground, positive for foreground.
     */
    addEntity(entity, zIndex = 0) {
        if (zIndex < 0) {
            this.entities.background.push(entity);
        } else if (zIndex > 0) {
            this.entities.foreground.push(entity);
        } else {
            this.entities.midground.push(entity);
        }
    }

    /** This is going to clear all of the entities so that a new set can be placed in. */
    clearEntities() {
        this.entities = {
            background: [],
            midground: [],
            foreground: []
        };
    }

    /** This method is actually going to control the update-render loop that is at the heart of any game. */
    start() {
        this.configureEventListeners();
        this.running = true;
        const gameLoop = () => {
            this.loop();
            requestAnimFrame(gameLoop, CANVAS);
        };
        gameLoop();
    }

    /** This is the update-render loop. */
    loop() {
        this.clockTick = this.timer.tick();
        this.gameTime += this.clockTick;
        this.update();
        this.draw();
    }

    /**
     * This method is going to go through all entities and allow them to update their position.
     */
    update() {
        if (this.running) {
            // (1) Update the background entities:
            this.entities.background.forEach((entity) => {
                if (entity.removeFromWorld) {
                    const i = this.entities.background.indexOf(entity);
                    this.entities.background.splice(i, 1);
                } else {
                    entity.update();
                }
            });

            // (2) Update the midground entities:
            this.entities.midground.forEach((entity) => {
                if (entity.removeFromWorld) {
                    const i = this.entities.midground.indexOf(entity);
                    this.entities.midground.splice(i, 1);
                } else {
                    entity.update();
                }
            });

            // (3) Update CHAD and CAMERA:
            CHAD.update();
            CAMERA.update();

            // (4) Update the foreground entities:
            this.entities.foreground.forEach((entity) => {
                if (entity.removeFromWorld) {
                    const i = this.entities.foreground.indexOf(entity);
                    this.entities.foreground.splice(i, 1);
                } else {
                    entity.update();
                }
            });
        }
        // Update the HUD regardless of whether the game is running or not
        HUD.update();
        this.lastKeyTime.keyA += GAME.clockTick;
        this.lastKeyTime.keyD += GAME.clockTick;

        // This fixed a bug where once you switched choices, it switched in an infinite loop.
        this.user.choiceUp = false;
        this.user.choiceDown = false;
        this.user.continuingConversation = false;
    }

    /**
     * This method is going to clear the canvas and redraw ALL of the entities in their *new* positions.
     */
    draw() {
        // (1) Paint over everything with the background color.
        CTX.fillStyle = BG_COLOR;
        CTX.fillRect(0, 0, Camera.SIZE.x, Camera.SIZE.y);

        // (2) Draw the background entities.
        this.entities.background.forEach((entity) => {
            entity.draw();
        });

        // (3) Draw the midground entities.
        this.entities.midground.forEach((entity) => {
            entity.draw();
        });

        // (4) Draw CHAD and the debugging grid:
        if (this.debug) {
            this.drawGrid();
        }
        CHAD.draw();

        // (5) Draw the foreground entities.
        this.entities.foreground.forEach((entity) => {
            entity.draw();
        });
    }

    /**
     * This method is going to start listening for user inputs. Affects the Game Engine's left/right/up/down booleans according
     * to interaction with either the WASD keys or arrows.
     */
    configureEventListeners() {
        // Set all listeners to false.
        Object.keys(this.user).forEach((key) => {
            this.user[key] = false;
        });

        if (this.mode === GameEngine.GAMEPLAY_MODE) {
            // Remove all other listeners.
            CANVAS.removeEventListener(
                'keypress',
                EVENT_HANDLERS.dialogKeyPress,
                false
            );
            CANVAS.removeEventListener(
                'keyup',
                EVENT_HANDLERS.dialogKeyUp,
                false
            );
            CANVAS.removeEventListener(
                'keydown',
                EVENT_HANDLERS.dialogKeyDown,
                false
            );
            CANVAS.removeEventListener(
                'keypress',
                EVENT_HANDLERS.mickeyKeyPresses,
                false
            );
            // Add the gameplay listeners.
            CANVAS.addEventListener(
                'mousedown',
                EVENT_HANDLERS.gameplayMouseDown,
                false
            );
            CANVAS.addEventListener(
                'mouseup',
                EVENT_HANDLERS.gameplayMouseUp,
                false
            );
            CANVAS.addEventListener(
                'mousemove',
                EVENT_HANDLERS.gameplayMouseMove,
                false
            );
            CANVAS.addEventListener(
                'keydown',
                EVENT_HANDLERS.gameplayKeyDown,
                false
            );
            CANVAS.addEventListener(
                'keyup',
                EVENT_HANDLERS.gameplayKeyUp,
                false
            );
        } else if (this.mode === GameEngine.DIALOG_MODE) {
            // Remove all other listeners.
            CANVAS.removeEventListener(
                'mousedown',
                EVENT_HANDLERS.gameplayMouseDown,
                false
            );
            CANVAS.removeEventListener(
                'mouseup',
                EVENT_HANDLERS.gameplayMouseUp,
                false
            );
            CANVAS.removeEventListener(
                'mousemove',
                EVENT_HANDLERS.gameplayMouseMove,
                false
            );
            CANVAS.removeEventListener(
                'keydown',
                EVENT_HANDLERS.gameplayKeyDown,
                false
            );
            CANVAS.removeEventListener(
                'keyup',
                EVENT_HANDLERS.gameplayKeyUp,
                false
            );
            CANVAS.addEventListener(
                'keypress',
                EVENT_HANDLERS.mickeyKeyPresses,
                false
            );
            // Add the dialog listeners
            CANVAS.addEventListener(
                'keypress',
                EVENT_HANDLERS.dialogKeyPress,
                false
            );

            /*
            Note: For whatever reason, "keypress" event with code "Space" does not work -
            so I fixed it by doing keyup and keydown. Works fine now.
            */
            CANVAS.addEventListener('keyup', EVENT_HANDLERS.dialogKeyUp, false);
            CANVAS.addEventListener(
                'keydown',
                EVENT_HANDLERS.dialogKeyDown,
                false
            );
        } else if (this.mode === GameEngine.MENU_MODE) {
            // Remove all other listeners
            CANVAS.removeEventListener(
                'mousedown',
                EVENT_HANDLERS.gameplayMouseDown,
                false
            );
            CANVAS.removeEventListener(
                'mouseup',
                EVENT_HANDLERS.gameplayMouseUp,
                false
            );
            CANVAS.removeEventListener(
                'keydown',
                EVENT_HANDLERS.gameplayKeyDown,
                false
            );
            CANVAS.removeEventListener(
                'keyup',
                EVENT_HANDLERS.gameplayKeyUp,
                false
            );
            CANVAS.removeEventListener(
                'keypress',
                EVENT_HANDLERS.dialogKeyPress,
                false
            );
            CANVAS.removeEventListener(
                'keyup',
                EVENT_HANDLERS.dialogKeyUp,
                false
            );
            CANVAS.removeEventListener(
                'keydown',
                EVENT_HANDLERS.dialogKeyDown,
                false
            );
            CANVAS.removeEventListener(
                'keypress',
                EVENT_HANDLERS.mickeyKeyPresses,
                false
            );

            // Add menu listeners
            CANVAS.addEventListener(
                'mousemove',
                EVENT_HANDLERS.gameplayMouseMove,
                false
            );
        }
    }

    /**
     * This is (the only thing, currently, that is) called when Debug mode is active!
     * This draws a grid around all blocks, and every 5 block cells are labeled.
     */
    drawGrid() {
        // (1) Draw the grid:

        CTX.strokeStyle = 'white';
        CTX.strokeWeight = 1;

        // Draw all the vertical lines by iterating through the x values we need.
        for (
            let x = ZONE.MIN_PT.x;
            x <= ZONE.MAX_PT.x;
            x += Block.SCALED_SIZE
        ) {
            // Start a path
            CTX.beginPath();
            // Starting point
            CTX.moveTo(x - CAMERA.pos.x, ZONE.MIN_PT.y - CAMERA.pos.y);
            // Ending point
            CTX.lineTo(x - CAMERA.pos.x, ZONE.MAX_PT.y - CAMERA.pos.y);
            // Actually draw it.
            CTX.stroke();
            // Close the path
            CTX.closePath();
        }

        // Draw all the horizontal lines by iterating through the y values we need.
        for (
            let y = ZONE.MIN_PT.y;
            y <= ZONE.MAX_PT.y;
            y += Block.SCALED_SIZE
        ) {
            // Start a path
            CTX.beginPath();
            // Starting point
            CTX.moveTo(ZONE.MIN_PT.x - CAMERA.pos.x, y - CAMERA.pos.y);
            // Ending point
            CTX.lineTo(ZONE.MAX_PT.x - CAMERA.pos.x, y - CAMERA.pos.y);
            // Actually draw it.
            CTX.stroke();
            // Close the path
            CTX.closePath();
        }

        // (2) Label the cells.

        CTX.fillStyle = 'red';
        CTX.font = FONT.VT323_NORMAL;

        // Where we want to start drawing the label. Note: the +5 is so that it is clear which cell we are labeling.
        let gameX = ZONE.MIN_PT.x + 5;
        // This is the minimum y value that we will write at. Note: the +18 is related to the font size.
        // Apparently drawing text with the context will start writing right ABOVE where you dictate.
        const minY = ZONE.MIN_PT.y + 18;
        // This is going to be where we want to start drawing the label, just like gameX.
        let gameY = minY;

        // As it is currently working, it will DEFINITELY label ZONE.MIN_BLOCK, and every 5 other than that.
        // Would like to refactor it eventually to DEFINITELY label the origin, but not super important.
        // Also, could be refactored to better use the Vector class's static methods.
        for (
            let blockX = ZONE.MIN_BLOCK.x;
            blockX <= ZONE.MAX_BLOCK.x;
            blockX += 5
        ) {
            for (
                let blockY = ZONE.MIN_BLOCK.y;
                blockY <= ZONE.MAX_BLOCK.y;
                blockY += 5
            ) {
                // The string representing the cell we are labeling.
                let pt = '(' + blockX + ', ' + blockY + ')';
                // Draw it.
                CTX.fillText(
                    pt,
                    gameX - CAMERA.pos.x,
                    gameY - CAMERA.pos.y,
                    Block.SCALED_SIZE
                );
                // Skip 5 blocks.
                gameY += Block.SCALED_SIZE * 5;
            }
            // Skip 5 blocks.
            gameX += Block.SCALED_SIZE * 5;
            // Reset gameY! If you don't you'll only ever see the first column of labels.
            gameY = minY;
        }
    }

    static get BACKGROUND() {
        return -1;
    }

    static get MIDGROUND() {
        return 0;
    }

    static get FOREGROUND() {
        return 1;
    }

    static get GAMEPLAY_MODE() {
        return 'gameplay';
    }

    static get DIALOG_MODE() {
        return 'dialog';
    }

    static get MENU_MODE() {
        return 'menu';
    }
}
