const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),zlib=require('node:zlib');
const path=require('node:path'),root=path.resolve(__dirname,'..');
const buffer=zlib.gunzipSync(fs.readFileSync(path.join(root,'Stage/Millennium/StageMoon.glb.gz')));
assert.equal(buffer.readUInt32LE(0),0x46546c67);
assert.equal(buffer.readUInt32LE(8),buffer.length);
const document=JSON.parse(buffer.subarray(20,20+buffer.readUInt32LE(12)).toString());
assert.ok(document.images.every(image=>image.mimeType==='image/webp'));
assert.ok(document.extensionsRequired.includes('EXT_texture_webp'));
const config=JSON.parse(fs.readFileSync(path.join(root,'Stage/Millennium/stage-camera.json')));
assert.equal(config.camera.boundleft,-700);
assert.equal(config.camera.zoomout,.625);
const source=fs.readFileSync(path.join(root,'index.html'),'utf8');
const prepare=source.match(/async function prepareStage[^\n]+/)[0];
const training={name:'training'},moon={name:'moon',scale:{setScalar:value=>moon.scaleValue=value}},scene={current:training,remove(){},add(value){this.current=value}};
const sandbox={stageModel:training,activeStage:'training',stageCache:new Map(),mix:{},stageCameraConfig:{camera:{boundleft:-2850},player:{leftbound:-4350,rightbound:4350},bound:{}},STAGE_CAMERA:{},STAGE_PLAYER:{},s:scene,applyCamera(){},fetch:async url=>({ok:true,body:{pipeThrough(){}},json:async()=>config}),Response:class{async arrayBuffer(){return buffer}},DecompressionStream:class{},GLTFLoader:class{parse(bytes,base,resolve){resolve({scene:moon,animations:[]})}},THREE:{AnimationMixer:class{}},console};
vm.createContext(sandbox);vm.runInContext(prepare,sandbox);
(async()=>{await sandbox.prepareStage('moon');assert.equal(scene.current,moon);assert.equal(moon.scaleValue,.125);assert.equal(sandbox.STAGE_CAMERA.boundleft,-700);await sandbox.prepareStage('training');assert.equal(scene.current,training);assert.equal(sandbox.STAGE_CAMERA.boundleft,-2850);console.log('Moon GLB/WebP, dedicated camera and cached stage switching passed')})().catch(error=>{console.error(error);process.exitCode=1});

