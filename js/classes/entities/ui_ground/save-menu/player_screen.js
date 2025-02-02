/**
 * The PlayerScreen contains all the `entities` needing to be drawn on the menu
 * to enable the player to view their own personal info, create a new save,
 * log out, and view each of their save files.
 */
class PlayerScreen {
    /** Construct a new PlayerScreen. */
    constructor() {
        this.listeners = [];
        /** The SaveButton, which creates a new save when pressed. */
        this.saveButton = new SaveButton(this);
        /** The LogOutButton, which logs the player out when pressed. */
        this.logOutButton = new LogOutButton(this);
        /** The SavesList, which handles all the player's save files. */
        this.list = new SavesList(this);
    }

    /**
     * Adds a listener to *this* screen. It will be added to the document, and
     * be added to this.listeners, so that it may be removed from the document
     * upon destruction of the screen.
     * @param {string} eventType The type of event to listen for ('click', 'keydown', etc.).
     * @param {Function} listener The function to be called when the event happens.
     */
    addListener(eventType, listener) {
        this.listeners.push([eventType, listener]);
        document.body.addEventListener(eventType, listener);
    }

    /**
     * This is called when the player screen is destroyed. Its only purpose is to
     * remove the event listeners associated with this screen removed from the
     * document, so that they no longer make changes when this screen no longer
     * exists.
     */
    destroy() {
        this.listeners.forEach((pair) => {
            const [eventType, listener] = pair;
            document.body.removeEventListener(eventType, listener);
        });
    }

    /** Draw the PlayerScreen. */
    draw() {
        // Draw the background.
        CTX.fillStyle = PauseMenu.BG_COLOR;
        CTX.fillRect(
            PauseMenu.START.x,
            PauseMenu.START.y,
            PauseMenu.WIDTH,
            600
        );
        // Greet the player, to signify who is logged in.
        CTX.font = FONT.VT323_HEADER;
        CTX.fillStyle = 'rgb(255,255,255)';
        CTX.fillText(
            `Hello, ${SAVE_MGR.player.username}!`,
            PauseMenu.START.x + 50,
            PauseMenu.START.y + 50,
            PauseMenu.WIDTH - 100
        );
        // Draw the row of buttons below the greeting.
        this.saveButton.draw();
        this.logOutButton.draw();
        // Draw the SavesList below the buttons.
        this.list.draw();
    }
}

/**
 * The Save Button creates a new save file when it is clicked, and calls for the
 * reconfiguration of the SaveManager
 */
class SaveButton {
    /** Constructs a new save button. */
    constructor(screen) {
        /** The screen this is associated with. */
        this.screen = screen;
        /** The position of this save button on the canvas. */
        this.pos = new Vector(PauseMenu.START.x + 50, PauseMenu.START.y + 100);
        /** The size of this save button. */
        this.size = new Vector((PauseMenu.WIDTH - 150) / 2, 75);

        /** Add a new save to the database on click. */
        const listener = async () => {
            if (!SAVE_MGR.listening) return;
            const clicked = mouseOver(this);
            if (clicked) {
                const result = await SaveFetch.createNewSave();
                switch (result.status) {
                    case 201:
                        console.log('save added!');
                        SAVE_MGR.configureFromToken();
                        break;
                    default:
                        console.error(result.info);
                        throw new Error('Failed making new save.');
                }
            }
        };

        this.screen.addListener('click', listener);
    }

    /** Draw the SaveButton on the canvas. */
    draw() {
        CTX.fillStyle = 'rgba(255,255,255, 0.5)';
        CTX.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
        CTX.font = FONT.VT323_HEADER;
        CTX.fillStyle = 'rgb(0,0,0)';
        CTX.fillText('New Save', this.pos.x + 50, this.pos.y + 50);
    }
}

/** The LogOutButton logs the player out when it is clicked. */
class LogOutButton {
    /** Construct a new LogOutButton. */
    constructor(screen) {
        /** The screen this is associated with. */
        this.screen = screen;
        /** The size of this button. */
        this.size = new Vector((PauseMenu.WIDTH - 150) / 2, 75);
        /** The position of this button on the canvas. */
        this.pos = new Vector(
            PauseMenu.START.x + PauseMenu.WIDTH - 50 - this.size.x,
            PauseMenu.START.y + 100
        );

        /** Clear the player auth token and reconfigure the SAVE_MGR upon click. */
        const listener = () => {
            if (!SAVE_MGR.listening) return;
            const clicked = mouseOver(this);
            if (clicked) {
                SaveManager.clearPlayerAuthToken();
                SAVE_MGR.configureFromToken();
            }
        };

        this.screen.addListener('click', listener);
    }

    /** Draws the LogOutButton on the canvas. */
    draw() {
        CTX.fillStyle = 'rgba(255, 255, 255, 0.5)';
        CTX.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
        CTX.font = FONT.VT323_HEADER;
        CTX.fillStyle = 'rgb(0,0,0)';
        CTX.fillText('Sign Out', this.pos.x + 50, this.pos.y + 50);
    }
}

