const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/jeffy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..'),vendor=path.resolve(root,'../outputs/three-r180');
const server=http.createServer((request,response)=>{
 const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname),base=pathname.startsWith('/vendor/')?vendor:root,file=path.resolve(base,pathname.startsWith('/vendor/')?pathname.slice(8):'.'+(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(base+path.sep)||!fs.existsSync(file)){response.writeHead(404);response.end();return}
 let content=fs.readFileSync(file);if(file===path.join(root,'index.html'))content=Buffer.from(content.toString().replaceAll('https://cdn.jsdelivr.net/npm/three@0.180.0/','/vendor/').replaceAll('requestAnimationFrame(loop);','').replace('</script></body>',`window.helperEntryTest={run:source=>eval(source)};</script></body>`));
 response.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');response.end(content);
});
(async()=>{let browser;try{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));browser=await chromium.launch({headless:true,channel:'msedge'});const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('http://127.0.0.1:'+server.address().port+'/');await page.waitForFunction(()=>window.helperEntryTest?.run('!!dat&&!!stateIR&&!!battleDat&&!!lifecycleDat&&!!specialDat&&!!commonAnimationDat'),null,{timeout:90000});
 const run=source=>page.evaluate(source=>window.helperEntryTest.run(source),source);await run("prepareCharacters(['SailorSaturn','SailorSaturn'])");
const result=await run(`(()=>{
  const data=profileFor(1).battle,numbers=[991991,991992,991993],saved={compatibility:data.compatibility,definitions:numbers.map(number=>data.helperStates[number])};let cases=0;
  const spawn=(owner,params={})=>{const before=specialRuntime.entities.length;specialRuntime.dispatch({type:'Helper',params},owner,specialRuntime.context(owner),{},owner,owner.player);return specialRuntime.entities.length===before?null:specialRuntime.entities.at(-1)};
  try{
   data.helperStates[numbers[0]]={type:'S',physics:'N',moveType:'I',controllers:[]};
   data.helperStates[numbers[1]]={type:'S',physics:'N',moveType:'I',anim:'-1',controllers:[]};
   data.helperStates[numbers[2]]={type:'A',physics:'N',moveType:'I',anim:'200',ctrl:'0',velset:'3,-4,5',controllers:[]};
   for(const ikemen of [false,true])for(const player of [1,2])for(const nested of [false,true])for(const form of [0,1,2]){
    specialRuntime.reset();sourceExplods.length=0;data.compatibility=ikemen?'ikemen':'mugen';let owner={...specialRoot(player),life:111,lifeMax:2345,anim:200,ctrl:0,vx:99,vy:88,vz:77};
    if(nested)owner=spawn(owner,{stateno:String(numbers[0]),id:'66'});
    const child=spawn(owner,{stateno:String(numbers[form]),id:'67'});if(!child||child.state!==numbers[form]||child.id!==67||child.life!==2345||child.lifeMax!==2345)throw Error('Helper bootstrap missed parent maximum life or selected state/ID');
    const context=specialRuntime.context(child);
    if(form<2){if(child.anim!==0||child.ctrl!==1||child.vx!==0||child.vy!==0||child.vz!==0||evalM1('Anim',context)!==0||!evalM1('Ctrl',context))throw Error('Missing/-1 StateDef did not retain native Helper animation/control/velocity defaults')}
    else if(child.anim!==200||child.ctrl!==0||child.vx!==3*child.facing||child.vy!==-4||child.vz!==5)throw Error('StateDef did not override bootstrap values '+JSON.stringify([child.anim,child.ctrl,child.vx,child.vy,child.vz,child.facing]));
    transDrawQueue.reset();drawSourceExplods();const entry=transDrawQueue.ordered().find(entry=>entry.kind==='helper'&&entry.actorId===child.instanceId);if(!entry?.source||!entry.source.getContext('2d').getImageData(0,0,entry.source.width,entry.source.height).data.some((value,index)=>index%4===3&&value>0))throw Error('Bootstrapped Helper has no real sprite draw');
    cases++;
   }
   specialRuntime.reset();const owner=specialRoot(1),defaultChild=spawn(owner);if(defaultChild.state!==0||defaultChild.id!==0||defaultChild.anim!==0)throw Error('Omitted Helper state/id did not default to zero');
   runtimeVar[19]=numbers[0];runtimeVar[18]=67;const expressionChild=spawn(owner,{stateno:'(var(19):=var(19)+1)',id:'(var(18):=var(18)+1)'});if(expressionChild.state!==numbers[1]||expressionChild.id!==68||runtimeVar[19]!==numbers[1]||runtimeVar[18]!==68)throw Error('State/ID expressions were not evaluated once in caller context');
   const negative=spawn(owner,{stateno:String(numbers[0]),id:'-7'});if(negative.id!==0)throw Error('Negative helper ID was not clamped');
   runtimeVar[19]=949;const suppressed=spawn(owner,{stateno:'(var(19):=var(19)+1)'});if(suppressed!==null||runtimeVar[19]!==950)throw Error('Evaluated H950 suppression lost game-specific behavior');
   return {cases};
  }finally{data.compatibility=saved.compatibility;for(let index=0;index<numbers.length;index++){if(saved.definitions[index]===undefined)delete data.helperStates[numbers[index]];else data.helperStates[numbers[index]]=saved.definitions[index]}specialRuntime.reset();sourceExplods.length=0}
 })()`);assert.deepEqual(result,{cases:24});assert.deepEqual(errors,[]);console.log('Helper entry passes 24 native-version/player/root-nested/StateDef/default-real-draw cases plus omitted state/ID, caller expressions, negative IDs and H950 suppression');
}finally{await browser?.close();server.close()}})().catch(error=>{console.error(error);process.exitCode=1});
