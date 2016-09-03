/**
 * Translate tool class
 * 
 * Allows users to translate current limb.
 */

var Translate = module.exports = function(editor)
{
    this.editor = editor;
    this.model = editor.model;
    this.poses = editor.settings.poses;
};

Translate.prototype = 
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
        
        x /= 30;
        y /= 30;
        
        var pose = this.poses.current(),
            transform = pose.forLimb(limb.id);
        
        if (shift)
        {
            transform.translate[0] = Math.floor((this.tx + x) * 10) / 10;
            transform.translate[2] = Math.floor((this.tz - y) * 10) / 10;
        }
        else
        {
            transform.translate[0] = Math.floor((this.tx + x) * 10) / 10;
            transform.translate[1] = Math.floor((this.ty - y) * 10) / 10;
        }
        
        this.model.applyLimbPose(limb, pose);
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
        
        this.tx = transform.translate[0];
        this.ty = transform.translate[1];
        this.tz = transform.translate[2];
    }
};