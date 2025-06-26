/**
 * The LoginScreen contains all the `entities` needing to be drawn on the menu
 * to enable the player to log in to an account which already exists.
 */
class LoginScreen {
  /** Constructs a new LoginScreen. */
  constructor() {
    /**
     * An array of tuples [event type, function] defining the listener functions
     * of this particular screen.
     */
    this.listeners = [];
    /** The username field. */
    this.un = new TextInputField('username', this, 50);
    /** The password field. */
    this.pw = new TextInputField('password', this, 150, true);
    /** The `Keep Me Signed In` checkbox. */
    this.kmsi = new KeepMeSignedIn(this, 275);
    /** The login button. */
    this.loginButton = new LoginButton(this, 400);
    /** The account creation button. */
    this.createButton = new CreateAccountButton(this, 500);
    /** The feedback (from failing/succeeding a login.) */
    this.feedback = new Feedback(625);
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
   * This is called when the login screen is destroyed. Its only purpose is to
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

  /**
   * Attempts to login based on the values in each of its fields.
   * Upon success, sets the auth token and reconfigures the
   * save manager.
   */
  async attemptLogin() {
    // attempt login with username and password.
    const result = await PlayerFetch.authenticatePlayerLogin(
      this.un.value,
      this.pw.value
    );
    // do stuff based on the status of logging in.
    switch (result.status) {
      case 200:
        // login was a success!
        // show feedback to the user.
        this.feedback.setFb('Login authenticated', 1);
        // decide where token will be stored based on player preference
        // (Keep Me Signed In box)
        const local = this.kmsi.selected;
        // save the auth token to local-/session- Storage
        SaveManager.setPlayerAuthToken(result.info.token, local);
        // reconfigure the save manager.
        SAVE_MGR.configureFromToken();
        break;
      default:
        // login failed!
        // Make sure there is no sort of auth token (unlikely).
        SaveManager.clearPlayerAuthToken();
        // Show feedback to the user.
        this.feedback.setFb('Authentication failed.', -1);
    }
  }

  async attemptAccountCreation() {
    const result = await PlayerFetch.createNewPlayer(
      this.un.value,
      this.pw.value
    );
    switch (result.status) {
      case 201:
        // account was created!!
        this.feedback.setFb('Account created', 1);
        // now, we wanna just sign in the player.
        await this.attemptLogin();
        break;
      default:
        this.feedback.setFb('Account creation failed', -1);
        // There is more work that needs to be done server side to make
        // more effective feedback visible to any player. However, we'll
        // log the error so developers can check it.
        console.error(result);
    }
  }

  /** Draw the login screen. */
  draw() {
    // draw the background
    CTX.fillStyle = PauseMenu.BG_COLOR;
    CTX.fillRect(PauseMenu.START.x, PauseMenu.START.y, PauseMenu.WIDTH, 600);
    // draw each individual component.
    this.un.draw();
    this.pw.draw();
    this.kmsi.draw();
    this.loginButton.draw();
    this.createButton.draw();
    this.feedback.draw();
  }
}

/**
 * A TextInputField is a custom field for text information to be input from the
 * user.
 * For now, these are limited in capability to only display well short labels
 * and fields on a single line, such as for use on Login and Create Account
 * screens.
 */
class TextInputField {
  /**
   * Construct a new TextInputField.
   * @param {string} label Label to convey the purpose of the field.
   * @param {LoginScreen} screen The screen that this is associated with.
   * @param {number} startY The starting y value (of the PauseMenu, not the CANVAS) for the field.
   * @param {boolean} pw If it is true, only '*' characters will be displayed to the player.
   */
  constructor(label, screen, startY, pw = false) {
    // 1. SET FIELDS

    /** The screen that this field is associated with (for listener purposes). */
    this.screen = screen;
    /** {string} The label for the field. */
    this.label = label.charAt(0).toUpperCase() + label.slice(1) + ':';
    /** {boolean} true if this is the currently selected input field. */
    this.active = false;
    /** The text value stored in the field. */
    this.value = '';
    /** The position of this field on the canvas. */
    this.pos = new Vector(PauseMenu.START.x + 50, PauseMenu.START.y + startY);
    /** The size of this field on the canvas. */
    this.size = new Vector(PauseMenu.WIDTH - 100, 75);
    /** true if this field should hide value from players (like passwords). */
    this.pw = pw;
    /** The TrashCan which will clear this field (because backspace won't work). */
    this.trash = new ClearFieldTrashCan(this);

    // 2. SET LISTENERS

    // 2a. on click

    /** Sets this field active, if it is clicked on. */
    const clickListener = () => {
      // return if the save manager is not listening.
      if (!SAVE_MGR.listening) return;
      console.log('did not return');
      // was this field clicked?
      const clicked = mouseOver(this);

      if (clicked) {
        // if it was, set the field active.
        this.active = true;
      } else {
        // if it was not, the player clicked elsewhere.
        // the field should no longer be active.
        this.active = false;
      }
    };
    this.screen.addListener('click', clickListener);

    // 2b. on keypress.

    /**
     * Listens to keypresses (when this field is active) and adds them
     * to the field. This function could likely be greatly improved, if one
     * could figure out how to read backspace events properly, and if tab could
     * switch the currently active tab; but it is functional for now.
     *
     * @param {Event} evt The event which caused this listener.
     */
    const kpListener = (evt) => {
      // ignore anything if the save manager is not listening, or if the
      // field is not active.
      if (!SAVE_MGR.listening || !this.active) return;

      // The save manager is listening, and the field is active.
      if (evt.key === 'Enter') {
        // ignore the enter key!
        // may be a good idea to try signing in too,
        // but not for right now.
      } else {
        // add the key to the field value!
        this.value += evt.key;
      }
    };
    this.screen.addListener('keypress', kpListener);
  }

