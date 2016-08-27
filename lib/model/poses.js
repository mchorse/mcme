var dom = require("../dom");

/**
 * Poses popup controller
 * 
 * This class is responsible for listening to the input events and notify 
 * poses about changes (this includes applying new transformations and 
 * re-rendering the screen).
 */

var Poses = module.exports = function(editor, element)
{
    this.editor = editor;
    this.element = element;
    this.inputs = dom.$$("input", element);
    this.pose = dom.$(".mc-pose", element);
};

Poses.prototype = 
{
    /**
     * Subscribe to DOM events
     */
    init: function()
    {
        var self = this;
        
        /* Attach event listeners  */
        this.inputs.forEach(function (input) {
            dom.on(input, "change", function () { 
                self.change(this);
            });
        });
        
        dom.on(this.pose, "change", this.poseChange.bind(this));
    },
    
    /**
     * Gets invoked when an input value has been changed
     * 
     * This method should submit transformations to pose and apply the pose 
     * on current limb.
     */
    change: function(input)
    {
        var name = input.name,
            limb = this.editor.limb.limb,
            pose = this.editor.app.actor.poses.poses[this.pose.value];
        
        var underscore = name.indexOf("_"),
            key = name.substr(0, underscore);
        
        /* Set the input to appropriate field */
        if (name.indexOf("size") == 0)
        {
            var suffixes = ["w", "h", "d"],
                index = suffixes.indexOf(name.substr(underscore + 1))
            
            pose.size[index] = parseFloat(input.value);
        }
        else
        {
            var suffixes = ["x", "y", "z"],
                index = suffixes.indexOf(name.substr(underscore + 1));
            
            pose.limbs[limb.id][key][index] = parseFloat(input.value);
        }
        
        /* Apply transformation */
        pose.applyMesh(limb);
        
        /* Re-render the screen */
        this.editor.render();
    },
    
    /**
     * Gets invoked when pose selector has been changed
     *
     * This method should update the values in the popup inputs and also 
     * update all limbs with selected pose transformations.
     */
    poseChange: function()
    {
        var pose = this.editor.app.actor.poses.poses[this.pose.value];
        
        pose.applyPose(this.editor.app.actor);
        
        this.fill();
        this.editor.render();
    },
    
    /**
     * Gets invoked when user selects another limb (or deselects)
     * 
     * Fill poses popup with values from the current limb. If there's no current 
     * limb, then the fields are getting disabled.
     */
    fill: function()
    {
        var limb = this.editor.limb,
            self = this;
        
        if (!limb)
        {
            this.inputs.forEach(function (input) {
                input.value = "";
                input.disabled = true;
            });
            
            return;
        }
        
        var transform = this.editor.app.actor.poses.getPoseForLimb(limb.limb.id, this.pose.value),
            pose = this.editor.app.actor.poses.poses[this.pose.value];
        
        var fields = 
        {
            size_w: pose.size[0],
            size_h: pose.size[1],
            size_d: pose.size[2],
            
            translate_x: transform.translate[0],
            translate_y: transform.translate[1],
            translate_z: transform.translate[2],
            
            scale_x: transform.scale[0],
            scale_y: transform.scale[1],
            scale_z: transform.scale[2],
            
            rotate_x: transform.rotate[0],
            rotate_y: transform.rotate[1],
            rotate_z: transform.rotate[2],
        };
        
        this.inputs.forEach(function (input) {
            input.disabled = false;
            input.value = fields[input.name];
        });
    },
    
    /**
     * Toggle view
     */
    toggle: function()
    {
        this.element.classList.toggle("hidden");
    }
};