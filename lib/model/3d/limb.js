var UV = require("./uv");

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
    
    /* Transformation properties (for export, they're stored in poses) */
    this.translate = [0, 0, 0];
    this.scale = [1, 1, 1];
    this.rotation = [0, 0, 0];
    
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
    
    updateValues: function()
    {
        var PI = Math.PI;
        
        var translate = this.translate,
            scale = this.scale,
            rotation = this.rotation;
        
        this.mesh.position.set(translate[0] / 8, translate[1] / 8, translate[2] / 8);
        this.mesh.scale.set(scale[0], scale[1], scale[2]);
        this.mesh.rotation.set(rotation[0] / 180 * PI, rotation[1] / 180 * PI, rotation[2] / 180 * PI);
        
        /* @todo Set rotation (this.anchor) point */
    },
    
    /**
     * Map UV onto the mesh
     * 
     * @param {Number} w
     * @param {Number} h
     */
    mapUV: function(w, h)
    {
        var u = this.texture[0],
            v = this.texture[1];
        
        UV.cube(w, h, this.mesh.geometry, u, v, this.size[0], this.size[1], this.size[2], this.mirror);
    },
    
    /**
     * Export limb
     * 
     * @return {Object}
     */
    exportLimb: function()
    {
        return {
            id: this.id,
            role: this.role,
            size: this.size,
            texture: this.texture,
            anchor: this.anchor,
            parent: this.parent
        };
    },
    
    /**
     * Import limb
     * 
     * @param {Object} limb
     */
    importLimb: function(limb)
    {
        this.id = limb.id;
        this.role = limb.role;
        this.size = limb.size;
        this.texture = limb.texture;
        this.anchor = limb.anchor;
        this.parent = limb.parent;
    },
};