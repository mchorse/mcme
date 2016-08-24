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
        
        /* Browser may crash if the canvas is way too big, let's keep it 
         * not too big and at least 1:1 */
        if (
            w > 2048 || w < this.editor.app.skin.w || 
            h > 2048 || h < this.editor.app.skin.h
        ) return;
        
        this.canvas.width = w;
        this.canvas.height = h;
        
        /* Re-render canvas again (because when canvas width is changed canvas
         * contents is being cleared) */
        this.editor.render();
    }
};