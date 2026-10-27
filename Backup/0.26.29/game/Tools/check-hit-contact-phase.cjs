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
 const watchdog=setTimeout(async()=>{console.error('Contact-phase regression exceeded deadline');try{await browser?.close()}finally{server.close();process.exit(1)}},300000);
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
   specialRoot(2);roundFlow.enabled=()=>false;roundFlow.noDamage=()=>false;
   const results=[],sounds=[],sparks=[];playSourceSound=(...args)=>sounds.push(args);spawnSourceHitSpark=(...args)=>sparks.push(args);
   const reset=()=>{
    combatTraceTick++;resetPlayerInput();specialRuntime.reset();sourceExplods.length=0;sounds.length=0;sparks.length=0;customStateOwners.fill(null);customAnimationOwners.fill(null);throwHitData.fill(null);throwTargets.fill(null);throwBindings.fill(null);controllerTargetBindings.clear();combatTargets.clear();nativeJuggle.clear();nativeHitStates.clear();nativeHitCounters.clear();hitDefinitionTargets.clear();actorUnhittableTime.clear();contactPowerScheduler.clear();hitPhaseStatus.clear();rootAssertions.forEach(flags=>flags.clear());previousRootAssertions.forEach(flags=>flags.clear());rootHitOverrides.splice(0,2,createHitOverrides(),createHitOverrides());rootHitBySlots.splice(0,2,createHitBySlots(),createHitBySlots());
    lifecycleRuntime.rounds.state=2;combatEngineProfile='mugen11';p2ControlMode='dummy';document.querySelector('#p2Guard').value='none';modifiedAILevels.splice(0,2,0,0);p1Reaction=null;p1HitPause=0;entityDefenderPause=false;p1Life=p1LifeMax=1000;p2.life=p2.lifeMax=1000;p1Power=p2.power=0;p1LastHitKey=p2.lastHitKey=null;p2.hitShake=p2.attackPause=0;p2.getHit=null;resourceGetHit[0]={};resourceGetHit[1]={};runtimeVar.fill(0);p2.vars.fill(0);setActorAlive(specialRoot(1),true);setActorAlive(specialRoot(2),true);posX=-80;posY=posZ=0;p2.x=80;p2.y=p2.z=0;vx=vy=velZ=0;p2.vx=p2.vy=p2.vz=0;p1Facing=1;p2.facing=-1;enterIRState(0);enterP2State(0);scoreRuntime.resetMatch();
   };
   const make=(player,id,extra={})=>({params:specialRuntime.numeric({attr:'S,NA',damage:'13,0',id,hitonce:1,numhits:1,hitflag:'MAFD',guardflag:'',pausetime:'0,0',animtype:'light','ground.type':'high','air.type':'high','ground.hittime':19,'air.hittime':19,'ground.velocity':'0,0','air.velocity':'0,0',fall:0,getpower:'5,0',givepower:'7,0',sparkno:-1,'guard.sparkno':-1,unhittabletime:'0,0',...extra},specialRuntime.context(specialRoot(player)),player),hitKey:'phase-'+combatTraceTick+'-'+player+'-'+id});
   const apply=(player,definition)=>{if(player===1){activeHitDef=definition;applyP2HitM1(definition)}else{p2.activeHitDef=definition;applyP1HitM1({...specialRoot(2),hitDef:definition})}};
   const snapshot=()=>JSON.stringify([p1Life,p2.life,p1Power,p2.power,state,p2.state,stateEntrySerial,p2.entrySerial,entityDefenderPause,scoreRuntime.snapshot().hits,sounds.length,sparks.length,sourceExplods.length,...[1,2].map(player=>{const hit=fallHitData(specialRoot(player));return [hit.attr,hit.hitid,hit.playerid,hit.damage,hit.hitdamage,hit.hitpower,hit.fall]})]);
   for(const player of [1,2])for(const kind of ['throw-target','source-hit-state','source-hit-ordinary','next-pass','none-throw']){
    reset();const target=3-player;
    const throwing=['throw-target','next-pass','none-throw'].includes(kind),firstPlayer=throwing?player:target,first=make(firstPlayer,501,throwing?{attr:'S,NT',p1stateno:0,p2stateno:5000,...(kind==='none-throw'?{'ground.type':'None','air.type':'None'}:{})}:{});
    apply(firstPlayer,first);const firstAccepted=!!first.hitOnceSpent;
    if(kind==='next-pass')combatTraceTick++;
    sourceExplods.push({player:target,ownerKey:'root'+target,removeongethit:true});entityDefenderPause=true;const candidate=make(player,502,kind==='source-hit-state'?{p1stateno:0,p2stateno:5000}:{}),before=snapshot();apply(player,candidate);
    results.push({player,kind,firstAccepted,accepted:!!candidate.hitOnceSpent,unchanged:before===snapshot(),runtimeFailed});
   }
   const helper=()=>{specialRuntime.dispatch({type:'Helper',params:{id:991530,stateno:0}},null,null,{},specialRoot(1),1);return specialRuntime.entities.at(-1)};
   const projectile=owner=>({kind:'projectile',player:1,id:991531,key:'phase-projectile-'+owner.key,projectileOwnerId:hitSourceIdentity(owner).playerid,projectileOwnerActor:owner,parentKey:owner.key});
   reset();apply(1,make(1,601,{attr:'S,NT',p1stateno:0,p2stateno:5000}));
   const attacker=helper(),entityResults=[];
   for(const entity of [attacker,projectile(specialRoot(1)),projectile(attacker)]){
    const definition=make(1,602);entity.activeHitDef=definition;const before=snapshot(),collision=hitDefinitionPreconditionsM1({...entity,hitDef:definition},specialRoot(2)),result=applyEntityHit(entity,specialRoot(2),definition.params);
    entityResults.push([entity.kind,collision,result===null,before===snapshot(),!!definition.hitOnceSpent]);
   }
   const reversal=make(1,603,{'reversal.attr':'SCA,AA',p1stateno:0}),beforeReverse=snapshot(),reversed=applyQualifiedReversalContactM1(attacker,specialRoot(2),reversal.params,{qualified:true});
   const reversalResult=[reversed.miss,beforeReverse===snapshot()];
   reset();const independent=helper();apply(2,make(2,701));const params=make(1,702,{p1stateno:0}).params;
   const owners=[nativeContactPhaseAllowedM1(projectile(specialRoot(1)),specialRoot(2),params),nativeContactPhaseAllowedM1(independent,specialRoot(2),params),nativeContactPhaseAllowedM1(projectile(independent),specialRoot(2),params)];
   const normal=make(2,703);independent.getHit=resolveGroundHitM1({...specialRoot(2),id:2},independent,normal.params,'none').getHit;
   owners.push(nativeContactPhaseAllowedM1(independent,specialRoot(2),params),nativeContactPhaseAllowedM1(projectile(independent),specialRoot(2),params),nativeContactPhaseAllowedM1(helper(),specialRoot(2),params));
   return {roots:results,entities:entityResults,reversal:reversalResult,owners};
  })()`);
  console.log('Actual same-pass contact observations',JSON.stringify(results));
  for(const result of results.roots){const rejected=['throw-target','source-hit-state'].includes(result.kind);assert.equal(result.runtimeFailed,false);assert.equal(result.firstAccepted,true);assert.equal(result.accepted,!rejected,JSON.stringify(result));assert.equal(result.unchanged,rejected,JSON.stringify(result))}
  assert.deepEqual(results.entities,[['helper',false,true,true,false],['projectile',false,true,true,false],['projectile',false,true,true,false]]);
  assert.deepEqual(results.reversal,[true,true]);assert.deepEqual(results.owners,[false,true,true,false,false,true]);
  assert.deepEqual(errors,[]);
  console.log('Both root slots reject repeated throw recipients and already-hit P1StateNo sources without contact side effects; ordinary, next-pass and type-None contacts remain independent');
 }finally{await browser?.close();server.close();clearTimeout(watchdog)}
})().catch(error=>{console.error(error);process.exitCode=1});
