/* Required models */
var dom = require("./dom");

var TextureEditor = require("./texture/editor"),
    ModelEditor = require("./model/editor"),
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
    this.texture = new TextureEditor(this, texture);
    this.model = new ModelEditor(this, model);
    
    /* By default, current component is texture */
    this.current = this.texture;
};

App.prototype = 
{
    /**
     * Initiate the application. Setup the events, components and etc.
     */
    init: function()
    {
        var self = this;
        
        /* Initiate components */
        this.model.init();
        this.texture.init();
        
        /* Key events */
        dom.on(document, "keyup", this.onKey.bind(this));
        dom.on(document, "keydown", this.onKeyDown.bind(this));
        
        /* Mouse events */
        dom.on(document, "mousedown", this.onMouseDown.bind(this));
        dom.on(document, "mousemove", this.onMouseMove.bind(this));
        dom.on(document, "mouseup", this.onMouseUp.bind(this));
        
        /* Toggling buttons */
        dom.on(dom.$(".mc-hide-texture"), "click", function () {
            self.hide(self.texture, self.model);
        });
        
        dom.on(dom.$(".mc-hide-model"), "click", function () {
            self.hide(self.model, self.texture);
        });
    },
    
    /**
     * When key is up, my hair goes down
     * 
     * @see GMM
     */
    onKey: function(event)
    {
        if (document.activeElement != document.body) return;
        
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
    
    /**
     * Click-clock, tick-tock, the clock is ticking, he-he-he...
     */
    onMouseDown: function(event)
    {
        this.onMouseMove(event);
        
        this.clicking = true;
        this.current.onMouseDown(this.x, this.y, event)
    },
    
    /**
     * Uncheck the flag and do the move
     */
    onMouseUp: function(event)
    {
        this.clicking = false;
        this.onMouseMove(event);
    },
    
    /**
     * This method not only hides the given component and shows the other, but 
     * also does some tricky logic (at least for me), regarding the appearance 
     * of the components.
     */
    hide: function(component, other)
    {
        this.model.resize();
        
        var toShow = other.element.classList,
            toHide = component.element.classList;
        
        var toShowHidden = toShow.contains("hidden"),
            toHideHidden = toHide.contains("hidden");
        
        if (!toShowHidden && !toHideHidden)
        {
            toShow.add("mc-full");
            
            toHide.add("hidden");
        }
        else if (!toShowHidden && toHideHidden)
        {
            toShow.remove("mc-full");
            
            toHide.remove("hidden");
        }
        else if (toShowHidden && !toHideHidden)
        {
            toHide.add("hidden");
            toHide.remove("mc-full");
            
            toShow.add("mc-full");
            toShow.remove("hidden");
        }
    }
};