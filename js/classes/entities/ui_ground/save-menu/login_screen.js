class LoginScreen {
    constructor() {
        this.un = new TextInputField('username', this, 50);
        this.pw = new TextInputField('password', this, 150, true);
        this.button = new LoginButton(250, this);
        this.feedback = new Feedback(350);
    }

    update() {}

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
                evt.preventDefault();
                // delete a character on backspace
                this.value = this.value.slice(0, this.value.length - 1);
            } else if (evt.key === 'Tab') {
                // switch the active field on tab.
                this.parent.un.active = this.parent.pw.active;
                this.parent.pw.active = !this.parent.un.active;
            }
            this.value += evt.key;
        };
        document.body.addEventListener('click', clickListener);
        HUD.componentListeners.push(['click', clickListener]);
        document.body.addEventListener('keypress', kpListener);
        HUD.componentListeners.push(['keypress', kpListener]);
    }

    static get LABEL_SIZE() {
        return new Vector((PauseMenu.WIDTH - 100) * (2 / 5) - 50, 75);
    }

    static get FIELD_SIZE() {
        return new Vector((PauseMenu.WIDTH - 100) * (3 / 5) + 50, 75);
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
        this.sy = PauseMenu.START.y + sy + 34;
        this.mood = 0;
    }

    setFb(fb, mood = 0) {
        this.fb = fb;
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
