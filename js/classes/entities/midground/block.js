/** A Block is the building block of our world. A block cannot be passed through by any entity. 
 * Only certain types of blocks can be broken through.
 * 
 * @author Devin, (modified) Caleb Krauter
 */
class Block {
    /**
     * 
     * @param {Vector} pos The coordinates (IN THE BLOCKGRID) at which you want the block placed.
     * @param {number} type The type of block you want. Block.GRASS, DIRT, SNOWY_ICE, ICE, SNOWY_DIRT, SNOW, LAVA_ROCK.
     * @param {boolean} needsBB Is there any reason that this Block should need a bounding box? Default: true.
     */
    constructor(pos, type, needsBB = true) {
        /** The position of the Block (in the game world). */
        this.pos = Vector.blockToWorldSpace(pos);

        /** The type of block. Block.GRASS, DIRT, SNOWY_ICE, ICE, SNOWY_DIRT, SNOW, LAVA_ROCK. */
        this.type = type;
        /** An associative array of the animations for this Block. Arranged [facing][action]. */
        this.animator = new Animator(
            Block.SPRITESHEET,
            new Vector(0, this.type * Block.SIZE), // "type" is also the number of sprites above it on the spritesheet!
            new Vector(Block.SIZE, Block.SIZE),
            1, 1);
        /** Used to check for collisions with other applicable entities. */
        this.boundingBox = needsBB ? new BoundingBox(this.pos, new Vector(Block.SCALED_SIZE, Block.SCALED_SIZE)) : undefined;


        // certain blocks can be passed through by Chad
        // if (needsBB) {
        //     this.canPassThru = {
        //         top: false,
        //         bottom: false,
        //         left: false,
        //         right: false
        //     }
        //     switch(this.type) {
        //         case Block.BR_LEFT_FULL:
        //         case Block.BR_RIGHT_FULL:
        //         case Block.BRANCH_LEFT_HALF:
        //         case Block.BRANCH_RIGHT_HALF:
        //             this.canPassThru.bottom = true;
        //             this.canPassThru.left = true;
        //             this.canPassThru.right = true;
        //             break;

        //         // ... other cases
        //     }
        // }
    };

