/**
 * Class that represents the HUD and defines its components.
 *
 * @author Trae Claar
 * @author Nathan Hinthorne
 */
class Hud {
    /**
     * Constructor for the HUD that adds it components.
     */
    constructor() {
        this.componentListeners = [];
        this.addMouseListeners();
    }

    /** The default font size for text in the HUD. Certain components may use different font sizes. */
    static get TEXT_SIZE() {
        return 32;
    }

    /** The margin (in pixels) between HUD elements and the edge of the canvas. */
    static get MARGIN() {
        return 10;
    }

    /**
     * Switch the mouse icon to a crosshair.
     */
    swapToCrosshair() {
        const crosshairUnclicked =
            'url(./sprites/crosshair_unclicked.png) 16 16, auto';
        document.body.style.cursor = crosshairUnclicked;
    }

    /**
     * Switch the mouse icon to a pointer.
     */
    swapToPointer() {
        const pointerUnclicked =
            'url(./sprites/pointer_unclicked.png) 10 4, auto';
        document.body.style.cursor = pointerUnclicked;
    }

    /**
     * Add the mouse listeners for switching between pointers.
     */
    addMouseListeners() {
        document.body.addEventListener('mousedown', () => {
            if (GAME.running) {
                const crosshairClicked =
                    'url(../sprites/crosshair_clicked.png) 16 16, auto';
                document.body.style.cursor = crosshairClicked;
            } else {
                const pointerClicked =
                    'url(../sprites/pointer_clicked.png) 10 4, auto';
                document.body.style.cursor = pointerClicked;
                ASSET_MGR.playSFX(SFX.UI_SNAP.path, SFX.UI_SNAP.volume);
            }
        });

        document.body.addEventListener('mouseup', () => {
            if (GAME.running) {
                const crosshairUnclicked =
                    'url(../sprites/crosshair_unclicked.png) 16 16, auto';
                document.body.style.cursor = crosshairUnclicked;
            } else {
                const pointerUnclicked =
                    'url(../sprites/pointer_unclicked.png) 10 4, auto';
                document.body.style.cursor = pointerUnclicked;
            }
        });
    }

    // /**
    //  * Switch the mouse icon to a crosshair.
    //  */
    // swapToCrosshair() {
    //     document.body.classList.remove('pointer-cursor');
    //     document.body.classList.add('crosshair-cursor');
    // }

    // /**
    //  * Switch the mouse icon to a pointer.
    //  */
    // swapToPointer() {
    //     document.body.classList.remove('crosshair-cursor');
    //     document.body.classList.add('pointer-cursor');
    // }

    // /**
    //  * Add the mouse listeners for switching between pointers.
    //  */
    // addMouseListeners() {
    //     document.body.addEventListener('mousedown', () => {
    //         if (GAME.running) {
    //             document.body.classList.remove('crosshair-cursor-unclicked');
    //             document.body.classList.add('crosshair-cursor-clicked');
    //         } else {
    //             document.body.classList.remove('pointer-cursor-unclicked');
    //             document.body.classList.add('pointer-cursor-clicked');
    //             ASSET_MGR.playSFX(SFX.UI_SNAP.path, SFX.UI_SNAP.volume);
    //         }
    //     });

    //     document.body.addEventListener('mouseup', () => {
    //         if (GAME.running) {
    //             document.body.classList.remove('crosshair-cursor-clicked');
    //             document.body.classList.add('crosshair-cursor-unclicked');
    //             console.log("game stopped")
    //         } else {
    //             document.body.classList.remove('pointer-cursor-clicked');
    //             document.body.classList.add('pointer-cursor-unclicked');
    //             console.log("game continue")

    //         }
    //     });
    // }

    /**
     * Add a component to the HUD. Creates a field for the component and adds the component
     * to the game engine as an entity. This means that the component must have an update
     * and draw method.
     *
     * @param {string} name the component's name, used for its field identifier
     * @param {Component} component the component to add (must have update and draw methods)
     * @throws {Error} Will throw an error if component does not have an update and a draw method.
     */
    addComponent(name, component) {
        if (!component.update || !component.draw) {
            throw new Error(
                'Cannot add component: component must have update and draw methods.'
            );
        }
        this[name] = component;
        GAME.addEntity(component, 1);
    }

