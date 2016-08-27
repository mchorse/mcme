/**
 * Move tool class
 * 
 * Allows users to move the canvas around the component's screen.
 */

var Move = module.exports = function(editor)
{
    this.editor = editor;
    this.model = editor.app.actor.group;
};

Move.prototype = 
{
    onMouseMove: function(x, y)
    {
        x -= this.x;
        y -= this.y;
        
        this.model.rotation.x = this.rx + y / 90;
        this.model.rotation.y = this.ry + x / 90;
        
        this.editor.render();
    },
    
    onMouseDown: function(x, y)
    {
        this.x = x;
        this.y = y;
        
        this.rx = this.model.rotation.x || 0;
        this.ry = this.model.rotation.y || 0;
    }
};