var dom = require("../dom"),
    utils = require("../utils");

var Editor = require("../editor"),
    Settings = require("./settings"),
    Tools = require("./tools"),
    Poses = require("./poses");

/* Key map for tool bar items */
var map = 
{
    76: "picker",
    77: "move"
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
    this.poses = new Poses(this, dom.$(".mc-poses", element));
    this.toolbar.map = 
    {
        "picker": new Tools.Picker(this),
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
        
        /* Initiate the actor model */
        this.app.actor.importModel(require("./default.json"));
        this.app.actor.applyPose("standing");
        
        /* Initiate widgets */
        this.settings.init();
        this.poses.init();
        
        /* Reacting to window resize */
        dom.on(window, "resize", this.resize.bind(this));
        
        /* Toggling widgets */
        dom.on(dom.$(".mc-toggle-settings", this.element), "click", function () {
            self.settings.toggle();
        });
        
        dom.on(dom.$(".mc-pose-icon"), "click", function () {
            self.poses.toggle();
        });
        
        /* Buttons */
        dom.on(dom.$(".mc-remove-limb", this.element), "click", function () {
            if (self.limb && self.app.actor.remove(self.limb.limb))
            {
                self.limb = null;
                self.render();
            }
        });
        
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
        
        var camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000),
            scene = new THREE.Scene();

        var renderer = new THREE.WebGLRenderer({
            preserveDrawingBuffer: true,
            alpha: true 
        });

        renderer.setClearColor(0xffffff, 0);
        renderer.setSize(width, height);
        renderer.domElement.id = "model";
    
        camera.position.z = 5;
        this.element.appendChild(renderer.domElement);
        this.canvas = renderer.domElement;
        
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
    },
    
    /**
     * On key, depending on the pressed key, do:
     * 
     * - Select tools
     * - Hide this component
     * - Toggle child widgets
     * - Deselect current limb
     */
    onKey: function(event)
    {   
        var key = event.keyCode;
        
        if (map[key]) this.toolbar.set(map[event.keyCode]);
        if (key == 83) this.settings.toggle();
        if (key == 80) this.poses.toggle();
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
        var z = this.camera.position.z + (delta) / 20;
        
        this.camera.position.z = z > 10 ? 10 : (z < 1 ? 1 : z);
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
        
        this.poses.fill();
        this.render();
    },
});