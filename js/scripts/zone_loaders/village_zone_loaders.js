const loadVillageCanyon = () => {
    const queueAssets = () => {};

    const addEntities = () => {};

    queueAssets();
    ASSET_MGR.downloadAll(addEntities);
};

const loadVillageField = () => {
    const queueAssets = () => {
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.clouds.CLOUD_JUST_CLOUD.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.clouds.CLOUD_BUSHY.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.clouds.CLOUD_LANKY.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.flowers.CARROT.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.flowers.MED_RED_FLOWER_1.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.flowers.POTATO.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.flowers.PRIDE_FLOWER_1.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.flowers.PRIDE_FLOWER_2.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.flowers.PRIDE_FLOWER_3.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.flowers.TALL_PURPLE_FLOWER_1.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.grass.GRASS_1.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.grass.GRASS_2.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.grass.GRASS_3.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.houses.BLACKSMITH_HOUSE.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.houses.CHAD_HOUSE.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.houses.MAYOR_HOUSE.SPRITESHEET
        );
        ASSET_MGR.queueDownload(Precipitation.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.trees.OAK_1.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.trees.OAK_2.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.trees.OAK_3.SPRITESHEET);
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.trees.SPRUCE_1.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.trees.SPRUCE_2.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.trees.SPRUCE_3.SPRITESHEET
        );

        ASSET_MGR.queueDownload(MUSIC.UPBEAT_CHIPTUNE_2.path);

        // NPCs
        ASSET_MGR.queueDownload(Bird.SPRITESHEET);
        ASSET_MGR.queueDownload(Bunny.SPRITESHEET);
        ASSET_MGR.queueDownload(Snake.SPRITESHEET);
    };

    const addEntities = () => {
        // Add a border to the right side of the map, leading to the village.
        GAME.addEntity(
            new Border(
                new Vector(ZONE.MAX_PT.x, 0),
                new Vector(1, ZONE.PIXEL_SIZE.y),
                Zone.getZones().village.main
            )
        );

        // Add a locked border to the western edge of the zone to prevent character from falling off the edge of the world.
        GAME.addEntity(
            new Border(
                new Vector(ZONE.MIN_PT.x - 1, 0),
                new Vector(1, ZONE.PIXEL_SIZE.y),
                null,
                true
            )
        );

        TilemapInterpreter.setTilemap(fieldTilemap);

        for (let x = ZONE.MIN_BLOCK.x; x <= ZONE.MAX_BLOCK.x; x++) {
            if (x % 3 == 0) {
                for (let i = 0; i < 5; i += 0.5) {
                    i += 0.5;
                    GAME.addEntity(
                        new Decoration(
                            Decoration.DECORATIONS.flowers.TALL_PURPLE_FLOWER_3,
                            Vector.blockToWorldSpace(new Vector(x + i, 20))
                        ),
                        0
                    );
                    i += 0.4;
                    GAME.addEntity(
                        new Decoration(
                            Decoration.DECORATIONS.flowers.PRIDE_FLOWER_4,
                            Vector.blockToWorldSpace(new Vector(x + i, 20))
                        ),
                        0
                    );
                    i += 0.35;

                    GAME.addEntity(
                        new Decoration(
                            Decoration.DECORATIONS.flowers.MED_RED_FLOWER_3,
                            Vector.blockToWorldSpace(new Vector(x + i, 20))
                        ),
                        0
                    );
                }
            }

            GAME.addEntity(
                new Decoration(
                    Decoration.DECORATIONS.grass.GRASS_1,
                    Vector.blockToWorldSpace(new Vector(x, 20))
                ),
                1
            );
            GAME.addEntity(
                new Decoration(
                    Decoration.DECORATIONS.grass.GRASS_3,
                    Vector.blockToWorldSpace(new Vector(x + 10, 20))
                ),
                -1
            );

            // Also, add a flower to the top of every block!
        }
        GAME.addEntity(
            new Snake(
                Vector.blockToWorldSpace(new Vector(50, aboveGroundLevel))
            )
        );
        GAME.addEntity(
            new Snake(
                Vector.blockToWorldSpace(new Vector(55, aboveGroundLevel))
            )
        );
        GAME.addEntity(
            new Snake(
                Vector.blockToWorldSpace(new Vector(53, aboveGroundLevel))
            )
        );
        GAME.addEntity(
            new Bunny(
                Vector.blockToWorldSpace(new Vector(60, aboveGroundLevel))
            )
        );
        GAME.addEntity(
            new Bunny(
                Vector.blockToWorldSpace(new Vector(65, aboveGroundLevel))
            )
        );
        GAME.addEntity(
            new Bunny(
                Vector.blockToWorldSpace(new Vector(70, aboveGroundLevel))
            )
        );

        // Spawn Chad.
        if (LAST_ZONE.equals(Zone.getZones().village.main)) {
            // Coming from mountain.
            // Set spawn point on the right.
            const blockPos = new Vector(
                ZONE.MAX_BLOCK.x - 3,
                aboveGroundLevel + 6.5
            );
            CHAD.pos = Vector.blockToWorldSpace(blockPos);
        }
    };
    let aboveGroundLevel = 10;
    WeatherSystem.setWeather('clouds', 2, 'day');

    if (STORY.invitedHunting) {
        GAME.addEntity(
            new PapaChad(
                new Vector(
                    ZONE.MAX_PT.x - 2 * PapaChad.SCALED_SIZE.x,
                    ZONE.MAX_PT.y - 14 * Block.SCALED_SIZE
                ),
                new Conversation(
                    getAllConversationArrays().village.papaChad.huntingInstruction
                )
            )
        );
    }

    GAME.addEntity(
        new AmmoDrop(
            Vector.blockToWorldSpace(new Vector(74, aboveGroundLevel - 2)),
            AmmoDrop.BOMB,
            3,
            false
        )
    );

    GAME.addEntity(
        new AmmoDrop(
            Vector.blockToWorldSpace(new Vector(78.5, aboveGroundLevel + 2)),
            AmmoDrop.ROCK,
            10,
            false
        )
    );

    GAME.addEntity(
        new AmmoDrop(
            Vector.blockToWorldSpace(new Vector(80, aboveGroundLevel + 2)),
            AmmoDrop.ROCK,
            5,
            false
        )
    );

    GAME.addEntity(
        new FoodDrop(
            Vector.blockToWorldSpace(new Vector(73, aboveGroundLevel + 4.7)),
            FoodDrop.BURGER,
            false
        )
    );

    GAME.addEntity(
        new FoodDrop(
            Vector.blockToWorldSpace(new Vector(5, aboveGroundLevel + 4), -1),
            FoodDrop.ROAST_TURKEY,
            false
        )
    );

    setTimeout(() => {
        ASSET_MGR.playMusic(
            MUSIC.UPBEAT_CHIPTUNE_2.path,
            MUSIC.UPBEAT_CHIPTUNE_2.volume
        );
    }, 500);

    queueAssets();
    ASSET_MGR.downloadAll(addEntities);
};

