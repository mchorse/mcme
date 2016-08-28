var dom = require("../dom"),
    utils = require("../utils");

var Settings = require("../settings");

/**
 * Model settings 
 */

var ModelSettings = module.exports = function(editor, element)
{
    Settings.call(this, editor, element);
    
    this.limbs = dom.$(".mc-limbs", element);
};

utils.extend(ModelSettings, Settings, 
{
    init: function()
    {
        Settings.prototype.init.call(this);
        
        this.updateLimbs();
    },
    
    /**
     * Update limb list
     */
    updateLimbs: function()
    {
        var self = this;
        
        var empty = document.createElement("option");
        
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