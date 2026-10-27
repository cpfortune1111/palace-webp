const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const assert=require('node:assert/strict');
const {chromium}=require('C:/Users/jeffy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..'),vendor=path.resolve(root,'../outputs/three-r180');
const server=http.createServer((request,response)=>{
 const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname),base=pathname.startsWith('/vendor/')?vendor:root,file=path.resolve(base,pathname.startsWith('/vendor/')?pathname.slice(8):'.'+(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(base+path.sep)||!fs.existsSync(file)){response.writeHead(404);response.end();return}
 let content=fs.readFileSync(file);
 if(file===path.join(root,'index.html'))content=Buffer.from(content.toString().replaceAll('https://cdn.jsdelivr.net/npm/three@0.180.0/','/vendor/').replaceAll('requestAnimationFrame(loop);','').replace('</script></body>',`window.contactPhaseTest={run:source=>eval(source)};</script></body>`));
 response.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');response.end(content);
});
(async()=>{
 let browser;
 const watchdog=setTimeout(async()=>{console.error('Intrinsic query controller regression exceeded deadline');try{await browser?.close()}finally{server.close();process.exit(1)}},300000);
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  browser=await chromium.launch({headless:true,channel:'msedge'});
  const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:'+server.address().port+'/');
  await page.waitForFunction(()=>window.contactPhaseTest?.run('!!dat&&!!stateIR&&!!battleDat&&!!lifecycleDat&&!!specialDat&&!!roundCharDat&&!!cmdDat&&!!airDat&&!!fallDat&&!!guardDat&&!!turnDat'),null,{timeout:90000});
  const run=source=>page.evaluate(source=>window.contactPhaseTest.run(source),source);
  await run("prepareCharacters(['SailorSaturn','SailorSaturn'])");
  await run("prepareCharacters(['SailorSaturn','SailorMoon'])");
  const results=await run(`(()=>{
   const rows=[],saved=combatEngineProfile;
   try{for(const profile of ['mugen11','ikemen'])for(const player of [1,2])for(const kind of ['root','helper']){
    combatEngineProfile=profile;specialRuntime.reset();sourceExplods.length=0;combatTargets.clear();
    const data=characterProfiles.get(battleCharacters[player-1]).battle;
    data.helperStates[991671]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[]};
    let caller=specialRoot(player);
    if(kind==='helper'){
     specialRuntime.dispatch({type:'Helper',params:{stateno:991671,id:991671}},caller,specialRuntime.context(caller),{},caller,player);
     caller=specialRuntime.entities.at(-1);
    }
    for(let index=0;index<3;index++)specialRuntime.dispatch({type:'Helper',params:{stateno:991671,id:777}},caller,specialRuntime.context(caller),{},caller,player);
    caller.vars.fill(0);
    const context=specialRuntime.context(caller),assertions=context.assertions||rootAssertions[player-1],had=assertions.has('noautoturn');
    assertions.add('noautoturn');
    try{
     for(const id of [777,778,779])executeControllerM1({type:'Explod',params:{anim:0,id,removetime:-1,postype:'p1',pos:'0,0'}},caller,context,{owner:caller,player,schedulingApplied:true,explod:params=>spawnSourceExplod(params,caller,player,context)});
     combatTargetList(caller).add(specialRoot(3-player).id);
     const expressions=['NumHelper(777)/2','NumHelper(777)','NumHelper(Var(3):=777)/2','PlayerIDExist('+caller.id+')/2','SelfAnimExist(0)/2','SelfAnimExist(0)','IsAsserted(noautoturn)/2','IsAsserted(noautoturn)','NumProjID(777)/2','NumExplod(777)/2','NumTarget(777)/2','(NumHelper(777)&&NumHelper(777))/2','NumHelper/2','NumExplod/2','NumExplod','NumExplod(777.9)','NumTarget/2','NumTarget','NumHelper(0)'];
     for(const [index,value] of expressions.entries())executeControllerM1({type:'VarSet',params:{fv:index+9,value}},caller,context,{owner:caller,player,schedulingApplied:true});
     rows.push({profile,player,kind,values:caller.fvars.slice(9,28),write:caller.vars[3],invalid:['NumHelper(1/0)','NumExplod(1/0)','NumProjID(1/0)','NumTarget(1/0)','PlayerIDExist(1/0)','SelfAnimExist(1/0)','AnimElemTime(1/0)'].map(value=>evalAST(parseExprAST(value),context))});
    }finally{if(!had)assertions.delete('noautoturn')}
   }}finally{combatEngineProfile=saved}
   return rows;
  })()`);
  for(const row of results){
   assert.deepEqual(row.values,[1,3,1,0,0,1,0,1,0,0,0,row.profile==='ikemen'?1:0,row.kind==='helper'?2:1,1,3,1,0,1,row.kind==='helper'?4:3]);
   assert.ok(row.invalid.every(Number.isNaN));
   assert.equal(row.write,777);
  }
  console.log('Eight actual intrinsic-query actor/profile scenarios pass nineteen VarSet parameters plus seven invalid-ID observations, including real Helpers, Explods and a target');
  assert.deepEqual(errors,[]);

 }finally{await browser?.close();server.close();clearTimeout(watchdog)}
})().catch(error=>{console.error(error);process.exitCode=1});
