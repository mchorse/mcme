/**
 * Bucket tool class
 * 
 * Allows users to fill an area of pixels on canvas.
 */

var Bucket = module.exports = function(editor)
{
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
        
        /** Do the actual thing, lol */
        
        data.render(this.canvas.getContext("2d"), this.canvas.width, this.canvas.height);
    }
};