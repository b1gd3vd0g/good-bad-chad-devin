/**
 * A piece of ammo that is contained in the inventory.
 * Meant to be turned into a Projectile when used.
 * 
 * @author Nathan Hinthorne
 */
class AmmoItem {
    /**
     * @param {string} type The type of ammo to create. AmmoItem.ROCK, AmmoItem.BOMB, etc.
     * @param {number} amount The amount of ammo to create.
     */
    constructor(type, amount = 0) {
        this.type = type;
        this.amount = amount;
        this.isRevealed = false;
        if (this.type == AmmoItem.ROCK) {
            this.isRevealed = true;
        }
    }

    adjustSupply(amount) {
        if (typeof amount !== "number" || amount % 1 !== 0) {
            throw new Error("Invalid amount of ammo to add");
        }

        if (!this.isRevealed) { // once the player has collected this ammo, it is no longer secret
            this.isRevealed = true;
        }

        this.amount += amount;
    }


    // condense the spritesheet, scale, and size, frame count, and frame duration into one object
    // this is done because not all spritesheets are the same size and thus can't fit on the same spritesheet
    static get AMMO_ITEM_MAP() {
        return {
            rock: {
                SPRITESHEET: Rock.SPRITESHEET, // instead of loading a new spritesheet, we can just use the one from the Rock class
                SPRITESHEET_EASTER_EGG: "./sprites/projectile_the_rock.png",
                SPRITESHEET_START_POS: new Vector(0, 0),
                FRAME_COUNT: 1,
                FRAME_DURATION: 0,
                SIZE: new Vector(28, 28),
                SCALE: 1,
            },
            slimeball: {
                SPRITESHEET: Slimeball.SPRITESHEET, // instead of loading a new spritesheet, we can just use the one from the Slimeball class
                SPRITESHEET_EASTER_EGG: Slimeball.SPRITESHEET_EASTER_EGG, 
                SPRITESHEET_START_POS: new Vector(0, 0),
                FRAME_COUNT: 6,
                FRAME_DURATION: 0.2,
                SIZE: new Vector(32, 32),
                SCALE: 1,
            },
            bomb: {
                SPRITESHEET: Bomb.SPRITESHEET, // instead of loading a new spritesheet, we can just use the one from the Bomb class
                SPRITESHEET_START_POS: new Vector(0, 0),
                FRAME_COUNT: 2,
                FRAME_DURATION: 0.2,
                SIZE: new Vector(26, 30),
                SCALE: 1,
            },
            snowball: {
                SPRITESHEET: Snowball.SPRITESHEET, // instead of loading a new spritesheet, we can just use the one from the Snowball class
                SPRITESHEET_START_POS: new Vector(0, 0),
                FRAME_COUNT: 1,
                FRAME_DURATION: 0,
                SIZE: new Vector(27, 27),
                SCALE: 1,
            },
            sus_snowball: {
                SPRITESHEET: SusSnowball.SPRITESHEET, // instead of loading a new spritesheet, we can just use the one from the SusSnowball class
                SPRITESHEET_START_POS: new Vector(0, 0),
                FRAME_COUNT: 1,
                FRAME_DURATION: 0,
                SIZE: new Vector(27, 27),
                SCALE: 1,
            },
            broccoli: {
                SPRITESHEET: Broccoli.SPRITESHEET, // instead of loading a new spritesheet, we can just use the one from the Broccoli class
                SPRITESHEET_START_POS: new Vector(0, 0),
                FRAME_COUNT: 1,
                FRAME_DURATION: 0,
                SIZE: new Vector(72, 78),
                SCALE: 1,
            },
            water_balloon: {
                SPRITESHEET: WaterBalloon.SPRITESHEET, // instead of loading a new spritesheet, we can just use the one from the WaterBalloon class
                SPRITESHEET_START_POS: new Vector(0, 0),
                FRAME_COUNT: 1,
                FRAME_DURATION: 0,
                SIZE: new Vector(32, 32),
                SCALE: 1,
            },
        }
    }


    // We use these intead of the mapped items above because AmmoItems should be passing 
    // around strings to other classes, not giving them objects.
    static get ROCK() {
        return "rock";
    }

    static get SLIMEBALL() {
        return "slimeball";
    }

    static get BOMB() {
        return "bomb";
    }

    static get SNOWBALL() {
        return "snowball";
    }

    static get SUS_SNOWBALL() {
        return "sus_snowball";
    }

    static get BROCCOLI() {
        return "broccoli";
    }

    static get WATER_BALLOON() {
        return "water_balloon";
    }
    

}