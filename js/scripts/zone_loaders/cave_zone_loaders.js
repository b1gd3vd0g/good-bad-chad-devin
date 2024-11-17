
const loadCave1 = () => {
    const queueAssets = () => {
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.crystals.CRYSTALS_1.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.crystals.CRYSTALS_2.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.crystals.CRYSTALS_3.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.crystals.CRYSTALS_4.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.crystals.CRYSTALS_5.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.crystals.CRYSTALS_6.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.crystals.CRYSTALS_11.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.flowers.CARROT.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.flowers.MED_RED_FLOWER_1.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.flowers.POTATO.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.flowers.PRIDE_FLOWER_1.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.flowers.TALL_PURPLE_FLOWER_1.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.grass.GRASS_1.SPRITESHEET);
        
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.houses.BLACKSMITH_HOUSE.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.houses.CHAD_HOUSE.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.houses.MAYOR_HOUSE.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.lighting.LANTERN.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.lighting.TORCH_FOREGROUND.SPRITESHEET);
        ASSET_MGR.queueDownload(Precipitation.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.trees.OAK_1.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.trees.SPRUCE_1.SPRITESHEET);
        ASSET_MGR.queueDownload(Miner.SPRITESHEET);
        ASSET_MGR.queueDownload(BlackSmith.SPRITESHEET);

        ASSET_MGR.queueDownload(Bird.SPRITESHEET);
        ASSET_MGR.queueDownload(Bunny.SPRITESHEET);
        ASSET_MGR.queueDownload(Snake.SPRITESHEET);
        ASSET_MGR.queueDownload(DrillBot.SPRITESHEET);

        ASSET_MGR.queueDownload(MUSIC.LAVA_UNDERGROUND.path);

    };

    const addEntities = () => {
        GAME.addEntity(new Border(
            new Vector(ZONE.MIN_PT.x, 0),
            new Vector(1, ZONE.PIXEL_SIZE.y),
            Zone.getZones().mountain.slope2
        ));
        GAME.addEntity(new Border(
            new Vector(ZONE.MAX_PT.x, 0),
            new Vector(1, ZONE.PIXEL_SIZE.y),
            Zone.getZones().cave.insideCave2
        ));
        BG_COLOR = COLORS.DARK_CAVE_PURPLE;

        let lanternYOffsset = 13;
        let lanternXOffsset = -3;

        GAME.addEntity(new Decoration(Decoration.DECORATIONS.lighting.LANTERN, Vector.blockToWorldSpace(new Vector(2, 16))), 1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.lighting.LANTERN, Vector.blockToWorldSpace(new Vector(13, 21))), 1);

        GAME.addEntity(new Decoration(Decoration.DECORATIONS.lighting.LANTERN, Vector.blockToWorldSpace(new Vector(9, 30))), 1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.lighting.LANTERN, Vector.blockToWorldSpace(new Vector(30, 29))), 1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.lighting.LANTERN, Vector.blockToWorldSpace(new Vector(40, 27))), 1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.lighting.LANTERN, Vector.blockToWorldSpace(new Vector(65, 29))), 1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.lighting.LANTERN, Vector.blockToWorldSpace(new Vector(67, 82))), 1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.lighting.LANTERN, Vector.blockToWorldSpace(new Vector(38, 71))), 1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.lighting.LANTERN, Vector.blockToWorldSpace(new Vector(45, 77))), 1);

        // Offset the torch -2x + 2.5y
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.lighting.TORCH_FOREGROUND, Vector.blockToWorldSpace(new Vector(58, 98.5))), 1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.lighting.TORCH_BACKGROUND, Vector.blockToWorldSpace(new Vector(60, 96))), -1);

        GAME.addEntity(new Decoration(Decoration.DECORATIONS.lighting.TORCH_FOREGROUND, Vector.blockToWorldSpace(new Vector(95, 97.5))), 1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.lighting.TORCH_BACKGROUND, Vector.blockToWorldSpace(new Vector(97, 95))), -1);

        GAME.addEntity(new Decoration(Decoration.DECORATIONS.lighting.TORCH_FOREGROUND, Vector.blockToWorldSpace(new Vector(78, 98.5))), 1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.lighting.TORCH_BACKGROUND, Vector.blockToWorldSpace(new Vector(80, 96))), -1);


        GAME.addEntity(new Decoration(Decoration.DECORATIONS.lighting.TORCH_FOREGROUND, Vector.blockToWorldSpace(new Vector(92, 88.5))), 1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.lighting.TORCH_BACKGROUND_EASTEREGG, Vector.blockToWorldSpace(new Vector(94, 86))), -1);


        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_2, Vector.blockToWorldSpace(new Vector(20, 85))), -1);

        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_2, Vector.blockToWorldSpace(new Vector(90, 106))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_5, Vector.blockToWorldSpace(new Vector(95, 87))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_4, Vector.blockToWorldSpace(new Vector(95, 87))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_3, Vector.blockToWorldSpace(new Vector(97, 87))), -1);

        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_2, Vector.blockToWorldSpace(new Vector(90, 106))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_1, Vector.blockToWorldSpace(new Vector(43, 100))), -1);

        const blockPosBlackSmith = new Vector(5, 5);
        GAME.addEntity(new BlackSmith(Vector.blockToWorldSpace(blockPosBlackSmith), new Conversation(getAllConversationArrays().village.blacksmith.merchantCave)), 0);

        for (let i = 0; i < 5; i++) {
            GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_5, Vector.blockToWorldSpace(new Vector(3 + i * 6, 79))), -1);
            GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_4, Vector.blockToWorldSpace(new Vector(1 + i * 4, 79))), -1);
            GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_3, Vector.blockToWorldSpace(new Vector(4 + i * 7, 79))), -1);
            GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_5, Vector.blockToWorldSpace(new Vector(80 + i * 6, 98))), -1);
            GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_4, Vector.blockToWorldSpace(new Vector(70 + i * 4, 98))), -1);
            GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_3, Vector.blockToWorldSpace(new Vector(75 + i * 7, 98))), -1);
        }

        let pos = new Vector(10, 10);
        GAME.addEntity(new Miner(Vector.blockToWorldSpace(new Vector(13, 12)), new Conversation(getAllConversationArrays().village.miner.greeting)));

        GAME.addEntity(new AmmoDrop(
            Vector.blockToWorldSpace(new Vector(65, 84)),
            AmmoDrop.BOMB,
            3,
            false
        ));
        GAME.addEntity(new AmmoDrop(
            Vector.blockToWorldSpace(new Vector(84, 85)),
            AmmoDrop.SLIMEBALL,
            2,
            false
        ));

        GAME.addEntity(new AmmoDrop(
            Vector.blockToWorldSpace(new Vector(2, 55)),
            AmmoDrop.SLIMEBALL,
            3,
            false
        ));
        GAME.addEntity(new AmmoDrop(
            Vector.blockToWorldSpace(new Vector(99, 43)),
            AmmoDrop.SLIMEBALL,
            3,
            false
        ));
        GAME.addEntity(new FoodDrop(
            Vector.blockToWorldSpace(new Vector(15, 55)),
            FoodDrop.CHICKEN,
            1,
            false
        ));
        GAME.addEntity(new FoodDrop(
            Vector.blockToWorldSpace(new Vector(58, 36)),
            FoodDrop.BEEF,
            1,
            false
        ));
        GAME.addEntity(new FoodDrop(
            Vector.blockToWorldSpace(new Vector(2, 75)),
            FoodDrop.CHICKEN,
            1,
            false
        ));
        GAME.addEntity(new FoodDrop(
            Vector.blockToWorldSpace(new Vector(83, 35)),
            FoodDrop.BURGER,
            1,
            false
        ));
        GAME.addEntity(new FoodDrop(
            Vector.blockToWorldSpace(new Vector(51, 1)),
            FoodDrop.ENERGY_DRINK,
            1,
            false
        ));
        GAME.addEntity(new FoodDrop(
            Vector.blockToWorldSpace(new Vector(96, 34)),
            FoodDrop.ENERGY_DRINK,
            1,
            false
        ));
        GAME.addEntity(new AmmoDrop(
            Vector.blockToWorldSpace(new Vector(50, 2)),
            AmmoDrop.SLIMEBALL,
            8,
            false
        ));
        for (let i = 0; i < 15; i++) {
            GAME.addEntity(new AmmoDrop(
                Vector.blockToWorldSpace(new Vector(1 + i * .25, 75)),
                AmmoDrop.ROCK,
                1,
                true
            ));;
            GAME.addEntity(new AmmoDrop(
                Vector.blockToWorldSpace(new Vector(1 + i * .25, 77.5)),
                AmmoDrop.ROCK,
                1,
                false
            ));

        }
        TilemapInterpreter.setTilemap(caveTilemap);

        if (LAST_ZONE === null) { // Coming from mountain.

            // Set spawn point on the right.
            const blockPos = pos;
            CHAD.pos = Vector.blockToWorldSpace(blockPos);
        }
        if (LAST_ZONE.equals(Zone.getZones().mountain.slope2)) { // Coming from mountain.

            // Set spawn point on the right.
            const blockPos = new Vector(ZONE.MIN_BLOCK.x, 10);
            CHAD.pos = Vector.blockToWorldSpace(blockPos);
        } else if (LAST_ZONE.equals(Zone.getZones().cave.insideCave2)) { // Coming from mountain.

            // Set spawn point on the right.
            const blockPos = new Vector(ZONE.MAX_BLOCK.x - 2, 94);
            CHAD.pos = Vector.blockToWorldSpace(blockPos);
        }
    };

    setTimeout(() => {
        ASSET_MGR.playMusic(MUSIC.LAVA_UNDERGROUND.path, MUSIC.LAVA_UNDERGROUND.volume);
    }, 500);

    queueAssets();
    ASSET_MGR.downloadAll(addEntities);
};

