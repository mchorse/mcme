var dom = require("../dom"),
    utils = require("./utils");

/**
 * Properties class
 * 
 * This class is responsible for managing 
 */

var Properties = module.exports = function(editor, element)
{
    this.editor = editor;
    this.element = element;
    
    this.inputs = dom.$$("[name]", element);
    this.parent = dom.$("[name=parent]", element);
};

Properties.prototype = 
{
    /**
     * Initiate event listeners
     */
    init: function()
    {
        var self = this;
        
        this.inputs.forEach(function (input) {
            dom.on(input, "change", function () {
                self.change(this);
            });
        });
        
        this.updateLimbs();
        this.fill();
    },
    
    /**
     * Update limb's values when this is changes. Actually you know what? 
     * Better delegate the change logic to other methods.
     */
    change: function(input)
    {
        var limb = this.editor.limb,
            name = input.name,
            value = input.type != "checkbox" ? input.value : input.checked;
        
        if (!limb) return;
        
        limb = limb.limb;
        
        var keys = name.split("_");
            key  = keys.shift(),
            action = key + "Change";
        
        this[action] ? this[action](limb, value, name) : (limb[key] = value);
    },
    
    /**
     * Rename the limb
     */
    idChange: function(limb, value, name)
    {
        if (this.editor.app.actor.hasLimb(value) || value == "")
        {
            return alert("Limb with name \"" + value + "\" already exist!");
        }
        
        this.editor.app.actor.poses.rename(limb.id, value);
        
        /* Rename children's parent field for given limb */
        var limbs = this.editor.app.actor.limbs;
        
        for (var i = 0; i < limbs.length; i ++)
        {
            if (limbs[i].parent == limb.id)
            {
                limbs[i].parent = value;
            }
        }
        
        limb.id = value;
        
        this.updateLimbs();
        this.editor.settings.updateLimbs();
        this.parent.value = limb.parent;
    },
    
    /**
     * Change parent
     */
    parentChange: function(limb, value)
    {
        if (value == limb.id) return;
        
        limb.parent = value;
        limb.mesh.parent.remove(limb.mesh);
        
        (value == "" 
            ? this.editor.model.group 
            : this.editor.model.get(value)).add(limb.mesh);
        
        var pose = this.editor.settings.poses.current();
        
        this.editor.model.applyLimbPose(limb, pose);
        this.editor.render();
    },
    
    /**
     * Set texture offset
     */
    textureChange: function(limb, value, name)
    {
        var index = ["x", "y"].indexOf(name.substr(name.indexOf("_") + 1));
        
        limb.texture[index] = parseInt(value);
        this.editor.update();
        this.editor.app.texture.render();
    },
    
    /**
     * Mirror change
     */
    mirrorChange: function(limb, value)
    {
        limb.mirror = value;
        this.editor.update();
    },
    
    /**
     * The size is changes
     */
    sizeChange: function(limb, value, name)
    {
        var index = ["w", "h", "d"].indexOf(name.substr(name.indexOf("_") + 1)),
            value = parseInt(value);
        
        if (value > 0)
        {
            limb.size[index] = value;
            
            this.regenerate(limb);
            this.editor.render();
            this.editor.app.texture.render();
        }
    },
    
    /**
     * Change limb's anchor
     */
    anchorChange: function(limb, value, name)
    {
        var index = ["x", "y", "z"].indexOf(name.substr(name.indexOf("_") + 1));
        
        limb.anchor[index] = Math.clamp(parseFloat(value), 0, 1);
        
        this.regenerate(limb);
        this.editor.render();
    },
    
    regenerate: function(limb)
    {
        var pose = this.editor.settings.poses.current();
        
        this.editor.model.regenerateLimb(limb);
        this.editor.limb = limb.mesh;
        this.editor.model.applyLimbPose(limb, pose);
    },
    
    /**
     * Fill inputs and stuff with values
     */
    fill: function()
    {
        var limb = this.editor.limb;
        
        if (!limb) 
        {
            return this.empty();
        }
        
        limb = limb.limb;
        
        var fields = 
        {
            id: limb.id,
            parent: limb.parent,
            
            holding: limb.holding,
            looking: limb.looking,
            swiping: limb.swiping,
            swinging: limb.swinging,
            idle: limb.idle,
            
            texture_x: limb.texture[0],
            texture_y: limb.texture[1],
            mirror: limb.mirror,
            
            size_w: limb.size[0],
            size_h: limb.size[1],
            size_d: limb.size[2],
            
            anchor_x: limb.anchor[0],
            anchor_y: limb.anchor[1],
            anchor_z: limb.anchor[2]
        };
        
        this.inputs.forEach(function (input) {
            var value = fields[input.name];
            
            if (typeof value == "boolean")
            {
                input.checked = value;
            }
            else
            {
                input.value = value;
            }
            
            input.disabled = false;
        });
    },
    
    /**
     * Empty the form
     */
    empty: function()
    {
        this.inputs.forEach(function (input) {
            input.value = "";
            input.checked = false;
            input.disabled = true;
        });
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
        
        this.parent.innerHTML = "";
        this.parent.appendChild(empty);
        
        utils.populateLimbs(this.parent, this.editor.app.actor)
    }
};