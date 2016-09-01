var UV = require("./uv"),
    utils = require("../../utils");

var id = 0;

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
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.mesh.limb = this;
        
        this.setupAnchor();
    },
    
    /**
     * Regenerate this limb. Use this method when the limb's properties (not 
     * pose transformations) such as anchor and size were changed.
     */
    regenerate: function()
    {
        var parent = this.mesh.parent,
            material = this.mesh.material,
            self = this;
        
        var children = [];
        
        /* Collect all children */
        for (var i = 0, c = this.mesh.children.length; i < c; i ++)
        {
            var child = this.mesh.children[i];
            
            children.push(child);
        }    
        
        parent.remove(this.mesh);
        
        this.mesh.geometry.dispose();
        this.mesh = null;
        this.build(material);
        
        /* Inject those children back */
        children.forEach(function (child) {
            self.mesh.add(child);
        });
        
        parent.add(this.mesh);
    },
    
    /**
     * Update the rotation point (the anchor of the limb)
     */
    setupAnchor: function()
    {
        var w = this.size[0] / 8,
            h = this.size[1] / 8,
            d = this.size[2] / 8;
        
        var x = this.anchor[0],
            y = this.anchor[1],
            z = this.anchor[2];
        
        this.mesh.geometry.translate(-w / 2, -h / 2, -d / 2);
        this.mesh.geometry.translate(x * w, y * h, z * d);
    },
    
    /**
     * Map UV onto the mesh
     * 
     * @param {PixelData} data
     */
    mapUV: function(data)
    {
        var w = this.size[0],
            h = this.size[1],
            d = this.size[2];
        
        var u = this.texture[0],
            v = data.h - (this.texture[1] + h + d);
        
        UV.cube(data.w, data.h, this.mesh.geometry, u, v, w, h, d, this.mirror);
    },
    
    /**
     * Export the limb
     * 
     * This method also clean ups all the values that are equal to default
     * 
     * @return {Object}
     */
    exportLimb: function()
    {
        var model = utils.extract(this, ["parent", "holding", "swiping", "looking", "swinging", "texture", "size", "anchor", "mirror"]);
        
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