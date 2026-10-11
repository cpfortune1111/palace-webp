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
  await new Promise(resolve=>server.listen(8790,'127.0.0.1',resolve));
  browser=await chromium.launch({headless:true,channel:'msedge'});
  const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:8790/');
  await page.waitForFunction(()=>window.runtimeTest?.run('!!dat&&!!stateIR&&!!battleDat&&!!lifecycleDat&&!!specialDat&&!!roundCharDat&&!!cmdDat&&!!airDat&&!!fallDat&&!!guardDat&&!!turnDat'),null,{timeout:90000});
  const run=source=>page.evaluate(source=>window.runtimeTest.run(source),source);



  await run("prepareCharacters(['SailorJupiter','SailorJupiter']);roundFlow.begin('training','infinite');simPaused=false;for(let tick=0;tick<1800;tick++)simStep();");
  const runtime=JSON.parse(fs.readFileSync(path.join(root,'Char/Jupiter/Battle/jupiter_runtime.json'),'utf8'));
  const original=JSON.parse(fs.readFileSync(path.join(root,'../outputs/jupiter/state_sections.json'),'utf8'));
  const expected=[...new Set(original.states.map(state=>state.id).filter(state=>state>=0&&!runtime.stateCoverage.excluded3DO.includes(state)))].sort((first,second)=>first-second);
  assert.deepEqual(runtime.stateCoverage.included,expected);
  assert.deepEqual(Object.keys(runtime.states).map(Number).sort((first,second)=>first-second),expected);
  const states=await run("Object.keys(profileFor(1).battle.fallStates).map(Number)");
  for(const player of [1,2]){
   for(const skill of states){
    const trace=await run(`(()=>{resetPlayerInput();specialRuntime.reset();sourceExplods.length=0;customStateOwners.fill(null);customAnimationOwners.fill(null);throwTargets.fill(null);throwBindings.fill(null);p1Reaction=null;p1HitPause=0;p2.hitShake=0;p2.attackPause=0;runtimeVar.fill(0);p2.vars.fill(0);p1Life=1000;p2.life=1000;posX=-200;p2.x=200;posY=0;p2.y=0;vx=0;vy=0;p2.vx=0;p2.vy=0;enterIRState(0);enterP2State(0);p1Facing=1;p2.facing=-1;const fighter=${player===1?'p1Reaction={...specialRoot(1)}':'p2'};fighter.vars=${player===1?'runtimeVar':'p2.vars'};fighter.getHit={fall:1,xvel:-8,yvel:-20,yaccel:1.4,animtype:2,groundtype:1,airtype:1,slidetime:15,hittime:20,fallcount:1,'fall.recover':1,'fall.recovertime':0,'fall.xvel':null,'fall.yvel':-18,'fall.damage':0,'fall.kill':1,'fall.envshake.time':0,downRecovery:12};fighter.life=${skill===5150?0:1000};if(${player}===1)p1Life=fighter.life;fighter.hitTime=20;fighter.hitShake=0;fighter.anim=5050;fighter.elem=1;fighter.elemTick=0;fighter.animStartTime=0;fighter.vx=-8*fighter.facing;fighter.vy=${[5110,5120,5150,5500].includes(skill)?0:-20};fighter.y=${[5100,5101,5110,5120,5150,5080,5081,5500].includes(skill)?0:-200};enterGroundReactionState(fighter,${skill});if(${player}===1)syncP1Reaction();const seen=new Set();for(let tick=0;tick<500;tick++){simStep();draw();drawMars();drawSourceExplods();seen.add(${player===1?'state':'p2.state'});if([0,11].includes(${player===1?'state':'p2.state'})&&tick>10)break;}return {state:${player===1?'state':'p2.state'},y:${player===1?'posY':'p2.y'},anim:${player===1?'current':'p2.anim'},seen:[...seen],runtimeFailed}})()`);
    console.log('Jupiter high state',player,skill,trace);assert.equal(trace.runtimeFailed,false);
    if(![5150,5500].includes(skill)){assert.ok([0,11].includes(trace.state),JSON.stringify({player,skill,trace}));assert.equal(trace.y,0);}
   }
  }

  for(const player of [1,2]){
   const helpers=await run("Object.keys(profileFor(1).battle.helperStates).map(Number)");
   for(const helper of helpers){
    await run(`specialRuntime.reset();sourceExplods.length=0;customStateOwners.fill(null);customAnimationOwners.fill(null);throwTargets.fill(null);throwBindings.fill(null);p1Reaction=null;p1Life=1000;p2.life=1000;p1HitPause=0;p2.hitShake=0;p2.attackPause=0;enterIRState(0);enterP2State(0);runtimeVar.fill(0);p2.vars.fill(0);specialRuntime.dispatch({type:'Helper',params:{id:'${helper}',stateno:'${helper}',pos:'0,-100'}},null,null,null,specialRoot(${player}),${player});for(let tick=0;tick<80;tick++){simStep();drawSourceExplods();}if(runtimeFailed)throw Error('Jupiter helper failed: ${helper}');`);
    console.log('Jupiter helper passed',player,helper);
   }
   for(const lifecycle of [170,175,180,181,190,191,192,1990,1991]){
    await run(`specialRuntime.reset();sourceExplods.length=0;p1Reaction=null;p1Life=1000;p2.life=1000;p1HitPause=0;p2.hitShake=0;p2.attackPause=0;posY=0;p2.y=0;enterIRState(0);enterP2State(0);${player===1?'enterIRState':'enterP2State'}(${lifecycle});for(let tick=0;tick<240;tick++){simStep();draw();drawMars();drawSourceExplods();}if(runtimeFailed)throw Error('Jupiter lifecycle failed: ${lifecycle}');`);
    console.log('Jupiter lifecycle passed',player,lifecycle);
   }
  }
  assert.deepEqual(errors,[]);console.log('All Jupiter hit, recovery, KO and terminal states passed');
 }finally{await browser?.close();server.close()}
})().catch(error=>{console.error(error);process.exitCode=1});

