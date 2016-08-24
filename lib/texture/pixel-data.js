var utils = require("../utils");

/**
 * Texture data which stores pixel data for textures
 */

var transparent = [0, 0, 0, 0];

/**
 * @param {Number} w
 * @param {Number} h
 */
var PixelData = module.exports = function(w, h)
{
    this.w = w;
    this.h = h;
    
    this.reset();
};

PixelData.prototype = 
{
    /**
     * Resize the canvas (but keep or trim pixel data)
     */
    resize: function(w, h)
    {
        var map = this.map.slice();
        
        this.w = w;
        this.h = h;
        
        for (var y = 0; y < this.h; y ++)
        {
            this.map[y] = [];
            
            for (var x = 0; x < this.w; x ++)
            {
                this.set(x, y, map[y] && map[y][x] ? map[y][x] : transparent);
            }
        }
    },
    
    /**
     * Reset (i.e. clear it) the canvas
     */
    reset: function()
    {
        this.map = [];
        
        for (var y = 0; y < this.h; y ++)
        {
            this.map[y] = [];
            
            for (var x = 0; x < this.w; x ++)
            {
                this.set(x, y, transparent);
            }
        }
    },
    
    /**
     * Set color of the pixel in pixel data at position x and y
     */
    set: function(x, y, color)
    {
        if (this.inBound(x, y))
        {
            color = color.slice();
            color.rgb = utils.to_color(color);
            this.map[y][x] = color;
        }
    },
    
    /**
     * Get pixel in pixel data at position x and y
     */
    get: function(x, y)
    {
        return this.inBound(x, y) ? this.map[y][x] : null;
    },
    
    /**
     * Is point is in acceptable range (i.e. withing the canvas)
     */
    inBound: function(x, y)
    {
        return x >= 0 && y >= 0 && x < this.w && y < this.h;
    },
    
    scale: function(w, h) 
    {
        return Math.floor(Math.min(w / this.w, h / this.h)) || 1
    }, 

    /**
     * Render pixel data on canvas
     */
    render: function(ctx, w, h) 
    {
        var scale = this.scale(w, h);

        for (var x = 0; x < this.w; x ++) 
        {
            for (var y = 0; y < this.h; y ++) 
            {
                this.renderPixel(ctx, x, y, scale);
            }
        }
    },

    /**
     * Render only one pixel
     */
    renderPixel: function(ctx, x, y, scale, x2, y2) 
    {
        ctx.fillStyle = this.map[y][x].rgb;

        x2 = x2 === undefined ? x : x2;
        y2 = y2 === undefined ? y : y2;
        
        ctx.clearRect(x2 * scale, y2 * scale, scale, scale);
        ctx.fillRect(x2 * scale, y2 * scale, scale, scale);
    },
    
    /**
     * Import image data pixels into pixel data 
     */
    fromImageData: function(img)
    {
        var data = img.data;
        
        for (var i = 0, c = data.length; i < c; i += 4) 
        {
            var x = (i / 4) % img.width,
                y = Math.floor((i / 4) / img.width);
        
            var r = data[i],
                g = data[i + 1],
                b = data[i + 2],
                a = data[i + 3];
        
            this.set(x, y, [r, g, b, a]);
        }
    },
    
    /**
     * Convert point in document coordinates relative to canvas's pixel
     * 
     * @param {CanvasNode} canvas
     * @param {Number} x
     * @param {Number} y
     * @return {Object}
     */
    pointToPixel: function(canvas, x, y)
    {
        x -= (canvas.offsetLeft + canvas.parentNode.offsetLeft);
        y -= (canvas.offsetTop + canvas.parentNode.offsetTop);
        
        var w = canvas.width,
            h = canvas.height;
  
        var scale = this.scale(w, h);
        
        return {
            x: Math.floor(x / scale),
            y: Math.floor(y / scale),
            scale: scale
        };
    }
};