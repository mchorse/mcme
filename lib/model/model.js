var Poses = require("./3d/poses"),
    Limb = require("./3d/limb");

/* Canvas for drawing texture from texture editor */
var canvas = document.createElement("canvas");

/**
 * Model class
 * 
 * This class is responsible for importing/exporting model to/from JSON, 
 * manipulating and providing access to model's limbs.
 */

var Model = module.exports = function(skin)
{
    /* Domain data */
    this.name = "";
    this.limbs = [];
    this.poses = new Poses();
    this.skin = skin;
    
    /* Texture */
    var texture = new THREE.Texture(canvas);
    
    texture.minFilter = texture.magFilter = THREE.NearestFilter;
    
    /* Mesh that will be used for displaying limbs */
    this.group = new THREE.Object3D();
    
    /* Materials */
    this.material = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        transparent: true,
        map: texture,
        alphaTest: 0.5
    });
    
    this.selectedMaterial = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.65,
        map: texture,
        alphaTest: 0.5
    });
};

Model.prototype = 
{
    remove: function(limb)
    {
        var index = this.limbs.indexOf(limb);
        
        if (index != -1)
        {
            this.limbs.splice(index, 1);
            this.poses.removeLimb(limb.id);
            
            limb.mesh.parent.remove(limb.mesh);
            limb.mesh.geometry.dispose();
            limb.mesh = null;
        }
        
        return index != -1;
    },
    
    /**
     * Update model's texture (render skin to the material's texture and flag 
     * them dirty)
     */
    updateTexture: function()
    {
        var self = this;
        
        canvas.width = this.skin.w;
        canvas.height = this.skin.h;
        
        this.skin.render(canvas.getContext("2d"), this.skin.w, this.skin.h);
        
        this.limbs.forEach(function (limb) {
            limb.mapUV(self.skin.w, self.skin.h);
        });
        
        this.material.map.needsUpdate = true;
        this.material.needsUpdate = true;
    },
    
    /**
     * Apply pose transformations on the meshes
     */
    applyPose: function(pose)
    {
        this.poses.poses[pose].applyPose(this);
    },
    
    /**
     * Build the model
     */
    build: function()
    {
        var self = this;
        
        this.limbs.forEach(function (limb) {
            limb.build(self.material);
            limb.mapUV(self.skin.w, self.skin.h);
            
            self.group.add(limb.mesh);
        });
    },
    
    /**
     * Form relationship between parent and child limbs
     */
    form: function()
    {
        var limbs = {};
        
        for (var i = 0, c = this.limbs.length; i < c; i ++)
        {
            var limb = this.limbs[i];
            
            if (limb.parent && limbs[limb.parent])
            {
                var parent = limbs[limb.parent];
                
                limb.mesh.parent.remove(limb.mesh);
                parent.mesh.add(limb.mesh);
            }
            
            limbs[limb.id] = limb;
        }
    },
    
    /**
     * Export the model as JS object (you can JSON.stringify it later)
     * 
     * @see {@link docs/JSON-Scheme.md}
     * @return {Object} - Object that confirms to Model JSON Scheme
     */
    exportModel: function()
    {
        var model = 
        {
            scheme: "1.3",
            name: this.name,
            texture: [this.skin.w, this.skin.h],
            poses: this.poses.exportPoses(),
            limbs: {}
        };
        
        for (var i = 0, c = this.limbs.length; i < c; i ++)
        {
            var limb = this.limbs[i];
            
            model.limbs[limb.id] = limb;
        }
        
        return model;
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
        /* Clear */
        for (var i = this.group.children.length - 1; i >= 0; i --)
        {
            this.group.remove(this.group.children[i]);
        }
        
        this.limbs.length = 0;
        
        /* Import */
        this.name = model.name;
        this.poses.importPoses(model.poses);
        
        /* Import limbs */
        for (var key in model.limbs) 
        {
            var limb = new Limb();

            limb.importLimb(model.limbs[key]);
            limb.id = key;
            
            this.limbs.push(limb);
        }
        
        /* Build for ThreeJS and form relations */
        this.build();
        this.form();
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