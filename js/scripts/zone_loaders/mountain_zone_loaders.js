const loadMountainSlope1 = () => {
    const queueAssets = () => {
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.clouds.CLOUD_JUST_CLOUD_DARK.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.clouds.CLOUD_BUSHY_DARK.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.clouds.CLOUD_LANKY_DARK.SPRITESHEET);

        ASSET_MGR.queueDownload(Decoration.DECORATIONS.flowers.TALL_PURPLE_FLOWER_1.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.grass.GRASS_1.SPRITESHEET);

        ASSET_MGR.queueDownload(Decoration.DECORATIONS.trees.SPRUCE_1.SPRITESHEET);

        ASSET_MGR.queueDownload(Precipitation.SPRITESHEET);

        ASSET_MGR.queueDownload(MUSIC.MOUNTAIN_MYSTERIOUS.path);

    };

    const addEntities = () => {

        GAME.addEntity(new Border(
            new Vector(ZONE.MIN_PT.x, 0),
            new Vector(1, ZONE.PIXEL_SIZE.y),
            Zone.getZones().river.river1
            // Zone.getZones().village.woods
        ));
        GAME.addEntity(new Border(
            new Vector(0, 0),
            new Vector(ZONE.PIXEL_SIZE.x, 1),
            Zone.getZones().mountain.slope2
        ));
        const groundLevel = 92;

        WeatherSystem.setWeather("snow", 1, "day");
        TilemapInterpreter.setTilemap(mountainSlope1TileMap, false);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.grass.GRASS_2, Vector.blockToWorldSpace(new Vector(0, groundLevel))), 1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.grass.GRASS_2, Vector.blockToWorldSpace(new Vector(5, groundLevel))), 1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.grass.GRASS_3, Vector.blockToWorldSpace(new Vector(6, groundLevel))), 1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.grass.GRASS_2, Vector.blockToWorldSpace(new Vector(10, groundLevel - 1))), 1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.grass.GRASS_3, Vector.blockToWorldSpace(new Vector(13, groundLevel - 1))), 1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.grass.GRASS_2, Vector.blockToWorldSpace(new Vector(14, groundLevel - 1))), 1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.grass.GRASS_2, Vector.blockToWorldSpace(new Vector(17, groundLevel - 1))), 1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.grass.GRASS_3, Vector.blockToWorldSpace(new Vector(18, groundLevel - 1))), 1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.grass.GRASS_2, Vector.blockToWorldSpace(new Vector(19, groundLevel - 1))), 1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.grass.GRASS_3, Vector.blockToWorldSpace(new Vector(27, groundLevel))), 1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.grass.GRASS_2, Vector.blockToWorldSpace(new Vector(28, groundLevel))), 1);


        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_5, Vector.blockToWorldSpace(new Vector(-15, groundLevel))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_1, Vector.blockToWorldSpace(new Vector(5, groundLevel - 1))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_1, Vector.blockToWorldSpace(new Vector(18, groundLevel))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_1, Vector.blockToWorldSpace(new Vector(27, groundLevel))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_5, Vector.blockToWorldSpace(new Vector(0, groundLevel - 1))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_4, Vector.blockToWorldSpace(new Vector(12, groundLevel))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_2, Vector.blockToWorldSpace(new Vector(30.5, 82))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_2, Vector.blockToWorldSpace(new Vector(34, 77))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_3, Vector.blockToWorldSpace(new Vector(36, 77))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_3, Vector.blockToWorldSpace(new Vector(49.5, 53))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_2, Vector.blockToWorldSpace(new Vector(53.5, 47))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_3, Vector.blockToWorldSpace(new Vector(57, 41))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_2, Vector.blockToWorldSpace(new Vector(61, 38))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_1, Vector.blockToWorldSpace(new Vector(67, 34))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_2, Vector.blockToWorldSpace(new Vector(68.5, 33))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_3, Vector.blockToWorldSpace(new Vector(73.3, 23))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_2, Vector.blockToWorldSpace(new Vector(86.5, 4))), -1);


        if (LAST_ZONE && LAST_ZONE.equals(Zone.getZones().mountain.slope2)) { // Coming down the mounatin.
            const blockPos = new Vector(ZONE.MAX_BLOCK.x - 11, 0);
            CHAD.pos = Vector.blockToWorldSpace(blockPos);
        } else {
            const blockPos = new Vector(ZONE.MIN_BLOCK.x, groundLevel - 3);
            CHAD.pos = Vector.blockToWorldSpace(blockPos);
        }

        // add 8 snowball ammodrops
        GAME.addEntity(new AmmoDrop(Vector.blockToWorldSpace(new Vector(46, 75)), AmmoDrop.SNOWBALL, 8));
    };

    setTimeout(() => {
        ASSET_MGR.playMusic(MUSIC.MOUNTAIN_MYSTERIOUS.path, MUSIC.MOUNTAIN_MYSTERIOUS.volume);
    }, 500);

    queueAssets();
    ASSET_MGR.downloadAll(addEntities);
};