const loadVillageMain = () => {
    const queueAssets = () => {
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.clouds.CLOUD_JUST_CLOUD.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.clouds.CLOUD_BUSHY.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.clouds.CLOUD_LANKY.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.clouds.CLOUD_JUST_CLOUD_DARK.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.clouds.CLOUD_BUSHY_DARK.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.clouds.CLOUD_LANKY_DARK.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.flowers.CARROT.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.flowers.MED_RED_FLOWER_1.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.flowers.POTATO.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.flowers.PRIDE_FLOWER_1.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.flowers.TALL_PURPLE_FLOWER_1.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.grass.GRASS_1.SPRITESHEET
        );

        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.houses.BLACKSMITH_HOUSE.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.houses.CHAD_HOUSE.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.houses.MAYOR_HOUSE.SPRITESHEET
        );
        ASSET_MGR.queueDownload(Precipitation.SPRITESHEET);

        ASSET_MGR.queueDownload(Decoration.DECORATIONS.trees.OAK_1.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.trees.OAK_2.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.trees.OAK_3.SPRITESHEET);
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.trees.SPRUCE_1.SPRITESHEET
        );

        // ASSET_MGR.queueDownload(MUSIC.PEACEFUL_CHIPTUNE.path);
        ASSET_MGR.queueDownload(MUSIC.CHAD_PLAYFUL_ADVENTURE.path);
        ASSET_MGR.queueDownload(MUSIC.CHAD_VICTORIOUS_EMOTIONAL.path);
        ASSET_MGR.queueDownload(MUSIC.VILLAGE_ATTACK.path);

        // NPCs
        ASSET_MGR.queueDownload(BlackSmith.SPRITESHEET);
        ASSET_MGR.queueDownload(Mayor.SPRITESHEET);
        ASSET_MGR.queueDownload(PapaChad.SPRITESHEET);
        ASSET_MGR.queueDownload('./sprites/mama_chad_trapped.png');
        ASSET_MGR.queueDownload(Wizard.SPRITESHEET);
        ASSET_MGR.queueDownload(Slime.SPRITESHEET);

        ASSET_MGR.queueDownload(SFX.EVIL_LAUGH.path);
    };

    const addEntities = () => {
        // let groundLevel = 18;
        let aboveGroundLevel = 17;
        // let skyHeight = 14;
        let chadOnGround = 10;
        // Add a border to the right side of the map, leading to the field.
        GAME.addEntity(
            new Border(
                new Vector(ZONE.MIN_PT.x, 0),
                new Vector(1, ZONE.PIXEL_SIZE.y),
                Zone.getZones().village.field
            )
        );

        const easternBorderLocked = STORY.villageAttackEnded ? false : true;
        GAME.addEntity(
            new Border(
                new Vector(ZONE.MAX_PT.x, 0),
                new Vector(1, ZONE.PIXEL_SIZE.y),
                Zone.getZones().village.hillDownFromMain,
                easternBorderLocked
            )
        );

        TilemapInterpreter.setTilemap(villageMainTileMap, false);
        // NPCs

        GAME.addEntity(
            new Decoration(
                Decoration.DECORATIONS.houses.CHAD_HOUSE,
                Vector.blockToWorldSpace(new Vector(30, aboveGroundLevel))
            )
        );
        GAME.addEntity(
            new Decoration(
                Decoration.DECORATIONS.houses.MAYOR_HOUSE,
                Vector.blockToWorldSpace(new Vector(48, aboveGroundLevel))
            )
        );
        GAME.addEntity(
            new Decoration(
                Decoration.DECORATIONS.houses.BLACKSMITH_HOUSE,
                Vector.blockToWorldSpace(new Vector(13, aboveGroundLevel))
            )
        );
        GAME.addEntity(
            new Decoration(
                Decoration.DECORATIONS.houses.CHAD_HOUSE,
                Vector.blockToWorldSpace(new Vector(70, aboveGroundLevel))
            )
        );

        for (let i = 0; i < 18; i++) {
            if (i % 2 == 0) {
                GAME.addEntity(
                    new Decoration(
                        Decoration.DECORATIONS.flowers.POTATO,
                        Vector.blockToWorldSpace(
                            new Vector(27 + (i * 1) / 5, aboveGroundLevel)
                        )
                    ),
                    -1
                );
                GAME.addEntity(
                    new Decoration(
                        Decoration.DECORATIONS.flowers.POTATO,
                        Vector.blockToWorldSpace(
                            new Vector(27 + (i * 1) / 5, aboveGroundLevel)
                        )
                    ),
                    -1
                );
            } else {
                GAME.addEntity(
                    new Decoration(
                        Decoration.DECORATIONS.flowers.CARROT,
                        Vector.blockToWorldSpace(
                            new Vector(27 + (i * 1) / 5, aboveGroundLevel)
                        )
                    ),
                    -1
                );
                GAME.addEntity(
                    new Decoration(
                        Decoration.DECORATIONS.flowers.CARROT,
                        Vector.blockToWorldSpace(
                            new Vector(27 + (i * 1) / 5, aboveGroundLevel)
                        )
                    ),
                    -1
                );
            }
        }

        for (let i = 0; i < 5; i++) {
            GAME.addEntity(
                new Decoration(
                    Decoration.DECORATIONS.flowers.PRIDE_FLOWER_3,
                    Vector.blockToWorldSpace(
                        new Vector(49 + (i * 1) / 4, aboveGroundLevel)
                    )
                ),
                0
            );

            if (i % 2 == 0) {
                GAME.addEntity(
                    new Decoration(
                        Decoration.DECORATIONS.flowers.MED_RED_FLOWER_3,
                        Vector.blockToWorldSpace(
                            new Vector(55 + (i * 1) / 2, aboveGroundLevel)
                        )
                    ),
                    0
                );
                GAME.addEntity(
                    new Decoration(
                        Decoration.DECORATIONS.flowers.MED_RED_FLOWER_3,
                        Vector.blockToWorldSpace(
                            new Vector(51 + (i * 1) / 2, aboveGroundLevel)
                        )
                    ),
                    0
                );
            } else {
                GAME.addEntity(
                    new Decoration(
                        Decoration.DECORATIONS.flowers.TALL_PURPLE_FLOWER_3,
                        Vector.blockToWorldSpace(
                            new Vector(55 + (i * 1) / 2, aboveGroundLevel)
                        )
                    ),
                    0
                );
                GAME.addEntity(
                    new Decoration(
                        Decoration.DECORATIONS.flowers.TALL_PURPLE_FLOWER_3,
                        Vector.blockToWorldSpace(
                            new Vector(51 + (i * 1) / 2, aboveGroundLevel)
                        )
                    ),
                    0
                );
            }
        }

        for (let i = 0; i < 4; i++) {
            GAME.addEntity(
                new Decoration(
                    Decoration.DECORATIONS.flowers.TALL_PURPLE_FLOWER_3,
                    Vector.blockToWorldSpace(
                        new Vector(75 + (1 / 2) * i, aboveGroundLevel)
                    )
                ),
                0
            );
            GAME.addEntity(
                new Decoration(
                    Decoration.DECORATIONS.flowers.TALL_PURPLE_FLOWER_3,
                    Vector.blockToWorldSpace(
                        new Vector(71.5 + (1 / 2) * i, aboveGroundLevel)
                    )
                ),
                0
            );
        }

        GAME.addEntity(
            new Decoration(
                Decoration.DECORATIONS.trees.OAK_3,
                Vector.blockToWorldSpace(new Vector(8, aboveGroundLevel))
            ),
            -1
        );
        GAME.addEntity(
            new Decoration(
                Decoration.DECORATIONS.trees.OAK_1,
                Vector.blockToWorldSpace(new Vector(20, aboveGroundLevel))
            ),
            1
        );
        GAME.addEntity(
            new Decoration(
                Decoration.DECORATIONS.trees.OAK_3,
                Vector.blockToWorldSpace(new Vector(39, aboveGroundLevel))
            ),
            -1
        );
        GAME.addEntity(
            new Decoration(
                Decoration.DECORATIONS.trees.OAK_3,
                Vector.blockToWorldSpace(new Vector(55, aboveGroundLevel))
            ),
            -1
        );
        GAME.addEntity(
            new Decoration(
                Decoration.DECORATIONS.trees.SPRUCE_3,
                Vector.blockToWorldSpace(new Vector(76, aboveGroundLevel))
            )
        );
        GAME.addEntity(
            new Decoration(
                Decoration.DECORATIONS.trees.SPRUCE_3,
                Vector.blockToWorldSpace(new Vector(79, aboveGroundLevel))
            ),
            1
        );

        GAME.addEntity(
            new Decoration(
                Decoration.DECORATIONS.trees.SPRUCE_1,
                Vector.blockToWorldSpace(new Vector(82, aboveGroundLevel))
            )
        );
        GAME.addEntity(
            new Decoration(
                Decoration.DECORATIONS.trees.SPRUCE_2,
                Vector.blockToWorldSpace(new Vector(84, aboveGroundLevel))
            ),
            1
        );
        GAME.addEntity(
            new Decoration(
                Decoration.DECORATIONS.trees.SPRUCE_1,
                Vector.blockToWorldSpace(new Vector(87, aboveGroundLevel))
            )
        );

        /*
        The above content was all static. Below, there are conditional spawns/settings based on story progression.
        Namely, we need to script the village attack when the tutorial (snake/bunny hunt) is complete.
        */
        let weather = 'warm';
        if (!STORY.tutorialComplete) {
            if (GAME.mode == GameEngine.GAMEPLAY_MODE) {
                // if we've already clicked the start button, but we re-entered the village.
                setTimeout(() => {
                    ASSET_MGR.playMusic(
                        MUSIC.CHAD_PLAYFUL_ADVENTURE.path,
                        MUSIC.CHAD_PLAYFUL_ADVENTURE.volume
                    );
                }, 500);
            }

            GAME.addEntity(
                new RuneDrop(
                    Vector.blockToWorldSpace(
                        new Vector(46, aboveGroundLevel - 4)
                    ),
                    RuneDrop.GREEN,
                    false
                )
            );
            GAME.addEntity(
                new RuneDrop(
                    Vector.blockToWorldSpace(
                        new Vector(73, aboveGroundLevel - 4)
                    ),
                    RuneDrop.GRAY,
                    false
                )
            );

            GAME.addEntity(
                new RuneDrop(
                    Vector.blockToWorldSpace(
                        new Vector(93, aboveGroundLevel - 4)
                    ),
                    RuneDrop.WHITE,
                    false
                )
            );
            GAME.addEntity(
                new RuneDrop(
                    Vector.blockToWorldSpace(
                        new Vector(95, aboveGroundLevel - 3)
                    ),
                    RuneDrop.WHITE,
                    false
                )
            );
            GAME.addEntity(
                new RuneDrop(
                    Vector.blockToWorldSpace(
                        new Vector(97, aboveGroundLevel - 2)
                    ),
                    RuneDrop.WHITE,
                    false
                )
            );

            // NPCs
            const blockPosPapa = new Vector(33, chadOnGround);
            const blockPosBlackSmith = new Vector(17, chadOnGround);
            const blockPosMayor = new Vector(50, chadOnGround);
            const blockPosIdleMama = new Vector(37, chadOnGround);

            const idleMama = new MamaChad(
                Vector.blockToWorldSpace(blockPosIdleMama),
                false,
                new Conversation(
                    getAllConversationArrays().village.mamaChad.goodMorning
                )
            );
            idleMama.action = 'idle';

            if (!STORY.invitedHunting) {
                GAME.addEntity(
                    new PapaChad(
                        Vector.blockToWorldSpace(blockPosPapa),
                        new Conversation(
                            getAllConversationArrays().village.papaChad.huntingInvite
                        )
                    ),
                    0
                );
            }
            GAME.addEntity(
                new BlackSmith(
                    Vector.blockToWorldSpace(blockPosBlackSmith),
                    new Conversation(
                        getAllConversationArrays().village.blacksmith.merchant
                    )
                ),
                0
            );
            GAME.addEntity(
                new Mayor(
                    Vector.blockToWorldSpace(blockPosMayor),
                    new Conversation(
                        getAllConversationArrays().village.mayor.hopefulGreeting
                    )
                ),
                0
            );
            GAME.addEntity(idleMama);

            // These should not be here at the beginning of the game. (Devin)

            // GAME.addEntity(new OculiBot(Vector.blockToWorldSpace(
            //     new Vector(93, aboveGroundLevel - 4)),
            //     FlyingEnemyBase.SINE_WAVE
            // ));

            // GAME.addEntity(new OverseerBot(Vector.blockToWorldSpace(
            //     new Vector(95, aboveGroundLevel - 10)),
            //     FlyingEnemyBase.CIRCLE
            // ));
        } else if (STORY.ending) {
            console.log('ENDING TIME');
            ASSET_MGR.playMusic(
                MUSIC.CHAD_VICTORIOUS_EMOTIONAL.path,
                MUSIC.CHAD_VICTORIOUS_EMOTIONAL.volume
            );

            // NPCs
            const blockPosPapa = new Vector(62, chadOnGround + 3);
            const blockPosBlackSmith = new Vector(17, chadOnGround + 3);
            const blockPosMayor = new Vector(50, chadOnGround + 3);
            const blockPosIdleMama = new Vector(65, chadOnGround + 3);

            const idleMama = new MamaChad(
                Vector.blockToWorldSpace(blockPosIdleMama),
                false,
                new Conversation(
                    getAllConversationArrays().village.mamaChad.ending
                )
            );
            idleMama.action = 'idle';

            GAME.addEntity(
                new PapaChad(
                    Vector.blockToWorldSpace(blockPosPapa),
                    new Conversation(
                        getAllConversationArrays().village.papaChad.ending
                    )
                ),
                0
            );
            GAME.addEntity(
                new BlackSmith(
                    Vector.blockToWorldSpace(blockPosBlackSmith),
                    new Conversation(
                        getAllConversationArrays().village.blacksmith.ending
                    )
                ),
                0
            );
            GAME.addEntity(
                new Mayor(
                    Vector.blockToWorldSpace(blockPosMayor),
                    new Conversation(
                        getAllConversationArrays().village.mayor.ending
                    )
                ),
                0
            );
            GAME.addEntity(idleMama);

            for (let i = 0; i < 6; i++) {
                for (let j = 0; j < 3; j++) {
                    GAME.addEntity(
                        new RuneDrop(
                            Vector.blockToWorldSpace(
                                new Vector(75 + i, aboveGroundLevel - 2 - j)
                            ),
                            RuneDrop.YELLOW,
                            false
                        )
                    );
                }
            }
        } else {
            setTimeout(() => {
                ASSET_MGR.playMusic(
                    MUSIC.VILLAGE_ATTACK.path,
                    MUSIC.VILLAGE_ATTACK.volume
                );
                // ASSET_MGR.playMusic(MUSIC.PEACEFUL_CHIPTUNE.path, MUSIC.PEACEFUL_CHIPTUNE.volume);
            }, 500);

            // wizard has appeared, mama chad is trapped.
            const blockPosTrappedMama = new Vector(65, chadOnGround + 1);
            const blockPosWizard = new Vector(63, chadOnGround);
            GAME.addEntity(
                new MamaChad(Vector.blockToWorldSpace(blockPosTrappedMama))
            );
            GAME.addEntity(
                new Wizard(Vector.blockToWorldSpace(blockPosWizard))
            );
            if (STORY.tutorialComplete && !STORY.villageAttackEnded) {
                for (let blockx = 10; blockx < 60; blockx += 5) {
                    GAME.addEntity(
                        new Slime(
                            Vector.blockToWorldSpace(
                                new Vector(blockx, chadOnGround)
                            ),
                            Slime.EVIL
                        )
                    );
                }
            }
            weather = 'rain';
        }
        WeatherSystem.setWeather(weather, 3, 'day');
        TilemapInterpreter.setTilemap(villageMainTileMap);

        // Now, we've placed everything else - it's time to place CHAD!
        if (LAST_ZONE === null) {
            // We've just started the game.
            // Spawn in middle.
            const blockPos = new Vector(70, chadOnGround);
            CHAD.pos = Vector.blockToWorldSpace(blockPos);
            // console.log(CHAD.pos);
        } else if (LAST_ZONE.name === 'Village Field') {
            // Coming from field.
            // Set spawn point on the right.
            const blockPos = new Vector(ZONE.MIN_PT.x, chadOnGround + 5);
            CHAD.pos = Vector.blockToWorldSpace(blockPos);
        } else if (LAST_ZONE.name === 'Hill Down From Main') {
            // Coming from outside cave.
            // spawn on left.
            const blockPos = new Vector(98, 16);
            CHAD.pos = Vector.blockToWorldSpace(blockPos);
        }

        LoadingAnimation.stop();
    };

    LoadingAnimation.start();
    queueAssets();
    ASSET_MGR.downloadAll(addEntities);
};

