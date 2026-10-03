import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {Reflector} from 'three/addons/objects/Reflector.js';

export function createTitleStage(parent){
 const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.domElement.id='titleStage';renderer.domElement.style.cssText='position:absolute;pointer-events:none';parent.prepend(renderer.domElement);
 const scene=new THREE.Scene();scene.background=new THREE.Color(0x05050d);
 let camera,mixer,visible=true,settings,animationTime=0,oceanReflection;
 function addOceanReflection(model){
  model.updateMatrixWorld(true);let ocean;model.traverse(node=>{if(node.isMesh&&/ocean/i.test(node.name))ocean=node});if(!ocean)throw Error('Title Ocean mesh not found');
  const bounds=new THREE.Box3().setFromBufferAttribute(ocean.geometry.getAttribute('position')).applyMatrix4(ocean.matrixWorld),size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3());
  const shader={...Reflector.ReflectorShader,uniforms:{...Reflector.ReflectorShader.uniforms,time:{value:0}},fragmentShader:`uniform sampler2D tDiffuse;uniform float time;varying vec4 vUv;
   void main(){vec2 uv=vUv.xy/vUv.w;uv.x+=sin(uv.y*180.0+time*1.3)*0.0012;uv.y+=sin(uv.x*110.0-time)*0.0005;vec3 reflected=texture2D(tDiffuse,uv).rgb;gl_FragColor=vec4(reflected*vec3(0.8,0.9,1.0),0.5);
   #include <tonemapping_fragment>
   #include <colorspace_fragment>
   }`};
  oceanReflection=new Reflector(new THREE.PlaneGeometry(size.x,size.z),{textureWidth:1024,textureHeight:576,multisample:0,clipBias:.001,shader});
  oceanReflection.rotation.x=-Math.PI/2;oceanReflection.position.set(center.x,center.y+.0002,center.z);oceanReflection.material.transparent=true;oceanReflection.material.depthWrite=false;oceanReflection.renderOrder=100;scene.add(oceanReflection);
  const reflect=oceanReflection.onBeforeRender;oceanReflection.onBeforeRender=(renderer,scene,camera)=>{const visible=ocean.visible;ocean.visible=false;try{reflect.call(oceanReflection,renderer,scene,camera)}finally{ocean.visible=visible}};
 }
 function resize(){if(!camera)return;const fit=Math.min(innerWidth/settings.localcoord[0],innerHeight/settings.localcoord[1]),width=settings.localcoord[0]*fit,height=settings.localcoord[1]*fit;renderer.setSize(width,height,false);Object.assign(renderer.domElement.style,{width:width+'px',height:height+'px',left:(innerWidth-width)/2+'px',top:(innerHeight-height)/2+'px'});camera.aspect=width/height;camera.updateProjectionMatrix()}
 const ready=Promise.all([fetch('./title_stage.json?v=02355').then(response=>{if(!response.ok)throw Error('Title settings HTTP '+response.status);return response.json()}),fetch('./Title.glb.gz?v=02355').then(async response=>{if(!response.ok)throw Error('Title model HTTP '+response.status);return new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer()})]).then(async ([config,buffer])=>{
  settings=config;camera=new THREE.PerspectiveCamera(config.fov,config.localcoord[0]/config.localcoord[1],.01,500);camera.position.set(0,0,0);camera.lookAt(0,0,-1);
  const model=await new GLTFLoader().parseAsync(buffer,'./');model.scene.position.fromArray(config.offset);model.scene.scale.fromArray(config.scale);scene.add(model.scene);
  mixer=new THREE.AnimationMixer(model.scene);for(const clip of model.animations)mixer.clipAction(clip).play();addOceanReflection(model.scene);resize();renderer.render(scene,camera);
 });
 window.addEventListener('resize',resize);
 return {ready,setVisible:value=>{visible=value;renderer.domElement.hidden=!value},render:dt=>{if(!visible||!camera)return;if(mixer){mixer.update(dt);animationTime+=dt}if(oceanReflection)oceanReflection.material.uniforms.time.value=animationTime;renderer.render(scene,camera)},snapshot:()=>({loaded:!!mixer,visible,animationTime,animations:settings?.animations,reflectiveOcean:!!oceanReflection})};
}
