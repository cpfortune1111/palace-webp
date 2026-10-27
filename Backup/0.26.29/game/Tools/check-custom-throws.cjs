const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const assert=require('node:assert/strict');
const {chromium}=require('C:/Users/jeffy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..'),vendor=path.resolve(root,'../outputs/three-r180');
const includeMissingAssets=process.argv.includes('--include-missing-assets');
const missingJupiterActions=[1051,1055,1060,1061].filter(action=>!JSON.parse(fs.readFileSync(path.join(root,'Char/Jupiter/Battle/jupiter_full.json'),'utf8')).actions[action]);
assert.deepEqual(missingJupiterActions,[1051,1055,1060,1061]);
console.log('Pending source-asset case: Jupiter S1300 requires absent AIR actions',missingJupiterActions.join(','),'; use --include-missing-assets to reproduce the failing original-program diagnostic');
const server=http.createServer((request,response)=>{
 const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname),base=pathname.startsWith('/vendor/')?vendor:root,file=path.resolve(base,pathname.startsWith('/vendor/')?pathname.slice(8):'.'+(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(base+path.sep)||!fs.existsSync(file)){response.writeHead(404);response.end();return}
 let content=fs.readFileSync(file);
 if(file===path.join(root,'index.html'))content=Buffer.from(content.toString().replaceAll('https://cdn.jsdelivr.net/npm/three@0.180.0/','/vendor/').replaceAll('requestAnimationFrame(loop);','').replace('</script></body>',`window.throwTest={run:source=>eval(source)};</script></body>`));
 response.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');response.end(content);
});
(async()=>{
 let browser;
 const watchdog=setTimeout(async()=>{console.error('Original custom-throw regression exceeded deadline');try{await browser?.close()}finally{server.close();process.exit(1)}},300000);
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  browser=await chromium.launch({headless:true,channel:'msedge'});
  const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:'+server.address().port+'/');
  await page.waitForFunction(()=>window.throwTest?.run('!!dat&&!!stateIR&&!!battleDat&&!!lifecycleDat&&!!specialDat&&!!roundCharDat&&!!cmdDat&&!!airDat&&!!fallDat&&!!guardDat&&!!turnDat'),null,{timeout:90000});
  const run=source=>page.evaluate(source=>window.throwTest.run(source),source);
  const cases=[['SailorMoon',1,0,800],['SailorMoon',2,0,800]];
  if(includeMissingAssets)cases.push(['SailorJupiter',1,0,748],['SailorJupiter',2,1,685]);
  for(const [character,player,variant,expectedLife]of cases){
   await run('prepareCharacters('+JSON.stringify(player===1?[character,'SailorVenus']:['SailorVenus',character])+')');
   const result=await run(`(()=>{
    const player=${player},move=${character==='SailorMoon'?800:1300},target=3-player,enabled=roundFlow.enabled,damageGate=roundFlow.noDamage;
    try{
     specialRoot(2);
     resetPlayerInput();specialRuntime.reset();sourceExplods.length=0;customStateOwners.fill(null);customAnimationOwners.fill(null);throwHitData.fill(null);throwTargets.fill(null);throwBindings.fill(null);controllerTargetBindings.clear();combatTargets.clear();nativeJuggle.clear();nativeHitStates.clear();nativeHitCounters.clear();hitDefinitionTargets.clear();actorUnhittableTime.clear();contactPowerScheduler.clear();rootAssertions.forEach(flags=>flags.clear());previousRootAssertions.forEach(flags=>flags.clear());rootHitOverrides.splice(0,2,createHitOverrides(),createHitOverrides());rootHitBySlots.splice(0,2,createHitBySlots(),createHitBySlots());
     roundFlow.enabled=()=>false;roundFlow.noDamage=()=>false;lifecycleRuntime.rounds.state=2;combatEngineProfile='mugen11';p2ControlMode='dummy';document.querySelector('#p2Guard').value='none';modifiedAILevels.splice(0,2,0,0);p1Reaction=null;p1HitPause=0;entityDefenderPause=false;p1Life=1000;p1LifeMax=1000;p2.life=1000;p2.lifeMax=1000;p1Power=p2.power=0;p1LastHitKey=p2.lastHitKey=null;p2.hitShake=p2.attackPause=0;p2.getHit=null;resourceGetHit[0]={};resourceGetHit[1]={};runtimeVar.fill(0);p2.vars.fill(0);setActorAlive(specialRoot(1),true);setActorAlive(specialRoot(2),true);posX=-80;posY=0;posZ=0;p2.x=80;p2.y=0;p2.z=0;vx=0;vy=0;velZ=0;p2.vx=0;p2.vy=0;p2.vz=0;p1Facing=1;p2.facing=-1;enterIRState(0);enterP2State(0);scoreRuntime.resetMatch();
     playSourceSound=()=>{};spawnSourceHitSpark=()=>{};
     if(player===1){enterIRState(move);runtimeVar[2]=${variant}}else{enterP2State(move);p2.vars[2]=${variant}}
     const raw=withCharacter(player,()=>sourceState(move).controllers.find(controller=>controller.type==='HitDef').params),params=withCharacter(player,()=>specialRuntime.numeric(raw,specialRuntime.context(specialRoot(player)),player)),definition={params,hitKey:'original-throw-'+player+'-'+move+'-'+combatTraceTick},cost=nativeJuggle.cost('root'+player),maximum=juggleMaximumM1(specialRoot(player));
     if(player===1){activeHitDef=definition;applyP2HitM1(definition)}else{p2.activeHitDef=definition;applyP1HitM1({...specialRoot(2),hitDef:definition})}
     const initial={source:specialRoot(player).state,anim:specialRoot(player).anim,frames:framesFor(specialRoot(player).anim,player).length,variant:specialRoot(player).vars[2],target:specialRoot(target).state,owner:customStateOwners[target-1],hitOwner:fallHitData(specialRoot(target)).playerid,budget:juggleBudget(fallHitData(specialRoot(target)).targetedBy,player,-1),expectedBudget:maximum-cost,spent:!!definition.hitOnceSpent,hits:scoreRuntime.snapshot().hits[player-1]},history=[new Set([state]),new Set([p2.state])];let bound=false,ticks=0;
     for(;ticks<720;ticks++){
      stepSourceExplods();simStepCore();finishRootHitFrames();specialRuntime.step();specialRuntime.finishTick();consumeRootHitOffsets();combatTraceTick++;history[0].add(state);history[1].add(p2.state);bound||=controllerTargetBindings.has(target);
      if(runtimeFailed)break;
      const source=specialRoot(player),victim=specialRoot(target);if(source.state===0&&victim.state===0&&victim.y===0&&victim.ctrl)break;
     }
     return {initial,runtimeFailed,ticks,bound,life:resourceActor(target).life,source:specialRoot(player).state,target:specialRoot(target).state,y:specialRoot(target).y,ctrl:specialRoot(target).ctrl,owner:customStateOwners[target-1],history:history.map(states=>[...states])};
    }finally{roundFlow.enabled=enabled;roundFlow.noDamage=damageGate}
   })()`);
   console.log(character,'P'+player,'variant '+variant,JSON.stringify(result));
   assert.equal(result.runtimeFailed,false);assert.equal(result.initial.source,character==='SailorMoon'?801:1051);assert.equal(result.initial.target,character==='SailorMoon'?805:1052);assert.equal(result.initial.owner,character);assert.equal(result.initial.hitOwner,player);assert.equal(result.initial.budget,result.initial.expectedBudget);assert.equal(result.initial.spent,true);assert.equal(result.initial.hits,1);assert.equal(result.bound,true);assert.equal(result.life,expectedLife);assert.equal(result.source,0);assert.equal(result.target,0);assert.equal(result.y,0);assert.equal(result.ctrl,1);assert.equal(result.owner,null);assert.ok(result.ticks<720);
  }
  assert.deepEqual(errors,[]);
  console.log('Original Moon custom throws complete in both root slots against Venus, with native contact metadata, source budgets, bind damage and own-state recovery; Jupiter missing-source-action case remains Pending');
 }finally{await browser?.close();server.close();clearTimeout(watchdog)}
})().catch(error=>{console.error(error);process.exitCode=1});
