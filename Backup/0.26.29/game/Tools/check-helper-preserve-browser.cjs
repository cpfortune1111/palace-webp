const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/jeffy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..'),vendor=path.resolve(root,'../outputs/three-r180');
const server=http.createServer((request,response)=>{
 const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname),base=pathname.startsWith('/vendor/')?vendor:root,file=path.resolve(base,pathname.startsWith('/vendor/')?pathname.slice(8):'.'+(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(base+path.sep)||!fs.existsSync(file)){response.writeHead(404);response.end();return}
 let content=fs.readFileSync(file);if(file===path.join(root,'index.html'))content=Buffer.from(content.toString().replaceAll('https://cdn.jsdelivr.net/npm/three@0.180.0/','/vendor/').replaceAll('requestAnimationFrame(loop);','').replace('</script></body>',`window.helperPreserveTest={run:source=>eval(source)};</script></body>`));
 response.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');response.end(content);
});
(async()=>{let browser;try{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));browser=await chromium.launch({headless:true,channel:'msedge'});const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('http://127.0.0.1:'+server.address().port+'/');await page.waitForFunction(()=>window.helperPreserveTest?.run('!!dat&&!!stateIR&&!!battleDat&&!!lifecycleDat&&!!specialDat&&!!commonAnimationDat'),null,{timeout:90000});
 const run=source=>page.evaluate(source=>window.helperPreserveTest.run(source),source);await run("prepareCharacters(['SailorSaturn','SailorSaturn'])");

const result=await run(`(()=>{
 const data=profileFor(1).battle,number=991996;
 data.helperStates[number]={type:'S',physics:'N',moveType:'I',anim:'0',ctrl:'0',controllers:[{type:'VarAdd',params:{v:'5',value:'1'},triggers:{1:['1']},triggerall:[]}]};
 Object.assign(roundConfig,{startWait:0,controlWait:0,overWait:0,winTime:0,overTime:1,matchWins:2});
 roundFlow.begin('vs','99');
 const spawn=(player,preserve)=>{const owner=specialRoot(player);specialRuntime.dispatch({type:'Helper',params:{stateno:String(number),id:'88',preserve:String(preserve)}},owner,specialRuntime.context(owner),{},owner,player);return specialRuntime.entities.at(-1)};
 const kept=spawn(1,1),ordinary=spawn(1,0),second=spawn(2,-1),identity=kept.instanceId;kept.parentKey=ordinary.key;kept.vars[4]=77;kept.life=321;kept.time=17;kept.vx=2;kept.elemTick=2;kept.animStartTime=3;
 let ticks=0;
 while(roundFlow.snapshot().phase!=='fight'&&ticks++<1000){enterIRState(0);enterP2State(0);roundAnnouncerUntil=roundVoiceUntil=0;roundFlow.step();combatTraceTick++}
 if(roundFlow.snapshot().phase!=='fight')throw Error('No actual fight phase');
 p2.life=900;roundFlow.finish('time');
const historyParams=specialRuntime.numeric({attr:'S,NA',damage:'1,0',pausetime:'0,0','ground.velocity':'0,0'},specialRuntime.context(kept));kept.activeHitDef={params:historyParams,hitKey:kept.key};resolveGroundHitM1({...kept,id:kept.player},specialRoot(2),historyParams,'none');hitDefinitionTargets.commitActor(hitDefinitionOwnerKey(kept),combatTraceTick+1);hitDefinitionTargets.record(historyParams,hitDefinitionOwnerKey(kept),1,combatTraceTick);recordCombatTarget(kept,2,historyParams);hitDefinitionTargets.record(historyParams,'root1',2,combatTraceTick);hitDefinitionTargets.record(historyParams,hitDefinitionOwnerKey(ordinary),2,combatTraceTick);
const keptKey=hitDefinitionOwnerKey(kept),goneKey=hitDefinitionOwnerKey(ordinary);for(const key of [keptKey,goneKey,'root1']){actorKoFlags.set(key,key!=='root1');actorOverKoFlags.set(key,key!=='root1');actorP2EnemyBackups.set(key,2);nativeJuggle.set(key,7);nativeHitStates.sample(key,combatTraceTick,{moveType:'H',fall:true});actorUnhittableTime.set(key,23,combatTraceTick);nativeHitCounters.actor(key).receivedHits=4;moveHitDataStore.set(key,{id:321});moveCounteredFlags.set(key,true)}
 while(lifecycleRuntime.rounds.existed===0&&ticks++<2000){if(['result','resultBuffer'].includes(roundFlow.snapshot().phase)){enterIRState(0);enterP2State(0)}roundAnnouncerUntil=roundVoiceUntil=0;roundNotOverUntil.fill(0);roundFlow.step();combatTraceTick++}
 if(lifecycleRuntime.rounds.existed!==1)throw Error('No next-round reset');
 if(!specialRuntime.entities.includes(kept)||!specialRuntime.entities.includes(second)||specialRuntime.entities.includes(ordinary))throw Error('Wrong next-round Helper population');
 if(kept.instanceId!==identity||kept.vars[4]!==77||kept.life!==321||kept.time!==17||kept.vx!==2||kept.elemTick!==2||kept.animStartTime!==3)throw Error('Preserved Helper state replaced');
 if(findParentActor(kept,specialRuntime.entities,specialRoot)!==null)throw Error('Removed parent silently replaced with root');
 if(actorAlive(kept)!==false||!actorOverKoFlags.get(keptKey)||nativeJuggle.cost(keptKey)!==7||nativeHitStates.value(keptKey)!==2||actorUnhittableTime.remaining(keptKey)!==23||nativeHitCounters.actor(keptKey).receivedHits!==4||moveHitDataStore.get(keptKey)?.id!==321||!moveCounteredFlags.get(keptKey))throw Error('Preserved Helper combat registry reset');
 if(actorKoFlags.has(goneKey)||actorKoFlags.has('root1')||nativeJuggle.cost(goneKey)!==0||nativeHitStates.value(goneKey)!==0||actorUnhittableTime.remaining(goneKey)!==0||moveHitDataStore.has(goneKey))throw Error('Deleted/root registry retained');
if(!hitDefinitionTargets.has(historyParams,keptKey,2)||!hitDefinitionTargets.queued(historyParams,keptKey,1)||getMoveHitValueM1(kept,'uniqhit')!==1||combatTargetList(kept).count()!==0)throw Error('HitDef history was conflated with cleared Target bindings '+JSON.stringify([hitDefinitionTargets.has(historyParams,keptKey,2),hitDefinitionTargets.queued(historyParams,keptKey,1),getMoveHitValueM1(kept,'uniqhit'),combatTargetList(kept).count()]));
 if(hitDefinitionTargets.queued(historyParams,'root1',2)||hitDefinitionTargets.queued(historyParams,goneKey,2))throw Error('Removed/root HitDef history retained');
 hitDefinitionTargets.commitActor(keptKey,combatTraceTick+1);if(!hitDefinitionTargets.has(historyParams,keptKey,1)||getMoveHitValueM1(kept,'uniqhit')!==2)throw Error('Retained HitDef buffer failed to commit');
 actorKoFlags.delete(keptKey);actorOverKoFlags.delete(keptKey);const before=kept.vars[5];specialRuntime.step();if(kept.vars[5]!==before+1)throw Error('Preserved Helper does not execute');
 const continued=kept.time>17;
 roundFlow.begin('vs','99');
 if(specialRuntime.entities.length||!kept.destroyed||!second.destroyed||actorKoFlags.size||nativeJuggle.cost(keptKey)||nativeHitStates.value(keptKey)||actorUnhittableTime.remaining(keptKey)||moveHitDataStore.has(keptKey))throw Error('New match retained Helpers or registry data');
 if(hitDefinitionTargets.has(historyParams,keptKey,2)||hitDefinitionTargets.queued(historyParams,keptKey,1))throw Error('New match retained HitDef history');
 return {nextRound:true,continued,newMatchCleared:true};
})()`);assert.deepEqual(result,{nextRound:true,continued:true,newMatchCleared:true});assert.deepEqual(errors,[]);console.log('Actual round flow preserves flagged P1/P2 Helpers through round two, continues CNS execution and force-clears at new match');
}finally{await browser?.close();server.close()}})().catch(error=>{console.error(error);process.exitCode=1});
