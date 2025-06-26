/** The route to the web service. */
const API_HOST = config.apiHost;

/** The header defining Content-Type. */
const CT_HEADER = { 'Content-Type': 'application/json' };

/** Defines the headers Content-Type and Authorization (the latter based on the token in localStorage.) */
const authHeaders = () => {
  const token = SaveManager.getAuthToken();
  if (!token) throw new Error('Cannot do this while not logged in!');
  return {
    ...CT_HEADER,
    Authorization: `BEARER ${token}`
  };
};

/** A static class containing functions to easily make the HTTP requests having to do with saving. */
class SaveFetch {
  constructor() {
    throw new Error('This is a static class!');
  }

  static get ROUTE() {
    return `${API_HOST}/save`;
  }

  /**
   * Create a new save in the database.
   * @param {Chad} chad CHAD, at the point of save.
   * @param {Inventory} inventory INVENTORY, at the point of save.
   * @param {object} story STORY, at the point of save.
   * @param {Zone} zone ZONE, at the point of save.
   * @returns {object} { status: `<response status>`, info: `<response body>` }
   */
  static async createNewSave() {
    // remove statusEffect for circular reference problems (JSON.stringify)
    const { statusEffect } = CHAD;
    delete CHAD.statusEffect;
    // attempt to make the save.
    const response = await fetch(SaveFetch.ROUTE, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        chad: CHAD,
        inventory: INVENTORY,
        story: STORY,
        zone: ZONE
      })
    });
    // replace the statusEffect, to remove any bugs.
    CHAD.statusEffect = statusEffect;
    const info = await response.json();
    return { status: response.status, info: info };
  }

  static async deleteOneSaveById(saveId) {
    const response = await fetch(`${SaveFetch.ROUTE}/${saveId}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    const info = await response.json();
    return { status: response.status, info: info };
  }

  /**
   * Fetches a single, entire save file, so long as the player is logged in
   * (there is a token in either localStorage or sessionStorage) and the
   * `save_id` can be found belonging to said player.
   * @param {string} saveId The `save_id` of the save to be fetched.
   * @returns {object} { status: `<response status>`, info: `<response body>` }
   */
  static async fetchOneSaveById(saveId) {
    const response = await fetch(`${SaveFetch.ROUTE}/${saveId}`, {
      headers: authHeaders()
    });
    const info = await response.json();
    return { status: response.status, info: info };
  }

  /**
   * Fetches all _partial_ save files belonging to the player, so long as the
   * player is logged in (there is a token in either localStorage or
   * sessionStorage).
   *
   * @returns {object} { status: `<response status>`, info: `<response body>` }
   */
  static async fetchSavesByToken() {
    const response = await fetch(SaveFetch.ROUTE, {
      headers: authHeaders()
    });
    const info = await response.json();
    return { status: response.status, info: info };
  }
}

/** A static class containing functions to easily make the HTTP requests having to do with player accounts. */
class PlayerFetch {
  constructor() {
    throw new Error('This is a static class!');
  }

  static get ROUTE() {
    return `${API_HOST}/player`;
  }

  /**
   * Authenticates the login credentials of a player, returning a JWT upon success
   * which can be used as authentication for other functions.
   * @param {string} username The username (or email) of the player to be authenticated.
   * @param {string} password The password of the player to be authenticated.
   * @returns {object} { status: `<response status>`, info: `<response body>` }
   */
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

  /**
   *
   * @param {string} username The username of the new player account (should be unique).
   * @param {string} password The password of the new player account.
   * @param {string|undefined} email The email address of the new player account.
   * @returns {object} { status: `<response status>`, info: `<response body>` }
   */
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

  /**
   * Fetch a list of all players (only safe information).
   * @returns {object} { status: `<response status>`, info: `<response body>` }
   */
  static async fetchAllPlayers() {
    const response = await fetch(`${PlayerFetch.ROUTE}/all`);
    const info = await response.json();
    return { status: response.status, info: info };
  }

  /**
   * Fetch a single player object (only the safe information) from the database
   * once they are logged in (the token is saved in localStorage or
   * sessionStorage).
   * @returns {object} { status: `<response status>`, info: `<response body>` }
   */
  static async fetchPlayerByToken() {
    const response = await fetch(PlayerFetch.ROUTE, {
      headers: authHeaders()
    });
    const info = await response.json();
    return { status: response.status, info: info };
  }
}
