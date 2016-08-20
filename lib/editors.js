var dom = require("./dom");

var Toolbar = require("./toolbar");

/* Map of key codes to tool name */
var map = {
    80: "pencil",
    69: "eraser",
    67: "picker",
    66: "bucket",
    77: "move",
    90: "zoom"
};

/**
 * Extend child constructor with parent constructor with given methods
 */
function extend(child, parent, methods)
{
    child.prototype = Object.create(parent.prototype);
    
    for (var key in methods)
    {
        child.prototype[key] = methods[key];
    }
}

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
    },
    
    inBound: function(x, y)
    {
        var element = this.element;
        
        return x >= element.offsetLeft && x < element.offsetLeft + element.offsetWidth &&
               y >= element.offsetTop && y < element.offsetTop + element.offsetHeight;
    }
};

/**
 * Texture editor
 */
ModelEditor = function(element)
{
    Editor.call(this, element);
};

extend(ModelEditor, Editor, 
{
    onKey: function()
    {
        /* No shortcuts yet */
    }
});

/**
 * Texture editor
 */
TextureEditor = function(element)
{
    Editor.call(this, element);
};

extend(TextureEditor, Editor, 
{
    onKey: function(event)
    {
        if (map[event.keyCode])
        {
            this.toolbar.set(map[event.keyCode]);
        }
    }
});

/* Exports */
module.exports = 
{
    TextureEditor: TextureEditor,
    ModelEditor: ModelEditor
};