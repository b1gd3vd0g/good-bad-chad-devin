/**
 * @author ?? (modified) Caleb Krauter
 */
/** Creates an alias for requestAnimationFrame for backwards compatibility. */
window.requestAnimFrame = (() => {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        /**
         * Compatibility for requesting animation frames in older browsers
         * @param {Function} callback Function
         * @param {DOM} element DOM ELEMENT
         */
        ((callback, element) => {
            window.setTimeout(callback, 1000 / 60);
        })
    );
})();

/* This fixes the bug where the window scrolls down when you press space. */
window.onkeydown = (e) => {
    return e.code !== 'Space';
};

/** An object containing all the relevant colors we are using in this project. */
const COLORS = {
    // backgrounds
    SEA_FOAM_GREEN: '#a0d6b4',
    SKY_BLUE: '#5da6b3',
    SKY_DARK: '#235654',
    SKY_DARK_BLUE: '#181552',
    SKY_SNOW_GREY: '#91B3B2',
    SKY_GREY: '#73908F',
    SKY_HOT_SKY: '#59979c',
    LIGHT_BLUE: '#add8e6',
    DARK_CAVE_PURPLE: '#131339',

    // misc
    WHITE: '#ffffff',
    BLACK: '#000000',
    RED: '#ff0000',
    GREEN: '#00ff00',
    LIGHT_GREEN: '#90ee90',
    DARK_GREEN: '#006400',
    IVY_GREEN: '#789d5e',
    BLUE: '#0000ff',
    WATER_BLUE: '#57b2ec',
    YELLOW: '#ffff00',
    GOLD: '#ffd700',
    PURPLE: '#800080',
    LIGHT_PURPLE: '#b582db',
    ORANGE: '#ffa500',
    PINK: '#ffc0cb',
    BROWN: '#8b4513',
    LIGHT_BROWN: '#d2b48c',
    GRAY: '#808080',
    LIGHT_GRAY: '#d3d3d3'
};

/** This is going to be set for each zone. A rectangle drawn over the whole canvas, first thing. */
let BG_COLOR = null;

// Physics utlities

/**
 * Physics constants
 *
 * --Units--
 * Velocity: pixels/second
 * Acceleration: pixels/second^2
 */
const PHYSICS = {
    GRAVITY_ACC: 1200,
    TERMINAL_VELOCITY: 700,
    FRICTION: 0.8
};

/** Declares constants for CTX.font. */
const FONT = {
    VT323_HEADER: '50px vt323',
    VT323_NORMAL: '34px vt323'
};

/**
 * The game's sound effects.
 */
