/**
 * A Zone is a small portion of the Game World.
 * The Game Engine will load and deal with one Zone at a time.
 * A Dimension (once an actual class, now simply an in-game concept) will contain several Zones.
 * Zones should not be created willy-nilly - the only way you should actually construct a Zone is from the static getZones() method!
 *
 * A Zone will define the minimum (upper left) and maximum (bottom right) point which is going to be visible to the Camera -
 * anything outside this range will never be visible.
 * A Zone will also contain a load method: this ensures that all assets are downloaded, all entities are placed (INCLUDING CHAD), etc.
 *
 * @author Devin Peevy
 */
class Zone {
    /**
     * This constructor is PRIVATE should NOT be used outside the Zone class. To load a Zone, use the Zone.getZones() static method.
     * This constructor can be used INSIDE THAT METHOD to dictate the min/max point and loadFunction.
     * @param {Vector} minBlock The FIRST (top left) block which should be visible in this Zone. (NOT PIXEL COORDINATES)
     * @param {Vector} maxBlock The LAST (bottom right) block which should be visible in this Zone. (NOT PIXEL COORDINATES)
     * @param {function} loadFunction A function which is going to download all necessary assets and add all necessary entities into the zone.
     * @param {string} name The unique name of the Zone - should NOT match the name of ANY other Zone.
     */
    constructor(minBlock, maxBlock, loadFunction, name) {
        this.minBlock = minBlock;
        this.maxBlock = maxBlock;
        this.load = () => {
            // Clear all entities from previous Zone.
            GAME.clearEntities();

            // Clear all images/music from previous Zone.
            ASSET_MGR.refresh();
            loadFunction();

            CANVAS.addEventListener('contextmenu', function (e) {
                e.preventDefault();
            });

            CHAD.initWeapons();
            CHAD.initStatusEffect();
        };
        this.name = name;
    }

    /**
     * Checks for equality with another zone.
     * @param {Zone} otherZone The zone you want to check if this is equal to.
     * @returns true if otherZone is a zone with the same name as this.
     */
    equals(otherZone) {
        if (!(otherZone instanceof Zone)) {
            console.log(
                'Why are you comparing a zone to something not a zone?'
            );
            return false;
        }
        return this.name === otherZone.name;
    }

    // DYNAMIC GETTERS:

    /**
     * @returns {Vector} The Min (upper left) block that is visible in this Zone.
     */
    get MIN_BLOCK() {
        return this.minBlock;
    }

    /**
     * @returns {Vector} The Max (bottom right) block that is visible in this Zone.
     */
    get MAX_BLOCK() {
        return this.maxBlock;
    }

    /**
     * @returns {Vector} The minimum (x, y) coordinate visible in this Zone.
     */
    get MIN_PT() {
        return Vector.blockToWorldSpace(this.MIN_BLOCK);
    }

    /**
     * @returns {Vector} The maximum (x, y) coordinate visible in this Zone.
     */
    get MAX_PT() {
        // I want to actually be able to SEE the final block (not just touch its top left corner).
        // Therefore:
        const ones = new Vector(1, 1);
        return Vector.blockToWorldSpace(Vector.add(this.MAX_BLOCK, ones));
    }

    // I am not sure if we are actually going to need the following two getters, but I include them just in case:

    /**
     * @returns {Vector} The size of the zone, in BLOCKS.
     */
    get BLOCK_SIZE() {
        // We gotta include an extra block to account for 0.
        const ones = new Vector(1, 1);
        return Vector.add(
            Vector.subtract(this.MAX_BLOCK, this.MIN_BLOCK),
            ones
        );
    }

    /**
     * @returns {Vector} The size of the zone, in PIXELS.
     */
    get PIXEL_SIZE() {
        return Vector.multiply(this.BLOCK_SIZE, Block.SCALED_SIZE);
    }

