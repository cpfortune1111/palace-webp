const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const assert=require('node:assert/strict');
const {chromium}=require('C:/Users/jeffy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
let browser;
const server=http.createServer((request,response)=>{
 const filename=new URL(request.url,'http://localhost').pathname.replace(/^\//,'')||'index.html';
 if(filename.includes('..')){response.writeHead(400);response.end();return}
 const file=path.join('work',filename);
 if(!fs.existsSync(file)){response.writeHead(404);response.end();return}
 let content=fs.readFileSync(file);
 if(filename==='index.html'){
  let html=content.toString().replaceAll('requestAnimationFrame(loop);','');
  html=html.replace('</script></body>',"window.runtimeTest={run:source=>eval(source),step:()=>{simStep();updateCamera();updateDebugHud();r.render(s,c);draw();drawMars();drawSourceExplods();drawCollision()},snapshot:()=>({state,fi,current,p1Facing,posX,posY,vx,vy,cameraX,stateTicks,p1TurnTime,p2:{...p2},runtimeFailed})};</script></body>");
  content=Buffer.from(html);
 }
 const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.json':'application/json','.png':'image/png','.glb':'model/gltf-binary'};
 response.setHeader('Content-Type',types[path.extname(filename)]||'application/octet-stream');response.end(content);
});
(async()=>{
 await new Promise(resolve=>server.listen(8765,'127.0.0.1',resolve));
 browser=await chromium.launch({headless:true,channel:'msedge'});
 const page=await browser.newPage({viewport:{width:1280,height:720}});
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('http://127.0.0.1:8765');
 await page.waitForFunction(()=>window.runtimeTest?.run('!!dat&&!!stateIR&&!!turnDat&&!!attackDat&&!!gethitDat&&!!battleDat&&!!guardDat'),null,{timeout:90000}).catch(error=>{throw Error(error.message+'; browser errors: '+JSON.stringify(errors))});
 const orientationChecks=await page.evaluate(()=>window.runtimeTest.run(`
  (()=>{
   let checked=0;
   for(const anim of [5,6])for(const facing of [-1,1])for(let element=0;element<3;element++)for(const player of [1,2]){
    cameraX=0;cameraY=0;posX=0;posY=0;p2.x=0;p2.y=0;p1Facing=facing;p2.facing=facing;current=anim;fi=element;p2.anim=anim;p2.elem=element+1;
    draw();drawMars();
    const frame=turnDat.actions[String(anim)][element],sprite=turnDat.sprites[frame.group+','+frame.item];
    const raw=document.createElement('canvas');raw.width=sprite.w;raw.height=sprite.h;raw.getContext('2d').imageSmoothingEnabled=false;
    raw.getContext('2d').drawImage(turnAtlas,sprite.x,sprite.y,sprite.w,sprite.h,0,0,sprite.w,sprite.h);
    const target=player===1?cv:mcv,expected=document.createElement('canvas');expected.width=target.width;expected.height=target.height;
    const context=expected.getContext('2d');context.translate(640,660);context.scale(-facing,1);context.drawImage(raw,-sprite.axisX,-sprite.axisY);
    const actual=target.getContext('2d').getImageData(0,0,target.width,target.height).data,wanted=context.getImageData(0,0,target.width,target.height).data;
    let differing=0,maxDifference=0;
    for(let index=0;index<actual.length;index++){const difference=Math.abs(actual[index]-wanted[index]);if(difference>2)differing++;maxDifference=Math.max(maxDifference,difference)}
    if(differing>0)throw Error('Turn pixel orientation mismatch: '+[anim,facing,element,player]+' channels='+differing+' max='+maxDifference);
    checked++;
   }
   return checked;
  })()
 `));assert.equal(orientationChecks,24);
 const run=source=>page.evaluate(source=>window.runtimeTest.run(source),source);
 const step=()=>page.evaluate(()=>{window.runtimeTest.step();return window.runtimeTest.snapshot()});
 await page.locator('#dbgBoxes').dispatchEvent('pointerdown');
 assert.equal(await run('showCollision'),true);
 for(const facing of [-1,1]){
  await run(`simPaused=false;resetPlayerInput();p1Facing=${facing};p2.facing=${-facing};enterIRState(0);enterP2State(0);`);
  await step();assert.equal(await run('runtimeFailed'),false);
 }
 await run("resetPlayerInput();posX=200;p2.x=-200;p1Facing=1;vx=0;enterIRState(0);stateTicks=100;p2.ctrl=0");
 const standing=[];for(let tick=0;tick<7;tick++){const frame=await step();standing.push([frame.current,frame.fi])}
 assert.deepEqual(standing,[[5,0],[5,1],[5,1],[5,1],[5,1],[5,2],[0,0]]);
 await run("resetPlayerInput();input.down=true;posX=200;p2.x=-200;p1Facing=1;vx=0;enterIRState(11);runtimeCtrl=1;stateTicks=100;p2.ctrl=0");
 const crouching=[];for(let tick=0;tick<7;tick++){const frame=await step();crouching.push([frame.current,frame.fi])}
 assert.deepEqual(crouching,[[6,0],[6,1],[6,1],[6,1],[6,1],[6,2],[11,0]]);
 await run("resetPlayerInput();posX=200;p2.x=-200;p1Facing=1;vx=0;enterIRState(0);stateTicks=100;p2.ctrl=0");await step();
 await page.screenshot({path:'work/runtime-standing-turn.png'});
 await run("resetPlayerInput();posX=200;p2.x=-200;p1Facing=1;vx=8;vy=-40;posY=-50;enterIRState(50);enterP2State(0);p2.facing=1");
 const cross=await step();assert.equal(cross.p1Facing,1);assert.equal(cross.p2.facing,1);
 await run('p2.facing=-1');const opponentTurn=await step();assert.equal(opponentTurn.p2.anim,5);assert.equal(opponentTurn.p2.facing,1);assert.equal(opponentTurn.p1Facing,1);
 const edges=[];
 for(const direction of [-1,1]){
  const camera=direction*2850;
  const axis=camera+direction*580;
  await run(`resetPlayerInput();cameraX=${camera};posX=${axis};p1Facing=${-direction};posY=0;vx=-8;vy=-40;enterIRState(50);p2.x=${camera-direction*580};p2.facing=${direction};enterP2State(0);p2.vx=0;`);
  const positions=[];for(let tick=0;tick<60;tick++){const frame=await step();positions.push(frame.posX);assert.equal(frame.p1Facing,-direction);assert.ok(!frame.runtimeFailed)}
  assert.ok(positions.every(value=>Math.abs(value-axis)<0.0001),JSON.stringify(positions));edges.push({direction,axis,last:positions.at(-1)});
 }
 await run("resetPlayerInput();cameraX=0;posX=-200;posY=0;p1Facing=1;enterIRState(0);enterP2State(0);p2.x=200;p2.facing=-1;");
 await page.keyboard.down('ArrowRight');await step();await step();assert.ok((await step()).posX>-200);await page.keyboard.up('ArrowRight');
 await page.keyboard.down('KeyZ');const attack=await step();assert.equal(attack.state,200);await page.keyboard.up('KeyZ');
 const combat=[];
 for(const facing of [-1,1])for(const mode of ['none','stand','crouch']){
  await run(`resetPlayerInput();p1HitPause=0;cameraX=0;posX=0;posY=0;p1Facing=${facing};p2.x=${facing*140};p2.y=0;p2.facing=${-facing};p2.life=1000;p2.lastHitKey=null;p2.getHit=null;enterP2State(0);document.querySelector('#p2Guard').value='${mode}';enterIRState(200);`);
  const trace=[];for(let tick=0;tick<60;tick++)trace.push(await step());
  const struck=trace.find(frame=>frame.p2.getHit);
  if(mode==='crouch'){assert.ok(!struck,'High punch should miss crouch body');assert.equal(trace.at(-1).p2.life,1000);combat.push({facing,mode,result:'whiff'});continue}
  assert.ok(struck,'Expected contact '+mode);
  const contactIndex=trace.findIndex(frame=>frame.p2.getHit);
  const contactFrame=trace[contactIndex];
  assert.equal(await run("Number(cv.style.zIndex)>Number(mcv.style.zIndex)"),false);
  for(const pausedFrame of trace.slice(contactIndex+1,contactIndex+9)){
   assert.equal(pausedFrame.stateTicks,contactFrame.stateTicks);assert.equal(pausedFrame.fi,contactFrame.fi);
   assert.equal(pausedFrame.p2.x,contactFrame.p2.x);
  }
  assert.equal(trace.at(-1).p2.life,mode==='none'?980:1000);
  assert.equal(struck.p2.getHit.guarded,mode!=='none');
  const paused=await run('p1HitPause');assert.equal(paused,0);
  assert.equal(trace.at(-1).state,0);assert.ok([0,130,131].includes(trace.at(-1).p2.state));
  combat.push({facing,mode,life:trace.at(-1).p2.life});
 }
 await run("resetPlayerInput();p1HitPause=0;posX=-400;p2.x=400;p2.y=0;p2.lastHitKey=null;p2.life=1000;p2.getHit=null;document.querySelector('#p2Guard').value='none';enterP2State(0);enterIRState(200)");
 for(let tick=0;tick<30;tick++)await step();assert.equal((await step()).p2.life,1000);
 for(const [button,target] of [['jump',40],['down',10]]){
  await run(`resetPlayerInput();p1HitPause=0;enterIRState(200);stateTicks=9;fi=4;input.${button}=true;p2.getHit=null;p2.x=400;`);
  const cancelled=await step();assert.equal(cancelled.state,target);assert.equal(cancelled.stateTicks,0);
 }
 await run("resetPlayerInput();enterIRState(200);stateTicks=9;fi=4;runtimeMoveType='I';consumedXPress=false;input.x=true;p2.x=400;p2.getHit=null");
 const reentry=await step();assert.equal(reentry.state,200);assert.equal(reentry.stateTicks,0);assert.equal(reentry.fi,0);
 await run("resetPlayerInput();enterIRState(200);p2.type='A';moveContact=1;runController(battleDat.state200.controllers.find(controller=>controller.type==='VarSet'))");
 assert.equal(await run('runtimeVar[3]'),1);
 const frameRates=[];
 for(const hz of [30,60,120]){
  await run("resetPlayerInput();simulationAccumulator=0;p1HitPause=0;cameraX=0;posX=0;posY=0;p1Facing=1;p2.x=140;p2.y=0;p2.facing=-1;p2.life=1000;p2.lastHitKey=null;p2.getHit=null;document.querySelector('#p2Guard').value='none';enterP2State(0);enterIRState(200)");
  for(let frame=0;frame<hz;frame++)await run(`advanceSimulation(${1/hz})`);
  frameRates.push(await run('JSON.stringify({state,stateTicks,posX,p2x:p2.x,p2state:p2.state,life:p2.life})'));
 }
 assert.equal(frameRates[0],frameRates[1]);assert.equal(frameRates[1],frameRates[2]);
 await run("resetPlayerInput();p1HitPause=0;posX=0;posY=0;p1Facing=1;p2.x=400;p2.y=0;p2.facing=-1;p2.life=1000;p2.lastHitKey=null;p2.getHit=null;document.querySelector('#p2Guard').value='none';enterP2State(0);enterIRState(200)");
 const beforeHitDef=await run('hitDefSerial');
 for(let tick=0;tick<4;tick++)await step();
 assert.equal(await run('hitDefSerial'),beforeHitDef+1);
 await run('p2.x=140');await step();assert.equal(await run('p2.life'),980);
 for(let tick=0;tick<30;tick++)await step();assert.equal(await run('hitDefSerial'),beforeHitDef+1);
 await run("resetPlayerInput();p1HitPause=0;posX=0;posY=0;p1Facing=1;p2.x=140;p2.y=0;p2.facing=-1;p2.life=1000;p2.lastHitKey=null;p2.getHit=null;enterP2State(0);enterIRState(200)");
 for(let tick=0;tick<4;tick++)await step();
 assert.equal(await run('p1SprPriority'),2);assert.equal(await run('p2.sprPriority'),0);
 assert.equal(await run('Number(cv.style.zIndex)>Number(mcv.style.zIndex)'),true);
 const hitFrames=[];
 for(let tick=0;tick<32;tick++){
  const frame=await step();
  if(frame.p2.state===5001){
   const sprite=await run('p2Frames()[p2.elem-1]');hitFrames.push([frame.p2.anim,sprite.group,sprite.item]);
  }
 }
 const sprites=hitFrames.map(frame=>frame[2]);
 const changes=sprites.filter((value,index)=>index===0||value!==sprites[index-1]);
 assert.deepEqual(changes,[0,10,0]);
 assert.ok(hitFrames.some(frame=>frame[0]===5005));
 await run("simPaused=true;logicFrame={state:200,time:3,anim:200,elem:4,facing:1,x:0,y:0,vx:0,vy:0,life:1000,sprPriority:2,p2:{...p2,state:5001,time:4,anim:5000,elem:2,x:100,y:0,facing:-1,vx:16,vy:0,life:980,sprPriority:0}};updateDebugHud();draw();drawMars();drawSourceExplods();drawCollision()");
 const hudText=await page.locator('#act').innerText();
 assert.match(hudText,/P1_S200_T3_A200_E4_F\+1_X\+0\.0_Y\+0\.0_VX\+0\.0_VY\+0\.0_HP1000/);
 assert.match(hudText,/P2_S5001_T4_A5000_E2_F-1_X\+100\.0_Y\+0\.0_VX-16\.0_VY\+0\.0_HP980/);
 await page.screenshot({path:'outputs/runtime-0239-clsn-hud.png'});
 await run('simPaused=false');
 for(const direction of [-1,1])for(const mode of ['none','stand']){
  await run(`resetPlayerInput();p1HitPause=0;cornerPushVelocity=0;cameraX=${direction*2850};posX=${direction*3290};posY=0;p1Facing=${direction};p2.x=${direction*3430};p2.y=0;p2.facing=${-direction};p2.life=1000;p2.getHit=null;p2.lastHitKey=null;enterP2State(0);document.querySelector('#p2Guard').value='${mode}';enterIRState(200);`);
  for(let tick=0;tick<4;tick++)await step();
  assert.equal(await run('cornerPushVelocity'),direction*(mode==='none'?-24:-28));
  const startX=await run('posX');for(let tick=0;tick<8;tick++)await step();assert.equal(await run('posX'),startX);
  await step();assert.equal(await run('posX'),startX+direction*(mode==='none'?-24:-28));
  for(let tick=0;tick<35;tick++){const frame=await step();assert.ok(Math.abs(frame.p2.x-direction*3430)<0.00001)}
  assert.equal(await run('cornerPushVelocity'),0);
 }
 await run("cameraX=0;p2.x=570;p2.vx=16;p2.moveType='H';p2.type='S';p2.getHit={attackerId:1};cornerPushVelocity=-24;cornerPushMultiplier=.7");
 assert.deepEqual(await run('checkCornerPushM1()'),{distance:-14,multiplier:.7});
 await run('p2.x=200');assert.equal(await run('checkCornerPushM1().distance'),0);
 await run("p2.moveType='I'");assert.equal(await run('checkCornerPushM1().multiplier'),0);
 for(const direction of [-1,1]){
  await run(`resetPlayerInput();p1HitPause=0;cornerPushVelocity=0;cameraX=${direction*2850};posX=${direction*3290};posY=0;p1Facing=${direction};p2.x=${direction*3430};p2.y=0;p2.facing=${-direction};p2.life=1000;p2.lastHitKey=null;p2.getHit=null;document.querySelector('#p2Guard').value='stand';enterP2State(0);enterIRState(200);`);
  for(let tick=0;tick<4;tick++)await step();
  const offsets=[];for(let tick=0;tick<8;tick++){const frozen=await step();offsets.push(await run('hitShakeOffset(p2)'));assert.equal(frozen.p2.x,direction*3430)}
  assert.ok(offsets.includes(0));assert.ok(offsets.includes(direction*2));assert.ok(offsets.every(offset=>offset===0||offset===direction*2));
  await step();assert.equal(await run('p2.state'),151);assert.equal(await run('p2.ctrl'),0);
  await run(`posX=p2.x-(${direction*140});enterIRState(200)`);
  for(let tick=0;tick<4;tick++)await step();
  assert.equal(await run('p2.life'),1000);assert.equal(await run('p2.getHit.guarded'),true);assert.equal(await run('p2.state'),150);
 }
 await run("p2.state=5001;p2.moveType='H';p2.ctrl=0;p2.type='S';p2.y=0;p2.lastHitKey=null;enterIRState(200);applyP2HitM1({hitKey:'not-guard-stun',params:battleDat.state200.controllers.find(controller=>controller.type==='HitDef').params})");
 assert.equal(await run('p2.getHit.guarded'),false);
 await run("combatTraceTick=0;combatTraceCount=0;resetPlayerInput();p1HitPause=0;cornerPushVelocity=0;cameraX=0;posX=0;posY=0;p1Facing=1;p2.x=140;p2.y=0;p2.facing=-1;p2.life=1000;p2.lastHitKey=null;p2.getHit=null;document.querySelector('#p2Guard').value='none';enterP2State(0);enterIRState(200)");
 for(let tick=0;tick<12;tick++)await step();
 const trace=await run('combatTraceExport()');
 assert.equal(trace.version,'0.23.27');assert.equal(trace.tickRate,60);assert.equal(trace.frames.length,12);
 assert.deepEqual(trace.frames.map(frame=>frame.tick),Array.from({length:12},(_,index)=>index));
 assert.equal(trace.frames[3].after.p2.life,980);
 assert.equal(trace.frames.filter(frame=>frame.before.p1.hitPause>0).length,8);
 for(const frame of trace.frames.filter(frame=>frame.before.p1.hitPause>0)){
  assert.equal(frame.after.p1.x,frame.before.p1.x);assert.equal(frame.randomValue,null);
  assert.equal(frame.after.p1.hitPause,frame.before.p1.hitPause-1);
 }
 await run('p2.life=777');
 assert.equal(await run('combatTraceExport().frames[3].after.p2.life'),980);
 const downloadEvent=page.waitForEvent('download');await page.locator('#dbgTrace').click();const download=await downloadEvent;
 assert.equal(download.suggestedFilename(),'palace-0.23.27-trace.json');
 const downloaded=JSON.parse(fs.readFileSync(await download.path(),'utf8'));
 assert.deepEqual(downloaded,trace);
 const pausedCount=await run('combatTraceTick');await run('simPaused=true;draw();drawMars();drawSourceExplods();drawCollision()');
 assert.equal(await run('combatTraceTick'),pausedCount);await run('simPaused=false');
 await run('for(let tick=0;tick<605;tick++)simStep()');
 const bounded=await run('combatTraceExport()');
 assert.equal(bounded.frames.length,600);assert.equal(bounded.droppedTicks,17);
 assert.equal(bounded.firstTick,17);assert.equal(bounded.lastTick,616);
 const sharedHitChecks=await run(`(()=>{
  const params=battleDat.state200.controllers.find(controller=>controller.type==='HitDef').params;
  let checks=0;
  for(const id of [1,2])for(const facing of [-1,1])for(const mode of ['none','stand','crouch']){
   const attacker={id,facing},defender={id:3-id,life:1000,ctrl:1,moveType:'I',state:0,type:'S',y:0,anim:0,elem:1,x:facing*140,facing:-facing};
   const original=JSON.stringify({attacker,defender});
   const result=resolveGroundHitM1(attacker,defender,params,mode),guarded=mode!=='none';
   if(result.life!==(guarded?1000:980)||result.getHit.attackerId!==id||result.getHit.attackerFacing!==facing)throw Error('Shared receiver identity/damage');
   if(result.getHit.xvel!==facing*(guarded?24:16)||result.getHit.slidetime!==(guarded?16:11)||result.getHit.hittime!==(guarded?22:15))throw Error('Shared source gethit values');
   if(result.cornerPushVelocity!==facing*(guarded?-28:-24)||result.attackerPause!==8||result.defenderPause!==8)throw Error('Shared source pause/push');
   if(result.state!==(mode==='crouch'?152:guarded?150:5000)||result.sound!==params[guarded?'guardsound':'hitsound'])throw Error('Shared state/sound');
   if(JSON.stringify({attacker,defender})!==original)throw Error('Shared resolver mutated contexts');
   const frame={anim:200,elem:4,x:0,y:0,facing,hitDef:{}};
   if(!resolveFighterCollisionM1(frame,defender).contact)throw Error('Shared mirrored collision');
   if(resolveFighterCollisionM1(frame,{...defender,x:facing*1000}).contact)throw Error('Shared mirrored whiff');
   if(resolveFighterCollisionM1({...frame,hitDef:null},defender).contact)throw Error('Inactive HitDef collided');
   const guardStun=resolveGroundHitM1(attacker,{...defender,state:151,ctrl:0,moveType:'H'},params,'stand');
   const hitStun=resolveGroundHitM1(attacker,{...defender,state:5001,ctrl:0,moveType:'H'},params,'stand');
   const air=resolveGroundHitM1(attacker,{...defender,type:'A',y:-10},params,'stand');
   if(!guardStun.guarded||hitStun.guarded||air.guarded)throw Error('Shared guard eligibility');
   const priority=resolveGroundHitM1(attacker,defender,{...params,p1sprpriority:'3',p2sprpriority:'-1'},mode);
   if(priority.attackerPriority!==3||priority.defenderPriority!==-1)throw Error('Shared priority');
   checks++;
  }
  return checks;
 })()`);
 assert.equal(sharedHitChecks,12);
 await run("p2.getHit={xvel:-16,attackerFacing:-1};p1Facing=1;enterP2State(5001)");
 assert.equal(await run('p2.vx'),-16);
 await run("p2.getHit={xvel:24,attackerFacing:1,crouch:false};p1Facing=-1;enterP2State(151)");
 assert.equal(await run('p2.vx'),24);
 const reverseCases=[];
 for(const facing of [-1,1])for(const guarded of [false,true]){
  await run(`simPaused=false;resetPlayerInput();p1Reaction=null;p1LastHitKey=null;p1HitPause=0;p1Life=1000;cornerPushVelocity=0;cameraX=0;posX=${facing*140};posY=0;p1Facing=${-facing};vx=0;vy=0;p2.x=0;p2.y=0;p2.vx=0;p2.vy=0;p2.facing=${facing};p2.life=1000;p2.hitShake=0;p2.attackPause=0;p2.cornerPushVelocity=0;p2.lastHitKey=null;p2.getHit=null;document.querySelector('#p2Guard').value='none';enterIRState(0);enterP2State(0);input.left=${guarded&&facing===-1};input.right=${guarded&&facing===1};`);
  await page.locator('#p2Punch').click();
  for(let tick=0;tick<5;tick++)await step();
  assert.equal(await run('p1Life'),guarded?1000:980);
  assert.ok(await run('!!p1Reaction'),JSON.stringify(await run('({facing:p1Facing,posX,state,p2,p1Life,collision:resolveFighterCollisionM1(p2.attackFrame,liveP1())})')));
  assert.equal(await run('p1Reaction.getHit.attackerId'),2);
  assert.equal(await run('p1Reaction.getHit.guarded'),guarded);
  assert.equal(await run('state'),guarded?150:5000);
  assert.equal(await run('p2.sprPriority'),2);assert.equal(await run('p1SprPriority'),0);
  assert.equal(await run('p2Frames()[0].group'),200);
  const attackTime=await run('p2.time'),firstX=await run('posX'),secondX=await run('p2.x'),offsets=[];
  for(let tick=0;tick<8;tick++){
   await step();assert.equal(await run('p2.time'),attackTime);assert.equal(await run('posX'),firstX);assert.equal(await run('p2.x'),secondX);
   offsets.push(await run('hitShakeOffset(liveP1())'));
  }
  assert.ok(offsets.includes(0));assert.ok(offsets.includes(facing*2));
  for(let tick=0;tick<45;tick++)await step();
  assert.equal(await run('p1Reaction'),null);assert.equal(await run('p1Life'),guarded?1000:980);
  assert.equal(await run('p2.state'),0);assert.equal(await run('runtimeFailed'),false);
  reverseCases.push({facing,guarded,life:await run('p1Life')});
 }
 for(const facing of [-1,1])for(const guarded of [false,true]){
  await run(`simPaused=false;resetPlayerInput();p1Reaction=null;p1LastHitKey=null;p1HitPause=0;p1Life=1000;cornerPushVelocity=0;cameraX=${facing*2850};posX=${facing*3430};posY=0;p1Facing=${-facing};vx=0;vy=0;p2.x=${facing*3290};p2.y=0;p2.vx=0;p2.facing=${facing};p2.hitShake=0;p2.attackPause=0;p2.cornerPushVelocity=0;p2.getHit=null;document.querySelector('#p2Guard').value='none';enterIRState(0);enterP2State(0);input.left=${guarded&&facing===-1};input.right=${guarded&&facing===1};p2PunchRequested=true;`);
  for(let tick=0;tick<5;tick++)await step();
  assert.equal(await run('p1Life'),guarded?1000:980);
  const attackerX=await run('p2.x'),push=facing*(guarded?-28:-24);
  assert.equal(await run('p2.cornerPushVelocity'),push);
  for(let tick=0;tick<8;tick++)await step();
  assert.equal(await run('p2.x'),attackerX);
  await step();assert.equal(await run('p2.x'),attackerX+push);
  assert.equal(await run('posX'),facing*3430);
  for(let tick=0;tick<40;tick++)await step();
  assert.equal(await run('p2.cornerPushVelocity'),0);
 }
 await run("simPaused=false;resetPlayerInput();p1Reaction=null;p1LastHitKey=null;p1HitPause=0;p1Life=1000;cornerPushVelocity=0;cameraX=0;posX=500;posY=0;p1Facing=-1;p2.x=0;p2.y=0;p2.facing=1;p2.attackPause=0;p2.cornerPushVelocity=0;p2.hitShake=0;enterIRState(0);enterP2State(200)");
 for(let tick=0;tick<45;tick++)await step();
 assert.equal(await run('p1Life'),1000);assert.equal(await run('p1Reaction'),null);assert.equal(await run('p2.state'),0);
 await run("simPaused=true;resetPlayerInput();p1Reaction=null;p1LastHitKey=null;p1HitPause=0;p1Life=1000;cameraX=0;posX=140;posY=0;p1Facing=-1;p2.x=0;p2.y=0;p2.facing=1;p2.attackPause=0;p2.cornerPushVelocity=0;p2.hitShake=0;enterIRState(0);enterP2State(200);logicFrame={state:0,time:999,anim:0,elem:1,x:9999,y:0,life:111,facing:-1}");
 for(let tick=0;tick<4;tick++)await step();
 assert.equal(await run('p1Life'),980);assert.equal(await run('logicFrame.life'),980);
 assert.equal(await run('logicFrame.state'),5000);assert.ok(await run('logicFrame.x<1000'));
 await run('simPaused=false;p1Reaction=null;p1HitPause=0;p2.attackPause=0;resetPlayerInput();enterIRState(0);enterP2State(0)');
 const expressionParity=await run(`(()=>{
  resetPlayerInput();enterIRState(200);p2.type='S';moveContact=0;moveGuarded=0;
  let checks=0;
  for(let time=0;time<=actionDuration(200);time++)for(const random of [0,249,250,999]){
   stateTicks=time;randomValue=random;
   const fighter={state:200,time,anim:200,elem:fi+1,ctrl:runtimeCtrl,moveType:runtimeMoveType,type:'S',randomValue:random,vars:[...runtimeVar],sysvars:[...runtimeSysVar],moveContact,moveGuarded};
   const context=fighterExpressionContext(fighter,{type:p2.type});
   for(const controller of battleDat.state200.controllers){
    if(controllerTriggered(controller)!==controllerTriggered(controller,context))throw Error('Expression context mismatch '+time+' '+controller.source.line);
    checks++;
   }
  }
  return checks;
 })()`);
 assert.ok(expressionParity>100);
 const contextChecks=await run(`(()=>{
  const first={state:200,time:3,anim:200,elem:4,ctrl:0,moveType:'A',type:'S',randomValue:17,vars:[7],sysvars:[11],x:10,y:-20,vx:5,vy:-2,facing:-1};
  const second={...first,time:0,randomValue:999,vars:[99],sysvars:[101],facing:1};
  const opponent={type:'A'};
  if(evalFighterExpr('var(0)+sysvar(0)',first,opponent)!==18||evalFighterExpr('var(0)+sysvar(0)',second,opponent)!==200)throw Error('Variable isolation');
  if(evalFighterExpr('var(0)',{...second,vars:undefined},opponent)!==0)throw Error('Variable fallback leaked');
  if(!evalFighterExpr('AnimElem = 4',first,opponent)||evalFighterExpr('AnimElem = 4',second,opponent))throw Error('Element clock isolation');
  if(evalFighterExpr('Vel X',first,opponent)!==-5||evalFighterExpr('Vel X',second,opponent)!==5)throw Error('Local velocity query');
  if(!evalFighterExpr('P2StateType = A && Random < 250',first,opponent))throw Error('Opponent/random context');
  if(!evalFighterExpr('command = "holdup"',first,opponent,{holdup:true})||evalFighterExpr('command = "holdup"',second,opponent))throw Error('Command isolation');
  if(evalFighterExpr('ifelse(1,7,UnknownQuery)',first,opponent)!==7||evalFighterExpr('0 && UnknownQuery',first,opponent)!==false)throw Error('Lazy evaluation');
  const cached=evalFighterExpr('Random',first,opponent);first.randomValue=55;
  if(cached!==17||evalFighterExpr('Random',first,opponent)!==55)throw Error('Cached AST retained value');
  for(const expression of ['UnknownQuery','UnknownFunction(1)','command = "nonexistent-command"']){
   let rejected=false;try{evalFighterExpr(expression,first,opponent)}catch{rejected=true}
   if(!rejected)throw Error('Unsupported expression silently accepted');
  }
  return true;
 })()`);
 assert.equal(contextChecks,true);
 await page.locator('#inputMode').selectOption('keyboard');
 await run("simPaused=false;resetPlayerInput();p1Reaction=null;p1LastHitKey=null;p1HitPause=0;p1Life=1000;cornerPushVelocity=0;cameraX=0;posX=140;posY=0;p1Facing=-1;p2.x=0;p2.y=0;p2.facing=1;p2.attackPause=0;p2.cornerPushVelocity=0;p2.hitShake=0;enterIRState(0);enterP2State(0)");
 await page.keyboard.down('Numpad0');assert.equal(await run('p2PunchRequested'),true);
 await step();assert.equal(await run('combatTraceExport().frames.at(-1).physicalInput.p2Punch'),true);
 for(let tick=0;tick<4;tick++)await step();assert.equal(await run('p1Life'),980);
 for(let tick=0;tick<45;tick++)await step();
 assert.equal(await run('p2.state'),0);await page.keyboard.down('Numpad0');
 assert.equal(await run('p2PunchRequested'),false);await page.keyboard.up('Numpad0');
 await page.keyboard.press('Numpad0');assert.equal(await run('p2PunchRequested'),true);
 await run('resetPlayerInput()');assert.equal(await run('p2PunchRequested'),false);
 await page.locator('#inputMode').focus();await page.keyboard.press('Numpad0');assert.equal(await run('p2PunchRequested'),false);
 await run('document.activeElement.blur()');
 await page.evaluate(()=>window.dispatchEvent(new KeyboardEvent('keydown',{code:'Numpad0',ctrlKey:true,cancelable:true})));
 assert.equal(await run('p2PunchRequested'),false);
 await page.locator('#inputMode').selectOption('touch');await page.keyboard.press('Numpad0');assert.equal(await run('p2PunchRequested'),false);
 await page.locator('#inputMode').selectOption('auto');await run("setInputMode('touch')");await page.keyboard.press('Numpad0');
 assert.equal(await run('activeInputMode'),'keyboard');assert.equal(await run('p2PunchRequested'),true);
 await page.evaluate(()=>window.dispatchEvent(new Event('blur')));assert.equal(await run('p2PunchRequested'),false);
 const sharedControllers=await run(`(()=>{
  const fighter={state:200,time:0,anim:200,elem:1,elemTick:3,ctrl:0,moveType:'A',type:'S',x:10,y:0,vx:3,vy:4,facing:1,vars:Array(60).fill(0),sysvars:Array(10).fill(0),randomValue:0};
  const context=fighterExpressionContext(fighter,{type:'S'}),events=[];
  const adapter={animDone:()=>true,playSound:(sound,channel)=>events.push(['sound',sound,channel]),hitDef:params=>events.push(['hit',params.damage]),changeState:state=>{fighter.state=state}};
  const execute=(type,params)=>executeControllerM1({type,params,triggerall:[],triggers:{1:['1']}},fighter,context,adapter);
  execute('VelSet',{x:'8',y:'-2'});execute('VelAdd',{x:'2',y:'1'});execute('VelMul',{x:'.5',y:'2'});
  if(fighter.vx!==5||fighter.vy!==-2)throw Error('Shared velocity handlers');
  execute('PosSet',{x:'20',y:'-10'});execute('PosAdd',{x:'5',y:'2'});
  if(fighter.x!==25||fighter.y!==-8)throw Error('Shared position handlers');
  execute('VarSet',{target:'var(3)',value:'7'});execute('VarSet',{target:'sysvar(2)',value:'11'});
  if(fighter.vars[3]!==7||fighter.sysvars[2]!==11)throw Error('Shared variable handlers');
  execute('CtrlSet',{value:'1'});execute('StateTypeSet',{moveType:'i'});
  execute('ChangeAnim',{value:'20'});execute('PlaySnd',{value:'1, 0',channel:'2'});execute('HitDef',{damage:'20, 0'});
  execute('ChangeState',{value:'0',ctrl:'0'});
  if(fighter.ctrl!==0||fighter.moveType!=='I'||fighter.anim!==20||fighter.elem!==1||fighter.elemTick!==0||fighter.state!==0)throw Error('Shared state/animation handlers');
  if(JSON.stringify(events)!==JSON.stringify([['sound','1, 0',2],['hit','20, 0']]))throw Error('Shared adapter dispatch');
  executeControllerM1({type:'VelSet',params:{x:'999'},triggers:{1:['0']}},fighter,context,adapter);
  if(fighter.vx!==5)throw Error('False trigger executed');
  for(const controller of [{type:'UnknownController',params:{}},{type:'VarSet',params:{target:'bogus',value:'1'}}]){
   let rejected=false;try{executeControllerM1({...controller,triggers:{1:['1']}},fighter,context,adapter)}catch{rejected=true}
   if(!rejected)throw Error('Unknown controller/target accepted');
  }
  return true;
 })()`);
 assert.equal(sharedControllers,true);
 const p2Walking=[];
 for(const facing of [-1,1])for(const backwards of [false,true]){
  await run(`simPaused=false;resetPlayerInput();setP2ControlMode('dummy');p1Reaction=null;p1HitPause=0;p1Life=1000;cornerPushVelocity=0;cameraX=0;posX=${facing*400};posY=0;p1Facing=${-facing};vx=0;vy=0;p2.x=0;p2.y=0;p2.vx=0;p2.vy=0;p2.facing=${facing};p2.hitShake=0;p2.attackPause=0;p2.cornerPushVelocity=0;p2.getHit=null;enterIRState(0);enterP2State(0)`);
  const direction=facing*(backwards?-1:1),key=direction>0?'Numpad6':'Numpad4';
  await page.keyboard.down(key);assert.equal(await run('p2ControlMode'),'keyboard');
  for(let tick=0;tick<3;tick++)await step();
  const expected=await run(`constVal('velocity.walk.${backwards?'back':'fwd'}.x')*${facing}`);
  assert.equal(await run('p2.x'),expected);assert.equal(await run('p2.vx'),expected);
  assert.equal(await run('p2.anim'),backwards?21:20);assert.equal(await run('posX'),facing*400);
  const captured=await run('combatTraceExport().frames.at(-1)');
  assert.equal(captured.p2Control,'keyboard');assert.equal(captured.physicalInput[direction>0?'p2Right':'p2Left'],true);
  await page.keyboard.up(key);await step();assert.equal(await run('p2.state'),0);assert.equal(await run('p2.vx'),0);
  const stopped=await run('p2.x');await step();assert.equal(await run('p2.x'),stopped);
  p2Walking.push({facing,backwards,velocity:expected});
 }
 await run("resetPlayerInput();p2.x=0;posX=400;p2.facing=1;enterP2State(0)");
 await page.keyboard.down('Numpad4');await page.keyboard.down('Numpad6');for(let tick=0;tick<4;tick++)await step();
 assert.equal(await run('p2.x'),0);assert.equal(await run('p2.state'),0);
 await page.keyboard.up('Numpad4');await page.keyboard.up('Numpad6');
 await page.keyboard.down('Numpad6');for(let tick=0;tick<3;tick++)await step();
 await page.evaluate(()=>window.dispatchEvent(new Event('blur')));await step();
 assert.equal(await run('p2.vx'),0);assert.equal(await run('p2Input.left||p2Input.right'),false);await page.keyboard.up('Numpad6');
 for(const facing of [-1,1]){
  await run(`resetPlayerInput();setP2ControlMode('dummy');p1Reaction=null;p1HitPause=0;cornerPushVelocity=0;cameraX=0;posX=0;posY=0;p1Facing=${facing};p2.x=${facing*140};p2.y=0;p2.vx=0;p2.facing=${-facing};p2.life=1000;p2.getHit=null;p2.lastHitKey=null;p2.hitShake=0;p2.attackPause=0;p2.cornerPushVelocity=0;enterIRState(200);enterP2State(0)`);
  await page.keyboard.down(facing>0?'Numpad6':'Numpad4');
  for(let tick=0;tick<4;tick++)await step();
  assert.equal(await run('p2.life'),1000);assert.equal(await run('p2.getHit.guarded'),true);
  await page.keyboard.up(facing>0?'Numpad6':'Numpad4');
  for(let tick=0;tick<45;tick++)await step();
 }
 await run("resetPlayerInput();setP2ControlMode('keyboard');p2.x=0;posX=400;p2.facing=-1;enterIRState(0);enterP2State(0);p2.time=99");
 await page.keyboard.down('Numpad6');await step();
 assert.equal(await run('p2.anim'),5);assert.equal(await run('p2.turnTime'),0);
 await step();assert.equal(await run('p2.anim'),5);assert.equal(await run('p2.turnTime'),1);
 await page.keyboard.up('Numpad6');
 await page.locator('#p2Control').selectOption('dummy');assert.equal(await run('p2ControlMode'),'dummy');
 assert.equal(await page.locator('#p2Guard').isDisabled(),false);
 await page.locator('#inputMode').selectOption('touch');await page.keyboard.down('Numpad4');
 assert.equal(await run('p2ControlMode'),'dummy');assert.equal(await run('p2Input.left'),false);await page.keyboard.up('Numpad4');
 await page.locator('#inputMode').selectOption('keyboard');
 await page.locator('#p2Guard').focus();await page.keyboard.press('Numpad4');assert.equal(await run('p2ControlMode'),'dummy');
 await run('document.activeElement.blur()');
 const p2FrameRates=[];
 for(const rate of [30,60,120]){
  await run("simPaused=false;resetPlayerInput();setP2ControlMode('keyboard');p1Reaction=null;p1HitPause=0;cornerPushVelocity=0;cameraX=0;posX=400;posY=0;p1Facing=-1;p2.x=0;p2.y=0;p2.vx=0;p2.facing=1;p2.hitShake=0;p2.attackPause=0;p2.cornerPushVelocity=0;enterIRState(0);enterP2State(0);p2Input.right=true;simulationAccumulator=0");
  await run(`for(let frame=0;frame<${rate/2};frame++)advanceSimulation(1/${rate})`);
  p2FrameRates.push(await run('({x:p2.x,vx:p2.vx,state:p2.state,anim:p2.anim,time:p2.time,elem:p2.elem})'));
 }
 assert.deepEqual(p2FrameRates[0],p2FrameRates[1]);assert.deepEqual(p2FrameRates[1],p2FrameRates[2]);
 for(const facing of [-1,1]){
  await run(`resetPlayerInput();setP2ControlMode('keyboard');p1Reaction=null;p1HitPause=0;cornerPushVelocity=0;cameraX=${facing*2850};posX=${facing*3000};posY=0;p1Facing=${facing};p2.x=${facing*3430};p2.y=0;p2.vx=0;p2.facing=${-facing};p2.hitShake=0;p2.attackPause=0;p2.cornerPushVelocity=0;enterIRState(0);enterP2State(0);p2Input.left=${facing===-1};p2Input.right=${facing===1}`);
  for(let tick=0;tick<15;tick++)await step();
  assert.equal(await run('p2.x'),facing*3430);
 }
 await run("resetPlayerInput();setP2ControlMode('dummy')");
 const simultaneous=[];
 for(const facing of [-1,1])for(const order of [['z','Numpad0'],['Numpad0','z']]){
  await run(`simPaused=false;resetPlayerInput();setP2ControlMode('dummy');p1Reaction=null;p1LastHitKey=null;p1HitPause=0;p1Life=1000;cornerPushVelocity=0;cameraX=0;posX=${-facing*250};posY=0;p1Facing=${facing};vx=0;vy=0;p2.x=${facing*250};p2.y=0;p2.vx=0;p2.vy=0;p2.facing=${-facing};p2.life=1000;p2.hitShake=0;p2.attackPause=0;p2.cornerPushVelocity=0;p2.getHit=null;p2.lastHitKey=null;enterIRState(0);enterP2State(0)`);
  for(const key of order)await page.keyboard.down(key);
  await step();assert.equal(await run('state'),200);assert.equal(await run('p2.state'),200);
  assert.equal(await run('stateTicks'),0);assert.equal(await run('p2.time'),0);
  for(let tick=0;tick<10;tick++){await step();assert.equal(await run('stateTicks'),await run('p2.time'))}
  assert.equal(await run('p1Life'),1000);assert.equal(await run('p2.life'),1000);
  for(let tick=0;tick<10;tick++)await step();assert.equal(await run('state'),0);assert.equal(await run('p2.state'),0);
  for(const key of order)await page.keyboard.up(key);
  simultaneous.push({facing,order:order.join('+'),result:'both-start'});
 }
 await run("resetPlayerInput();p1Reaction=null;p1HitPause=0;cameraX=0;posX=-250;posY=0;p1Facing=1;p2.x=250;p2.y=0;p2.facing=-1;p2.hitShake=0;p2.attackPause=0;enterIRState(0);enterP2State(0)");
 await page.keyboard.down('z');await step();assert.equal(await run('runtimeCtrl'),0);
 await page.keyboard.down('Numpad0');await step();assert.equal(await run('p2.state'),200);assert.equal(await run('state'),200);
 await page.keyboard.up('z');await page.keyboard.up('Numpad0');
 const punchTrades=[];
 for(const facing of [-1,1])for(const order of [['z','Numpad0'],['Numpad0','z']]){
  await run(`resetPlayerInput();setP2ControlMode('dummy');p1Reaction=null;p1LastHitKey=null;p1HitPause=0;p1Life=1000;cornerPushVelocity=0;cameraX=0;posX=0;posY=0;p1Facing=${facing};vx=0;vy=0;p2.x=${facing*140};p2.y=0;p2.vx=0;p2.vy=0;p2.facing=${-facing};p2.life=1000;p2.hitShake=0;p2.attackPause=0;p2.cornerPushVelocity=0;p2.getHit=null;p2.lastHitKey=null;enterIRState(0);enterP2State(0)`);
  for(const key of order)await page.keyboard.down(key);
  for(let tick=0;tick<5;tick++)await step();
  assert.equal(await run('p1Life'),980);assert.equal(await run('p2.life'),980);
  assert.equal(await run('state'),5000);assert.equal(await run('p2.state'),5000);
  assert.equal(await run('p1Reaction.getHit.attackerId'),2);assert.equal(await run('p2.getHit.attackerId'),1);
  const first=await run('posX'),second=await run('p2.x'),firstOffsets=[],secondOffsets=[];
  for(let tick=0;tick<8;tick++){
   await step();assert.equal(await run('posX'),first);assert.equal(await run('p2.x'),second);
   firstOffsets.push(await run('hitShakeOffset(liveP1())'));secondOffsets.push(await run('hitShakeOffset(p2)'));
  }
  assert.ok(firstOffsets.includes(-facing*2));assert.ok(secondOffsets.includes(facing*2));
  assert.equal(await run('p1Reaction.hitShake'),0);assert.equal(await run('p2.hitShake'),0);
  for(const key of order)await page.keyboard.up(key);
  for(let tick=0;tick<45;tick++)await step();
  assert.equal(await run('p1Life'),980);assert.equal(await run('p2.life'),980);
  assert.equal(await run('state'),0);assert.equal(await run('p2.state'),0);assert.equal(await run('p1Reaction'),null);
  punchTrades.push({facing,order:order.join('+'),life:[980,980]});
 }
 const getHitSemantics=await run(`(()=>{
  let checks=0;
  for(const facing of [-1,1]){
   const fighter={state:5001,time:0,anim:5000,elem:1,facing,type:'S',ctrl:0,moveType:'H',x:0,y:0,vx:7,vy:9,hitShake:1,hitTime:0,moveContact:3,moveGuarded:3,getHit:{xvel:16,yvel:-8,animtype:0,groundtype:1,fall:0,slidetime:11,ctrltime:16}};
   const opponent={type:'A'},context=fighterExpressionContext(fighter,opponent);
   if(evalM1('HitOver',context)||evalM1('HitShakeOver',context))throw Error('Premature HitOver/HitShakeOver');
   fighter.hitTime=-1;fighter.hitShake=0;
   if(!evalM1('HitOver && HitShakeOver',context))throw Error('HitOver terminal boundary');
   if(evalM1('GetHitVar(hittime)',context)!==-1||evalM1('GetHitVar(hitshaketime)',context)!==0)throw Error('Live hit timers');
   if(!evalM1('P2StateType = A && MoveContact = 3 && MoveGuarded = 3',context))throw Error('Fighter contact isolation');
   const binding={get vx(){return fighter.vx*facing},set vx(value){fighter.vx=value*facing},get vy(){return fighter.vy},set vy(value){fighter.vy=value}};
   executeControllerM1({type:'HitVelSet',params:{x:'1',y:'0'},triggers:{1:['Time = 0']}},binding,context,{});
   if(fighter.vx!==16||fighter.vy!==9)throw Error('HitVelSet local/world X or Y mask');
   executeControllerM1({type:'HitVelSet',params:{x:'0',y:'1'},triggers:{1:['1']}},binding,context,{});
   if(fighter.vx!==16||fighter.vy!==-8)throw Error('HitVelSet Y');
   fighter.time=1;fighter.vx=99;
   executeControllerM1(battleDat.hitVelocityControllers['5001'],binding,context,{});
   if(fighter.vx!==99)throw Error('Source HitVelSet Time=0 gate');
   for(const open of ['[','('])for(const close of [']',')'])for(const value of [-1,0,1,2,3]){
    fighter.time=value;const inside=(open==='['?value>=0:value>0)&&(close===']'?value<=2:value<2);
    if(evalM1('Time = '+open+'0,2'+close,context)!==inside||evalM1('Time != '+open+'0,2'+close,context)===inside)throw Error('Range endpoint '+open+close+value);
    checks++;
   }
   if(!evalM1('GetHitVar(animtype) != [3,5] && (GetHitVar(groundtype) = 1)',context))throw Error('Original Common range expression');
   for(const expression of ['GetHitVar(unsupported)','Time = [0]','Time = [0,2']){
    let rejected=false;try{evalM1(expression,context)}catch{rejected=true}if(!rejected)throw Error('Malformed/unsupported accepted');
   }
  }
  return checks;
 })()`);assert.equal(getHitSemantics,40);
 for(const guarded of [false,true]){
  await run(`resetPlayerInput();setP2ControlMode('dummy');p1Reaction=null;p1HitPause=0;cornerPushVelocity=0;posX=0;posY=0;p1Facing=1;p2.x=140;p2.y=0;p2.facing=-1;p2.lastHitKey=null;p2.getHit=null;p2.hitShake=0;p2.attackPause=0;document.querySelector('#p2Guard').value='${guarded?'stand':'none'}';enterIRState(200);enterP2State(0)`);
  for(let tick=0;tick<4;tick++)await step();
  assert.equal(await run('moveContact'),1);assert.equal(await run('moveGuarded'),guarded?1:0);
  for(let tick=0;tick<8;tick++){await step();assert.equal(await run('moveContact'),1)}
  await step();assert.equal(await run('moveContact'),2);assert.equal(await run('moveGuarded'),guarded?2:0);
  await run('enterIRState(0)');assert.equal(await run('moveContact'),0);assert.equal(await run('moveGuarded'),0);
 }
 const guardDistanceChecks=await run(`(()=>{
  let checks=0;
  for(const facing of [-1,1])for(const mode of ['stand','crouch'])for(const distance of [0,400,639,640,641,-10])for(const attacking of [false,true]){
   resetPlayerInput();setP2ControlMode('dummy');p1Reaction=null;p1HitPause=0;posX=0;posY=0;p1Facing=facing;
   p2.x=facing*distance;p2.y=0;p2.facing=-facing;p2.vx=0;p2.hitShake=0;p2.getHit=null;p2.life=1000;
   enterIRState(attacking?200:0);enterP2State(mode==='crouch'?11:0);
   document.querySelector('#p2Guard').value=mode;
   const expected=attacking&&distance>0&&distance<640;
   if(inGuardDistanceM1(p2)!==expected)throw Error('Strict source guard distance '+JSON.stringify({facing,mode,distance,attacking,type:p2.type,moveType:runtimeMoveType,profile:battleDat.guardDistance}));
   stepGroundReactionM1(p2,mode);
   if(p2.state!==(expected?120:mode==='crouch'?11:0))throw Error('Guard entry without attack/range '+[facing,mode,distance,attacking,p2.state]);
   if(expected&&p2.anim!==(mode==='crouch'?121:120))throw Error('Original guard start animation');
   checks++;
  }
  for(const mode of ['stand','crouch']){
   posX=0;posY=0;p1Facing=1;p2.x=400;p2.y=0;p2.facing=-1;enterIRState(200);enterP2State(mode==='crouch'?11:0);
   stepGroundReactionM1(p2,mode);if(p2.state!==120)throw Error('No start state');
   for(let tick=0;tick<6;tick++)stepGroundReactionM1(p2,mode);
   if(p2.state!==(mode==='crouch'?131:130))throw Error('Guard start clock');
   enterIRState(0);stepGroundReactionM1(p2,mode);
   if(p2.state!==140||p2.anim!==(mode==='crouch'?141:140))throw Error('No guard end');
   for(let tick=0;tick<6;tick++)stepGroundReactionM1(p2,mode);
   if(p2.state!==(mode==='crouch'?11:0))throw Error('Guard did not return to idle');
  }
  return checks;
 })()`);assert.equal(guardDistanceChecks,48);
 const guardEndFrames=await run(`(()=>{
  const sequences={};
  for(const anim of [120,121,140,141]){
   const fighter={anim,elem:1,elemTick:0};const sequence=[1];
   for(let tick=0;tick<actionDuration(anim);tick++){advanceFighterAirOneTick(fighter);sequence.push(fighter.elem)}
   if(sequence.some((element,index)=>index>0&&element<sequence[index-1]))throw Error('Guard animation loop '+anim);
   if(sequence.at(-1)!==framesFor(anim).length)throw Error('Guard final frame missing');
   sequences[anim]=sequence;
  }
  return sequences;
 })()`);assert.deepEqual(Object.keys(guardEndFrames),['120','121','140','141']);
 const locomotion=[];
 for(const player of [1,2])for(const facing of [-1,1]){
  const setup=()=>run(`resetPlayerInput();setP2ControlMode('${player===2?'keyboard':'dummy'}');p1Reaction=null;p1HitPause=0;cornerPushVelocity=0;cameraX=0;posX=${player===1?0:facing*400};posY=0;p1Facing=${player===1?facing:-facing};vx=0;vy=0;p2.x=${player===2?0:facing*400};p2.y=0;p2.vx=0;p2.vy=0;p2.facing=${player===2?facing:-facing};p2.hitShake=0;p2.attackPause=0;p2.getHit=null;p2.cornerPushVelocity=0;document.querySelector('#p2Guard').value='none';enterIRState(0);enterP2State(0)`);
  await setup();
  const forward=player===1?(facing===1?'ArrowRight':'ArrowLeft'):(facing===1?'Numpad6':'Numpad4');
  const back=player===1?(facing===1?'ArrowLeft':'ArrowRight'):(facing===1?'Numpad4':'Numpad6');
  await page.keyboard.down(forward);await step();await page.keyboard.up(forward);await step();await page.keyboard.down(forward);await step();
  assert.equal(await run(player===1?'state':'p2.state'),100);
  const start=await run(player===1?'posX':'p2.x');await step();
  assert.equal(await run(player===1?'posX':'p2.x'),start+18*facing);
  for(let tick=0;tick<4;tick++)await step();assert.equal(await run(player===1?'state':'p2.state'),100);
  await page.keyboard.up(forward);await step();assert.equal(await run(player===1?'state':'p2.state'),0);
  await setup();await page.keyboard.down(back);await step();await page.keyboard.up(back);await step();await page.keyboard.down(back);await step();
  assert.equal(await run(player===1?'state':'p2.state'),105);await step();
  assert.equal(await run(player===1?'vy':'p2.vy'),-5);assert.equal(await run(player===1?'vx':'p2.vx'),player===1?-30:-30*facing);
  assert.equal(await run(player===1?'posY':'p2.y'),-5);
  await page.keyboard.up(back);
  const states=[];for(let tick=0;tick<40;tick++){
   await step();const state=await run(player===1?'state':'p2.state');states.push(state);
   if(state===105)assert.equal(await run(player===1?'p1Facing':'p2.facing'),facing);
   if(state===106){assert.equal(await run(player===1?'posY':'p2.y'),0);assert.equal(Math.abs(await run(player===1?'vx':'p2.vx')),0)}
  }
  assert.ok(states.includes(106));assert.equal(states.at(-1),0);assert.equal(await run(player===1?'runtimeCtrl':'p2.ctrl'),1);
  locomotion.push({player,facing,run:'PASS',backdash:'PASS',land:'PASS'});
 }
 const dashSourceChecks=await run(`(()=>{
  const definition=battleDat.locomotionStates['105'];
  for(const previous of [199,200,430,440,441]){
   const fighter={state:105,time:0,anim:105,elem:1,prevState:previous,type:'A',facing:1,vars:[],sysvars:[],vx:0,vy:0};
   executeControllerM1(definition.controllers.find(item=>item.type==='VelSet'),fighter,fighterExpressionContext(fighter,{type:'S'}),{});
   if(Math.abs(fighter.vx-(-30*(previous>=200&&previous<=440?1.02:1)))>1e-8||fighter.vy!==-5)throw Error('Source prevstate backdash boost');
  }
  if(resolveFighterCollisionM1({anim:200,elem:4,x:0,y:0,facing:1,hitDef:{}},{state:105,anim:0,elem:1,x:140,y:0,facing:-1}).contact)throw Error('105 source NotHitBy');
  return true;
 })()`);assert.equal(dashSourceChecks,true);
 for(const player of [1,2]){
  const results=[];
  for(const rate of [30,60,120]){
   await run(`resetPlayerInput();setP2ControlMode('dummy');simPaused=false;p1Reaction=null;p1HitPause=0;cornerPushVelocity=0;cameraX=0;posX=${player===1?0:400};posY=0;p1Facing=${player===1?1:-1};vx=0;vy=0;p2.x=${player===2?0:400};p2.y=0;p2.facing=${player===2?1:-1};p2.vx=0;p2.vy=0;p2.hitShake=0;p2.attackPause=0;p2.getHit=null;p2.cornerPushVelocity=0;enterIRState(${player===1?105:0});enterP2State(${player===2?105:0});simulationAccumulator=0`);
   await run(`for(let frame=0;frame<${rate/2};frame++)advanceSimulation(1/${rate})`);
   results.push(await run(player===1?'({state,time:stateTicks,x:posX,y:posY,vx,vy,anim:current,elem:fi+1})':'({state:p2.state,time:p2.time,x:p2.x,y:p2.y,vx:p2.vx,vy:p2.vy,anim:p2.anim,elem:p2.elem})'));
  }
  assert.deepEqual(results[0],results[1]);assert.deepEqual(results[1],results[2]);
  for(const edge of [-1,1]){
   await run(`resetPlayerInput();setP2ControlMode('dummy');p1Reaction=null;p1HitPause=0;cornerPushVelocity=0;cameraX=${edge*2850};posX=${edge*(player===1?3430:3000)};posY=0;p1Facing=${player===1?-edge:edge};vx=0;vy=0;p2.x=${edge*(player===2?3430:3000)};p2.y=0;p2.facing=${player===2?-edge:edge};p2.vx=0;p2.vy=0;p2.hitShake=0;p2.attackPause=0;p2.getHit=null;p2.cornerPushVelocity=0;enterIRState(${player===1?105:0});enterP2State(${player===2?105:0})`);
   for(let tick=0;tick<30;tick++){await step();assert.equal(await run(player===1?'posX':'p2.x'),edge*3430)}
   assert.equal(await run(player===1?'posY':'p2.y'),0);assert.equal(await run(player===1?'state':'p2.state'),0);
  }
 }
 const crouchSemantics=await run(`(()=>{
  let cases=0;
  for(const [state,damage,hitTime,slideTime,hitVX,guardVX,pause] of [[400,20,15,11,-14,-14,8],[410,100,27,23,-42,-42,8],[430,30,15,11,-16,-14,10]]){
   const params=battleDat.attackStates[state].controllers.find(controller=>controller.type==='HitDef').params;
   for(const facing of [-1,1])for(const type of ['S','C'])for(const mode of ['none','stand','crouch']){
    const result=resolveGroundHitM1({id:1,facing},{type,y:0,ctrl:1,moveType:'I',life:1000,state:type==='C'?11:0},params,mode),guarded=mode==='crouch';
    if(result.guarded!==guarded||result.life!==1000-(guarded?0:damage))throw Error('Low guard/damage '+state);
    if(result.getHit.hittime!==(guarded?(state===410?34:22):hitTime)||result.getHit.slidetime!==(guarded?(state===410?24:16):slideTime))throw Error('Hit/slide time '+state);
    if(result.getHit.xvel!==-(guarded?guardVX:hitVX)*facing||result.attackerPause!==pause||result.defenderPause!==pause)throw Error('Velocity/pause '+state);
    if(result.getHit.animtype!==(state===410?1:0)||result.getHit.groundtype!==2||result.state!==(guarded?152:type==='C'?5010:5000))throw Error('GetHit selection '+state);
    cases++;
   }
   for(const flag of ['H','M','L'])for(const mode of ['stand','crouch']){
    const result=resolveGroundHitM1({id:1,facing:1},{type:mode==='crouch'?'C':'S',y:0,ctrl:1,moveType:'I',life:1000,state:0},{...params,guardflag:flag},mode);
    if(result.guarded!==(flag==='M'||flag===(mode==='stand'?'H':'L')))throw Error('High/Low guard matrix');cases++;
   }
  }
  for(const state of [200,230,400,430,210,410])for(const moveType of ['A','I'])for(const down of [false,true])for(const control of [0,1]){
   const fighter={state,time:10,type:state>=400?'C':'S',ctrl:control,moveType,anim:state,facing:1,vars:[],sysvars:[]};
   for(const [button,target] of [['x',down?400:200],['y',down?410:210],['a',down?430:230]]){
    const controller=battleDat.attackCommands.find(controller=>Number(controller.params.value)===target),context=fighterExpressionContext(fighter,{type:'S'},{[button]:true,holddown:down});
    const expected=!!control||((down?[400,430]:[200,230]).includes(state)&&moveType==='I');
    if(controllerTriggered(controller,context)!==expected)throw Error('Source chain gate '+state+' -> '+target);cases++;
   }
  }
  return cases;
 })()`);assert.equal(crouchSemantics,198);
 const crouchAttacks=[];
 for(const player of [1,2])for(const facing of [-1,1])for(const [attack,action,damage] of [[400,'x',20],[410,'y',100],[430,'a',30]])for(const mode of ['none','stand','crouch']){
  await run(`resetPlayerInput();setP2ControlMode('${player===2?'keyboard':'dummy'}');simPaused=false;p1Reaction=null;p1HitPause=0;cornerPushVelocity=0;cameraX=0;posX=${player===1?0:facing*140};posY=0;p1Facing=${player===1?facing:-facing};vx=0;vy=0;p1Life=1000;p1LastHitKey=null;p2.x=${player===2?0:facing*140};p2.y=0;p2.vx=0;p2.vy=0;p2.facing=${player===2?facing:-facing};p2.hitShake=0;p2.attackPause=0;p2.getHit=null;p2.lastHitKey=null;p2.life=1000;p2.cornerPushVelocity=0;document.querySelector('#p2Guard').value='${mode}';enterIRState(0);enterP2State(0);${player===2&&mode!=='none'?`input.${facing===1?'right':'left'}=true;input.down=${mode==='crouch'};`:''}`);
  const down=await run(`keyboardBindings.${player===1?'p1':'p2'}.down`),code=await run(`keyboardBindings.${player===1?'p1':'p2'}.${action}`);
  await page.keyboard.down(down);await page.keyboard.down(code);await step();await page.keyboard.up(code);assert.equal(await run(player===1?'state':'p2.state'),attack);
  let contact=null;
  for(let tick=0;tick<100;tick++){await step();const hit=await run(player===1?'p2.getHit':'p1Reaction?.getHit||null');if(!contact&&hit)contact={hit,before:await run('combatTraceExport().frames.at(-1).before.p1'),held:await run('canonicalNow()'),anim:await run(player===1?'p2.anim':'current'),counter:await run(player===1?'({contact:moveContact,guarded:moveGuarded})':'({contact:p2.moveContact,guarded:p2.moveGuarded})')};}
  await page.keyboard.up(down);assert.ok(contact);assert.equal(contact.hit.guarded,mode==='crouch',JSON.stringify({player,facing,attack,mode,contact}));assert.equal(contact.counter.contact,1);assert.equal(contact.counter.guarded,mode==='crouch'?1:0);
  if(mode!=='crouch')assert.equal(contact.anim,attack===410?5011:5010);
  assert.equal(await run(player===1?'p2.life':'p1Life'),mode==='crouch'?1000:1000-damage);
  crouchAttacks.push({player,facing,attack,mode});
 }
 const crouchRecovery=await run(`(()=>{
  for(const animtype of [0,1]){
   const fighter={state:11,time:0,type:'C',life:1000,lifeMax:1000,facing:-1,x:0,y:0,vx:0,vy:0,ctrl:0,moveType:'H',hitShake:0,hitTime:27,getHit:{animtype,groundtype:2,xvel:42,yvel:0,fall:0,hittime:27,slidetime:23,ctrltime:24}};
   enterGroundReactionState(fighter,5010);if(fighter.anim!==5020+animtype)throw Error('Crouch shake anim');
   stepGroundReactionM1(fighter,'none');if(fighter.state!==5011||fighter.vx!==42)throw Error('Crouch HitVelSet');
   for(let tick=0;tick<18;tick++)stepGroundReactionM1(fighter,'none');
   if(fighter.anim!==5025+animtype)throw Error('Crouch recover anim');
   for(let tick=0;tick<30;tick++)stepGroundReactionM1(fighter,'none');if(fighter.state!==11||fighter.y!==0)throw Error('Crouch return');
  }
  resetPlayerInput();p1Reaction=null;p1HitPause=0;enterIRState(400);stateTicks=10;p1AnimStartTime=0;
  if(!evalM1('AnimElem = 5,2')||evalM1('AnimElem = 5,1'))throw Error('AIR element offset');
  for(const [state,time] of [[400,10],[430,10]]){enterIRState(state);stateTicks=time;p1AnimStartTime=0;const controller=sourceState(state).controllers.find(item=>item.type==='ChangeState');runController(controller);if(state!==400&&state!==430)throw Error('bad fixture');if(![11].includes(window.runtimeTest.run('state')))throw Error('Release-down source return')}
  return true;
 })()`);assert.equal(crouchRecovery,true);
 console.log(JSON.stringify({crouchSemantics,crouchAttacks,crouchRecovery}));
 const newAttacks=[];
 for(const player of [1,2])for(const facing of [-1,1])for(const [attack,action,damage] of [[210,'y',100],[230,'a',30],[240,'b',100]])for(const guarded of [false,true]){
  await run(`resetPlayerInput();setP2ControlMode('${player===2?'keyboard':'dummy'}');simPaused=false;p1Reaction=null;p1HitPause=0;cornerPushVelocity=0;cameraX=0;posX=${player===1?0:facing*140};posY=0;p1Facing=${player===1?facing:-facing};vx=0;vy=0;p1Life=1000;p1LastHitKey=null;p2.x=${player===2?0:facing*140};p2.y=0;p2.vx=0;p2.vy=0;p2.facing=${player===2?facing:-facing};p2.hitShake=0;p2.attackPause=0;p2.getHit=null;p2.lastHitKey=null;p2.life=1000;p2.cornerPushVelocity=0;document.querySelector('#p2Guard').value='${guarded?'stand':'none'}';enterIRState(0);enterP2State(0);${player===2&&guarded?`input.${facing===1?'right':'left'}=true;`:''}`);
  const code=await run(`keyboardBindings.${player===1?'p1':'p2'}.${action}`);await page.keyboard.down(code);await step();await page.keyboard.up(code);
  assert.equal(await run(player===1?'state':'p2.state'),attack);
  let airborne=false,landing=false;
  for(let tick=0;tick<100;tick++){await step();if(await run(player===1?'posY<0':'p2.y<0'))airborne=true;if(await run(player===1?'current===241':'p2.anim===241'))landing=true}
  assert.equal(await run(player===1?'p2.life':'p1Life'),guarded?1000:1000-damage);
  assert.equal(await run(player===1?'state':'p2.state'),0);assert.equal(await run(player===1?'posY':'p2.y'),0);
  if(attack===240){assert.equal(airborne,true);assert.equal(landing,true)}
  newAttacks.push({player,facing,attack,guarded});
 }
 for(const player of [1,2])for(const direction of ['up','down']){
  await run(`resetPlayerInput();setP2ControlMode('${player===2?'keyboard':'dummy'}');p1Reaction=null;p1HitPause=0;cornerPushVelocity=0;cameraX=0;posX=${player===1?0:1000};posY=0;p1Facing=${player===1?1:-1};vx=0;vy=0;p2.x=${player===2?0:1000};p2.y=0;p2.vx=0;p2.vy=0;p2.facing=${player===2?1:-1};p2.hitShake=0;p2.attackPause=0;p2.getHit=null;p2.cornerPushVelocity=0;document.querySelector('#p2Guard').value='none';enterIRState(${player===1?230:0});enterP2State(${player===2?230:0});${player===1?'input':'p2Input'}.${direction}=true;input.jump=input.up`);
  let cancelled=false,landed=false;
  for(let tick=0;tick<100;tick++){
   await step();if(await run(player===1?`state===${direction==='up'?40:10}`:`p2.state===${direction==='up'?40:10}`))cancelled=true;
   if(cancelled)await run(`${player===1?'input':'p2Input'}.${direction}=false;input.jump=input.up`);
   if(await run(player===1?'state===52':'p2.state===52'))landed=true;
  }
  assert.equal(cancelled,true);if(direction==='up')assert.equal(landed,true);
 }
 const jumpLandSound=await run(`(()=>{resetPlayerInput();p1HitPause=0;p1Reaction=null;enterIRState(52);const soundLog=[],originalPlay=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){soundLog.push(this.src.split('/').pop());return Promise.resolve()};try{for(let tick=0;tick<8;tick++)simStep();return soundLog.filter(sound=>sound==='52-0.wav').length}finally{HTMLMediaElement.prototype.play=originalPlay}})()`);assert.equal(jumpLandSound,1);
 console.log(JSON.stringify({newAttacks,jumpLandSound,cancelBranches:'PASS'}));
 await run("resetPlayerInput();setP2ControlMode('dummy');enterIRState(0);enterP2State(0)");
 for(const [player,bindings] of Object.entries(await run('defaultBindings')))for(const [action,code] of Object.entries(bindings)){
  await page.keyboard.down(code);assert.equal(await run((player==='p1'?'input':'p2Input')+'.'+action),true);
  if(player==='p1'&&['KeyA','KeyS','KeyQ','KeyW'].includes(code))assert.equal(await run('input.left||input.right||input.up||input.down'),false);
  await page.keyboard.up(code);assert.equal(await run((player==='p1'?'input':'p2Input')+'.'+action),false);
 }
 await run("resetPlayerInput();setP2ControlMode('dummy')");
 for(const code of ['KeyJ','KeyL','KeyU','KeyD']){await page.keyboard.press(code);assert.equal(await run('p2PunchRequested||p2Input.left||p2Input.right||input.right'),false)}
 await page.locator('#openSettings').click();assert.equal(await run('simPaused'),true);
 await page.locator('[data-player="p1"][data-action="x"]').click();await page.keyboard.press('Numpad0');assert.equal(await run("draftBindings.p1.x"),'KeyZ');
 await page.keyboard.press('KeyC');await page.locator('#saveBindings').click();assert.equal(await run('keyboardBindings.p1.x'),'KeyC');
 await page.locator('#openSettings').click();await page.locator('[data-player="p2"][data-action="y"]').click();await page.keyboard.press('KeyV');await page.locator('#cancelBindings').click();assert.equal(await run('keyboardBindings.p2.y'),'NumpadDecimal');
 assert.equal(await run('loadKeyboardBindings().p1.x'),'KeyC');
 await page.locator('#openSettings').click();await page.locator('#defaultBindings').click();await page.locator('#saveBindings').click();assert.deepEqual(await run('keyboardBindings'),await run('defaultBindings'));
 const sourceEffects=await run(`(()=>{
  const soundLog=[],originalPlay=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){soundLog.push(this.src.split('/').pop());return Promise.resolve()};
  try{
   for(const player of [1,2]){
    for(const time of [6,24,42,60]){
     if(player===1){current=100;stateTicks=time;runController(battleDat.locomotionStates['100'].controllers.find(controller=>controller.type==='PlaySnd'))}
     else{p2.anim=100;p2.time=time;runP2ControllerM1(battleDat.locomotionStates['100'].controllers.find(controller=>controller.type==='PlaySnd'))}
    }
   }
   if(soundLog.filter(sound=>sound==='100-0.wav').length!==8)throw Error('Footsteps did not repeat across both loops');
   p1HitPause=0;p2.attackPause=0;cameraX=0;cameraY=0;
   for(const player of [1,2])for(const facing of [-1,1]){
    sourceExplods.length=0;posX=0;posY=-10;p1Facing=facing;current=105;stateTicks=4;p2.x=0;p2.y=-10;p2.facing=facing;p2.anim=105;p2.time=4;
    const controller=battleDat.locomotionStates['105'].controllers.find(controller=>controller.type==='Explod');
    if(player===1)runController(controller);else runP2ControllerM1(controller);
    if(sourceExplods.length!==1)throw Error('909 missing');const effect=sourceExplods[0];
    if(effect.x!==0||effect.y!==-10||effect.age!==0||effect.sprpriority!==3||effect.facing!==facing)throw Error('909 spawn');
    drawSourceExplods();const pixels=effectContext.getImageData(0,0,effectCanvas.width,effectCanvas.height).data;
    if(!pixels.some((value,index)=>index%4===3&&value>0))throw Error('909 invisible');
    p1HitPause=1;stepSourceExplods();if(effect.age!==0)throw Error('909 hitpause');p1HitPause=0;
    for(let tick=1;tick<8;tick++){stepSourceExplods();if(effect.age!==tick||effect.x!==tick*10*facing||effect.y!==-10-tick*5)throw Error('909 velocity/age')}
    stepSourceExplods();if(sourceExplods.length)throw Error('909 did not expire');
   }
   for(const player of [1,2])for(const facing of [-1,1]){
    resetPlayerInput();setP2ControlMode('dummy');p1Reaction=null;p1HitPause=0;cornerPushVelocity=0;cameraX=0;posX=player===1?0:facing*1000;posY=0;p1Facing=player===1?facing:-facing;vx=0;vy=0;p2.x=player===2?0:facing*1000;p2.y=0;p2.vx=0;p2.vy=0;p2.facing=player===2?facing:-facing;p2.hitShake=0;p2.attackPause=0;p2.getHit=null;p2.cornerPushVelocity=0;document.querySelector('#p2Guard').value='none';sourceExplods.length=0;enterIRState(player===1?105:0);enterP2State(player===2?105:0);
    let spawns=0,landed=false;
    for(let tick=0;tick<30;tick++){simStep();if(sourceExplods.some(effect=>effect.age===0)){spawns++;const effect=sourceExplods[0],owner=player===1?liveP1():p2;if(effect.x!==owner.x||effect.y!==owner.y)throw Error('909 first tick binding')}
     if((player===1?state:p2.state)===106)landed=true;
    }
    if(spawns!==1||sourceExplods.length||!landed)throw Error('909 state lifecycle');
   }
   if(soundLog.filter(sound=>sound==='52-0.wav').length!==4)throw Error('Landing sound missing');
   return {footsteps:soundLog.filter(sound=>sound==='100-0.wav').length,landingSounds:4,explod909:'PASS',bindings:'PASS',settings:'PASS'};
  }finally{HTMLMediaElement.prototype.play=originalPlay}
 })()`);
 console.log(JSON.stringify(sourceEffects));
 await page.waitForFunction(()=>window.runtimeTest.run('!!fallDat&&!!commonFallDat'));
 const sweepLive=[];
 await run("document.activeElement?.blur();inputPreference='keyboard';setInputMode('keyboard')");
 for(const player of [1,2])for(const facing of [-1,1])for(const guarded of [false,true]){
  await run(`resetPlayerInput();setP2ControlMode('${player===2?'keyboard':'dummy'}');simPaused=false;p1Reaction=null;p1HitPause=0;cornerPushVelocity=0;cameraX=0;posX=${player===1?0:facing*140};posY=0;p1Facing=${player===1?facing:-facing};vx=0;vy=0;p1Life=1000;p1LastHitKey=null;p2.x=${player===2?0:facing*140};p2.y=0;p2.vx=0;p2.vy=0;p2.facing=${player===2?facing:-facing};p2.hitShake=0;p2.attackPause=0;p2.getHit=null;p2.lastHitKey=null;p2.life=1000;p2.invulnerableUntil=0;p2.cornerPushVelocity=0;document.querySelector('#p2Guard').value='${guarded?'crouch':'none'}';enterIRState(0);enterP2State(0);${player===2&&guarded?`input.${facing===1?'right':'left'}=true;input.down=true;`:''}`);
  const down=await run(`keyboardBindings.${player===1?'p1':'p2'}.down`),kick=await run(`keyboardBindings.${player===1?'p1':'p2'}.b`);
  await page.keyboard.down(down);for(let tick=0;tick<6;tick++)await step();await page.keyboard.down(kick);await step();await page.keyboard.up(kick);
  assert.equal(await run(player===1?'state':'p2.state'),440);
  const visited=new Set();
  for(let tick=0;tick<140;tick++){await step();visited.add(await run(player===1?'p2.state':'state'))}
  await page.keyboard.up(down);
  assert.equal(await run(player===1?'p2.life':'p1Life'),guarded?1000:930);
  if(!guarded)for(const state of [5070,5071,5110,5120])assert.ok(visited.has(state),'live chain '+state);
  sweepLive.push({player,facing,guarded});
 }
 console.log(JSON.stringify({sweepLive}));
 const fallChecks=await page.evaluate(()=>window.runtimeTest.run(`
 (()=>{
  let checks=0;
  const params=battleDat.attackStates['440'].controllers.find(controller=>controller.type==='HitDef').params;
  if(params.damage!=='70,0'||params['ground.type']!=='Trip'||params.guardflag!=='L')throw Error('440 source');
  if(params['ground.velocity']!=='-10,-18'||params['air.velocity']!=='-8,-18')throw Error('440 user velocity override');
  for(const facing of [-1,1])for(const mode of ['none','stand','crouch']){
   const result=resolveGroundHitM1({id:1,facing},{type:'S',state:0,y:0,ctrl:1,moveType:'I',life:1000},params,mode);
   if(result.guarded!==(mode==='crouch')||result.state!==(mode==='crouch'?152:5070))throw Error('440 guard');checks++;
  }
  for(const facing of [-1,1])for(const dead of [false,true]){
   const result=resolveGroundHitM1({id:1,facing},{type:'S',state:0,y:0,ctrl:1,moveType:'I',life:dead?50:1000},params,'none');
   const fighter={state:0,anim:0,time:0,elem:1,elemTick:0,x:0,y:0,vx:0,vy:0,facing:-facing,life:result.life,getHit:result.getHit,hitShake:0,hitTime:27,vars:[],sysvars:[]};
   enterGroundReactionState(fighter,5070);const visited=new Set();
   for(let tick=0;tick<180;tick++){visited.add(fighter.state);stepGroundReactionM1(fighter,'none');if(fighter.state===11||fighter.state===5150)break}
   for(const state of [5070,5071,5110])if(!visited.has(state))throw Error('Trip chain missing '+state);
   if(fighter.state!==(dead?5150:11))throw Error('Trip terminal '+fighter.state);
   if(!dead&&!visited.has(5120))throw Error('No recovery');
   if(fighter.y!==0)throw Error('Trip ground');checks++;
  }
  for(const facing of [-1,1]){
   const result=resolveGroundHitM1({id:1,facing},{type:'S',state:0,y:0,ctrl:1,moveType:'I',life:1000},params,'none');
   const fighter={state:0,anim:5050,time:0,elem:1,elemTick:0,x:0,y:-200,vx:8*facing,vy:10,facing,life:930,getHit:result.getHit,hitTime:27,hitShake:0,vars:[],sysvars:[]};
   fighter.getHit['fall.damage']=20;enterGroundReactionState(fighter,5050);const visited=new Set();
   for(let tick=0;tick<200;tick++){visited.add(fighter.state);stepGroundReactionM1(fighter,'none');if(fighter.state===11)break}
   for(const state of [5050,5100,5101,5110,5120])if(!visited.has(state))throw Error('Bounce chain missing '+state);
   if(fighter.state!==11||fighter.life!==910||fighter.getHit['fall.damage']!==0)throw Error('Bounce damage/recovery');checks++;
  }
  const result=resolveGroundHitM1({id:1,facing:1},{type:'S',state:0,y:0,ctrl:1,moveType:'I',life:1000},{...params,'fall.envshake.time':'6','fall.envshake.phase':'90','fall.envshake.ampl':'-8'},'none');
  const fighter={state:0,anim:5050,time:0,elem:1,elemTick:0,x:0,y:100,vx:12,vy:24,facing:1,life:930,getHit:result.getHit,hitShake:0,hitTime:27,vars:[],sysvars:[]};
  enterGroundReactionState(fighter,5100);stepSourceFallM1(fighter);
  if(!fallShake||fighter.getHit['fall.envshake.time']!==0)throw Error('FallEnvShake consume');
  const calibration=cameraX;simPaused=false;stepFallShake();
  if(document.querySelector('#venus').style.translate==='0 0px'||cameraX!==calibration)throw Error('FallEnvShake visual/calibration');
  for(let tick=0;tick<8;tick++)stepFallShake();if(fallShake||document.querySelector('#venus').style.translate)throw Error('FallEnvShake expiry');
  const before=fighter.vx;enterGroundReactionState(fighter,5101);stepSourceFallM1(fighter);
  if(fighter.vx!==before||Math.abs(fighter.vy-(-18+1.6))>.001)throw Error('HitFallVel default preserve X');
  fighter.getHit['fall.xvel']=-32;fighter.getHit['fall.yvel']=-40;enterGroundReactionState(fighter,5101);stepSourceFallM1(fighter);
  if(fighter.vx!==-32||Math.abs(fighter.vy-(-40+1.6))>.001)throw Error('HitFallVel explicit');
  enterGroundReactionState(fighter,5120);stepSourceFallM1(fighter);fighter.time=actionDuration(fighter.anim);fighter.getHit.fall=0;stepSourceFallM1(fighter);
  if(fighter.state!==11||fighter.getHit.fall!==1)throw Error('Source HitFallSet');
  fighter.life=0;enterGroundReactionState(fighter,5150);for(let tick=0;tick<100;tick++)stepSourceFallM1(fighter);
  if(fighter.state!==5150||fighter.ctrl||fighter.sprPriority!==-3)throw Error('KO must remain');
  return {checks,trip:'PASS',bounce:'PASS',ko:'PASS',fallControllers:'PASS'};
 })()`));
 console.log(JSON.stringify({fallChecks}));
 const koChecks=await run(`(()=>{
  let count=0;
  for(const player of [1,2])for(const facing of [-1,1])for(const attack of [200,210,230,240,400,410,430,440]){
   resetPlayerInput();setP2ControlMode('dummy');simPaused=false;p1Reaction=null;p1InvulnerableUntil=0;p1HitPause=0;cornerPushVelocity=0;posX=player===1?0:facing*140;posY=0;p1Facing=player===1?facing:-facing;vx=0;vy=0;p1Life=player===1?1000:1;p1LastHitKey=null;
   p2.x=player===2?0:facing*140;p2.y=0;p2.vx=0;p2.vy=0;p2.facing=player===2?facing:-facing;p2.life=player===2?1000:1;p2.hitShake=0;p2.attackPause=0;p2.lastHitKey=null;p2.getHit=null;p2.invulnerableUntil=0;p2.cornerPushVelocity=0;document.querySelector('#p2Guard').value='none';
   enterIRState(player===1?attack:0);enterP2State(player===2?attack:0);const visited=new Set();
   for(let tick=0;tick<220;tick++){simStep();visited.add(player===1?p2.state:state)}
   const receiver=player===1?p2:liveP1();
   if(receiver.life!==0||receiver.state!==5150||receiver.y!==0)throw Error('KO terminal '+JSON.stringify({player,facing,attack,receiver}));
   if(visited.has(5120)||!visited.has(5110))throw Error('KO recovery forbidden');
   if(attack!==440)for(const required of [5000,5030,5050,5100,5101])if(!visited.has(required))throw Error('KO missing '+required+' attack '+attack);
   count++;
  }
  const params=battleDat.attackStates['200'].controllers.find(controller=>controller.type==='HitDef').params;
  for(const facing of [-1,1]){
   const result=resolveGroundHitM1({id:1,facing},{type:'S',y:0,ctrl:1,moveType:'I',state:0,life:20},params,'none');
   if(!result.getHit.fall||result.getHit.animtype!==3||Math.abs(result.getHit.xvel-20.56*facing)>.001||result.getHit.yvel!==-24)throw Error('IKEMEN KO velocity');
   const survive=resolveGroundHitM1({id:1,facing},{type:'S',y:0,ctrl:1,moveType:'I',state:0,life:20},{...params,kill:'0'},'none');
   if(survive.life!==1||survive.getHit.fall)throw Error('kill=0');
  }
  resetPlayerInput();p1Reaction=null;p1HitPause=0;p1Life=0;p2.life=0;posX=-300;posY=0;vx=0;vy=0;p2.x=300;p2.y=0;p2.vx=0;p2.vy=0;enterIRState(0);enterP2State(0);
  for(let tick=0;tick<220;tick++)simStep();
  if(state!==5150||p2.state!==5150||runtimeCtrl||p2.ctrl)throw Error('HP0 outside hit state');
  return {count,normalHitKo:'PASS',noGetUp:'PASS',velocities:'PASS',zeroLifeFallback:'PASS'};
 })()`);
 console.log(JSON.stringify({koChecks}));
 assert.deepEqual(errors,[]);
console.log(JSON.stringify({orientationChecks,standing,crouching,edges,keyboard:'PASS',combat,reverseCases,reverseCornerpush:'PASS',reverseWhiff:'PASS',pausedReverse:'PASS',expressionParity,contextIsolation:'PASS',p2Keyboard:'PASS',sharedControllers:'PASS',p2Walking,p2ManualGuard:'PASS',p2TurnClock:'PASS',p2FrameRates:'PASS',p2StageEdges:'PASS',simultaneous,punchTrades,getHitSemantics,guardDistanceChecks,guardEndFrames,locomotion,dashSourceChecks,contactClocks:'PASS',whiff:'PASS',browserErrors:errors}));
})().catch(error=>{console.error(error);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.close()});
