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
  await new Promise(resolve=>server.listen(8789,'127.0.0.1',resolve));
  browser=await chromium.launch({headless:true,channel:'msedge'});
  const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:8789/');
  await page.waitForFunction(()=>window.runtimeTest?.run('!!dat&&!!stateIR&&!!battleDat&&!!lifecycleDat&&!!specialDat&&!!roundCharDat&&!!cmdDat&&!!airDat&&!!fallDat&&!!guardDat&&!!turnDat'),null,{timeout:90000});
  const run=source=>page.evaluate(source=>window.runtimeTest.run(source),source);


  await run("prepareCharacters(['SailorJupiter','SailorJupiter']);roundFlow.begin('training','infinite');simPaused=false;for(let tick=0;tick<1800;tick++)simStep();");
  const reset=async()=>run("resetPlayerInput();specialRuntime.reset();customStateOwners.fill(null);customAnimationOwners.fill(null);throwTargets.fill(null);throwBindings.fill(null);p1Reaction=null;p1HitPause=0;p2.hitShake=0;p2.attackPause=0;p1Life=1000;p2.life=1000;posX=-70;p2.x=70;posY=0;p2.y=0;enterIRState(0);enterP2State(0);p1Facing=1;p2.facing=-1;vx=0;vy=0;p2.vx=0;p2.vy=0;p2.lastHitKey=null;p1LastHitKey=null;runtimeVar[45]=1;p2.vars[45]=1;runtimeVar[50]=0;p2.vars[50]=0;runtimeVar[2]=0;p2.vars[2]=0;");
  for(const player of [1,2]){
   for(const skill of [106,630,640]){
    await reset();
    const result=await run(`posY=-300;p2.y=-300;vx=3;p2.vx=-3;${player===1?'enterIRState':'enterP2State'}(${skill});simStep();({anim:${player===1?'current':'p2.anim'},frames:framesFor(${player===1?'current':'p2.anim'},${player}).length,runtimeFailed})`);
    assert.equal(result.runtimeFailed,false);assert.ok(result.frames>0,JSON.stringify({player,skill,result}));
    if(skill!==106)assert.equal(result.anim,skill);
   }
   await reset();
   const electric=await run(`${player===1?'enterIRState':'enterP2State'}(3000);(()=>{const victim=[];for(let tick=0;tick<700;tick++){simStep();const target=specialRoot(${3-player});if(target.state===5810)victim.push({time:target.time,y:target.y});}return {victim,runtimeFailed}})()`);
   console.log('electric',player,electric);
   assert.equal(electric.runtimeFailed,false);assert.ok(electric.victim.some(frame=>frame.time>2&&frame.y<0),'Electric reaction did not advance');
  }
  for(const skill of [200,410,430,440]){
   await reset();const spark=await run(`enterIRState(${skill});for(let tick=0;tick<25;tick++)simStep();sourceExplods.filter(effect=>effect.id===-1).map(effect=>({x:effect.x,y:effect.y}))`);
   assert.ok(spark.every(effect=>Number.isFinite(effect.x)&&Number.isFinite(effect.y)),JSON.stringify({skill,spark}));
  }
  await reset();
  const cyclone=await run("(()=>{specialRuntime.dispatch({type:'Helper',params:{id:'1150',stateno:'1150',pos:'0,-21'}},null,null,null,specialRoot(1),1);const helper=specialRuntime.entities.at(-1),trace=[];for(let tick=0;tick<60;tick++){simStep();if(helper.state===1151)trace.push({time:helper.time,vx:helper.vx,vy:helper.vy,y:helper.y,projectiles:specialRuntime.numProj(1,1150),destroyed:helper.destroyed});}return trace})()");
  console.log('cyclone',cyclone);
  assert.ok(cyclone.some(frame=>frame.time===0&&frame.vx===0&&frame.vy===0));
  assert.ok(cyclone.some(frame=>frame.time===1&&frame.y===0&&frame.projectiles===1));
  assert.ok(cyclone.some(frame=>frame.time===34&&!frame.destroyed));
  assert.ok(cyclone.some(frame=>frame.destroyed));
  await reset();
  const exit=await run("(()=>{specialRuntime.dispatch({type:'Projectile',params:{projid:'1050',projanim:'903',velocity:'18,0',offset:'0,-150',projremovetime:'-1'}},null,null,null,specialRoot(1),1);const projectile=specialRuntime.entities.at(-1),trace=[];for(let tick=0;tick<100&&!projectile.destroyed;tick++){simStep();trace.push({x:projectile.x,vx:projectile.vx,outside:projectile.x>cameraX+640/cameraZoom,destroyed:projectile.destroyed});}return trace})()");
  assert.ok(exit.every(frame=>frame.vx===18));assert.ok(exit.at(-1).destroyed&&exit.at(-1).outside);
  assert.deepEqual(errors,[]);console.log('Jupiter effect regressions passed');
 }finally{await browser?.close();server.close()}
})().catch(error=>{console.error(error);process.exitCode=1});

