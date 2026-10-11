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
  await new Promise(resolve=>server.listen(8795,'127.0.0.1',resolve));
  browser=await chromium.launch({headless:true,channel:'msedge'});
  const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:8795/');
  await page.waitForFunction(()=>window.runtimeTest?.run('!!dat&&!!stateIR&&!!battleDat&&!!lifecycleDat&&!!specialDat&&!!roundCharDat&&!!cmdDat&&!!airDat&&!!fallDat&&!!guardDat&&!!turnDat'),null,{timeout:90000});
  const run=source=>page.evaluate(source=>window.runtimeTest.run(source),source);


  for(const player of [1,2])for(const opponent of ['SailorSaturn','SailorVenus','SailorMoon','SailorJupiter','SailorNeptune']){
   const players=player===1?['SailorSaturn',opponent]:[opponent,'SailorSaturn'];
   await run('prepareCharacters('+JSON.stringify(players)+')');
   await run("roundFlow.begin('training','infinite');simPaused=false;for(let tick=0;tick<1800;tick++)simStep();");
   const result=await run(`(()=>{resetPlayerInput();specialRuntime.reset();sourceExplods.length=0;customStateOwners.fill(null);customAnimationOwners.fill(null);p1Reaction=null;p1HitPause=0;p2.hitShake=0;p2.attackPause=0;p1Life=1000;p2.life=1000;posX=-100;p2.x=100;posY=0;p2.y=0;vx=0;vy=0;p2.vx=0;p2.vy=0;runtimeVar.fill(0);p2.vars.fill(0);enterIRState(0);enterP2State(0);p1Facing=1;p2.facing=-1;p1LastHitKey=null;p2.lastHitKey=null;${player===1?'enterIRState':'enterP2State'}(3000);const hits=[];let life=1000;for(let tick=0;tick<1400;tick++){const attacker=specialRoot(${player}),previous=attacker.state,element=attacker.elem;simStep();const next=${player===1?'p2.life':'p1Life'};if(next<life)hits.push({state:previous,elem:element,damage:life-next});life=next;if(runtimeFailed)break;}return {hits,life,runtimeFailed,state:${player===1?'state':'p2.state'}}})()`);
   console.log('Saturn super trace',player,opponent,JSON.stringify(result));
   assert.equal(result.runtimeFailed,false);
   assert.equal(result.hits.filter(hit=>hit.state===3002).length,7,JSON.stringify({player,opponent,result}));
   assert.ok(Math.abs(result.hits.filter(hit=>hit.state===3002).reduce((total,hit)=>total+hit.damage,0)-200)<0.001);
   assert.ok(Math.abs(result.life-420)<0.001);
   assert.equal(result.state,0);
  }
  assert.deepEqual(errors,[]);
  console.log('Saturn seven middle hits passed for both players against every character');
 }finally{await browser?.close();server.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
