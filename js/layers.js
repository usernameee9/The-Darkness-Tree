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
        if (hasUpgrade('s',14)) mult = mult.times(3)
        if (hasUpgrade('s',21)) mult = mult.times(2)
        if (hasUpgrade('s',23)) mult = mult.times(4)
        if (hasUpgrade('d',12)) mult = mult.times(2)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    infoboxes: {
    lore: {
        title: "Reasoning",
        body() { return "You decided that this world is filled with too much light, and that it must all be removed COMPLETELY." },
},
    },
buyables: {
    11: {
        title: "Basic Buyable",
        cost(x) { return new Decimal(100).mul(x) },
        display() { return "Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Basic Buyable" + "<br>Bought: " + getBuyableAmount(this.layer, this.id) + "<br>Effect: Boost Shades gain by x" + format(buyableEffect(this.layer, this.id)) },
        canAfford() { return player[this.layer].points.gte(this.cost()) },
        buy() {
            player[this.layer].points = player[this.layer].points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        effect(x) { return new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).pow(1)},
        unlocked(){return hasUpgrade('s',15)}
    },
},
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
        upgrades: {
            rows: 2,
            cols: 5,
        11: {
    title: "Dark",
    description: "Doubles your shades gain.",
    cost: new Decimal(1),
        },
                12: {
    title: "Darker",
    description: "Shades increase shades gain",
    cost: new Decimal(3),
    unlocked(){return hasUpgrade('s',11)},
         effect() {
        return player.points.add(1).pow(0.5)
    },
    effectDisplay(){ return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect 
  
    },
                   13: {
    title: "Yet Darker",
    description: "Shadows increase shades gain",
    cost: new Decimal(10),
    unlocked(){return hasUpgrade('s',12)},
         effect() {
        return player[this.layer].points.add(4).pow(0.5)
    },
    effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect 
        },
               14: {
    title: "Triple the trouble",
    description: "Triples your shades and shadows gain.",
    cost: new Decimal(30),
    unlocked(){return hasUpgrade('s',13)}
        },
                       15: {
    title: "New features",
    description: "Unlocks a buyable.",
    cost: new Decimal(50),
    unlocked(){return hasUpgrade('s',14)}
        },
    
                           21: {
    title: "When are we getting a new layer",
    description: "Doubles shadow gain.",
    cost: new Decimal(500),
    unlocked(){return hasUpgrade('s',15)}
    },
                               22: {
    title: "Still nothing?",
    description: "Doubles shades gain.",
    cost: new Decimal(1000),
    unlocked(){return hasUpgrade('s',21)}
    },
                                   23: {
    title: "Is there even another layer?",
    description: "Quadruples shadow gain.",
    cost: new Decimal(2000),
    unlocked(){return hasUpgrade('s',22)}
    },
                                       24: {
    title: "Not even a new feature?",
    description: "Doubles shades gain, again.",
    cost: new Decimal(4000),
    unlocked(){return hasUpgrade('s',23)}
    },
                                           25: {
    title: "Finally a new layer",
    description: "Unlocks darkness.",
    cost: new Decimal(10000),
    unlocked(){return hasUpgrade('s',24)}
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
    unlocked(){return hasAchievment('a', 13)},
    baseResource: "shadows",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.s.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(100000),              // The amount of the base needed to  gain 1 of the prestige currency.
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
branches: ['s']
},
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
            onComplete() {player.a.points = player.a.points.add(1)}
        },
        12: {
            name: "There's gonna be a lot more of these",
            done() {return hasUpgrade('s',15)},
            tooltip: "Get the fifth shadow upgrade.", // Showed when the achievement is completed
            onComplete() {player.a.points = player.a.points.add(1)}
        },
                13: {
            name: "Finally a new layer unlocked",
            done() {return hasUpgrade('s',25)},
            tooltip: "Get the tenth shadow upgrade.", // Showed when the achievement is completed
            onComplete() {player.a.points = player.a.points.add(1)}
        },
        14: {
            name: "Wow this took a while",
            done() {return player.d.points.gte(3)},
            tooltip: "Get 2 darkness.", // Showed when the achievement is completed
            onComplete() {player.a.points = player.a.points.add(2)}
        },
    },
    effect(x) {
        return player.a.points.add(1).pow(0.25)
    },
    effectDescription(){
        return "multiplying point gain by " + format(tmp[this.layer].effect)
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