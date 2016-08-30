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
    this.lightMaterial = new THREE.MeshLambertMaterial({
        side: THREE.DoubleSide,
        map: texture,
        alphaTest: 0.5
    });
    
    this.lightSelectedMaterial = new THREE.MeshLambertMaterial({
        side: THREE.DoubleSide,
        map: texture,
        transparent: true,
        opacity: 0.65,
        alphaTest: 0.5
    });
    
    this.flatMaterial = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        map: texture,
        alphaTest: 0.5
    });
    
    this.flatSelectedMaterial = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        map: texture,
        transparent: true,
        opacity: 0.65,
        alphaTest: 0.5
    });
    
    /* Current type of material */
    this.material = this.lightMaterial;
    this.selectedMaterial = this.lightSelectedMaterial;
};

Model.prototype = 
{
    /**
     * Add a limb to the model with given parent
     * 
     * @param {THREE.Mesh} parent
     * @return {Limb}
     */
    add: function(parent)
    {
        var limb = new Limb();
        
        this.limbs.push(limb);
        this.poses.formLimb(limb);
        
        limb.build(this.material);
        limb.mapUV(this.skin);
        limb.parent = parent ? parent.limb.id : "";
        
        if (parent)
        {
            parent.add(limb.mesh);
        }
        else
        {
            this.group.add(limb.mesh);
        }
        
        return limb;
    },
    
    /**
     * Remove given limb from model
     * 
     * @param {Limb} limb
     * @return {Boolean} - If limb was removed
     */
    remove: function(limb)
    {
        var index = this.limbs.indexOf(limb),
            self = this;
        
        if (index != -1)
        {
            this.limbs.forEach(function (child) {
                if (child.parent == limb.id)
                {
                    self.remove(child);
                }
            });
            
            this.limbs.splice(index, 1);
            this.poses.removeLimb(limb.id);
            
            limb.mesh.parent.remove(limb.mesh);
            limb.mesh.geometry.dispose();
            limb.mesh = null;
        }
        
        return index != -1;
    },
    
    /**
     * Get limb by its name (id)
     * 
     * @param {String} id
     * @return {Limb|null}
     */
    get: function(id)
    {
        for (var i = 0, c = this.limbs.length; i < c; i ++)
        {
            if (this.limbs[i].id == id) return this.limbs[i];
        }
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
            limb.mapUV(self.skin);
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
            limb.mapUV(self.skin);
            
            self.group.add(limb.mesh);
        });
    },
    
    /**
     * Form relationship between parent and child limbs
     * 
     * This called only once, when the import is in the process.
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
            
            model.limbs[limb.id] = limb.exportLimb();
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
        return JSON.stringify(this.exportModel(), null, 4);
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
        
        /* Fill with blanks */
        this.poses.form(this);
        
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
    },
    
    /**
     * Toggle the material of limbs
     * 
     * @param {ModelEditor} editor
     * @param {Boolean} toggle
     */
    toggleMaterial: function(editor, toggle)
    {
        var material = toggle ? this.lightMaterial : this.flatMaterial,
            selectedMaterial = toggle ? this.lightSelectedMaterial : this.flatSelectedMaterial;
        
        this.limbs.forEach(function (limb) {
            limb.mesh.material = material;
        });
        
        if (editor.limb)
        {
            editor.limb.material = selectedMaterial;
        }
        
        this.material = material;
        this.selectedMaterial = selectedMaterial;
    }
};