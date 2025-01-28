class SaveManager {
    constructor() {
        this.configured = false;
        this.player = null;
        this.saves = [];
        this.screen = new LoginScreen();
    }

    static get TOKEN_KEY() {
        return 'player-auth-token';
    }

    /**
     * @returns the `player-auth-token` cookie, either from SessionStorage
     * or LocalStorage. If it does not exist in either place, return null.
     */
    static getAuthToken() {
        return (
            localStorage.getItem(SaveManager.TOKEN_KEY) ??
            sessionStorage.getItem(SaveManager.TOKEN_KEY)
        );
    }

    /**
     * Stores the auth token to either localStorage or sessionStorage, depending
     * on the `local` parameter.
     * @param {string} token The auth token to be stored.
     * @param {boolean} local True if it should be stored in localStorage; otherwise it
     *      will be stored in sessionStorage. Default: false.
     */
    static setPlayerAuthToken(token, local = false) {
        if (local) {
            localStorage.setItem(SaveManager.TOKEN_KEY, token);
        } else {
            sessionStorage.setItem(SaveManager.TOKEN_KEY, token);
        }
    }

    /**
     * Configures the SaveManager based on the auth token. If the auth token
     * does not exist, it will clear the personal fields of the save manager.
     * If it does exist, it will asyncronously fill in the personal fields of
     * the save manager.
     * @returns true if the SaveManager is configured at the end; else false.
     */
    async configureFromToken() {
        const token = getAuthToken();
        if (!token) {
            // if there is no token, make sure the save manager is not configured.
            this.player = null;
            this.saves = [];
            this.configured = false;
            return this.configured;
        }

        // there is a token!
        // fetch the player, and save it to the player field.
        const pf = await PlayerFetch.fetchPlayerByToken();
        switch (pf.status) {
            case 200:
                // success!
                // save the player to the SaveManager.
                this.player = pf.info;
                break;
            default:
                // some sort of failure!
                this.configured = false;
                return this.configured;
        }

        // We've found the player! Now, let's find their save files!
        const sf = await SaveFetch.fetchSavesByToken();
        switch (sf.status) {
            case 200 | 404: // found saves or there are no saves.
                this.sm.saves = sf.info;
                break;
            default:
                // some sort of failure.
                this.configured = false;
                return this.configured;
        }

        // if we reached this point, both the player and saves are configured
        // correctly.
        this.configured = true;
        return this.configured;
    }

    update() {}

    draw() {
        CTX.fillColor = PauseMenu.BG_COLOR;
        this.screen.draw();
    }
}