    /**
     * Initialize the HUD components.
     */
    addComponents() {
        // clean up leftover event listeners from old components
        this.componentListeners.forEach(([event, listener]) =>
            document.body.removeEventListener(event, listener)
        );

        // add Chad's head, rune counter, and health bar
        this.addComponent('chadHead', new ChadHead());
        const healthBarYPos = 15 + 17 * CHAD.scale.y;
        this.addComponent(
            'healthBar',
            new HudHealthBar(new Vector(Hud.MARGIN, healthBarYPos))
        );
        this.addComponent(
            'runeCounter',
            new ItemCounter(
                new Vector(
                    CHAD.scaledSize.x + 20,
                    (healthBarYPos - ItemCounter.HEIGHT) / 2
                ),
                new Animator(
                    RuneDrop.SPRITESHEET,
                    new Vector(0, 0),
                    RuneDrop.SIZE,
                    1,
                    1
                ),
                INVENTORY.runes
            )
        );

        // add pause button
        this.addComponent(
            'pauseButton',
            new PauseButton(
                new Vector(
                    Camera.SIZE.x - PauseButton.SIZE.x - Hud.MARGIN,
                    Hud.MARGIN
                )
            )
        );

        // add slingshot ammo hotbar
        const hotbarItemWidth = ItemLabel.DEFAULT_SIZE.x;
        const hotbarItemHeight = ItemLabel.DEFAULT_SIZE.y;
        const hotbarXStart = (Camera.SIZE.x - hotbarItemWidth * 5) / 2 - 100;
        const hotbarY = Camera.SIZE.y - ItemLabel.DEFAULT_SIZE.y - Hud.MARGIN;
        const hotbarItemCount = 7;

        // add ammo related things
        this.addComponent(
            'hotBarRectangle',
            new HotBarRectangle(
                hotbarXStart - HotBarRectangle.PADDING,
                hotbarY - HotBarRectangle.PADDING,
                (hotbarItemWidth + 4) * hotbarItemCount +
                    2 * HotBarRectangle.PADDING,
                hotbarItemHeight + 2 * HotBarRectangle.PADDING
            )
        );

        this.addComponent(
            'ammoRockLabel',
            new AmmoLabel(new Vector(hotbarXStart, hotbarY), AmmoItem.ROCK, '1')
        );
        this.addComponent(
            'ammoSlimeballLabel',
            new AmmoLabel(
                new Vector(hotbarXStart + hotbarItemWidth + 4, hotbarY),
                AmmoItem.SLIMEBALL,
                '2'
            )
        );
        this.addComponent(
            'ammoBombLabel',
            new AmmoLabel(
                new Vector(hotbarXStart + 2 * (hotbarItemWidth + 4), hotbarY),
                AmmoItem.BOMB,
                '3'
            )
        );
        this.addComponent(
            'ammoSnowballLabel',
            new AmmoLabel(
                new Vector(hotbarXStart + 3 * (hotbarItemWidth + 4), hotbarY),
                AmmoItem.SNOWBALL,
                '4'
            )
        );
        this.addComponent(
            'ammoSusSnowballLabel',
            new AmmoLabel(
                new Vector(hotbarXStart + 4 * (hotbarItemWidth + 4), hotbarY),
                AmmoItem.SUS_SNOWBALL,
                '5'
            )
        );
        this.addComponent(
            'ammoBroccoliLabel',
            new AmmoLabel(
                new Vector(hotbarXStart + 5 * (hotbarItemWidth + 4), hotbarY),
                AmmoItem.BROCCOLI,
                '6'
            )
        );
        this.addComponent(
            'ammoWaterBalloonLabel',
            new AmmoLabel(
                new Vector(hotbarXStart + 6 * (hotbarItemWidth + 4), hotbarY),
                AmmoItem.WATER_BALLOON,
                '7'
            )
        );

        this.addComponent(
            'dashCooldown',
            new DashCooldown(
                new Vector(Camera.SIZE.x - 600, Camera.SIZE.y - 100)
            )
        );

        // TODO: commented out because storing food is not currently implemented
        // add a food labels on the bottom right of the screen
        // this.addComponent("foodLabel", new FoodLabel(
        //     new Vector(Camera.SIZE.x - ItemLabel.DEFAULT_SIZE.x - Hud.MARGIN, Camera.SIZE.y - ItemLabel.DEFAULT_SIZE.y - Hud.MARGIN),
        //     FoodItem.STEAK
        // ));
    }

