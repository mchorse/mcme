var dom = require("../dom"),
    utils = require("../utils");

/**
 * Color bar class
 * 
 * This bar class is responsible for manipulating one of the components of the 
 * color in the color picker.
 * 
 * The color picker stores colors in the RGB format, but picker itself provides 
 * a HSL picker.
 * 
 * @todo Make picker HSL, and convert color to RGB in pixel data or before 
 *       adding a pixel to pixel data
 */

var Bar = module.exports = function(picker, bar, index) 
{
    this.picker = picker;
    
    this.input = dom.$("input", bar);
    this.canvas = dom.$("canvas", bar);
    this.ctx = this.canvas.getContext("2d");
    
    this.index = index;
    this.factor = index == 0 ? 360 : 100;
    this.value = 0;
    
    this.generateGradient();
}

Bar.prototype = 
{
    init: function()
    {
        var self = this;
        
        this.generateGradient();
        this.render();
        
        dom.on(this.input, "change", function () {
            self.value = (parseInt(this.value) || 0) / self.factor;
            self.picker.colorChanged(self.index);
        });
    },
    
    click: function(x, y)
    {
        this.value = (x - 10) / (this.canvas.width - 20);
        this.value = this.value < 0 ? 0 : (this.value > 1 ? 1 : this.value);
        this.updateInput();
        this.picker.colorChanged(this.index);
    },
    
    /**
     * Update the input value
     */
    updateInput: function()
    {
        this.input.value = Math.floor(this.value * this.factor);
    },
    
    /**
     * Generate color gradient
     */
    generateGradient: function()
    {
        var color = this.picker.primary;
        
        color = Color.rgb(color[0], color[1], color[2], 1);
        color = color.hslData();
        
        this.value = color[this.index];
        this.gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, 0);
        
        var steps = (this.index == 0 ? 6 : 2);
        
        for (var i = 0; i <= steps; i ++)
        {
            color[this.index] = i / steps;
            this.gradient.addColorStop(i / steps, Color.hsl(color[0], color[1], color[2], 1).hsl());
        }
    },

    /**
     * Render the gradient
     */
    render: function()
    {
        var w = this.canvas.width,
            h = this.canvas.height;
            
        var ctx = this.ctx;

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = this.gradient;
        ctx.fillRect(0, 0, w, h);
        
        var x = 10 + this.value * (w - 20);
        
        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        
        ctx.arc(x, h / 2, 7, 0, Math.PI * 2);
        
        ctx.stroke();
    }
};