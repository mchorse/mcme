/**
 * Zoom tool class
 * 
 * Allows users to zoom the canvas in or out.
 */

var Zoom = module.exports = function(editor)
{
    this.editor = editor;
    this.canvas = editor.canvas;
};

Zoom.prototype = 
{
    onMouseMove: function(x, y)
    {},
    
    onMouseDown: function(x, y)
    {
        var key = this.editor.app.key,
            factor = key && key.shiftKey ? 0.5 : 2;
        
        var w = this.canvas.width * factor,
            h = this.canvas.height * factor;
        
        this.canvas.width = w;
        this.canvas.height = h;
    }
};