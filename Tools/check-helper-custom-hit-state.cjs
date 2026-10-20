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
   const data=characterProfiles.get(battleCharacters[0]).battle,oldState=991540,newState=991541,results=[];
   const effects=[];roundFlow.enabled=()=>false;roundFlow.noDamage=()=>false;playSourceSound=(value,channel,player)=>effects.push(['sound',player]);spawnSourceHitSpark=(params,guarded,source,target)=>effects.push(['spark',target.instanceId,source.kind==='helper'?source===specialRuntime.entities.find(entity=>entity.key===source.key):true]);
   data.helperStates[oldState]={type:'S',physics:'N',moveType:'I',anim:0,ctrl:1,controllers:[]};
   data.helperStates[newState]={type:'A',physics:'N',moveType:'A',anim:20,ctrl:1,velset:'5,-6,2',poweradd:11,controllers:[{type:'VarSet',params:{v:6,value:73},triggers:{1:['Time=0']},triggerall:[]}]};
   data.helperStates[991542]={type:'S',physics:'N',moveType:'I',anim:0,ctrl:1,controllers:[]};
   const provider='ForeignContactFixture';characterProfiles.set(provider,{...characterProfiles.get(battleCharacters[0]),battle:{...data,character:provider,helperStates:{991542:data.helperStates[991542],[newState]:{...data.helperStates[newState],poweradd:21,controllers:[{type:'VarSet',params:{v:6,value:83},triggers:{1:['Time=0']},triggerall:[]}]}}}});
   const boxes={c1:[[-10000,-10000,10000,10000]],c2:[[-10000,-10000,10000,10000]]};data.collision={...data.collision,0:[boxes]};
   for(const attackerKind of ['root','helper'])for(const foreign of [false,true])for(const keepState of [false,true])for(const player of [1,2]){
    specialRuntime.reset();rootStateChanges.clear();hitPhaseStatus.clear();nativeHitStates.clear();nativeHitCounters.clear();combatTargets.clear();customStateOwners.fill(null);p1Reaction=null;p1Power=p2.power=0;p1Facing=p2.facing=1;p1Life=p2.life=1000;lifecycleRuntime.rounds.state=2;p1HitPause=p2.hitPause=p2.hitShake=p2.attackPause=0;activeHitDef=null;p2.attackFrame=null;moveHit=moveContact=moveGuarded=p2.moveHit=p2.moveContact=p2.moveGuarded=0;enterIRState(0);enterP2State(0);
    specialRuntime.dispatch({type:'Helper',params:{id:991540,stateno:oldState}},null,null,{},specialRoot(player),player);
    const helper=specialRuntime.entities.at(-1),step=()=>{combatTraceTick++;specialRuntime.step();specialRuntime.finishTick()};step();Object.assign(helper,{vx:1,vy:2,vz:3});
    let attacker=specialRoot(3-player);if(attackerKind==='helper'){specialRuntime.dispatch({type:'Helper',params:{id:991549,stateno:oldState}},null,null,{},attacker,3-player);attacker=specialRuntime.entities.at(-1)}const raw=data.attackStates['200'].controllers.find(controller=>controller.type==='HitDef').params;
    if(foreign){if(attackerKind==='helper')attacker.stateOwner=provider;else customStateOwners[2-player]=provider;}
    const hitDef={hitKey:'helper-custom-'+player,params:specialRuntime.numeric({...raw,id:17,damage:'0,0',hitonce:1,keepstate:+keepState,p1stateno:attackerKind==='helper'?991542:-1,p2stateno:newState,p2getp1state:+foreign,pausetime:'3,2',p1facing:0,p2facing:0,hitredlife:0,guardredlife:0,dizzypoints:0,guardpoints:0},specialRuntime.context(attacker))};customStateOwners[2-player]=null;if(attackerKind==='helper')attacker.stateOwner=null;
    if(attackerKind==='helper')attacker.activeHitDef=hitDef;else if(player===2)activeHitDef=hitDef;else p2.attackFrame={...attacker,hitDef};effects.length=0;
    step();const snapshot=()=>[helper.state,helper.time,helper.type,helper.moveType,helper.anim,helper.ctrl,helper.vx,helper.vy,helper.vz,resourceActor(player).power,helper.vars[6],specialRuntime.stateChangePending(helper)];
    const selected=snapshot(),accepted=[helper.getHit?.hitid,!!hitDef.hitOnceSpent,combatTargetList(attacker).has(helper.instanceId),nativeHitCounterView(helper).receivedHits>0,attackerKind==='helper'?attacker.moveHit:player===2?moveHit:p2.moveHit,attackerKind==='helper'?attacker.hitPause:player===2?p1HitPause:p2.attackPause],sourceState=attacker.state;step();const first=snapshot();step();const second=snapshot();step();const initialized=snapshot();results.push({attackerKind,sourceState,foreign,keepState,player,selected,accepted,first,second,initialized,effects:[...effects],targetId:helper.instanceId,provider:helper.stateOwner??null,runtimeFailed});
   }
   return results;
  })()`);
  console.log('Actual Helper custom-hit recipient observations',JSON.stringify(results));
  for(const result of results){
   const selected=result.keepState?[991540,2,'S','I',0,1,1,2,3,0,0,false]:[991541,0,'S','H',0,0,1,2,3,0,0,true];
   assert.equal(result.runtimeFailed,false);assert.deepEqual(result.selected,selected);assert.deepEqual(result.first,selected);assert.deepEqual(result.second,selected);assert.deepEqual(result.accepted,[17,true,true,true,1,3]);
   assert.deepEqual(result.initialized,result.keepState?[991540,3,'S','I',0,1,1,2,3,0,0,false]:[991541,1,'A','A',20,1,5,-6,2,result.foreign?21:11,result.foreign?83:73,false]);
   assert.equal(result.provider,result.foreign&&!result.keepState?'ForeignContactFixture':null);
   if(result.attackerKind==='helper')assert.equal(result.sourceState,991542);
   assert.deepEqual(result.effects,[['spark',result.targetId,true],['sound',3-result.player]]);
  }
  assert.deepEqual(errors,[]);
  console.log('Both Helper slots accept actual non-override HitDef P2StateNo contacts and defer real headers through recipient hitpause');
 }finally{await browser?.close();server.close();clearTimeout(watchdog)}
})().catch(error=>{console.error(error);process.exitCode=1});
