/**
 * Move tool class
 * 
 * Allows users to move the canvas around the component's screen.
 */

var Move = module.exports = function(editor)
{
    this.editor = editor;
    this.model = editor.app.actor;
};

Move.prototype = 
{
    onMouseMove: function(x, y)
    {
        x -= this.x;
        y -= this.y;
        
        console.log(x, y);
        
        this.model.group.rotation.x = this.rx + y / 90;
        this.model.group.rotation.y = this.ry + x / 90;
        
        this.editor.render();
    },
    
    onMouseDown: function(x, y)
    {
        this.x = x;
        this.y = y;
        
        this.rx = this.model.group.rotation.x;
        this.ry = this.model.group.rotation.y;
    }
};