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
 const watchdog=setTimeout(async()=>{console.error('Helper deferred-state regression exceeded deadline');try{await browser?.close()}finally{server.close();process.exit(1)}},300000);
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
   const rows=[];
   actorKoFlags.clear();actorOverKoFlags.clear();customStateOwners.fill(null);customAnimationOwners.fill(null);
   p1Life=p2.life=1000;posX=-100;p2.x=100;posZ=p2.z=0;
   for(const player of [1,2])for(const kind of ['root','helper']){
    specialRuntime.reset();
    const recipient=kind==='root'?specialRoot(3-player):specialRoot(player);
    let caller=specialRoot(player);
    if(kind==='helper'){
     const data=characterProfiles.get(battleCharacters[player-1]).battle;
     data.helperStates[991670]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[]};
     specialRuntime.dispatch({type:'Helper',params:{stateno:991670,id:991670}},caller,specialRuntime.context(caller),{},caller,player);
     caller=specialRuntime.entities.at(-1);
    }
    caller.vars.fill(0);recipient.vars.fill(0);caller.vars[0]=2;recipient.vars[0]=9;
    const context=specialRuntime.context(caller),redirect=kind==='root'?'EnemyNear':'Parent';
    const values=[evalM1(redirect+', IfElse(1,Var(0),0)',context),evalM1(redirect+', Cond(1,Var(0),0)',context)];
    const runControllerForActor=params=>executeControllerM1({type:'VarSet',params},caller,context,{owner:caller,player,schedulingApplied:true});
    runControllerForActor({v:7,value:redirect+', IfElse(1,Var(1):=Var(0)+1,Var(1):=Var(0)+2)'});
    runControllerForActor({v:8,value:redirect+', Cond(1,Var(1):=Var(0)+1,Var(1):=999)'});
    for(const [index,expression] of ['IfElse(1,5,7)/2','IfElse(0,5,7.0)/2','Cond(0,5.0,7)/2'].entries())runControllerForActor({fv:index+9,value:expression});
    rows.push({player,kind,values,mutation:[caller.vars[1],recipient.vars[1]],parameters:caller.vars.slice(7,9),typed:caller.fvars.slice(9,12)});
   }
   return rows;
  })()`);
  console.log('Actual conditional controller observations',JSON.stringify(results));
  for(const row of results)assert.deepEqual(row,{player:row.player,kind:row.kind,values:[2,9],mutation:[4,10],parameters:[3,10],typed:[2,3.5,3]});
  assert.deepEqual(errors,[]);

 }finally{await browser?.close();server.close();clearTimeout(watchdog)}
})().catch(error=>{console.error(error);process.exitCode=1});
