const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const assert=require('node:assert/strict');
const {chromium}=require('C:/Users/jeffy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
let browser;
const server=http.createServer((request,response)=>{
 const filename=new URL(request.url,'http://localhost').pathname.slice(1)||'index.html';
 if(filename.includes('..')){response.writeHead(400);response.end();return}
 const file=path.join('work',filename);
 if(!fs.existsSync(file)){response.writeHead(404);response.end();return}
 let content=fs.readFileSync(file);
 if(filename==='index.html')content=Buffer.from(content.toString().replaceAll('requestAnimationFrame(loop);','').replace('</script></body>',"window.specialTest={run:source=>eval(source)};</script></body>"));
 response.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.json':'application/json','.png':'image/png'})[path.extname(filename)]||'application/octet-stream');response.end(content);
});
(async()=>{
 await new Promise(resolve=>server.listen(8766,'127.0.0.1',resolve));
 browser=await chromium.launch({headless:true,channel:'msedge'});
 const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto('http://127.0.0.1:8766');
 await page.waitForFunction(()=>window.specialTest?.run('!!specialDat&&!!battleDat&&!!dat&&!!turnDat&&!!guardDat&&!!fallDat&&!!airDat'),null,{timeout:90000});
 const run=source=>page.evaluate(source=>window.specialTest.run(source),source);
 if(process.argv.includes('--preview')){await run("p1Life=250;posX=-200;p2.x=200;enterIRState(3000);for(let tick=0;tick<50;tick++)simStep();updateCamera();updateDebugHud();r.render(s,c);draw();drawMars();drawSourceExplods()");await page.screenshot({path:'work/specials-preview-02334.png',timeout:60000});return}
 const results=await run(`(()=>{
  const results=[];
  for(const player of [1,2])for(const facing of [-1,1])for(const attack of [1200,1000,1100,3000])for(const distance of [100,400]){
   resetPlayerInput();specialRuntime.reset();sourceExplods.length=0;p1Reaction=null;p1HitPause=0;p1Life=1000;p2.life=1000;p2.hitShake=0;p2.attackPause=0;p2.getHit=null;cornerPushVelocity=0;p2.cornerPushVelocity=0;posX=-200;p2.x=200;posY=0;p2.y=0;vx=0;vy=0;p2.vx=0;p2.vy=0;p1Facing=1;p2.facing=-1;cameraX=0;runtimeVar.fill(0);p2.vars?.fill(0);setP2ControlMode(player===2?'keyboard':'dummy');enterIRState(player===1?attack:0);enterP2State(player===2?attack:0);
   p1Facing=facing;p2.facing=-facing;p2.x=posX+distance*facing;let projectiles=0,helpers=0,effects=0,pause=0;
   for(let tick=0;tick<500;tick++){simStep();projectiles=Math.max(projectiles,specialRuntime.entities.filter(entity=>entity.kind==='projectile').length);helpers=Math.max(helpers,specialRuntime.entities.filter(entity=>entity.kind==='helper').length);effects=Math.max(effects,sourceExplods.length);if(specialRuntime.pauses.normal)pause++;if([5,20,100,290,499].includes(tick)){draw();drawMars();drawSourceExplods()}}
   const result={player,facing,attack,distance,state:player===1?state:p2.state,damage:1000-(player===1?p2.life:p1Life),projectiles,helpers,effects,pause};
   if([attack,3005].includes(result.state))throw Error('Special never returned '+JSON.stringify(result));
   if(attack===1000||attack===1100){if(projectiles!==1)throw Error('Missing projectile '+JSON.stringify(result))}
   if(attack===3000&&(!helpers||pause<290))throw Error('Missing super/helper '+JSON.stringify(result));
   if(distance===100&&attack!==1100&&result.damage===0)throw Error('Missing close hit '+JSON.stringify(result));
   results.push(result);
  }
  return results;
 })()`);
 console.log(JSON.stringify(results));
 const semantics=await run(`(()=>{
  specialRuntime.reset();sourceExplods.length=0;let checks=0;
  const expect=(condition,label)=>{if(!condition)throw Error(label);checks++};
  const roots=[specialRoot(1),specialRoot(2)];
  for(const fighter of roots){fighter.vars.fill(0);fighter.life=250;fighter.lifeMax=1000;fighter.ctrl=1;fighter.type='S';fighter.moveType='I';fighter.state=0;fighter.vars[16]=41;
   for(const [target,name] of [[1000,'SNES_NRML_Beam_l'],[1100,'SNES_NRML_Sword_l'],[1200,'SNES_NRML_Chain_l'],[3000,'S_SNES_NRML_ChainExplosive']]){
    const controller=battleDat.playerCommands.find(item=>Number(item.params.value)===target),context=fighterExpressionContext(fighter,{state:0,type:'S'},{[name]:true});
    expect(controllerTriggered(controller,context),'Source command '+target);fighter.type='A';expect(!controllerTriggered(controller,context),'No airborne special '+target);fighter.type='S';
    if(target===1100){fighter.vars[16]=40;expect(!controllerTriggered(controller,context),'Sword charge threshold');fighter.vars[16]=41}
    if(target===3000){fighter.life=251;expect(!controllerTriggered(controller,context),'Super HP threshold');fighter.life=250}
   }
  }
  const contradiction=battleDat.attackStates['3005'].controllers.find(item=>item.type==='HitDef');expect(!controllerTriggered(contradiction,fighterExpressionContext(roots[0],roots[1])),'S3005 source contradictory HitDef preserved');
  for(const target of [1000,1100,1200]){
   const controller=battleDat.attackStates[String(target)].controllers.find(item=>item.type===(target===1200?'HitDef':'Projectile')),context=fighterExpressionContext(roots[0],roots[1]);
   for(const variant of [0,1]){roots[0].vars[2]=variant;const params=specialRuntime.numeric(controller.params,context),defender={...roots[1],y:0,life:1000};
    const hit=resolveGroundHitM1({id:1,facing:1},defender,params,'stand');expect(hit.guarded,'Ground guard '+target);expect(hit.getHit.animtype===(target===1200?1:2),'Source reaction type '+target);
    defender.type='A';defender.y=-100;expect(!resolveGroundHitM1({id:1,facing:1},defender,params,'stand').guarded,'NoAirGuard '+target);
   }
  }
  expect(specialRuntime.entities.length===0,'Reset clears runner');
  p1Reaction=null;p1HitPause=0;posX=-1000;p2.x=1000;p1Facing=1;p2.facing=-1;p1Life=1000;p2.life=1000;
  const projectile=battleDat.attackStates['1000'].controllers.find(item=>item.type==='Projectile');
  specialRuntime.dispatch(projectile,{},null,{},specialRoot(1),1);
  const expired=specialRuntime.entities[0];Object.assign(expired,{x:5000,time:1000,elem:2,elemTick:0,created:-1});specialRuntime.step();
  expect(expired.removing&&specialRuntime.numProj(1,1050)===1,'Default removal retains current animation and NumProjID');
  for(let tick=0;tick<50;tick++)specialRuntime.step();expect(specialRuntime.numProj(1,1050)===0,'Removal animation finishes');
  for(const player of [1,2])specialRuntime.dispatch(projectile,{},null,{},specialRoot(player),player);
  for(const entity of specialRuntime.entities)Object.assign(entity,{x:entity.player===1?0:180,vx:0,elem:2,elemTick:0,time:1,created:-1});specialRuntime.step();
  expect(specialRuntime.entities.length===2&&specialRuntime.entities.every(entity=>entity.removing),'Equal source priorities cancel without deleting animation early');
  for(let tick=0;tick<50;tick++)specialRuntime.step();expect(specialRuntime.entities.length===0,'Cancelled projectiles finish');return checks;
 })()`);console.log(JSON.stringify({specialSemantics:semantics}));assert.deepEqual(errors,[]);
})().catch(error=>{console.error(error);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.close()});
