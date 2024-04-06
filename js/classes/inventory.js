/**
 * The Inventory class. Will be used to keep track of the player's inventory.
 * Holds ammo, food, and runes.
 * 
 * If we deem the duplicate methods for each item type to be unnecessary, we can combine them. 
 * However, for scalability I decided to split them up.
 * 
 * @author Nathan Hinthorne
 */
class Inventory {

    constructor() {
        /** The current ammo that the player has collected. Filled with AmmoItem objects */
        this.ammoBag = [];
        this.initAmmoBag();

        /** The current ammo that the player has collected. Filled with FoodItem objects */

        this.foodBag = []; //! not currently in use
        this.initFoodBag(); 

        /** The total value of runes that the player has collected. A single number */
        this.runes = 10;

        /** Permanent items Chad collects and potentially has abilities tied to */
        this.unlockables = []; //! not currently in use
    }

    initAmmoBag() {
        this.ammoBag.push(new AmmoItem(AmmoItem.ROCK, 10));
        this.ammoBag.push(new AmmoItem(AmmoItem.SLIMEBALL, 0));
        this.ammoBag.push(new AmmoItem(AmmoItem.BOMB, 0));
        this.ammoBag.push(new AmmoItem(AmmoItem.SNOWBALL, 0));
        this.ammoBag.push(new AmmoItem(AmmoItem.SUS_SNOWBALL, 0));
        this.ammoBag.push(new AmmoItem(AmmoItem.BROCCOLI, 0));
        this.ammoBag.push(new AmmoItem(AmmoItem.WATER_BALLOON, 0));

        this.switchToAmmo(AmmoItem.ROCK);
    }

    initFoodBag() {
        this.foodBag.push(new FoodItem(FoodItem.CHICKEN, 0));
        this.foodBag.push(new FoodItem(FoodItem.STEAK, 0));
        this.foodBag.push(new FoodItem(FoodItem.HAM, 0));
        this.foodBag.push(new FoodItem(FoodItem.BEEF, 0));
        this.foodBag.push(new FoodItem(FoodItem.BACON, 0));
        this.foodBag.push(new FoodItem(FoodItem.BURGER, 0));
        this.foodBag.push(new FoodItem(FoodItem.ENERGY_DRINK, 0));
    }


    /**
     * @param {string} type The type of the ammo to adjust the supply of.
     * @param {number} amount The amount to adjust the ammo supply by.
     */
    adjustAmmo(type, amount) {
        // find the ammo in the bag and adjust the amount
        for (let i = 0; i < this.ammoBag.length; i++) {
            let ammo = this.ammoBag[i];
            if (ammo.type == type) {
                ammo.adjustSupply(amount);
                return;
            }
        }
    }

    /**
     * @returns {Array} An array of all the ammo in the inventory.
     */
    getAllAmmo() {
        return this.ammoBag;
    }

    /**
     * @param {number} type The type of the ammo to get.
     * @returns {AmmoItem} The ammo with the given name.
     */
    getAmmo(type) {
        for (let i = 0; i < this.ammoBag.length; i++) {
            let ammo = this.ammoBag[i];
            if (ammo.type == type) {
                return this.ammoBag[i];
            }
        }
    }
    
    /**
     * @param {number} type The type of the ammo to switch to.
     */
    switchToAmmo(type) {
        this.currentAmmo = this.getAmmo(type);
    }

    /**
     * @returns {AmmoItem} The ammo that was just used. None if the ammo list is empty.
     */
    useCurrentAmmo() {
        if (this.currentAmmo.amount <= 0) {
            return "Empty";
        }

        if (this.currentAmmo.amount != Infinity) {
            this.currentAmmo.adjustSupply(-1);
        }
        return this.currentAmmo.type;
    }

    /**
     * @returns {AmmoItem} The current ammo.
     */
    getCurrentAmmo() {
        return this.currentAmmo;
    }

    

    /**
     * Modify the amount of food in the inventory.
     * 
     * @param {number} type The type of the food to adjust the supply of.
     * @param {number} amount The amount to adjust the food supply by.
     */
    adjustFood(type, amount) {
        // find the food in the bag and increment the amount
        for (let i = 0; i < this.foodBag.length; i++) {
            let food = this.foodBag[i];
            if (food.type == type) {
                food.adjustSupply(amount);
                return;
            }
        }
    }

    /**
     * @returns {Array} An array of all the food in the inventory.
     */
    getAllFood() {
        return this.foodBag;
    }

    /**
     * @param {number} type The type of the food to get.
     * @returns {FoodItem} The food with the given name.
     */
    getFood(type) {
        for (let i = 0; i < this.foodBag.length; i++) {
            let food = this.foodBag[i];
            if (food.type == type) {
                return this.foodBag[i];
            }
        }
    }
    
    /**
     * @param {number} type The type of the food to switch to.
     */
    switchToFood(type) {
        this.currentFood = this.getFood(type);
    }

    /**
     * Consume the food currently selected.
     * 
     * @returns {FoodItem} The food that was just used. None if the food list is empty.
     */
    useCurrentFood() {
        if (this.currentFood.amount <= 0) {
            return "Empty";
        }

        if (this.currentFood.amount != Infinity) {
            this.currentFood.adjustSupply(-1);
            return this.currentFood.type;
        }
    }

    /**
     * @returns {FoodItem} The current food.
     */
    getCurrentFood() {
        return this.currentFood;
    }

    spendRunes(runes) {
        this.runes -= runes;
        HUD.runeCounter.setCount(this.runes);
    };

    collectRunes(runes) {
        this.runes += runes;
        HUD.runeCounter.setCount(this.runes);
    };



    /**
     * Logs the current state of the inventory to the console.
     */
    toString() {
        console.log("♠ Ammo ♠ -- ", this.ammoBag);
        console.log("♥ Food ♥ -- ", this.foodBag);
        console.log("♦ Runes ♦ -- ", this.runeBag);
    }
}