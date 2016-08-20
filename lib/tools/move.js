/**
 * Move tool class
 * 
 * Allows users to move the canvas around the component's screen.
 */

var Move = module.exports = function(editor)
{
    this.canvas = editor.canvas;
};

Move.prototype = 
{
    onMouseMove: function(x, y)
    {
        x = this.marginLeft - (this.x - x);
        y = this.marginTop - (this.y - y);
        
        this.canvas.style.marginLeft = x + "px";
        this.canvas.style.marginTop = y + "px";
    },
    
    onMouseDown: function(x, y)
    {
        this.x = x;
        this.y = y;
        
        this.marginLeft = parseInt(this.canvas.style.marginLeft) || -this.canvas.width / 2;
        this.marginTop  = parseInt(this.canvas.style.marginTop)  || -this.canvas.height / 2;
    }
};