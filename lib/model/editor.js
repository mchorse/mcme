var dom = require("../dom"),
    utils = require("../utils");

var Editor = require("../editor");

/**
 * Model editor
 */

var ModelEditor = module.exports = function(app, element)
{
    Editor.call(this, app, element);
};

utils.extend(ModelEditor, Editor, 
{
    /**
     * On mouse move, delegate this event to the picker and in case if the 
     * mouse is targeting the canvas or editor's element then also delegate 
     * the mouse event to the toolbar
     */
    onMouseMove: function(x, y, event)
    {
        if (event.target == this.element)
        {
            this.toolbar.onMouseMove(x, y);
        }
    },
    
    /**
     * On mouse down, do the same thing as above, but with mouse down
     */
    onMouseDown: function(x, y, event)
    {
        if (event.target == this.element)
        {
            this.toolbar.onMouseDown(x, y);
        }
    }
});