    static getZoneByName(name) {
        // an object containing all zones, sorted by region.
        let finalZone = false;
        const allZones = Zone.getZones();
        // console.log('allZones', allZones);
        Object.keys(allZones).forEach((azKey) => {
            const region = allZones[azKey];
            // console.log(region);
            Object.keys(region).forEach((regKey) => {
                const zone = region[regKey];
                // console.log(zone);
                if (zone.name === name) {
                    console.log(zone);
                    finalZone = zone;
                }
            });
        });
        return finalZone;
    }

    /**
     * This is the only way which we should be externally generating Zones! Navigate this object to set ZONE to the one you want,
     * and then call its load() function in order to get everything properly loaded for your new Zone.
     * @returns An object containing ALL ZONES!
     */
    static getZones() {
        // Right now, I am creating zones with no real idea how big they ought to be/what ought be in them.
        // Therefore, I am defining these constants for MIN/MAX_BLOCK.
        const zeros = new Vector(0, 0);
        const defaultMaxBlock = new Vector(100, 25);

        /*
            NOTE: EVERYBODY WILL BE PUTTING CODE HERE! PLEASE:

            (A)     Keep it sorted appropriately. There should only ever be the seven dimensions - playground + the six in-game ones.
            (B)     Keep it alphabetized.
            (C)     Match the naming style for your load method! load<Dimension><ZoneName>
            (D)     Add as many zones to the playground as you want! Avoid adding temporary Zones to real Dimensions.
            (E)     Be sure that your load function is defined in the proper script, and that said script is imported into the head of index.html.
         */

        return {
            mountain: {
                slope1: new Zone(
                    zeros,
                    new Vector(100, 100),
                    loadMountainSlope1,
                    'Mountain Slope'
                ),
                slope2: new Zone(
                    zeros,
                    new Vector(100, 100),
                    loadMountainSlope2,
                    'Mountain Slope But Higher'
                )
            },
            playground: {
                caleb: new Zone(
                    zeros,
                    defaultMaxBlock,
                    loadPlaygroundCaleb,
                    'Club Caleb'
                ),
                devin: new Zone(
                    zeros,
                    defaultMaxBlock,
                    loadPlaygroundDevin,
                    'Devinopolis'
                ),
                everybody: new Zone(
                    zeros,
                    defaultMaxBlock,
                    loadPlaygroundEverybody,
                    'Bro City'
                ),
                nathan: new Zone(
                    zeros,
                    defaultMaxBlock,
                    loadPlaygroundNathan,
                    'Natesburg'
                ),
                trae: new Zone(
                    zeros,
                    new Vector(200, 25),
                    loadPlaygroundTrae,
                    'Trae Town'
                )
            },
            village: {
                field: new Zone(
                    zeros,
                    defaultMaxBlock,
                    loadVillageField,
                    'Village Field'
                ),
                main: new Zone(
                    zeros,
                    defaultMaxBlock,
                    loadVillageMain,
                    'Village Main'
                ),
                hillDownFromMain: new Zone(
                    zeros,
                    new Vector(75, 50),
                    loadHillDownFromMain,
                    'Hill Down From Main'
                ),
                woods: new Zone(zeros, new Vector(150, 25), loadWoods, 'Woods'),
                mountain: new Zone(
                    zeros,
                    defaultMaxBlock,
                    loadVillageMountain,
                    'Village Mountain'
                ),
                outsideCave: new Zone(
                    zeros,
                    new Vector(100, 75),
                    loadVillageOutsideCave,
                    'Village Outside Cave'
                )
            },
            cave: {
                insideCave1: new Zone(
                    zeros,
                    new Vector(101, 100),
                    loadCave1,
                    'Village Inside Cave'
                ),
                insideCave2: new Zone(
                    zeros,
                    new Vector(102, 50),
                    loadCave2,
                    'Cave final fight zone.'
                )
            },
            river: {
                river1: new Zone(
                    zeros,
                    new Vector(151, 50),
                    loadRiver,
                    'River Start'
                )
            },
            end: {
                endZone: new Zone(
                    zeros,
                    new Vector(100, 75),
                    loadEndZone,
                    'End Fight Section'
                )
            }
        };
    }
}
