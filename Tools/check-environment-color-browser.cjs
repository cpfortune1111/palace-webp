const assert=require('node:assert/strict');
const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const {chromium}=require('C:/Users/jeffy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..'),vendor=path.resolve(root,'../outputs/three-r180'),requests=[];
const server=http.createServer((request,response)=>{
 const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);requests.push(pathname);const base=pathname.startsWith('/vendor/')?vendor:root,file=path.resolve(base,pathname.startsWith('/vendor/')?pathname.slice(8):'.'+(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(base+path.sep)||!fs.existsSync(file)){response.writeHead(404);response.end();return}
 let content=fs.readFileSync(file);if(file===path.join(root,'index.html'))content=Buffer.from(content.toString().replaceAll('https://cdn.jsdelivr.net/npm/three@0.180.0/','/vendor/').replaceAll('requestAnimationFrame(loop);','').replace('</script></body>',`window.environmentTest={run:source=>eval(source)};</script></body>`));
 response.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');response.end(content);
});
(async()=>{
 let browser;
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});browser=await chromium.launch({headless:true,channel:'msedge'});const page=await browser.newPage({viewport:{width:1280,height:720}});
  await page.goto('http://127.0.0.1:'+server.address().port+'/');await page.waitForFunction(()=>window.environmentTest?.run('!!dat&&!!stateIR&&!!battleDat&&!!lifecycleDat&&!!specialDat&&!!roundCharDat&&!!cmdDat&&!!airDat&&!!fallDat&&!!guardDat&&!!turnDat'),null,{timeout:90000});
  const run=source=>page.evaluate(source=>window.environmentTest.run(source),source);await run("prepareCharacters(['SailorSaturn','SailorSaturn'])");
  assert.equal(requests.some(request=>request.includes('/Indexed/')),false,'Character recoloring must not preload unused assets');
  const rows=await run(`(()=>{
   const rows=[],saved=combatEngineProfile;
   try{for(const profile of ['mugen11','ikemen'])for(const player of [1,2])for(const kind of ['root','helper'])for(const under of [0,1]){
    specialRuntime.reset();combatEngineProfile=profile;const parent=specialRoot(player),data=characterProfiles.get(battleCharacters[player-1]).battle;let actor=parent;
    if(kind==='helper'){data.helperStates[991887]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[]};specialRuntime.dispatch({type:'Helper',params:{stateno:991887,id:991887}},parent,specialRuntime.context(parent),{},parent,player);actor=specialRuntime.entities.at(-1)}
    actor.vars[8]=17+player;executeControllerM1({type:'EnvColor',params:{value:'Var(8),258,-1',time:'3',under:String(under)}},actor,specialRuntime.context(actor),{owner:actor,player,schedulingApplied:true});
    if(environmentColor.remaining!==3||environmentColor.under!==!!under)throw Error('Actual EnvColor state mismatch');
    const canvas=document.createElement('canvas'),scratch=document.createElement('canvas'),source=document.createElement('canvas');canvas.width=scratch.width=32;canvas.height=scratch.height=16;source.width=source.height=2;const context=canvas.getContext('2d',{willReadFrequently:true}),sourceContext=source.getContext('2d');
    transDrawQueue.reset();
    for(const [left,layer,below,phase,color]of [[0,-1,false,'sprite','#ff0000'],[4,0,true,'sprite','#00ff00'],[8,0,false,'sprite','#0000ff'],[12,1,false,'sprite','#ff00ff'],[16,0,false,'reflection','#ff8000']]){
     const tile=document.createElement('canvas');tile.width=tile.height=2;const paint=tile.getContext('2d');paint.fillStyle=color;paint.fillRect(0,0,2,2);transDrawQueue.record(context,tile,[left,0],{layer,under:below,phase});
    }
    renderBattleTransCandidate(context,scratch.getContext('2d'),source);
    const sample=left=>[...context.getImageData(left,0,1,1).data],background=[17+player,2,255,255];
    for(const left of [0,4,16,24])if(JSON.stringify(sample(left))!==JSON.stringify(background))throw Error('EnvColor failed to hide background/under/reflection');
    if(JSON.stringify(sample(8))!==JSON.stringify(under?[0,0,255,255]:background))throw Error('EnvColor under flag did not control normal sprite pixels');
    if(JSON.stringify(sample(12))!==JSON.stringify([255,0,255,255]))throw Error('EnvColor incorrectly hid layer-one sprite');
    rows.push({profile,player,kind,under});environmentColor.remaining=0;
   }
   specialRuntime.reset();environmentColor.remaining=2;simStep();if(environmentColor.remaining!==1)throw Error('Simulation failed to step EnvColor');simStep();if(environmentColor.remaining!==0)throw Error('EnvColor did not expire');
   environmentColor.remaining=-1;simStep();if(environmentColor.remaining!==-1)throw Error('Negative EnvColor duration did not persist');
   specialRuntime.pauses.normal[0]={remaining:10,movetime:0,player:1,created:combatTraceTick-1};environmentColor.remaining=2;simStep();if(environmentColor.remaining!==1)throw Error('Actor global pause froze global EnvColor timer');specialRuntime.reset();
   const isHome=gameShell.isHome;try{gameShell.isHome=()=>false;transDrawQueue.reset();environmentColor.remaining=1;presentBattleTransFrame();if(transOutputCanvas.style.visibility!=='visible')throw Error('EnvColor alone did not activate compositor')}finally{gameShell.isHome=isHome}
   environmentColor.remaining=-1;roundFlow.begin('training','infinite');if(environmentColor.remaining!==0)throw Error('Actual new-round initialization retained EnvColor');return rows;
   }finally{environmentColor.remaining=0;combatEngineProfile=saved;specialRuntime.reset()}
  })()`);
  assert.equal(rows.length,16);console.log('Sixteen actual EnvColor root/Helper/profile/player cases consume wrapped RGB and under through production compositor pixels; simulation duration expires, negative duration persists; no recoloring assets preloaded');
 }finally{await browser?.close();server.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
