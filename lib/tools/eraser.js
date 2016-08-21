/**
 * Eraser tool class
 * 
 * Allows users to erase pixels on canvas.
 */

var Eraser = module.exports = function(editor)
{
    this.pixelData = editor.app.skin;
    this.canvas = editor.canvas;
};

Eraser.prototype = 
{
    /**
     * The same thing as mouse down, draw pixels
     */
    onMouseMove: function(x, y)
    {
        this.onMouseDown(x, y);
    },
    
    /**
     * Draw pixel on canvas
     */
    onMouseDown: function(x, y)
    {
        var data = this.pixelData,
            pos = data.pointToPixel(this.canvas, x, y);
        
        x = pos.x;
        y = pos.y;
        
        if (x < 0 || x >= data.w || y < 0 || y >= data.h) return;

        data.set(x, y, [0, 0, 0, 0]);
        data.renderPixel(this.canvas.getContext("2d"), x, y, pos.scale);
    }
};