const loadVillageMountain = () => {
    const queueAssets = () => {};

    const addEntities = () => {};

    queueAssets();
    ASSET_MGR.downloadAll(addEntities);
};

const loadHillDownFromMain = () => {
    const queueAssets = () => {
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.clouds.CLOUD_JUST_CLOUD.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.clouds.CLOUD_BUSHY.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.clouds.CLOUD_LANKY.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.clouds.CLOUD_JUST_CLOUD_DARK.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.clouds.CLOUD_BUSHY_DARK.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.clouds.CLOUD_LANKY_DARK.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.flowers.CARROT.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.flowers.MED_RED_FLOWER_1.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.flowers.POTATO.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.flowers.PRIDE_FLOWER_1.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.flowers.TALL_PURPLE_FLOWER_1.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.grass.GRASS_1.SPRITESHEET
        );

        ASSET_MGR.queueDownload(Precipitation.SPRITESHEET);

        ASSET_MGR.queueDownload(Decoration.DECORATIONS.trees.OAK_1.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.trees.OAK_2.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.trees.OAK_3.SPRITESHEET);
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.trees.SPRUCE_1.SPRITESHEET
        );
        ASSET_MGR.queueDownload(Bird.SPRITESHEET);
        ASSET_MGR.queueDownload(BlackSmith.SPRITESHEET);
        ASSET_MGR.queueDownload(Bunny.SPRITESHEET);
        ASSET_MGR.queueDownload(Snake.SPRITESHEET);

        // ASSET_MGR.queueDownload(MUSIC.CHAD_PLAYFUL_ADVENTURE.path);
        ASSET_MGR.queueDownload(MUSIC.PEACEFUL_CHIPTUNE.path);
    };

    const addEntities = () => {
        GAME.addEntity(
            new Border(
                new Vector(ZONE.MIN_PT.x, 0),
                new Vector(1, ZONE.PIXEL_SIZE.y),
                Zone.getZones().village.main
            )
        );

        GAME.addEntity(
            new Border(
                new Vector(ZONE.MAX_PT.x, 0),
                new Vector(1, ZONE.PIXEL_SIZE.y),
                Zone.getZones().village.woods
            )
        );
        TilemapInterpreter.setTilemap(hillDownFromMainTilemap);
        WeatherSystem.setWeather('rain', 3, 'day');

        GAME.addEntity(
            new Decoration(
                Decoration.DECORATIONS.trees.SPRUCE_1,
                Vector.blockToWorldSpace(new Vector(-3.5, 30))
            ),
            1
        );
        GAME.addEntity(
            new Decoration(
                Decoration.DECORATIONS.trees.SPRUCE_1,
                Vector.blockToWorldSpace(new Vector(-1.5, 30))
            ),
            -1
        );
        GAME.addEntity(
            new Decoration(
                Decoration.DECORATIONS.trees.SPRUCE_1,
                Vector.blockToWorldSpace(new Vector(1, 30))
            ),
            1
        );
        GAME.addEntity(
            new Decoration(
                Decoration.DECORATIONS.trees.SPRUCE_1,
                Vector.blockToWorldSpace(new Vector(7, 32))
            ),
            -1
        );
        GAME.addEntity(
            new Decoration(
                Decoration.DECORATIONS.trees.SPRUCE_1,
                Vector.blockToWorldSpace(new Vector(10, 34))
            ),
            -1
        );
        GAME.addEntity(
            new Decoration(
                Decoration.DECORATIONS.trees.SPRUCE_2,
                Vector.blockToWorldSpace(new Vector(20, 45))
            ),
            -1
        );
        const blockPosBlackSmith = new Vector(40, 40);
        GAME.addEntity(
            new BlackSmith(
                Vector.blockToWorldSpace(blockPosBlackSmith),
                new Conversation(
                    getAllConversationArrays().village.blacksmith.merchantScared
                )
            ),
            0
        );

        GAME.addEntity(
            new Decoration(
                Decoration.DECORATIONS.trees.SPRUCE_1,
                Vector.blockToWorldSpace(new Vector(72, 45))
            ),
            1
        );
        GAME.addEntity(
            new Decoration(
                Decoration.DECORATIONS.trees.SPRUCE_4,
                Vector.blockToWorldSpace(new Vector(70, 45))
            ),
            1
        );

        GAME.addEntity(
            new Decoration(
                Decoration.DECORATIONS.trees.SPRUCE_2,
                Vector.blockToWorldSpace(new Vector(65, 45))
            ),
            -1
        );
        GAME.addEntity(
            new Decoration(
                Decoration.DECORATIONS.trees.SPRUCE_4,
                Vector.blockToWorldSpace(new Vector(58, 45))
            ),
            1
        );
        GAME.addEntity(
            new Decoration(
                Decoration.DECORATIONS.trees.SPRUCE_4,
                Vector.blockToWorldSpace(new Vector(50, 45))
            ),
            1
        );

        GAME.addEntity(new Bunny(Vector.blockToWorldSpace(new Vector(70, 42))));
        GAME.addEntity(new Bunny(Vector.blockToWorldSpace(new Vector(40, 42))));
        GAME.addEntity(new Bunny(Vector.blockToWorldSpace(new Vector(41, 42))));

        // TODO add in birds.
        // for (let i = 0; i < 10000; i++) {
        //     GAME.addEntity(new Bird(ZONE.MIN_PT.x, i, ZONE.MAX_PT.x, ZONE.MAX_PT.y))

        // // }
        // GAME.addEntity(new FoodDrop(FoodDrop.CHICKEN, Vector.blockToWorldSpace(new Vector(8, 8))), -1);

        // GAME.addEntity(new FoodDrop(FoodDrop.ENERGY_DRINK, Vector.blockToWorldSpace(new Vector(49, 25))));
        // GAME.addEntity(new FoodDrop(FoodDrop.STEAK, Vector.blockToWorldSpace(new Vector(39, 37))));
        // GAME.addEntity(new FoodDrop(FoodDrop.CHICKEN, Vector.blockToWorldSpace(new Vector(61.6, 18.7))), -1);
        GAME.addEntity(
            new FoodDrop(
                Vector.blockToWorldSpace(new Vector(8, 8), -1),
                FoodDrop.CHICKEN,
                false
            )
        );

        GAME.addEntity(
            new FoodDrop(
                Vector.blockToWorldSpace(new Vector(49, 25)),
                FoodDrop.ENERGY_DRINK,
                false
            )
        );

        GAME.addEntity(
            new FoodDrop(
                Vector.blockToWorldSpace(new Vector(39, 37)),
                FoodDrop.STEAK,
                false
            )
        );
        GAME.addEntity(
            new FoodDrop(
                Vector.blockToWorldSpace(new Vector(61.6, 18.7), -1),
                FoodDrop.CHICKEN,
                false
            )
        );

        GAME.addEntity(
            new AmmoDrop(
                Vector.blockToWorldSpace(new Vector(51, 7.5), -1),
                AmmoDrop.ROCK,
                20,
                false
            )
        );

        for (let i = 0; i < 3; i++) {
            GAME.addEntity(
                new Decoration(
                    Decoration.DECORATIONS.flowers.TALL_PURPLE_FLOWER_3,
                    Vector.blockToWorldSpace(
                        new Vector(67 + 5 * (1 / 2) * i, 45)
                    )
                ),
                -1
            );
            GAME.addEntity(
                new Decoration(
                    Decoration.DECORATIONS.flowers.TALL_PURPLE_FLOWER_3,
                    Vector.blockToWorldSpace(
                        new Vector(71 + 2 * (1 / 2) * i, 45)
                    )
                ),
                1
            );
        }
        let cloudTypeLanky = Decoration.DECORATIONS.clouds.CLOUD_LANKY;
        let cloudTypeBushy = Decoration.DECORATIONS.clouds.CLOUD_BUSHY;
        let weatherType = 'rain';
        if (weatherType === 'rain') {
            cloudTypeLanky = Decoration.DECORATIONS.clouds.CLOUD_LANKY_DARK;
            cloudTypeBushy = Decoration.DECORATIONS.clouds.CLOUD_BUSHY_DARK;
        }
        GAME.addEntity(
            new Decoration(
                cloudTypeLanky,
                Vector.blockToWorldSpace(new Vector(8, 12))
            ),
            1
        );
        for (let i = 0; i < 3; i++) {
            GAME.addEntity(
                new Block(new Vector(8 + i, 10), Block.HIDDEN_BLOCK_CLOUD)
            );
        }
        GAME.addEntity(
            new Decoration(
                cloudTypeLanky,
                Vector.blockToWorldSpace(new Vector(60, 25))
            ),
            1
        );
        for (let i = 0; i < 3; i++) {
            GAME.addEntity(
                new Block(new Vector(60 + i, 23), Block.HIDDEN_BLOCK_CLOUD)
            );
        }
        GAME.addEntity(
            new Decoration(
                cloudTypeLanky,
                Vector.blockToWorldSpace(new Vector(65, 20))
            ),
            1
        );
        for (let i = 0; i < 3; i++) {
            GAME.addEntity(
                new Block(new Vector(65 + i, 18), Block.HIDDEN_BLOCK_CLOUD)
            );
        }
        GAME.addEntity(
            new Decoration(
                cloudTypeLanky,
                Vector.blockToWorldSpace(new Vector(55, 15))
            ),
            1
        );
        for (let i = 0; i < 3; i++) {
            GAME.addEntity(
                new Block(new Vector(55 + i, 13), Block.HIDDEN_BLOCK_CLOUD)
            );
        }
        GAME.addEntity(
            new Decoration(
                cloudTypeBushy,
                Vector.blockToWorldSpace(new Vector(50, 10))
            ),
            1
        );
        for (let i = 0; i < 3; i++) {
            GAME.addEntity(
                new Block(new Vector(50 + i, 8), Block.HIDDEN_BLOCK_CLOUD)
            );
        }

        if (LAST_ZONE.equals(Zone.getZones().village.main)) {
            // if (LAST_ZONE === null) { // Coming from main.
            // Set spawn point on the right.
            const blockPos = new Vector(1, 26);
            CHAD.pos = Vector.blockToWorldSpace(blockPos);
        } else if (LAST_ZONE.equals(Zone.getZones().village.main)) {
            // Coming from main.
            // Set spawn point on the right.
            const blockPos = new Vector(ZONE.MIN_PT.x, 26);
            CHAD.pos = Vector.blockToWorldSpace(blockPos);
        } else if (LAST_ZONE.equals(Zone.getZones().village.woods)) {
            // Coming from main.
            // Set spawn point on the right.
            const blockPos = new Vector(ZONE.MAX_BLOCK.x - 2, 41);
            CHAD.pos = Vector.blockToWorldSpace(blockPos);
        }
    };

    setTimeout(() => {
        // ASSET_MGR.playMusic(MUSIC.CHAD_PLAYFUL_ADVENTURE.path, MUSIC.CHAD_PLAYFUL_ADVENTURE.volume);
        ASSET_MGR.playMusic(
            MUSIC.PEACEFUL_CHIPTUNE.path,
            MUSIC.PEACEFUL_CHIPTUNE.volume
        );
    }, 500);

    queueAssets();
    ASSET_MGR.downloadAll(addEntities);
};

