const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/jeffy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..'),vendor=path.resolve(root,'../outputs/three-r180');
const server=http.createServer((request,response)=>{
 const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname),base=pathname.startsWith('/vendor/')?vendor:root,file=path.resolve(base,pathname.startsWith('/vendor/')?pathname.slice(8):'.'+(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(base+path.sep)||!fs.existsSync(file)){response.writeHead(404);response.end();return}
 let content=fs.readFileSync(file);if(file===path.join(root,'index.html'))content=Buffer.from(content.toString().replaceAll('https://cdn.jsdelivr.net/npm/three@0.180.0/','/vendor/').replaceAll('requestAnimationFrame(loop);','').replace('</script></body>',`window.projectileAfterImageTest={run:source=>eval(source)};</script></body>`));
 response.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');response.end(content);
});
(async()=>{let browser;try{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));browser=await chromium.launch({headless:true,channel:'msedge'});const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('http://127.0.0.1:'+server.address().port+'/');await page.waitForFunction(()=>window.projectileAfterImageTest?.run('!!dat&&!!stateIR&&!!battleDat&&!!lifecycleDat&&!!specialDat&&!!commonAnimationDat'),null,{timeout:90000});
 const run=source=>page.evaluate(source=>window.projectileAfterImageTest.run(source),source);await run("prepareCharacters(['SailorSaturn','SailorSaturn'])");
const count=await run(`(()=>{
  const data=characterProfiles.get('SailorSaturn').battle,saved=data.compatibility;let cases=0;
  const dispatch=(owner,type,params)=>executeControllerM1({type,params},owner.kind==='helper'?owner:owner.player===1?p1LifecycleBinding:p2,specialRuntime.context(owner),{owner,player:owner.player,schedulingApplied:true});
  const spawn=(owner,id)=>{specialRuntime.dispatch({type:'Projectile',params:{projid:String(id),projanim:'0',velocity:'0,0',projremovetime:'-1',supermovetime:'10','afterimage.time':'-1','afterimage.length':'8','afterimage.framegap':'1','afterimage.palbright':'0,0,0','afterimage.palcontrast':'256,256,256','afterimage.palmul':'1,1,1','afterimage.paladd':'0,0,0'}},null,null,{},owner,owner.player);return specialRuntime.entities.at(-1)};
  const capture=()=>{transDrawQueue.reset();drawSourceExplods();return transDrawQueue.ordered().filter(entry=>entry.kind==='native-afterimage')};
  try{for(const ikemen of [false,true])for(const player of [1,2])for(const helper of [false,true]){
   data.compatibility=ikemen?'ikemen':'mugen';specialRuntime.reset();sourceExplods.length=0;afterImages.fill(null);p1HitPause=0;p2.hitPause=p2.hitShake=p2.attackPause=0;let owner=specialRoot(player);
   if(helper){specialRuntime.dispatch({type:'Helper',params:{stateno:'0',id:'991984',ownprojectile:'1'}},owner,specialRuntime.context(owner),{},owner,player);owner=specialRuntime.entities.at(-1)}
   const first=spawn(owner,91),second=spawn(owner,91),other=spawn(specialRoot(3-player),91);other.invisible=true;if(specialRuntime.context(owner).numProj(91)!==2||specialRuntime.numProj(player,91)!==(helper?0:2))throw Error('Projectile owner counts included another actor');
   for(let tick=0;tick<3;tick++){combatTraceTick++;first.x=30*tick;second.x=-30*tick;capture()}
   const histories=[first.nativeAfterImage,second.nativeAfterImage];if(histories.some(state=>!state||state.reccount!==3)||histories[0]===histories[1])throw Error('Creation or actual projectile renderer missed independent histories');
   let entries=capture();if(!entries.length||entries.some(entry=>entry.actorId||entry.syncId))throw Error('Projectile histories missed real queue or inherited actor identity');
   const before=histories[0].timecount;first.hitPause=3;combatTraceTick++;capture();if(histories[0].timecount!==before)throw Error('Projectile ignorehitpause incorrectly recorded through contact pause');first.hitPause=0;combatTraceTick++;capture();if(histories[0].timecount!==before+1)throw Error('Projectile history did not resume');
   first.created=combatTraceTick-20;first.supermovetime=0;specialRuntime.pauses.super[2-player]={remaining:5,movetime:0,created:combatTraceTick-1,player:3-player};const pauseCount=histories[0].timecount;combatTraceTick++;capture();if(histories[0].timecount!==pauseCount)throw Error('SuperPause did not block projectile history');specialRuntime.pauses.super.fill(null);
   const vars=helper?owner.vars:player===1?runtimeVar:p2.vars;vars[19]=10;dispatch(owner,'ModifyProjectile',{id:'91','afterimage.time':'(var(19):=var(19)+1)','afterimage.length':'(var(19):=var(19)+1)'});
   if(helper){if(vars[19]!==10||histories.some(state=>state.time!==-1))throw Error('Native helper ModifyProjectile restriction lost');dispatch(specialRoot(player),'ModifyProjectile',{id:'91','afterimage.time':'99'});if(histories.some(state=>state.time!==-1))throw Error('Root modified helper-owned projectiles')}
   else{
    if(vars[19]!==14||first.nativeAfterImage!==histories[0]||second.nativeAfterImage!==histories[1]||histories[0].time!==11||histories[1].time!==12||histories[0].length!==13||histories[1].length!==14||histories[0].imgs.length!==13+Number(ikemen))throw Error('Real ModifyProjectile deferred RHS/setup/history preservation failed');
    if(other.nativeAfterImage.time!==-1)throw Error('Modified opposite-player projectile');
    dispatch(owner,'ModifyProjectile',{id:'91',index:'1',projid:'92','afterimage.palbright':'7'});if(first.id!==91||second.id!==92||second.projectileId!==92||histories[1].base.add[0]!==7||histories[0].base.add[0]!==0)throw Error('ID-filtered index or rename targeted wrong projectile');
    dispatch(specialRoot(3-player),'ModifyProjectile',{redirectid:String(player),id:'92','afterimage.time':'-1'});if(histories[1].time!==-1)throw Error('Redirected recipient selection failed');
    first.removing=true;vars[19]=0;dispatch(owner,'ModifyProjectile',{id:'91','afterimage.time':'(var(19):=99)'});if(vars[19]!==0)throw Error('Inactive projectile evaluated modifiers');
   }
   if(helper){const parent=specialRoot(player);specialRuntime.dispatch({type:'Helper',params:{stateno:'0',id:'991985',ownprojectile:'0'}},parent,specialRuntime.context(parent),{},parent,player);const defaultHelper=specialRuntime.entities.at(-1),delegated=spawn(defaultHelper,93);if(delegated.projectileOwnerId!==player||delegated.projectileOwnerActor!==null)throw Error('Ordinary Helper projectile did not belong to root');dispatch(parent,'ModifyProjectile',{id:'93','afterimage.time':'23'});if(delegated.nativeAfterImage.time!==23)throw Error('Root could not modify default Helper-created projectile')}
   cases++;
  }return cases}finally{data.compatibility=saved;specialRuntime.reset();afterImages.fill(null);sourceExplods.length=0}
 })()`);assert.equal(count,8);assert.deepEqual(errors,[]);console.log('Projectile AfterImage passes 8 version/player/root-helper creation, real-render, pause, modification, redirect, ownership and history combinations');
}finally{await browser?.close();server.close()}})().catch(error=>{console.error(error);process.exitCode=1});
