var dom = require("./dom");

/**
 * Settings class
 * 
 * This class is responsible for listening to the settings fields (including 
 * buttons) and collecting needed information for component.
 */

var Settings = module.exports = function(editor, element)
{
    this.editor = editor;
    this.element = element;
    this.settings = {};
};

Settings.prototype = 
{
    /**
     * Initiate settings event listeners (listening to input fields and button 
     * clicks).
     */
    init: function()
    {
        var self = this;
        
        dom.$$("input[name]", this.element).forEach(function (node) {
            /* Save values */
            dom.on(node, "change", function () {
                self.settings[node.name] = self.get(node);
                self.notifyChanges();
            });
            
            self.set(node, self.settings[node.name]);
            self.settings[node.name] = self.get(node);
        });
        
        dom.$$("button", this.element).forEach(function (button) {
            dom.on(button, "click", function () {
                var action = button.dataset.action + "Action";
            
                self[action] && self[action](button);
            });
        });
    },
    
    /**
     * Set input's value
     * 
     * @param {Node} node
     * @param {Object} value
     */
    set: function(node, value)
    {
        if (node.type == "checkbox")
        {
            node.checked = Boolean(value);
        }
        else
        {
            node.value = value;
        }
    },
    
    /**
     * Get input's value
     * 
     * @param {Node} node
     * @return {Object}
     */
    get: function(node)
    {
        if (node.type == "checkbox")
        {
            return node.checked;
        }
        else
        {
            return node.value;
        }
    },
    
    /**
     * Toggle the view of settings view
     */
    toggle: function()
    {
        this.element.classList.toggle("hidden");
    },
    
    /**
     * Notify changes
     */
    notifyChanges: function()
    {
        this.editor.notifySettings(this.settings);
    }
};