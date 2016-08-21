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
    },
    
    /**
     * Convert RGBA array color to CSS string
     * 
     * @param {Array} color
     * @return {String}
     */
    to_color: function(color)
    {
        var r = color[0],
            g = color[1],
            b = color[2],
            a = color[3];
    
        return "rgba(" + r + "," + g + "," + b + "," + a + ")";
    }
}