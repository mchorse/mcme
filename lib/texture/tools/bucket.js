var utils = require("../../utils");

function index(x, y, w)
{
    return Math.floor(x + y * w);
}

/**
 * Bucket tool class
 * 
 * Allows users to fill an area of pixels on canvas.
 */

var Bucket = module.exports = function(editor)
{
    this.editor = editor;
    this.pixelData = editor.app.skin;
    this.canvas = editor.canvas;
    this.picker = editor.picker;
};

Bucket.prototype = 
{
    onMouseMove: function(x, y)
    {},
    
    onMouseDown: function(x, y)
    {
        var data = this.pixelData,
            pos = data.pointToPixel(this.canvas, x, y);
    
        x = pos.x;
        y = pos.y;
    
        if (x < 0 || x >= data.w || y < 0 || y >= data.h) return;
        
        var color = this.picker.primary;
        
        color = Color.hsl(color[0], color[1], color[2]).rgbData();
        
        this.fill(data, x, y, color);
        this.editor.render();
    },
    
    /**
     * Fill canvas with color
     * 
     * @param {PixelData} data
     * @param {Number} x
     * @param {Number} y
     * @param {Array} input – Color
     */
    fill: function(data, x, y, input)
    {
        var color = utils.to_color(data.get(x, y));
        
        var pixels = [index(x, y, data.w)],
            processed = [];
        
        /**
         * Add a pixel to pixel array to explore
         */
        function add (x, y) 
        {
            var i = index(x, y, data.w);
            
            /* Pass only if coordinates are in the range of canvas size */
            if (x < 0 || x >= data.w || y < 0 || y >= data.h) return;
            
            /* Add the pixel only if it wasn't already processed and it's the same color 
             * as initial pixel */
            if (processed.indexOf(i) < 0 && pixels.indexOf(i) < 0 && utils.to_color(data.get(x, y)) == color)
            {
                pixels.push(i);
            }
        }
        
        while (pixels.length)
        {
            var pixel = pixels.shift(),
                x = pixel % data.w,
                y = (pixel / data.w) >> 0;
            
            add(x + 1, y);
            add(x - 1, y);
            add(x, y + 1);
            add(x, y - 1);
            
            processed.push(pixel);
        }
        
        processed.forEach(function (pixel) {
            var x = pixel % data.w,
                y = (pixel / data.w) >> 0;
            
            data.set(x, y, input);
        });
    }
};