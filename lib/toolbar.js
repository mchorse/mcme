var dom = require("./dom");

/**
 * Tool bar class
 * 
 * This class is responsible for displaying which tool is active, and also 
 * delegate mouse events to current tool.
 */
var Toolbar = module.exports = function(element)
{
    this.element = element;
    this.tools = dom.$$(".mc-tool", element);
    this.current = "";
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
            var callback = function () {
                self.set(this);
            };
            
            dom.on(node, "click", callback);
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
    }
};