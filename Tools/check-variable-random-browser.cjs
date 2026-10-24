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
   return count}finally{variableRandomStream.seed(savedSeed);combatEngineProfile=savedProfile;specialRuntime.reset()}
  })()`);
  assert.equal(count,16);console.log('Native controller interleavings and eight root/Helper Random/RandomRange cases pass repeated sampling, typed bounds, side effects, undefined and lazy-branch gates');
 }finally{await browser?.close();server.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
