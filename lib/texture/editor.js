var dom = require("../dom"),
    utils = require("../utils");

var Editor = require("../editor"),
    Toolbar = require("../toolbar"),
    Tools = require("./tools"),
    Picker = require("./picker"),
    Settings = require("./settings");

/* Map of key codes to tool name */
var map = 
{
    80: "pencil",
    69: "eraser",
    67: "picker",
    66: "bucket",
    77: "move",
    90: "zoom"
};

/**
 * Texture editor
 *
 * Does fancy things, like manipulating the canvas and rendering stuff, etc.
 * 
 * @param {App} app
 * @param {Node} element
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
        move:   new Tools.Move(this),
        zoom:   new Tools.Zoom(this)
    };
    
    this.toolbar.set("pencil");
};

utils.extend(TextureEditor, Editor, 
{
    /**
     * Init texture editor. Setup tool bar's, settings', and picker's event 
     * listeners.
     */
    init: function()
    {
        var self = this;
        
        Editor.prototype.init.call(this);
        
        /* Load up default texture */
        Settings.renderImage(this).src = "assets/img/actor.png";
        
        /* Initiate picker and settings */
        this.picker.init();
        this.settings.init();
        
        /* Toggle settings */
        dom.on(dom.$(".mc-toggle-settings", this.element), "click", function () {
            self.settings.toggle();
        });
        
        this.reset();
    },
    
    /**
     * Clear the canvas
     */
    clear: function()
    {
        this.app.skin.reset();
        this.render();
    },
    
    /**
     * Reset the canvas
     */
    reset: function()
    {
        var canvas = this.canvas,
            w = this.app.skin.w * 8,
            h = this.app.skin.h * 8;
        
        canvas.width = w;
        canvas.height = h;
        canvas.style.marginLeft = (-w / 2) + "px";
        canvas.style.marginTop = (-h / 2) + "px";
        
        this.render();
    },
    
    /**
     * Render pixel data on the canvas
     */
    render: function()
    {
        var canvas = this.canvas,
            ctx = canvas.getContext("2d");
        
        var w = canvas.width, 
            h = canvas.height,
            scale = this.app.skin.scale(w, h);
        
        this.app.skin.render(ctx, w, h);
        
        if (this.settings.settings.grid && scale > 2)
        {
            this.drawGrid(ctx, scale, w, h);
        }
        
        if (this.settings.settings.guides && scale > 2 && this.app.model.limb != null)
        {
            this.drawGuides(ctx, this.app.model.limb.limb, scale);
        }
    },
    
    /**
     * Draw grid on the canvas (4x4 pixels)
     * 
     * @param {CanvasRenderingContext2D} ctx
     * @param {Number} scale
     * @param {Number} w
     * @param {Number} h
     */
    drawGrid: function(ctx, scale, w, h) 
    {
        ctx.fillStyle = "#999";
        
        for (var i = 4, c = this.app.skin.w; i < c; i += 4) ctx.fillRect(i * scale, 0, 1, h * scale);
        for (var i = 4, c = this.app.skin.h; i < c; i += 4) ctx.fillRect(0, i * scale, w * scale, 1);
    },
    
    /**
     * Draw guides for currently selected limb in model editor on the canvas
     * (4x4 pixels)
     * 
     * @param {CanvasRenderingContext2D} ctx
     * @param {Limb} limb
     * @param {Number} scale
     */
    drawGuides: function(ctx, limb, scale)
    {
        ctx.fillStyle = "red";
    
        var limb = this.app.model.limb.limb;
    
        var x = limb.texture[0],
            y = limb.texture[1],
            w = limb.size[0],
            h = limb.size[1],
            d = limb.size[2];
    
        var line = 1;
    
        /* Top */
        ctx.fillRect(x * scale, (y + d) * scale, d * scale + 1, line);
        ctx.fillRect((x + d) * scale, y * scale, w * 2 * scale, line);
        ctx.fillRect((x + d + w * 2) * scale, (y + d) * scale, d * scale, line);
    
        /* Left */
        ctx.fillRect(x * scale, (y + d) * scale, line, h * scale);
        ctx.fillRect((x + d) * scale, y * scale, line, d * scale);
    
        /* Right */
        ctx.fillRect((x + d * 2 + w * 2) * scale, (y + d) * scale, line, h * scale);
        ctx.fillRect((x + d + w * 2) * scale, y * scale, line, d * scale);
    
        /* Bottom */
        ctx.fillRect(x * scale, (y + d + h) * scale, (d * 2 + w * 2) * scale, line);
    },
    
    /**
     * Do stuff based on recieved key code:
     * 
     * - Select a tool based on a key code
     * - Swap colors in the color picker
     * - Toggle widgets
     * - Hide this component
     */
    onKey: function(event)
    {
        var key = event.keyCode;
        
        if (map[key]) this.toolbar.set(map[event.keyCode]);
        if (key == 88) this.picker.swap();
        if (key == 86) this.picker.toggle();
        if (key == 83) this.settings.toggle();
        if (key == 72) this.app.hide(this, this.app.model);
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