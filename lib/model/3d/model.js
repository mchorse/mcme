var Poses = require("./poses"),
    Limb = require("./limb");

/**
 * Model class
 * 
 * This class is responsible for importing/exporting model to/from JSON, 
 * manipulating and providing access to model's limbs. No ThreeJS code should 
 * be here, because this is domain code.
 */

var Model = module.exports = function()
{
    /* Domain data */
    this.name = "";
    this.limbs = [];
    this.poses = new Poses();
};

Model.prototype = 
{
    /**
     * Add a limb to the model with given parent
     * 
     * @param {Limb} parent
     * @return {Limb}
     */
    add: function(parent)
    {
        var limb = new Limb();
        
        this.limbs.push(limb);
        this.poses.formLimb(limb);
        
        limb.parent = parent ? parent.id : "";
        
        return limb;
    },
    
    /**
     * Remove given limb from model
     * 
     * @param {Limb} limb
     * @return {Boolean} - If limb was removed
     */
    remove: function(limb)
    {
        var index = this.limbs.indexOf(limb),
            self = this;
        
        if (index != -1)
        {
            this.limbs.forEach(function (child) {
                if (child.parent == limb.id) self.remove(child);
            });
            
            this.limbs.splice(index, 1);
            this.poses.removeLimb(limb.id);
        }
        
        return index != -1;
    },
    
    /**
     * Get limb by its name (id)
     * 
     * @param {String} id
     * @return {Limb|null}
     */
    get: function(id)
    {
        for (var i = 0, c = this.limbs.length; i < c; i ++)
        {
            if (this.limbs[i].id == id) return this.limbs[i];
        }
    },
    
   /**
    * Check if limb by given id is exist
    * 
    * @param {String} id
    * @return {Boolean}
    */
   hasLimb: function(id)
   {
       return this.get(id) != null;
   },
    
    /* @pragma_mark - Exporting and importing */
    
    /**
     * Export the model as JS object (you can JSON.stringify it later)
     * 
     * @see {@link docs/JSON-Scheme.md}
     * @return {Object} - Object that confirms to Model JSON Scheme
     */
    exportModel: function()
    {
        var model = 
        {
            scheme: "1.3",
            name: this.name,
            poses: this.poses.exportPoses(),
            limbs: {}
        };
        
        for (var i = 0, c = this.limbs.length; i < c; i ++)
        {
            var limb = this.limbs[i];
            
            model.limbs[limb.id] = limb.exportLimb();
        }
        
        return model;
    },
    
    /**
     * Export the model as JSON string
     * 
     * @return {String}
     */
    exportJSON: function()
    {
        return JSON.stringify(this.exportModel(), null, 4);
    },
    
    /**
     * Import the model as JS object that confirms to Model JSON Scheme
     * 
     * @see {@link docs/JSON-Scheme.md}
     * @param {Object} model - Object that confirms to Model JSON Scheme
     */
    importModel: function(model)
    {
        this.limbs.length = 0;
        
        /* Import */
        this.name = model.name;
        this.poses.importPoses(model.poses);
        
        /* Import limbs */
        for (var key in model.limbs) 
        {
            var limb = new Limb();

            limb.importLimb(model.limbs[key]);
            limb.id = key;
            
            this.limbs.push(limb);
        }
        
        /* Fill with blanks */
        this.poses.form(this);
    },
    
    /**
     * Import the model with JSON string
     * 
     * @param {String} json
     */
    importJSON: function(json)
    {
        this.importModel(JSON.parse(json));
    }
};