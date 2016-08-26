/* Required models */
var dom = require("./dom");

var TextureEditor = require("./texture/editor"),
    ModelEditor = require("./model/editor"),
    PixelData = require("./texture/pixel-data"),
    Model = require("./model/model"),
    Limb = require("./model/3d/limb");

var Poses = require("./model/3d/poses");

/**
 * App class
 * 
 * This class is responsible for managing the application, and delegating 
 * clicking and keyboard events to its child components.
 * 
 * Also responsible for showing and hiding those components.
 *
 * @author McHorse
 */

var App = module.exports = function(texture, model)
{
    /* Skin data and JSON model */
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
        
        /* Head and body */
        var head = new Limb();
        
        head.size = [8, 8, 8];
        head.texture = [0, 0];
        head.translate = [0, 28, 0];
        
        var outer = new Limb();
        
        outer.size = [8, 8, 8];
        outer.texture = [32, 0];
        outer.translate = [0, 28, 0];
        outer.scale = [1.1, 1.1, 1.1];
        
        var body = new Limb();
        
        body.size = [8, 12, 4];
        body.texture = [16, 16];
        body.translate = [0, 18, 0];
        
        /* Both arms */
        var left_arm = new Limb();
        
        left_arm.size = [4, 12, 4];
        left_arm.texture = [40, 16];
        left_arm.translate = [6, 18, 0];
        left_arm.mirror = true;
        
        var right_arm = new Limb();
        
        right_arm.size = [4, 12, 4];
        right_arm.texture = [40, 16];
        right_arm.translate = [-6, 18, 0];
        
        /* Both legs */
        var left_leg = new Limb();
        
        left_leg.size = [4, 12, 4];
        left_leg.texture = [0, 16];
        left_leg.translate = [2, 6, 0];
        left_leg.mirror = true;
        
        var right_leg = new Limb();
        
        right_leg.size = [4, 12, 4];
        right_leg.texture = [0, 16];
        right_leg.translate = [-2, 6, 0];
        
        /** Inject limbs */
        this.actor.limbs = [
            head,
            outer,
            body,
            left_arm,
            right_arm,
            left_leg,
            right_leg
        ];
        
        this.actor.build();
        
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
     * They see me rollin', they hatin', they tryin' get me run and dirty
     * 
     * @param {WheelEvent} event
     */
    onWheel: function(event)
    {
        /** @todo don't prevent scrolling in settings views */
        event.preventDefault();
        
        this.current.onWheel(event.deltaY);
    },
    
    /**
     * This method not only hides the given component and shows the other, but 
     * also does some tricky logic (at least for me), regarding the appearance 
     * of the components.
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