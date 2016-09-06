/**
 * Some JS utils
 * 
 * @author McHorse
 */

var canvas = document.createElement("canvas");

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
        
        if (typeof a == "undefined")
        {
            a = 1;
        }
    
        return "rgba(" + Math.floor(r) + "," + Math.floor(g) + "," + Math.floor(b) + "," + a + ")";
    },
    
    /**
     * @param {String} color
     * @return {Array}
     */
    parse: function(color)
    {
        var ctx = canvas.getContext("2d");

        ctx.fillStyle = color;
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillRect(0, 0, 1, 1);

        var data = ctx.getImageData(0, 0, 1, 1).data;

        return [data[0], data[1], data[2], data[3] / 255];
    },
    
    /**
     * Extract
     * 
     * @param {Object} object
     * @param {Array} keys
     */
    extract: function(object, keys)
    {
        var result = {};
        
        for (var key in object)
        {
            if (keys.indexOf(key) != -1)
            {
                result[key] = object[key];
            }
        }
        
        return result;
    },
    
    /**
     * Extend
     * 
     * @param {Object} a
     * @parma {Object} b
     */
    merge: function(a, b)
    {
        for (var key in b) a[key] = b[key];
    }
};