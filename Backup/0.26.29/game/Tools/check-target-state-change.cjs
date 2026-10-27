const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const assert=require('node:assert/strict');
const {chromium}=require('C:/Users/jeffy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..'),vendor=path.resolve(root,'../outputs/three-r180');
const server=http.createServer((request,response)=>{
 const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname),base=pathname.startsWith('/vendor/')?vendor:root,file=path.resolve(base,pathname.startsWith('/vendor/')?pathname.slice(8):'.'+(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(base+path.sep)||!fs.existsSync(file)){response.writeHead(404);response.end();return}
 let content=fs.readFileSync(file);
 if(file===path.join(root,'index.html'))content=Buffer.from(content.toString().replaceAll('https://cdn.jsdelivr.net/npm/three@0.180.0/','/vendor/').replaceAll('requestAnimationFrame(loop);','').replace('</script></body>',`window.contactPhaseTest={run:source=>eval(source)};</script></body>`));
 response.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');response.end(content);
});
(async()=>{
 let browser;
 const watchdog=setTimeout(async()=>{console.error('Root deferred-state regression exceeded deadline');try{await browser?.close()}finally{server.close();process.exit(1)}},300000);
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  browser=await chromium.launch({headless:true,channel:'msedge'});
  const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:'+server.address().port+'/');
  await page.waitForFunction(()=>window.contactPhaseTest?.run('!!dat&&!!stateIR&&!!battleDat&&!!lifecycleDat&&!!specialDat&&!!roundCharDat&&!!cmdDat&&!!airDat&&!!fallDat&&!!guardDat&&!!turnDat'),null,{timeout:90000});
  const run=source=>page.evaluate(source=>window.contactPhaseTest.run(source),source);
  await run("prepareCharacters(['SailorSaturn','SailorSaturn'])");
  const results=await run(`(()=>{
   const data=characterProfiles.get(battleCharacters[0]).battle,oldState=991550,newState=991551,results=[];
   roundFlow.enabled=()=>false;roundFlow.noDamage=()=>false;playSourceSound=()=>{};spawnSourceHitSpark=()=>{};
   data.states[oldState]={type:'S',physics:'N',moveType:'I',anim:0,ctrl:0,sprpriority:2,juggle:4,controllers:[]};
data.states[newState]={type:'A',physics:'N',moveType:'A',anim:'IfElse(Var(2),20,0)',ctrl:1,sprpriority:'7+Var(2)',velset:'4+Var(2),-6,2',juggle:9,poweradd:'10+Var(2)',controllers:[{type:'VarAdd',params:{v:2,value:1,persistent:0,ignorehitpause:1},triggers:{1:['1']},triggerall:[]},{type:'VarSet',params:{v:3,value:'Time'},triggers:{1:['Time=0']},triggerall:[]},{type:'VarSet',params:{v:4,value:'GetHitVar(hittime)',persistent:0,ignorehitpause:1},triggers:{1:['1']},triggerall:[]},{type:'GetHitVarSet',params:{hittime:9,persistent:0,ignorehitpause:1},triggers:{1:['1']},triggerall:[]}]};
   data.attackStates[newState]=data.states[newState];
   data.states[991552]={type:'U',physics:'U',moveType:'U',anim:'-1',controllers:[]};
   data.states[991553]={anim:'-1',controllers:[]};
   const observations=[];
   for(const ikemen of [false,true])for(const mode of ['hit','controller','contact'])for(const player of [1,2]){
    data.engineVersions={mugen:[1,0],ikemen:ikemen?[1,0,0]:[0,0,0]};
    specialRuntime.reset();rootStateChanges.clear();p1Reaction=null;p1HitPause=p2.attackPause=p2.hitPause=p2.hitShake=0;customStateOwners.fill(null);customAnimationOwners.fill(null);runtimeVar.fill(0);specialRoot(2).vars.fill(0);p1Power=p2.power=0;lifecycleRuntime.rounds.state=2;modifiedAILevels.splice(0,2,0,0);p2ControlMode='dummy';
    p1Facing=p2.facing=1;enterIRState(oldState);enterP2State(oldState);if(player===1){vx=1;vy=2;velZ=3}else{p2.vx=1;p2.vy=2;p2.vz=3}
    const previous={...specialRoot(player)},hit={hittime:20};
    if(mode==='hit')applyRootCustomHitState(player,{customTargetState:true,state:newState,getHit:hit,life:900,defenderPause:2,defenderPriority:6},previous);
    else if(mode==='controller'){
     if(player===1)p1HitPause=2;else p2.hitShake=2;
     if(player===1){resourceGetHit[0]={hitid:77};throwHitData[0]=resourceGetHit[0]}else p2.getHit={hitid:77};
     recordCombatTarget(specialRoot(3-player),player,{id:77});
     const controller={type:'TargetState',params:{value:newState,id:77},triggers:{1:['1']},triggerall:[]};
     if(player===2)runController(controller);else runP2ControllerM1(controller);
    }
    else {
     hitPhaseStatus.clear();nativeHitStates.clear();rootHitOverrides.splice(0,2,createHitOverrides(),createHitOverrides());p1LastHitKey=p2.lastHitKey=null;document.querySelector('#p2Guard').value='none';
     const raw=data.attackStates['200'].controllers.find(controller=>controller.type==='HitDef').params;
     const params=specialRuntime.numeric({...raw,damage:'0,0',guardflag:'',p2stateno:newState,p2getp1state:0,pausetime:'0,2',p1facing:0,p2facing:0,hitredlife:0,guardredlife:0,dizzypoints:0,guardpoints:0},specialRuntime.context(specialRoot(3-player)));
     if(player===2)applyP2HitM1({params,hitKey:'target-pause-'+ikemen+'-'+player});else applyP1HitM1({facing:1,hitDef:{params,hitKey:'target-pause-'+ikemen+'-'+player}});
    }
    const snapshot=()=>{const actor=specialRoot(player);return [actor.state,actor.time,actor.type,actor.moveType,actor.anim,actor.ctrl,actor.vx*actor.facing,actor.vy,actor.vz??velZ,resourceActor(player).power,rootStateChanges.has('root'+player)]};
    const selected=snapshot(),actions=[];for(let action=0;action<3;action++){combatTraceTick++;simStepCore();actions.push(snapshot())}
    observations.push({ikemen,mode,player,selected,actions,timeZero:specialRoot(player).vars[3],runtimeFailed});
   }
   return observations;
  })()`);
  console.log('Actual target deferred StateDef observations',JSON.stringify(results));
  for(const result of results){
   assert.equal(result.runtimeFailed,false);
   assert.deepEqual(result.selected,[991551,0,'S',result.mode==='controller'?'I':'H',0,0,1,2,3,0,true]);
   assert.deepEqual(result.actions[0],result.selected);assert.deepEqual(result.actions[1],result.selected);
   assert.deepEqual(result.actions[2],[991551,1,'A','A',20,1,5,-6,2,11,false]);assert.equal(result.timeZero,0);
  }
  assert.deepEqual(errors,[]);
  console.log('Both root P2StateNo recipients retain old animation and velocity through hitpause, then execute their real header and Time=0 body');
 }finally{await browser?.close();server.close();clearTimeout(watchdog)}
})().catch(error=>{console.error(error);process.exitCode=1});
