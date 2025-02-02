class SaveManager {
    constructor() {
        this.listening = false;
        // just attempt configuration.
        this.configureFromToken();
    }

    /** Clears the configuration to the defaults. */
    clearConfiguration() {
        this.player = null;
        this.saves = [];
        this.setScreen(new LoginScreen());
    }

    /** Sets the screen to be shown, ensuring to destroy the current screen first. */
    setScreen(screen) {
        // if the screen has already been set, make sure you destroy it before
        // replacing it.
        if (this.screen) {
            this.screen.destroy();
        }
        this.screen = screen;
    }

    /**
     * Sets the SaveManager to listen for events or not.
     * @param {boolean} listening True if it should listen; else false.
     */
    listen(listening = true) {
        this.listening = listening;
        console.log(
            `save manager is ${this.listening ? '' : 'not '}listening.`
        );
    }

    /**
     * Configures the save manager from the auth token, which ought to be located
     * in either localStorage or sessionStorage. In the absence of the token, or
     * in the case of failure (either fetching the player, or their saves),
     * it will clear the SaveManager's configuration completely.
     */
    async configureFromToken() {
        const token = SaveManager.getAuthToken();
        // clear configuration in absence of a token.
        if (!token) {
            this.clearConfiguration();
        } else {
            // there is a token stored. try to fetch the player.
            const tokenLogin = await PlayerFetch.fetchPlayerByToken();
            switch (tokenLogin.status) {
                case 200:
                    // success: configure this.player
                    this.player = tokenLogin.info;
                    break;
                default:
                    // failure: clear configuration.
                    this.pfFailure = tokenLogin.info;
                    console.error(this.pfFailure);
                    this.clearConfiguration();
            }
        }
        // I only wanna try getting saves if the player fetch was successful.
        if (this.player) {
            const savesFetch = await SaveFetch.fetchSavesByToken();
            switch (savesFetch.status) {
                case 200:
                case 404:
                    // success: configure saves.
                    this.saves = savesFetch.info;
                    break;
                default:
                    // failure: clear configuration
                    // NOTE: this does NOT include finding 0 saves (404 error)
                    // as a failure.
                    this.sfFailure = savesFetch.info;
                    console.error(this.sfFailure);
                    this.clearConfiguration();
            }
        }
        // now, IF it has been configured properly, we can change the screen.
        if (this.player) {
            console.log('SaveManager configured', this);
            // this also ensures that the listeners from the previous screen will be destroyed.
            this.setScreen(new PlayerScreen());
        }
    }

    static get TOKEN_KEY() {
        return 'player-auth-token';
    }

    /**
     * @returns the `player-auth-token` cookie, either from SessionStorage
     * or LocalStorage. If it does not exist in either place, return null.
     */
    static getAuthToken() {
        return (
            localStorage.getItem(SaveManager.TOKEN_KEY) ??
            sessionStorage.getItem(SaveManager.TOKEN_KEY)
        );
    }

    /**
     * Stores the auth token to either localStorage or sessionStorage, depending
     * on the `local` parameter.
     * @param {string} token The auth token to be stored.
     * @param {boolean} local True if it should be stored in localStorage; otherwise it
     *      will be stored in sessionStorage. Default: false.
     */
    static setPlayerAuthToken(token, local = false) {
        if (local) {
            sessionStorage.removeItem(SaveManager.TOKEN_KEY);
            localStorage.setItem(SaveManager.TOKEN_KEY, token);
        } else {
            localStorage.removeItem(SaveManager.TOKEN_KEY);
            sessionStorage.setItem(SaveManager.TOKEN_KEY, token);
        }
    }

    /**
     * Clears the player auth token from storage.
     */
    static clearPlayerAuthToken() {
        sessionStorage.removeItem(SaveManager.TOKEN_KEY);
        localStorage.removeItem(SaveManager.TOKEN_KEY);
    }

    static loadGameFromSave(save) {
        const {
            save_id,
            player,
            saved_at,
            zone,
            bunnies_killed,
            bots_killed,
            finished_hunting,
            hunting_inst_received,
            invited_hunting,
            slimes_killed,
            snakes_killed,
            tutorial_complete,
            village_attack_ended,
            bomb_count,
            broccoli_count,
            rock_count,
            slimeball_count,
            snowball_count,
            sus_snowball_count,
            water_balloon_count,
            bacon_count,
            beef_count,
            burger_count,
            chicken_count,
            energy_drink_count,
            ham_count,
            steak_count,
            rune_count,
            action,
            already_landed,
            bb_pos_x,
            bb_pos_y,
            bb_size_x,
            bb_size_y,
            can_dash,
            can_double_jump,
            damage_mult,
            dash_cooldown,
            dash_stop,
            facing,
            first_jump_timer,
            first_jump_vel,
            has_dashed,
            has_double_jumped,
            health,
            is_dashing,
            is_jumping,
            is_on_ground,
            lbb_pos_x,
            lbb_pos_y,
            lbb_size_x,
            lbb_size_y,
            max_health,
            pos_x,
            pos_y,
            prev_y_on_ground,
            scale_x,
            scale_y,
            scaled_size_x,
            scaled_size_y,
            second_jump_vel,
            speed,
            vel_x,
            vel_y
        } = save;

        // (1) LOAD THE ZONE.

        console.log(`attempting to load zone '${zone}'`);
        LAST_ZONE = ZONE;
        ZONE = Zone.getZoneByName(zone);
        SAVED_ZONE = ZONE;
        ZONE.load();
        setTimeout(() => {
            HUD.addComponents();
        }, 1000);
        console.log(ZONE);

        // (2) LOAD THE STORY.

        STORY.bunniesKilled = bunnies_killed;
        STORY.botsKilled = bots_killed;
        STORY.finishedHunting = finished_hunting;
        STORY.huntingInstructionsReceived = hunting_inst_received;
        STORY.invitedHunting = invited_hunting;
        STORY.slimesKilled = slimes_killed;
        STORY.snakesKilled = snakes_killed;
        STORY.tutorialComplete = tutorial_complete;
        STORY.villageAttackEnded = village_attack_ended;
        console.log(STORY);

        // (3) LOAD THE INVENTORY.

        // (3.1) load ammo
        const setAmmoTo = (amt, name) => {
            INVENTORY.adjustAmmo(name, amt - INVENTORY.getAmmo(name).amount);
        };
        setAmmoTo(bomb_count, AmmoItem.BOMB);
        setAmmoTo(broccoli_count, AmmoItem.BROCCOLI);
        setAmmoTo(rock_count, AmmoItem.ROCK);
        setAmmoTo(slimeball_count, AmmoItem.SLIMEBALL);
        setAmmoTo(snowball_count, AmmoItem.SNOWBALL);
        setAmmoTo(sus_snowball_count, AmmoItem.SUS_SNOWBALL);
        setAmmoTo(water_balloon_count, AmmoItem.WATER_BALLOON);
        console.log(INVENTORY.getAllAmmo());

        // (3.2) load food
        const setFoodTo = (amt, name) => {
            INVENTORY.adjustFood(name, amt - INVENTORY.getFood(name).amount);
        };
        setFoodTo(bacon_count, FoodItem.BACON);
        setFoodTo(beef_count, FoodItem.BEEF);
        setFoodTo(burger_count, FoodItem.BURGER);
        setFoodTo(chicken_count, FoodItem.CHICKEN);
        setFoodTo(energy_drink_count, FoodItem.ENERGY_DRINK);
        setFoodTo(ham_count, FoodItem.HAM);
        setFoodTo(steak_count, FoodItem.STEAK);
        console.log(INVENTORY.getAllFood());
        // (3.3) load runes
        INVENTORY.collectRunes(rune_count - INVENTORY.runes);
        console.log('runes ', INVENTORY.runes);

        // (4) LOAD CHAD.

        // (4.1) Position and size
        CHAD.pos = new Vector(pos_x, pos_y - 100);
        CHAD.scale = new Vector(scale_x, scale_y);
        CHAD.createBoundingBox();
        CHAD.lastBoundingBox = CHAD.boundingBox;

        // (4.2) Miscellaneous
        CHAD.action = action;
        CHAD.alreadyLanded = already_landed;
        CHAD.canDash = can_dash;
        CHAD.canDoubleJump = can_double_jump;
        CHAD.damageMultiplier = damage_mult;
        CHAD.dashCooldownTimer = dash_cooldown;
        CHAD.dashStopTimer = dash_stop;
        CHAD.facing = facing;
        CHAD.firstJumpTimer = first_jump_timer;
        CHAD.firstJumpVelocity = first_jump_vel;
        CHAD.hasDashed = has_dashed;
        CHAD.hasDoubleJumped = has_double_jumped;
        CHAD.health = health;
        CHAD.isDashing = is_dashing;
        CHAD.isJumping = is_jumping;
        CHAD.isOnGround = is_on_ground;
        CHAD.maxHealth = max_health;
        CHAD.prevYPosOnGround = prev_y_on_ground;
        CHAD.secondJumpVelocity = second_jump_vel;
        CHAD.speed = speed;
        CHAD.velocity = new Vector(vel_x, vel_y);
        console.log(CHAD);
        // this should be enough?? let's see.
    }

    draw() {
        CTX.fillColor = PauseMenu.BG_COLOR;
        this.screen.draw();
    }
}
