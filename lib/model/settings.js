var dom = require("../dom"),
    utils = require("../utils");

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
    
    this.settings.name = "Steve";
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
    },
    
    /* @pragma_mark - Actions */
    
    /**
     * Export 3D JSON model action
     */
    exportAction: function()
    {
        window.open("data:text/json," + encodeURI(this.editor.app.actor.exportJSON()));
    },
    
    /**
     * Import 3D JSON model action
     */
    importAction: function()
    {
        this.file.click();
    },
    
    /**
     * Import model
     */
    importModel: function()
    {
        var reader = new FileReader(),
            self = this;
        
        reader.onload = function (e) {
            self.editor.app.actor.importJSON(e.target.result);
            self.editor.app.actor.applyPose("standing");
            self.editor.render();
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
        this.editor.app.actor.group.rotation.set(0, 0, 0);
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
     * When limb value changes
     */
    limbChange: function(input)
    {
        var limb = this.editor.app.actor.get(input.value);
        
        this.editor.setLimb(limb ? limb.mesh : null);
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
     * Toggle lighting material
     */
    lightingChange: function(input)
    {
        this.editor.app.actor.toggleMaterial(this.editor, input.checked);
        this.editor.render();
    },
    
    /* @pragma_mark - Additional form related methods */
    
    /**
     * Fill the fields
     */
    fill: function()
    {
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
        
        this.editor.app.actor.limbs.forEach(function (limb) {
            var option = document.createElement("option");
            
            option.value = option.text = limb.id;
            
            self.limbs.appendChild(option);
        });
        
        this.updateLimbsValue();
    },
    
    /**
     * Update the value of this.limbs select
     */
    updateLimbsValue: function()
    {
        this.limbs.value = this.editor.limb ? this.editor.limb.limb.id : "";
    }
});