var utils = require("../../utils");

function isEmpty(array, value, result)
{
    result = true;
    value = typeof value == "undefined" ? 0 : value;
    
    for (var i = 0; i < array.length; i ++)
    {
        result = result && array[i] === value;
    }
    
    return result;
}

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
     * Export the transform
     * 
     * @return {Object}
     */
    exportTransform: function()
    {
        var transform = {};
        
        if (!isEmpty(this.translate, 0)) transform.translate = this.translate.slice();
        if (!isEmpty(this.scale, 1)) transform.scale = this.scale.slice();
        if (!isEmpty(this.rotate, 0)) transform.rotate = this.rotate.slice();
        
        return transform;
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