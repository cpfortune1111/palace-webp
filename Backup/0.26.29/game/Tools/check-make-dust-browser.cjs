const assert=require('node:assert/strict');
const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const {chromium}=require('C:/Users/jeffy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..'),vendor=path.resolve(root,'../outputs/three-r180');
const server=http.createServer((request,response)=>{
 const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname),base=pathname.startsWith('/vendor/')?vendor:root,file=path.resolve(base,pathname.startsWith('/vendor/')?pathname.slice(8):'.'+(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(base+path.sep)||!fs.existsSync(file)){response.writeHead(404);response.end();return}
 let content=fs.readFileSync(file);if(file===path.join(root,'index.html'))content=Buffer.from(content.toString().replaceAll('https://cdn.jsdelivr.net/npm/three@0.180.0/','/vendor/').replaceAll('requestAnimationFrame(loop);','').replace('</script></body>',`window.dustTest={run:source=>eval(source)};</script></body>`));
 response.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');response.end(content);
});
(async()=>{
 let browser;
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});browser=await chromium.launch({headless:true,channel:'msedge'});const page=await browser.newPage({viewport:{width:1280,height:720}});
  await page.goto('http://127.0.0.1:'+server.address().port+'/');await page.waitForFunction(()=>window.dustTest?.run('!!dat&&!!stateIR&&!!battleDat&&!!lifecycleDat&&!!specialDat&&!!roundCharDat&&!!cmdDat&&!!airDat&&!!fallDat&&!!guardDat&&!!turnDat'),null,{timeout:90000});
  const run=source=>page.evaluate(source=>window.dustTest.run(source),source);await run("prepareCharacters(['SailorSaturn','SailorSaturn'])");
  const rows=await run(`(()=>{
   const rows=[],saved={profile:combatEngineProfile,offsets:rootDrawOffsets.map(offset=>[...offset]),camera:[cameraX,cameraY,cameraZoom],config:{...STAGE_CAMERA},player:{...stageCameraConfig.player}};
   try{for(const profile of ['mugen11','ikemen'])for(const player of [1,2])for(const kind of ['root','helper'])for(const redirected of [false,true]){
    specialRuntime.reset();sourceExplods.length=0;combatEngineProfile=profile;p1HitPause=0;p2.attackPause=0;p2.hitShake=0;
    const root=specialRoot(player),data=characterProfiles.get(battleCharacters[player-1]).battle;let target=root;
    if(kind==='helper'){data.helperStates[991888]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[]};specialRuntime.dispatch({type:'Helper',params:{stateno:991888,id:991888}},root,specialRuntime.context(root),{},root,player);target=specialRuntime.entities.at(-1);target.x+=80;target.y=-10;target.drawOffset=[7,9]}
    else rootDrawOffsets[player-1]=[7,9];
    const caller=redirected?specialRoot(3-player):target,context=specialRuntime.context(caller),adapter={owner:caller,player:fighterPlayer(caller),schedulingApplied:true},state=makeDustStateFor(target);
    caller.vars[7]=11;if(redirected)target.vars[7]=99;state.elapsed=3;
    const params={spacing:'3',pos:'Var(7),20,30',pos2:'50,60,70',...(redirected?{redirectid:String(kind==='helper'?target.instanceId:player)}:{})};
    executeControllerM1({type:'MakeDust',params},caller,context,adapter);
    if(sourceExplods.length!==1)throw Error('Native shared spacing should emit only first position');const effect=sourceExplods[0],unit=collisionWorldRatio(gravityActorData(target));
    const offset=kind==='helper'?offsetDrawingPosition([0,0],target.drawOffset,target.localScale??1):rootDrawOffsets[player-1];
    const expected=[Math.fround(Math.fround(target.x+Math.fround(11*unit*target.facing))+offset[0]),Math.fround(Math.fround(target.y+Math.fround(20*unit))+offset[1]),Math.fround(Number(target.z??0)+Math.fround(30*unit))];
    if(JSON.stringify([effect.x,effect.y,effect.z])!==JSON.stringify(expected)||effect.anim!==120||effect.sprpriority!==2147483647||effect.layerno!==actorSpriteLayer(target))throw Error('Actual dust coordinate/priority/layer mismatch');
    transDrawQueue.reset();drawSourceExplods();let entry=transDrawQueue.ordered().find(entry=>entry.kind==='dust');if(!entry||entry.source.width!==commonDustDat.sprites['120,0'].w)throw Error('Dust renderer did not use common F120');
    if(!entry.source.getContext('2d').getImageData(0,0,entry.source.width,entry.source.height).data.some((value,index)=>index%4===3&&value>0))throw Error('Dust source has no visible pixels');
    effect.age=3;transDrawQueue.reset();drawSourceExplods();entry=transDrawQueue.ordered().find(entry=>entry.kind==='dust');if(entry.source.width!==commonDustDat.sprites['120,1'].w)throw Error('Common dust sampled character animation 120 instead of AIR timing');
    effect.age=25;p1HitPause=2;p2.attackPause=2;stepSourceExplods();if(effect.age!==26)throw Error('Native MakeDust default ignorehitpause was lost');p1HitPause=0;p2.attackPause=0;stepSourceExplods();if(sourceExplods.length!==0)throw Error('Dust did not expire after 27 native AIR ticks');
    state.elapsed=3;const assertion={owner:target,player,schedulingApplied:true};executeControllerM1({type:'AssertSpecial',params:{flag:'NoMakeDust'}},target,specialRuntime.context(target),assertion);executeControllerM1({type:'MakeDust',params:{}},target,specialRuntime.context(target),assertion);if(sourceExplods.length||state.elapsed!==3)throw Error('NoMakeDust failed to preserve emission counter');executeControllerM1({type:'AssertSpecial',params:{flag:'NoMakeDust',enabled:'0'}},target,specialRuntime.context(target),assertion);
    state.elapsed=0;state.lastTick=-1;specialRuntime.finishTick();if(state.elapsed!==1)throw Error('Actual actor finish clock did not advance dust');specialRuntime.finishTick();if(state.elapsed!==1)throw Error('Dust clock advanced twice in same tick');combatTraceTick++;if(kind==='helper')target.hitPause=2;else if(player===1)p1HitPause=2;else p2.attackPause=2;specialRuntime.finishTick();if(state.elapsed!==2)throw Error('Local hitpause incorrectly froze native dust spacing');
    rows.push({profile,player,kind,redirected});
   }
   specialRuntime.reset();sourceExplods.length=0;p1HitPause=0;p2.attackPause=0;
   const owner=specialRoot(1),data=characterProfiles.get(battleCharacters[0]).battle;data.helperStates[991889]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[{type:'MakeDust',params:{spacing:'1',pos:'5,0,0'},triggers:{1:['1']},triggerall:[]}]};specialRuntime.dispatch({type:'Helper',params:{stateno:991889,id:991889}},owner,specialRuntime.context(owner),{},owner,1);const moving=specialRuntime.entities.at(-1);moving.x=owner.x+200;moving.vx=4;moving.created=combatTraceTick-1;makeDustStateFor(moving).elapsed=1;simStep();const bound=sourceExplods.find(effect=>effect.dust&&effect.ownerKey===moving.key);if(!bound||bound.x!==moving.x+5*moving.facing||bound.x===owner.x+5*owner.facing)throw Error('Helper dust bound to root instead of live Helper after physics');
   const clock=makeDustStateFor(moving);specialRuntime.pauses.normal[0]={remaining:10,movetime:0,player:1,created:combatTraceTick-1};specialRuntime.moveTimes.set(moving.key,{normal:0});clock.elapsed=7;combatTraceTick++;specialRuntime.finishTick();if(clock.elapsed!==7)throw Error('Global pause advanced Helper dust clock');specialRuntime.moveTimes.set(moving.key,{normal:1});combatTraceTick++;specialRuntime.finishTick();if(clock.elapsed!==8)throw Error('Allowed pause movetime did not advance Helper dust clock');
   specialRuntime.reset();sourceExplods.length=0;p1HitPause=0;p2.attackPause=0;cameraX=20;cameraY=0;cameraZoom=1;Object.assign(STAGE_CAMERA,{topz:0,botz:100,ztopscale:.5,zbotscale:1.5,depthtoscreen:2});Object.assign(stageCameraConfig.player,{topbound:-100,botbound:100});
   const actor=specialRoot(1),state=makeDustStateFor(actor),fit=Math.min(innerWidth/1280,innerHeight/720);
   for(const depth of [0,100]){sourceExplods.length=0;state.elapsed=3;executeControllerM1({type:'MakeDust',params:{spacing:'1',pos:'0,-10,'+depth}},actor,specialRuntime.context(actor),{owner:actor,player:1,schedulingApplied:true});const effect=sourceExplods[0],scale=.5+effect.z/100;transDrawQueue.reset();drawSourceExplods();const entry=transDrawQueue.ordered().find(entry=>entry.kind==='dust');if(Math.abs(entry.matrix[0]-scale*effect.facing*fit)>1e-6||Math.abs(entry.matrix[5]-worldScreenY(effect.y*scale+effect.z*2)*fit)>1e-6)throw Error('Actual XYZ operand did not change dust transform')}
   for(const player of [1,2])for(const under of [0,1]){
    sourceExplods.length=0;const actor=specialRoot(player);
    executeControllerM1({type:'GameMakeAnim',params:{value:'120',pos:'10,-20,0',under:String(under)}},actor,specialRuntime.context(actor),{owner:actor,player,schedulingApplied:true});
    if(sourceExplods.length!==1)throw Error('GameMakeAnim did not reach source effects');
    const effect=sourceExplods[0];if(effect.anim!==120||!effect.common||effect.sprpriority!==-2147483648||effect.layerno!==(under?0:1))throw Error('GameMakeAnim defaults/resource/layer mismatch');
    transDrawQueue.reset();drawSourceExplods();const entry=transDrawQueue.ordered().find(entry=>entry.kind==='gamemakeanim');
    if(!entry||!entry.source.getContext('2d').getImageData(0,0,entry.source.width,entry.source.height).data.some((value,index)=>index%4===3&&value>0))throw Error('GameMakeAnim produced no visible pixels');
    for(let tick=0;tick<27;tick++)stepSourceExplods();if(sourceExplods.length)throw Error('GameMakeAnim did not expire');
   }
   for(const depth of [0,100]){
    sourceExplods.length=0;const actor=specialRoot(1);
    executeControllerM1({type:'GameMakeAnim',params:{value:'120',pos:'0,-10,'+depth}},actor,specialRuntime.context(actor),{owner:actor,player:1,schedulingApplied:true});
    const effect=sourceExplods[0],scale=.5+effect.z/100;transDrawQueue.reset();drawSourceExplods();const entry=transDrawQueue.ordered().find(entry=>entry.kind==='gamemakeanim');
    if(!entry||Math.abs(entry.matrix[0]-scale*effect.facing*fit)>1e-6||Math.abs(entry.matrix[5]-worldScreenY(effect.y*scale+effect.z*2)*fit)>1e-6)throw Error('GameMakeAnim Z did not reach drawing');
   }
   specialRuntime.reset();sourceExplods.length=0;
   data.helperStates[991890]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[{type:'GameMakeAnim',params:{value:'120',pos:'5,0,20'},triggers:{1:['1']},triggerall:[]}]};
   const gameOwner=specialRoot(1);specialRuntime.dispatch({type:'Helper',params:{stateno:991890,id:991890}},gameOwner,specialRuntime.context(gameOwner),{},gameOwner,1);
   const gameHelper=specialRuntime.entities.at(-1);gameHelper.x=gameOwner.x+200;gameHelper.vx=4;gameHelper.z=30;gameHelper.created=combatTraceTick-1;simStep();
   const gameEffect=sourceExplods.find(effect=>effect.kind==='gamemakeanim'&&effect.ownerKey===gameHelper.key);
   if(!gameEffect||gameEffect.x!==gameHelper.x+5*gameHelper.facing||gameEffect.z!==gameHelper.z+20)throw Error('GameMakeAnim did not bind to moving Helper XYZ');
   const savedRandomSeed=variableRandomStream.state();let gameCases=0;
   try{
    for(const profile of ['mugen11','ikemen'])for(const player of [1,2])for(const kind of ['root','helper'])for(const redirected of [false,true])for(const own of [false,true]){
     specialRuntime.reset();sourceExplods.length=0;combatEngineProfile=profile;
     const root=specialRoot(player),ownData=characterProfiles.get(battleCharacters[player-1]).battle;let target=root;
     if(kind==='helper'){
      ownData.helperStates[991891]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[]};
      specialRuntime.dispatch({type:'Helper',params:{stateno:991891,id:991891}},root,specialRuntime.context(root),{},root,player);target=specialRuntime.entities.at(-1);target.x+=90;target.y=-30;
     }
     const caller=redirected?specialRoot(3-player):target;caller.vars[7]=11;if(redirected)target.vars[7]=99;
     variableRandomStream.seed(1);
     const params={value:own?'S0':'120',pos:'Var(7),20,30',random:'8,12,16',...(redirected?{redirectid:String(kind==='helper'?target.instanceId:player)}:{})};
     executeControllerM1({type:'GameMakeAnim',params},caller,specialRuntime.context(caller),{owner:caller,player:fighterPlayer(caller),schedulingApplied:true});
     const effect=sourceExplods[0],unit=collisionWorldRatio(gravityActorData(target)),offset=kind==='helper'?offsetDrawingPosition([0,0],target.drawOffset??[0,0],target.localScale??1):rootDrawOffsets[player-1];
     const halves=[4,6,8],samples=[16807,282475249,1622650073],relative=[11,20,30].map((value,index)=>Math.fround(value+Math.fround(-halves[index]+Math.fround(Math.fround(Math.fround(samples[index])*Math.fround(halves[index]*2))/Math.fround(2147483647)))));
     const expected=[Math.fround(Math.fround(target.x+Math.fround(relative[0]*unit*target.facing))+offset[0]),Math.fround(Math.fround(target.y+Math.fround(relative[1]*unit))+offset[1]),Math.fround(Number(target.z??0)+Math.fround(relative[2]*unit))];
     if(variableRandomStream.state()!==1622650073)throw Error('GameMakeAnim did not consume three native random components');
     if(sourceExplods.length!==1||JSON.stringify([effect.x,effect.y,effect.z])!==JSON.stringify(expected)||effect.common===own||effect.player!==player||effect.ownerKey!==(kind==='helper'?target.key:'root'+player))throw Error('GameMakeAnim redirected random/recipient mismatch '+JSON.stringify({profile,player,kind,redirected,own}));
     transDrawQueue.reset();drawSourceExplods();const entry=transDrawQueue.ordered().find(entry=>entry.kind==='gamemakeanim');if(!entry||!entry.source.getContext('2d').getImageData(0,0,entry.source.width,entry.source.height).data.some((value,index)=>index%4===3&&value>0))throw Error('GameMakeAnim own/common matrix produced no visible pixels');
     gameCases++;
    }
   }finally{variableRandomStream.seed(savedRandomSeed)}
   if(gameCases!==32)throw Error('Incomplete GameMakeAnim consumer matrix');
   sourceExplods.length=0;
   const defaultActor=specialRoot(1);executeControllerM1({type:'GameMakeAnim',params:{}},defaultActor,specialRuntime.context(defaultActor),{owner:defaultActor,player:1,schedulingApplied:true});
   if(sourceExplods.length!==1||sourceExplods[0].anim!==0||sourceExplods[0].common)throw Error('Omitted GameMakeAnim value must retain own animation zero');
   transDrawQueue.reset();drawSourceExplods();if(!transDrawQueue.ordered().some(entry=>entry.kind==='gamemakeanim'))throw Error('Default GameMakeAnim animation zero did not render');
   let commonCases=0;
   for(const [action,frames] of Object.entries(commonAnimationDat.actions)){
    sourceExplods.length=0;executeControllerM1({type:'GameMakeAnim',params:{value:action}},defaultActor,specialRuntime.context(defaultActor),{owner:defaultActor,player:1,schedulingApplied:true});
    const effect=sourceExplods[0];if(!effect?.gameCommon||effect.anim!==Number(action))throw Error('Common action not routed to complete atlas '+action);
    let age=0;
    for(const frame of frames){
     effect.age=age;transDrawQueue.reset();drawSourceExplods();const entry=transDrawQueue.ordered().find(entry=>entry.kind==='gamemakeanim'),sprite=commonAnimationDat.sprites[frame.group+','+frame.item];
     if(!entry||entry.source.width!==sprite.w||entry.source.height!==sprite.h||!entry.source.getContext('2d').getImageData(0,0,entry.source.width,entry.source.height).data.some((value,index)=>index%4===3&&value>0))throw Error('Common frame did not render '+action+' at '+age);
     age+=frame.time;
    }
    effect.age=age-1;stepSourceExplods();if(sourceExplods.length)throw Error('Common animation lifetime mismatch '+action);commonCases++;
   }
   if(commonCases!==33)throw Error('Incomplete common animation inventory');
   const blendCases=[{action:'10',age:0,type:'none',alpha:[255,0]},{action:'0',age:0,type:'add',alpha:[255,255]},{action:'3',age:1,type:'add',alpha:[255,128]}];
   for(const sample of blendCases){
    sourceExplods.length=0;executeControllerM1({type:'GameMakeAnim',params:{value:sample.action}},defaultActor,specialRuntime.context(defaultActor),{owner:defaultActor,player:1,schedulingApplied:true});sourceExplods[0].age=sample.age;
    transDrawQueue.reset();drawSourceExplods();const entry=transDrawQueue.ordered().find(entry=>entry.kind==='gamemakeanim');
    if(entry.state.type!==sample.type||JSON.stringify(entry.state.alpha)!==JSON.stringify(sample.alpha))throw Error('Common AIR blend did not reach compositor state '+sample.action);
    entry.matrix=[1,0,0,1,200,200];
    const target=document.createElement('canvas'),scratch=document.createElement('canvas');target.width=scratch.width=512;target.height=scratch.height=512;const targetContext=target.getContext('2d'),scratchContext=scratch.getContext('2d');
    targetContext.fillStyle='rgb(40,80,120)';targetContext.fillRect(0,0,512,512);transDrawQueue.rasterize(entry,scratchContext);const pixels=scratchContext.getImageData(0,0,512,512).data;let selected=-1;
    for(let index=3;index<pixels.length;index+=4)if(selected<0||pixels[index]>pixels[selected+3])selected=index-3;
    if(selected<0||pixels[selected+3]===0)throw Error('Missing blend sample pixels');
    renderOpaqueTransQueue(targetContext,scratchContext,transDrawQueue,{shader:paletteShaderForDraw});const actual=targetContext.getImageData(0,0,512,512).data,opacity=pixels[selected+3]/255;
    for(let channel=0;channel<3;channel++){
     const background=[40,80,120][channel],source=pixels[selected+channel];let expected;
     if(sample.type==='none')expected=background*(1-opacity)+source*opacity;
     else if(sample.alpha[1]===255)expected=Math.min(255,background+source*opacity);
     else expected=Math.min(255,Math.round(background*(1-opacity*(1-128/255)))+source*opacity);
     if(Math.abs(actual[selected+channel]-expected)>1.1)throw Error('Common animation composited pixel mismatch '+sample.action+' channel '+channel);
    }
   }
   for(const profile of ['mugen11','ikemen'])for(const player of [1,2])for(const value of ['999999','S999999','-1']){
    sourceExplods.length=0;combatEngineProfile=profile;const actor=specialRoot(player),context=specialRuntime.context(actor),adapter={owner:actor,player,schedulingApplied:true};
    executeControllerM1({type:'GameMakeAnim',params:{value}},actor,context,adapter);if(sourceExplods.length)throw Error('Invalid GameMakeAnim animation was committed');
    executeControllerM1({type:'GameMakeAnim',params:{value:'120'}},actor,context,adapter);if(sourceExplods.length!==1||sourceExplods[0].invalid)throw Error('Invalid animation stopped following valid controller');
   }
   for(const player of [1,2])for(const times of [[-1],[2,-1],[0,2,0,3]]){
    sourceExplods.length=0;const actor=specialRoot(player),actions=characterProfiles.get(battleCharacters[player-1]).data.actions,original=actions['999890'],base=framesFor(0,player)[0],frames=times.map(time=>({...base,time}));actions['999890']=frames;
    try{
     executeControllerM1({type:'GameMakeAnim',params:{value:'S999890'}},actor,specialRuntime.context(actor),{owner:actor,player,schedulingApplied:true});const effect=sourceExplods[0];
     if(times.includes(-1)){
      effect.age=500;stepSourceExplods();if(sourceExplods[0]!==effect||lifecycleEffectFrame(effect)!==frames.at(-1))throw Error('Indefinite GameMakeAnim expired or lost held frame');
      transDrawQueue.reset();drawSourceExplods();if(!transDrawQueue.ordered().some(entry=>entry.kind==='gamemakeanim'))throw Error('Indefinite GameMakeAnim stopped drawing');
     }else{
      if(lifecycleEffectFrame(effect)!==frames[1])throw Error('Zero-duration GameMakeAnim element was not skipped');
      for(let tick=0;tick<4;tick++)stepSourceExplods();if(!sourceExplods.length)throw Error('Finite GameMakeAnim expired too early');stepSourceExplods();if(sourceExplods.length)throw Error('Finite zero-element GameMakeAnim expired late');
     }
    }finally{if(original===undefined)delete actions['999890'];else actions['999890']=original}
   }
   for(const player of [1,2]){
    sourceExplods.length=0;const character=battleCharacters[player-1],profile=characterProfiles.get(character),foreign='GameMakeAnimForeignFixture',savedForeign=characterProfiles.get(foreign),savedOwner=customStateOwners[player-1],savedAnimation=customAnimationOwners[player-1],savedAction=profile.data.actions['999891'],ownFrame={...profile.data.actions['0'][0],time:2};
    frameProfiles.set(ownFrame,character);profile.data.actions['999891']=[ownFrame];characterProfiles.set(foreign,{...profile,data:{...profile.data,actions:{}}});customStateOwners[player-1]=foreign;customAnimationOwners[player-1]=foreign;
    try{
     const actor=specialRoot(player);executeControllerM1({type:'GameMakeAnim',params:{value:'S999891'}},actor,specialRuntime.context(actor),{owner:actor,player,schedulingApplied:true});const effect=sourceExplods[0];
     if(!effect||effect.invalid||sourceEffectFrames(effect)[0]!==ownFrame)throw Error('GameMakeAnim used foreign state animation owner');
     transDrawQueue.reset();drawSourceExplods();const entry=transDrawQueue.ordered().find(entry=>entry.kind==='gamemakeanim');if(!entry||entry.source.width!==profile.data.sprites[ownFrame.group+','+ownFrame.item].w)throw Error('Own animation did not render inside foreign state');
     stepSourceExplods();if(!sourceExplods.length)throw Error('Own animation expired early under foreign state');stepSourceExplods();if(sourceExplods.length)throw Error('Foreign animation owner corrupted own lifetime');
    }finally{customStateOwners[player-1]=savedOwner;customAnimationOwners[player-1]=savedAnimation;if(savedAction===undefined)delete profile.data.actions['999891'];else profile.data.actions['999891']=savedAction;if(savedForeign===undefined)characterProfiles.delete(foreign);else characterProfiles.set(foreign,savedForeign)}
   }
   const legacyAction=Object.keys(commonFallDat.actions)[0];
   for(const age of [0,1000]){
    sourceExplods.length=0;sourceExplods.push({common:true,anim:Number(legacyAction),player:1,ownerKey:'root1',x:0,y:-30,vx:0,vy:0,facing:1,age,removetime:-1,sprpriority:0,kind:'legacy-common-regression'});
    transDrawQueue.reset();drawSourceExplods();if(!transDrawQueue.ordered().some(entry=>entry.kind==='legacy-common-regression'))throw Error('Legacy common animation without loopStarts failed to draw');
   }
   return rows;
   }finally{sourceExplods.length=0;specialRuntime.reset();combatEngineProfile=saved.profile;rootDrawOffsets.splice(0,2,...saved.offsets);[cameraX,cameraY,cameraZoom]=saved.camera;Object.assign(STAGE_CAMERA,saved.config);Object.assign(stageCameraConfig.player,saved.player);p1HitPause=0;p2.attackPause=0}
  })()`);
  assert.equal(rows.length,16);console.log('Sixteen MakeDust cases, 32 GameMakeAnim cases and all frames/lifetimes of 33 common actions pass; actual none/A/A1 composited pixels, defaults, Z and Helper binding pass');
 }finally{await browser?.close();server.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
