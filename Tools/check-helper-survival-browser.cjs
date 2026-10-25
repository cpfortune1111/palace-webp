const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/jeffy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..'),vendor=path.resolve(root,'../outputs/three-r180');
const server=http.createServer((request,response)=>{
 const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname),base=pathname.startsWith('/vendor/')?vendor:root,file=path.resolve(base,pathname.startsWith('/vendor/')?pathname.slice(8):'.'+(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(base+path.sep)||!fs.existsSync(file)){response.writeHead(404);response.end();return}
 let content=fs.readFileSync(file);if(file===path.join(root,'index.html'))content=Buffer.from(content.toString().replaceAll('https://cdn.jsdelivr.net/npm/three@0.180.0/','/vendor/').replaceAll('requestAnimationFrame(loop);','').replace('</script></body>',`window.helperSurvivalTest={run:source=>eval(source)};</script></body>`));
 response.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');response.end(content);
});
(async()=>{let browser;try{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));browser=await chromium.launch({headless:true,channel:'msedge'});const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('http://127.0.0.1:'+server.address().port+'/');await page.waitForFunction(()=>window.helperSurvivalTest?.run('!!dat&&!!stateIR&&!!battleDat&&!!lifecycleDat&&!!specialDat&&!!commonAnimationDat'),null,{timeout:90000});
 const run=source=>page.evaluate(source=>window.helperSurvivalTest.run(source),source);await run("prepareCharacters(['SailorSaturn','SailorSaturn'])");
const result=await run(`(()=>{
  const data=profileFor(1).battle,numbers=[991997,991998],saved={profile:combatEngineProfile,compatibility:data.compatibility,collision:data.collision,ko:data.koProfile,definitions:numbers.map(number=>data.helperStates[number]),enabled:roundFlow.enabled,noDamage:roundFlow.noDamage,red:combatResourceFeatures.redLife};let lifeCases=0,koCases=0;
  const dispatch=(actor,type,params)=>executeControllerM1({type,params},actor.kind==='helper'?actor:actor.player===1?p1LifecycleBinding:p2,specialRuntime.context(actor),{owner:actor,player:actor.player,schedulingApplied:true});
  const reset=()=>{specialRuntime.reset();sourceExplods.length=0;combatTargets.clear();resetPlayerInput();p1Reaction=null;p1HitPause=0;p1Life=p2.life=1000;p2.hitShake=p2.hitPause=p2.attackPause=0;posX=-1000;posY=0;p2.x=1000;p2.y=0;roundFlow.enabled=()=>false;roundFlow.noDamage=()=>false;customStateOwners.fill(null);customAnimationOwners.fill(null);enterIRState(0);enterP2State(0);actorUnhittableTime.clear();document.querySelector('#p2Guard').value='none';p2ControlMode='dummy'};
  const spawn=(player,type,immortal,extra={})=>{const owner=specialRoot(player);specialRuntime.dispatch({type:'Helper',params:{stateno:String(numbers[0]),helpertype:type,id:'80',immortal:String(immortal),...extra}},owner,specialRuntime.context(owner),{},owner,player);const actor=specialRuntime.entities.at(-1);actor.x=20;dispatch(actor,'LifeSet',{value:'100'});return actor};
  try{
   data.helperStates[numbers[0]]={type:'S',physics:'N',moveType:'I',anim:'0',ctrl:'0',controllers:[]};data.helperStates[numbers[1]]={type:'A',physics:'N',moveType:'I',anim:'0',ctrl:'0',controllers:[]};data.collision={...data.collision,0:[{c1:[[-300,-800,300,100]],c2:[[-300,-800,300,100]]}]};
   data.koProfile={enabled:true,groundXMultiplier:2,groundAdd:[2,-5],groundYMinimum:-3,airAdd:[1,-4],airYMinimum:-6};
   for(const ikemen of [false,true])for(const player of [1,2])for(const type of ['normal','player','projectile'])for(const immortal of [0,1])for(const mode of ['set','add','target','hit']){
    reset();data.compatibility=ikemen?'ikemen':'mugen';combatEngineProfile=ikemen?'ikemen':'mugen11';const actor=spawn(player,type,immortal),expected=immortal&&type!=='player'?1:0,source=specialRoot(3-player);
    if(mode==='set')dispatch(actor,'LifeSet',{value:'0'});
    else if(mode==='add')dispatch(actor,'LifeAdd',{value:'-2000',absolute:'1'});
    else if(mode==='target'){combatTargetList(source).add(actor.instanceId);dispatch(source,'TargetLifeAdd',{value:'-2000',absolute:'1',redlife:'0',dizzy:'0'})}
    else{
     specialRuntime.dispatch({type:'Projectile',params:{projid:'96',projanim:'0',projhits:'1',projhitanim:'0',velocity:'0,0',attr:'S,SP',hitflag:'MAFD',damage:'2000,0',pausetime:'0,0','ground.hittime':'0','ground.velocity':'8,0'}},null,null,{},source,3-player);const shot=specialRuntime.entities.at(-1);shot.x=20;shot.created=combatTraceTick-1;specialRuntime.step();if(!actor.getHit)throw Error('Helper did not receive actual hit');if(ikemen)consumeNativeHitResources(actor);
    }
    if(actor.life!==expected)throw Error('Helper immortal life invariant failed '+JSON.stringify({ikemen,player,type,immortal,mode,life:actor.life,expected,getHit:actor.getHit}));
    if(mode==='hit'&&immortal&&type!=='player'&&!actor.getHit.fall)throw Error('Immortal incorrectly suppressed lethal hit fall reaction');lifeCases++;
   }
   for(const ikemen of [false,true])for(const player of [1,2])for(const flag of [null,0,1])for(const aerial of [false,true])for(const asserted of [false,true]){
    reset();data.compatibility=ikemen?'ikemen':'mugen';combatEngineProfile=ikemen?'ikemen':'mugen11';const extra=flag===null?{}:{kovelocity:String(flag)},actor=spawn(player,'normal',0,extra);if(aerial){actor.type='A';actor.state=numbers[1]}if(asserted)dispatch(actor,'AssertSpecial',{flag:'nokovelocity'});const source=specialRoot(3-player),context=specialRuntime.context(source),params=specialRuntime.numeric({attr:'S,NA',damage:'2000,0',pausetime:'0,0','ground.velocity':'8,0','air.velocity':'6,-2'},context),packet=resolveGroundHitM1({...source,id:3-player},actor,params,'none'),enabled=flag===1&&!asserted,expectedX=(aerial?(enabled?-5:-6):(enabled?-14:-8))*source.facing,expectedY=aerial?(enabled?-6:-2):(enabled?-5:0);
    if(packet.getHit.xvel!==expectedX||packet.getHit.yvel!==expectedY)throw Error('Helper KO velocity flag failed '+JSON.stringify({ikemen,player,flag,aerial,asserted,actual:[packet.getHit.xvel,packet.getHit.yvel],expected:[expectedX,expectedY]}));koCases++;
   }
   reset();const actor=spawn(1,'normal',1);roundFlow.noDamage=()=>true;dispatch(actor,'LifeSet',{value:'0'});if(actor.life!==100)throw Error('No-damage phase ignored');roundFlow.noDamage=()=>false;combatResourceFeatures.redLife=false;dispatch(actor,'LifeSet',{value:'0'});if(actor.life!==1||actor.redLife!==1)throw Error('Disabled red-life sync ignored immortal minimum');
   reset();const neutral=spawn(1,'player',1);dispatch(neutral,'ModifyPlayer',{teamside:'0'});dispatch(neutral,'LifeSet',{value:'0'});if(neutral.life!==1)throw Error('Neutral player-helper immortal exception lost');
   return {lifeCases,koCases};
  }finally{combatEngineProfile=saved.profile;data.compatibility=saved.compatibility;data.collision=saved.collision;data.koProfile=saved.ko;roundFlow.enabled=saved.enabled;roundFlow.noDamage=saved.noDamage;combatResourceFeatures.redLife=saved.red;for(let index=0;index<numbers.length;index++){if(saved.definitions[index]===undefined)delete data.helperStates[numbers[index]];else data.helperStates[numbers[index]]=saved.definitions[index]}specialRuntime.reset();sourceExplods.length=0}
 })()`);assert.deepEqual(result,{lifeCases:96,koCases:48});assert.deepEqual(errors,[]);console.log('Helper survival passes 96 real controller/target/hit life cases, 48 KO-velocity cases and no-damage/red-life/neutral-player-helper checks');
}finally{await browser?.close();server.close()}})().catch(error=>{console.error(error);process.exitCode=1});
