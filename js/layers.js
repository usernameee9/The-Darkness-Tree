addLayer("s", {
    name: "shadow", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#595959",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "shadows", // Name of prestige currency
    baseResource: "shades", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('d',12)) mult = mult.times(2)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
        upgrades: {
        11: {
    title: "Dark",
    description: "Doubles your shades gain.",
    cost: new Decimal(1),
        },
                12: {
    title: "Darker",
    description: "Shades increase shades gain",
    cost: new Decimal(3),
         effect() {
        return player.points.add(1).pow(0.5)
    },
    effectDisplay(){ return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect 
  
    },
                   13: {
    title: "Yet Darker",
    description: "Shadows increase shades gain",
    cost: new Decimal(10),
         effect() {
        return player[this.layer].points.add(1).pow(0.5)
    },
    effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect 
  
    },
    },
}
),
addLayer("d", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},

    color: "#000844",                       // The color for this layer, which affects many elements.
    resource: "darkness",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).

    baseResource: "shadows",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.s.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(50),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return true },          // Returns a bool for if this layer's node should be visible in the tree.
     
    upgrades: {
    11: {
    title: "The hunger...",
    description: "Doubles your shades gain.",
    cost: new Decimal(1),
    },
    12: {
    title: "Deeper down",
    description: "Doubles your shadows gain.",
    cost: new Decimal(3),
    },
    },
     branches: ['s'],
}
),
addLayer("a", {
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "#deff09",
    resource: "achievement power", 
    row: "side",
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Achievements")
    },
    achievementPopups: true,
    achievements: {
        11: {
            name: "Descent",
            done() {return player.s.points.gte(1)},
            tooltip: "Get a shadow.",
        },
        12: {
            name: "A real achievement",
            done() {return player.d.points.gte(10)},
            tooltip: "Get 10 darkness.\n\nReward: The darkness spreads (Gain double the shades)", // Showed when the achievement is completed
        },
    },
    midsection: ["grid", "blank"],
    grid: {
        maxRows: 3,
        rows: 2,
        cols: 2,
        getStartData(id) {
            return id
        },
        getUnlocked(id) { // Default
            return true
        },
        getCanClick(data, id) {
            return player.points.eq(10)
        },
        getStyle(data, id) {
            return {'background-color': '#'+ (data*1234%999999)}
        },
        onClick(data, id) { // Don't forget onHold
            player[this.layer].grid[id]++
        },
        getTitle(data, id) {
            return "Gridable #" + id
        },
        getDisplay(data, id) {
            return data
        },
    },
})