import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

export function createTitleStage(parent){
 const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.domElement.id='titleStage';renderer.domElement.style.cssText='position:absolute;pointer-events:none';parent.prepend(renderer.domElement);
 const scene=new THREE.Scene();scene.background=new THREE.Color(0x05050d);
 let camera,mixer,visible=true,settings,animationTime=0;
 function resize(){if(!camera)return;const fit=Math.min(innerWidth/settings.localcoord[0],innerHeight/settings.localcoord[1]),width=settings.localcoord[0]*fit,height=settings.localcoord[1]*fit;renderer.setSize(width,height,false);Object.assign(renderer.domElement.style,{width:width+'px',height:height+'px',left:(innerWidth-width)/2+'px',top:(innerHeight-height)/2+'px'});camera.aspect=width/height;camera.updateProjectionMatrix()}
 const ready=Promise.all([fetch('./title_stage.json?v=02354').then(response=>{if(!response.ok)throw Error('Title settings HTTP '+response.status);return response.json()}),fetch('./Title.glb.gz?v=02354').then(async response=>{if(!response.ok)throw Error('Title model HTTP '+response.status);return new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer()})]).then(async ([config,buffer])=>{
  settings=config;camera=new THREE.PerspectiveCamera(config.fov,config.localcoord[0]/config.localcoord[1],.01,500);camera.position.set(0,0,0);camera.lookAt(0,0,-1);
  const model=await new GLTFLoader().parseAsync(buffer,'./');model.scene.position.fromArray(config.offset);model.scene.scale.fromArray(config.scale);scene.add(model.scene);
  mixer=new THREE.AnimationMixer(model.scene);for(const clip of model.animations)mixer.clipAction(clip).play();resize();renderer.render(scene,camera);
 });
 window.addEventListener('resize',resize);
 return {ready,setVisible:value=>{visible=value;renderer.domElement.hidden=!value},render:dt=>{if(!visible||!camera)return;if(mixer){mixer.update(dt);animationTime+=dt}renderer.render(scene,camera)},snapshot:()=>({loaded:!!mixer,visible,animationTime,animations:settings?.animations})};
}