/** The SavesList contains an array of SaveSummary objects for each of the player's saves. */
class SavesList {
    /** Construct a new SavesList from the saves in the Save Manager. */
    constructor(screen) {
        // calculate the displacement of y for each save.
        let sy = 100;
        /** A list of SaveSummaries for each of the player's saves. */
        this.saves = SAVE_MGR.saves.map((save) => {
            sy += 125;
            return new SaveSummary(screen, save, sy);
        });
    }

    /** Draw the saves list on the canvas. */
    draw() {
        this.saves.forEach((save) => {
            save.draw();
        });
    }
}

/**
 * A SaveSummary contains the basic info for a single save object file; that is,
 * only enough to be able to present it to the player and be distinguised from others.
 */
class SaveSummary {
    /**
     * Constructs a new SaveSummary.
     * @param {object} save The partial save file to be represented.
     * @param {number} startY The starting y coordinate for this SaveSummary to be drawn at.
     */
    constructor(screen, save, startY) {
        /** The screen this summary is associated with. */
        this.screen = screen;
        /** Chad's health for this save file. */
        this.health = save.health;
        /** Amount of runes for this save file. */
        this.runes = save.rune_count;
        /** Time this file was saved (american english locale string). */
        this.time = new Date(save.saved_at).toLocaleString('en-US');
        /** The zone for this save file. */
        this.zone = save.zone;
        /** The save id for this save file. */
        this.id = save.save_id;
        /** The position for this SaveSummary to be drawn on the screen. */
        this.pos = new Vector(
            PauseMenu.START.x + 50,
            PauseMenu.START.y + startY
        );
        /** The size for this SaveSummary to be drawn on the screen. */
        this.size = new Vector(PauseMenu.WIDTH - 100, 100);
        /** The Trash Can Icon which will delete this save upon being clicked. */
        this.trash = new SaveTrashCan(this);

        /** Load the game based on the save file that this SaveSummary represents when clicked. */
        const listener = async () => {
            if (!SAVE_MGR.listening) return;
            const clicked = mouseOver(this);
            if (clicked) {
                // fetch a single save.
                const singleSaveResponse = await SaveFetch.fetchOneSaveById(
                    this.id
                );
                console.log(singleSaveResponse.info);
                switch (singleSaveResponse.status) {
                    case 200:
                        // the save was fetched successfully!
                        // load the game based on it!
                        SaveManager.loadGameFromSave(singleSaveResponse.info);
                        break;
                    default:
                        throw new Error("That save couldn't be found");
                }
            }
        };

        this.screen.addListener('click', listener);
    }

    /** Draw this SaveSummary on the canvas. */
    draw() {
        // if we are hovering over one, highlight it a little.
        if (mouseOver(this)) {
            CTX.fillStyle = 'rgba(255,255,255,0.2)';
            CTX.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
        }
        // Draw the date and HP/rune string on top line.
        CTX.fillStyle = 'rgb(255,255,255)';
        CTX.font = FONT.VT323_NORMAL;
        CTX.fillText(
            new Date(this.time).toLocaleString('en-US'),
            this.pos.x,
            this.pos.y + 34
        );
        const hpRuneStr = `HP: ${this.health} | Runes: ${this.runes}`;
        const hpRuneStrSize = CTX.measureText(hpRuneStr).width;
        CTX.fillText(
            hpRuneStr,
            this.pos.x + this.size.x - hpRuneStrSize,
            this.pos.y + 34
        );
        // Draw the zone on the bottom line.
        CTX.font = FONT.VT323_HEADER;
        CTX.fillText(this.zone, this.pos.x, this.pos.y + this.size.y);
        // Draw the trash can
        this.trash.draw();
    }
}

class SaveTrashCan {
    constructor(summary) {
        /** The position of this trash can on the canvas. */
        this.pos = new Vector(
            summary.pos.x + summary.size.x + 100,
            summary.pos.y
        );
        /** The size of this trash can. */
        this.size = new Vector(summary.size.y, summary.size.y);

        /** Deletes this save from the db and reconfigure the save manager on click. */
        const listener = async () => {
            if (!SAVE_MGR.listening) return;
            const clicked = mouseOver(this);
            if (clicked) {
                const deletion = await SaveFetch.deleteOneSaveById(summary.id);
                SAVE_MGR.configureFromToken();
            }
        };

        summary.screen.addListener('click', listener);
    }

    static get SPRITESHEET() {
        return './sprites/trash.png';
    }

    draw() {
        CTX.drawImage(
            ASSET_MGR.getAsset(SaveTrashCan.SPRITESHEET),
            this.pos.x,
            this.pos.y,
            this.size.x,
            this.size.y
        );
    }
}