const loadWoods = () => {
    const queueAssets = () => {
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.clouds.CLOUD_JUST_CLOUD.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.clouds.CLOUD_BUSHY.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.clouds.CLOUD_LANKY.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.clouds.CLOUD_JUST_CLOUD_DARK.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.clouds.CLOUD_BUSHY_DARK.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.clouds.CLOUD_LANKY_DARK.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.flowers.CARROT.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.flowers.MED_RED_FLOWER_1.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.flowers.POTATO.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.flowers.PRIDE_FLOWER_1.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.flowers.PRIDE_FLOWER_2.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.flowers.PRIDE_FLOWER_3.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.flowers.TALL_PURPLE_FLOWER_1.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.grass.GRASS_1.SPRITESHEET
        );

        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.houses.BLACKSMITH_HOUSE.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.houses.CHAD_HOUSE.SPRITESHEET
        );
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.houses.MAYOR_HOUSE.SPRITESHEET
        );
        ASSET_MGR.queueDownload(Precipitation.SPRITESHEET);

        ASSET_MGR.queueDownload(Decoration.DECORATIONS.trees.OAK_1.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.trees.OAK_2.SPRITESHEET);
        ASSET_MGR.queueDownload(Decoration.DECORATIONS.trees.OAK_3.SPRITESHEET);
        ASSET_MGR.queueDownload(
            Decoration.DECORATIONS.trees.SPRUCE_1.SPRITESHEET
        );

        ASSET_MGR.queueDownload(Bird.SPRITESHEET);
        ASSET_MGR.queueDownload(Bunny.SPRITESHEET);
        ASSET_MGR.queueDownload(Snake.SPRITESHEET);
        ASSET_MGR.queueDownload(Slime.SPRITESHEET);

        ASSET_MGR.queueDownload(MUSIC.UPBEAT_CHIPTUNE_1.path);
    };

    const addEntities = () => {
        GAME.addEntity(
            new Border(
                new Vector(ZONE.MIN_PT.x, 0),
                new Vector(1, ZONE.PIXEL_SIZE.y),
                Zone.getZones().village.hillDownFromMain
            )
        );
        GAME.addEntity(
            new Border(
                new Vector(ZONE.MAX_PT.x, 0), // start at the far right side of the Zone, and at the top
                new Vector(1, ZONE.PIXEL_SIZE.y), // only one pixel wide, but as tall as the entire Zone.
                Zone.getZones().river.river1
                // Zone.getZones().mountain.slope1
            )
        );
        TilemapInterpreter.setTilemap(woodsTilemap);
        GAME.addEntity(new Bunny(Vector.blockToWorldSpace(new Vector(10, 18))));
        GAME.addEntity(new Bunny(Vector.blockToWorldSpace(new Vector(20, 18))));

        let distanceOffset = 1;
        for (let i = 0; i < 25; i++) {
            if (i % 5 == 0) {
                distanceOffset *= 5;
                GAME.addEntity(
                    new Bunny(
                        Vector.blockToWorldSpace(
                            new Vector(i + distanceOffset, 18)
                        )
                    )
                );
            }
            GAME.addEntity(
                new Snake(
                    Vector.blockToWorldSpace(
                        new Vector(i + distanceOffset + 50, 18)
                    )
                )
            );

            GAME.addEntity(
                new Slime(
                    Vector.blockToWorldSpace(
                        new Vector(i + distanceOffset + 25, 18)
                    )
                )
            );
        }
        WeatherSystem.setWeather('rain', 5, 'day', 22);
        for (let i = 0; i < 100; i++) {
            GAME.addEntity(
                new Decoration(
                    Decoration.DECORATIONS.trees.SPRUCE_1,
                    Vector.blockToWorldSpace(new Vector(i * 10, 20))
                ),
                -1
            );
            GAME.addEntity(
                new Decoration(
                    Decoration.DECORATIONS.trees.SPRUCE_3,
                    Vector.blockToWorldSpace(new Vector(i * 8, 20))
                ),
                -1
            );
            GAME.addEntity(
                new Decoration(
                    Decoration.DECORATIONS.flowers.CARROT,
                    Vector.blockToWorldSpace(new Vector(i * 9, 20))
                ),
                0
            );
            GAME.addEntity(
                new Decoration(
                    Decoration.DECORATIONS.flowers.POTATO,
                    Vector.blockToWorldSpace(new Vector(i * 11, 20))
                ),
                0
            );
        }
        let treeDistOffset = 0;
        let zLayer = 0;
        for (let i = 0; i < 150; i++) {
            // if (i % 5 == 0) {
            GAME.addEntity(
                new Decoration(
                    Decoration.DECORATIONS.trees.SPRUCE_4,
                    Vector.blockToWorldSpace(
                        new Vector(i * (i - treeDistOffset), 20)
                    )
                ),
                zLayer
            );
            GAME.addEntity(
                new Decoration(
                    Decoration.DECORATIONS.trees.SPRUCE_5,
                    Vector.blockToWorldSpace(
                        new Vector(i * (i - treeDistOffset - 15), 20)
                    )
                ),
                zLayer
            );
            GAME.addEntity(
                new Decoration(
                    Decoration.DECORATIONS.trees.SPRUCE_0,
                    Vector.blockToWorldSpace(
                        new Vector((i + 3.5) * (i - treeDistOffset), 20)
                    )
                ),
                1
            );
            GAME.addEntity(
                new Decoration(
                    Decoration.DECORATIONS.flowers.TALL_PURPLE_FLOWER_1,
                    Vector.blockToWorldSpace(
                        new Vector((i + 7.5) * (i - treeDistOffset), 20)
                    )
                ),
                0
            );
            GAME.addEntity(
                new Decoration(
                    Decoration.DECORATIONS.flowers.TALL_PURPLE_FLOWER_2,
                    Vector.blockToWorldSpace(
                        new Vector((i + 12) * (i - treeDistOffset), 20)
                    )
                ),
                zLayer
            );
            GAME.addEntity(
                new Decoration(
                    Decoration.DECORATIONS.grass.GRASS_1,
                    Vector.blockToWorldSpace(
                        new Vector((i + 12) * (i - treeDistOffset), 20)
                    )
                ),
                zLayer
            );
            GAME.addEntity(
                new Decoration(
                    Decoration.DECORATIONS.grass.GRASS_1,
                    Vector.blockToWorldSpace(
                        new Vector((i + 5) * (i - treeDistOffset), 20)
                    )
                ),
                zLayer
            );
            GAME.addEntity(
                new Decoration(
                    Decoration.DECORATIONS.grass.GRASS_1,
                    Vector.blockToWorldSpace(
                        new Vector((i + 2) * (i - treeDistOffset), 20)
                    )
                ),
                zLayer
            );
            GAME.addEntity(
                new Decoration(
                    Decoration.DECORATIONS.grass.GRASS_1,
                    Vector.blockToWorldSpace(
                        new Vector((i + 17) * (i - treeDistOffset), 20)
                    )
                ),
                zLayer
            );
        }

        if (LAST_ZONE.equals(Zone.getZones().village.hillDownFromMain)) {
            // Coming from main.
            // Set spawn point on the right.
            // if (LAST_ZONE === null) { // Coming from main.

            const blockPos = new Vector(1, 16);
            CHAD.pos = Vector.blockToWorldSpace(blockPos);
        } else if (LAST_ZONE.equals(Zone.getZones().river.river1)) {
            // Coming from main.
            // Set spawn point on the right.
            const blockPos = new Vector(ZONE.MAX_BLOCK.x - 2, 15);
            CHAD.pos = Vector.blockToWorldSpace(blockPos);
        } else if (LAST_ZONE.equals(Zone.getZones().mountain.slope1)) {
            // Coming from main.
            // Set spawn point on the right.
            const blockPos = new Vector(ZONE.MAX_BLOCK.x - 2, 15);
            CHAD.pos = Vector.blockToWorldSpace(blockPos);
        }

        setTimeout(() => {
            ASSET_MGR.playMusic(
                MUSIC.UPBEAT_CHIPTUNE_1.path,
                MUSIC.UPBEAT_CHIPTUNE_1.volume
            );
        }, 500);
    };

    queueAssets();
    ASSET_MGR.downloadAll(addEntities);
};

const loadVillageOutsideCave = () => {
    const queueAssets = () => {};

    const addEntities = () => {};

    queueAssets();
    ASSET_MGR.downloadAll(addEntities);
};
