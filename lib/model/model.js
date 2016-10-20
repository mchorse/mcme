var Poses = require("./3d/poses"),
    Limb = require("./3d/limb"),
    UV = require("./3d/uv");

/* Canvas for drawing texture from texture editor */
var canvas = document.createElement("canvas");

/* Properties for materials */
var props = 
{
    side: THREE.DoubleSide,
    alphaTest: 0.5
};

var selectedProps = 
{
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.65,
    alphaTest: 0.5
};

/**
 * Model class
 * 
 * This class is responsible for importing/exporting model to/from JSON, 
 * manipulating and providing access to model's limbs.
 */

var Model = module.exports = function(model, data)
{
    this.model = model;
    this.data = data;
    
    /* Texture */
    var texture = new THREE.Texture(canvas);
    
    texture.minFilter = texture.magFilter = THREE.NearestFilter;
    /* IMPORTANT! When you're gonna use this several instances, don't forget 
     * to clone those configuration objects */
    props.map = selectedProps.map = texture;
    
    /* Mesh that will be used for displaying limbs */
    this.group = new THREE.Object3D();
    this.limbs = [];
    
    /* Materials with lighting */
    this.lightMaterial = new THREE.MeshLambertMaterial(props);
    this.lightSelectedMaterial = new THREE.MeshLambertMaterial(selectedProps);
    
    /* Flat materials */
    this.flatMaterial = new THREE.MeshBasicMaterial(props);
    this.flatSelectedMaterial = new THREE.MeshBasicMaterial(selectedProps);
    
    /* Current type of material */
    this.material = this.lightMaterial;
    this.selectedMaterial = this.lightSelectedMaterial;
    
    /* AABB */
    this.aabb = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1), 
        new THREE.MeshBasicMaterial({ wireframe: true, color: 0xff0000 })
    );
    this.aabb.visible = false;
    this.group.add(this.aabb);
};

