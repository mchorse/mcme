/* Required models */
var dom = require("./dom");

var Editors = require("./editors");

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
    /* JSON Model */
    this.actor = null;
    
    /* Mouse State */
    this.clicking = false;
    this.pageX = this.pageY = 0;
    
    /* Components */
    this.texture = new Editors.TextureEditor(texture);
    this.model = new Editors.ModelEditor(model);
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
        
        /* Mouse events */
        dom.on(document, "mousedown", this.onMouseDown.bind(this));
        dom.on(document, "mousemove", this.onMouseMove.bind(this));
        dom.on(document, "mouseup", this.onMouseUp.bind(this));
    },
    
    /**
     * When key is up
     * 
     * @param {KeyEvent} event
     */
    onKey: function(event)
    {
        if (document.activeElement != document.body) return;
        
        var x = this.pageX,
            y = this.pageY;
        
        this.current.onKey(event);
    },
    
    onMouseMove: function(event)
    {
        var x = event.pageX,
            y = event.pageY;
        
        this.pageX = x;
        this.pageY = y;
        
        /* Select correct component */
        this.current = this.texture.inBound(x, y) ? this.texture : this.model;
    },
    
    onMouseDown: function(event)
    {
        this.clicking = true;
        this.onMouseMove(event);
    },
    
    onMouseUp: function(event)
    {
        this.clicking = false;
        this.onMouseMove(event);
    }
};