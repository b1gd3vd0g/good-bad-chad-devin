const loadRiver = () => {
    const queueAssets = () => {

        // TODO don't forget to add in your water sprites.
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.clouds.CLOUD_JUST_CLOUD.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.clouds.CLOUD_BUSHY.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.clouds.CLOUD_LANKY.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.flowers.CARROT.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.flowers.MED_RED_FLOWER_1.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.flowers.POTATO.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.flowers.PRIDE_FLOWER_1.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.flowers.PRIDE_FLOWER_2.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.flowers.PRIDE_FLOWER_3.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.flowers.TALL_PURPLE_FLOWER_1.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.grass.GRASS_1.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.grass.GRASS_2.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.grass.GRASS_3.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.houses.BLACKSMITH_HOUSE.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.houses.CHAD_HOUSE.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.houses.MAYOR_HOUSE.SPRITESHEET);
        ASSET_MGR.queueDownload(Precipitation.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.trees.OAK_1.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.trees.OAK_2.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.trees.OAK_3.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.trees.SPRUCE_1.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.trees.SPRUCE_2.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.trees.SPRUCE_3.SPRITESHEET);
        ASSET_MGR.queueDownload(LiquidBlock.SPRITESHEET);
        ASSET_MGR.queueDownload(EelBoss.SPRITESHEET);
        ASSET_MGR.queueDownload(Eel.SPRITESHEET);

        // NPCs
        ASSET_MGR.queueDownload(Bird.SPRITESHEET);

        ASSET_MGR.queueDownload(MUSIC.RUSHING_WATER.path);
        ASSET_MGR.queueDownload(MUSIC.RIVER_BOSS.path);
    };

    const addEntities = () => {
        // Add a border to the right side of the map
        GAME.addEntity(new Border(
            new Vector(ZONE.MIN_PT.x, 0),
            new Vector(1, ZONE.PIXEL_SIZE.y),
            Zone.getZones().village.woods
        ));
        GAME.addEntity(new Border(
            new Vector(ZONE.MAX_PT.x, 0), // start at the far right side of the Zone, and at the top
            new Vector(1, ZONE.PIXEL_SIZE.y), // only one pixel wide, but as tall as the entire Zone.
            Zone.getZones().mountain.slope1
        ));

        // spread water in a line
        for (let i = 4; i < 54; i++) {
            // const worldPos = Vector.blockToWorldSpace(new Vector(i, 3));
            GAME.addEntity(new LiquidBlock(new Vector(i, 28), LiquidBlock.WATER));
        }

        for (let i = 67; i < 137; i++) {
            // const worldPos = Vector.blockToWorldSpace(new Vector(i, 3));
            GAME.addEntity(new LiquidBlock(new Vector(i, 28), LiquidBlock.WATER));
        }

        TilemapInterpreter.setTilemap(riverStartTilemap);

        if (LAST_ZONE.equals(Zone.getZones().village.woods)) { // Coming from mountain.
            // Set spawn point on the right.
            const blockPos = new Vector(ZONE.MIN_BLOCK.x, 21);
            CHAD.pos = Vector.blockToWorldSpace(blockPos);
        } else if (LAST_ZONE.equals(Zone.getZones().mountain.slope1)) { // Coming from main.
            // spawn on left.
            const blockPos = new Vector(ZONE.MAX_BLOCK.x - 2, 21);
            CHAD.pos = Vector.blockToWorldSpace(blockPos);
        }
    };

    // spawn a water balloon ammo drop
    GAME.addEntity(new AmmoDrop(
        Vector.blockToWorldSpace(new Vector(6, 27)),
        AmmoDrop.WATER_BALLOON,
        10,
        false
    ));

    // spawn a water balloon ammo drop
    GAME.addEntity(new AmmoDrop(
        Vector.blockToWorldSpace(new Vector(32, 27)),
        AmmoDrop.WATER_BALLOON,
        20,
        false
    ));

    GAME.addEntity(new Eel(Vector.blockToWorldSpace(new Vector(8.5, 29)), 500, 0, 8));
    GAME.addEntity(new Eel(Vector.blockToWorldSpace(new Vector(20.5, 29)), 700, 30, 10));
    GAME.addEntity(new Eel(Vector.blockToWorldSpace(new Vector(25.5, 29)), 700, -30, 12));

    GAME.addEntity(new EelBoss(Vector.blockToWorldSpace(new Vector(140, 10))));


    setTimeout(() => {
        ASSET_MGR.playMusic(MUSIC.RUSHING_WATER.path, MUSIC.RUSHING_WATER.volume);
    }, 500);
    

    // Set background color:
    BG_COLOR = COLORS.SKY_BLUE;
    GAME.addEntity(new Sun(new Vector(Camera.SIZE.x - 2 * Sun.SCALED_SIZE, Sun.SCALED_SIZE - 100), Sun.VILLAGE), -1);

    queueAssets();
    ASSET_MGR.downloadAll(addEntities);
};