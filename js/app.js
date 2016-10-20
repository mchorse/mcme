!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t()
else if("function"==typeof define&&define.amd)define([],t)
else{var e
e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,e.McME=t()}}(function(){return function t(e,i,s){function o(r,a){if(!i[r]){if(!e[r]){var h="function"==typeof require&&require
if(!a&&h)return h(r,!0)
if(n)return n(r,!0)
var l=new Error("Cannot find module '"+r+"'")
throw l.code="MODULE_NOT_FOUND",l}var c=i[r]={exports:{}}
e[r][0].call(c.exports,function(t){var i=e[r][1][t]
return o(i?i:t)},c,c.exports,t,e,i,s)}return i[r].exports}for(var n="function"==typeof require&&require,r=0;r<s.length;r++)o(s[r])
return o}({1:[function(t,e,i){var s=t("./dom"),o=t("./texture/editor"),n=t("./model/editor"),r=t("./texture/pixel-data"),a=t("./model/3d/model"),h=e.exports=function(t,e,i){this.element=t,this.skin=new r(64,32),this.actor=new a(this.skin),this.key=null,this.clicking=!1,this.x=this.y=0,this.texture=new o(this,e),this.model=new n(this,i),this.current=this.texture}
h.prototype={init:function(){var t=this
this.model.init(),this.texture.init(),s.on(document,"keyup",this.onKey.bind(this)),s.on(document,"keydown",this.onKeyDown.bind(this)),s.on(document,"mousedown",this.onMouseDown.bind(this)),s.on(document,"mousemove",this.onMouseMove.bind(this)),s.on(document,"mouseup",this.onMouseUp.bind(this)),s.on(document,"wheel",this.onWheel.bind(this)),s.on(s.$(".mc-hide-texture",this.element),"click",function(){t.hide(t.texture,t.model)}),s.on(s.$(".mc-hide-model",this.element),"click",function(){t.hide(t.model,t.texture)}),s.on(s.$(".mc-show-help",this.element),"click",function(){var e=s.$(".mc-help-wrapper",t.element).classList
e.toggle("hidden"),this.classList.toggle("mc-tool-selected",!e.contains("hidden"))}),s.on(s.$(".mc-toggle-layout",this.element),"click",function(){var e=t.element.classList
e.toggle("mc-vertical"),this.classList.toggle("mc-tool-selected",e.contains("mc-vertical")),t.model.resize()})},onKey:function(t){document.activeElement==document.body&&(this.key=null,this.current.onKey(t))},onKeyDown:function(t){this.key=t},onMouseMove:function(t){var e=t.pageX,i=t.pageY
this.x=e,this.y=i,this.current=this.texture.inBound(e,i)?this.texture:this.model,this.clicking&&this.current.onMouseMove(e,i,t)},onMouseDown:function(t){this.onMouseMove(t),this.clicking=!0,this.current.onMouseDown(this.x,this.y,t)},onMouseUp:function(t){this.clicking=!1,this.onMouseMove(t)},onWheel:function(t){s.hasParent(t.target,"mc-settings",3)||s.hasParent(t.target,"mc-help-section",3)||(t.preventDefault(),this.current.onWheel(t))},hide:function(t,e){var i=e.element.classList,s=t.element.classList,o=i.contains("hidden"),n=s.contains("hidden")
o||n?!o&&n?(i.remove("mc-full"),s.remove("hidden")):o&&!n&&(s.add("hidden"),s.remove("mc-full"),i.add("mc-full"),i.remove("hidden")):(i.add("mc-full"),s.add("hidden")),this.model.resize()}}},{"./dom":2,"./model/3d/model":6,"./model/editor":13,"./texture/editor":27,"./texture/pixel-data":29}],2:[function(t,e,i){e.exports={$:function(t,e){return(e||document).querySelector(t)},$$:function(t,e){return Array.prototype.slice.call((e||document).querySelectorAll(t))},on:function(t,e,i){t.addEventListener(e,i)},hasParent:function(t,e,i){for(;i-- >=0;){if(t.classList.contains(e))return!0
t=t.parentNode}return!1}}},{}],3:[function(t,e,i){var s=t("./dom"),o=(t("./utils"),t("./toolbar")),n=e.exports=function(t,e){this.app=t,this.element=e,this.toolbar=new o(this,s.$(".mc-toolbar",e))}
n.prototype={init:function(){this.toolbar.init()},inBound:function(t,e){var i=this.element
return t>=i.offsetLeft&&t<i.offsetLeft+i.offsetWidth&&e>=i.offsetTop&&e<i.offsetTop+i.offsetHeight},onKey:function(){},onMouseMove:function(t,e){this.toolbar.onMouseMove(t,e)},onMouseDown:function(t,e){this.toolbar.onMouseDown(t,e)},onWheel:function(t){},notifySettings:function(t){}}},{"./dom":2,"./toolbar":38,"./utils":39}],4:[function(t,e,i){Math.clamp=function(t,e,i){return t<e?e:t>i?i:t},e.exports={App:t("./app"),dom:t("./dom")}},{"./app":1,"./dom":2}],5:[function(t,e,i){var s=(t("./uv"),t("../../utils")),o=0,n=["parent","holding","swiping","looking","swinging","idle","texture","size","anchor","mirror"],r=e.exports=function(){this.id="limb_"+o++,this.parent="",this.size=[4,4,4],this.texture=[0,0],this.anchor=[.5,.5,.5],this.mirror=!1,this.holding="",this.swiping=!1,this.looking=!1,this.swinging=!1,this.idle=!1}
r.prototype={exportLimb:function(){var t=s.extract(this,n)
return t.parent||delete t.parent,t.holding||delete t.holding,t.swiping||delete t.swiping,t.looking||delete t.looking,t.swinging||delete t.swinging,t.idle||delete t.idle,t.mirror||delete t.mirror,t},importLimb:function(t){s.merge(this,t)}}},{"../../utils":39,"./uv":10}],6:[function(t,e,i){var s=t("./poses"),o=t("./limb"),n=e.exports=function(){this.name="",this.limbs=[],this.poses=new s}
n.prototype={add:function(t){var e=new o
return this.limbs.push(e),this.poses.formLimb(e),e.parent=t||"",e},remove:function(t){var e=this.limbs.indexOf(t),i=this
return e!=-1&&(this.limbs.forEach(function(e){e.parent==t.id&&i.remove(e)}),this.limbs.splice(e,1),this.poses.removeLimb(t.id)),e!=-1},get:function(t){for(var e=0,i=this.limbs.length;e<i;e++)if(this.limbs[e].id==t)return this.limbs[e]},hasLimb:function(t){return null!=this.get(t)},exportModel:function(){for(var t={scheme:"1.3",name:this.name,poses:this.poses.exportPoses(),limbs:{}},e=0,i=this.limbs.length;e<i;e++){var s=this.limbs[e]
t.limbs[s.id]=s.exportLimb()}return t},exportJSON:function(){return JSON.stringify(this.exportModel(),null,4)},importModel:function(t){this.limbs.length=0,this.name=t.name,this.poses.importPoses(t.poses)
for(var e in t.limbs){var i=new o
i.importLimb(t.limbs[e]),i.id=e,this.limbs.push(i)}this.poses.form(this)},importJSON:function(t){this.importModel(JSON.parse(t))}}},{"./limb":5,"./poses":8}],7:[function(t,e,i){var s=t("./transform"),o=e.exports=function(){this.size=[1,1,1],this.limbs={}}
o.prototype={form:function(t){t.limbs.forEach(this.formLimb.bind(this))},formLimb:function(t){this.limbs[t.id]||(this.limbs[t.id]=new s)},forLimb:function(t){return this.limbs[t]},rename:function(t,e){this.limbs[e]=this.limbs[t],delete this.limbs[t]},removeLimb:function(t){this.limbs[t]&&delete this.limbs[t]},exportPose:function(){var t={size:this.size,limbs:{}}
for(var e in this.limbs){var i=this.limbs[e].exportTransform()
Object.keys(i).length&&(t.limbs[e]=i)}return t},importPose:function(t){this.size=t.size,this.limbs={}
for(var e in t.limbs){var i=new s
i.importTransform(t.limbs[e]),this.limbs[e]=i}}}},{"./transform":9}],8:[function(t,e,i){var s=t("./pose"),o=e.exports=function(){this.poses={}}
o.prototype={form:function(t){for(var e in this.poses)this.poses[e].form(t)},formLimb:function(t){for(var e in this.poses)this.poses[e].formLimb(t)},getPoseForLimb:function(t,e){return this.poses[e].forLimb(t)},get:function(t){return this.poses[t]},rename:function(t,e){for(var i in this.poses)this.poses[i].rename(t,e)},removeLimb:function(t){for(var e in this.poses)this.poses[e].removeLimb(t)},exportPoses:function(){var t={}
for(var e in this.poses)t[e]=this.poses[e].exportPose()
return t},importPoses:function(t){this.poses={}
for(var e in t){var i=new s
i.importPose(t[e]),this.poses[e]=i}}}},{"./pose":7}],9:[function(t,e,i){function s(t,e){e="undefined"==typeof e?0:e
for(var i=!0,s=0;s<t.length;s++)i=i&&t[s]===e
return i}var o=t("../../utils"),n=e.exports=function(){this.translate=[0,0,0],this.scale=[1,1,1],this.rotate=[0,0,0]}
n.prototype={exportTransform:function(){var t={}
return s(this.translate,0)||(t.translate=this.translate.slice()),s(this.scale,1)||(t.scale=this.scale.slice()),s(this.rotate,0)||(t.rotate=this.rotate.slice()),t},importTransform:function(t){o.merge(this,t)}}},{"../../utils":39}],10:[function(t,e,i){var s=e.exports={vec:function(t,e,i,s){return new THREE.Vector2(t/i,e/s)},side:function(t,e,i,o,n,r,a,h,l){o=2*o
var c,d,u=[s.vec(n,r+h,t,e),s.vec(n+a,r+h,t,e),s.vec(n+a,r,t,e),s.vec(n,r,t,e)],p=i.faceVertexUvs[0][o],m=i.faceVertexUvs[0][o+1]
6!=o?(c=l?[1,2,0]:[0,3,1],d=l?[2,3,0]:[3,2,1]):(c=l?[2,1,3]:[3,0,2],d=l?[1,0,3]:[0,1,2])
for(var f=0;f<3;f++)p[f].copy(u[c[f]]),m[f].copy(u[d[f]])
i.uvsNeedUpdate=!0},cube:function(t,e,i,o,n,r,a,h,l){s.side(t,e,i,4,o+h,n,r,a,l),s.side(t,e,i,5,o+h+r+h,n,r,a,l),l?(s.side(t,e,i,0,o,n,h,a,l),s.side(t,e,i,1,o+h+r,n,h,a,l)):(s.side(t,e,i,0,o+h+r,n,h,a),s.side(t,e,i,1,o,n,h,a)),s.side(t,e,i,2,o+h,n+a,r,h,l),s.side(t,e,i,3,o+h+r,n+a,r,h,l)}}},{}],11:[function(t,e,i){var s=e.exports=function(t,e,i,s,o,n,r){this.fov=i
var a=t/128,h=e/128
this.width=t,this.height=e,this.ortho=new THREE.OrthographicCamera((-a),a,h,(-h),n,r),this.ortho.position.z=10,this.perspec=new THREE.PerspectiveCamera(i,t/e,s,o),this.perspec.position.z=8,this.toPerspec()}
s.prototype={toOrtho:function(){this.camera=this.ortho},toPerspec:function(){this.camera=this.perspec},toggle:function(t){"undefined"!=typeof t?t?this.toPerspec():this.toOrtho():this.camera==this.ortho?this.toPerspec():this.toOrtho()},dolly:function(t){this.perspec.position.z=this.perspec.position.z+t,this.perspec.position.z=Math.clamp(this.perspec.position.z,2,20)
var e=30*(20-this.perspec.position.z+2),i=this.width/e,s=this.height/e
this.ortho.left=-i,this.ortho.right=i,this.ortho.top=s,this.ortho.bottom=-s,this.ortho.updateProjectionMatrix()},resize:function(t,e){this.width=t,this.height=e
var i=t/128,s=e/128
this.perspec.aspect=t/e,this.ortho.left=-i,this.ortho.right=i,this.ortho.top=s,this.ortho.bottom=-s,this.perspec.updateProjectionMatrix(),this.ortho.updateProjectionMatrix()}}},{}],12:[function(t,e,i){e.exports={scheme:"1.3",name:"Steve",poses:{standing:{size:[.6,1.8,.6],limbs:{head:{translate:[0,24,0]},outer:{translate:[0,4,0],scale:[1.1,1.1,1.1]},body:{translate:[0,24,0]},left_arm:{translate:[6,24,0]},right_arm:{translate:[-6,24,0]},left_leg:{translate:[2,12,0]},right_leg:{translate:[-2,12,0]}}},sneaking:{size:[.6,1.65,.6],limbs:{body:{translate:[0,20.8,0],rotate:[28.64,0,0]},head:{translate:[0,19.8,0]},outer:{translate:[0,4,0],scale:[1.1,1.1,1.1]},left_arm:{translate:[6,20.8,0],rotate:[22.9,0,0]},right_arm:{translate:[-6,20.8,0],rotate:[22.9,0,0]},left_leg:{translate:[2,12,-4]},right_leg:{translate:[-2,12,-4]}}},sleeping:{size:[.2,.2,.2],limbs:{head:{translate:[0,24,0]},outer:{translate:[0,4,0],scale:[1.1,1.1,1.1]},body:{translate:[0,24,0]},left_arm:{translate:[6,24,0]},right_arm:{translate:[-6,24,0]},left_leg:{translate:[2,12,0]},right_leg:{translate:[-2,12,0]}}},flying:{size:[.6,.6,.6],limbs:{head:{translate:[0,24,0]},outer:{translate:[0,4,0],scale:[1.1,1.1,1.1]},body:{translate:[0,24,0]},left_arm:{translate:[6,24,0]},right_arm:{translate:[-6,24,0]},left_leg:{translate:[2,12,0]},right_leg:{translate:[-2,12,0]}}}},limbs:{body:{size:[8,12,4],texture:[16,16],anchor:[.5,0,.5]},head:{size:[8,8,8],texture:[0,0],anchor:[.5,1,.5],looking:!0},outer:{parent:"head",size:[8,8,8],texture:[32,0],anchor:[.5,.5,.5]},left_arm:{size:[4,12,4],texture:[40,16],anchor:[.5,0,.5],mirror:!0,holding:"left",swinging:!0},right_arm:{size:[4,12,4],texture:[40,16],anchor:[.5,0,.5],holding:"right",swiping:!0,swinging:!0},left_leg:{size:[4,12,4],texture:[0,16],anchor:[.5,0,.5],mirror:!0,swinging:!0,invert:!0},right_leg:{size:[4,12,4],texture:[0,16],anchor:[.5,0,.5],swinging:!0,invert:!0}},texture:[64,32]}},{}],13:[function(t,e,i){var s=t("../dom"),o=t("../utils"),n=t("../editor"),r=t("./settings"),a=t("./tools"),h=t("./camera"),l=t("./model"),c={67:"scale",76:"picker",77:"move",82:"rotate",84:"translate"},d=e.exports=function(t,e){n.call(this,t,e),this.limb=null,this.actor=t.actor,this.model=new l(t.actor,t.skin),this.settings=new r(this,s.$(".mc-settings",e)),this.toolbar.map={picker:new a.Picker(this),move:new a.Move(this),translate:new a.Translate(this),rotate:new a.Rotate(this),scale:new a.Scale(this)},this.toolbar.set("move")}
o.extend(d,n,{init:function(){var e=this
n.prototype.init.call(this),this.actor.importModel(t("./default.json")),this.model.build(),this.model.applyPose("standing"),this.settings.init(),s.on(window,"resize",this.resize.bind(this)),s.on(s.$(".mc-toggle-settings",this.element),"click",function(){e.settings.toggle()}),s.on(s.$(".mc-add-limb",this.element),"click",this.addLimb.bind(this)),s.on(s.$(".mc-remove-limb",this.element),"click",this.removeLimb.bind(this)),setInterval(this.update.bind(this),1e3),this.setupThree(),this.scene.add(this.model.group),this.render()},setupThree:function(){var t=this.element.offsetWidth,e=this.element.offsetHeight,i=new h(t,e,50,.1,1e3,(-1e3),1e3),s=new THREE.Scene,o=new THREE.WebGLRenderer({preserveDrawingBuffer:!0,alpha:!0})
o.setClearColor(16777215,0),o.setSize(t,e),o.domElement.id="model",o.shadowMap.enabled=!0,o.shadowMap.type=THREE.PCFSoftShadowMap,this.setupLighting(s),this.element.appendChild(o.domElement),this.canvas=o.domElement,this.renderer=o,this.scene=s,this.camera=i},setupLighting:function(t){var e=new THREE.PointLight(16777215,1.3,20,.7)
e.position.set(0,10,8),e.castShadow=!0,t.add(e),t.add(new THREE.AmbientLight(7829367)),this.light=e},onKey:function(t){var e=t.keyCode
c[e]&&this.toolbar.set(c[t.keyCode]),83==e&&this.settings.toggle(),79==e&&(this.camera.toggle(),this.settings.settings.flat=this.camera.camera==this.camera.ortho,this.settings.update(),this.render()),72==e&&this.app.hide(this,this.app.texture),68==e&&this.setLimb(null)},onMouseMove:function(t,e,i){i.target!=this.element&&i.target!=this.canvas||this.toolbar.onMouseMove(t,e)},onMouseDown:function(t,e,i){i.target!=this.element&&i.target!=this.canvas||this.toolbar.onMouseDown(t,e)},onWheel:function(t){t.target!=this.element&&t.target!=this.canvas||(this.camera.dolly(t.deltaY/20),this.render())},resize:function(){var t=this.element.offsetWidth,e=this.element.offsetHeight
this.renderer.setSize(t,e),this.camera.resize(t,e),this.render()},update:function(){this.model.updateTexture(),this.render()},render:function(){this.renderer.render(this.scene,this.camera.camera)},addLimb:function(){var t=this.model.add(this.limb)
this.settings.updateLimbs(),this.setLimb(t),this.render()},removeLimb:function(){this.limb&&this.model.remove(this.limb)&&(this.limb=null,this.render(),this.settings.fill(),this.settings.updateLimbs())},setLimb:function(t){this.limb&&(this.limb.material=this.model.material),this.limb=t,this.limb&&(this.limb.material=this.model.selectedMaterial),this.app.texture.render(),this.settings.fill(),this.render()}})},{"../dom":2,"../editor":3,"../utils":39,"./camera":11,"./default.json":12,"./model":14,"./settings":17,"./tools":18}],14:[function(t,e,i){var s=(t("./3d/poses"),t("./3d/limb"),t("./3d/uv")),o=document.createElement("canvas"),n={side:THREE.DoubleSide,alphaTest:.5},r={side:THREE.DoubleSide,transparent:!0,opacity:.65,alphaTest:.5},a=e.exports=function(t,e){this.model=t,this.data=e
var i=new THREE.Texture(o)
i.minFilter=i.magFilter=THREE.NearestFilter,n.map=r.map=i,this.group=new THREE.Object3D,this.limbs=[],this.lightMaterial=new THREE.MeshLambertMaterial(n),this.lightSelectedMaterial=new THREE.MeshLambertMaterial(r),this.flatMaterial=new THREE.MeshBasicMaterial(n),this.flatSelectedMaterial=new THREE.MeshBasicMaterial(r),this.material=this.lightMaterial,this.selectedMaterial=this.lightSelectedMaterial,this.aabb=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial({wireframe:!0,color:16711680})),this.aabb.visible=!1,this.group.add(this.aabb)}
a.prototype={add:function(t){var e=this.model.add(t?t.limb.id:""),i=this.buildLimb(e)
return this.mapUV(i),(t?t:this.group).add(e.mesh),this.limbs.push(i),i},get:function(t){for(var e=0,i=this.limbs.length;e<i;e++)if(this.limbs[e].limb.id==t)return this.limbs[e]},remove:function(t){var e=this.limbs.indexOf(t),i=this
return e!=-1&&(this.limbs.forEach(function(e){e.limb.parent==t.limb.id&&i.remove(e)}),this.limbs.splice(e,1),this.model.remove(t.limb),t.parent.remove(t),t.geometry.dispose()),e!=-1},applyPose:function(t){var e=this
"string"==typeof t&&(t=this.model.poses.get(t)),this.limbs.forEach(function(i){e.applyLimbPose(i.limb,t)})},applyLimbPose:function(t,e){var i=e.forLimb(t.id),s=t.mesh,o=Math.PI,n=i.translate,r=i.scale,a=i.rotate,h=n[1]-(t.parent?0:16*e.size[1]/2)
s.position.set(n[0]/8,h/8,n[2]/8),s.scale.set(r[0],r[1],r[2]),s.rotation.set(a[0]/180*o,a[1]/180*o,a[2]/180*o),this.updateAABB(e)},buildLimb:function(t){var e=new THREE.BoxGeometry(t.size[0]/8,t.size[1]/8,t.size[2]/8),i=new THREE.Mesh(e,this.material)
i.castShadow=!0,i.receiveShadow=!0,i.limb=t,t.mesh=i
var s=t.size[0]/8,o=t.size[1]/8,n=t.size[2]/8,r=t.anchor[0],a=t.anchor[1],h=t.anchor[2]
return i.geometry.translate(-s/2,-o/2,-n/2),i.geometry.translate(r*s,a*o,h*n),i.rotation.order="ZYX",i},regenerateLimb:function(t){var e=t.mesh,i=e.parent,s=e.material
children=[],index=this.limbs.indexOf(e)
for(var o=0,n=e.children.length;o<n;o++)children.push(e.children[o])
i.remove(e),e.geometry.dispose(),e=this.buildLimb(t),e.material=s,children.forEach(function(t){e.add(t)}),i.add(e),this.mapUV(e),this.limbs[index]=e},mapUV:function(t){var e=t.limb,i=this.data,o=e.size[0],n=e.size[1],r=e.size[2],a=e.texture[0],h=i.h-(e.texture[1]+n+r)
s.cube(i.w,i.h,t.geometry,a,h,o,n,r,e.mirror)},build:function(){var t=this
this.limbs.length&&(this.limbs.forEach(function(t){t.parent.remove(t),t.geometry.dispose()}),this.limbs.length=0),this.model.limbs.forEach(function(e){var i=t.buildLimb(e)
t.mapUV(i),t.limbs.push(i),t.group.add(i)}),this.form()},form:function(){for(var t={},e=0,i=this.limbs.length;e<i;e++){var s=this.limbs[e].limb
t[s.id]=this.limbs[e].limb}for(var o in t){var s=t[o]
if(s.parent&&t[s.parent]){var n=t[s.parent]
s.mesh.parent.remove(s.mesh),n.mesh.add(s.mesh)}}},updateTexture:function(){var t=this
o.width=this.data.w,o.height=this.data.h,this.data.render(o.getContext("2d"),this.data.w,this.data.h),this.limbs.forEach(function(e){t.mapUV(e)}),this.material.map.needsUpdate=!0,this.material.needsUpdate=!0},toggleMaterial:function(t){var e=t?this.lightMaterial:this.flatMaterial,i=t?this.lightSelectedMaterial:this.flatSelectedMaterial
this.limbs.forEach(function(t){t.material=e}),this.material=e,this.selectedMaterial=i},updateAABB:function(t){var e=t.size[0],i=t.size[1],s=t.size[2]
this.aabb.geometry.dispose(),this.aabb.geometry=new THREE.BoxGeometry(2*e,2*i,2*s)}}},{"./3d/limb":5,"./3d/poses":8,"./3d/uv":10}],15:[function(t,e,i){var s=t("../dom"),o=e.exports=function(t,e){this.editor=t,this.model=t.app.actor,this.element=e,this.inputs=s.$$("input",e),this.pose=s.$(".mc-pose",e)}
o.prototype={init:function(){var t=this
this.inputs.forEach(function(e){s.on(e,"change",function(){t.change(this)})}),s.on(this.pose,"change",this.poseChange.bind(this)),this.fill()},clear:function(){this.pose.value="standing"},change:function(t){var e=t.name,i=this.editor.limb,s=this.current(),o=e.indexOf("_"),n=e.substr(0,o)
if(0==e.indexOf("size")){var r=["w","h","d"],a=r.indexOf(e.substr(o+1))
s.size[a]=parseFloat(t.value),this.editor.model.applyPose(s),this.editor.model.updateAABB(s)}else if(i){i=i.limb
var r=["x","y","z"],a=r.indexOf(e.substr(o+1)),h=parseFloat(t.value)
if("scale"==n&&h<=0)return alert("Scale values should be greater than 0.")
s.limbs[i.id][n][a]=h,this.editor.model.applyLimbPose(i,s)}this.editor.render()},poseChange:function(){var t=this.current()
this.editor.model.applyPose(t),this.editor.model.updateAABB(t),this.fill(),this.editor.render()},fill:function(){var t=this.editor.limb
if(!t)return this.inputs.forEach(function(t){0!=t.name.indexOf("size")&&(t.disabled=!0,t.value="")}),void this.fillSize()
var e=this.model.poses.getPoseForLimb(t.limb.id,this.pose.value),i=this.current(),s={size_w:i.size[0],size_h:i.size[1],size_d:i.size[2],translate_x:e.translate[0],translate_y:e.translate[1],translate_z:e.translate[2],scale_x:e.scale[0],scale_y:e.scale[1],scale_z:e.scale[2],rotate_x:e.rotate[0],rotate_y:e.rotate[1],rotate_z:e.rotate[2]}
this.inputs.forEach(function(t){t.disabled=!1,t.value=s[t.name]})},fillSize:function(){var t=this.current(),e={size_w:t.size[0],size_h:t.size[1],size_d:t.size[2]}
this.inputs.forEach(function(t){t.disabled=!1,e[t.name]&&(t.value=e[t.name])})},current:function(){return this.model.poses.get(this.pose.value)}}},{"../dom":2}],16:[function(t,e,i){var s=t("../dom"),o=t("./utils"),n=e.exports=function(t,e){this.editor=t,this.element=e,this.inputs=s.$$("[name]",e),this.parent=s.$("[name=parent]",e)}
n.prototype={init:function(){var t=this
this.inputs.forEach(function(e){s.on(e,"change",function(){t.change(this)})}),this.updateLimbs(),this.fill()},change:function(t){var e=this.editor.limb,i=t.name,s="checkbox"!=t.type?t.value:t.checked
if(e){e=e.limb
var o=i.split("_")
key=o.shift(),action=key+"Change",this[action]?this[action](e,s,i):e[key]=s}},idChange:function(t,e,i){return this.editor.app.actor.hasLimb(e)||""==e?alert('Limb with name "'+e+'" already exist!'):(this.editor.app.actor.poses.rename(t.id,e),t.id=e,this.updateLimbs(),this.editor.settings.updateLimbs(),void(this.parent.value=t.parent))},parentChange:function(t,e){if(e!=t.id){t.parent=e,t.mesh.parent.remove(t.mesh),(""==e?this.editor.model.group:this.editor.model.get(e)).add(t.mesh)
var i=this.editor.settings.poses.current()
this.editor.model.applyLimbPose(t,i)}},textureChange:function(t,e,i){var s=["x","y"].indexOf(i.substr(i.indexOf("_")+1))
t.texture[s]=parseInt(e),this.editor.update(),this.editor.app.texture.render()},mirrorChange:function(t,e){t.mirror=e,this.editor.update()},sizeChange:function(t,e,i){var s=["w","h","d"].indexOf(i.substr(i.indexOf("_")+1)),e=parseInt(e)
e>0&&(t.size[s]=e,this.regenerate(t),this.editor.render(),this.editor.app.texture.render())},anchorChange:function(t,e,i){var s=["x","y","z"].indexOf(i.substr(i.indexOf("_")+1))
t.anchor[s]=Math.clamp(parseFloat(e),0,1),this.regenerate(t)},regenerate:function(t){var e=this.editor.settings.poses.current()
this.editor.model.regenerateLimb(t),this.editor.limb=t.mesh,this.editor.model.applyLimbPose(t,e)},fill:function(){var t=this.editor.limb
if(!t)return this.empty()
t=t.limb
var e={id:t.id,parent:t.parent,holding:t.holding,looking:t.looking,swiping:t.swiping,swinging:t.swinging,idle:t.idle,texture_x:t.texture[0],texture_y:t.texture[1],mirror:t.mirror,size_w:t.size[0],size_h:t.size[1],size_d:t.size[2],anchor_x:t.anchor[0],anchor_y:t.anchor[1],anchor_z:t.anchor[2]}
this.inputs.forEach(function(t){var i=e[t.name]
"boolean"==typeof i?t.checked=i:t.value=i,t.disabled=!1})},empty:function(){this.inputs.forEach(function(t){t.value="",t.checked=!1,t.disabled=!0})},updateLimbs:function(){var t=document.createElement("option")
t.value="",t.text="None",this.parent.innerHTML="",this.parent.appendChild(t),o.populateLimbs(this.parent,this.editor.app.actor)}}},{"../dom":2,"./utils":24}],17:[function(t,e,i){var s=t("../dom"),o=t("../utils"),n=t("./utils"),r=t("../settings"),a=t("./poses"),h=t("./properties"),l=e.exports=function(t,e){r.call(this,t,e),this.properties=new h(t,s.$(".mc-limb",e)),this.poses=new a(t,s.$(".mc-poses",e)),this.inputs=s.$$("[data-section] [name]",e),this.limbs=s.$(".mc-limbs",e),this.file=s.$(".mc-model-input",e),this.settings.aabb=!1,this.settings.flat=!1,this.settings.shadow=!0,this.settings.lighting=!0}
o.extend(l,r,{init:function(){r.prototype.init.call(this),s.on(this.file,"change",this.importModel.bind(this)),this.properties.init(),this.poses.init(),this.updateLimbs(),this.fill()},exportAction:function(){var t=this.editor.app.actor.exportModel()
t.texture=[this.editor.app.skin.w,this.editor.app.skin.h],t=JSON.stringify(t,null,4).replace(/\n\s+(?=-?\d|\])/g," "),window.open("data:text/json,"+encodeURI(t))},importAction:function(){this.file.value=null,this.file.click()},importModel:function(){var t=new FileReader,e=this
t.onload=function(t){try{var i=JSON.parse(t.target.result)
e.editor.setLimb(null),e.editor.actor.importModel(i),e.editor.model.build(),e.editor.model.applyPose("standing"),e.editor.render(),e.editor.app.skin.resize(i.texture[0],i.texture[1]),e.editor.app.texture.reset(),e.editor.app.texture.settings.settings.size_w=i.texture[0],e.editor.app.texture.settings.settings.size_h=i.texture[1],e.editor.app.texture.settings.update(),e.poses.clear(),e.updateLimbs(),e.fill()}catch(t){alert("An error occured while importing the JSON model:\n"+t)}},t.readAsText(this.file.files[0])},renderAction:function(){window.open(this.editor.canvas.toDataURL("image/png"))},resetAction:function(){this.editor.model.group.rotation.set(0,0,0),this.editor.model.group.position.set(0,0,0),this.editor.render()},nameChange:function(t){this.editor.app.actor.name=t.value},aabbChange:function(t){this.editor.model.aabb.visible=t.checked,this.editor.render()},limbChange:function(t){this.editor.setLimb(this.editor.model.get(t.value)),this.limbs.blur()},flatChange:function(t){this.editor.camera.toggle(!t.checked),this.editor.render()},shadowChange:function(t){this.editor.renderer.shadowMap.enabled=t.checked,this.editor.render()},hdChange:function(t){var e=this.editor.light
e.shadow.map&&(e.shadow.mapSize.width=t.checked?2048:1024,e.shadow.mapSize.height=t.checked?2048:1024,e.shadow.map.dispose(),e.shadow.map=null)},lightingChange:function(t){this.editor.model.toggleMaterial(t.checked),this.editor.render()},fill:function(){var t=this.editor.app.actor.name
this.set(s.$("[name=name]",this.element),t),this.settings.name=t,this.properties.fill(),this.poses.fill(),this.updateLimbsValue()},updateLimbs:function(){var t=document.createElement("option")
t.value="",t.text="None",this.limbs.innerHTML="",this.limbs.appendChild(t),this.limbs.value="",n.populateLimbs(this.limbs,this.editor.app.actor),this.updateLimbsValue(),this.properties.updateLimbs()},updateLimbsValue:function(){this.limbs.value=this.editor.limb?this.editor.limb.limb.id:""}})},{"../dom":2,"../settings":25,"../utils":39,"./poses":15,"./properties":16,"./utils":24}],18:[function(t,e,i){e.exports={Move:t("./move"),Picker:t("./picker"),Translate:t("./translate"),Scale:t("./scale"),Rotate:t("./rotate")}},{"./move":19,"./picker":20,"./rotate":21,"./scale":22,"./translate":23}],19:[function(t,e,i){var s=e.exports=function(t){this.editor=t,this.model=t.model.group}
s.prototype={onMouseMove:function(t,e){var i=this.editor.app.key,s=i&&i.shiftKey,o=i&&i.altKey
t-=this.x,e-=this.y,s?(this.model.rotation.x=this.rx+e/90,this.model.rotation.z=this.rz-t/90):o?(this.model.position.x=this.tx+t/90,this.model.position.y=this.ty-e/90):(this.model.rotation.x=this.rx+e/90,this.model.rotation.y=this.ry+t/90),this.editor.render()},onMouseDown:function(t,e){this.x=t,this.y=e,this.rx=this.model.rotation.x||0,this.ry=this.model.rotation.y||0,this.rz=this.model.rotation.z||0,this.tx=this.model.position.x||0,this.ty=this.model.position.y||0}}},{}],20:[function(t,e,i){var s=e.exports=function(t){this.editor=t,this.raycaster=new THREE.Raycaster,this.mouse=new THREE.Vector2}
s.prototype={onMouseMove:function(t,e){},onMouseDown:function(t,e){this.mouse.x=t/this.editor.canvas.width*2-1,this.mouse.y=1-e/this.editor.canvas.height*2,this.raycaster.setFromCamera(this.mouse,this.editor.camera.camera)
var i=this.raycaster.intersectObjects(this.editor.model.limbs)
this.editor.setLimb(i.length>0?i[0].object:null)}}},{}],21:[function(t,e,i){var s=e.exports=function(t){this.editor=t,this.model=t.model,this.poses=t.settings.poses}
s.prototype={onMouseMove:function(t,e){var i=this.editor.limb
if(null!=i){i=i.limb
var s=this.editor.app.key,o=s&&s.shiftKey
t-=this.x,e-=this.y
var n=this.poses.current(),r=n.forLimb(i.id)
o?(r.rotate[0]=Math.floor(this.rx+e),r.rotate[1]=Math.floor(this.ry+t)):(r.rotate[0]=Math.floor(this.rx+e),r.rotate[2]=Math.floor(this.rz+t)),this.model.applyLimbPose(i,n),this.editor.render(),this.editor.settings.poses.fill()}},onMouseDown:function(t,e){var i=this.editor.limb
if(null!=i){var s=this.poses.current().forLimb(i.limb.id)
this.x=t,this.y=e,this.rx=s.rotate[0],this.ry=s.rotate[1],this.rz=s.rotate[2]}}}},{}],22:[function(t,e,i){var s=e.exports=function(t){this.editor=t,this.model=t.model,this.poses=t.settings.poses}
s.prototype={onMouseMove:function(t,e){var i=this.editor.limb
if(null!=i){i=i.limb,e-=this.y,e/=20
var s=this.poses.current(),o=s.forLimb(i.id),n=o.scale[0],r=o.scale[1],a=o.scale[2]
o.scale[0]=+Math.clamp(this.sx+e,0,1/0).toFixed(1),o.scale[1]=+Math.clamp(this.sy+e,0,1/0).toFixed(1),o.scale[2]=+Math.clamp(this.sz+e,0,1/0).toFixed(1),o.scale[0]<=0&&(o.scale[0]=n),o.scale[1]<=0&&(o.scale[1]=r),o.scale[2]<=0&&(o.scale[2]=a),this.model.applyLimbPose(i,s),this.editor.render(),this.editor.settings.poses.fill()}},onMouseDown:function(t,e){var i=this.editor.limb
if(null!=i){var s=this.poses.current().forLimb(i.limb.id)
this.y=e,this.sx=s.scale[0],this.sy=s.scale[1],this.sz=s.scale[2]}}}},{}],23:[function(t,e,i){var s=e.exports=function(t){this.editor=t,this.model=t.model,this.poses=t.settings.poses,this.vector=new THREE.Vector3(0,0,0)}
s.prototype={onMouseMove:function(t,e){var i=this.editor.limb
if(null!=i){i=i.limb
var s=this.editor.app.key,o=s&&s.shiftKey
t=(t-this.x)/24,e=(e-this.y)/24,this.vector.set(t,o?0:-e,o?e:0),this.vector.applyQuaternion(this.quat)
var n=this.poses.current(),r=n.forLimb(i.id)
r.translate[0]=Math.floor(10*(this.tx+this.vector.x))/10,r.translate[1]=Math.floor(10*(this.ty+this.vector.y))/10,r.translate[2]=Math.floor(10*(this.tz+this.vector.z))/10,this.model.applyLimbPose(i,n),this.editor.render(),this.editor.settings.poses.fill()}},onMouseDown:function(t,e){var i=this.editor.limb
if(null!=i){var s=this.poses.current().forLimb(i.limb.id)
this.x=t,this.y=e
var o=this.model.group.rotation.clone()
o.y*=-1,this.quat=new THREE.Quaternion,this.quat.setFromEuler(o),this.tx=s.translate[0],this.ty=s.translate[1],this.tz=s.translate[2]}}}},{}],24:[function(t,e,i){e.exports={populateLimbs:function(t,e){e.limbs.forEach(function(e){var i=document.createElement("option")
i.value=i.text=e.id,t.appendChild(i)})}}},{}],25:[function(t,e,i){var s=t("./dom"),o=e.exports=function(t,e){this.editor=t,this.element=e,this.settings={},this.inputs=s.$$("[name]",e),this.buttons=s.$$("[data-action]",e)}
o.prototype={init:function(){var t=this
this.inputs.forEach(function(e){s.on(e,"change",function(){t.settings[e.name]=t.get(e),t.notifyChanges(this)}),t.set(e,t.settings[e.name]),t.settings[e.name]=t.get(e)}),this.buttons.forEach(function(e){var i=e.dataset.action+"Action"
s.on(e,"click",function(){t[i]&&t[i](e)})})},set:function(t,e){"checkbox"==t.type?t.checked=Boolean(e):t.value=e},get:function(t){return"checkbox"==t.type?t.checked:t.value},toggle:function(){this.element.classList.toggle("hidden")},notifyChanges:function(t){var e=t.name.split("_"),i=e.shift()+"Change"
this[i]&&this[i](t,e)},update:function(){var t=this
this.inputs.forEach(function(e){"undefined"!=typeof t.settings[e.name]&&t.set(e,t.settings[e.name])})}}},{"./dom":2}],26:[function(t,e,i){var s=t("../dom"),o=(t("../utils"),e.exports=function(t,e,i){this.picker=t,this.input=s.$("input",e),this.canvas=s.$("canvas",e),this.ctx=this.canvas.getContext("2d"),this.index=i,this.factor=0==i?360:100,this.value=0,this.generateGradient()})
o.prototype={init:function(){var t=this
this.generateGradient(),this.render(),s.on(this.input,"change",function(){t.value=(parseInt(this.value)||0)/t.factor,t.value=Math.clamp(t.value,0,1),t.picker.colorChanged()})},click:function(t,e){var i=this.canvas.height/2
this.value=(t-i)/(this.canvas.width-2*i),this.value=Math.clamp(this.value,0,1),this.updateInput(),this.picker.colorChanged()},updateInput:function(){this.input.value=Math.floor(this.value*this.factor)},generateGradient:function(){var t=this.picker.primary.slice(),e=0==this.index?6:2
this.value=t[this.index],this.gradient=this.ctx.createLinearGradient(0,0,this.canvas.width,0)
for(var i=0;i<=e;i++)t[this.index]=i/e,this.gradient.addColorStop(i/e,Color.hsl(t[0],t[1],t[2],1).hsl())},render:function(){var t=this.canvas.width,e=this.canvas.height,i=this.ctx
i.clearRect(0,0,t,e),i.fillStyle=this.gradient,i.fillRect(0,0,t,e)
var s=e/2,o=s+this.value*(t-2*s)
i.strokeStyle="rgba(255, 255, 255, 0.6)",i.lineWidth=2.2,i.beginPath(),i.arc(o,s,.7*s,0,2*Math.PI),i.stroke()}}},{"../dom":2,"../utils":39}],27:[function(t,e,i){var s=t("../dom"),o=t("../utils"),n=t("../editor"),r=(t("../toolbar"),t("./tools")),a=t("./picker"),h=t("./settings"),l={80:"pencil",69:"eraser",67:"picker",66:"bucket",77:"move",90:"zoom"},c=e.exports=function(t,e){n.call(this,t,e),this.settings=new h(this,s.$(".mc-settings",e)),this.picker=new a(t.skin,s.$(".mc-colors",e)),this.canvas=s.$("#texture"),this.toolbar.map={pencil:new r.Pencil(this),eraser:new r.Eraser(this),picker:new r.Picker(this),bucket:new r.Bucket(this),move:new r.Move(this),zoom:new r.Zoom(this)},this.toolbar.set("pencil")}
o.extend(c,n,{init:function(){var t=this
n.prototype.init.call(this),h.renderImage(this).src="assets/img/actor.png",this.picker.init(),this.settings.init(),s.on(s.$(".mc-toggle-settings",this.element),"click",function(){t.settings.toggle()}),this.reset()},clear:function(){this.app.skin.reset(),this.render()},reset:function(){var t=this.canvas,e=8*this.app.skin.w,i=8*this.app.skin.h
t.width=e,t.height=i,t.style.marginLeft=-e/2+"px",t.style.marginTop=-i/2+"px",this.render()},render:function(){var t=this.canvas,e=t.getContext("2d"),i=t.width,s=t.height,o=this.app.skin.scale(i,s)
this.app.skin.render(e,i,s),this.settings.settings.grid&&o>2&&this.drawGrid(e,o,i,s),this.settings.settings.guides&&o>2&&null!=this.app.model.limb&&this.drawGuides(e,this.app.model.limb.limb,o)},drawGrid:function(t,e,i,s){t.fillStyle="#999"
for(var o=4,n=this.app.skin.w;o<n;o+=4)t.fillRect(o*e,0,1,s*e)
for(var o=4,n=this.app.skin.h;o<n;o+=4)t.fillRect(0,o*e,i*e,1)},drawGuides:function(t,e,i){t.fillStyle="red"
var e=this.app.model.limb.limb,s=e.texture[0],o=e.texture[1],n=e.size[0],r=e.size[1],a=e.size[2],h=1
t.fillRect(s*i,(o+a)*i,a*i+1,h),t.fillRect((s+a)*i,o*i,2*n*i,h),t.fillRect((s+a+2*n)*i,(o+a)*i,a*i,h),t.fillRect(s*i,(o+a)*i,h,r*i),t.fillRect((s+a)*i,o*i,h,a*i),t.fillRect((s+2*a+2*n)*i,(o+a)*i,h,r*i),t.fillRect((s+a+2*n)*i,o*i,h,a*i),t.fillRect(s*i,(o+a+r)*i,(2*a+2*n)*i,h)},onKey:function(t){var e=t.keyCode
l[e]&&this.toolbar.set(l[t.keyCode]),88==e&&this.picker.swap(),86==e&&this.picker.toggle(),83==e&&this.settings.toggle(),72==e&&this.app.hide(this,this.app.model)},onMouseMove:function(t,e,i){i.target!=this.element&&i.target!=this.canvas||this.toolbar.onMouseMove(t,e),this.picker.onMouseMove(t,e)},onMouseDown:function(t,e,i){i.target!=this.element&&i.target!=this.canvas||this.toolbar.onMouseDown(t,e),this.picker.onMouseMove(t,e)}})},{"../dom":2,"../editor":3,"../toolbar":38,"../utils":39,"./picker":28,"./settings":30,"./tools":33}],28:[function(t,e,i){var s=t("../dom"),o=t("../utils"),n=t("./bar"),r=e.exports=function(t,e){this.pixelData=t,this.colors=e,this.primary=[0,0,1,1],this.secondary=[0,0,0,1],this.fg=s.$(".mc-color-fg .mc-color-overlay",e),this.bg=s.$(".mc-color-bg .mc-color-overlay",e),this.bars=[new n(this,s.$(".mc-hue-bar",e),0),new n(this,s.$(".mc-saturation-bar",e),1),new n(this,s.$(".mc-lightness-bar",e),2)]}
r.prototype={init:function(){var t=this,e=this.toggle.bind(this)
s.on(this.fg,"click",e),s.on(this.bg,"click",e),s.on(s.$(".mc-color-css"),"change",function(){var e=o.parse(this.value)
this.value="",this.blur(),t.primary=Color.rgb(e[0],e[1],e[2]).hslData(),t.primary[3]=e[3],t.update()}),this.bars.forEach(function(t){t.init()}),this.update()},toggle:function(){s.$(".mc-color-picker",this.colors).classList.toggle("hidden")},swap:function(){var t=this.primary
this.primary=this.secondary,this.secondary=t,this.update()},update:function(){var t=Color.HSLtoRGB(this.primary),e=Color.HSLtoRGB(this.secondary)
t[3]=this.primary[3],e[3]=this.secondary[3],this.fg.style.backgroundColor=o.to_color(t),this.bg.style.backgroundColor=o.to_color(e),this.bars.forEach(function(t){t.generateGradient(),t.updateInput(),t.render()})},setColor:function(t){this.primary=Color.rgb(t[0],t[1],t[2],t[3]).hslData(),this.update()},colorChanged:function(){this.primary[0]=this.bars[0].value,this.primary[1]=this.bars[1].value,this.primary[2]=this.bars[2].value,this.update()},onMouseMove:function(t,e){for(var i=0,s=this.bars.length;i<s;i++){var o=this.bars[i],n=o.canvas.getBoundingClientRect(),r=t-n.left,a=e-n.top
if(r>=0&&r<o.canvas.width&&a>=0&&a<o.canvas.height){o.click(r,a)
break}}}}},{"../dom":2,"../utils":39,"./bar":26}],29:[function(t,e,i){var s=t("../utils"),o=[0,0,0,0],n=e.exports=function(t,e){this.w=t,this.h=e,this.reset()}
n.prototype={resize:function(t,e){var i=this.map.slice()
this.w=t,this.h=e
for(var s=0;s<this.h;s++){this.map[s]=[]
for(var n=0;n<this.w;n++)this.set(n,s,i[s]&&i[s][n]?i[s][n]:o)}},reset:function(){this.map=[]
for(var t=0;t<this.h;t++){this.map[t]=[]
for(var e=0;e<this.w;e++)this.set(e,t,o)}},set:function(t,e,i){this.inBound(t,e)&&(i=i.slice(),i.rgb=s.to_color(i),this.map[e][t]=i)},get:function(t,e){return this.inBound(t,e)?this.map[e][t]:null},inBound:function(t,e){return t>=0&&e>=0&&t<this.w&&e<this.h},scale:function(t,e){return Math.floor(Math.min(t/this.w,e/this.h))||1},render:function(t,e,i){for(var s=this.scale(e,i),o=0;o<this.w;o++)for(var n=0;n<this.h;n++)this.renderPixel(t,o,n,s)},renderPixel:function(t,e,i,s,o,n){t.fillStyle=this.map[i][e].rgb,o=void 0===o?e:o,n=void 0===n?i:n,t.clearRect(o*s,n*s,s,s),t.fillRect(o*s,n*s,s,s)},fromImageData:function(t){for(var e=t.data,i=0,s=e.length;i<s;i+=4){var o=i/4%t.width,n=Math.floor(i/4/t.width),r=e[i],a=e[i+1],h=e[i+2],l=e[i+3]
this.set(o,n,[r,a,h,l])}},pointToPixel:function(t,e,i){e-=t.offsetLeft+t.parentNode.offsetLeft,i-=t.offsetTop+t.parentNode.offsetTop
var s=t.width,o=t.height,n=this.scale(s,o)
return{x:Math.floor(e/n),y:Math.floor(i/n),scale:n}}}},{"../utils":39}],30:[function(t,e,i){function s(t){var e=new Image,i=t.app.skin.w,s=t.app.skin.h
return e.onload=function(){a.width=i,a.height=s
var o=a.getContext("2d")
o.drawImage(e,0,0),t.app.skin.fromImageData(o.getImageData(0,0,i,s)),t.render()},e}var o=t("../dom"),n=t("../utils"),r=t("../settings"),a=document.createElement("canvas"),h=e.exports=function(t,e){r.call(this,t,e),this.file=o.$(".mc-skin-input",e),this.settings.size_w=t.app.skin.w,this.settings.size_h=t.app.skin.h,this.clearAction=t.clear.bind(t),this.resetAction=t.reset.bind(t),this.sizeChange=this.resize.bind(this),this.gridChange=this.guidesChange=t.render.bind(t)}
n.extend(h,r,{init:function(){r.prototype.init.call(this),o.on(this.file,"change",this.importImage.bind(this))},resize:function(){var t=Math.clamp(parseInt(this.settings.size_w),0,1/0)>>0||0,e=Math.clamp(parseInt(this.settings.size_h),0,1/0)>>0||0
return 0==t||0==e?alert("You can't use zero as one of canvas' size components ("+this.settings.size_w+"x"+this.settings.size_h+")"):(this.editor.app.skin.resize(t,e),void this.editor.reset())},importImage:function(){var t=this,e=new FileReader
e.onload=function(e){s(t.editor).src=e.target.result},e.readAsDataURL(this.file.files[0])},importAction:function(){this.file.value=null,this.file.click()},exportAction:function(){var t=o.$(".mc-skin-export",this.element),e=this.editor.app.skin
a.width=e.w,a.height=e.h,e.render(a.getContext("2d"),e.w,e.h),t.classList.remove("hidden"),t.src=a.toDataURL("image/png")},generateAction:function(){function t(t,e,i,s,o,n){for(var r=0;r<s;r++)for(var a=0;a<o;a++)t.set(e+r,i+a,n)}var e=this.editor.app.skin
e.reset(),this.editor.app.actor.limbs.forEach(function(i){var s=[Math.random(),.25+.5*Math.random(),.5,1],o=s.slice(),n=s.slice(),r=s.slice(),a=s.slice(),h=s.slice()
o[2]=.7,r[2]=.6,a[2]=.4,h[2]=.3,o=Color.hsl.apply(null,o).rgbData(),n=Color.hsl.apply(null,n).rgbData(),r=Color.hsl.apply(null,r).rgbData(),a=Color.hsl.apply(null,a).rgbData(),h=Color.hsl.apply(null,h).rgbData()
var l=i.texture[0],c=i.texture[1],d=i.size[0],u=i.size[1],p=i.size[2]
t(e,l,c+p,p,u,n),t(e,l+p,c+p,d,u,r),t(e,l+p+d,c+p,p,u,n),t(e,l+2*p+d,c+p,d,u,a),t(e,l+p,c,d,p,o),t(e,l+p+d,c,d,p,h)}),this.editor.render()}}),e.exports.renderImage=s},{"../dom":2,"../settings":25,"../utils":39}],31:[function(t,e,i){function s(t,e,i){return Math.floor(t+e*i)}var o=t("../../utils"),n=e.exports=function(t){this.editor=t,this.pixelData=t.app.skin,this.canvas=t.canvas,this.picker=t.picker}
n.prototype={onMouseMove:function(t,e){},onMouseDown:function(t,e){var i=this.pixelData,s=i.pointToPixel(this.canvas,t,e)
if(t=s.x,e=s.y,!(t<0||t>=i.w||e<0||e>=i.h)){var o=this.picker.primary
o=Color.hsl(o[0],o[1],o[2]).rgbData(),this.fill(i,t,e,o),this.editor.render()}},fill:function(t,e,i,n){function r(e,i){var n=s(e,i,t.w)
e<0||e>=t.w||i<0||i>=t.h||l.indexOf(n)<0&&h.indexOf(n)<0&&o.to_color(t.get(e,i))==a&&h.push(n)}for(var a=o.to_color(t.get(e,i)),h=[s(e,i,t.w)],l=[];h.length;){var c=h.shift(),e=c%t.w,i=c/t.w>>0
r(e+1,i),r(e-1,i),r(e,i+1),r(e,i-1),l.push(c)}l.forEach(function(e){var i=e%t.w,s=e/t.w>>0
t.set(i,s,n)})}}},{"../../utils":39}],32:[function(t,e,i){var s=e.exports=function(t){this.pixelData=t.app.skin,this.canvas=t.canvas}
s.prototype={onMouseMove:function(t,e){this.onMouseDown(t,e)},onMouseDown:function(t,e){var i=this.pixelData,s=i.pointToPixel(this.canvas,t,e)
t=s.x,e=s.y,t<0||t>=i.w||e<0||e>=i.h||(i.set(t,e,[0,0,0,0]),i.renderPixel(this.canvas.getContext("2d"),t,e,s.scale))}}},{}],33:[function(t,e,i){e.exports={Pencil:t("./pencil"),Eraser:t("./eraser"),Picker:t("./picker"),Bucket:t("./bucket"),Move:t("./move"),Zoom:t("./zoom")}},{"./bucket":31,"./eraser":32,"./move":34,"./pencil":35,"./picker":36,"./zoom":37}],34:[function(t,e,i){var s=e.exports=function(t){this.canvas=t.canvas}
s.prototype={onMouseMove:function(t,e){t=this.marginLeft-(this.x-t),e=this.marginTop-(this.y-e),this.canvas.style.marginLeft=t+"px",this.canvas.style.marginTop=e+"px"},onMouseDown:function(t,e){this.x=t,this.y=e,this.marginLeft=parseInt(this.canvas.style.marginLeft)||-this.canvas.width/2,this.marginTop=parseInt(this.canvas.style.marginTop)||-this.canvas.height/2}}},{}],35:[function(t,e,i){var s=e.exports=function(t){this.pixelData=t.app.skin,this.canvas=t.canvas,this.picker=t.picker}
s.prototype={onMouseMove:function(t,e){this.onMouseDown(t,e)},onMouseDown:function(t,e){var i=this.pixelData,s=i.pointToPixel(this.canvas,t,e)
if(t=s.x,e=s.y,!(t<0||t>=i.w||e<0||e>=i.h)){var o=this.picker.primary
i.set(t,e,Color.hsl(o[0],o[1],o[2]).rgbData()),i.renderPixel(this.canvas.getContext("2d"),t,e,s.scale)}}}},{}],36:[function(t,e,i){var s=e.exports=function(t){this.editor=t,this.pixelData=t.app.skin,this.canvas=t.canvas}
s.prototype={onMouseMove:function(t,e){},onMouseDown:function(t,e){var i=this.pixelData,s=i.pointToPixel(this.canvas,t,e)
t=s.x,e=s.y,t<0||t>=i.w||e<0||e>=i.h||this.editor.picker.setColor(i.get(t,e))}}},{}],37:[function(t,e,i){var s=e.exports=function(t){this.editor=t,this.canvas=t.canvas}
s.prototype={onMouseMove:function(t,e){},onMouseDown:function(t,e){var i=this.editor.app.key,s=i&&i.shiftKey?.5:2,o=this.canvas.width*s,n=this.canvas.height*s
if(!(o>2048||o<this.editor.app.skin.w||n>2048||n<this.editor.app.skin.h)){var r=this.editor.app.skin,a=r.pointToPixel(this.canvas,t,e),h=parseInt(this.canvas.style.marginLeft)||0,l=parseInt(this.canvas.style.marginTop)||0,c=a.x/r.w,d=a.y/r.h
2==s?(c=1-c,d=1-d,this.canvas.style.marginLeft=h+this.canvas.width*c-o/2+"px",this.canvas.style.marginTop=l+this.canvas.height*d-n/2+"px"):(this.canvas.style.marginLeft=h-o*c+this.canvas.width*c+"px",this.canvas.style.marginTop=l-n*d+this.canvas.height*d+"px"),this.canvas.width=o,this.canvas.height=n,this.editor.render()}}}},{}],38:[function(t,e,i){var s=t("./dom"),o=e.exports=function(t,e){this.editor=t,this.element=e,this.tools=s.$$("[data-tool]",e),this.current="",this.map={}}
o.prototype={init:function(){var t=this
this.tools.forEach(function(e){s.on(e,"click",function(){t.set(this)})})},set:function(t){"string"==typeof t&&(t=s.$("[data-tool='"+t+"']",this.element)),this.current=t.dataset.tool,this.tools.forEach(function(e){var i=t.dataset.tool==e.dataset.tool
e.classList.toggle("mc-tool-selected",i)})},getCurrent:function(){return this.map[this.current]},onMouseMove:function(t,e){this.getCurrent().onMouseMove(t,e)},onMouseDown:function(t,e){this.getCurrent().onMouseDown(t,e)}}},{"./dom":2}],39:[function(t,e,i){var s=document.createElement("canvas")
e.exports={extend:function(t,e,i){t.prototype=Object.create(e.prototype)
for(var s in i)t.prototype[s]=i[s]},to_color:function(t){var e=t[0],i=t[1],s=t[2],o=t[3]
return"undefined"==typeof o&&(o=1),"rgba("+Math.floor(e)+","+Math.floor(i)+","+Math.floor(s)+","+o+")"},parse:function(t){var e=s.getContext("2d")
e.fillStyle=t,e.clearRect(0,0,1,1),e.fillRect(0,0,1,1)
var i=e.getImageData(0,0,1,1).data
return[i[0],i[1],i[2],i[3]/255]},extract:function(t,e){var i={}
for(var s in t)e.indexOf(s)!=-1&&(i[s]=t[s])
return i},merge:function(t,e){for(var i in e)t[i]=e[i]}}},{}]},{},[4])(4)})
