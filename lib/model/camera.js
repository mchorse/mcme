/**
 * Combined camera.
 *
 * This class is basically combines to cameras together.
 */

var CombinedCamera = module.exports = function (width, height, fov, near, far, orthoNear, orthoFar) 
{
    this.fov = fov;

    var halfW = width / 128,
        halfH = height / 128;
    
    this.width = width;
    this.height = height;
    
    this.ortho = new THREE.OrthographicCamera(-halfW, halfW, halfH, -halfH, orthoNear, orthoFar);
    this.ortho.position.z = 10;
    
    this.perspec = new THREE.PerspectiveCamera(fov, width / height, near, far);
    this.perspec.position.z = 8;
    
    this.toPerspec();
};

CombinedCamera.prototype = 
{
    toOrtho: function()
    {
        this.camera = this.ortho;
    },

    toPerspec: function()
    {
        this.camera = this.perspec;
    },
    
    /**
     * Toggle between orthographic and perspective cameras.
     * 
     * @param {Boolean|undefined} boolean
     */
    toggle: function(boolean)
    {
        if (typeof boolean != "undefined")
        {
            boolean ? this.toPerspec() : this.toOrtho();
        }
        else 
        {
            this.camera == this.ortho ? this.toPerspec() : this.toOrtho();
        }
    },
    
    dolly: function(amount)
    {
        this.perspec.position.z = this.perspec.position.z + amount;
        this.perspec.position.z = Math.clamp(this.perspec.position.z, 2, 20);
        
        var zoom = (20 - this.perspec.position.z + 2) * 30;
        
        var halfW = this.width / zoom,
            halfH = this.height / zoom;
        
        this.ortho.left = -halfW;
        this.ortho.right = halfW;
        this.ortho.top = halfH;
        this.ortho.bottom = -halfH;
        
        this.ortho.updateProjectionMatrix();
    },
    
    /**
     * Resize the camera
     */
    resize: function(width, height)
    {
        this.width = width;
        this.height = height;
        
        var halfW = width / 128,
            halfH = height / 128;
        
        this.perspec.aspect = width / height;
        this.ortho.left = -halfW;
        this.ortho.right = halfW;
        this.ortho.top = halfH;
        this.ortho.bottom = -halfH;
        
        this.perspec.updateProjectionMatrix();
        this.ortho.updateProjectionMatrix();
    }
};