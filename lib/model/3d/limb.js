var UV = require("./uv");

/**
 * Limb class
 * 
 * This class is responsible for managing a mesh with given texture and stuff, 
 * but also store essential information for later export.
 */

var Limb = module.exports = function(parent)
{
    this.id = "";
    this.role = "body";
    this.size = [8, 8, 8];
    this.texture = [0, 16];
    this.anchor = [0.5, 0.5, 0.5];
    this.parent = parent || null;
    this.children = [];
    
    this.transforms = {
        translate: [0, 0, 0],
        scale: [1, 1, 1],
        rotation: [0, 0, 0]
    };
};

Limb.prototype = 
{
    /**
     * Create a mesh from this limb
     * 
     * @param {THREE.Material} material
     * @return {THREE.Mesh}
     */
    createMesh: function(material)
    {
        var cube = new THREE.BoxGeometry(this.size[0] / 8, this.size[1] / 8, this.size[2] / 8),
            mesh = new THREE.Mesh(cube, material);
        
        return mesh;
    },
    
    /**
     * Inject limb's transformations and stuff into the mesh
     * 
     * @param {THREE.Mesh} mesh
     */
    injectValues: function(mesh)
    {
        /* Do stuff */
    },
    
    /**
     * Map UV onto the mesh
     * 
     * @param {THREE.Mesh} mesh
     */
    mapUV: function(mesh, w, h, reflect)
    {
        var u = this.texture[0],
            v = this.texture[1];
        
        UV.cube(w, h, mesh.geometry, u, v, this.size[0], this.size[1], this.size[2], reflect);
    }
};