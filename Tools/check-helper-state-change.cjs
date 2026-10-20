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
   roundFlow.enabled=()=>false;roundFlow.noDamage=()=>false;playSourceSound=()=>{};spawnSourceHitSpark=()=>{};
   data.helperStates[oldState]={type:'S',physics:'N',moveType:'I',anim:0,ctrl:1,sprpriority:2,controllers:[{type:'VarSet',params:{v:9,value:1,persistent:0},triggers:{1:['1']},triggerall:[]}]};
   data.helperStates[newState]={type:'A',physics:'N',moveType:'A',anim:'IfElse(Var(2),20,0)',ctrl:1,sprpriority:'7+Var(2)',velset:'4+Var(2),-6,2',juggle:9,poweradd:'10+Var(2)',controllers:[{type:'VarAdd',params:{v:2,value:1,persistent:0,ignorehitpause:1},triggers:{1:['1']},triggerall:[]},{type:'VarSet',params:{v:3,value:'Time'},triggers:{1:['Time=0']},triggerall:[]}]};
   data.helperStates[991542]={type:'U',physics:'U',moveType:'U',anim:'-1',controllers:[]};
   for(const ikemen of [false,true]){
    specialRuntime.reset();p1Power=0;p1Life=p2.life=1000;lifecycleRuntime.rounds.state=2;modifiedAILevels.splice(0,2,0,0);
    data.engineVersions={mugen:[1,0],ikemen:ikemen?[1,0,0]:[0,0,0]};
    specialRuntime.dispatch({type:'Helper',params:{id:991540,stateno:oldState}},null,null,{},specialRoot(1),1);
    const helper=specialRuntime.entities.at(-1),step=()=>{combatTraceTick++;specialRuntime.step();specialRuntime.finishTick()};
    step();const oldRan=helper.vars[9]===1;helper.time=7;helper.animStartTime=2;helper.hitPause=2;helper.vx=1;helper.vy=2;helper.vz=3;nativeJuggle.set(helper.key,4);
    const accepted=applySourceHitState(helper,{p1stateno:newState,hitDefinitionStateOwner:battleCharacters[0]},{guarded:false});
    const snapshot=()=>[helper.state,helper.prevState,helper.time,helper.type,helper.moveType,helper.anim,helper.ctrl,helper.vx,helper.vy,helper.vz,helper.sprPriority,nativeJuggle.cost(helper.key),p1Power,helper.vars[2],specialRuntime.stateChangePending?.(helper)??false];
    const selected=snapshot(),age=helper.animStartTime;step();const firstPause=snapshot();step();const pauseEnded=snapshot();
    specialRuntime.dispatch({type:'Pause',params:{time:2,movetime:0,pausebg:0}},null,null,{},specialRoot(2),2);step();const firstBlocked=snapshot();step();const secondBlocked=snapshot();step();const initialized=snapshot();
    const replacement=specialRuntime.stateChangePending?(()=>{helper.hitPause=1;applySourceHitState(helper,{p1stateno:oldState},{guarded:false});specialRuntime.enterState(helper,0);return [specialRuntime.stateChangePending(helper),helper.state]})():[true,-1];
    Object.assign(helper,{type:'C',physics:'C',moveType:'H',anim:20,elem:4,elemTick:2,time:7,animStartTime:2});nativeJuggle.set(helper.key,12);specialRuntime.enterState(helper,991542);const retained=[helper.type,helper.physics,helper.moveType,helper.anim,helper.elem,helper.elemTick,helper.animStartTime,nativeJuggle.cost(helper.key)];
    results.push({ikemen,oldRan,accepted,selected,age,firstPause,pauseEnded,firstBlocked,secondBlocked,initialized,timeZero:helper.vars[3],replacement,retained});
   }
   return results;
  })()`);
  console.log('Actual Helper deferred StateDef observations',JSON.stringify(results));
  for(const result of results){
   const unchanged=[991541,991540,0,'S','I',0,0,1,2,3,2,4,0,0,true],paused=[...unchanged];paused[13]=result.ikemen?1:0;
   assert.equal(result.oldRan,true);assert.equal(result.accepted,true);assert.deepEqual(result.selected,unchanged);assert.equal(result.age,-5);
   for(const row of [result.firstPause,result.pauseEnded,result.firstBlocked,result.secondBlocked])assert.deepEqual(row,paused);
   assert.deepEqual(result.initialized,[991541,991540,1,'A','A',result.ikemen?20:0,1,result.ikemen?5:4,-6,2,result.ikemen?8:7,9,result.ikemen?11:10,1,false]);
   assert.equal(result.timeZero,0);assert.deepEqual(result.replacement,[false,0]);assert.deepEqual(result.retained,['C','C','H',20,4,2,-5,0]);
  }
  assert.deepEqual(errors,[]);
  console.log('Real Helper P1StateNo selection preserves old fields/animation age through hitpause and global pause, initializes StateDef once on resume and honors versioned persistent timing and replacement');
 }finally{await browser?.close();server.close();clearTimeout(watchdog)}
})().catch(error=>{console.error(error);process.exitCode=1});
