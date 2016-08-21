/* Required models */
var dom = require("./dom");

var Editors = require("./editors"),
    PixelData = require("./texture/pixel-data");

/**
 * App class
 * 
 * This class is responsible for managing the application, and delegating 
 * clicking and keyboard events to its child components.
 * 
 * Also responsible for resizing and toggling those components.
 *
 * @author McHorse
 */

var App = module.exports = function(texture, model)
{
    /* JSON Model and skin data */
    this.actor = null;
    this.skin = new PixelData(64, 32);
    
    /* Keyboard state */
    this.key = null;
    
    /* Mouse State */
    this.clicking = false;
    this.x = this.y = 0;
    
    /* Components */
    this.texture = new Editors.TextureEditor(this, texture);
    this.model = new Editors.ModelEditor(this, model);
};

App.prototype = 
{
    /**
     * Initiate the application. Setup the events, components and etc.
     */
    init: function()
    {
        this.texture.init();
        
        /* Key events */
        dom.on(document, "keyup", this.onKey.bind(this));
        dom.on(document, "keydown", this.onKeyDown.bind(this));
        
        /* Mouse events */
        dom.on(document, "mousedown", this.onMouseDown.bind(this));
        dom.on(document, "mousemove", this.onMouseMove.bind(this));
        dom.on(document, "mouseup", this.onMouseUp.bind(this));
    },
    
    /**
     * When key is up, my hair goes down
     * 
     * @see GMM
     */
    onKey: function(event)
    {
        if (document.activeElement != document.body) return;
        
        var x = this.x,
            y = this.y;
        
        this.key = null;
        this.current.onKey(event);
    },
    
    /**
     * When key is down, I set key to event
     * 
     * @see Adele
     */
    onKeyDown: function(event)
    {
        this.key = event;
    },
    
    /**
     * This method is get invoked when shit happens. I mean, when mouse being 
     * moved, apparently.
     */
    onMouseMove: function(event)
    {
        var x = event.pageX,
            y = event.pageY;
        
        this.x = x;
        this.y = y;
        
        /* Select correct component */
        this.current = this.texture.inBound(x, y) ? this.texture : this.model;
        
        if (this.clicking) this.current.onMouseMove(x, y, event);
    },
    
    onMouseDown: function(event)
    {
        this.onMouseMove(event);
        
        this.clicking = true;
        this.current.onMouseDown(this.x, this.y, event)
    },
    
    onMouseUp: function(event)
    {
        this.clicking = false;
        this.onMouseMove(event);
    }
};