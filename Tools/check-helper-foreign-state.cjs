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
 const watchdog=setTimeout(async()=>{console.error('Helper deferred-state regression exceeded deadline');try{await browser?.close()}finally{server.close();process.exit(1)}},300000);
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
   const data=characterProfiles.get(battleCharacters[0]).battle,oldState=991540,newState=991541,provider='DeferredForeignFixture',results=[];
   roundFlow.enabled=()=>false;roundFlow.noDamage=()=>false;playSourceSound=()=>{};spawnSourceHitSpark=()=>{};
   data.helperStates[oldState]={type:'S',physics:'N',moveType:'I',anim:0,ctrl:1,controllers:[]};
   data.helperStates[newState]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[{type:'VarSet',params:{v:6,value:-1},triggers:{1:['1']},triggerall:[]}]};
   const nativeHit=data.attackStates['200'].controllers.find(controller=>controller.type==='HitDef');data.globalControllers={...data.globalControllers,'-2':[{...nativeHit,params:{...nativeHit.params,ignorehitpause:1},triggers:{1:['StateNo=991541']},triggerall:[]}]};
   const definition={type:'A',physics:'N',moveType:'A',anim:20,ctrl:1,velset:'5,-6,2',poweradd:11,controllers:[{type:'VarSet',params:{v:6,value:73},triggers:{1:['Time=0']},triggerall:[]},{type:'SelfState',params:{value:oldState},triggers:{1:['Time=1']},triggerall:[]}]};
   characterProfiles.set(provider,{...characterProfiles.get(battleCharacters[0]),battle:{...data,character:provider,helperStates:{[newState]:definition},states:{[newState]:definition}}});
   for(const mode of ['source','target'])for(const player of [1,2]){
    specialRuntime.reset();rootStateChanges.clear();customStateOwners.fill(null);p1Power=p2.power=0;p1Facing=p2.facing=1;p1Life=p2.life=1000;lifecycleRuntime.rounds.state=2;
    specialRuntime.dispatch({type:'Helper',params:{id:991540,stateno:oldState,keyctrl:2,pos:'-2000,0'}},null,null,{},specialRoot(player),player);
    const helper=specialRuntime.entities.at(-1),step=()=>{combatTraceTick++;specialRuntime.step();specialRuntime.finishTick()};step();
    helper.hitPause=2;helper.vx=1;helper.vy=2;helper.vz=3;helper.getHit={hitid:77};recordCombatTarget(specialRoot(player),helper.instanceId,{id:77});
    customStateOwners[player-1]=provider;const controller={type:'TargetState',params:{value:newState,id:77},triggers:{1:['1']},triggerall:[]};
    if(mode==='source')applySourceHitState(helper,{p1stateno:newState,hitDefinitionStateOwner:provider,hitDefinitionForeignStateOwner:true},{guarded:false});else if(player===1)runController(controller);else runP2ControllerM1(controller);customStateOwners[player-1]=null;
    const snapshot=()=>[helper.state,helper.time,helper.type,helper.moveType,helper.anim,helper.ctrl,helper.vx,helper.vy,helper.vz,resourceActor(player).power,helper.vars[6],helper.stateOwner,specialRuntime.stateChangePending(helper)];
    const selected=snapshot();step();const first=snapshot(),globalBinding=[helper.activeHitDef?.params.hitDefinitionStateOwner,helper.activeHitDef?.params.hitDefinitionForeignStateOwner];step();const second=snapshot();step();const initialized=snapshot();customStateOwners[player-1]=provider;step();const returned=[helper.state,helper.stateOwner,helper.anim,helper.ctrl,customStateOwners[player-1]];customStateOwners[player-1]=null;results.push({mode,player,selected,first,second,initialized,returned,globalBinding,runtimeFailed});
   }
   return results;
  })()`);
  console.log('Foreign Helper target program observations',JSON.stringify(results));
  for(const result of results){
   const selected=[991541,0,'S','I',0,0,1,2,3,0,0,'DeferredForeignFixture',true];
   assert.equal(result.runtimeFailed,false);assert.deepEqual(result.selected,selected);assert.deepEqual(result.first,selected);assert.deepEqual(result.second,selected);
   assert.deepEqual(result.initialized,[991541,1,'A','A',20,1,5,-6,2,11,73,'DeferredForeignFixture',false]);
   assert.deepEqual(result.returned,[991540,null,0,1,'DeferredForeignFixture']);
   assert.deepEqual(result.globalBinding,['SailorSaturn',false]);
  }
  assert.deepEqual(errors,[]);
  console.log('Both Helper recipient slots keep the selected foreign program after the caller returns to its own program and execute foreign StateDef/body with own animation and shared power');
 }finally{await browser?.close();server.close();clearTimeout(watchdog)}
})().catch(error=>{console.error(error);process.exitCode=1});