const SFX = {
    // Player
    JUMP1: { path: './sfx/jump2 caleb.mp3', volume: 0.2 },
    JUMP2: { path: './sfx/jump1 caleb.mp3', volume: 0.2 },
    LAND: { path: './sfx/land.mp3', volume: 0.2 },
    SLINGSHOT_LAUNCH1: { path: './sfx/launch1.mp3', volume: 0.5 },
    SLINGSHOT_LAUNCH2: { path: './sfx/launch2.mp3', volume: 0.6 },
    SLINGSHOT_LAUNCH3: { path: './sfx/launch3.mp3', volume: 0.5 },
    SLINGSHOT_LAUNCH4: { path: './sfx/launch4.mp3', volume: 0.5 },
    SLINGSHOT_STRETCH: { path: './sfx/slingshot_stretch.mp3', volume: 0.4 },
    SWORD_SWING1: { path: './sfx/sword_swing1.mp3', volume: 0.2 },
    SWORD_SWING2: { path: './sfx/sword_swing2.mp3', volume: 0.2 },
    SWORD_SWING3: { path: './sfx/sword_swing3.mp3', volume: 0.2 },
    SWORD_SWING4: { path: './sfx/sword_swing4.mp3', volume: 0.2 },
    SWORD_SWING5: { path: './sfx/sword_swing5.mp3', volume: 0.2 },
    SWORD_SWING6: { path: './sfx/sword_swing6.mp3', volume: 0.2 },
    SWORD_SWING7: { path: './sfx/sword_swing7.mp3', volume: 0.2 },
    SWORD_SWING8: { path: './sfx/sword_swing8.mp3', volume: 0.2 },
    SWORD_SWING9: { path: './sfx/sword_swing9.mp3', volume: 0.2 },
    SWORD_SWING10: { path: './sfx/sword_swing10.mp3', volume: 0.2 },
    SWORD_HIT1: { path: './sfx/sword_hit1.mp3', volume: 0.1 },
    SWORD_HIT2: { path: './sfx/sword_hit2.mp3', volume: 0.1 },
    SWORD_HIT3: { path: './sfx/sword_hit3.mp3', volume: 0.1 },
    SWOOSH: { path: './sfx/swoosh.mp3', volume: 0.4 },
    ITEM_EQUIP: { path: './sfx/item_equip.mp3', volume: 0.4 },
    ITEM_COLLECT1: { path: './sfx/item_collect1.mp3', volume: 0.4 },
    ITEM_COLLECT2: { path: './sfx/item_collect2.mp3', volume: 0.4 },
    ITEM_COLLECT3: { path: './sfx/item_collect3.mp3', volume: 0.4 },
    FOOD_EAT1: { path: './sfx/food_eat1.mp3', volume: 0.4 },
    FOOD_EAT2: { path: './sfx/food_eat2.mp3', volume: 0.4 },
    FOOD_EAT3: { path: './sfx/food_eat3.mp3', volume: 0.4 },
    FOOD_EAT4: { path: './sfx/food_eat4.mp3', volume: 0.4 },
    AMMO_COLLECT: { path: './sfx/ammo_collect.mp3', volume: 0.4 },
    COIN_COLLECT: { path: './sfx/rune_collect.mp3', volume: 0.7 },
    MEGA_MUSHROOM: { path: './sfx/mega_mushroom.mp3', volume: 0.4 },
    WATER_BALLOON: { path: './sfx/water_balloon.wav', volume: 0.4 },
    LIFE_UP: { path: './sfx/life_up.wav', volume: 0.4 },
    SWORD_UPGRADE: { path: './sfx/sword_upgrade.mp3', volume: 0.4 },
    REVIVE: { path: './sfx/revive.wav', volume: 0.2 },

    HMM1: { path: './sfx/npc_hmm1.mp3', volume: 0.4 },
    HMM2: { path: './sfx/npc_hmm2.mp3', volume: 0.4 },

    // UI
    UI_HIGH_BEEP: { path: './sfx/ui_high_beep.mp3', volume: 0.4 },
    UI_SCIFI: { path: './sfx/ui_scifi.mp3', volume: 0.4 },
    UI_SNAP: { path: './sfx/ui_snap.mp3', volume: 0.4 },
    UI_GAMEBOY_BEEP: { path: './sfx/ui_gameboy_beep.mp3', volume: 0.4 },

    // Environment
    EXPLOSION_SMALL: { path: './sfx/explosion_small.mp3', volume: 0.4 },
    EXPLOSION_BIG: { path: './sfx/explosion_big.mp3', volume: 0.4 },
    RICOCHET1: { path: './sfx/ricochet1.mp3', volume: 0.4 },
    RICOCHET2: { path: './sfx/ricochet2.mp3', volume: 0.4 },
    RICOCHET3: { path: './sfx/ricochet3.mp3', volume: 0.4 },
    RICOCHET4: { path: './sfx/ricochet4.mp3', volume: 0.4 },
    GAME_OVER: { path: './sfx/game_over.wav', volume: 0.4 },
    DING: { path: './sfx/ding.mp3', volume: 0.4 },
    SNOW_CRUNCH1: { path: './sfx/snow_crunch1.mp3', volume: 0.4 },
    SNOW_CRUNCH2: { path: './sfx/snow_crunch2.mp3', volume: 0.4 },
    SLIME_SPLAT: { path: './sfx/slime_splat.mp3', volume: 0.4 },
    PORTAL_ACTIVATE: { path: './sfx/portal_activate.mp3', volume: 0.4 },
    PORTAL_IDLE: { path: './sfx/portal_idle.mp3', volume: 0.15 },

    // Enemies
    GROWL1: { path: './sfx/growl1.mp3', volume: 0.2 },
    GROWL2: { path: './sfx/growl2.mp3', volume: 0.2 },
    SMASH1: { path: './sfx/smash1.mp3', volume: 0.4 },
    SMASH2: { path: './sfx/smash2.mp3', volume: 0.4 },
    SMASH3: { path: './sfx/smash3.mp3', volume: 0.4 },
    BLEH: { path: './sfx/bleh.mp3', volume: 0.3 },
    ROBOT_DEATH1: { path: './sfx/robot_death1.mp3', volume: 0.4 },
    ROBOT_DEATH2: { path: './sfx/robot_death2.mp3', volume: 0.4 },
    ROBOT_DEATH3: { path: './sfx/robot_death3.mp3', volume: 0.4 },
    ROBOT_DEATH_LONG: { path: './sfx/robot_death_LONG.mp3', volume: 0.4 },
    DRILL1: { path: './sfx/drill1.mp3', volume: 0.4 },
    DRILL2: { path: './sfx/drill2.mp3', volume: 0.4 },
    LASER_FIRE: { path: './sfx/laser_fire.wav', volume: 0.4 },
    SONIC_WAVE: { path: './sfx/sonic_wave.mp3', volume: 0.4 },
    MISSILE_LAUNCH: { path: './sfx/missile_launch.mp3', volume: 0.4 },
    SNAKE_HISS: { path: './sfx/snake_hiss.mp3', volume: 0.4 },
    SLIME_ATTACK: { path: './sfx/slime_attack.mp3', volume: 0.4 },

    EVIL_LAUGH: { path: './sfx/evil_laugh.mp3', volume: 0.4 }
};

