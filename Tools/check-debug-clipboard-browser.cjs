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
  assert.deepEqual(errors,[]);
  const actorLayerRecords=await run(`(()=>{
   const layers=[...rootSpriteLayers],saved=[current,fi,simPaused],savedP2={...p2},helper=specialRuntime.entities.find(entity=>entity.kind==='helper'&&!entity.destroyed),savedHelper=helper?{...helper}:null;
   if(!helper)throw Error('Missing actual Helper for layer draw coverage');
   try{
    current=0;fi=0;simPaused=false;p2.anim=0;p2.elem=1;helper.anim=0;helper.elem=1;
    const rows=[];
    for(const layer of [-1,0,1,2]){
     transDrawQueue.reset();rootSpriteLayers.splice(0,2,layer,1-layer);helper.layerNo=layer;
     draw();drawMars();drawSourceExplods();
     const entries=transDrawQueue.ordered(),first=entries.find(entry=>entry.kind==='root1'),second=entries.find(entry=>entry.kind==='root2'),helpers=entries.filter(entry=>entry.kind==='helper');
     if(!first||!second||!helpers.length)throw Error('Actual actor sprites did not reach layer draw queue');
     rows.push([first.layer,second.layer,helpers.map(entry=>entry.layer)]);
    }
    return rows;
   }finally{
    rootSpriteLayers.splice(0,rootSpriteLayers.length,...layers);[current,fi,simPaused]=saved;Object.assign(p2,savedP2);Object.assign(helper,savedHelper);transDrawQueue.reset();
   }
  })()`);
  assert.deepEqual(actorLayerRecords,[[-1,2,[-1]],[0,1,[0]],[1,0,[1]],[2,-1,[2]]]);
  console.log('Actual P1/P2 and Helper sprite draw records preserve changing independent layers across four consecutive draws');
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
  assert.deepEqual(layerPixels,[[0,0,255,255],[255,255,255,255],[0,0,255,255],[0,0,255,255],[255,255,0,255],[255,0,0,255],[255,255,255,255],[255,255,255,255],[0,0,255,255],[0,255,0,255],[0,255,0,255],[255,0,0,255],[255,0,0,255]]);
  console.log('Actual battle compositor pixels verify foreground occlusion, ontop layer one, exact layer selection and zero-layer under ordering');
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
  assert.deepEqual(errors,[]);

 }finally{await browser?.close();server.close();clearTimeout(watchdog)}
})().catch(error=>{console.error(error);process.exitCode=1});
