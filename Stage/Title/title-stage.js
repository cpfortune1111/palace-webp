import {createWinnerFireworks} from './winner-fireworks.js?v=02381';
import {assetUrl} from '../../Engine/asset-paths.js?v=02362';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {Reflector} from 'three/addons/objects/Reflector.js';

export function createTitleStage(parent){
 const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.localClippingEnabled=true;
 renderer.domElement.id='titleStage';renderer.domElement.style.cssText='position:absolute;pointer-events:none';parent.prepend(renderer.domElement);
 const scene=new THREE.Scene();scene.background=new THREE.Color(0x05050d);
 const fireworks=createWinnerFireworks(scene);
 let camera,mixer,visible=true,settings,animationTime=0,oceanReflection;
 let frontClouds=false,behindEarthMeteors=false,oceanOcclusion=false;
 function fixPlanetLayers(model){
  model.traverse(node=>{
   if(!node.isMesh)return;
   const materials=(Array.isArray(node.material)?node.material:[node.material]).map(material=>material.clone());node.material=Array.isArray(node.material)?materials:materials[0];
   if(/^sky/i.test(node.name))for(const material of materials)material.depthWrite=false;
   if(/earth/i.test(node.name))for(const material of materials)material.side=THREE.FrontSide;
   if(/earth.*(cloud|blue)/i.test(node.name)){for(const material of materials){material.side=THREE.FrontSide;material.depthWrite=false}node.renderOrder=5;if(/cloud/i.test(node.name))frontClouds=true}
   if(materials.some(material=>/shooting.?star/i.test(material.name))){
    for(const material of materials){material.depthTest=true;material.depthWrite=false;material.onBeforeCompile=shader=>{shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\ngl_Position.z=gl_Position.w*0.999;')};material.customProgramCacheKey=()=> 'title-meteor-background'}node.renderOrder=2;behindEarthMeteors=true;
   }
  });
  const earth=model.getObjectByName('Earth_Main')||model.getObjectByName('Earth Main');
  if(!earth?.isMesh)throw Error('Title Earth mesh not found');
  const occluder=new THREE.Mesh(earth.geometry,new THREE.MeshBasicMaterial({colorWrite:false,depthWrite:true,side:THREE.FrontSide}));occluder.name='TitleEarthDepthOccluder';earth.add(occluder);
 }
 function addOceanReflection(model){
  model.updateMatrixWorld(true);let ocean;model.traverse(node=>{if(node.isMesh&&/ocean/i.test(node.name))ocean=node});if(!ocean)throw Error('Title Ocean mesh not found');
  for(const material of Array.isArray(ocean.material)?ocean.material:[ocean.material]){material.side=THREE.FrontSide;material.depthWrite=false}
  const bounds=new THREE.Box3().setFromBufferAttribute(ocean.geometry.getAttribute('position')).applyMatrix4(ocean.matrixWorld),size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3());
  const waterPlane=new THREE.Plane(new THREE.Vector3(0,1,0),-center.y);model.traverse(node=>{if(!node.isMesh)return;for(const material of Array.isArray(node.material)?node.material:[node.material])if(/shooting.?star/i.test(material.name))material.clippingPlanes=[waterPlane]});oceanOcclusion=true;
  const shader={...Reflector.ReflectorShader,uniforms:{...Reflector.ReflectorShader.uniforms,time:{value:0}},fragmentShader:`uniform sampler2D tDiffuse;uniform float time;varying vec4 vUv;
   void main(){vec2 uv=vUv.xy/vUv.w;uv.x+=sin(uv.y*180.0+time*1.3)*0.0012;uv.y+=sin(uv.x*110.0-time)*0.0005;vec2 blur=vec2(2.0/1024.0,2.0/576.0);vec3 reflected=texture2D(tDiffuse,uv).rgb*0.4;reflected+=(texture2D(tDiffuse,uv+vec2(blur.x,0.0)).rgb+texture2D(tDiffuse,uv-vec2(blur.x,0.0)).rgb+texture2D(tDiffuse,uv+vec2(0.0,blur.y)).rgb+texture2D(tDiffuse,uv-vec2(0.0,blur.y)).rgb)*0.15;gl_FragColor=vec4(reflected*vec3(0.55,0.65,0.75),0.42);
   #include <tonemapping_fragment>
   #include <colorspace_fragment>
   }`};
  oceanReflection=new Reflector(new THREE.PlaneGeometry(size.x,size.z),{textureWidth:1024,textureHeight:576,multisample:0,clipBias:.001,shader});
  oceanReflection.rotation.x=-Math.PI/2;oceanReflection.position.set(center.x,center.y+.0002,center.z);oceanReflection.material.transparent=true;oceanReflection.material.depthWrite=false;oceanReflection.renderOrder=100;scene.add(oceanReflection);
  const reflect=oceanReflection.onBeforeRender;oceanReflection.onBeforeRender=(renderer,scene,camera)=>{const visible=ocean.visible;ocean.visible=false;try{reflect.call(oceanReflection,renderer,scene,camera)}finally{ocean.visible=visible}};
 }
 function resize(){if(!camera)return;const fit=Math.min(innerWidth/settings.localcoord[0],innerHeight/settings.localcoord[1]),width=settings.localcoord[0]*fit,height=settings.localcoord[1]*fit;renderer.setSize(width,height,false);Object.assign(renderer.domElement.style,{width:width+'px',height:height+'px',left:(innerWidth-width)/2+'px',top:(innerHeight-height)/2+'px'});camera.aspect=width/height;camera.updateProjectionMatrix()}
 const ready=Promise.all([fetch(assetUrl('./title_stage.json?v=02362')).then(response=>{if(!response.ok)throw Error('Title settings HTTP '+response.status);return response.json()}),fetch(assetUrl('./Title.glb.gz?v=02362')).then(async response=>{if(!response.ok)throw Error('Title model HTTP '+response.status);return new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer()})]).then(async ([config,buffer])=>{
  await fireworks.ready;settings=config;camera=new THREE.PerspectiveCamera(config.fov,config.localcoord[0]/config.localcoord[1],.01,500);camera.position.set(0,-.825,0);camera.rotation.set(THREE.MathUtils.degToRad(2.5),0,0);
  const model=await new GLTFLoader().parseAsync(buffer,'./');model.scene.position.fromArray(config.offset);model.scene.scale.fromArray(config.scale);scene.add(model.scene);
  model.scene.updateMatrixWorld(true);const castleBounds=new THREE.Box3();model.scene.traverse(node=>{if(node.isMesh&&/^(Stage P|Column|Main Column|Forecourt)/i.test(node.name))castleBounds.union(new THREE.Box3().setFromObject(node))});if(!castleBounds.isEmpty())fireworks.setOrigin(castleBounds);
  fixPlanetLayers(model.scene);mixer=new THREE.AnimationMixer(model.scene);for(const clip of model.animations)mixer.clipAction(clip).play();addOceanReflection(model.scene);resize();renderer.render(scene,camera);
 });
 window.addEventListener('resize',resize);
 return {ready,setWinner:fireworks.setWinner,setTravel:amount=>{if(camera){camera.position.set(0,-.825+amount*.2,-amount*16);camera.rotation.set(THREE.MathUtils.degToRad(2.5),0,0)}},setVisible:value=>{visible=value;renderer.domElement.hidden=!value},render:dt=>{if(!visible||!camera)return;if(mixer){mixer.update(dt);animationTime+=dt}fireworks.render(dt);if(oceanReflection)oceanReflection.material.uniforms.time.value=animationTime;renderer.render(scene,camera)},snapshot:()=>({loaded:!!mixer,visible,animationTime,animations:settings?.animations,reflectiveOcean:!!oceanReflection,frontClouds,behindEarthMeteors,oceanOcclusion,fireworks:fireworks.snapshot()})};
}

