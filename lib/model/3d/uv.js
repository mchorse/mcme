/**
 * This file contains functions for managing the UV's of the geometries
 *
 * @author McHorse
 */

var UV = module.exports =
{
    /**
     * Creates a ThreeJS vector (2d point) for UV.
     * 
     * @param {Number} x
     * @param {Number} y
     * @param {Number} w
     * @param {Number} h
     */
    vec: function(x, y, w, h)
    {
        return new THREE.Vector2(x / w, y / h);
    },

    /**
     * Apply geometry's UV of the texture on the cube's side given 
     * the rectangle on the texture
     */
    side: function(ww, hh, geo, side, x, y, w, h, reflect)
    {
        side = side * 2;
    
        var faces = [
    		UV.vec(x,     y + h, ww, hh), /* 0 = 0, 1 */
    		UV.vec(x + w, y + h, ww, hh), /* 1 = 1, 1 */
    		UV.vec(x + w, y,     ww, hh), /* 2 = 1, 0 */
    		UV.vec(x,     y,     ww, hh)  /* 3 = 0, 0 */
    	];
        
        /* UV vector arrays */
        var top = geo.faceVertexUvs[0][side],
            bottom = geo.faceVertexUvs[0][side + 1];
	    
        /* Indices arrays */
        var topElements, bottomElements;
        
        /* If the side isn't the top face */
    	if (side != 6)
    	{
            topElements    = reflect ? [1, 2, 0] : [0, 3, 1];
            bottomElements = reflect ? [2, 3, 0] : [3, 2, 1];
    	}
    	else 
    	{
            topElements    = reflect ? [2, 1, 3] : [3, 0, 2];
            bottomElements = reflect ? [1, 0, 3] : [0, 1, 2];
    	}
        
        for (var i = 0; i < 3; i ++)
        {
            top[i].copy(faces[topElements[i]]);
            bottom[i].copy(faces[bottomElements[i]]);
        }
        
        geo.uvsNeedUpdate = true;
    },

    /**
     * Apply texture rect on cube's geometry
     */
    cube: function(ww, hh, geo, x, y, w, h, d, reflect)
    {
    	/* front and back */
    	UV.side(ww, hh, geo, 4, x + d, y, w, h, reflect);
    	UV.side(ww, hh, geo, 5, x + d + w + d, y, w, h, reflect);
	
    	/* right and left */
        if (reflect)
        {
        	UV.side(ww, hh, geo, 0, x, y, d, h, reflect);
        	UV.side(ww, hh, geo, 1, x + d + w, y, d, h, reflect);
        }
        else
        {
        	UV.side(ww, hh, geo, 0, x + d + w, y, d, h);
        	UV.side(ww, hh, geo, 1, x, y, d, h);
        }
	
    	/* top and bottom */
    	UV.side(ww, hh, geo, 2, x + d, y + h, w, d, reflect);
    	UV.side(ww, hh, geo, 3, x + d + w, y + h, w, d, reflect);
    }
};