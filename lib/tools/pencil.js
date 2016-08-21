/**
 * Pencil tool class
 * 
 * Allows users to draw on canvas.
 */

var Pencil = module.exports = function(editor)
{
    this.editor = editor;
};

Pencil.prototype = 
{
    onMouseMove: function(x, y)
    {},
    
    onMouseDown: function(x, y)
    {}
};