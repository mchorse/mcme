var dom = require("../dom"),
    utils = require("../utils");

var Settings = require("../settings");

/**
 * Model settings 
 */

var ModelSettings = module.exports = function(editor, element)
{
    Settings.call(this, editor, element);
};

utils.extend(ModelSettings, Settings, 
{
    
});