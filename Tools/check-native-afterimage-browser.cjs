const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/jeffy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..'),vendor=path.resolve(root,'../outputs/three-r180');
const server=http.createServer((request,response)=>{
 const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname),base=pathname.startsWith('/vendor/')?vendor:root,file=path.resolve(base,pathname.startsWith('/vendor/')?pathname.slice(8):'.'+(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(base+path.sep)||!fs.existsSync(file)){response.writeHead(404);response.end();return}
 let content=fs.readFileSync(file);if(file===path.join(root,'index.html'))content=Buffer.from(content.toString().replaceAll('https://cdn.jsdelivr.net/npm/three@0.180.0/','/vendor/').replaceAll('requestAnimationFrame(loop);','').replace('</script></body>',`window.afterImageTest={run:source=>eval(source)};</script></body>`));
 response.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');response.end(content);
});
(async()=>{let browser;try{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));browser=await chromium.launch({headless:true,channel:'msedge'});const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('http://127.0.0.1:'+server.address().port+'/');await page.waitForFunction(()=>window.afterImageTest?.run('!!dat&&!!stateIR&&!!battleDat&&!!lifecycleDat&&!!specialDat&&!!commonAnimationDat'),null,{timeout:90000});
 const run=source=>page.evaluate(source=>window.afterImageTest.run(source),source);await run("prepareCharacters(['SailorSaturn','SailorSaturn'])");
 const count=await run(`(()=>{
  const data=characterProfiles.get('SailorSaturn').battle,saved=data.compatibility;let cases=0;
  const dispatch=(actor,type,params)=>executeControllerM1({type,params},actor.kind==='helper'?actor:actor.player===1?p1LifecycleBinding:p2,specialRuntime.context(actor),{owner:actor,player:actor.player,schedulingApplied:true,explod:values=>spawnSourceExplod(values,actor,actor.player,specialRuntime.context(actor))});
  const canvas=document.createElement('canvas');canvas.width=64;canvas.height=8;const context=canvas.getContext('2d');const sprite=document.createElement('canvas');sprite.width=sprite.height=2;sprite.getContext('2d').fillRect(0,0,2,2);
  try{for(const ikemen of [false,true])for(const player of [1,2])for(const helper of [false,true]){
   data.compatibility=ikemen?'ikemen':'mugen';specialRuntime.reset();sourceExplods.length=0;afterImages.fill(null);p1HitPause=0;p2.hitPause=p2.hitShake=p2.attackPause=0;specialRuntime.pauses.normal.fill(null);specialRuntime.pauses.super.fill(null);let actor=specialRoot(player);
   if(helper){specialRuntime.dispatch({type:'Helper',params:{stateno:0,id:991983}},actor,specialRuntime.context(actor),{},actor,player);actor=specialRuntime.entities.at(-1)}
   dispatch(actor,'AfterImage',{time:'-1',length:'12',framegap:'3',palbright:'0,0,0',palcontrast:'256,256,256',paladd:'0,0,0',palmul:'1,1,1'});
   const state=nativeAfterImageForActor(actor),kind=helper?'helper':'root'+player;
   for(let tick=1;tick<=13;tick++){combatTraceTick++;transDrawQueue.reset();context.setTransform(1,0,0,1,tick*3,0);drawTransSprite(context,sprite,[0,0],{state:null,kind,actorId:helper?actor.instanceId:player,priority:4});const before=state.reccount;drawTransSprite(context,sprite,[0,0],{state:null,kind,actorId:helper?actor.instanceId:player,priority:4});if(state.reccount!==before)throw Error('Draw twice recorded duplicate history')}
   const ghosts=transDrawQueue.ordered().filter(entry=>entry.kind==='native-afterimage'),expected=ikemen?[30,21,12,3]:[33,24,15];
   const actual=ghosts.map(entry=>entry.matrix[4]).sort((a,b)=>a-b),wanted=[...expected,...expected].sort((a,b)=>a-b);if(JSON.stringify(actual)!==JSON.stringify(wanted))throw Error('Root/Helper history reached wrong renderer transforms '+JSON.stringify({ikemen,player,helper,actual,wanted,reccount:state.reccount}));
   if(ghosts.some(entry=>entry.syncId||entry.actorId))throw Error('History inherited actor synchronization identity');
   const output=document.createElement('canvas'),scratch=document.createElement('canvas');output.width=scratch.width=64;output.height=scratch.height=8;const outputContext=output.getContext('2d',{willReadFrequently:true}),scratchContext=scratch.getContext('2d',{willReadFrequently:true});outputContext.fillStyle='white';outputContext.fillRect(0,0,64,8);renderOpaqueTransQueue(outputContext,scratchContext,transDrawQueue,{layer:0,shader:paletteShaderForDraw});if(outputContext.getImageData(expected.at(-1),0,1,1).data[0]!==0||outputContext.getImageData(60,0,1,1).data[0]!==255)throw Error('Historical matrices/palette failed actual pixel compositor');
   dispatch(actor,'Explod',{id:'73',anim:'F120',bindtime:'0',removetime:'-1'});const effect=sourceExplods[0];effect.age=5;dispatch(actor,'ModifyExplod',{id:'73',syncid:String(helper?actor.instanceId:player),syncparams:'1'});stepSourceExplods(true);
   if(!effect.nativeAfterImage||effect.nativeAfterImage.reccount!==0||effect.nativeAfterImage.imgs.length!==1||effect.nativeAfterImage.palettes[0]!==state.palettes[0])throw Error('Effect copied history instead of settings');
   transDrawQueue.reset();combatTraceTick++;context.setTransform(1,0,0,1,50,0);drawTransSprite(context,sprite,[0,0],{state:null,kind:'explod',afterImageOwner:effect,priority:4});if(effect.nativeAfterImage.reccount!==1)throw Error('Effect did not record its own history');
   dispatch(actor,'AfterImageTime',{time:'0'});const retained=effect.nativeAfterImage;stepSourceExplods(true);if(effect.nativeAfterImage!==retained)throw Error('Inactive source erased effect history');cases++;
  }return cases}finally{data.compatibility=saved;specialRuntime.reset();afterImages.fill(null);sourceExplods.length=0}
 })()`);assert.equal(count,8);assert.deepEqual(errors,[]);console.log('Native AfterImage browser passes 8 version/root/Helper history and independent synchronized-effect cases');
}finally{await browser?.close();server.close()}})().catch(error=>{console.error(error);process.exitCode=1});
