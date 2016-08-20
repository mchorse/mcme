var dom = require("./dom");

var Toolbar = require("./toolbar");

/**
 * Editor classes
 * 
 * Basically, this files contains two app components, because I'm lazy.
 */

var Editor, ModelEditor, TextureEditor;

Editor = function(element)
{
    this.element = element;
    this.toolbar = new Toolbar(dom.$(".mc-toolbar", element));
};

Editor.prototype = 
{
    init: function()
    {
        this.toolbar.init();
    }
};

/**
 * Texture editor
 */
ModelEditor = function(element)
{
    Editor.call(this, element);
};

ModelEditor.prototype = Object.create(Editor.prototype);

/**
 * Texture editor
 */
TextureEditor = function(element)
{
    Editor.call(this, element);
};

TextureEditor.prototype = Object.create(Editor.prototype);

/* Exports */
module.exports = 
{
    TextureEditor: TextureEditor,
    ModelEditor: ModelEditor
};