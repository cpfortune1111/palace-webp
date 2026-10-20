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
 const watchdog=setTimeout(async()=>{console.error('Math-function controller regression exceeded deadline');try{await browser?.close()}finally{server.close();process.exit(1)}},300000);
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
    combatEngineProfile=profile;specialRuntime.reset();stateTicks=p2.time=5;
    let caller=specialRoot(player);
    if(kind==='helper'){
     const data=characterProfiles.get(battleCharacters[player-1]).battle;
     data.helperStates[991671]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[]};
     specialRuntime.dispatch({type:'Helper',params:{stateno:991671,id:991671}},caller,specialRuntime.context(caller),{},caller,player);
     caller=specialRuntime.entities.at(-1);caller.time=5;
    }
    caller.vars.fill(0);caller.vars[0]=-5;caller.vars[1]=7;caller.fvars[0]=-5;
    const context=specialRuntime.context(caller),other=context.redirect('Enemy');other.vars[0]=43;other.fvars[0]=43;const expressions=['floor(5.9)/2','ceil(5.1)/2','floor(-5.1)/2','ceil(-5.9)/2','abs(Var(0))/2','abs(FVar(0))/2','cos(0)/2','exp(0)/2','sin(0)/2','acos(1)/2','atan(0)/2','ln(1)/2','floor(Time/2)/2','floor(Var(3):=5)/2','max(5,2)/2','min(5,2)/4','log(2,8)/2','round(1.25,1)','round(-1.25,1)','clamp(5,0,4)/3','lerp(2,6,.5)','atan2(0,1)','sign(-5)/2','rad(180)','(Enemy,Var(0))/2','(Enemy,FVar(0))/2','(Enemy,floor(Var(0)))/2','max((Enemy,Var(0)),2)/2'];
    for(const [index,value] of expressions.entries())executeControllerM1({type:'VarSet',params:{fv:index+9,value}},caller,context,{owner:caller,player,schedulingApplied:true});
    rows.push({profile,player,kind,values:caller.fvars.slice(9,37),write:caller.vars[3]});
   }}finally{combatEngineProfile=saved}
   return rows;
  })()`);
  console.log('Actual typed math-function controller observations',JSON.stringify(results));
  for(const row of results){
   assert.deepEqual(row.values,[2,3,-3,-2,2,2.5,.5,.5,0,0,0,0,1,2,2.5,.5,1.5,Math.fround(1.3),Math.fround(-1.2),Math.fround(4/3),4,0,0,Math.fround(Math.PI),21,21.5,-2,21.5]);
   assert.equal(row.write,5);
  }
  assert.deepEqual(errors,[]);

 }finally{await browser?.close();server.close();clearTimeout(watchdog)}
})().catch(error=>{console.error(error);process.exitCode=1});
