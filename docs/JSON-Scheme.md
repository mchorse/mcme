# JSON Model Scheme

```js
/**
 * JSON actor model scheme 
 *
 * @author McHorse
 * @version 1.3
 */
{
    /* Scheme version */
    "scheme": "1.3",
    /* Name of the model (displayed in actor GUI) */
    "name": "Steve",
    /* Width and height of the skin texture */
    "texture": [64, 32],
    /* Riding options */
    "riding": {
        /* Can player/other actors ride this actor */
        "activated": true,
        /* Y offset for riding entities */
        "offset_y": 0.8
    },
    /* Different variables for poses like standing or sneaking */
    "poses": {
        "standing": {
            /* Size of the entity (AABB), 1.0 equals one block */
            "size": [1, 2, 1],
            "limbs": {
                "head": {
                    "translate": [0, 24, 0]
                },
                /* "outer" isn't specified, because it doesn't need the transformations */
                "body": {
                    /**
                     * Translate the limb from the origin (from ground center point) 
                     * 
                     * Those coordinates are specified in the block units, 
                     * 16 "pixels" = 1 block, so if your actor is 2 blocks high, 
                     * he's 32 "pixels" tall.
                     */
                    "translate": [0, 24, 0],
                    /* Scale the limb from the anchor, those are default values */
                    "scale": [1, 1, 1],
                    /* Rotate the limb in degrees from the anchor, those are default values */
                    "rotate": [0, 0, 0]
                },
                "left_arm": {
                    "translate": [6, 24, 0]
                },
                "right_arm": {
                    "translate": [-6, 24, 0]
                },
                "left_leg": {
                    "translate": [2, 12, 0]
                },
                "right_leg": {
                    "translate": [-2, 12, 0]
                }
            }
        },
        /* Other poses are going to be merged from the default pose (i.e. standing) */
        "sneak": {
            "size": [1, 1.5, 1]
        },
        "elytra": {
            "size": [1, 1, 1],
        }
    },
    /** 
     * Array of model's limbs, these objects are containg the definition
     * of the limbs, the actual transformations are in the poses
     */
    "limbs": {
        "body": {
            /* Role of the limb (head, body, (left or right) arm, (left or right) leg, static) */
            "role": "body",
            /* Size of the limb in pixels */
            "size": [8, 12, 4],
            /* Texture mapping UV coordinates */
            "texture": [16, 16],
            /* Anchor of the limb (center of the limb, origin, rotation point) */
            "anchor": [0.5, 0.1, 0.5]
        },
        "head": {
            "role": "head",
            "size": [8, 8, 8],
            "texture": [0, 0],
            "anchor": [0.5, 1, 0.5]
        },
        "outer": {
            /* All transformations are going to be based relative to parent and anchor */
            "parent": "head",
            "role": "static",
            "size": [8, 8, 8],
            "texture": [32, 0],
            "anchor": [0.5, 1, 0.5]
        },
        "left_arm": {
            "role": "left_arm",
            "size": [4, 12, 4],
            "texture": [0, 16],
            "anchor": [0.5, 0.1, 0.5]
        },
        "right_arm": {
            "role": "right_arm",
            "size": [4, 12, 4],
            "texture": [0, 16],
            "anchor": [0.5, 0.1, 0.5]
        },
        "left_leg": {
            "role": "left_leg",
            "size": [4, 12, 4],
            "texture": [48, 16],
            "anchor": [0.5, 0, 0.5]
        },
        "right_leg": {
            "role": "right_leg",
            "size": [4, 12, 4],
            "texture": [40, 16],
            "anchor": [0.5, 0, 0.5]
        }
    }
}
```