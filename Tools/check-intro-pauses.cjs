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
  await new Promise(resolve=>server.listen(8791,'127.0.0.1',resolve));
  browser=await chromium.launch({headless:true,channel:'msedge'});
  const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:8791/');
  await page.waitForFunction(()=>window.runtimeTest?.run('!!dat&&!!stateIR&&!!battleDat&&!!lifecycleDat&&!!specialDat&&!!roundCharDat&&!!cmdDat&&!!airDat&&!!fallDat&&!!guardDat&&!!turnDat'),null,{timeout:90000});
  const run=source=>page.evaluate(source=>window.runtimeTest.run(source),source);


  await run("prepareCharacters(['SailorJupiter','SailorJupiter'])");
  await run("roundFlow.begin('training','infinite');simPaused=false;for(let tick=0;tick<1800;tick++)simStep();");
  for(const intro of [191,192]){
   const trace=await run(`(()=>{specialRuntime.reset();lifecycleRuntime.rounds.state=1;enterIRState(${intro});enterP2State(${intro});runtimeVar[49]=1;p2.vars[49]=2;const animations=[new Set(),new Set()],history=[];for(let tick=0;tick<500;tick++){if(history.length<12&&history.at(-1)?.[0]!==state)history.push([state,current,stateTicks,evalM1('RoundState',specialRuntime.context(specialRoot(1))),framesFor(1912,1).length]);animations[0].add(current);animations[1].add(p2.anim);stepLifecycleState(1);stepLifecycleState(2);combatTraceTick++;if(state===0&&p2.state===0)break}return {history,animations:animations.map(seen=>[...seen]),states:[state,p2.state],runtimeFailed}})()`);
   for(const seen of trace.animations)for(const anim of [intro*10,intro*10+1,intro*10+2])assert.ok(seen.includes(anim),JSON.stringify(trace));
   assert.deepEqual(trace.states,[0,0]);assert.equal(trace.runtimeFailed,false);
  }
  for(const character of ['SailorVenus','SailorMoon','SailorJupiter']){
   await run(`prepareCharacters(['${character}','${character}'])`);
   await run(`roundFlow.begin('training','infinite');for(let tick=0;tick<1800;tick++)simStep();`);
   for(const delay of [0,1,5]){
    const trace=await run(`(()=>{resetPlayerInput();specialRuntime.reset();sourceExplods.length=0;p1Reaction=null;p1HitPause=0;p2.hitShake=0;p2.attackPause=0;p1Life=1000;p2.life=1000;posY=0;p2.y=0;posX=-300;p2.x=300;vx=0;vy=0;p2.vx=0;p2.vy=0;enterIRState(0);enterP2State(0);runtimeVar[45]=0;p2.vars[45]=0;runtimeVar[50]=0;p2.vars[50]=0;enterIRState(3000);let owners=new Set(),early=[];for(let tick=0;tick<1200;tick++){if(tick===${delay})enterP2State(3000);simStep();if(tick===20)early=[stateTicks,p2.time];for(const effect of sourceExplods)owners.add(effect.player)}return {early,owners:[...owners].sort(),runtimeFailed,states:[state,p2.state],pauses:specialRuntime.pauses}})()`);
    assert.equal(trace.runtimeFailed,false);assert.ok(trace.early.every(time=>time>5),JSON.stringify({character,delay,trace}));assert.deepEqual(trace.owners,[1,2],JSON.stringify({character,delay,trace}));assert.ok(Object.values(trace.pauses).every(group=>group.every(pause=>!pause)),JSON.stringify(trace));
   }
  }
  assert.deepEqual(errors,[]);
  console.log('Jupiter intro tails and overlapping super cinematics passed');
 }finally{await browser?.close();server.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
