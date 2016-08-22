var dom = require("./dom"),
    utils = require("./utils");

var Toolbar = require("./toolbar"),
    Tools = require("./tools"),
    Picker = require("./picker"),
    Settings = require("./settings");

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
    this.settings = new Settings(this, dom.$(".mc-settings", element));
};

Editor.prototype = 
{
    init: function()
    {
        var self = this;
        
        this.toolbar.init();
        this.settings.init();
        
        dom.on(dom.$(".mc-toggle-settings"), "click", function () {
            self.settings.toggle();
        });
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
 * Model editor
 */
ModelEditor = function(app, element)
{
    Editor.call(this, app, element);
};

utils.extend(ModelEditor, Editor, {});

/**
 * Texture editor
 */
TextureEditor = function(app, element)
{
    Editor.call(this, app, element);
    
    this.picker = new Picker(app.skin, dom.$(".mc-colors", element));
    this.canvas = dom.$("#texture");
    this.toolbar.map = 
    {
        pencil: new Tools.Pencil(this),
        eraser: new Tools.Eraser(this),
        picker: new Tools.Picker(this),
        bucket: new Tools.Bucket(this),
        move: new Tools.Move(this),
        zoom: new Tools.Zoom(this)
    };
    
    this.toolbar.set("pencil");
};

utils.extend(TextureEditor, Editor, 
{
    /**
     * Init texture editor. Setup tool bar's and picker's event listeners.
     */
    init: function()
    {
        Editor.prototype.init.call(this);
        
        this.picker.init();
    },
    
    /**
     * Set tool based on key code
     */
    onKey: function(event)
    {   
        if (map[event.keyCode]) this.toolbar.set(map[event.keyCode]);
        if (event.keyCode == 88) this.picker.swap();
        if (event.keyCode == 86) this.picker.toggle();
        if (event.keyCode == 83) this.settings.toggle();
    },
    
    /**
     * On mouse move, delegate this event to the picker and in case if the 
     * mouse is targeting the canvas or editor's element then also delegate 
     * the mouse event to the toolbar
     */
    onMouseMove: function(x, y, event)
    {
        if (event.target == this.element || event.target == this.canvas)
        {
            this.toolbar.onMouseMove(x, y);
        }
        
        this.picker.onMouseMove(x, y);
    },
    
    /**
     * On mouse down, do the same thing as above, but with mouse down
     */
    onMouseDown: function(x, y, event)
    {
        if (event.target == this.element || event.target == this.canvas)
        {
            this.toolbar.onMouseDown(x, y);
        }
        
        this.picker.onMouseMove(x, y);
    }
});

/* Exports */
module.exports = 
{
    TextureEditor: TextureEditor,
    ModelEditor:   ModelEditor
};