class SaveManager {
    constructor() {
        this.token = localStorage.getItem('player-auth-token');
        if (this.token) {
            this.configure();
        }
    }

    async configure() {
        if (!this.token) return false;
        this.player = await fetch('http://goodbadchad.bigdevdog.com/player');
    }
}

const drawSaveManager = () => {
    const sm = document.querySelector('#save-manager');

    const token = localStorage.getItem('player-auth-token');

    if (!token) {
        // Draw a login screen!
        const loginScreen = document.createElement('div');
        loginScreen.innerHTML = `
            <div class="fg">
                <h4>username:</h4>
                <input type="text" id="un-field" />
            </div>
            <div class="fg">
                <h4>password:</h4>
                <input type="password" id="pw-field" />
            </div>
            <button id="login-btn">Log in</button>
            <span id="login-fb"></span>
        `;

        sm.appendChild(loginScreen);

        document.querySelector('#login-btn').addEventListener('click', () => {
            attemptLogin();
        });
    }
};

drawSaveManager();
