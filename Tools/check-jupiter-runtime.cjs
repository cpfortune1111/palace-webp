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
  await new Promise(resolve=>server.listen(8787,'127.0.0.1',resolve));
  browser=await chromium.launch({headless:true,channel:'msedge'});
  const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:8787/');
  await page.waitForFunction(()=>window.runtimeTest?.run('!!dat&&!!stateIR&&!!battleDat&&!!lifecycleDat&&!!specialDat&&!!roundCharDat&&!!cmdDat&&!!airDat&&!!fallDat&&!!guardDat&&!!turnDat'),null,{timeout:90000});
  const run=source=>page.evaluate(source=>window.runtimeTest.run(source),source);

  for(const players of [['SailorJupiter','SailorJupiter'],['SailorJupiter','SailorMoon'],['SailorVenus','SailorJupiter']]){
   await run(`prepareCharacters(${JSON.stringify(players)})`);
   await run("roundFlow.begin('training','infinite');simPaused=false;for(let tick=0;tick<1800;tick++)simStep();");
   assert.equal(await run('roundFlow.canFight()'),true);
   for(const player of [1,2]){
    if(players[player-1]!=='SailorJupiter')continue;
    for(const hardware of [0]){
     for(const skill of [1000,1100,1200,1300,3000,3005,200,210,230,240,400,410,430,440,600,610,630,640]){
      await run(`lifecycleRuntime.rounds.state=2;resetPlayerInput();specialRuntime.reset();sourceExplods.length=0;customStateOwners.fill(null);customAnimationOwners.fill(null);throwTargets.fill(null);throwBindings.fill(null);p1Reaction=null;p1HitPause=0;p2.hitShake=0;p2.attackPause=0;p1Life=1000;p2.life=1000;posX=-70;p2.x=70;posY=${skill>=600&&skill<=640?-250:0};p2.y=${skill>=600&&skill<=640?-250:0};enterIRState(0);enterP2State(0);p1Facing=1;p2.facing=-1;if(${skill}===1300)p2.x=posX+constVal('size.ground.front',1)+constVal('size.ground.front',2)+10;runtimeCtrl=1;p2.ctrl=1;specialRoot(${player}).vars[50]=${hardware};specialRoot(${player}).vars[2]=0;${player===1?'enterIRState':'enterP2State'}(${skill});`);
      const trace=await run(`(()=>{const seen=new Set();for(let tick=0;tick<1400;tick++){simStep();seen.add(${player===1?'state':'p2.state'});if([0,11].includes(${player===1?'state':'p2.state'})&&tick>10)break;}return {state:${player===1?'state':'p2.state'},y:${player===1?'posY':'p2.y'},life:${player===1?'p2.life':'p1Life'},seen:[...seen],runtimeFailed}})()`);
      assert.equal(trace.runtimeFailed,false,JSON.stringify({players,player,hardware,skill,trace}));
      assert.ok([0,11].includes(trace.state),JSON.stringify({players,player,hardware,skill,trace}));
      console.log('Jupiter skill passed',players.join('/'),player,hardware,skill,trace.life);
     }
    }
   }
  }
  await run("prepareCharacters(['SailorJupiter','SailorMoon']);roundFlow.begin('training','infinite');for(let tick=0;tick<1800;tick++)simStep();specialRuntime.reset();customStateOwners.fill(null);customAnimationOwners.fill(null);p1Reaction=null;p1Life=1000;p2.life=1000;posY=0;p2.y=0;p1HitPause=0;p2.hitShake=0;p2.attackPause=0;enterIRState(0);enterP2State(0);applySourceThrow(1,{p1stateno:1051,p2stateno:1052});for(let tick=0;tick<600;tick++){simStep();}if(state!==0||p2.y!==0||customStateOwners[1])throw Error('Jupiter Giant Swing did not finish');");
  await run("specialRuntime.reset();customStateOwners.fill(null);customAnimationOwners.fill(null);p1Reaction=null;p1Life=1000;p2.life=1000;posX=0;p2.x=0;posY=0;p2.y=0;p1HitPause=0;p2.hitShake=0;p2.attackPause=0;enterIRState(0);enterP2State(0);specialRuntime.dispatch({type:'Helper',params:{id:'1151',stateno:'1151',pos:'0,0'}},null,null,null,specialRoot(1),1);for(let tick=0;tick<150;tick++){simStep();}if(p2.life>=1000)throw Error('Coconut Cyclone projectile did not hit');if(runtimeFailed)throw Error('Coconut Cyclone runtime failed');");
  for(const players of [['SailorVenus','SailorJupiter'],['SailorJupiter','SailorVenus']]){
   await run(`prepareCharacters(${JSON.stringify(players)})`);
   const player=players.indexOf('SailorVenus')+1;
   await run(`roundFlow.begin('training','infinite');for(let tick=0;tick<1800;tick++)simStep();resetPlayerInput();posX=-45;p2.x=45;posY=0;p2.y=0;enterIRState(0);enterP2State(0);p1Facing=1;p2.facing=-1;p1Life=1000;p2.life=1000;specialRoot(${player}).vars[50]=0;${player===1?'enterIRState':'enterP2State'}(1200);for(let tick=0;tick<600;tick++)simStep();if(runtimeFailed)throw Error('Venus chain against Jupiter failed');if(${player===1?'p2.life':'p1Life'}>=1000)throw Error('Venus chain missed Jupiter');`);
  }
  await run("gameShell.selection.ready;gameShell.selection.show('vs')");
  await page.locator('[data-character="SailorJupiter"]').evaluate(button=>button.click());
  assert.equal(await run("gameShell.selection.snapshot().players[0]"),'SailorJupiter');
  await page.evaluate(async()=>{const {createDeclarationScreen}=await import('./Engine/declaration-screen.js?v=02397');const declaration=createDeclarationScreen({sound:audio=>{audio.play=()=>Promise.resolve();return audio},complete:()=>{}});await declaration.ready;for(const options of [{},{result:true,winner:1},{result:true,winner:2}]){declaration.begin(['SailorJupiter','SailorMoon'],options);for(let tick=0;tick<1800;tick++)declaration.step();if(declaration.snapshot().phase!=='done')throw Error('Jupiter declaration did not finish');}});
  assert.deepEqual(errors,[]);
  console.log('Jupiter selection, mixed skills and declarations passed');
 }finally{await browser?.close();server.close()}
})().catch(error=>{console.error(error);process.exitCode=1});

