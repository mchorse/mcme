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
    
    this.settings.name = "Steve";
};

utils.extend(ModelSettings, Settings, 
{
    init: function()
    {
        Settings.prototype.init.call(this);
        
        this.properties.init();
        this.poses.init();
        this.updateLimbs();
    },
    
    fill: function()
    {
        this.properties.fill();
        this.poses.fill();
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