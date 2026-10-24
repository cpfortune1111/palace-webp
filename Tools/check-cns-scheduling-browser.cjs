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
 const watchdog=setTimeout(async()=>{console.error('CNS literal scheduling regression exceeded deadline');try{await browser?.close()}finally{server.close();process.exit(1)}},300000);
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  browser=await chromium.launch({headless:true,channel:'msedge'});
  const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:'+server.address().port+'/');
  await page.waitForFunction(()=>window.contactPhaseTest?.run('!!dat&&!!stateIR&&!!battleDat&&!!lifecycleDat&&!!specialDat&&!!roundCharDat&&!!cmdDat&&!!airDat&&!!fallDat&&!!guardDat&&!!turnDat'),null,{timeout:90000});
  const run=source=>page.evaluate(source=>window.contactPhaseTest.run(source),source);
  await run("prepareCharacters(['SailorSaturn','SailorSaturn'])");
  await run("loadIndexedPaletteAssets(new URL('./Char/Saturn/Battle/Indexed/indexed.json',location.href).href,{createCanvas:(width,height)=>{const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;return canvas}}).then(assets=>characterProfiles.get('SailorSaturn').indexedPalette=assets)");

  const results=await run(`(()=>{
   const rows=[],saved=combatEngineProfile;
   try{for(const profile of ['mugen11','ikemen'])for(const player of [1,2]){
    combatEngineProfile=profile;
    specialRuntime.reset();
    const caller=specialRoot(player),context=specialRuntime.context(caller),binding=caller;
    const paused=[p1HitPause,p2.hitShake,p2.attackPause];
    try{
     p1HitPause=1;p2.hitShake=1;p2.attackPause=1;
     for(const global of [false,true]){
      const observed=[];
      for(const literal of ['1 + 0','0.5','-2']){
       caller.vars[20]=0;
       executeControllerM1({type:'VarAdd',controllerStateNo:global?-2:0,params:{v:'20',value:'1',ignorehitpause:literal}},binding,context,{owner:caller,player,schedulingApplied:false});
       observed.push(caller.vars[20]);
      }
      rows.push({player,kind:global?'root-global':'root-current',observed});
     }
    }finally{[p1HitPause,p2.hitShake,p2.attackPause]=paused;}
    const data=characterProfiles.get(battleCharacters[player-1]).battle,oldGlobals=data.globalControllers,oldCommands=data.playerCommands;
    try{
     const controllers=(offset)=>['1 + 0','0.5','-2'].map((ignorehitpause,index)=>({type:'VarAdd',params:{v:String(offset+index),value:'1',ignorehitpause},triggers:{1:['1']},triggerall:[]}));
     data.helperStates[991680]={type:'S',physics:'N',moveType:'I',anim:0,controllers:controllers(20)};
     data.globalControllers={'-2':controllers(30)};data.playerCommands=[];
     for(const index of [30,31,32])caller.vars[index]=0;
     lifecycleRuntime.globalState(caller,context,-2,{hitPause:true});
     rows.push({player,kind:'root-lifecycle',observed:[30,31,32].map(index=>caller.vars[index])});
     specialRuntime.dispatch({type:'Helper',params:{stateno:991680,id:991680,keyctrl:'2'}},caller,context,{},caller,player);
     const child=specialRuntime.entities.at(-1);child.hitPause=2;
     specialRuntime.step();
     rows.push({player,kind:'helper-current/global',observed:[20,21,22,30,31,32].map(index=>child.vars[index])});
    }finally{data.globalControllers=oldGlobals;data.playerCommands=oldCommands;specialRuntime.reset();}
   }}finally{combatEngineProfile=saved;}
   return rows;
  })()`);
  for(const row of results)assert.deepEqual(row.observed,row.kind==='helper-current/global'?[1,0,1,1,0,1]:[1,0,1],JSON.stringify(row));
  const gravityResults=await run(`(()=>{
   const saved={profile:combatEngineProfile,velocity:[vy,p2.vy],reaction:p1Reaction,paused:[p1HitPause,p2.hitShake,p2.attackPause]},rows=[];
   try{
    p1Reaction=null;
    for(const profile of ['mugen11','ikemen'])for(const player of [1,2]){
     combatEngineProfile=profile;specialRuntime.reset();p1HitPause=1;p2.hitShake=1;p2.attackPause=1;
     const caller=specialRoot(player),context=specialRuntime.context(caller),binding=player===1?p1LifecycleBinding:p2,data=characterProfiles.get(battleCharacters[player-1]).battle;
     const old={globals:data.globalControllers,commands:data.playerCommands,acceleration:data.originalMotionConstants['movement.yaccel'],definition:data.helperStates[991921]};
     const increment=Math.fround(.25*Math.fround(Number(data.coordinateSystem.webWorldWidth??1280)/Number(data.coordinateSystem.localcoord[0])));
     try{
      data.originalMotionConstants['movement.yaccel']=.25;
      for(const global of [false,true]){
       const observed=[];
       for(const literal of ['1 + 0','0.5','-2']){
        if(player===1)vy=0;else p2.vy=0;
        executeControllerM1({type:'Gravity',controllerStateNo:global?-2:0,params:{ignorehitpause:literal}},binding,context,{owner:caller,player,schedulingApplied:false});
        observed.push(player===1?vy:p2.vy);
       }
       rows.push({profile,player,kind:global?'gravity-root-global':'gravity-root-current',observed,expected:[increment,0,increment]});
      }
      const controllers=()=>['1 + 0','0.5','-2'].map(ignorehitpause=>({type:'Gravity',params:{ignorehitpause},triggers:{1:['1']},triggerall:[]}));
      data.globalControllers={'-2':controllers()};data.playerCommands=[];data.helperStates[991921]={type:'S',physics:'N',moveType:'I',anim:0,controllers:controllers()};
      if(player===1)vy=0;else p2.vy=0;
      lifecycleRuntime.globalState(caller,context,-2,{hitPause:true});
      rows.push({profile,player,kind:'gravity-root-lifecycle',observed:[player===1?vy:p2.vy],expected:[Math.fround(increment*2)]});
      specialRuntime.dispatch({type:'Helper',params:{stateno:991921,id:991921,keyctrl:'2'}},caller,context,{},caller,player);
      const helper=specialRuntime.entities.at(-1);helper.vy=0;helper.hitPause=2;specialRuntime.step();
      rows.push({profile,player,kind:'gravity-helper-current/global',observed:[helper.vy],expected:[Math.fround(increment*4)]});
     }finally{data.globalControllers=old.globals;data.playerCommands=old.commands;data.originalMotionConstants['movement.yaccel']=old.acceleration;if(old.definition===undefined)delete data.helperStates[991921];else data.helperStates[991921]=old.definition;specialRuntime.reset()}
    }
    return rows;
   }finally{combatEngineProfile=saved.profile;[vy,p2.vy]=saved.velocity;p1Reaction=saved.reaction;[p1HitPause,p2.hitShake,p2.attackPause]=saved.paused}
  })()`);
  assert.equal(gravityResults.length,16);
  for(const row of gravityResults)assert.deepEqual(row.observed,row.expected,JSON.stringify(row));
  console.log('Actual Gravity root-current/global/lifecycle and normal-spawn Helper current/global hitpause scheduling preserve native literal gates in both profiles and player directions');
  const resetResults=await run(`(()=>{
   const saved={profile:combatEngineProfile,reaction:p1Reaction,p1:[moveContact,moveHit,moveGuarded,p1HitPause],p2:[p2.moveContact,p2.moveHit,p2.moveGuarded,p2.hitShake,p2.attackPause],clocks:[...reversedMoveClocks].map(([key,value])=>({key,value,data:{...value}})),flags:[...moveCounteredFlags]},rows=[];
   const seed=actor=>{Object.assign(actor,{moveContact:9,moveHit:4,moveGuarded:2});if(actor.kind!=='helper'){if(fighterPlayer(actor)===1){moveContact=9;moveHit=4;moveGuarded=2}else Object.assign(p2,{moveContact:9,moveHit:4,moveGuarded:2})}const key=hitDefinitionOwnerKey(actor);reversedMoveClocks.set(key,{type:'hit',time:7,countered:true});moveCounteredFlags.set(key,true)};
   const cleared=actor=>reversedMoveClocks.get(hitDefinitionOwnerKey(actor))?.time===0&&!moveCounteredFlags.get(hitDefinitionOwnerKey(actor));
   try{
    p1Reaction=null;
    for(const profile of ['mugen11','ikemen'])for(const player of [1,2]){
     combatEngineProfile=profile;specialRuntime.reset();p1HitPause=1;p2.hitShake=1;p2.attackPause=1;
     const caller=specialRoot(player),context=specialRuntime.context(caller),binding=player===1?p1LifecycleBinding:p2,data=characterProfiles.get(battleCharacters[player-1]).battle,old={globals:data.globalControllers,commands:data.playerCommands,definition:data.helperStates[991922]};
     const controller=params=>({type:'MoveHitReset',params,triggers:{1:['1']},triggerall:[]});
     try{
      data.playerCommands=[];
      for(const kind of ['root-current','root-global','root-lifecycle','helper-current','helper-global']){
       const observed=[];
       for(const literal of ['1 + 0','0.5','-2']){
        const source=controller({ignorehitpause:literal});
        data.globalControllers=kind==='root-lifecycle'||kind==='helper-global'?{'-2':[source]}:{};
        if(kind.startsWith('helper')){
         specialRuntime.reset();data.helperStates[991922]={type:'S',physics:'N',moveType:'I',anim:0,controllers:kind==='helper-current'?[source]:[]};
         specialRuntime.dispatch({type:'Helper',params:{stateno:991922,id:991922,keyctrl:'2'}},caller,context,{},caller,player);
         const helper=specialRuntime.entities.at(-1);helper.hitPause=2;seed(helper);specialRuntime.step();observed.push(cleared(helper));
        }else{
         seed(caller);
         if(kind==='root-lifecycle')lifecycleRuntime.globalState(caller,context,-2,{hitPause:true});
         else executeControllerM1({...source,controllerStateNo:kind==='root-global'?-2:0},binding,context,{owner:caller,player,schedulingApplied:false});
         observed.push(cleared(caller));
        }
       }
       rows.push({profile,player,kind,observed,expected:[true,false,true]});
      }
      for(const global of [false,true]){
       const source=controller({persistent:'0',ignorehitpause:'1'}),observed=[];
       for(let attempt=0;attempt<3;attempt++){seed(caller);executeControllerM1({...source,controllerSchedulingKey:source,controllerStateNo:global?-2:0},binding,context,{owner:caller,player,schedulingApplied:false});observed.push(cleared(caller))}
       rows.push({profile,player,kind:global?'root-global-persistence':'root-current-persistence',observed,expected:global?[true,true,true]:[true,false,false]});
      }
      for(const global of [false,true]){
       specialRuntime.reset();const source=controller({persistent:'0'}),observed=[];data.globalControllers=global?{'-2':[source]}:{};data.helperStates[991922]={type:'S',physics:'N',moveType:'I',anim:0,controllers:global?[]:[source]};
       specialRuntime.dispatch({type:'Helper',params:{stateno:991922,id:991922,keyctrl:'2'}},caller,context,{},caller,player);const helper=specialRuntime.entities.at(-1);helper.created=combatTraceTick-1;helper.hitPause=0;
       for(let attempt=0;attempt<3;attempt++){seed(helper);specialRuntime.step();observed.push(cleared(helper))}
       rows.push({profile,player,kind:global?'helper-global-persistence':'helper-current-persistence',observed,expected:global?[true,true,true]:[true,false,false]});
      }
      specialRuntime.reset();data.globalControllers={};data.helperStates[991922]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[controller({})]};specialRuntime.dispatch({type:'Helper',params:{stateno:991922,id:991922,keyctrl:'2'}},caller,context,{},caller,player);
      const helper=specialRuntime.entities.at(-1);helper.created=combatTraceTick-1;helper.hitPause=0;specialRuntime.pauses.normal[0]={remaining:10,movetime:0,player:1,created:combatTraceTick-1};specialRuntime.moveTimes.set(helper.key,{normal:0});seed(helper);specialRuntime.step();const blocked=cleared(helper);specialRuntime.moveTimes.set(helper.key,{normal:1});seed(helper);specialRuntime.step();
      rows.push({profile,player,kind:'helper-global-pause-allowance',observed:[blocked,cleared(helper)],expected:[false,true]});
     }finally{data.globalControllers=old.globals;data.playerCommands=old.commands;if(old.definition===undefined)delete data.helperStates[991922];else data.helperStates[991922]=old.definition;specialRuntime.reset()}
    }
    return rows;
   }finally{
    combatEngineProfile=saved.profile;p1Reaction=saved.reaction;[moveContact,moveHit,moveGuarded,p1HitPause]=saved.p1;[p2.moveContact,p2.moveHit,p2.moveGuarded,p2.hitShake,p2.attackPause]=saved.p2;reversedMoveClocks.clear();for(const entry of saved.clocks){Object.assign(entry.value,entry.data);reversedMoveClocks.set(entry.key,entry.value)}moveCounteredFlags.clear();for(const [key,value]of saved.flags)moveCounteredFlags.set(key,value);
   }
  })()`);
  assert.equal(resetResults.length,40);
  for(const row of resetResults)assert.deepEqual(row.observed,row.expected,JSON.stringify(row));
  console.log('Actual MoveHitReset omitted-recipient root/Helper current/global/lifecycle hitpause, persistence and global-pause allowance cases pass in both profiles and player directions');
  const panResults=await run(`(()=>{
   const saved={registry:characterSoundChannels,profile:combatEngineProfile,reaction:p1Reaction,paused:[p1HitPause,p2.hitShake,p2.attackPause],commands:[playerCommandLists[1],playerCommandLists[2]],helperCommands:[...helperCommandLists],timer:fightHud.roundTime(),effects:[...sourceExplods],dustStates:rootDustStates.map(state=>({...state})),environmentColor:{...environmentColor,color:[...environmentColor.color]}},rows=[];
   const commandNameFor=actor=>assertedCommandList(actor).commands.find(command=>command.steps.length===1&&command.steps[0].length===1&&/^[abxy]$/.test(command.steps[0][0].key)&&!command.steps[0][0].hold&&!command.steps[0][0].release).definition.name;
   const resetCommandRecord=record=>{for(const command of record.commandList.commands)if(command.definition.name===record.name)command.buffer=0};
   const resetScheduleRecord=record=>{if(record.modifiedEffect)record.modifiedEffect.scale=[1,1];else if(record.dustState){record.dustState.elapsed=3;sourceExplods.length=0}else if(record.environmentColor)environmentColor.remaining=0;else if(record.paletteRuntime)record.paletteRuntime.paletteRemap=createPaletteRemapState();else if(record.roundTime)fightHud.setRoundTime(60);else if(record.commandList)resetCommandRecord(record);else characterSoundOutput.setPan(record,{pan:0,sourceId:-1})};
   const recordFor=(actor,type)=>{if(type==='ModifyExplod'){for(let index=sourceExplods.length-1;index>=0;index--)if(sourceExplods[index].id===991997)sourceExplods.splice(index,1);spawnSourceExplod({anim:'F120',id:'991997',scale:'1,1'},actor,fighterPlayer(actor),specialRuntime.context(actor));return {modifiedEffect:sourceExplods.at(-1)}}if(type==='MakeDust'||type==='GameMakeAnim'){const record={dustState:makeDustStateFor(actor),dustKind:type==='GameMakeAnim'?'gamemakeanim':'dust',dustOwner:actor.kind==='helper'?actor.key:'root'+fighterPlayer(actor)};resetScheduleRecord(record);return record}if(type==='EnvColor'){const record={environmentColor:true};resetScheduleRecord(record);return record}if(type==='RemapPal'){const assets=characterProfiles.get(battleCharacters[fighterPlayer(actor)-1]).indexedPalette,target=assets.metadata.palettes[1],record={paletteRuntime:actorPaletteRuntime(actor),destination:assets.catalog.names.get(target.group+','+target.number)};resetScheduleRecord(record);return record}if(['RoundTimeSet','RoundTimeAdd'].includes(type)){fightHud.setMode('99');fightHud.setRoundTime(60);return {roundTime:true}}if(type==='AssertCommand'){const record={commandList:assertedCommandList(actor),name:commandNameFor(actor)};resetCommandRecord(record);return record}let record;record=characterSoundChannels.add(characterSoundIdentity(actor),7,new Audio(),()=>characterSoundOutput.release(record));characterSoundOutput.setPan(record,{pan:0,sourceId:-1});return record};
   const applied=record=>record.modifiedEffect?sourceExplods.includes(record.modifiedEffect)&&record.modifiedEffect.scale.join(',')==='2,3':record.dustState?sourceExplods.some(effect=>effect.dust&&effect.kind===record.dustKind&&effect.anim===120&&effect.ownerKey===record.dustOwner):record.environmentColor?environmentColor.remaining===3&&environmentColor.under&&environmentColor.color.join(',')==='17,258,-1':record.paletteRuntime?record.paletteRuntime.paletteRemap?.remap?.[0]===record.destination:record.roundTime?fightHud.roundTime().current===120:record.commandList?record.commandList.commands.some(command=>command.definition.name===record.name&&command.buffer===3):Math.abs(characterSoundOutput.snapshot(record).lastPan-.3)<1e-6;
   try{
    characterSoundChannels=createCharacterSoundChannels();p1Reaction=null;
    for(const controllerType of ['SndPan','ModifySnd','AssertCommand','RoundTimeSet','RoundTimeAdd','RemapPal','EnvColor','MakeDust','GameMakeAnim','ModifyExplod'])for(const profile of ['mugen11','ikemen'])for(const player of [1,2]){
     combatEngineProfile=profile;specialRuntime.reset();p1HitPause=1;p2.hitShake=1;p2.attackPause=1;
     const actor=specialRoot(player),context=specialRuntime.context(actor),binding=player===1?p1LifecycleBinding:p2,data=characterProfiles.get(battleCharacters[player-1]).battle,old={globals:data.globalControllers,commands:data.playerCommands,definition:data.helperStates[991970]};
     const destination=characterProfiles.get(battleCharacters[player-1]).indexedPalette.metadata.palettes[1];
     const controller=params=>({type:controllerType,params:{...(controllerType==='ModifyExplod'?{id:'991997',scale:'2,3'}:controllerType==='GameMakeAnim'?{value:'120',pos:'0,0,0'}:controllerType==='MakeDust'?{spacing:'3',pos:'0,0,0'}:controllerType==='EnvColor'?{value:'17,258,-1',time:'3',under:'1'}:controllerType==='RemapPal'?{dest:destination.group+','+destination.number}:controllerType==='AssertCommand'?{name:JSON.stringify(commandNameFor(actor)),'buffer.time':'3'}:['RoundTimeSet','RoundTimeAdd'].includes(controllerType)?{value:controllerType==='RoundTimeSet'?'120':'60'}:{channel:'7',abspan:'160'}),...params},triggers:{1:['1']},triggerall:[]});
     try{
      data.playerCommands=[];
      for(const kind of ['root-current','root-global','root-lifecycle','helper-current','helper-global']){
       const observed=[];
       for(const literal of ['1 + 0','0.5','-2']){
        characterSoundChannels.stopAll();const source=controller({ignorehitpause:literal});data.globalControllers=kind==='root-lifecycle'||kind==='helper-global'?{'-2':[source]}:{};
        if(kind.startsWith('helper')){
         specialRuntime.reset();data.helperStates[991970]={type:'S',physics:'N',moveType:'I',anim:0,controllers:kind==='helper-current'?[source]:[]};specialRuntime.dispatch({type:'Helper',params:{stateno:991970,id:991970,keyctrl:'2'}},actor,context,{},actor,player);const helper=specialRuntime.entities.at(-1);helper.hitPause=2;const record=recordFor(helper,controllerType);specialRuntime.step();observed.push(applied(record));
        }else{
         const record=recordFor(actor,controllerType);if(kind==='root-lifecycle')lifecycleRuntime.globalState(actor,context,-2,{hitPause:true});else executeControllerM1({...source,controllerStateNo:kind==='root-global'?-2:0},binding,context,{owner:actor,player,schedulingApplied:false});observed.push(applied(record));
        }
       }
       rows.push({controllerType,profile,player,kind,observed,expected:[true,false,true]});
      }
      for(const global of [false,true]){
       characterSoundChannels.stopAll();const source=controller({persistent:'0',ignorehitpause:'1'}),record=recordFor(actor,controllerType),observed=[];
       for(let attempt=0;attempt<3;attempt++){resetScheduleRecord(record);executeControllerM1({...source,controllerSchedulingKey:source,controllerStateNo:global?-2:0},binding,context,{owner:actor,player,schedulingApplied:false});observed.push(applied(record))}
       rows.push({controllerType,profile,player,kind:global?'root-global-persistence':'root-current-persistence',observed,expected:global?[true,true,true]:[true,false,false]});
      }
      for(const global of [false,true]){
       characterSoundChannels.stopAll();specialRuntime.reset();const source=controller({persistent:'0'}),observed=[];data.globalControllers=global?{'-2':[source]}:{};data.helperStates[991970]={type:'S',physics:'N',moveType:'I',anim:0,controllers:global?[]:[source]};
       specialRuntime.dispatch({type:'Helper',params:{stateno:991970,id:991970,keyctrl:'2'}},actor,context,{},actor,player);const helper=specialRuntime.entities.at(-1);helper.created=combatTraceTick-1;helper.hitPause=0;const record=recordFor(helper,controllerType);
       for(let attempt=0;attempt<3;attempt++){resetScheduleRecord(record);specialRuntime.step();observed.push(applied(record))}
       rows.push({controllerType,profile,player,kind:global?'helper-global-persistence':'helper-current-persistence',observed,expected:global?[true,true,true]:[true,false,false]});
      }
      characterSoundChannels.stopAll();specialRuntime.reset();data.globalControllers={};data.helperStates[991970]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[controller({})]};specialRuntime.dispatch({type:'Helper',params:{stateno:991970,id:991970,keyctrl:'2'}},actor,context,{},actor,player);
      const helper=specialRuntime.entities.at(-1);helper.created=combatTraceTick-1;helper.hitPause=0;const record=recordFor(helper,controllerType);specialRuntime.pauses.normal[0]={remaining:10,movetime:0,player:1,created:combatTraceTick-1};specialRuntime.moveTimes.set(helper.key,{normal:0});specialRuntime.step();const blocked=applied(record);specialRuntime.moveTimes.set(helper.key,{normal:1});resetScheduleRecord(record);specialRuntime.step();
      rows.push({controllerType,profile,player,kind:'helper-global-pause-allowance',observed:[blocked,applied(record)],expected:[false,true]});
     }finally{characterSoundChannels.stopAll();data.globalControllers=old.globals;data.playerCommands=old.commands;if(old.definition===undefined)delete data.helperStates[991970];else data.helperStates[991970]=old.definition;specialRuntime.reset()}
    }
    return rows;
   }finally{characterSoundChannels.stopAll();characterSoundChannels=saved.registry;Object.assign(environmentColor,saved.environmentColor);sourceExplods.splice(0,sourceExplods.length,...saved.effects);rootDustStates.forEach((state,index)=>Object.assign(state,saved.dustStates[index]));fightHud.setMode(saved.timer.maximum<0?'infinite':String(saved.timer.maximum/60));fightHud.setRoundTime(saved.timer.current);for(let index=0;index<2;index++){if(saved.commands[index]===undefined)delete playerCommandLists[index+1];else playerCommandLists[index+1]=saved.commands[index]}helperCommandLists.clear();for(const entry of saved.helperCommands)helperCommandLists.set(...entry);combatEngineProfile=saved.profile;p1Reaction=saved.reaction;[p1HitPause,p2.hitShake,p2.attackPause]=saved.paused}
  })()`);
  assert.equal(panResults.length,400);
  for(const type of ['SndPan','ModifySnd','AssertCommand','RoundTimeSet','RoundTimeAdd','RemapPal','EnvColor','MakeDust','GameMakeAnim','ModifyExplod'])assert.equal(panResults.filter(row=>row.controllerType===type).length,40);
  for(const row of panResults)assert.deepEqual(row.observed,row.expected,JSON.stringify(row));
  console.log('Actual SndPan/ModifySnd/AssertCommand/RoundTimeSet/RoundTimeAdd/RemapPal/EnvColor/MakeDust/GameMakeAnim/ModifyExplod root-current/global/lifecycle and normal-Helper current/global hitpause, persistence and global-pause allowance consumers pass in both profiles/player directions');
  assert.deepEqual(errors,[]);
  console.log('Actual P1/P2 root-current/root-global and Helper current/global hitpause gates use CNS Atoi literal prefixes and nonzero flags');
 }finally{await browser?.close();server.close();clearTimeout(watchdog)}
})().catch(error=>{console.error(error);process.exitCode=1});

