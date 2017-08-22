(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.McME = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./dom":2,"./model/3d/model":6,"./model/editor":13,"./texture/editor":27,"./texture/pixel-data":29}],2:[function(require,module,exports){
/**
 * DOOM helpers
 * 
 * Some old helpers from other projects
 */

module.exports =
{
    /**
     * Select one element
     */
    $: function(selector, reference)
    {
        return (reference || document).querySelector(selector);
    },

    /**
     * Select multiple elements and create array out of them
     */
    $$: function(selector, reference)
    {
        return Array.prototype.slice.call(
            (reference || document).querySelectorAll(selector)
        );
    },

    /**
     * Shortcut for binding event listener on the event
     */
    on: function(node, event, listener)
    {
        node.addEventListener(event, listener);
    },
    
    /**
     * Check if given node has a parent with given className
     * 
     * @param {Node} node
     * @param {String} className
     * @param {Number} i
     * @return {Boolean}
     */
    hasParent: function(node, className, i)
    {
        while (i -- >= 0)
        {
            if (node.classList.contains(className)) return true;
            
            node = node.parentNode;
        }
        
        return false;
    }
};
},{}],3:[function(require,module,exports){
var dom = require("./dom"),
    utils = require("./utils");

var Toolbar = require("./toolbar");

/**
 * Abstract editor class
 * 
 * Basically it's responsible for implementing the most needed functionality 
 * which is common for both editor components.
 */

var Editor = module.exports = function(app, element)
{
    this.app = app;
    this.element = element;
    this.toolbar = new Toolbar(this, dom.$(".mc-toolbar", element));
};

Editor.prototype = 
{
    /**
     * Initiate toolbar.
     */
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
    },
    
    onWheel: function(delta)
    {},
    
    /**
     * This method gets invoked when there's something changes in the settings
     * 
     * @param {Object} settings
     */
    notifySettings: function(settings)
    {}
};
},{"./dom":2,"./toolbar":38,"./utils":39}],4:[function(require,module,exports){
/**
 * McME - Web app that allows creating and editing entity actor models for 
 * Blockbuster mod.
 * 
 * ---
 * 
 * The code in `lib/` is fairly clear and simple, IMO. You might have hard time 
 * reading this code in case if you are coming from NPM or node JS code style
 * (by node JS code style, I mean the one with 2 space indentation).
 * 
 * Start by reading `app.js`. `app.js` is basically a front controller (main 
 * entry point of the application). Then go to editors.js, depending on the 
 * component you want to "study," read the classes that deals with desired 
 * component (texture or model editor).
 * 
 * By the way, don't be angry on me for the references in the comments, I like 
 * writing comments in the code. Also documenting the code is also fun 
 * sometimes, but I do it primarly for two reasons:
 * 
 * 1. To create empty space between code blocks
 * 2. Make code look beautiful (it's just opinion)
 * 
 * @author McHorse
 */

/**
 * Clamp passed number between range of min and max.
 * 
 * @param {Number} x
 * @param {Number} min
 * @param {Number} max
 */
Math.clamp = function(x, min, max)
{
    return x < min ? min : (x > max ? max : x);
};

module.exports = 
{
    App: require("./app"),
    dom: require("./dom")
};
},{"./app":1,"./dom":2}],5:[function(require,module,exports){
var UV = require("./uv"),
    utils = require("../../utils");

/* Incrementing ID for limbs */
var id = 0;

/* Properties to export */
var props = [
    "parent", "holding", "swiping", "looking", "swinging", "idle",
    "texture", "size", "anchor", "mirror"
];

/**
 * Limb class
 * 
 * This class is responsible for managing a mesh with given texture and stuff, 
 * but also store essential information for later export.
 */

var Limb = module.exports = function()
{
    /* Basic properties that goes to export */
    this.id = "limb_" + (id ++);
    this.parent = "";
    
    this.size = [4, 4, 4];
    this.texture = [0, 0];
    this.anchor = [0.5, 0.5, 0.5];
    
    this.mirror = false;
    
    this.holding = "";
    this.swiping = false;
    this.looking = false;
    this.swinging = false;
    this.idle = false;
};

Limb.prototype = 
{
    /**
     * Export the limb
     * 
     * This method also clean ups all the values that are equal to default
     * 
     * @return {Object}
     */
    exportLimb: function()
    {
        var model = utils.extract(this, props);
        
        if (!model.parent) delete model.parent;
        if (!model.holding) delete model.holding;
        if (!model.swiping) delete model.swiping;
        if (!model.looking) delete model.looking;
        if (!model.swinging) delete model.swinging;
        if (!model.idle) delete model.idle;
        if (!model.mirror) delete model.mirror;
        
        return model;
    },
    
    /**
     * Import the limb
     * 
     * @param {Object} limb
     */
    importLimb: function(limb)
    {
        if (limb.size[0] == 0 || limb.size[1] == 0 || limb.size[2] == 0)
        {
            throw new Exception("Limb '" + limb.name + "' has a size of zero (" + limb.size.join(", ") + ")!");
        }
        
        utils.merge(this, limb);
    }
};
},{"../../utils":39,"./uv":10}],6:[function(require,module,exports){
var Poses = require("./poses"),
    Limb = require("./limb");

/**
 * Model class
 * 
 * This class is responsible for importing/exporting model to/from JSON, 
 * manipulating and providing access to model's limbs. No ThreeJS code should 
 * be here, because this is domain code.
 */

var Model = module.exports = function()
{
    /* Domain data */
    this.name = "";
    this.limbs = [];
    this.poses = new Poses();
};

Model.prototype = 
{
    /**
     * Add a limb to the model with given parent
     * 
     * @param {Limb} parent
     * @return {Limb}
     */
    add: function(parent)
    {
        var limb = new Limb();
        
        this.limbs.push(limb);
        this.poses.formLimb(limb);
        
        limb.parent = parent || "";
        
        return limb;
    },
    
    /**
     * Remove given limb from model
     * 
     * @param {Limb} limb
     * @return {Boolean} - If limb was removed
     */
    remove: function(limb)
    {
        var index = this.limbs.indexOf(limb),
            self = this;
        
        if (index != -1)
        {
            this.limbs.forEach(function (child) {
                if (child.parent == limb.id) self.remove(child);
            });
            
            this.limbs.splice(index, 1);
            this.poses.removeLimb(limb.id);
        }
        
        return index != -1;
    },
    
    /**
     * Get limb by its name (id)
     * 
     * @param {String} id
     * @return {Limb|null}
     */
    get: function(id)
    {
        for (var i = 0, c = this.limbs.length; i < c; i ++)
        {
            if (this.limbs[i].id == id) return this.limbs[i];
        }
    },
    
   /**
    * Check if limb by given id is exist
    * 
    * @param {String} id
    * @return {Boolean}
    */
   hasLimb: function(id)
   {
       return this.get(id) != null;
   },
    
    /* @pragma_mark - Exporting and importing */
    
    /**
     * Export the model as JS object (you can JSON.stringify it later)
     * 
     * @see {@link docs/JSON-Scheme.md}
     * @return {Object} - Object that confirms to Model JSON Scheme
     */
    exportModel: function()
    {
        var model = 
        {
            scheme: "1.3",
            name: this.name,
            poses: this.poses.exportPoses(),
            limbs: {}
        };
        
        for (var i = 0, c = this.limbs.length; i < c; i ++)
        {
            var limb = this.limbs[i];
            
            model.limbs[limb.id] = limb.exportLimb();
        }
        
        return model;
    },
    
    /**
     * Export the model as JSON string
     * 
     * @return {String}
     */
    exportJSON: function()
    {
        return JSON.stringify(this.exportModel(), null, 4);
    },
    
    /**
     * Import the model as JS object that confirms to Model JSON Scheme
     * 
     * @see {@link docs/JSON-Scheme.md}
     * @param {Object} model - Object that confirms to Model JSON Scheme
     */
    importModel: function(model)
    {
        this.limbs.length = 0;
        
        /* Import */
        this.name = model.name;
        this.poses.importPoses(model.poses);
        
        /* Import limbs */
        for (var key in model.limbs) 
        {
            var limb = new Limb();

            limb.importLimb(model.limbs[key]);
            limb.id = key;
            
            this.limbs.push(limb);
        }
        
        /* Fill with blanks */
        this.poses.form(this);
    },
    
    /**
     * Import the model with JSON string
     * 
     * @param {String} json
     */
    importJSON: function(json)
    {
        this.importModel(JSON.parse(json));
    }
};
},{"./limb":5,"./poses":8}],7:[function(require,module,exports){
var Transform = require("./transform");

/**
 * Pose class
 * 
 * This class keeps the limbs transformations and entity size during this pose.
 */

var Pose = module.exports = function()
{
    this.size = [1, 1, 1];
    this.limbs = {};
};

Pose.prototype = 
{
    /**
     * Form missing limb transformations
     * 
     * @param {Model} model
     */
    form: function(model)
    {
        model.limbs.forEach(this.formLimb.bind(this));
    },
    
    /**
     * @param {Limb} limb
     */
    formLimb: function(limb)
    {
        this.limbs[limb.id] || (this.limbs[limb.id] = new Transform());
    },
    
    /**
     * Get transformation for limb by given id
     * 
     * @param {String} id
     * @return {Transform|undefined}
     */
    forLimb: function(id)
    {
        return this.limbs[id];
    },
    
    /**
     * Rename limb
     * 
     * @param {String} from
     * @param {String} to
     */
    rename: function(from, to)
    {
        this.limbs[to] = this.limbs[from];
        
        delete this.limbs[from];
    },
    
    /**
     * Remove limb from this pose
     * 
     * @param {String} id
     */
    removeLimb: function(id)
    {
        if (this.limbs[id]) delete this.limbs[id];
    },
    
   /**
    * Export this pose
    * 
    * @return {Object}
    */
   exportPose: function()
   {
       var pose = 
       {
           size: this.size,
           limbs: {},
       };
       
       for (var key in this.limbs)
       {
           var transform = this.limbs[key].exportTransform();
           
           if (Object.keys(transform).length) pose.limbs[key] = transform;
       }
       
       return pose;
   },
   
   /**
    * Import the pose
    * 
    * @param {Object} pose
    */
   importPose: function(pose)
   {
       this.size = pose.size;
       this.limbs = {};
       
       for (var key in pose.limbs)
       {
           var transform = new Transform();
           
           transform.importTransform(pose.limbs[key]);
           
           this.limbs[key] = transform;
       }
   }
};
},{"./transform":9}],8:[function(require,module,exports){
var Pose = require("./pose");

/**
 * Poses manager
 * 
 * This class is responsible for applying and storing the poses for model.
 * Poses are basically transformations for limbs in specific state (like 
 * standing, sneaking, sleeping, and flying an elytra).
 */

var Poses = module.exports = function()
{
    this.poses = {};
};

Poses.prototype = 
{
    /**
     * This method is responsible for adding missing transforms to child 
     * 
     * @param {Model} model
     */
    form: function(model)
    {
        for (var key in this.poses)
        {
            this.poses[key].form(model);
        }
    },
    
    /**
     * Form limb
     * 
     * @param {Limb} limb
     */
    formLimb: function(limb)
    {
        for (var key in this.poses)
        {
            this.poses[key].formLimb(limb);
        }
    },
    
    /**
     * @param {String} id
     * @param {String} pose
     * @return {Pose}
     */
    getPoseForLimb: function(id, pose)
    {
        return this.poses[pose].forLimb(id);
    },
    
    /**
     * @param {String} pose
     * @return {Pose}
     */
    get: function(pose)
    {
        return this.poses[pose];
    },
    
    /**
     * Rename the limb from one name to another name
     * 
     * @param {String} from
     * @param {String} to
     */
    rename: function(from, to)
    {
        for (var key in this.poses)
        {
            this.poses[key].rename(from, to);
        }
    },
    
    /**
     * Remove limb from poses
     * 
     * @param {String} id
     */
    removeLimb: function(id)
    {
        for (var key in this.poses)
        {
            this.poses[key].removeLimb(id);
        }
    },
    
    /**
     * Export all those fancy poses
     * 
     * @return {Object}
     */
    exportPoses: function()
    {
        var poses = {};
        
        for (var key in this.poses)
        {
            poses[key] = this.poses[key].exportPose();
        }
        
        return poses;
    },
    
    /**
     * Import the pose
     * 
     * @param {Object} poses
     */
    importPoses: function(poses)
    {
        this.poses = {};
        
        for (var key in poses)
        {
            var pose = new Pose();
            
            pose.importPose(poses[key]);
            
            this.poses[key] = pose;
        }
    }
};
},{"./pose":7}],9:[function(require,module,exports){
var utils = require("../../utils");

/**
 * Check if given array is considered empty (all values are the same as )
 * 
 * @param {Array} array
 * @param {Object} value
 * @return {Boolean}
 */
function isEmpty(array, value)
{
    value = typeof value == "undefined" ? 0 : value;
    
    var result = true;
    
    for (var i = 0; i < array.length; i ++)
    {
        result = result && array[i] === value;
    }
    
    return result;
}

/**
 * Transforms class
 * 
 * This class keeps transformations for every limb in the pose class
 */

var Transform = module.exports = function()
{
    this.translate = [0, 0, 0];
    this.scale = [1, 1, 1];
    this.rotate = [0, 0, 0];
};

Transform.prototype = 
{
    /**
     * Export the transform
     * 
     * @return {Object}
     */
    exportTransform: function()
    {
        var transform = {};
        
        if (!isEmpty(this.translate, 0)) transform.translate = this.translate.slice();
        if (!isEmpty(this.scale, 1)) transform.scale = this.scale.slice();
        if (!isEmpty(this.rotate, 0)) transform.rotate = this.rotate.slice();
        
        return transform;
    },
    
    /**
     * Import transform
     * 
     * @param {Object} transform
     */
    importTransform: function(transform)
    {
        utils.merge(this, transform);
    }
};
},{"../../utils":39}],10:[function(require,module,exports){
/**
 * This file contains functions for managing the UV's of the geometries
 *
 * @author McHorse
 */

var UV = module.exports =
{
    /**
     * Creates a ThreeJS vector (2d point) for UV.
     * 
     * @param {Number} x
     * @param {Number} y
     * @param {Number} w
     * @param {Number} h
     */
    vec: function(x, y, w, h)
    {
        return new THREE.Vector2(x / w, y / h);
    },

    /**
     * Apply geometry's UV of the texture on the cube's side given 
     * the rectangle on the texture
     */
    side: function(ww, hh, geo, side, x, y, w, h, reflect)
    {
        side = side * 2;
    
        var faces = [
    		UV.vec(x,     y + h, ww, hh), /* 0 = 0, 1 */
    		UV.vec(x + w, y + h, ww, hh), /* 1 = 1, 1 */
    		UV.vec(x + w, y,     ww, hh), /* 2 = 1, 0 */
    		UV.vec(x,     y,     ww, hh)  /* 3 = 0, 0 */
    	];
        
        /* UV vector arrays */
        var top = geo.faceVertexUvs[0][side],
            bottom = geo.faceVertexUvs[0][side + 1];
	    
        /* Indices arrays */
        var topElements, bottomElements;
        
        /* If the side isn't the top face */
    	if (side != 6)
    	{
            topElements    = reflect ? [1, 2, 0] : [0, 3, 1];
            bottomElements = reflect ? [2, 3, 0] : [3, 2, 1];
    	}
    	else 
    	{
            topElements    = reflect ? [2, 1, 3] : [3, 0, 2];
            bottomElements = reflect ? [1, 0, 3] : [0, 1, 2];
    	}
        
        for (var i = 0; i < 3; i ++)
        {
            top[i].copy(faces[topElements[i]]);
            bottom[i].copy(faces[bottomElements[i]]);
        }
        
        geo.uvsNeedUpdate = true;
    },

    /**
     * Apply texture rect on cube's geometry
     */
    cube: function(ww, hh, geo, x, y, w, h, d, reflect)
    {
    	/* front and back */
    	UV.side(ww, hh, geo, 4, x + d, y, w, h, reflect);
    	UV.side(ww, hh, geo, 5, x + d + w + d, y, w, h, reflect);
	
    	/* right and left */
        if (reflect)
        {
        	UV.side(ww, hh, geo, 0, x, y, d, h, reflect);
        	UV.side(ww, hh, geo, 1, x + d + w, y, d, h, reflect);
        }
        else
        {
        	UV.side(ww, hh, geo, 0, x + d + w, y, d, h);
        	UV.side(ww, hh, geo, 1, x, y, d, h);
        }
	
    	/* top and bottom */
    	UV.side(ww, hh, geo, 2, x + d, y + h, w, d, reflect);
    	UV.side(ww, hh, geo, 3, x + d + w, y + h, w, d, reflect);
    }
};
},{}],11:[function(require,module,exports){
/**
 * Combined camera.
 *
 * This class is basically combines two cameras (perspective and orthographic) 
 * together.
 */

var CombinedCamera = module.exports = function (width, height, fov, near, far, orthoNear, orthoFar) 
{
    this.fov = fov;

    var halfW = width / 128,
        halfH = height / 128;
    
    this.width = width;
    this.height = height;
    
    this.ortho = new THREE.OrthographicCamera(-halfW, halfW, halfH, -halfH, orthoNear, orthoFar);
    this.ortho.position.z = 10;
    
    this.perspec = new THREE.PerspectiveCamera(fov, width / height, near, far);
    this.perspec.position.z = 8;
    
    this.toPerspec();
};

CombinedCamera.prototype = 
{
    toOrtho: function()
    {
        this.camera = this.ortho;
    },

    toPerspec: function()
    {
        this.camera = this.perspec;
    },
    
    /**
     * Toggle between orthographic and perspective cameras.
     * 
     * @param {Boolean|undefined} boolean
     */
    toggle: function(boolean)
    {
        if (typeof boolean != "undefined")
        {
            boolean ? this.toPerspec() : this.toOrtho();
        }
        else 
        {
            this.camera == this.ortho ? this.toPerspec() : this.toOrtho();
        }
    },
    
    dolly: function(amount)
    {
        this.perspec.position.z = this.perspec.position.z + amount;
        this.perspec.position.z = Math.clamp(this.perspec.position.z, 2, 20);
        
        var zoom = (20 - this.perspec.position.z + 2) * 30;
        
        var halfW = this.width / zoom,
            halfH = this.height / zoom;
        
        this.ortho.left = -halfW;
        this.ortho.right = halfW;
        this.ortho.top = halfH;
        this.ortho.bottom = -halfH;
        
        this.ortho.updateProjectionMatrix();
    },
    
    /**
     * Resize the camera
     */
    resize: function(width, height)
    {
        this.width = width;
        this.height = height;
        
        var halfW = width / 128,
            halfH = height / 128;
        
        this.perspec.aspect = width / height;
        this.ortho.left = -halfW;
        this.ortho.right = halfW;
        this.ortho.top = halfH;
        this.ortho.bottom = -halfH;
        
        this.perspec.updateProjectionMatrix();
        this.ortho.updateProjectionMatrix();
    }
};
},{}],12:[function(require,module,exports){
module.exports={
    "scheme": "1.3",
    "name": "Steve",
    "poses": {
        "standing": {
            "size": [ 0.6, 1.8, 0.6 ],
            "limbs": {
                "head": {
                    "translate": [ 0, 24, 0 ]
                },
                "outer": {
                    "translate": [ 0, 4, 0 ],
                    "scale": [ 1.1, 1.1, 1.1 ]
                },
                "body": {
                    "translate": [ 0, 24, 0 ]
                },
                "left_arm": {
                    "translate": [ 6, 24, 0 ]
                },
                "right_arm": {
                    "translate": [ -6, 24, 0 ]
                },
                "left_leg": {
                    "translate": [ 2, 12, 0 ]
                },
                "right_leg": {
                    "translate": [ -2, 12, 0 ]
                }
            }
        },
        "sneaking": {
            "size": [ 0.6, 1.65, 0.6 ],
            "limbs": {
                "body": {
                    "translate": [ 0, 20.8, 0 ],
                    "rotate": [ 28.64, 0, 0 ]
                },
                "head": {
                    "translate": [ 0, 19.8, 0 ]
                },
                "outer": {
                    "translate": [ 0, 4, 0 ],
                    "scale": [ 1.1, 1.1, 1.1 ]
                },
                "left_arm": {
                    "translate": [ 6, 20.8, 0 ],
                    "rotate": [ 22.9, 0, 0 ]
                },
                "right_arm": {
                    "translate": [ -6, 20.8, 0 ],
                    "rotate": [ 22.9, 0, 0 ]
                },
                "left_leg": {
                    "translate": [ 2, 12, -4 ]
                },
                "right_leg": {
                    "translate": [ -2, 12, -4 ]
                }
            }
        },
        "sleeping": {
            "size": [ 0.2, 0.2, 0.2 ],
            "limbs": {
                "head": {
                    "translate": [ 0, 24, 0 ]
                },
                "outer": {
                    "translate": [ 0, 4, 0 ],
                    "scale": [ 1.1, 1.1, 1.1 ]
                },
                "body": {
                    "translate": [ 0, 24, 0 ]
                },
                "left_arm": {
                    "translate": [ 6, 24, 0 ]
                },
                "right_arm": {
                    "translate": [ -6, 24, 0 ]
                },
                "left_leg": {
                    "translate": [ 2, 12, 0 ]
                },
                "right_leg": {
                    "translate": [ -2, 12, 0 ]
                }
            }
        },
        "flying": {
            "size": [ 0.6, 0.6, 0.6 ],
            "limbs": {
                "head": {
                    "translate": [ 0, 24, 0 ]
                },
                "outer": {
                    "translate": [ 0, 4, 0 ],
                    "scale": [ 1.1, 1.1, 1.1 ]
                },
                "body": {
                    "translate": [ 0, 24, 0 ]
                },
                "left_arm": {
                    "translate": [ 6, 24, 0 ]
                },
                "right_arm": {
                    "translate": [ -6, 24, 0 ]
                },
                "left_leg": {
                    "translate": [ 2, 12, 0 ]
                },
                "right_leg": {
                    "translate": [ -2, 12, 0 ]
                }
            }
        }
    },
    "limbs": {
        "body": {
            "size": [ 8, 12, 4 ],
            "texture": [ 16, 16 ],
            "anchor": [ 0.5, 0, 0.5 ]
        },
        "head": {
            "size": [ 8, 8, 8 ],
            "texture": [ 0, 0 ],
            "anchor": [ 0.5, 1, 0.5 ],
            "looking": true
        },
        "outer": {
            "parent": "head",
            "size": [ 8, 8, 8 ],
            "texture": [ 32, 0 ],
            "anchor": [ 0.5, 0.5, 0.5 ]
        },
        "left_arm": {
            "size": [ 4, 12, 4 ],
            "texture": [ 40, 16 ],
            "anchor": [ 0.5, 0, 0.5 ],
            "mirror": true,
            "holding": "left",
            "swinging": true
        },
        "right_arm": {
            "size": [ 4, 12, 4 ],
            "texture": [ 40, 16 ],
            "anchor": [ 0.5, 0, 0.5 ],
            "holding": "right",
            "swiping": true,
            "swinging": true
        },
        "left_leg": {
            "size": [ 4, 12, 4 ],
            "texture": [ 0, 16 ],
            "anchor": [ 0.5, 0, 0.5 ],
            "mirror": true,
            "swinging": true,
            "invert": true
        },
        "right_leg": {
            "size": [ 4, 12, 4 ],
            "texture": [ 0, 16 ],
            "anchor": [ 0.5, 0, 0.5 ],
            "swinging": true,
            "invert": true
        }
    },
    "texture": [ 64, 32 ]
}
},{}],13:[function(require,module,exports){
var dom = require("../dom"),
    utils = require("../utils");

var Editor = require("../editor"),
    Settings = require("./settings"),
    Tools = require("./tools"),
    Camera = require("./camera"),
    Model = require("./model");

/* Key map for tool bar items */
var map = 
{
    67: "scale",
    76: "picker",
    77: "move",
    82: "rotate",
    84: "translate"
};

/**
 * Model editor
 * 
 * This editor responsible for number of tasks, but most of them related to 
 * model managing, like selecting, adding, editing or removing model limbs.
 */

var ModelEditor = module.exports = function(app, element)
{
    Editor.call(this, app, element);
    
    this.limb = null;
    
    this.actor = app.actor;
    this.model = new Model(app.actor, app.skin);
    this.settings = new Settings(this, dom.$(".mc-settings", element));
    this.toolbar.map = 
    {
        "picker": new Tools.Picker(this),
        "move": new Tools.Move(this),
        "translate": new Tools.Translate(this),
        "rotate": new Tools.Rotate(this),
        "scale": new Tools.Scale(this),
    };
    
    this.toolbar.set("move");
};

utils.extend(ModelEditor, Editor, 
{
    /* @pragma_mark - Initiation */
    
    /** 
     * Initiate super's stuff, setup some events and setup ThreeJS environment
     */
    init: function() 
    {
        var self = this;
        
        Editor.prototype.init.call(this);
        
        /* Initiate the actor model */
        this.actor.importModel(require("./default.json"));
        
        this.model.build();
        this.model.applyPose("standing");
        
        /* Initiate widgets */
        this.settings.init();
        
        /* Reacting to window resize */
        dom.on(window, "resize", this.resize.bind(this));
        
        /* Toggling widgets */
        dom.on(dom.$(".mc-toggle-settings", this.element), "click", function () {
            self.settings.toggle();
        });
        
        /* Buttons */
        dom.on(dom.$(".mc-add-limb", this.element), "click", this.addLimb.bind(this));
        dom.on(dom.$(".mc-remove-limb", this.element), "click", this.removeLimb.bind(this));
        
        /* Other setups */
        this.setupThree();
        this.scene.add(this.model.group);
        this.render();
    },
    
    /**
     * Setup ThreeJS environment (scene, renderer and camera)
     */
    setupThree: function()
    {
        var width = this.element.offsetWidth,
            height = this.element.offsetHeight;
        
        var camera = new Camera(width, height, 50, 0.1, 1000, -1000, 1000),
            scene = new THREE.Scene();

        var renderer = new THREE.WebGLRenderer({
            preserveDrawingBuffer: true,
            alpha: true 
        });
        
        renderer.setClearColor(0xffffff, 0);
        renderer.setSize(width, height);
        renderer.domElement.id = "model";
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        this.setupLighting(scene);
        this.element.appendChild(renderer.domElement);
        this.canvas = renderer.domElement;
        
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
    },
    
    /**
     * Setup point and ambient light sources (and set point light to cast 
     * shadow)
     * 
     * @param {THREE.Scene} scene
     */
    setupLighting: function(scene)
    {
        var light = new THREE.PointLight(0xffffff, 1.3, 20, 0.7);
        
        light.position.set(0, 10, 8);
        light.castShadow = true;
        
		scene.add(light);
        scene.add(new THREE.AmbientLight(0x777777));
        
        this.light = light;
    },
    
    /* @pragma_mark - Input handling */
    
    /**
     * On key, depending on the pressed key, do:
     * 
     * - Select tools
     * - Hide this component
     * - Toggle child widgets
     * - Deselect current limb
     * - Toggle camera
     */
    onKey: function(event)
    {   
        var key = event.keyCode;
        
        if (map[key]) this.toolbar.set(map[event.keyCode]);
        if (key == 83) this.settings.toggle();
        
        if (key == 79) 
        {
            this.camera.toggle();
            this.settings.settings.flat = this.camera.camera == this.camera.ortho;
            this.settings.update();
            this.render();
        }
        
        if (key == 72) this.app.hide(this, this.app.texture);
        if (key == 68) this.setLimb(null);
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
    },
    
    /**
     * On wheel, we dolly the camera up and down, up in here
     * 
     * @param {Number} delta
     */
    onWheel: function(event)
    {
        if (event.target == this.element || event.target == this.canvas)
        {
            this.camera.dolly(event.deltaY / 20);
            this.render();
        }
    },
    
    /**
     * Respond to resize event
     */
    resize: function()
    {
        var width = this.element.offsetWidth, 
            height = this.element.offsetHeight;
        
        this.renderer.setSize(width, height);
        this.camera.resize(width, height);
        
        this.render();
    },
    
    /**
     * Update actor's texture and render the scene
     */
    update: function()
    {
        this.model.updateTexture();
        this.render();
    },
    
    /**
     * Render the scene
     */
    render: function()
    {
        this.renderer.render(this.scene, this.camera.camera);
    },
    
    /**
     * Add a limb either to model or current limb
     */
    addLimb: function()
    {
        var limb = this.model.add(this.limb);
        
        this.settings.updateLimbs();
        this.setLimb(limb);
        this.render();
    },
    
    /**
     * Remove current limb
     */
    removeLimb: function() 
    {
        if (this.limb && this.model.remove(this.limb))
        {
            this.limb = null;
            this.render();
            this.settings.fill();
            this.settings.updateLimbs();
        }
    },
    
    /**
     * Set current limb
     *
     * This method responsible for deselecting previous limb and setting given 
     * limb. If limb isn't null, it will be selected, well and of course the 
     * screen would be updated.
     * 
     * @param {THREE.Object3D|null} limb
     */
    setLimb: function(limb)
    {
        this.limb && (this.limb.material = this.model.material);
        this.limb = limb;
        this.limb && (this.limb.material = this.model.selectedMaterial);
        
        this.app.texture.render();
        this.settings.fill();
        this.render();
    }
});
},{"../dom":2,"../editor":3,"../utils":39,"./camera":11,"./default.json":12,"./model":14,"./settings":17,"./tools":18}],14:[function(require,module,exports){
var Poses = require("./3d/poses"),
    Limb = require("./3d/limb"),
    UV = require("./3d/uv");

/* Canvas for drawing texture from texture editor */
var canvas = document.createElement("canvas");

/* Properties for materials */
var props = 
{
    side: THREE.DoubleSide,
    alphaTest: 0.5
};

var selectedProps = 
{
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.65,
    alphaTest: 0.5
};

/**
 * Model class
 * 
 * This class is responsible for importing/exporting model to/from JSON, 
 * manipulating and providing access to model's limbs.
 */

var Model = module.exports = function(model, data)
{
    this.model = model;
    this.data = data;
    
    /* Texture */
    var texture = new THREE.Texture(canvas);
    
    texture.minFilter = texture.magFilter = THREE.NearestFilter;
    /* IMPORTANT! When you're gonna use this several instances, don't forget 
     * to clone those configuration objects */
    props.map = selectedProps.map = texture;
    
    /* Mesh that will be used for displaying limbs */
    this.group = new THREE.Object3D();
    this.limbs = [];
    
    /* Materials with lighting */
    this.lightMaterial = new THREE.MeshLambertMaterial(props);
    this.lightSelectedMaterial = new THREE.MeshLambertMaterial(selectedProps);
    
    /* Flat materials */
    this.flatMaterial = new THREE.MeshBasicMaterial(props);
    this.flatSelectedMaterial = new THREE.MeshBasicMaterial(selectedProps);
    
    /* Current type of material */
    this.material = this.lightMaterial;
    this.selectedMaterial = this.lightSelectedMaterial;
    
    /* AABB */
    this.aabb = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1), 
        new THREE.MeshBasicMaterial({ wireframe: true, color: 0xff0000 })
    );
    this.aabb.visible = false;
    this.group.add(this.aabb);
};