/**
 * The game's music. Any music that contains "_sample" at the end is a placeholder.
 */
const MUSIC = {
    // Misc.
    PEACEFUL_CHIPTUNE: { path: './music/peaceful_chiptune.mp3', volume: 0.06 }, // testing music
    HIGH_ENERGY: { path: './music/high_energy_sample.wav', volume: 0.1 },
    VICTORY: { path: './music/victory_sample.wav', volume: 0.1 },
    UPBEAT_CHIPTUNE_2: { path: './music/upbeat_chiptune_2.mp3', volume: 0.1 },
    UPBEAT_CHIPTUNE_1: { path: './music/upbeat_chiptune_1.mp3', volume: 0.1 },

    // ambient
    RUSHING_WATER: { path: './music/rushing_water.mp3', volume: 0.1 },

    // Chad's themes
    CHAD_PLAYFUL_ADVENTURE: {
        path: './music/chad_playful_adventure2.mp3',
        volume: 0.15
    },
    CHAD_VICTORIOUS_EMOTIONAL: {
        path: './music/chad_victorious_emotional.mp3',
        volume: 0.15
    },

    // Village themes
    VILLAGE_TOWN_SQUARE: {
        path: './music/village_town_square_sample.wav',
        volume: 0.1
    },
    VILLAGE_SIMPLE_LIFE: {
        path: './music/village_simple_life.mp3',
        volume: 0.1
    },

    // Forest themes
    FOREST_BOSS: { path: './music/forest_boss.mp3', volume: 0.1 },
    // FOREST_NORMAL: {path: "./music/forest_normal.mp3", volume: 0.1},

    // River themes
    RIVER_BOSS: { path: './music/river_boss.mp3', volume: 0.2 },

    // Factory themes
    FACTORY_BOSS: { path: './music/factory_boss_sample.wav', volume: 0.1 },
    // FACTORY_NORMAL: {path: "./music/factory_normal.mp3", volume: 0.1},

    // Mountain themes
    MOUNTAIN_MYSTERIOUS: {
        path: './music/mountain_mysterious.mp3',
        volume: 0.1
    },
    // MOUNTAIN_NORMAL: {path: "./music/mountain_normal.mp3", volume: 0.1}, // will be more peaceful, might contain an irish harp and flutes, and ice tinkling sfx

    // Lava themes
    LAVA_NORMAL: { path: './music/lava_normal.mp3', volume: 0.1 },
    LAVA_UNDERGROUND: { path: './music/lava_underground.mp3', volume: 0.1 },
    LAVA_TENSE: { path: './music/lava_tense.mp3', volume: 0.1 }, // might be timed task OR boss music

    // END theme
    END: { path: 'music/caleb_music/Thunder1.mp3', volume: 0.1 },
    VILLAGE_ATTACK: {
        path: 'music/caleb_music/Intimidating1.mp3',
        volume: 0.1
    },
    ICE: { path: 'music/caleb_music/ICE.mp3', volume: 0.1 },
    ADVENTURE_SEARCH: {
        path: 'music/caleb_music/Cave Adventure.mp3',
        volume: 0.1
    }
};

/**
 * Gets an array of nearby entities from the midground.
 * The entities must have a bounding box.
 *
 * NOTE: I tried to optimize this as much as possible, but it still looks expensive with all the distance calculations.
 *
 * @param {Vector} centerPos the central position from which to check for entities
 * @param {number} range the radius of the circle to check for entities
 *
 * @returns An array of entities within the range of the provided position
 */
