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
     * 
     * @param {Model} model
     */
    form: function(model)
    {
        model.limbs.forEach(this.formLimb.bind(this));
    },
    
    /**
     * @param {Limb} limb
     */
    formLimb: function(limb)
    {
        this.limbs[limb.id] || (this.limbs[limb.id] = new Transform());
    },
    
    /**
     * Get transformation for limb by given id
     * 
     * @param {String} id
     * @return {Transform|undefined}
     */
    forLimb: function(id)
    {
        return this.limbs[id];
    },
    
    /**
     * Rename limb
     * 
     * @param {String} from
     * @param {String} to
     */
    rename: function(from, to)
    {
        this.limbs[to] = this.limbs[from];
        
        delete this.limbs[from];
    },
    
    /**
     * Remove limb from this pose
     * 
     * @param {String} id
     */
    removeLimb: function(id)
    {
        if (this.limbs[id]) delete this.limbs[id];
    },
    
   /**
    * Export this pose
    * 
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
           var transform = this.limbs[key].exportTransform();
           
           if (Object.keys(transform).length) pose.limbs[key] = transform;
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
   }
};