    /** Grass. */
    static get GRASS() {
        return 0;
    };
    /** Dirt. */
    static get DIRT() {
        return 1;
    };
    /** Snow on ice. */
    static get SNOWY_ICE() {
        return 2;
    };
    /** Ice block. */
    static get ICE() {
        return 3;
    };
    /** Dirty snow. */
    static get SNOWY_DIRT() {
        return 4;
    };
    /** Snow block. */
    static get SNOW() {
        return 5;
    };
    /** Lava rock. */
    static get LAVA_ROCK() {
        return 6;
    };
    /** Metal bars. */
    static get BARS() {
        return 7;
    };
    /** Oak Planks. */
    static get PLANKS_OAK() {
        return 8;
    };
    /** Spruce planks. */
    static get PLANKS_SPRUCE() {
        return 9;
    };
    /** Horizontal log spruce. */
    static get LOG_SPRUCE_HORIZONTAL() {
        return 10;
    };
    /** Virtcal log spruce. */
    static get LOG_SPRUCE_VIRTICAL() {
        return 11;
    };
    /** Redwood planks. */
    static get PLANKS_REDWOOD() {
        return 12;
    };
    /** Redwood planks light. */
    static get PLANKS_REDWOOD_LIGHT() {
        return 13;
    };
    /** Normal cobble stone. */
    static get STONE_COBBLE() {
        return 14;
    };
    /** Dark cobble rock. */
    static get STONE_COBBLE_DARK() {
        return 15;
    };
    /** Cobble volcanic rock. */
    static get STONE_COBBLE_VOLCANIC() {
        return 16;
    };
    /** Oak plank stairs right. */
    static get PLANK_OAK_STAIRS_LEFT() {
        return 17;
    };
    /** Oak plank stairs right. */
    static get PLANK_OAK_STAIRS_RIGHT() {
        return 18;
    };
    /** Spruce plank stairs left. */
    static get PLANK_SPRUCE_STAIRS_LEFT() {
        return 19;
    };
    /** Spruce plank stairs right. */
    static get PLANK_SPRUCE_STAIRS_RIGHT() {
        return 20;
    };
    /** Surface snow. */
    static get SNOW_SURFACE() {
        return 21;
    };
    /** Full right branch block. */
    static get BR_LEFT_FULL() {
        return 22;
    };
    /** Full right branch block. */
    static get BR_RIGHT_FULL() {
        return 23;
    };
    /** Branch block left ~45 degree angle. */
    static get BRANCH_LEFT_HALF() {
        return 24;
    };
    /** Branch block right ~45 degree angle. */
    static get BRANCH_RIGHT_HALF() {
        return 25;
    };
    /** Branch block pointy on top of tree. */
    static get BRANCH_TOP() {
        return 26;
    };
    /** Branch filled with log. */
    static get BRANCH_FILL_LOG() {
        return 27;
    };
    /** Branch filled block. */
    static get BRANCH_FILL() {
        return 28;
    };
    /** Twig left. */
    static get TWIG_LEFT() {
        return 29;
    }
    /** Twig right. */
    static get TWIG_RIGHT() {
        return 30;
    }
    /** End of branch left. */
    static get BR_LEFT_END() {
        return 31;
    }
    /** End of branch right. */
    static get BR_RIGHT_END() {
        return 32;
    }
    /** Branch left. */
    static get BR_LEFT() {
        return 33;
    }
    /** Branch right. */
    static get BR_RIGHT() {
        return 34;
    }
    /** Invisible block. */
    static get HIDDEN_BLOCK_CLOUD() {
        return 35;
    }
    /** Dark cave block 1. */
    static get CAVE_1() {
        return 36;
    }
    /** Dark cave block 2. */
    static get CAVE_2() {
        return 37;
    }
    /** Dark cave block 3. */
    static get CAVE_3() {
        return 38;
    }
    /** Dark cave block 4. */
    static get CAVE_4() {
        return 39;
    }
    /** Stalactite. */
    static get CAVE_SHARP_DOWN_1() {
        return 40;
    }
    /** Stalactites. */
    static get CAVE_SHARP_DOWN_GROUP() {
        return 41;
    }
    /** Stalacmites. */
    static get CAVE_SHARP_UP_GROUP() {
        return 42;
    }
    /** Stalacmite. */
    static get CAVE_SHARP_UP_1() {
        return 43;
    }
    /** Stalactites grey. */
    static get CAVE_SHARP_DOWN_1_GREY() {
        return 44;
    }
    /** Stalactite grey. */
    static get CAVE_SHARP_DOWN_GROUP_GREY() {
        return 45;
    }
    /** Stalacmitesgrey. */
    static get CAVE_SHARP_UP_GROUP_GREY() {
        return 46;
    }
    /** Stalacmite grey. */
    static get CAVE_SHARP_UP_1_GREY() {
        return 47;
    }
    /** Transparent Darkness. */
    static get DARK() {
        return 48;
    }
    /** Stump for river. */
    static get BARREL() {
        return 49;
    }
    static get STUMP() {
        return 50;
    }
    static get LAVA_BOTTOM() {
        return 51;
    }
    static get WATER_BOTTOM() {
        return 52;
    }
    static get END_BLOCK_1() {
        return 53;
    }
    static get END_BLOCK_2() {
        return 54;
    }
    static get END_BLOCK_3() {
        return 55;
    }
    static get END_BLOCK_4() {
        return 56;
    }
    static get END_BLOCK_5() {
        return 57;
    }
    static get END_BLOCK_6() {
        return 58;
    }
    /** How much bigger should the sprite be drawn on the canvas than it is on the spritesheet? */
    static get SCALE() {
        return 2;
    };

    /** Size of a block. */
    static get SIZE() {
        return 32;
    };

    /** Scaled size of a block. */
    static get SCALED_SIZE() {
        return Block.SCALE * Block.SIZE;
    };

    /** The filepath to the spritesheet of the Block. */
    static get SPRITESHEET() {
        return "./sprites/blocks.png";
    };

    /** Change what the entity is doing and where it is. */
    update() {

    };

    /** Draw the entity on the canvas. */
    draw() {
        this.animator.drawFrame(Vector.worldToCanvasSpace(this.pos), Block.SCALE);
    };
};