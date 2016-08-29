var Pose = require("./pose");

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
     * This method is responsible for adding missing transforms to child 
     * 
     * @param {Model} model
     */
    form: function(model)
    {
        for (var key in this.poses)
        {
            this.poses[key].form(model);
        }
    },
    
    /**
     * Form limb
     * 
     * @param {Limb} limb
     */
    formLimb: function(limb)
    {
        for (var key in this.poses)
        {
            this.poses[key].formLimb(limb);
        }
    },
    
    /**
     * @param {String} id
     * @param {String} pose
     * @return {Pose}
     */
    getPoseForLimb: function(id, pose)
    {
        return this.poses[pose].forLimb(id);
    },
    
    /**
     * @param {String} pose
     * @return {Pose}
     */
    get: function(pose)
    {
        return this.poses[pose];
    },
    
    /**
     * Rename the limb from one name to another name
     * 
     * @param {String} from
     * @param {String} to
     */
    rename: function(from, to)
    {
        for (var key in this.poses)
        {
            this.poses[key].rename(from, to);
        }
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