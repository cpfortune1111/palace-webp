// Actual Web simulation probe. Test-owned RNG interception is not production determinism.
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PALACE_PLAYWRIGHT_MODULE||'C:/Users/jeffy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const output=process.argv[2];if(!output)throw Error('Usage: node check-runtime-trace-repeatability.cjs <private report.json>');
const driverSha256=crypto.createHash('sha256').update(fs.readFileSync(__filename)).digest('hex');
fs.writeFileSync(output,JSON.stringify({status:'running',driverSha256,goalComplete:false})+'\n');
const root=path.resolve(__dirname,'..'),vendor=path.resolve(root,'../outputs/three-r180');
const sourceManifest=new Map(),sourceChanges=[];
const server=http.createServer((request,response)=>{
 const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname),base=pathname.startsWith('/vendor/')?vendor:root,file=path.resolve(base,pathname.startsWith('/vendor/')?pathname.slice(8):'.'+(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(base+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){response.writeHead(404);response.end();return}
 let content=fs.readFileSync(file);if(['.html','.js','.json'].includes(path.extname(file))){const key=path.relative(base,file).replaceAll('\\','/'),identity=(base===vendor?'vendor/':'work/')+key,hash=crypto.createHash('sha256').update(content).digest('hex');if(sourceManifest.has(identity)&&sourceManifest.get(identity)!==hash)sourceChanges.push(identity);sourceManifest.set(identity,hash)}
 if(file===path.join(root,'index.html'))content=Buffer.from(content.toString().replaceAll('https://cdn.jsdelivr.net/npm/three@0.180.0/','/vendor/').replaceAll('requestAnimationFrame(loop);','').replace('</script></body>',`window.runtimeRepeatabilityTest={run:source=>eval(source)};</script></body>`));
 response.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');response.end(content);
});
function canonical(value){
 if(typeof value==='number'){if(Number.isNaN(value))return {$number:'NaN'};if(!Number.isFinite(value))return {$number:String(value)};if(Object.is(value,-0))return {$number:'-0'};return value}
 if(value===undefined)return {$undefined:true};if(value===null||typeof value==='string'||typeof value==='boolean')return value;
 if(Array.isArray(value))return value.map(canonical);
 assert.equal(typeof value,'object','Unsupported trace value type');assert([Object.prototype,null].includes(Object.getPrototypeOf(value)),'Unsupported trace object prototype');return Object.fromEntries(Object.keys(value).sort().map(key=>[key,canonical(value[key])]));
}
function difference(a,b,location='$'){
 if(JSON.stringify(a)===JSON.stringify(b))return null;
 if(Array.isArray(a)&&Array.isArray(b)){for(let index=0;index<Math.max(a.length,b.length);index++){const diff=difference(a[index],b[index],location+'['+index+']');if(diff)return diff}return {path:location+'.length',first:String(a.length),second:String(b.length)}}
 if(a&&b&&typeof a==='object'&&typeof b==='object')for(const key of [...new Set([...Object.keys(a),...Object.keys(b)])].sort()){const diff=difference(a[key],b[key],location+'.'+key);if(diff)return diff}
 return {path:location,first:JSON.stringify(a)?.slice(0,300),second:JSON.stringify(b)?.slice(0,300)};
}
const tape=[{tick:0,player:1,state:1000},{tick:30,player:2,state:1000},{tick:150,player:1,state:3000},{tick:200,player:2,state:3000}];
async function runTrial(browser,url,seed){
 const context=await browser.newContext({viewport:{width:1280,height:720}}),page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
 try{
  await page.goto(url);await page.waitForFunction(()=>window.runtimeRepeatabilityTest?.run('!!dat&&!!stateIR&&!!battleDat&&!!lifecycleDat&&!!specialDat&&!!roundCharDat&&!!cmdDat&&!!airDat&&!!fallDat&&!!guardDat&&!!turnDat'),null,{timeout:90000});
  const run=source=>page.evaluate(source=>window.runtimeRepeatabilityTest.run(source),source);await run("prepareCharacters(['SailorMoon','SailorVenus'])");
  const frames=await run(`(()=>{
   const seed=${seed},tape=${JSON.stringify(tape)},legacy=createNativeRandom(seed),originalRandom=Math.random;
   let measuring=false,currentEvents=null,randomCalls=0;
   function snapshot(value,seen=new WeakSet(),where='$'){
    if(value===null||['undefined','number','string','boolean'].includes(typeof value))return value;
    if(typeof value!=='object'||seen.has(value))throw Error('Unsupported/cyclic trace value at '+where);
    if(!Array.isArray(value)&&![Object.prototype,null].includes(Object.getPrototypeOf(value)))throw Error('Unsupported trace object at '+where);
    seen.add(value);const copy=Array.isArray(value)?value.map((item,index)=>snapshot(item,seen,where+'['+index+']')):Object.fromEntries(Object.keys(value).map(key=>[key,snapshot(value[key],seen,where+'.'+key)]));seen.delete(value);return copy;
   }
   const probe={nested:[{value:1}]},probeCopy=snapshot(probe);probe.nested[0].value=2;if(probeCopy.nested[0].value!==1)throw Error('Trace snapshot alias');
   let rejected=false;try{snapshot(new Map())}catch{rejected=true}if(!rejected)throw Error('Trace must reject unsupported Map values');
   const mark=name=>{if(currentEvents)currentEvents.push(name)};
   const wrap=(name,fn)=>function(...args){mark(name);return fn.apply(this,args)};
   simStep=wrap('simStep',simStep);simStepCore=wrap('simStepCore',simStepCore);stepLifecycleGlobals=wrap('lifecycleGlobals',stepLifecycleGlobals);stepP2M1=wrap('p2State',stepP2M1);consumeRootHitOffsets=wrap('hitOffsets',consumeRootHitOffsets);stepAfterImages=wrap('afterimages',stepAfterImages);updateCamera=wrap('camera',updateCamera);
   const originalEffects=stepSourceExplods;stepSourceExplods=function(bound=false){mark(bound?'boundEffects':'effects');return originalEffects(bound)};
   specialRuntime.step=wrap('entities',specialRuntime.step);specialRuntime.finishTick=wrap('entityFinish',specialRuntime.finishTick);roundFlow.step=wrap('roundFlow',roundFlow.step);
   Math.random=()=>{if(!measuring)return originalRandom();randomCalls++;return legacy.next()/2147483647};
   try{
    if(roundFlow.snapshot().phase!=='training')throw Error('Fresh fixture requires initial training phase');
    resetPlayerInput();specialRuntime.reset();sourceExplods.length=0;customStateOwners.fill(null);customAnimationOwners.fill(null);p1Reaction=null;p1HitPause=0;p2.hitShake=0;p2.attackPause=0;p2.hitPause=0;p1Life=p2.life=p1LifeMax=p2.lifeMax=1000;posX=-180;p2.x=180;posY=p2.y=0;vx=vy=p2.vx=p2.vy=0;runtimeVar.fill(0);specialRoot(2).vars.fill(0);p1Facing=1;p2.facing=-1;enterIRState(0);enterP2State(0);lifecycleRuntime.rounds.state=2;p2ControlMode='dummy';variableRandomStream.seed(seed);randomValue=0;p2.randomValue=0;
    measuring=true;const frames=[];
    for(let tick=0;tick<360;tick++){
     currentEvents=[];const actions=tape.filter(event=>event.tick===tick);
     Object.assign(input,{left:tick>=20&&tick<30,right:false,up:false,down:tick>=50&&tick<60,x:false,y:false,a:false,b:false});
     for(const event of actions){mark('scriptState:'+event.player+':'+event.state);if(event.player===1)enterIRState(event.state);else enterP2State(event.state)}
     simStep();updateCamera();if(runtimeFailed)throw Error('Runtime failed at tick '+tick);
     frames.push(snapshot({tick,events:currentEvents.slice(),input:{...input},actions,root:combatTraceSnapshot(),nativeRng:variableRandomStream.state(),legacyRng:legacy.state(),legacyRandomCalls:randomCalls,
      entities:specialRuntime.entities.filter(entity=>!entity.destroyed).map(entity=>Object.fromEntries(['kind','key','player','instanceId','state','time','anim','elem','elemTick','x','y','z','vx','vy','vz','facing','life','ctrl','moveType','hitPause'].map(key=>[key,entity[key]]))),
      effects:sourceExplods.map(effect=>Object.fromEntries(['anim','player','ownerKey','x','y','z','age','bindtime','facing'].map(key=>[key,effect[key]]))),round:roundFlow.snapshot(),pauses:specialRuntime.pauses,camera:{x:cameraX,y:cameraY,zoom:cameraZoom}}));
    }
    return frames;
   }finally{currentEvents=null;measuring=false;Math.random=originalRandom}
  })()`);
  assert.deepEqual(errors,[],'Page runtime errors');return canonical(frames);
 }finally{await context.close()}
}
(async()=>{let browser;const watchdog=setTimeout(async()=>{console.error('Repeatability probe exceeded deadline');try{await browser?.close()}finally{server.close();process.exit(1)}},600000);try{
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});browser=await chromium.launch({headless:true,channel:'msedge'});
 const url='http://127.0.0.1:'+server.address().port+'/',runs=[];
 for(const seed of [17,17,29]){runs.push(await runTrial(browser,url,seed));console.log('Captured '+runs.at(-1).length+' actual simulation ticks with seed '+seed)}
 const firstDifference=difference(runs[0],runs[1]),otherSeedDiffers=JSON.stringify(runs[0])!==JSON.stringify(runs[2]);
 const phaseNames=[...new Set(runs.flatMap(frames=>frames.flatMap(frame=>frame.events)))].sort();
 const runtime=/Prototype ([0-9.]+)/.exec(fs.readFileSync(path.join(root,'index.html'),'utf8'))?.[1];assert(runtime,'Missing runtime version');
 const report={schema:'moon-palace-web-repeatability-probe-v1',status:firstDifference?'failed':'passed',runtime,driverSha256,snapshotPolicy:'Immutable plain-data projection; unsupported types/prototypes and cycles fail explicitly',environment:{node:process.version,browser:browser.version()},sourceManifest:Object.fromEntries([...sourceManifest].sort(([a],[b])=>a.localeCompare(b))),sourceChanges,characters:['SailorMoon','SailorVenus'],seeds:[17,17,29],ticksPerRun:360,renderPolicy:'One actual camera update after each manually driven simulation tick; canvas/GPU drawing excluded',tape,sameSeedMatched:!firstDifference,firstDifference,otherSeedDiffers,phaseNames,
  digests:runs.map(frames=>crypto.createHash('sha256').update(JSON.stringify(frames)).digest('hex')),
  scope:'Fresh-context scripted actual Web simulation with test-owned native seed reset and simulation-only Math.random interception. Observed state projection and phase calls only; not production determinism, save-state replay, native phase equivalence or full-engine certification.',goalComplete:false};
 const tracePath=output+'.traces.json';fs.writeFileSync(tracePath,JSON.stringify(runs));fs.writeFileSync(output,JSON.stringify({...report,privateTraceFile:path.resolve(tracePath)},null,2)+'\n');
 assert.equal(firstDifference,null,'Same-seed trace diverged: '+JSON.stringify(firstDifference));assert(otherSeedDiffers,'Different seed must change observed RNG state');
 assert.deepEqual(sourceChanges,[],'Runtime sources changed during the fresh-context trials');
 assert.equal(crypto.createHash('sha256').update(fs.readFileSync(__filename)).digest('hex'),driverSha256,'Trace driver changed during the trials');
 assert(phaseNames.includes('simStep')&&phaseNames.includes('simStepCore')&&phaseNames.includes('entities')&&phaseNames.includes('roundFlow')&&phaseNames.includes('camera'));
 assert(runs[0].some(frame=>frame.entities.length>0),'The scripted source moves must actually spawn entities');
 assert(runs[0].some(frame=>frame.legacyRandomCalls>0),'The legacy simulation RNG interception must be exercised');
 console.log('PASS repeated actual 360-tick state/phase traces under test-owned seeds; different seed diverges');
 }finally{clearTimeout(watchdog);await browser?.close();await new Promise(resolve=>server.close(resolve))}})().catch(error=>{let prior={};try{prior=JSON.parse(fs.readFileSync(output,'utf8'))}catch{}fs.writeFileSync(output,JSON.stringify({...prior,status:'failed',error:error.message,goalComplete:false},null,2)+'\n');console.error(error.message);process.exitCode=1});
