/**
 * Picker tool class
 * 
 * Allows users to pick a color from canvas.
 */

var Picker = module.exports = function(editor)
{
    this.editor = editor;
};

Picker.prototype = 
{
    onMouseMove: function(x, y)
    {},
    
    onMouseDown: function(x, y)
    {}
};