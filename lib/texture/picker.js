var dom = require("../dom"),
    utils = require("../utils");

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
    
    this.primary = [0, 0, 1, 1];
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
        var self = this,
            callback = this.toggle.bind(this);
        
        dom.on(this.fg, "click", callback);
        dom.on(this.bg, "click", callback);
        
        dom.on(dom.$(".mc-color-css"), "change", function () {
            var color = utils.parse(this.value);
            
            this.value = "";
            this.blur();
            
            self.primary = Color.rgb(color[0], color[1], color[2]).hslData();
            self.update();
        });
        
        this.bars.forEach(function (bar) {
            bar.init();
        });
        
        this.update();
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
    update: function()
    {
        this.fg.style.backgroundColor = utils.to_color(Color.HSLtoRGB(this.primary));
        this.bg.style.backgroundColor = utils.to_color(Color.HSLtoRGB(this.secondary));
        
        this.bars.forEach(function (bar) {
            bar.generateGradient();
            bar.updateInput();
            bar.render();
        });
    },
    
    /**
     * Set primary color, duh
     */
    setColor: function(color)
    {
        this.primary = Color.rgb(color[0], color[1], color[2]).hslData();
        this.update();
    },
    
    /**
     * Invoked if color changed
     */
    colorChanged: function()
    {
        this.primary[0] = this.bars[0].value;
        this.primary[1] = this.bars[1].value;
        this.primary[2] = this.bars[2].value;
        
        this.update();
    },
    
    /**
     * Mouse move 
     * 
     * @param {Number} x
     * @param {Number} y
     */
    onMouseMove: function(x, y)
    {
        for (var i = 0, c = this.bars.length; i < c; i ++)
        {
            var bar = this.bars[i],
                offset = bar.canvas.getBoundingClientRect();
            
            var nx = x - offset.left,
                ny = y - offset.top;
            
            if (nx >= 0 && nx < bar.canvas.width && ny >= 0 && ny < bar.canvas.height)
            {
                bar.click(nx, ny);
                break;
            }
        }
    }
};