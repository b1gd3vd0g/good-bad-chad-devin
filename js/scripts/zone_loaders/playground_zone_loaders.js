const loadPlaygroundCaleb = () => {

    const queueAssets = () => {
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.flowers.MED_RED_FLOWER.SPRITESHEET);
        ASSET_MGR.queueDownload(PapaChad.SPRITESHEET);
        ASSET_MGR.queueDownload(Block.SPRITESHEET);
        ASSET_MGR.queueDownload(Projectile.SPRITESHEET);
        ASSET_MGR.queueDownload(DialogBubble.SPRITESHEET);
        ASSET_MGR.queueDownload(Slingshot.SPRITESHEET);
        ASSET_MGR.queueDownload(Snake.SPRITESHEET);

        // queue music
        ASSET_MGR.queueDownload(MUSIC.PEACEFUL_CHIPTUNE.path);

        // queue sound effects
    };

    const addEntities = () => {

        // Add a border to the right side of the map, leading to the field.
        GAME.addEntity(new Border(
            new Vector(-1, 0), // start at the far right side of the Zone, and at the top
            new Vector(1, ZONE.PIXEL_SIZE.y), // only one pixel wide, but as tall as the entire Zone.
            Zone.getZones().village.main
        ));
        for (let y = ZONE.MAX_BLOCK.y; y >= ZONE.MIN_BLOCK.y; y--) {
            for (let x = ZONE.MAX_BLOCK.x; x >= ZONE.MIN_BLOCK.x; x--) {
                // GAME.addEntity(new Block(i, j, Block.DIRT));a

                // const pos = new Vector(y, x);
                console.log("Starting block x " + x);
                console.log("Starting block y " + y);

                switch (playGroundTileMap[y][x]) {
                    case 4:
                        GAME.addEntity(new Block(new Vector(x, y), Block.LAVA_ROCK));
                        break;
                    case 3:
                        GAME.addEntity(new Block(new Vector(x, y), Block.SNOWY_ICE));
                        break;
                    case 2:
                        GAME.addEntity(new Block(new Vector(x, y), Block.SNOWY_DIRT));
                        break;
                    case 1:
                        GAME.addEntity(new Block(new Vector(x, y), Block.DIRT));
                        break;
                    default:
                        break;
                }
            }
        }

        // Draw Sun.
        GAME.addEntity(new Sun(new Vector(Camera.SIZE.x - 2 * Sun.SCALED_SIZE, Sun.SCALED_SIZE), Sun.VILLAGE));
    };
    // Set background color:
    BG_COLOR = "red";

    queueAssets();
    ASSET_MGR.downloadAll(addEntities);
};

/**
 * Load's Devin's personal playground zone.
 * Currently, it is being used to test dialog, so loads a simple flat world with a Papa Chad sprite to offer dialog.
 */
const loadPlaygroundDevin = () => {
    const queueAssets = () => {
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.flowers.CARROT.SPRITESHEET);
    };

    const addEntities = () => {
        // Add a layer of five blocks to the floor.
        for (let y = ZONE.MAX_BLOCK.y; y >= ZONE.MAX_BLOCK.y - 5; y--) {
            for (let x = ZONE.MIN_BLOCK.x; x <= ZONE.MAX_BLOCK.x; x++) {
                // For optimization for collisions, the blocks NOT exposed to the surface are drawn in the background.
                let ground = (y === ZONE.MAX_BLOCK.y - 5) ? GameEngine.MIDGROUND : GameEngine.BACKGROUND;
                GAME.addEntity(new Block(new Vector(x, y), Block.DIRT), ground);
            }
        }
        // Add a flower to each block. Alternate foreground/background.
        for (let x = ZONE.MIN_BLOCK.x; x <= ZONE.MAX_BLOCK.x; x++) {
            const rand = Math.floor(Math.random() * 3);
            let flower;
            switch (rand) {
                case 0:
                    flower = Decoration.DECORATIONS.flowers.MED_RED_FLOWER;
                    break;
                case 1:
                    flower = Decoration.DECORATIONS.flowers.TALL_PURPLE_FLOWER;
                    break;
                case 2:
                    flower = Decoration.DECORATIONS.flowers.PRIDE_FLOWER;
                    break;
            }
            const ground = x % 2 === 1 ? GameEngine.BACKGROUND : GameEngine.FOREGROUND;
            const pos = Vector.blockToWorldSpace(new Vector(x + 0.5, ZONE.MAX_BLOCK.y - 5));
            GAME.addEntity(new Decoration(flower, pos), ground);
        }

        // Add papa chad (he'll fall until he's on some blocks.)
        const papaChadBlockPos = new Vector(15, 15);
        const papa = new PapaChad(
            Vector.blockToWorldSpace(papaChadBlockPos),
            new Conversation(getAllConversationArrays().playground.papaChad.huntingInvitation)); // his conversation.

        GAME.addEntity(papa);
    };

    BG_COLOR = COLORS.SEA_FOAM_GREEN; // It's my world so the sky's my fave color

    const chadBlockPos = new Vector(1, 15);
    CHAD.pos = Vector.blockToWorldSpace(chadBlockPos);

    queueAssets();
    ASSET_MGR.downloadAll(addEntities);
};

const loadPlaygroundEverybody = () => {
    const queueAssets = () => {

    };

    const addEntities = () => {

    };

    queueAssets();
    ASSET_MGR.downloadAll(addEntities);
};

