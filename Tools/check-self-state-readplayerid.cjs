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
  await run("prepareCharacters(['SailorSaturn','SailorMoon'])");
  const results=await run(`(()=>{
   const oldState=991620,newState=991621,results=[];
   roundFlow.enabled=()=>false;roundFlow.noDamage=()=>false;playSourceSound=()=>{};spawnSourceHitSpark=()=>{};
   for(const player of [1,2]){
    const data=characterProfiles.get(battleCharacters[player-1]).battle;
    const next={type:'S',physics:'N',moveType:'I',anim:20,ctrl:1,poweradd:10+player,controllers:[{type:'VarSet',params:{v:7,value:10+player},triggers:{1:['Time=0']},triggerall:[]}]};data.states[newState]=data.helperStates[newState]=next;
    data.helperStates[oldState]={type:'S',physics:'N',moveType:'I',anim:0,ctrl:0,controllers:[]};
    data.helperStates[991622]={type:'S',physics:'N',moveType:'I',anim:0,ctrl:0,controllers:[]};
   }
   for(const player of [1,2]){const own=characterProfiles.get(battleCharacters[player-1]),bad={...own.battle.states[newState],poweradd:99,controllers:[{type:'VarSet',params:{v:7,value:99},triggers:{1:['1']},triggerall:[]}]};characterProfiles.set('BorrowedReadFixture'+player,{...own,states:{...own.states,states:{...own.states.states,[newState]:bad}},battle:{...own.battle,states:{...own.battle.states,[newState]:bad},helperStates:{...own.battle.helperStates,[newState]:bad}}})}
   for(const kind of ['helper','root'])for(const mode of ['other','otherHelper','self','missing','invalid'])for(const player of [1,2]){
    specialRuntime.reset();rootStateChanges.clear();p1Reaction=null;customStateOwners.fill(null);customAnimationOwners.fill(null);p1Power=p2.power=0;p1Facing=p2.facing=1;p1Life=p2.life=1000;lifecycleRuntime.rounds.state=2;
    let readId=mode.startsWith('other')?3-player:mode==='invalid'?9999:player;if(mode.startsWith('other'))customStateOwners[2-player]='BorrowedReadFixture'+(3-player);
    if(mode==='otherHelper'){specialRuntime.dispatch({type:'Helper',params:{id:991622,stateno:991622}},null,null,{},specialRoot(3-player),3-player);const helper=specialRuntime.entities.at(-1);helper.stateOwner='BorrowedReadFixture'+(3-player);readId=helper.instanceId}
    const params={value:newState,ctrl:0,...(mode==='missing'?{}:{readplayerid:'Var(3)'})},controller={type:'SelfState',params,triggers:{1:['1']},triggerall:[]};let actor;
    if(kind==='helper'){
     const data=characterProfiles.get(battleCharacters[player-1]).battle;data.helperStates[oldState].controllers=[controller];
     specialRuntime.dispatch({type:'Helper',params:{id:oldState,stateno:oldState}},null,null,{},specialRoot(player),player);actor=specialRuntime.entities.at(-1);actor.vars[3]=readId;actor.vars[7]=-1;combatTraceTick++;specialRuntime.step();specialRuntime.finishTick();
    }else{
     if(player===1){enterIRState(0);runtimeVar[3]=readId;runController(controller)}else{enterP2State(0);p2.vars[3]=readId;runP2ControllerM1(controller)}actor=specialRoot(player);
    }
    const selectedPlayer=mode.startsWith('other')?3-player:player;
    results.push({kind,mode,player,selectedPlayer,state:actor.state,control:actor.ctrl,marker:actor.vars[7],power:resourceActor(player).power,provider:kind==='helper'?actor.stateOwner??null:customStateOwners[player-1],animationOwner:kind==='root'?customAnimationOwners[player-1]:null,runtimeFailed});
   }
   return results;
  })()`);
  console.log('Actual SelfState readplayerid observations',JSON.stringify(results));
  for(const result of results){
   assert.equal(result.runtimeFailed,false);assert.equal(result.state,991621);assert.equal(result.control,1);assert.equal(result.power,10+result.selectedPlayer);
   const character=result.selectedPlayer===1?'SailorSaturn':'SailorMoon';assert.equal(result.provider,result.mode.startsWith('other')?character:null);
   if(result.kind==='helper')assert.equal(result.marker,10+result.selectedPlayer);else assert.equal(result.animationOwner,result.mode.startsWith('other')?(result.player===1?'SailorSaturn':'SailorMoon'):null);
  }
  assert.deepEqual(errors,[]);
  console.log('Actual root and Helper SelfState readplayerid selects the requested player own program, retains own animation ownership and follows pinned own fallback for missing IDs');
 }finally{await browser?.close();server.close();clearTimeout(watchdog)}
})().catch(error=>{console.error(error);process.exitCode=1});
