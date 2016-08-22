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
        
        dom.$$("input", this.element).forEach(function (node) {
            /* Save values */
        });
        
        dom.$$("button", this.element).forEach(function (button) {
            dom.on(button, "click", function () {
                var action = button.dataset.action + "Action";
            
                self[action] && self[action](button);
            });
        });
    },
    
    /**
     * Toggle the view of settings view
     */
    toggle: function()
    {
        this.element.classList.toggle("hidden");
    }
};