Model.prototype = 
{
    /**
     * Add a limb to the model with given parent
     * 
     * @param {THREE.Mesh} parent
     * @return {THREE.Mesh}
     */
    add: function(parent)
    {
        var limb = this.model.add(parent ? parent.limb.id : ""),
            mesh = this.buildLimb(limb);
        
        this.mapUV(mesh);
        
        (parent ? parent : this.group).add(limb.mesh);
        
        this.limbs.push(mesh);
        
        return mesh;
    },
    
    /**
     * Get limb by id
     * 
     * @param {String} id
     * @return {THREE.Mesh}
     */
    get: function(id)
    {
        for (var i = 0, c = this.limbs.length; i < c; i ++)
        {
            if (this.limbs[i].limb.id == id) return this.limbs[i];
        }
    },
    
    /**
     * Remove given limb from model
     * 
     * @param {Limb} limb
     * @return {Boolean} - If limb was removed
     */
    remove: function(limb)
    {
        var index = this.limbs.indexOf(limb),
            self  = this;
        
        if (index != -1)
        {
            this.limbs.forEach(function (child) {
                if (child.limb.parent == limb.limb.id) self.remove(child);
            });
            
            this.limbs.splice(index, 1);
            this.model.remove(limb.limb);
            
            limb.parent.remove(limb);
            limb.geometry.dispose();
        }
        
        return index != -1;
    },
    
    /**
     * Apply pose on the model
     * 
     * @param {Pose|String} pose
     */
    applyPose: function(pose)
    {
        var self = this;
        
        if (typeof pose == "string")
        {
            pose = this.model.poses.get(pose);
        }
        
        this.limbs.forEach(function (limb) {
            self.applyLimbPose(limb.limb, pose);
        });
    },
    
    /**
     * Apply pose on the model's limb
     * 
     * @param {Limb} limb
     * @param {Pose} pose
     */
    applyLimbPose: function(limb, pose)
    {
        var transform = pose.forLimb(limb.id),
            mesh = limb.mesh,
            PI = Math.PI;
        
        var translate = transform.translate,
            scale = transform.scale,
            rotate = transform.rotate;

        var y = translate[1] - (limb.parent ? 0 : pose.size[1] * 16 / 2);

        mesh.position.set(translate[0] / 8, y / 8, translate[2] / 8);
        mesh.scale.set(scale[0], scale[1], scale[2]);
        mesh.rotation.set(rotate[0] / 180 * PI, rotate[1] / 180 * PI, rotate[2] / 180 * PI);

        this.updateAABB(pose);
    },
    
    /**
     * Build a limb from domain limb
     *
     * @param {Limb} limb
     * @return {THREE.Mesh}
     */
    buildLimb: function(limb)
    {
        /* Building the mesh with BoxGeometry */
        var cube = new THREE.BoxGeometry(limb.size[0] / 8, limb.size[1] / 8, limb.size[2] / 8),
            mesh = new THREE.Mesh(cube, this.material);
        
        /* I like shadows */
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.limb = limb;
        limb.mesh = mesh;
        
        /* Setting the rotation point */
        var w = limb.size[0] / 8,
            h = limb.size[1] / 8,
            d = limb.size[2] / 8;
    
        var x = limb.anchor[0],
            y = limb.anchor[1],
            z = limb.anchor[2];
    
        mesh.geometry.translate(-w / 2, -h / 2, -d / 2);
        mesh.geometry.translate(x * w, y * h, z * d);
        mesh.rotation.order = "ZYX";
        
        return mesh;
    },
    
   /**
    * Regenerate this limb. Use this method when the limb's properties (not 
    * pose transformations) such as anchor and size were changed.
    * 
    * @param {Limb} limb
    */
   regenerateLimb: function(limb)
   {
       var mesh = limb.mesh,
           parent = mesh.parent,
           material = mesh.material;
           children = [],
           index = this.limbs.indexOf(mesh);
       
       /* Collect all children */
       for (var i = 0, c = mesh.children.length; i < c; i ++)
       {
           children.push(mesh.children[i]);
       }    
       
       parent.remove(mesh);
       
       mesh.geometry.dispose();
       mesh = this.buildLimb(limb);
       mesh.material = material;
       
       /* Inject those children back */
       children.forEach(function (child) {
           mesh.add(child);
       });
       
       parent.add(mesh);
       this.mapUV(mesh);
       this.limbs[index] = mesh;
   },
    
    /**
     * Map UV onto the mesh
     * 
     * @param {THREE.Mesh} mesh
     */
    mapUV: function(mesh)
    {
        var limb = mesh.limb,
            data = this.data;
        
        var w = limb.size[0],
            h = limb.size[1],
            d = limb.size[2];
        
        var u = limb.texture[0],
            v = data.h - (limb.texture[1] + h + d);
        
        UV.cube(data.w, data.h, mesh.geometry, u, v, w, h, d, limb.mirror);
    },
    
    /**
     * Build the model
     */
    build: function()
    {
        var self = this;
        
        if (this.limbs.length)
        {
            this.limbs.forEach(function (mesh) {
                mesh.parent.remove(mesh);
                mesh.geometry.dispose();
            });
            
            this.limbs.length = 0;
        }
        
        this.model.limbs.forEach(function (limb) {
            var mesh = self.buildLimb(limb);
    
            self.mapUV(mesh);
            self.limbs.push(mesh);
            self.group.add(mesh);            
        });
        
        this.form();
    },
    
    /**
     * Form relationship between parent and child limbs
     * 
     * This called only once, when the import is in the process.
     */
    form: function()
    {
        var limbs = {};
        
        for (var i = 0, c = this.limbs.length; i < c; i ++)
        {
            var limb = this.limbs[i].limb;
            
            limbs[limb.id] = this.limbs[i].limb;
        }
        
        for (var key in limbs)
        {
            var limb = limbs[key];
            
            if (limb.parent && limbs[limb.parent])
            {
                var parent = limbs[limb.parent];
                
                limb.mesh.parent.remove(limb.mesh);
                parent.mesh.add(limb.mesh);
            }
        }
    },
    
    /* @pragma_mark - Visuals */
    
    /**
     * Update model's texture (render skin to the material's texture and flag 
     * them dirty)
     */
    updateTexture: function()
    {
        var self = this;
        
        canvas.width = this.data.w;
        canvas.height = this.data.h;
        
        this.data.render(canvas.getContext("2d"), this.data.w, this.data.h);
        this.limbs.forEach(function (limb) {
            self.mapUV(limb);
        });
        
        this.material.map.needsUpdate = true;
        this.material.needsUpdate = true;
    },
    
    /**
     * Toggle the material of limbs
     * 
     * @param {ModelEditor} editor
     * @param {Boolean} toggle
     */
    toggleMaterial: function(toggle)
    {
        var material         = toggle ? this.lightMaterial         : this.flatMaterial,
            selectedMaterial = toggle ? this.lightSelectedMaterial : this.flatSelectedMaterial;
        
        this.limbs.forEach(function (limb) {
            limb.material = material;
        });
        
        this.material = material;
        this.selectedMaterial = selectedMaterial;
    },
    
    /**
     * Update AABB based on the pose
     * 
     * @param {Pose} pose
     */
    updateAABB: function(pose)
    {
        var w = pose.size[0],
            h = pose.size[1],
            d = pose.size[2];
        
        this.aabb.geometry.dispose();
        this.aabb.geometry = new THREE.BoxGeometry(w * 2, h * 2, d * 2);
    }
};
},{"./3d/limb":5,"./3d/poses":8,"./3d/uv":10}],15:[function(require,module,exports){
var dom = require("../dom");

/**
 * Poses popup controller
 * 
 * This class is responsible for listening to the input events and notify 
 * poses about changes (this includes applying new transformations and 
 * re-rendering the screen).
 */

var Poses = module.exports = function(editor, element)
{
    this.editor = editor;
    this.model = editor.app.actor;
    
    this.element = element;
    this.inputs = dom.$$("input", element);
    this.pose = dom.$(".mc-pose", element);
};

Poses.prototype = 
{
    /**
     * Subscribe to DOM events
     */
    init: function()
    {
        var self = this;
        
        /* Attach event listeners  */
        this.inputs.forEach(function (input) {
            dom.on(input, "change", function () { 
                self.change(this);
            });
        });
        
        dom.on(this.pose, "change", this.poseChange.bind(this));
        
        this.fill();
    },
    
    /**
     * Clear the stuff
     */
    clear: function()
    {
        this.pose.value = "standing";
    },
    
    /**
     * Gets invoked when an input value has been changed
     * 
     * This method should submit transformations to pose and apply the pose 
     * on current limb.
     */
    change: function(input)
    {
        var name = input.name,
            limb = this.editor.limb,
            pose = this.current();
        
        var underscore = name.indexOf("_"),
            key = name.substr(0, underscore);
        
        /* Set the input to appropriate field */
        if (name.indexOf("size") == 0)
        {
            var suffixes = ["w", "h", "d"],
                index = suffixes.indexOf(name.substr(underscore + 1))
            
            pose.size[index] = parseFloat(input.value);
            this.editor.model.applyPose(pose);
            this.editor.model.updateAABB(pose);
        }
        else if (limb)
        {
            limb = limb.limb;
            
            var suffixes = ["x", "y", "z"],
                index = suffixes.indexOf(name.substr(underscore + 1));
            
            var value = parseFloat(input.value);
            
            if (key == "scale" && value <= 0)
            {
                return alert("Scale values should be greater than 0.");
            }
            
            pose.limbs[limb.id][key][index] = value;
            this.editor.model.applyLimbPose(limb, pose);
        }
        
        /* Re-render the screen */
        this.editor.render();
    },
    
    /**
     * Gets invoked when pose selector has been changed
     *
     * This method should update the values in the popup inputs and also 
     * update all limbs with selected pose transformations.
     */
    poseChange: function()
    {
        var pose = this.current();
        
        this.editor.model.applyPose(pose);
        this.editor.model.updateAABB(pose);
        
        this.fill();
        this.editor.render();
    },
    
    /**
     * Gets invoked when user selects another limb (or deselects)
     * 
     * Fill poses popup with values from the current limb. If there's no current 
     * limb, then the fields are getting disabled.
     * 
     * That's an epic shit code.
     */
    fill: function()
    {
        var limb = this.editor.limb,
            self = this;
        
        if (!limb)
        {
            this.inputs.forEach(function (input) {
                if (input.name.indexOf("size") == 0) return;
                
                input.disabled = true;
                input.value = "";
            });
            
            this.fillSize();
            
            return;
        }
        
        var transform = this.model.poses.getPoseForLimb(limb.limb.id, this.pose.value),
            pose = this.current();
        
        var fields = 
        {
            size_w: pose.size[0],
            size_h: pose.size[1],
            size_d: pose.size[2],
            
            translate_x: transform.translate[0],
            translate_y: transform.translate[1],
            translate_z: transform.translate[2],
            
            scale_x: transform.scale[0],
            scale_y: transform.scale[1],
            scale_z: transform.scale[2],
            
            rotate_x: transform.rotate[0],
            rotate_y: transform.rotate[1],
            rotate_z: transform.rotate[2],
        };
        
        this.inputs.forEach(function (input) {
            input.disabled = false;
            input.value = fields[input.name];
        });
    },
    
    fillSize: function()
    {
        var pose = this.current();
        
        var fields = 
        {
            size_w: pose.size[0],
            size_h: pose.size[1],
            size_d: pose.size[2]
        };
        
        this.inputs.forEach(function (input) {
            input.disabled = false;
            fields[input.name] && (input.value = fields[input.name]);
        });
    },
    
    /**
     * Get current pose
     */
    current: function()
    {
        return this.model.poses.get(this.pose.value);
    }
};
},{"../dom":2}],16:[function(require,module,exports){
var dom = require("../dom"),
    utils = require("./utils");

/**
 * Properties class
 * 
 * This class is responsible for managing 
 */

var Properties = module.exports = function(editor, element)
{
    this.editor = editor;
    this.element = element;
    
    this.inputs = dom.$$("[name]", element);
    this.parent = dom.$("[name=parent]", element);
};

Properties.prototype = 
{
    /**
     * Initiate event listeners
     */
    init: function()
    {
        var self = this;
        
        this.inputs.forEach(function (input) {
            dom.on(input, "change", function () {
                self.change(this);
            });
        });
        
        this.updateLimbs();
        this.fill();
    },
    
    /**
     * Update limb's values when this is changes. Actually you know what? 
     * Better delegate the change logic to other methods.
     */
    change: function(input)
    {
        var limb = this.editor.limb,
            name = input.name,
            value = input.type != "checkbox" ? input.value : input.checked;
        
        if (!limb) return;
        
        limb = limb.limb;
        
        var keys = name.split("_");
            key  = keys.shift(),
            action = key + "Change";
        
        this[action] ? this[action](limb, value, name) : (limb[key] = value);
    },
    
    /**
     * Rename the limb
     */
    idChange: function(limb, value, name)
    {
        if (this.editor.app.actor.hasLimb(value) || value == "")
        {
            return alert("Limb with name \"" + value + "\" already exist!");
        }
        
        this.editor.app.actor.poses.rename(limb.id, value);
        
        /* Rename children's parent field for given limb */
        var limbs = this.editor.app.actor.limbs;
        
        for (var i = 0; i < limbs.length; i ++)
        {
            if (limbs[i].parent == limb.id)
            {
                limbs[i].parent = value;
            }
        }
        
        limb.id = value;
        
        this.updateLimbs();
        this.editor.settings.updateLimbs();
        this.parent.value = limb.parent;
    },
    
    /**
     * Change parent
     */
    parentChange: function(limb, value)
    {
        if (value == limb.id) return;
        
        limb.parent = value;
        limb.mesh.parent.remove(limb.mesh);
        
        (value == "" 
            ? this.editor.model.group 
            : this.editor.model.get(value)).add(limb.mesh);
        
        var pose = this.editor.settings.poses.current();
        
        this.editor.model.applyLimbPose(limb, pose);
        this.editor.render();
    },
    
    /**
     * Set texture offset
     */
    textureChange: function(limb, value, name)
    {
        var index = ["x", "y"].indexOf(name.substr(name.indexOf("_") + 1));
        
        limb.texture[index] = parseInt(value);
        this.editor.update();
        this.editor.app.texture.render();
    },
    
    /**
     * Mirror change
     */
    mirrorChange: function(limb, value)
    {
        limb.mirror = value;
        this.editor.update();
    },
    
    /**
     * The size is changes
     */
    sizeChange: function(limb, value, name)
    {
        var index = ["w", "h", "d"].indexOf(name.substr(name.indexOf("_") + 1)),
            value = parseInt(value);
        
        if (value > 0)
        {
            limb.size[index] = value;
            
            this.regenerate(limb);
            this.editor.render();
            this.editor.app.texture.render();
        }
    },
    
    /**
     * Change limb's anchor
     */
    anchorChange: function(limb, value, name)
    {
        var index = ["x", "y", "z"].indexOf(name.substr(name.indexOf("_") + 1));
        
        limb.anchor[index] = Math.clamp(parseFloat(value), 0, 1);
        
        this.regenerate(limb);
        this.editor.render();
    },
    
    regenerate: function(limb)
    {
        var pose = this.editor.settings.poses.current();
        
        this.editor.model.regenerateLimb(limb);
        this.editor.limb = limb.mesh;
        this.editor.model.applyLimbPose(limb, pose);
    },
    
    /**
     * Fill inputs and stuff with values
     */
    fill: function()
    {
        var limb = this.editor.limb;
        
        if (!limb) 
        {
            return this.empty();
        }
        
        limb = limb.limb;
        
        var fields = 
        {
            id: limb.id,
            parent: limb.parent,
            
            holding: limb.holding,
            looking: limb.looking,
            swiping: limb.swiping,
            swinging: limb.swinging,
            idle: limb.idle,
            
            texture_x: limb.texture[0],
            texture_y: limb.texture[1],
            mirror: limb.mirror,
            
            size_w: limb.size[0],
            size_h: limb.size[1],
            size_d: limb.size[2],
            
            anchor_x: limb.anchor[0],
            anchor_y: limb.anchor[1],
            anchor_z: limb.anchor[2]
        };
        
        this.inputs.forEach(function (input) {
            var value = fields[input.name];
            
            if (typeof value == "boolean")
            {
                input.checked = value;
            }
            else
            {
                input.value = value;
            }
            
            input.disabled = false;
        });
    },
    
    /**
     * Empty the form
     */
    empty: function()
    {
        this.inputs.forEach(function (input) {
            input.value = "";
            input.checked = false;
            input.disabled = true;
        });
    },
    
    /**
     * Update limb list
     */
    updateLimbs: function()
    {
        var self = this;
        
        var empty = document.createElement("option");
        
        empty.value = "";
        empty.text = "None";
        
        this.parent.innerHTML = "";
        this.parent.appendChild(empty);
        
        utils.populateLimbs(this.parent, this.editor.app.actor)
    }
};
},{"../dom":2,"./utils":24}],17:[function(require,module,exports){
var dom = require("../dom"),
    utils = require("../utils"),
    model_utils = require("./utils")

var Settings = require("../settings"),
    Poses = require("./poses"),
    Properties = require("./properties");

/**
 * Model settings 
 */

var ModelSettings = module.exports = function(editor, element)
{
    Settings.call(this, editor, element);
    
    this.properties = new Properties(editor, dom.$(".mc-limb", element));
    this.poses = new Poses(editor, dom.$(".mc-poses", element));
    
    this.inputs = dom.$$("[data-section] [name]", element);
    this.limbs = dom.$(".mc-limbs", element);
    this.file = dom.$(".mc-model-input", element);
    
    this.settings.aabb = false;
    this.settings.flat = false;
    this.settings.shadow = true;
    this.settings.lighting = true;
};

utils.extend(ModelSettings, Settings, 
{
    /**
     * Initiate settings and child widgets
     */
    init: function()
    {
        Settings.prototype.init.call(this);
        
        dom.on(this.file, "change", this.importModel.bind(this));
        
        this.properties.init();
        this.poses.init();
        
        this.updateLimbs();
        this.fill();
    },
    
    /* @pragma_mark - Actions */
    
    /**
     * Export 3D JSON model action
     */
    exportAction: function()
    {
        var json = this.editor.app.actor.exportModel();
        
        json.texture = [
            this.editor.app.skin.w,
            this.editor.app.skin.h
        ];
        
        /* Prettify arrays */
        json = JSON.stringify(json, null, 4).replace(/\n\s+(?=-?\d|\])/g, " ");
       
        function download(filename, text) 
        {
            var element = document.createElement('a');
            
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('target', '_blank');
            element.setAttribute('download', filename);

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
        }
        
        download("model.json", json);
    },
    
    /**
     * Import 3D JSON model action
     */
    importAction: function()
    {
        this.file.value = null;
        this.file.click();
    },
    
    /**
     * Import the model
     */
    importModel: function()
    {
        var reader = new FileReader(),
            self = this;
        
        reader.onload = function (e) {
            try
            {
                var json = JSON.parse(e.target.result);
                
                self.editor.setLimb(null);
                self.editor.actor.importModel(json);
            
                self.editor.model.build();
                self.editor.model.applyPose("standing");
                self.editor.render();
                
                self.editor.app.skin.resize(json.texture[0], json.texture[1]);
                self.editor.app.texture.reset();
                self.editor.app.texture.settings.settings.size_w = json.texture[0];
                self.editor.app.texture.settings.settings.size_h = json.texture[1];
                self.editor.app.texture.settings.update();
                
                self.poses.clear();
                self.updateLimbs();
                self.fill();
            }
            catch (e)
            {                
                alert("An error occured while importing the JSON model:\n" + e);
            }
        };
        
        reader.readAsText(this.file.files[0]);
    },
    
    /**
     * Render the canvas to image (so you can edit it or use it for youtube 
     * thumbnail, basically do whatever whit the result :D)
     */
    renderAction: function()
    {
        window.open(this.editor.canvas.toDataURL("image/png"));
    },
    
    /**
     * Reset camera action
     */
    resetAction: function()
    {
        this.editor.model.group.rotation.set(0, 0, 0);
        this.editor.model.group.position.set(0, 0, 0);
        this.editor.render();
    },
    
    /* @pragma_mark - Change hooks */
    
    /**
     * Change the name of current model
     */
    nameChange: function(input)
    {
        this.editor.app.actor.name = input.value;
    },
    
    /**
     * Toggle the visibility of AABB
     */
    aabbChange: function(input)
    {
        this.editor.model.aabb.visible = input.checked;
        this.editor.render();
    },
    
    /**
     * When limb value changes
     */
    limbChange: function(input)
    {
        this.editor.setLimb(this.editor.model.get(input.value));
        this.limbs.blur();
    },
    
    /**
     * Toggle camera type (orthographic or perspective)
     */
    flatChange: function(input)
    {
        this.editor.camera.toggle(!input.checked);
        this.editor.render();
    },
    
    /**
     * Shadow change
     */
    shadowChange: function(input)
    {
        this.editor.renderer.shadowMap.enabled = input.checked;
        this.editor.render();
    },
    
    /**
     * Depending on the value, make shadow map bigger or smaller.
     */
    hdChange: function(input)
    {
        var light = this.editor.light;
        
        if (light.shadow.map)
        {
            light.shadow.mapSize.width = input.checked ? 2048 : 1024;
            light.shadow.mapSize.height = input.checked ? 2048 : 1024;
            light.shadow.map.dispose();
            light.shadow.map = null;
        }
    },
    
    /**
     * Toggle lighting material
     */
    lightingChange: function(input)
    {
        this.editor.model.toggleMaterial(input.checked);
        this.editor.render();
    },
    
    /* @pragma_mark - Additional form related methods */
    
    /**
     * Fill the fields
     */
    fill: function()
    {
        var name = this.editor.app.actor.name;
        
        this.set(dom.$("[name=name]", this.element), name);
        this.settings.name = name;
        
        this.properties.fill();
        this.poses.fill();
        this.updateLimbsValue();
    },
    
    /**
     * Update limb list
     */
    updateLimbs: function()
    {
        var self = this,
            empty = document.createElement("option");
        
        empty.value = "";
        empty.text = "None";
        
        this.limbs.innerHTML = "";
        this.limbs.appendChild(empty);
        this.limbs.value = "";
        
        model_utils.populateLimbs(this.limbs, this.editor.app.actor);
        
        this.updateLimbsValue();
        this.properties.updateLimbs();
    },
    
    /**
     * Update the value of this.limbs select
     */
    updateLimbsValue: function()
    {
        this.limbs.value = this.editor.limb ? this.editor.limb.limb.id : "";
    }
});
},{"../dom":2,"../settings":25,"../utils":39,"./poses":15,"./properties":16,"./utils":24}],18:[function(require,module,exports){
/**
 * Tools package
 * 
 * This package provides different tools for model editor
 */

module.exports = 
{
    Move: require("./move"),
    Picker: require("./picker"),
    Translate: require("./translate"),
    Scale: require("./scale"),
    Rotate: require("./rotate")
};
},{"./move":19,"./picker":20,"./rotate":21,"./scale":22,"./translate":23}],19:[function(require,module,exports){
/**
 * Move tool class
 * 
 * Allows users to move the canvas around the component's screen.
 */

var Move = module.exports = function(editor)
{
    this.editor = editor;
    this.model = editor.model.group;
};

Move.prototype = 
{
    onMouseMove: function(x, y)
    {
        var key = this.editor.app.key,
            shift = key && key.shiftKey,
            alt = key && key.altKey;
        
        x -= this.x;
        y -= this.y;
        
        if (shift)
        {
            this.model.rotation.x = this.rx + y / 90;
            this.model.rotation.z = this.rz - x / 90;
        }
        else if (alt)
        {
            this.model.position.x = this.tx + x / 90;
            this.model.position.y = this.ty - y / 90;
        }
        else
        {
            this.model.rotation.x = this.rx + y / 90;
            this.model.rotation.y = this.ry + x / 90;
        }
        
        this.editor.render();
    },
    
    onMouseDown: function(x, y)
    {
        this.x = x;
        this.y = y;
        
        this.rx = this.model.rotation.x || 0;
        this.ry = this.model.rotation.y || 0;
        this.rz = this.model.rotation.z || 0;
        
        this.tx = this.model.position.x || 0;
        this.ty = this.model.position.y || 0;
    }
};
},{}],20:[function(require,module,exports){
/**
 * Picker tool class
 * 
 * Allows users to select a limb in the scene
 */

var Picker = module.exports = function(editor)
{
    this.editor = editor;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
};

Picker.prototype = 
{
    onMouseMove: function(x, y)
    {},
    
    onMouseDown: function(x, y)
    {
        this.mouse.x = (x / this.editor.canvas.width) * 2 - 1;
        this.mouse.y = 1 - (y / this.editor.canvas.height) * 2;
        this.raycaster.setFromCamera(this.mouse, this.editor.camera.camera);
        
        var intersects = this.raycaster.intersectObjects(this.editor.model.limbs);
        
        this.editor.setLimb(intersects.length > 0 ? intersects[0].object : null);
    }
};
},{}],21:[function(require,module,exports){
/**
 * Rotate tool class
 * 
 * Allows users to rotate current limb.
 */

var Rotate = module.exports = function(editor)
{
    this.editor = editor;
    this.model = editor.model;
    this.poses = editor.settings.poses;
};

Rotate.prototype = 
{
    onMouseMove: function(x, y)
    {
        var limb = this.editor.limb;
        
        if (limb == null) return;
        
        limb = limb.limb;
        
        var key = this.editor.app.key,
            shift = key && key.shiftKey;
        
        x -= this.x;
        y -= this.y;
        
        var pose = this.poses.current(),
            transform = pose.forLimb(limb.id);
        
        if (shift)
        {
            transform.rotate[0] = Math.floor(this.rx + y);
            transform.rotate[1] = Math.floor(this.ry + x);
        }
        else
        {
            transform.rotate[0] = Math.floor(this.rx + y);
            transform.rotate[2] = Math.floor(this.rz + x);
        }
        
        this.model.applyLimbPose(limb, pose);
        this.editor.render();
        this.editor.settings.poses.fill();
    },
    
    onMouseDown: function(x, y)
    {
        var limb = this.editor.limb;
        
        if (limb == null) return;
        
        var transform = this.poses.current().forLimb(limb.limb.id);
        
        this.x = x;
        this.y = y;
        
        this.rx = transform.rotate[0];
        this.ry = transform.rotate[1];
        this.rz = transform.rotate[2];
    }
};
},{}],22:[function(require,module,exports){
/**
 * Scale tool class
 * 
 * Allows users to scale current limb.
 */

var Scale = module.exports = function(editor)
{
    this.editor = editor;
    this.model = editor.model;
    this.poses = editor.settings.poses;
};

Scale.prototype = 
{
    onMouseMove: function(x, y)
    {
        var limb = this.editor.limb;
        
        if (limb == null) return;
        
        limb = limb.limb;
        
        y -= this.y;
        y /= 20;
        
        var pose = this.poses.current(),
            transform = pose.forLimb(limb.id);
        
        var sx = transform.scale[0],
            sy = transform.scale[1],
            sz = transform.scale[2];
        
        transform.scale[0] = +Math.clamp(this.sx + y, 0, Infinity).toFixed(1);
        transform.scale[1] = +Math.clamp(this.sy + y, 0, Infinity).toFixed(1);
        transform.scale[2] = +Math.clamp(this.sz + y, 0, Infinity).toFixed(1);
        
        if (transform.scale[0] <= 0) transform.scale[0] = sx;
        if (transform.scale[1] <= 0) transform.scale[1] = sy;
        if (transform.scale[2] <= 0) transform.scale[2] = sz;
        
        this.model.applyLimbPose(limb, pose);
        this.editor.render();
        this.editor.settings.poses.fill();
    },
    
    onMouseDown: function(x, y)
    {
        var limb = this.editor.limb;
        
        if (limb == null) return;
        
        var transform = this.poses.current().forLimb(limb.limb.id);
        
        this.y = y;
        
        this.sx = transform.scale[0];
        this.sy = transform.scale[1];
        this.sz = transform.scale[2];
    }
};
},{}],23:[function(require,module,exports){
/**
 * Translate tool class
 * 
 * Allows users to translate current limb.
 */

var Translate = module.exports = function(editor)
{
    this.editor = editor;
    this.model = editor.model;
    this.poses = editor.settings.poses;
    
    this.vector = new THREE.Vector3(0, 0, 0);
};

Translate.prototype = 
{
    onMouseMove: function(x, y)
    {
        var limb = this.editor.limb;
        
        if (limb == null) return;
        
        limb = limb.limb;
        
        var key = this.editor.app.key,
            shift = key && key.shiftKey;
        
        x = (x - this.x) / 24;
        y = (y - this.y) / 24;
        
        /* NlL5's translation formula implementation */
        this.vector.set(x, !shift ? -y : 0, shift ? y : 0);
        this.vector.applyQuaternion(this.quat);
        
        /* Continues "fun" stuff */
        var pose = this.poses.current(),
            transform = pose.forLimb(limb.id);
        
        transform.translate[0] = Math.floor((this.tx + this.vector.x) * 10) / 10;
        transform.translate[1] = Math.floor((this.ty + this.vector.y) * 10) / 10;
        transform.translate[2] = Math.floor((this.tz + this.vector.z) * 10) / 10;
        
        this.model.applyLimbPose(limb, pose);
        this.editor.render();
        this.editor.settings.poses.fill();
    },
    
    onMouseDown: function(x, y)
    {
        var limb = this.editor.limb;
        
        if (limb == null) return;
        
        var transform = this.poses.current().forLimb(limb.limb.id);
        
        this.x = x;
        this.y = y;
        
        /* Initiating the quaternion */
        var axis = this.model.group.rotation.clone();
        
        axis.y *= -1;
        
        this.quat = new THREE.Quaternion();
        this.quat.setFromEuler(axis);
        
        /* Saving old values */
        this.tx = transform.translate[0];
        this.ty = transform.translate[1];
        this.tz = transform.translate[2];
    }
};
},{}],24:[function(require,module,exports){
module.exports = 
{
    /**
     * Populate given <select> with limbs from model
     * 
     * @param {HTMLSelectElement} select
     * @param {Model} model
     */
    populateLimbs: function(select, model)
    {
        model.limbs.forEach(function (limb) {
            var option = document.createElement("option");
            
            option.value = option.text = limb.id;
            
            select.appendChild(option);
        });
    }
};
},{}],25:[function(require,module,exports){
var dom = require("./dom");

/**
 * Settings class
 * 
 * This class is responsible for listening to the settings fields (including 
 * buttons) and collecting needed information for component.
 */

var Settings = module.exports = function(editor, element)
{
    this.editor = editor;
    this.element = element;
    this.settings = {};
    
    this.inputs = dom.$$("[name]", element);
    this.buttons = dom.$$("[data-action]", element);
};

Settings.prototype = 
{
    /**
     * Initiate settings event listeners (listening to input fields and button 
     * clicks).
     */
    init: function()
    {
        var self = this;
        
        /* Attach change listeners for named fields to notify about changes */
        this.inputs.forEach(function (node) {
            dom.on(node, "change", function () {
                self.settings[node.name] = self.get(node);
                self.notifyChanges(this);
            });
            
            self.set(node, self.settings[node.name]);
            self.settings[node.name] = self.get(node);
        });
        
        /* Attach click listeners for buttons to invoke actions */
        this.buttons.forEach(function (button) {
            var action = button.dataset.action + "Action";
            
            dom.on(button, "click", function () {
                self[action] && self[action](button);
            });
        });
    },
    
    /**
     * Set input's value
     * 
     * @param {Node} node
     * @param {Object} value
     */
    set: function(node, value)
    {
        if (node.type == "checkbox")
        {
            node.checked = Boolean(value);
        }
        else
        {
            node.value = value;
        }
    },
    
    /**
     * Get input's value
     * 
     * @param {Node} node
     * @return {Object}
     */
    get: function(node)
    {
        if (node.type == "checkbox")
        {
            return node.checked;
        }
        else
        {
            return node.value;
        }
    },
    
    /**
     * Toggle the view of settings view
     */
    toggle: function()
    {
        this.element.classList.toggle("hidden");
    },
    
    /**
     * Notify changes
     * 
     * @param {HTMLInputElement} input
     */
    notifyChanges: function(input)
    {
        var keys = input.name.split("_"),
            method = keys.shift() + "Change";
        
        this[method] && this[method](input, keys);
    },
    
    /**
     * Update values in form
     */
    update: function()
    {
        var self = this;
        
        this.inputs.forEach(function (input) {
            if (typeof self.settings[input.name] != "undefined")
            {
                self.set(input, self.settings[input.name]);
            }
        });
    }
};
},{"./dom":2}],26:[function(require,module,exports){
var dom = require("../dom"),
    utils = require("../utils");

/**
 * Color bar class
 * 
 * This bar class is responsible for manipulating one of the components of the 
 * color in the color picker.
 * 
 * The color picker stores colors in the RGB format, but picker itself provides 
 * a HSL picker.
 */

var Bar = module.exports = function(picker, bar, index) 
{
    this.picker = picker;
    
    this.input = dom.$("input", bar);
    this.canvas = dom.$("canvas", bar);
    this.ctx = this.canvas.getContext("2d");
    
    this.index = index;
    this.factor = index == 0 ? 360 : 100;
    this.value = 0;
    
    this.generateGradient();
}

Bar.prototype = 
{
    /**
     * Initiate the color bar. Create gradient and render this bar. Also subscribe 
     * to ~~my channel~~ input to set the color component exactly as user wants. 
     */
    init: function()
    {
        var self = this;
        
        this.generateGradient();
        this.render();
        
        dom.on(this.input, "change", function () {
            self.value = (parseInt(this.value) || 0) / self.factor;
            self.value = Math.clamp(self.value, 0, 1);
            self.picker.colorChanged();
        });
    },
    
    /**
     * Click
     * 
     * @param {Number} x
     * @param {Number} y
     */
    click: function(x, y)
    {
        var margin = this.canvas.height / 2;
        
        this.value = (x - margin) / (this.canvas.width - margin * 2);
        this.value = Math.clamp(this.value, 0, 1);
        this.updateInput();
        this.picker.colorChanged();
    },
    
    /**
     * Update the input value
     */
    updateInput: function()
    {
        this.input.value = Math.floor(this.value * this.factor);
    },
    
    /**
     * Generate color gradient for this bar
     */
    generateGradient: function()
    {
        var color = this.picker.primary.slice(),
            steps = this.index == 0 ? 6 : 2;
        
        this.value = color[this.index];
        this.gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, 0);
        
        for (var i = 0; i <= steps; i ++)
        {
            color[this.index] = i / steps;
            this.gradient.addColorStop(i / steps, Color.hsl(color[0], color[1], color[2], 1).hsl());
        }
    },

    /**
     * Render the gradient
     */
    render: function()
    {
        var w = this.canvas.width,
            h = this.canvas.height;
            
        var ctx = this.ctx;

        /* Render the gradient rectangle */
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = this.gradient;
        ctx.fillRect(0, 0, w, h);
        
        var margin = h / 2,
            x = margin + this.value * (w - margin * 2);
        
        /* Render the grab circle */
        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(x, margin, margin * 0.7, 0, Math.PI * 2);
        ctx.stroke();
    }
};
},{"../dom":2,"../utils":39}],27:[function(require,module,exports){
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
     * Update the texture in the model editor
     */
    updateTexture: function()
    {
        var self = this;
        
        clearTimeout(this.timer);
        
        this.timer = setTimeout(function () 
        {
            self.app.model.update();
        }, 100);
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
},{"../dom":2,"../editor":3,"../toolbar":38,"../utils":39,"./picker":28,"./settings":30,"./tools":33}],28:[function(require,module,exports){
var dom = require("../dom"),
    utils = require("../utils");

var Bar = require("./bar");

/**
 * Picker class
 * 
 * This class is responsible for managing color picker bar and two colors that 
 * user can swap.
 */

var Picker = module.exports = function(pixelData, colors)
{
    this.pixelData = pixelData;
    this.colors = colors;
    
    this.primary = [0, 0, 1, 1];
    this.secondary = [0, 0, 0, 1];
    
    this.fg = dom.$(".mc-color-fg .mc-color-overlay", colors);
    this.bg = dom.$(".mc-color-bg .mc-color-overlay", colors);
    
    this.bars = 
    [
        new Bar(this, dom.$(".mc-hue-bar", colors), 0),
        new Bar(this, dom.$(".mc-saturation-bar", colors), 1),
        new Bar(this, dom.$(".mc-lightness-bar", colors), 2)
    ];
};

Picker.prototype =
{
    /**
     * Init event listeners to toggle the color picker
     */
    init: function()
    {
        var self = this,
            callback = this.toggle.bind(this);
        
        dom.on(this.fg, "click", callback);
        dom.on(this.bg, "click", callback);
        
        dom.on(dom.$(".mc-color-css"), "change", function () {
            var color = utils.parse(this.value);
            
            this.value = "";
            this.blur();
            
            self.primary = Color.rgb(color[0], color[1], color[2]).hslData();
            self.primary[3] = color[3];
            self.update();
        });
        
        this.bars.forEach(function (bar) {
            bar.init();
        });
        
        this.update();
    },
    
    /**
     * Toggle (hide or show) the color picker
     */
    toggle: function()
    {
        dom.$(".mc-color-picker", this.colors).classList.toggle("hidden");
    },
    
    /**
     * Swap primary with secondary
     */
    swap: function()
    {
        var primary = this.primary;
        
        this.primary = this.secondary;
        this.secondary = primary;
        
        this.update();
    },
    
    /**
     * Update the DOOM
     */
    update: function()
    {
        var primary = Color.HSLtoRGB(this.primary),
            secondary = Color.HSLtoRGB(this.secondary);
        
        primary[3] = this.primary[3];
        secondary[3] = this.secondary[3];
        
        this.fg.style.backgroundColor = utils.to_color(primary);
        this.bg.style.backgroundColor = utils.to_color(secondary);
        
        this.bars.forEach(function (bar) {
            bar.generateGradient();
            bar.updateInput();
            bar.render();
        });
    },
    
    /**
     * Set primary color, duh
     */
    setColor: function(color)
    {
        this.primary = Color.rgb(color[0], color[1], color[2], color[3]).hslData();
        this.update();
    },
    
    /**
     * Invoked if color changed
     */
    colorChanged: function()
    {
        this.primary[0] = this.bars[0].value;
        this.primary[1] = this.bars[1].value;
        this.primary[2] = this.bars[2].value;
        
        this.update();
    },
    
    /**
     * Mouse move 
     * 
     * @param {Number} x
     * @param {Number} y
     */
    onMouseMove: function(x, y)
    {
        for (var i = 0, c = this.bars.length; i < c; i ++)
        {
            var bar = this.bars[i],
                offset = bar.canvas.getBoundingClientRect();
            
            var nx = x - offset.left,
                ny = y - offset.top;
            
            if (nx >= 0 && nx < bar.canvas.width && ny >= 0 && ny < bar.canvas.height)
            {
                bar.click(nx, ny);
                break;
            }
        }
    }
};
},{"../dom":2,"../utils":39,"./bar":26}],29:[function(require,module,exports){
var utils = require("../utils");

/** Transparent color (used for blank pixels) */
var transparent = [0, 0, 0, 0];

/**
 * Texture data which stores pixel data for textures
 * 
 * @param {Number} w
 * @param {Number} h
 */
var PixelData = module.exports = function(w, h)
{
    this.w = w;
    this.h = h;
    
    this.reset();
};

PixelData.prototype = 
{
    /**
     * Resize the canvas (but keep or trim pixel data)
     * 
     * @param {Number} w
     * @param {Number} h
     */
    resize: function(w, h)
    {
        var map = this.map.slice();
        
        this.w = w;
        this.h = h;
        
        for (var y = 0; y < this.h; y ++)
        {
            this.map[y] = [];
            
            for (var x = 0; x < this.w; x ++)
            {
                this.set(x, y, map[y] && map[y][x] ? map[y][x] : transparent);
            }
        }
    },
    
    /**
     * Reset (i.e. clear it) the canvas
     */
    reset: function()
    {
        this.map = [];
        
        for (var y = 0; y < this.h; y ++)
        {
            this.map[y] = [];
            
            for (var x = 0; x < this.w; x ++)
            {
                this.set(x, y, transparent);
            }
        }
    },
    
    /**
     * Set color of the pixel in pixel data at position x and y
     * 
     * @param {Number} x
     * @param {Number} y
     * @param {Array} color
     */
    set: function(x, y, color)
    {
        if (this.inBound(x, y))
        {
            color = color.slice();
            color.rgb = utils.to_color(color);
            this.map[y][x] = color;
        }
    },
    
    /**
     * Get pixel in pixel data at position x and y
     * 
     * @param {Number} x
     * @param {Number} y
     * @return {Array|null}
     */
    get: function(x, y)
    {
        return this.inBound(x, y) ? this.map[y][x] : null;
    },
    
    /**
     * Is point is in acceptable range (i.e. withing the canvas)
     * 
     * @param {Number} x
     * @param {Number} y
     * @return {Number}
     */
    inBound: function(x, y)
    {
        return x >= 0 && y >= 0 && x < this.w && y < this.h;
    },
    
    /**
     * Get the factor of the scale between input and pixel data width and 
     * height
     * 
     * @param {Number} w
     * @param {Number} h
     * @return {Number}
     */
    scale: function(w, h) 
    {
        return Math.floor(Math.min(w / this.w, h / this.h)) || 1
    }, 

    /**
     * Render pixel data on canvas
     * 
     * @param {CanvasRenderingContext2D} ctx
     * @param {Number} w
     * @param {Number} h
     */
    render: function(ctx, w, h) 
    {
        var scale = this.scale(w, h);

        for (var x = 0; x < this.w; x ++) 
        {
            for (var y = 0; y < this.h; y ++) 
            {
                this.renderPixel(ctx, x, y, scale);
            }
        }
    },

    /**
     * Render only one pixel
     * 
     * @param {CanvasRenderingContext2D} ctx
     * @param {Number} x - From x
     * @param {Number} y - From y
     * @param {Number} scale - Scale of the pixel
     * @param {Number} x2 - To x
     * @param {Number} y2 - To y
     */
    renderPixel: function(ctx, x, y, scale, x2, y2) 
    {
        ctx.fillStyle = this.map[y][x].rgb;

        x2 = x2 === undefined ? x : x2;
        y2 = y2 === undefined ? y : y2;
        
        ctx.clearRect(x2 * scale, y2 * scale, scale, scale);
        ctx.fillRect(x2 * scale, y2 * scale, scale, scale);
    },
    
    /**
     * Import image data pixels into pixel data
     * 
     * @param {ImageData} img
     */
    fromImageData: function(img)
    {
        var data = img.data;
        
        for (var i = 0, c = data.length; i < c; i += 4) 
        {
            var x = (i / 4) % img.width,
                y = Math.floor((i / 4) / img.width);
        
            var r = data[i],
                g = data[i + 1],
                b = data[i + 2],
                a = data[i + 3];
        
            this.set(x, y, [r, g, b, a]);
        }
    },
    
    /**
     * Convert point in document coordinates relative to canvas's pixel
     * 
     * @param {CanvasNode} canvas
     * @param {Number} x
     * @param {Number} y
     * @return {Object}
     */
    pointToPixel: function(canvas, x, y)
    {
        x -= (canvas.offsetLeft + canvas.parentNode.offsetLeft);
        y -= (canvas.offsetTop + canvas.parentNode.offsetTop);
        
        var w = canvas.width,
            h = canvas.height;
  
        var scale = this.scale(w, h);
        
        return {
            x: Math.floor(x / scale),
            y: Math.floor(y / scale),
            scale: scale
        };
    }
};
},{"../utils":39}],30:[function(require,module,exports){
var dom = require("../dom"),
    utils = require("../utils");

var Settings = require("../settings");

/* Hidden canvas for importing and exporting pixels */
var canvas = document.createElement("canvas");

/**
 * Prepare image for rendering to pixel data 
 * 
 * @param {TextureEditor} editor
 * @return {Image}
 */
function renderImage(editor)
{
    var image = new Image(),
        w = editor.app.skin.w,
        h = editor.app.skin.h;

    image.onload = function () {
        canvas.width = w;
        canvas.height = h;

        var ctx = canvas.getContext("2d");

        ctx.drawImage(image, 0, 0);
        editor.app.skin.fromImageData(ctx.getImageData(0, 0, w, h));
        editor.render();
        editor.updateTexture();
    };
    
    return image;
}

/**
 * Texture settings 
 * 
 * This class is responsible mainly for delegating some of the actions back 
 * to texture editor, and importing and exporting skin texture.
 */

var TextureSettings = module.exports = function(editor, element)
{
    Settings.call(this, editor, element);
    
    this.file = dom.$(".mc-skin-input", element);
    
    this.settings.size_w = editor.app.skin.w;
    this.settings.size_h = editor.app.skin.h;
    
    this.clearAction = editor.clear.bind(editor);
    this.resetAction = editor.reset.bind(editor);
    
    this.sizeChange = this.resize.bind(this);
    this.gridChange = this.guidesChange = editor.render.bind(editor);
};

utils.extend(TextureSettings, Settings, 
{
    /**
     * Initiate the event listeners
     */
    init: function()
    {
        Settings.prototype.init.call(this);
        
        dom.on(this.file, "change", this.importImage.bind(this));
    },
    
    /**
     * Resize the pixel data and canvas
     */
    resize: function()
    {
        var width = Math.clamp(parseInt(this.settings.size_w), 0, Infinity) >> 0 || 0,
            height = Math.clamp(parseInt(this.settings.size_h), 0, Infinity) >> 0 || 0;
        
        if (width == 0 || height == 0)
        {
            return alert("You can't use zero as one of canvas' size components (" + this.settings.size_w + "x" + this.settings.size_h + ")");
        }
        
        this.editor.app.skin.resize(width, height);
        this.editor.reset();
    },
    
    /**
     * Import image
     * 
     * Basically read the image, draw it on canvas and then extract those pixels 
     * and send them to pixel data for parsing.
     */
    importImage: function()
    {
        var self = this,
            reader = new FileReader();

        reader.onload = function (event) {
            renderImage(self.editor).src = event.target.result;
        };

        reader.readAsDataURL(this.file.files[0]);
    },
    
    /**
     * Import action
     */
    importAction: function()
    {
        this.file.value = null;
        this.file.click();
    },
    
    /**
     * Export the image
     */
    exportAction: function()
    {
        var image = dom.$(".mc-skin-export", this.element),
            data = this.editor.app.skin;
        
        canvas.width = data.w;
        canvas.height = data.h;
        
        data.render(canvas.getContext("2d"), data.w, data.h);
        
        image.classList.remove("hidden");
        image.src = canvas.toDataURL("image/png");
    },
    
    /**
     * Generate color codes for texture. This is usable for people who want to 
     * edit the texture in extenral program like GIMP, PhotoShop or I don't know.
     * 
     * I use Pixen primarly, but I may bring level of functionality of texture 
     * editor so I wouln't need Pixen :D
     */
    generateAction: function()
    {
        /**
         * Draw square in pixel data
         * 
         * @param {PixelData} data
         * @param {Number} x
         * @param {Number} y
         * @param {Number} w
         * @param {Number} h
         * @param {Array} color
         */
        function draw (data, x, y, w, h, color) {
            for (var i = 0; i < w; i ++)
            {
                for (var j = 0; j < h; j ++)
                {
                    data.set(x + i, y + j, color);
                }
            }
        }
        
        var data = this.editor.app.skin;
        
        /* Clear canvas, goodbye pretty drawn texture */
        data.reset();
        
        this.editor.app.actor.limbs.forEach(function (limb) {
            var color = [Math.random(), 0.25 + Math.random() * 0.5, 0.5, 1];
            
            /* Copying the color */
            var top = color.slice(),
                side = color.slice(),
                front = color.slice(),
                back = color.slice(),
                bottom = color.slice();
            
            /* Modifying the lightness */
            top[2] = 0.7;
            front[2] = 0.6;
            back[2] = 0.4;
            bottom[2] = 0.3;
            
            /* Converting to RGB */
            top = Color.hsl.apply(null, top).rgbData();
            side = Color.hsl.apply(null, side).rgbData();
            front = Color.hsl.apply(null, front).rgbData();
            back = Color.hsl.apply(null, back).rgbData();
            bottom = Color.hsl.apply(null, bottom).rgbData();
            
            /* Extracting limb's properties */
            var x = limb.texture[0],
                y = limb.texture[1],
                w = limb.size[0],
                h = limb.size[1],
                d = limb.size[2];
            
            /* Left, front, right, back */
            draw(data, x, y + d, d, h, side);
            draw(data, x + d, y + d, w, h, front);
            draw(data, x + d + w, y + d, d, h, side);
            draw(data, x + d * 2 + w, y + d, w, h, back);
            
            /* Top, bottm */
            draw(data, x + d, y, w, d, top);
            draw(data, x + d + w, y, w, d, bottom);
        });
        
        this.editor.render();
    }
});

module.exports.renderImage = renderImage;
},{"../dom":2,"../settings":25,"../utils":39}],31:[function(require,module,exports){
var utils = require("../../utils");

function index(x, y, w)
{
    return Math.floor(x + y * w);
}

/**
 * Bucket tool class
 * 
 * Allows users to fill an area of pixels on canvas.
 */

var Bucket = module.exports = function(editor)
{
    this.editor = editor;
    this.pixelData = editor.app.skin;
    this.canvas = editor.canvas;
    this.picker = editor.picker;
};

Bucket.prototype = 
{
    onMouseMove: function(x, y)
    {},
    
    onMouseDown: function(x, y)
    {
        var data = this.pixelData,
            pos = data.pointToPixel(this.canvas, x, y);
    
        x = pos.x;
        y = pos.y;
    
        if (x < 0 || x >= data.w || y < 0 || y >= data.h) return;
        
        var color = this.picker.primary;
        
        color = Color.hsl(color[0], color[1], color[2]).rgbData();
        
        this.fill(data, x, y, color);
        this.editor.render();
        this.editor.updateTexture();
    },
    
    /**
     * Fill canvas with color
     * 
     * @param {PixelData} data
     * @param {Number} x
     * @param {Number} y
     * @param {Array} input – Color
     */
    fill: function(data, x, y, input)
    {
        var color = utils.to_color(data.get(x, y));
        
        var pixels = [index(x, y, data.w)],
            processed = [];
        
        /**
         * Add a pixel to pixel array to explore
         */
        function add (x, y) 
        {
            var i = index(x, y, data.w);
            
            /* Pass only if coordinates are in the range of canvas size */
            if (x < 0 || x >= data.w || y < 0 || y >= data.h) return;
            
            /* Add the pixel only if it wasn't already processed and it's the same color 
             * as initial pixel */
            if (processed.indexOf(i) < 0 && pixels.indexOf(i) < 0 && utils.to_color(data.get(x, y)) == color)
            {
                pixels.push(i);
            }
        }
        
        while (pixels.length)
        {
            var pixel = pixels.shift(),
                x = pixel % data.w,
                y = (pixel / data.w) >> 0;
            
            add(x + 1, y);
            add(x - 1, y);
            add(x, y + 1);
            add(x, y - 1);
            
            processed.push(pixel);
        }
        
        processed.forEach(function (pixel) {
            var x = pixel % data.w,
                y = (pixel / data.w) >> 0;
            
            data.set(x, y, input);
        });
    }
};
},{"../../utils":39}],32:[function(require,module,exports){
/**
 * Eraser tool class
 * 
 * Allows users to erase pixels on canvas.
 */

var Eraser = module.exports = function(editor)
{
    this.pixelData = editor.app.skin;
    this.canvas = editor.canvas;
    this.editor = editor;
};

Eraser.prototype = 
{
    /**
     * The same thing as mouse down, draw pixels
     */
    onMouseMove: function(x, y)
    {
        this.onMouseDown(x, y);
    },
    
    /**
     * Draw pixel on canvas
     */
    onMouseDown: function(x, y)
    {
        var data = this.pixelData,
            pos = data.pointToPixel(this.canvas, x, y);
        
        x = pos.x;
        y = pos.y;
        
        if (x < 0 || x >= data.w || y < 0 || y >= data.h) return;

        data.set(x, y, [0, 0, 0, 0]);
        data.renderPixel(this.canvas.getContext("2d"), x, y, pos.scale);
        
        this.editor.updateTexture();
    }
};
},{}],33:[function(require,module,exports){
/**
 * Tools package
 * 
 * This package provides different tools for texture editor
 */

module.exports = 
{
    Pencil: require("./pencil"),
    Eraser: require("./eraser"),
    Picker: require("./picker"),
    Bucket: require("./bucket"),
    Move: require("./move"),
    Zoom: require("./zoom")
};
},{"./bucket":31,"./eraser":32,"./move":34,"./pencil":35,"./picker":36,"./zoom":37}],34:[function(require,module,exports){
/**
 * Move tool class
 * 
 * Allows users to move the canvas around the component's screen.
 */

var Move = module.exports = function(editor)
{
    this.canvas = editor.canvas;
};

Move.prototype = 
{
    onMouseMove: function(x, y)
    {
        x = this.marginLeft - (this.x - x);
        y = this.marginTop - (this.y - y);
        
        this.canvas.style.marginLeft = x + "px";
        this.canvas.style.marginTop = y + "px";
    },
    
    onMouseDown: function(x, y)
    {
        this.x = x;
        this.y = y;
        
        this.marginLeft = parseInt(this.canvas.style.marginLeft) || -this.canvas.width / 2;
        this.marginTop  = parseInt(this.canvas.style.marginTop)  || -this.canvas.height / 2;
    }
};
},{}],35:[function(require,module,exports){
/**
 * Pencil tool class
 * 
 * Allows users to draw on canvas.
 */

var Pencil = module.exports = function(editor)
{
    this.pixelData = editor.app.skin;
    this.canvas = editor.canvas;
    this.picker = editor.picker;
    this.editor = editor;
};

Pencil.prototype = 
{
    /**
     * The same thing as mouse down, draw pixels
     */
    onMouseMove: function(x, y)
    {
        this.onMouseDown(x, y);
    },
    
    /**
     * Draw pixel on canvas
     */
    onMouseDown: function(x, y)
    {
        var data = this.pixelData,
            pos = data.pointToPixel(this.canvas, x, y);
        
        x = pos.x;
        y = pos.y;
        
        if (x < 0 || x >= data.w || y < 0 || y >= data.h) return;
        
        var color = this.picker.primary;
        
        data.set(x, y, Color.hsl(color[0], color[1], color[2]).rgbData());
        data.renderPixel(this.canvas.getContext("2d"), x, y, pos.scale);
        
        this.editor.updateTexture();
    }
};
},{}],36:[function(require,module,exports){
/**
 * Picker tool class
 * 
 * Allows users to pick a color from canvas.
 */

var Picker = module.exports = function(editor)
{
    this.editor = editor;
    this.pixelData = editor.app.skin;
    this.canvas = editor.canvas;
};

Picker.prototype = 
{
    onMouseMove: function(x, y)
    {},
    
    onMouseDown: function(x, y)
    {
        var data = this.pixelData,
            pos = data.pointToPixel(this.canvas, x, y);
        
        x = pos.x;
        y = pos.y;
        
        if (x < 0 || x >= data.w || y < 0 || y >= data.h) return;
        
        this.editor.picker.setColor(data.get(x, y));
    }
};
},{}],37:[function(require,module,exports){
/**
 * Zoom tool class
 * 
 * Allows users to zoom the canvas in or out.
 */

var Zoom = module.exports = function(editor)
{
    this.editor = editor;
    this.canvas = editor.canvas;
};

Zoom.prototype = 
{
    onMouseMove: function(x, y)
    {},
    
    onMouseDown: function(x, y)
    {
        var key = this.editor.app.key,
            factor = key && key.shiftKey ? 0.5 : 2;
        
        var w = this.canvas.width * factor,
            h = this.canvas.height * factor;
        
        /* Browser may crash if the canvas is way too big, let's keep it 
         * not too big and at least 1:1 */
        if (
            w > 2048 || w < this.editor.app.skin.w || 
            h > 2048 || h < this.editor.app.skin.h
        ) return;
        
        /* I don't really know what I did here, but it works, you know. This 
         * code does some magic computation, then applies some variables, and 
         * then... I don't have any idea how I came up with this...  */
        var data = this.editor.app.skin,
            pos  = data.pointToPixel(this.canvas, x, y);
        
        var left = parseInt(this.canvas.style.marginLeft) || 0,
            top  = parseInt(this.canvas.style.marginTop)  || 0;
        
        var ww = pos.x / data.w,
            hh = pos.y / data.h;
        
        if (factor == 2)
        {
            ww = 1 - ww;
            hh = 1 - hh;
            
            this.canvas.style.marginLeft = (left + this.canvas.width * ww - w / 2) + "px";
            this.canvas.style.marginTop  = (top + this.canvas.height * hh - h / 2) + "px";
        }
        else
        {
            this.canvas.style.marginLeft = (left - w * ww + this.canvas.width * ww) + "px";
            this.canvas.style.marginTop  = (top - h * hh + this.canvas.height * hh) + "px";
        }
        
        this.canvas.width = w;
        this.canvas.height = h;
        
        /* Re-render canvas again (because when canvas width is changed canvas
         * contents is being cleared) */
        this.editor.render();
    }
};
},{}],38:[function(require,module,exports){
var dom = require("./dom");

/**
 * Tool bar class
 * 
 * This class is responsible for displaying which tool is active, and also 
 * delegate mouse events to current tool.
 */
var Toolbar = module.exports = function(editor, element)
{
    this.editor = editor;
    this.element = element;
    
    this.tools = dom.$$("[data-tool]", element);
    this.current = "";
    this.map = {};
};

Toolbar.prototype =
{
    /**
     * Initiate this toolbar. Setup events for tool elements.
     */
    init: function()
    {
        var self = this;
        
        this.tools.forEach(function (node) {
            dom.on(node, "click", function () {
                self.set(this);
            });
        });
    },
    
    /**
     * Set the current tool
     * 
     * @param {String|Node} tool
     */
    set: function(tool)
    {
        if (typeof tool == "string")
        {
            tool = dom.$("[data-tool='" + tool + "']", this.element);
        }
        
        this.current = tool.dataset.tool;
        this.tools.forEach(function (node) {
            var selected = tool.dataset.tool == node.dataset.tool;
            
            node.classList.toggle("mc-tool-selected", selected);
        });
    },
    
    /**
     * Get currently equipped tool
     * 
     * @return {Object}
     */
    getCurrent: function()
    {
        return this.map[this.current];
    },
    
    /**
     * Invoke current's tool mouse move event
     */
    onMouseMove: function(x, y)
    {
        this.getCurrent().onMouseMove(x, y);
    },
    
    /**
     * Invoke current's tool mouse down event
     */
    onMouseDown: function(x, y)
    {
        this.getCurrent().onMouseDown(x, y);
    }
};
},{"./dom":2}],39:[function(require,module,exports){
/**
 * Some JS utils
 * 
 * @author McHorse
 */

var canvas = document.createElement("canvas");

module.exports =
{    
    /**
     * Extend child constructor with parent constructor with given methods
     * 
     * @param {Function} child
     * @param {Function} parent
     * @param {Object} methods
     */
    extend: function(child, parent, methods)
    {
        child.prototype = Object.create(parent.prototype);
    
        for (var key in methods)
        {
            child.prototype[key] = methods[key];
        }
    },
    
    /**
     * Convert RGBA array color to CSS string
     * 
     * @param {Array} color
     * @return {String}
     */
    to_color: function(color)
    {
        var r = color[0],
            g = color[1],
            b = color[2],
            a = color[3];
        
        if (typeof a == "undefined")
        {
            a = 1;
        }
    
        return "rgba(" + Math.floor(r) + "," + Math.floor(g) + "," + Math.floor(b) + "," + a + ")";
    },
    
    /**
     * @param {String} color
     * @return {Array}
     */
    parse: function(color)
    {
        var ctx = canvas.getContext("2d");

        ctx.fillStyle = color;
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillRect(0, 0, 1, 1);

        var data = ctx.getImageData(0, 0, 1, 1).data;

        return [data[0], data[1], data[2], data[3] / 255];
    },
    
    /**
     * Extract
     * 
     * @param {Object} object
     * @param {Array} keys
     */
    extract: function(object, keys)
    {
        var result = {};
        
        for (var key in object)
        {
            if (keys.indexOf(key) != -1)
            {
                result[key] = object[key];
            }
        }
        
        return result;
    },
    
    /**
     * Extend
     * 
     * @param {Object} a
     * @parma {Object} b
     */
    merge: function(a, b)
    {
        for (var key in b) a[key] = b[key];
    }
};
},{}]},{},[4])(4)
});