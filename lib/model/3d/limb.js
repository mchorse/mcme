var UV = require("./uv"),
    utils = require("../../utils");

/**
 * Limb class
 * 
 * This class is responsible for managing a mesh with given texture and stuff, 
 * but also store essential information for later export.
 */

var Limb = module.exports = function(parent)
{
    /* Basic properties that goes to export */
    this.id = "";
    this.role = "body";
    this.size = [4, 4, 4];
    this.texture = [0, 0];
    this.anchor = [0.5, 0.5, 0.5];
    this.parent = parent || "";
    this.mirror = false;
    
    /* Mesh */
    this.mesh = null;
};

Limb.prototype = 
{
    /**
     * Create a mesh from this limb
     * 
     * @param {THREE.Material} material
     * @return {THREE.Mesh}
     */
    build: function(material)
    {
        var cube = new THREE.BoxGeometry(this.size[0] / 8, this.size[1] / 8, this.size[2] / 8);
        
        this.mesh = new THREE.Mesh(cube, material);
        this.updateValues();
    },
    
    /**
     * Update the rotation point
     */
    updateValues: function()
    {
        var w = this.size[0] / 8,
            h = this.size[1] / 8,
            d = this.size[2] / 8;
        
        var x = this.anchor[0],
            y = this.anchor[1],
            z = this.anchor[2];
        
            console.log(this.id, x * w, y * h, z * d);
        
        this.mesh.geometry.translate(-w / 2, -h / 2, -d / 2);
        this.mesh.geometry.translate(x * w, y * h, z * d);
    },
    
    /**
     * Map UV onto the mesh
     * 
     * @param {Number} width
     * @param {Number} height
     */
    mapUV: function(width, height)
    {
        var w = this.size[0],
            h = this.size[1],
            d = this.size[2];
        
        var u = this.texture[0],
            v = height - (this.texture[1] + h + d);
        
        UV.cube(width, height, this.mesh.geometry, u, v, w, h, d, this.mirror);
    },
    
    /**
     * Export the limb
     * 
     * @return {Object}
     */
    exportLimb: function()
    {
        return utils.extract(this, ["id", "role", "size", "texture", "parent", "mirror"]);
    },
    
    /**
     * Import the limb
     * 
     * @param {Object} limb
     */
    importLimb: function(limb)
    {
        utils.merge(this, limb);
    },
};