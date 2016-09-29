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
        
        x = (x - this.x) / 24;
        y = (y - this.y) / 24;
        
        /* NlL5's translation formula implementation */
        this.vector.set(x, !shift ? -y : 0, shift ? y : 0);
        this.vector.applyMatrix4(this.matrix);
        
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
        
        /* Initiating the matrix */
        var m = new THREE.Matrix4();

        var m1 = new THREE.Matrix4();
        var m2 = new THREE.Matrix4();
        var m3 = new THREE.Matrix4();

        var alpha = this.model.group.rotation.x;
        var beta = -this.model.group.rotation.y;
        var gamma = this.model.group.rotation.z;

        m1.makeRotationX(alpha);
        m2.makeRotationY(beta);
        m3.makeRotationZ(gamma);

        m.multiplyMatrices(m1, m2);
        m.multiply(m3);
        
        this.vector = new THREE.Vector3(0, 0, 0);
        this.matrix = m;
        
        /* Saving old values */
        this.tx = transform.translate[0];
        this.ty = transform.translate[1];
        this.tz = transform.translate[2];
    }
};