    /**
     * Update the HUD.
     */
    update() {}

    /**
     * Draw any HUD elements not drawn by individual components.
     */
    draw() {}
}

/**
 * Component that serves as a label for some item and its associated quantity.
 *
 * @author Trae Claar
 */
class ItemCounter {
    /**
     * Constructor for an ItemCounter.
     *
     * @param {Vector} pos the position of the ItemCounter on the canvas
     * @param {Animator} animation the Animator which will serve as the ItemCounter's image
     * @param {number} initialCount the intial count displayed by the ItemCounter
     */
    constructor(pos, animation, initialCount) {
        this.pos = pos;
        this.animation = animation;
        this.count = initialCount;
    }

    /** The fixed height (in pixels) of an ItemCounter on the canvas. */
    static get HEIGHT() {
        return 40;
    }

    /** The font size of the ItemCounter's count text. */
    static get TEXT_SIZE() {
        return 36;
    }

    /** The width of the left margin (in pixels) of the ItemCounter's count text. */
    static get TEXT_LEFT_MARGIN() {
        return 5;
    }

    /** Set the ItemCounter's count. */
    setCount(count) {
        this.count = count;
    }

    /** Update the ItemCounter. Does nothing. */
    update() {}

    /** Draw the ItemCounter. */
    draw() {
        // draw the item image
        const animScale = ItemCounter.HEIGHT / this.animation.size.y;
        this.animation.drawFrame(this.pos, animScale);
        const animScaledSize = Vector.multiply(this.animation.size, animScale);

        // draw the count
        CTX.fillStyle = 'white';
        CTX.font = ItemCounter.TEXT_SIZE + 'px vt323';
        CTX.fillText(
            this.count,
            this.pos.x + animScaledSize.x + 2,
            this.pos.y + ItemCounter.HEIGHT - 5
        );
    }
}

/**
 * Component that serves as a label for the currently selected food item.
 *
 * @author Nathan Hinthorne
 */
class FoodLabel {
    /**
     * Constructor for an FoodLabel.
     *
     * @param {Vector} pos the position of the FoodLabel on the canvas
     * @param {number} type the fodo type associated with the FoodLabel (should be a FoodItem member type)
     */
    constructor(pos, type) {
        this.foodItem = INVENTORY.getFood(type);
        this.type = type;
        this.label = new ItemLabel(pos, this.foodItem.animator);
    }

    /** Update the quantity and selection status of the FoodLabel. */
    update() {
        this.label.setQuantity(this.foodItem.amount);
        this.label.setSelected(INVENTORY.getCurrentFood().type === this.type);
    }

    /** Draw the FoodLabel. */
    draw() {
        this.label.draw();
    }
}

/**
 * Component that serves as a label for an ammo type, displaying its image, the key used to select
 * it, and the amount of this ammo type in the inventory.
 *
 * @author Trae Claar
 */
class AmmoLabel {
    /**
     * Constructor for an AmmoLabel.
     *
     * @param {Vector} pos the position of the AmmoLabel on the canvas
     * @param {string} type the ammo type associated with the AmmoLabel (should be a Projectile member type)
     * @param {string} inputName the input key used to select this ammo type
     */
    constructor(pos, type, inputName) {
        this.type = type;
        this.ammoItem = INVENTORY.getAmmo(type);

        const ammoItemName = AmmoItem.AMMO_ITEM_MAP[type.toLowerCase()];
        this.animator = new Animator(
            ammoItemName.SPRITESHEET,
            ammoItemName.SPRITESHEET_START_POS,
            ammoItemName.SIZE,
            ammoItemName.FRAME_COUNT,
            ammoItemName.FRAME_DURATION
        );

        this.label = new ItemLabel(
            pos,
            this.animator,
            inputName,
            INVENTORY.getAmmo(type).amount
        );
    }

