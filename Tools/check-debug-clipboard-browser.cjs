const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const {chromium}=require('C:/Users/jeffy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..'),vendor=path.resolve(root,'../outputs/three-r180');
const python=process.env.PALACE_PYTHON||'C:/Users/jeffy/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe';
const parseReflectionFixture=definition=>JSON.parse(execFileSync(python,['-c','import sys,json;sys.path.insert(0,sys.argv[1]);from stage_reflection import parse_stage_reflection;print(json.dumps(parse_stage_reflection(sys.argv[2])))',__dirname,definition],{encoding:'utf8',timeout:30000}));
const importedReflection=parseReflectionFixture('[Reflection]\nintensity=50\nxscale=1\nyscale=1\nangle=7\nxangle=2\nyangle=3');
const importedColorReflection=parseReflectionFixture('[Reflection]\nintensity=128\ncolor=255,0,0');
const importedWindowReflection=parseReflectionFixture('[Reflection]\nintensity=50\nwindow=-20,-40,20,0');
const server=http.createServer((request,response)=>{
 const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname),base=pathname.startsWith('/vendor/')?vendor:root,file=path.resolve(base,pathname.startsWith('/vendor/')?pathname.slice(8):'.'+(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(base+path.sep)||!fs.existsSync(file)){response.writeHead(404);response.end();return}
 let content=fs.readFileSync(file);
 if(file===path.join(root,'index.html'))content=Buffer.from(content.toString().replaceAll('https://cdn.jsdelivr.net/npm/three@0.180.0/','/vendor/').replaceAll('requestAnimationFrame(loop);','').replace('</script></body>',`window.contactPhaseTest={run:source=>eval(source)};</script></body>`));
 response.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');response.end(content);
});
(async()=>{
 let browser;
 const watchdog=setTimeout(async()=>{console.error('Debug clipboard controller regression exceeded deadline');try{await browser?.close()}finally{server.close();process.exit(1)}},300000);
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  browser=await chromium.launch({headless:true,channel:'msedge'});
  const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:'+server.address().port+'/');
  await page.waitForFunction(()=>window.contactPhaseTest?.run('!!dat&&!!stateIR&&!!battleDat&&!!lifecycleDat&&!!specialDat&&!!roundCharDat&&!!cmdDat&&!!airDat&&!!fallDat&&!!guardDat&&!!turnDat'),null,{timeout:90000});
  const run=source=>page.evaluate(source=>window.contactPhaseTest.run(source),source);
  await run("prepareCharacters(['SailorSaturn','SailorSaturn'])");
  await run("prepareCharacters(['SailorSaturn','SailorMoon'])");
  await run("import('./Engine/map-value-types.js').then(module=>window.mapValueTest=module)");
  const results=await run(`(()=>{
   const rows=[],saved=combatEngineProfile;
   try{for(const profile of ['mugen11','ikemen'])for(const player of [1,2])for(const kind of ['root','helper']){
    combatEngineProfile=profile;specialRuntime.reset();debugClipboard.clear();
    const data=characterProfiles.get(battleCharacters[player-1]).battle;
    data.helperStates[991671]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[]};
    let caller=specialRoot(player);
    const inheritedMapResult=[];
    if(kind==='helper'){
     const owner=caller,module=window.mapValueTest,name='__inherit.float',had=owner.mapDefaults.has(name),saved=module.readStoredMapValue(owner.mapDefaults,name);
     try{
      module.writeStoredMapValue(owner.mapDefaults,name,{type:'float',value:3});
      specialRuntime.dispatch({type:'Helper',params:{stateno:991671,id:991671}},caller,specialRuntime.context(caller),{},caller,player);
      caller=specialRuntime.entities.at(-1);
      inheritedMapResult.push(module.readStoredMapValue(caller.maps,name).type,evalM1('Map("__inherit.float")/2',specialRuntime.context(caller)));
      executeControllerM1({type:'MapSet',params:{map:'"__inherit.float"',value:'99'}},caller,specialRuntime.context(caller),{owner:caller,player,schedulingApplied:true});
      executeControllerM1({type:'MapReset',params:{}},caller,specialRuntime.context(caller),{owner:caller,player,schedulingApplied:true});
      inheritedMapResult.push(evalM1('Map("__inherit.float")/2',specialRuntime.context(caller)),module.readStoredMapValue(owner.mapDefaults,name).value);
      if(JSON.stringify(inheritedMapResult)!==JSON.stringify(['float',1.5,1.5,3]))throw Error('Actual Helper lost inherited Map float type: '+JSON.stringify(inheritedMapResult));
     }finally{
      if(had)module.writeStoredMapValue(owner.mapDefaults,name,saved);else{owner.mapDefaults.delete(name);module.forgetStoredMapValue(owner.mapDefaults,name);}
     }
    }
    const context=specialRuntime.context(caller),adapter={owner:caller,player,schedulingApplied:true};
    const modifyKey=hitDefinitionOwnerKey(caller),modifyFlags=[moveCounteredFlags,actorKoFlags,actorOverKoFlags],modifySaved=modifyFlags.map(storage=>[storage.has(modifyKey),storage.get(modifyKey)]),modifyAI=modifiedAILevels[player-1],modifyControl={helper:caller.ctrl,p1:runtimeCtrl,p2:p2.ctrl,reaction:p1Reaction?.ctrl},modifyVar=caller.vars[8],modifyBases=modifiedCombatBase.map(base=>({...base})),modifySides=[...modifiedTeamSides],modifyHelper={id:caller.id,side:caller.teamSide};
    try{
     caller.vars[8]=3;
     executeControllerM1({type:'ModifyPlayer',params:{ailevel:'3.75'}},caller,context,adapter);
     const aiRootContext=specialRuntime.context(specialRoot(player)),aiValues=['AILevel','AILevelF','AILevel/2','AILevelF/2'].map(name=>evalM1(name,aiRootContext));
     if(JSON.stringify(aiValues)!==JSON.stringify([3,3.75,1,1.875]))throw Error('ModifyPlayer AI query/result tag mismatch: '+JSON.stringify(aiValues));
     const otherAI=modifiedAILevels[2-player];
     try{
      modifiedAILevels[2-player]=7.25;
      const scoped=withCharacter(player,()=>['AILevel','AILevelF','AILevel/2','AILevelF/2'].map(name=>evalM1(name)));
      if(JSON.stringify(scoped)!==JSON.stringify([3,3.75,1,1.875]))throw Error('Legacy no-context AI query escaped selected player scope: '+JSON.stringify(scoped));
     }finally{modifiedAILevels[2-player]=otherAI;}
     const aiFlags=aiRootContext.assertions,aiMaskHad=aiFlags.has('noailevel');
     try{
      aiFlags.add('noailevel');
      const masked=evalNumericAST(parseExprAST('AILevelF'),aiRootContext),negated=evalNumericAST(parseExprAST('-AILevelF'),aiRootContext);
      if(masked.type!=='int'||masked.value!==0||negated.type!=='int'||Object.is(negated.value,-0)||evalM1('AILevel',aiRootContext)!==0)throw Error('noAILevel did not return native integer-zero AI query tag');
     }finally{if(!aiMaskHad)aiFlags.delete('noailevel');}
     if(kind==='helper'&&collisionActorData(caller).engineVersions?.mugen?.[0]===1&&(evalM1('AILevel',context)!==0||evalM1('AILevelF',context)!==0))throw Error('MUGEN-1 Helper AI query must remain zero');
     for(const operand of ['"1"','Var(8)/0']){
      executeControllerM1({type:'ModifyPlayer',params:{attack:operand,defence:operand,teamside:operand,'helpervar.id':operand}},caller,context,adapter);
      if(modifiedCombatBase[player-1].attack!==0||modifiedCombatBase[player-1].defence!==0||(kind==='helper'?caller.teamSide:modifiedTeamSides[player-1])!==0||kind==='helper'&&caller.id!==0)throw Error('Actual ModifyPlayer integer fields accepted string/undefined');
      executeControllerM1({type:'ModifyPlayer',params:{movecountered:'1',alive:'1',ailevel:'3.75'}},caller,context,adapter);
      actorOverKoFlags.set(modifyKey,true);
      executeControllerM1({type:'ModifyPlayer',params:{movecountered:operand,alive:operand,ailevel:operand}},caller,context,adapter);
      const control=kind==='helper'?caller.ctrl:player===1?runtimeCtrl:p2.ctrl;
      if(moveCounteredFlags.get(modifyKey)!==false||actorKoFlags.get(modifyKey)!==true||modifiedAILevels[player-1]!==0||control!==0)throw Error('Actual ModifyPlayer extraction accepted string/undefined flags or AI level');
      executeControllerM1({type:'ModifyPlayer',params:{alive:'1'}},caller,context,adapter);
      if(actorKoFlags.get(modifyKey)!==false||actorOverKoFlags.has(modifyKey))throw Error('ModifyPlayer alive did not clear KO/over-KO flags');
     }
     executeControllerM1({type:'ModifyPlayer',params:{redirectid:JSON.stringify(String(3-player)),attack:'Var(8):=99'}},caller,context,adapter);
     if(caller.vars[8]!==3||JSON.stringify(modifiedCombatBase[2-player])!==JSON.stringify(modifyBases[2-player]))throw Error('ModifyPlayer string redirect selected a numeric actor ID or executed RHS');
    }finally{
     modifyFlags.forEach((storage,index)=>{const [had,value]=modifySaved[index];if(had)storage.set(modifyKey,value);else storage.delete(modifyKey);});
     modifiedAILevels[player-1]=modifyAI;caller.vars[8]=modifyVar;caller.ctrl=modifyControl.helper;runtimeCtrl=modifyControl.p1;p2.ctrl=modifyControl.p2;if(p1Reaction)p1Reaction.ctrl=modifyControl.reaction;
     modifiedCombatBase.splice(0,modifiedCombatBase.length,...modifyBases);modifiedTeamSides.splice(0,modifiedTeamSides.length,...modifySides);caller.id=modifyHelper.id;caller.teamSide=modifyHelper.side;
    }
    const teamMapModule=window.mapValueTest,teamKey='__team.route',teamSnapshots=rootMaps.map(storage=>[storage.has(teamKey),teamMapModule.readStoredMapValue(storage,teamKey)]),oldTeamSides=[...modifiedTeamSides],oldHelperSide=caller.teamSide,oldTeamVar=caller.vars[9];
    try{
     for(const storage of rootMaps){storage.delete(teamKey);teamMapModule.forgetStoredMapValue(storage,teamKey);}
     caller.vars[9]=77;
     if(kind==='helper')caller.teamSide=3-player;else modifiedTeamSides[player-1]=3-player;
     executeControllerM1({type:'TeamMapSet',params:{map:'"__team.route"',value:'Var(9)'}},caller,context,adapter);
     executeControllerM1({type:'TeamMapAdd',params:{map:'"__team.route"',value:'1'}},caller,context,adapter);
     if(rootMaps[player-1].has(teamKey)||rootMaps[2-player].get(teamKey)!==78)throw Error('TeamMap ignored modified team side');
     if(kind==='helper')caller.teamSide=0;else modifiedTeamSides[player-1]=0;
     executeControllerM1({type:'TeamMapSet',params:{map:'"__team.route"',value:'999'}},caller,context,adapter);
     if(rootMaps[player-1].has(teamKey)||rootMaps[2-player].get(teamKey)!==78)throw Error('Neutral TeamMap changed regular player slots');
    }finally{
     modifiedTeamSides.splice(0,modifiedTeamSides.length,...oldTeamSides);caller.teamSide=oldHelperSide;caller.vars[9]=oldTeamVar;
     rootMaps.forEach((storage,index)=>{const [had,sample]=teamSnapshots[index];if(had)teamMapModule.writeStoredMapValue(storage,teamKey,sample);else{storage.delete(teamKey);teamMapModule.forgetStoredMapValue(storage,teamKey);}});
    }
    const syntaxModule=window.mapValueTest,syntaxNames=['__syntax.embedded','var(8)','8',' padded '],syntaxSaved=syntaxNames.map(name=>[name,caller.maps.has(name),syntaxModule.readStoredMapValue(caller.maps,name)]),syntaxVariable=caller.vars[8];
    try{
     caller.vars[8]=4;
     executeControllerM1({type:'MapSet',params:{map:'Map(__syntax.embedded) := Var(8):=Var(8)+1',value:'999'}},caller,context,adapter);
     const embeddedResult=[caller.maps.get('__syntax.embedded'),caller.vars[8],evalM1('Map("__syntax.embedded")/2',context)];
     executeControllerM1({type:'MapSet',params:{'map(Var(8))':'7'}},caller,context,adapter);
     executeControllerM1({type:'MapSet',params:{map:'Var(8):=9',value:'999'}},caller,context,adapter);
     executeControllerM1({type:'MapSet',params:{map:'map = " padded "',value:'11'}},caller,context,adapter);
     const actual=[...embeddedResult,caller.maps.get('var(8)'),caller.maps.get('8'),caller.maps.get(' padded '),caller.vars[8]];
     if(JSON.stringify(actual)!==JSON.stringify([5,5,2,7,9,11,5]))throw Error('Actual Map syntax/caller side-effect mismatch: '+JSON.stringify(actual));
     let rejected=false;
     try{executeControllerM1({type:'MapSet',params:{map:'""',value:'Var(8):=99'}},caller,context,adapter);}catch(error){rejected=error.message.includes('empty');}
     if(!rejected||caller.vars[8]!==5)throw Error('Invalid Map name evaluated its RHS');
    }finally{
     caller.vars[8]=syntaxVariable;
     for(const [name,had,sample] of syntaxSaved){if(had)syntaxModule.writeStoredMapValue(caller.maps,name,sample);else{caller.maps.delete(name);syntaxModule.forgetStoredMapValue(caller.maps,name);}}
    }
    const angleResults=[];
    if(kind==='root'){
     const layerBinding=findMovementActor(player),layerSaved=[...rootSpriteLayers],layerPriority=layerBinding.sprPriority;
     try{
      layerBinding.layerNo=1;
      if(actorSpriteLayer(specialRoot(player))!==1||rootSpriteLayers[player-1]!==1)throw Error('Root layer live binding did not reach actor storage');
      let ownerReads=0;
      applyStateDefPriorityM1({sprpriority:'4'},()=>{ownerReads++;return specialRoot(player)},value=>{layerBinding.sprPriority=value});
      if(rootSpriteLayers[player-1]!==0||layerBinding.layerNo!==0||layerBinding.sprPriority!==4||ownerReads!==1)throw Error('Root StateDef priority did not reset layer once after priority');
      layerBinding.layerNo=-1;
      applyStateDefPriorityM1({},()=>{throw Error('Missing StateDef priority sampled owner')},()=>{throw Error('Missing priority wrote value')});
      if(layerBinding.layerNo!==-1)throw Error('Absent normalized StateDef priority reset root layer');
     }finally{rootSpriteLayers.splice(0,rootSpriteLayers.length,...layerSaved);layerBinding.sprPriority=layerPriority;}
    }
    const propertyBinding=kind==='helper'?caller:findMovementActor(player),propertyTarget=findMovementActor(3-player),propertySaved={ctrl:propertyBinding.ctrl,priority:propertyBinding.sprPriority,targetCtrl:propertyTarget.ctrl,targetPriority:propertyTarget.sprPriority,variable:caller.vars[8]},propertyFlags=assertionActor(player,caller).assertions,propertyFlagsSaved=[...propertyFlags];
    try{
     caller.vars[8]=3;
     executeControllerM1({type:'CtrlSet',params:{value:'1'}},propertyBinding,context,adapter);
     if(propertyBinding.ctrl!==1||evalM1('Ctrl',specialRuntime.context(kind==='helper'?caller:specialRoot(player)))!==true)throw Error('CtrlSet did not update live control/query');
     for(const operand of ['"1"','Var(8)/0']){
      executeControllerM1({type:'CtrlSet',params:{value:operand}},propertyBinding,context,adapter);
      executeControllerM1({type:'SprPriority',params:{value:operand,layerno:operand}},propertyBinding,context,adapter);
      executeControllerM1({type:'AssertSpecial',params:{flag:'NoHitDamage',enabled:'1'}},propertyBinding,context,adapter);
      if(!propertyFlags.has('nohitdamage'))throw Error('Actor assertion numeric setup failed');
      executeControllerM1({type:'AssertSpecial',params:{flag:'NoHitDamage',enabled:operand}},propertyBinding,context,adapter);
      if(propertyBinding.ctrl!==0||propertyBinding.sprPriority!==0||propertyFlags.has('nohitdamage')||evalM1('Ctrl',specialRuntime.context(kind==='helper'?caller:specialRoot(player)))!==false)throw Error('Live control/priority/assertion extraction accepted text/undefined');
     }
     for(const type of ['CtrlSet','SprPriority']){
      executeControllerM1({type,params:{redirectid:JSON.stringify(String(3-player)),value:'Var(8):=99'}},propertyBinding,context,adapter);
      if(caller.vars[8]!==3)throw Error('State property string redirect executed RHS');
     }
     executeControllerM1({type:'AssertSpecial',params:{flag:'NoHitDamage',redirectid:JSON.stringify(String(3-player)),enabled:'Var(8):=99'}},propertyBinding,context,adapter);
     if(caller.vars[8]!==3||propertyTarget.ctrl!==propertySaved.targetCtrl||propertyTarget.sprPriority!==propertySaved.targetPriority)throw Error('Actor assertion or state property changed invalid redirect recipient');
    }finally{
     propertyBinding.ctrl=propertySaved.ctrl;propertyBinding.sprPriority=propertySaved.priority;propertyTarget.ctrl=propertySaved.targetCtrl;propertyTarget.sprPriority=propertySaved.targetPriority;caller.vars[8]=propertySaved.variable;propertyFlags.clear();for(const flag of propertyFlagsSaved)propertyFlags.add(flag);
    }
    if(kind==='root'){
     const pushRootSaved=[posX,posY,p1Facing,p1Life,p1HitPause,p1Reaction,cameraX,cameraZoom],pushP2Saved={...p2},pushStatesSaved=rootPlayerPushStates.map(value=>({...value})),pushWidthsSaved=rootWidthModifiers.map(value=>({player:[...value.player],edge:[...value.edge]})),pushUntilSaved=[...playerPushDisabledUntil],pushData=[1,2].map(owner=>characterProfiles.get(battleCharacters[owner-1]).battle),pushConstantsSaved=pushData.map(owner=>owner.constants);
     try{
      pushData[0].constants={...pushData[0].constants,'size.ground.front':100,'size.ground.back':60};
      pushData[1].constants={...pushData[1].constants,'size.ground.front':30,'size.ground.back':20};
      p1Reaction=null;posY=0;p1Facing=1;p1Life=1000;p1HitPause=0;cameraX=0;cameraZoom=1;
      Object.assign(p2,{y:0,facing:-1,life:1000,hitPause:0,attackPause:0,playerPush:true});playerPushDisabledUntil.fill(0);
      rootWidthModifiers.splice(0,2,createWidthModifiers(),createWidthModifiers());
      for(const [value,distance] of [['1',130],['"1"',70],['Var(8)/0',70]]){
       rootPlayerPushStates.splice(0,2,createPlayerPushState(),createPlayerPushState());posX=0;p2.x=70;
       executeControllerM1({type:'PlayerPush',params:{value}},caller,context,adapter);playerPushM1();
       if(Math.abs(p2.x-posX-distance)>0.000001)throw Error('Actual PlayerPush ignored flag or actor-owned widths: '+JSON.stringify([profile,player,value,posX,p2.x,distance]));
      }
     }finally{
      [posX,posY,p1Facing,p1Life,p1HitPause,p1Reaction,cameraX,cameraZoom]=pushRootSaved;Object.assign(p2,pushP2Saved);rootPlayerPushStates.splice(0,rootPlayerPushStates.length,...pushStatesSaved);rootWidthModifiers.splice(0,rootWidthModifiers.length,...pushWidthsSaved);playerPushDisabledUntil.splice(0,playerPushDisabledUntil.length,...pushUntilSaved);pushData.forEach((owner,index)=>{owner.constants=pushConstantsSaved[index];});
     }
    }
    if(kind==='root'){
     const freezeRootSaved=[posX,posY,vx,vy,p1Facing,p1Reaction],freezeP2Saved={...p2},freezeFlagsSaved=[...rootPositionFrozen];
     try{
      p1Reaction=null;
      for(const facing of [1,-1])for(const [value,frozen] of [['1',true],['"1"',false],['Var(8)/0',false]]){
       if(player===1){posX=10;posY=-50;vx=3;vy=2;p1Facing=facing;}else Object.assign(p2,{x:10,y:-50,vx:3*facing,vy:2,physics:'N',facing});
       executeControllerM1({type:'PosFreeze',params:{value}},caller,context,adapter);
       if(player===1)applyPhysics({physics:'N'});else applyP2SourcePhysics();
       const actual=player===1?[posX,posY,vx,vy]:[p2.x,p2.y,p2.vx,p2.vy],expected=[10+(frozen?0:3*facing),frozen?-50:-48,player===1?3:3*facing,2];
       if(JSON.stringify(actual)!==JSON.stringify(expected))throw Error('Actual root PosFreeze physics mismatch: '+JSON.stringify(actual));
      }
     }finally{
      [posX,posY,vx,vy,p1Facing,p1Reaction]=freezeRootSaved;Object.assign(p2,freezeP2Saved);rootPositionFrozen.splice(0,rootPositionFrozen.length,...freezeFlagsSaved);
     }
    }
    const boundScreen=screenFlagsFor(caller),boundDepth=depthBoundFlagsFor(caller),boundPush=playerPushStateFor(caller),boundSaved={screen:{...boundScreen,moveCamera:[...boundScreen.moveCamera]},depth:{...boundDepth},push:{...boundPush},frozen:kind==='helper'?caller.positionFrozen:rootPositionFrozen[player-1]},boundVar=caller.vars[8];
    try{
     caller.vars[8]=3;
     for(const [value,expected] of [['1',true],['"1"',false],['Var(8)/0',false]]){
      executeControllerM1({type:'ScreenBound',params:{value,movecamera:value+','+value,stagebound:value}},caller,context,adapter);
      executeControllerM1({type:'DepthBound',params:{value,movecamera:value}},caller,context,adapter);
      executeControllerM1({type:'PosFreeze',params:{value}},caller,context,adapter);
      executeControllerM1({type:'PlayerPush',params:{value}},caller,context,adapter);
      const actual=[boundScreen.screenBound,boundScreen.stageBound,...boundScreen.moveCamera,boundDepth.enabled,boundDepth.moveCamera,boundPush.enabled,kind==='helper'?caller.positionFrozen:rootPositionFrozen[player-1]];
      if(actual.some(flag=>flag!==expected))throw Error('Actual bound/freeze/push boolean extraction mismatch: '+JSON.stringify(actual));
     }
     for(const type of ['ScreenBound','DepthBound','PosFreeze','PlayerPush']){
      executeControllerM1({type,params:{redirectid:JSON.stringify(String(3-player)),value:'Var(8):=99'}},caller,context,adapter);
      if(caller.vars[8]!==3)throw Error('Bound/freeze/push numeric-string redirect executed caller RHS');
     }
     executeControllerM1({type:'PlayerPush',params:{priority:'"7"'}},caller,context,adapter);
     if(boundPush.priority!==0||boundPush.enabled!==false)throw Error('PlayerPush integer extraction accepted text or rewrote omitted value');
     boundScreen.stageBound=true;
     executeControllerM1({type:'ScreenBound',params:{}},caller,context,adapter);
     executeControllerM1({type:'DepthBound',params:{}},caller,context,adapter);
     executeControllerM1({type:'PosFreeze',params:{}},caller,context,adapter);
     if(boundScreen.screenBound||!boundScreen.stageBound||boundScreen.moveCamera.some(Boolean)||boundDepth.enabled||boundDepth.moveCamera||!(kind==='helper'?caller.positionFrozen:rootPositionFrozen[player-1]))throw Error('Actual bound/freeze omitted defaults mismatch');
    }finally{
     Object.assign(boundScreen,boundSaved.screen);Object.assign(boundDepth,boundSaved.depth);Object.assign(boundPush,boundSaved.push);if(kind==='helper')caller.positionFrozen=boundSaved.frozen;else rootPositionFrozen[player-1]=boundSaved.frozen;caller.vars[8]=boundVar;
    }
    const statusSaved=rootStatusFlags.map(flags=>({...flags})),statusHelper={dizzy:caller.dizzy,guardBreak:caller.guardBreak},statusVar=caller.vars[8],statusTarget=specialRoot(3-player),statusTargetContext=specialRuntime.context(statusTarget);
    try{
     for(const [type,query] of [['DizzySet','Dizzy'],['GuardBreakSet','GuardBreak']]){
      caller.vars[8]=4;
      executeControllerM1({type,params:{value:'1'}},caller,context,adapter);
      if(evalM1(query,context)!==true||evalM1(query+'/2',context)!==0)throw Error('Actual status flag/query lost boolean type');
      for(const value of ['"1"','Var(8)/0','0']){
       executeControllerM1({type,params:{value}},caller,context,adapter);
       if(evalM1(query,context)!==false)throw Error('Status controller accepted string/undefined as true');
      }
      executeControllerM1({type,params:{redirectid:String(3-player),value:'Var(8):=Var(8)+1'}},caller,context,adapter);
      if(caller.vars[8]!==5||evalM1(query,statusTargetContext)!==true||evalM1(query,context)!==false)throw Error('Status redirect changed operand caller or wrong flag recipient');
      executeControllerM1({type,params:{redirectid:JSON.stringify(String(3-player)),value:'Var(8):=99'}},caller,context,adapter);
      if(caller.vars[8]!==5)throw Error('Status string redirect executed RHS');
     }
    }finally{
     rootStatusFlags.forEach((flags,index)=>Object.assign(flags,statusSaved[index]));caller.dizzy=statusHelper.dizzy;caller.guardBreak=statusHelper.guardBreak;caller.vars[8]=statusVar;
    }
    const contactKey=hitDefinitionOwnerKey(caller),contactHad=reversedMoveClocks.has(contactKey),contactSaved={...reversedMoveClocks.get(contactKey)},counterHad=moveCounteredFlags.has(contactKey),counterSaved=moveCounteredFlags.get(contactKey);
    try{
     const readContacts=()=>['movecontact','movehit','moveguarded','movereversed','movecountered'].map(name=>evalM1(name,context));
     executeControllerM1({type:'ModifyPlayer',params:{movehit:'9',movecountered:'1'}},caller,context,adapter);
     if(JSON.stringify(readContacts())!==JSON.stringify([9,9,0,0,9]))throw Error('ModifyPlayer movehit/countered did not reach actual queries');
     if(evalM1('MoveCountered/2',context)!==4)throw Error('MoveCountered lost native integer arithmetic');
     executeControllerM1({type:'ModifyPlayer',params:{moveguarded:'7'}},caller,context,adapter);
     if(JSON.stringify(readContacts())!==JSON.stringify([7,0,7,0,7]))throw Error('ModifyPlayer moveguarded did not replace shared contact clock');
     executeControllerM1({type:'ModifyPlayer',params:{movereversed:'5'}},caller,context,adapter);
     if(JSON.stringify(readContacts())!==JSON.stringify([0,0,0,5,5]))throw Error('ModifyPlayer movereversed/countered queries mismatch');
     executeControllerM1({type:'ModifyPlayer',params:{movecountered:'0'}},caller,context,adapter);
     if(evalM1('movecountered',context)!==0)throw Error('ModifyPlayer movecountered flag did not clear query');
    }finally{
     if(contactHad)reversedMoveClocks.set(contactKey,contactSaved);else reversedMoveClocks.delete(contactKey);
     if(counterHad)moveCounteredFlags.set(contactKey,counterSaved);else moveCounteredFlags.delete(contactKey);
    }
    specialRuntime.dispatch({type:'Helper',params:{stateno:991671,id:991673}},caller,context,{},caller,player);
    const timerHelper=specialRuntime.entities.at(-1),timerKey=hitDefinitionOwnerKey(timerHelper),timerContext=specialRuntime.context(timerHelper),timerAdapter={owner:timerHelper,player,schedulingApplied:true};
    try{
     timerHelper.vars[8]=3;
     for(const operand of ['"7"','Var(8)/0']){
      executeControllerM1({type:'ModifyPlayer',params:{unhittabletime:'7',movehit:'9'}},timerHelper,timerContext,timerAdapter);
      if(actorUnhittableTime.remaining(timerKey)!==7||reversedMoveClocks.get(timerKey)?.time!==9||reversedMoveClocks.get(timerKey)?.type!=='hit')throw Error('ModifyPlayer numeric timer/contact setup failed');
      executeControllerM1({type:'ModifyPlayer',params:{unhittabletime:operand,movehit:operand,moveguarded:operand,movereversed:operand}},timerHelper,timerContext,timerAdapter);
      if(actorUnhittableTime.remaining(timerKey)!==0||reversedMoveClocks.get(timerKey)?.time!==0||reversedMoveClocks.get(timerKey)?.type!=='reversed')throw Error('Actual ModifyPlayer unhittable/contact integer extraction mismatch');
     }
    }finally{
     timerHelper.destroyed=true;reversedMoveClocks.delete(timerKey);actorUnhittableTime.set(timerKey,0,combatTraceTick);actorUnhittableTime.prepare(timerKey,combatTraceTick+1);
    }
    const modifyResource=resourceActor(player,caller),modifyPower=kind==='helper'?caller:modifyResource,modifyPointHad=Object.hasOwn(caller,'pointResources'),modifyPoints=pointActor(player,caller),modifyLifeSnapshot={life:modifyResource.life,lifeMax:modifyResource.lifeMax},modifyPowerSnapshot={power:modifyPower.power,powerMax:modifyPower.powerMax},modifyPointSnapshot=Object.fromEntries(['dizzyPoints','dizzyPointsMax','guardPoints','guardPointsMax'].map(name=>[name,modifyPoints[name]])),modifyMaximumSnapshot=[...modifiedPowerMax],modifyHitPauseSnapshot=[caller.hitPause,p1HitPause,p2.attackPause],modifyMoveKey=kind==='helper'?caller.key:'root'+player,modifyMoveHad=specialRuntime.moveTimes.has(modifyMoveKey),modifyMoveSaved={...specialRuntime.moveTimes.get(modifyMoveKey)};
    try{
     for(const operand of ['"7"','Var(8)/0']){
      modifyResource.lifeMax=1000;modifyResource.life=900;modifyPower.powerMax=1000;modifyPower.power=900;
      modifyPoints.dizzyPointsMax=1000;modifyPoints.dizzyPoints=700;modifyPoints.guardPointsMax=1000;modifyPoints.guardPoints=400;
      executeControllerM1({type:'ModifyPlayer',params:{lifemax:operand,powermax:operand,dizzypointsmax:operand,guardpointsmax:operand,hitpausetime:operand,pausemovetime:operand,supermovetime:operand}},caller,context,adapter);
      const actual=[modifyResource.lifeMax,modifyResource.life,modifyPower.powerMax,modifyPower.power,modifyPoints.dizzyPointsMax,modifyPoints.dizzyPoints,modifyPoints.guardPointsMax,modifyPoints.guardPoints,kind==='helper'?caller.hitPause:player===1?p1HitPause:p2.attackPause,specialRuntime.moveTimes.get(modifyMoveKey)?.normal,specialRuntime.moveTimes.get(modifyMoveKey)?.super];
      if(JSON.stringify(actual)!==JSON.stringify([1,1,0,0,0,0,0,0,0,0,0]))throw Error('Actual ModifyPlayer resource/timer extraction mismatch: '+JSON.stringify(actual));
     }
    }finally{
     Object.assign(modifyResource,modifyLifeSnapshot);Object.assign(modifyPower,modifyPowerSnapshot);Object.assign(modifyPoints,modifyPointSnapshot);modifiedPowerMax.splice(0,modifiedPowerMax.length,...modifyMaximumSnapshot);
     if(!modifyPointHad&&kind==='helper')delete caller.pointResources;
     [caller.hitPause,p1HitPause,p2.attackPause]=modifyHitPauseSnapshot;
     if(modifyMoveHad)specialRuntime.moveTimes.set(modifyMoveKey,modifyMoveSaved);else specialRuntime.moveTimes.delete(modifyMoveKey);
    }
    const redirectedMapActor=specialRoot(3-player),redirectedMapKey='__routing.source',redirectedMapModule=window.mapValueTest,redirectedMapVars=[caller.vars[8],redirectedMapActor.vars[8]],redirectedMapSaved=[caller,redirectedMapActor].map(owner=>[owner.maps.has(redirectedMapKey),redirectedMapModule.readStoredMapValue(owner.maps,redirectedMapKey)]);
    try{
     caller.vars[8]=4;redirectedMapActor.vars[8]=88;
     caller.maps.delete(redirectedMapKey);
     for(const type of ['MapSet','MapAdd'])executeControllerM1({type,params:{redirectid:String(3-player),map:'"__routing.source"',value:'Var(8):=Var(8)+1'}},caller,context,adapter);
     if(caller.vars[8]!==6||redirectedMapActor.vars[8]!==88||redirectedMapActor.maps.get(redirectedMapKey)!==11||caller.maps.has(redirectedMapKey))throw Error('Map redirect changed operand caller or sampled RHS twice');
     for(const redirectid of ['-123',JSON.stringify(String(3-player)),'Var(8)/0']){
      executeControllerM1({type:'MapSet',params:{redirectid,map:'"__routing.source"',value:'Var(8):=99'}},caller,context,adapter);
      if(caller.vars[8]!==6||redirectedMapActor.maps.get(redirectedMapKey)!==11)throw Error('Missing/string/undefined Map redirect evaluated RHS or selected a numeric-string ID');
     }
    }finally{
     [caller.vars[8],redirectedMapActor.vars[8]]=redirectedMapVars;
     [caller,redirectedMapActor].forEach((owner,index)=>{const [had,sample]=redirectedMapSaved[index];if(had)redirectedMapModule.writeStoredMapValue(owner.maps,redirectedMapKey,sample);else{owner.maps.delete(redirectedMapKey);redirectedMapModule.forgetStoredMapValue(owner.maps,redirectedMapKey);}});
    }
    for(const type of ['AngleSet','AngleMul']){
     executeControllerM1({type:'AngleDraw',params:{value:'10',xangle:'20',yangle:'30'}},caller,context,adapter);
     executeControllerM1({type,params:{value:'2',xangle:'Angle'}},caller,context,adapter);
     angleResults.push([context.query('angle'),context.query('xangle'),context.query('yangle'),evalM1('XAngle/3',context)]);
    }
    resetAngleDraw(caller.angleState);
    angleResults.push([context.query('angle'),context.query('xangle'),context.query('yangle')]);
    const angleArity=[];
    for(const name of ['scale','pivot']){
     caller.vars[8]=0;const before=JSON.stringify(caller.angleState);let rejected=false;
     try{executeControllerM1({type:'AngleDraw',params:{value:'Var(8):=42',[name]:'1,2,3'}},caller,context,adapter);}catch(error){rejected=error.message.includes('at most two');}
     angleArity.push(rejected,caller.vars[8]===0,JSON.stringify(caller.angleState)===before);
    }
    const mapResult=[],savedMapVariables=[caller.vars[11],caller.vars[12]];
    caller.vars[11]=1;caller.vars[12]=2147483647;
    for(const [name,value] of [['__test.float','1.0'],['__test.int','Var(11)'],['__test.unset',null]]){
     caller.maps.delete(name);
     if(value!==null)executeControllerM1({type:'MapSet',params:{map:JSON.stringify(name),value}},caller,context,adapter);
     else executeControllerM1({type:'MapAdd',params:{map:JSON.stringify(name),value:'1'}},caller,context,adapter);
     executeControllerM1({type:'MapAdd',params:{map:JSON.stringify(name),value:name==='__test.int'?'Var(12)':'2147483647'}},caller,context,adapter);
     mapResult.push(caller.maps.get(name));
    }
    caller.vars[11]=3;
    for(const [name,value] of [['__test.readint','Var(11)'],['__test.readfloat','3.0'],['__test.constant','3'],['__test.readtext','"3"']])executeControllerM1({type:'MapSet',params:{map:JSON.stringify(name),value}},caller,context,adapter);
    [caller.vars[11],caller.vars[12]]=savedMapVariables;
    executeControllerM1({type:'AngleSet',params:{value:'Map("__test.readint")/2',xangle:'Map("__test.readfloat")/2',yangle:'Map("__test.readtext")+2'}},caller,context,adapter);
    const mapQueryResult=[caller.angleState.value,caller.angleState.xangle,caller.angleState.yangle,evalM1('Map("__test.readtext")=3',context),evalM1('!Map("__test.readtext")',context),evalM1('Map("__test.constant")/2',context)];
    executeControllerM1({type:'MapSet',params:{map:'"__test.undefined"',value:'Var(0)/0'}},caller,context,adapter);
    const triggerResult=[];caller.vars[10]=0;
    for(const [triggerall,triggers] of [[['Map("__test.readtext")'],{1:['1']}],[[],{1:['Map("__test.readtext")']}],[[],{1:['Map("__test.readtext")'],2:['Map("__test.readint")']}],[[],{1:['Map("__test.undefined")']}],[[],{1:['Map("__test.missing")']}]]){
     executeControllerM1({type:'VarAdd',params:{v:'10',value:'1'},triggerall,triggers},caller,context,adapter);
     triggerResult.push(caller.vars[10]);
    }
    executeControllerM1({type:'AngleSet',params:{value:'(Map("__assign.int"):=3)/2',xangle:'(Map("__assign.float"):=3.0)/2',yangle:'(Map("__assign.text"):="3")+2'}},caller,context,adapter);
    const mapAssignmentResult=[caller.angleState.value,caller.angleState.xangle,caller.angleState.yangle];
    const selected=specialRoot(3-player),savedVariables=[caller.vars[9],selected.vars[9]];
    try{
     caller.vars[9]=5;selected.vars[9]=99;caller.maps.delete('__assign.redirect');selected.maps.delete('__assign.redirect');
     executeControllerM1({type:'AngleSet',params:{value:'EnemyNear, (Map("__assign.redirect") := (Var(9):=Var(9)+1))'}},caller,context,adapter);
     mapAssignmentResult.push(caller.angleState.value,caller.vars[9],selected.vars[9],selected.maps.get('__assign.redirect'),caller.maps.has('__assign.redirect'));
    }finally{[caller.vars[9],selected.vars[9]]=savedVariables;}
    const mapModule=window.mapValueTest,mapResetResult=[];
    const oldMaps=[...caller.maps.keys()].map(name=>[name,mapModule.readStoredMapValue(caller.maps,name)]),oldDefaults=[...caller.mapDefaults.keys()].map(name=>[name,mapModule.readStoredMapValue(caller.mapDefaults,name)]);
    try{
     mapModule.writeStoredMapValue(caller.mapDefaults,'__reset.float',{type:'float',value:3});
     executeControllerM1({type:'MapSet',params:{map:'"__reset.float"',value:'99'}},caller,context,adapter);
     executeControllerM1({type:'MapReset',params:{}},caller,context,adapter);
     mapResetResult.push(evalM1('Map("__reset.float")/2',context));
     caller.maps.delete('__reset.float');
     executeControllerM1({type:'MapReset',params:{}},caller,context,adapter);
     mapResetResult.push(evalM1('Map("__reset.float")/2',context));
     executeControllerM1({type:'MapSet',params:{map:'"__keep.float"',value:'3.0'}},caller,context,adapter);
     executeControllerM1({type:'MapReset',params:{exclude:'"__keep"'}},caller,context,adapter);
     mapResetResult.push(evalM1('Map("__keep.float")/2',context));
    }finally{
     for(const [storage,saved] of [[caller.maps,oldMaps],[caller.mapDefaults,oldDefaults]]){storage.clear();mapModule.clearStoredMapTypes(storage);for(const [name,sample] of saved)mapModule.writeStoredMapValue(storage,name,sample);}
    }
    const defense=defenseActor(player,caller).defenseState;
    defense.customDefense=3;defense.onHit=false;
    const defenseBefore=context.query('defence');
    executeControllerM1({type:'DefenceMulSet',params:{value:'2',multype:'1',onhit:'Defence > 250'}},caller,context,adapter);
    const defenseResult={before:defenseBefore,multiplier:defense.customDefense,onHit:defense.onHit};
    const foreign=battleCharacters[2-player],foreignData=characterProfiles.get(foreign).battle;
    const ownVersions=data.engineVersions,foreignVersions=foreignData.engineVersions;
    const previousOwner=kind==='helper'?caller.stateOwner:customStateOwners[player-1],versionResults=[],healingResults=[],deadLifeResults=[],targetHealingResults=[];
    try{
     data.engineVersions={mugen:[1,1],ikemen:[0,0,0]};foreignData.engineVersions={mugen:[1,1],ikemen:[0,99,0]};
     if(kind==='helper')caller.stateOwner=foreign;else customStateOwners[player-1]=foreign;
     const foreignContext=specialRuntime.context(caller);
     for(const controllerStateNo of [5000,-2,-1]){
      executeControllerM1({type:'DefenceMulSet',controllerStateNo,params:{value:'2'}},caller,foreignContext,adapter);
      versionResults.push([defense.customDefense,defense.onHit]);
      const healing=resourceActor(player,caller),savedLife=healing.life;
      defense.customDefense=2;defense.onHit=false;healing.life=500;
      executeControllerM1({type:'LifeAdd',controllerStateNo,params:{value:'10',absolute:'0'}},caller,foreignContext,adapter);
      healingResults.push(healing.life);
      healing.life=0;
      executeControllerM1({type:'LifeAdd',controllerStateNo,params:{value:'-1',absolute:'1',kill:'0'}},caller,foreignContext,adapter);
      const selfDead=healing.life;healing.life=savedLife;
      const victim=resourceActor(3-player),savedVictimLife=victim.life;
      try{
       victim.life=0;
       executeControllerM1({type:'LifeAdd',controllerStateNo,params:{redirectid:3-player,value:'-1',absolute:'1',kill:'0'}},caller,foreignContext,adapter);
       deadLifeResults.push([selfDead,victim.life]);
      }finally{victim.life=savedVictimLife;}
      const list=combatTargetList(caller),oldTargets=list.ids(),victimDefense=defenseActor(3-player).defenseState;
      const oldResources=[victim.life,victim.redLife,victimDefense.customDefense,victimDefense.onHit,combatResourceFeatures.redLife];
      try{
       list.clear();list.add(3-player);victim.life=100;victim.redLife=500;victimDefense.customDefense=2;victimDefense.onHit=false;combatResourceFeatures.redLife=true;
       executeControllerM1({type:'TargetRedLifeAdd',controllerStateNo,params:{value:'20',absolute:'0'}},caller,foreignContext,adapter);
       targetHealingResults.push(victim.redLife);
      }finally{
       [victim.life,victim.redLife,victimDefense.customDefense,victimDefense.onHit,combatResourceFeatures.redLife]=oldResources;
       list.clear();for(const id of oldTargets)list.add(id);
      }
     }
    }finally{
     data.engineVersions=ownVersions;foreignData.engineVersions=foreignVersions;
     if(kind==='helper')caller.stateOwner=previousOwner;else customStateOwners[player-1]=previousOwner;
    }
    executeControllerM1({type:'AngleSet',params:{value:'1/0',xangle:'Name'}},caller,context,adapter);
    executeControllerM1({type:'AttackMulSet',params:{value:'1/0',damage:'Name'}},caller,context,adapter);
    executeControllerM1({type:'DefenceMulSet',params:{value:'1/0',multype:'1',onhit:'Name'}},caller,context,adapter);
    executeControllerM1({type:'AttackDist',params:{width:'1/0,Name'}},caller,context,adapter);
    const conversions=[caller.angleState.value,caller.angleState.xangle,...Object.values(caller.attackState),defense.customDefense,defense.onHit,...guardHitDefActor(player,caller).hitDef.guardDistance.x];
    const liveBinding=findMovementActor(kind==='helper'?caller.instanceId:player),movement=[];
    liveBinding.vx=8;liveBinding.vy=9;
    for(const type of ['HitVelSet','VelAdd','VelMul','VelSet']){
     executeControllerM1({type,params:{x:'1/0',y:'Name'}},liveBinding,context,adapter);
     movement.push([liveBinding.vx,liveBinding.vy]);
    }
    const positionBefore=[liveBinding.x,liveBinding.y];
    executeControllerM1({type:'PosAdd',params:{x:'Name',y:'1/0'}},liveBinding,context,adapter);
    movement.push([liveBinding.x===positionBefore[0],liveBinding.y===positionBefore[1]]);
    executeControllerM1({type:'PosSet',params:{x:'Name',y:'1/0',z:'1/0'}},liveBinding,context,adapter);
    movement.push([Number.isFinite(liveBinding.x),Number.isFinite(liveBinding.y),movementControllerBinding(liveBinding,caller,context).z]);
    const targets=combatTargetList(caller),savedTargets=targets.ids(),targetMovement=[],targetLifeFlags=[],targetRedLifeOrder=[],scoreResult={};
    try{
     targets.clear();targets.add(3-player);
     scoreRuntime.addNative(player,0.5);scoreResult.before=scoreRuntime.snapshot().roundScores;
     for(const value of ['1/0','Name'])for(const type of ['ScoreAdd','TargetScoreAdd'])executeControllerM1({type,params:{value}},liveBinding,context,adapter);
     scoreResult.after=scoreRuntime.snapshot().roundScores;
     const victim=findMovementActor(3-player);victim.vx=8;victim.vy=9;
     for(const type of ['TargetVelAdd','TargetVelSet']){
      executeControllerM1({type,params:{x:'Name',y:'1/0'}},liveBinding,context,adapter);
      targetMovement.push([victim.vx,victim.vy]);
     }
     const resource=resourceActor(3-player),points=pointActor(3-player),victimDefense=defenseActor(3-player).defenseState;
     const saved=[resource.life,resource.redLife,points.dizzyPoints,victimDefense.customDefense,victimDefense.onHit,combatResourceFeatures.redLife,combatResourceFeatures.dizzyPoints];
     try{
      resource.life=500;resource.redLife=900;points.dizzyPoints=800;victimDefense.customDefense=2;victimDefense.onHit=false;
      combatResourceFeatures.redLife=true;combatResourceFeatures.dizzyPoints=true;
      executeControllerM1({type:'TargetLifeAdd',params:{value:'-100',absolute:'Name',kill:'1/0',dizzy:'Name',redlife:'1/0'}},liveBinding,context,adapter);
      targetLifeFlags.push(resource.life,resource.redLife,points.dizzyPoints,resource.getHit.kill);
     }finally{
      [resource.life,resource.redLife,points.dizzyPoints,victimDefense.customDefense,victimDefense.onHit,combatResourceFeatures.redLife,combatResourceFeatures.dizzyPoints]=saved;
     }
     caller.vars[7]=0;
     executeControllerM1({type:'TargetRedLifeAdd',params:{absolute:'Var(7):=1',value:'(Var(7):=Var(7)+1)*0'}},liveBinding,context,adapter);
     targetRedLifeOrder.push(caller.vars[7]);
    }finally{targets.clear();for(const id of savedTargets)targets.add(id);}
    const lifeActor=resourceActor(player,caller),oldLife=lifeActor.life;
    lifeActor.life=500;defense.customDefense=1;defense.onHit=false;
    executeControllerM1({type:'LifeAdd',params:{absolute:'Var(4):=0',kill:'Var(4):=Var(4)+1',value:'-10*(Var(4):=Var(4)+1)'}},liveBinding,context,adapter);
    const lifeOrder=[lifeActor.life,caller.vars[4]];
    lifeActor.life=oldLife;
    caller.vars[5]=0;
    executeControllerM1({type:'RedLifeAdd',params:{absolute:'Var(5):=7',value:'0'}},liveBinding,context,adapter);
    const redLifeOrder=[caller.vars[5]];
    executeControllerM1({type:'RedLifeAdd',params:{absolute:'Var(5):=1',value:'(Var(5):=Var(5)+1)*0'}},liveBinding,context,adapter);
    redLifeOrder.push(caller.vars[5]);
    const pointOrder=[];
    for(const type of ['DizzyPointsAdd','GuardPointsAdd']){
     caller.vars[6]=0;
     executeControllerM1({type,params:{absolute:'Var(6):=7',value:'0'}},liveBinding,context,adapter);
     pointOrder.push(caller.vars[6]);
     executeControllerM1({type,params:{absolute:'Var(6):=1',value:'(Var(6):=Var(6)+1)*0'}},liveBinding,context,adapter);
     pointOrder.push(caller.vars[6]);
    }
    data.helperStates[991675]={type:'S',physics:'N',moveType:'I',anim:0,velset:['1/0','Name','1/0'],controllers:[]};
    specialRuntime.dispatch({type:'Helper',params:{stateno:991675,id:991675}},caller,context,{},caller,player);
    const entered=specialRuntime.entities.at(-1),stateVelocity=[entered.vx,entered.vy,entered.vz].map(value=>Number.isFinite(value)&&value===0);
    entered.destroyed=true;
    const previousShake=fallShake,shakeResult=[];
    try{
     executeControllerM1({type:'EnvShake',params:{time:'2',freq:'90',phase:'1/0',mul:'Name',dir:'Name',diradd:'1/0',decay:'1/0'}},liveBinding,context,adapter);
     for(const name of ['phase','mul','dir','diradd','decay'])shakeResult.push(fallShake.params[name]);
     shakeResult.push(fallShake.params.freq,Number.isFinite(fallShake.params.ampl));
    }finally{setEnvShakeState(previousShake);}
    executeControllerM1({type:'DisplayToClipboard',params:{text:'"n=%d/%d"',params:'Var(3):=7,Var(3):=Var(3)+1'}},caller,context,adapter);
    executeControllerM1({type:'AppendToClipboard',params:{text:'"!"'}},caller,context,adapter);
    const own=debugClipboard.entries().find(entry=>entry.key===(caller.key||'root'+player));
    updateDebugHud();const visible=act.textContent.includes('n=7/8');
    executeControllerM1({type:'DisplayToClipboard',params:{text:'"ties=%.0f/%.2f"',params:'2.5,1.125'}},caller,context,adapter);
    const floating=debugClipboard.entries().find(entry=>entry.key===(caller.key||'root'+player)).lines;
    updateDebugHud();const floatVisible=act.textContent.includes(floating[0]);
    executeControllerM1({type:'DisplayToClipboard',params:{text:'"bad=%d"',params:'1.25'}},caller,context,adapter);
    const mismatch=debugClipboard.entries().find(entry=>entry.key===(caller.key||'root'+player)).lines;
    const strings=[],bases=[];
    if(profile==='ikemen'){
     for(const [text,params] of [['"name=%s"','Name'],['"quoted=%q"','Name'],['"v=%v"','1.2']]){
      executeControllerM1({type:'DisplayToClipboard',params:{text,params}},caller,context,adapter);
      strings.push(debugClipboard.entries().find(entry=>entry.key===(caller.key||'root'+player)).lines[0]);
     }
     updateDebugHud();if(!act.textContent.includes('v=1.2'))throw Error('Default-value string not visible');
     for(const [text,params] of [['"%#08x"','15'],['"%c"','26376'],['"%b"','1.5'],['"%x"','1.5'],['"%x"','Name'],['"%#U"','39'],['"%#x"','1.5']]){
      executeControllerM1({type:'DisplayToClipboard',params:{text,params}},caller,context,adapter);
      bases.push(debugClipboard.entries().find(entry=>entry.key===(caller.key||'root'+player)).lines[0]);
     }
     updateDebugHud();if(!act.textContent.includes(bases.at(-1)))throw Error('Hexadecimal string not visible');
    }
    const target=specialRoot(3-player);target.vars[3]=99;
    executeControllerM1({type:'DisplayToClipboard',params:{redirectid:3-player,text:'"r=%d"',params:'Var(3):=Var(3)+1'}},caller,context,adapter);
    const redirected=debugClipboard.entries().find(entry=>entry.key==='root'+(3-player));
    executeControllerM1({type:'ClearClipboard',params:{redirectid:3-player}},caller,context,adapter);
    const cleared=!debugClipboard.entries().some(entry=>entry.key==='root'+(3-player));
    executeControllerM1({type:'DisplayToClipboard',params:{redirectid:999999,text:'"%d"',params:'Var(3):=100'}},caller,context,adapter);
    rows.push({profile,player,kind,triggerResult,mapAssignmentResult,mapResetResult,mapQueryResult,mapResult,shakeResult,angleArity,scoreResult,targetHealingResults,targetRedLifeOrder,targetLifeFlags,pointOrder,stateVelocity,deadLifeResults,healingResults,redLifeOrder,lifeOrder,targetMovement,movement,conversions,versionResults,defenseResult,angleResults,lines:own.lines,visible,floating,floatVisible,mismatch,strings,bases,name:context.query('name'),redirected:redirected.lines,cleared,source:caller.vars[3],target:target.vars[3]});
    executeControllerM1({type:'ClearClipboard',params:{}},caller,context,adapter);
    updateDebugHud();
    if(act.textContent.includes('n=7/8')||act.textContent.includes('bad=')||act.textContent.includes('v=1.2'))throw Error('Cleared clipboard still visible');
   }}finally{combatEngineProfile=saved;debugClipboard.clear()}
   return rows;
  })()`);
  for(const row of results){
   assert.ok(row.scoreResult.before.every(Number.isFinite));assert.deepEqual(row.scoreResult.after,row.scoreResult.before);
   assert.deepEqual(row.defenseResult,{before:300,multiplier:2,onHit:true});
   assert.deepEqual(row.versionResults,[[2,false],[0.5,true],[0.5,true]]);
   assert.deepEqual(row.healingResults,[505,510,510]);
   assert.deepEqual(row.deadLifeResults,[[0,0],[1,0],[1,0]]);
   assert.deepEqual(row.stateVelocity,[true,true,true]);
   assert.deepEqual(row.pointOrder,[7,2,7,2]);
   assert.deepEqual(row.conversions,[0,0,0,0,0,0,0,false,0,0]);
   assert.deepEqual(row.movement,[[8,9],[8,9],[0,0],[0,0],[true,true],[true,true,0]]);
   assert.deepEqual(row.targetMovement,[[8,9],[0,0]]);
   assert.deepEqual(row.targetLifeFlags,[450,900,800,false]);
   assert.deepEqual(row.targetRedLifeOrder,[2]);
   assert.deepEqual(row.targetHealingResults,[510,520,520]);
   assert.deepEqual(row.lifeOrder,[480,2]);
   assert.deepEqual(row.redLifeOrder,[7,2]);
   assert.deepEqual(row.angleResults,[[2,10,0,Math.fround(10/3)],[20,200,0,Math.fround(200/3)],[0,0,0]]);
   assert.deepEqual(row.angleArity,[true,true,true,true,true,true]);
   assert.deepEqual(row.shakeResult,[0,0,0,0,0,90,true]);
   assert.deepEqual(row.mapResult,[2147483648,-2147483648,2147483648]);
   assert.deepEqual(row.mapQueryResult,[1,1.5,2,false,true,1.5]);
   assert.deepEqual(row.mapResetResult,[1.5,1.5,1.5]);
   assert.deepEqual(row.mapAssignmentResult,[1,1.5,2,6,6,99,6,false]);
   assert.deepEqual(row.triggerResult,[0,0,1,1,1]);
   assert.deepEqual(row.lines,row.profile==='ikemen'?['n=7/8!']:['n=7/8','!']);
   assert.equal(row.visible,true);assert.equal(row.cleared,true);
   assert.equal(row.floatVisible,true);
   assert.deepEqual(row.floating,[row.profile==='ikemen'?'ties=2/1.12':'ties=3/1.13']);
   assert.deepEqual(row.mismatch,[row.profile==='ikemen'?'bad=%!d(float32=1.25)':'bad=1.250000']);
   assert.deepEqual(row.strings,row.profile==='ikemen'?['name='+row.name,'quoted='+JSON.stringify(row.name),'v=1.2']:[]);
   assert.deepEqual(row.bases,row.profile==='ikemen'?['0x0000000f','月','12582912p-23','0x1.8p+00',Buffer.from(row.name).toString('hex'),"U+0027 '''",'0x1.8000p+00']:[]);
   assert.deepEqual(row.redirected,['r=9']);assert.equal(row.source,9);assert.equal(row.target,99);
  }
  console.log('Actual Display/Append/ClearClipboard root/Helper consumers, visible HUD, redirected output and caller-only parameter writes pass in eight scenarios');
  console.log('Actual DefenceMulSet onhit reads the previous Defence trigger before committing the new multiplier in eight actor scenarios');
  const distances=await run(`(()=>{
   const rows=[],saved=combatEngineProfile;
   try{for(const profile of ['mugen11','ikemen'])for(const player of [1,2])for(const kind of ['root','helper']){
    combatEngineProfile=profile;specialRuntime.reset();p1Reaction=null;
    posX=-100;posY=0;p1Facing=1;runtimeMoveType='A';
    p2.x=100;p2.y=0;p2.facing=-1;p2.moveType='A';
    let caller=specialRoot(player);
    if(kind==='helper'){
     const data=characterProfiles.get(battleCharacters[player-1]).battle;
     data.helperStates[991672]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[]};
     specialRuntime.dispatch({type:'Helper',params:{stateno:991672,id:991672}},caller,specialRuntime.context(caller),{},caller,player);
     caller=specialRuntime.entities.at(-1);
    }
    const context=specialRuntime.context(caller),adapter={owner:caller,player,schedulingApplied:true};
    const target=guardHitDefActor(3-player);
    target.hitDef.guardDistance={x:[10,0],y:[1000,1000],z:[10,10]};
    const before=context.query('inguarddist');
    executeControllerM1({type:'AttackDist',params:{redirectid:3-player,width:'1000,IfElse(InGuardDist,20,30)'}},caller,context,adapter);
    rows.push({profile,player,kind,before,after:context.query('inguarddist'),range:[...target.hitDef.guardDistance.x]});
   }}finally{combatEngineProfile=saved}
   return rows;
  })()`);
  for(const row of distances){assert.equal(row.before,false);assert.equal(row.after,true);assert.deepEqual(row.range,[1000,20]);}
  console.log('Actual redirected AttackDist commits front distance before back expression observes InGuardDist in eight profile/player/root-or-Helper scenarios');
  const layerQueries=await run(`(()=>{const saved=[...rootSpriteLayers];try{const rows=[];for(const player of [1,2]){const actor=specialRoot(player),opponent=specialRoot(3-player);for(const layer of [-1,0,1,2]){setActorSpriteLayer(actor,layer);const context=fighterExpressionContext(actor,opponent);rows.push([evalM1('LayerNo',context),evalM1('LayerNo / 2',context)])}const helper={...actor,kind:'helper',layerNo:-3};const context=fighterExpressionContext(helper,opponent);rows.push([evalM1('LayerNo',context),evalM1('LayerNo / 2',context)])}return rows}finally{rootSpriteLayers.splice(0,2,...saved)}})()`);
  assert.deepEqual(layerQueries,[[-1,0],[0,0],[1,0],[2,1],[-3,-1],[-1,0],[0,0],[1,0],[2,1],[-3,-1]]);
  console.log('Actual P1/P2 root and Helper LayerNo queries read live native integer layers');
  const redirectedLayerQueries=await run(`(()=>{const saved=[...rootSpriteLayers],savedVariables=[specialRoot(1).vars[59],specialRoot(2).vars[59]],rows=[];try{rootSpriteLayers.splice(0,2,3,-5);for(const player of [1,2]){const actor=specialRoot(player),opponent=specialRoot(3-player),context=fighterExpressionContext(actor,opponent);const redirected=evalM1('EnemyNear, LayerNo / 2',context);executeControllerM1({type:'VarSet',params:{redirectid:String(3-player),v:'59',value:'LayerNo'}},actor,context,{owner:actor,player,schedulingApplied:true});rows.push([redirected,specialRoot(3-player).vars[59]])}return rows}finally{rootSpriteLayers.splice(0,2,...saved);for(const player of [1,2])specialRoot(player).vars[59]=savedVariables[player-1]}})()`);
  assert.deepEqual(redirectedLayerQueries,[[-2,3],[1,-5]]);
  console.log('Actual LayerNo expression redirection reads the target while redirected VarSet operands retain caller scope');
  const playerIdQueries=await run(`(()=>{const layers=[...rootSpriteLayers],savedVariables=[specialRoot(1).vars[58],specialRoot(2).vars[58]],rows=[];try{rootSpriteLayers.splice(0,2,3,-5);for(const player of [1,2]){const actor=specialRoot(player),opponent=specialRoot(3-player),context=fighterExpressionContext(actor,opponent),targetId=opponent.instanceId??opponent.id??opponent.player;actor.vars[58]=targetId;const direct=evalM1('PlayerID(var(58)), LayerNo / 2',context),nested=evalM1('EnemyNear, PlayerID(var(58)), LayerNo / 2',context),missing=evalM1('PlayerID(99999999), var(58):=111',context);rows.push([direct,nested,Number.isNaN(missing),actor.vars[58]===targetId,evalM1('PlayerID('+String(targetId)+'), LayerNo + LayerNo',context)])}const helper=specialRuntime.entities.find(actor=>actor.kind==='helper'&&!actor.destroyed);if(!helper)throw Error('Missing live Helper');const savedLayer=helper.layerNo;try{helper.layerNo=7;rows.push(evalM1('PlayerID('+String(helper.instanceId)+'), LayerNo / 2',fighterExpressionContext(specialRoot(1),specialRoot(2))))}finally{helper.layerNo=savedLayer}return rows}finally{rootSpriteLayers.splice(0,2,...layers);for(const player of [1,2])specialRoot(player).vars[58]=savedVariables[player-1]}})()`);
  assert.deepEqual(playerIdQueries,[[-2,-2,true,true,-2],[1,1,true,true,-2],3]);
  console.log('Actual PlayerID root/Helper redirection preserves native integer queries, original index scope and missing-target short circuit');
  const parentQueries=await run(`(()=>{const rows=[],savedEntities=[...specialRuntime.entities],savedLayers=[...rootSpriteLayers];try{for(const player of [1,2]){const root=specialRoot(player),opponent=specialRoot(3-player),data=characterProfiles.get(battleCharacters[player-1]).battle;data.helperStates[991680]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[]};const spawn=owner=>{specialRuntime.dispatch({type:'Helper',params:{stateno:991680,id:991680}},owner,specialRuntime.context(owner),{},owner,player);return specialRuntime.entities.at(-1)};const parent=spawn(root),child=spawn(parent);setActorSpriteLayer(root,3);parent.layerNo=7;child.layerNo=11;const context=specialRuntime.context(child);rows.push([evalM1('Parent, LayerNo',context),evalM1('Root, LayerNo',context),Number.isNaN(evalM1('Parent, LayerNo',fighterExpressionContext(root,opponent)))]);parent.destroyed=true;rows.push(Number.isNaN(evalM1('Parent, LayerNo',context)))}return rows}finally{specialRuntime.entities.splice(0,specialRuntime.entities.length,...savedEntities);rootSpriteLayers.splice(0,2,...savedLayers)}})()`);
  assert.deepEqual(parentQueries,[[7,3,true],true,[7,3,true],true]);
  console.log('Actual nested Helpers distinguish Parent from Root for both players and return undefined after parent destruction');
  const familyControllers=await run(`(()=>{const entities=[...specialRuntime.entities],bindings=[...controllerTargetBindings],variables=[specialRoot(1).vars[57],specialRoot(2).vars[57]],rows=[];try{for(const player of [1,2]){const root=specialRoot(player),data=characterProfiles.get(battleCharacters[player-1]).battle;data.helperStates[991681]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[]};const spawn=owner=>{specialRuntime.dispatch({type:'Helper',params:{stateno:991681,id:991681}},owner,specialRuntime.context(owner),{},owner,player);return specialRuntime.entities.at(-1)},parent=spawn(root),child=spawn(parent),execute=(actor,type,params)=>executeControllerM1({type,params},actor,specialRuntime.context(actor),{owner:actor,player,schedulingApplied:true});execute(parent,'BindToParent',{time:2,pos:'4,8'});execute(child,'BindToParent',{time:2,pos:'12,16'});execute(child,'ParentVarSet',{v:57,value:23});execute(child,'RootVarSet',{v:57,value:29});rows.push([controllerTargetBindings.get(parent.instanceId)?.ownerId===player,controllerTargetBindings.get(child.instanceId)?.ownerId===parent.instanceId,parent.vars[57],root.vars[57]]);parent.destroyed=true;controllerTargetBindings.delete(child.instanceId);execute(child,'BindToParent',{time:2,pos:'0,0'});rows.push(controllerTargetBindings.has(child.instanceId))}return rows}finally{specialRuntime.entities.splice(0,specialRuntime.entities.length,...entities);controllerTargetBindings.clear();for(const [id,value]of bindings)controllerTargetBindings.set(id,value);for(const player of [1,2])specialRoot(player).vars[57]=variables[player-1]}})()`);
  assert.deepEqual(familyControllers,[[true,true,23,29],false,[true,true,23,29],false]);
  console.log('Actual first-generation/nested BindToParent and ParentVarSet/RootVarSet share correct live ancestry for both players');
  const variableExtraction=await run(`(()=>{const profile=combatEngineProfile,entities=[...specialRuntime.entities],saved=[1,2].map(player=>{const actor=specialRoot(player);return [actor.vars[55],actor.vars[56],actor.fvars[36],actor.sysvars[9],actor.sysfvars[4]]}),rows=[];try{for(const engine of ['mugen11','ikemen']){combatEngineProfile=engine;for(const player of [1,2])for(const kind of ['root','helper']){let actor=specialRoot(player);if(kind==='helper'){const data=characterProfiles.get(battleCharacters[player-1]).battle;data.helperStates[991682]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[]};specialRuntime.dispatch({type:'Helper',params:{stateno:991682,id:991682}},actor,specialRuntime.context(actor),{},actor,player);actor=specialRuntime.entities.at(-1)}actor.vars[55]=0;const zero=actor.vars[0];const binding=kind==='root'?(player===1?p1LifecycleBinding:p2):actor,execute=(type,params)=>executeControllerM1({type,params},binding,specialRuntime.context(actor),{owner:actor,player,schedulingApplied:true});execute('VarSet',{v:56,value:'"12"'});execute('VarSet',{fv:36,value:'"12"'});const values=[actor.vars[56],actor.fvars[36]];execute('VarRangeSet',{first:56,last:56,value:17,fvalue:99});execute('VarRangeSet',{first:-1,last:2,value:'(var(55):=var(55)+1)'});const assignment=evalM1('fvar(36):="12"',specialRuntime.context(actor)),undefinedAssignment=evalM1('fvar(36):=0/0',specialRuntime.context(actor)),indexAssignment=evalM1('var("12"):=7',specialRuntime.context(actor));actor.sysvars[9]=4;execute('VarAdd',{sysv:9,value:'3.9'});execute('VarSet',{sysfv:4,value:'"12"'});execute('VarAdd',{sysfv:4,value:'2.5'});rows.push([engine,player,kind,...values,actor.vars[56],actor.vars[55],assignment,undefinedAssignment,indexAssignment,actor.vars[0],evalM1('var("12")',specialRuntime.context(actor)),actor.sysvars[9],actor.sysfvars[4],actor.kind!=='helper'||actor.sysfvars!==specialRoot(player).sysfvars]);actor.vars[0]=zero}}return rows}finally{combatEngineProfile=profile;specialRuntime.entities.splice(0,specialRuntime.entities.length,...entities);for(const player of [1,2]){const actor=specialRoot(player);[actor.vars[55],actor.vars[56],actor.fvars[36],actor.sysvars[9],actor.sysfvars[4]]=saved[player-1]}}})()`);
  for(const row of variableExtraction)assert.deepEqual(row.slice(3),[0,0,17,1,0,0,7,7,7,7,2.5,true]);
  assert.equal(variableExtraction.length,8);
  console.log('Actual variable-controller string extraction, VarRangeSet precedence and invalid-range caller side effects pass in eight root/Helper profile/player scenarios');
  const variableBoundaries=await run(`(()=>{const profile=combatEngineProfile,entities=[...specialRuntime.entities],saved=[1,2].map(player=>{const actor=specialRoot(player);return [actor.fvars[34],actor.fvars[35]]}),warn=console.warn,warnings=[],rows=[];try{console.warn=message=>warnings.push(message);for(const engine of ['mugen11','ikemen']){combatEngineProfile=engine;for(const player of [1,2])for(const kind of ['root','helper']){let actor=specialRoot(player);if(kind==='helper'){const data=characterProfiles.get(battleCharacters[player-1]).battle;data.helperStates[991683]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[]};specialRuntime.dispatch({type:'Helper',params:{stateno:991683,id:991683}},actor,specialRuntime.context(actor),{},actor,player);actor=specialRuntime.entities.at(-1)}actor.fvars[34]=-0;actor.fvars[35]=NaN;const context=specialRuntime.context(actor),binding=kind==='root'?(player===1?p1LifecycleBinding:p2):actor;const negative=['var','fvar','sysvar','sysfvar'].map(family=>Number.isNaN(evalM1(family+'(-1)',context)));executeControllerM1({type:'VarAdd',params:{fv:35,value:1}},binding,context,{owner:actor,player,schedulingApplied:true});rows.push([...negative,Number.isNaN(evalM1('fvar(35)',context)),Object.is(evalM1('fvar(34)',context),-0)])}}return {rows,warnings}}finally{console.warn=warn;combatEngineProfile=profile;specialRuntime.entities.splice(0,specialRuntime.entities.length,...entities);for(const player of [1,2]){const actor=specialRoot(player);[actor.fvars[34],actor.fvars[35]]=saved[player-1]}}})()`);
  assert.equal(variableBoundaries.rows.length,8);
  for(const row of variableBoundaries.rows)assert.deepEqual(row,[true,true,true,true,true,true]);
  assert.deepEqual(variableBoundaries.warnings,Array.from({length:8},()=>['var','fvar','sysvar','sysfvar'].map(family=>family+' index -1 must be positive')).flat());
  console.log('Actual root/Helper variable boundaries preserve negative-index undefined/warnings, stored NaN through addition and float negative zero');
  const roundTimeConsumers=await run(`(()=>{
   const data=[1,2].map(player=>gravityActorData(specialRoot(player))),saved={time:fightHud.roundTime(),entities:[...specialRuntime.entities],definitions:data.map(value=>value.helperStates[991999]),variables:[specialRoot(1).vars[17],specialRoot(2).vars[17]]},rows=[];
   try{
    for(const value of data)value.helperStates[991999]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[]};
    for(const player of [1,2])for(const kind of ['root','helper']){
     fightHud.setMode('99');specialRuntime.entities.length=0;const root=specialRoot(player);let actor=root;if(kind==='helper'){specialRuntime.dispatch({type:'Helper',params:{stateno:991999,id:991999}},root,specialRuntime.context(root),{},root,player);actor=specialRuntime.entities.at(-1)}actor.vars[17]=1;
     const dispatch=(type,value)=>executeControllerM1({type,params:{value,redirectid:'(var(17) := 777)'}},kind==='helper'?actor:player===1?p1LifecycleBinding:p2,specialRuntime.context(actor),{owner:actor,player,schedulingApplied:true});
     dispatch('RoundTimeSet','(var(17) := var(17)+1)*60');const set=fightHud.roundTime().current,variable=actor.vars[17];dispatch('RoundTimeAdd','-30');const added=fightHud.roundTime().current,display=fightHud.remaining(),exact=fightHud.remainingExact();fightHud.step(true);const active=fightHud.roundTime().current;fightHud.step(false);const inactive=fightHud.roundTime().current;dispatch('RoundTimeSet','99999');const capped=fightHud.roundTime().current;dispatch('RoundTimeSet','0');const expired=fightHud.remaining(),timeouts=[];
     const flow=createRoundFlow({config:{startWait:0,controlWait:0},rounds:{},setTimer:mode=>fightHud.setMode(mode),reset:()=>{},initialize:()=>{},message:()=>{},lock:()=>{},fade:()=>{},stepPresentation:()=>{},introComplete:()=>true,voiceReady:()=>true,announcerReady:()=>true,sound:()=>{},fight:()=>{},life:()=>[900,1000],alive:()=>[true,true],remaining:()=>fightHud.remaining(),stopCombat:()=>{}});
     for(const type of ['RoundTimeSet','RoundTimeAdd']){flow.begin('vs','99');for(let tick=0;flow.snapshot().phase!=='fight'&&tick<128;tick++)flow.step();const before=flow.snapshot().phase;dispatch(type,type==='RoundTimeSet'?'0':'-5940');flow.step();const result=flow.snapshot();timeouts.push({type,before,phase:result.phase,reason:result.reason,winner:result.winner,state:result.round.state})}
     fightHud.setMode('infinite');actor.vars[17]=10;dispatch('RoundTimeAdd','(var(17) := 99)');rows.push({player,kind,set,variable,added,display,exact,active,inactive,capped,expired,timeouts,infinite:fightHud.roundTime(),skipped:actor.vars[17]});
    }
    return rows;
   }finally{fightHud.setMode(saved.time.maximum<0?'infinite':String(saved.time.maximum/60));fightHud.setRoundTime(saved.time.current);specialRuntime.entities.splice(0,specialRuntime.entities.length,...saved.entities);for(let index=0;index<2;index++){specialRoot(index+1).vars[17]=saved.variables[index];if(saved.definitions[index]===undefined)delete data[index].helperStates[991999];else data[index].helperStates[991999]=saved.definitions[index]}}
  })()`);
  assert.equal(roundTimeConsumers.length,4);for(const row of roundTimeConsumers){assert.equal(row.set,120);assert.equal(row.variable,2);assert.equal(row.added,90);assert.equal(row.display,2);assert.equal(row.exact,1.5);assert.equal(row.active,89);assert.equal(row.inactive,89);assert.equal(row.capped,5940);assert.equal(row.expired,0);for(const result of row.timeouts)assert.deepEqual(result,{type:result.type,before:'fight',phase:'result',reason:'time',winner:2,state:3});assert.deepEqual(row.infinite,{maximum:-1,current:-1});assert.equal(row.skipped,10)}
  console.log('Actual RoundTimeSet/Add root/normal-Helper consumers update real HUD ticks/display/countdown and skip unlimited expressions');
  const assertedCommandConsumers=await run(`(()=>{
   const data=[1,2].map(player=>gravityActorData(specialRoot(player))),saved={entities:[...specialRuntime.entities],definitions:data.map(value=>value.helperStates[991995]),roots:[playerCommandLists[1],playerCommandLists[2]],helpers:[...helperCommandLists],variables:[specialRoot(1).vars[19],specialRoot(2).vars[19]]},rows=[];
   try{
    for(const value of data)value.helperStates[991995]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[]};
    for(const player of [1,2])for(const kind of ['root','helper','shared-helper']){
     specialRuntime.entities.length=0;playerCommandLists[1]=createCommandList(1);playerCommandLists[2]=createCommandList(2);const root=specialRoot(player),caller=specialRoot(3-player);let actor=root;
     if(kind!=='root'){specialRuntime.dispatch({type:'Helper',params:{stateno:991995,id:991995,keyctrl:kind==='helper'?'1':'0'}},root,specialRuntime.context(root),{},root,player);actor=specialRuntime.entities.at(-1)}
     const list=assertedCommandList(actor),definition=list.commands.find(command=>command.steps.length===1&&command.steps[0].length===1&&/^[abxy]$/.test(command.steps[0][0].key)&&!command.steps[0][0].hold&&!command.steps[0][0].release).definition,name=definition.name,queryContext=specialRuntime.context(actor);
     caller.vars[19]=3;actor.vars[19]=99;
     const assertTime=value=>executeControllerM1({type:'AssertCommand',params:{name:JSON.stringify(name),redirectid:String(kind==='root'?player:actor.instanceId),'buffer.time':value}},3-player===1?p1LifecycleBinding:p2,specialRuntime.context(caller),{owner:caller,player:3-player,schedulingApplied:true});
     assertTime('var(19)');
     const query=()=>!!evalM1('command = '+JSON.stringify(name),queryContext),before=query(),rootBefore=commandActive(name,player),peer=commandActive(name,3-player),buffers=list.commands.filter(command=>command.definition.name===name).map(command=>command.buffer),timeline=[];
     const cleared=[];for(const time of ['0','-2']){const activeContext=specialRuntime.context(actor);assertTime(time);cleared.push(!!evalM1('command = '+JSON.stringify(name),activeContext));assertTime('var(19)')}
     for(let tick=0;tick<3;tick++){sampleCommandList(player,{},false,kind==='helper'?actor:null);timeline.push(query())}
     rows.push({player,kind,before,rootBefore,peer,buffers,cleared,timeline});
    }
    return rows;
   }finally{specialRuntime.entities.splice(0,specialRuntime.entities.length,...saved.entities);for(let index=0;index<2;index++){specialRoot(index+1).vars[19]=saved.variables[index];if(saved.definitions[index]===undefined)delete data[index].helperStates[991995];else data[index].helperStates[991995]=saved.definitions[index];if(saved.roots[index]===undefined)delete playerCommandLists[index+1];else playerCommandLists[index+1]=saved.roots[index]}helperCommandLists.clear();for(const entry of saved.helpers)helperCommandLists.set(...entry)}
  })()`);
  assert.equal(assertedCommandConsumers.length,6);for(const row of assertedCommandConsumers){assert.equal(row.before,row.kind!=='shared-helper',JSON.stringify(row));assert.equal(row.rootBefore,row.kind!=='helper');assert.equal(row.peer,false);assert.ok(row.buffers.length>0);assert.ok(row.buffers.every(value=>value===3));assert.deepEqual(row.cleared,[false,false]);assert.deepEqual(row.timeline,row.kind==='shared-helper'?[false,false,false]:[true,true,false])}
  console.log('Actual AssertCommand root/normal-Helper redirects update real command triggers, preserve opposing buffers and expire through the command sampler');
  assert.deepEqual(errors,[]);
  const actorLayerRecords=await run(`(()=>{
   const layers=[...rootSpriteLayers],saved=[current,fi,simPaused],savedPriority=p1SprPriority,savedReactionPriority=p1Reaction?.sprPriority,savedP2={...p2},helper=specialRuntime.entities.find(entity=>entity.kind==='helper'&&!entity.destroyed),savedHelper=helper?{...helper}:null;
   if(!helper)throw Error('Missing actual Helper for layer draw coverage');
   try{
    current=0;fi=0;simPaused=false;p2.anim=0;p2.elem=1;helper.anim=0;helper.elem=1;
    const rows=[];
    for(const layer of [-1,0,1,2]){
     transDrawQueue.reset();
     const caller=specialRoot(1);
     for(const [id,selectedLayer] of [[1,layer],[2,1-layer],[helper.instanceId,layer]])executeControllerM1({type:'SprPriority',params:{redirectid:String(id),layerno:String(selectedLayer),value:'4'}},findMovementActor(1),specialRuntime.context(caller),{owner:caller,player:1,schedulingApplied:true});
     draw();drawMars();drawSourceExplods();
     const entries=transDrawQueue.ordered(),first=entries.find(entry=>entry.kind==='root1'),second=entries.find(entry=>entry.kind==='root2'),helpers=entries.filter(entry=>entry.kind==='helper');
     if(!first||!second||!helpers.length)throw Error('Actual actor sprites did not reach layer draw queue');
     if(first.priority!==4||second.priority!==4||helpers.some(entry=>entry.priority!==4))throw Error('SprPriority did not reach live body priority records');
     rows.push([first.layer,second.layer,helpers.map(entry=>entry.layer)]);
    }
    return rows;
   }finally{
    rootSpriteLayers.splice(0,rootSpriteLayers.length,...layers);[current,fi,simPaused]=saved;p1SprPriority=savedPriority;if(p1Reaction)p1Reaction.sprPriority=savedReactionPriority;Object.assign(p2,savedP2);Object.assign(helper,savedHelper);transDrawQueue.reset();
   }
  })()`);
  assert.deepEqual(actorLayerRecords,[[-1,2,[-1]],[0,1,[0]],[1,0,[1]],[2,-1,[2]]]);
  console.log('Actual redirected SprPriority writes independent P1/P2/Helper layers and priorities into body draw records across four consecutive draws');
  const afterImageLayers=await run(`(()=>{
   const savedLayers=[...rootSpriteLayers],savedTrails=[...afterImages],saved=[current,fi,p2.anim,p2.elem];
   try{
    current=0;fi=0;p2.anim=0;p2.elem=1;
    for(const player of [1,2])afterImages[player-1]={remaining:10,gap:1,length:4,frames:[],transState:null};
    rootSpriteLayers.splice(0,2,-1,1);stepAfterImages();
    rootSpriteLayers.splice(0,2,1,-1);stepAfterImages();
    rootSpriteLayers.fill(0);transDrawQueue.reset();
    drawAfterImages(ctx,1);drawAfterImages(mctx,2);
    return {stored:afterImages.map(trail=>trail.frames.map(frame=>frame.layerNo)),drawn:transDrawQueue.ordered().filter(entry=>entry.kind==='afterimage').map(entry=>entry.layer)};
   }finally{rootSpriteLayers.splice(0,2,...savedLayers);afterImages.splice(0,2,...savedTrails);[current,fi,p2.anim,p2.elem]=saved;transDrawQueue.reset()}
  })()`);
  assert.deepEqual(afterImageLayers.stored,[[-1,1],[1,-1]]);
  assert.deepEqual(afterImageLayers.drawn.sort(),[-1,-1,1,1]);
  console.log('Actual afterimage capture and drawing retain historical layers independently of current root layers');
  const afterImagePriorities=await run(`(()=>{
   const savedTrail=afterImages[1],savedPriority=p2.sprPriority;
   try{
    afterImages[1]={length:2,transState:null,frames:[10,30].map(priority=>({...specialRoot(2),anim:0,elem:1,sprPriority:priority,layerNo:0}))};
    const rows=[];
    for(const priority of [20,-10,50]){
     p2.sprPriority=priority;transDrawQueue.reset();drawAfterImages(mctx,2);
     rows.push(transDrawQueue.ordered().filter(entry=>entry.kind==='afterimage').map(entry=>entry.priority));
    }
    return rows;
   }finally{afterImages[1]=savedTrail;p2.sprPriority=savedPriority;transDrawQueue.reset()}
  })()`);
  assert.deepEqual(afterImagePriorities,[[8,17],[-13,-12],[-13,-12]]);
  console.log('Actual afterimage priorities retain capture offsets, clamp below current actors and do not rebound when actor priority rises');
  const explodLayers=await run(`(()=>{
   const savedEffects=[...sourceExplods],savedLayers=[...rootSpriteLayers],helper=specialRuntime.entities.find(entity=>entity.kind==='helper'&&!entity.destroyed),savedHelperLayer=helper?.layerNo;
   if(!helper)throw Error('Missing live Helper for Explod inheritance');
   try{
    sourceExplods.length=0;rootSpriteLayers.splice(0,2,-1,1);helper.layerNo=-1;
    for(const owner of [specialRoot(1),specialRoot(2),helper]){
     for(const ontop of [undefined,'0','1']){
      const params={anim:'0',pos:'0,0',removetime:'-1'};if(ontop!==undefined)params.ontop=ontop;
      spawnSourceExplod(params,owner,owner.player);
     }
    }
    const stored=sourceExplods.map(effect=>effect.layerno);
    rootSpriteLayers.fill(0);helper.layerNo=0;transDrawQueue.reset();drawSourceExplods();
    const drawn=transDrawQueue.ordered().filter(entry=>entry.kind==='explod').map(entry=>entry.layer);
    sourceExplods.length=0;
for(const owner of [specialRoot(1),specialRoot(2),helper])spawnSourceExplod({anim:'0',pos:'0,0',removetime:'-1',sprpriority:'9',ontop:'1',under:'1',layerno:'-8',syncid:'-1',synclayer:'-3',syncparams:'0'},owner,owner.player);
    const overrides=sourceExplods.map(effect=>[effect.layerno,effect.sprpriority,effect.ontop,effect.under]);
    transDrawQueue.reset();drawSourceExplods();
    const overrideDraws=transDrawQueue.ordered().filter(entry=>entry.kind==='explod').map(entry=>[entry.layer,entry.priority,entry.ontop,entry.under]);
    const synchronization=transDrawQueue.ordered().filter(entry=>entry.kind==='explod').map(entry=>[entry.syncId,entry.syncLayer]);
    return {stored,drawn,overrides,overrideDraws,synchronization,helperId:helper.instanceId};
   }finally{sourceExplods.splice(0,sourceExplods.length,...savedEffects);rootSpriteLayers.splice(0,2,...savedLayers);helper.layerNo=savedHelperLayer;transDrawQueue.reset()}
  })()`);
  assert.deepEqual(explodLayers.stored,[-1,0,1,1,0,1,-1,0,1]);
  assert.deepEqual(explodLayers.drawn.sort(),[-1,-1,0,0,0,1,1,1,1]);
  assert.deepEqual(explodLayers.overrides,Array.from({length:3},()=>[-1,0,true,true]));
  assert.deepEqual(explodLayers.overrideDraws,Array.from({length:3},()=>[-1,0,true,true]));
  assert.deepEqual(explodLayers.synchronization,[[1,-3],[2,-3],[explodLayers.helperId,-3]]);
  console.log('Actual Root/Helper Explods inherit creation layers, preserve snapshots and respect explicit ONTOP layer overrides');
  const syncParameterRows=await run(`(()=>{
   const savedEffects=[...sourceExplods],helper=specialRuntime.entities.find(entity=>entity.kind==='helper'&&!entity.destroyed),savedP2=[p2.sprPriority,p2.facing],savedHelper=[helper.sprPriority,helper.facing];
   try{
    sourceExplods.length=0;
    for(const owner of [specialRoot(2),helper])spawnSourceExplod({anim:'0',pos:'0,0',removetime:'-1',sprpriority:'9',syncid:'-1'},owner,owner.player);
    const rows=[];
    for(const [priority,facing] of [[-5,-1],[12,1]]){
     p2.sprPriority=priority;p2.facing=facing;helper.sprPriority=priority+1;helper.facing=-facing;
     transDrawQueue.reset();drawSourceExplods();
     rows.push({effects:sourceExplods.map(effect=>[effect.sprpriority,effect.facing]),draws:transDrawQueue.ordered().filter(entry=>entry.kind==='explod').map(entry=>entry.priority)});
    }
    for(const effect of sourceExplods)effect.syncParams=false;
    p2.sprPriority=99;helper.sprPriority=98;drawSourceExplods();
    rows.push(sourceExplods.map(effect=>effect.sprpriority));return rows;
   }finally{sourceExplods.splice(0,sourceExplods.length,...savedEffects);[p2.sprPriority,p2.facing]=savedP2;[helper.sprPriority,helper.facing]=savedHelper;transDrawQueue.reset()}
  })()`);
  assert.deepEqual(syncParameterRows,[{effects:[[-5,-1],[-4,1]],draws:[-5,-4]},{effects:[[12,1],[13,-1]],draws:[12,13]},[12,13]]);
  console.log('Actual root/Helper syncparams updates priority and facing on every draw and explicit false retains the last values');
  const syncTransRows=await run(`(()=>{
   const savedEffects=[...sourceExplods],helper=specialRuntime.entities.find(entity=>entity.kind==='helper'&&!entity.destroyed),savedRoot=[rootTransStates[1],rootPalFx[1]],savedHelper=[helper.transState,helper.palFx];
   try{
    sourceExplods.length=0;rootTransStates[1]={type:'add',alpha:[128,64]};helper.transState={type:'sub',alpha:[255,255]};
    rootPalFx[1]=createPalFxRuntime();helper.palFx=createPalFxRuntime();
    for(const [runtime,amount] of [[rootPalFx[1],12],[helper.palFx,24]]){runtime.definition.time=-1;runtime.definition.add=[amount,0,0];stepPalFx(runtime)}
    for(const owner of [specialRoot(2),helper])spawnSourceExplod({anim:'0',pos:'0,0',removetime:'-1',syncid:'-1'},owner,owner.player);
    const rows=[];
    const sample=()=>{
     transDrawQueue.reset();drawSourceExplods();
     return transDrawQueue.ordered().filter(entry=>entry.kind==='explod').sort((left,right)=>left.syncId-right.syncId).map(entry=>{
      const surface=()=>{const canvas=document.createElement('canvas');canvas.width=canvas.height=1;return canvas.getContext('2d',{willReadFrequently:true})};
      const target=surface(),scratch=surface(),source=surface(),queue=createTransDrawQueue();
      target.fillStyle='rgb(100,100,100)';target.fillRect(0,0,1,1);source.fillStyle='rgb(60,30,90)';source.fillRect(0,0,1,1);
      queue.record(scratch,source.canvas,[0,0],{state:entry.state,paletteEffect:entry.paletteEffect,layer:0,opacity:1});
      renderOpaqueTransQueue(target,scratch,queue,{layer:0,shader:paletteShaderForDraw});
      return [entry.state?.type,entry.state?.alpha,entry.paletteEffect?.add,[...target.getImageData(0,0,1,1).data]];
     });
    };
    rows.push(sample());
    for(const effect of sourceExplods)effect.syncParams=false;
    rootTransStates[1].alpha[0]=1;helper.transState=null;
    rootPalFx[1].definition.add=[55,0,0];stepPalFx(rootPalFx[1]);
    rows.push(sample());return rows;
   }finally{sourceExplods.splice(0,sourceExplods.length,...savedEffects);[rootTransStates[1],rootPalFx[1]]=savedRoot;[helper.transState,helper.palFx]=savedHelper;transDrawQueue.reset()}
  })()`);
  assert.deepEqual(syncTransRows,[[['add',[128,64],[12,0,0],[61,40,70,255]],['sub',[255,255],[24,0,0],[16,70,10,255]]],[['add',[128,64],[55,0,0],[83,40,70,255]],['sub',[255,255],[24,0,0],[16,70,10,255]]]]);
  console.log('Actual root/Helper synchronization copies Trans/alpha snapshots and retains the native shared PalFX reference when synchronization is disabled');
  const syncTransform=await run(`(()=>{
   const savedEffects=[...sourceExplods],helper=specialRuntime.entities.find(entity=>entity.kind==='helper'&&!entity.destroyed),saved=[helper.sizeDefinition,helper.angleState,helper.facing];
   try{
    sourceExplods.length=0;helper.facing=1;helper.sizeDefinition={...helper.sizeDefinition,xscale:1,yscale:1};helper.angleState=createAngleState();
    spawnSourceExplod({anim:'0',pos:'0,0',removetime:'-1',syncid:'-1'},helper,helper.player);
    const capture=()=>{transDrawQueue.reset();drawSourceExplods();return transDrawQueue.ordered().find(entry=>entry.kind==='explod').matrix.slice(0,4)};
    const baseline=capture();helper.sizeDefinition.xscale=2;helper.sizeDefinition.yscale=3;
    Object.assign(helper.angleState,{enabled:true,value:90,scale:[1.5,.5],pivot:[8,9]});
    const rotated=capture(),effect=sourceExplods[0],snapshot={scale:[...effect.scale],angle:effect.angleState.value,pivot:[...effect.angleState.pivot]};
    effect.syncParams=false;helper.angleState.value=0;helper.sizeDefinition.xscale=9;
    const retained=capture();return {snapshot,rotated:rotated.map((value,index)=>value/(index%2===0?baseline[0]:baseline[3])),retained:retained.map((value,index)=>value/(index%2===0?baseline[0]:baseline[3]))};
   }finally{sourceExplods.splice(0,sourceExplods.length,...savedEffects);[helper.sizeDefinition,helper.angleState,helper.facing]=saved;transDrawQueue.reset()}
  })()`);
  assert.deepEqual(syncTransform.snapshot,{scale:[3,1.5],angle:90,pivot:[0,0]});
  for(const row of [syncTransform.rotated,syncTransform.retained])for(const [index,expected] of [0,-1.5,3,0].entries())assert.ok(Math.abs(row[index]-expected)<1e-6,JSON.stringify(row));
  console.log('Actual synchronized Helper size and AngleDraw affect effect matrices once, omit actor pivot and retain copied transforms when disabled');
  const bodySynchronization=await run(`(()=>{
   const savedEffects=[...sourceExplods],saved=[current,fi,simPaused,p2.anim,p2.elem],helper=specialRuntime.entities.find(entity=>entity.kind==='helper'&&!entity.destroyed),savedHelper=[helper.anim,helper.elem];
   try{
    sourceExplods.length=0;current=0;fi=0;simPaused=false;p2.anim=0;p2.elem=1;helper.anim=0;helper.elem=1;
    for(const owner of [specialRoot(1),specialRoot(2),helper])spawnSourceExplod({anim:'0',pos:'0,0',removetime:'-1',syncid:'-1',syncparams:'0'},owner,owner.player);
    const capture=()=>{transDrawQueue.reset();draw();drawMars();drawSourceExplods();return transDrawQueue.ordered().filter(entry=>entry.actorId>0).sort((left,right)=>left.actorId-right.actorId).map(entry=>[entry.actorId,entry.syncId,entry.syncLayer])};
    const first=capture();sourceExplods.length=0;return {first,retained:capture(),helperId:helper.instanceId};
   }finally{sourceExplods.splice(0,sourceExplods.length,...savedEffects);[current,fi,simPaused,p2.anim,p2.elem]=saved;[helper.anim,helper.elem]=savedHelper;transDrawQueue.reset()}
  })()`);
  const expectedBodySync=[[1,1,0],[2,2,0],[bodySynchronization.helperId,bodySynchronization.helperId,0]];
  assert.deepEqual(bodySynchronization.first,expectedBodySync);assert.deepEqual(bodySynchronization.retained,expectedBodySync);
  console.log('Actual Root/Helper bodies join synchronization at layer zero even with syncparams disabled and retain registration after effect removal');
  const destroyedSynchronization=await run(`(()=>{
   const savedEffects=[...sourceExplods],helper=specialRuntime.entities.find(entity=>entity.kind==='helper'&&!entity.destroyed),saved=[helper.anim,helper.elem,helper.destroyed];
   try{
    sourceExplods.length=0;helper.anim=0;helper.elem=1;
    spawnSourceExplod({anim:'0',pos:'0,0',removetime:'-1',syncid:'-1'},helper,helper.player);
    transDrawQueue.reset();drawSourceExplods();
    const before=transDrawQueue.ordered().find(entry=>entry.actorId===helper.instanceId)?.syncId;
    const retained=sourceExplods[0].sprpriority;helper.destroyed=true;transDrawQueue.reset();drawSourceExplods();
    const bodies=transDrawQueue.ordered().filter(entry=>entry.actorId===helper.instanceId).length;
    const source=document.createElement('canvas');source.width=source.height=1;transDrawQueue.record(ctx,source,[0,0],{actorId:helper.instanceId,kind:'probe'});
    const after=transDrawQueue.ordered().find(entry=>entry.kind==='probe').syncId;
    return {registered:before===helper.instanceId,bodies,after,retained:sourceExplods[0].sprpriority===retained};
   }finally{sourceExplods.splice(0,sourceExplods.length,...savedEffects);[helper.anim,helper.elem,helper.destroyed]=saved;transDrawQueue.reset()}
  })()`);
  assert.deepEqual(destroyedSynchronization,{registered:true,bodies:0,after:0,retained:true});
  console.log('Destroyed actual Helpers leave no body draw or sync registration while surviving Explods retain their last synchronized values');
  const layerPixels=await run(`(()=>{
   const canvas=()=>{const surface=document.createElement('canvas');surface.width=surface.height=1;return surface.getContext('2d',{willReadFrequently:true})},target=canvas(),scratch=canvas(),savedBackgrounds=[...stageBackgrounds.entries],savedPalette=[bgPalFx.enabled,allPalFx.enabled],filter=filterCanvas.getContext('2d'),filterCopy=document.createElement('canvas');filterCopy.width=filterCanvas.width;filterCopy.height=filterCanvas.height;filterCopy.getContext('2d').drawImage(filterCanvas,0,0);
   const source=color=>{const context=canvas();context.fillStyle=color;context.fillRect(0,0,1,1);return context.canvas},rows=[];
   try{
    bgPalFx.enabled=false;allPalFx.enabled=false;filter.save();filter.setTransform(1,0,0,1,0,0);filter.clearRect(0,0,filterCanvas.width,filterCanvas.height);filter.restore();
    const cases=[{foreground:true,sprites:[['lime',{layer:0,priority:999}]]},{foreground:true,sprites:[['white',{ontop:true,priority:-999}]]},{foreground:true,sprites:[['lime',{layer:-1}]]},{foreground:true,sprites:[['magenta',{layer:2}]]},{foreground:false,sprites:[['lime',{layer:0,under:true,priority:999}],['yellow',{layer:0,priority:-999}]]},{foreground:false,sprites:[['white',{layer:-1}]]},{foreground:true,sprites:[['white',{layer:1,under:true}]]},{background:false,foreground:false,stage:'transparent',sprites:[['white',{layer:-1}]]},{background:false,foreground:false,stage:'blue',sprites:[['white',{layer:-1}]]},{background:false,foreground:false,stage:'blue',sprites:[['lime',{layer:0}]]}];
    cases.push({foreground:false,sprites:[['white',{layer:1,ontop:true,priority:0}],['lime',{layer:1,priority:5}]]},{foreground:false,sprites:[['red',{layer:1,priority:5}],['lime',{layer:1,priority:5}]]});
    cases.push({foreground:false,sprites:[['white',{layer:1,syncId:7,syncLayer:-1}],['yellow',{layer:1}],['red',{layer:1,syncId:7,syncLayer:2}]]});
    cases.push({foreground:false,sprites:[['white',{kind:'reflection',layer:-1}]]},{foreground:false,sprites:[['lime',{layer:0,under:true,priority:999}],['white',{kind:'reflection',layer:0,priority:-999}]]},{foreground:false,sprites:[['white',{kind:'reflection',layer:0,priority:999}],['lime',{layer:0,priority:-999}]]},{foreground:true,sprites:[['white',{kind:'reflection',layer:0}]]});
    for(const test of cases){
     stageBackgrounds.replace([{layer:0,visible:test.background!==false,draw:context=>{context.fillStyle='red';context.fillRect(0,0,1,1)}},{layer:1,visible:test.foreground,draw:context=>{context.fillStyle='blue';context.fillRect(0,0,1,1)}}]);
     transDrawQueue.reset();scratch.setTransform(1,0,0,1,0,0);scratch.globalAlpha=1;scratch.globalCompositeOperation='source-over';
     for(const [color,settings] of test.sprites)transDrawQueue.record(scratch,source(color),[0,0],settings);
     renderBattleTransCandidate(target,scratch,test.stage?source(test.stage):r.domElement);rows.push([...target.getImageData(0,0,1,1).data]);
    }
   }finally{
    stageBackgrounds.entries.splice(0,stageBackgrounds.entries.length,...savedBackgrounds);[bgPalFx.enabled,allPalFx.enabled]=savedPalette;filter.save();filter.setTransform(1,0,0,1,0,0);filter.clearRect(0,0,filterCanvas.width,filterCanvas.height);filter.drawImage(filterCopy,0,0);filter.restore();transDrawQueue.reset();
   }
   return rows;
  })()`);
  assert.deepEqual(layerPixels,[[0,0,255,255],[255,255,255,255],[0,0,255,255],[0,0,255,255],[255,255,0,255],[255,0,0,255],[255,255,255,255],[255,255,255,255],[0,0,255,255],[0,255,0,255],[0,255,0,255],[255,0,0,255],[255,0,0,255],[255,0,0,255],[255,255,255,255],[0,255,0,255],[0,0,255,255]]);
  console.log('Actual battle compositor pixels verify foreground occlusion, ontop layer one, exact layer selection and zero-layer under ordering');
  const stageReflectionLayers=await run(`(()=>{
   const savedStage=activeStage,savedVisuals=stageVisuals,savedLayers=[...rootSpriteLayers],saved=[current,fi,simPaused,p2.anim,p2.elem],rows=[];
   if(!stageVisuals)throw Error('Training reflection assets not ready');
   try{
    activeStage='training';current=0;fi=0;simPaused=false;p2.anim=0;p2.elem=1;rootSpriteLayers.splice(0,2,1,2);
    for(const layerno of [-5,0,7]){
     stageVisuals={...savedVisuals,reflection:{...savedVisuals.reflection,layerno}};transDrawQueue.reset();drawSourceExplods();
     rows.push(transDrawQueue.ordered().filter(entry=>entry.phase==='reflection').map(entry=>entry.layer));
    }
    const capture=xscale=>{stageVisuals={...savedVisuals,reflection:{...savedVisuals.reflection,layerno:0,xscale}};transDrawQueue.reset();drawSourceExplods();return transDrawQueue.ordered().filter(entry=>entry.phase==='reflection').map(entry=>entry.matrix.slice(0,4))};
    const baseline=capture(1),scaled=[capture(-2),capture(0)];return {layers:rows,baseline,scaled};
   }finally{activeStage=savedStage;stageVisuals=savedVisuals;rootSpriteLayers.splice(0,2,...savedLayers);[current,fi,simPaused,p2.anim,p2.elem]=saved;transDrawQueue.reset()}
  })()`);
  assert.deepEqual(stageReflectionLayers.layers,[[-1,-1,-1],[0,0,0],[0,0,0]]);
  for(const [index,factor] of [-2,0].entries())for(const [actor,matrix] of stageReflectionLayers.scaled[index].entries())matrix.forEach((value,axis)=>assert.ok(Math.abs(value-stageReflectionLayers.baseline[actor][axis]*(axis%2===0?factor:1))<1e-6));
  console.log('Actual stage reflection layer selection stays independent of body layers and normalizes negative/nonnegative stage passes');
  const clippedPixels=await run(`(()=>{
   const surface=()=>{const canvas=document.createElement('canvas');canvas.width=3;canvas.height=1;return canvas.getContext('2d',{willReadFrequently:true})};
   const immediate=surface(),scratch=surface(),resolved=surface(),source=surface(),clip={x:1,y:0,width:1,height:1};
   source.fillStyle='white';source.fillRect(0,0,3,1);immediate.fillStyle='black';immediate.fillRect(0,0,3,1);
   transDrawQueue.reset();immediate.translate(1,0);drawTransSprite(immediate,source.canvas,[0,0],{clip,layer:0,kind:'window-fixture'});
   const first=[...immediate.getImageData(0,0,3,1).data];clip.width=3;
   resolved.fillStyle='black';resolved.fillRect(0,0,3,1);renderOpaqueTransQueue(resolved,scratch,transDrawQueue,{layer:0});
   const second=[...resolved.getImageData(0,0,3,1).data];transDrawQueue.reset();return [first,second];
  })()`);
  assert.deepEqual(clippedPixels,Array.from({length:2},()=>[0,0,0,255,255,255,255,255,0,0,0,255]));
  console.log('Actual immediate and resolved sprite drawing preserve absolute clip windows independently of sprite transforms and later rectangle mutation');
  const actorWindows=await run(`(()=>{
   const savedEffects=[...sourceExplods],helper=specialRuntime.entities.find(entity=>entity.kind==='helper'&&!entity.destroyed),profiles=[...new Set(battleCharacters.map(character=>characterProfiles.get(character).battle))],savedCoordinates=profiles.map(profile=>profile.coordinateSystem),rows=[];
   const width=visualViewport?.width||innerWidth,height=visualViewport?.height||innerHeight,fit=Math.min(width/1280,height/720),left=(width-1280*fit)/2,top=(height-720*fit)/2;
   try{
    for(const localcoord of [320,1280]){
     for(const profile of profiles)profile.coordinateSystem={...profile.coordinateSystem,localcoord:[localcoord,720],webWorldWidth:1280};
     for(const actor of [specialRoot(1),specialRoot(2),helper])for(const facing of [-1,1])for(const relativeFacing of [-1,1])for(const vfacing of [-1,1])for(const scale of ['1,1','3,4']){
      sourceExplods.length=0;const owner={...actor,facing};
      spawnSourceExplod({anim:'0',pos:'0,0',removetime:'-1',window:'-5,-7,15,9',facing:String(relativeFacing),vfacing:String(vfacing),scale},owner,owner.player);
      transDrawQueue.reset();drawSourceExplods();const effect=sourceExplods[0],entry=transDrawQueue.ordered().find(entry=>entry.kind==='explod'),unit=fit*cameraZoom*1280/localcoord;
      const origin=[left+worldScreenX(effect.x)*fit,top+worldScreenY(effect.y)*fit];
      const trueFacing=facing*relativeFacing;
      const expected={x:Math.trunc((origin[0]+(trueFacing<0?-15:-5)*unit)*devicePixelRatio)|0,y:Math.trunc((origin[1]+(vfacing<0?-9:-7)*unit)*devicePixelRatio)|0,width:Math.trunc(20*unit*devicePixelRatio)|0,height:Math.trunc(16*unit*devicePixelRatio)|0};
      rows.push({window:effect.window,clip:entry.clip,expected,vfacing:effect.vfacing,expectedFacing:vfacing,verticalSign:Math.sign(entry.matrix[3]),relative:effect.relativeFacing,expectedRelative:relativeFacing,horizontalSign:Math.sign(entry.matrix[0]),expectedHorizontal:trueFacing});
     }
    }
    return rows;
   }finally{sourceExplods.splice(0,sourceExplods.length,...savedEffects);profiles.forEach((profile,index)=>profile.coordinateSystem=savedCoordinates[index]);transDrawQueue.reset()}
  })()`);
  assert.equal(actorWindows.length,96);
  for(const row of actorWindows){assert.deepEqual(row.window,[-5,-7,15,9]);assert.deepEqual(row.clip,row.expected);assert.equal(row.vfacing,row.expectedFacing);assert.equal(row.verticalSign,row.expectedFacing);assert.equal(row.relative,row.expectedRelative);assert.equal(row.horizontalSign,row.expectedHorizontal);}
  console.log('Actual P1/P2/Helper Explod windows and vertical matrices preserve both facings and 320/1280 coordinate ratios independently of sprite scale');
  const actorAngles=await run(`(()=>{
   const savedEffects=[...sourceExplods],helper=specialRuntime.entities.find(entity=>entity.kind==='helper'&&!entity.destroyed),rows=[];
   try{
    for(const actor of [specialRoot(1),specialRoot(2),helper])for(const facing of [-1,1])for(const vfacing of [-1,1]){
     const owner={...actor,facing:1};
     const capture=angles=>{sourceExplods.length=0;spawnSourceExplod({anim:'0',pos:'0,0',removetime:'-1',facing:String(facing),vfacing:String(vfacing),...angles},owner,owner.player);transDrawQueue.reset();drawSourceExplods();return {matrix:transDrawQueue.ordered().find(entry=>entry.kind==='explod').matrix.slice(0,4),stored:[sourceExplods[0].angleState.value,sourceExplods[0].angleState.xangle,sourceExplods[0].angleState.yangle]}};
     const baseline=capture({angle:'0'}).matrix,unitX=baseline[0]/facing,unitY=baseline[3]/vfacing,sign=facing===vfacing?1:-1;
     for(const [parameters,expected,stored] of [[{angle:'90'},[0,-vfacing*sign,facing*sign,0],[90,0,0]],[{xangle:'60'},[facing,0,0,vfacing*.5],[0,60,0]],[{yangle:'60'},[facing*.5,0,0,vfacing],[0,0,60]]]){
      const result=capture(parameters);rows.push({matrix:result.matrix.map((value,index)=>value/(index%2===0?unitX:unitY)),expected,stored:result.stored,expectedStored:stored});
     }
    }
    return rows;
   }finally{sourceExplods.splice(0,sourceExplods.length,...savedEffects);transDrawQueue.reset()}
  })()`);
  assert.equal(actorAngles.length,36);
  for(const row of actorAngles){assert.deepEqual(row.stored,row.expectedStored);row.matrix.forEach((value,index)=>assert.ok(Math.abs(value-row.expected[index])<1e-6,JSON.stringify(row)));}
  console.log('Actual P1/P2/Helper Explod angle/X/Y parameters reach orthographic drawing across both reflection axes without mutating stored angles');
  const actorShears=await run(`(()=>{
   const savedEffects=[...sourceExplods],savedZoom=cameraZoom,helper=specialRuntime.entities.find(entity=>entity.kind==='helper'&&!entity.destroyed),rows=[];
   try{
    for(const actor of [specialRoot(1),specialRoot(2),helper])for(const zoom of [.75,1.25])for(const angle of [0,90])for(const facing of [-1,1])for(const vfacing of [-1,1])for(const scale of ['1,1','2,3']){
     cameraZoom=zoom;const owner={...actor,facing:1};
     const capture=(shear,rotation=angle)=>{sourceExplods.length=0;spawnSourceExplod({anim:'0',pos:'0,0',removetime:'-1',angle:String(rotation),xshear:String(shear),facing:String(facing),vfacing:String(vfacing),scale},owner,owner.player);transDrawQueue.reset();drawSourceExplods();return transDrawQueue.ordered().find(entry=>entry.kind==='explod').matrix};
     const verticalScale=capture(0,0)[3],baseline=capture(0),frame=framesFor(0,owner.player)[0],sprite=spriteFor(frame);
     for(const shear of [-.5,.5]){
      const actual=capture(shear),coefficient=shear*zoom,expected=[...baseline];
      expected[0]+=(angle===0?-coefficient:coefficient)*baseline[1];expected[2]+=(angle===0?-coefficient:coefficient)*baseline[3];
      if(angle!==0)expected[4]-=coefficient*verticalScale*(sprite.h-sprite.axisY);
      rows.push({actual,expected,stored:sourceExplods[0].xshear,shear});
     }
    }
    return rows;
   }finally{sourceExplods.splice(0,sourceExplods.length,...savedEffects);cameraZoom=savedZoom;transDrawQueue.reset()}
  })()`);
  assert.equal(actorShears.length,192);
  for(const row of actorShears){assert.equal(row.stored,row.shear);row.actual.forEach((value,index)=>assert.ok(Math.abs(value-row.expected[index])<1e-5,JSON.stringify(row)));}
  console.log('Actual P1/P2/Helper Explod shears reach unrotated and rotated matrices with native-style axis compensation at two camera zooms');
  const screenWindows=await run(`(()=>{
   const savedEffects=[...sourceExplods],savedZoom=cameraZoom,helper=specialRuntime.entities.find(entity=>entity.kind==='helper'&&!entity.destroyed),rows=[];
   const width=visualViewport?.width||innerWidth,height=visualViewport?.height||innerHeight,fit=Math.min(width/1280,height/720),left=(width-1280*fit)/2,top=(height-720*fit)/2;
   try{
    for(const actor of [specialRoot(1),specialRoot(2),helper])for(const postype of ['left','right'])for(const zoom of [.5,2])for(const facing of [-1,1])for(const vfacing of [-1,1]){
     cameraZoom=zoom;sourceExplods.length=0;
     spawnSourceExplod({anim:'0',pos:'50,100',postype,removetime:'-1',window:'1,2,11,22',facing:String(facing),vfacing:String(vfacing),scale:'3,4'},actor,actor.player);
     transDrawQueue.reset();drawSourceExplods();const effect=sourceExplods[0],entry=transDrawQueue.ordered().find(entry=>entry.kind==='explod'),data=characterProfiles.get(battleCharacters[actor.player-1]).battle,unit=fit*1280/data.coordinateSystem.localcoord[0];
     const expected={x:Math.trunc((left+((postype==='right'?1280:0)+50)*fit+(facing<0?-11:1)*unit)*devicePixelRatio)|0,y:Math.trunc((top+100*fit+(vfacing<0?-22:2)*unit)*devicePixelRatio)|0,width:Math.trunc(10*unit*devicePixelRatio)|0,height:Math.trunc(20*unit*devicePixelRatio)|0};
     rows.push({screen:effect.screen,clip:entry.clip,expected,horizontal:Math.sign(entry.matrix[0]),vertical:Math.sign(entry.matrix[3]),facing,vfacing});
    }
    return rows;
   }finally{sourceExplods.splice(0,sourceExplods.length,...savedEffects);cameraZoom=savedZoom;transDrawQueue.reset()}
  })()`);
  assert.equal(screenWindows.length,48);
  for(const row of screenWindows){assert.equal(row.screen,true);assert.deepEqual(row.clip,row.expected);assert.equal(row.horizontal,row.facing);assert.equal(row.vertical,row.vfacing);}
  console.log('Actual left/right screen Explod windows preserve both reflection signs and ignore stage camera zoom');
  const transformedActors=await run(`(()=>{
   const helper=specialRuntime.entities.find(entity=>entity.kind==='helper'&&!entity.destroyed),savedWindows=rootSpriteWindows.map(window=>[...window]),savedHelper=[helper.window,helper.anim,helper.elem],saved=[current,fi,simPaused,p2.anim,p2.elem],rows=[];
   try{
    current=0;fi=0;simPaused=false;p2.anim=0;p2.elem=1;helper.anim=0;helper.elem=1;
    for(const target of [specialRoot(1),specialRoot(2),helper]){
     const id=target.kind==='helper'?target.instanceId:target.player,caller=specialRoot(id===1?2:1),savedVariables=[caller.vars[8],target.vars[8]];
     try{
      caller.vars[8]=5;target.vars[8]=99;
      executeControllerM1({type:'TransformSprite',params:{redirectid:String(id),window:Array(4).fill('Var(8):=Var(8)+1').join(',')}},caller,specialRuntime.context(caller),{owner:caller,player:caller.player,schedulingApplied:true});
      const stored=target.kind==='helper'?helper.window:rootSpriteWindows[target.player-1];
      transDrawQueue.reset();draw();drawMars();drawSourceExplods();
      const record=transDrawQueue.ordered().find(entry=>entry.actorId===id);
      rows.push({stored:[...stored],caller:caller.vars[8],target:target.vars[8],clipped:!!record?.clip});
     }finally{[caller.vars[8],target.vars[8]]=savedVariables}
    }
    resetRootDrawOffsets();return {rows,reset:rootSpriteWindows.map(window=>[...window])};
   }finally{rootSpriteWindows.forEach((window,index)=>window.splice(0,4,...savedWindows[index]));[helper.window,helper.anim,helper.elem]=savedHelper;[current,fi,simPaused,p2.anim,p2.elem]=saved;transDrawQueue.reset()}
  })()`);
  assert.deepEqual(transformedActors.rows,Array.from({length:3},()=>({stored:[6,7,8,9],caller:9,target:99,clipped:true})));
  assert.deepEqual(transformedActors.reset,[[0,0,0,0],[0,0,0,0]]);
  console.log('Actual TransformSprite redirects retain original caller side effects and reach both root and Helper clip records; root frame reset clears windows');
  const synchronizedWindows=await run(`(()=>{
   const savedEffects=[...sourceExplods],savedWindows=rootSpriteWindows.map(window=>[...window]),savedShears=[...rootSpriteShears],helper=specialRuntime.entities.find(entity=>entity.kind==='helper'&&!entity.destroyed),savedHelperWindow=helper.window?[...helper.window]:helper.window,savedHelperShear=helper.xshear;
   try{
    sourceExplods.length=0;const caller=specialRoot(1);
    for(const [target,window,shear] of [[specialRoot(2),'-20,-40,20,0',-.25],[helper,'-10,-10,10,10',.5]]){
     executeControllerM1({type:'TransformSprite',params:{redirectid:String(target.kind==='helper'?target.instanceId:2),window,xshear:String(shear)}},caller,specialRuntime.context(caller),{owner:caller,player:1,schedulingApplied:true});
     spawnSourceExplod({anim:'0',pos:'0,0',removetime:'-1',syncid:'-1'},target,target.player);
    }
    const capture=()=>{transDrawQueue.reset();drawSourceExplods();const records=transDrawQueue.ordered().filter(entry=>entry.kind==='explod').sort((left,right)=>left.syncId-right.syncId);return {windows:sourceExplods.map(effect=>[...effect.window]),shears:sourceExplods.map(effect=>effect.xshear),clips:records.map(entry=>[entry.clip.width,entry.clip.height]),matrices:records.map(entry=>entry.matrix)}};
    const first=capture();for(const effect of sourceExplods)effect.syncParams=false;
    rootSpriteWindows[1].fill(0);helper.window.fill(0);rootSpriteShears[1]=0;helper.xshear=0;const retained=capture();
    for(const effect of sourceExplods)effect.xshear=0;const zero=capture();return {first,retained,zeroMatrices:zero.matrices};
   }finally{sourceExplods.splice(0,sourceExplods.length,...savedEffects);rootSpriteWindows.forEach((window,index)=>window.splice(0,4,...savedWindows[index]));rootSpriteShears.splice(0,2,...savedShears);helper.window=savedHelperWindow;helper.xshear=savedHelperShear;transDrawQueue.reset()}
  })()`);
  assert.deepEqual(synchronizedWindows.first.windows,[[-20,-40,20,0],[-10,-10,10,10]]);
  assert.deepEqual(synchronizedWindows.retained,synchronizedWindows.first);
  assert.deepEqual(synchronizedWindows.first.shears,[-.25,.5]);
  synchronizedWindows.first.matrices.forEach((matrix,index)=>assert.notDeepEqual(matrix,synchronizedWindows.zeroMatrices[index]));
  for(const clip of synchronizedWindows.first.clips)assert.ok(clip[0]>0&&clip[1]>0);
  console.log('Actual TransformSprite root/Helper windows propagate to synchronized Explod clips and remain independent after syncparams is disabled');
  const rootWindowPhases=await run(`(()=>{
   const windows=rootSpriteWindows.map(window=>[...window]),offsets=rootDrawOffsets.map(offset=>[...offset]),pauses={normal:[...specialRuntime.pauses.normal],super:[...specialRuntime.pauses.super]},moveTimes=[1,2].map(player=>['root'+player,specialRuntime.moveTimes.has('root'+player),specialRuntime.moveTimes.get('root'+player)]),hitPause=[p1HitPause,p2.attackPause];
   const reflections=rootReflectionOverrides.map(value=>({...value,offset:[...value.offset]})),snapshot=()=>rootReflectionOverrides.map(value=>({...value,offset:[...value.offset]}));
   try{
    specialRuntime.pauses.normal.fill(null);specialRuntime.pauses.super.fill(null);p1HitPause=2;p2.attackPause=2;
    rootReflectionOverrides.forEach(value=>Object.assign(value,{intensity:150,color:[1,2,3],xscale:2,yscale:3,offset:[4,5]}));
    rootSpriteWindows.forEach(window=>window.splice(0,4,1,2,3,4));resetRootDrawOffsets();const local=rootSpriteWindows.map(window=>[...window]);
    const localReflections=snapshot();
    specialRuntime.pauses.normal[0]={remaining:10,movetime:0,player:1,created:combatTraceTick-1};
    for(const player of [1,2])specialRuntime.moveTimes.set('root'+player,{normal:0});
    rootReflectionOverrides.forEach(value=>Object.assign(value,{intensity:201,color:[4,5,6],xscale:4,yscale:5,offset:[6,7]}));
    rootSpriteWindows.forEach(window=>window.splice(0,4,5,6,7,8));resetRootDrawOffsets();const global=rootSpriteWindows.map(window=>[...window]);
    const globalReflections=snapshot();
    specialRuntime.pauses.normal.fill(null);resetRootDrawOffsets();return {local,global,resumed:rootSpriteWindows.map(window=>[...window]),reflections:{local:localReflections,global:globalReflections,resumed:snapshot()}};
   }finally{rootReflectionOverrides.splice(0,2,...reflections);rootSpriteWindows.forEach((window,index)=>window.splice(0,4,...windows[index]));rootDrawOffsets.splice(0,2,...offsets);specialRuntime.pauses.normal.splice(0,2,...pauses.normal);specialRuntime.pauses.super.splice(0,2,...pauses.super);for(const [key,had,value] of moveTimes){if(had)specialRuntime.moveTimes.set(key,value);else specialRuntime.moveTimes.delete(key)}[p1HitPause,p2.attackPause]=hitPause}
  })()`);
  const emptyReflection=()=>({intensity:-1,color:[-1,-1,-1],xscale:0,yscale:0,offset:[0,0],window:[0,0,0,0],keeptransform:true,angle:0,xangle:0,yangle:0});
  assert.deepEqual(rootWindowPhases,{local:[[0,0,0,0],[0,0,0,0]],global:[[5,6,7,8],[5,6,7,8]],resumed:[[0,0,0,0],[0,0,0,0]],reflections:{local:Array.from({length:2},emptyReflection),global:Array.from({length:2},()=>({...emptyReflection(),intensity:201,color:[4,5,6],xscale:4,yscale:5,offset:[6,7]})),resumed:Array.from({length:2},emptyReflection)}});
  console.log('Actual P1/P2 window preparation clears during local hitpause, retains through blocking global pause and clears after resuming');
  const transformedShears=await run(`(()=>{
   const helper=specialRuntime.entities.find(entity=>entity.kind==='helper'&&!entity.destroyed),savedShears=[...rootSpriteShears],savedAngles=rootAngleStates.map(snapshotAngleState),savedHelper=[helper.angleState,helper.xshear,helper.anim,helper.elem,helper.facing],saved=[current,fi,simPaused,p2.anim,p2.elem,p1Facing,p2.facing],rows=[];
   try{
    current=0;fi=0;simPaused=false;p2.anim=0;p2.elem=1;p1Facing=1;p2.facing=1;helper.anim=0;helper.elem=1;helper.facing=1;
    for(const target of [specialRoot(1),specialRoot(2),helper])for(const angle of [0,90]){
     const id=target.kind==='helper'?target.instanceId:target.player,state=target.kind==='helper'?(helper.angleState=createAngleState()):rootAngleStates[target.player-1];
     Object.assign(state,createAngleState(),{enabled:angle!==0,value:angle});
     const capture=value=>{const caller=specialRoot(id===1?2:1);executeControllerM1({type:'TransformSprite',params:{redirectid:String(id),xshear:String(value)}},caller,specialRuntime.context(caller),{owner:caller,player:caller.player,schedulingApplied:true});transDrawQueue.reset();draw();drawMars();drawSourceExplods();return transDrawQueue.ordered().find(entry=>entry.actorId===id).matrix.slice(0,4)};
     const baseline=capture(0);
     for(const shear of [-.5,.5]){const matrix=capture(shear),coefficient=shear*cameraZoom*(angle===0?-1:1),expected=[...baseline];expected[0]+=coefficient*baseline[1];expected[2]+=coefficient*baseline[3];rows.push({matrix,expected,shear,stored:target.kind==='helper'?helper.xshear:rootSpriteShears[target.player-1]})}
    }
    return rows;
   }finally{rootSpriteShears.splice(0,2,...savedShears);rootAngleStates.forEach((angle,index)=>Object.assign(angle,savedAngles[index]));[helper.angleState,helper.xshear,helper.anim,helper.elem,helper.facing]=savedHelper;[current,fi,simPaused,p2.anim,p2.elem,p1Facing,p2.facing]=saved;transDrawQueue.reset()}
  })()`);
  assert.equal(transformedShears.length,12);
  for(const row of transformedShears){assert.equal(row.stored,row.shear);row.matrix.forEach((value,index)=>assert.ok(Math.abs(value-row.expected[index])<1e-6,JSON.stringify(row)));}
  console.log('Actual redirected TransformSprite xshear reaches P1/P2/Helper body matrices with opposite native rotated and unrotated signs');
  const redirectedWindowCoordinates=await run(`(()=>{
   const helper=specialRuntime.entities.find(entity=>entity.kind==='helper'&&!entity.destroyed),profiles=battleCharacters.map(character=>characterProfiles.get(character).battle),coordinates=profiles.map(profile=>profile.coordinateSystem),savedWindows=rootSpriteWindows.map(window=>[...window]),savedHelper=[helper.localCoord,helper.window?[...helper.window]:helper.window],rows=[];
   try{
    for(const widths of [[320,1280],[1280,320],[640,640]]){
     profiles.forEach((profile,index)=>profile.coordinateSystem={...coordinates[index],localcoord:[widths[index],720],webWorldWidth:index===0?1280:640});helper.localCoord=640;
     const actors=[specialRoot(1),specialRoot(2),helper];
     for(const caller of actors)for(const target of actors){
      const id=target.kind==='helper'?target.instanceId:target.player;
      executeControllerM1({type:'TransformSprite',params:{redirectid:String(id),window:'1,2,3,4'}},caller,specialRuntime.context(caller),{owner:caller,player:caller.player,schedulingApplied:true});
      const callerCoord=caller.kind==='helper'?640:widths[caller.player-1],targetCoord=target.kind==='helper'?640:widths[target.player-1],ratio=Math.fround(targetCoord/callerCoord);
      rows.push({actual:[...(target.kind==='helper'?helper.window:rootSpriteWindows[target.player-1])],expected:[1,2,3,4].map(value=>Math.fround(value*ratio))});
     }
    }
    return rows;
   }finally{profiles.forEach((profile,index)=>profile.coordinateSystem=coordinates[index]);rootSpriteWindows.forEach((window,index)=>window.splice(0,4,...savedWindows[index]));[helper.localCoord,helper.window]=savedHelper;transDrawQueue.reset()}
  })()`);
  assert.equal(redirectedWindowCoordinates.length,27);
  for(const row of redirectedWindowCoordinates)assert.deepEqual(row.actual,row.expected);
  console.log('Actual TransformSprite root/Helper redirects use native local-coordinate ratios independently of WEB rendering width');
  const preparedSynchronization=await run(`(async()=>{
   transDrawQueue.reset();transDrawQueue.enableActorSync(1);transDrawQueue.enableActorSync(2);
   const source=document.createElement('canvas');source.width=source.height=1;
   for(const actorId of [1,2])transDrawQueue.record(ctx,source,[0,0],{actorId});
   const before=transDrawQueue.ordered().map(entry=>entry.syncId);
   await prepareCharacters([...battleCharacters]);
   const after=transDrawQueue.ordered().map(entry=>entry.syncId);
   transDrawQueue.reset();for(const actorId of [1,2])transDrawQueue.record(ctx,source,[0,0],{actorId});
   const next=transDrawQueue.ordered().map(entry=>entry.syncId);transDrawQueue.reset();return {before,after,next};
  })()`);
  assert.deepEqual(preparedSynchronization,{before:[1,2],after:[0,0],next:[0,0]});
  console.log('Actual character preparation clears prior body sync registrations for queued and subsequent root draws');
  const priorityActivation=await run(`(()=>{
   const savedHome=gameShell.isHome,savedVisibility=transOutputCanvas.style.visibility,savedEntities=[...specialRuntime.entities],savedEffects=[...sourceExplods],savedTrails=[...afterImages],savedTrans=[...rootTransStates],savedPalettes=[...rootPalFx],savedBackgrounds=[...stageBackgrounds.entries],savedFlags=[bgPalFx.enabled,allPalFx.enabled];
   try{
    gameShell.isHome=()=>false;specialRuntime.entities.length=0;sourceExplods.length=0;afterImages.fill(null);rootTransStates.fill(null);rootPalFx.fill(null);stageBackgrounds.entries.length=0;bgPalFx.enabled=false;allPalFx.enabled=false;
    const source=document.createElement('canvas');source.width=source.height=1;source.getContext('2d').fillRect(0,0,1,1);const rows=[];
    for(const priority of [0,5]){transDrawQueue.reset();transDrawQueue.record(ctx,source,[0,0],{layer:0,priority});presentBattleTransFrame();rows.push(transOutputCanvas.style.visibility)}
    return rows;
   }finally{gameShell.isHome=savedHome;transOutputCanvas.style.visibility=savedVisibility;specialRuntime.entities.splice(0,specialRuntime.entities.length,...savedEntities);sourceExplods.splice(0,sourceExplods.length,...savedEffects);afterImages.splice(0,2,...savedTrails);rootTransStates.splice(0,2,...savedTrans);rootPalFx.splice(0,2,...savedPalettes);stageBackgrounds.entries.splice(0,stageBackgrounds.entries.length,...savedBackgrounds);[bgPalFx.enabled,allPalFx.enabled]=savedFlags;transDrawQueue.reset()}
  })()`);
  assert.deepEqual(priorityActivation,['hidden','visible']);
  console.log('Actual final presentation activates priority sorting without reflection, palette, transparency or nonzero-layer triggers');
  await page.waitForFunction(()=>window.contactPhaseTest.run('!!stageVisuals&&!!stageFilterImage'));
  for(const recipient of [1,2]){
   const targetIndex=recipient-1,otherIndex=1-targetIndex;
   const reflectionOverrides=await run(`(()=>{const recipient=${recipient},targetIndex=recipient-1;const saved={entities:[...specialRuntime.entities],palettes:rootPalFx.map(value=>({reference:value,data:value?structuredClone(value):null})),allPalette:structuredClone(allPalFx),stage:activeStage,reflection:{...stageVisuals.reflection},overrides:rootReflectionOverrides.map(value=>({...value,offset:[...value.offset]})),angles:rootAngleStates.map(snapshotAngleState),trans:[...rootTransStates],offsets:rootDrawOffsets.map(value=>[...value]),position:[posX,posY,cameraX,cameraY,cameraZoom,p1Facing,current,fi],p2:{...p2}};try{specialRuntime.entities.length=0;activeStage='training';rootPalFx.fill(null);allPalFx.enabled=false;Object.assign(stageVisuals.reflection,{intensity:50,xscale:1,yscale:1,layerno:0});rootReflectionOverrides.forEach(resetReflectionOverride);rootAngleStates.splice(0,2,createAngleState(),createAngleState());rootTransStates.fill(null);rootDrawOffsets.splice(0,2,[0,0],[0,0]);posX=-180;posY=0;cameraX=0;cameraY=0;cameraZoom=1;p1Facing=1;current=0;fi=0;p2.x=180;p2.y=0;p2.anim=0;p2.elem=1;p2.facing=-1;const records=()=>{transDrawQueue.reset();drawStageVisuals();return transDrawQueue.ordered({phase:'reflection'}).sort((first,second)=>first.serial-second.serial)},before=records(),caller=specialRoot(3-recipient),target=specialRoot(recipient),execute=params=>executeControllerM1({type:'ModifyReflection',params},caller,specialRuntime.context(caller),{owner:caller,player:3-recipient,schedulingApplied:true});execute({redirectid:recipient,intensity:128,offset:'12,-8',xscale:2,yscale:-3});const changed=records(),state={...rootReflectionOverrides[targetIndex],offset:[...rootReflectionOverrides[targetIndex].offset]},fit=Math.min((visualViewport?.width||innerWidth)/1280,(visualViewport?.height||innerHeight)/720),unit=collisionWorldRatio(characterProfiles.get(battleCharacters[targetIndex]).battle),ratio=(320/collisionLocalCoord(caller))/(320/collisionLocalCoord(target));execute({redirectid:recipient,intensity:0});const hidden=records();execute({redirectid:recipient,intensity:255,offset:'0,0',xscale:0,yscale:0});const inherited=records(),angular=[];rootAngleStates[targetIndex]={enabled:true,value:30,xangle:5,yangle:10,scale:[2,3],pivot:[4,5]};const expectedMatrix=(value,xangle,yangle)=>{const surface=document.createElement('canvas'),context=surface.getContext('2d'),radians=Math.PI/180,cosX=Math.cos(xangle*radians),sinX=Math.sin(xangle*radians),cosY=Math.cos(yangle*radians),sinY=Math.sin(yangle*radians),cosZ=Math.cos(value*radians),sinZ=Math.sin(value*radians);context.setTransform(...before[targetIndex].matrix);context.translate(4,5);context.transform(cosY*cosZ,-cosX*sinZ+sinX*sinY*cosZ,cosY*sinZ,cosX*cosZ+sinX*sinY*sinZ,0,0);context.scale(2,3);context.translate(-4,-5);const matrix=context.getTransform();return [matrix.a,matrix.b,matrix.c,matrix.d,matrix.e,matrix.f]},capture=(params,angles)=>{execute({redirectid:recipient,intensity:128,offset:'0,0',xscale:1,yscale:1,...params});angular.push({actual:records()[targetIndex].matrix,expected:expectedMatrix(...angles)})};capture({keeptransform:1,angle:20,xangle:3,yangle:4},[50,8,14]);const direction=target.facing<0?-1:1;capture({keeptransform:0,angle:20,xangle:3,yangle:4},[20*direction,3,4*direction]);Object.assign(stageVisuals.reflection,${JSON.stringify(importedReflection)});capture({keeptransform:1,angle:0,xangle:0,yangle:0},[37,7,13]);rootAngleStates[targetIndex].value=-30;rootAngleStates[targetIndex].yangle=-10;capture({keeptransform:1,angle:20,xangle:3,yangle:4},[-50,8,-14]);const probe=entry=>{const output=document.createElement('canvas'),input=document.createElement('canvas');output.width=output.height=input.width=input.height=1;const destination=output.getContext('2d'),source=input.getContext('2d'),pixels=source.createImageData(1,1);pixels.data.set([200,100,50,255]);source.putImageData(pixels,0,0);destination.fillStyle='black';destination.fillRect(0,0,1,1);compositeOpaqueTransCanvas(destination,source,entry.state,{shader:(pixels,state)=>paletteShaderForDraw(entry,pixels,state)});return [...destination.getImageData(0,0,1,1).data]};execute({redirectid:recipient,color:'255,255,255'});const white=probe(records()[targetIndex]);execute({redirectid:recipient,color:'255,0,0'});const red=probe(records()[targetIndex]);execute({redirectid:recipient,color:'0,0,0'});const black=probe(records()[targetIndex]);resetReflectionOverride(rootReflectionOverrides[targetIndex]);Object.assign(stageVisuals.reflection,${JSON.stringify(importedColorReflection)});const stageRed=probe(records()[targetIndex]);Object.assign(stageVisuals.reflection,${JSON.stringify(importedReflection)});executeControllerM1({type:'PalFX',params:{redirectid:recipient,time:-1,add:'10,20,30',mul:'256,128,512'}},caller,specialRuntime.context(caller),{owner:caller,player:3-recipient,schedulingApplied:true});executeControllerM1({type:'AllPalFX',params:{time:-1,add:'1,2,3',mul:'128,256,256'}},caller,specialRuntime.context(caller),{owner:caller,player:3-recipient,schedulingApplied:true});stepActorPalFx();execute({redirectid:recipient,intensity:128,color:'255,128,0'});const stackedRecords=records(),stacked=stackedRecords[targetIndex],other=stackedRecords[1-targetIndex],own=actorPaletteEffect(target),colors={white,red,black,stageRed,pixel:probe(stacked),stackedMul:[...stacked.paletteEffect.mul],stackedAdd:[...stacked.paletteEffect.add],ownMul:[...own.mul],ownAdd:[...own.add],otherMul:[...other.paletteEffect.mul],otherAdd:[...other.paletteEffect.add]};resetRootDrawOffsets();const reset=rootReflectionOverrides.map(value=>({...value,offset:[...value.offset]}));return {colors,angular,before:before.map(value=>({matrix:value.matrix,alpha:value.state.alpha})),changed:changed.map(value=>({matrix:value.matrix,alpha:value.state.alpha})),state,expectedOffset:[12*ratio,-8*ratio],expectedShift:[12*ratio*unit*fit,-8*ratio*unit*fit],hidden:hidden.length,inherited:inherited.map(value=>value.matrix),reset}}finally{specialRuntime.entities.splice(0,specialRuntime.entities.length,...saved.entities);for(const value of saved.palettes)if(value.reference)Object.assign(value.reference,value.data);rootPalFx.splice(0,2,...saved.palettes.map(value=>value.reference));Object.assign(allPalFx,saved.allPalette);activeStage=saved.stage;for(const key of Object.keys(stageVisuals.reflection))if(!Object.hasOwn(saved.reflection,key))delete stageVisuals.reflection[key];Object.assign(stageVisuals.reflection,saved.reflection);rootReflectionOverrides.splice(0,2,...saved.overrides);rootAngleStates.splice(0,2,...saved.angles);rootTransStates.splice(0,2,...saved.trans);rootDrawOffsets.splice(0,2,...saved.offsets);[posX,posY,cameraX,cameraY,cameraZoom,p1Facing,current,fi]=saved.position;Object.assign(p2,saved.p2);transDrawQueue.reset()}})()`);
  assert.equal(reflectionOverrides.before.length,2);
  assert.equal(reflectionOverrides.changed.length,2);
  assert.deepEqual(reflectionOverrides.state,{...emptyReflection(),intensity:128,xscale:2,yscale:-3,offset:reflectionOverrides.expectedOffset});
  assert.equal(reflectionOverrides.changed[targetIndex].alpha[0],128);
  assert.deepEqual(reflectionOverrides.changed[otherIndex],reflectionOverrides.before[otherIndex]);
  for(const [index,multiplier]of [[0,2],[3,-3]])assert.ok(Math.abs(reflectionOverrides.changed[targetIndex].matrix[index]-reflectionOverrides.before[targetIndex].matrix[index]*multiplier)<1e-6);
  for(const [index,shift]of [[4,reflectionOverrides.expectedShift[0]],[5,reflectionOverrides.expectedShift[1]]])assert.ok(Math.abs(reflectionOverrides.changed[targetIndex].matrix[index]-reflectionOverrides.before[targetIndex].matrix[index]-shift)<1e-5);
  assert.equal(reflectionOverrides.hidden,1);
  assert.deepEqual(reflectionOverrides.inherited,reflectionOverrides.before.map(value=>value.matrix));
  assert.deepEqual(reflectionOverrides.reset,Array.from({length:2},emptyReflection));
  assert.equal(reflectionOverrides.angular.length,4);
  for(const row of reflectionOverrides.angular)for(let index=0;index<6;index++)assert.ok(Math.abs(row.actual[index]-row.expected[index])<1e-5,JSON.stringify({recipient,row,index}));
  assert.ok(reflectionOverrides.colors.white.slice(0,3).every(value=>value>0));
  assert.deepEqual(reflectionOverrides.colors.red,[reflectionOverrides.colors.white[0],0,0,255]);
  assert.deepEqual(reflectionOverrides.colors.black,[0,0,0,255]);
  assert.deepEqual(reflectionOverrides.colors.stageRed,reflectionOverrides.colors.red);
  assert.deepEqual(reflectionOverrides.colors.stackedMul,[128,64,0]);
  assert.deepEqual(reflectionOverrides.colors.stackedAdd,[11,22,33]);
  assert.deepEqual(reflectionOverrides.colors.ownMul,[256,128,512]);
  assert.deepEqual(reflectionOverrides.colors.ownAdd,[10,20,30]);
  assert.deepEqual(reflectionOverrides.colors.otherMul,[128,256,256]);
  assert.deepEqual(reflectionOverrides.colors.otherAdd,[1,2,3]);
  assert.deepEqual(reflectionOverrides.colors.pixel,[53,15,0,255]);
  }
  console.log('Actual redirected ModifyReflection changes intensity/geometry/rotation and color pixels with actor/global PalFX composition for both roots, while preserving transient defaults');
  const characterLookupRows=await run(`(()=>{
   const entities=[...specialRuntime.entities],flags=rootStatusFlags.map(value=>({...value})),variables=[specialRoot(1).vars[55],specialRoot(2).vars[55]],profile=combatEngineProfile,rows=[];
   try{
    for(const engineProfile of ['mugen11','ikemen'])for(const player of [1,2]){
     combatEngineProfile=engineProfile;
     const caller=specialRoot(player),binding=player===1?p1LifecycleBinding:p2,context=specialRuntime.context(caller),adapter={owner:caller,player,schedulingApplied:true};
     const projectile={kind:'projectile',instanceId:991801,player},disabledHelper={kind:'helper',instanceId:991802,player,disabled:true},destroyedHelper={kind:'helper',instanceId:991803,player,destroyed:true};
     specialRuntime.entities.push(projectile,disabledHelper,destroyedHelper);
     rootStatusFlags[2-player].disabled=true;
     caller.vars[55]=0;
     const characterResolver=controllerCharacterActor;
     let priorResolverWrites;
     try{
      controllerCharacterActor=combatTargetActor;
      executeControllerM1({type:'DizzySet',params:{redirectid:String(projectile.instanceId),value:'(var(55):=var(55)+1)'}},binding,context,adapter);
      priorResolverWrites=caller.vars[55];
     }finally{controllerCharacterActor=characterResolver;caller.vars[55]=0;delete projectile.dizzy;rootStatusFlags[player-1].dizzy=flags[player-1].dizzy}
     for(const target of [projectile,disabledHelper,destroyedHelper,{instanceId:3-player}]){
      for(const controller of [
       {type:'DizzySet',params:{value:'(var(55):=var(55)+1)'}},
       {type:'TransformSprite',params:{xshear:'(var(55):=var(55)+1)'}},
       {type:'ModifyReflection',params:{intensity:'(var(55):=var(55)+1)'}},
       {type:'VelSet',params:{x:'(var(55):=var(55)+1)'}},
       {type:'PosAdd',params:{x:'(var(55):=var(55)+1)'}},
       {type:'HitAdd',params:{value:'(var(55):=var(55)+1)'}},
       ...['AngleSet','AngleAdd','AngleMul','AngleDraw','AttackMulSet','DefenceMulSet','CtrlSet','SprPriority'].map(type=>({type,params:{value:'(var(55):=var(55)+1)'}})),
       {type:'TargetVelSet',params:{x:'(var(55):=var(55)+1)'}}
      ])executeControllerM1({...controller,params:{...controller.params,redirectid:String(target.instanceId)}},binding,context,adapter);
     }
     for(const type of ['PosSet','PosAdd','VelSet','VelAdd','VelMul','HitVelSet'])executeControllerM1({type,params:{redirectid:'"'+player+'"',x:'(var(55):=var(55)+1)'}},binding,context,adapter);
     for(const type of ['AngleSet','AngleAdd','AngleMul','AngleDraw','AttackMulSet','DefenceMulSet','CtrlSet','SprPriority'])executeControllerM1({type,params:{redirectid:'"'+player+'"',value:'(var(55):=var(55)+1)'}},binding,context,adapter);
     const secondaryRedirectPayload='(var(55):=var(55)+1)';
     const secondaryControllers=[
      ...['AttackDist','Depth','Height','ScoreAdd','Width'].map(type=>({type,params:{value:secondaryRedirectPayload}})),
      {type:'AssertInput',params:{flag:'a'}},
      {type:'OverrideClsn',params:{rect:secondaryRedirectPayload+',0,0,0'}},
      {type:'TransformClsn',params:{scale:secondaryRedirectPayload+',1'}},
      {type:'FallEnvShake',params:{}},
      {type:'GetHitVarSet',params:{damage:secondaryRedirectPayload}},
      ...['HitFallSet','HitFallVel','HitFallDamage'].map(type=>({type,params:{}})),
      {type:'Offset',params:{x:secondaryRedirectPayload}},
      {type:'PalFX',params:{time:secondaryRedirectPayload}},
      {type:'ShiftInput',params:{input:'a',output:'b'}},
      {type:'Trans',params:{trans:'addalpha',alpha:secondaryRedirectPayload+',0'}},
      {type:'ForceFeedback',params:{time:secondaryRedirectPayload}},
      ...['DisplayToClipboard','AppendToClipboard','ClearClipboard'].map(type=>({type,params:{text:'"%d"',params:secondaryRedirectPayload}}))
     ];
     for(const controller of secondaryControllers)executeControllerM1({...controller,params:{...controller.params,redirectid:'"'+player+'"'}},binding,context,adapter);
     for(const type of ['TargetState','TargetFacing','TargetDrop','TargetPowerAdd','TargetLifeAdd','TargetScoreAdd','TargetVelSet','TargetVelAdd','TargetRedLifeAdd','TargetDizzyPointsAdd','TargetGuardPointsAdd','TargetBind']){
      const field=type==='TargetDrop'?'excludeid':type==='TargetBind'?'time':type==='TargetVelSet'||type==='TargetVelAdd'?'x':'value';
      executeControllerM1({type,params:{redirectid:'"'+player+'"',[field]:secondaryRedirectPayload}},binding,context,adapter);
     }
     rows.push({engineProfile,player,priorResolverWrites,writes:caller.vars[55],projectileDizzy:projectile.dizzy===true,disabledDizzy:disabledHelper.dizzy===true});
     specialRuntime.entities.splice(0,specialRuntime.entities.length,...entities);
     for(let index=0;index<2;index++){for(const key of Object.keys(rootStatusFlags[index]))delete rootStatusFlags[index][key];Object.assign(rootStatusFlags[index],flags[index])}
    }
    return rows;
   }finally{
    combatEngineProfile=profile;
    specialRuntime.entities.splice(0,specialRuntime.entities.length,...entities);
    for(let index=0;index<2;index++){for(const key of Object.keys(rootStatusFlags[index]))delete rootStatusFlags[index][key];Object.assign(rootStatusFlags[index],flags[index]);specialRoot(index+1).vars[55]=variables[index]}
   }
  })()`);
  assert.equal(characterLookupRows.length,4);
  for(const row of characterLookupRows){assert.equal(row.priorResolverWrites,1,JSON.stringify(row));assert.equal(row.writes,0,JSON.stringify(row));assert.equal(row.projectileDizzy,false);assert.equal(row.disabledDizzy,false)}
  console.log('Actual root dispatch skips redirected RHS for projectile, disabled and destroyed registry recipients in both profiles and player directions');
  const targetSelectionRows=await run(`(()=>{
   const entities=[...specialRuntime.entities],profile=combatEngineProfile,savedTargets=[...combatTargets].map(([key,list])=>({key,list,ids:list.ids()})),rows=[];
   try{
    for(const engineProfile of ['mugen11','ikemen'])for(const player of [1,2]){
     combatEngineProfile=engineProfile;
     const caller=specialRoot(player),binding=player===1?p1LifecycleBinding:p2,context=specialRuntime.context(caller),adapter={owner:caller,player,schedulingApplied:true};
     const first={...specialRoot(3-player),kind:'helper',key:'target-extraction-first',instanceId:991841,getHit:{hitid:0},vx:0,vy:0};
     const second={...specialRoot(3-player),kind:'helper',key:'target-extraction-second',instanceId:991842,getHit:{hitid:7},vx:0,vy:0};
     specialRuntime.entities.splice(0,specialRuntime.entities.length,...entities,first,second);
     const targets=combatTargetList(caller);targets.clear();targets.add(first.instanceId);targets.add(second.instanceId);
     const scale=actorVelocityWorldScale(caller,context);
     executeControllerM1({type:'TargetVelSet',params:{id:'"7"',index:'"8"',y:'3'}},binding,context,adapter);
     const quoted=[first.vy,second.vy];first.vy=0;second.vy=0;
     executeControllerM1({type:'TargetVelSet',params:{id:'7',index:'0',y:'5'}},binding,context,adapter);
     const numeric=[first.vy,second.vy];second.getHit.hitid=0;
     executeControllerM1({type:'TargetDrop',params:{excludeid:'"7"',keepone:'"1"'}},binding,context,adapter);
     rows.push({engineProfile,player,quoted,numeric,retained:targets.ids(),expectedQuoted:Math.fround(3*scale),expectedNumeric:Math.fround(5*scale)});
    }
    return rows;
   }finally{
    combatEngineProfile=profile;specialRuntime.entities.splice(0,specialRuntime.entities.length,...entities);
    combatTargets.clear();for(const saved of savedTargets){saved.list.clear();for(const id of saved.ids)saved.list.add(id);combatTargets.set(saved.key,saved.list)}
   }
  })()`);
  assert.equal(targetSelectionRows.length,4);
  for(const row of targetSelectionRows){assert.deepEqual(row.quoted,[row.expectedQuoted,0],JSON.stringify(row));assert.deepEqual(row.numeric,[0,row.expectedNumeric],JSON.stringify(row));assert.deepEqual(row.retained,[991841,991842],JSON.stringify(row))}
  console.log('Actual TargetVelSet quoted ID/index select the hit-ID-zero Helper while numeric controls select hit-ID-seven, in both profiles and player directions');
  console.log('Actual TargetDrop quoted excludeid and keepone preserve both hit-ID-zero Helpers instead of selecting seven or retaining only one');
  const helperReflectionRows=await run(`(()=>{
   const importedWindow=${JSON.stringify(importedWindowReflection)}.window;
   const saved={entities:[...specialRuntime.entities],stage:activeStage,reflection:{...stageVisuals.reflection},normal:[...specialRuntime.pauses.normal],super:[...specialRuntime.pauses.super],moveTimes:[...specialRuntime.moveTimes],assertions:rootAssertions.map(flags=>[...flags])},rows=[];
   try{
    activeStage='training';Object.assign(stageVisuals.reflection,{intensity:50,xscale:1,yscale:1,layerno:0});specialRuntime.pauses.normal.fill(null);specialRuntime.pauses.super.fill(null);
    for(const player of [1,2]){
     const data=characterProfiles.get(battleCharacters[player-1]).battle,globals=data.globalControllers,definition=data.helperStates[991891];
     try{
      data.globalControllers={};data.helperStates[991891]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[]};specialRuntime.entities.length=0;
      const owner=specialRoot(player);specialRuntime.dispatch({type:'Helper',params:{stateno:991891,id:991891}},owner,specialRuntime.context(owner),{},owner,player);
      const helper=specialRuntime.entities.at(-1);helper.sprPriority=12345;helper.x=0;helper.y=0;helper.drawOffset=[0,0];helper.facing=player===1?1:-1;
      const caller=specialRoot(3-player),binding=3-player===1?p1LifecycleBinding:p2,context=specialRuntime.context(caller),adapter={owner:caller,player:3-player,schedulingApplied:true};
      const execute=params=>executeControllerM1({type:'ModifyReflection',params:{redirectid:String(helper.instanceId),...params}},binding,context,adapter);
      const records=()=>{transDrawQueue.reset();drawStageVisuals();return transDrawQueue.ordered({phase:'reflection'})},capture=()=>records().find(record=>record.priority===12345);
      const before=capture();execute({intensity:'128',offset:'12,-8',color:'255,0,0'});const offset=capture();execute({xscale:'2',yscale:'-3'});const changed=capture();
      const stageIntensity=stageVisuals.reflection.intensity;stageVisuals.reflection.intensity=0;const stageSuppressed=records().length===0;stageVisuals.reflection.intensity=stageIntensity;
      const fit=Math.min((visualViewport?.width||innerWidth)/1280,(visualViewport?.height||innerHeight)/720),ratio=(320/collisionLocalCoord(caller))/(320/collisionLocalCoord(helper)),unit=collisionWorldRatio(collisionActorData(helper));
      const viewportWidth=visualViewport?.width||innerWidth,viewportHeight=visualViewport?.height||innerHeight,viewX=(viewportWidth-1280*fit)/2,viewY=(viewportHeight-720*fit)/2;
      const expectedWindow=(window,yscale)=>{const zoom=fit*cameraZoom,horizontal=[window[0]*zoom,window[2]*zoom],vertical=[-window[1]*Math.sign(yscale)*zoom,-window[3]*Math.sign(yscale)*zoom];return {x:Math.trunc((viewX+worldScreenX(0)*fit+Math.min(...horizontal))*devicePixelRatio)|0,y:Math.trunc((viewY+worldScreenY(0)*fit+Math.min(...vertical))*devicePixelRatio)|0,width:Math.trunc(Math.abs(horizontal[1]-horizontal[0])*devicePixelRatio)|0,height:Math.trunc(Math.abs(vertical[1]-vertical[0])*devicePixelRatio)|0}};
      execute({window:'-100,-200,100,0',yscale:'1'});const positiveRecord=capture(),positiveClip=positiveRecord.clip,expectedPositive=expectedWindow(helper.reflectionOverride.window,1);helper.x=150;const movedClip=capture().clip;helper.x=0;
      const probe=document.createElement('canvas'),solid=document.createElement('canvas');probe.width=positiveClip.width+8;probe.height=positiveClip.height+8;solid.width=4;solid.height=4;solid.getContext('2d').fillStyle='#c86432';solid.getContext('2d').fillRect(0,0,4,4);
      const probeContext=probe.getContext('2d');transDrawQueue.rasterize({...positiveRecord,source:solid,args:[0,0,positiveClip.width+4,positiveClip.height+4],matrix:[1,0,0,1,2,2],clip:{...positiveClip,x:4,y:4},opacity:1},probeContext);
      const clipPixels={inside:[...probeContext.getImageData(5,5,1,1).data],outside:[...probeContext.getImageData(3,5,1,1).data]};
      execute({yscale:'-1'});const negativeClip=capture().clip,expectedNegative=expectedWindow(helper.reflectionOverride.window,-1);
      const stageWindow=stageVisuals.reflection.window;execute({window:'0,0,0,0',yscale:'1'});stageVisuals.reflection.window=importedWindow;const fallbackClip=capture().clip,expectedFallback=expectedWindow(stageVisuals.reflection.window,1);if(stageWindow===undefined)delete stageVisuals.reflection.window;else stageVisuals.reflection.window=stageWindow;
      const rootReflection=rootReflectionOverrides[player-1],rootWindow=[...rootReflection.window];let rootClip,expectedRoot;
      try{executeControllerM1({type:'ModifyReflection',params:{redirectid:String(player),window:'-100,-200,100,0'}},binding,context,adapter);rootClip=records().filter(record=>record.priority!==12345)[player-1].clip;expectedRoot=expectedWindow(rootReflection.window,rootReflection.yscale===0?1:rootReflection.yscale)}finally{rootReflection.window=rootWindow}
      execute({intensity:'0'});const hidden=!capture();execute({intensity:'128'});const visible=!!capture();helper.disabled=true;const disabled=!capture();helper.disabled=false;
      const assertShadow=(id,enabled)=>executeControllerM1({type:'AssertSpecial',params:{redirectid:String(id),flag:'NoShadow',enabled:String(enabled)}},binding,context,adapter);
      assertShadow(helper.instanceId,1);const noShadow=!capture();assertShadow(helper.instanceId,0);const visibleRestored=!!capture(),withRoots=records().length;
      assertShadow(player,1);const rootNoShadow=records().length===withRoots-1;assertShadow(player,0);const rootRestored=records().length===withRoots;
      execute({intensity:'201'});helper.hitPause=2;specialRuntime.step();const local=structuredClone(helper.reflectionOverride);
      execute({intensity:'202'});specialRuntime.pauses.normal[0]={remaining:10,movetime:0,player:1,created:combatTraceTick-1};specialRuntime.moveTimes.set(helper.key,{normal:0});specialRuntime.step();const global=helper.reflectionOverride.intensity;
      specialRuntime.pauses.normal.fill(null);specialRuntime.step();const resumed=helper.reflectionOverride.intensity;
      rows.push({player,before:before.matrix,offset:offset.matrix,changed:changed.matrix,alpha:changed.state.alpha,mul:changed.paletteEffect.mul,expectedShift:[12*ratio*unit*cameraZoom*fit,-8*ratio*unit*cameraZoom*fit],stageSuppressed,clipPixels,positiveClip,expectedPositive,movedClip,negativeClip,expectedNegative,fallbackClip,expectedFallback,rootClip,expectedRoot,hidden,visible,disabled,noShadow,visibleRestored,rootNoShadow,rootRestored,local,global,resumed});
     }finally{data.globalControllers=globals;if(definition===undefined)delete data.helperStates[991891];else data.helperStates[991891]=definition}
    }
    return rows;
   }finally{
    specialRuntime.entities.splice(0,specialRuntime.entities.length,...saved.entities);activeStage=saved.stage;for(const key of Object.keys(stageVisuals.reflection))if(!Object.hasOwn(saved.reflection,key))delete stageVisuals.reflection[key];Object.assign(stageVisuals.reflection,saved.reflection);
    specialRuntime.pauses.normal.splice(0,2,...saved.normal);specialRuntime.pauses.super.splice(0,2,...saved.super);specialRuntime.moveTimes.clear();for(const [key,value]of saved.moveTimes)specialRuntime.moveTimes.set(key,value);for(let index=0;index<2;index++){rootAssertions[index].clear();for(const flag of saved.assertions[index])rootAssertions[index].add(flag)}transDrawQueue.reset();
   }
  })()`);
  assert.equal(helperReflectionRows.length,2);
  for(const row of helperReflectionRows){
   assert.equal(row.alpha[0],128);assert.equal(row.mul[1],0);assert.equal(row.mul[2],0);
   for(const [axis,factor]of [[0,2],[3,-3]])assert.ok(Math.abs(row.changed[axis]-row.before[axis]*factor)<1e-5,JSON.stringify(row));
   for(const axis of [0,1])assert.ok(Math.abs(row.offset[axis+4]-row.before[axis+4]-row.expectedShift[axis])<1e-5,JSON.stringify(row));
   assert.equal(row.stageSuppressed,true);assert.deepEqual(row.positiveClip,row.expectedPositive);assert.deepEqual(row.movedClip,row.expectedPositive);assert.deepEqual(row.negativeClip,row.expectedNegative);assert.deepEqual(row.fallbackClip,row.expectedFallback);assert.deepEqual(row.rootClip,row.expectedRoot);
   assert.deepEqual(row.clipPixels.inside,[200,100,50,255]);assert.deepEqual(row.clipPixels.outside,[0,0,0,0]);
   assert.equal(row.hidden,true);assert.equal(row.visible,true);assert.equal(row.disabled,true);assert.equal(row.noShadow,true);assert.equal(row.visibleRestored,true);assert.equal(row.rootNoShadow,true);assert.equal(row.rootRestored,true);assert.deepEqual(row.local,emptyReflection());assert.equal(row.global,202);assert.equal(row.resumed,-1);
  }
  console.log('Spawned Helpers consume redirected ModifyReflection geometry/color/alpha and native preparation reset, retaining through global pause in both player directions');
  const rootGravity=await run(`(()=>{
   const savedVelocity=[vy,p2.vy],reaction=p1Reaction,data=[1,2].map(player=>collisionActorData(specialRoot(player))),constants=data.map(value=>value.originalMotionConstants['movement.yaccel']),rows=[];
   try{
    p1Reaction=null;data[0].originalMotionConstants['movement.yaccel']=1.25;data[1].originalMotionConstants['movement.yaccel']=3.75;
    for(const player of [1,2]){
     vy=2.5;p2.vy=2.5;
     const target=specialRoot(player),caller=specialRoot(3-player),context=specialRuntime.context(caller),binding=3-player===1?p1LifecycleBinding:p2;
     executeControllerM1({type:'Gravity',params:{redirectid:String(player)}},binding,context,{owner:caller,player:3-player,schedulingApplied:true});
     rows.push({player,actual:player===1?vy:p2.vy,other:player===1?p2.vy:vy,expected:Math.fround(2.5+Math.fround((player===1?1.25:3.75)*collisionWorldRatio(data[player-1])))});
    }
    return rows;
   }finally{[vy,p2.vy]=savedVelocity;p1Reaction=reaction;for(let index=0;index<2;index++)data[index].originalMotionConstants['movement.yaccel']=constants[index]}
  })()`);
  for(const row of rootGravity){assert.equal(row.actual,row.expected,JSON.stringify(row));assert.equal(row.other,2.5)}
  console.log('Actual redirected Gravity changes only recipient root velocity using its own acceleration constant');
  const gravityCoordinates=await run(`(()=>{
   const data=[1,2].map(player=>collisionActorData(specialRoot(player))),saved={profile:combatEngineProfile,entities:[...specialRuntime.entities],owners:[...customStateOwners],velocity:[vy,p2.vy],reaction:p1Reaction,data:data.map(value=>({coordinate:value.coordinateSystem.localcoord,acceleration:value.originalMotionConstants['movement.yaccel'],definition:value.helperStates[991920]}))},rows=[];
   try{
    p1Reaction=null;data[0].coordinateSystem.localcoord=[320,240];data[1].coordinateSystem.localcoord=[640,480];data[0].originalMotionConstants['movement.yaccel']=.25;data[1].originalMotionConstants['movement.yaccel']=.75;
    for(const value of data)value.helperStates[991920]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[]};
    for(const profile of ['mugen11','ikemen'])for(const player of [1,2])for(const kind of ['root','helper'])for(const foreign of [false,true]){
     combatEngineProfile=profile;specialRuntime.entities.length=0;customStateOwners.fill(null);vy=3.125;p2.vy=3.125;
     let actor=specialRoot(player);
     if(kind==='helper'){specialRuntime.dispatch({type:'Helper',params:{stateno:991920,id:991920}},actor,specialRuntime.context(actor),{},actor,player);actor=specialRuntime.entities.at(-1);actor.vy=3.125}
     if(foreign){if(kind==='helper')actor.stateOwner=battleCharacters[2-player];else customStateOwners[player-1]=battleCharacters[2-player]}
     const ownCoordinate=player===1?320:640,stateCoordinate=foreign?(player===1?640:320):ownCoordinate,worldWidth=Number(data[player-1].coordinateSystem.webWorldWidth??1280),ownScale=Math.fround(worldWidth/ownCoordinate),stateScale=Math.fround(worldWidth/stateCoordinate);
     const expected=Math.fround(Math.fround(Math.fround(3.125/stateScale)+Math.fround(Math.fround(player===1?.25:.75)*Math.fround(ownScale/stateScale)))*stateScale);
     const caller=specialRoot(3-player),binding=3-player===1?p1LifecycleBinding:p2,context=specialRuntime.context(caller),targetId=kind==='helper'?actor.instanceId:player;
     executeControllerM1({type:'Gravity',params:{redirectid:String(targetId)}},binding,context,{owner:caller,player:3-player,schedulingApplied:true});
     const actual=kind==='helper'?actor.vy:player===1?vy:p2.vy,roots=[vy,p2.vy];
     if(kind==='helper')actor.vy=3.125;else if(player===1)vy=3.125;else p2.vy=3.125;
     executeControllerM1({type:'Gravity',params:{}},kind==='helper'?actor:player===1?p1LifecycleBinding:p2,specialRuntime.context(actor),{owner:actor,player,schedulingApplied:true});
     const direct=kind==='helper'?actor.vy:player===1?vy:p2.vy;
     rows.push({profile,player,kind,foreign,actual,direct,expected,roots});
    }
    return rows;
   }finally{
    combatEngineProfile=saved.profile;specialRuntime.entities.splice(0,specialRuntime.entities.length,...saved.entities);customStateOwners.splice(0,2,...saved.owners);[vy,p2.vy]=saved.velocity;p1Reaction=saved.reaction;
    for(let index=0;index<2;index++){data[index].coordinateSystem.localcoord=saved.data[index].coordinate;data[index].originalMotionConstants['movement.yaccel']=saved.data[index].acceleration;if(saved.data[index].definition===undefined)delete data[index].helperStates[991920];else data[index].helperStates[991920]=saved.data[index].definition}
   }
  })()`);
  assert.equal(gravityCoordinates.length,16);
  for(const row of gravityCoordinates){assert.equal(row.actual,row.expected,JSON.stringify(row));assert.equal(row.direct,row.expected,JSON.stringify(row));assert.equal(row.roots[2-row.player],3.125,JSON.stringify(row));if(row.kind==='helper')assert.deepEqual(row.roots,[3.125,3.125],JSON.stringify(row))}
  console.log('Actual normal-spawn Helper/root Gravity uses recipient constants and foreign-state coordinate conversion in sixteen profile/player/ownership cases');
  const moveResetRows=await run(`(()=>{
   const data=[1,2].map(player=>gravityActorData(specialRoot(player))),saved={profile:combatEngineProfile,entities:[...specialRuntime.entities],reaction:p1Reaction,p1:[moveContact,moveHit,moveGuarded,p1HitCount],p2:[p2.moveContact,p2.moveHit,p2.moveGuarded,p2.hitCount],clocks:[...reversedMoveClocks].map(([key,value])=>({key,value,data:{...value}})),flags:[...moveCounteredFlags],hitData:[...moveHitDataStore].map(([key,value])=>({key,value,data:{...value}})),definitions:data.map(value=>value.helperStates[991930])},rows=[];
   try{
    for(const value of data)value.helperStates[991930]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[]};
    for(const profile of ['mugen11','ikemen'])for(const player of [1,2])for(const kind of player===1?['root','helper','reaction']:['root','helper'])for(const contact of ['hit','guarded','reversed','none']){
     combatEngineProfile=profile;specialRuntime.entities.length=0;p1Reaction=null;moveContact=9;moveHit=4;moveGuarded=2;p1HitCount=11;Object.assign(p2,{moveContact:9,moveHit:4,moveGuarded:2,hitCount:12});
     for(const key of ['root1','root2']){reversedMoveClocks.delete(key);moveCounteredFlags.delete(key)}
     let actor=specialRoot(player);
     if(kind==='helper'){specialRuntime.dispatch({type:'Helper',params:{stateno:991930,id:991930}},actor,specialRuntime.context(actor),{},actor,player);actor=specialRuntime.entities.at(-1);Object.assign(actor,{moveContact:9,moveHit:4,moveGuarded:2,hitCount:13})}
     if(kind==='reaction'){p1Reaction={...actor,moveContact:9,moveHit:4,moveGuarded:2};actor=specialRoot(1)}
     const key=hitDefinitionOwnerKey(actor),clock={type:contact==='none'?'hit':contact,time:7,countered:true};if(contact!=='none')reversedMoveClocks.set(key,clock);moveCounteredFlags.set(key,true);Object.assign(moveHitDataFor(actor),{frame:true,overridden:true,playerid:123,playerno:1,sparkx:7,sparky:8});
     const staleContext=fighterExpressionContext(actor,specialRoot(3-player));
     const caller=specialRoot(3-player),context=specialRuntime.context(caller),binding=3-player===1?p1LifecycleBinding:p2;
     executeControllerM1({type:'MoveHitReset',params:{redirectid:String(kind==='helper'?actor.instanceId:player)}},binding,context,{owner:caller,player:3-player,schedulingApplied:true});
     const target=kind==='helper'?actor:specialRoot(player),query=fighterExpressionContext(target,specialRoot(3-player)),other=fighterExpressionContext(specialRoot(3-player),target),raw=kind==='helper'?[actor.moveContact,actor.moveHit,actor.moveGuarded]:player===1?[moveContact,moveHit,moveGuarded]:[p2.moveContact,p2.moveHit,p2.moveGuarded];
     rows.push({profile,player,kind,contact,raw,queries:['MoveContact','MoveHit','MoveGuarded','MoveReversed','MoveCountered'].map(name=>evalM1(name,query)),stale:['MoveContact','MoveHit','MoveGuarded','MoveReversed','MoveCountered'].map(name=>evalM1(name,staleContext)),other:['MoveContact','MoveHit','MoveGuarded'].map(name=>evalM1(name,other)),count:kind==='helper'?actor.hitCount:player===1?p1HitCount:p2.hitCount,metadata:structuredClone(moveHitDataFor(actor)),clock:{...reversedMoveClocks.get(key)},reaction:kind==='reaction'?[p1Reaction.moveContact,p1Reaction.moveHit,p1Reaction.moveGuarded]:null});
    }
    return rows;
   }finally{
    combatEngineProfile=saved.profile;specialRuntime.entities.splice(0,specialRuntime.entities.length,...saved.entities);p1Reaction=saved.reaction;[moveContact,moveHit,moveGuarded,p1HitCount]=saved.p1;[p2.moveContact,p2.moveHit,p2.moveGuarded,p2.hitCount]=saved.p2;
    reversedMoveClocks.clear();for(const entry of saved.clocks){Object.assign(entry.value,entry.data);reversedMoveClocks.set(entry.key,entry.value)}moveCounteredFlags.clear();for(const [key,value]of saved.flags)moveCounteredFlags.set(key,value);moveHitDataStore.clear();for(const entry of saved.hitData){Object.assign(entry.value,entry.data);moveHitDataStore.set(entry.key,entry.value)}
    for(let index=0;index<2;index++)if(saved.definitions[index]===undefined)delete data[index].helperStates[991930];else data[index].helperStates[991930]=saved.definitions[index];
   }
  })()`);
  assert.equal(moveResetRows.length,40);
  for(const row of moveResetRows){assert.deepEqual(row.raw,[0,0,0],JSON.stringify(row));assert.deepEqual(row.queries,[0,0,0,0,0],JSON.stringify(row));assert.deepEqual(row.stale,[0,0,0,0,0],JSON.stringify(row));assert.deepEqual(row.other,[9,4,2],JSON.stringify(row));assert.equal(row.count,row.kind==='helper'?13:row.player===1?11:12);assert.equal(row.metadata.frame,true);assert.equal(row.metadata.overridden,true);assert.equal(row.metadata.playerid,123);assert.equal(row.metadata.sparkx,7);assert.deepEqual(row.clock,{type:row.contact==='none'?'hit':row.contact,time:0,countered:false});if(row.reaction)assert.deepEqual(row.reaction,[0,0,0])}
  console.log('Actual MoveHitReset clears live/stale contact queries for roots, reaction roots and normal-spawn Helpers while preserving hit counts and MoveHitVar data in forty cases');
  const stoppedSound=await run(`(()=>{
   const saved={Audio:window.Audio,channels:[...soundChannels],automatic:[...automaticSounds],voice:roundVoiceUntil,registry:typeof characterSoundChannels==='undefined'?null:characterSoundChannels};
   try{
    if(saved.registry)characterSoundChannels=createCharacterSoundChannels();soundChannels.clear();automaticSounds.clear();
    window.Audio=class extends EventTarget{constructor(url){super();this.src=url;this.stops=0;this.paused=true;this.ended=false}play(){this.paused=false;return Promise.resolve()}pause(){this.stops++;this.paused=true}};
    const soundValue=player=>{const profile=characterProfiles.get(battleCharacters[player-1]),key=Object.keys(profile.sounds).find(value=>/^[0-9]+-[0-9]+$/.test(value));return key.replace('-',',')};
    const first=playSourceSound(soundValue(1),0,1),second=playSourceSound(soundValue(2),4,2),caller=specialRoot(1);
    executeControllerM1({type:'StopSnd',params:{redirectid:'2',channel:'0'}},p1LifecycleBinding,specialRuntime.context(caller),{owner:caller,player:1,schedulingApplied:true});
    return [first.stops,second.stops];
   }finally{
    if(saved.registry){characterSoundChannels.stopAll();characterSoundChannels=saved.registry}window.Audio=saved.Audio;soundChannels.clear();for(const [key,value]of saved.channels)soundChannels.set(key,value);automaticSounds.clear();for(const value of saved.automatic)automaticSounds.add(value);roundVoiceUntil=saved.voice;
   }
  })()`);
  assert.deepEqual(stoppedSound,[0,1]);
  console.log('Actual StopSnd redirect stops P2 logical channel zero without stopping P1');
  const negativeSound=await run(`(()=>{
   const savedAudio=window.Audio,caller=specialRoot(1);let creations=0;
   try{
    window.Audio=class extends EventTarget{constructor(){super();creations++}play(){return Promise.resolve()}pause(){}};
    for(const value of ['-1,0','F-1,0'])executeControllerM1({type:'PlaySnd',params:{value,channel:'9'}},p1LifecycleBinding,specialRuntime.context(caller),{owner:caller,player:1,schedulingApplied:true});
    return creations;
   }finally{window.Audio=savedAudio}
  })()`);
  assert.equal(negativeSound,0);
  console.log('Actual PlaySnd negative own/common groups do not allocate media');
  const helperSounds=await run(`(()=>{
   const data=[1,2].map(player=>collisionActorData(specialRoot(player))),saved={Audio:window.Audio,registry:characterSoundChannels,entities:[...specialRuntime.entities],voice:roundVoiceUntil,definitions:data.map(value=>value.helperStates[991940])},rows=[];
   try{
    characterSoundChannels=createCharacterSoundChannels();window.Audio=function(url){const sound=new saved.Audio(url);sound.stops=0;sound.play=()=>Promise.resolve();sound.pause=()=>{sound.stops++};return sound};
    for(const value of data)value.helperStates[991940]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[]};
    for(const player of [1,2])for(const inheritance of [0,1,2]){
     characterSoundChannels.stopAll();specialRuntime.entities.length=0;const root=specialRoot(player),profile=characterProfiles.get(battleCharacters[player-1]),key=Object.keys(profile.sounds).find(value=>/^[0-9]+-[0-9]+$/.test(value)),soundValue=key.replace('-',',');
     specialRuntime.dispatch({type:'Helper',params:{stateno:991940,id:991940,inheritchannels:'2'}},root,specialRuntime.context(root),{},root,player);const parent=specialRuntime.entities.at(-1);
     specialRuntime.dispatch({type:'Helper',params:{stateno:991940,id:991940,inheritchannels:String(inheritance)}},parent,specialRuntime.context(parent),{},parent,player);const child=specialRuntime.entities.at(-1);
     executeControllerM1({type:'PlaySnd',params:{value:soundValue,channel:'7'}},child,specialRuntime.context(child),{owner:child,player,schedulingApplied:true});
     const record=characterSoundChannels.entries()[0],expected=inheritance===1?parent:inheritance===2?root:child;
     const stop=actor=>executeControllerM1({type:'StopSnd',params:{channel:'7'}},actor.kind==='helper'?actor:player===1?p1LifecycleBinding:p2,specialRuntime.context(actor),{owner:actor,player,schedulingApplied:true});
     stop(child);const childStops=Number(!characterSoundChannels.has(record));stop(parent);const parentStops=Number(!characterSoundChannels.has(record));stop(root);
     rows.push({player,inheritance,created:child.inheritChannels,owner:record.owner,expected:characterSoundIdentity(expected),childStops,parentStops,finalStops:Number(!characterSoundChannels.has(record)),resource:record.nativePlayback.url===profile.soundBase+(profile.sounds[key].nativeFile??profile.sounds[key].file)});
    }
    return rows;
   }finally{
    characterSoundChannels.stopAll();characterSoundChannels=saved.registry;window.Audio=saved.Audio;roundVoiceUntil=saved.voice;specialRuntime.entities.splice(0,specialRuntime.entities.length,...saved.entities);
    for(let index=0;index<2;index++){if(saved.definitions[index]===undefined)delete data[index].helperStates[991940];else data[index].helperStates[991940]=saved.definitions[index]}
   }
  })()`);
  assert.equal(helperSounds.length,6);
  for(const row of helperSounds){assert.equal(row.owner,row.expected,JSON.stringify(row));assert.equal(row.created,row.inheritance);assert.equal(row.childStops,row.inheritance===0?1:0);assert.equal(row.parentStops,row.inheritance===2?0:1);assert.equal(row.finalStops,1);assert.equal(row.resource,true)}
  console.log('Actual PlaySnd/StopSnd normal-spawn Helpers preserve own resources and nonrecursive parent/root channel inheritance in both player directions');
  const soundPriorities=await run(`(()=>{
   const saved={Audio:window.Audio,registry:characterSoundChannels,voice:roundVoiceUntil},rows=[];
   try{
    characterSoundChannels=createCharacterSoundChannels();window.Audio=function(url){const sound=new saved.Audio(url);sound.stops=0;sound.plays=0;sound.play=()=>{sound.plays++;return Promise.resolve()};sound.pause=()=>{sound.stops++};return sound};
    for(const player of [1,2])for(const common of [false,true]){
     characterSoundChannels.stopAll();const actor=specialRoot(player),profile=characterProfiles.get(battleCharacters[player-1]),key=Object.keys(profile.sounds).find(value=>/^[0-9]+-[0-9]+$/.test(value)),value=common?'F7,0':key.replace('-',',');
     const play=params=>executeControllerM1({type:'PlaySnd',params:{value,channel:'7',...params}},player===1?p1LifecycleBinding:p2,specialRuntime.context(actor),{owner:actor,player,schedulingApplied:true});
     play({priority:'5'});const first=characterSoundChannels.entries()[0];
     play({priority:'4'});const lowerKept=characterSoundChannels.entries()[0]===first;
     play({priority:'6',lowpriority:'1'});const lowKept=characterSoundChannels.entries()[0]===first;
     play({priority:'5',lowpriority:'0'});const replacement=characterSoundChannels.entries()[0];
     play({priority:'"99"'});const stringKept=characterSoundChannels.entries()[0]===replacement;
     play({priority:'6',lowpriority:'"1"'});const final=characterSoundChannels.entries()[0];
     rows.push({player,common,lowerKept,lowKept,stringKept,firstStops:Number(!characterSoundChannels.has(first)),replacementStops:Number(!characterSoundChannels.has(replacement)),finalPriority:final.priority,finalAllocated:characterSoundChannels.has(final)&&!!final.nativePlayback&&!!final.nativeReady,count:characterSoundChannels.entries().length});
     characterSoundChannels.stopAll();const binding=player===1?p1LifecycleBinding:p2,savedVariable=binding.vars[17];
     try{binding.vars[17]=0;play({lowpriority:'(var(17) := 5)',priority:'var(17)'});rows.at(-1).orderedPriority=characterSoundChannels.entries()[0].priority;rows.at(-1).orderedVariable=binding.vars[17]}finally{binding.vars[17]=savedVariable}
    }
    return rows;
   }finally{characterSoundChannels.stopAll();characterSoundChannels=saved.registry;window.Audio=saved.Audio;roundVoiceUntil=saved.voice}
  })()`);
  assert.equal(soundPriorities.length,4);
  for(const row of soundPriorities){assert.equal(row.lowerKept,true,JSON.stringify(row));assert.equal(row.lowKept,true);assert.equal(row.stringKept,true);assert.equal(row.firstStops,1);assert.equal(row.replacementStops,1);assert.equal(row.finalPriority,6);assert.equal(row.finalAllocated,true);assert.equal(row.count,1)}
  for(const row of soundPriorities){assert.equal(row.orderedPriority,5,JSON.stringify(row));assert.equal(row.orderedVariable,5)}
  console.log('Actual own/common PlaySnd priority and lowpriority extraction control numbered-channel replacement for P1/P2');
  const saturatedSounds=await run(`(()=>{
   const data=[1,2].map(player=>collisionActorData(specialRoot(player))),saved={Audio:window.Audio,registry:characterSoundChannels,entities:[...specialRuntime.entities],definitions:data.map(value=>value.helperStates[991950])},rows=[];
   try{
    characterSoundChannels=createCharacterSoundChannels({capacity:2});window.Audio=function(url){const sound=new saved.Audio(url);sound.stops=0;sound.play=()=>Promise.resolve();sound.pause=()=>{sound.stops++};return sound};
    for(const value of data)value.helperStates[991950]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[]};
    for(const player of [1,2]){
     characterSoundChannels.stopAll();specialRuntime.entities.length=0;const root=specialRoot(player),other=specialRoot(3-player);
     specialRuntime.dispatch({type:'Helper',params:{stateno:991950,id:991950}},root,specialRuntime.context(root),{},root,player);const helper=specialRuntime.entities.at(-1);
     const play=(actor,channel,priority,lowpriority=0)=>executeControllerM1({type:'PlaySnd',params:{value:'F7,0',channel:String(channel),priority:String(priority),lowpriority:String(lowpriority)}},actor.kind==='helper'?actor:actor.player===1?p1LifecycleBinding:p2,specialRuntime.context(actor),{owner:actor,player:actor.player,schedulingApplied:true});
     play(root,0,5);const first=characterSoundChannels.entries().at(-1);play(helper,-1,0);const automatic=characterSoundChannels.entries().at(-1);play(other,0,0);const opponent=characterSoundChannels.entries().at(-1);
     play(root,1,4,1);const rejected=characterSoundChannels.has(automatic)&&characterSoundChannels.entries().length===3;
     play(root,1,4);const replacement=characterSoundChannels.entries().at(-1);
     rows.push({player,rejected,firstStops:Number(!characterSoundChannels.has(first)),automaticStops:Number(!characterSoundChannels.has(automatic)),opponentStops:Number(!characterSoundChannels.has(opponent)),pool:replacement.pool,slot:replacement.slot,counts:[characterSoundChannels.entries().filter(record=>record.pool===player).length,characterSoundChannels.entries().filter(record=>record.pool===3-player).length]});
    }
    return rows;
   }finally{
    characterSoundChannels.stopAll();characterSoundChannels=saved.registry;window.Audio=saved.Audio;specialRuntime.entities.splice(0,specialRuntime.entities.length,...saved.entities);
    for(let index=0;index<2;index++){if(saved.definitions[index]===undefined)delete data[index].helperStates[991950];else data[index].helperStates[991950]=saved.definitions[index]}
   }
  })()`);
  assert.equal(saturatedSounds.length,2);
  for(const row of saturatedSounds){assert.equal(row.rejected,true,JSON.stringify(row));assert.equal(row.firstStops,0);assert.equal(row.automaticStops,1);assert.equal(row.opponentStops,0);assert.equal(row.pool,row.player);assert.equal(row.slot,1);assert.deepEqual(row.counts,[2,1])}
  console.log('Actual saturated sound pools share normal Helper/root capacity, reject lowpriority and evict automatic audio without touching the opposing player');
  const renderedPan=await run(`(async()=>{
   const {createLinearSoundPanner}=await import('./Engine/linear-sound-panner.js'),rows=[];
   for(const channels of [1,2])for(const pan of [-1,0,.5,1])for(const gain of [.5,1,2]){
    const context=new OfflineAudioContext(2,128,44100),buffer=context.createBuffer(channels,128,44100);buffer.getChannelData(0).fill(.25);if(channels===2)buffer.getChannelData(1).fill(.125);
    const source=context.createBufferSource();source.buffer=buffer;const graph=createLinearSoundPanner(context,source);graph.set(pan,gain);graph.output.connect(context.destination);source.start();const result=await context.startRendering();rows.push({channels,pan,gain,left:result.getChannelData(0)[64],right:result.getChannelData(1)[64]});graph.disconnect();
   }
   return rows;
  })()`);
  assert.equal(renderedPan.length,24);
  for(const row of renderedPan){assert.ok(Math.abs(row.left-.25*Math.min(row.gain*(1-row.pan),2))<1e-6,JSON.stringify(row));assert.ok(Math.abs(row.right-(row.channels===1?.25:.125)*Math.min(row.gain*(1+row.pan),2))<1e-6,JSON.stringify(row))}
  console.log('Actual offline Web Audio renders native linear left/right gains and clipping for mono/stereo sources in twenty-four cases');
  const sourcePan=await run(`(()=>{
   const saved=characterSoundChannels;characterSoundChannels=createCharacterSoundChannels();const root=specialRoot(1),other=specialRoot(2);let first,second;
   try{
    first=characterSoundChannels.add(characterSoundIdentity(root),7,new Audio(),()=>characterSoundOutput.release(first));second=characterSoundChannels.add(characterSoundIdentity(other),7,new Audio(),()=>characterSoundOutput.release(second));
    executeControllerM1({type:'SndPan',params:{redirectid:'2',channel:'7',pan:'90',abspan:'160'}},p1LifecycleBinding,specialRuntime.context(root),{owner:root,player:1,schedulingApplied:true});
    const firstState=characterSoundOutput.snapshot(first),secondState=characterSoundOutput.snapshot(second),active=characterSoundOutput.size();
    executeControllerM1({type:'SndPan',params:{redirectid:'2',channel:'7',abspan:'80'}},p1LifecycleBinding,specialRuntime.context(root),{owner:root,player:1,schedulingApplied:true});const repeated=characterSoundOutput.snapshot(second),repeatedCount=characterSoundOutput.size();
    executeControllerM1({type:'StopSnd',params:{redirectid:'2',channel:'7'}},p1LifecycleBinding,specialRuntime.context(root),{owner:root,player:1,schedulingApplied:true});
    return {firstState,secondState,active,repeated,repeatedCount,remaining:characterSoundOutput.size(),released:characterSoundOutput.snapshot(second)};
   }finally{characterSoundChannels.stopAll();characterSoundChannels=saved}
  })()`);
  assert.equal(sourcePan.firstState,null);assert.equal(sourcePan.secondState.sourceId,-1);assert.equal(sourcePan.secondState.pan,160);assert.ok(Math.abs(sourcePan.secondState.lastPan-.3)<1e-6);assert.equal(sourcePan.active,1);assert.equal(sourcePan.remaining,0);assert.equal(sourcePan.released,null);
  assert.equal(sourcePan.repeatedCount,1);assert.ok(Math.abs(sourcePan.repeated.lastPan-.15)<1e-6);
  console.log('Actual redirected SndPan attaches real media audio graph only to recipient channel and StopSnd disconnects it');
  const helperPan=await run(`(()=>{
   const data=[1,2].map(player=>gravityActorData(specialRoot(player))),saved={registry:characterSoundChannels,entities:[...specialRuntime.entities],camera:[cameraX,cameraZoom],data:data.map(value=>({coordinate:value.coordinateSystem.localcoord,definition:value.helperStates[991960]}))},rows=[];
   try{
    characterSoundChannels=createCharacterSoundChannels();cameraX=80;cameraZoom=2;
    for(const value of data)value.helperStates[991960]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[]};
    for(const player of [1,2])for(const coordinate of [320,640])for(const facing of [-1,1]){
     characterSoundChannels.stopAll();specialRuntime.entities.length=0;data[player-1].coordinateSystem.localcoord=[coordinate,240];const root=specialRoot(player),caller=specialRoot(3-player);
     specialRuntime.dispatch({type:'Helper',params:{stateno:991960,id:991960}},root,specialRuntime.context(root),{},root,player);const helper=specialRuntime.entities.at(-1);helper.x=400;helper.facing=facing;
     let record;record=characterSoundChannels.add(characterSoundIdentity(helper),7,new Audio(),()=>characterSoundOutput.release(record));
     executeControllerM1({type:'SndPan',params:{redirectid:String(helper.instanceId),channel:'7',pan:'40'}},3-player===1?p1LifecycleBinding:p2,specialRuntime.context(caller),{owner:caller,player:3-player,schedulingApplied:true});
     const initial=characterSoundOutput.snapshot(record);helper.x=480;characterSoundOutput.update();const moved=characterSoundOutput.snapshot(record);helper.destroyed=true;helper.x=900;characterSoundOutput.update();const removed=characterSoundOutput.snapshot(record);
     rows.push({player,coordinate,facing,source:initial.sourceId,id:helper.instanceId,offset:initial.pan,initial:initial.lastPan,moved:moved.lastPan,removed:removed.lastPan,retained:removed.sourceX});
    }
    return rows;
   }finally{
    characterSoundChannels.stopAll();characterSoundChannels=saved.registry;specialRuntime.entities.splice(0,specialRuntime.entities.length,...saved.entities);[cameraX,cameraZoom]=saved.camera;
    for(let index=0;index<2;index++){data[index].coordinateSystem.localcoord=saved.data[index].coordinate;if(saved.data[index].definition===undefined)delete data[index].helperStates[991960];else data[index].helperStates[991960]=saved.data[index].definition}
   }
  })()`);
  assert.equal(helperPan.length,8);
  for(const row of helperPan){const offset=40*320/row.coordinate*row.facing;assert.equal(row.source,row.id);assert.equal(row.offset,offset);assert.ok(Math.abs(row.initial-(100+offset-20)*2*2/320*.3)<1e-6,JSON.stringify(row));assert.ok(Math.abs(row.moved-(120+offset-20)*2*2/320*.3)<1e-6,JSON.stringify(row));assert.equal(row.removed,row.moved);assert.equal(row.retained,120)}
  console.log('Actual redirected normal-Helper SndPan captures own coordinates/facing, tracks camera/emitter and retains removed position in eight cases');
  const playPan=await run(`(()=>{
   const saved={registry:characterSoundChannels,voice:roundVoiceUntil,camera:[cameraX,cameraZoom]},rows=[];
   try{
    characterSoundChannels=createCharacterSoundChannels();cameraX=0;cameraZoom=1;
    for(const player of [1,2])for(const common of [false,true])for(const mode of ['default','relative','absolute']){
     const absolute=mode==='absolute';characterSoundChannels.stopAll();const actor=specialRoot(player),profile=characterProfiles.get(battleCharacters[player-1]),key=Object.keys(profile.sounds).find(value=>/^[0-9]+-[0-9]+$/.test(value)),params={value:common?'F7,0':key.replace('-',','),channel:'7'};if(mode!=='default')params.pan='40';if(absolute)params.abspan='160';
     executeControllerM1({type:'PlaySnd',params},player===1?p1LifecycleBinding:p2,specialRuntime.context(actor),{owner:actor,player,schedulingApplied:true});
     const record=characterSoundChannels.entries()[0],state=characterSoundOutput.snapshot(record),offset=Math.fround(Math.fround((mode==='default'?0:40)*Math.fround(320/characterLocalCoord(gravityActorData(actor))))*actor.facing);
     rows.push({player,common,absolute,state,offset,position:actor.x/4,active:characterSoundOutput.size()});
    }
    return rows;
   }finally{characterSoundChannels.stopAll();characterSoundChannels=saved.registry;roundVoiceUntil=saved.voice;[cameraX,cameraZoom]=saved.camera}
  })()`);
  assert.equal(playPan.length,12);
  for(const row of playPan){assert.equal(row.active,1);assert.equal(row.state.sourceId,row.absolute?-1:row.player);assert.equal(row.state.pan,row.absolute?160:row.offset);assert.ok(Math.abs(row.state.lastPan-(row.absolute?.3:(row.position+row.offset)*2/320*.3))<1e-6,JSON.stringify(row))}
  console.log('Actual own/common PlaySnd pan/abspan create real audio graphs with native recipient position/facing and absolute override for both players');
  const playedVolumes=await run(`(()=>{
   const data=[1,2].map(player=>gravityActorData(specialRoot(player))),saved={registry:characterSoundChannels,voice:roundVoiceUntil,owners:[...customStateOwners],volumes:data.map(value=>value.dataConstants['data.volume'])},rows=[];
   try{
    characterSoundChannels=createCharacterSoundChannels();data[0].dataConstants['data.volume']=128;data[1].dataConstants['data.volume']=384;
    for(const player of [1,2])for(const common of [false,true])for(const foreign of [false,true])for(const mode of ['default','volume','scale','both']){
     characterSoundChannels.stopAll();customStateOwners.fill(null);if(foreign)customStateOwners[player-1]=battleCharacters[2-player];
     const actor=specialRoot(player),profile=characterProfiles.get(battleCharacters[player-1]),key=Object.keys(profile.sounds).find(value=>/^[0-9]+-[0-9]+$/.test(value)),params={value:common?'F7,0':key.replace('-',','),channel:'7'},binding=player===1?p1LifecycleBinding:p2;
     if(mode==='volume'||mode==='both')params.volume='128';if(mode==='scale'||mode==='both')params.volumescale='50';
     executeControllerM1({type:'PlaySnd',params},binding,specialRuntime.context(actor),{owner:actor,player,schedulingApplied:true});const record=characterSoundChannels.entries()[0],before=characterSoundOutput.snapshot(record).gain;
     executeControllerM1({type:'SndPan',params:{channel:'7',abspan:'0'}},binding,specialRuntime.context(actor),{owner:actor,player,schedulingApplied:true});
     rows.push({player,common,foreign,mode,before,after:characterSoundOutput.snapshot(record).gain});
    }
    return rows;
   }finally{characterSoundChannels.stopAll();characterSoundChannels=saved.registry;roundVoiceUntil=saved.voice;customStateOwners.splice(0,2,...saved.owners);for(let index=0;index<2;index++)data[index].dataConstants['data.volume']=saved.volumes[index]}
  })()`);
  assert.equal(playedVolumes.length,32);
  for(const row of playedVolumes){const volume=row.mode==='default'?100:row.mode==='volume'?125:50,level=row.common?Math.trunc(volume*64/25):Math.trunc((row.player===1?128:384)*volume/100),expected=Math.min(512,Math.max(0,level))/256;assert.equal(row.before,expected,JSON.stringify(row));assert.equal(row.after,expected,JSON.stringify(row))}
  console.log('Actual own/common PlaySnd volume/volumescale uses recipient-owned data under foreign states and survives later SndPan in thirty-two cases');
  const stateStoppedSounds=await run(`(()=>{
   const data=[1,2].map(player=>gravityActorData(specialRoot(player))),saved={registry:characterSoundChannels,entities:[...specialRuntime.entities],definitions:data.map(value=>[value.helperStates[991980],value.helperStates[991981]])},rows=[];
   try{
    characterSoundChannels=createCharacterSoundChannels();
    for(const value of data)for(const number of [991980,991981])value.helperStates[number]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[]};
    for(const player of [1,2]){
     characterSoundChannels.stopAll();specialRuntime.entities.length=0;const root=specialRoot(player);specialRuntime.dispatch({type:'Helper',params:{stateno:991980,id:991980}},root,specialRuntime.context(root),{},root,player);const helper=specialRuntime.entities.at(-1);helper.created=combatTraceTick-1;
     for(const channel of [7,8])executeControllerM1({type:'PlaySnd',params:{value:'F7,0',channel:String(channel),stoponchangestate:channel===7?'1':'0'}},helper,specialRuntime.context(helper),{owner:helper,player,schedulingApplied:true});
     const records=[...characterSoundChannels.entries()],flagged=records.find(record=>record.channel===7),retained=records.find(record=>record.channel===8);helper.hitPause=2;specialRuntime.selectState(helper,991981,{phase:'current'});const selected=characterSoundChannels.entries().includes(flagged);specialRuntime.step();const paused=characterSoundChannels.entries().includes(flagged);helper.hitPause=0;specialRuntime.step();
     rows.push({player,selected,paused,stopped:!characterSoundChannels.entries().includes(flagged),retained:characterSoundChannels.entries().includes(retained),graphRemoved:characterSoundOutput.snapshot(flagged)===null,graphRetained:characterSoundOutput.snapshot(retained)!==null});
    }
    return rows;
   }finally{characterSoundChannels.stopAll();characterSoundChannels=saved.registry;specialRuntime.entities.splice(0,specialRuntime.entities.length,...saved.entities);for(let index=0;index<2;index++)for(const [position,number]of [991980,991981].entries()){if(saved.definitions[index][position]===undefined)delete data[index].helperStates[number];else data[index].helperStates[number]=saved.definitions[index][position]}}
  })()`);
  assert.equal(stateStoppedSounds.length,2);
  for(const row of stateStoppedSounds){assert.equal(row.selected,true,JSON.stringify(row));assert.equal(row.paused,true);assert.equal(row.stopped,true);assert.equal(row.retained,true);assert.equal(row.graphRemoved,true);assert.equal(row.graphRetained,true)}
  console.log('Actual Helper PlaySnd stoponchangestate waits for deferred initialization after hitpause and disconnects only flagged audio for P1/P2');
  const rootStateSounds=await run(`(()=>{
   const saved={registry:characterSoundChannels,tick:combatTraceTick,reaction:p1Reaction,paused:[p1HitPause,p2.hitPause,p2.hitShake,p2.attackPause]},rows=[];
   try{
    characterSoundChannels=createCharacterSoundChannels();
    for(const player of [1,2])for(const target of [0,5000]){
     characterSoundChannels.stopAll();rootStateChanges.clear();p1Reaction=null;p1HitPause=0;p2.hitPause=0;p2.hitShake=0;p2.attackPause=0;
     const actor=specialRoot(player),binding=player===1?p1LifecycleBinding:p2;
     for(const channel of [7,8])executeControllerM1({type:'PlaySnd',params:{value:'F7,0',channel:String(channel),stoponchangestate:channel===7?'1':'0'}},binding,specialRuntime.context(actor),{owner:actor,player,schedulingApplied:true});
     const flagged=characterSoundChannels.entries().find(record=>record.channel===7),retained=characterSoundChannels.entries().find(record=>record.channel===8);if(player===1)p1HitPause=2;else p2.hitPause=2;
     selectRootSourceStateM1(player,target);const selected=characterSoundChannels.entries().includes(flagged);combatTraceTick++;initializeRootSourceStateM1(player);const paused=characterSoundChannels.entries().includes(flagged);
     p1HitPause=0;p2.hitPause=0;initializeRootSourceStateM1(player);
     rows.push({player,target,selected,paused,stopped:!characterSoundChannels.entries().includes(flagged),retained:characterSoundChannels.entries().includes(retained),pending:rootStateChanges.has('root'+player),graphRemoved:characterSoundOutput.snapshot(flagged)===null});
    }
    return rows;
   }finally{characterSoundChannels.stopAll();characterSoundChannels=saved.registry;rootStateChanges.clear();combatTraceTick=saved.tick;p1Reaction=saved.reaction;[p1HitPause,p2.hitPause,p2.hitShake,p2.attackPause]=saved.paused}
  })()`);
  assert.equal(rootStateSounds.length,4);
  for(const row of rootStateSounds){assert.equal(row.selected,true,JSON.stringify(row));assert.equal(row.paused,true);assert.equal(row.stopped,true);assert.equal(row.retained,true);assert.equal(row.pending,false);assert.equal(row.graphRemoved,true)}
  console.log('Actual root/reaction deferred StateDef initialization stops only flagged audio after hitpause for P1/P2');
  const hitStoppedSounds=await run(`(()=>{
   const data=[1,2].map(player=>gravityActorData(specialRoot(player))),saved={registry:characterSoundChannels,profile:combatEngineProfile,entities:[...specialRuntime.entities],definitions:data.map(value=>value.helperStates[991995])},rows=[];
   try{
    characterSoundChannels=createCharacterSoundChannels();for(const value of data)value.helperStates[991995]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[]};
    for(const profile of ['mugen11','ikemen'])for(const player of [1,2])for(const kind of ['root','helper'])for(const guarded of [false,true])for(const reaction of [false,true])for(const aerial of [false,true]){
     combatEngineProfile=profile;characterSoundChannels.stopAll();specialRuntime.entities.length=0;let actor=specialRoot(player);const source=specialRoot(3-player);
     if(kind==='helper'){specialRuntime.dispatch({type:'Helper',params:{stateno:991995,id:991995}},actor,specialRuntime.context(actor),{},actor,player);actor=specialRuntime.entities.at(-1)}
     for(const channel of [0,7,8]){const params={value:'F7,0',channel:String(channel)};if(channel!==0)params.stopongethit=channel===7?'1':'0';executeControllerM1({type:'PlaySnd',params},kind==='helper'?actor:player===1?p1LifecycleBinding:p2,specialRuntime.context(actor),{owner:actor,player,schedulingApplied:true})}
     executeControllerM1({type:'PlaySnd',params:{value:'F7,0',channel:'0'}},3-player===1?p1LifecycleBinding:p2,specialRuntime.context(source),{owner:source,player:3-player,schedulingApplied:true});
     const records=characterSoundChannels.owned(characterSoundIdentity(actor)),opponent=characterSoundChannels.owned(characterSoundIdentity(source))[0],defender={...actor,life:1000,type:aerial?'A':'S',y:aerial?-100:0,moveType:'I',ctrl:1,hitShake:0,hitTime:-1,getHit:{},facing:-source.facing};
     const params={attr:'S,NA',damage:'10,0',hitflag:'MAFD',guardflag:'MA',pausetime:'0,0',animtype:'light','ground.type':(aerial?!reaction:reaction)?'high':'none','air.type':(aerial?reaction:!reaction)?'high':'none','ground.hittime':10,'air.hittime':10,'ground.velocity':'0,0','air.velocity':'0,0','guard.velocity':'0','guard.hittime':10,fall:0,getpower:'0,0',givepower:'0,0',unhittabletime:'0,0',sparkno:-1,'guard.sparkno':-1};
     const result=resolveGroundHitM1({...source,id:3-player,type:'S',moveType:'A'},defender,params,guarded?'stand':'none');
     rows.push({profile,player,kind,guarded,reaction,aerial,actualGuard:result.guarded,active:records.map(record=>characterSoundChannels.entries().includes(record)),graphs:records.map(record=>characterSoundOutput.snapshot(record)!==null),opponent:characterSoundChannels.entries().includes(opponent)});
    }
    return rows;
   }finally{characterSoundChannels.stopAll();characterSoundChannels=saved.registry;combatEngineProfile=saved.profile;specialRuntime.entities.splice(0,specialRuntime.entities.length,...saved.entities);for(let index=0;index<2;index++){if(saved.definitions[index]===undefined)delete data[index].helperStates[991995];else data[index].helperStates[991995]=saved.definitions[index]}}
  })()`);
  assert.equal(hitStoppedSounds.length,64);
  for(const row of hitStoppedSounds){assert.equal(row.actualGuard,row.guarded,JSON.stringify(row));assert.deepEqual(row.active,row.guarded||!row.reaction?[true,true,true]:[false,false,true],JSON.stringify(row));assert.deepEqual(row.graphs,row.active);assert.equal(row.opponent,true)}
  console.log('Actual qualified root/Helper hit resolution selects ground/air reaction types and preserves guard/None audio in sixty-four profile/player cases');
  const decodedLoops=await run(`(async()=>{
   const {createDecodedSoundFrames}=await import('./Engine/decoded-sound-frames.js'),{createSoundSampleLooper}=await import('./Engine/sound-sample-looper.js'),{decodeNativePcmWave}=await import('./Engine/native-pcm-wave.js'),rows=[];
   for(const channels of [1,2]){
    const frames=8,rate=22050,bytes=new ArrayBuffer(44+frames*channels*2),header=new DataView(bytes),word=(offset,value)=>{for(let index=0;index<value.length;index++)header.setUint8(offset+index,value.charCodeAt(index))};
    word(0,'RIFF');header.setUint32(4,bytes.byteLength-8,true);word(8,'WAVE');word(12,'fmt ');header.setUint32(16,16,true);header.setUint16(20,1,true);header.setUint16(22,channels,true);header.setUint32(24,rate,true);header.setUint32(28,rate*channels*2,true);header.setUint16(32,channels*2,true);header.setUint16(34,16,true);word(36,'data');header.setUint32(40,frames*channels*2,true);
    for(let frame=0;frame<frames;frame++)for(let channel=0;channel<channels;channel++)header.setInt16(44+(frame*channels+channel)*2,channel===0?frame*2048:-frame*1024,true);
    const decoder=new OfflineAudioContext(channels,1,rate),browserDecoded=await decoder.decodeAudioData(bytes.slice(0)),decoded=decodeNativePcmWave(bytes,decoder),metadata={sourceSampleRate:rate,sourceFrames:frames,sourceChannels:channels},source=createDecodedSoundFrames(decoded,metadata),loop=createSoundSampleLooper(source,{repeatCount:1,loopStart:2,loopEnd:6}),result=loop.read(12);
    const context=new OfflineAudioContext(2,64,rate),buffer=context.createBuffer(2,64,rate);for(const [frame,sample]of result.samples.entries()){buffer.getChannelData(0)[frame]=sample[0];buffer.getChannelData(1)[frame]=sample[1]}
    const output=context.createBufferSource();output.buffer=buffer;output.connect(context.destination);output.start();const rendered=await context.startRendering();
    const seek=createDecodedSoundFrames(decoded,metadata);seek.seek(3);rows.push({channels,length:result.samples.length,ok:result.ok,left:[...rendered.getChannelData(0)].slice(0,12),right:[...rendered.getChannelData(1)].slice(0,12),seek:seek.read(2).samples,browserFirst:browserDecoded.getChannelData(0)[1],nativeFirst:decoded.getChannelData(0)[1]});
   }
   return rows;
  })()`);
  assert.equal(decodedLoops.length,2);
  for(const row of decodedLoops){const sequence=[0,1,2,3,4,5,2,3,4,5];assert.equal(row.length,10);assert.equal(row.ok,false);assert.equal(row.nativeFirst,1/16);assert.ok(Number.isFinite(row.browserFirst));assert.deepEqual(row.left,[...sequence.map(frame=>frame/16),0,0]);assert.deepEqual(row.right,[...sequence.map(frame=>row.channels===1||frame===0?frame/16:-frame/32),0,0]);assert.deepEqual(row.seek,[3,4].map(frame=>[frame/16,row.channels===1?frame/16:-frame/32]))}
  console.log('Actual WAV decode, native-frame finite-loop/seek and offline waveform rendering preserve exact mono/stereo sample positions');
  const compressedFrames=await run(`(async()=>{
   const {createDecodedSoundFrames}=await import('./Engine/decoded-sound-frames.js'),{createNativeSoundLoader}=await import('./Engine/native-sound-loader.js'),rows=[];let requests=0;const loader=createNativeSoundLoader({fetchAudio:url=>{requests++;return fetch(url)}});
   for(const [character,base]of [['Moon','./Char/Moon/Sound/'],['Jupiter','./Char/Jupiter/Sound/'],['Neptune','./Char/Neptune/Sound/'],['Saturn','./Char/Saturn/Sound/'],['Venus','./Char/Venus/Sound/'],['Common','./Sound/Common/']]){
    const response=await fetch(base+'sounds.json');if(!response.ok)throw Error('Sound metadata HTTP '+response.status);const sounds=await response.json();
    for(const [key,metadata]of Object.entries(sounds)){
     const url=base+(metadata.nativeFile??metadata.file);let decoded;if(rows.length===0){const controller=new AbortController(),cancelled=loader.load(url,metadata,{signal:controller.signal}),shared=loader.load(url,metadata);controller.abort();let aborted=false;try{await cancelled}catch(error){aborted=error.name==='AbortError'}if(!aborted)throw Error('Native sound consumer did not cancel');decoded=await shared}else decoded=await loader.load(url,metadata);if(await loader.load(url,metadata)!==decoded)throw Error('Native sound cache replaced decoded buffer');let validationError=null;try{createDecodedSoundFrames(decoded,metadata)}catch(error){validationError=error.message}
     rows.push({character,key,nativeVariant:!!metadata.nativeFile,rate:decoded.sampleRate,expectedRate:metadata.sourceSampleRate,frames:decoded.length,expectedFrames:metadata.sourceFrames,channels:decoded.numberOfChannels,expectedChannels:metadata.sourceChannels,validationError});
    }
   }
   if(requests!==338||loader.size()!==338)throw Error('Unexpected native decode cache size/request count');return rows;
  })()`);
  console.log('Compressed native-frame mismatch inventory',JSON.stringify(compressedFrames.filter(row=>row.validationError)));
  assert.equal(compressedFrames.length,338);assert.equal(compressedFrames.filter(row=>row.nativeVariant).length,22);for(const row of compressedFrames){assert.equal(row.rate,row.expectedRate,JSON.stringify(row));assert.equal(row.frames,row.expectedFrames,JSON.stringify(row));assert.equal(row.channels,row.expectedChannels,JSON.stringify(row));assert.equal(row.validationError,null,JSON.stringify(row))}
  console.log('All 338 existing character/common sounds decode at exact native frame counts/rates/channels with verified PCM/lossless hashes and no padding guesses');
  const workletStreams=await run(`(async()=>{
   const cases=[['once',{}],['fast',{freqMul:2}],['half',{freqMul:.5,quality:1}],['seek',{startPosition:3}],['invalid-seek',{startPosition:99}],['loop',{loopCount:2,loopStart:2,loopEnd:6}],['fast-loop',{loopCount:2,loopStart:2,loopEnd:6,freqMul:2}],['endless',{loopCount:-1,loopStart:2,loopEnd:6}],['half-loop',{loopCount:2,loopStart:2,loopEnd:6,freqMul:.5,quality:1}]],rows=[];
   for(const count of [1,2])for(const [name,params]of cases){
    const context=new OfflineAudioContext(2,64,22050);await context.audioWorklet.addModule('./Engine/sound-playback-worklet.js');const channels=Array.from({length:count},(_,channel)=>Float32Array.from({length:8},(_,frame)=>channel===0?frame/16:frame===0?0:-frame/32));
    const node=new AudioWorkletNode(context,'palace-native-sound',{numberOfInputs:0,numberOfOutputs:1,outputChannelCount:[2],processorOptions:{channels,metadata:{sourceSampleRate:22050,sourceFrames:8,sourceChannels:count},params}});let finish;const ended=new Promise(resolve=>{finish=resolve});node.port.onmessage=event=>{if(event.data.type==='ended')finish(event.data.frames)};node.connect(context.destination);const rendered=await context.startRendering();
    const frames=name==='endless'?null:await Promise.race([ended,new Promise((resolve,reject)=>setTimeout(()=>reject(Error('Missing worklet completion '+name)),2000))]);rows.push({count,name,frames,left:[...rendered.getChannelData(0)],right:[...rendered.getChannelData(1)]});node.disconnect();node.port.close();
   }
   return rows;
  })()`);
  const plain=[0,1,2,3,4,5,6,7],looped=[0,1,2,3,4,5,2,3,4,5],halved=values=>Array.from({length:values.length*2},(_,index)=>{const frame=Math.floor(index/2);return values[frame]+(index%2)*.5*((values[frame+1]??values[frame])-values[frame])}),expectedStreams={once:plain,fast:[0,2,4,6],half:halved(plain),seek:[3,4,5,6,7],'invalid-seek':plain,loop:looped,'fast-loop':[0,2,4,2,4],endless:Array.from({length:64},(_,index)=>index<6?index:2+(index-6)%4),'half-loop':halved(looped)};
  assert.equal(workletStreams.length,18);
  for(const row of workletStreams){const values=expectedStreams[row.name];assert.equal(row.frames,row.name==='endless'?null:values.length,JSON.stringify({name:row.name,count:row.count}));for(let frame=0;frame<64;frame++){const value=values[frame]??0;assert.ok(Math.abs(row.left[frame]-value/16)<1e-7,JSON.stringify({name:row.name,count:row.count,frame}));assert.ok(Math.abs(row.right[frame]-(row.count===1?value/16:-value/32))<1e-7,JSON.stringify({name:row.name,count:row.count,frame}))}}
  console.log('Actual AudioWorklet renders native speed, finite/infinite loop, seek and completion semantics for mono/stereo in eighteen cases');
  const nativeChannelPlayback=await run(`(async()=>{
   const {createNativeSoundLoader}=await import('./Engine/native-sound-loader.js'),{createNativeSoundPlayer}=await import('./Engine/native-sound-player.js'),{createCharacterSoundOutput}=await import('./Engine/character-sound-output.js'),metadata=(await (await fetch('./Char/Moon/Sound/sounds.json')).json())['0-25'],url='./Char/Moon/Sound/'+metadata.nativeFile,loader=createNativeSoundLoader(),decoded=await loader.load(url,metadata),rows=[];
   for(const mode of ['play','cancel','replace']){
    const context=new OfflineAudioContext(2,64,metadata.sourceSampleRate),channels=createCharacterSoundChannels(),errors=[],output=createCharacterSoundOutput({createContext:()=>context,view:()=>({width:320,strength:30,stereo:true}),sourcePosition:()=>null,onError:error=>errors.push(error.message)}),player=createNativeSoundPlayer({loader,isActive:record=>channels.entries().includes(record)});let ended=0;
    const create=volume=>{const sound=new Audio();sound.volume=volume;let record;record=channels.add('character:1',7,sound,()=>{player.stop(record);output.release(record)});record.nativePlayback=true;output.setPan(record,{pan:0,sourceId:-1},.5);return record};
    const start=record=>player.play(record,{context:output.contextFor(record),url,metadata,params:{startPosition:metadata.sourceFrames-8},attach:(record,node)=>output.attach(record,node),onEnded:record=>{ended++;channels.release(record)},onError:error=>{errors.push(error.message);channels.release(record)}});
    const first=create(.25),initial=start(first);let ready,oldReady=null;
    if(mode==='cancel'){channels.stopOwner('character:1',7);ready=await initial.ready}
    else if(mode==='replace'){const replacement=create(.5),next=start(replacement);oldReady=await initial.ready;ready=await next.ready}
    else ready=await initial.ready;
    const active=channels.entries().length,players=player.size(),graphs=output.size(),rendered=await context.startRendering();if(mode!=='cancel')await new Promise(resolve=>setTimeout(resolve,0));
    rows.push({mode,ready,oldReady,active,players,graphs,ended,remaining:channels.entries().length,remainingPlayers:player.size(),remainingGraphs:output.size(),errors,left:[...rendered.getChannelData(0)],right:[...rendered.getChannelData(1)],expectedLeft:[...decoded.getChannelData(0)].slice(-8),expectedRight:[...decoded.getChannelData(1)].slice(-8)});channels.stopAll();
   }
   return rows;
  })()`);
  assert.equal(nativeChannelPlayback.length,3);
  for(const row of nativeChannelPlayback){const cancelled=row.mode==='cancel',gain=row.mode==='replace'?.25:.125;assert.equal(row.ready,!cancelled,JSON.stringify(row));if(row.mode==='replace')assert.equal(row.oldReady,false);assert.equal(row.active,cancelled?0:1);assert.equal(row.players,cancelled?0:1);assert.equal(row.graphs,cancelled?0:1);assert.equal(row.ended,cancelled?0:1);assert.equal(row.remaining,0);assert.equal(row.remainingPlayers,0);assert.equal(row.remainingGraphs,0);assert.deepEqual(row.errors,[]);for(let frame=0;frame<64;frame++){assert.equal(row.left[frame],cancelled||frame>=8?0:row.expectedLeft[frame]*gain,JSON.stringify({mode:row.mode,frame}));assert.equal(row.right[frame],cancelled||frame>=8?0:row.expectedRight[frame]*gain,JSON.stringify({mode:row.mode,frame}))}}
  console.log('Actual native player/registry/mixer renders owned gain, prevents cancelled/replaced late playback and clears finite completion without stale audio');
  const rejectedSoundCleanup=await run(`(()=>{
   const saved={sound:gameShell.sound,release:gameShell.releaseSound,channels:characterSoundChannels,voice:roundVoiceUntil},rows=[],created=[],released=new Set();
   try{
    gameShell.sound=sound=>{created.push(sound);return saved.sound(sound)};gameShell.releaseSound=sound=>{released.add(sound);return saved.release(sound)};
    for(const player of [1,2])for(const common of [false,true]){
     characterSoundChannels=createCharacterSoundChannels();const actor=specialRoot(player),profile=characterProfiles.get(battleCharacters[player-1]),key=Object.keys(profile.sounds).find(value=>/^[0-9]+-[0-9]+$/.test(value)),start=created.length;
     const dispatch=controller=>executeControllerM1(controller,player===1?p1LifecycleBinding:p2,specialRuntime.context(actor),{owner:actor,player,schedulingApplied:true});
     for(const options of [{priority:'5'},{priority:'4'},{priority:'6',lowpriority:'1'}])dispatch({type:'PlaySnd',params:{value:common?'F7,0':key.replace('-',','),channel:'7',...options}});
     const media=created.slice(start),before=media.filter(sound=>released.has(sound)).length,active=characterSoundChannels.entries().length;
     dispatch({type:'StopSnd',params:{channel:'7'}});rows.push({player,common,created:media.length,before,active,after:media.filter(sound=>released.has(sound)).length,remaining:characterSoundChannels.entries().length});
    }
    return rows;
   }finally{characterSoundChannels.stopAll();characterSoundChannels=saved.channels;gameShell.sound=saved.sound;gameShell.releaseSound=saved.release;roundVoiceUntil=saved.voice}
  })()`);
  assert.equal(rejectedSoundCleanup.length,4);
  for(const row of rejectedSoundCleanup){assert.equal(row.created,3);assert.equal(row.before,2,JSON.stringify(row));assert.equal(row.active,1);assert.equal(row.after,3);assert.equal(row.remaining,0)}
  console.log('Actual rejected PlaySnd allocations release menu tracking while preserving the live higher-priority channel for P1/P2 own/common sounds');
  const nullSoundContexts=await run(`(()=>{
   const before=characterSoundChannels.entries().length,players=[];
   for(const player of [1,2]){const actor=specialRoot(player);executeControllerM1({type:'PlaySnd',params:{value:'-1,0',loop:'1'}},player===1?p1LifecycleBinding:p2,null,{owner:actor,player,schedulingApplied:true});players.push(player)}
   return {players,before,after:characterSoundChannels.entries().length};
  })()`);
  assert.deepEqual(nullSoundContexts.players,[1,2]);assert.equal(nullSoundContexts.after,nullSoundContexts.before);
  console.log('Actual PlaySnd accepts omitted expression contexts in both root directions and retains negative-group rejection');
  const nativePlaySnd=await run(`(async()=>{
   const saved={channels:characterSoundChannels,output:characterSoundOutput,player:nativeSoundPlayer,voice:roundVoiceUntil},rows=[];
   try{
    for(const player of [1,2])for(const common of [false,true])for(const cancel of [false,true])for(const finiteLoop of [false,true]){
     characterSoundChannels=createCharacterSoundChannels();const actor=specialRoot(player),profile=characterProfiles.get(battleCharacters[player-1]),key=common?'7-0':Object.keys(profile.sounds).find(value=>/^[0-9]+-[0-9]+$/.test(value)),metadata=common?commonSoundManifest[key]:profile.sounds[key],context=new OfflineAudioContext(2,64,metadata.sourceSampleRate);
     characterSoundOutput=createCharacterSoundOutput({createContext:()=>context,view:()=>({width:320,strength:30,stereo:true}),sourcePosition:()=>null});nativeSoundPlayer=createNativeSoundPlayer({loader:nativeSoundLoader,isActive:record=>!!record.soundRegistry?.has(record)});
     executeControllerM1({type:'PlaySnd',params:{value:(common?'F':'')+key.replace('-',','),channel:'7',freqmul:common?'1':'2',startposition:String(metadata.sourceFrames-8),...(finiteLoop?{loopcount:'2',loopstart:String(metadata.sourceFrames-6),loopend:String(metadata.sourceFrames-2)}:{}),abspan:'0',volumescale:'100'}},player===1?p1LifecycleBinding:p2,specialRuntime.context(actor),{owner:actor,player,schedulingApplied:true});
     const record=characterSoundChannels.entries()[0];record.sound.volume=1;characterSoundOutput.update();if(cancel)executeControllerM1({type:'StopSnd',params:{channel:'7'}},player===1?p1LifecycleBinding:p2,specialRuntime.context(actor),{owner:actor,player,schedulingApplied:true});
     const ready=await record.nativeReady,snapshot=characterSoundOutput.snapshot(record),descriptor=record.nativePlayback,decoded=await nativeSoundLoader.load(descriptor.url,descriptor.metadata),rendered=await context.startRendering();await new Promise(resolve=>setTimeout(resolve,0));
     const ownVolume=gravityActorData(actor).dataConstants['data.volume'],gain=common?1:Math.min(512,Math.max(0,ownVolume))/256;
     rows.push({player,common,cancel,finiteLoop,ready,native:!!record.nativePlayback,attached:snapshot?.attached??false,remaining:characterSoundChannels.entries().length,players:nativeSoundPlayer.size(),graphs:characterSoundOutput.size(),gain,left:[...rendered.getChannelData(0)],right:[...rendered.getChannelData(1)],sourceLeft:[...decoded.getChannelData(0)].slice(-8),sourceRight:[...decoded.getChannelData(metadata.sourceChannels===1?0:1)].slice(-8)});characterSoundChannels.stopAll();
    }
    return rows;
   }finally{characterSoundChannels.stopAll();characterSoundChannels=saved.channels;characterSoundOutput=saved.output;nativeSoundPlayer=saved.player;roundVoiceUntil=saved.voice}
  })()`);
  assert.equal(nativePlaySnd.length,16);
  for(const row of nativePlaySnd){assert.equal(row.ready,!row.cancel);assert.equal(row.native,true);assert.equal(row.attached,!row.cancel);assert.equal(row.remaining,0);assert.equal(row.players,0);assert.equal(row.graphs,0);const sequence=row.finiteLoop?[0,1,2,3,4,5,2,3,4,5]:[0,1,2,3,4,5,6,7],step=row.common?1:2;for(let frame=0;frame<64;frame++){const sourceIndex=sequence[frame*step],detail=JSON.stringify({player:row.player,common:row.common,cancel:row.cancel,finiteLoop:row.finiteLoop,frame});assert.equal(row.left[frame],row.cancel||sourceIndex===undefined?0:Math.fround(row.sourceLeft[sourceIndex]*row.gain),detail);assert.equal(row.right[frame],row.cancel||sourceIndex===undefined?0:Math.fround(row.sourceRight[sourceIndex]*row.gain),detail)}}
  console.log('Actual PlaySnd own/common dispatch reaches native worklet speed/seek/finite-loop output and StopSnd prevents late playback for P1/P2 in sixteen cases');
  const repeatedSoundPreparation=await run(`(async()=>{
   const players=[...battleCharacters],savedFetch=window.fetch,requests=[];
   await prepareCharacters(players);
   const before=nativeSoundLoader.size(),resources=[...new Set(players)].flatMap(character=>{const profile=characterProfiles.get(character);return Object.values(profile.sounds).map(metadata=>profile.soundBase+(metadata.nativeFile??metadata.file))}).concat(Object.values(commonSoundManifest).map(metadata=>'./Sound/Common/'+(metadata.nativeFile??metadata.file)));
   try{
    window.fetch=(input,...options)=>{const url=String(input?.url??input);if(/\\.(flac|mp3|wav)(\\?|$)/i.test(url))requests.push(url);return savedFetch(input,...options)};
    await prepareCharacters(players);
    return {before,after:nativeSoundLoader.size(),resources:new Set(resources).size,requests,players:[...battleCharacters],sampleRate:characterSoundOutput.prepare().sampleRate};
   }finally{window.fetch=savedFetch}
  })()`);
  assert.ok(repeatedSoundPreparation.resources>4);assert.ok(repeatedSoundPreparation.before>=repeatedSoundPreparation.resources);assert.equal(repeatedSoundPreparation.after,repeatedSoundPreparation.before);assert.deepEqual(repeatedSoundPreparation.requests,[]);assert.equal(repeatedSoundPreparation.sampleRate,44100);
  console.log('Actual repeated character preparation reuses decoded own/common sound caches without new audio fetches');
  const redirectedNativeSound=await run(`(async()=>{
   const data=[1,2].map(player=>gravityActorData(specialRoot(player))),saved={channels:characterSoundChannels,output:characterSoundOutput,player:nativeSoundPlayer,voice:roundVoiceUntil,volumes:data.map(value=>value.dataConstants['data.volume']),variables:[specialRoot(1).vars[19],specialRoot(2).vars[19]],entities:[...specialRuntime.entities],definitions:data.map(value=>value.helperStates[991975])},rows=[];
   try{
    for(const value of data)value.helperStates[991975]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[]};
    for(const callerPlayer of [1,2])for(const common of [false,true])for(const kind of ['root','helper'])for(const syntax of ['lexical','dynamic','omitted']){
     specialRuntime.entities.length=0;
     const targetPlayer=3-callerPlayer,caller=specialRoot(callerPlayer),root=specialRoot(targetPlayer),profile=characterProfiles.get(battleCharacters[targetPlayer-1]),key=common?'7-0':Object.keys(profile.sounds).find(value=>/^[0-9]+-0$/.test(value)),metadata=common?commonSoundManifest[key]:profile.sounds[key],context=new OfflineAudioContext(2,64,metadata.sourceSampleRate);
     let target=root;if(kind==='helper'){specialRuntime.dispatch({type:'Helper',params:{stateno:991975,id:991975}},root,specialRuntime.context(root),{},root,targetPlayer);target=specialRuntime.entities.at(-1)}
     caller.vars[19]=50;target.vars[19]=120;data[callerPlayer-1].dataConstants['data.volume']=128;data[targetPlayer-1].dataConstants['data.volume']=384;
     characterSoundChannels=createCharacterSoundChannels();characterSoundOutput=createCharacterSoundOutput({createContext:()=>context,view:()=>({width:320,strength:30,stereo:true}),sourcePosition:()=>null});nativeSoundPlayer=createNativeSoundPlayer({loader:nativeSoundLoader,isActive:record=>!!record.soundRegistry?.has(record)});
     const group='var(19)/50*'+key.split('-')[0],value=syntax==='dynamic'?(common?'"F",':'"S",')+group+',0':(common?'F':'S')+group+(syntax==='omitted'?'':',0');
     executeControllerM1({type:'PlaySnd',params:{redirectid:String(kind==='helper'?target.instanceId:targetPlayer),value,channel:'7',abspan:'0',volumescale:'var(19)'}},callerPlayer===1?p1LifecycleBinding:p2,specialRuntime.context(caller),{owner:caller,player:callerPlayer,schedulingApplied:true});
     const record=characterSoundChannels.entries()[0];record.sound.volume=1;characterSoundOutput.update();const ready=await record.nativeReady,descriptor=record.nativePlayback,decoded=await nativeSoundLoader.load(descriptor.url,descriptor.metadata),rendered=await context.startRendering();
     rows.push({callerPlayer,targetPlayer,common,kind,ready,owner:record.owner,expectedOwner:characterSoundIdentity(target),resource:descriptor.url===(common?'./Sound/Common/':profile.soundBase)+(metadata.nativeFile??metadata.file),gain:characterSoundOutput.snapshot(record).gain,left:[...rendered.getChannelData(0)],right:[...rendered.getChannelData(1)],sourceLeft:[...decoded.getChannelData(0)].slice(0,64),sourceRight:[...decoded.getChannelData(metadata.sourceChannels===1?0:1)].slice(0,64)});characterSoundChannels.stopAll();
    }
    return rows;
   }finally{characterSoundChannels.stopAll();characterSoundChannels=saved.channels;characterSoundOutput=saved.output;nativeSoundPlayer=saved.player;roundVoiceUntil=saved.voice;specialRuntime.entities.splice(0,specialRuntime.entities.length,...saved.entities);for(let index=0;index<2;index++){data[index].dataConstants['data.volume']=saved.volumes[index];specialRoot(index+1).vars[19]=saved.variables[index];if(saved.definitions[index]===undefined)delete data[index].helperStates[991975];else data[index].helperStates[991975]=saved.definitions[index]}}
  })()`);
  assert.equal(redirectedNativeSound.length,24);
  for(const row of redirectedNativeSound){assert.equal(row.ready,true);assert.equal(row.owner,row.expectedOwner);assert.equal(row.resource,true);const gain=row.common?.5:.75;assert.equal(row.gain,gain);for(let frame=0;frame<64;frame++){const detail=JSON.stringify({caller:row.callerPlayer,common:row.common,kind:row.kind,frame});assert.equal(row.left[frame],Math.fround(row.sourceLeft[frame]*gain),detail);assert.equal(row.right[frame],Math.fround(row.sourceRight[frame]*gain),detail)}}
  console.log('Twenty-four actual redirected root/normal-Helper PlaySnd waveform cases cover lexical/dynamic prefixes and omitted item defaults in both player directions');
  const defaultPlaySnd=await run(`(async()=>{
   const saved={channels:characterSoundChannels,output:characterSoundOutput,player:nativeSoundPlayer,voice:roundVoiceUntil},rows=[];
   try{
    for(const player of [1,2])for(const common of [false,true]){
     characterSoundChannels=createCharacterSoundChannels();const actor=specialRoot(player),profile=characterProfiles.get(battleCharacters[player-1]),key=common?'7-0':Object.keys(profile.sounds).find(value=>/^[0-9]+-[0-9]+$/.test(value)),metadata=common?commonSoundManifest[key]:profile.sounds[key],context=new OfflineAudioContext(2,64,metadata.sourceSampleRate);
     characterSoundOutput=createCharacterSoundOutput({createContext:()=>context,view:()=>({width:320,strength:30,stereo:true}),sourcePosition:()=>null});nativeSoundPlayer=createNativeSoundPlayer({loader:nativeSoundLoader,isActive:record=>!!record.soundRegistry?.has(record)});
     const dispatch=controller=>executeControllerM1(controller,player===1?p1LifecycleBinding:p2,specialRuntime.context(actor),{owner:actor,player,schedulingApplied:true});
     dispatch({type:'PlaySnd',params:{value:(common?'F':'')+key.replace('-',','),channel:'7',abspan:'0',volumescale:'100'}});
     const record=characterSoundChannels.entries()[0];record.sound.volume=1;characterSoundOutput.update();const ready=await record.nativeReady,descriptor=record.nativePlayback,decoded=await nativeSoundLoader.load(descriptor.url,descriptor.metadata),rendered=await context.startRendering();
     dispatch({type:'StopSnd',params:{channel:'7'}});
     rows.push({player,common,ready,params:descriptor.params,remaining:characterSoundChannels.entries().length,players:nativeSoundPlayer.size(),graphs:characterSoundOutput.size(),gain:common?1:Math.min(512,Math.max(0,gravityActorData(actor).dataConstants['data.volume']))/256,left:[...rendered.getChannelData(0)],right:[...rendered.getChannelData(1)],sourceLeft:[...decoded.getChannelData(0)].slice(0,64),sourceRight:[...decoded.getChannelData(metadata.sourceChannels===1?0:1)].slice(0,64)});
    }
    return rows;
   }finally{characterSoundChannels.stopAll();characterSoundChannels=saved.channels;characterSoundOutput=saved.output;nativeSoundPlayer=saved.player;roundVoiceUntil=saved.voice}
  })()`);
  assert.equal(defaultPlaySnd.length,4);
  for(const row of defaultPlaySnd){assert.equal(row.ready,true);assert.deepEqual(row.params,{freqMul:1,loopCount:0,loopStart:0,loopEnd:0,startPosition:0});assert.equal(row.remaining,0);assert.equal(row.players,0);assert.equal(row.graphs,0);assert.equal(row.sourceLeft.length,64);for(let frame=0;frame<64;frame++){const detail=JSON.stringify({player:row.player,common:row.common,frame});assert.equal(row.left[frame],Math.fround(row.sourceLeft[frame]*row.gain),detail);assert.equal(row.right[frame],Math.fround(row.sourceRight[frame]*row.gain),detail)}}
  console.log('Actual PlaySnd with omitted playback parameters renders exact source-start samples through native defaults for P1/P2 own/common sounds');
  const modifiedHelperOwnership=await run(`(()=>{
   const data=[1,2].map(player=>gravityActorData(specialRoot(player))),saved={channels:characterSoundChannels,entities:[...specialRuntime.entities],definitions:data.map(value=>value.helperStates[991985])},rows=[];
   try{
    for(const value of data)value.helperStates[991985]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[]};
    for(const callerPlayer of [1,2])for(const inheritance of [0,1,2]){
     characterSoundChannels=createCharacterSoundChannels();specialRuntime.entities.length=0;const caller=specialRoot(callerPlayer),targetRoot=specialRoot(3-callerPlayer);
     specialRuntime.dispatch({type:'Helper',params:{stateno:991985,id:991985}},targetRoot,specialRuntime.context(targetRoot),{},targetRoot,3-callerPlayer);const parent=specialRuntime.entities.at(-1);
     specialRuntime.dispatch({type:'Helper',params:{stateno:991985,id:991985,inheritchannels:String(inheritance)}},parent,specialRuntime.context(parent),{},parent,3-callerPlayer);const child=specialRuntime.entities.at(-1);
     const dispatch=(controller,actor)=>executeControllerM1(controller,actor.kind==='helper'?actor:actor.player===1?p1LifecycleBinding:p2,specialRuntime.context(actor),{owner:actor,player:actor.player,schedulingApplied:true});
     dispatch({type:'PlaySnd',params:{value:'F7,0',channel:'7',abspan:'0',priority:'3'}},caller);const peer=characterSoundChannels.entries().at(-1);
     dispatch({type:'PlaySnd',params:{value:'F7,0',channel:'7',abspan:'0'}},child);const voice=characterSoundChannels.entries().at(-1);
     dispatch({type:'ModifySnd',params:{redirectid:String(child.instanceId),abspan:'80',priority:'9',stopongethit:'1',stoponchangestate:'1'}},caller);
     rows.push({callerPlayer,inheritance,owner:voice.owner,expectedOwner:characterSoundIdentity(inheritance===1?parent:inheritance===2?targetRoot:child),priority:voice.priority,pan:characterSoundOutput.snapshot(voice).pan,flags:voice.stopFlags,peerPriority:peer.priority,peerPan:characterSoundOutput.snapshot(peer).pan,count:characterSoundChannels.entries().length});characterSoundChannels.stopAll();
    }
    return rows;
   }finally{characterSoundChannels.stopAll();characterSoundChannels=saved.channels;specialRuntime.entities.splice(0,specialRuntime.entities.length,...saved.entities);for(let index=0;index<2;index++){if(saved.definitions[index]===undefined)delete data[index].helperStates[991985];else data[index].helperStates[991985]=saved.definitions[index]}}
  })()`);
  assert.equal(modifiedHelperOwnership.length,6);
  for(const row of modifiedHelperOwnership){assert.equal(row.owner,row.expectedOwner);assert.equal(row.priority,row.inheritance===0?9:0);assert.equal(row.pan,row.inheritance===0?80:0);assert.deepEqual(row.flags,{hit:row.inheritance===0,state:row.inheritance===0});assert.equal(row.peerPriority,3);assert.equal(row.peerPan,0);assert.equal(row.count,2)}
  console.log('Actual redirected ModifySnd selects only normal-Helper owned channels, never re-inherits parent/root voices or changes opposing audio');
  const modifiedSoundOutput=await run(`(async()=>{
   const saved={channels:characterSoundChannels,output:characterSoundOutput,player:nativeSoundPlayer,voice:roundVoiceUntil},rows=[];
   try{
    for(const player of [1,2])for(const common of [false,true])for(const mode of ['volume','scale']){
     characterSoundChannels=createCharacterSoundChannels();const actor=specialRoot(player),profile=characterProfiles.get(battleCharacters[player-1]),key=common?'7-0':Object.keys(profile.sounds).find(value=>/^[0-9]+-[0-9]+$/.test(value)),metadata=common?commonSoundManifest[key]:profile.sounds[key],context=new OfflineAudioContext(2,64,metadata.sourceSampleRate);
     characterSoundOutput=createCharacterSoundOutput({createContext:()=>context,view:()=>({width:320,strength:30,stereo:true}),sourcePosition:()=>null});nativeSoundPlayer=createNativeSoundPlayer({loader:nativeSoundLoader,isActive:record=>!!record.soundRegistry?.has(record)});
     const dispatch=controller=>executeControllerM1(controller,player===1?p1LifecycleBinding:p2,specialRuntime.context(actor),{owner:actor,player,schedulingApplied:true});
     dispatch({type:'PlaySnd',params:{value:(common?'F':'')+key.replace('-',','),channel:'7',abspan:'160'}});
     const record=characterSoundChannels.entries()[0];record.sound.volume=1;characterSoundOutput.update();const ready=await record.nativeReady;
     dispatch({type:'ModifySnd',params:{channel:'7',...(mode==='volume'?{volume:'-128'}:{volumescale:'25'}),priority:'9',stopongethit:'1',stoponchangestate:'0'}});
     const snapshot=characterSoundOutput.snapshot(record),descriptor=record.nativePlayback,decoded=await nativeSoundLoader.load(descriptor.url,descriptor.metadata),rendered=await context.startRendering();
     rows.push({player,common,mode,ready,snapshot,priority:record.priority,flags:record.stopFlags,ownVolume:gravityActorData(actor).dataConstants['data.volume'],left:[...rendered.getChannelData(0)],right:[...rendered.getChannelData(1)],sourceLeft:[...decoded.getChannelData(0)].slice(0,64),sourceRight:[...decoded.getChannelData(metadata.sourceChannels===1?0:1)].slice(0,64)});characterSoundChannels.stopAll();
    }
    return rows;
   }finally{characterSoundChannels.stopAll();characterSoundChannels=saved.channels;characterSoundOutput=saved.output;nativeSoundPlayer=saved.player;roundVoiceUntil=saved.voice}
  })()`);
  assert.equal(modifiedSoundOutput.length,8);
  for(const row of modifiedSoundOutput){assert.equal(row.ready,true);assert.equal(row.snapshot.pan,160);assert.equal(row.snapshot.sourceId,-1);assert.equal(row.priority,9);assert.deepEqual(row.flags,{hit:true,state:false});const gain=row.mode==='volume'?1.5:Math.fround(Math.max(0,Math.min(512,Math.trunc((row.ownVolume*25|0)/100)))/256),pan=Math.fround(.3),left=Math.fround(gain*Math.fround(1-pan)),right=Math.fround(gain*Math.fround(1+pan));assert.equal(row.snapshot.gain,gain);for(let frame=0;frame<64;frame++){const detail=JSON.stringify({player:row.player,common:row.common,mode:row.mode,frame});assert.equal(row.left[frame],Math.fround(row.sourceLeft[frame]*left),detail);assert.equal(row.right[frame],Math.fround(row.sourceRight[frame]*right),detail)}}
  console.log('Eight actual ModifySnd volume/scale waveform cases preserve existing absolute pan and update native priority/stop flags for P1/P2 own/common sounds');
  const modifiedFrequency=await run(`(async()=>{
   const saved={channels:characterSoundChannels,output:characterSoundOutput,player:nativeSoundPlayer,voice:roundVoiceUntil},rows=[];
   try{
    for(const player of [1,2])for(const common of [false,true])for(const afterReady of [false,true])for(const control of ['frequency','position']){
     characterSoundChannels=createCharacterSoundChannels();const actor=specialRoot(player),profile=characterProfiles.get(battleCharacters[player-1]),key=common?'7-0':Object.keys(profile.sounds).find(value=>/^[0-9]+-[0-9]+$/.test(value)),metadata=common?commonSoundManifest[key]:profile.sounds[key],context=new OfflineAudioContext(2,64,metadata.sourceSampleRate),step=control==='frequency'?(common?5:2):1,position=control==='position'?5:0;
     characterSoundOutput=createCharacterSoundOutput({createContext:()=>context,view:()=>({width:320,strength:30,stereo:true}),sourcePosition:()=>null});nativeSoundPlayer=createNativeSoundPlayer({loader:nativeSoundLoader,isActive:record=>!!record.soundRegistry?.has(record)});
     const dispatch=controller=>executeControllerM1(controller,player===1?p1LifecycleBinding:p2,specialRuntime.context(actor),{owner:actor,player,schedulingApplied:true});
     dispatch({type:'PlaySnd',params:{value:(common?'F':'')+key.replace('-',','),channel:'7',abspan:'0',volumescale:'100'}});
     const record=characterSoundChannels.entries()[0];record.sound.volume=1;characterSoundOutput.update();if(afterReady)await record.nativeReady;
     dispatch({type:'ModifySnd',params:{channel:'7',...(control==='frequency'?{freqmul:String(step)}:{position:String(position)})}});
     let timer;try{await Promise.race([nativeSoundPlayer.settled(record),new Promise((resolve,reject)=>{timer=setTimeout(()=>reject(Error('Native frequency acknowledgement timed out')),5000)})])}finally{clearTimeout(timer)}
     const ready=await record.nativeReady,descriptor=record.nativePlayback,decoded=await nativeSoundLoader.load(descriptor.url,descriptor.metadata),rendered=await context.startRendering();
     rows.push({player,common,afterReady,control,position,step,ready,gain:characterSoundOutput.snapshot(record).gain,left:[...rendered.getChannelData(0)],right:[...rendered.getChannelData(1)],sourceLeft:[...decoded.getChannelData(0)].slice(0,320),sourceRight:[...decoded.getChannelData(metadata.sourceChannels===1?0:1)].slice(0,320)});characterSoundChannels.stopAll();
    }
    return rows;
   }finally{characterSoundChannels.stopAll();characterSoundChannels=saved.channels;characterSoundOutput=saved.output;nativeSoundPlayer=saved.player;roundVoiceUntil=saved.voice}
  })()`);
  assert.equal(modifiedFrequency.length,16);
  for(const row of modifiedFrequency){assert.equal(row.ready,true);for(let frame=0;frame<64;frame++){const detail=JSON.stringify({player:row.player,common:row.common,afterReady:row.afterReady,control:row.control,frame});assert.equal(row.left[frame],Math.fround(row.sourceLeft[frame*row.step+row.position]*row.gain),detail);assert.equal(row.right[frame],Math.fround(row.sourceRight[frame*row.step+row.position]*row.gain),detail)}}
  console.log('Sixteen actual ModifySnd frequency/position cases reach pending and attached native voices with exact P1/P2 own/common sample output');
  const modifiedLoops=await run(`(async()=>{
   const saved={channels:characterSoundChannels,output:characterSoundOutput,player:nativeSoundPlayer,voice:roundVoiceUntil},rows=[];
   try{
    for(const player of [1,2])for(const common of [false,true])for(const afterReady of [false,true])for(const infinite of [false,true]){
     characterSoundChannels=createCharacterSoundChannels();const actor=specialRoot(player),profile=characterProfiles.get(battleCharacters[player-1]),key=common?'7-0':Object.keys(profile.sounds).find(value=>/^[0-9]+-[0-9]+$/.test(value)),metadata=common?commonSoundManifest[key]:profile.sounds[key],context=new OfflineAudioContext(2,64,metadata.sourceSampleRate);
     characterSoundOutput=createCharacterSoundOutput({createContext:()=>context,view:()=>({width:320,strength:30,stereo:true}),sourcePosition:()=>null});nativeSoundPlayer=createNativeSoundPlayer({loader:nativeSoundLoader,isActive:record=>!!record.soundRegistry?.has(record)});
     const dispatch=controller=>executeControllerM1(controller,player===1?p1LifecycleBinding:p2,specialRuntime.context(actor),{owner:actor,player,schedulingApplied:true});
     dispatch({type:'PlaySnd',params:{value:(common?'F':'')+key.replace('-',','),channel:'7',abspan:'0',volumescale:'100',startposition:String(metadata.sourceFrames-8)}});
     const record=characterSoundChannels.entries()[0];record.sound.volume=1;characterSoundOutput.update();if(afterReady)await record.nativeReady;
     dispatch({type:'ModifySnd',params:{channel:'7',loopstart:String(metadata.sourceFrames-6),loopend:String(metadata.sourceFrames-2),...(infinite?{loop:'1'}:{loop:'1',loopcount:'2'})}});
     let timer;try{await Promise.race([nativeSoundPlayer.settled(record),new Promise((resolve,reject)=>{timer=setTimeout(()=>reject(Error('Native loop acknowledgement timed out')),5000)})])}finally{clearTimeout(timer)}
     const ready=await record.nativeReady,descriptor=record.nativePlayback,gain=characterSoundOutput.snapshot(record).gain,decoded=await nativeSoundLoader.load(descriptor.url,descriptor.metadata),rendered=await context.startRendering();await new Promise(resolve=>setTimeout(resolve,0));
     const remaining=characterSoundChannels.entries().length;characterSoundChannels.stopAll();rows.push({player,common,afterReady,infinite,ready,gain,remaining,players:nativeSoundPlayer.size(),graphs:characterSoundOutput.size(),left:[...rendered.getChannelData(0)],right:[...rendered.getChannelData(1)],sourceLeft:[...decoded.getChannelData(0)].slice(-8),sourceRight:[...decoded.getChannelData(metadata.sourceChannels===1?0:1)].slice(-8)});
    }
    return rows;
   }finally{characterSoundChannels.stopAll();characterSoundChannels=saved.channels;characterSoundOutput=saved.output;nativeSoundPlayer=saved.player;roundVoiceUntil=saved.voice}
  })()`);
  assert.equal(modifiedLoops.length,16);
  for(const row of modifiedLoops){assert.equal(row.ready,true);assert.equal(row.remaining,row.infinite?1:0);assert.equal(row.players,0);assert.equal(row.graphs,0);for(let frame=0;frame<64;frame++){const sourceIndex=frame<6?frame:row.infinite||frame<10?2+(frame-6)%4:null,detail=JSON.stringify({player:row.player,common:row.common,afterReady:row.afterReady,infinite:row.infinite,frame});assert.equal(row.left[frame],sourceIndex===null?0:Math.fround(row.sourceLeft[sourceIndex]*row.gain),detail);assert.equal(row.right[frame],sourceIndex===null?0:Math.fround(row.sourceRight[sourceIndex]*row.gain),detail)}}
  console.log('Sixteen actual ModifySnd finite/infinite loop mutations render exact source windows, preserve loopcount precedence and release native resources');
  const infinitePlaySnd=await run(`(async()=>{
   const saved={channels:characterSoundChannels,output:characterSoundOutput,player:nativeSoundPlayer,voice:roundVoiceUntil},rows=[];
   try{
    for(const player of [1,2])for(const common of [false,true]){
     characterSoundChannels=createCharacterSoundChannels();const actor=specialRoot(player),profile=characterProfiles.get(battleCharacters[player-1]),key=common?'7-0':Object.keys(profile.sounds).find(value=>/^[0-9]+-[0-9]+$/.test(value)),metadata=common?commonSoundManifest[key]:profile.sounds[key],context=new OfflineAudioContext(2,64,metadata.sourceSampleRate);
     characterSoundOutput=createCharacterSoundOutput({createContext:()=>context,view:()=>({width:320,strength:30,stereo:true}),sourcePosition:()=>null});nativeSoundPlayer=createNativeSoundPlayer({loader:nativeSoundLoader,isActive:record=>!!record.soundRegistry?.has(record)});
     const dispatch=controller=>executeControllerM1(controller,player===1?p1LifecycleBinding:p2,specialRuntime.context(actor),{owner:actor,player,schedulingApplied:true});
     dispatch({type:'PlaySnd',params:{value:(common?'F':'')+key.replace('-',','),channel:'7',loop:'1',loopstart:String(metadata.sourceFrames-6),loopend:String(metadata.sourceFrames-2),startposition:String(metadata.sourceFrames-8),abspan:'0',volumescale:'100'}});
     const record=characterSoundChannels.entries()[0];record.sound.volume=1;characterSoundOutput.update();const ready=await record.nativeReady,descriptor=record.nativePlayback,decoded=await nativeSoundLoader.load(descriptor.url,descriptor.metadata),rendered=await context.startRendering();await new Promise(resolve=>setTimeout(resolve,0));
     const before={channels:characterSoundChannels.entries().length,players:nativeSoundPlayer.size(),graphs:characterSoundOutput.size()};dispatch({type:'StopSnd',params:{channel:'7'}});
     rows.push({player,common,ready,before,remaining:characterSoundChannels.entries().length,players:nativeSoundPlayer.size(),graphs:characterSoundOutput.size(),gain:common?1:Math.min(512,Math.max(0,gravityActorData(actor).dataConstants['data.volume']))/256,left:[...rendered.getChannelData(0)],right:[...rendered.getChannelData(1)],sourceLeft:[...decoded.getChannelData(0)].slice(-8),sourceRight:[...decoded.getChannelData(metadata.sourceChannels===1?0:1)].slice(-8)});
    }
    return rows;
   }finally{characterSoundChannels.stopAll();characterSoundChannels=saved.channels;characterSoundOutput=saved.output;nativeSoundPlayer=saved.player;roundVoiceUntil=saved.voice}
  })()`);
  assert.equal(infinitePlaySnd.length,4);
  for(const row of infinitePlaySnd){assert.equal(row.ready,true);assert.deepEqual(row.before,{channels:1,players:1,graphs:1});assert.equal(row.remaining,0);assert.equal(row.players,0);assert.equal(row.graphs,0);for(let frame=0;frame<64;frame++){const sourceIndex=frame<6?frame:2+(frame-6)%4,detail=JSON.stringify({player:row.player,common:row.common,frame});assert.equal(row.left[frame],Math.fround(row.sourceLeft[sourceIndex]*row.gain),detail);assert.equal(row.right[frame],Math.fround(row.sourceRight[sourceIndex]*row.gain),detail)}}
  console.log('Actual infinite PlaySnd loops retain live channels across repeated sample windows and StopSnd releases worklet/mixer ownership for P1/P2 own/common sounds');
  assert.deepEqual(errors,[]);

 }finally{await browser?.close();server.close();clearTimeout(watchdog)}
})().catch(error=>{console.error(error);process.exitCode=1});