const getNearbyEntities = (centerPos, range) => {
    const nearbyEntities = [];
    GAME.entities.midground.forEach((entity) => {
        if (!entity.boundingBox) return;
        // find the distance between the entity's CLOSEST SIDE of its bounding box and the center of the circle
        const leftDist = Math.abs(entity.boundingBox.left - centerPos.x);
        const rightDist = Math.abs(entity.boundingBox.right - centerPos.x);
        const topDist = Math.abs(entity.boundingBox.top - centerPos.y);
        const bottomDist = Math.abs(entity.boundingBox.bottom - centerPos.y);
        const closestX =
            leftDist < rightDist
                ? entity.boundingBox.left
                : entity.boundingBox.right;
        const closestY =
            topDist < bottomDist
                ? entity.boundingBox.top
                : entity.boundingBox.bottom;
        const distToBB = Vector.distance(
            new Vector(closestX, closestY),
            centerPos
        );

        if (distToBB < range) {
            nearbyEntities.push(entity);
        }
    });

    // put chad in array if neccessary
    // find the distance between Chad's CLOSEST SIDE of his bounding box and the center of the circle
    const leftDist = Math.abs(CHAD.boundingBox.left - centerPos.x);
    const rightDist = Math.abs(CHAD.boundingBox.right - centerPos.x);
    const topDist = Math.abs(CHAD.boundingBox.top - centerPos.y);
    const bottomDist = Math.abs(CHAD.boundingBox.bottom - centerPos.y);
    const closestX =
        leftDist < rightDist ? CHAD.boundingBox.left : CHAD.boundingBox.right;
    const closestY =
        topDist < bottomDist ? CHAD.boundingBox.top : CHAD.boundingBox.bottom;
    const distToBB = Vector.distance(new Vector(closestX, closestY), centerPos);

    if (distToBB < range) {
        nearbyEntities.push(CHAD);
    }

    return nearbyEntities;
};

/**
 * Check if the provided entity is colliding with any blocks and correct its position if so.
 *
 * @param {Entity} entity the entity for which to check block collision
 * @param {Vector} entitySize the size of the entity
 * @returns {Object} an object indicating which side(s) of a block the entity collided with
 */
const checkBlockCollisions = (entity, entitySize) => {
    const collisions = {};
    // Have we collided with anything?
    GAME.entities.midground.forEach((otherEntity) => {
        // Does otherEntity even have a BB?
        if (otherEntity != entity && otherEntity.boundingBox) {
            // Are they even colliding?
            if (entity.boundingBox.collide(otherEntity.boundingBox)) {
                if (otherEntity instanceof Block) {
                    // Is there overlap with the block on the x or y-axes?
                    const isOverlapX =
                        entity.lastBoundingBox.left <
                            otherEntity.boundingBox.right &&
                        entity.lastBoundingBox.right >
                            otherEntity.boundingBox.left;
                    const isOverlapY =
                        entity.lastBoundingBox.bottom >
                            otherEntity.boundingBox.top &&
                        entity.lastBoundingBox.top <
                            otherEntity.boundingBox.bottom;

                    if (
                        isOverlapX &&
                        entity.lastBoundingBox.bottom <=
                            otherEntity.boundingBox.top &&
                        entity.boundingBox.bottom > otherEntity.boundingBox.top
                    ) {
                        // We are colliding with the top.

                        collisions.top = true;

                        // NOTE: entity.constructor returns an instance's class. There may be a better way to do this.
                        entity.pos = new Vector(
                            entity.pos.x,
                            otherEntity.boundingBox.top - entitySize.y
                        );
                        entity.yVelocity = 0;
                    } else if (
                        isOverlapY &&
                        entity.lastBoundingBox.right <=
                            otherEntity.boundingBox.left &&
                        entity.boundingBox.right > otherEntity.boundingBox.left
                    ) {
                        // We are colliding with the left side.

                        collisions.left = true;

                        entity.pos = new Vector(
                            otherEntity.boundingBox.left - entitySize.x,
                            entity.pos.y
                        );
                    } else if (
                        isOverlapY &&
                        entity.lastBoundingBox.left >=
                            otherEntity.boundingBox.right &&
                        entity.boundingBox.left < otherEntity.boundingBox.right
                    ) {
                        // We are colliding with the right side.

                        collisions.right = true;

                        entity.pos = new Vector(
                            otherEntity.boundingBox.right,
                            entity.pos.y
                        );
                    } else if (
                        isOverlapX &&
                        entity.lastBoundingBox.top >=
                            otherEntity.boundingBox.bottom &&
                        entity.boundingBox.top < otherEntity.boundingBox.bottom
                    ) {
                        // We are colliding with the bottom.

                        collisions.bottom = true;

                        entity.pos = new Vector(
                            entity.pos.x,
                            otherEntity.boundingBox.bottom
                        );
                    }
                }
            }
            // There's no collision - don't do anything!
        }
        // There's no bounding box, so who gives a shrek?
    });

    // Now that your position is actually figured out, draw your correct bounding box.
    entity.boundingBox = new BoundingBox(entity.pos, entitySize);

    return collisions;
};