const loadCave2 = () => {
    const queueAssets = () => {
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.lighting.LANTERN.SPRITESHEET);

        ASSET_MGR.queueDownload(Precipitation.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.crystals.CRYSTALS_1.SPRITESHEET);

        ASSET_MGR.queueDownload(Decoration.DECORATIONS.crystals.CRYSTALS_2.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.crystals.CRYSTALS_3.SPRITESHEET);

        ASSET_MGR.queueDownload(Decoration.DECORATIONS.crystals.CRYSTALS_4.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.crystals.CRYSTALS_5.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.crystals.CRYSTALS_6.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.crystals.CRYSTALS_11.SPRITESHEET);


        // Miners
        ASSET_MGR.queueDownload(Bird.SPRITESHEET);
        ASSET_MGR.queueDownload(Bunny.SPRITESHEET);
        ASSET_MGR.queueDownload(Snake.SPRITESHEET);
        ASSET_MGR.queueDownload(DrillBot.SPRITESHEET);


        ASSET_MGR.queueDownload(MUSIC.LAVA_NORMAL.path);
    };

    const addEntities = () => {
        GAME.addEntity(new Border(
            new Vector(ZONE.MIN_PT.x, 0),
            new Vector(1, ZONE.PIXEL_SIZE.y),
            Zone.getZones().cave.insideCave1
        ));

        BG_COLOR = COLORS.DARK_CAVE_PURPLE;


        // for (let i = -1; i < 10; i++) {
        //     for (let j = -1; j < 11; j++) {
        //         GAME.addEntity(new Decoration(Decoration.DECORATIONS.lighting.DARK, Vector.blockToWorldSpace(new Vector(i * 10, j * 10))), 1);

        //     }
        // }
        const yLanternOffset = -13;
        const xLanternOffset = 3;

        GAME.addEntity(new Block(new Vector(9 + xLanternOffset, 29 + yLanternOffset), Block.CAVE_2));
        GAME.addEntity(new Block(new Vector(9 + xLanternOffset, 29 + yLanternOffset), Block.CAVE_2), 1);
        GAME.addEntity(new Block(new Vector(10 + xLanternOffset, 29 + yLanternOffset), Block.CAVE_2));
        GAME.addEntity(new Block(new Vector(10 + xLanternOffset, 29 + yLanternOffset), Block.CAVE_2), 1);
        GAME.addEntity(new Block(new Vector(30 + xLanternOffset, 29 + yLanternOffset), Block.CAVE_2));
        GAME.addEntity(new Block(new Vector(30 + xLanternOffset, 29 + yLanternOffset), Block.CAVE_2), 1);
        GAME.addEntity(new Block(new Vector(31 + xLanternOffset, 29 + yLanternOffset), Block.CAVE_2));
        GAME.addEntity(new Block(new Vector(31 + xLanternOffset, 29 + yLanternOffset), Block.CAVE_2), 1);
        GAME.addEntity(new Block(new Vector(40 + xLanternOffset, 27 + yLanternOffset), Block.CAVE_2));
        GAME.addEntity(new Block(new Vector(40 + xLanternOffset, 27 + yLanternOffset), Block.CAVE_2), 1);
        GAME.addEntity(new Block(new Vector(41 + xLanternOffset, 27 + yLanternOffset), Block.CAVE_2));
        GAME.addEntity(new Block(new Vector(41 + xLanternOffset, 27 + yLanternOffset), Block.CAVE_2), 1);
        GAME.addEntity(new Block(new Vector(13 + xLanternOffset, 23 + yLanternOffset), Block.CAVE_2));
        GAME.addEntity(new Block(new Vector(13 + xLanternOffset, 23 + yLanternOffset), Block.CAVE_2), 1);
        GAME.addEntity(new Block(new Vector(14 + xLanternOffset, 23 + yLanternOffset), Block.CAVE_2));
        GAME.addEntity(new Block(new Vector(14 + xLanternOffset, 23 + yLanternOffset), Block.CAVE_2), 1);

        for (let i = 5; i < 10; i++) {
            let lanternX = i * 10 - 40;
            let lanternY = 53;
            GAME.addEntity(new Block(new Vector(lanternX + xLanternOffset, lanternY + yLanternOffset), Block.CAVE_2));
            GAME.addEntity(new Block(new Vector(lanternX + xLanternOffset, lanternY + yLanternOffset), Block.CAVE_2), 1);
            GAME.addEntity(new Block(new Vector(lanternX + 1 + xLanternOffset, lanternY + yLanternOffset), Block.CAVE_2));
            GAME.addEntity(new Block(new Vector(lanternX + 1 + xLanternOffset, lanternY + yLanternOffset), Block.CAVE_2), 1);
            GAME.addEntity(new Decoration(Decoration.DECORATIONS.lighting.LANTERN, Vector.blockToWorldSpace(new Vector(lanternX, lanternY))), 1);

        }
        GAME.addEntity(new AmmoDrop(
            Vector.blockToWorldSpace(new Vector(60, 8)),
            AmmoDrop.SLIMEBALL,
            5,
            false
        ));

        GAME.addEntity(new AmmoDrop(
            Vector.blockToWorldSpace(new Vector(55, 34)),
            AmmoDrop.BOMB,
            2,
            false
        ));

        GAME.addEntity(new AmmoDrop(
            Vector.blockToWorldSpace(new Vector(50, 25)),
            AmmoDrop.BOMB,
            3,
            false
        ));

        GAME.addEntity(new FoodDrop(
            Vector.blockToWorldSpace(new Vector(49, 10)),
            FoodDrop.STEAK,
            5,
            false
        ));
        for (let i = 5; i < 20; i++) {
            GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_11, Vector.blockToWorldSpace(new Vector(i * 12, 51))));
            GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_8, Vector.blockToWorldSpace(new Vector(i * 12 + 5, 51))));


        }
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_1, Vector.blockToWorldSpace(new Vector(92, 51))));
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_9, Vector.blockToWorldSpace(new Vector(80, 48))));
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_8, Vector.blockToWorldSpace(new Vector(82, 48))));
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_10, Vector.blockToWorldSpace(new Vector(83, 48))));

        GAME.addEntity(new Decoration(Decoration.DECORATIONS.lighting.LANTERN, Vector.blockToWorldSpace(new Vector(9, 29))), 1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.lighting.LANTERN, Vector.blockToWorldSpace(new Vector(30, 29))), 1);

        GAME.addEntity(new Decoration(Decoration.DECORATIONS.lighting.LANTERN, Vector.blockToWorldSpace(new Vector(13, 23))), 1);

        GAME.addEntity(new Decoration(Decoration.DECORATIONS.lighting.LANTERN, Vector.blockToWorldSpace(new Vector(30, 29))), 1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.lighting.LANTERN, Vector.blockToWorldSpace(new Vector(40, 27))), 1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_2, Vector.blockToWorldSpace(new Vector(50, 50))));

        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_1, Vector.blockToWorldSpace(new Vector(0, 50))));
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_4, Vector.blockToWorldSpace(new Vector(0, 29))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_5, Vector.blockToWorldSpace(new Vector(2, 31))), 1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_6, Vector.blockToWorldSpace(new Vector(5, 33))), 0);

        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_7, Vector.blockToWorldSpace(new Vector(25, 48))));
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_8, Vector.blockToWorldSpace(new Vector(30, 48))));
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_9, Vector.blockToWorldSpace(new Vector(28, 48))));
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_10, Vector.blockToWorldSpace(new Vector(40, 48))));
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_11, Vector.blockToWorldSpace(new Vector(20, 51))));

        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_11, Vector.blockToWorldSpace(new Vector(10, 29))));
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_9, Vector.blockToWorldSpace(new Vector(20, 20))));

        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_10, Vector.blockToWorldSpace(new Vector(20, 36))));
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_5, Vector.blockToWorldSpace(new Vector(25, 20))));
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_4, Vector.blockToWorldSpace(new Vector(25, 20))));

        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_4, Vector.blockToWorldSpace(new Vector(24, 20))));
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_4, Vector.blockToWorldSpace(new Vector(12, 16))));
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_3, Vector.blockToWorldSpace(new Vector(11, 16))));

        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_5, Vector.blockToWorldSpace(new Vector(81, 22))));
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_5, Vector.blockToWorldSpace(new Vector(75, 20))));
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_4, Vector.blockToWorldSpace(new Vector(74, 20))));
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_3, Vector.blockToWorldSpace(new Vector(71, 20))));
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_4, Vector.blockToWorldSpace(new Vector(86, 17))));
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_4, Vector.blockToWorldSpace(new Vector(87, 17))));
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_6, Vector.blockToWorldSpace(new Vector(90, 17))));
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_5, Vector.blockToWorldSpace(new Vector(90, 17))));
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_4, Vector.blockToWorldSpace(new Vector(85, 31))));
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_6, Vector.blockToWorldSpace(new Vector(86, 31))));
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_5, Vector.blockToWorldSpace(new Vector(86, 31))));

        TilemapInterpreter.setTilemap(cave_2_tilemap);

        const portal2Coordinates = new Vector(82, 44);
        let botPortal = new Portal(portal2Coordinates, Portal.YELLOW);
        botPortal.fillWithEnemies([
            new DrillBot(Vector.blockToWorldSpace(portal2Coordinates)),
            new OverseerBot(Vector.blockToWorldSpace(portal2Coordinates), FlyingEnemyBase.LEFT_AND_RIGHT),
            new OverseerBot(Vector.blockToWorldSpace(portal2Coordinates), FlyingEnemyBase.UP_AND_DOWN),
            new OculiBot(Vector.blockToWorldSpace(portal2Coordinates), FlyingEnemyBase.CIRCLE),
        ]);
        GAME.addEntity(botPortal);
        let transportPortal = new TransportPortal(new Vector(94, 44), Portal.PURPLE);
        GAME.addEntity(transportPortal);

        transportPortal.activate(); // TODO only activate after necessary bots are killed

        // Temp for testing out fights.
        // Adding these to the current zone seems to also add them to the other cave zone if you travel to that zone.
        // May be due to timeout.
        let timeDelayMultiplier = 1;
        // setTimeout(() => {
        //     for (let i = -8; i < 50; i++) {
        //         timeDelayMultiplier++;
        //         setTimeout(() => {
        //             GAME.addEntity(new DrillBot(Vector.blockToWorldSpace(new Vector(80 + i, 44))));
        //         }, 750 + timeDelayMultiplier * 250);

        //     }
        // }, 1000);

        if (LAST_ZONE === null) { // Coming from mountain.
            const blockPos = new Vector(ZONE.MIN_BLOCK.x + 92, 45);
            CHAD.pos = Vector.blockToWorldSpace(blockPos);
        } else if (LAST_ZONE.equals(Zone.getZones().cave.insideCave1)) { // Coming from mountain.
            const blockPos = new Vector(ZONE.MIN_BLOCK.x, 25);
            CHAD.pos = Vector.blockToWorldSpace(blockPos);
        } else if (LAST_ZONE.equals(Zone.getZones().end.endZone)) { // Coming from mountain.
            const blockPos = new Vector(ZONE.MAX_BLOCK.x - 11, 45);
            CHAD.pos = Vector.blockToWorldSpace(blockPos);
        }
    };

    setTimeout(() => {
        ASSET_MGR.playMusic(MUSIC.LAVA_NORMAL.path, MUSIC.LAVA_NORMAL.volume);
    }, 500);

    queueAssets();
    ASSET_MGR.downloadAll(addEntities);
};
