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
   const data=characterProfiles.get(battleCharacters[0]).battle,oldState=991630,newState=991631,results=[];
   roundFlow.enabled=()=>false;roundFlow.noDamage=()=>false;playSourceSound=()=>{};spawnSourceHitSpark=()=>{};
   data.states[newState]={type:'S',physics:'N',moveType:'I',anim:0,ctrl:0,controllers:[{type:'VarSet',params:{v:7,value:'Var(7)*10+2'},triggers:{1:['Time=0']},triggerall:[]}]};
   for(const path of ['source','attack','attack-source','source-attack','locomotion','locomotion-source','locomotion-attack'])for(const mode of ['stop','continue','self','same'])for(const player of [1,2]){
    specialRuntime.reset();rootStateChanges.clear();customStateOwners.fill(null);customAnimationOwners.fill(null);p1Reaction=null;p1HitPause=p2.hitPause=p2.hitShake=p2.attackPause=0;p1Facing=p2.facing=1;p1Life=p2.life=1000;lifecycleRuntime.rounds.state=2;modifiedAILevels.splice(0,2,0,0);p2ControlMode='dummy';document.querySelector('#p2Guard').value='none';runtimeVar.fill(0);specialRoot(2).vars.fill(0);posX=-1000;p2.x=1000;posY=p2.y=0;vx=vy=p2.vx=p2.vy=0;
    const change={type:mode==='self'?'SelfState':'ChangeState',params:{value:mode==='same'?oldState:newState,ctrl:1,...(['continue','self'].includes(mode)?{continue:'Ctrl=0'}:{})},triggers:{1:[mode==='same'?'Var(39)<3':'1']},triggerall:[]};
    data.states[oldState]={type:'S',physics:'N',moveType:'I',anim:0,ctrl:0,controllers:mode==='same'?[{type:'VarAdd',params:{v:39,value:1},triggers:{1:['1']},triggerall:[]},change,{type:'VarSet',params:{v:7,value:5},triggers:{1:['Time=0']},triggerall:[]}]:[change,{type:'VarSet',params:{v:7,value:'Var(7)*10+1'},triggers:{1:['1']},triggerall:[]},{type:'VarSet',params:{v:7,value:'Var(7)*10+3'},triggers:{1:['1']},triggerall:[]}]};
    delete data.attackStates[oldState];delete data.attackStates[newState];delete data.locomotionStates[oldState];delete data.locomotionStates[newState];
    if(path.startsWith('attack'))data.attackStates[oldState]=data.states[oldState];
    if(path.startsWith('locomotion'))data.locomotionStates[oldState]=data.states[oldState];
    if(path==='locomotion')data.locomotionStates[newState]=data.states[newState];
    if(path==='attack'||path.endsWith('-attack'))data.attackStates[newState]=data.states[newState];
    enterIRState(player===1?oldState:0);enterP2State(player===2?oldState:0);
    combatTraceTick++;simStepCore();specialRuntime.finishTick();const actor=specialRoot(player),first=[actor.state,actor.time,actor.ctrl,actor.vars[7],actor.vars[39]];
    combatTraceTick++;simStepCore();specialRuntime.finishTick();const after=specialRoot(player);results.push({path,mode,player,first,second:[after.state,after.time,after.ctrl,after.vars[7]],secondCount:after.vars[39],runtimeFailed});
   }
   return results;
  })()`);
  console.log('Actual root state-body continuation observations',JSON.stringify(results));
  for(const result of results){
   const same=result.mode==='same',marker=same?5:result.mode==='stop'?2:213,number=same?991630:991631;
   assert.equal(result.runtimeFailed,false);assert.deepEqual(result.first,[number,1,0,marker,same?3:0]);assert.deepEqual(result.second,[number,2,0,marker]);
  }
  assert.deepEqual(errors,[]);
  console.log('Both actual roots execute immediate incoming bodies, controlled old tails, same-state re-entry and one genuine Time=0 evaluation per entry');
 }finally{await browser?.close();server.close();clearTimeout(watchdog)}
})().catch(error=>{console.error(error);process.exitCode=1});
