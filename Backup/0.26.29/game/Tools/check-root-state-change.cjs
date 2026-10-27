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
   for(const ikemen of [false,true])for(const [player,reaction]of [[1,false],[2,false],[1,true]]){
    resetPlayerInput();specialRuntime.reset();if(typeof rootStateChanges!=='undefined')rootStateChanges.clear();customStateOwners.fill(null);customAnimationOwners.fill(null);throwHitData.fill(null);nativeJuggle.clear();nativeHitStates.clear();hitPhaseStatus.clear();rootAssertions.forEach(flags=>flags.clear());rootHitOverrides.splice(0,2,createHitOverrides(),createHitOverrides());
    p1Reaction=null;p1HitPause=0;entityDefenderPause=false;p1Power=p2.power=0;p1Life=p1LifeMax=p2.life=p2.lifeMax=1000;lifecycleRuntime.rounds.state=2;modifiedAILevels.splice(0,2,0,0);p2ControlMode='dummy';document.querySelector('#p2Guard').value='none';p2.hitShake=p2.attackPause=p2.hitPause=0;resourceGetHit[0]={};resourceGetHit[1]={};p2.getHit={};runtimeVar.fill(0);specialRoot(2).vars.fill(0);data.engineVersions={mugen:[1,0],ikemen:ikemen?[1,0,0]:[0,0,0]};p1Facing=p2.facing=1;posX=-1000;p2.x=1000;posY=p2.y=0;vx=vy=velZ=p2.vx=p2.vy=p2.vz=0;
    enterIRState(oldState);enterP2State(oldState);
    if(player===1){stateTicks=7;p1AnimStartTime=2;vx=1;vy=2;velZ=3;p1HitPause=2;if(reaction){p1Reaction={...specialRoot(1),prevState:0,physics:'N',moveType:'H',animStartTime:2,elemTick:0,vars:runtimeVar,sysvars:runtimeSysVar,fvars:runtimeFVar,sysfvars:runtimeSysFVar,getHit:{hittime:17},life:1000,hitTime:17,hitShake:0}}}else{p2.time=7;p2.animStartTime=2;p2.vx=1;p2.vy=2;p2.vz=3;p2.attackPause=2;p2.hitTime=-1}
    const accepted=applySourceHitState(specialRoot(player),{p1stateno:newState,hitDefinitionStateOwner:battleCharacters[player-1]},{guarded:false});
    const snapshot=()=>{const actor=specialRoot(player);return [actor.state,actor.prevState??prevState,actor.time,actor.type,actor.moveType,actor.anim,actor.ctrl,actor.vx*actor.facing,actor.vy,actor.vz??velZ,actor.sprPriority??p1SprPriority,nativeJuggle.cost('root'+player),resourceActor(player).power,actor.vars[2],typeof rootStateChanges!=='undefined'&&rootStateChanges.has('root'+player)]};
    const selected=snapshot(),age=player===1?p1AnimStartTime:p2.animStartTime,step=()=>{combatTraceTick++;simStepCore();specialRuntime.finishTick()};
    step();const firstPause=snapshot(),capturedHitTime=specialRoot(player).vars[4],writtenHitTime=getHitValueM1(specialRoot(player),'hittime');step();const pauseEnded=snapshot();
    specialRuntime.dispatch({type:'Pause',params:{time:2,movetime:0,pausebg:0}},null,null,{},specialRoot(3-player),3-player);step();const firstBlocked=snapshot();step();const secondBlocked=snapshot();step();const initialized=snapshot(),timeZero=specialRoot(player).vars[3];
    const replacement=typeof rootStateChanges!=='undefined'?(()=>{if(player===1)p1HitPause=1;else p2.attackPause=1;applySourceHitState(specialRoot(player),{p1stateno:oldState},{guarded:false});if(player===1)enterIRState(0);else enterP2State(0);return [rootStateChanges.has('root'+player),specialRoot(player).state]})():[true,-1];
    results.push({ikemen,player,reaction,accepted,selected,age,firstPause,pauseEnded,firstBlocked,secondBlocked,initialized,timeZero,replacement,capturedHitTime,writtenHitTime,runtimeFailed});
   }
   specialRuntime.reset();rootStateChanges.clear();p1Reaction=null;enterIRState(oldState);enterP2State(oldState);p1HitPause=5;p2.attackPause=p2.hitShake=p2.hitPause=2;p2.vars[2]=0;p2.vars[3]=-1;p2.power=0;applySourceHitState(specialRoot(2),{p1stateno:newState},{guarded:false});const independent=[];
   for(let action=0;action<3;action++){combatTraceTick++;simStepCore();independent.push([p1HitPause,p2.attackPause,p2.hitShake,p2.hitPause,rootStateChanges.has('root2'),p2.time])}
   const independentTimeZero=p2.vars[3],retained=[],defaults=[];
   for(const player of [1,2]){
    rootStateChanges.clear();p1Reaction=null;p1HitPause=p2.attackPause=p2.hitPause=p2.hitShake=0;
    if(player===1){enterIRState(oldState);p1StateType='C';p1Physics='C';runtimeMoveType='H';current=20;fi=3;ticks=2;stateTicks=7;p1AnimStartTime=2}else{enterP2State(oldState);Object.assign(p2,{type:'C',physics:'C',moveType:'H',anim:20,elem:4,elemTick:2,time:7,animStartTime:2})}
    nativeJuggle.set('root'+player,12);applySourceHitState(specialRoot(player),{p1stateno:991552},{guarded:false});const sameTick=initializeRootSourceStateM1(player);combatTraceTick++;const initialized=initializeRootSourceStateM1(player),actor=specialRoot(player);
    retained.push([sameTick,initialized,actor.type,player===1?p1Physics:p2.physics,actor.moveType,actor.anim,actor.elem,player===1?ticks:p2.elemTick,player===1?p1AnimStartTime:p2.animStartTime,nativeJuggle.cost('root'+player),rootStateChanges.has('root'+player),actor.time]);
    applySourceHitState(specialRoot(player),{p1stateno:991553},{guarded:false});combatTraceTick++;initializeRootSourceStateM1(player);const defaulted=specialRoot(player);defaults.push([defaulted.type,defaulted.moveType,player===1?p1Physics:p2.physics,defaulted.anim]);
   }
   const afterFight=[];
   for(const player of [1,2]){
    specialRuntime.reset();rootStateChanges.clear();p1Reaction=null;p1HitPause=p2.attackPause=p2.hitPause=p2.hitShake=0;enterIRState(oldState);enterP2State(oldState);runtimeVar[2]=p2.vars[2]=0;runtimeVar[3]=p2.vars[3]=-1;lifecycleRuntime.rounds.state=3;if(player===1)p1HitPause=2;else p2.attackPause=p2.hitPause=p2.hitShake=2;
    applySourceHitState(specialRoot(player),{p1stateno:newState},{guarded:false});const actions=[];
    for(let action=0;action<3;action++){combatTraceTick++;const clocks=pendingRootPauseSnapshotM1();stepRoundResultFighter(player);finishPendingRootPausesM1(clocks);actions.push([rootStateChanges.has('root'+player),specialRoot(player).time])}
    afterFight.push([player,actions,specialRoot(player).vars[3]]);
   }
   const disabled=[];
   for(const player of [1,2]){
    specialRuntime.reset();rootStateChanges.clear();p1Reaction=null;p1HitPause=p2.attackPause=p2.hitPause=p2.hitShake=0;enterIRState(oldState);enterP2State(oldState);runtimeVar[2]=p2.vars[2]=0;runtimeVar[3]=p2.vars[3]=-1;lifecycleRuntime.rounds.state=2;if(player===1)p1HitPause=2;else p2.attackPause=p2.hitPause=p2.hitShake=2;
    applySourceHitState(specialRoot(player),{p1stateno:newState},{guarded:false});rootStatusFlags[player-1].disabled=true;const actions=[];
    for(let action=0;action<5;action++){if(action===2)rootStatusFlags[player-1].disabled=false;combatTraceTick++;simStepCore();actions.push([player===1?p1HitPause:p2.attackPause,rootStateChanges.has('root'+player),specialRoot(player).time])}
    disabled.push(actions);rootStatusFlags[player-1].disabled=false;
   }
   return {cases:results,independent,timeZero:independentTimeZero,retained,defaults,afterFight,disabled};
  })()`);
  console.log('Actual root deferred StateDef observations',JSON.stringify(results));
  for(const result of results.cases){
   const selected=[991551,991550,0,'S',result.reaction?'H':'I',0,0,1,2,3,2,4,0,0,true],paused=[...selected];paused[13]=1;
   assert.equal(result.runtimeFailed,false);assert.equal(result.accepted,true);assert.deepEqual(result.selected,selected);assert.equal(result.age,-5);
   for(const row of [result.firstPause,result.pauseEnded,result.firstBlocked,result.secondBlocked])assert.deepEqual(row,paused);
   assert.deepEqual(result.initialized,[991551,991550,1,'A','A',20,1,5,-6,2,8,9,11,1,false]);assert.equal(result.timeZero,0);assert.deepEqual(result.replacement,[false,0]);assert.equal(result.capturedHitTime,result.reaction?17:-1);assert.equal(result.writtenHitTime,9);
  }
  assert.deepEqual(results.independent,[[4,1,1,1,true,0],[3,0,0,0,true,0],[2,0,0,0,false,1]]);assert.equal(results.timeZero,0);
  assert.deepEqual(results.retained,Array(2).fill([false,true,'C','C','H',20,4,2,-5,0,false,0]));
  assert.deepEqual(results.defaults,Array(2).fill(['S','I','N',20]));
  assert.deepEqual(results.afterFight,[[1,[[true,0],[true,0],[false,1]],0],[2,[[true,0],[true,0],[false,1]],0]]);
  assert.deepEqual(results.disabled,Array(2).fill([[2,true,0],[2,true,0],[1,true,0],[0,true,0],[0,false,1]]));
  assert.deepEqual(errors,[]);
  console.log('P1, P2 and P1-reaction source requests retain old fields through own/global pauses and initialize StateDef once before a genuine Time=0 body, with replacement cancellation');
 }finally{await browser?.close();server.close();clearTimeout(watchdog)}
})().catch(error=>{console.error(error);process.exitCode=1});
