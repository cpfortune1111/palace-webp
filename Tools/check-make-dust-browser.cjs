const assert=require('node:assert/strict');
const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const {chromium}=require('C:/Users/jeffy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..'),vendor=path.resolve(root,'../outputs/three-r180');
const server=http.createServer((request,response)=>{
 const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname),base=pathname.startsWith('/vendor/')?vendor:root,file=path.resolve(base,pathname.startsWith('/vendor/')?pathname.slice(8):'.'+(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(base+path.sep)||!fs.existsSync(file)){response.writeHead(404);response.end();return}
 let content=fs.readFileSync(file);if(file===path.join(root,'index.html'))content=Buffer.from(content.toString().replaceAll('https://cdn.jsdelivr.net/npm/three@0.180.0/','/vendor/').replaceAll('requestAnimationFrame(loop);','').replace('</script></body>',`window.dustTest={run:source=>eval(source)};</script></body>`));
 response.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');response.end(content);
});
(async()=>{
 let browser;
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});browser=await chromium.launch({headless:true,channel:'msedge'});const page=await browser.newPage({viewport:{width:1280,height:720}});
  await page.goto('http://127.0.0.1:'+server.address().port+'/');await page.waitForFunction(()=>window.dustTest?.run('!!dat&&!!stateIR&&!!battleDat&&!!lifecycleDat&&!!specialDat&&!!roundCharDat&&!!cmdDat&&!!airDat&&!!fallDat&&!!guardDat&&!!turnDat'),null,{timeout:90000});
  const run=source=>page.evaluate(source=>window.dustTest.run(source),source);await run("prepareCharacters(['SailorSaturn','SailorSaturn'])");
  const rows=await run(`(()=>{
   const rows=[],saved={profile:combatEngineProfile,offsets:rootDrawOffsets.map(offset=>[...offset]),camera:[cameraX,cameraY,cameraZoom],config:{...STAGE_CAMERA},player:{...stageCameraConfig.player}};
   try{for(const profile of ['mugen11','ikemen'])for(const player of [1,2])for(const kind of ['root','helper'])for(const redirected of [false,true]){
    specialRuntime.reset();sourceExplods.length=0;combatEngineProfile=profile;p1HitPause=0;p2.attackPause=0;p2.hitShake=0;
    const root=specialRoot(player),data=characterProfiles.get(battleCharacters[player-1]).battle;let target=root;
    if(kind==='helper'){data.helperStates[991888]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[]};specialRuntime.dispatch({type:'Helper',params:{stateno:991888,id:991888}},root,specialRuntime.context(root),{},root,player);target=specialRuntime.entities.at(-1);target.x+=80;target.y=-10;target.drawOffset=[7,9]}
    else rootDrawOffsets[player-1]=[7,9];
    const caller=redirected?specialRoot(3-player):target,context=specialRuntime.context(caller),adapter={owner:caller,player:fighterPlayer(caller),schedulingApplied:true},state=makeDustStateFor(target);
    caller.vars[7]=11;if(redirected)target.vars[7]=99;state.elapsed=3;
    const params={spacing:'3',pos:'Var(7),20,30',pos2:'50,60,70',...(redirected?{redirectid:String(kind==='helper'?target.instanceId:player)}:{})};
    executeControllerM1({type:'MakeDust',params},caller,context,adapter);
    if(sourceExplods.length!==1)throw Error('Native shared spacing should emit only first position');const effect=sourceExplods[0],unit=collisionWorldRatio(gravityActorData(target));
    const offset=kind==='helper'?offsetDrawingPosition([0,0],target.drawOffset,target.localScale??1):rootDrawOffsets[player-1];
    const expected=[Math.fround(Math.fround(target.x+Math.fround(11*unit*target.facing))+offset[0]),Math.fround(Math.fround(target.y+Math.fround(20*unit))+offset[1]),Math.fround(Number(target.z??0)+Math.fround(30*unit))];
    if(JSON.stringify([effect.x,effect.y,effect.z])!==JSON.stringify(expected)||effect.anim!==120||effect.sprpriority!==2147483647||effect.layerno!==actorSpriteLayer(target))throw Error('Actual dust coordinate/priority/layer mismatch');
    transDrawQueue.reset();drawSourceExplods();let entry=transDrawQueue.ordered().find(entry=>entry.kind==='dust');if(!entry||entry.source.width!==commonDustDat.sprites['120,0'].w)throw Error('Dust renderer did not use common F120');
    if(!entry.source.getContext('2d').getImageData(0,0,entry.source.width,entry.source.height).data.some((value,index)=>index%4===3&&value>0))throw Error('Dust source has no visible pixels');
    effect.age=3;transDrawQueue.reset();drawSourceExplods();entry=transDrawQueue.ordered().find(entry=>entry.kind==='dust');if(entry.source.width!==commonDustDat.sprites['120,1'].w)throw Error('Common dust sampled character animation 120 instead of AIR timing');
    effect.age=25;p1HitPause=2;p2.attackPause=2;stepSourceExplods();if(effect.age!==26)throw Error('Native MakeDust default ignorehitpause was lost');p1HitPause=0;p2.attackPause=0;stepSourceExplods();if(sourceExplods.length!==0)throw Error('Dust did not expire after 27 native AIR ticks');
    state.elapsed=3;const assertion={owner:target,player,schedulingApplied:true};executeControllerM1({type:'AssertSpecial',params:{flag:'NoMakeDust'}},target,specialRuntime.context(target),assertion);executeControllerM1({type:'MakeDust',params:{}},target,specialRuntime.context(target),assertion);if(sourceExplods.length||state.elapsed!==3)throw Error('NoMakeDust failed to preserve emission counter');executeControllerM1({type:'AssertSpecial',params:{flag:'NoMakeDust',enabled:'0'}},target,specialRuntime.context(target),assertion);
    state.elapsed=0;state.lastTick=-1;specialRuntime.finishTick();if(state.elapsed!==1)throw Error('Actual actor finish clock did not advance dust');specialRuntime.finishTick();if(state.elapsed!==1)throw Error('Dust clock advanced twice in same tick');combatTraceTick++;if(kind==='helper')target.hitPause=2;else if(player===1)p1HitPause=2;else p2.attackPause=2;specialRuntime.finishTick();if(state.elapsed!==2)throw Error('Local hitpause incorrectly froze native dust spacing');
    rows.push({profile,player,kind,redirected});
   }
   specialRuntime.reset();sourceExplods.length=0;p1HitPause=0;p2.attackPause=0;
   const owner=specialRoot(1),data=characterProfiles.get(battleCharacters[0]).battle;data.helperStates[991889]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[{type:'MakeDust',params:{spacing:'1',pos:'5,0,0'},triggers:{1:['1']},triggerall:[]}]};specialRuntime.dispatch({type:'Helper',params:{stateno:991889,id:991889}},owner,specialRuntime.context(owner),{},owner,1);const moving=specialRuntime.entities.at(-1);moving.x=owner.x+200;moving.vx=4;moving.created=combatTraceTick-1;makeDustStateFor(moving).elapsed=1;simStep();const bound=sourceExplods.find(effect=>effect.dust&&effect.ownerKey===moving.key);if(!bound||bound.x!==moving.x+5*moving.facing||bound.x===owner.x+5*owner.facing)throw Error('Helper dust bound to root instead of live Helper after physics');
   const clock=makeDustStateFor(moving);specialRuntime.pauses.normal[0]={remaining:10,movetime:0,player:1,created:combatTraceTick-1};specialRuntime.moveTimes.set(moving.key,{normal:0});clock.elapsed=7;combatTraceTick++;specialRuntime.finishTick();if(clock.elapsed!==7)throw Error('Global pause advanced Helper dust clock');specialRuntime.moveTimes.set(moving.key,{normal:1});combatTraceTick++;specialRuntime.finishTick();if(clock.elapsed!==8)throw Error('Allowed pause movetime did not advance Helper dust clock');
   specialRuntime.reset();sourceExplods.length=0;p1HitPause=0;p2.attackPause=0;cameraX=20;cameraY=0;cameraZoom=1;Object.assign(STAGE_CAMERA,{topz:0,botz:100,ztopscale:.5,zbotscale:1.5,depthtoscreen:2});Object.assign(stageCameraConfig.player,{topbound:-100,botbound:100});
   const actor=specialRoot(1),state=makeDustStateFor(actor),fit=Math.min(innerWidth/1280,innerHeight/720);
   for(const depth of [0,100]){sourceExplods.length=0;state.elapsed=3;executeControllerM1({type:'MakeDust',params:{spacing:'1',pos:'0,-10,'+depth}},actor,specialRuntime.context(actor),{owner:actor,player:1,schedulingApplied:true});const effect=sourceExplods[0],scale=.5+effect.z/100;transDrawQueue.reset();drawSourceExplods();const entry=transDrawQueue.ordered().find(entry=>entry.kind==='dust');if(Math.abs(entry.matrix[0]-scale*effect.facing*fit)>1e-6||Math.abs(entry.matrix[5]-worldScreenY(effect.y*scale+effect.z*2)*fit)>1e-6)throw Error('Actual XYZ operand did not change dust transform')}
   return rows;
   }finally{sourceExplods.length=0;specialRuntime.reset();combatEngineProfile=saved.profile;rootDrawOffsets.splice(0,2,...saved.offsets);[cameraX,cameraY,cameraZoom]=saved.camera;Object.assign(STAGE_CAMERA,saved.config);Object.assign(stageCameraConfig.player,saved.player);p1HitPause=0;p2.attackPause=0}
  })()`);
  assert.equal(rows.length,16);console.log('Sixteen actual MakeDust root/normal-Helper/profile/player/redirection cases pass F120 visible pixels/timing/lifetime, positions, suppression and per-actor finish clocks; Z changes actual drawing transform');
 }finally{await browser?.close();server.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
