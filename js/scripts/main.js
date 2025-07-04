/** @author Devin Peevy */

// (1) Declare constants shared by all other classes and scripts:

/** The GameEngine overseeing the update-render loop and containing all entities. */
const GAME = new GameEngine();
/** The AssetManager which contains all images and music. */
const ASSET_MGR = new AssetManager();
/** The html element on which we are drawing. */
const CANVAS = document.getElementById('game-world');
/** The tool we use to draw on CANVAS. */
const CTX = CANVAS.getContext('2d');
/** Tells the canvas what portion of the game world to draw. */
const CAMERA = new Camera();
/** Our Hero! Centered in Camera. */
const CHAD = new Chad(new Vector(0, 0));
/** The inventory of the player. */
const INVENTORY = new Inventory();
/** The Save Manager, which keeps track of a player's personal info and saves, if they're logged in. */
const SAVE_MGR = new SaveManager();
/** The player's HUD. */
const HUD = new Hud();

// (2) Minor details:

// Game looks bad if we try to smooth. Hard lines = good.
CTX.imageSmoothingEnabled = false;

/*
DEBUG MODE: draws a grid on the screen and labels every block which has x, y % 5 === 0.
*/
const debugButton = document.getElementById('debug');
debugButton.addEventListener('click', () => {
  if (debugButton.checked) {
    GAME.debug = true;
  } else {
    GAME.debug = false;
  }
});

// If specials keys are pressed, prevent their default action.
document.addEventListener('keydown', (key) => {
  if (key.altKey || key.ctrlKey || key.metaKey) {
    key.preventDefault();
  }
});

// 1ST APPROACH:
// If the window loses focus, pause the game.
CANVAS.onblur = () => {
  HUD.swapToPointer();
  GAME.running = false;
  ASSET_MGR.stopAllSFX();
  ASSET_MGR.playSFX(SFX.UI_HIGH_BEEP.path, SFX.UI_HIGH_BEEP.volume);
  ASSET_MGR.pauseMusic();
};
// If the window regains focus, unpause the game.
CANVAS.onfocus = () => {
  HUD.swapToCrosshair();
  GAME.running = true;
  ASSET_MGR.playSFX(SFX.UI_HIGH_BEEP.path, SFX.UI_HIGH_BEEP.volume);
  ASSET_MGR.resumeMusic();
};

// Set up the screenshot listeners.
let allowScreenshot = true;
CANVAS.onkeydown = (evt) => {
  if (evt.code === 'Backquote') {
    allowScreenshot = false;
    takeCanvasScreenshot();
  }
};
CANVAS.onkeyup = (evt) => {
  if (evt.code === 'Backquote') allowScreenshow = true;
};

// 2ND APPROACH:
// If the window loses focus, refocus the window
// CANVAS.onblur = () => {
// 	CANVAS.focus();
// };

// (3) Set the current ZONE to be the first one we encounter - village.main.

let ZONE = Zone.getZones().village.main;
let LAST_ZONE = null;
let SAVED_ZONE = Zone.getZones().village.main;
// Load all assets, add all entities, place CHAD...
ZONE.load();

const STORY = {};

// (4) Start the game! :)
GAME.addEntity(new StartMenu(), 1);
GAME.start();
