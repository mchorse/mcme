/* Required models */
var dom = require("./dom");

var TextureEditor = require("./texture/editor"),
    ModelEditor = require("./model/editor"),
    PixelData = require("./texture/pixel-data"),
    Model = require("./model/3d/model");

/**
 * App class
 * 
 * This class is responsible for managing the application, and delegating 
 * clicking and keyboard events to its child components.
 * 
 * Also responsible for showing and hiding those components, but in reality, 
 * it doesn't really do anything special.
 *
 * @author McHorse
 */

var App = module.exports = function(root, texture, model)
{
    /* Root element, i.e. wrapper for whole application */
    this.element = root;
    
    /* Skin data and JSON 3D model */
    this.skin = new PixelData(64, 32);
    this.actor = new Model(this.skin);
    
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
        
        dom.on(document, "wheel", this.onWheel.bind(this));
        
        /* Toggling buttons */
        dom.on(dom.$(".mc-hide-texture", this.element), "click", function () {
            self.hide(self.texture, self.model);
        });
        
        dom.on(dom.$(".mc-hide-model", this.element), "click", function () {
            self.hide(self.model, self.texture);
        });
        
        dom.on(dom.$(".mc-show-help", this.element), "click", function () {
            var help = dom.$(".mc-help-wrapper", self.element).classList;
            
            help.toggle("hidden");
            this.classList.toggle("mc-tool-selected", !help.contains("hidden"));
        });
        
        dom.on(dom.$(".mc-toggle-layout", this.element), "click", function () {
            var icon = self.element.classList;
            
            icon.toggle("mc-vertical");
            this.classList.toggle("mc-tool-selected", icon.contains("mc-vertical"));
            self.model.resize();
        });
    },
    
    /**
     * When key is up, my action goes down
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
     * They see me rollin', they hatin', they tryin' get me run and dirty
     * 
     * @param {WheelEvent} event
     */
    onWheel: function(event)
    {
        if (
            !dom.hasParent(event.target, "mc-settings", 3) && 
            !dom.hasParent(event.target, "mc-help-section", 3)
        ) {
            event.preventDefault();
            
            this.current.onWheel(event);
        }
    },
    
    /**
     * This method not only hides the given component and shows the other, but 
     * also does some tricky logic (at least for me), regarding the appearance 
     * of the components.
     * 
     * @param {Editor} component
     * @param {Editor} other
     */
    hide: function(component, other)
    {
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
        
        this.model.resize();
    }
};

/* ------------------------------------ *
 *                                |\_/| *
 * Can I get code review, please? >^.^< *
 * ------------------------------------ */