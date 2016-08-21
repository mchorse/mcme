var dom = require("./dom"),
    utils = require("./utils");

/**
 * Picker class
 * 
 * This class is responsible for managing color picker bar and two colors that 
 * user can swap.
 */

var Picker = module.exports = function(pixelData, colors)
{
    this.pixelData = pixelData;
    this.colors = colors;
    
    this.primary = [255, 255, 255, 1];
    this.secondary = [0, 0, 0, 1];
};

Picker.prototype =
{
    swap: function()
    {
        var primary = this.primary;
        
        this.primary = this.secondary;
        this.secondary = primary;
        
        this.update();
    },
    
    update: function()
    {
        dom.$(".mc-color-fg", this.colors).style.backgroundColor = utils.to_color(this.primary);
        dom.$(".mc-color-bg", this.colors).style.backgroundColor = utils.to_color(this.secondary);
    }
};