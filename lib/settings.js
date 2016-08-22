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
     * Initiate settings event listeners
     */
    init: function()
    {
        
    },
    
    toggle: function()
    {
        this.element.classList.toggle("hidden");
    }
};