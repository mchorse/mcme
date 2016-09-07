var dom = require("../dom"),
    utils = require("../utils"),
    model_utils = require("./utils")

var Settings = require("../settings"),
    Poses = require("./poses"),
    Properties = require("./properties");

/**
 * Model settings 
 */

var ModelSettings = module.exports = function(editor, element)
{
    Settings.call(this, editor, element);
    
    this.properties = new Properties(editor, dom.$(".mc-limb", element));
    this.poses = new Poses(editor, dom.$(".mc-poses", element));
    
    this.inputs = dom.$$("[data-section] [name]", element);
    this.limbs = dom.$(".mc-limbs", element);
    this.file = dom.$(".mc-model-input", element);
    
    this.settings.aabb = false;
    this.settings.flat = false;
    this.settings.shadow = true;
    this.settings.lighting = true;
};

utils.extend(ModelSettings, Settings, 
{
    /**
     * Initiate settings and child widgets
     */
    init: function()
    {
        Settings.prototype.init.call(this);
        
        dom.on(this.file, "change", this.importModel.bind(this));
        
        this.properties.init();
        this.poses.init();
        
        this.updateLimbs();
        this.fill();
    },
    
    /* @pragma_mark - Actions */
    
    /**
     * Export 3D JSON model action
     */
    exportAction: function()
    {
        var json = this.editor.app.actor.exportJSON();
        
        /* Prettify arrays */
        json = json.replace(/\n\s+(?=-?\d|\])/g, "");
        
        window.open("data:text/json," + encodeURI(json));
    },
    
    /**
     * Import 3D JSON model action
     */
    importAction: function()
    {
        this.file.value = null;
        this.file.click();
    },
    
    /**
     * Import the model
     */
    importModel: function()
    {
        var reader = new FileReader(),
            self = this;
        
        reader.onload = function (e) {
            try
            {
                var json = JSON.parse(e.target.result);
                
                self.editor.setLimb(null);
                self.editor.actor.importModel(json);
            
                self.editor.model.build();
                self.editor.model.applyPose("standing");
                self.editor.render();
                
                self.editor.app.skin.resize(json.texture[0], json.texture[1]);
                self.editor.app.texture.reset();
                self.editor.app.texture.settings.settings.size_w = json.texture[0];
                self.editor.app.texture.settings.settings.size_h = json.texture[1];
                self.editor.app.texture.settings.update();
                
                self.poses.clear();
                self.updateLimbs();
                self.fill();
            }
            catch (e)
            {
                alert("An error occured while importing the JSON model:\n" + e);
            }
        };
        
        reader.readAsText(this.file.files[0]);
    },
    
    /**
     * Render the canvas to image (so you can edit it or use it for youtube 
     * thumbnail, basically do whatever whit the result :D)
     */
    renderAction: function()
    {
        window.open(this.editor.canvas.toDataURL("image/png"));
    },
    
    /**
     * Reset camera action
     */
    resetAction: function()
    {
        this.editor.model.group.rotation.set(0, 0, 0);
        this.editor.model.group.position.set(0, 0, 0);
        this.editor.render();
    },
    
    /* @pragma_mark - Change hooks */
    
    /**
     * Change the name of current model
     */
    nameChange: function(input)
    {
        this.editor.app.actor.name = input.value;
    },
    
    /**
     * Toggle the visibility of AABB
     */
    aabbChange: function(input)
    {
        this.editor.model.aabb.visible = input.checked;
        this.editor.render();
    },
    
    /**
     * When limb value changes
     */
    limbChange: function(input)
    {
        this.editor.setLimb(this.editor.model.get(input.value));
        this.limbs.blur();
    },
    
    /**
     * Toggle camera type (orthographic or perspective)
     */
    flatChange: function(input)
    {
        this.editor.camera.toggle(!input.checked);
        this.editor.render();
    },
    
    /**
     * Shadow change
     */
    shadowChange: function(input)
    {
        this.editor.renderer.shadowMap.enabled = input.checked;
        this.editor.render();
    },
    
    /**
     * Depending on the value, make shadow map bigger or smaller.
     */
    hdChange: function(input)
    {
        var light = this.editor.light;
        
        if (light.shadow.map)
        {
            light.shadow.mapSize.width = input.checked ? 2048 : 1024;
            light.shadow.mapSize.height = input.checked ? 2048 : 1024;
            light.shadow.map.dispose();
            light.shadow.map = null;
        }
    },
    
    /**
     * Toggle lighting material
     */
    lightingChange: function(input)
    {
        this.editor.model.toggleMaterial(input.checked);
        this.editor.render();
    },
    
    /* @pragma_mark - Additional form related methods */
    
    /**
     * Fill the fields
     */
    fill: function()
    {
        var name = this.editor.app.actor.name;
        
        this.set(dom.$("[name=name]", this.element), name);
        this.settings.name = name;
        
        this.properties.fill();
        this.poses.fill();
        this.updateLimbsValue();
    },
    
    /**
     * Update limb list
     */
    updateLimbs: function()
    {
        var self = this,
            empty = document.createElement("option");
        
        empty.value = "";
        empty.text = "None";
        
        this.limbs.innerHTML = "";
        this.limbs.appendChild(empty);
        this.limbs.value = "";
        
        model_utils.populateLimbs(this.limbs, this.editor.app.actor);
        
        this.updateLimbsValue();
        this.properties.updateLimbs();
    },
    
    /**
     * Update the value of this.limbs select
     */
    updateLimbsValue: function()
    {
        this.limbs.value = this.editor.limb ? this.editor.limb.limb.id : "";
    }
});