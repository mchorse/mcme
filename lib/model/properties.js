var dom = require("../dom");

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
     * Better delegate the change logic to other methods
     */
    change: function(input)
    {
        var limb = this.editor.limb,
            name = input.name;
        
        if (!limb) return;
        
        limb = limb.limb;
        
        var underscore = name.indexOf("_"),
            key = (underscore != -1 ? name.substr(0, underscore) : name) + "Change";
        
        this[key] && this[key](limb, input.type != "checkbox" ? input.value : input.checked, name);
    },
    
    /**
     * Rename the limb
     */
    idChange: function(limb, value, name)
    {
        this.editor.settings.poses.current().rename(limb.id, value);
        limb.id = value;
        this.updateLimbs();
        this.editor.settings.updateLimbs();
    },
    
    holdingChange: function(limb, value)
    {
        limb.holding = value;
    },
    
    swipingChange: function(limb, value)
    {
        limb.swiping = value;
    },
    
    lookingChange: function(limb, value)
    {
        limb.looking = value;
    },
    
    swingingChange: function(limb, value)
    {
        limb.swinging = value;
    },
    
    /**
     * Change parent
     */
    parentChange: function(limb, value)
    {
        if (value == limb.id) return;
        
        limb.parent = value;
        limb.mesh.parent.remove(limb.mesh);
        
        if (value == "")
        {
            this.editor.app.actor.group.add(limb.mesh);
        }
        else
        {
            this.editor.app.actor.get(value).mesh.add(limb.mesh);
        }
        
        this.editor.settings.poses.current().applyMesh(limb);
    },
    
    /**
     * Set texture offset
     */
    textureChange: function(limb, value, name)
    {
        var index = ["x", "y"].indexOf(name.substr(name.indexOf("_") + 1));
        
        limb.texture[index] = parseInt(value);
        this.editor.updateTexture();
    },
    
    /**
     * Mirror change
     */
    mirrorChange: function(limb, value)
    {
        limb.mirror = value;
        this.editor.app.actor.updateTexture();
    },
    
    /**
     * The size is changes
     */
    sizeChange: function(limb, value, name)
    {
        var index = ["w", "h", "d"].indexOf(name.substr(name.indexOf("_") + 1));
        
        limb.size[index] = parseFloat(value);
        limb.regenerate();
        this.editor.limb = limb.mesh;
        this.editor.settings.poses.current().applyMesh(limb);
    },
    
    /**
     * Change limb's anchor
     */
    anchorChange: function(limb, value, name)
    {
        var index = ["x", "y", "z"].indexOf(name.substr(name.indexOf("_") + 1));
        
        limb.anchor[index] = Math.clamp(parseFloat(value), 0, 1);
        limb.regenerate();
        this.editor.limb = limb.mesh;
        this.editor.settings.poses.current().applyMesh(limb);
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
        this.parent.value = "";
        
        this.editor.app.actor.limbs.forEach(function (limb) {
            var option = document.createElement("option");
            
            option.value = option.text = limb.id;
            
            self.parent.appendChild(option);
        });
    },
};