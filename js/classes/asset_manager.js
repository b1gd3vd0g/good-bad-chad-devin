/**
 * This class is used to manage Assets (just sprites, for now).
 * It will download the assets and store them (in its cache) for use by other classes.
 * @author Seth Ladd (original), Chris Marriott (modified), Devin Peevy (added JSDoc, modified), Nathan Hinthorne (added audio support)
 */
class AssetManager {
    constructor() {
        /** How many filepaths have been successfully added to the cache as images. */
        this.successCount = 0;
        /** How many filepaths could not be added to the cache as images. */
        this.errorCount = 0;
        /** An associative array of downloaded assets. [filePath => img]. */
        this.downloadQueue = AssetManager.BAREBONES_DL_Q;
        /** An indexed array of filepaths which still need to be downloaded. */
        this.cache = [];
        /** The current background music */
        this.currentMusic = null;
    };

    /**
     * This method simply adds a filepath to the downloadQueue.
     */
    queueDownload(path) {
        // console.log("Queueing " + path);
        this.downloadQueue.push(path);
    };

    /**
     * @returns true if the AssetManager has put (or attempted to put) every Asset into the cache. 
     */
    isDone() {
        return this.downloadQueue.length === this.successCount + this.errorCount;
    };

    /**
     * This method is going to take all paths from the downloadQueue and actually download them into images or audio, which will be stored in
     * the cache. It updates successCount and errorCount appropriately as well.
     * @param {function} callback The function to be run AFTER downloadAll has finished executing.
     */
    downloadAll(callback) {
        if (this.downloadQueue.length === 0) setTimeout(callback, 10);
        for (let i = 0; i < this.downloadQueue.length; i++) {

            const path = this.downloadQueue[i];

            // make sure the path is a string
            if (typeof path !== 'string') {
                console.log("Error loading " + path + ": not a string");
            }

            const ext = path.substring(path.length - 3);

            switch (ext) {
                case 'jpg':
                case 'png':
                    const img = new Image();
                    img.addEventListener("load", () => {
                        // console.log("Loaded " + path);
                        this.successCount++;
                        if (this.isDone()) callback();
                    });

                    img.addEventListener("error", () => {
                        console.log("Error loading " + path);
                        this.errorCount++;
                        if (this.isDone()) callback();
                    });

                    img.src = path;
                    this.cache[path] = img;
                    break;

                case 'mp3':
                case 'wav':
                    const audio = new Audio();
                    audio.addEventListener("loadeddata", () => {
                        // console.log("Loaded " + path);
                        this.successCount++;
                        if (this.isDone()) callback();
                    });

                    audio.addEventListener("error", () => {
                        console.log("Error loading " + path);
                        this.errorCount++;
                        if (this.isDone()) callback();
                    });

                    audio.addEventListener("ended", () => {
                        audio.pause();
                        audio.currentTime = 0;
                    });

                    audio.src = path;
                    audio.load();

                    this.cache[path] = audio;
                    break;

                default:
                    console.log("Error loading " + path + ": unknown file extension");
                    this.errorCount++;
                    if (this.isDone()) callback();
            }
        }
    };

    /**
     * @param {string} path The filepath of the Asset you are trying to access.
     * @returns The image associated with the path in the cache (given that it has been successfully downloaded).
     */
    getAsset(path) {
        return this.cache[path];
    };

    /**
     * This refreshes the AssetManager to be like new. This is done upon loading a zone to keep down space waste.
     */
    refresh() {
        this.successCount = 0;
        this.errorCount = 0;
        this.downloadQueue = AssetManager.BAREBONES_DL_Q;
        this.cache = [];
    };

    /**
     * Plays the audio associated with the given path.
     * @param {string} path The filepath of the audio you are trying to play.
     * @param {number} volume The volume to which you want to set the audio.
     */
    playSFX(path, volume, loop = false) {
        const audio = this.cache[path];
        audio.currentTime = 0;
        audio.volume = volume;

        audio.play();
        if (loop) {
            audio.addEventListener("ended", () => {
                audio.play();
            });
        }
    };

    /**
     * Plays the audio associated with the given path.
     * @param {string} path The filepath of the audio you are trying to play.
     * @param {number} volume The volume to which you want to set the audio.
     */
    playMusic(path, volume, loop = true) {
        console.log("Playing music: " + path);
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
        }

        const audio = this.cache[path];
        console.log(audio);
        audio.currentTime = 0;
        audio.volume = volume;
        this.currentMusic = audio;

