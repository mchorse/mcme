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
    this.rotation = [0, 0, 0];
};

Transform.prototype = 
{
    exportTransform: function()
    {
        return utils.extract(this, ["translate", "scale", "rotation"]);
    },
    
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
     * @return {Object}
     */
    exportPose: function()
    {
        var pose = {};
        
        for (var key in this.limbs)
        {
            pose[key] = this.limbs[key].exportTransform();
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
        
        for (var key in pose)
        {
            var transform = new Transform();
            
            transform.importTransform(pose[key]);
            
            this.limbs[key] = transform;
        }
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