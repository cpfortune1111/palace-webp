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
  await new Promise(resolve=>server.listen(8794,'127.0.0.1',resolve));
  browser=await chromium.launch({headless:true,channel:'msedge'});
  const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:8794/');
  await page.waitForFunction(()=>window.runtimeTest?.run('!!dat&&!!battleDat&&!!stageModel'),null,{timeout:90000});
  const run=source=>page.evaluate(source=>window.runtimeTest.run(source),source);
  await run("prepareCharacters(['SailorNeptune','SailorNeptune'])");
  const intro=await run("(()=>{roundFlow.begin('training','infinite');const starts=[0,0];let previous=[state,p2.state];for(let tick=0;tick<1800;tick++){if(state===190&&current!==190)throw Error('P1 previewed intro');simStep();const next=[state,p2.state];for(let player=0;player<2;player++)if(next[player]===191&&previous[player]!==191)starts[player]++;if(state===191&&p2.state===191)throw Error('Overlapping intros');previous=next;}return {starts,fight:roundFlow.canFight()}})()");
  assert.deepEqual(intro.starts,[1,1]);assert.equal(intro.fight,true);
  for(const player of [1,2]){
   const trace=await run(`(()=>{specialRuntime.reset();sourceExplods.length=0;p1Reaction=null;enterIRState(0);enterP2State(0);posX=-300;p2.x=300;posY=0;p2.y=0;cameraX=0;cameraZoom=1;const root=specialRoot(${player});root.vars[2]=0;specialRuntime.dispatch({type:'Helper',params:{id:'1050',stateno:'1050',pos:'0,-90'}},null,null,null,root,${player});const helper=specialRuntime.entities.find(entity=>entity.id===1050);helper.time=0;helper.x=helper.facing*641;combatTraceTick++;specialRuntime.step();specialRuntime.finishTick();combatTraceTick++;specialRuntime.step();if(helper.destroyed||helper.state!==1050)throw Error('Helper disappeared at camera edge');const carrier=specialRuntime.entities.find(entity=>entity.kind==='projectile');if(!carrier||carrier.destroyed)throw Error('Invisible carrier disappeared');helper.time=6;helper.x=helper.facing*731;combatTraceTick++;specialRuntime.step();if(!helper.destroyed)throw Error('Source DestroySelf did not execute');combatTraceTick++;specialRuntime.step();return {carrierGone:!specialRuntime.entities.includes(carrier),runtimeFailed}})()`);
   assert.equal(trace.carrierGone,true);assert.equal(trace.runtimeFailed,false);
  }
  const layers=await run("(()=>{sourceExplods.length=0;specialRuntime.reset();const root=specialRoot(1);spawnSourceExplod({anim:'4000',ontop:'1',sprpriority:'0',postype:'left'},root,1);spawnSourceExplod({anim:'908',sprpriority:'1'},root,1);const context=effectCanvas.getContext('2d'),original=context.drawImage,calls=[];context.drawImage=function(source,...args){calls.push(source);return original.call(this,source,...args)};drawSourceExplods();context.drawImage=original;const frame=framesFor(4000,1)[0],top=spriteCanvasFor(frame);return {topLast:calls.at(-1)===top,calls:calls.length}})()");
  assert.equal(layers.topLast,true);assert.ok(layers.calls>=2);
  assert.deepEqual(errors,[]);
  console.log('Neptune source edge destruction, sequential single intros and ontop ordering passed');
 }finally{await browser?.close();server.close()}
})().catch(error=>{console.error(error);process.exitCode=1});

