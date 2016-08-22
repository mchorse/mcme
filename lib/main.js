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
 * @author McHorse
 */

module.exports = 
{
    App: require("./app"),
    dom: require("./dom")
};