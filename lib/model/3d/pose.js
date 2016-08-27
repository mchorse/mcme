var Transform = require("./transform");

/**
 * Pose class
 * 
 * This class keeps the limbs transformations and entity size during this pose.
 */

var Pose = module.exports = function()
{
    this.size = [1, 1, 1];
    this.limbs = {};
};

Pose.prototype = 
{
    /**
     * Form missing limb transformations
     */
    form: function(model)
    {
        var self = this;
        
        model.limbs.forEach(function (limb) {            
            if (!self.limbs[limb.id])
            {
                self.limbs[limb.id] = new Transform();
            }
        });
    },
    
    /**
     * Remove limb from this pose
     * 
     * @param {String} id
     */
    removeLimb: function(id)
    {
        this.limbs[id] && (this.limbs[id] = undefined);
    },
    
    /**
     * @return {Object}
     */
    exportPose: function()
    {
        var pose = 
        {
            size: this.size,
            limbs: {},
        };
        
        for (var key in this.limbs)
        {
            pose.limbs[key] = this.limbs[key].exportTransform();
        }
        
        return pose;
    },
    
    /**
     * Import the pose
     * 
     * @param {Object} pose
     */
    importPose: function(pose)
    {
        this.size = pose.size;
        this.limbs = {};
        
        for (var key in pose.limbs)
        {
            var transform = new Transform();
            
            transform.importTransform(pose.limbs[key]);
            
            this.limbs[key] = transform;
        }
    },
    
    /**
     * Apply pose on the model
     * 
     * @param {Model} model
     */
    applyPose: function(model)
    {
        model.limbs.forEach(this.applyMesh.bind(this));
    },
    
    /**
     * Apply pose on the model's limb
     * 
     * @param {Limb}
     */
    applyMesh: function(limb)
    {
        var mesh = limb.mesh,
            pose = this.limbs[limb.id];
        
        if (pose == null)
        {
            return console.warn(limb);
        }
        
        var PI = Math.PI
        
        var translate = pose.translate,
            scale = pose.scale,
            rotate = pose.rotate;
        
        var y = translate[1] - (limb.parent ? 0 : this.size[1] * 16 / 2);
        
        mesh.position.set(translate[0] / 8, y / 8, translate[2] / 8);
        mesh.scale.set(scale[0], scale[1], scale[2]);
        mesh.rotation.set(rotate[0] / 180 * PI, rotate[1] / 180 * PI, rotate[2] / 180 * PI);
    }
};