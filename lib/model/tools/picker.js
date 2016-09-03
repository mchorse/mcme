/**
 * Picker tool class
 * 
 * Allows users to select a limb in the scene
 */

var Picker = module.exports = function(editor)
{
    this.editor = editor;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
};

Picker.prototype = 
{
    onMouseMove: function(x, y)
    {},
    
    onMouseDown: function(x, y)
    {
        this.mouse.x = (x / this.editor.canvas.width) * 2 - 1;
        this.mouse.y = 1 - (y / this.editor.canvas.height) * 2;
        this.raycaster.setFromCamera(this.mouse, this.editor.camera.camera);
        
        var intersects = this.raycaster.intersectObjects(this.editor.model.limbs);
        
        this.editor.setLimb(intersects.length > 0 ? intersects[0].object : null);
    }
};