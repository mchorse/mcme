var dom = require("../dom"),
    utils = require("../utils");

var Editor = require("../editor");

/**
 * Model editor
 */
var ModelEditor = module.exports = function(app, element)
{
    Editor.call(this, app, element);
};

utils.extend(ModelEditor, Editor, {});