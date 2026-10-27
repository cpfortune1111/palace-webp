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
  const results=await run(`(()=>{
   const events=[],pads=[1,2].map(player=>({vibrationActuator:{playEffect:(type,params)=>{events.push({player,type,...params});return Promise.resolve()}}}));
   Object.defineProperty(navigator,'getGamepads',{configurable:true,value:()=>pads});
   forceFeedback.reset();
   const controller=params=>({type:'ForceFeedback',params,triggers:{1:['1']},triggerall:[]});
   runController(controller({lo:65535,hi:32768,time:12}));
   runP2ControllerM1(controller({ampl:255,time:2,waveform:'square'}));
   forceFeedback.step();forceFeedback.step();forceFeedback.step();
   runController(controller({redirectid:'2',lo:100,hi:200,time:0,self:0}));
   return events;
  })()`);
  assert.deepEqual(results,[
   {player:1,type:'dual-rumble',duration:212,strongMagnitude:1,weakMagnitude:32768/65535,startDelay:0},
   {player:2,type:'dual-rumble',duration:25,strongMagnitude:0,weakMagnitude:1,startDelay:0},
   {player:2,type:'dual-rumble',duration:25,strongMagnitude:0,weakMagnitude:1,startDelay:0},
   {player:2,type:'dual-rumble',duration:0,strongMagnitude:0,weakMagnitude:0,startDelay:0}
  ]);
  console.log('Actual root ForceFeedback dispatch reaches both browser motor slots, native tick durations, old waveform ticks and redirected new-API stop');
  assert.deepEqual(errors,[]);

 }finally{await browser?.close();server.close();clearTimeout(watchdog)}
})().catch(error=>{console.error(error);process.exitCode=1});
