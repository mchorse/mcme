# Texture Editor

Texture editor is responsible for providing the user with a simple way to 
draw a skin for created model. You can always use other external program to 
draw the skin for your model. This texture editor isn't suppose to turn out 
like Photoshop with tons of plugins and tools, but a simple editor with simple 
functions.

## Capabilities

For starter, those functions will be available in first version:

* [x] Drawing and erasing pixels
* [ ] Filling (omg recursive filling, oh boy, so hard)
* [x] Moving and zooming canvas
* [x] Two colors with swapping function
* [x] HSL color picker with function to specify a CSS color
* [ ] Undo/redo mechanism

## Description

Tool bar buttons:

* Two color picker
* Pencil tool
* Eraser tool
* Picker tool
* Bucket tool
* Move tool
* Zoom tool

Other part of the screen is filled with texture canvas. Depends on selected tool 
different actions would be available.

On the top right, there would be also two buttons for hiding the texture editor 
(100% model editor) and settings button. When pressing the settings button 
there's a special sidebar will appear that would allow the user to specify some 
of the options of texture editor, like:

* Width and height of the canvas
* Bring canvas to original position and zoom (reset position and zoom)
* Import skin
* Clear canvas
* Draw grid
* Draw limb guides
* ...

Any ideas what can be in settings?