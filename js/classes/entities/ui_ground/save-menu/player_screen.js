class PlayerScreen {
    constructor(parent) {
        this.parent = parent;
        this.player = parent.player;
        this.saveButton = new SaveButton(this);
        this.logOutButton = new LogOutButton(this);
        this.saves = new SavesList(parent.saves, this);
    }

    draw() {
        CTX.fillStyle = PauseMenu.BG_COLOR;
        CTX.fillRect(
            PauseMenu.START.x,
            PauseMenu.START.y,
            PauseMenu.WIDTH,
            600
        );
        CTX.font = FONT.VT323_HEADER;
        CTX.fillStyle = 'rgb(255,255,255)';
        CTX.fillText(
            `Hello, ${this.player.username}!`,
            PauseMenu.START.x + 50,
            PauseMenu.START.y + 50,
            PauseMenu.WIDTH - 100
        );
        this.saveButton.draw();
        this.logOutButton.draw();
        this.saves.draw();
    }
}

class SavesList {
    constructor(saves, parent) {
        this.parent = parent;
        let sy = 100;
        this.saves = saves.map((save) => {
            sy += 125;
            return new SaveSummary(save, sy, this);
        });
    }

    draw() {
        this.saves.forEach((save) => {
            save.draw();
        });
    }
}

class SaveSummary {
    constructor(save, sy, parent) {
        this.parent = parent;
        this.health = save.health;
        this.runes = save.rune_count;
        this.time = new Date(save.saved_at).toLocaleString('en-US');
        this.zone = save.zone;
        this.id = save.save_id;
        this.pos = new Vector(PauseMenu.START.x + 50, PauseMenu.START.y + sy);
        this.size = new Vector(PauseMenu.WIDTH - 100, 100);
        this.trash = new SaveTrashCan(this);
        const listener = async () => {
            const mouseOver =
                GAME.mousePos.x > this.pos.x &&
                GAME.mousePos.y > this.pos.y &&
                GAME.mousePos.x < this.pos.x + this.size.x &&
                GAME.mousePos.y < this.pos.y + this.size.y;
            if (mouseOver) {
                const singleSaveResponse = await SaveFetch.fetchOneSaveById(
                    this.id
                );
                console.log(singleSaveResponse.info);
                switch (singleSaveResponse.status) {
                    case 200:
                        SaveManager.loadGameFromSave(singleSaveResponse.info);
                        break;
                    default:
                        throw new Error("That save couldn't be found");
                }
            }
        };
        document.body.addEventListener('click', listener);
        HUD.componentListeners.push(['click', listener]);
    }

    draw() {
        if (this.hover) {
            CTX.fillStyle = 'rgba(255,255,255,0.2)';
            CTX.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
        }
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
        CTX.font = FONT.VT323_HEADER;
        CTX.fillText(this.zone, this.pos.x, this.pos.y + this.size.y);
        this.trash.draw();
    }
}

class SaveTrashCan {
    constructor(parent) {
        this.pos = new Vector(parent.pos.x + parent.size.x + 100, parent.pos.y);
        this.size = new Vector(parent.size.y, parent.size.y);
        this.lastClick = Date.now();
        const listener = async () => {
            const mouseOver =
                GAME.mousePos.x > this.pos.x &&
                GAME.mousePos.y > this.pos.y &&
                GAME.mousePos.x < this.pos.x + this.size.x &&
                GAME.mousePos.y < this.pos.y + this.size.y;
            if (mouseOver) {
                if (Date.now - this.lastClick < 2_500) return;
                const deletion = await SaveFetch.deleteOneSaveById(parent.id);
                parent.parent.parent.parent.configureFromToken();
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
            ASSET_MGR.getAsset(SaveTrashCan.SPRITESHEET),
            this.pos.x,
            this.pos.y,
            this.size.x,
            this.size.y
        );
    }
}

class SaveButton {
    constructor(parent) {
        this.pos = new Vector(PauseMenu.START.x + 50, PauseMenu.START.y + 100);
        this.size = new Vector((PauseMenu.WIDTH - 150) / 2, 75);
        this.lastClick = Date.now();
        const listener = async () => {
            const mouseOver =
                GAME.mousePos.x > this.pos.x &&
                GAME.mousePos.y > this.pos.y &&
                GAME.mousePos.x < this.pos.x + this.size.x &&
                GAME.mousePos.y < this.pos.y + this.size.y;
            if (mouseOver) {
                if (Date.now() - this.lastClick < 2_500) return;
                this.lastClick = Date.now();
                const result = await SaveFetch.createNewSave();
                switch (result.status) {
                    case 201:
                        console.log('save added!');
                        parent.parent.configureFromToken();
                        break;
                    default:
                        console.error(result.info);
                        throw new Error('Failed making new save.');
                }
            }
        };
        document.body.addEventListener('click', listener);
        HUD.componentListeners.push(['click', listener]);
    }
    draw() {
        CTX.fillStyle = 'rgba(255,255,255, 0.5)';
        CTX.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
        CTX.font = FONT.VT323_HEADER;
        CTX.fillStyle = 'rgb(0,0,0)';
        CTX.fillText('New Save', this.pos.x + 50, this.pos.y + 50);
    }
}

class LogOutButton {
    constructor(parent) {
        this.size = new Vector((PauseMenu.WIDTH - 150) / 2, 75);
        this.pos = new Vector(
            PauseMenu.START.x + PauseMenu.WIDTH - 50 - this.size.x,
            PauseMenu.START.y + 100
        );
        const listener = () => {
            const mouseOver =
                GAME.mousePos.x > this.pos.x &&
                GAME.mousePos.y > this.pos.y &&
                GAME.mousePos.x < this.pos.x + this.size.x &&
                GAME.mousePos.y < this.pos.y + this.size.y;
            if (mouseOver) {
                SaveManager.clearPlayerAuthToken();
                parent.parent.configureFromToken();
            }
        };
        document.body.addEventListener('click', listener);
        HUD.componentListeners.push(['click', listener]);
    }

    draw() {
        CTX.fillStyle = 'rgba(255, 255, 255, 0.5)';
        CTX.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
        CTX.font = FONT.VT323_HEADER;
        CTX.fillStyle = 'rgb(0,0,0)';
        CTX.fillText('Sign Out', this.pos.x + 50, this.pos.y + 50);
    }
}
