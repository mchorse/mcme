/**
 * Bucket tool class
 * 
 * Allows users to fill an area of pixels on canvas.
 */

var Bucket = module.exports = function(editor)
{
    this.editor = editor;
};

Bucket.prototype = 
{
    onMouseMove: function(x, y)
    {},
    
    onMouseDown: function(x, y)
    {}
};