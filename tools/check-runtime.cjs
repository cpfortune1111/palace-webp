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
  html=html.replace('</script></body>',"window.runtimeTest={run:source=>eval(source),step:()=>{simStep();updateCamera();updateDebugHud();r.render(s,c);draw();drawMars();drawCollision()},snapshot:()=>({state,fi,current,p1Facing,posX,posY,vx,vy,cameraX,stateTicks,p1TurnTime,p2:{...p2},runtimeFailed})};</script></body>");
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
 await page.keyboard.down('KeyX');const attack=await step();assert.equal(attack.state,200);await page.keyboard.up('KeyX');
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
 await run("simPaused=true;logicFrame={state:200,time:3,anim:200,elem:4,facing:1,x:0,y:0,vx:0,vy:0,life:1000,sprPriority:2,p2:{...p2,state:5001,time:4,anim:5000,elem:2,x:100,y:0,facing:-1,vx:16,vy:0,life:980,sprPriority:0}};updateDebugHud();draw();drawMars();drawCollision()");
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
 assert.equal(trace.version,'0.23.16');assert.equal(trace.tickRate,60);assert.equal(trace.frames.length,12);
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
 assert.equal(download.suggestedFilename(),'palace-0.23.16-trace.json');
 const downloaded=JSON.parse(fs.readFileSync(await download.path(),'utf8'));
 assert.deepEqual(downloaded,trace);
 const pausedCount=await run('combatTraceTick');await run('simPaused=true;draw();drawMars();drawCollision()');
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
   if(result.getHit.xvel!==(guarded?-24:-16)||result.getHit.slidetime!==(guarded?16:11)||result.getHit.hittime!==(guarded?22:15))throw Error('Shared source gethit values');
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
 await run("p2.getHit={xvel:-24,attackerFacing:1,crouch:false};p1Facing=-1;enterP2State(151)");
 assert.equal(await run('p2.vx'),24);
 const reverseCases=[];
 for(const facing of [-1,1])for(const guarded of [false,true]){
  await run(`simPaused=false;resetPlayerInput();p1Reaction=null;p1LastHitKey=null;p1HitPause=0;p1Life=1000;cornerPushVelocity=0;cameraX=0;posX=${facing*140};posY=0;p1Facing=${-facing};vx=0;vy=0;p2.x=0;p2.y=0;p2.vx=0;p2.vy=0;p2.facing=${facing};p2.life=1000;p2.hitShake=0;p2.attackPause=0;p2.cornerPushVelocity=0;p2.lastHitKey=null;p2.getHit=null;document.querySelector('#p2Guard').value='none';enterIRState(0);enterP2State(0);input.left=${guarded&&facing===-1};input.right=${guarded&&facing===1};`);
  await page.locator('#p2Punch').click();
  for(let tick=0;tick<4;tick++)await step();
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
  for(let tick=0;tick<4;tick++)await step();
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
 await page.keyboard.down('u');assert.equal(await run('p2PunchRequested'),true);
 await step();assert.equal(await run('combatTraceExport().frames.at(-1).physicalInput.p2Punch'),true);
 for(let tick=0;tick<3;tick++)await step();assert.equal(await run('p1Life'),980);
 for(let tick=0;tick<45;tick++)await step();
 assert.equal(await run('p2.state'),0);await page.keyboard.down('u');
 assert.equal(await run('p2PunchRequested'),false);await page.keyboard.up('u');
 await page.keyboard.press('u');assert.equal(await run('p2PunchRequested'),true);
 await run('resetPlayerInput()');assert.equal(await run('p2PunchRequested'),false);
 await page.locator('#p2Guard').focus();await page.keyboard.press('u');assert.equal(await run('p2PunchRequested'),false);
 await run('document.activeElement.blur()');
 await page.evaluate(()=>window.dispatchEvent(new KeyboardEvent('keydown',{code:'KeyU',ctrlKey:true,cancelable:true})));
 assert.equal(await run('p2PunchRequested'),false);
 await page.locator('#inputMode').selectOption('touch');await page.keyboard.press('u');assert.equal(await run('p2PunchRequested'),false);
 await page.locator('#inputMode').selectOption('auto');await run("setInputMode('touch')");await page.keyboard.press('u');
 assert.equal(await run('activeInputMode'),'keyboard');assert.equal(await run('p2PunchRequested'),true);
 await page.evaluate(()=>window.dispatchEvent(new Event('blur')));assert.equal(await run('p2PunchRequested'),false);
 assert.deepEqual(errors,[]);
 console.log(JSON.stringify({orientationChecks,standing,crouching,edges,keyboard:'PASS',combat,reverseCases,reverseCornerpush:'PASS',reverseWhiff:'PASS',pausedReverse:'PASS',expressionParity,contextIsolation:'PASS',p2Keyboard:'PASS',whiff:'PASS',browserErrors:errors}));
})().catch(error=>{console.error(error);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.close()});
