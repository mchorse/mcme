<!-- Model editor tool bar -->
<div class="mc-toolbar mc-toolbar-right clear">
    <div class="mc-tool mc-add-limb" title="Add Limb">
        <i class="fa fa-plus fa-fw"></i>
    </div>
    
    <div class="mc-tool mc-remove-limb separate-right" title="Remove Limb">
        <i class="fa fa-minus fa-fw"></i>
    </div>
    
    <div class="mc-tool" data-tool="move" title="Move (M)">
        <i class="fa fa-arrows-alt fa-fw"></i>
    </div>
    
    <div class="mc-tool" data-tool="picker" title="Select Limb (L)">
        <i class="fa fa-mouse-pointer fa-fw"></i>
    </div>
    
    <div class="mc-tool" data-tool="translate" title="Translate (T)">
        <i class="fa fa-arrows fa-fw"></i>
    </div>
    
    <div class="mc-tool" data-tool="rotate" title="Rotate (R)">
        <i class="fa fa-rotate-left fa-fw"></i>
    </div>
    
    <div class="mc-tool" data-tool="scale" title="Scale (S)">
        <i class="fa fa-expand fa-fw"></i>
    </div>
</div>

<!-- Settings toggle button -->
<div class="mc-toolbar mc-toolbar-left">
    <div class="mc-tool mc-toggle-settings" title="Settings (S)">
        <i class="fa fa-cog fa-fw"></i>
    </div>
</div>

<!-- Model editor settings -->
<div class="mc-settings mc-settings-right hidden">
    <h2>Model Settings</h2>
    
    <!-- General settings section -->
    <div class="mc-settings-section" data-section="general">
        <h3>General</h3>
        
        <p class="clear">
            Model's name
            <input class="mc-longer-input right" name="name" type="text">
        </p>
        
        <p class="clear">
            Select a limb
            <select class="mc-limbs right" name="limb"></select>
        </p>
        
        <div class="mc-button-row">
            <button data-action="import">Import Model</button>
            <button class="mc-right-button" data-action="export">Export Model</button>
        </div>
        
        <input class="hidden mc-model-input" type="file">
    </div>
    
    <!-- Rendering settings -->
    <div class="mc-settings-section" data-section="render">
        <h3>Rendering</h3>
        
        <label class="clear">
            Show AABB
            <input class="right" name="aabb" type="checkbox">
        </label>
        
        <label class="clear">
            Orthographic
            <input class="right" name="flat" type="checkbox">
        </label>
        
        <label class="clear">
            Shadows
            <input class="right" name="shadow" type="checkbox">
        </label>
        
        <label class="clear">
            HD shadows
            <input class="right" name="hd" type="checkbox">
        </label>
        
        <label class="clear">
            Lighting
            <input class="right" name="lighting" type="checkbox">
        </label>
        
        <div class="mc-button-row">
            <button data-action="render">Render</button>
            <button class="mc-right-button" data-action="reset">Reset camera</button>
        </div>
    </div>
    
    <!-- Limb Properties -->
    <div class="mc-settings-section mc-limb">
        <h3>Limb Properties</h3>
        
        <label>
            Limb's name
            <input name="id" class="mc-limb-id mc-longer-input right" type="text" placeholder="limb's name">
        </label>
        
        <hr>
        
        <!-- Gameplay affecting properties -->
        <label class="clear">
            Looking <input class="right" name="looking" type="checkbox">
        </label>
        
        <p class="clear">
            Holding items
            
            <select class="right" name="holding">
                <option value="">None</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
            </select>
        </p>
        
        <label class="clear">
            Swinging <input class="right" name="swinging" type="checkbox">
        </label>
        
        <label class="clear">
            Swiping <input class="right" name="swiping" type="checkbox">
        </label>
        
        <label class="clear">
            Idle <input class="right" name="idle" type="checkbox">
        </label>
        
        <hr>
        
        <!-- Visual properties -->
        <p class="clear">
            Parent 
            
            <select class="right" name="parent"></select>
        </p>
        
        <!-- Texture settings -->
        <div class="mc-settings-row clear">
            Texture Offset
                
            <div class="mc-dual-input right">
                <input name="texture_x" placeholder="X" type="text"> and
                <input name="texture_y" placeholder="Y" type="text">
            </div>
        </div>
        
        <label class="clear">
            Mirrored <input class="right" name="mirror" type="checkbox">
        </label>
        
        <!-- Size and Anchor -->
        <div class="mc-settings-row clear">
            Size
            
            <div class="mc-dual-input right">
                <input name="size_w" placeholder="W" type="text"> by
                <input name="size_h" placeholder="H" type="text"> by
                <input name="size_d" placeholder="D" type="text">
            </div>
        </div>
        
        <div class="mc-settings-row clear">
            Anchor
            
            <div class="mc-dual-input right">
                <input name="anchor_x" placeholder="X" type="text"> by
                <input name="anchor_y" placeholder="Y" type="text"> by
                <input name="anchor_z" placeholder="Z" type="text">
            </div>
        </div>
    </div>
    
    <!-- Pose manager -->
    <div class="mc-settings-section mc-poses">
        <h3>Poses</h3>
        
        <p class="clear">
            Current pose <select class="mc-pose right">
                <option value="standing">Standing</option>
                <option value="sneaking">Sneaking</option>
                <option value="sleeping">Sleeping</option>
                <option value="flying">Flying</option>
            </select>
        </p>
        
        <!-- General -->
        <div class="mc-settings-row clear">
            Size
                
            <div class="mc-dual-input right">
                <input name="size_w" placeholder="W" type="text"> by
                <input name="size_h" placeholder="H" type="text"> by
                <input name="size_d" placeholder="D" type="text">
            </div>
        </div>
            
        <!-- Transformations for current limb -->
        <div class="mc-settings-row clear">
            Translate
            
            <div class="mc-dual-input right">
                <input name="translate_x" placeholder="X" type="text"> by
                <input name="translate_y" placeholder="Y" type="text"> by
                <input name="translate_z" placeholder="Z" type="text">
            </div>
        </div>
        
        <div class="mc-settings-row clear">
            Scale
            
            <div class="mc-dual-input right">
                <input name="scale_x" placeholder="X" type="text"> by
                <input name="scale_y" placeholder="Y" type="text"> by
                <input name="scale_z" placeholder="Z" type="text">
            </div>
        </div>
        
        <div class="mc-settings-row clear">
            Rotate
            
            <div class="mc-dual-input right">
                <input name="rotate_x" placeholder="X" type="text"> by
                <input name="rotate_y" placeholder="Y" type="text"> by
                <input name="rotate_z" placeholder="Z" type="text">
            </div>
        </div>
    </div>
</div>