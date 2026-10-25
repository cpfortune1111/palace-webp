const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const assert=require('node:assert/strict');
const {chromium}=require('C:/Users/jeffy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..'),vendor=path.resolve(root,'../outputs/three-r180');
const server=http.createServer((request,response)=>{
 const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname),base=pathname.startsWith('/vendor/')?vendor:root,file=path.resolve(base,pathname.startsWith('/vendor/')?pathname.slice(8):'.'+(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(base+path.sep)||!fs.existsSync(file)){response.writeHead(404);response.end();return}
 let content=fs.readFileSync(file);if(file===path.join(root,'index.html'))content=Buffer.from(content.toString().replaceAll('https://cdn.jsdelivr.net/npm/three@0.180.0/','/vendor/').replaceAll('requestAnimationFrame(loop);','').replace('</script></body>',`window.bindingTest={run:source=>eval(source)};</script></body>`));
 response.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');response.end(content);
});
(async()=>{
 let browser;
 try{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));browser=await chromium.launch({headless:true,channel:'msedge'});const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:'+server.address().port+'/');await page.waitForFunction(()=>window.bindingTest?.run('!!dat&&!!stateIR&&!!battleDat&&!!lifecycleDat&&!!specialDat&&!!commonAnimationDat'),null,{timeout:90000});
  const run=source=>page.evaluate(source=>window.bindingTest.run(source),source);await run("prepareCharacters(['SailorSaturn','SailorSaturn'])");
  const result=await run(`(()=>{
   const data=characterProfiles.get('SailorSaturn').battle,saved={profile:combatEngineProfile,compatibility:data.compatibility,definitions:[data.helperStates[991998],data.helperStates[991999]],enabled:roundFlow.enabled,canFight:roundFlow.canFight,step:roundFlow.step};let cases=0,driverCases=0,postypeCases=0,screenCases=0,zeroCases=0;
   const idOf=actor=>actor.kind==='helper'?actor.instanceId:fighterPlayer(actor),bindingOf=actor=>actor.kind==='helper'?actor:actor.player===1?p1LifecycleBinding:p2;
   const dispatch=(actor,type,params)=>executeControllerM1({type,params},bindingOf(actor),specialRuntime.context(actor),{owner:actor,player:actor.player,schedulingApplied:true,explod:values=>spawnSourceExplod(values,actor,actor.player,specialRuntime.context(actor))});
   const place=(actor,position)=>{const unit=collisionWorldRatio(gravityActorData(actor));dispatch(actor,'PosSet',{x:String(position[0]/unit),y:String(position[1]/unit),z:String(position[2]/unit)})};
   const clearPause=()=>{p1HitPause=0;p2.hitPause=0;p2.hitShake=0;p2.attackPause=0;for(const entity of specialRuntime.entities){entity.hitPause=0;entity.hitShake=0}specialRuntime.pauses.normal.fill(null);specialRuntime.pauses.super.fill(null)};
   try{
    for(const number of [991998,991999])data.helperStates[number]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[]};
    for(const profile of ['mugen11','ikemen'])for(const player of [1,2])for(const helper of [false,true])for(const ikemen of [false,true]){
     combatEngineProfile=profile;data.compatibility=ikemen?'ikemen':'mugen';specialRuntime.reset();sourceExplods.length=0;clearPause();let actor=specialRoot(player);
     if(helper){specialRuntime.dispatch({type:'Helper',params:{stateno:991998,id:991998}},actor,specialRuntime.context(actor),{},actor,player);actor=specialRuntime.entities.at(-1)}
     for(const mode of ['owner','opponent','helper','missing']){
      sourceExplods.length=0;clearPause();let target=mode==='owner'?actor:mode==='opponent'?specialRoot(3-player):null;
      if(mode==='helper'){const parent=specialRoot(3-player);specialRuntime.dispatch({type:'Helper',params:{stateno:991999,id:991999}},parent,specialRuntime.context(parent),{},parent,3-player);target=specialRuntime.entities.at(-1)}
      const targetId=target?idOf(target):999999,common=mode==='opponent'||mode==='missing';dispatch(actor,'Explod',{id:'54',anim:common?'F120':'0',pos:'10,-20,3',vel:'2,0',accel:'1,0',bindtime:'0',removetime:'-1',ignorehitpause:'0'});const effect=sourceExplods[0],facing=effect.facing;effect.age=5;
      dispatch(actor,'ModifyExplod',{id:'54',bindid:mode==='owner'?'-1':String(targetId),bindtime:'2'});const count=ikemen?7:2;if(effect.bindtime!==count||effect.nativeBinding?.targetId!==targetId)throw Error('Actual versioned binding assignment/recipient ID mismatch');
      const relative=[...effect.nativeBinding.relative],initial=[...effect.nativeBinding.position];stepSourceExplods();if(effect.age!==5)throw Error('Native-bound effect also advanced in the early legacy phase');
      for(let tick=0;tick<count;tick++){
       if(target){place(target,[200+10*tick,-30+2*tick,5+tick]);if(target.kind==='helper'&&tick===1)target.facing*=-1}
       const position=target?sourceExplodBindingTargetPosition(combatTargetActor(targetId)):initial;stepSourceExplods(true);
       for(const [axis,name] of ['x','y','z'].entries())if(effect[name]!==Math.fround(position[axis]+relative[axis]))throw Error('Actual bound XYZ does not follow the selected live target '+JSON.stringify({profile,player,helper,ikemen,mode,tick,name,actual:effect[name],expected:position[axis]+relative[axis]}));
       if(effect.bindtime!==count-tick-1||effect.facing!==facing||effect.vx!==(3+tick)*facing)throw Error('Bound timer/fixed facing/velocity advancement mismatch');
      }
      const queued=[...effect.nativeBinding.next];if(target)place(target,[900,-100,30]);stepSourceExplods(true);for(const [axis,name] of ['x','y','z'].entries())if(effect[name]!==Math.fround(queued[axis]+relative[axis]))throw Error('Released effect did not use previously queued native displacement');
      dispatch(actor,'ModifyExplod',{id:'54',bindtime:'-1'});const pausedAge=effect.age,pausedX=effect.x;if(helper)actor.hitPause=3;else if(player===1)p1HitPause=3;else p2.hitPause=3;stepSourceExplods(true);if(effect.age!==pausedAge||effect.x!==pausedX||effect.bindtime!==-1)throw Error('Parent hitpause advanced a native binding');clearPause();
      const disabled=rootStatusFlags[player-1].disabled;rootStatusFlags[player-1].disabled=true;stepSourceExplods(true);rootStatusFlags[player-1].disabled=disabled;if(effect.age!==pausedAge||effect.x!==pausedX)throw Error('Disabled root advanced a native binding');
      transDrawQueue.reset();drawSourceExplods();if(!transDrawQueue.ordered().some(entry=>entry.kind==='explod'))throw Error('Real bound effect stopped drawing');
      dispatch(actor,'ModifyExplod',{id:'54',removetime:'0'});stepSourceExplods(true);if(sourceExplods.includes(effect))throw Error('Bound effect ignored native removal time');cases++;
     }
     sourceExplods.length=0;clearPause();dispatch(actor,'Explod',{id:'56',anim:'F120',pos:'2,-3,0',bindtime:'0',removetime:'-1'});const positioned=sourceExplods[0],originalFacing=combatTargetActor(idOf(actor)).facing;positioned.age=5;if(helper)actor.facing=-originalFacing;else if(player===1)setP1Facing(-originalFacing);else p2.facing=-originalFacing;
     dispatch(actor,'ModifyExplod',{id:'56',postype:'p1',pos:'7,-9,4',vel:'2,0',bindid:String(3-player),bindtime:'-1'});const live=combatTargetActor(idOf(actor)),placed=sourceExplodBindingTargetPosition(live);if(positioned.nativeBinding.targetId!==idOf(actor)||positioned.facing!==live.facing||positioned.vx!==2*live.facing||JSON.stringify(positioned.nativeBinding.relative)!==JSON.stringify([7*live.facing,-9,4]))throw Error('Final postype did not override bindid/reanchor/face relative X and velocity');stepSourceExplods(true);if(positioned.x!==Math.fround(placed[0]+7*live.facing))throw Error('Final postype target failed actual follow');
     actor.vars[19]=0;dispatch(actor,'ModifyExplod',{id:'56',pos:'(var(19):=11),-13,6'});const relative=ikemen?[11,-13,6]:[7*live.facing,-9,4];if(actor.vars[19]!==Number(ikemen)*11||JSON.stringify(positioned.nativeBinding.relative)!==JSON.stringify(relative))throw Error('Native relative-position writes/postype lock were incorrectly faced or evaluated');stepSourceExplods(true);if(positioned.x!==Math.fround(placed[0]+relative[0]))throw Error('Unfaced native relative position failed drawing position');if(helper)actor.facing=originalFacing;else if(player===1)setP1Facing(originalFacing);else p2.facing=originalFacing;postypeCases++;
     sourceExplods.length=0;dispatch(actor,'Explod',{id:'57',anim:'F120',postype:'left',pos:'100,80',bindtime:'0',removetime:'-1'});const screen=sourceExplods[0];screen.age=5;dispatch(actor,'ModifyExplod',{id:'57',vel:'2,0',bindid:String(3-player),bindtime:'2'});stepSourceExplods(true);stepSourceExplods(true);if(!screen.screen||screen.x!==(ikemen?102:100)||screen.y!==80)throw Error('Screen-edge trajectory/character lock mismatch '+JSON.stringify({profile,player,helper,ikemen,x:screen.x,y:screen.y,screen:screen.screen,vx:screen.vx}));screenCases++;
     for(const early of [false,true]){
      sourceExplods.length=0;clearPause();roundFlow.enabled=()=>early;roundFlow.canFight=()=>!early;roundFlow.step=()=>{};
      const parent=specialRoot(3-player);specialRuntime.dispatch({type:'Helper',params:{stateno:991999,id:991999}},parent,specialRuntime.context(parent),{},parent,3-player);const target=specialRuntime.entities.at(-1);target.created=combatTraceTick-1;target.vx=4;
      dispatch(actor,'Explod',{id:'55',anim:'F120',pos:'5,-10,2',bindtime:'0',removetime:'-1',ignorehitpause:'1'});const effect=sourceExplods.find(value=>value.id===55);effect.age=5;dispatch(actor,'ModifyExplod',{id:'55',bindid:String(target.instanceId),bindtime:'-1'});const before=target.x,relative=[...effect.nativeBinding.relative];simStep();
      if(effect.age!==6||target.x!==before+4||effect.x!==Math.fround(target.x+relative[0])||effect.y!==Math.fround(target.y+relative[1])||effect.z!==Math.fround(target.z+relative[2]))throw Error('Real simulation driver did not step binding exactly once after moving Helpers in both fighting/non-fighting branches '+JSON.stringify({early,player,helper,ikemen,age:effect.age,x:effect.x,target:target.x,before}));driverCases++;
     }
     sourceExplods.length=0;clearPause();dispatch(actor,'Explod',{id:'58',anim:'F120',bindtime:'0',removetime:'0',ignorehitpause:'0'});const zero=sourceExplods[0];dispatch(actor,'ModifyExplod',{id:'58',bindtime:'-1'});if(helper)actor.hitPause=3;else if(player===1)p1HitPause=3;else p2.hitPause=3;stepSourceExplods(true);if(!sourceExplods.includes(zero)||zero.age!==0)throw Error('First paused binding update lost native first-frame removal gate');stepSourceExplods(true);if(sourceExplods.includes(zero))throw Error('Zero lifetime remained stuck because hitpause prevented age advancement');clearPause();
     dispatch(actor,'Explod',{id:'59',anim:'F120',bindtime:'0',removetime:'0'});const disabledZero=sourceExplods[0];dispatch(actor,'ModifyExplod',{id:'59',bindtime:'-1'});const disabled=rootStatusFlags[player-1].disabled;rootStatusFlags[player-1].disabled=true;stepSourceExplods(true);rootStatusFlags[player-1].disabled=disabled;stepSourceExplods(true);if(sourceExplods.includes(disabledZero))throw Error('Disabled-root time incorrectly prolonged the first-frame removal gate');zeroCases++;
    }
    return {cases,driverCases,postypeCases,screenCases,zeroCases};
   }finally{combatEngineProfile=saved.profile;data.compatibility=saved.compatibility;roundFlow.enabled=saved.enabled;roundFlow.canFight=saved.canFight;roundFlow.step=saved.step;for(const [index,number] of [991998,991999].entries()){if(saved.definitions[index]===undefined)delete data.helperStates[number];else data.helperStates[number]=saved.definitions[index]}specialRuntime.reset();sourceExplods.length=0;clearPause()}
  })()`);
  assert.deepEqual(result,{cases:64,driverCases:32,postypeCases:16,screenCases:16,zeroCases:16});assert.deepEqual(errors,[]);console.log('Native Explod binding passes 64 target trajectories, 32 actual late-driver fighting/non-fighting cases, 16 final-postype/relative-position, 16 screen-edge and 16 paused/disabled first-frame removal cases');
 }finally{await browser?.close();server.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