const loadPlaygroundNathan = () => {
    const queueAssets = () => {

        // queue music


        // ASSET_MGR.queueDownload(MUSIC.TEST_FILE_10MB.path);

        // queue sound effects
    };

    const addEntities = () => {

        // Add a border to the right side of the map, leading to the field.
        GAME.addEntity(new Border(
            new Vector(-1, 0), // start at the far right side of the Zone, and at the top
            new Vector(1, ZONE.PIXEL_SIZE.y), // only one pixel wide, but as tall as the entire Zone.
            Zone.getZones().village.main
        ));
        for (let y = ZONE.MAX_BLOCK.y; y >= ZONE.MIN_BLOCK.y; y--) {
            for (let x = ZONE.MAX_BLOCK.x; x >= ZONE.MIN_BLOCK.x; x--) {
                // GAME.addEntity(new Block(i, j, Block.DIRT));

                // const pos = new Vector(y, x);

                switch (playGroundTileMap[y][x]) {
                    case 4:
                        GAME.addEntity(new Block(new Vector(x, y), Block.LAVA_ROCK));
                        break;
                    case 3:
                        GAME.addEntity(new Block(new Vector(x, y), Block.SNOWY_ICE));
                        break;
                    case 2:
                        GAME.addEntity(new Block(new Vector(x, y), Block.SNOWY_DIRT));
                        break;
                    case 1:
                        GAME.addEntity(new Block(new Vector(x, y), Block.DIRT));
                        break;
                    default:
                        break;
                }
            }
        }

        // Draw Sun.
        GAME.addEntity(new Sun(new Vector(Camera.SIZE.x - 2 * Sun.SCALED_SIZE, Sun.SCALED_SIZE), Sun.VILLAGE));

        // Place chad above the blocks.
        const startBlock = new Vector(5, 5);
        CHAD.pos = Vector.blockToWorldSpace(startBlock);

        // GAME.addEntity(new FoodDrop(FoodDrop.BACON, Vector.blockToWorldSpace(new Vector(10, 5))));
        // GAME.addEntity(new FoodDrop(FoodDrop.BURGER, Vector.blockToWorldSpace(new Vector(15, 5))));
        // GAME.addEntity(new FoodDrop(FoodDrop.ENERGY_DRINK, Vector.blockToWorldSpace(new Vector(10, 10))));
        // GAME.addEntity(new FoodDrop(FoodDrop.STEAK, Vector.blockToWorldSpace(new Vector(15, 10))));
        // GAME.addEntity(new FoodDrop(FoodDrop.HAM, Vector.blockToWorldSpace(new Vector(10, 15))));
        // GAME.addEntity(new FoodDrop(FoodDrop.CHICKEN, Vector.blockToWorldSpace(new Vector(20, 10))));
        // GAME.addEntity(new FoodDrop(FoodDrop.BEEF, Vector.blockToWorldSpace(new Vector(20, 15))));

        // NOTE: we can't activate music until the user has interacted with the canvas. (this issue is inherent to HTML5)
        //  If listening for a click is the only way to activate music, that's fine. 
        //  Our game's START button in the final version can be the trigger.
        let playMusic = () => {
            ASSET_MGR.playMusic(MUSIC.PEACEFUL_CHIPTUNE.path, MUSIC.PEACEFUL_CHIPTUNE.volume);
        
            // delete the event listener so that the music doesn't restart when the user clicks again
            document.body.removeEventListener('click', playMusic);
        };
        document.body.addEventListener('click', playMusic);
    };

    // Set background color:
    BG_COLOR = COLORS.SKY_BLUE;

    queueAssets();
    ASSET_MGR.downloadAll(addEntities);
};

const loadPlaygroundTrae = () => {
    const queueAssets = () => {
        ASSET_MGR.queueDownload(Snake.SPRITESHEET);
        ASSET_MGR.queueDownload(Slime.SPRITESHEET);
        ASSET_MGR.queueDownload(Bunny.SPRITESHEET);
        ASSET_MGR.queueDownload(Yeti.SPRITESHEET);
    };

    const addEntities = () => {
        // Add a layer of blocks to the floor.
        for (let x = ZONE.MIN_BLOCK.x; x <= ZONE.MAX_BLOCK.x; x++) {
            GAME.addEntity(new Block(new Vector(x, ZONE.MAX_BLOCK.y - 2), Block.DIRT));
            GAME.addEntity(new Block(new Vector(x, ZONE.MAX_BLOCK.y - 1), Block.DIRT));
            GAME.addEntity(new Block(new Vector(x, ZONE.MAX_BLOCK.y), Block.DIRT));
        }
        GAME.addEntity(new Bunny(Vector.blockToWorldSpace(new Vector(60, 20))));
        GAME.addEntity(new Snake(Vector.blockToWorldSpace(new Vector(80, 20))));
        GAME.addEntity(new FlyingSnake(Vector.blockToWorldSpace(new Vector(80, 17))));
        GAME.addEntity(new Slime(Vector.blockToWorldSpace(new Vector(100, 20))));
        GAME.addEntity(new Yeti(Vector.blockToWorldSpace(new Vector(120, 0))));

        CHAD.pos = Vector.blockToWorldSpace(new Vector(50, 20));
    };

    BG_COLOR = "purple";

    queueAssets();
    ASSET_MGR.downloadAll(addEntities);
};
