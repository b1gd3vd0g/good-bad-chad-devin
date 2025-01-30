/** The LoginScreen contains all the `entities` needing to be drawn on the menu to enable the player to
 * log in to an account which already exists.
 */
class LoginScreen {
    constructor(parent) {
        this.un = new TextInputField('username', this, 50);
        this.pw = new TextInputField('password', this, 150, true);
        this.kmsi = new KeepMeSignedIn(275);
        this.button = new LoginButton(400, this);
        this.feedback = new Feedback(525);
        this.parent = parent;
    }

    /** Draw the login screen. */
    draw() {
        CTX.fillStyle = PauseMenu.BG_COLOR;
        CTX.fillRect(
            PauseMenu.START.x,
            PauseMenu.START.y,
            PauseMenu.WIDTH,
            600
        );
        this.un.draw();
        this.pw.draw();
        this.kmsi.draw();
        this.button.draw();
        this.feedback.draw();
    }

    async attemptLogin() {
        const result = await PlayerFetch.authenticatePlayerLogin(
            this.un.value,
            this.pw.value
        );
        switch (result.status) {
            case 200:
                this.feedback.setFb('success', 1);
                const local = this.kmsi.selected;
                SaveManager.setPlayerAuthToken(result.info.token, local);
                this.parent.configureFromToken();
                break;
            default:
                this.feedback.setFb('fail', -1);
        }
    }
}

class TextInputField {
    constructor(label, parent, sy, pw = false) {
        this.label = label.charAt(0).toUpperCase() + label.slice(1) + ':';
        this.parent = parent;
        this.active = false;
        this.value = '';
        this.start = new Vector(PauseMenu.START.x + 50, PauseMenu.START.y + sy);
        this.size = new Vector(PauseMenu.WIDTH - 100, 75);
        this.pw = pw;
        this.trash = new TrashCan(this.start.y, () => {
            this.value = '';
        });
        // set listeners.
        const clickListener = () => {
            // return if the games not running
            if (GAME.running) return;
            // is the mouse over the tab?
            const mouseOverTab =
                GAME.mousePos.x > this.start.x &&
                GAME.mousePos.y > this.start.y &&
                GAME.mousePos.x < this.start.x + this.size.x &&
                GAME.mousePos.y < this.start.y + this.size.y;
            // if it is, make this field active.
            if (mouseOverTab) {
                if (this.active) return;
                // set this field active.
                this.active = true;
            } else {
                this.active = false;
            }
        };
        const kpListener = (evt) => {
            if (GAME.running || !this.active) return;
            // so it is active! The keypress should be added to the value field.
            if (evt.key === 'Backspace') {
                // delete a character on backspace
                console.log('backspace');
                this.value = '';
                return;
            } else if (evt.which === 9) {
                // switch the active field on tab.
                console.log('tab');
                this.parent.un.active = this.parent.pw.active;
                this.parent.pw.active = !this.parent.un.active;
                return;
            }
            this.value += evt.key;
        };
        CANVAS.addEventListener('click', clickListener);
        HUD.componentListeners.push(['click', clickListener]);
        CANVAS.addEventListener('keypress', kpListener);
        HUD.componentListeners.push(['keypress', kpListener]);
    }

    static get LABEL_SIZE() {
        return new Vector((PauseMenu.WIDTH - 100) * (2 / 5) - 50, 75);
    }

    static get FIELD_SIZE() {
        return new Vector((PauseMenu.WIDTH - 100) * (3 / 5) - 50, 75);
    }

    update() {}

    draw() {
        // draw a background border around the TIF
        // CTX.fillStyle = 'rgba(255, 255, 255, 0.2)';
        // CTX.fillRect(this.start.x, this.start.y, this.size.x, this.size.y);
        // draw the label for the field.
        CTX.font = FONT.VT323_HEADER;
        CTX.fillStyle = 'rgb(255,255,255)';
        CTX.fillText(
            this.label,
            this.start.x,
            this.start.y + this.size.y,
            TextInputField.LABEL_SIZE.x
        );
        // draw the field.
        if (this.active) {
            CTX.strokeStyle = 'rgb(255,255,255)';
        } else {
            CTX.strokeStyle = 'rgba(255,255,255,0.3)';
        }
        CTX.lineWidth = 5;
        CTX.strokeRect(
            this.start.x + TextInputField.LABEL_SIZE.x,
            this.start.y,
            TextInputField.FIELD_SIZE.x,
            this.size.y
        );
        // draw the value in the box.
        const text = this.pw ? '*'.repeat(this.value.length) : this.value;
        CTX.fillText(
            text,
            this.start.x + TextInputField.LABEL_SIZE.x + 20,
            this.start.y + 55,
            TextInputField.FIELD_SIZE.x
        );
        this.trash.draw();
    }
}