  /** @returns {vector} The size of the label portion of the TextInputField. */
  static get LABEL_SIZE() {
    return new Vector((PauseMenu.WIDTH - 100) * (2 / 5) - 50, 75);
  }

  /** @returns {vector} The size of the field portion of the TextInputField. */
  static get FIELD_SIZE() {
    return new Vector((PauseMenu.WIDTH - 100) * (3 / 5) - 50, 75);
  }

  /** Draw the TextInputField on the canvas. */
  draw() {
    // 1. Draw the label on the left.
    CTX.font = FONT.VT323_HEADER;
    CTX.fillStyle = 'rgb(255,255,255)';
    CTX.fillText(
      this.label,
      this.pos.x,
      this.pos.y + this.size.y,
      TextInputField.LABEL_SIZE.x
    );
    // 2. draw the actual input field portion on the right.
    if (this.active) {
      CTX.strokeStyle = 'rgb(255,255,255)';
    } else {
      CTX.strokeStyle = 'rgba(255,255,255,0.3)';
    }
    CTX.lineWidth = 5;
    CTX.strokeRect(
      this.pos.x + TextInputField.LABEL_SIZE.x,
      this.pos.y,
      TextInputField.FIELD_SIZE.x,
      this.size.y
    );
    // 3. draw the value in the box.
    const text = this.pw ? '*'.repeat(this.value.length) : this.value;
    CTX.fillText(
      text,
      this.pos.x + TextInputField.LABEL_SIZE.x + 20,
      this.pos.y + 55,
      TextInputField.FIELD_SIZE.x
    );
    // 4. draw the trash can.
    this.trash.draw();
  }
}

/** A ClearFieldTrashCan is a simple class that clears a fiel*/
class ClearFieldTrashCan {
  /**
   * @param {TextInputField} field The field which this trash can is set to delete.
   */
  constructor(field) {
    // 1. SET FIELDS

    /** The position of this trash can on the canvas. */
    this.pos = new Vector(
      PauseMenu.START.x + PauseMenu.WIDTH - 100,
      field.pos.y
    );
    /** The size of this trash can. */
    this.size = new Vector(75, 75);

    // 2. SET LISTENER

    const listener = () => {
      if (!SAVE_MGR.listening) return;
      const clicked = mouseOver(this);
      if (clicked) {
        field.value = '';
      }
    };

    field.screen.addListener('click', listener);
  }

  /** The location of the spritesheet for the ClearFieldTrashCan. */
  static get SPRITESHEET() {
    return './sprites/trash.png';
  }

