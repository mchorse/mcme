var utils = require("../../utils");

/**
 * Transforms class
 * 
 * This class keeps transformations for every limb in the 
 */

var Transform = module.exports = function()
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