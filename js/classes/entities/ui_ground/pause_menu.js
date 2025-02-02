class PauseMenu {
    constructor() {
        this.tabs = new PauseMenuTabs([PauseMenu.CONTROLS, PauseMenu.SAVE]);
        this.controls = new Controls();
    }

    static get CONTROLS() {
        return 'CONTROLS';
    }

    static get SAVE() {
        return 'SAVE';
    }

    static get WIDTH() {
        return 750;
    }

    static get START() {
        return new Vector(
            Camera.SIZE.x / 2 - PauseMenu.WIDTH / 2,
            Camera.SIZE.y / 6 + 75
        );
    }

    static get BG_COLOR() {
        return 'rgba(0, 0, 0, 0.5)';
    }

    static get FG_COLOR() {
        return 'rgba(200, 200, 200, 0.8)';
    }

    static get FG_COLOR_MUTED() {
        return 'rgba(200, 200, 200, 0.3)';
    }

    /** The name of the currently active tab. */
    get activeTab() {
        return this.tabs.activeTab;
    }

    update() {}

    draw() {
        this.tabs.draw();
        // now, draw the correct menu based on the active tab.
        if (this.activeTab === PauseMenu.CONTROLS) {
            // controls is just a simple menu that needs to be drawn
            this.controls.draw();
            // but if we're drawing the controls, the SAVE_MGR should not be
            // listening.
            SAVE_MGR.listen(false);
        } else if (this.activeTab === PauseMenu.SAVE) {
            SAVE_MGR.listen();
            SAVE_MGR.draw();
        }
    }
}

class PauseMenuTabs {
    constructor(tabNames) {
        this.tabs = [];
        let i = 0;
        const w = PauseMenu.WIDTH / tabNames.length - 10;
        const m = 5;
        tabNames.forEach((name) => {
            // configure and add the new tab.
            const newTab = {
                name: name,
                index: i,
                sx: PauseMenu.START.x + (w + 2 * m) * i,
                sy: PauseMenu.START.y - 100,
                w: w,
                h: 75
            };
            this.tabs.push(newTab);
            // add a listener to this tab.
            const listener = () => {
                // this is only relevant for when the game is paused.
                if (GAME.running) return;

                const mouseOverTab =
                    GAME.mousePos.x > newTab.sx &&
                    GAME.mousePos.y > newTab.sy &&
                    GAME.mousePos.x < newTab.sx + newTab.w &&
                    GAME.mousePos.y < newTab.sy + newTab.h;
                if (mouseOverTab) {
                    ASSET_MGR.playSFX(
                        SFX.UI_HIGH_BEEP.path,
                        SFX.UI_HIGH_BEEP.volume
                    );
                    this.active = newTab.index;
                }
            };
            document.body.addEventListener('click', listener);
            HUD.componentListeners.push(['click', listener]);
            i++;
        });
        this.active = 0;
    }

    get activeTab() {
        return this.tabs[this.active].name;
    }

    update() {}

    draw() {
        let i = 0;
        this.tabs.forEach((tab) => {
            // draw background rect.
            CTX.fillStyle = PauseMenu.BG_COLOR;
            CTX.fillRect(tab.sx, tab.sy, tab.w, tab.h);
            // figure out color
            const color =
                this.active === i
                    ? PauseMenu.FG_COLOR
                    : PauseMenu.FG_COLOR_MUTED;
            // draw text.
            CTX.fillStyle = color;
            CTX.font = FONT.VT323_HEADER;
            CTX.fillText(tab.name, tab.sx + 50, tab.sy + 50);
            i++;
        });
    }
}
