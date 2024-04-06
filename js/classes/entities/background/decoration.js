/**
 * General-purpose class for displaying entites that do not move and which cannot be collided with.
 * 
 * @author Trae Claar, (modified) Caleb Krauter
 */
class Decoration {

    /**
     * Constructor for a Decoration. The Decoration is positioned with respect to the BOTTOM (not top) left 
     * corner.
     * 
     * @param {Object} type A Decoration Object template from Decoration.DECORATIONS.
     * @param {Vector} bottomLeftPos the position of the bottom left corner of the Decoration (in world space)
     * @throws {Error} if type is not a valid Decoration type
     */
    constructor(type, bottomLeftPos) {
        this.type = type;
        this.pos = new Vector(bottomLeftPos.x, bottomLeftPos.y - this.type.SIZE.y * this.type.SCALE);
        this.animator = new Animator(this.type.SPRITESHEET, this.type.SPRITESHEET_START_POS,
            this.type.SIZE, this.type.FRAME_COUNT, this.type.FRAME_DURATION);
    };

    /** A map containing decoration types (keys) and tables of their properties (values). */
    static get DECORATIONS() {
        return {
            flowers: {
                MED_RED_FLOWER_1: {
                    SPRITESHEET: "./sprites/flowers.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(16, 32),
                    SCALE: 1
                },
                TALL_PURPLE_FLOWER_1: {
                    SPRITESHEET: "./sprites/flowers.png",
                    SPRITESHEET_START_POS: new Vector(0, 32),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(16, 32),
                    SCALE: 1
                },
                PRIDE_FLOWER_1: {
                    SPRITESHEET: "./sprites/flowers.png",
                    SPRITESHEET_START_POS: new Vector(0, 64),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(16, 32),
                    SCALE: 1
                },
                MED_RED_FLOWER_2: {
                    SPRITESHEET: "./sprites/flowers.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(16, 32),
                    SCALE: 1.5
                },
                TALL_PURPLE_FLOWER_2: {
                    SPRITESHEET: "./sprites/flowers.png",
                    SPRITESHEET_START_POS: new Vector(0, 32),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(16, 32),
                    SCALE: 1.5
                },
                PRIDE_FLOWER_2: {
                    SPRITESHEET: "./sprites/flowers.png",
                    SPRITESHEET_START_POS: new Vector(0, 64),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(16, 32),
                    SCALE: 1.5
                },
                MED_RED_FLOWER_3: {
                    SPRITESHEET: "./sprites/flowers.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(16, 32),
                    SCALE: 2
                },
                TALL_PURPLE_FLOWER_3: {
                    SPRITESHEET: "./sprites/flowers.png",
                    SPRITESHEET_START_POS: new Vector(0, 32),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(16, 32),
                    SCALE: 2
                },
                PRIDE_FLOWER_3: {
                    SPRITESHEET: "./sprites/flowers.png",
                    SPRITESHEET_START_POS: new Vector(0, 64),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(16, 32),
                    SCALE: 2
                },
                MED_RED_FLOWER_4: {
                    SPRITESHEET: "./sprites/flowers.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(16, 32),
                    SCALE: 2.5
                },
                TALL_PURPLE_FLOWER_4: {
                    SPRITESHEET: "./sprites/flowers.png",
                    SPRITESHEET_START_POS: new Vector(0, 32),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(16, 32),
                    SCALE: 2.5
                },
                PRIDE_FLOWER_4: {
                    SPRITESHEET: "./sprites/flowers.png",
                    SPRITESHEET_START_POS: new Vector(0, 64),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(16, 32),
                    SCALE: 2.5
                },
                CARROT: {
                    SPRITESHEET: "./sprites/flowers.png",
                    SPRITESHEET_START_POS: new Vector(0, 96),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(16, 32),
                    SCALE: 3
                },
                POTATO: {
                    SPRITESHEET: "./sprites/flowers.png",
                    SPRITESHEET_START_POS: new Vector(0, 128),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(16, 32),
                    SCALE: 3
                }
            },
            houses: {
                BLACKSMITH_HOUSE: {
                    SPRITESHEET: "./sprites/blacksmith_house.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 4,
                    FRAME_DURATION: 1 / 4,
                    SIZE: new Vector(192, 192),
                    SCALE: 3.5
                },
                CHAD_HOUSE: {
                    SPRITESHEET: "./sprites/chad_house.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(192, 192),
                    SCALE: 3.5
                },
                MAYOR_HOUSE: {
                    SPRITESHEET: "./sprites/mayor_house.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(192, 192),
                    SCALE: 3.5
                }
            },
            trees: {
                OAK_1: {
                    SPRITESHEET: "./sprites/tree.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(64, 64),
                    SCALE: 8
                },
                OAK_2: {
                    SPRITESHEET: "./sprites/tree.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(64, 64),
                    SCALE: 9
                },
                OAK_3: {
                    SPRITESHEET: "./sprites/tree.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(64, 64),
                    SCALE: 6
                },
                SPRUCE_0: {
                    SPRITESHEET: "./sprites/tree_spruce.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(64, 64),
                    SCALE: 1
                },
                SPRUCE_1: {
                    SPRITESHEET: "./sprites/tree_spruce.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(64, 64),
                    SCALE: 7
                },
                SPRUCE_2: {
                    SPRITESHEET: "./sprites/tree_spruce.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(64, 64),
                    SCALE: 8
                },
                SPRUCE_3: {
                    SPRITESHEET: "./sprites/tree_spruce.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(64, 64),
                    SCALE: 9
                },
                SPRUCE_4: {
                    SPRITESHEET: "./sprites/tree_spruce.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(64, 64),
                    SCALE: 25
                },
                SPRUCE_5: {
                    SPRITESHEET: "./sprites/tree_spruce.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(64, 64),
                    SCALE: 30
                },
                MAGIC_TREE_1: {
                    SPRITESHEET: "./sprites/magicaltree1.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 16,
                    FRAME_DURATION: .5,
                    SIZE: new Vector(256, 255
                    ),
                    SCALE: 3
                },
                MAGIC_TREE_2: {
                    SPRITESHEET: "./sprites/magicaltree1.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 16,
                    FRAME_DURATION: .5,
                    SIZE: new Vector(256, 255
                    ),
                    SCALE: 2
                },
                MAGIC_TREE_3: {
                    SPRITESHEET: "./sprites/magicaltree1.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 16,
                    FRAME_DURATION: .5,
                    SIZE: new Vector(256, 255
                    ),
                    SCALE: 5
                },
                MAGIC_TREE_4: {
                    SPRITESHEET: "./sprites/magicaltree2.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 16,
                    FRAME_DURATION: .5,
                    SIZE: new Vector(256, 255
                    ),
                    SCALE: 3
                },
                MAGIC_TREE_5: {
                    SPRITESHEET: "./sprites/magicaltree2.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 16,
                    FRAME_DURATION: .5,
                    SIZE: new Vector(256, 255
                    ),
                    SCALE: 2
                },
                MAGIC_TREE_6: {
                    SPRITESHEET: "./sprites/magicaltree2.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 16,
                    FRAME_DURATION: .5,
                    SIZE: new Vector(256, 255),
                    SCALE: 5
                }

            },
            clouds: {
                CLOUD_JUST_CLOUD: {
                    SPRITESHEET: "./sprites/cloud1.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(32, 32),
                    SCALE: 7
                },
                CLOUD_LANKY: {
                    SPRITESHEET: "./sprites/cloud2.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(32, 32),
                    SCALE: 7
                },
                CLOUD_BUSHY: {
                    SPRITESHEET: "./sprites/cloud3.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(32, 32),
                    SCALE: 7
                },
                CLOUD_JUST_CLOUD_DARK: {
                    SPRITESHEET: "./sprites/cloud_dark1.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(32, 32),
                    SCALE: 7
                },
                CLOUD_LANKY_DARK: {
                    SPRITESHEET: "./sprites/cloud_dark2.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(32, 32),
                    SCALE: 7
                },
                CLOUD_BUSHY_DARK: {
                    SPRITESHEET: "./sprites/cloud_dark3.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(32, 32),
                    SCALE: 7
                }
            },
            grass: {
                GRASS_1: {
                    SPRITESHEET: "./sprites/grass.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 8,
                    FRAME_DURATION: .2,
                    SIZE: new Vector(32, 32),
                    SCALE: 1.5
                },
                GRASS_2: {
                    SPRITESHEET: "./sprites/grass.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 8,
                    FRAME_DURATION: .2,
                    SIZE: new Vector(32, 32),
                    SCALE: 2
                },
                GRASS_3: {
                    SPRITESHEET: "./sprites/grass.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 8,
                    FRAME_DURATION: .2,
                    SIZE: new Vector(32, 32),
                    SCALE: 2.2
                }
            },
            lighting: {
                LANTERN: {
                    SPRITESHEET: "./sprites/lantern.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 5,
                    FRAME_DURATION: .2,
                    SIZE: new Vector(176, 256),
                    SCALE: 3
                },
                TORCH_FOREGROUND: {
                    SPRITESHEET: "./sprites/torch.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 6,
                    FRAME_DURATION: .4,
                    SIZE: new Vector(256, 256),
                    SCALE: 1.5
                },
                TORCH_BACKGROUND: {
                    SPRITESHEET: "./sprites/torch.png",
                    SPRITESHEET_START_POS: new Vector(96, 352),
                    FRAME_COUNT: 6,
                    FRAME_DURATION: .4,
                    SIZE: new Vector(256, 48),
                    SCALE: 2.5
                },
                TORCH_BACKGROUND_EASTEREGG: {
                    SPRITESHEET: "./sprites/torch.png",
                    SPRITESHEET_START_POS: new Vector(96, 272),
                    FRAME_COUNT: 6,
                    FRAME_DURATION: .4,
                    SIZE: new Vector(256, 48),
                    SCALE: 2.5
                }
            },
            crystals: {
                CRYSTALS_1: {
                    SPRITESHEET: "./sprites/groupcrystals1.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(256, 256),
                    SCALE: 6.5
                },
                CRYSTALS_2: {
                    SPRITESHEET: "./sprites/groupcrystals2.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(256, 256),
                    SCALE: 3
                },
                CRYSTALS_3: {
                    SPRITESHEET: "./sprites/greenspikecrystal1.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(16, 16),
                    SCALE: 2
                },
                CRYSTALS_4: {
                    SPRITESHEET: "./sprites/purplespikecrystal1.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(16, 16),
                    SCALE: 2
                },
                CRYSTALS_5: {
                    SPRITESHEET: "./sprites/spikecyrstalblue1.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(16, 16),
                    SCALE: 3
                },
                CRYSTALS_6: {
                    SPRITESHEET: "./sprites/greenspikecrystal1.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(16, 16),
                    SCALE: 5
                },
                CRYSTALS_7: {
                    SPRITESHEET: "./sprites/groupcrystals1.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(256, 256),
                    SCALE: 1
                },
                CRYSTALS_8: {
                    SPRITESHEET: "./sprites/groupcrystals2.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(256, 256),
                    SCALE: 1
                },
                CRYSTALS_9: {
                    SPRITESHEET: "./sprites/groupcrystals1.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(256, 256),
                    SCALE: .5
                },
                CRYSTALS_10: {
                    SPRITESHEET: "./sprites/groupcrystals2.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(256, 256),
                    SCALE: .5
                },
                CRYSTALS_11: {
                    SPRITESHEET: "./sprites/crystal1green.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(256, 256),
                    SCALE: 1
                },
            },
            towers: {
                TOWER_1: {
                    SPRITESHEET: "./sprites/tower1.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(256, 1024),
                    SCALE: 3.5
                },
                TOWER_GROUP_1: {
                    SPRITESHEET: "./sprites/towergroup1.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(512, 512),
                    SCALE: 2
                },
                TOWER_GROUP_2: {
                    SPRITESHEET: "./sprites/towergroup2.png",
                    SPRITESHEET_START_POS: new Vector(0, 0),
                    FRAME_COUNT: 1,
                    FRAME_DURATION: 1,
                    SIZE: new Vector(2048, 2048),
                    SCALE: 1
                },
            }
        };
    };

    /**
     * Checks if the passed type is a valid Decoration and throws an error otherwise. Not intended
     * for use outside of the Decoration class.
     * 
     * @param {string} type the type to check
     * @throws {Error} if type is not a valid Decoration type.
     */
    static checkType(type) {
        if (!Decoration.PROPERTY_TABLE[type]) {
            throw new Error(type + " is not a valid Decoration type. Please use a key from"
                + " Decoration.PROPERTY_TABLE.");
        }
    };

    /**
     * Returns the path to the spritesheet file for the given Decoration. Convenient for loading its 
     * spritesheet.
     * 
     * @param {string} type the type of Decoration to get the spritesheet path for (must be a key to 
     *      Decoration.PROPERTY_TABLE)
     * @returns {string} the file path to the spritesheet
     * @throws {Error} if type is not a valid Decoration type.
     */
    static getSpritesheet(type) {
        Decoration.checkType(type);
        return Decoration.PROPERTY_TABLE[type].SPRITESHEET;
    };

    /**
     * Decoration update method. Does nothing.
     */
    update() {

    };

    /**
     * Draw the Decoration on the canvas.
     */
    draw() {
        this.animator.drawFrame(Vector.worldToCanvasSpace(this.pos), this.type.SCALE);
    };
};