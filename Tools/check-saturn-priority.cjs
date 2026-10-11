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
  content=Buffer.from(content.toString().replaceAll('https://cdn.jsdelivr.net/npm/three@0.180.0/','/vendor/').replaceAll('requestAnimationFrame(loop);','').replace('if(!reactionDat)await reactionReady;',"console.log('TEST reaction readiness',!!reactionDat);if(!reactionDat)await reactionReady;console.log('TEST reaction ready');").replace('const [battle,all,sounds]=await Promise.all(responses.map(response=>response.json()));',"const [battle,all,sounds]=await Promise.all(responses.map(response=>response.json()));console.log('TEST character JSON ready');").replace('await Promise.all([...pages].map(page=>',"console.log('TEST atlas count',pages.size);await Promise.all([...pages].map(page=>").replace('</script></body>',`window.runtimeTest={run:source=>eval(source),step:()=>{simStepCore();specialRuntime.step();specialRuntime.finishTick();combatTraceTick++;draw();drawMars();drawSourceExplods()},snapshot:()=>({state,current,posX,posY,runtimeCtrl,runtimeFailed,p2:{state:p2.state,anim:p2.anim,life:p2.life}})};</script></body>`));
 }
 response.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');response.end(content);
});
(async()=>{
 let browser;
 let phase='server startup';
 const watchdog=setTimeout(()=>{console.error('Browser regression exceeded its deadline during '+phase);process.exit(1)},300000);
 try{
  await new Promise(resolve=>server.listen(8797,'127.0.0.1',resolve));
  phase='browser launch';
  browser=await chromium.launch({headless:true,channel:'msedge'});
  const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];
  page.on('pageerror',error=>{errors.push(error.message);console.error('Page runtime error: '+error.message)});
  page.on('requestfailed',request=>console.error('Failed asset request: '+request.url()+' '+request.failure()?.errorText));
  page.on('console',message=>{if(message.text().startsWith('TEST '))console.log(message.text())});
  phase='page navigation';
  await page.goto('http://127.0.0.1:8797/');
  phase='runtime initialization';
  await page.waitForFunction(()=>window.runtimeTest?.run('!!dat&&!!stateIR&&!!battleDat&&!!lifecycleDat&&!!specialDat&&!!roundCharDat&&!!cmdDat&&!!airDat&&!!fallDat&&!!guardDat&&!!turnDat'),null,{timeout:90000});
  const run=source=>page.evaluate(source=>window.runtimeTest.run(source),source);


  phase='character loading';
  console.log('Runtime initialized; loading character atlas resources');
  await run("prepareCharacters(['SailorSaturn','SailorSaturn'])");
  phase='semantic assertions';
  const scheduleResults=await run(`(()=>{p1HitPause=0;p2.hitShake=0;p2.attackPause=0;specialRoot(2);runtimeVar[8]=0;p2.vars[8]=0;const once={type:'VarAdd',params:{target:'var(8)',value:'1',persistent:'0'},source:{file:'schedule-test',line:1}},interval={type:'VarAdd',params:{target:'var(8)',value:'1',persistent:'2'},source:{file:'schedule-test',line:2}};for(let tick=0;tick<6;tick++){runController(once);runP2ControllerM1(interval)}const first=[runtimeVar[8],p2.vars[8]];enterIRState(0);runController(once);const second=runtimeVar[8];for(let tick=0;tick<3;tick++)runController({...once,controllerStateNo:-2});return [first,second,runtimeVar[8]]})()`);
  assert.deepEqual(scheduleResults,[[1,3],2,5]);
  console.log('Both root controller persistence and negative-state exceptions passed');
  const variableResults=await run(`(()=>{runController({type:'VarSet',params:{target:'fvar(2)',value:'3.75'}});runP2ControllerM1({type:'VarSet',params:{target:'fvar(2)',value:'8.25'}});runController({type:'VarAdd',params:{target:'fvar(2)',value:'0.5'}});return [evalM1('fvar(2)',specialRuntime.context(specialRoot(1))),evalM1('fvar(2)',specialRuntime.context(specialRoot(2))),p1LifecycleBinding.fvars===p1ControllerBinding.fvars]})()`);
  assert.deepEqual(variableResults,[4.25,8.25,true]);
  const rangeResults=await run(`(()=>{runController({type:'VarRangeSet',params:{first:'4',last:'6',value:'7'}});runP2ControllerM1({type:'VarRandom',params:{v:'4',range:'9,9'}});runController({type:'VarRangeSet',params:{redirectid:'2',first:'5',last:'6',fvalue:'1.25'}});return [runtimeVar.slice(4,7),p2.vars[4],p2.fvars.slice(5,7)]})()`);
  assert.deepEqual(rangeResults,[[7,7,7],9,[1.25,1.25]]);
  const resourceResults=await run(`(()=>{lifecycleRuntime.rounds.state=2;p1Life=1000;p2.life=1000;p1Power=0;p2.power=0;runController({type:'LifeSet',params:{value:'500'}});runP2ControllerM1({type:'LifeAdd',params:{value:'-100',absolute:'1'}});runController({type:'PowerAdd',params:{value:'3500'}});runP2ControllerM1({type:'PowerSet',params:{value:'700'}});runController({type:'LifeSet',params:{redirectid:'2',value:'800'}});return [p1Life,p2.life,p1Power,p2.power,evalM1('power',specialRuntime.context(specialRoot(2)))]})()`);
  assert.deepEqual(resourceResults,[500,800,3000,700,700]);
  const helperResources=await run(`(()=>{specialRuntime.dispatch({type:'Helper',params:{stateno:'925',id:'987'}},p1ControllerBinding,specialRuntime.context(specialRoot(1)),{},specialRoot(1),1);const entity=specialRuntime.entities.at(-1),context=specialRuntime.context(entity);executeControllerM1({type:'LifeSet',params:{value:'321'}},entity,context,{owner:entity,player:1});executeControllerM1({type:'PowerSet',params:{value:'456'}},entity,context,{owner:entity,player:1});runP2ControllerM1({type:'LifeAdd',params:{redirectid:String(entity.instanceId),value:'-21',absolute:'1'}});return [entity.life,p1Life,p1Power,p2.life]})()`);
  assert.deepEqual(helperResources,[300,500,456,800]);
  const parentVariables=await run(`(()=>{const parent=specialRuntime.entities.at(-1);specialRuntime.dispatch({type:'Helper',params:{stateno:'925',id:'988'}},parent,specialRuntime.context(parent),{},parent,1);const child=specialRuntime.entities.at(-1),context=specialRuntime.context(child);executeControllerM1({type:'ParentVarSet',params:{v:'7',value:'19'}},child,context,{owner:child,player:1});executeControllerM1({type:'RootVarSet',params:{fv:'7',value:'2.5'}},child,context,{owner:child,player:1});return [parent.vars[7],child.vars[7],runtimeVar[7],runtimeFVar[7]]})()`);
  assert.deepEqual(parentVariables,[19,0,0,2.5]);
  console.log('Nested helper parent and root variable ownership passed');
  console.log('Helper life isolation, shared root power and helper-ID redirection passed');
  console.log('Root life/power controllers, redirected life and power expressions passed');
  console.log('Both root float-variable controllers and expression contexts share lifecycle storage');
  for(const delay of [0,1,5]){
   phase='combat regression '+delay;
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
 }catch(error){console.error('Browser test failure during '+phase,error);throw error}
 finally{phase='browser shutdown';await browser?.close();server.close();clearTimeout(watchdog)}
})().catch(error=>{console.error(error);process.exitCode=1});