    /** Update the quantity and selection status of the AmmoLabel. */
    update() {
        this.label.setQuantity(INVENTORY.getAmmo(this.type).amount);
        this.label.setSelected(INVENTORY.getCurrentAmmo().type === this.type);
    }

    /** Draw the AmmoLabel. */
    draw() {
        if (this.ammoItem.isRevealed) {
            this.label.draw();
        }
    }
}

/**
 * Component that serves as a label for an item, displaying an associated image, control input,
 * and an optional quantity.
 *
 * @author Trae Claar
 */
class ItemLabel {
    /**
     * Constructor for an ItemLabel.
     *
     * @param {Vector} pos the position of the ItemLabel on the canvas
     * @param {Animator} animation the Animator to be used as the ItemLabel's image
     * @param {string} inputName the name of the control associated with the item
     * @param {number} [quantity] (OPTIONAL) the quantity associated with the item
     * @param {number} [width] (OPTIONAL) the width (in pixels) of the ItemLabel on the canvas
     * @param {number} [imgPadding] (OPTIONAL) the padding (in pixels) of the ItemLabel's image
     */
    constructor(
        pos,
        animation,
        inputName,
        quantity,
        width = ItemLabel.DEFAULT_SIZE.x,
        imgPadding = ItemLabel.DEFAULT_IMG_PADDING
    ) {
        this.pos = pos;
        this.animation = animation;
        this.size = new Vector(width, ItemLabel.DEFAULT_SIZE.y);
        this.inputName = inputName;
        this.quantity = quantity;
        this.selected = false;
        this.imgPadding = imgPadding;
    }

    /** The default size (in pixels) of an ItemLabel on the canvas */
    static get DEFAULT_SIZE() {
        return new Vector(75, 75);
    }

    /** The font size of an ItemLabel's text. */
    static get TEXT_SIZE() {
        return Hud.TEXT_SIZE;
    }

    /** The width (in pixels) of an ItemLabel's text margins. */
    static get TEXT_MARGIN() {
        return 8;
    }

    /** The width (in pixels) of the item image's padding. */
    static get DEFAULT_IMG_PADDING() {
        return 25;
    }

    /** The default width (in pixels) of an ItemLabel's border. */
    static get DEFAULT_BORDER_WIDTH() {
        return 2;
    }

    /** The width (in pixels) of an ItemLabel's border when selected. */
    static get SELECTED_BORDER_WIDTH() {
        return 6;
    }

    /**
     * Set the quantity associated with the ItemLabel.
     *
     * @param {number} quantity the new quantity of the ItemLabel
     */
    setQuantity(quantity) {
        this.quantity = quantity;
    }

    setImageVisible(isVisible) {}

    /**
     * Set whether or not this ItemLabel is selected.
     *
     * @param {boolean} isSelected a boolean indicating whether or not the ItemLabel is selected
     */
    setSelected(isSelected) {
        this.selected = isSelected;
    }

    /**
     * Update the ItemLabel. Does nothing.
     */
    update() {}

    /**
     * Draw the ItemLabel.
     */
    draw() {
        // draw a translucent background for the ItemLabel
        CTX.fillStyle = 'rgba(32, 32, 32, 0.5)';
        CTX.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
        // draw a border around the ItemLabel
        CTX.lineWidth = this.selected
            ? ItemLabel.SELECTED_BORDER_WIDTH
            : ItemLabel.DEFAULT_BORDER_WIDTH;
        CTX.strokeStyle = 'white';
        CTX.strokeRect(this.pos.x, this.pos.y, this.size.x, this.size.y);

        // draw the image on the ItemLabel
        // the image's height will be scaled to the height of the ItemLabel
        // the image will be centered horizontally within the ItemLabel
        const animScale =
            (this.size.y - 2 * this.imgPadding) / this.animation.size.y;
        this.animation.drawFrame(
            Vector.add(
                this.pos,
                new Vector(
                    (this.size.x - animScale * this.animation.size.x) / 2,
                    +this.imgPadding
                )
            ),
            animScale
        );

        // draw the inputName text
        CTX.fillStyle = 'white';
        CTX.font = ItemLabel.TEXT_SIZE + 'px vt323';
        CTX.fillText(
            this.inputName,
            this.pos.x + ItemLabel.TEXT_MARGIN,
            this.pos.y + ItemLabel.TEXT_SIZE - ItemLabel.TEXT_MARGIN
        );

        // if this ItemLabel is assigned a quantity, draw it in the bottom right corner of the ItemLabel
        if (this.quantity || this.quantity === 0) {
            let text = 'x' + this.quantity;
            if (this.quantity === Infinity) {
                text = '∞';
                CTX.font = ItemLabel.TEXT_SIZE + 'px sans-serif';
            }

            CTX.fillStyle = 'white';
            CTX.fillText(
                text,
                this.pos.x +
                    this.size.x -
                    ItemLabel.TEXT_MARGIN -
                    CTX.measureText(text).width,
                this.pos.y + this.size.y - ItemLabel.TEXT_MARGIN
            );
        }
    }
}

