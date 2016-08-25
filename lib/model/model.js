var canvas = document.createElement("canvas");

canvas.width = 64;
canvas.height = 32;

/**
 * Model class
 * 
 * This class is responsible for importing/exporting model to/from JSON, 
 * manipulating and providing access to model's limbs.
 */

var Model = module.exports = function(skin)
{
    this.limbs = [];
    this.skin = skin;
    
    var texture = new THREE.Texture(canvas);
    
    texture.minFilter = texture.magFilter = THREE.NearestFilter;
    
    this.group = new THREE.Object3D();
    this.material = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        transparent: true,
        map: texture
    });
};

Model.prototype = 
{
    /**
     * Build the model
     */
    build: function()
    {
        var self = this;
        
        for (var i = this.group.children.length - 1; i >= 0; i --)
        {
            this.group.remove(this.group.children[i]);
        }
        
        this.limbs.forEach(function (limb) {
            var mesh = limb.createMesh(self.material);
            
            limb.mapUV(mesh, 64, 32);
            
            self.group.add(mesh);
        });
    },
    
    /**
     * Update model's texture (render skin to the material's texture and flag 
     * them dirty)
     */
    updateTexture: function()
    {
        canvas.width = this.skin.w;
        canvas.height = this.skin.h;
        
        this.skin.render(canvas.getContext("2d"), this.skin.w, this.skin.h);
        
        this.material.map.needsUpdate = true;
        this.material.needsUpdate = true;
    },
    
    /**
     * Export the model as JS object (you can JSON.stringify it later)
     * 
     * @see {@link docs/JSON-Scheme.md}
     * @return {Object} - Object that confirms to Model JSON Scheme
     */
    exportModel: function()
    {
        /* @todo actually implement it */
        return {};
    },
    
    /**
     * Export the model as JSON string
     * 
     * @return {String}
     */
    exportJSON: function()
    {
        return JSON.stringify(this.exportModel());
    },
    
    /**
     * Import the model as JS object that confirms to Model JSON Scheme
     * 
     * @see {@link docs/JSON-Scheme.md}
     * @param {Object} model - Object that confirms to Model JSON Scheme
     */
    importModel: function(model)
    {
        /* @todo actually implement it */
    },
    
    /**
     * Import the model with JSON string
     * 
     * @param {String} json
     */
    importJSON: function(json)
    {
        this.importModel(JSON.parse(json));
    }
};