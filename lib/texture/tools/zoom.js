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
        
        /* I don't really know what I did here, but it works, you know. This 
         * code does some magic computation, then applies some variables, and 
         * then... I don't have any idea how I came up with this...  */
        var data = this.editor.app.skin,
            pos  = data.pointToPixel(this.canvas, x, y);
        
        var left = parseInt(this.canvas.style.marginLeft) || 0,
            top  = parseInt(this.canvas.style.marginTop)  || 0;
        
        var ww = pos.x / data.w,
            hh = pos.y / data.h;
        
        if (factor == 2)
        {
            ww = 1 - ww;
            hh = 1 - hh;
            
            this.canvas.style.marginLeft = (left + this.canvas.width * ww - w / 2) + "px";
            this.canvas.style.marginTop  = (top + this.canvas.height * hh - h / 2) + "px";
        }
        else
        {
            this.canvas.style.marginLeft = (left - w * ww + this.canvas.width * ww) + "px";
            this.canvas.style.marginTop  = (top - h * hh + this.canvas.height * hh) + "px";
        }
        
        this.canvas.width = w;
        this.canvas.height = h;
        
        /* Re-render canvas again (because when canvas width is changed canvas
         * contents is being cleared) */
        this.editor.render();
    }
};