class KeepMeSignedIn {
    constructor(sy) {
        this.selected = false;
        this.pos = new Vector(PauseMenu.START.x + 50, PauseMenu.START.y + sy);
        this.size = new Vector(PauseMenu.WIDTH - 100, 75);
        const listener = () => {
            const mouseOver =
                GAME.mousePos.x > this.pos.x &&
                GAME.mousePos.y > this.pos.y &&
                GAME.mousePos.x < this.pos.x + this.size.x &&
                GAME.mousePos.y < this.pos.y + this.size.y;
            if (mouseOver) {
                this.selected = !this.selected;
            }
        };
        document.body.addEventListener('click', listener);
        HUD.componentListeners.push(['click', listener]);
    }

    draw() {
        CTX.strokeStyle = 'rgb(255,255,255)';
        CTX.lineWidth = 3;
        CTX.strokeRect(this.pos.x, this.pos.y, this.size.y, this.size.y);
        CTX.fillStyle = 'rgb(255,255,255)';
        if (this.selected) {
            CTX.fillRect(this.pos.x + 12.5, this.pos.y + 12.5, 50, 50);
        }
        CTX.font = FONT.VT323_HEADER;
        CTX.fillText(
            'Keep me signed in',
            this.pos.x + this.size.y + 50,
            this.pos.y + this.size.y,
            this.size.x - this.size.y
        );
    }
}

class LoginButton {
    constructor(sy, parent) {
        this.size = new Vector((PauseMenu.WIDTH * 2) / 5, 75);
        this.pos = new Vector(
            PauseMenu.START.x + (PauseMenu.WIDTH - this.size.x) / 2,
            PauseMenu.START.y + sy
        );
        this.parent = parent;
        const listener = () => {
            const mouseOverTab =
                GAME.mousePos.x > this.pos.x &&
                GAME.mousePos.y > this.pos.y &&
                GAME.mousePos.x < this.pos.x + this.size.x &&
                GAME.mousePos.y < this.pos.y + this.size.y;
            if (mouseOverTab) {
                parent.attemptLogin();
            }
        };
        document.body.addEventListener('click', listener);
        HUD.componentListeners.push(['click', listener]);
    }

    draw() {
        CTX.fillStyle = 'rgba(255,255,255,0.4)';
        CTX.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
        CTX.strokeStyle = 'rgb(255,255,255)';
        CTX.lineWidth = 5;
        CTX.strokeRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
        CTX.fillStyle = 'rgb(255,255,255)';
        CTX.font = FONT.VT323_HEADER;
        const login = 'LOG IN';
        const textWidth = CTX.measureText(login).width;
        CTX.fillText(
            'LOG IN',
            this.pos.x + (this.size.x - textWidth) / 2,
            this.pos.y + 55,
            this.size.x
        );
    }
}

class Feedback {
    constructor(sy) {
        this.fb = '';
        this.sy = PauseMenu.START.y + sy;
        this.mood = 0;
    }

    setFb(fb, mood = 0) {
        this.fb = fb;
        this.mood = mood;
    }

    draw() {
        if (!this.fb) return;
        CTX.font = FONT.VT323_NORMAL;

        if (this.mood < 0) CTX.fillStyle = 'rgb(150, 0, 0)';
        else if (this.mood > 0) CTX.fillStyle = 'rgb(0,150,0)';
        else CTX.fillStyle = 'rgb(255,255,255)';

        const width = CTX.measureText(this.fb).width;
        CTX.fillText(
            this.fb,
            PauseMenu.START.x + (PauseMenu.WIDTH - width) / 2,
            this.sy
        );
    }
}

class TrashCan {
    constructor(sy, onClick) {
        this.pos = new Vector(PauseMenu.START.x + PauseMenu.WIDTH - 100, sy);
        this.size = new Vector(75, 75);
        const listener = () => {
            const mouseOver =
                GAME.mousePos.x > this.pos.x &&
                GAME.mousePos.y > this.pos.y &&
                GAME.mousePos.x < this.pos.x + this.size.x &&
                GAME.mousePos.y < this.pos.y + this.size.y;
            if (mouseOver) {
                onClick();
            }
        };

        document.body.addEventListener('click', listener);
        HUD.componentListeners.push(['click', listener]);
    }

    static get SPRITESHEET() {
        return './sprites/trash.png';
    }

    draw() {
        CTX.drawImage(
            ASSET_MGR.getAsset(TrashCan.SPRITESHEET),
            this.pos.x,
            this.pos.y,
            this.size.x,
            this.size.y
        );
    }
}
