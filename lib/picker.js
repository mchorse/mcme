var dom = require("./dom"),
    utils = require("./utils");

var Bar = require("./bar");

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
    
    this.primary = [255, 0, 0, 1];
    this.secondary = [0, 0, 0, 1];
    
    this.fg = dom.$(".mc-color-fg", colors);
    this.bg = dom.$(".mc-color-bg", colors);
    
    this.bars = 
    [
        new Bar(this, dom.$(".mc-hue-bar", colors), 0),
        new Bar(this, dom.$(".mc-saturation-bar", colors), 1),
        new Bar(this, dom.$(".mc-lightness-bar", colors), 2)
    ];
};

Picker.prototype =
{
    /**
     * Init event listeners to toggle the color picker
     */
    init: function()
    {
        var self = this;
        
        dom.on(this.fg, "click", this.toggle.bind(this));
        dom.on(this.bg, "click", this.toggle.bind(this));
        
        dom.on(dom.$(".mc-color-css"), "change", function () {
            this.primary = Color.parse(this.value);
            this.value = "";
        });
        
        this.bars.forEach(function (bar) {
            bar.init();
        });
    },
    
    /**
     * Toggle (hide or show) the color picker
     */
    toggle: function()
    {
        dom.$(".mc-color-picker", this.colors).classList.toggle("hidden");
    },
    
    /**
     * Swap primary with secondary
     */
    swap: function()
    {
        var primary = this.primary;
        
        this.primary = this.secondary;
        this.secondary = primary;
        
        this.update();
    },
    
    /**
     * Update the DOOM
     */
    update: function(index)
    {
        this.fg.style.backgroundColor = utils.to_color(this.primary);
        this.bg.style.backgroundColor = utils.to_color(this.secondary);
        
        this.bars.forEach(function (bar, i) {
            if (index !== undefined && index == i) return;
            
            bar.generateGradient();
            bar.updateInput();
            bar.render();
        });
    },
    
    /**
     * Invoked if color changed
     */
    colorChanged: function(index)
    {
        var color = Color.hsl(this.bars[0].value, this.bars[1].value, this.bars[2].value).rgbData();
        
        this.primary[0] = color[0];
        this.primary[1] = color[1];
        this.primary[2] = color[2];
        
        this.update(index);
    },
    
    /**
     * Mouse move 
     * 
     * @param {Number} x
     * @param {Number} y
     */
    onMouseMove: function(x, y)
    {
        this.bars.forEach(function (bar) {
            var offset = bar.canvas.getBoundingClientRect();
            
            var nx = x - offset.left,
                ny = y - offset.top;
            
            if (nx >= 0 && nx < bar.canvas.width && ny >= 0 && ny < bar.canvas.height)
            {
                bar.click(nx, ny);
            }
        });
    }
};