class HotBarRectangle {
    /**
     * Constructor for a HotBarRectangle.
     *
     * @param {number} x the x-coordinate of the HotBarRectangle on the canvas
     * @param {number} y the y-coordinate of the HotBarRectangle on the canvas
     * @param {number} width the width of the HotBarRectangle on the canvas
     * @param {number} height the height of the HotBarRectangle on the canvas
     */
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    static get PADDING() {
        return 0;
    }

    update() {}

    draw() {
        CTX.fillStyle = COLORS.LIGHT_GRAY;
        CTX.lineWidth = 5;
        CTX.strokeRect(this.x, this.y, this.width, this.height);
    }
}

/**
 * A class which serves as a pause button.
 *
 * @author Trae Claar
 */
class PauseButton {
    /**
     * Constructor for a PauseButton.
     *
     * @param pos the position of the pause button on the canvas
     */
    constructor(pos) {
        this.pos = pos;
        this.menu = new PauseMenu();

        const listener = () => {
            const mouseOverButton =
                GAME.mousePos.x > this.pos.x &&
                GAME.mousePos.y > this.pos.y &&
                GAME.mousePos.x < this.pos.x + PauseButton.SIZE.x &&
                GAME.mousePos.y < this.pos.y + PauseButton.SIZE.y;
            if (mouseOverButton) {
                ASSET_MGR.playSFX(
                    SFX.UI_HIGH_BEEP.path,
                    SFX.UI_HIGH_BEEP.volume
                );
                if (GAME.running) {
                    GAME.running = false;
                    HUD.swapToPointer();
                    ASSET_MGR.pauseMusic();
                } else {
                    GAME.running = true;
                    HUD.swapToCrosshair();
                    ASSET_MGR.resumeMusic();
                }
            }
        };
        document.body.addEventListener('click', listener);
        HUD.componentListeners.push(['click', listener]);
    }

    /** The size (in pixels) of the PauseButton on the canvas. */
    static get SIZE() {
        return new Vector(50, 50);
    }

    /** The size (in pixels) of a single bar in the pause icon on the canvas. */
    static get BAR_SIZE() {
        return new Vector(10, 30);
    }

    /** The width (in pixels) of the PauseButton's border. */
    static get BORDER_WIDTH() {
        return 2;
    }

    /** The distance (in pixels) between the bars in the pause icon. */
    static get BAR_DISTANCE() {
        return 5;
    }

    /** The margin width (in pixels) between the play icon and the border of the PauseButton. */
    static get PLAY_ICON_MARGIN() {
        return 10;
    }

    /**
     * Checks whether or not the mouse is currently positioned over the PauseButton.
     *
     * @returns {boolean} true if the mouse is over the PauseButton, and false otherwise
     */
    isMouseOver() {
        return (
            GAME.mousePos.x > Camera.SIZE.x - PauseButton.SIZE.x &&
            GAME.mousePos.y < PauseButton.SIZE.y
        );
    }

    /** Update the PauseButton. */
    update() {}

