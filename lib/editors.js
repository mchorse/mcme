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

Editor = function(app, element)
{
    this.app = app;
    this.element = element;
    this.toolbar = new Toolbar(this, dom.$(".mc-toolbar", element));
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
    {},
    
    /** Delegate those two calls to toolbar tools */
    
    onMouseMove: function(x, y)
    {
        this.toolbar.onMouseMove(x, y);
    },
    
    onMouseDown: function(x, y)
    {
        this.toolbar.onMouseDown(x, y);
    }
};

/**
 * Texture editor
 */
ModelEditor = function(app, element)
{
    Editor.call(this, app, element);
};

utils.extend(ModelEditor, Editor, {});

/** Texture editor */
var Tools = require("./tools");

/**
 * Texture editor
 */
TextureEditor = function(app, element)
{
    Editor.call(this, app, element);
    
    this.canvas = dom.$("#texture");
    this.toolbar.map = 
    {
        move: new Tools.Move(this),
        zoom: new Tools.Zoom(this)
    };
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