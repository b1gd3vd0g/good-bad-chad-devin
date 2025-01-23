/**
 * A piece of food that is contained in the inventory.
 * Holds all the behavior unique to the assigned type of food.
 * 
 * @author Nathan Hinthorne
 */
class FoodItem {
    /**
     * 
     * @param {number} type The type of food to create. FoodItem.BACON, .BURGER, .ENERGY_DRINK, .STEAK, .HAM, .CHICKEN_LEG, or .BEEF.
     * @param {number} amount The amount of food to create.
     */
    constructor(type, amount) {
        this.type = type;
        this.amount = amount;
        this.isSecret = true;

        this.animator = new Animator(FoodItem.SPRITESHEET,
            new Vector(0, type * FoodItem.SIZE.y), 
            FoodItem.SIZE, 1, 1);
    }

    adjustSupply(amount) {
        if (typeof amount !== "number" || amount % 1 !== 0) {
            throw new Error("Invalid amount of food to add");
        }

        if (this.isSecret) { // once the player has collected this food, it is no longer secret
            this.isSecret = false;
        }

        this.amount += amount;
    }

    static get SPRITESHEET() {
        return "./sprites/food.png";
    }

    static get SPRITESHEET_ENTRY_HEIGHT() {
        return 32;
    }

    static get SCALE() {
        return 4;
    }

    static get SIZE() {
        return new Vector(32, 32);
    }

    static get SCALED_SIZE() {
        return Vector.multiply(FoodItem.SIZE, FoodItem.SCALE);
    }


    
    static get BACON() {
        return 0;
    }

    static get BURGER() {
        return 1;
    }

    static get ENERGY_DRINK() {
        return 2;
    }

    static get STEAK() {
        return 3;
    }

    static get HAM() {
        return 4;
    }

    static get CHICKEN() {
        return 5;
    }

    static get BEEF() {
        return 6;
    }

    static get GIANT_MUSHROOM() {
        return 7;
    }

    static get ROAST_TURKEY() {
        return 8;
    }
    

    print() {
        switch (this.type) {
            case FoodItem.BACON:
                console.log("Bacon");
                break;
            case FoodItem.BURGER:
                console.log("Burger");
                break;
            case FoodItem.ENERGY_DRINK:
                console.log("Energy Drink");
                break;
            case FoodItem.STEAK:
                console.log("Steak");
                break;
            case FoodItem.HAM:
                console.log("Ham");
                break;
            case FoodItem.CHICKEN:
                console.log("Chicken Leg");
                break;
            case FoodItem.BEEF:
                console.log("Beef");
                break;
        }
    }

}