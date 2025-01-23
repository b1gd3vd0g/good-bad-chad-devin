class SaveManager {
    constructor() {
        this.token = localStorage.getItem('player_auth_token');
    }

    static get POSITION() {
        return Vector.multiply(
            Vector.subtract(Camera.SIZE, SaveManager.SIZE),
            1 / 2
        );
    }

    static get SIZE() {
        return new Vector(500, Camera.SIZE.y / 4);
    }

    update() {
        // Do nothing if the game is not paused.
        if (GAME.RUNNING) return;
    }

    draw() {
        // Do nothing if the game is not paused.
        if (GAME.RUNNING) return;
        CTX.fillStyle = 'rgba(255, 32, 32, 0.5)';
        CTX.fillRect(
            this.POSITION.x,
            this.POSITION.y,
            this.SIZE.x,
            this.SIZE.y
        );
    }
}
