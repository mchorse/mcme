/**
 * Some JS utils
 * 
 * @author McHorse
 */

module.exports =
{
    /**
     * Extend child constructor with parent constructor with given methods
     * 
     * @param {Function} child
     * @param {Function} parent
     * @param {Object} methods
     */
    extend: function(child, parent, methods)
    {
        child.prototype = Object.create(parent.prototype);
    
        for (var key in methods)
        {
            child.prototype[key] = methods[key];
        }
    }
}