/**
 * Rotate tool class
 * 
 * Allows users to rotate current limb.
 */

var Rotate = module.exports = function(editor)
{
    this.editor = editor;
    this.model = editor.app.actor.group;
    this.poses = editor.settings.poses;
};

Rotate.prototype = 
{
    onMouseMove: function(x, y)
    {
        var limb = this.editor.limb;
        
        if (limb == null) return;
        
        limb = limb.limb;
        
        var key = this.editor.app.key,
            shift = key && key.shiftKey;
        
        x -= this.x;
        y -= this.y;
        
        var transform = this.poses.current().forLimb(limb.id);
        
        if (shift)
        {
            transform.rotate[0] = Math.floor(this.rx + y);
            transform.rotate[1] = Math.floor(this.ry + x);
        }
        else
        {
            transform.rotate[0] = Math.floor(this.rx + y);
            transform.rotate[2] = Math.floor(this.rz + x);
        }
        
        this.poses.current().applyMesh(limb);
        this.editor.render();
        this.editor.settings.poses.fill();
    },
    
    onMouseDown: function(x, y)
    {
        var limb = this.editor.limb;
        
        if (limb == null) return;
        
        var transform = this.poses.current().forLimb(limb.limb.id);
        
        this.x = x;
        this.y = y;
        
        this.rx = transform.rotate[0];
        this.ry = transform.rotate[1];
        this.rz = transform.rotate[2];
    }
};