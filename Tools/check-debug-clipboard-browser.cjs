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
 const watchdog=setTimeout(async()=>{console.error('Debug clipboard controller regression exceeded deadline');try{await browser?.close()}finally{server.close();process.exit(1)}},300000);
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
    combatEngineProfile=profile;specialRuntime.reset();debugClipboard.clear();
    const data=characterProfiles.get(battleCharacters[player-1]).battle;
    data.helperStates[991671]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[]};
    let caller=specialRoot(player);
    if(kind==='helper'){
     specialRuntime.dispatch({type:'Helper',params:{stateno:991671,id:991671}},caller,specialRuntime.context(caller),{},caller,player);
     caller=specialRuntime.entities.at(-1);
    }
    const context=specialRuntime.context(caller),adapter={owner:caller,player,schedulingApplied:true};
    executeControllerM1({type:'DisplayToClipboard',params:{text:'"n=%d/%d"',params:'Var(3):=7,Var(3):=Var(3)+1'}},caller,context,adapter);
    executeControllerM1({type:'AppendToClipboard',params:{text:'"!"'}},caller,context,adapter);
    const own=debugClipboard.entries().find(entry=>entry.key===(caller.key||'root'+player));
    updateDebugHud();const visible=act.textContent.includes('n=7/8');
    executeControllerM1({type:'DisplayToClipboard',params:{text:'"ties=%.0f/%.2f"',params:'2.5,1.125'}},caller,context,adapter);
    const floating=debugClipboard.entries().find(entry=>entry.key===(caller.key||'root'+player)).lines;
    updateDebugHud();const floatVisible=act.textContent.includes(floating[0]);
    executeControllerM1({type:'DisplayToClipboard',params:{text:'"bad=%d"',params:'1.25'}},caller,context,adapter);
    const mismatch=debugClipboard.entries().find(entry=>entry.key===(caller.key||'root'+player)).lines;
    const target=specialRoot(3-player);target.vars[3]=99;
    executeControllerM1({type:'DisplayToClipboard',params:{redirectid:3-player,text:'"r=%d"',params:'Var(3):=Var(3)+1'}},caller,context,adapter);
    const redirected=debugClipboard.entries().find(entry=>entry.key==='root'+(3-player));
    executeControllerM1({type:'ClearClipboard',params:{redirectid:3-player}},caller,context,adapter);
    const cleared=!debugClipboard.entries().some(entry=>entry.key==='root'+(3-player));
    executeControllerM1({type:'DisplayToClipboard',params:{redirectid:999999,text:'"%d"',params:'Var(3):=100'}},caller,context,adapter);
    rows.push({profile,player,kind,lines:own.lines,visible,floating,floatVisible,mismatch,redirected:redirected.lines,cleared,source:caller.vars[3],target:target.vars[3]});
    executeControllerM1({type:'ClearClipboard',params:{}},caller,context,adapter);
    updateDebugHud();
    if(act.textContent.includes('n=7/8')||act.textContent.includes('bad='))throw Error('Cleared clipboard still visible');
   }}finally{combatEngineProfile=saved;debugClipboard.clear()}
   return rows;
  })()`);
  for(const row of results){
   assert.deepEqual(row.lines,row.profile==='ikemen'?['n=7/8!']:['n=7/8','!']);
   assert.equal(row.visible,true);assert.equal(row.cleared,true);
   assert.equal(row.floatVisible,true);
   assert.deepEqual(row.floating,[row.profile==='ikemen'?'ties=2/1.12':'ties=3/1.13']);
   assert.deepEqual(row.mismatch,[row.profile==='ikemen'?'bad=%!d(float32=1.25)':'bad=1.250000']);
   assert.deepEqual(row.redirected,['r=9']);assert.equal(row.source,9);assert.equal(row.target,99);
  }
  console.log('Actual Display/Append/ClearClipboard root/Helper consumers, visible HUD, redirected output and caller-only parameter writes pass in eight scenarios');
  assert.deepEqual(errors,[]);

 }finally{await browser?.close();server.close();clearTimeout(watchdog)}
})().catch(error=>{console.error(error);process.exitCode=1});
