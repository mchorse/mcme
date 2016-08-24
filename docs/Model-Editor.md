# Model Editor

Model editor is responsible for aiding the user with set of tools that will 
allow user to create a Minecraft boxy model for Blockbuster mod actors (but 
maybe in future or with the help of community, for other mods too).

This editor should also support pose editing (standing, sneaking, elytra, 
sleeping) and therefore support for limb transformations.

## Capabilities

For starter, those functions will be available in first version:

* [ ] Texture mapping
* [ ] Poses and transformations
* [ ] JSON scheme support (see [JSON Scheme](./JSON-Scheme.md) document)
* [ ] Moving and zooming (this time moving with tool, but zooming with 
  ~~freaking lazer~~ mouse wheel)
* [ ] Add and remove limbs
* [ ] Select limbs
* [ ] Edit limb's properties (parent, role, limb size, texture offset)
* [ ] Undo/redo mechanism

## Description

Following tools are supposed to be in the tool bar:

* Pose manager
* Limb editor
* Limb picker
* Move tool
* Hello there tool

Right tool bar would be filled with following buttons (from right to left):

* Toggle settings
* Add limb
* Remove limb

Right tool bar is used for actions, instead as a tool set which can be used. 
Setting would contain following stuff:

* Export / import JSON models
* ...

Any ideas?