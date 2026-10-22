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
 const watchdog=setTimeout(async()=>{console.error('CNS literal scheduling regression exceeded deadline');try{await browser?.close()}finally{server.close();process.exit(1)}},300000);
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  browser=await chromium.launch({headless:true,channel:'msedge'});
  const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:'+server.address().port+'/');
  await page.waitForFunction(()=>window.contactPhaseTest?.run('!!dat&&!!stateIR&&!!battleDat&&!!lifecycleDat&&!!specialDat&&!!roundCharDat&&!!cmdDat&&!!airDat&&!!fallDat&&!!guardDat&&!!turnDat'),null,{timeout:90000});
  const run=source=>page.evaluate(source=>window.contactPhaseTest.run(source),source);
  await run("prepareCharacters(['SailorSaturn','SailorSaturn'])");

  const results=await run(`(()=>{
   const rows=[],saved=combatEngineProfile;
   try{for(const profile of ['mugen11','ikemen'])for(const player of [1,2]){
    combatEngineProfile=profile;
    specialRuntime.reset();
    const caller=specialRoot(player),context=specialRuntime.context(caller),binding=caller;
    const paused=[p1HitPause,p2.hitShake,p2.attackPause];
    try{
     p1HitPause=1;p2.hitShake=1;p2.attackPause=1;
     for(const global of [false,true]){
      const observed=[];
      for(const literal of ['1 + 0','0.5','-2']){
       caller.vars[20]=0;
       executeControllerM1({type:'VarAdd',controllerStateNo:global?-2:0,params:{v:'20',value:'1',ignorehitpause:literal}},binding,context,{owner:caller,player,schedulingApplied:false});
       observed.push(caller.vars[20]);
      }
      rows.push({player,kind:global?'root-global':'root-current',observed});
     }
    }finally{[p1HitPause,p2.hitShake,p2.attackPause]=paused;}
    const data=characterProfiles.get(battleCharacters[player-1]).battle,oldGlobals=data.globalControllers,oldCommands=data.playerCommands;
    try{
     const controllers=(offset)=>['1 + 0','0.5','-2'].map((ignorehitpause,index)=>({type:'VarAdd',params:{v:String(offset+index),value:'1',ignorehitpause},triggers:{1:['1']},triggerall:[]}));
     data.helperStates[991680]={type:'S',physics:'N',moveType:'I',anim:0,controllers:controllers(20)};
     data.globalControllers={'-2':controllers(30)};data.playerCommands=[];
     for(const index of [30,31,32])caller.vars[index]=0;
     lifecycleRuntime.globalState(caller,context,-2,{hitPause:true});
     rows.push({player,kind:'root-lifecycle',observed:[30,31,32].map(index=>caller.vars[index])});
     specialRuntime.dispatch({type:'Helper',params:{stateno:991680,id:991680,keyctrl:'2'}},caller,context,{},caller,player);
     const child=specialRuntime.entities.at(-1);child.hitPause=2;
     specialRuntime.step();
     rows.push({player,kind:'helper-current/global',observed:[20,21,22,30,31,32].map(index=>child.vars[index])});
    }finally{data.globalControllers=oldGlobals;data.playerCommands=oldCommands;specialRuntime.reset();}
   }}finally{combatEngineProfile=saved;}
   return rows;
  })()`);
  for(const row of results)assert.deepEqual(row.observed,row.kind==='helper-current/global'?[1,0,1,1,0,1]:[1,0,1],JSON.stringify(row));
  assert.deepEqual(errors,[]);
  console.log('Actual P1/P2 root-current/root-global and Helper current/global hitpause gates use CNS Atoi literal prefixes and nonzero flags');
 }finally{await browser?.close();server.close();clearTimeout(watchdog)}
})().catch(error=>{console.error(error);process.exitCode=1});