    /** Draw the PauseButton. */
    draw() {
        if (!GAME.running) {
            // draw a translucent background
            CTX.fillStyle = 'rgba(0, 0, 0, 0.5)';
            CTX.fillRect(0, 0, Camera.SIZE.x, Camera.SIZE.y);
            this.menu.draw();
        }
        const size = PauseButton.SIZE;
        const barSize = PauseButton.BAR_SIZE;

        // draw a translucent background for the PauseButton
        CTX.fillStyle = 'rgba(32, 32, 32, 0.5)';
        CTX.fillRect(this.pos.x, this.pos.y, size.x, size.y);
        // draw a border around the PauseButton
        CTX.lineWidth = PauseButton.BORDER_WIDTH;
        CTX.strokeStyle = 'white';
        CTX.strokeRect(this.pos.x, this.pos.y, size.x, size.y);

        // draw the PauseButton icon
        CTX.fillStyle = 'white';
        if (GAME.running) {
            // if the game is running, draw a pause icon
            CTX.fillRect(
                this.pos.x +
                    (size.x - PauseButton.BAR_DISTANCE) / 2 -
                    barSize.x,
                this.pos.y + (size.y - barSize.y) / 2,
                barSize.x,
                barSize.y
            );
            CTX.fillRect(
                this.pos.x + (size.x + PauseButton.BAR_DISTANCE) / 2,
                this.pos.y + (size.y - barSize.y) / 2,
                barSize.x,
                barSize.y
            );
        } else {
            // if the game is paused, draw a play icon
            const margin = PauseButton.PLAY_ICON_MARGIN;
            CTX.beginPath();
            CTX.moveTo(this.pos.x + margin, this.pos.y + margin);
            CTX.lineTo(this.pos.x + size.x - margin, this.pos.y + size.y / 2);
            CTX.lineTo(this.pos.x + margin, this.pos.y + size.y - margin);
            CTX.fill();
        }
    }
}

/**
 * A class used to display Chad's health in the HUD.
 *
 * @author Trae Claar
 */
class HudHealthBar {
    /**
     * Constructor for a HUDHealthBar.
     *
     * @param pos the position of the health bar on the canvas
     */
    constructor(pos) {
        this.pos = pos;
        this.length = Chad.DEFAULT_MAX_HEALTH * 4;
    }

    /** The height of the actual health bar. */
    static get BAR_HEIGHT() {
        return 20;
    }

    /** The size (in pixels) of the HealthBar on the canvas. */
    static get SIZE() {
        return new Vector(400, HudHealthBar.BAR_HEIGHT /*+ Hud.TEXT_SIZE*/);
    }

    /** The padding between the actual health bar and the outer edge of the border. */
    static get PADDING() {
        return 5;
    }

    /** Update the HealthBar. */
    update() {
        this.length = CHAD.maxHealth * 4;
    }

    /** Draw the HealthBar. */
    draw() {
        // draw background
        CTX.fillStyle = '#000000';
        CTX.fillRect(
            this.pos.x,
            this.pos.y,
            this.length,
            HudHealthBar.BAR_HEIGHT
        );

        // draw the actual health bar
        CTX.fillStyle = '#ff0000';
        CTX.fillRect(
            this.pos.x + HudHealthBar.PADDING,
            this.pos.y + HudHealthBar.PADDING,
            ((this.length - HudHealthBar.PADDING * 2) * CHAD.health) /
                CHAD.maxHealth,
            HudHealthBar.BAR_HEIGHT - HudHealthBar.PADDING * 2
        );

        // draw text for health / max health
        CTX.fillStyle = 'white';
        CTX.font = Hud.TEXT_SIZE + 'px vt323';
        CTX.fillText(
            CHAD.health + ' / ' + CHAD.maxHealth + ' HP',
            this.pos.x + this.length + 10,
            this.pos.y + Hud.TEXT_SIZE / 2
        );
    }
}

/**
 * Chad's head icon component.
 *
 * @author Trae Claar
 */
class ChadHead {
    /**
     * Constructor for the ChadHead.
     */
    constructor() {
        this.animator = new Animator(
            Chad.SPRITESHEET,
            new Vector(32, 15),
            new Vector(Chad.SIZE.x - 2, 17),
            1,
            1
        );
    }

    /**
     * Update the ChadHead. Does nothing.
     */
    update() {}

    /**
     * Draw the ChadHead.
     */
    draw() {
        this.animator.drawFrame(new Vector(Hud.MARGIN, Hud.MARGIN), CHAD.scale);
    }
}
