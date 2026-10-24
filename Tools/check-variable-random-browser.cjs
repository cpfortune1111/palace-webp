const assert=require('node:assert/strict');
const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const {chromium}=require('C:/Users/jeffy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..'),vendor=path.resolve(root,'../outputs/three-r180');
const server=http.createServer((request,response)=>{
 const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname),base=pathname.startsWith('/vendor/')?vendor:root,file=path.resolve(base,pathname.startsWith('/vendor/')?pathname.slice(8):'.'+(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(base+path.sep)||!fs.existsSync(file)){response.writeHead(404);response.end();return}
 let content=fs.readFileSync(file);if(file===path.join(root,'index.html'))content=Buffer.from(content.toString().replaceAll('https://cdn.jsdelivr.net/npm/three@0.180.0/','/vendor/').replaceAll('requestAnimationFrame(loop);','').replace('</script></body>',`window.variableRandomTest={run:source=>eval(source)};</script></body>`));
 response.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');response.end(content);
});
(async()=>{
 let browser;
 try{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));browser=await chromium.launch({headless:true,channel:'msedge'});const page=await browser.newPage({viewport:{width:1280,height:720}});
  await page.goto('http://127.0.0.1:'+server.address().port+'/');await page.waitForFunction(()=>window.variableRandomTest?.run('!!dat&&!!stateIR&&!!battleDat&&!!lifecycleDat&&!!specialDat&&!!cmdDat'),null,{timeout:90000});
  const run=source=>page.evaluate(source=>window.variableRandomTest.run(source),source);await run("prepareCharacters(['SailorSaturn','SailorSaturn'])");
  const count=await run(`(()=>{
   const savedSeed=variableRandomStream.state(),savedProfile=combatEngineProfile;let count=0;
   try{for(const profile of ['mugen11','ikemen'])for(const player of [1,2])for(const helper of [false,true])for(const index of [-1,1000000]){
    specialRuntime.reset();combatEngineProfile=profile;const root=specialRoot(player);let actor=root;
    if(helper){const data=characterProfiles.get(battleCharacters[player-1]).battle;data.helperStates[991992]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[]};specialRuntime.dispatch({type:'Helper',params:{stateno:991992,id:991992}},root,specialRuntime.context(root),{},root,player);actor=specialRuntime.entities.at(-1)}
    variableRandomStream.seed(1);const context=specialRuntime.context(actor),adapter={owner:actor,player,schedulingApplied:true};actor.vars[0]=-99;
    executeControllerM1({type:'VarRandom',params:{v:String(index),range:'5,9'}},actor,context,adapter);
    if(variableRandomStream.state()!==16807||actor.vars[index]!==undefined)throw Error('Rejected VarRandom failed to consume exactly one native random sample');
    executeControllerM1({type:'VarRandom',params:{v:'0',range:'0,2147483647'}},actor,context,adapter);
    if(variableRandomStream.state()!==282475249||actor.vars[0]!==282475249)throw Error('Following VarRandom observed the wrong native random sample');count++;
   }
   let ranges=0;
   for(const profile of ['mugen11','ikemen'])for(const player of [1,2])for(const [range,expected] of [['5,9',5],['9,5',5],['7,7',7],['0,2147483647',16807],['(-2147483647-1),2147483647',-2147450034],['2147483647,(-2147483647-1)',-2147450034]]){
    combatEngineProfile=profile;variableRandomStream.seed(1);const actor=specialRoot(player);executeControllerM1({type:'VarRandom',params:{v:'0',range}},actor,specialRuntime.context(actor),{owner:actor,player,schedulingApplied:true});
    if(actor.vars[0]!==expected||variableRandomStream.state()!==16807)throw Error('Native VarRandom range mapping mismatch '+JSON.stringify({range,actual:actor.vars[0],expected,seed:variableRandomStream.state()}));ranges++;
   }
   if(ranges!==24)throw Error('Incomplete native range consumer matrix');
   for(const profile of ['mugen11','ikemen'])for(const player of [1,2]){
    combatEngineProfile=profile;variableRandomStream.seed(1);sourceExplods.length=0;const actor=specialRoot(player),context=specialRuntime.context(actor),adapter={owner:actor,player,schedulingApplied:true};
    executeControllerM1({type:'VarRandom',params:{v:'0',range:'0,2147483647'}},actor,context,adapter);if(actor.vars[0]!==16807)throw Error('Initial shared random sample mismatch');
    executeControllerM1({type:'GameMakeAnim',params:{value:'120',random:'0,0,0'}},actor,context,adapter);if(sourceExplods.length!==1||variableRandomStream.state()!==984943658)throw Error('GameMakeAnim did not share VarRandom sequence');
    executeControllerM1({type:'VarRandom',params:{v:'0',range:'0,2147483647'}},actor,context,adapter);if(actor.vars[0]!==1144108930)throw Error('VarRandom did not resume after animation random components');sourceExplods.length=0;
   }
   let selections=0;
   for(const profile of ['mugen11','ikemen'])for(const player of [1,2])for(const targetCount of [1,2]){
    specialRuntime.reset();combatEngineProfile=profile;const actor=specialRoot(player),opponent=specialRoot(3-player),context=specialRuntime.context(actor),adapter={owner:actor,player,schedulingApplied:true},commands=assertedCommandList(actor),firstName=commands.commands[0].definition.name,targets=combatTargetList(actor);targets.clear();for(const command of commands.commands)command.buffer=0;
    const data=characterProfiles.get(battleCharacters[2-player]).battle;data.helperStates[991993]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[]};const ids=[];
    for(let index=0;index<targetCount;index++){specialRuntime.dispatch({type:'Helper',params:{stateno:991993,id:991993}},opponent,specialRuntime.context(opponent),{},opponent,3-player);const target=specialRuntime.entities.at(-1);target.getHit={hitid:7};targets.add(target.instanceId);ids.push(target.instanceId)}
    variableRandomStream.seed(1);executeControllerM1({type:'AssertCommand',params:{name:'""','buffer.time':'3'}},actor,context,adapter);
    if(variableRandomStream.state()!==16807||!commands.commands.filter(command=>command.definition.name===firstName).every(command=>command.buffer===3))throw Error('AssertCommand random name did not consume native first sample');
    executeControllerM1({type:'TargetDrop',params:{excludeid:'7',keepone:'1'}},actor,context,adapter);if(variableRandomStream.state()!==282475249||JSON.stringify(targets.ids())!==JSON.stringify([ids[0]]))throw Error('TargetDrop did not consume shared native selection sample');
    executeControllerM1({type:'VarRandom',params:{v:'0',range:'0,2147483647'}},actor,context,adapter);if(actor.vars[0]!==1622650073)throw Error('Shared native controller selection sequence was interrupted');targets.clear();selections++;
   }
   if(selections!==8)throw Error('Incomplete selection consumer matrix');
   let queries=0;
   for(const profile of ['mugen11','ikemen'])for(const player of [1,2])for(const helper of [false,true]){
    specialRuntime.reset();combatEngineProfile=profile;const root=specialRoot(player);let actor=root;
    if(helper){const data=characterProfiles.get(battleCharacters[player-1]).battle;data.helperStates[991994]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[]};specialRuntime.dispatch({type:'Helper',params:{stateno:991994,id:991994}},root,specialRuntime.context(root),{},root,player);actor=specialRuntime.entities.at(-1)}
    variableRandomStream.seed(1);const context=specialRuntime.context(actor);if(variableRandomStream.state()!==1)throw Error('Context construction consumed Random');
    if(evalM1('Random',context)!==0||evalM1('Random',context)!==131||variableRandomStream.state()!==282475249)throw Error('Random query reused a tick-cached sample');
    executeControllerM1({type:'VarRandom',params:{v:'0',range:'0,2147483647'}},actor,context,{owner:actor,player,schedulingApplied:true});if(actor.vars[0]!==1622650073)throw Error('Random query did not share controller stream');
    if(evalAST(parseExprAST('Random + Random'),context)!==990||variableRandomStream.state()!==1144108930)throw Error('AST Random did not sample per occurrence');
    variableRandomStream.seed(1);if(evalM1('RandomRange(5.9,9.1)',context)!==5||variableRandomStream.state()!==16807)throw Error('RandomRange did not truncate bounds/sample natively');
    if(evalAST(parseExprAST('RandomRange(2147483647,0)'),context)!==282475249)throw Error('AST RandomRange did not use shared reversed-range sample');
    variableRandomStream.seed(1);actor.vars[10]=0;if(evalM1('RandomRange((var(10):=5),(var(10):=9))',context)!==5||actor.vars[10]!==9||variableRandomStream.state()!==16807)throw Error('RandomRange bound evaluation order changed');
    variableRandomStream.seed(1);actor.vars[10]=0;if(!Number.isNaN(evalM1('RandomRange(0/0,(var(10):=9))',context))||actor.vars[10]!==9||variableRandomStream.state()!==1)throw Error('Undefined RandomRange skipped RHS or consumed a sample');
    if(evalM1('Cond(0,RandomRange(1,9),123)',context)!==123||variableRandomStream.state()!==1)throw Error('Unselected Cond RandomRange consumed a sample');queries++;
   }
   if(queries!==8)throw Error('Incomplete Random query matrix');variableRandomStream.seed(1);if(queryValue('Random')!==0||variableRandomStream.state()!==16807)throw Error('Fast Random query bypassed shared stream');
   let explods=0;
   for(const profile of ['mugen11','ikemen'])for(const player of [1,2])for(const helper of [false,true])for(const common of [false,true]){
    specialRuntime.reset();sourceExplods.length=0;combatEngineProfile=profile;const root=specialRoot(player);let actor=root;
    if(helper){const data=characterProfiles.get(battleCharacters[player-1]).battle;data.helperStates[991995]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[]};specialRuntime.dispatch({type:'Helper',params:{stateno:991995,id:991995}},root,specialRuntime.context(root),{},root,player);actor=specialRuntime.entities.at(-1)}
    const context=specialRuntime.context(actor),adapter={owner:actor,player,schedulingApplied:true,explod:params=>spawnSourceExplod(params,actor,player,context)};variableRandomStream.seed(1);
    executeControllerM1({type:'Explod',params:{anim:common?'F(120)':'0',pos:'10,20,30',random:'8,12,16',bindtime:'1'}},actor,context,adapter);const effect=sourceExplods[0],halves=[4,6,8],samples=[16807,282475249,1622650073],relative=[10,20,30].map((value,index)=>Math.fround(value+Math.fround(-halves[index]+Math.fround(Math.fround(Math.fround(samples[index])*Math.fround(halves[index]*2))/Math.fround(2147483647)))));
    if(sourceExplods.length!==1||effect.x!==actor.x+relative[0]*actor.facing||effect.y!==actor.y+relative[1]||effect.z!==Number(actor.z??0)+relative[2]||JSON.stringify(effect.bindOffset)!==JSON.stringify(relative)||variableRandomStream.state()!==1622650073)throw Error('Explod native XYZ random/relative-facing/binding mismatch');
    transDrawQueue.reset();drawSourceExplods();if(!transDrawQueue.ordered().some(entry=>entry.kind==='explod'))throw Error('Random Explod did not reach drawing');
    sourceExplods.length=0;variableRandomStream.seed(1);executeControllerM1({type:'Explod',params:{anim:common?'F120':'0',pos:'0,0'}},actor,context,adapter);if(sourceExplods.length!==1||variableRandomStream.state()!==1)throw Error('Omitted Explod random consumed native samples');sourceExplods.length=0;explods++;
   }
   if(explods!==16)throw Error('Incomplete Explod native random matrix');
   let modifications=0;
   for(const profile of ['mugen11','ikemen'])for(const player of [1,2])for(const helper of [false,true])for(const ikemen of [false,true]){
    specialRuntime.reset();sourceExplods.length=0;combatEngineProfile=profile;const root=specialRoot(player),data=characterProfiles.get(battleCharacters[player-1]).battle,savedCompatibility=data.compatibility;data.compatibility=ikemen?'ikemen':'mugen';let actor=root;
    try{
     if(helper){data.helperStates[991996]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[]};specialRuntime.dispatch({type:'Helper',params:{stateno:991996,id:991996}},root,specialRuntime.context(root),{},root,player);actor=specialRuntime.entities.at(-1)}
     const context=specialRuntime.context(actor),adapter={owner:actor,player,schedulingApplied:true,explod:params=>spawnSourceExplod(params,actor,player,context)};
     for(const [anim,pos] of [['0','10,20,30'],['F120','30,40,50']])executeControllerM1({type:'Explod',params:{anim,pos,id:'44',bindtime:'0',vel:'4,5'}},actor,context,adapter);
     variableRandomStream.seed(1);executeControllerM1({type:'ModifyExplod',params:{id:'44',postype:'p1',random:'8,12,16'}},actor,context,adapter);
     if(sourceExplods.length!==2||variableRandomStream.state()!==1622650073)throw Error('ModifyExplod sampled per matching effect instead of once');
     const halves=[4,6,8],samples=[16807,282475249,1622650073],spread=halves.map((half,index)=>Math.fround(-half+Math.fround(Math.fround(Math.fround(samples[index])*Math.fround(half*2))/Math.fround(2147483647))));
     for(const [index,effect] of sourceExplods.entries()){
      const original=index?[30,40,50]:[10,20,30],relative=original.map((value,axis)=>Math.fround((ikemen?value:0)+spread[axis]));
      if(effect.x!==actor.x+relative[0]*actor.facing||effect.y!==actor.y+relative[1]||effect.z!==Number(actor.z??0)+relative[2]||JSON.stringify(effect.bindOffset)!==JSON.stringify(relative))throw Error('ModifyExplod deferred position/reset mismatch');
      if(!ikemen&&(effect.vx!==0||effect.vy!==0||effect.bindtime!==1))throw Error('MUGEN postype did not reset movement/binding defaults');
     }
     actor.vars[11]=0;variableRandomStream.seed(1);executeControllerM1({type:'ModifyExplod',params:{id:'999',postype:'p1',random:'(var(11):=8)'}},actor,context,adapter);if(actor.vars[11]!==0||variableRandomStream.state()!==1)throw Error('Missing ModifyExplod match evaluated random');
     if(!ikemen){executeControllerM1({type:'ModifyExplod',params:{id:'44',random:'(var(11):=8)'}},actor,context,adapter);if(actor.vars[11]!==0||variableRandomStream.state()!==1)throw Error('MUGEN postype lock did not suppress random evaluation')}
     const before=[sourceExplods[0].x,sourceExplods[0].y,sourceExplods[0].z];executeControllerM1({type:'ModifyExplod',params:{id:'44',index:'1',postype:'p1',random:'0'}},actor,context,adapter);if(variableRandomStream.state()!==16807||JSON.stringify(before)!==JSON.stringify([sourceExplods[0].x,sourceExplods[0].y,sourceExplods[0].z]))throw Error('ModifyExplod index affected unmatched effect or sampled wrong count');
     transDrawQueue.reset();drawSourceExplods();if(transDrawQueue.ordered().filter(entry=>entry.kind==='explod').length!==2)throw Error('Modified Explods did not draw');
     executeControllerM1({type:'ModifyExplod',params:{id:'44',postype:'p1',pos:'100,200,300',velocity:'4,5,6',accel:'1,2,3',scale:'2,3'}},actor,context,adapter);
     for(const effect of sourceExplods){if(effect.x!==actor.x+100*actor.facing||effect.y!==actor.y+200||effect.z!==Number(actor.z??0)+300||JSON.stringify([effect.vx,effect.vy,effect.vz])!==JSON.stringify([4*actor.facing,5,6])||JSON.stringify(effect.scale)!=='[2,3]')throw Error('ModifyExplod position/velocity/scale fields did not reach effects')}
     const positions=sourceExplods.map(effect=>[effect.x,effect.y,effect.z]);stepSourceExplods();if(sourceExplods.length!==2)throw Error('Modified motion effects expired unexpectedly');
     for(const [index,effect] of sourceExplods.entries())if(effect.x!==positions[index][0]+4*actor.facing||effect.y!==positions[index][1]+5||effect.z!==positions[index][2]+6||JSON.stringify([effect.vx,effect.vy,effect.vz])!==JSON.stringify([5*actor.facing,7,9]))throw Error('ModifyExplod XYZ motion/acceleration did not advance');
     const beforeScale=sourceExplods.map(effect=>[effect.x,effect.y,effect.z,effect.vx,effect.vy,effect.vz]);executeControllerM1({type:'ModifyExplod',params:{id:'44',scale:'4'}},actor,context,adapter);for(const [index,effect] of sourceExplods.entries())if(JSON.stringify(effect.scale)!=='[4,3]'||JSON.stringify(beforeScale[index])!==JSON.stringify([effect.x,effect.y,effect.z,effect.vx,effect.vy,effect.vz]))throw Error('Unlocked partial scale update changed motion or missing scale component');
     transDrawQueue.reset();drawSourceExplods();const fit=Math.min(innerWidth/1280,innerHeight/720);for(const entry of transDrawQueue.ordered().filter(entry=>entry.kind==='explod'))if(Math.abs(Math.abs(entry.matrix[0])-4*cameraZoom*fit)>1e-6||Math.abs(Math.abs(entry.matrix[3])-3*cameraZoom*fit)>1e-6)throw Error('ModifyExplod scale did not reach drawing matrix');
     executeControllerM1({type:'ModifyExplod',params:{id:'44',friction:'.5,0,2'}},actor,context,adapter);const beforeFriction=sourceExplods.map(effect=>[effect.x,effect.y,effect.z]);stepSourceExplods();
     for(const [index,effect] of sourceExplods.entries())if(effect.x!==Math.fround(beforeFriction[index][0]+5*actor.facing)||effect.y!==Math.fround(beforeFriction[index][1]+7)||effect.z!==Math.fround(beforeFriction[index][2]+9)||JSON.stringify([effect.vx,effect.vy,effect.vz])!==JSON.stringify([3.5*actor.facing,2,21]))throw Error('ModifyExplod friction/acceleration order mismatch');
     executeControllerM1({type:'ModifyExplod',params:{id:'44',friction:'.5'}},actor,context,adapter);stepSourceExplods();for(const effect of sourceExplods)if(JSON.stringify(effect.friction)!=='[0.5,0,0]'||JSON.stringify([effect.vx,effect.vy,effect.vz])!==JSON.stringify([2.75*actor.facing,2,3]))throw Error('Partial ModifyExplod friction did not default missing axes to zero');
     executeControllerM1({type:'ModifyExplod',params:{id:'44',postype:'p1',velocity:'.1,.1,.1',accel:'0,0,0',friction:'.5,1,-.5'}},actor,context,adapter);stepSourceExplods();for(const effect of sourceExplods)if(effect.vx!==0||effect.vy!==Math.fround(.1)||effect.vz!==0)throw Error('Native small-speed friction stop threshold was lost');modifications++;
    }finally{data.compatibility=savedCompatibility}
   }
   if(modifications!==16)throw Error('Incomplete ModifyExplod consumer matrix');return count}finally{variableRandomStream.seed(savedSeed);combatEngineProfile=savedProfile;specialRuntime.reset()}
  })()`);
  assert.equal(count,16);console.log('Native random/Explod cases pass; sixteen ModifyExplod cases verify selection, version locks, XYZ motion/friction/stop threshold and actual scaling/drawing');
 }finally{await browser?.close();server.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