// The following is necessary because we must change the listeners for different modes (right now, gameplay and dialog).
/** Contains all functions called as event handlers. */
let mickeyCount = 0;
const keyPressCountMax = 1;
let keyPressCounter = {
    M_KEY: 0,
    I_KEY: 0,
    C_KEY: 0,
    K_KEY: 0,
    E_KEY: 0,
    Y_KEY: 0
};
const EVENT_HANDLERS = {
    gameplayMouseDown: (mouse) => {
        // check if mouse button is left click
        if (mouse.button === 2) {
            GAME.user.jabbing = true;
        } else if (mouse.button === 0 && !CHAD.sword.isSlicing()) {
            GAME.user.aiming = true;
        }
    },
    gameplayMouseUp: (mouse) => {
        // check if mouse button is left click
        if (mouse.button === 2) {
            GAME.user.jabbing = false;
        } else if (mouse.button === 0 && !CHAD.sword.isSlicing()) {
            GAME.user.aiming = false;
            GAME.user.firing = true;
        }
    },
    gameplayMouseMove: (mouse) => {
        const rect = CANVAS.getBoundingClientRect();
        const scaleX = CANVAS.width / rect.width;
        const scaleY = CANVAS.height / rect.height;
        GAME.mousePos = new Vector(
            (mouse.clientX - rect.left) * scaleX,
            (mouse.clientY - rect.top) * scaleY
        );
    },

    gameplayKeyDown: (key) => {
        switch (key.code) {
            case 'KeyA':
                GAME.user.movingLeft = true;
                break;
            case 'KeyD':
                GAME.user.movingRight = true;
                break;
            case 'KeyS':
                GAME.user.movingDown = true;
                break;
            case 'KeyW':
                GAME.user.movingUp = true;
                GAME.user.interacting = true;
                break;
            case 'Space':
                GAME.user.jumping = true;
                break;
            case 'ShiftLeft':
                GAME.user.running = true;
                break;
            case 'KeyX':
            case 'AltLeft':
                GAME.user.dashing = true;
                break;
            case 'KeyQ':
                GAME.user.jabbing = true;
                break;
            case 'KeyR':
                GAME.user.cycleFood = true; // this should disable automatically after food is cycled
                break;
            case 'KeyF':
                GAME.user.eatFood = true; // this should disable automatically after food is eaten
                break;
            case 'Digit1':
            case 'Digit2':
            case 'Digit3':
            case 'Digit4':
            case 'Digit5':
            case 'Digit6':
            case 'Digit7':
                // case "Digit8":
                // case "Digit9":
                const index = key.code.slice(-1) - 1;
                if (!INVENTORY.ammoBag[index]) return; // make sure an ammo actually exists for this key
                INVENTORY.switchToAmmo(INVENTORY.ammoBag[index].type);
                break;
        }
    },
    doubleTap: (key) => {
        //TODO: implement double tap (stuff below is hacky and contains bugs)

        switch (key.code) {
            case 'KeyD':
                if (GAME.lastKeyTime.keyD < GameEngine.DOUBLE_TAP_THRESHOLD) {
                    GAME.user.dashing = true;
                }
                console.log(
                    'time since last D: ' +
                        Math.round(GAME.lastKeyTime.keyD) +
                        's'
                );
                GAME.lastKeyTime.keyD = 0;
                setTimeout(() => {
                    GAME.user.dashing = false;
                }, 1000);
                break;

            case 'KeyA':
                if (GAME.lastKeyTime.keyA < GameEngine.DOUBLE_TAP_THRESHOLD) {
                    GAME.user.dashing = true;
                }
                console.log(
                    'time since last A: ' +
                        Math.round(GAME.lastKeyTime.keyA) +
                        's'
                );
                GAME.lastKeyTime.keyA = 0;
                // set GAME.user.dashing back to false after a certain amount of time
                setTimeout(() => {
                    GAME.user.dashing = false;
                }, 1000);
                break;
        }
    },

    mickeyKeyPresses: (key) => {
        if (
            key.code === 'KeyM' &&
            mickeyCount < 1 &&
            keyPressCounter.M_KEY < keyPressCountMax
        ) {
            mickeyCount++;
            keyPressCounter.M_KEY++;
        } else if (
            key.code === 'KeyI' &&
            mickeyCount < 2 &&
            keyPressCounter.I_KEY < keyPressCountMax
        ) {
            mickeyCount++;
            keyPressCounter.I_KEY++;
        } else if (
            key.code === 'KeyC' &&
            mickeyCount < 3 &&
            keyPressCounter.C_KEY < keyPressCountMax
        ) {
            mickeyCount++;
            keyPressCounter.C_KEY++;
        } else if (
            key.code === 'KeyK' &&
            mickeyCount < 4 &&
            keyPressCounter.K_KEY < keyPressCountMax
        ) {
            mickeyCount++;
            keyPressCounter.K_KEY++;
        } else if (
            key.code === 'KeyE' &&
            mickeyCount < 5 &&
            keyPressCounter.E_KEY < keyPressCountMax
        ) {
            mickeyCount++;
            keyPressCounter.E_KEY++;
        } else if (
            key.code === 'KeyY' &&
            mickeyCount < 6 &&
            keyPressCounter.Y_KEY < keyPressCountMax
        ) {
            mickeyCount++;
            keyPressCounter.Y_KEY++;
        } else {
            mickeyCount = 0;
            keyPressCounter.M_KEY = 0;
            keyPressCounter.I_KEY = 0;
            keyPressCounter.C_KEY = 0;
            keyPressCounter.K_KEY = 0;
            keyPressCounter.E_KEY = 0;
            keyPressCounter.Y_KEY = 0;
        }
        console.log(mickeyCount);
        if (mickeyCount == 6) {
            window
                .open('https://www.youtube.com/watch?v=hmzO--ox7X0', '_blank')
                .focus();
            // window.location.href = "https://www.youtube.com/watch?v=hmzO--ox7X0";
        }
    },
    gameplayKeyUp: (key) => {
        switch (key.code) {
            case 'KeyA':
                GAME.user.movingLeft = false;
                break;
            case 'KeyD':
                GAME.user.movingRight = false;
                break;
            case 'KeyS':
                GAME.user.movingDown = false;
                break;
            case 'KeyW':
                GAME.user.movingUp = false;
                GAME.user.interacting = false;
                break;
            case 'Space':
                GAME.user.jumping = false;
                break;
            case 'ShiftLeft':
                GAME.user.running = false;
                break;
            case 'KeyX':
            case 'AltLeft':
                GAME.user.dashing = false;
                break;
            case 'KeyQ':
                GAME.user.jabbing = false;
                break;
        }
    },
    dialogKeyPress: (e) => {
        switch (e.code) {
            case 'KeyS':
                GAME.user.choiceDown = true;
                break;
            case 'KeyW':
                GAME.user.choiceUp = true;
                break;
        }
    },
    // KeyPress does not wanna work for spacebar. Oh well.
    dialogKeyDown: (e) => {
        switch (e.code) {
            case 'Space':
                GAME.user.continuingConversation = true;
        }
    },
    dialogKeyUp: (e) => {
        switch (e.code) {
            case 'Space':
                GAME.user.continuingConversation = false;
        }
    }
};

// custom CTX functions

const roundRect = function (x, y, width, height, radius) {
    CTX.beginPath();
    CTX.moveTo(x + radius, y);
    CTX.arcTo(x + width, y, x + width, y + height, radius);
    CTX.arcTo(x + width, y + height, x, y + height, radius);
    CTX.arcTo(x, y + height, x, y, radius);
    CTX.arcTo(x, y, x + width, y, radius);
    CTX.closePath();
};

/**
 * Checks if the mouse is over an entity (for example, to see if it was clicked on).
 * @param {Entity} entity An object containing a `pos` vector and a `size` vector.
 * @returns true if the mouse is over the entity, else false.
 */
const mouseOver = (entity) => {
    return (
        GAME.mousePos.x > entity.pos.x &&
        GAME.mousePos.y > entity.pos.y &&
        GAME.mousePos.x < entity.pos.x + entity.size.x &&
        GAME.mousePos.y < entity.pos.y + entity.size.y
    );
};
