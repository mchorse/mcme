# Model Editor

Model editor is responsible for aiding the user with set of tools that will 
allow user to create a Minecraft boxy model for Blockbuster mod actors (but 
maybe in future or with the help of community, for other mods or even 
integrated into minecraft, oh boy).

This editor should also support pose editing (standing, sneaking, elytra, 
sleeping) and therefore support for limb transformations.

## Capabilities

For starter, those functions will be available in first version:

* [x] Texture mapping
* [x] Poses and transformations
* [x] JSON scheme support (see [JSON Scheme](./JSON-Scheme.md) document)
* [x] Moving and zooming (moving with tool, but zooming with mouse wheel)
* [x] Add limbs
* [x] Remove limbs
* [x] Select limbs
* [x] Edit limb's properties (parent, role, limb size, texture offset)
* [ ] Finish Settings
* [ ] Add more tools
* [ ] Undo/redo mechanism

## Description

This component is the most important one in this application (however one 
may argue that everything is important). This component is responsible for 
manipulating the 3D model.

This model would have a mapped to every limb from a texture from texture editor 
component. There's also some tools at user's disposal which allow user manipulating 
the model (transformations, properties, etc).

To add limb, you press "add limb" button in the right tool bar, and limb will appear. 
If any limb is selected, then the limb will be added to that limb as a child.

To remove limb, you press "remove limb" button in the right tool bar, and limb will 
disappear. If you selected a limb that has children and you removed it, the children 
would be removed too.

`Poses manager` displays global properties for the model like AABB size.

`Limb editor` displays lots of properties for the limb like global properties of the 
limb (`size`, `texture offset`, `role`, `anchor`, and `parent`) and pose properties 
(`translation`, `scale`, and `rotation`).

There's something supposed about riding properties, but I'm not sure what exactly 
should it be.

By the way, wall of text looks really good in documents, *amiright*?

## Tool Bars

#### Main Tool Bar (right)

This tool bar contains buttons for choosing specific tool:

* [x] Limb picker
* [x] Move tool
* [ ] Rotate limb tool
* [ ] Move model tool

#### Actions Tool Bar (left)

Right tool bar is used for actions, instead as a tool set which can be used. 
Setting would contain following stuff:

* Settings

## Settings

* Name of the model
* Export / import JSON models
* Explicit limb selector
* Pose manager
* Limb's properties
* Camera settings
* Render the model (that would really helpful for my youtube thumbnails)
* ...

Any ideas?