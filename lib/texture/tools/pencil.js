/**
 * Pencil tool class
 * 
 * Allows users to draw on canvas.
 */

var Pencil = module.exports = function(editor)
{
    this.pixelData = editor.app.skin;
    this.canvas = editor.canvas;
    this.picker = editor.picker;
};

Pencil.prototype = 
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
        
        var color = this.picker.primary;
        
        data.set(x, y, Color.hsl(color[0], color[1], color[2]).rgbData());
        data.renderPixel(this.canvas.getContext("2d"), x, y, pos.scale);
    }
};