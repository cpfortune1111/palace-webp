const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const assert=require('node:assert/strict');
const {chromium}=require('C:/Users/jeffy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
let browser;
const server=http.createServer((request,response)=>{
 const filename=new URL(request.url,'http://localhost').pathname.slice(1)||'index.html';
 if(filename.includes('..')){response.writeHead(400);response.end();return}
 const file=path.join('work',filename);
 if(!fs.existsSync(file)){response.writeHead(404);response.end();return}
 let content=fs.readFileSync(file);
 if(filename==='index.html')content=Buffer.from(content.toString().replaceAll('requestAnimationFrame(loop);','').replace('</script></body>',"window.specialTest={run:source=>eval(source)};</script></body>"));
 response.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.json':'application/json','.png':'image/png'})[path.extname(filename)]||'application/octet-stream');response.end(content);
});
(async()=>{
 await new Promise(resolve=>server.listen(8766,'127.0.0.1',resolve));
 browser=await chromium.launch({headless:true,channel:'msedge'});
 const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];
 page.on('pageerror',error=>errors.push(error.message));page.on('requestfailed',request=>console.log('Request failed: '+request.url()+' '+request.failure()?.errorText));
 await page.goto('http://127.0.0.1:8766/?mode=training');
 await page.waitForFunction(()=>window.specialTest?.run('!!specialDat&&!!battleDat&&!!dat&&!!turnDat&&!!guardDat&&!!fallDat&&!!airDat'),null,{timeout:90000}).catch(error=>{throw Error(error.message+'; errors: '+JSON.stringify(errors)+'; status: '+String(error))});
 const run=source=>page.evaluate(source=>window.specialTest.run(source),source);
 await page.waitForFunction(()=>window.specialTest.run('!!lifecycleDat'),null,{timeout:30000});
 await page.waitForFunction(()=>window.specialTest.run('!gameShell.isHome()'),null,{timeout:30000});
 if(process.argv.includes('--p2-jump')){
  await page.keyboard.press('Numpad8');await run('setP2ControlMode("keyboard")');await page.keyboard.down('Numpad8');const result=await run('simStep();({state:p2.state,up:p2Commands().holdup})');await page.keyboard.up('Numpad8');assert.equal(result.state,40);console.log(JSON.stringify(result));return;
 }
 if(process.argv.includes('--menu')){
  await run('gameShell.ready');await page.evaluate(()=>{window.originalMusicPlay=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){return Promise.reject(new DOMException('Blocked','NotAllowedError'))}});await run('gameShell.showHome()');assert.equal(await page.locator('#enableBgm').count(),0);assert.equal(await page.locator('#tsukinoLink').getAttribute('href'),'https://tsukinoaiplus.com');await page.evaluate(()=>{window.musicPlayAttempts=0;HTMLMediaElement.prototype.play=function(){window.musicPlayAttempts++;return Promise.resolve()}});await page.mouse.click(600,400);assert.ok(await page.evaluate(()=>window.musicPlayAttempts>0));await page.evaluate(()=>{HTMLMediaElement.prototype.play=window.originalMusicPlay});await page.getByRole('button',{name:'Options',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#optionTimer'));await page.waitForTimeout(1500);assert.equal(await page.locator('#tsukinoLink').isVisible(),false);await page.screenshot({path:'work/options-preview.png'});await page.getByRole('button',{name:'Back',exact:true}).click();await run(`fightHud.reset();const values=[];for(let tick=0;tick<10;tick++){fightHud.step(true,[500,250]);values.push(fightHud.displayFront()[0]);if(fightHud.displayLife()[0]!==1)throw Error('Mid hold changed')}if(values[0]===.5||values.at(-1)!==.5)throw Error('Front duration');for(let index=2;index<10;index++)if(values[index-1]-values[index]>values[index-2]-values[index-1]+1e-10)throw Error('Front ease out')`);await page.screenshot({path:'work/title-menu-preview.png'});
  await run('gameShell.start("watch")');const result=await run(`(()=>{let moves=[new Set(),new Set()];for(let index=0;index<1200;index++){simStep();moves[0].add(state);moves[1].add(p2.state)}fightHud.reset();for(let index=0;index<60;index++){fightHud.step(true,[500,250]);if(fightHud.displayLife().some(value=>value!==1))throw Error('60 tick HP hold')}const samples=[];for(let index=1;index<=10;index++){fightHud.step(true,[500,250]);const values=fightHud.displayLife();if(Math.abs(values[0]-(1-.05*index))>1e-10||Math.abs(values[1]-(1-.075*index))>1e-10)throw Error('Linear 10 tick HP drain');samples.push(values)}fightHud.step(true,[300,250]);for(let index=1;index<60;index++){fightHud.step(true,[300,250]);if(fightHud.displayLife()[0]!==.5)throw Error('New hit resets hold')}fightHud.step(true,[300,250]);if(Math.abs(fightHud.displayLife()[0]-.48)>1e-10)throw Error('Restart drain');fightHud.step(true,[1000,1000]);if(fightHud.displayLife().some(value=>value!==1))throw Error('Healing immediate');return {aiStates:moves.map(set=>Array.from(set)),samples};})()`);console.log(JSON.stringify(result));assert.deepEqual(errors,[]);return;
 }
 if(process.argv.includes('--camera-hud')){
  await run('fightHud.ready');
  for(const viewport of [{width:1161,height:754},{width:1398,height:598}]){
   await page.setViewportSize(viewport);const result=await run(`(()=>{resize();draw();const expect=(condition,label)=>{if(!condition)throw Error(label)};const fit=Math.min(innerWidth/1280,innerHeight/720),side=(innerWidth-1280*fit)/2,bottom=(innerHeight-720*fit)/2;expect(cv.style.clipPath.startsWith('inset(0px'),'Top spill retained');expect(cv.style.clipPath===mcv.style.clipPath&&cv.style.clipPath===effectCanvas.style.clipPath,'All gameplay layers clipped');expect(side>0||bottom>0,'Letterbox present');fightHud.setMode('99');for(let index=0;index<60;index++)fightHud.step(true);expect(fightHud.remaining()===98,'60 active ticks per second');for(let index=0;index<60;index++)fightHud.step(false);expect(fightHud.remaining()===98,'Pause clock retained');fightHud.reset();expect(fightHud.remaining()===99,'Timer reset');fightHud.setMode('infinite');expect(fightHud.remaining()===null,'Infinite default');fightHud.render({life:250},{life:750,lifeMax:1000});return {side,bottom};})()`);console.log(JSON.stringify(result));
  }
  await page.waitForFunction(()=>window.specialTest.run('s.children.some(child=>child.isGroup)'),null,{timeout:60000});await run('p1Life=1000;p2.life=500;posX=-300;p2.x=300;cameraY=-100;posY=-350;updateCamera();resize();r.render(s,c);draw();drawMars();drawSourceExplods();updateDebugHud()');await page.screenshot({path:'work/camera-hud-preview.png'});assert.deepEqual(errors,[]);return;
 }
 if(process.argv.includes('--portrait-idle')){
  const result=await run(`(()=>{
   let checks=0;const expect=(condition,label)=>{if(!condition)throw Error(label);checks++};
   resetPlayerInput();specialRuntime.reset();sourceExplods.length=0;p1Reaction=null;
   for(const life of [251,250,1,1000]){p1Life=life;p2.life=life;enterIRState(0);enterP2State(0);syncLowLifeIdle();expect(current===(life<=250?5300:0),'P1 threshold '+life);expect(p2.anim===(life<=250?5300:0),'P2 threshold '+life);}
   p1Life=100;p2.life=100;enterIRState(200);enterP2State(200);syncLowLifeIdle();expect(current===200&&p2.anim===200,'Attacks not replaced');
   enterIRState(0);enterP2State(0);current=5;p2.anim=5;syncLowLifeIdle();expect(current===5&&p2.anim===5,'Turn preserved');
   current=0;p2.anim=0;p1Life=0;p2.life=0;syncLowLifeIdle();expect(current===0&&p2.anim===0,'KO not replaced with low idle');
   expect(framesFor(5300).map(frame=>frame.time).join(',')==='18,4,4,4,4,4,12,4,4,4,4,4','Original A5300 timing');
   p1Life=100;p2.life=100;p1Reaction=null;posX=-200;p2.x=200;p1Facing=1;p2.facing=-1;enterIRState(0);enterP2State(0);document.querySelector('#p2Guard').value='none';setP2ControlMode('dummy');
   for(let index=0;index<60;index++)simStep();expect(current===5300&&p2.anim===5300,'Low idle survives real simulation');expect(fi>0&&p2.elem>1,'Low idle animation advances');
   restorePlayerHealth();simStep();expect(current===0&&p2.anim===0,'HP restore returns both to A0');
   const scales=[],originalScale=effectContext.scale;effectContext.scale=function(horizontal,vertical){scales.push(horizontal);return originalScale.call(this,horizontal,vertical)};
   try{for(const animation of [915,916,917,918,919,925,926,927,928,929]){sourceExplods.length=0;sourceExplods.push({anim:animation,screen:true,x:0,y:200,scale:[1,1],age:0,sprpriority:100});drawSourceExplods();expect(Math.sign(scales.pop())===(animation>=925?-1:1),'AIR portrait flip '+animation);}}finally{effectContext.scale=originalScale;sourceExplods.length=0;}
   return {portraitIdleChecks:checks};
  })()`);console.log(JSON.stringify(result));assert.deepEqual(errors,[]);return;
 }
 if(process.argv.includes('--stage-visuals')){
  await page.waitForFunction(()=>window.specialTest.run('!!stageVisuals&&!!stageFilterImage'),null,{timeout:30000});
  const result=await run(`(()=>{
   let checks=0;const expect=(condition,label)=>{if(!condition)throw Error(label);checks++};
   resetPlayerInput();p1Reaction=null;specialRuntime.reset();sourceExplods.length=0;cameraX=0;cameraY=0;posY=0;p2.y=0;enterIRState(0);enterP2State(0);
   for(const dead of [1,2])for(const direction of [-1,1]){
    p1Life=dead===1?0:1000;p2.life=dead===2?0:1000;posX=0;p2.x=direction*30;const before=[posX,p2.x];playerPushM1();expect(posX===before[0]&&p2.x===before[1],'KO excluded from both-direction push '+dead);
   }
   p1Life=1000;p2.life=1000;posX=0;p2.x=30;playerPushM1();expect(p2.x-posX>=80,'Alive push remains enabled');
   expect(!canPlayerPushM1({life:1000,playerPush:false}),'Explicit no-push respected');
   expect(!s.children.some(child=>child.isLight),'No added stage lights');
   expect(stageVisuals.reflection.intensity===50,'Original reflection intensity');
   posX=-200;p2.x=200;posY=0;p2.y=0;drawStageVisuals();
   const reflected=reflectionCanvas.getContext('2d').getImageData(0,0,reflectionCanvas.width,reflectionCanvas.height).data;
   expect(reflected.some((value,index)=>index%4===3&&value>0),'Both character reflections drawn');
   expect(Math.max(...Array.from(reflected).filter((value,index)=>index%4===3&&value>0))<=50,'Reflection alpha follows source intensity');
   const filter=filterCanvas.getContext('2d').getImageData(0,0,filterCanvas.width,filterCanvas.height).data;
   expect(filter.some((value,index)=>index%4===3&&value===8),'Original SFF filter alpha retained');
   expect(stageVisuals.filter.delta.every(value=>value===0),'Filter screen-fixed');
   return checks;
  })()`);console.log(JSON.stringify({stageVisualChecks:result}));
  if(process.argv.includes('--preview')){await page.waitForFunction(()=>window.specialTest.run('s.children.some(child=>child.isGroup)'),null,{timeout:60000});await run('hud.classList.add("collapsed");resize();r.render(s,c);draw();drawMars();drawSourceExplods()');await page.screenshot({path:'work/stage-visuals-preview.png'})}
  return;
 }
 if(process.argv.includes('--lifecycle')){
  const result=await run(`(()=>{
   let checks=0;const expect=(condition,label)=>{if(!condition)throw Error(label);checks++};
   resetPlayerInput();specialRuntime.reset();sourceExplods.length=0;p1Reaction=null;p1HitPause=0;p2.attackPause=0;p2.hitShake=0;p1Life=1000;p2.life=1000;posX=-200;p2.x=200;posY=0;p2.y=0;runtimeVar.fill(0);specialRoot(2).vars.fill(0);enterIRState(0);enterP2State(0);
   for(let tick=0;tick<5;tick++)simStep();
   for(const player of [1,2]){
    const helper=specialRuntime.entities.find(entity=>entity.player===player&&entity.id===9999);
    expect(!!helper&&helper.invisible,'Source 9999 spawned and invisible '+player);
    expect(specialRuntime.context(helper).numHelper(9999)===1,'Helper owner isolation '+player);
    const ctx=specialRuntime.context(helper);
    expect(evalM1('root,StateNo = 0',ctx),'Root state redirect '+player);
    expect(evalM1('Enemy,MoveType = I',ctx),'Enemy redirect '+player);
    expect(evalM1('NumPartner = 0 && NumEnemy = 1 && TeamMode != Simul',ctx),'1v1 source team queries '+player);
    expect(sourceExplods.some(effect=>effect.player===player&&effect.id===(player===1?915:925)),'Source normal portrait '+player);
    expect(evalM1('PlayerIDExist('+helper.instanceId+')',ctx),'Helper instance ID exists '+player);
    for(const controller of battleDat.lifecycleHelpers['9999'].controllers)for(const expression of [...controller.triggerall,...Object.values(controller.triggers).flat()]){evalM1(expression,ctx);checks++}
   }
   const helper=specialRuntime.entities.find(entity=>entity.player===1&&entity.id===9999);
   enterIRState(600);posY=-200;moveContact=1;moveHit=0;p2.state=50;p2.type='A';p2.moveType='H';p2.y=-200;specialRuntime.step();expect(helper.vars[10]===1,'Source airborne contact decision');
   p2.moveType='I';specialRuntime.step();expect(helper.vars[10]===0,'Source contact decision clears when enemy leaves gethit');
   enterIRState(0);posY=0;enterP2State(0);p2.y=0;
   const OriginalAudio=window.Audio,voices=[];window.Audio=class extends EventTarget{constructor(url){super();this.src=url;voices.push(this)}play(){return Promise.resolve()}pause(){}};
   try{
    randomValue=0;p1Reaction={...specialRoot(1),state:5071,time:1,anim:5070,type:'A',moveType:'H',hitShake:8,hitTime:20};p1HitPause=8;
    Object.assign(p2,{state:5071,time:1,anim:5070,type:'A',moveType:'H',hitShake:8,attackPause:0,randomValue:0});
    stepLifecycleGlobals();expect(voices.filter(voice=>voice.src.endsWith('/10-2.wav')).length===2,'Both source voices run during defender shaking');expect(soundChannels.get(0)!==soundChannels.get(4),'GetHit voice channels isolated');
   }finally{window.Audio=OriginalAudio;p1Reaction=null;p1HitPause=0;p2.hitShake=0;enterIRState(0);enterP2State(0)}
   p1Life=200;p2.life=200;for(let tick=0;tick<3;tick++)simStep();
   expect(sourceExplods.some(effect=>effect.id===918)&&sourceExplods.some(effect=>effect.id===928),'Source low HP portraits');
   expect(!sourceExplods.some(effect=>effect.id===915||effect.id===925),'Normal portraits removed');
   for(const effect of sourceExplods.filter(effect=>[918,928].includes(effect.id))){effect.age=1000;expect(!!lifecycleEffectFrame(effect),'Persistent portrait AIR loops')}
   p1Life=0;p2.life=0;for(let tick=0;tick<3;tick++)simStep();
   expect(sourceExplods.some(effect=>effect.id===919)&&sourceExplods.some(effect=>effect.id===929),'Source KO portraits');
   for(const effect of sourceExplods.filter(effect=>[919,929].includes(effect.id))){effect.age=1000;expect(lifecycleEffectFrame(effect).time===-1,'Portrait final -1 frame holds')}
   lifecycleRuntime.rounds.state=3;specialRuntime.step();expect(!specialRuntime.entities.some(entity=>entity.id===9999),'Source 9999 destroys outside active round');lifecycleRuntime.rounds.state=2;
   p1Life=1000;p2.life=1000;p1Reaction=null;specialRuntime.reset();sourceExplods.length=0;enterIRState(0);enterP2State(0);return checks;
  })()`);console.log(JSON.stringify({lifecycleChecks:result}));return;
 }
 const guardKOChecks=await run(`(()=>{
  let checks=0;const expect=(condition,label)=>{if(!condition)throw Error(label);checks++};
  const params={damage:'40,10',guardflag:'HL',animtype:'light','ground.type':'high','ground.velocity':'-6,0','guard.velocity':'-2','ground.hittime':20,'guard.hittime':30,pausetime:'8,8','guard.pausetime':'4,4'};
  for(const facing of [1,-1])for(const crouch of [false,true])for(const life of [9,10,11]){
   const defender={type:crouch?'C':'S',state:crouch?153:151,y:0,ctrl:0,moveType:'H',facing:-facing,life};
   const result=resolveGroundHitM1({id:1,facing},defender,params,crouch?'crouch':'stand');
   expect(result.guarded===(life>10),'Guard survives only above chip damage');
   expect(result.state===(life>10?(crouch?152:150):5000),'Lethal guard enters hit state without idle');
   expect(life>10?result.life===1:result.life===0&&result.getHit.fall===1&&result.getHit.yvel<0,'Lethal guard receives KO fall velocity');
   const safe=resolveGroundHitM1({id:1,facing},defender,{...params,'guard.kill':0},crouch?'crouch':'stand');
   expect(safe.guarded&&safe.life>=1,'guard.kill=0 prevents chip KO');
   const independent=resolveGroundHitM1({id:1,facing},defender,{...params,kill:0},crouch?'crouch':'stand');
   expect(life>10?independent.guarded:independent.life===0&&!independent.guarded,'Guard KO independent of ordinary kill');
  }
  return checks;
 })()`);console.log(JSON.stringify({guardKOChecks}));
 const soundChecks=await run(`(()=>{
  const OriginalAudio=window.Audio,clips=[];let checks=0;
  const expect=(condition,label)=>{if(!condition)throw Error(label);checks++};
  window.Audio=class extends EventTarget{constructor(url){super();this.src=url;this.stops=0;clips.push(this)}play(){return Promise.resolve()}pause(){this.stops++}};
  try{
   for(const sound of soundChannels.values())sound.pause();soundChannels.clear();automaticSounds.clear();
   for(const player of [1,2])for(const stateNo of [1000,1100,1200]){
    resetPlayerInput();specialRuntime.reset();sourceExplods.length=0;p1Reaction=null;p1HitPause=0;p2.attackPause=0;p2.hitShake=0;p1Life=1000;p2.life=1000;posX=-500;p2.x=500;posY=0;p2.y=0;vx=0;vy=0;p2.vx=0;p2.vy=0;runtimeVar.fill(0);specialRoot(2).vars.fill(0);setP2ControlMode(player===2?'keyboard':'dummy');enterIRState(player===1?stateNo:0);enterP2State(player===2?stateNo:0);
    const start=clips.length;for(let tick=0;tick<140;tick++)simStep();const created=clips.slice(start),voice=created.find(clip=>clip.src.endsWith('/'+stateNo+'-0.wav'));
    expect(!!voice,'Original voice starts '+[player,stateNo]);expect(created.some(clip=>/900-[0-4]\\.wav$/.test(clip.src)),'Later source SFX starts '+[player,stateNo]);expect(voice.stops===0,'Voice not interrupted by unchannelled SFX '+[player,stateNo]);
   }
   for(const channel of [0,4]){
    const voice=playSourceSound('1000,0',channel),effect=playSourceSound('900,0'),second=playSourceSound('900,2',-1);expect(voice.stops===0&&effect.stops===0,'Automatic sounds overlap voice and each other');expect(!soundChannels.has(-1),'Negative channel not mapped to shared channel');
    const replacement=playSourceSound('1100,0',channel);expect(voice.stops===1&&soundChannels.get(channel)===replacement,'Explicit channel still replaces previous voice');voice.dispatchEvent(new Event('ended'));expect(soundChannels.get(channel)===replacement,'Old sound cleanup cannot delete replacement');effect.dispatchEvent(new Event('ended'));second.dispatchEvent(new Event('error'));expect(!automaticSounds.has(effect)&&!automaticSounds.has(second),'Automatic sounds cleaned on end/error');
   }
   const first=playSourceSound('1000,0',0),second=playSourceSound('1100,0',4);expect(first.stops===0&&second.stops===0,'Player voice channels isolated');return checks;
  }finally{for(const sound of soundChannels.values())sound.pause();soundChannels.clear();automaticSounds.clear();window.Audio=OriginalAudio;resetPlayerInput();specialRuntime.reset();sourceExplods.length=0;enterIRState(0);enterP2State(0)}
 })()`);console.log(JSON.stringify({soundChecks}));
 if(process.argv.includes('--preview')){await run("p1Life=250;posX=-200;p2.x=200;enterIRState(3000);for(let tick=0;tick<50;tick++)simStep();updateCamera();updateDebugHud();r.render(s,c);draw();drawMars();drawSourceExplods()");await page.screenshot({path:'work/specials-preview-02336.png',timeout:60000});return}
 const fixes=await run(`(()=>{
  let checks=0;
  const expect=(condition,label)=>{if(!condition)throw Error(label);checks++};
  const reset=(player=1,facing=1)=>{
   resetPlayerInput();specialRuntime.reset();sourceExplods.length=0;p1Reaction=null;p1HitPause=0;entityDefenderPause=false;p1Life=1000;p2.life=1000;p2.hitShake=0;p2.attackPause=0;p2.getHit=null;cornerPushVelocity=0;p2.cornerPushVelocity=0;posX=player===1?0:1000*facing;p2.x=player===2?0:1000*facing;posY=0;p2.y=0;vx=0;vy=0;p2.vx=0;p2.vy=0;p1Facing=player===1?facing:-facing;p2.facing=player===2?facing:-facing;cameraX=0;cameraY=0;runtimeVar.fill(0);specialRoot(2).vars.fill(0);setP2ControlMode(player===2?'keyboard':'dummy');enterIRState(0);enterP2State(0);setCommandMode('normal');
  };
  const sample=(player,facing,now={})=>{
   const target=player===1?input:p2Input;for(const action of keyboardActions)target[action]=false;
   Object.assign(target,{down:!!now.D,up:!!now.U,left:!!(facing===1?now.B:now.F),right:!!(facing===1?now.F:now.B),x:!!now.x,y:!!now.y,a:!!now.a,l:!!now.d,r:!!now.w});
   if(player===1){input.jump=input.up;input.neutralVertical=false}simStep();
  };
  const sourceLines=battleDat.playerCommands.map(controller=>controller.source.line);
  expect(sourceLines.every((line,index)=>index===0||line>sourceLines[index-1]),'All active -1 controllers retain original CMD order');
  expect(cmdDat.commands.every((command,index)=>index===0||command.source.line>cmdDat.commands[index-1].source.line),'All definitions retain original CMD order');
  for(const player of [1,2]){
   reset(player);spawnSourceExplod({anim:'905',id:'905'},specialRoot(player),player);const spark=sourceExplods[0];p1HitPause=8;p2.attackPause=8;
   expect(framesFor(905)[0].time===4,'Source spark first frame is four ticks');
   for(let tick=0;tick<4;tick++){expect(spark.age===tick,'Spark first frame age '+tick);stepSourceExplods()}
   expect(spark.age===4,'A905 advances during eight-tick hitpause');
   for(let tick=4;tick<actionDuration(905);tick++)stepSourceExplods();expect(!sourceExplods.includes(spark),'A905 finishes on AIR clock');
   const other={...spark,anim:904,age:0};sourceExplods.push(other);stepSourceExplods();expect(other.age===0,'Other effects retain hitpause');
   reset(player);spawnSourceExplod({anim:'905',id:'905'},specialRoot(player),player);specialRuntime.dispatch({type:'Pause',params:{time:'8'}},{},null,{},specialRoot(1),1);combatTraceTick++;stepSourceExplods();expect(sourceExplods[0].age===0,'A905 does not bypass explicit Pause');
   reset(player);spawnSourceHitSpark({sparkno:'S905',sparkxy:'0,0'},false,specialRoot(player),specialRoot(player===1?2:1));const hitSpark=sourceExplods[0];p1HitPause=8;p2.attackPause=8;for(let tick=0;tick<4;tick++)stepSourceExplods();expect(hitSpark.age===4,'Actual S905 hitspark ignores hitpause');
  }
  for(const player of [1,2])for(const facing of [-1,1])for(const button of ['x','y'])for(const delay of [0,1,2]){
   reset(player,facing);for(let tick=0;tick<30;tick++)sample(player,facing);
   for(let tick=0;tick<3;tick++)sample(player,facing,{D:true});
   for(let tick=0;tick<3;tick++)sample(player,facing,{D:true,F:true});
   for(let tick=0;tick<delay;tick++)sample(player,facing,{F:true});
   sample(player,facing,{F:true,[button]:true});let entered=(player===1?state:p2.state)===1000;
   for(let tick=0;tick<3&&!entered;tick++){sample(player,facing,{F:true});entered=(player===1?state:p2.state)===1000}
   expect(entered,'Live Beam beats normal after idle '+[player,facing,button,delay]);
  }
  for(const player of [1,2])for(const facing of [-1,1])for(const variant of [0,1])for(const topCamera of [0,-180]){
   reset(player,facing);cameraY=topCamera;specialRoot(player).vars[2]=variant;
   const controller=battleDat.attackStates['1100'].controllers.find(item=>item.type==='Projectile');specialRuntime.dispatch(controller,{},null,{},specialRoot(player),player);
   const sword=specialRuntime.entities[0];sword.created=-1;let ticks=0;
   for(;ticks<200&&!sword.removing;ticks++){specialRuntime.step();if(!sword.removing)expect(sword.y-spriteFor(framesFor(904)[sword.elem-1]).axisY+framesFor(904)[sword.elem-1].oy>cameraY-660,'Sword stays below camera top before ending')}
   expect(sword.anim===9041&&sword.removing&&sword.vy===0,'Both sword variants end in A9041/VY0');
   expect(Math.abs(sword.y-spriteFor(framesFor(9041)[0]).axisY-(cameraY-660))<0.01,'Sword ending touches camera top');
   expect(specialRuntime.numProj(player,1150)===1,'Sword retained during ending');
   if(variant===0)expect(ticks>30,'Light sword does not expire at source thirty-tick timer');
   for(let tick=0;tick<actionDuration(9041)+1;tick++)specialRuntime.step();expect(specialRuntime.numProj(player,1150)===0,'Sword removes after full A9041');
  }
  for(const player of [1,2])for(const facing of [-1,1])for(const button of ['x','y']){
   reset(player,facing);setInputMode('keyboard');for(let tick=0;tick<30;tick++)simStep();
   const binding=keyboardBindings[player===1?'p1':'p2'],forward=binding[facing===1?'right':'left'];
   const key=(type,code)=>dispatchEvent(new KeyboardEvent(type,{code,bubbles:true,cancelable:true}));
   key('keydown',binding.down);for(let tick=0;tick<3;tick++)simStep();key('keydown',forward);for(let tick=0;tick<3;tick++)simStep();key('keyup',binding.down);key('keydown',binding[button]);
   let entered=false;for(let tick=0;tick<4;tick++){simStep();entered||=(player===1?state:p2.state)===1000}expect(entered,'Beam through real keyboard handlers '+[player,facing,button]);key('keyup',forward);key('keyup',binding[button]);
  }
  for(const player of [1,2])for(const facing of [-1,1])for(const [shouldEnter,modifier,button] of [[1000,'d','x'],[1000,'w','x'],[1100,'d','y'],[1100,'w','y'],[1200,'d','a'],[1200,'w','a'],[3000,'d','w'],[3000,'w','d']]){
   reset(player,facing);setCommandMode('auto',player);if(player===1)p1Life=250;else p2.life=250;
   for(let tick=0;tick<30;tick++)sample(player,facing);
   sample(player,facing,{[modifier]:true});sample(player,facing,{[modifier]:true,[button]:true});
   expect((player===1?state:p2.state)===shouldEnter,'Source AUTO short command '+[player,facing,shouldEnter,modifier]);
   sample(player,facing);if(shouldEnter!==3000)expect(specialRoot(player).vars[2]===(modifier==='w'?1:0),'AUTO light/heavy source variant');
  }
  reset();sample(1,1,{d:true});sample(1,1,{d:true,x:true});expect(state!==1000,'NORMAL does not enable short special');
  for(const player of [1,2])for(const [target,button] of [[1000,'x'],[1100,'y'],[1200,'a']]){
   reset(player);setCommandMode('auto',player);for(let tick=0;tick<30;tick++)sample(player,1);sample(player,1,{d:true});sample(player,1);sample(player,1,{[button]:true});expect((player===1?state:p2.state)===target,'Released L short command enters special');sample(player,1);expect(specialRoot(player).vars[2]===0,'One-tick AUTO command retains light selector at entry');
  }
  reset();sampleCommandList(1,{x:true},false);commandModeButton.click();expect(runtimeVar[52]===10&&p2.vars[52]===10,'UI enables AUTO on both players');expect(!commandActive('x',1),'Mode change clears old command buffer');expect(commandModeButton.closest('#inputPanel'),'Command button inside input panel');commandModeButton.click();expect(runtimeVar[52]===0&&p2.vars[52]===0,'UI returns both players to NORMAL');
  reset();return checks;
 })()`);console.log(JSON.stringify({specialFixChecks:fixes}));
 if(process.argv.includes('--ui-preview')){await run('updateCamera();updateDebugHud();r.render(s,c);draw();drawMars();drawSourceExplods()');await page.screenshot({path:'work/special-fixes-ui-02336.png'});return}
 if(process.argv.includes('--focused'))return;
 const results=await run(`(()=>{
  const results=[];
  for(const player of [1,2])for(const facing of [-1,1])for(const attack of [1200,1000,1100,3000])for(const distance of [100,400]){
   resetPlayerInput();specialRuntime.reset();sourceExplods.length=0;p1Reaction=null;p1HitPause=0;p1Life=1000;p2.life=1000;p2.hitShake=0;p2.attackPause=0;p2.getHit=null;cornerPushVelocity=0;p2.cornerPushVelocity=0;posX=-200;p2.x=200;posY=0;p2.y=0;vx=0;vy=0;p2.vx=0;p2.vy=0;p1Facing=1;p2.facing=-1;cameraX=0;runtimeVar.fill(0);p2.vars?.fill(0);setP2ControlMode(player===2?'keyboard':'dummy');enterIRState(player===1?attack:0);enterP2State(player===2?attack:0);
   p1Facing=facing;p2.facing=-facing;p2.x=posX+distance*facing;let projectiles=0,helpers=0,effects=0,pause=0;
   for(let tick=0;tick<500;tick++){simStep();projectiles=Math.max(projectiles,specialRuntime.entities.filter(entity=>entity.kind==='projectile').length);helpers=Math.max(helpers,specialRuntime.entities.filter(entity=>entity.kind==='helper').length);effects=Math.max(effects,sourceExplods.length);if(specialRuntime.pauses.normal)pause++;if([5,20,100,290,499].includes(tick)){draw();drawMars();drawSourceExplods()}}
   const result={player,facing,attack,distance,state:player===1?state:p2.state,damage:1000-(player===1?p2.life:p1Life),projectiles,helpers,effects,pause};
   if([attack,3005].includes(result.state))throw Error('Special never returned '+JSON.stringify(result));
   if(attack===1000||attack===1100){if(projectiles!==1)throw Error('Missing projectile '+JSON.stringify(result))}
   if(attack===3000&&(!helpers||pause<290))throw Error('Missing super/helper '+JSON.stringify(result));
   if(distance===100&&attack!==1100&&result.damage===0)throw Error('Missing close hit '+JSON.stringify(result));
   results.push(result);
  }
  return results;
 })()`);
 console.log(JSON.stringify(results));
 const semantics=await run(`(()=>{
  specialRuntime.reset();sourceExplods.length=0;let checks=0;
  const expect=(condition,label)=>{if(!condition)throw Error(label);checks++};
  const roots=[specialRoot(1),specialRoot(2)];
  for(const fighter of roots){fighter.vars.fill(0);fighter.life=250;fighter.lifeMax=1000;fighter.ctrl=1;fighter.type='S';fighter.moveType='I';fighter.state=0;fighter.vars[16]=41;
   for(const [target,name] of [[1000,'SNES_NRML_Beam_l'],[1100,'SNES_NRML_Sword_l'],[1200,'SNES_NRML_Chain_l'],[3000,'S_SNES_NRML_ChainExplosive']]){
    const controller=battleDat.playerCommands.find(item=>Number(item.params.value)===target),context=fighterExpressionContext(fighter,{state:0,type:'S'},{[name]:true});
    expect(controllerTriggered(controller,context),'Source command '+target);fighter.type='A';expect(!controllerTriggered(controller,context),'No airborne special '+target);fighter.type='S';
    if(target===1100){fighter.vars[16]=40;expect(!controllerTriggered(controller,context),'Sword charge threshold');fighter.vars[16]=41}
    if(target===3000){fighter.life=251;expect(!controllerTriggered(controller,context),'Super HP threshold');fighter.life=250}
   }
  }
  const contradiction=battleDat.attackStates['3005'].controllers.find(item=>item.type==='HitDef');expect(!controllerTriggered(contradiction,fighterExpressionContext(roots[0],roots[1])),'S3005 source contradictory HitDef preserved');
  for(const target of [1000,1100,1200]){
   const controller=battleDat.attackStates[String(target)].controllers.find(item=>item.type===(target===1200?'HitDef':'Projectile')),context=fighterExpressionContext(roots[0],roots[1]);
   for(const variant of [0,1]){roots[0].vars[2]=variant;const params=specialRuntime.numeric(controller.params,context),defender={...roots[1],y:0,life:1000};
    const hit=resolveGroundHitM1({id:1,facing:1},defender,params,'stand');expect(hit.guarded,'Ground guard '+target);expect(hit.getHit.animtype===(target===1200?1:2),'Source reaction type '+target);
    defender.type='A';defender.y=-100;expect(!resolveGroundHitM1({id:1,facing:1},defender,params,'stand').guarded,'NoAirGuard '+target);
   }
  }
  expect(specialRuntime.entities.length===0,'Reset clears runner');
  p1Reaction=null;p1HitPause=0;posX=-1000;p2.x=1000;p1Facing=1;p2.facing=-1;p1Life=1000;p2.life=1000;
  const projectile=battleDat.attackStates['1000'].controllers.find(item=>item.type==='Projectile');
  specialRuntime.dispatch(projectile,{},null,{},specialRoot(1),1);
  const expired=specialRuntime.entities[0];Object.assign(expired,{x:5000,time:1000,elem:2,elemTick:0,created:-1});specialRuntime.step();
  expect(expired.removing&&specialRuntime.numProj(1,1050)===1,'Default removal retains current animation and NumProjID');
  for(let tick=0;tick<50;tick++)specialRuntime.step();expect(specialRuntime.numProj(1,1050)===0,'Removal animation finishes');
  for(const player of [1,2])specialRuntime.dispatch(projectile,{},null,{},specialRoot(player),player);
  for(const entity of specialRuntime.entities)Object.assign(entity,{x:entity.player===1?0:180,vx:0,elem:2,elemTick:0,time:1,created:-1});specialRuntime.step();
  expect(specialRuntime.entities.length===2&&specialRuntime.entities.every(entity=>entity.removing),'Equal source priorities cancel without deleting animation early');
  for(let tick=0;tick<50;tick++)specialRuntime.step();expect(specialRuntime.entities.length===0,'Cancelled projectiles finish');return checks;
 })()`);console.log(JSON.stringify({specialSemantics:semantics}));assert.deepEqual(errors,[]);
})().catch(error=>{console.error(error);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.close()});
