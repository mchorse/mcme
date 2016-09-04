# JSON Model Scheme

```js
/**
 * JSON actor model scheme 
 * 
 * Not really sure about riding options, so I remove it for now. I'll think 
 * more about it, and how to implement it actually, and then I'll do something 
 * about it.
 *
 * About "role" key for limbs. I think it's going to be harder to implement 
 * actual properties of the role. For example, for "arm" role, it's planned that 
 * it's going to support arm swinging, swiping and holding items, but this role 
 * will apply limitations on the arm. For example, if user will create an arm with 
 * additional limb to create sense of elbow and two on the extended part to 
 * create sense of claws. Guess where holded item would stuck if the part "role" 
 * would be applied on the first limb? Right, near connection where the elbow is 
 * created.
 * 
 * That's why, probably, instead of role, there's supposed to be additional flags 
 * that will toggle swinging, swiping, holding items, etc. Like so:
 *
 * {
 *     "head": {"looking": true}, 
 *     "left_arm": {"swinging": true, "swiping": true, "hold": "left"}
 * }
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
            /* This limb going to look in direction where player looks */
            "looking": true,
            "size": [8, 8, 8],
            "texture": [0, 0],
            "anchor": [0.5, 1, 0.5]
        },
        "outer": {
            /* All transformations are going to be based relative to parent and anchor */
            "parent": "head",
            "size": [8, 8, 8],
            "texture": [32, 0],
            "anchor": [0.5, 1, 0.5]
        },
        "left_arm": {
            /* When player walks, this limb gonna swing */
            "swinging": true,
            /* When player left clicks, this limb gonna do swipe motion */
            "swiping": true,
            /* This limb gonna display an item which is selected in hot bar */
            "holding": "left",
            /* This limb is gonna move a little bit when idling */
            "idle": true,
            "size": [4, 12, 4],
            "texture": [0, 16],
            "anchor": [0.5, 0.1, 0.5],
            /* Mirror texture coordinates */
            "mirror": true
        },
        "right_arm": {
            "swinging": true,
            /* This limb gonna display an item which is in off hand */
            "holding": "right",
            "size": [4, 12, 4],
            "texture": [0, 16],
            "anchor": [0.5, 0.1, 0.5]
        },
        "left_leg": {
            "swinging": true,
            "size": [4, 12, 4],
            "texture": [48, 16],
            "anchor": [0.5, 0, 0.5],
            "mirror": true
        },
        "right_leg": {
            "swinging": true,
            "size": [4, 12, 4],
            "texture": [40, 16],
            "anchor": [0.5, 0, 0.5]
        }
    }
}
```