var dom = require("./dom"),
    utils = require("./utils");

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
    
    /**
     * Check if the mouse pointer is in component's frame
     * 
     * @param {Number} x
     * @param {Number} y
     */
    inBound: function(x, y)
    {
        var element = this.element;
        
        return x >= element.offsetLeft && x < element.offsetLeft + element.offsetWidth &&
               y >= element.offsetTop  && y < element.offsetTop  + element.offsetHeight;
    },
    
    onKey: function()
    {}
};

/**
 * Texture editor
 */
ModelEditor = function(element)
{
    Editor.call(this, element);
};

utils.extend(ModelEditor, Editor, {});

/**
 * Texture editor
 */
TextureEditor = function(element)
{
    Editor.call(this, element);
};

utils.extend(TextureEditor, Editor, 
{
    /**
     * Set tool based on key code
     */
    onKey: function(event)
    {   
        if (map[event.keyCode]) this.toolbar.set(map[event.keyCode]);
    }
});

/* Exports */
module.exports = 
{
    TextureEditor: TextureEditor,
    ModelEditor:   ModelEditor
};