var dom = require("../dom"),
    utils = require("../utils");

var Editor = require("../editor"),
    Toolbar = require("../toolbar"),
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
 * Texture editor
 */
var TextureEditor = module.exports = function(app, element)
{
    Editor.call(this, app, element);
    
    this.settings = new Settings(this, dom.$(".mc-settings", element));
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
        var self = this;
        
        Editor.prototype.init.call(this);
        
        this.picker.init();
        this.settings.init();
        
        dom.on(dom.$(".mc-toggle-settings"), "click", function () {
            self.settings.toggle();
        });
    },
    
    /**
     * Do stuff based on recieved key code:
     * 
     * - Select a tool based on a key code
     * - Swap colors in the color picker
     * - Toggle picker
     * - Toggle settings
     */
    onKey: function(event)
    {   
        if (map[event.keyCode]) this.toolbar.set(map[event.keyCode]);
        if (event.keyCode == 88) this.picker.swap();
        if (event.keyCode == 86) this.picker.toggle();
        if (event.keyCode == 83) this.settings.toggle();
        if (event.keyCode == 72) this.app.hide(this, this.app.model);
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