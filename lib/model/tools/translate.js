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
    
    this.vector = new THREE.Vector3(0, 0, 0);
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
        
        x = (x - this.x) / 24;
        y = (y - this.y) / 24;
        
        /* NlL5's translation formula implementation */
        this.vector.set(x, !shift ? -y : 0, shift ? y : 0);
        this.vector.applyQuaternion(this.quat);
        
        /* Continues "fun" stuff */
        var pose = this.poses.current(),
            transform = pose.forLimb(limb.id);
        
        transform.translate[0] = Math.floor((this.tx + this.vector.x) * 10) / 10;
        transform.translate[1] = Math.floor((this.ty + this.vector.y) * 10) / 10;
        transform.translate[2] = Math.floor((this.tz + this.vector.z) * 10) / 10;
        
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
        
        /* Initiating the quaternion */
        var axis = this.model.group.rotation.clone();
        
        axis.y *= -1;
        
        this.quat = new THREE.Quaternion();
        this.quat.setFromEuler(axis);
        
        /* Saving old values */
        this.tx = transform.translate[0];
        this.ty = transform.translate[1];
        this.tz = transform.translate[2];
    }
};