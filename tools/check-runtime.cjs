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
 await page.waitForFunction(()=>window.runtimeTest?.run('!!dat&&!!stateIR&&!!turnDat&&!!attackDat&&!!gethitDat&&!!battleDat&&!!guardDat'),{timeout:45000});
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
 assert.deepEqual(errors,[]);
 console.log(JSON.stringify({orientationChecks,standing,crouching,edges,keyboard:'PASS',combat,whiff:'PASS',browserErrors:errors}));
})().catch(error=>{console.error(error);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.close()});