        audio.play();
        if (loop) {
            audio.addEventListener("ended", () => {
                audio.play();
            });
        }
    };

    /**
     * Pauses the currently playing background music.
     */
    pauseMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
            console.log("Music paused.");
        } else {
            console.log("No music to pause.");
        }
    }

    /**
     * Resumes the currently paused background music from where it left off.
     */
    resumeMusic() {
        if (this.currentMusic) {
            this.currentMusic.play();
            console.log("Music resumed.");
        } else {
            console.log("No music to resume.");
        }
    }

    /**
     * @param {string} path The filepath of the audio you are trying to check if it is playing.
     * @returns true if the audio associated with the given path is currently playing.
     */
    audioIsPlaying(path) {
        const audio = this.cache[path];
        return audio.currentTime != 0 && !audio.paused;
    }

    /**
     * Stops the audio associated with the given path.
     * @param {string} path The filepath of the audio you are trying to stop.
     */
    stopAudio(path) {
        console.log("Stopped audio: " + path);
        const audio = this.cache[path];
        audio.pause();
        audio.currentTime = 0;
    };

    /**
     * Stops all audio currently playing.
     */
    stopAllAudio() {
        for (let key in this.cache) {
            const audio = this.cache[key];
            if (audio instanceof Audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        }
    };

    /**
     * Stops all sound effects currently playing.
     * This is useful for stopping all sound effects when the game is paused.
     */
    stopAllSFX() {
        for (let key in this.cache) {
            const audio = this.cache[key];
            if (audio instanceof Audio && !audio.loop) {
                audio.pause();
                audio.currentTime = 0;
            }
        }
    }

    /** 
     * Sets the volume of all audio in the cache to the given volume.
     * @param {number} volume The volume to which you want to set the audio.
     */
    adjustVolume(volume) {
        for (let key in this.cache) {
            const audio = this.cache[key];
            if (audio instanceof Audio) {
                audio.volume = volume;
            }
        }
    };

    /**
     * The BAREBONES_DL_Q is an array of strings, filepaths to the most essential assets in our game.
     * Those so essential that it would be tedious and more error prone to have to load them in every zone.
     * this.downloadQueue is reset to this every time that the ASSET_MGR is refreshed.
     */
    static get BAREBONES_DL_Q() {
        return [
            // Entities:
            Block.SPRITESHEET,
            Chad.SPRITESHEET,
            DialogBubble.SPRITESHEET,
            OverheadIcon.SPRITESHEET,
            PapaChad.SPRITESHEET,
            Slingshot.SPRITESHEET,
            StartMenu.TITLE_SPRITESHEET,
            Sun.SPRITESHEET,
            Sword.SPRITESHEET,
            RuneDrop.SPRITESHEET,
            FoodDrop.SPRITESHEET,
            AmmoDrop.SPRITESHEET,
            DashCooldown.SPRITESHEET,
            Bomb.SPRITESHEET,
            Rock.SPRITESHEET,
            Rock.SPRITESHEET_EASTER_EGG,
            WaterBalloon.SPRITESHEET,

            // Sounds:
            SFX.JUMP1.path,
            SFX.JUMP2.path,
            SFX.LAND.path,
            SFX.SLINGSHOT_LAUNCH1.path,
            SFX.SLINGSHOT_LAUNCH2.path,
            SFX.SLINGSHOT_LAUNCH3.path,
            SFX.SLINGSHOT_LAUNCH4.path,
            SFX.SLINGSHOT_STRETCH.path,
            SFX.SWORD_SWING1.path,
            SFX.SWORD_SWING2.path,
            SFX.SWORD_SWING3.path,
            SFX.SWORD_SWING4.path,
            SFX.SWORD_SWING5.path,
            SFX.SWORD_SWING6.path,
            SFX.SWORD_SWING7.path,
            SFX.SWORD_SWING8.path,
            SFX.SWORD_SWING9.path,
            SFX.SWORD_SWING10.path,
            SFX.SWORD_HIT1.path,
            SFX.SWORD_HIT2.path,
            SFX.SWORD_HIT3.path,
            SFX.SWOOSH.path,
            SFX.RICOCHET1.path,
            SFX.RICOCHET2.path,
            SFX.RICOCHET3.path,
            SFX.RICOCHET4.path,
            SFX.EXPLOSION_SMALL.path,
            SFX.ITEM_EQUIP.path,
            SFX.ITEM_COLLECT1.path,
            SFX.ITEM_COLLECT2.path,
            SFX.ITEM_COLLECT3.path,
            SFX.GAME_OVER.path,
            SFX.UI_HIGH_BEEP.path,
            SFX.UI_GAMEBOY_BEEP.path,
            SFX.UI_SNAP.path,
            SFX.FOOD_EAT1.path,
            SFX.FOOD_EAT2.path,
            SFX.FOOD_EAT3.path,
            SFX.FOOD_EAT4.path,
            SFX.DING.path,
            SFX.MEGA_MUSHROOM.path,
            SFX.AMMO_COLLECT.path,
            SFX.COIN_COLLECT.path,
            Snowball.SPRITESHEET,
            SusSnowball.SPRITESHEET,
            Slimeball.SPRITESHEET,
            Slimeball.SPRITESHEET_EASTER_EGG,
            SFX.SLIME_SPLAT.path,
            Broccoli.SPRITESHEET,
            SFX.BLEH.path,
            SFX.WATER_BALLOON.path,


            //TEMPORARY
            SFX.GROWL1.path,
            SFX.GROWL2.path,
            SFX.SMASH1.path,
            SFX.SMASH2.path,
            SFX.SMASH3.path,
            Yeti.SPRITESHEET,
            SFX.SNOW_CRUNCH1.path,
            SFX.SNOW_CRUNCH2.path,
            SFX.ROBOT_DEATH1.path,
            SFX.ROBOT_DEATH2.path,
            SFX.ROBOT_DEATH3.path,
            DrillBot.SPRITESHEET,
            SFX.DRILL1.path,
            SFX.DRILL2.path,
            OverseerBot.SPRITESHEET,
            OculiBot.SPRITESHEET,
            Portal.SPRITESHEET,
            SFX.PORTAL_ACTIVATE.path,
            SFX.PORTAL_IDLE.path, 
            SFX.LASER_FIRE.path,
            Laser.SPRITESHEET,
            SFX.SONIC_WAVE.path,  
            SonicWave.SPRITESHEET, 
            SFX.MISSILE_LAUNCH.path,
            Missile.SPRITESHEET,
            SFX.EXPLOSION_BIG.path,
            SFX.SNAKE_HISS.path,
            SFX.LIFE_UP.path,

            // Music:
            DialogBubble.SPEAKERS.CHAD.spritesheet
        ];
    };
};

