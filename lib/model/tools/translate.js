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
        
        x = (x - this.x) / 30;
        y = (y - this.y) / 30;
        
        /* NlL5's translation formula implementation */
        var w = 1;
        
        var b = this.model.group.rotation.x,
            c = this.model.group.rotation.y,
            a = this.model.group.rotation.z;
        
        var xx = ( Math.cos(a) * Math.cos(c) + Math.sin(a) * Math.sin(b) * Math.sin(c)) * w;
        var yy = (-Math.sin(a) * Math.cos(c) + Math.cos(a) * Math.sin(b) * Math.sin(c)) * w;
        var zz = ( Math.cos(b) * Math.sin(c)) * w;
        
        /* Continues "fun" stuff */
        var pose = this.poses.current(),
            transform = pose.forLimb(limb.id);
        
        transform.translate[0] = Math.floor((this.tx + xx * x) * 10) / 10;
        transform.translate[1] = Math.floor((this.ty + yy * x) * 10) / 10;
        transform.translate[2] = Math.floor((this.tz + zz * x) * 10) / 10;
        
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