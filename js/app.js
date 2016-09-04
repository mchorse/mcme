!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t()
else if("function"==typeof define&&define.amd)define([],t)
else{var i
i="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,i.McME=t()}}(function(){return function t(i,e,s){function o(r,a){if(!e[r]){if(!i[r]){var h="function"==typeof require&&require
if(!a&&h)return h(r,!0)
if(n)return n(r,!0)
var l=new Error("Cannot find module '"+r+"'")
throw l.code="MODULE_NOT_FOUND",l}var c=e[r]={exports:{}}
i[r][0].call(c.exports,function(t){var e=i[r][1][t]
return o(e?e:t)},c,c.exports,t,i,e,s)}return e[r].exports}for(var n="function"==typeof require&&require,r=0;r<s.length;r++)o(s[r])
return o}({1:[function(t,i,e){var s=t("./dom"),o=t("./texture/editor"),n=t("./model/editor"),r=t("./texture/pixel-data"),a=t("./model/3d/model"),h=i.exports=function(t,i,e){this.element=t,this.skin=new r(64,32),this.actor=new a(this.skin),this.key=null,this.clicking=!1,this.x=this.y=0,this.texture=new o(this,i),this.model=new n(this,e),this.current=this.texture}
h.prototype={init:function(){var t=this
this.model.init(),this.texture.init(),s.on(document,"keyup",this.onKey.bind(this)),s.on(document,"keydown",this.onKeyDown.bind(this)),s.on(document,"mousedown",this.onMouseDown.bind(this)),s.on(document,"mousemove",this.onMouseMove.bind(this)),s.on(document,"mouseup",this.onMouseUp.bind(this)),s.on(document,"wheel",this.onWheel.bind(this)),s.on(s.$(".mc-hide-texture",this.element),"click",function(){t.hide(t.texture,t.model)}),s.on(s.$(".mc-hide-model",this.element),"click",function(){t.hide(t.model,t.texture)}),s.on(s.$(".mc-show-help",this.element),"click",function(){var i=s.$(".mc-help-wrapper",t.element).classList
i.toggle("hidden"),this.classList.toggle("mc-tool-selected",!i.contains("hidden"))}),s.on(s.$(".mc-toggle-layout",this.element),"click",function(){var i=t.element.classList
i.toggle("mc-vertical"),this.classList.toggle("mc-tool-selected",i.contains("mc-vertical")),t.model.resize()})},onKey:function(t){document.activeElement==document.body&&(this.key=null,this.current.onKey(t))},onKeyDown:function(t){this.key=t},onMouseMove:function(t){var i=t.pageX,e=t.pageY
this.x=i,this.y=e,this.current=this.texture.inBound(i,e)?this.texture:this.model,this.clicking&&this.current.onMouseMove(i,e,t)},onMouseDown:function(t){this.onMouseMove(t),this.clicking=!0,this.current.onMouseDown(this.x,this.y,t)},onMouseUp:function(t){this.clicking=!1,this.onMouseMove(t)},onWheel:function(t){s.hasParent(t.target,"mc-settings",3)||s.hasParent(t.target,"mc-help-section",3)||(t.preventDefault(),this.current.onWheel(t))},hide:function(t,i){var e=i.element.classList,s=t.element.classList,o=e.contains("hidden"),n=s.contains("hidden")
o||n?!o&&n?(e.remove("mc-full"),s.remove("hidden")):o&&!n&&(s.add("hidden"),s.remove("mc-full"),e.add("mc-full"),e.remove("hidden")):(e.add("mc-full"),s.add("hidden")),this.model.resize()}}},{"./dom":2,"./model/3d/model":6,"./model/editor":13,"./texture/editor":27,"./texture/pixel-data":29}],2:[function(t,i,e){i.exports={$:function(t,i){return(i||document).querySelector(t)},$$:function(t,i){return Array.prototype.slice.call((i||document).querySelectorAll(t))},on:function(t,i,e){t.addEventListener(i,e)},hasParent:function(t,i,e){for(;e-- >=0;){if(t.classList.contains(i))return!0
t=t.parentNode}return!1}}},{}],3:[function(t,i,e){var s=t("./dom"),o=(t("./utils"),t("./toolbar")),n=i.exports=function(t,i){this.app=t,this.element=i,this.toolbar=new o(this,s.$(".mc-toolbar",i))}
n.prototype={init:function(){this.toolbar.init()},inBound:function(t,i){var e=this.element
return t>=e.offsetLeft&&t<e.offsetLeft+e.offsetWidth&&i>=e.offsetTop&&i<e.offsetTop+e.offsetHeight},onKey:function(){},onMouseMove:function(t,i){this.toolbar.onMouseMove(t,i)},onMouseDown:function(t,i){this.toolbar.onMouseDown(t,i)},onWheel:function(t){},notifySettings:function(t){}}},{"./dom":2,"./toolbar":38,"./utils":39}],4:[function(t,i,e){Math.clamp=function(t,i,e){return t<i?i:t>e?e:t},i.exports={App:t("./app"),dom:t("./dom")}},{"./app":1,"./dom":2}],5:[function(t,i,e){var s=(t("./uv"),t("../../utils")),o=0,n=["parent","holding","swiping","looking","swinging","idle","texture","size","anchor","mirror"],r=i.exports=function(){this.id="limb_"+o++,this.parent="",this.size=[4,4,4],this.texture=[0,0],this.anchor=[.5,.5,.5],this.mirror=!1,this.holding="",this.swiping=!1,this.looking=!1,this.swinging=!1,this.idle=!1}
r.prototype={exportLimb:function(){var t=s.extract(this,n)
return t.parent||delete t.parent,t.holding||delete t.holding,t.swiping||delete t.swiping,t.looking||delete t.looking,t.swinging||delete t.swinging,t.idle||delete t.idle,t.mirror||delete t.mirror,t},importLimb:function(t){s.merge(this,t)}}},{"../../utils":39,"./uv":10}],6:[function(t,i,e){var s=t("./poses"),o=t("./limb"),n=i.exports=function(){this.name="",this.limbs=[],this.poses=new s}
n.prototype={add:function(t){var i=new o
return this.limbs.push(i),this.poses.formLimb(i),i.parent=t?t.id:"",i},remove:function(t){var i=this.limbs.indexOf(t),e=this
return i!=-1&&(this.limbs.forEach(function(i){i.parent==t.id&&e.remove(i)}),this.limbs.splice(i,1),this.poses.removeLimb(t.id)),i!=-1},get:function(t){for(var i=0,e=this.limbs.length;i<e;i++)if(this.limbs[i].id==t)return this.limbs[i]},hasLimb:function(t){return null!=this.get(t)},exportModel:function(){for(var t={scheme:"1.3",name:this.name,poses:this.poses.exportPoses(),limbs:{}},i=0,e=this.limbs.length;i<e;i++){var s=this.limbs[i]
t.limbs[s.id]=s.exportLimb()}return t},exportJSON:function(){return JSON.stringify(this.exportModel(),null,4)},importModel:function(t){this.limbs.length=0,this.name=t.name,this.poses.importPoses(t.poses)
for(var i in t.limbs){var e=new o
e.importLimb(t.limbs[i]),e.id=i,this.limbs.push(e)}this.poses.form(this)},importJSON:function(t){this.importModel(JSON.parse(t))}}},{"./limb":5,"./poses":8}],7:[function(t,i,e){var s=t("./transform"),o=i.exports=function(){this.size=[1,1,1],this.limbs={}}
o.prototype={form:function(t){t.limbs.forEach(this.formLimb.bind(this))},formLimb:function(t){this.limbs[t.id]||(this.limbs[t.id]=new s)},forLimb:function(t){return this.limbs[t]},rename:function(t,i){this.limbs[i]=this.limbs[t],delete this.limbs[t]},removeLimb:function(t){this.limbs[t]&&delete this.limbs[t]},exportPose:function(){var t={size:this.size,limbs:{}}
for(var i in this.limbs){var e=this.limbs[i].exportTransform()
Object.keys(e).length&&(t.limbs[i]=e)}return t},importPose:function(t){this.size=t.size,this.limbs={}
for(var i in t.limbs){var e=new s
e.importTransform(t.limbs[i]),this.limbs[i]=e}}}},{"./transform":9}],8:[function(t,i,e){var s=t("./pose"),o=i.exports=function(){this.poses={}}
o.prototype={form:function(t){for(var i in this.poses)this.poses[i].form(t)},formLimb:function(t){for(var i in this.poses)this.poses[i].formLimb(t)},getPoseForLimb:function(t,i){return this.poses[i].forLimb(t)},get:function(t){return this.poses[t]},rename:function(t,i){for(var e in this.poses)this.poses[e].rename(t,i)},removeLimb:function(t){for(var i in this.poses)this.poses[i].removeLimb(t)},exportPoses:function(){var t={}
for(var i in this.poses)t[i]=this.poses[i].exportPose()
return t},importPoses:function(t){this.poses={}
for(var i in t){var e=new s
e.importPose(t[i]),this.poses[i]=e}}}},{"./pose":7}],9:[function(t,i,e){function s(t,i){i="undefined"==typeof i?0:i
for(var e=!0,s=0;s<t.length;s++)e=e&&t[s]===i
return e}var o=t("../../utils"),n=i.exports=function(){this.translate=[0,0,0],this.scale=[1,1,1],this.rotate=[0,0,0]}
n.prototype={exportTransform:function(){var t={}
return s(this.translate,0)||(t.translate=this.translate.slice()),s(this.scale,1)||(t.scale=this.scale.slice()),s(this.rotate,0)||(t.rotate=this.rotate.slice()),t},importTransform:function(t){o.merge(this,t)}}},{"../../utils":39}],10:[function(t,i,e){var s=i.exports={vec:function(t,i,e,s){return new THREE.Vector2(t/e,i/s)},side:function(t,i,e,o,n,r,a,h,l){o=2*o
var c,d,u=[s.vec(n,r+h,t,i),s.vec(n+a,r+h,t,i),s.vec(n+a,r,t,i),s.vec(n,r,t,i)],p=e.faceVertexUvs[0][o],m=e.faceVertexUvs[0][o+1]
6!=o?(c=l?[1,2,0]:[0,3,1],d=l?[2,3,0]:[3,2,1]):(c=l?[2,1,3]:[3,0,2],d=l?[1,0,3]:[0,1,2])
for(var f=0;f<3;f++)p[f].copy(u[c[f]]),m[f].copy(u[d[f]])
e.uvsNeedUpdate=!0},cube:function(t,i,e,o,n,r,a,h,l){s.side(t,i,e,4,o+h,n,r,a,l),s.side(t,i,e,5,o+h+r+h,n,r,a,l),l?(s.side(t,i,e,0,o,n,h,a,l),s.side(t,i,e,1,o+h+r,n,h,a,l)):(s.side(t,i,e,0,o+h+r,n,h,a),s.side(t,i,e,1,o,n,h,a)),s.side(t,i,e,2,o+h,n+a,r,h,l),s.side(t,i,e,3,o+h+r,n+a,r,h,l)}}},{}],11:[function(t,i,e){var s=i.exports=function(t,i,e,s,o,n,r){this.fov=e
var a=t/128,h=i/128
this.width=t,this.height=i,this.ortho=new THREE.OrthographicCamera((-a),a,h,(-h),n,r),this.ortho.position.z=10,this.perspec=new THREE.PerspectiveCamera(e,t/i,s,o),this.perspec.position.z=8,this.toPerspec()}
s.prototype={toOrtho:function(){this.camera=this.ortho},toPerspec:function(){this.camera=this.perspec},toggle:function(t){"undefined"!=typeof t?t?this.toPerspec():this.toOrtho():this.camera==this.ortho?this.toPerspec():this.toOrtho()},dolly:function(t){this.perspec.position.z=this.perspec.position.z+t,this.perspec.position.z=Math.clamp(this.perspec.position.z,2,20)
var i=30*(20-this.perspec.position.z+2),e=this.width/i,s=this.height/i
this.ortho.left=-e,this.ortho.right=e,this.ortho.top=s,this.ortho.bottom=-s,this.ortho.updateProjectionMatrix()},resize:function(t,i){this.width=t,this.height=i
var e=t/128,s=i/128
this.perspec.aspect=t/i,this.ortho.left=-e,this.ortho.right=e,this.ortho.top=s,this.ortho.bottom=-s,this.perspec.updateProjectionMatrix(),this.ortho.updateProjectionMatrix()}}},{}],12:[function(t,i,e){i.exports={scheme:"1.3",name:"Steve",texture:[64,32],poses:{standing:{size:[1,2,1],limbs:{head:{translate:[0,24,0],rotate:[0,0,0]},outer:{translate:[0,4,0],scale:[1.1,1.1,1.1]},body:{translate:[0,24,0]},left_arm:{translate:[6,24,0]},right_arm:{translate:[-6,24,0]},left_leg:{translate:[2,12,0]},right_leg:{translate:[-2,12,0]}}},sneaking:{size:[1,1.5,1]},sleeping:{size:[1,1,2]},flying:{size:[1,1,1]}},limbs:{body:{size:[8,12,4],texture:[16,16],anchor:[.5,0,.5]},head:{size:[8,8,8],texture:[0,0],anchor:[.5,1,.5],looking:!0},outer:{parent:"head",size:[8,8,8],texture:[32,0],anchor:[.5,.5,.5]},left_arm:{size:[4,12,4],texture:[40,16],anchor:[.5,0,.5],mirror:!0,holding:"left",swiping:!0,swinging:!0},right_arm:{size:[4,12,4],texture:[40,16],anchor:[.5,0,.5],holding:"right",swinging:!0},left_leg:{size:[4,12,4],texture:[0,16],anchor:[.5,0,.5],mirror:!0,swinging:!0},right_leg:{size:[4,12,4],texture:[0,16],anchor:[.5,0,.5],swinging:!0}}}},{}],13:[function(t,i,e){var s=t("../dom"),o=t("../utils"),n=t("../editor"),r=t("./settings"),a=t("./tools"),h=t("./camera"),l=t("./model"),c={67:"scale",76:"picker",77:"move",82:"rotate",84:"translate"},d=i.exports=function(t,i){n.call(this,t,i),this.limb=null,this.actor=t.actor,this.model=new l(t.actor,t.skin),this.settings=new r(this,s.$(".mc-settings",i)),this.toolbar.map={picker:new a.Picker(this),move:new a.Move(this),translate:new a.Translate(this),rotate:new a.Rotate(this),scale:new a.Scale(this)},this.toolbar.set("move")}
o.extend(d,n,{init:function(){var i=this
n.prototype.init.call(this),this.actor.importModel(t("./default.json")),this.model.build(),this.model.applyPose("standing"),this.settings.init(),s.on(window,"resize",this.resize.bind(this)),s.on(s.$(".mc-toggle-settings",this.element),"click",function(){i.settings.toggle()}),s.on(s.$(".mc-add-limb",this.element),"click",this.addLimb.bind(this)),s.on(s.$(".mc-remove-limb",this.element),"click",this.removeLimb.bind(this)),setInterval(this.update.bind(this),1e3),this.setupThree(),this.scene.add(this.model.group),this.render()},setupThree:function(){var t=this.element.offsetWidth,i=this.element.offsetHeight,e=new h(t,i,50,.1,1e3,(-1e3),1e3),s=new THREE.Scene,o=new THREE.WebGLRenderer({preserveDrawingBuffer:!0,alpha:!0})
o.setClearColor(16777215,0),o.setSize(t,i),o.domElement.id="model",o.shadowMap.enabled=!0,o.shadowMap.type=THREE.PCFSoftShadowMap,this.setupLighting(s),this.element.appendChild(o.domElement),this.canvas=o.domElement,this.renderer=o,this.scene=s,this.camera=e},setupLighting:function(t){var i=new THREE.PointLight(16777215,1.3,20,.7)
i.position.set(0,10,8),i.castShadow=!0,t.add(i),t.add(new THREE.AmbientLight(7829367)),this.light=i},onKey:function(t){var i=t.keyCode
c[i]&&this.toolbar.set(c[t.keyCode]),83==i&&this.settings.toggle(),79==i&&(this.camera.toggle(),this.settings.settings.flat=this.camera.camera==this.camera.ortho,this.settings.update(),this.render()),72==i&&this.app.hide(this,this.app.texture),68==i&&this.setLimb(null)},onMouseMove:function(t,i,e){e.target!=this.element&&e.target!=this.canvas||this.toolbar.onMouseMove(t,i)},onMouseDown:function(t,i,e){e.target!=this.element&&e.target!=this.canvas||this.toolbar.onMouseDown(t,i)},onWheel:function(t){t.target!=this.element&&t.target!=this.canvas||(this.camera.dolly(t.deltaY/20),this.render())},resize:function(){var t=this.element.offsetWidth,i=this.element.offsetHeight
this.renderer.setSize(t,i),this.camera.resize(t,i),this.render()},update:function(){this.model.updateTexture(),this.render()},render:function(){this.renderer.render(this.scene,this.camera.camera)},addLimb:function(){var t=this.model.add(this.limb)
this.settings.updateLimbs(),this.setLimb(t),this.render()},removeLimb:function(){this.limb&&this.model.remove(this.limb)&&(this.limb=null,this.render(),this.settings.fill(),this.settings.updateLimbs())},setLimb:function(t){this.limb&&(this.limb.material=this.model.material),this.limb=t,this.limb&&(this.limb.material=this.model.selectedMaterial),this.app.texture.render(),this.settings.fill(),this.render()}})},{"../dom":2,"../editor":3,"../utils":39,"./camera":11,"./default.json":12,"./model":14,"./settings":17,"./tools":18}],14:[function(t,i,e){var s=(t("./3d/poses"),t("./3d/limb"),t("./3d/uv")),o=document.createElement("canvas"),n={side:THREE.DoubleSide,alphaTest:.5},r={side:THREE.DoubleSide,transparent:!0,opacity:.65,alphaTest:.5},a=i.exports=function(t,i){this.model=t,this.data=i
var e=new THREE.Texture(o)
e.minFilter=e.magFilter=THREE.NearestFilter,n.map=r.map=e,this.group=new THREE.Object3D,this.limbs=[],this.lightMaterial=new THREE.MeshLambertMaterial(n),this.lightSelectedMaterial=new THREE.MeshLambertMaterial(r),this.flatMaterial=new THREE.MeshBasicMaterial(n),this.flatSelectedMaterial=new THREE.MeshBasicMaterial(r),this.material=this.lightMaterial,this.selectedMaterial=this.lightSelectedMaterial,this.aabb=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial({wireframe:!0,color:16711680})),this.aabb.visible=!1,this.group.add(this.aabb)}
a.prototype={add:function(t){var i=this.model.add(t),e=this.buildLimb(i)
return this.mapUV(e),(t?t:this.group).add(i.mesh),this.limbs.push(e),e},get:function(t){for(var i=0,e=this.limbs.length;i<e;i++)if(this.limbs[i].limb.id==t)return this.limbs[i]},remove:function(t){var i=this.limbs.indexOf(t),e=this
return i!=-1&&(this.limbs.forEach(function(i){i.limb.parent==t.limb.id&&e.remove(i)}),this.limbs.splice(i,1),this.model.remove(t.limb),t.parent.remove(t),t.geometry.dispose()),i!=-1},applyPose:function(t){var i=this
"string"==typeof t&&(t=this.model.poses.get(t)),this.limbs.forEach(function(e){i.applyLimbPose(e.limb,t)})},applyLimbPose:function(t,i){var e=i.forLimb(t.id),s=t.mesh,o=Math.PI,n=e.translate,r=e.scale,a=e.rotate,h=n[1]-(t.parent?0:16*i.size[1]/2)
s.position.set(n[0]/8,h/8,n[2]/8),s.scale.set(r[0],r[1],r[2]),s.rotation.set(a[0]/180*o,a[1]/180*o,a[2]/180*o),this.updateAABB(i)},buildLimb:function(t){var i=new THREE.BoxGeometry(t.size[0]/8,t.size[1]/8,t.size[2]/8),e=new THREE.Mesh(i,this.material)
e.castShadow=!0,e.receiveShadow=!0,e.limb=t,t.mesh=e
var s=t.size[0]/8,o=t.size[1]/8,n=t.size[2]/8,r=t.anchor[0],a=t.anchor[1],h=t.anchor[2]
return e.geometry.translate(-s/2,-o/2,-n/2),e.geometry.translate(r*s,a*o,h*n),e},regenerateLimb:function(t){var i=t.mesh,e=i.parent,s=i.material
children=[],index=this.limbs.indexOf(i)
for(var o=0,n=i.children.length;o<n;o++)children.push(i.children[o])
e.remove(i),i.geometry.dispose(),i=this.buildLimb(t),i.material=s,children.forEach(function(t){i.add(t)}),e.add(i),this.mapUV(i),this.limbs[index]=i},mapUV:function(t){var i=t.limb,e=this.data,o=i.size[0],n=i.size[1],r=i.size[2],a=i.texture[0],h=e.h-(i.texture[1]+n+r)
s.cube(e.w,e.h,t.geometry,a,h,o,n,r,i.mirror)},build:function(){var t=this
this.limbs.length&&(this.limbs.forEach(function(t){t.parent.remove(t),t.geometry.dispose()}),this.limbs.length=0),this.model.limbs.forEach(function(i){var e=t.buildLimb(i)
t.mapUV(e),t.limbs.push(e),t.group.add(e)}),this.form()},form:function(){for(var t={},i=0,e=this.limbs.length;i<e;i++){var s=this.limbs[i].limb
if(s.parent&&t[s.parent]){var o=t[s.parent]
s.mesh.parent.remove(s.mesh),o.mesh.add(s.mesh)}t[s.id]=s}},updateTexture:function(){var t=this
o.width=this.data.w,o.height=this.data.h,this.data.render(o.getContext("2d"),this.data.w,this.data.h),this.limbs.forEach(function(i){t.mapUV(i)}),this.material.map.needsUpdate=!0,this.material.needsUpdate=!0},toggleMaterial:function(t){var i=t?this.lightMaterial:this.flatMaterial,e=t?this.lightSelectedMaterial:this.flatSelectedMaterial
this.limbs.forEach(function(t){t.material=i}),this.material=i,this.selectedMaterial=e},updateAABB:function(t){var i=t.size[0],e=t.size[1],s=t.size[2]
this.aabb.geometry.dispose(),this.aabb.geometry=new THREE.BoxGeometry(2*i,2*e,2*s)}}},{"./3d/limb":5,"./3d/poses":8,"./3d/uv":10}],15:[function(t,i,e){var s=t("../dom"),o=i.exports=function(t,i){this.editor=t,this.model=t.app.actor,this.element=i,this.inputs=s.$$("input",i),this.pose=s.$(".mc-pose",i)}
o.prototype={init:function(){var t=this
this.inputs.forEach(function(i){s.on(i,"change",function(){t.change(this)})}),s.on(this.pose,"change",this.poseChange.bind(this)),this.fill()},clear:function(){this.pose.value="standing"},change:function(t){var i=t.name,e=this.editor.limb,s=this.current(),o=i.indexOf("_"),n=i.substr(0,o)
if(e=e.limb,0==i.indexOf("size")){var r=["w","h","d"],a=r.indexOf(i.substr(o+1))
s.size[a]=parseFloat(t.value),this.editor.model.applyPose(s),this.editor.model.updateAABB(s)}else{var r=["x","y","z"],a=r.indexOf(i.substr(o+1))
s.limbs[e.id][n][a]=parseFloat(t.value),this.editor.model.applyLimbPose(e,s)}this.editor.render()},poseChange:function(){var t=this.current()
t.applyPose(this.editor.app.actor),this.editor.app.actor.updateAABB(t),this.fill(),this.editor.render()},fill:function(){var t=this.editor.limb
if(!t)return this.inputs.forEach(function(t){0!=t.name.indexOf("size")&&(t.disabled=!0,t.value="")}),void this.fillSize()
var i=this.model.poses.getPoseForLimb(t.limb.id,this.pose.value),e=this.current(),s={size_w:e.size[0],size_h:e.size[1],size_d:e.size[2],translate_x:i.translate[0],translate_y:i.translate[1],translate_z:i.translate[2],scale_x:i.scale[0],scale_y:i.scale[1],scale_z:i.scale[2],rotate_x:i.rotate[0],rotate_y:i.rotate[1],rotate_z:i.rotate[2]}
this.inputs.forEach(function(t){t.disabled=!1,t.value=s[t.name]})},fillSize:function(){var t=this.current(),i={size_w:t.size[0],size_h:t.size[1],size_d:t.size[2]}
this.inputs.forEach(function(t){t.disabled=!1,i[t.name]&&(t.value=i[t.name])})},current:function(){return this.model.poses.get(this.pose.value)}}},{"../dom":2}],16:[function(t,i,e){var s=t("../dom"),o=t("./utils"),n=i.exports=function(t,i){this.editor=t,this.element=i,this.inputs=s.$$("[name]",i),this.parent=s.$("[name=parent]",i)}
n.prototype={init:function(){var t=this
this.inputs.forEach(function(i){s.on(i,"change",function(){t.change(this)})}),this.updateLimbs(),this.fill()},change:function(t){var i=this.editor.limb,e=t.name,s="checkbox"!=t.type?t.value:t.checked
if(i){i=i.limb
var o=e.split("_")
key=o.shift(),action=key+"Change",this[action]?this[action](i,s,e):i[key]=s}},idChange:function(t,i,e){return this.editor.app.actor.hasLimb(i)||""==i?alert('Limb with name "'+i+'" already exist!'):(this.editor.settings.poses.current().rename(t.id,i),t.id=i,this.updateLimbs(),void this.editor.settings.updateLimbs())},parentChange:function(t,i){if(i!=t.id){t.parent=i,t.mesh.parent.remove(t.mesh),(""==i?this.editor.model.group:this.editor.model.get(i)).add(t.mesh)
var e=this.editor.settings.poses.current()
this.editor.model.applyLimbPose(t,e)}},textureChange:function(t,i,e){var s=["x","y"].indexOf(e.substr(e.indexOf("_")+1))
t.texture[s]=parseInt(i),this.editor.update(),this.editor.app.texture.render()},mirrorChange:function(t,i){t.mirror=i,this.editor.update()},sizeChange:function(t,i,e){var s=["w","h","d"].indexOf(e.substr(e.indexOf("_")+1))
t.size[s]=parseFloat(i),this.regenerate(t),this.editor.render(),this.editor.app.texture.render()},anchorChange:function(t,i,e){var s=["x","y","z"].indexOf(e.substr(e.indexOf("_")+1))
t.anchor[s]=Math.clamp(parseFloat(i),0,1),this.regenerate(t)},regenerate:function(t){var i=this.editor.settings.poses.current()
this.editor.model.regenerateLimb(t),this.editor.limb=t.mesh,this.editor.model.applyLimbPose(t,i)},fill:function(){var t=this.editor.limb
if(!t)return this.empty()
t=t.limb
var i={id:t.id,parent:t.parent,holding:t.holding,looking:t.looking,swiping:t.swiping,swinging:t.swinging,idle:t.idle,texture_x:t.texture[0],texture_y:t.texture[1],mirror:t.mirror,size_w:t.size[0],size_h:t.size[1],size_d:t.size[2],anchor_x:t.anchor[0],anchor_y:t.anchor[1],anchor_z:t.anchor[2]}
this.inputs.forEach(function(t){var e=i[t.name]
"boolean"==typeof e?t.checked=e:t.value=e,t.disabled=!1})},empty:function(){this.inputs.forEach(function(t){t.value="",t.checked=!1,t.disabled=!0})},updateLimbs:function(){var t=document.createElement("option")
t.value="",t.text="None",this.parent.innerHTML="",this.parent.appendChild(t),o.populateLimbs(this.parent,this.editor.app.actor)}}},{"../dom":2,"./utils":24}],17:[function(t,i,e){var s=t("../dom"),o=t("../utils"),n=t("./utils"),r=t("../settings"),a=t("./poses"),h=t("./properties"),l=i.exports=function(t,i){r.call(this,t,i),this.properties=new h(t,s.$(".mc-limb",i)),this.poses=new a(t,s.$(".mc-poses",i)),this.inputs=s.$$("[data-section] [name]",i),this.limbs=s.$(".mc-limbs",i),this.file=s.$(".mc-model-input",i),this.settings.aabb=!1,this.settings.flat=!1,this.settings.shadow=!0,this.settings.lighting=!0}
o.extend(l,r,{init:function(){r.prototype.init.call(this),s.on(this.file,"change",this.importModel.bind(this)),this.properties.init(),this.poses.init(),this.updateLimbs(),this.fill()},exportAction:function(){window.open("data:text/json,"+encodeURI(this.editor.app.actor.exportJSON()))},importAction:function(){this.file.value=null,this.file.click()},importModel:function(){var t=new FileReader,i=this
t.onload=function(t){i.editor.setLimb(null),i.editor.actor.importJSON(t.target.result),i.editor.model.build(),i.editor.model.applyPose("standing"),i.editor.render(),i.poses.clear(),i.updateLimbs(),i.fill()},t.readAsText(this.file.files[0])},renderAction:function(){window.open(this.editor.canvas.toDataURL("image/png"))},resetAction:function(){this.editor.model.group.rotation.set(0,0,0),this.editor.model.group.position.set(0,0,0),this.editor.render()},nameChange:function(t){this.editor.app.actor.name=t.value},aabbChange:function(t){this.editor.model.aabb.visible=t.checked,this.editor.render()},limbChange:function(t){this.editor.setLimb(this.editor.model.get(t.value)),this.limbs.blur()},flatChange:function(t){this.editor.camera.toggle(!t.checked),this.editor.render()},shadowChange:function(t){this.editor.renderer.shadowMap.enabled=t.checked,this.editor.render()},hdChange:function(t){var i=this.editor.light
i.shadow.mapSize.width=t.checked?2048:1024,i.shadow.mapSize.height=t.checked?2048:1024,i.shadow.map.dispose(),i.shadow.map=null},lightingChange:function(t){this.editor.model.toggleMaterial(t.checked),this.editor.render()},fill:function(){var t=this.editor.app.actor.name
this.set(s.$("[name=name]",this.element),t),this.settings.name=t,this.properties.fill(),this.poses.fill(),this.updateLimbsValue()},updateLimbs:function(){var t=document.createElement("option")
t.value="",t.text="None",this.limbs.innerHTML="",this.limbs.appendChild(t),this.limbs.value="",n.populateLimbs(this.limbs,this.editor.app.actor),this.updateLimbsValue(),this.properties.updateLimbs()},updateLimbsValue:function(){this.limbs.value=this.editor.limb?this.editor.limb.limb.id:""}})},{"../dom":2,"../settings":25,"../utils":39,"./poses":15,"./properties":16,"./utils":24}],18:[function(t,i,e){i.exports={Move:t("./move"),Picker:t("./picker"),Translate:t("./translate"),Scale:t("./scale"),Rotate:t("./rotate")}},{"./move":19,"./picker":20,"./rotate":21,"./scale":22,"./translate":23}],19:[function(t,i,e){var s=i.exports=function(t){this.editor=t,this.model=t.model.group}
s.prototype={onMouseMove:function(t,i){var e=this.editor.app.key,s=e&&e.shiftKey,o=e&&e.altKey
t-=this.x,i-=this.y,s?(this.model.rotation.x=this.rx+i/90,this.model.rotation.z=this.rz-t/90):o?(this.model.position.x=this.tx+t/90,this.model.position.y=this.ty-i/90):(this.model.rotation.x=this.rx+i/90,this.model.rotation.y=this.ry+t/90),this.editor.render()},onMouseDown:function(t,i){this.x=t,this.y=i,this.rx=this.model.rotation.x||0,this.ry=this.model.rotation.y||0,this.rz=this.model.rotation.z||0,this.tx=this.model.position.x||0,this.ty=this.model.position.y||0}}},{}],20:[function(t,i,e){var s=i.exports=function(t){this.editor=t,this.raycaster=new THREE.Raycaster,this.mouse=new THREE.Vector2}
s.prototype={onMouseMove:function(t,i){},onMouseDown:function(t,i){this.mouse.x=t/this.editor.canvas.width*2-1,this.mouse.y=1-i/this.editor.canvas.height*2,this.raycaster.setFromCamera(this.mouse,this.editor.camera.camera)
var e=this.raycaster.intersectObjects(this.editor.model.limbs)
this.editor.setLimb(e.length>0?e[0].object:null)}}},{}],21:[function(t,i,e){var s=i.exports=function(t){this.editor=t,this.model=t.model,this.poses=t.settings.poses}
s.prototype={onMouseMove:function(t,i){var e=this.editor.limb
if(null!=e){e=e.limb
var s=this.editor.app.key,o=s&&s.shiftKey
t-=this.x,i-=this.y
var n=this.poses.current(),r=n.forLimb(e.id)
o?(r.rotate[0]=Math.floor(this.rx+i),r.rotate[1]=Math.floor(this.ry+t)):(r.rotate[0]=Math.floor(this.rx+i),r.rotate[2]=Math.floor(this.rz+t)),this.model.applyLimbPose(e,n),this.editor.render(),this.editor.settings.poses.fill()}},onMouseDown:function(t,i){var e=this.editor.limb
if(null!=e){var s=this.poses.current().forLimb(e.limb.id)
this.x=t,this.y=i,this.rx=s.rotate[0],this.ry=s.rotate[1],this.rz=s.rotate[2]}}}},{}],22:[function(t,i,e){var s=i.exports=function(t){this.editor=t,this.model=t.model,this.poses=t.settings.poses}
s.prototype={onMouseMove:function(t,i){var e=this.editor.limb
if(null!=e){e=e.limb,i-=this.y,i/=20
var s=this.poses.current(),o=s.forLimb(e.id)
o.scale[0]=+Math.clamp(this.sx+i,0,1/0).toFixed(1),o.scale[1]=+Math.clamp(this.sy+i,0,1/0).toFixed(1),o.scale[2]=+Math.clamp(this.sz+i,0,1/0).toFixed(1),this.model.applyLimbPose(e,s),this.editor.render(),this.editor.settings.poses.fill()}},onMouseDown:function(t,i){var e=this.editor.limb
if(null!=e){var s=this.poses.current().forLimb(e.limb.id)
this.y=i,this.sx=s.scale[0],this.sy=s.scale[1],this.sz=s.scale[2]}}}},{}],23:[function(t,i,e){var s=i.exports=function(t){this.editor=t,this.model=t.model,this.poses=t.settings.poses}
s.prototype={onMouseMove:function(t,i){var e=this.editor.limb
if(null!=e){e=e.limb
var s=this.editor.app.key,o=s&&s.shiftKey
t-=this.x,i-=this.y,t/=30,i/=30
var n=this.poses.current(),r=n.forLimb(e.id)
o?(r.translate[0]=Math.floor(10*(this.tx+t))/10,r.translate[2]=Math.floor(10*(this.tz-i))/10):(r.translate[0]=Math.floor(10*(this.tx+t))/10,r.translate[1]=Math.floor(10*(this.ty-i))/10),this.model.applyLimbPose(e,n),this.editor.render(),this.editor.settings.poses.fill()}},onMouseDown:function(t,i){var e=this.editor.limb
if(null!=e){var s=this.poses.current().forLimb(e.limb.id)
this.x=t,this.y=i,this.tx=s.translate[0],this.ty=s.translate[1],this.tz=s.translate[2]}}}},{}],24:[function(t,i,e){i.exports={populateLimbs:function(t,i){i.limbs.forEach(function(i){var e=document.createElement("option")
e.value=e.text=i.id,t.appendChild(e)})}}},{}],25:[function(t,i,e){var s=t("./dom"),o=i.exports=function(t,i){this.editor=t,this.element=i,this.settings={},this.inputs=s.$$("[name]",i),this.buttons=s.$$("[data-action]",i)}
o.prototype={init:function(){var t=this
this.inputs.forEach(function(i){s.on(i,"change",function(){t.settings[i.name]=t.get(i),t.notifyChanges(this)}),t.set(i,t.settings[i.name]),t.settings[i.name]=t.get(i)}),this.buttons.forEach(function(i){var e=i.dataset.action+"Action"
s.on(i,"click",function(){t[e]&&t[e](i)})})},set:function(t,i){"checkbox"==t.type?t.checked=Boolean(i):t.value=i},get:function(t){return"checkbox"==t.type?t.checked:t.value},toggle:function(){this.element.classList.toggle("hidden")},notifyChanges:function(t){var i=t.name.split("_"),e=i.shift()+"Change"
this[e]&&this[e](t,i)},update:function(){var t=this
this.inputs.forEach(function(i){"undefined"!=typeof t.settings[i.name]&&t.set(i,t.settings[i.name])})}}},{"./dom":2}],26:[function(t,i,e){var s=t("../dom"),o=(t("../utils"),i.exports=function(t,i,e){this.picker=t,this.input=s.$("input",i),this.canvas=s.$("canvas",i),this.ctx=this.canvas.getContext("2d"),this.index=e,this.factor=0==e?360:100,this.value=0,this.generateGradient()})
o.prototype={init:function(){var t=this
this.generateGradient(),this.render(),s.on(this.input,"change",function(){t.value=(parseInt(this.value)||0)/t.factor,t.value=Math.clamp(t.value,0,1),t.picker.colorChanged()})},click:function(t,i){var e=this.canvas.height/2
this.value=(t-e)/(this.canvas.width-2*e),this.value=Math.clamp(this.value,0,1),this.updateInput(),this.picker.colorChanged()},updateInput:function(){this.input.value=Math.floor(this.value*this.factor)},generateGradient:function(){var t=this.picker.primary.slice(),i=0==this.index?6:2
this.value=t[this.index],this.gradient=this.ctx.createLinearGradient(0,0,this.canvas.width,0)
for(var e=0;e<=i;e++)t[this.index]=e/i,this.gradient.addColorStop(e/i,Color.hsl(t[0],t[1],t[2],1).hsl())},render:function(){var t=this.canvas.width,i=this.canvas.height,e=this.ctx
e.clearRect(0,0,t,i),e.fillStyle=this.gradient,e.fillRect(0,0,t,i)
var s=i/2,o=s+this.value*(t-2*s)
e.strokeStyle="rgba(255, 255, 255, 0.6)",e.lineWidth=2.2,e.beginPath(),e.arc(o,s,.7*s,0,2*Math.PI),e.stroke()}}},{"../dom":2,"../utils":39}],27:[function(t,i,e){var s=t("../dom"),o=t("../utils"),n=t("../editor"),r=(t("../toolbar"),t("./tools")),a=t("./picker"),h=t("./settings"),l={80:"pencil",69:"eraser",67:"picker",66:"bucket",77:"move",90:"zoom"},c=i.exports=function(t,i){n.call(this,t,i),this.settings=new h(this,s.$(".mc-settings",i)),this.picker=new a(t.skin,s.$(".mc-colors",i)),this.canvas=s.$("#texture"),this.toolbar.map={pencil:new r.Pencil(this),eraser:new r.Eraser(this),picker:new r.Picker(this),bucket:new r.Bucket(this),move:new r.Move(this),zoom:new r.Zoom(this)},this.toolbar.set("pencil")}
o.extend(c,n,{init:function(){var t=this
n.prototype.init.call(this),h.renderImage(this).src="assets/img/actor.png",this.picker.init(),this.settings.init(),s.on(s.$(".mc-toggle-settings",this.element),"click",function(){t.settings.toggle()}),this.reset()},clear:function(){this.app.skin.reset(),this.render()},reset:function(){var t=this.canvas,i=8*this.app.skin.w,e=8*this.app.skin.h
t.width=i,t.height=e,t.style.marginLeft=-i/2+"px",t.style.marginTop=-e/2+"px",this.render()},render:function(){var t=this.canvas,i=t.getContext("2d"),e=t.width,s=t.height,o=this.app.skin.scale(e,s)
this.app.skin.render(i,e,s),this.settings.settings.grid&&o>2&&this.drawGrid(i,o,e,s),this.settings.settings.guides&&o>2&&null!=this.app.model.limb&&this.drawGuides(i,this.app.model.limb.limb,o)},drawGrid:function(t,i,e,s){t.fillStyle="#999"
for(var o=4,n=this.app.skin.w;o<n;o+=4)t.fillRect(o*i,0,1,s*i)
for(var o=4,n=this.app.skin.h;o<n;o+=4)t.fillRect(0,o*i,e*i,1)},drawGuides:function(t,i,e){t.fillStyle="red"
var i=this.app.model.limb.limb,s=i.texture[0],o=i.texture[1],n=i.size[0],r=i.size[1],a=i.size[2],h=1
t.fillRect(s*e,(o+a)*e,a*e+1,h),t.fillRect((s+a)*e,o*e,2*n*e,h),t.fillRect((s+a+2*n)*e,(o+a)*e,a*e,h),t.fillRect(s*e,(o+a)*e,h,r*e),t.fillRect((s+a)*e,o*e,h,a*e),t.fillRect((s+2*a+2*n)*e,(o+a)*e,h,r*e),t.fillRect((s+a+2*n)*e,o*e,h,a*e),t.fillRect(s*e,(o+a+r)*e,(2*a+2*n)*e,h)},onKey:function(t){var i=t.keyCode
l[i]&&this.toolbar.set(l[t.keyCode]),88==i&&this.picker.swap(),86==i&&this.picker.toggle(),83==i&&this.settings.toggle(),72==i&&this.app.hide(this,this.app.model)},onMouseMove:function(t,i,e){e.target!=this.element&&e.target!=this.canvas||this.toolbar.onMouseMove(t,i),this.picker.onMouseMove(t,i)},onMouseDown:function(t,i,e){e.target!=this.element&&e.target!=this.canvas||this.toolbar.onMouseDown(t,i),this.picker.onMouseMove(t,i)}})},{"../dom":2,"../editor":3,"../toolbar":38,"../utils":39,"./picker":28,"./settings":30,"./tools":33}],28:[function(t,i,e){var s=t("../dom"),o=t("../utils"),n=t("./bar"),r=i.exports=function(t,i){this.pixelData=t,this.colors=i,this.primary=[0,0,1,1],this.secondary=[0,0,0,1],this.fg=s.$(".mc-color-fg",i),this.bg=s.$(".mc-color-bg",i),this.bars=[new n(this,s.$(".mc-hue-bar",i),0),new n(this,s.$(".mc-saturation-bar",i),1),new n(this,s.$(".mc-lightness-bar",i),2)]}
r.prototype={init:function(){var t=this,i=this.toggle.bind(this)
s.on(this.fg,"click",i),s.on(this.bg,"click",i),s.on(s.$(".mc-color-css"),"change",function(){var i=o.parse(this.value)
this.value="",this.blur(),t.primary=Color.rgb(i[0],i[1],i[2]).hslData(),t.update()}),this.bars.forEach(function(t){t.init()}),this.update()},toggle:function(){s.$(".mc-color-picker",this.colors).classList.toggle("hidden")},swap:function(){var t=this.primary
this.primary=this.secondary,this.secondary=t,this.update()},update:function(){this.fg.style.backgroundColor=o.to_color(Color.HSLtoRGB(this.primary)),this.bg.style.backgroundColor=o.to_color(Color.HSLtoRGB(this.secondary)),this.bars.forEach(function(t){t.generateGradient(),t.updateInput(),t.render()})},setColor:function(t){this.primary=Color.rgb(t[0],t[1],t[2]).hslData(),this.update()},colorChanged:function(){this.primary[0]=this.bars[0].value,this.primary[1]=this.bars[1].value,this.primary[2]=this.bars[2].value,this.update()},onMouseMove:function(t,i){for(var e=0,s=this.bars.length;e<s;e++){var o=this.bars[e],n=o.canvas.getBoundingClientRect(),r=t-n.left,a=i-n.top
if(r>=0&&r<o.canvas.width&&a>=0&&a<o.canvas.height){o.click(r,a)
break}}}}},{"../dom":2,"../utils":39,"./bar":26}],29:[function(t,i,e){var s=t("../utils"),o=[0,0,0,0],n=i.exports=function(t,i){this.w=t,this.h=i,this.reset()}
n.prototype={resize:function(t,i){var e=this.map.slice()
this.w=t,this.h=i
for(var s=0;s<this.h;s++){this.map[s]=[]
for(var n=0;n<this.w;n++)this.set(n,s,e[s]&&e[s][n]?e[s][n]:o)}},reset:function(){this.map=[]
for(var t=0;t<this.h;t++){this.map[t]=[]
for(var i=0;i<this.w;i++)this.set(i,t,o)}},set:function(t,i,e){this.inBound(t,i)&&(e=e.slice(),e.rgb=s.to_color(e),this.map[i][t]=e)},get:function(t,i){return this.inBound(t,i)?this.map[i][t]:null},inBound:function(t,i){return t>=0&&i>=0&&t<this.w&&i<this.h},scale:function(t,i){return Math.floor(Math.min(t/this.w,i/this.h))||1},render:function(t,i,e){for(var s=this.scale(i,e),o=0;o<this.w;o++)for(var n=0;n<this.h;n++)this.renderPixel(t,o,n,s)},renderPixel:function(t,i,e,s,o,n){t.fillStyle=this.map[e][i].rgb,o=void 0===o?i:o,n=void 0===n?e:n,t.clearRect(o*s,n*s,s,s),t.fillRect(o*s,n*s,s,s)},fromImageData:function(t){for(var i=t.data,e=0,s=i.length;e<s;e+=4){var o=e/4%t.width,n=Math.floor(e/4/t.width),r=i[e],a=i[e+1],h=i[e+2],l=i[e+3]
this.set(o,n,[r,a,h,l])}},pointToPixel:function(t,i,e){i-=t.offsetLeft+t.parentNode.offsetLeft,e-=t.offsetTop+t.parentNode.offsetTop
var s=t.width,o=t.height,n=this.scale(s,o)
return{x:Math.floor(i/n),y:Math.floor(e/n),scale:n}}}},{"../utils":39}],30:[function(t,i,e){function s(t){var i=new Image,e=t.app.skin.w,s=t.app.skin.h
return i.onload=function(){a.width=e,a.height=s
var o=a.getContext("2d")
o.drawImage(i,0,0),t.app.skin.fromImageData(o.getImageData(0,0,e,s)),t.render()},i}var o=t("../dom"),n=t("../utils"),r=t("../settings"),a=document.createElement("canvas"),h=i.exports=function(t,i){r.call(this,t,i),this.file=o.$(".mc-skin-input",i),this.settings.size_w=t.app.skin.w,this.settings.size_h=t.app.skin.h,this.clearAction=t.clear.bind(t),this.resetAction=t.reset.bind(t),this.sizeChange=this.resize.bind(this),this.gridChange=this.guidesChange=t.render.bind(t)}
n.extend(h,r,{init:function(){r.prototype.init.call(this),o.on(this.file,"change",this.importImage.bind(this))},resize:function(){this.editor.app.skin.resize(+this.settings.size_w,+this.settings.size_h),this.editor.reset()},importImage:function(){var t=this,i=new FileReader
i.onload=function(i){s(t.editor).src=i.target.result},i.readAsDataURL(this.file.files[0])},importAction:function(){this.file.value=null,this.file.click()},exportAction:function(){var t=o.$(".mc-skin-export",this.element),i=this.editor.app.skin
a.width=i.w,a.height=i.h,i.render(a.getContext("2d"),i.w,i.h),t.classList.remove("hidden"),t.src=a.toDataURL("image/png")},generateAction:function(){function t(t,i,e,s,o,n){for(var r=0;r<s;r++)for(var a=0;a<o;a++)t.set(i+r,e+a,n)}var i=this.editor.app.skin
i.reset(),this.editor.app.actor.limbs.forEach(function(e){var s=[Math.random(),.25+.5*Math.random(),.5,1],o=s.slice(),n=s.slice(),r=s.slice(),a=s.slice(),h=s.slice()
o[2]=.7,r[2]=.6,a[2]=.4,h[2]=.3,o=Color.hsl.apply(null,o).rgbData(),n=Color.hsl.apply(null,n).rgbData(),r=Color.hsl.apply(null,r).rgbData(),a=Color.hsl.apply(null,a).rgbData(),h=Color.hsl.apply(null,h).rgbData()
var l=e.texture[0],c=e.texture[1],d=e.size[0],u=e.size[1],p=e.size[2]
t(i,l,c+p,p,u,n),t(i,l+p,c+p,d,u,r),t(i,l+p+d,c+p,p,u,n),t(i,l+2*p+d,c+p,d,u,a),t(i,l+p,c,d,p,o),t(i,l+p+d,c,d,p,h)}),this.editor.render()}}),i.exports.renderImage=s},{"../dom":2,"../settings":25,"../utils":39}],31:[function(t,i,e){function s(t,i,e){return Math.floor(t+i*e)}var o=t("../../utils"),n=i.exports=function(t){this.editor=t,this.pixelData=t.app.skin,this.canvas=t.canvas,this.picker=t.picker}
n.prototype={onMouseMove:function(t,i){},onMouseDown:function(t,i){var e=this.pixelData,s=e.pointToPixel(this.canvas,t,i)
if(t=s.x,i=s.y,!(t<0||t>=e.w||i<0||i>=e.h)){var o=this.picker.primary
o=Color.hsl(o[0],o[1],o[2]).rgbData(),this.fill(e,t,i,o),this.editor.render()}},fill:function(t,i,e,n){function r(i,e){var n=s(i,e,t.w)
i<0||i>=t.w||e<0||e>=t.h||l.indexOf(n)<0&&h.indexOf(n)<0&&o.to_color(t.get(i,e))==a&&h.push(n)}for(var a=o.to_color(t.get(i,e)),h=[s(i,e,t.w)],l=[];h.length;){var c=h.shift(),i=c%t.w,e=c/t.w>>0
r(i+1,e),r(i-1,e),r(i,e+1),r(i,e-1),l.push(c)}l.forEach(function(i){var e=i%t.w,s=i/t.w>>0
t.set(e,s,n)})}}},{"../../utils":39}],32:[function(t,i,e){var s=i.exports=function(t){this.pixelData=t.app.skin,this.canvas=t.canvas}
s.prototype={onMouseMove:function(t,i){this.onMouseDown(t,i)},onMouseDown:function(t,i){var e=this.pixelData,s=e.pointToPixel(this.canvas,t,i)
t=s.x,i=s.y,t<0||t>=e.w||i<0||i>=e.h||(e.set(t,i,[0,0,0,0]),e.renderPixel(this.canvas.getContext("2d"),t,i,s.scale))}}},{}],33:[function(t,i,e){i.exports={Pencil:t("./pencil"),Eraser:t("./eraser"),Picker:t("./picker"),Bucket:t("./bucket"),Move:t("./move"),Zoom:t("./zoom")}},{"./bucket":31,"./eraser":32,"./move":34,"./pencil":35,"./picker":36,"./zoom":37}],34:[function(t,i,e){var s=i.exports=function(t){this.canvas=t.canvas}
s.prototype={onMouseMove:function(t,i){t=this.marginLeft-(this.x-t),i=this.marginTop-(this.y-i),this.canvas.style.marginLeft=t+"px",this.canvas.style.marginTop=i+"px"},onMouseDown:function(t,i){this.x=t,this.y=i,this.marginLeft=parseInt(this.canvas.style.marginLeft)||-this.canvas.width/2,this.marginTop=parseInt(this.canvas.style.marginTop)||-this.canvas.height/2}}},{}],35:[function(t,i,e){var s=i.exports=function(t){this.pixelData=t.app.skin,this.canvas=t.canvas,this.picker=t.picker}
s.prototype={onMouseMove:function(t,i){this.onMouseDown(t,i)},onMouseDown:function(t,i){var e=this.pixelData,s=e.pointToPixel(this.canvas,t,i)
if(t=s.x,i=s.y,!(t<0||t>=e.w||i<0||i>=e.h)){var o=this.picker.primary
e.set(t,i,Color.hsl(o[0],o[1],o[2]).rgbData()),e.renderPixel(this.canvas.getContext("2d"),t,i,s.scale)}}}},{}],36:[function(t,i,e){var s=i.exports=function(t){this.editor=t,this.pixelData=t.app.skin,this.canvas=t.canvas}
s.prototype={onMouseMove:function(t,i){},onMouseDown:function(t,i){var e=this.pixelData,s=e.pointToPixel(this.canvas,t,i)
this.editor.picker.setColor(e.get(s.x,s.y))}}},{}],37:[function(t,i,e){var s=i.exports=function(t){this.editor=t,this.canvas=t.canvas}
s.prototype={onMouseMove:function(t,i){},onMouseDown:function(t,i){var e=this.editor.app.key,s=e&&e.shiftKey?.5:2,o=this.canvas.width*s,n=this.canvas.height*s
if(!(o>2048||o<this.editor.app.skin.w||n>2048||n<this.editor.app.skin.h)){var r=this.editor.app.skin,a=r.pointToPixel(this.canvas,t,i),h=parseInt(this.canvas.style.marginLeft)||0,l=parseInt(this.canvas.style.marginTop)||0,c=a.x/r.w,d=a.y/r.h
2==s?(c=1-c,d=1-d,this.canvas.style.marginLeft=h+this.canvas.width*c-o/2+"px",this.canvas.style.marginTop=l+this.canvas.height*d-n/2+"px"):(this.canvas.style.marginLeft=h-o*c+this.canvas.width*c+"px",this.canvas.style.marginTop=l-n*d+this.canvas.height*d+"px"),this.canvas.width=o,this.canvas.height=n,this.editor.render()}}}},{}],38:[function(t,i,e){var s=t("./dom"),o=i.exports=function(t,i){this.editor=t,this.element=i,this.tools=s.$$("[data-tool]",i),this.current="",this.map={}}
o.prototype={init:function(){var t=this
this.tools.forEach(function(i){s.on(i,"click",function(){t.set(this)})})},set:function(t){"string"==typeof t&&(t=s.$("[data-tool='"+t+"']",this.element)),this.current=t.dataset.tool,this.tools.forEach(function(i){var e=t.dataset.tool==i.dataset.tool
i.classList.toggle("mc-tool-selected",e)})},getCurrent:function(){return this.map[this.current]},onMouseMove:function(t,i){this.getCurrent().onMouseMove(t,i)},onMouseDown:function(t,i){this.getCurrent().onMouseDown(t,i)}}},{"./dom":2}],39:[function(t,i,e){var s=document.createElement("canvas")
i.exports={extend:function(t,i,e){t.prototype=Object.create(i.prototype)
for(var s in e)t.prototype[s]=e[s]},to_color:function(t){var i=t[0],e=t[1],s=t[2],o=t[3]
return"undefined"==typeof o&&(o=1),"rgba("+Math.floor(i)+","+Math.floor(e)+","+Math.floor(s)+","+Math.floor(o)+")"},parse:function(t){var i=s.getContext("2d")
i.fillStyle=t,i.fillRect(0,0,1,1)
var e=i.getImageData(0,0,1,1).data
return[e[0],e[1],e[2],e[3]/255]},extract:function(t,i){var e={}
for(var s in t)i.indexOf(s)!=-1&&(e[s]=t[s])
return e},merge:function(t,i){for(var e in i)t[e]=i[e]}}},{}]},{},[4])(4)})
