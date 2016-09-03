var UV = require("./uv"),
    utils = require("../../utils");

/* Incrementing ID for limbs */
var id = 0;

/* Properties to export */
var props = [
    "parent", "holding", "swiping", "looking", "swinging", "texture", "size", 
    "anchor", "mirror"
];

/**
 * Limb class
 * 
 * This class is responsible for managing a mesh with given texture and stuff, 
 * but also store essential information for later export.
 */

var Limb = module.exports = function()
{
    /* Basic properties that goes to export */
    this.id = "limb_" + (id ++);
    this.parent = "";
    
    this.size = [4, 4, 4];
    this.texture = [0, 0];
    this.anchor = [0.5, 0.5, 0.5];
    
    this.mirror = false;
    
    this.holding = "";
    this.swiping = false;
    this.looking = false;
    this.swinging = false;
};

Limb.prototype = 
{
    /**
     * Export the limb
     * 
     * This method also clean ups all the values that are equal to default
     * 
     * @return {Object}
     */
    exportLimb: function()
    {
        var model = utils.extract(this, props);
        
        if (!model.parent) delete model.parent;
        if (!model.holding) delete model.holding;
        if (!model.swiping) delete model.swiping;
        if (!model.looking) delete model.looking;
        if (!model.swinging) delete model.swinging;
        if (!model.mirror) delete model.mirror;
        
        return model;
    },
    
    /**
     * Import the limb
     * 
     * @param {Object} limb
     */
    importLimb: function(limb)
    {
        utils.merge(this, limb);
    }
};