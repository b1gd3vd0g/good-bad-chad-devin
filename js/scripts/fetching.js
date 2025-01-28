const API_HOST = 'http://goodbadchad.bigdevdog.com:6900';

const CT_HEADER = { 'Content-Type': 'application/json' };

const authHeaders = () => {
    const token = localStorage.getItem('player-auth-token') ?? '';
    return {
        ...CT_HEADER,
        Authorization: `BEARER ${token}`
    };
};

class SaveFetch {
    constructor() {
        throw new Error('This is a static class!');
    }

    static get ROUTE() {
        return `${API_HOST}/save`;
    }

    static async createNewSave(chad, inventory, story, zone) {
        const response = await fetch(SaveFetch.ROUTE, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({
                chad,
                inventory,
                story,
                zone
            })
        });
        const info = await response.json();
        return { status: response.status, info: info };
    }

    static async fetchOneSaveById(saveId) {
        const response = await fetch(`${SaveFetch.ROUTE}/${saveId}`, {
            headers: authHeaders()
        });
        const info = await response.json();
        return { status: response.status, info: info };
    }

    static async fetchSavesByToken() {
        const response = await fetch(SaveFetch.ROUTE, {
            headers: authHeaders()
        });
        const info = await response.json();
        return { status: response.status, info: info };
    }
}

class PlayerFetch {
    constructor() {
        throw new Error('This is a static class!');
    }

    static get ROUTE() {
        return `${API_HOST}/player`;
    }

    static async authenticatePlayerLogin(username, password) {
        const response = await fetch(`${PlayerFetch.ROUTE}/login`, {
            method: 'POST',
            headers: CT_HEADER,
            body: JSON.stringify({
                username,
                password
            })
        });
        const info = await response.json();
        return { status: response.status, info: info };
    }

    static async createNewPlayer(username, password, email) {
        const response = await fetch(PlayerFetch.ROUTE, {
            method: 'POST',
            headers: CT_HEADER,
            body: JSON.stringify({
                username,
                password,
                email
            })
        });
        const info = await response.json();
        return { status: response.status, info: info };
    }

    static async fetchAllPlayers() {
        const response = await fetch(`${PlayerFetch.ROUTE}/all`);
        const info = await response.json();
        return { status: response.status, info: info };
    }

    static async fetchPlayerByToken() {
        const response = await fetch(PlayerFetch.ROUTE, {
            headers: authHeaders()
        });
        const info = await response.json();
        return { status: response.status, info: info };
    }
}
