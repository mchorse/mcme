/**
 * Eraser tool class
 * 
 * Allows users to erase pixels on canvas.
 */

var Eraser = module.exports = function(editor)
{
    this.editor = editor;
};

Eraser.prototype = 
{
    onMouseMove: function(x, y)
    {},
    
    onMouseDown: function(x, y)
    {}
};