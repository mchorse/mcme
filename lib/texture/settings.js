var utils = require("../utils");

var Settings = require("../settings");

/**
 * Texture settings 
 */

var TextureSettings = module.exports = function(editor, element)
{
    Settings.call(this, editor, element);
};

utils.extend(TextureSettings, Settings, 
{
    /**
     * Clear the canvas
     */
    clearAction: function()
    {
        this.editor.clear();
    },
    
    /**
     * Reset the canvas
     */
    resetAction: function()
    {
        this.editor.reset();
    }
});