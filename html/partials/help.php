<div class="mc-help clear">
    <div class="mc-help-section">
        <h1>Model Editor</h1>
        
        <p>
            Model editor is a view in McME that allows you manipulating 
            custom models. You can add limbs, edit their transformations, 
            properties and also remove them (and their child limbs).
        </p>
        
        <p>
            With model editor you can also render your models to PNG image 
            and save for usage in YouTube thumbnail, forum avatar or 
            whatever you feel like creating.
        </p>
        
        <h2>Tools</h2>
        
        <p>
            Texture editor provides some basic tools for drawing a texture 
            for model.
        </p>
        
        <ul>
            <li>
                <i class="fa fa-arrows-alt fa-fw"></i> Move <kbd>M</kbd> &mdash; 
                move the model. Without modifiers, this tool 
                spins the model along X and Y axes. With <kbd>Shift</kbd> 
                modifier, it spins the model along X and Z axes. With 
                <kbd>Alt</kbd> modifier, it moves (translates) the model 
                along X and Y axes (i.e. horizontally and vertically).
            </li>
            
            <li>
                <i class="fa fa-mouse-pointer fa-fw"></i> Select Limb <kbd>L</kbd> &mdash; 
                selects a limb that you've clicked on for further manipulation
                (see settings and other tools below).
            </li>
            
            <li>
                <i class="fa fa-arrows fa-fw"></i> Translate <kbd>T</kbd> &mdash; 
                translates selected limb along X and Y axes. With <kbd>Shift</kbd> 
                modifier, it will translate the limb along X and Z axes.
            </li>
            
            <li>
                <i class="fa fa-rotate-left fa-fw"></i> Rotate <kbd>R</kbd> &mdash; 
                rotates selected limb along X and Z axes. With <kbd>Shift</kbd> 
                modifier, it will rotate the limb along Y and X axes.
            </li>
            
            <li>
                <i class="fa fa-expand fa-fw"></i> Scale <kbd>S</kbd> &mdash; 
                scales selected limb.
            </li>
        </ul>
        
        <p>
            There's also two buttons near the tool bar which allows you to 
            add a limb or remove selected limb.
        </p>
        
        <h2>Key Bindings</h2>
        
        <p>
            Here are listed all, beside tool key bindings, key bindings 
            which available in the model editor. Those key bindings are 
            working only when the model editor is focused.
        </p>
        
        <ul>
            <li>
                <kbd>O</kbd> &mdash; Toggle camera (see orthographic camera 
                setting).
            </li>
            
            <li>
                <kbd>D</kbd> &mdash; Deselect current selected limb.
            </li>
            
            <li>
                <kbd>S</kbd> &mdash; Show or hide settings.
            </li>
            
            <li>
                <kbd>H</kbd> &mdash; Hide the model editor.
            </li>
        </ul>
        
        <h2>Settings</h2>
        
        <p>
            There are so much settings in the settings sidebar. Let me 
            cover all of them.
        </p>
        
        <h3>General</h3>
        
        <p>
            <b>General</b> section has really general options related to the 
            model. The value in <i>Model's name</i> will be displayed in 
            Blockbuster's actor GUI when switching between different models. 
            <i>Select a limb</i> will select a limb in the list, this is very 
            helpful for selecting limbs that are covered by overlay layers. 
        </p>
        
        <p>
            Import and export buttons allows you to import and export JSON 
            models.
        </p>
        
        <h3>Rendering</h3>
        
        <p>
            <b>Rendering</b> section isn't affect the model's propeties, 
            only the visuals. Those options that available in this section 
            are only helpful while editing or for rendering of your model.
        </p>
        
        <p>
            When <i>Show AABB</i> is checked, you'll see red box around the model. 
            Keep close attention to bottom and top parts of the model. If 
            your model is out of the hit box vertically, its legs or head 
            may overlap with blocks which may look undesired. So keep your 
            model in the red box (see also <b>Poses</b> section and its <i>Size</i>
            field).
        </p>
        
        <p>
            <i>Orthographic camera</i> check box is responsible for making model 
            look flat. This option can be used for rendering or for better 
            precision when placing limbs inside of AABB.
        </p>
        
        <p>
            <i>Shadows</i>, <i>HD shadows</i> and <i>Lighting</i> checkboxes are visual 
            options. They're only might be helpful for rendering. They're 
            also self explanatory. 
        </p>
        
        <p>
            <i>Reset camera</i> button will reset the position and rotation 
            of the model which you modified with Move tool.
        </p>
        
        <h3>Limb Properties</h3>
        
        <p>
            There's basically three sub sections in <b>Limb Properties</b> 
            section. <b>Limb's name</b>, <b>Gameplay Properties</b> and 
            <b>Visual Properties</b>.
        </p>
        
        <p>
            <b>Limb's name</b> is pretty straight forward field, it's id 
            for a limb.
        </p>
        
        <p>
            <b>Gameplay Properties</b> are goes after <i>Limb's name</i> 
            field. They're not seen visually in model editor, but will affect 
            visuals in the game very drastically.
        </p>
        
        <p>
            <i>Looking</i> check box will make limb face towards direction 
            in which player looks. So it's basically for head (or several 
            heads, if you're doing an Ogre or Cerberus).
        </p>
        
        <p>
            <i>Holding items</i> options will display an item on the opposite 
            end of anchor (if anchor is in the middle, then the item will be 
            in the anchor). You can specify this option for several limbs, 
            so characters like Goro or General Grievous would look really 
            cool with two set of diamond swords.
        </p>
        
        <p>
            <i>Swinging</i> check box will basically make limb swing when 
            character is running.
        </p>
        
        <p>
            <i>Swiping</i> check box will make limb make swipe motion when 
            player will press attack key binding (or mouse button).
        </p>
        
        <p>
            <b>Visual Properties</b> are affecting how limb looks. Most of 
            these properties are related to size, rotation point, 
            transformation origin, texture offset, and etc.
        </p>
        
        <p>
            <i>Parent</i> option will attach selected limb to another limb 
            and all transformations will be relative to limb's 
            transformations and it's anchor.
        </p>
        
        <p>
            <i>Texture offset</i> is responsible for texture mapping, it 
            will specify coordinates to which texture faces will be mapped. 
            See also the <i>Size</i> field, because it's also affecting 
            texture mapping.
        </p>
        
        <p>
            <i>Mirror</i> field is responsible for reflecting texture coordinates 
            along X axis. Basically it reflects the texture mapping horizontally 
            (if you're looking from front).
        </p>
        
        <p>
            <i>Size</i> field is responsible for two things: the size of the 
            limb (it's volume) and size for faces' texture mapping. Use 
            option <i>Show limb guides</i> to see how texture would be 
            mapped on limb in texture editor.
        </p>
        
        <p>
            <i>Anchor</i> field is responsible for how transformations for 
            rotation and scale are being applied. The values of every 
            compoment should range between <kbd>0</kbd> and <kbd>1</kbd>. 
            <kbd>0.5</kbd> is the middle of the limb. 
        </p>
        
        <h3>Poses</h3>
        
        <p>
            <b>Poses</b> section is responsible for managing the 
            limb transformations for every pose. Examples of poses are 
            standing, sneaking (when you press shift), sleeping in bed 
            or flying an elytra. In future, there will probably be more 
            different poses, or a function to create custom poses.
        </p>
        
        <p>
            With <i>Current pose</i> field, you can select which pose to 
            are you going to edit.
        </p>
        
        <p>
            <i>Size</i> field is responsible for setting AABB (hitbox) of 
            the entity during this pose. Use <b>Rendering</b> option called 
            <i>Show AABB</i> to see how the <i>Size</i> field affects the AABB.
        </p>
        
        <p>
            <i>Translate</i>, <i>Scale</i> and <i>Rotate</i> fields are 
            pretty self explanatory, so there's no need to explain them. 
            The only thing to note that all transformations regarding those 
            fields are being relative to <i>Anchor</i> and limb's <i>Parent</i>.
        </p>
    </div>
    
    <div class="mc-help-section mc-help-section-right">
        <h1>Texture Editor</h1>
        
        <p>
            Texture editor is a view in McME which allows you manipulating 
            the pixels in the texture. Texture editor supports range of 
            different functions. It's suitable for <i>pixeling</i> your skins.
        </p>
        
        <p>
            If you want to create really smooth (blurred) skins or use 
            external software for creating skins for your model, you would 
            use the <i>Generate texture mapping</i> to create basic mapping 
            of the limbs in texture and edit generated texture in your 
            favorite editor.
        </p>
        
        <h2>Color Picker</h2>
        
        <p>
            Color picker is a widget for picking a color. It's located in 
            top-left corner of texture editor which indicated by two colored 
            squares. It's hidden by default, to open it you either click 
            on one of the color squares or press <kbd>V</kbd> when your 
            mouse cursor inside of texture editor (texture editor is focused).
        </p>
        
        <p>
            With color picker, you can select primary color in HSL format. 
            There's also a function to select color in CSS format. Simply 
            type any CSS color in text field on the right from color picker's 
            title.
        </p>
          
        <p>
            It stores two colors, <i>primary</i> color is for current tool 
            usage (pencil, bucket), and <i>secondary</i> color is stored for 
            being easily to swap. To swap <i>primary</i> color with 
            <i>secondary</i>, press <kbd>X</kbd> when texture editor is focused.
        </p>
        
        <h2>Tools</h2>
        
        <p>
            Texture editor provides some basic tools for drawing a texture 
            for model.
        </p>
        
        <ul>
            <li>
                <i class="fa fa-pencil fa-fw"></i> Pencil <kbd>P</kbd> &mdash; 
                draw pixels on canvas with <i>primary</i> color from color 
                picker.
            </li>
            
            <li>
                <i class="fa fa-eraser fa-fw"></i> Eraser <kbd>E</kbd> &mdash; 
                erase drawn pixels on canvas.
            </li>
            
            <li>
                <i class="fa fa-eyedropper fa-fw"></i> Picker <kbd>C</kbd> &mdash; a 
                pick a color on canvas to be used for <i>primary</i> color 
                in color picker.
            </li>
            
            <li>
                <i class="fa fa-shopping-basket fa-fw"></i> Bucket <kbd>B</kbd> &mdash; 
                fill a single area of same colored pixels with <i>primary</i> 
                color from color picker.
            </li>
            
            <li>
                <i class="fa fa-hand-grab-o fa-fw"></i> Move <kbd>M</kbd> &mdash; 
                move canvas in the texture editor for better view of texture. 
            </li>
            
            <li>
                <i class="fa fa-search fa-fw"></i> Zoom <kbd>Z</kbd> &mdash;
                zoom in and out the canvas.
            </li>
        </ul>
        
        <h2>Key Bindings</h2>
        
        <p>
            Here are listed all, beside tool key bindings, key bindings 
            which available in the texture editor. Those key bindings are 
            working only when the texture editor is focused.
        </p>
        
        <ul>
            <li>
                <kbd>V</kbd> &mdash; Open the color picker.
            </li>
            
            <li>
                <kbd>X</kbd> &mdash; Swap <i>primary</i> color with <i>secondary</i> color.
            </li>
            
            <li>
                <kbd>S</kbd> &mdash; Show or hide settings.
            </li>
            
            <li>
                <kbd>H</kbd> &mdash; Hide the texture editor.
            </li>
        </ul>
        
        <h2>Settings</h2>
        
        <p>
            There are few options in settings that available in texture 
            editor.
        </p>
        
        <h3>Canvas Options</h3>
        
        <p>
            <b>Canvas Options</b> section contains settings are about canvas. 
            With settings in this section you can change the size of 
            texture, toggle 4x4 grid, toggle selected limb guides, reset 
            and clear canvas.
        </p>
        
        <p>
            Limb guides are special guides which shows you the region of 
            texture which is mapped to selected limb.
        </p>
        
        <p>
            Reset canvas is basically reset the position and zoom of canvas 
            to default. On the other hand, clear canvas will remove all 
            pixels from (it will clear the canvas) canvas.
        </p>
        
        <h3>Skin Options</h3>
        
        <p>
            There's also <b>Skin Options</b> section. This section is about 
            importing and exporting the texture (skin) of your model.  
        </p>
        
        <p>
            In this section there's also a button for generating texture 
            colored mapping for every limb. This is useful when you want 
            to avoid texture editor, and edit your texture in external 
            program like <i>PhotoShop</i> or <i>GIMP</i>. Just click the 
            button, export the texture, and use generated texture as a 
            reference for for created model.
        </p>
    </div>
</div>

<div class="mc-credits">
    Hosted on <a href="https://github.com/mchorse/mcme" target="_blank">GitHub</a>. 
    My <a href="https://www.youtube.com/channel/UCWVDjAcecHHa8UrEWMRGI8w" target="_blank">channel</a>. 
    Tested by <a href="https://www.youtube.com/user/Heilerable" target="_blank">NlL5</a>. 
    Updates on <a href="http://twitter.com/McHorsy" target="_blank">Twitter</a>.
    <!-- Sorry if it looks like shit, but I'm not a designer -->
</div>