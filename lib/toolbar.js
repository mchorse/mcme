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
    
    this.tools = dom.$$(".mc-tool", element);
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