const loadMountainSlope2 = () => {
    const queueAssets = () => {
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.clouds.CLOUD_JUST_CLOUD_DARK.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.clouds.CLOUD_BUSHY_DARK.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.clouds.CLOUD_LANKY_DARK.SPRITESHEET);
        ASSET_MGR.queueDownload(BlackSmith.SPRITESHEET);

        ASSET_MGR.queueDownload(Decoration.DECORATIONS.trees.SPRUCE_1.SPRITESHEET);

        ASSET_MGR.queueDownload(Precipitation.SPRITESHEET);

        ASSET_MGR.queueDownload(Slime.SPRITESHEET);
        ASSET_MGR.queueDownload(Yeti.SPRITESHEET);

        ASSET_MGR.queueDownload(MUSIC.ICE.path);


    };

    const addEntities = () => {

        GAME.addEntity(new Border(
            new Vector(ZONE.MIN_PT.x, 0),
            new Vector(1, ZONE.PIXEL_SIZE.y),
            Zone.getZones().mountain.slope1
        ));
        GAME.addEntity(new Border(
            new Vector(ZONE.MAX_PT.x, 0),
            new Vector(1, ZONE.PIXEL_SIZE.y),
            Zone.getZones().cave.insideCave1
        ));

        TilemapInterpreter.setTilemap(mountainSlope2TileMap, false);
        GAME.addEntity(new Yeti(Vector.blockToWorldSpace(new Vector(45, 50))));

        GAME.addEntity(new Slime(Vector.blockToWorldSpace(new Vector(70, 60)), Slime.FROST));
        GAME.addEntity(new Slime(Vector.blockToWorldSpace(new Vector(72, 60)), Slime.FROST));
        GAME.addEntity(new Slime(Vector.blockToWorldSpace(new Vector(76, 60)), Slime.FROST));
        GAME.addEntity(new Slime(Vector.blockToWorldSpace(new Vector(76, 80)), Slime.FROST));
        GAME.addEntity(new Slime(Vector.blockToWorldSpace(new Vector(78, 80)), Slime.FROST));
        GAME.addEntity(new Slime(Vector.blockToWorldSpace(new Vector(80, 80)), Slime.FROST));

        GAME.addEntity(new Slime(Vector.blockToWorldSpace(new Vector(84, 50)), Slime.FROST));
        GAME.addEntity(new Slime(Vector.blockToWorldSpace(new Vector(95, 50)), Slime.FROST));

        GAME.addEntity(new Yeti(Vector.blockToWorldSpace(new Vector(87, 35))));

        GAME.addEntity(new Slime(Vector.blockToWorldSpace(new Vector(84, 32)), Slime.FROST));
        GAME.addEntity(new Slime(Vector.blockToWorldSpace(new Vector(90, 30)), Slime.FROST));
        WeatherSystem.setWeather("snow", 4, "day");

        const groundLevel = 90;

        const blockPosBlackSmith = new Vector(60, -50);
        GAME.addEntity(new BlackSmith(Vector.blockToWorldSpace(blockPosBlackSmith), new Conversation(getAllConversationArrays().village.blacksmith.merchantSnow)), 0);

        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_2, Vector.blockToWorldSpace(new Vector(0, groundLevel))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_2, Vector.blockToWorldSpace(new Vector(6.3, 79))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_2, Vector.blockToWorldSpace(new Vector(18, 63))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_3, Vector.blockToWorldSpace(new Vector(23, 63))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_1, Vector.blockToWorldSpace(new Vector(26, 63))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_3, Vector.blockToWorldSpace(new Vector(30, 62))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_2, Vector.blockToWorldSpace(new Vector(34, 62))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_1, Vector.blockToWorldSpace(new Vector(37, 62))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_2, Vector.blockToWorldSpace(new Vector(42, 63))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_3, Vector.blockToWorldSpace(new Vector(46, 63))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_2, Vector.blockToWorldSpace(new Vector(49, 64))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_2, Vector.blockToWorldSpace(new Vector(53, 64))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_3, Vector.blockToWorldSpace(new Vector(57, 64))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_1, Vector.blockToWorldSpace(new Vector(62, 64))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_2, Vector.blockToWorldSpace(new Vector(71, 25))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_3, Vector.blockToWorldSpace(new Vector(75, 25))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_2, Vector.blockToWorldSpace(new Vector(92, 25))), -1);
        GAME.addEntity(new FoodDrop(
            Vector.blockToWorldSpace(new Vector(67, 57)),
            FoodDrop.BURGER,
            false
        ));
        if ((LAST_ZONE && LAST_ZONE.equals(Zone.getZones().mountain.slope1) || LAST_ZONE === null)) { // Coming down the mounatin.
            // Set spawn point on the right.
            const blockPos = new Vector(ZONE.MIN_BLOCK.x + 1, 87);
            CHAD.pos = Vector.blockToWorldSpace(blockPos);
        } else {
            const blockPos = new Vector(ZONE.MAX_BLOCK.x - 2, 20);
            CHAD.pos = Vector.blockToWorldSpace(blockPos);
        }

        GAME.addEntity(new AmmoDrop(Vector.blockToWorldSpace(new Vector(25, 60)), AmmoDrop.SNOWBALL, 5, false));

    };

    setTimeout(() => {
        ASSET_MGR.playMusic(MUSIC.ICE.path, MUSIC.ICE.volume);
    }, 500);

    queueAssets();
    ASSET_MGR.downloadAll(addEntities);
};