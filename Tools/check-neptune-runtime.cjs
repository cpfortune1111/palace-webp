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
  await new Promise(resolve=>server.listen(8792,'127.0.0.1',resolve));
  browser=await chromium.launch({headless:true,channel:'msedge'});
  const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:8792/');
  await page.waitForFunction(()=>window.runtimeTest?.run('!!dat&&!!stateIR&&!!battleDat&&!!lifecycleDat&&!!specialDat&&!!roundCharDat&&!!cmdDat&&!!airDat&&!!fallDat&&!!guardDat&&!!turnDat'),null,{timeout:90000});
  const run=source=>page.evaluate(source=>window.runtimeTest.run(source),source);


  for(const players of [['SailorNeptune','SailorNeptune'],['SailorNeptune','SailorJupiter'],['SailorVenus','SailorNeptune']]){
   await run(`prepareCharacters(${JSON.stringify(players)})`);
   await run("roundFlow.begin('training','infinite');simPaused=false;for(let tick=0;tick<1800;tick++)simStep();");
   assert.equal(await run('roundFlow.canFight()'),true);
   for(const player of [1,2]){
    if(players[player-1]!=='SailorNeptune')continue;
    for(const skill of [0,10,11,12,20,40,45,50,52,100,105,106,200,210,230,240,400,410,430,440,600,610,630,640]){
     const result=await run(`(()=>{resetPlayerInput();specialRuntime.reset();sourceExplods.length=0;customStateOwners.fill(null);customAnimationOwners.fill(null);throwTargets.fill(null);throwBindings.fill(null);p1Reaction=null;p1HitPause=0;p2.hitShake=0;p2.attackPause=0;p1Life=1000;p2.life=1000;posX=-70;p2.x=70;posY=${skill>=600?-250:0};p2.y=posY;vx=0;vy=0;p2.vx=0;p2.vy=0;enterIRState(0);enterP2State(0);p1Facing=1;p2.facing=-1;p1LastHitKey=null;p2.lastHitKey=null;runtimeVar[50]=0;p2.vars[50]=0;${player===1?'enterIRState':'enterP2State'}(${skill});let seen=new Set();for(let tick=0;tick<220;tick++){simStep();draw();drawMars();drawSourceExplods();seen.add(${player===1?'current':'p2.anim'});}return {seen:[...seen],runtimeFailed,frames:framesFor(${player===1?'current':'p2.anim'},${player}).length}})()`);
     assert.equal(result.runtimeFailed,false,JSON.stringify({players,player,skill,result}));assert.ok(result.frames>0,JSON.stringify(result));console.log('Neptune passed',player,skill);
    }
   }
  }
  await run("prepareCharacters(['SailorJupiter','SailorJupiter'])");
  await run("roundFlow.begin('training','infinite');for(let tick=0;tick<1800;tick++)simStep();");
  for(const skill of [1000,1100]){
   const trace=await run(`(()=>{resetPlayerInput();specialRuntime.reset();sourceExplods.length=0;customStateOwners.fill(null);customAnimationOwners.fill(null);p1Reaction=null;p1HitPause=0;p2.hitShake=0;p2.attackPause=0;p1Life=1000;p2.life=1000;posX=-80;p2.x=80;posY=0;p2.y=0;vx=0;vy=0;p2.vx=0;p2.vy=0;enterIRState(0);enterP2State(0);p1Facing=1;p2.facing=-1;runtimeVar[50]=0;p2.vars[50]=0;p1LastHitKey=null;p2.lastHitKey=null;enterP2State(${skill});if(${skill}===1100)specialRuntime.dispatch({type:'Helper',params:{id:'1151',stateno:'1151',pos:'0,0'}},null,null,null,{...specialRoot(2),x:posX},2);let reactions=[];for(let tick=0;tick<700;tick++){simStep();if([5800,5810,5820].includes(state))reactions.push({state,anim:current,time:stateTicks});}return {reactions,runtimeFailed}})()`);
   assert.equal(trace.runtimeFailed,false);assert.ok(trace.reactions.some(frame=>frame.anim===5800),JSON.stringify({skill,trace}));assert.ok(trace.reactions.every(frame=>[5800,5801].includes(frame.anim)),JSON.stringify({skill,trace}));console.log('P1 electric animation passed',skill);
  }
  await run("gameShell.selection.ready;gameShell.selection.show('vs')");
  await page.locator('[data-character="SailorNeptune"]').evaluate(button=>button.click());
  assert.equal(await run("gameShell.selection.snapshot().players[0]"),'SailorNeptune');
  await page.evaluate(async()=>{const {createDeclarationScreen}=await import('./Engine/declaration-screen.js?v=02402');const declaration=createDeclarationScreen({sound:audio=>{audio.play=()=>Promise.resolve();return audio},complete:()=>{}});await declaration.ready;for(const options of [{},{result:true,winner:1},{result:true,winner:2}]){declaration.begin(['SailorNeptune','SailorJupiter'],options);for(let tick=0;tick<1800;tick++)declaration.step();if(declaration.snapshot().phase!=='done')throw Error('Neptune declaration did not finish');}});
  assert.deepEqual(errors,[]);
  console.log('Neptune normals, selection, declarations and P1 electric animations passed');
 }finally{await browser?.close();server.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
