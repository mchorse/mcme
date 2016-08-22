var utils = require("../utils");

var Settings = require("../settings");

/**
 * Texture settings 
 */

var TextureSettings = module.exports = function(editor, element)
{
    Settings.call(this, editor, element);
};

utils.extend(TextureSettings, Settings, {});