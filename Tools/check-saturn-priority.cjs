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
  await new Promise(resolve=>server.listen(8797,'127.0.0.1',resolve));
  browser=await chromium.launch({headless:true,channel:'msedge'});
  const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:8797/');
  await page.waitForFunction(()=>window.runtimeTest?.run('!!dat&&!!stateIR&&!!battleDat&&!!lifecycleDat&&!!specialDat&&!!roundCharDat&&!!cmdDat&&!!airDat&&!!fallDat&&!!guardDat&&!!turnDat'),null,{timeout:90000});
  const run=source=>page.evaluate(source=>window.runtimeTest.run(source),source);


  await run("prepareCharacters(['SailorSaturn','SailorSaturn'])");
  for(const delay of [0,1,5]){
   await run("roundFlow.begin('training','infinite');simPaused=false;for(let tick=0;tick<1800;tick++)simStep();");
   const trace=await run(`(()=>{resetPlayerInput();specialRuntime.reset();sourceExplods.length=0;customStateOwners.fill(null);customAnimationOwners.fill(null);p1Reaction=null;p1HitPause=0;p2.hitShake=0;p2.attackPause=0;p1Life=1000;p2.life=1000;posY=0;p2.y=0;posX=-100;p2.x=100;vx=0;vy=0;p2.vx=0;p2.vy=0;runtimeVar.fill(0);p2.vars.fill(0);enterIRState(0);enterP2State(0);p1Facing=1;p2.facing=-1;p1LastHitKey=null;p2.lastHitKey=null;enterIRState(3000);const history=[new Set(),new Set()],ties=[];for(let tick=0;tick<1400;tick++){if(tick===${delay})enterP2State(3000);simStep();history[0].add(state);history[1].add(p2.state);if(state===3001&&p2.state===3001&&activeHitDef&&p2.activeHitDef)ties.push([p1Life,p2.life,moveContact,p2.moveContact||0,activeHitDef.params.priority,p2.activeHitDef.params.priority]);if(runtimeFailed)break;}return {runtimeFailed,history:history.map(states=>[...states]),ties,pauses:specialRuntime.pauses}})()`);
   console.log('Saturn simultaneous super',delay,JSON.stringify(trace));
   assert.equal(trace.runtimeFailed,false);
   assert.ok(trace.history.every(states=>states.includes(3001)),JSON.stringify(trace));
   if(delay===0){assert.ok(trace.ties.length>0);assert.ok(trace.ties.every(values=>values[0]===1000&&values[1]===1000&&values[2]===0&&values[3]===0),JSON.stringify(trace));}
   assert.ok(Object.values(trace.pauses).every(group=>group.every(pause=>!pause)));
  }
  assert.deepEqual(errors,[]);
  console.log('Saturn simultaneous Miss/Miss supers passed without spent HitDefs or damage');
 }finally{await browser?.close();server.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
