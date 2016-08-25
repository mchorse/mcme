var dom = require("../dom"),
    utils = require("../utils");

var Editor = require("../editor"),
    Settings = require("./settings"),
    Tools = require("./tools");

/**
 * Model editor
 */

var ModelEditor = module.exports = function(app, element)
{
    Editor.call(this, app, element);
    
    this.settings = new Settings(this, dom.$(".mc-settings", element));
    this.toolbar.map = 
    {
        "move": new Tools.Move(this)
    };
    this.toolbar.set("move");
};

utils.extend(ModelEditor, Editor, 
{
    /** 
     * Initiate super's stuff, setup some events and setup ThreeJS environment
     */
    init: function() 
    {
        var self = this;
        
        Editor.prototype.init.call(this);
        
        this.settings.init();
        
        /* Reacting to window resize */
        dom.on(window, "resize", this.resize.bind(this));
        
        /* Toggling settings */
        dom.on(dom.$(".mc-toggle-settings", this.element), "click", function () {
            self.settings.toggle();
        });
        
        /* Refresh texture every second */
        setInterval(function () {
            self.app.actor.updateTexture();
            self.render();
        }, 1000);
        
        this.setupThree();
        this.scene.add(this.app.actor.group);
        this.render();
    },
    
    /**
     * Setup ThreeJS environment (scene, renderer and camera)
     */
    setupThree: function()
    {
        /* Camera properties */
        var fov = 70,
            near = 0.1,
            far = 1000;
        
        var width = this.element.offsetWidth,
            height = this.element.offsetHeight;
        
        var camera = new THREE.PerspectiveCamera(fov, width / height, near, far),
            scene = new THREE.Scene();

        var renderer = new THREE.WebGLRenderer({
            preserveDrawingBuffer: true,
            alpha: true 
        });

        renderer.setClearColor(0xffffff, 0);
        renderer.setSize(width, height);
        renderer.domElement.id = "model";
    
        camera.position.z = 2;
        this.element.appendChild(renderer.domElement);
        this.canvas = renderer.domElement;
        
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
    },
    
    /**
     * On key, depending on the pressed key, do:
     * 
     * - Hide this component
     */
    onKey: function(event)
    {   
        if (event.keyCode == 83) this.settings.toggle();
        if (event.keyCode == 72) this.app.hide(this, this.app.texture);
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
    onWheel: function(delta)
    {
        var z = this.camera.position.z + (delta) / 20;
        
        this.camera.position.z = z > 10 ? 10 : (z < 1 ? 1 : z);
        this.render();
    },
    
    /**
     * Respond to resize event
     */
    resize: function()
    {
        var width = this.element.offsetWidth, 
            height = this.element.offsetHeight;
        
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.render();
    },
    
    /**
     * Render the scene
     */
    render: function()
    {
        this.renderer.render(this.scene, this.camera);
    }
});