/**
 * Scale tool class
 * 
 * Allows users to scale current limb.
 */

var Scale = module.exports = function(editor)
{
    this.editor = editor;
    this.model = editor.model;
    this.poses = editor.settings.poses;
};

Scale.prototype = 
{
    onMouseMove: function(x, y)
    {
        var limb = this.editor.limb;
        
        if (limb == null) return;
        
        limb = limb.limb;
        
        y -= this.y;
        y /= 20;
        
        var pose = this.poses.current(),
            transform = pose.forLimb(limb.id);
        
        var sx = transform.scale[0],
            sy = transform.scale[1],
            sz = transform.scale[2];
        
        transform.scale[0] = +Math.clamp(this.sx + y, 0, Infinity).toFixed(1);
        transform.scale[1] = +Math.clamp(this.sy + y, 0, Infinity).toFixed(1);
        transform.scale[2] = +Math.clamp(this.sz + y, 0, Infinity).toFixed(1);
        
        if (transform.scale[0] <= 0) transform.scale[0] = sx;
        if (transform.scale[1] <= 0) transform.scale[1] = sy;
        if (transform.scale[2] <= 0) transform.scale[2] = sz;
        
        this.model.applyLimbPose(limb, pose);
        this.editor.render();
        this.editor.settings.poses.fill();
    },
    
    onMouseDown: function(x, y)
    {
        var limb = this.editor.limb;
        
        if (limb == null) return;
        
        var transform = this.poses.current().forLimb(limb.limb.id);
        
        this.y = y;
        
        this.sx = transform.scale[0];
        this.sy = transform.scale[1];
        this.sz = transform.scale[2];
    }
};