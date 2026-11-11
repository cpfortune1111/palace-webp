import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
let shared;
export function versusPose(ticks,exitAge=null){if(exitAge!==null){const t=Math.min(1,Math.max(0,exitAge/56));return {angle:-Math.PI*6-Math.PI*3.5*t,height:.2*(1-t),turns:3+1.75*t,fade:Math.min(1,Math.max(0,(exitAge-48)/18))}}const t=Math.min(1,Math.max(0,ticks/96));return {angle:-Math.PI*6*t,height:.6-.4*t,turns:3*t,fade:0}}
export function createVersusModel(){if(shared)return shared;const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true,powerPreference:'low-power'});renderer.setPixelRatio(1);renderer.setSize(1280,720,false);renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1;
const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-16/9,16/9,1,-1,.01,100);camera.position.set(0,0,10);camera.lookAt(0,0,0);const pivot=new THREE.Group();scene.add(pivot);const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment();
const panels=[
 [0xffffff,7,3,0.7,-2,1.8,4],
 [0xff9dd9,4,1.2,3,2.4,0,4],
 [0x9e85ff,2,4,1,0,-2,3],
];
for(const [color,intensity,width,height,x,y,z] of panels){
 const panel=new THREE.Mesh(new THREE.PlaneGeometry(width,height),new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide}));
 panel.material.color.multiplyScalar(intensity);
 panel.position.set(x,y,z);panel.lookAt(0,0,0);room.add(panel);
}
const environment=pmrem.fromScene(room,.015);scene.environment=environment.texture;scene.environmentIntensity=1.15;room.dispose();pmrem.dispose();scene.add(new THREE.HemisphereLight(0xffffff,0x433047,1));const light=new THREE.DirectionalLight(0xffffff,3);light.position.set(-3,4,5);scene.add(light);const rim=new THREE.DirectionalLight(0xffffff,1.5);rim.position.set(4,-1,3);scene.add(rim);let modelHeight=1,loaded=false,lastAngle,lastHeight,renderCount=0,materials=[];
const ready=(async()=>{const response=await fetch('./Data/VS/VS.glb.gz?v=02408r36');if(!response.ok)throw Error('VS model HTTP '+response.status);const bytes=await new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer(),gltf=await new GLTFLoader().parseAsync(bytes,'./');gltf.scene.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(gltf.scene),center=bounds.getCenter(new THREE.Vector3());modelHeight=bounds.max.y-bounds.min.y;if(!(modelHeight>0))throw Error('VS model has no height');gltf.scene.position.sub(center);gltf.scene.traverse(node=>{if(node.isMesh)for(const m of Array.isArray(node.material)?node.material:[node.material]){m.metalness=Math.max(.84,m.metalness);m.roughness=Math.min(.25,Math.max(.16,m.roughness));m.onBeforeCompile=shader=>{
 shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`
  float axis=(gl_FragCoord.y-360.0)+(gl_FragCoord.x-640.0)*.24;
  float band=(axis-18.0)/34.0;
  float gleam=(axis-27.0)/8.0;
  outgoingLight=outgoingLight*(.42+.85*exp(-band*band))
   +vec3(1.0,.65,.86)*exp(-gleam*gleam)*.9;
  #include <opaque_fragment>`);
};materials.push({name:m.name,color:m.color.getHexString(),metalness:m.metalness,roughness:m.roughness,clearcoat:m.clearcoat})}});pivot.add(gltf.scene);loaded=true;return shared})();
function draw(context,pose){if(!loaded||pose.height<=0)return;if(pose.angle!==lastAngle||pose.height!==lastHeight){pivot.rotation.y=pose.angle;pivot.scale.setScalar(2*pose.height/modelHeight);renderer.render(scene,camera);lastAngle=pose.angle;lastHeight=pose.height;renderCount++}context.drawImage(renderer.domElement,0,0,1280,720)}
shared={ready,draw,snapshot:()=>({loaded,materials,modelHeight,angle:lastAngle,height:lastHeight,renderCount}),canvas:renderer.domElement};return shared}
