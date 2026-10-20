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
   const data=characterProfiles.get(battleCharacters[0]).battle,oldState=991610,newState=991611,results=[];
   roundFlow.enabled=()=>false;roundFlow.noDamage=()=>false;playSourceSound=()=>{};spawnSourceHitSpark=()=>{};
   data.helperStates[newState]={type:'A',physics:'N',moveType:'I',anim:20,ctrl:0,velset:'2,0',controllers:[{type:'VarSet',params:{v:7,value:'Time'},triggers:{1:['Time=0']},triggerall:[]},{type:'VarSet',params:{v:8,value:'Ctrl'},triggers:{1:['Time=0']},triggerall:[]}]};
   data.helperStates[991612]={type:'S',physics:'N',moveType:'I',anim:20,controllers:data.helperStates[newState].controllers};
   data.helperStates[991613]={type:'S',physics:'N',moveType:'I',ctrl:'Anim=20',velset:'IfElse(Anim=20,3,4),0',controllers:data.helperStates[newState].controllers};
   data.helperStates[991614]={...data.helperStates[991613],anim:0};
   const globals=data.globalControllers;
   for(const mode of ['current','hitpause','global','same','negative','positive','anim','animheader','animkeep','animpause','animself','contCurrent','contPause','contGlobal','contSelf'])for(const player of [1,2]){
    specialRuntime.reset();rootStateChanges.clear();customStateOwners.fill(null);data.globalControllers={...globals,'-2':[]};p1Facing=p2.facing=1;p1Life=p2.life=1000;lifecycleRuntime.rounds.state=2;
    const change={type:'ChangeState',params:{value:mode==='same'?oldState:['negative','positive'].includes(mode)?991612:newState,ctrl:mode==='negative'?-1:mode==='positive'?2:1,ignorehitpause:1},triggers:{1:[mode==='same'?'Var(1)<3':'1']},triggerall:[]};
    if(mode.startsWith('anim')){change.params.value=mode==='animheader'?991614:991613;change.params.anim=mode==='animkeep'?-1:'IfElse(Ctrl=0,20,0)';if(mode==='animself')change.type='SelfState'}
    if(mode.startsWith('cont')){change.params.continue='Ctrl=0';if(mode==='contSelf')change.type='SelfState'}
    const tail={type:'VarSet',params:{v:9,value:mode.startsWith('cont')?'Var(7)+10':99,ignorehitpause:1},triggers:{1:['1']},triggerall:[]};
    const secondTail={type:'VarSet',params:{v:10,value:'Var(9)+100',ignorehitpause:1},triggers:{1:['1']},triggerall:[]};
    data.helperStates[oldState]={type:'S',physics:'N',moveType:'I',anim:0,ctrl:0,controllers:mode==='same'?[{type:'VarAdd',params:{v:1,value:1},triggers:{1:['1']},triggerall:[]},change,{type:'VarSet',params:{v:7,value:'Time'},triggers:{1:['Time=0']},triggerall:[]}]:['global','contGlobal'].includes(mode)?[]:[change,tail,secondTail]};
    if(['global','contGlobal'].includes(mode))data.globalControllers['-2']=[{...change,triggers:{1:['StateNo=991610']}},tail,secondTail];
    specialRuntime.dispatch({type:'Helper',params:{id:oldState,stateno:oldState,keyctrl:['global','contGlobal'].includes(mode)?2:0}},null,null,{},specialRoot(player),player);
    const helper=specialRuntime.entities.at(-1),step=()=>{combatTraceTick++;specialRuntime.step();specialRuntime.finishTick()};helper.vars[7]=helper.vars[8]=-1;if(['hitpause','animpause','contPause'].includes(mode))helper.hitPause=2;if(mode==='animkeep'){helper.time=7;helper.animStartTime=2}
    const read=()=>[helper.state,helper.time,helper.type,helper.anim,helper.ctrl,helper.vx,helper.vars[7],helper.vars[8],helper.vars[9],helper.hitPause,specialRuntime.stateChangePending(helper)];
    step();const first=read();if(['hitpause','animpause','contPause'].includes(mode)){step();step()}results.push({mode,player,first,final:read(),tailSecond:helper.vars[10],animationAge:helper.time-helper.animStartTime,reentries:helper.vars[1],runtimeFailed});
   }
   data.globalControllers=globals;const rootControl=[];
   data.states[newState]=data.attackStates[newState]={type:'S',physics:'N',moveType:'I',anim:0,ctrl:0,controllers:[]};
   for(const player of [1,2]){if(player===1)enterIRState(0);else enterP2State(0);const controller={type:'ChangeState',params:{value:newState,ctrl:1},triggers:{1:['1']},triggerall:[]};if(player===1)runController(controller);else runP2ControllerM1(controller);rootControl.push(specialRoot(player).ctrl)}
   const rootAnimation=[];data.states[991613]=data.attackStates[991613]=data.helperStates[991613];data.states[991614]=data.attackStates[991614]=data.helperStates[991614];
   for(const mode of ['anim','animkeep','animheader'])for(const player of [1,2]){if(player===1){enterIRState(0);runtimeCtrl=0}else{enterP2State(0);p2.ctrl=0}const controller={type:'ChangeState',params:{value:mode==='animheader'?991614:991613,anim:mode==='animkeep'?-1:'IfElse(Ctrl=0,20,0)',ctrl:1},triggers:{1:['1']},triggerall:[]};if(player===1)runController(controller);else runP2ControllerM1(controller);const actor=specialRoot(player);rootAnimation.push([mode,player,actor.anim,actor.ctrl,actor.vx*actor.facing])}
   return {cases:results,rootControl,rootAnimation};
  })()`);
  console.log('Actual Helper general state transition observations',JSON.stringify(results));
  for(const result of results.cases){
   assert.equal(result.runtimeFailed,false);
   if(result.mode.startsWith('cont')){const immediate=['contCurrent','contSelf'].includes(result.mode);if(result.mode==='contPause')assert.deepEqual(result.first,[991611,0,'S',0,1,0,-1,-1,9,1,true]);assert.deepEqual(result.final,[991611,1,'A',20,0,2,0,0,immediate?10:9,0,false]);assert.equal(result.tailSecond,immediate?110:109);continue}
   assert.equal(result.tailSecond,0);
   if(result.mode==='same'){assert.equal(result.reentries,3);assert.equal(result.final[0],991610);assert.equal(result.final[1],1);assert.equal(result.final[4],0);assert.equal(result.final[6],0);continue}
   if(['negative','positive'].includes(result.mode)){const control=+(result.mode==='positive');assert.deepEqual(result.final,[991612,1,'S',20,control,0,0,control,0,0,false]);continue}
   if(result.mode.startsWith('anim')){const keep=result.mode==='animkeep',header=result.mode==='animheader',control=Number(!keep&&!header);if(result.mode==='animpause')assert.deepEqual(result.first,[991613,0,'S',20,1,0,-1,-1,0,1,true]);assert.deepEqual(result.final,[header?991614:991613,1,'S',keep||header?0:20,control,keep?4:3,0,control,0,0,false]);assert.equal(result.animationAge,keep?6:1);continue}
   if(result.mode==='hitpause')assert.deepEqual(result.first,[991611,0,'S',0,1,0,-1,-1,0,1,true]);
   assert.deepEqual(result.final,[991611,1,'A',20,0,2,0,0,0,0,false]);
  }
  assert.deepEqual(results.rootControl,[0,0]);for(const [mode,player,animation,control,velocity]of results.rootAnimation)assert.deepEqual([animation,control,velocity],mode==='animkeep'?[0,0,4]:mode==='animheader'?[0,0,3]:[20,1,3]);assert.deepEqual(errors,[]);
  console.log('Real Helper current-state chains and same-state re-entry execute Time=0, hitpause defers headers, globals initialize after their phase, and controller control precedes StateDef control');
 }finally{await browser?.close();server.close();clearTimeout(watchdog)}
})().catch(error=>{console.error(error);process.exitCode=1});
