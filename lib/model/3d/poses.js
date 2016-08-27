var utils = require("../../utils");

/**
 * Transforms class
 * 
 * This class keeps transformations for every limb in the 
 */

var Transform = function()
{
    this.translate = [0, 0, 0];
    this.scale = [1, 1, 1];
    this.rotate = [0, 0, 0];
};

Transform.prototype = 
{
    /**
     * Export transform
     * 
     * @return {Object}
     */
    exportTransform: function()
    {
        return utils.extract(this, ["translate", "scale", "rotate"]);
    },
    
    /**
     * Import transform
     * 
     * @param {Object} transform
     */
    importTransform: function(transform)
    {
        utils.merge(this, transform);
    }
};

/**
 * Pose class
 * 
 * This class keeps the limbs transformations and entity size during this pose.
 */

var Pose = function()
{
    this.size = [1, 1, 1];
    this.limbs = {};
};

Pose.prototype = 
{
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

/**
 * Poses manager
 * 
 * This class is responsible for applying and storing the poses for model.
 * Poses are basically transformations for limbs in specific state (like 
 * standing, sneaking, sleeping, and flying an elytra).
 */

var Poses = module.exports = function()
{
    this.poses = {};
};

Poses.prototype = 
{
    /**
     * @param {String} id
     * @param {String} pose
     */
    getPoseForLimb: function(id, pose)
    {
        return this.poses[pose].limbs[id];
    },
    
    get: function(pose)
    {
        return this.poses[pose];
    },
    
    /**
     * Remove limb from poses
     * 
     * @param {String} id
     */
    removeLimb: function(id)
    {
        for (var key in this.poses)
        {
            this.poses[key].removeLimb(id);
        }
    },
    
    /**
     * Export all those fancy poses
     * 
     * @return {Object}
     */
    exportPoses: function()
    {
        var poses = {};
        
        for (var key in this.poses)
        {
            poses[key] = this.poses[key].exportPose();
        }
        
        return poses;
    },
    
    /**
     * Import the pose
     * 
     * @param {Object} poses
     */
    importPoses: function(poses)
    {
        this.poses = {};
        
        for (var key in poses)
        {
            var pose = new Pose();
            
            pose.importPose(poses[key]);
            
            this.poses[key] = pose;
        }
    }
};

module.exports.Transform = Transform;
module.exports.Pose = Pose;