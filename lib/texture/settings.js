var dom = require("../dom"),
    utils = require("../utils");

var Settings = require("../settings");

/* Hidden canvas for importing and exporting pixels */
var canvas = document.createElement("canvas");

/**
 * Texture settings 
 */

var TextureSettings = module.exports = function(editor, element)
{
    Settings.call(this, editor, element);
    
    this.clearAction = editor.clear.bind(editor);
    this.resetAction = editor.reset.bind(editor);
    
    this.file = dom.$(".mc-skin-input", element);
    
    this.settings.width = editor.app.skin.w;
    this.settings.height = editor.app.skin.h;
};

utils.extend(TextureSettings, Settings, 
{
    /**
     * Initiate the event listeners
     */
    init: function()
    {
        Settings.prototype.init.call(this);
        
        dom.on(this.file, "change", this.importImage.bind(this));
    },
    
    /**
     * Import image
     * 
     * Basically read the image, draw it on canvas and then extract those pixels 
     * and send them to pixel data for parsing.
     */
    importImage: function()
    {
        var self = this,
            reader = new FileReader();

        reader.onload = function (event) {
            var image = new Image(),
                w = self.editor.app.skin.w,
                h = self.editor.app.skin.h;

            image.onload = function () {
                canvas.width = w;
                canvas.height = h;

                var ctx = canvas.getContext("2d");

                ctx.drawImage(image, 0, 0);
                self.editor.app.skin.fromImageData(ctx.getImageData(0, 0, w, h));
                self.editor.render();
            };

            image.src = event.target.result;
        };

        reader.readAsDataURL(this.file.files[0]);
    },
    
    /**
     * Import action
     */
    importAction: function()
    {
        this.file.click();
    },
    
    /**
     * Export the image
     */
    exportAction: function()
    {
        var image = dom.$(".mc-skin-export", this.element),
            data = this.editor.app.skin;
        
        canvas.width = data.w;
        canvas.height = data.h;
        
        data.render(canvas.getContext("2d"), data.w, data.h);
        
        image.classList.remove("hidden");
        image.src = canvas.toDataURL("image/png");
    }
});