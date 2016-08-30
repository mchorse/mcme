var dom = require("../dom"),
    utils = require("../utils");

var Editor = require("../editor"),
    Settings = require("./settings"),
    Tools = require("./tools"),
    Camera = require("./camera");

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
    /** 
     * Initiate super's stuff, setup some events and setup ThreeJS environment
     */
    init: function() 
    {
        var self = this;
        
        Editor.prototype.init.call(this);
        
        /* Initiate the actor model */
        this.app.actor.importModel(require("./default.json"));
        this.app.actor.applyPose("standing");
        
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
        
        /* Refresh texture every second */
        setInterval(this.update.bind(this), 1000);
        
        /* Other setups */
        this.setupThree();
        this.scene.add(this.app.actor.group);
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
    onWheel: function(delta)
    {
        this.camera.dolly(delta / 20);
        this.render();
    },
    
    /**
     * Update actor's texture and render the scene
     */
    update: function()
    {
        this.app.actor.updateTexture();
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
        this.camera.resize(width, height);
        
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
        var limb = this.app.actor.add(this.limb);
        
        this.settings.updateLimbs();
        this.setLimb(limb.mesh);
        this.render();
    },
    
    /**
     * Remove current limb
     */
    removeLimb: function() 
    {
        if (this.limb && this.app.actor.remove(this.limb.limb))
        {
            this.limb = null;
            this.render();
            this.settings.updateLimbs();
            this.properties.updateLimbs();
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
        this.limb && (this.limb.material = this.app.actor.material);
        this.limb = limb;
        this.limb && (this.limb.material = this.app.actor.selectedMaterial);
        
        this.app.texture.render();
        this.settings.fill();
        this.render();
    }
});