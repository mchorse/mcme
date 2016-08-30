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
    
    this.inputs = dom.$$("[name]", element);
    this.buttons = dom.$$("[data-action]", element);
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
        
        /* Attach change listeners for named fields to notify about changes */
        this.inputs.forEach(function (node) {
            dom.on(node, "change", function () {
                self.settings[node.name] = self.get(node);
                self.notifyChanges(this);
            });
            
            self.set(node, self.settings[node.name]);
            self.settings[node.name] = self.get(node);
        });
        
        /* Attach click listeners for buttons to invoke actions */
        this.buttons.forEach(function (button) {
            var action = button.dataset.action + "Action";
            
            dom.on(button, "click", function () {
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
     * 
     * @param {HTMLInputElement} input
     */
    notifyChanges: function(input)
    {
        var method = input.name + "Change";
        
        this[method] && this[method](input);
    }
};