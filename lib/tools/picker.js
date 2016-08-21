/**
 * Picker tool class
 * 
 * Allows users to pick a color from canvas.
 */

var Picker = module.exports = function(editor)
{
    this.editor = editor;
    this.pixelData = editor.app.skin;
    this.canvas = editor.canvas;
};

Picker.prototype = 
{
    onMouseMove: function(x, y)
    {},
    
    onMouseDown: function(x, y)
    {
        var data = this.pixelData,
            pos = data.pointToPixel(this.canvas, x, y);
    
        this.editor.picker.setColor(data.get(pos.x, pos.y));
    }
};