Model.prototype = 
{
    /**
     * Add a limb to the model with given parent
     * 
     * @param {THREE.Mesh} parent
     * @return {THREE.Mesh}
     */
    add: function(parent)
    {
        var limb = this.model.add(parent ? parent.limb.id : ""),
            mesh = this.buildLimb(limb);
        
        this.mapUV(mesh);
        
        (parent ? parent : this.group).add(limb.mesh);
        
        this.limbs.push(mesh);
        
        return mesh;
    },
    
    /**
     * Get limb by id
     * 
     * @param {String} id
     * @return {THREE.Mesh}
     */
    get: function(id)
    {
        for (var i = 0, c = this.limbs.length; i < c; i ++)
        {
            if (this.limbs[i].limb.id == id) return this.limbs[i];
        }
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
            self  = this;
        
        if (index != -1)
        {
            this.limbs.forEach(function (child) {
                if (child.limb.parent == limb.limb.id) self.remove(child);
            });
            
            this.limbs.splice(index, 1);
            this.model.remove(limb.limb);
            
            limb.parent.remove(limb);
            limb.geometry.dispose();
        }
        
        return index != -1;
    },
    
    /**
     * Apply pose on the model
     * 
     * @param {Pose|String} pose
     */
    applyPose: function(pose)
    {
        var self = this;
        
        if (typeof pose == "string")
        {
            pose = this.model.poses.get(pose);
        }
        
        this.limbs.forEach(function (limb) {
            self.applyLimbPose(limb.limb, pose);
        });
    },
    
    /**
     * Apply pose on the model's limb
     * 
     * @param {Limb} limb
     * @param {Pose} pose
     */
    applyLimbPose: function(limb, pose)
    {
        var transform = pose.forLimb(limb.id),
            mesh = limb.mesh,
            PI = Math.PI;
        
        var translate = transform.translate,
            scale = transform.scale,
            rotate = transform.rotate;

        var y = translate[1] - (limb.parent ? 0 : pose.size[1] * 16 / 2);

        mesh.position.set(translate[0] / 8, y / 8, translate[2] / 8);
        mesh.scale.set(scale[0], scale[1], scale[2]);
        mesh.rotation.set(rotate[0] / 180 * PI, rotate[1] / 180 * PI, rotate[2] / 180 * PI);

        this.updateAABB(pose);
    },
    
    /**
     * Build a limb from domain limb
     *
     * @param {Limb} limb
     * @return {THREE.Mesh}
     */
    buildLimb: function(limb)
    {
        /* Building the mesh with BoxGeometry */
        var cube = new THREE.BoxGeometry(limb.size[0] / 8, limb.size[1] / 8, limb.size[2] / 8),
            mesh = new THREE.Mesh(cube, this.material);
        
        /* I like shadows */
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.limb = limb;
        limb.mesh = mesh;
        
        /* Setting the rotation point */
        var w = limb.size[0] / 8,
            h = limb.size[1] / 8,
            d = limb.size[2] / 8;
    
        var x = limb.anchor[0],
            y = limb.anchor[1],
            z = limb.anchor[2];
    
        mesh.geometry.translate(-w / 2, -h / 2, -d / 2);
        mesh.geometry.translate(x * w, y * h, z * d);
        mesh.rotation.order = "ZYX";
        
        return mesh;
    },
    
   /**
    * Regenerate this limb. Use this method when the limb's properties (not 
    * pose transformations) such as anchor and size were changed.
    * 
    * @param {Limb} limb
    */
   regenerateLimb: function(limb)
   {
       var mesh = limb.mesh,
           parent = mesh.parent,
           material = mesh.material;
           children = [],
           index = this.limbs.indexOf(mesh);
       
       /* Collect all children */
       for (var i = 0, c = mesh.children.length; i < c; i ++)
       {
           children.push(mesh.children[i]);
       }    
       
       parent.remove(mesh);
       
       mesh.geometry.dispose();
       mesh = this.buildLimb(limb);
       mesh.material = material;
       
       /* Inject those children back */
       children.forEach(function (child) {
           mesh.add(child);
       });
       
       parent.add(mesh);
       this.mapUV(mesh);
       this.limbs[index] = mesh;
   },
    
    /**
     * Map UV onto the mesh
     * 
     * @param {THREE.Mesh} mesh
     */
    mapUV: function(mesh)
    {
        var limb = mesh.limb,
            data = this.data;
        
        var w = limb.size[0],
            h = limb.size[1],
            d = limb.size[2];
        
        var u = limb.texture[0],
            v = data.h - (limb.texture[1] + h + d);
        
        UV.cube(data.w, data.h, mesh.geometry, u, v, w, h, d, limb.mirror);
    },
    
    /**
     * Build the model
     */
    build: function()
    {
        var self = this;
        
        if (this.limbs.length)
        {
            this.limbs.forEach(function (mesh) {
                mesh.parent.remove(mesh);
                mesh.geometry.dispose();
            });
            
            this.limbs.length = 0;
        }
        
        this.model.limbs.forEach(function (limb) {
            var mesh = self.buildLimb(limb);
    
            self.mapUV(mesh);
            self.limbs.push(mesh);
            self.group.add(mesh);            
        });
        
        this.form();
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
            var limb = this.limbs[i].limb;
            
            limbs[limb.id] = this.limbs[i].limb;
        }
        
        for (var key in limbs)
        {
            var limb = limbs[key];
            
            if (limb.parent && limbs[limb.parent])
            {
                var parent = limbs[limb.parent];
                
                limb.mesh.parent.remove(limb.mesh);
                parent.mesh.add(limb.mesh);
            }
        }
    },
    
    /* @pragma_mark - Visuals */
    
    /**
     * Update model's texture (render skin to the material's texture and flag 
     * them dirty)
     */
    updateTexture: function()
    {
        var self = this;
        
        canvas.width = this.data.w;
        canvas.height = this.data.h;
        
        this.data.render(canvas.getContext("2d"), this.data.w, this.data.h);
        this.limbs.forEach(function (limb) {
            self.mapUV(limb);
        });
        
        this.material.map.needsUpdate = true;
        this.material.needsUpdate = true;
    },
    
    /**
     * Toggle the material of limbs
     * 
     * @param {ModelEditor} editor
     * @param {Boolean} toggle
     */
    toggleMaterial: function(toggle)
    {
        var material         = toggle ? this.lightMaterial         : this.flatMaterial,
            selectedMaterial = toggle ? this.lightSelectedMaterial : this.flatSelectedMaterial;
        
        this.limbs.forEach(function (limb) {
            limb.material = material;
        });
        
        this.material = material;
        this.selectedMaterial = selectedMaterial;
    },
    
    /**
     * Update AABB based on the pose
     * 
     * @param {Pose} pose
     */
    updateAABB: function(pose)
    {
        var w = pose.size[0],
            h = pose.size[1],
            d = pose.size[2];
        
        this.aabb.geometry.dispose();
        this.aabb.geometry = new THREE.BoxGeometry(w * 2, h * 2, d * 2);
    }
};