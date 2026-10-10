const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const assert=require('node:assert/strict');
const {chromium}=require('C:/Users/jeffy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..'),vendor=path.resolve(root,'../outputs/three-r180');
const server=http.createServer((request,response)=>{
 const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
 const base=pathname.startsWith('/vendor/')?vendor:root;
 const file=path.resolve(base,pathname.startsWith('/vendor/')?pathname.slice(8):'.'+(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(base+path.sep)||!fs.existsSync(file)){response.writeHead(404);response.end();return}
 let content=fs.readFileSync(file);
 if(file===path.join(root,'index.html')){
  content=Buffer.from(content.toString().replaceAll('https://cdn.jsdelivr.net/npm/three@0.180.0/','/vendor/').replaceAll('requestAnimationFrame(loop);','').replace('</script></body>',`window.runtimeTest={run:source=>eval(source),step:()=>{simStepCore();specialRuntime.step();specialRuntime.finishTick();combatTraceTick++;draw();drawMars();drawSourceExplods()},snapshot:()=>({state,current,posX,posY,runtimeCtrl,runtimeFailed,p2:{state:p2.state,anim:p2.anim,life:p2.life}})};</script></body>`));
 }
 response.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');response.end(content);
});
(async()=>{
 let browser;
 try{
  await new Promise(resolve=>server.listen(8786,'127.0.0.1',resolve));
  browser=await chromium.launch({headless:true,channel:'msedge'});
  const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:8786/');
  await page.waitForFunction(()=>window.runtimeTest?.run('!!dat&&!!stateIR&&!!battleDat&&!!lifecycleDat&&!!specialDat&&!!roundCharDat&&!!cmdDat&&!!airDat&&!!fallDat&&!!guardDat&&!!turnDat'),null,{timeout:90000});
  const run=source=>page.evaluate(source=>window.runtimeTest.run(source),source);
  await run("prepareCharacters(['SailorMoon','SailorMoon'])");
  await run(`simPaused=false;roundFlow.begin('training','infinite');for(let tick=0;tick<1800;tick++)simStep();`);
  const checks=await run(`(()=>{const expect=(condition,label)=>{if(!condition)throw Error(label)};
   expect(profileFor(1).battle.states['1110'].anim===1110,'Moon return anim');expect(framesFor(1110,1).length>0,'Moon A1110');
   const originalSound=playSourceSound;let landings=0;playSourceSound=(...args)=>{if(args[0]==='52,0')landings++;return null};enterIRState(52);for(let tick=0;tick<30;tick++)simStep();expect(landings===1,'P1 landing '+landings);landings=0;enterP2State(52);for(let tick=0;tick<30;tick++)simStep();expect(landings===1,'P2 landing '+landings);playSourceSound=originalSound;
   specialRuntime.reset();sourceExplods.length=0;posX=-100;p2.x=100;p1Reaction=null;p1HitPause=0;p2.hitShake=0;enterIRState(1200);p1EntryCommands={SNES_NRML_SonicCry_l:true};runtimeVar[2]=0;current=1200;fi=0;ticks=0;p2.life=1000;for(let tick=0;tick<200;tick++)simStep();expect(p2.life===940,'Sonic Cry light damage '+p2.life);
   for(const player of [1,2]){const fighter={...specialRoot(player),state:5210,anim:5210,time:0,elem:1,elemTick:0,animStartTime:0,type:'A',physics:'N',moveType:'I',x:0,y:-200,vx:-20,vy:0,hitShake:0,hitTime:-1,getHit:{fall:0,yaccel:1.4},fallExecuted:new Set()};const start=fighter.x;for(let tick=0;tick<5;tick++)stepSourceFallM1(fighter);expect(fighter.vx===-10,'Recovery multiplier');expect(Math.abs(fighter.x-start)<=10,'Recovery freeze');for(let tick=0;tick<120;tick++)if(fighter.state===5210)stepSourceFallM1(fighter);expect(fighter.state!==5210,'Recovery completion');}
   const owner={...specialRoot(1),state:3001,y:-150};specialRuntime.reset();specialRuntime.dispatch({type:'Helper',params:{id:'3050',stateno:'3050',pos:'0,0'}},{},{},{},owner,1);const pillar=specialRuntime.entities.find(entity=>entity.id===3050);expect(pillar.y===0,'Pillar ground');sourceExplods.length=0;for(let index=0;index<30;index++)spawnSourceExplod({anim:'9031',pos:'-24,-830',random:'267,622'},pillar,1);const points=sourceExplods.map(effect=>effect.x);expect(Math.max(...points)-Math.min(...points)>100,'Particle random spread');expect(sourceExplods.every(effect=>effect.y>=-1141&&effect.y<=-519),'Particle anchor');return 'Moon source fixes passed';})()`);
  console.log(checks);
  for(const players of [['SailorMoon','SailorVenus'],['SailorVenus','SailorMoon'],['SailorMoon','SailorMoon'],['SailorVenus','SailorVenus']]){
   await run(`prepareCharacters(${JSON.stringify(players)})`);
   await run(`simPaused=false;p1Reaction=null;p1Life=1000;p2.life=1000;p2.hitShake=0;p2.attackPause=0;sourceExplods.length=0;specialRuntime.reset();lifecycleRuntime.rounds.state=2;resetPlayerInput();enterIRState(0);enterP2State(0);runtimeCtrl=1;p2.ctrl=1;posX=-250;p2.x=250;`);
   const result=await run(`(()=>{const expect=(condition,label)=>{if(!condition)throw Error(label)};for(const player of [1,2]){withCharacter(player,()=>{expect(sourceState(200).source?.file==='moon.cns'||battleCharacters[player-1]==='SailorVenus','own source');expect(framesFor(200).length>0,'own frames');expect(spriteFor(framesFor(200)[0])!==undefined,'own sprite');});}return battleCharacters.slice()})()`);
   assert.deepEqual(result,players);
   for(const attack of [200,210,230,240,400,410,430,440,600,610,630,640]){
    await run(`p1Reaction=null;p1HitPause=0;p2.hitShake=0;p2.attackPause=0;posY=${attack>=600?-200:0};p2.y=${attack>=600?-200:0};enterIRState(${attack});enterP2State(${attack});`);
    await run('for(let tick=0;tick<100;tick++)window.runtimeTest.step()');
   }
   
   for(const player of [1,2])if(players[player-1]==='SailorMoon'){
    await run(`customStateOwners.fill(null);throwTargets.fill(null);throwBindings.fill(null);p1Reaction=null;p1Life=1000;p2.life=1000;p1HitPause=0;p2.hitShake=0;p2.attackPause=0;enterIRState(0);enterP2State(0);runtimeCtrl=1;p2.ctrl=1;posY=0;p2.y=0;posX=-70;p2.x=70;applySourceThrow(${player},{p1stateno:801,p2stateno:805});`);
    await run('for(let tick=0;tick<200;tick++)window.runtimeTest.step()');
    const thrown=await run(`({life:${player===1?'p2.life':'p1Life'},owner:customStateOwners[${player===1?1:0}]})`);
    assert.equal(thrown.life,800);assert.equal(thrown.owner,null);
    for(const dash of [70,105]){
     await run(`customStateOwners.fill(null);p1Reaction=null;enterIRState(0);enterP2State(0);runtimeCtrl=1;p2.ctrl=1;posY=0;p2.y=0;p1HitPause=0;p2.hitShake=0;p2.attackPause=0;${player===1?'enterIRState':'enterP2State'}(${dash});`);
     await run('for(let tick=0;tick<120;tick++)window.runtimeTest.step()');
     assert.equal(await run(player===1?'state':'p2.state'),0);
    }
   }
   await run("roundFlow.begin('training','infinite')");
   await run(`for(let tick=0;tick<1800;tick++){simStep();if(battleCharacters[0]==='SailorMoon'&&state===0){if(current!==0&&current!==5&&current!==5300)throw Error('Moon idle retained intro animation '+current);if(frameProfiles.get(framesFor(current,1)[fi])!=='SailorMoon')throw Error('Moon idle used Venus artwork');}}`);
   assert.equal(await run('roundFlow.canFight()'),true);
   console.log('Mixed normals, throws, dashes and round intro passed:',players.join(' / '));
  }
  for(const players of [['SailorMoon','SailorVenus'],['SailorVenus','SailorMoon']]){
   await run(`prepareCharacters(${JSON.stringify(players)})`);
   const player=players[0]==='SailorMoon'?1:2;
   for(const skill of [1000,1100,1200,3000,3005]){
    await run(`roundFlow.begin('training','infinite');for(let tick=0;tick<1800;tick++)simStep();resetPlayerInput();specialRuntime.reset();sourceExplods.length=0;p1Reaction=null;p1Life=1000;p2.life=1000;posX=${skill>=3000?-70:skill===1200?-100:-250};p2.x=${skill>=3000?70:skill===1200?100:250};posY=${skill===1100?-300:0};p2.y=${skill===1100?-300:0};${player===1?'enterIRState':'enterP2State'}(${skill});`);
    const trace=await run(`(()=>{const seen=new Set(),entities=new Set();let minimumLife=1000;for(let tick=0;tick<1000;tick++){simStep();minimumLife=Math.min(minimumLife,${player===1?'p2.life':'p1Life'});seen.add(${player===1?'state':'p2.state'});for(const entity of specialRuntime.entities)if(entity.player===${player})entities.add(entity.id);if(${player===1?'state':'p2.state'}===0&&tick>10&&specialRuntime.entities.every(entity=>entity.player!==${player}||[915,925,950,951,9999].includes(entity.id)))break;}return {state:${player===1?'state':'p2.state'},seen:[...seen],entities:[...entities],minimumLife}})()`);
    assert.equal(trace.state,0,JSON.stringify({player,skill,trace}));
    if(skill===1000){assert.ok(trace.entities.includes(1050));await run('for(let tick=0;tick<240;tick++)simStep()');assert.equal(await run(player===1?'p2.state':'state'),0,'Tiara target recovered');}
    if(skill===1100)assert.ok(trace.entities.includes(1150));
    if(skill===3000||skill===3005)assert.ok(trace.entities.includes(3050));
    if(skill===1000||skill===3000||skill===3005)assert.ok(trace.minimumLife<1000,JSON.stringify({player,skill,trace}));
    console.log('Moon skill passed:',player,skill,trace);
   }
   await run(`resetPlayerInput();specialRuntime.reset();sourceExplods.length=0;p1Reaction=null;p1Life=100;p2.life=100;posY=0;p2.y=0;enterIRState(0);enterP2State(0);runtimeCtrl=1;p2.ctrl=1;hardwareModes[${player-1}]='snes';setCommandMode('auto',${player});withCharacter(${player},()=>{const root=specialRoot(${player});root.vars[50]=0;root.vars[52]=10;const command=profileFor(${player}).battle.playerCommands.find(item=>item.params.value==='3000');const context=specialRuntime.context(root,{S_SNES_AUTO_SilverCrystal:true});if(!controllerTriggered(command,context))throw Error('Moon super command gate');const tiara=profileFor(${player}).battle.playerCommands.find(item=>item.params.value==='1000');if(!controllerTriggered(tiara,specialRuntime.context(root,{SNES_AUTO_MoonTiaraAction_l:true})))throw Error('Moon tiara helper gate');});`);
  }
  
  await page.evaluate(async()=>{const {createDeclarationScreen}=await import('./Engine/declaration-screen.js?v=02386');const declaration=createDeclarationScreen({sound:audio=>{audio.play=()=>Promise.resolve();return audio},complete:()=>{}});await declaration.ready;for(const options of [{},{result:true,winner:1},{result:true,winner:2}]){declaration.begin(['SailorMoon','SailorVenus'],options);for(let tick=0;tick<1600;tick++)declaration.step();if(declaration.snapshot().phase!=='done')throw Error('Mixed declaration did not finish');const canvas=document.createElement('canvas');canvas.width=1280;canvas.height=720;declaration.draw(canvas.getContext('2d'))}});
  await run("gameShell.selection.ready");
  await run("gameShell.selection.show('vs')");
  await page.locator('[data-character="SailorMoon"]').evaluate(button=>button.click());
  assert.equal(await run("gameShell.selection.snapshot().players[0]"),'SailorMoon');
  for(let index=0;index<4;index++){await page.locator('#hardwareSelection0').evaluate(button=>button.click());assert.notEqual(await run("gameShell.selection.snapshot().hardware[0]"),'3do')}
  console.log('Moon selection excludes 3DO; mixed intro/result declarations passed');
  assert.deepEqual(errors,[]);
 }finally{await browser?.close();server.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
