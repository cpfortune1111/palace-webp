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
   await run('for(let tick=0;tick<1800;tick++)simStep()');
   assert.equal(await run('roundFlow.canFight()'),true);
   console.log('Mixed normals, throws, dashes and round intro passed:',players.join(' / '));
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
