/**
 * Texture data which stores pixel data for textures
 */

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
        this.w = w;
        this.h = h;
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
                this.map[y][x] = null;
            }
        }
    },
    
    set: function(x, y, color)
    {
        if (this.inBound(x, y))
        {
            this.map[y][x] = color;
        }
    },
    
    /**
     * Is point is in acceptable range (i.e. withing the canvas)
     */
    inBound: function(x, y)
    {
        return x >= 0 && y >= 0 && x < this.w && y < this.h;
    }
};