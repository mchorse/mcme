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
 * ToDo list:
 * 
 * @todo by NlL5
 *
 * - Brushes
 * - Add animation cosmetics
 * - Zoom relative to click area
 * - Color history in color picker (like in GIMP)
 * - Generate color codes for texture based on limbs texture offset
 * 
 * @todo by McHorse
 *
 * - Fallback to default pose if there's no transformations
 * - Don't prevent scrolling in settings views
 * - Draw limb guides
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