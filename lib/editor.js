var dom = require("./dom"),
    utils = require("./utils");

var Toolbar = require("./toolbar");

/**
 * Editor classes
 * 
 * Basically, this files contains two app components, because I'm lazy.
 */

var Editor = module.exports = function(app, element)
{
    this.app = app;
    this.element = element;
    this.toolbar = new Toolbar(this, dom.$(".mc-toolbar", element));
};

Editor.prototype = 
{
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
    }
};