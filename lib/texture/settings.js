var dom = require("../dom"),
    utils = require("../utils");

var Settings = require("../settings");

/* Hidden canvas for importing and exporting pixels */
var canvas = document.createElement("canvas");

/**
 * Prepare image for rendering to pixel data 
 * 
 * @param {TextureEditor} editor
 * @return {Image}
 */
function renderImage(editor)
{
    var image = new Image(),
        w = editor.app.skin.w,
        h = editor.app.skin.h;

    image.onload = function () {
        canvas.width = w;
        canvas.height = h;

        var ctx = canvas.getContext("2d");

        ctx.drawImage(image, 0, 0);
        editor.app.skin.fromImageData(ctx.getImageData(0, 0, w, h));
        editor.render();
    };
    
    return image;
}

/**
 * Texture settings 
 * 
 * This class is responsible mainly for delegating some of the actions back 
 * to texture editor, and importing and exporting skin texture.
 */

var TextureSettings = module.exports = function(editor, element)
{
    Settings.call(this, editor, element);
    
    this.file = dom.$(".mc-skin-input", element);
    
    this.settings.width = editor.app.skin.w;
    this.settings.height = editor.app.skin.h;
    
    this.clearAction = editor.clear.bind(editor);
    this.resetAction = editor.reset.bind(editor);
    this.importAction = this.file.click.bind(this.file);
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
            renderImage(self.editor).src = event.target.result;
        };

        reader.readAsDataURL(this.file.files[0]);
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
    },
    
    /**
     * Generate color codes for texture. This is usable for people who want to 
     * edit the texture in extenral program like GIMP, PhotoShop or I don't know.
     * 
     * I use Pixen primarly, but I may bring level of functionality of texture 
     * editor so I wouln't need Pixen :D
     */
    generateAction: function()
    {
        /**
         * Draw square in pixel data
         * 
         * @param {PixelData} data
         * @param {Number} x
         * @param {Number} y
         * @param {Number} w
         * @param {Number} h
         * @param {Array} color
         */
        function draw (data, x, y, w, h, color) {
            for (var i = 0; i < w; i ++)
            {
                for (var j = 0; j < h; j ++)
                {
                    data.set(x + i, y + j, color);
                }
            }
        }
        
        var data = this.editor.app.skin;
        
        /* Clear canvas, goodbye pretty drawn texture */
        data.reset();
        
        this.editor.app.actor.limbs.forEach(function (limb) {
            var color = [Math.random(), 0.25 + Math.random() * 0.5, 0.5, 1];
            
            /* Copying the color */
            var top = color.slice(),
                side = color.slice(),
                front = color.slice(),
                back = color.slice(),
                bottom = color.slice();
            
            /* Modifying the lightness */
            top[2] = 0.7;
            front[2] = 0.6;
            back[2] = 0.4;
            bottom[2] = 0.3;
            
            /* Converting to RGB */
            top = Color.hsl.apply(null, top).rgbData();
            side = Color.hsl.apply(null, side).rgbData();
            front = Color.hsl.apply(null, front).rgbData();
            back = Color.hsl.apply(null, back).rgbData();
            bottom = Color.hsl.apply(null, bottom).rgbData();
            
            /* Extracting limb's properties */
            var x = limb.texture[0],
                y = limb.texture[1],
                w = limb.size[0],
                h = limb.size[1],
                d = limb.size[2];
            
            /* Left, front, right, back */
            draw(data, x, y + d, d, h, side);
            draw(data, x + d, y + d, w, h, front);
            draw(data, x + d + w, y + d, d, h, side);
            draw(data, x + d * 2 + w, y + d, w, h, back);
            
            /* Top, bottm */
            draw(data, x + d, y, w, d, top);
            draw(data, x + d + w, y, w, d, bottom);
        });
        
        this.editor.render();
    }
});

module.exports.renderImage = renderImage;