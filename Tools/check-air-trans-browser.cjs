const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/jeffy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..'),vendor=path.resolve(root,'../outputs/three-r180');
const server=http.createServer((request,response)=>{
 const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname),base=pathname.startsWith('/vendor/')?vendor:root,file=path.resolve(base,pathname.startsWith('/vendor/')?pathname.slice(8):'.'+(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(base+path.sep)||!fs.existsSync(file)){response.writeHead(404);response.end();return}
 let content=fs.readFileSync(file);if(file===path.join(root,'index.html'))content=Buffer.from(content.toString().replaceAll('https://cdn.jsdelivr.net/npm/three@0.180.0/','/vendor/').replaceAll('requestAnimationFrame(loop);','').replace('</script></body>',`window.airTransBrowserTest={run:source=>eval(source)};</script></body>`));
 response.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');response.end(content);
});
(async()=>{let browser;try{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));browser=await chromium.launch({headless:true,channel:'msedge'});const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('http://127.0.0.1:'+server.address().port+'/');await page.waitForFunction(()=>window.airTransBrowserTest?.run('!!dat&&!!stateIR&&!!battleDat&&!!lifecycleDat&&!!specialDat&&!!commonAnimationDat'),null,{timeout:90000});
 const run=source=>page.evaluate(source=>window.airTransBrowserTest.run(source),source);await run("prepareCharacters(['SailorMoon','SailorVenus'])");
 const result=await run(`(()=>{
  customStateOwners.fill(null);p1Reaction=null;enterIRState(0);enterP2State(0);simPaused=false;current=0;fi=0;p2.anim=0;p2.elem=1;
  const frames=[withCharacter(1,()=>framesFor(0)),withCharacter(2,()=>framesFor(0))],saved=frames.map(list=>list.map(frame=>frame.blend)),states=[...rootTransStates],angles=rootAngleStates.map(state=>({...state,scale:[...state.scale]}));
  const cases=[
   ['AS',null,{type:'add',alpha:[0,0]}],['SS',null,{type:'sub',alpha:[0,255]}],['SAS',null,{type:'subadd',alpha:[0,255]}],
   ['AS12D34junk',null,{type:'add',alpha:[12,34]}],['ASjunk',null,{type:'add',alpha:[0,0]}],
   ['AS16384D999',null,{type:'add',alpha:[0,255]}],['A1',null,{type:'add',alpha:[255,128]}],['SS256D0',null,{type:'sub',alpha:[255,0]}],
   ['AS',{type:'default',alpha:[128,128]},{type:'add',alpha:[0,0]}],['AS',{type:'none',alpha:[255,0]},{type:'none',alpha:[255,0]}],
   ['AS',{type:'add',alpha:[17,23]},{type:'add',alpha:[17,23]}],['AS',{type:'sub',alpha:[65,125]},{type:'sub',alpha:[65,125]}]
  ];
  let count=0;
  try{
   for(const player of [1,2])for(const branch of ['forward','reverse','angle'])for(const [blend,override,expected] of cases){
    for(const frame of frames[player-1])frame.blend=blend;
    rootTransStates[player-1]=override;rootAngleStates[player-1].enabled=branch==='angle';rootAngleStates[player-1].value=37;
    if(player===1)p1Facing=branch==='reverse'?-1:1;else p2.facing=branch==='reverse'?-1:1;
    transDrawQueue.reset();if(player===1)draw();else drawMars();
    const actual=transDrawQueue.ordered().find(entry=>entry.kind==='root'+player)?.state;
    if(JSON.stringify(actual)!==JSON.stringify(expected))throw Error('AIR alpha root draw mismatch '+JSON.stringify({player,branch,blend,override,actual,expected}));
    count++;
   }
   return {rootDrawCases:count};
  }finally{frames.forEach((list,i)=>list.forEach((frame,j)=>frame.blend=saved[i][j]));rootTransStates[0]=states[0];rootTransStates[1]=states[1];rootAngleStates[0]=angles[0];rootAngleStates[1]=angles[1]}
 })()`);
 assert.equal(result.rootDrawCases,72);assert.deepEqual(errors,[]);console.log('PASS 72 actual P1/P2 forward/reverse/angle draw cases: native AIR alpha, accepted tails and controller overrides');
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve))}})().catch(error=>{console.error(error);process.exitCode=1});
