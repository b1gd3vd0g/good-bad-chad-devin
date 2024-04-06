const loadEndZone = () => {
    const queueAssets = () => {
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.clouds.CLOUD_JUST_CLOUD.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.clouds.CLOUD_BUSHY.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.clouds.CLOUD_LANKY.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.clouds.CLOUD_JUST_CLOUD_DARK.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.clouds.CLOUD_BUSHY_DARK.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.clouds.CLOUD_LANKY_DARK.SPRITESHEET);
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
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.towers.TOWER_1.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.towers.TOWER_GROUP_1.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.towers.TOWER_GROUP_2.SPRITESHEET);

        ASSET_MGR.queueDownload(Decoration.DECORATIONS.trees.OAK_1.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.trees.SPRUCE_1.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.trees.MAGIC_TREE_1.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.trees.MAGIC_TREE_4.SPRITESHEET);

        ASSET_MGR.queueDownload(Precipitation.SPRITESHEET);
        // NPCs
        ASSET_MGR.queueDownload(BlackSmith.SPRITESHEET);
        ASSET_MGR.queueDownload(Mayor.SPRITESHEET);
        ASSET_MGR.queueDownload(PapaChad.SPRITESHEET);
        ASSET_MGR.queueDownload('./sprites/mama_chad_trapped.png');
        ASSET_MGR.queueDownload(Wizard.SPRITESHEET);

        ASSET_MGR.queueDownload(MUSIC.END.path);



    };

    const addEntities = () => {

        GAME.addEntity(new Border(
            new Vector(ZONE.MIN_PT.x, 0),
            new Vector(1, ZONE.PIXEL_SIZE.y),
            Zone.getZones().cave.insideCave2
        ));

        WeatherSystem.setWeather("rain", 5, "night", 33);
        // GAME.addEntity(new Decoration(Decoration.DECORATIONS.towers.TOWER_GROUP_2, Vector.blockToWorldSpace(new Vector(0, 50))), -1);
        // GAME.addEntity(new Decoration(Decoration.DECORATIONS.towers.TOWER_GROUP_2, Vector.blockToWorldSpace(new Vector(30, 48))), -1);
        // GAME.addEntity(new Decoration(Decoration.DECORATIONS.towers.TOWER_GROUP_2, Vector.blockToWorldSpace(new Vector(64, 48))), -1);

        // GAME.addEntity(new Decoration(Decoration.DECORATIONS.towers.TOWER_GROUP_2, Vector.blockToWorldSpace(new Vector(37.7, 55))), -1);
        // GAME.addEntity(new Decoration(Decoration.DECORATIONS.towers.TOWER_GROUP_2, Vector.blockToWorldSpace(new Vector(59, 55))), -1);

        // // GAME.addEntity(new Decoration(Decoration.DECORATIONS.towers.TOWER_GROUP_1, Vector.blockToWorldSpace(new Vector(15, 35))), -1);
        // GAME.addEntity(new Decoration(Decoration.DECORATIONS.towers.TOWER_1, Vector.blockToWorldSpace(new Vector(56, 67))), -1);

        // GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_4, Vector.blockToWorldSpace(new Vector(0, 30))), -1);
        // GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_4, Vector.blockToWorldSpace(new Vector(-6, 30))), -1);

        // GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_4, Vector.blockToWorldSpace(new Vector(10, 30))), -1);
        // GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_4, Vector.blockToWorldSpace(new Vector(15, 30))), -1);
        // GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_3, Vector.blockToWorldSpace(new Vector(29, 30))), -1);
        // GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_3, Vector.blockToWorldSpace(new Vector(35, 31))), -1);
        // GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_3, Vector.blockToWorldSpace(new Vector(40, 32))), -1);
        // GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.SPRUCE_3, Vector.blockToWorldSpace(new Vector(42, 33))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_2, Vector.blockToWorldSpace(new Vector(-6, 35))), -1);

        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_8, Vector.blockToWorldSpace(new Vector(1, 33))), -1);

        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_10, Vector.blockToWorldSpace(new Vector(5, 31))), -1);

        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_11, Vector.blockToWorldSpace(new Vector(7, 33.5))), -1);

        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_7, Vector.blockToWorldSpace(new Vector(15, 31.5))), -1);

        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_3, Vector.blockToWorldSpace(new Vector(20, 30))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_6, Vector.blockToWorldSpace(new Vector(20, 30.5))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_5, Vector.blockToWorldSpace(new Vector(20, 30.5))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_9, Vector.blockToWorldSpace(new Vector(20, 30.5))), -1);

        GAME.addEntity(new Decoration(Decoration.DECORATIONS.crystals.CRYSTALS_4, Vector.blockToWorldSpace(new Vector(28.52, 30))), -1);









        // Putting multiple trees together to make a combined larger tree.
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.MAGIC_TREE_3, Vector.blockToWorldSpace(new Vector(-5, 30))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.MAGIC_TREE_4, Vector.blockToWorldSpace(new Vector(-1, 30))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.MAGIC_TREE_2, Vector.blockToWorldSpace(new Vector(1, 30))), -1);

        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.MAGIC_TREE_2, Vector.blockToWorldSpace(new Vector(6, 30))), -1);

        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.MAGIC_TREE_1, Vector.blockToWorldSpace(new Vector(12, 30))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.MAGIC_TREE_2, Vector.blockToWorldSpace(new Vector(14, 30))), -1);


        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.MAGIC_TREE_6, Vector.blockToWorldSpace(new Vector(20, 30))), -1);

        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.MAGIC_TREE_3, Vector.blockToWorldSpace(new Vector(26, 31))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.MAGIC_TREE_4, Vector.blockToWorldSpace(new Vector(30, 31))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.MAGIC_TREE_2, Vector.blockToWorldSpace(new Vector(32, 31))), -1);

        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.MAGIC_TREE_1, Vector.blockToWorldSpace(new Vector(37, 32))), -1);

        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.MAGIC_TREE_2, Vector.blockToWorldSpace(new Vector(48, 34))), -1);

        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.MAGIC_TREE_3, Vector.blockToWorldSpace(new Vector(51, 35))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.MAGIC_TREE_4, Vector.blockToWorldSpace(new Vector(55, 35))), -1);
        GAME.addEntity(new Decoration(Decoration.DECORATIONS.trees.MAGIC_TREE_2, Vector.blockToWorldSpace(new Vector(57, 35))), -1);

        GAME.addEntity(new Portal(new Vector(-1, 26.5), Portal.PURPLE));

        TilemapInterpreter.setTilemap(end_tilemap);

        if (LAST_ZONE === null) { // Coming from mountain.
            const blockPos = new Vector(ZONE.MIN_BLOCK.x + 10, 25);
            CHAD.pos = Vector.blockToWorldSpace(blockPos);
        } else if (LAST_ZONE.equals(Zone.getZones().cave.insideCave2)) { // Coming from mountain.
            const blockPos = new Vector(ZONE.MIN_BLOCK.x, 26);
            CHAD.pos = Vector.blockToWorldSpace(blockPos);
        }

        // create portals

        // const portal1Coordinates = new Vector(63, 27);
        // const portal1 = new Portal(portal1Coordinates, Portal.YELLOW);
        // GAME.addEntity(portal1);
        // if (STORY.botsKilled < 20) {
        //     portal1.fillWithEnemies([new DrillBot(Vector.blockToWorldSpace(portal1Coordinates)),
        //     new DrillBot(Vector.blockToWorldSpace(portal1Coordinates)),
        //     new DrillBot(Vector.blockToWorldSpace(portal1Coordinates)),
        //     new DrillBot(Vector.blockToWorldSpace(portal1Coordinates)),
        //     new DrillBot(Vector.blockToWorldSpace(portal1Coordinates)),
        //     new DrillBot(Vector.blockToWorldSpace(portal1Coordinates)),
        //     new DrillBot(Vector.blockToWorldSpace(portal1Coordinates)),
        //     new DrillBot(Vector.blockToWorldSpace(portal1Coordinates)),
        //     new DrillBot(Vector.blockToWorldSpace(portal1Coordinates)),
        //     new DrillBot(Vector.blockToWorldSpace(portal1Coordinates)),
        //     ]);
        // }

        // const portal2Coordinates = new Vector(70, 23);
        // const portal2 = new Portal(portal2Coordinates, Portal.YELLOW);
        // GAME.addEntity(portal2);
        // if (STORY.botsKilled < 20) {
        //     portal2.fillWithEnemies([new DrillBot(Vector.blockToWorldSpace(portal2Coordinates)),
        //     new DrillBot(Vector.blockToWorldSpace(portal2Coordinates)),
        //     new DrillBot(Vector.blockToWorldSpace(portal2Coordinates)),
        //     new DrillBot(Vector.blockToWorldSpace(portal2Coordinates)),
        //     new DrillBot(Vector.blockToWorldSpace(portal2Coordinates)),
        //     new DrillBot(Vector.blockToWorldSpace(portal2Coordinates)),
        //     new DrillBot(Vector.blockToWorldSpace(portal2Coordinates)),
        //     new DrillBot(Vector.blockToWorldSpace(portal2Coordinates)),
        //     new DrillBot(Vector.blockToWorldSpace(portal2Coordinates)),
        //     new DrillBot(Vector.blockToWorldSpace(portal2Coordinates)),
        //     ]);
        // }
        GAME.addEntity(new Wizard(Vector.blockToWorldSpace(new Vector(85, 32)),
            null));
        GAME.addEntity(new MamaChad(Vector.blockToWorldSpace(new Vector(82, 25))));
        ASSET_MGR.playMusic(MUSIC.END.path, MUSIC.END.volume);

        setTimeout(() => {
        }, 1000);
    };

    queueAssets();
    ASSET_MGR.downloadAll(addEntities);
};