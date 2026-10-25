const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/jeffy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..'),vendor=path.resolve(root,'../outputs/three-r180');
const server=http.createServer((request,response)=>{
 const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname),base=pathname.startsWith('/vendor/')?vendor:root,file=path.resolve(base,pathname.startsWith('/vendor/')?pathname.slice(8):'.'+(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(base+path.sep)||!fs.existsSync(file)){response.writeHead(404);response.end();return}
 let content=fs.readFileSync(file);if(file===path.join(root,'index.html'))content=Buffer.from(content.toString().replaceAll('https://cdn.jsdelivr.net/npm/three@0.180.0/','/vendor/').replaceAll('requestAnimationFrame(loop);','').replace('</script></body>',`window.helperStandbyTest={run:source=>eval(source)};</script></body>`));
 response.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');response.end(content);
});
(async()=>{let browser;try{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));browser=await chromium.launch({headless:true,channel:'msedge'});const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('http://127.0.0.1:'+server.address().port+'/');await page.waitForFunction(()=>window.helperStandbyTest?.run('!!dat&&!!stateIR&&!!battleDat&&!!lifecycleDat&&!!specialDat&&!!commonAnimationDat'),null,{timeout:90000});
 const run=source=>page.evaluate(source=>window.helperStandbyTest.run(source),source);await run("prepareCharacters(['SailorSaturn','SailorSaturn'])");

const result=await run(`(()=>{
 const data=profileFor(1).battle,number=991995;
 data.helperStates[number]={type:'S',physics:'N',moveType:'I',anim:'0',ctrl:'1',controllers:[{type:'VarAdd',params:{v:'5',value:'1'},triggers:{1:['1']},triggerall:[]}]};
 data.collision={...data.collision,0:[{c1:[[-300,-800,300,100]],c2:[[-300,-800,300,100]]}]};
 roundFlow.enabled=()=>false;lifecycleRuntime.rounds.state=2;let cases=0;
 for(const compatibility of ['mugen','ikemen'])for(const player of [1,2])for(const helpertype of ['normal','player','projectile'])for(const flag of [undefined,'0','1','-1']){
  specialRuntime.reset();sourceExplods.length=0;resetPlayerInput();actorKoFlags.clear();actorOverKoFlags.clear();hitPhaseStatus.clear();actorUnhittableTime.clear();p1Reaction=null;p1HitPause=0;p2.hitShake=p2.attackPause=0;posX=p2.x=0;posY=p2.y=0;p1Life=p2.life=1000;enterIRState(0);enterP2State(0);data.compatibility=compatibility;
  const owner=specialRoot(player),params={stateno:String(number),helpertype,id:'80'};if(flag!==undefined)params.standby=flag;
  specialRuntime.dispatch({type:'Helper',params},owner,specialRuntime.context(owner),{},owner,player);const actor=specialRuntime.entities.at(-1),expected=flag==='1'||flag==='-1';actor.x=0;actor.y=0;actor.vx=2;
  if(actor.standby!==expected||evalM1('Standby',specialRuntime.context(actor))!==expected||Number(evalM1('Ctrl',specialRuntime.context(actor)))!==(expected?0:1)||actor.ctrl!==1)throw Error('Standby scalar/control mismatch');
  const before=actor.time;combatTraceTick++;specialRuntime.step();if(actor.time<=before||actor.vars[5]!==1||actor.x!==2)throw Error('Standby froze state or movement '+JSON.stringify([compatibility,player,helpertype,flag,before,actor.time,actor.vars[5],actor.x,actor.destroyed,actor.state,specialRuntime.pauses]));
const enemy=specialRoot(3-player),definition=specialRuntime.numeric({attr:'S,NA',damage:'10,0',pausetime:'0,0','ground.velocity':'0,0'},specialRuntime.context(actor)),frame={...actor,hitDef:{params:definition,hitKey:'standby-helper'}},rootFrame={...enemy,hitDef:{params:specialRuntime.numeric({attr:'S,NA',damage:'10,0',pausetime:'0,0','ground.velocity':'0,0'},specialRuntime.context(enemy)),hitKey:'standby-root'}};
  if(resolveFighterCollisionM1(frame,enemy).contact===expected||resolveFighterCollisionM1(rootFrame,actor).contact===expected)throw Error('Standby attack/recipient collision gate mismatch '+JSON.stringify([compatibility,player,helpertype,flag,resolveFighterCollisionM1(frame,enemy),resolveFighterCollisionM1(rootFrame,actor),frame.anim,enemy.anim,actor.elem]));
  if(nativeContactPhaseAllowedM1(actor,enemy,definition)===expected||nativeContactPhaseAllowedM1(enemy,actor,definition)===expected)throw Error('Direct contact gate mismatch');
  actor.playerPushState=createPlayerPushState(true);if(canPlayerPushM1(actor)===expected)throw Error('Standby push gate mismatch');
  if(expected&&applyEntityHit(actor,enemy,definition)!==null)throw Error('Standby direct hit accepted');
  actor.moveType='A';actor.guardHitDef={guardDistance:{x:[300,300],y:[300,300],z:[300,300]}};if(inGuardDistanceM1(enemy)===expected)throw Error('Standby proximity guard source mismatch');if(expected&&inGuardDistanceM1(actor))throw Error('Standby recipient entered guard distance');
  cases++;
 }
 specialRuntime.reset();const owner=specialRoot(1);specialRuntime.dispatch({type:'Helper',params:{stateno:String(number),helpertype:'player',standby:'1'}},owner,specialRuntime.context(owner),{},owner,1);const actor=specialRuntime.entities.at(-1);actor.x=2500;actor.y=0;posX=-100;p2.x=100;posY=p2.y=0;resetCamera();updateCamera();const idleCamera=cameraX;
actor.standby=false;updateCamera();if(cameraX===idleCamera)throw Error('Active Helper camera did not track');actor.standby=true;actor.x=2500;resetCamera();clampFighterScreenM1();if(actor.x!==2500)throw Error('Standby still screen-clamped');actor.x=9999;clampFighterScreenM1();if(actor.x!==STAGE_PLAYER.rightbound)throw Error('Standby lost stage bound');
 return {cases,cameraAndBounds:true};
})()`);assert.deepEqual(result,{cases:48,cameraAndBounds:true});assert.deepEqual(errors,[]);console.log('Helper standby passes 48 version/player/type/flag control, live CNS/movement, attack/recipient collision/contact/push cases and camera/screen-vs-stage bounds');
}finally{await browser?.close();server.close()}})().catch(error=>{console.error(error);process.exitCode=1});
