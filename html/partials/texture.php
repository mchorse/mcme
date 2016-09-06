<!-- Texture editor tool bar  -->
<div class="mc-toolbar mc-toolbar-left clear">
    <div class="mc-colors">
        <!-- I don't know what I'm doing here -->
        &nbsp;&nbsp;
        <div class="mc-color mc-color-fg" title="Color Picker (V) Swap Colors (X)">
            <div class="mc-color-overlay"></div>
        </div>
        <div class="mc-color mc-color-bg" title="Color Picker (V) Swap Colors (X)">
            <div class="mc-color-overlay"></div>
        </div>
        
        <!-- Texture editor color picker -->
        <div class="mc-box mc-color-picker hidden">
            <!-- Color picker's header -->
            <div class="mc-box-header clear">
                <div class="mc-color-label left">Color picker</div>
                <input class="mc-color-css right" type="text" placeholder="Any CSS color...">
            </div>
            
            <!-- Color picker's HSV bars -->
            <div class="mc-color-bar mc-hue-bar">
                <div class="mc-color-row clear">
                    <div class="mc-color-label left">Hue</div>
                    <input class="mc-color-value right" type="number">
                </div>
                
                <canvas class="mc-color-slider" width="240" height="26"></canvas>
            </div>
            
            <div class="mc-color-bar mc-saturation-bar">
                <div class="mc-color-row clear">
                    <div class="mc-color-label left">Saturation</div>
                    <input class="mc-color-value right" type="number">
                </div>
                
                <canvas class="mc-color-slider" width="240" height="26"></canvas>
            </div>
            
            <div class="mc-color-bar mc-lightness-bar">
                <div class="mc-color-row clear">
                    <div class="mc-color-label left">Lightness</div>
                    <input class="mc-color-value right" type="number">
                </div>
                
                <canvas class="mc-color-slider" width="240" height="26"></canvas>
            </div>
        </div>
    </div>
    
    <!-- Texture editor tools -->
    <div class="mc-tool" data-tool="pencil" title="Pencil (P)">
        <i class="fa fa-pencil fa-fw"></i>
    </div>
    
    <div class="mc-tool" data-tool="eraser" title="Eraser (E)">
        <i class="fa fa-eraser fa-fw"></i>
    </div>
    
    <div class="mc-tool" data-tool="picker" title="Picker (C)">
        <i class="fa fa-eyedropper fa-fw"></i>
    </div>
    
    <div class="mc-tool" data-tool="bucket" title="Bucket (B)">
        <i class="fa fa-shopping-basket fa-fw"></i>
    </div>
    
    <div class="mc-tool" data-tool="move" title="Move (M)">
        <i class="fa fa-hand-grab-o fa-fw"></i>
    </div>
    
    <div class="mc-tool" data-tool="zoom" title="Zoom (Z)">
        <i class="fa fa-search fa-fw"></i>
    </div>
</div>

<!-- Settings toolbar -->
<div class="mc-toolbar mc-toolbar-right">
    <div class="mc-tool mc-toggle-settings" title="Settings (S)">
        <i class="fa fa-cog fa-fw"></i>
    </div>
</div>

<!-- Texture editor settings -->
<div class="mc-settings hidden">
    <h2>Texture Settings</h2>
    
    <!-- Dimension settings -->
    <div class="mc-settings-section">
        <h3>Canvas Options</h3>
        
        <p>
            Size is
            <input name="size_w" placeholder="width" type="text"> by 
            <input name="size_h" placeholder="height" type="text"> pixels
        </p>
        
        <label>
            <input type="checkbox" name="grid"> Show grid
        </label>
        
        <label>
            <input type="checkbox" name="guides"> Show limb guides
        </label>
        
        <div class="mc-button-row">
            <button data-action="reset">Reset Canvas</button>
            <button class="mc-right-button" data-action="clear">Clear Canvas</button>
        </div>
    </div>
    
    <!-- Import or export the texture -->
    <div class="mc-settings-section">
        <h3>Skin Options</h3>
        
        <div class="mc-button-row">
            <button data-action="import">Import skin</button>
            <button class="mc-right-button" data-action="export">Export skin</button>
            
            <button class="mc-100-button" data-action="generate">Generate texture mapping</button>
        </div>
        
        <img class="mc-skin-export hidden" title="Right click -> Save As Image" alt="export">
        <input class="hidden mc-skin-input" type="file">
    </div>
</div>

<!-- Drawing canvas -->
<canvas id="texture"></canvas>