  /**
   * Draws the ClearFieldTrashCan on the canvas.
   */
  draw() {
    CTX.drawImage(
      ASSET_MGR.getAsset(ClearFieldTrashCan.SPRITESHEET),
      this.pos.x,
      this.pos.y,
      this.size.x,
      this.size.y
    );
  }
}

/**
 * A KeepMeSignedIn button is a checkbox class which can be used to empower the
 * player to stay signed in for up to 30 days (by saving the auth token to
 * localStorage), as opposed to staying signed in only until the browser session
 * ends (by saving the auth token to sessionStorage).
 */
class KeepMeSignedIn {
  /**
   * Constructs a new KeepMeSignedIn button.
   * @param {LoginScreen} screen The screen this is associated with.
   * @param {number} startY The starting y coordinate of this field.
   */
  constructor(screen, startY) {
    // 1. SET FIELDS

    /** The screen this is associated with. */
    this.screen = screen;
    /** Is the box selected? */
    this.selected = false;
    /** The position of this box on the canvas. */
    this.pos = new Vector(PauseMenu.START.x + 50, PauseMenu.START.y + startY);
    /** The size of this field on the canvas. */
    this.size = new Vector(PauseMenu.WIDTH - 100, 75);

    // 2. SET LISTENER

    /** Toggles the selected boolean of this field. */
    const listener = () => {
      if (!SAVE_MGR.listening) return;
      const clicked = mouseOver(this);
      if (clicked) {
        this.selected = !this.selected;
      }
    };

    this.screen.addListener('click', listener);
  }

  /** Draw the KeepMeSignedIn box on the canvas. */
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

/**
 * The LoginButton does not contain any specific information itself, but it
 * does draw itself on the canvas, and respond to being clicked by making the
 * HTTP request attempting to get an authentication token, and handling the
 * consequences of said response.
 */
class LoginButton {
  /**
   * Construct a new LoginButton.
   * @param {LoginScreen} screen The screen this is associated with.
   * @param {number} startY The starting y coordinate (on the PauseMenu) to
   * draw the button at.
   */
  constructor(screen, startY) {
    /** The screen that this is associated with. */
    this.screen = screen;
    /** The size of this button. */
    this.size = new Vector((PauseMenu.WIDTH * 2) / 5, 75);
    /** The position of this button on the canvas. */
    this.pos = new Vector(
      PauseMenu.START.x + (PauseMenu.WIDTH - this.size.x) / 2,
      PauseMenu.START.y + startY
    );

    // Call the LoginScreen's `attemptLogin` function when the button is clicked.
    const listener = () => {
      if (!SAVE_MGR.listening) return;
      const clicked = mouseOver(this);
      if (clicked) {
        this.screen.attemptLogin();
      }
    };

    this.screen.addListener('click', listener);
  }

  /** Draw the LoginButton on the canvas. */
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

class CreateAccountButton {
  constructor(screen, startY) {
    /** The screen that this is associated with. */
    this.screen = screen;
    /** The size of this button. */
    this.size = new Vector((PauseMenu.WIDTH * 2) / 5, 75);
    /** The position of this button on the canvas. */
    this.pos = new Vector(
      PauseMenu.START.x + (PauseMenu.WIDTH - this.size.x) / 2,
      PauseMenu.START.y + startY
    );

    // Call the LoginScreen's `attemptAccountCreation` function
    const listener = () => {
      if (!SAVE_MGR.listening) return;
      const clicked = mouseOver(this);
      if (clicked) {
        this.screen.attemptAccountCreation();
      }
    };

    this.screen.addListener('click', listener);
  }

  draw() {
    CTX.fillStyle = 'rgba(255,255,255,0.2)';
    CTX.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    CTX.strokeStyle = 'rgb(255,255,255)';
    CTX.lineWidth = 5;
    CTX.strokeRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    CTX.fillStyle = 'rgb(255,255,255)';
    CTX.font = FONT.VT323_NORMAL;
    const create = 'CREATE ACCOUNT';
    const textSize = CTX.measureText(create);
    CTX.fillText(
      create,
      this.pos.x + (this.size.x - textSize.width) / 2,
      this.pos.y + 46,
      this.size.x
    );
  }
}

/**
 * Feedback presents Feedback to the player based on the success status of an
 * attempted login.
 */
class Feedback {
  /**
   * Construct a new Feedback.
   * @param {number} startY The starting y coordinate of the feedback, relative to PauseMenu.
   */
  constructor(startY) {
    /** The feedback string to be presented. */
    this.fb = '';
    /** The starting y coordinate of this feedback. */
    this.startY = PauseMenu.START.y + startY;
    /** The mood of this feedback. Less than 0 for negative (red) feedback; greater than 0 for positive (green) feedback; else neutral (white).  */
    this.mood = 0;
  }

  /**
   * Sets the feedback and mood of this Feedback.
   * @param {string} fb The feedback string to be presented to the player.
   * @param {number} mood less than 0 for negative feedback (red); greater than 0 for positive feedback (green); else neutral (white).
   */
  setFb(fb, mood = 0) {
    this.fb = fb;
    this.mood = mood;
  }

  /** Draw the feedback on the screen for the player, IF it is not empty. */
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
      this.startY
    );
  }
}
