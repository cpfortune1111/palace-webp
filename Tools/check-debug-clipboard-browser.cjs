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
    const angleResults=[];
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

 }finally{await browser?.close();server.close();clearTimeout(watchdog)}
})().catch(error=>{console.error(error);process.exitCode=1});
