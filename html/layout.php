<!doctype html>
<html lang="en">
	<head>
<?php require('partials/head.php') ?> 
    </head>
    
	<body>
<!-- Root element of the application -->
<div class="mc-me">
    <!-- Model editor component -->
    <div class="mc-component mc-model">
<?php require('partials/model.php') ?> 
    </div>
    
    <!-- Texture editor component -->
    <div class="mc-component mc-texture">
<?php require('partials/texture.php') ?> 
    </div>
    
    <!-- Hide button for model and texture editors -->
    <div class="mc-toolbar mc-toolbar-left mc-toolbar-bottom">
        <div class="mc-tool mc-hide-model" title="Hide Model Editor (H)">
            <i class="fa fa-eye-slash fa-fw"></i>
        </div>
        
        <div class="mc-tool mc-toggle-layout" title="Toggle layout">
            <i class="fa fa-arrows-v fa-fw"></i>
        </div>
    </div>
    
    <div class="mc-toolbar mc-toolbar-right mc-toolbar-bottom">
        <div class="mc-tool mc-show-help" title="Help">
            <i class="fa fa-question fa-fw"></i>
        </div>
        
        <div class="mc-tool mc-hide-texture" title="Hide Texture Editor (H)">
            <i class="fa fa-eye-slash fa-fw"></i>
        </div>
    </div>
    
    <!-- Help modal -->
    <div class="mc-help-wrapper hidden">
<?php require('partials/help.php') ?> 
    </div>
</div>

<script src="assets/components/three.js/build/three.min.js"></script>
<script src="assets/components/color.js/color.min.js"></script>
<script src="js/app.js"></script>
<script>
    /* Here goes the bootstrap code! */
    var root    = McME.dom.$(".mc-me"),
        texture = McME.dom.$(".mc-texture"),
        model   = McME.dom.$(".mc-model");
    
    var app = new McME.App(root, texture, model);
    
    app.init();
</script>
	</body>
</html>