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
    
        return "rgba(" + Math.floor(r) + "," + Math.floor(g) + "," + Math.floor(b) + "," + Math.floor(a) + ")";
    },
    
    /**
     * @param {String} color
     * @return {Array}
     */
    parse: function(color)
    {
        var ctx = canvas.getContext("2d");

        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);

        var data = ctx.getImageData(0, 0, 1, 1).data;

        return [data[0], data[1], data[2], data[3] / 255];
    }
};