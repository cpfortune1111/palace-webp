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
   const data=characterProfiles.get(battleCharacters[0]).battle,oldState=991540,results=[];
   const soundCalls=[];roundFlow.enabled=()=>false;roundFlow.noDamage=()=>false;playSourceSound=value=>soundCalls.push(value);playCommonSound=()=>{};spawnSourceHitSpark=()=>{};
   data.helperStates[oldState]={type:'S',physics:'N',moveType:'I',anim:0,ctrl:1,controllers:[]};
   data.states[5110].controllers=[...data.states[5110].controllers,{type:'AssertSpecial',params:{flag:'NoGetUpFromLieDown'},triggers:{1:['Var(22)=1']},triggerall:[]}];
   const boxes={c1:[[-10000,-10000,10000,10000]],c2:[[-10000,-10000,10000,10000]]};data.collision={...data.collision,0:[boxes]};
   for(const trajectory of ['stand','air','fall','fallBlocked'])for(const player of [1,2]){
    specialRuntime.reset();rootStateChanges.clear();hitPhaseStatus.clear();nativeHitStates.clear();nativeHitCounters.clear();combatTargets.clear();customStateOwners.fill(null);p1Reaction=null;p1Power=p2.power=0;p1Facing=p2.facing=1;p1Life=p2.life=1000;lifecycleRuntime.rounds.state=2;p1HitPause=p2.hitPause=p2.hitShake=p2.attackPause=0;activeHitDef=null;p2.attackFrame=null;enterIRState(0);enterP2State(0);
    specialRuntime.dispatch({type:'Helper',params:{id:991540,stateno:oldState}},null,null,{},specialRoot(player),player);
    const helper=specialRuntime.entities.at(-1),step=()=>{combatTraceTick++;specialRuntime.step();specialRuntime.finishTick()};step();if(trajectory!=='stand'){helper.type='A';helper.y=-100}helper.vars[22]=+(trajectory==='fallBlocked');
    const attacker=specialRoot(3-player),raw=data.attackStates['200'].controllers.find(controller=>controller.type==='HitDef').params;
    const hitDef={hitKey:'helper-normal-'+player,params:specialRuntime.numeric({...raw,id:19,damage:'20,0',hitonce:1,p1stateno:-1,p2stateno:-1,pausetime:'0,2',fall:+(trajectory.startsWith('fall')),'air.fall':+(trajectory.startsWith('fall')),'air.velocity':'0,-6','air.hittime':5,'ground.velocity':'0,0','ground.hittime':5,'down.recovertime':3,'ground.type':'High',p1facing:0,p2facing:0,hitredlife:0,guardredlife:0,dizzypoints:0,guardpoints:0},specialRuntime.context(attacker))};
    if(player===2)activeHitDef=hitDef;else p2.attackFrame={...attacker,hitDef};step();
    const selected=[helper.state,helper.time,helper.moveType,helper.ctrl,helper.hitPause,specialRuntime.stateChangePending(helper),helper.life<1000,p1Life,p2.life],receivedAtContact=nativeHitCounterView(helper).receivedHits,history=[];
    for(let action=0;action<180;action++){step();history.push([helper.state,helper.time,helper.hitTime,helper.hitShake,helper.anim,helper.y,helper.vy,helper.getHit?.['down.recovertime']]);if(trajectory==='fallBlocked'&&helper.state===5110&&helper.time===5)helper.vars[22]=0;if(helper.state===0||trajectory.startsWith('fall')&&helper.state===11&&helper.ctrl===1)break}
    results.push({trajectory,player,selected,history,state:helper.state,ctrl:helper.ctrl,y:helper.y,receivedAtContact,received:nativeHitCounterView(helper).receivedHits,runtimeFailed});
   }
   specialRuntime.reset();activeHitDef=null;p2.attackFrame=null;landingSoundEntries[0]=-1;
   for(const id of [991551,991552])specialRuntime.dispatch({type:'Helper',params:{id,stateno:52}},null,null,{},specialRoot(1),1);
   soundCalls.length=0;const savedGameSound=gameShell.sound;gameShell.sound=sound=>{soundCalls.push('landing');return savedGameSound(sound)};
   try{combatTraceTick++;specialRuntime.step();specialRuntime.finishTick()}finally{gameShell.sound=savedGameSound}const landingCalls=soundCalls.filter(value=>value==='landing').length;
   return {cases:results,landingCalls};
  })()`);
  console.log('Actual original Helper ordinary get-hit observations',JSON.stringify(results));
  for(const result of results.cases){
   assert.equal(result.runtimeFailed,false);assert.deepEqual(result.selected,[result.trajectory==='stand'?5000:5020,0,'H',0,2,true,true,1000,1000]);assert.ok(result.history.some(row=>row[0]===(result.trajectory==='stand'?5001:5030)));assert.equal(result.state,result.trajectory.startsWith('fall')?11:0);assert.equal(result.ctrl,1);assert.equal(result.y,0);assert.ok(result.receivedAtContact>0);
   if(result.trajectory.startsWith('fall'))assert.ok(result.history.some(row=>row[0]===5120));
   if(result.trajectory==='fallBlocked')assert.ok(result.history.some(row=>row[0]===5110&&row[1]===5&&row[7]===0));
  }
  assert.equal(results.landingCalls,2);
  assert.deepEqual(errors,[]);
  console.log('Both Helper recipient slots execute the original common standing get-hit states and recover with isolated life and live hit clocks');
 }finally{await browser?.close();server.close();clearTimeout(watchdog)}
})().catch(error=>{console.error(error);process.exitCode=1});
