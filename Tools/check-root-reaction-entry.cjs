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
   const rows=[];
   for(const player of [1,2])for(const facing of [-1,1]){
    const fighter={player,state:5071,anim:5070,time:20,animStartTime:0,elem:4,elemTick:0,x:0,y:60,vx:10,vy:20,facing,life:500,hitTime:-1,getHit:{fall:1,yaccel:1.4,'fall.yvel':-18,'fall.damage':0,'fall.kill':1},vars:[],sysvars:[],fallExecuted:new Set()};
    stepSourceFallM1(fighter);
    const first={player,facing,state:fighter.state,anim:fighter.anim,elem:fighter.elem,time:fighter.time,start:fighter.animStartTime,x:fighter.x,y:fighter.y,vy:fighter.vy,ground:evalM1('Const(movement.air.gethit.trip.groundlevel)',fighterExpressionContext(fighter,specialRoot(3-player)))};
    fighter.y=-5;fighter.vy=.5;stepSourceFallM1(fighter);
    rows.push({first,second:[fighter.state,fighter.time,fighter.anim,fighter.elem,fighter.y,fighter.vy]});
   }
   return rows;
  })()`);
  console.log('Reaction fixture observations',JSON.stringify(results));
  for(const row of results){
   assert.deepEqual(row.first,{player:row.first.player,facing:row.first.facing,state:5110,anim:5170,elem:1,time:1,start:0,x:8.5,y:0,vy:0,ground:60});
   assert.deepEqual(row.second,[5110,2,5170,2,-4.5,.5]);
  }
  const transitions=await run(`(()=>{
   const data=characterProfiles.get(battleCharacters[0]).battle,oldState=991640,newState=991641,rows=[];
   const instruction=(type,params,condition='1')=>({type,params,triggers:{1:[condition]},triggerall:[]});
   data.fallStates[newState]={type:'S',physics:'N',moveType:'H',anim:0,ctrl:0,controllers:[instruction('VarSet',{v:7,value:'Var(7)*10+2'},'Time=0')]};
   for(const player of [1,2])for(const mode of ['stop','continue','same']){
    data.fallStates[oldState]={type:'S',physics:'N',moveType:'H',anim:0,ctrl:0,controllers:mode==='same'?[instruction('VarAdd',{v:39,value:1}),instruction('ChangeState',{value:oldState},'Var(39)<3'),instruction('VarSet',{v:7,value:5},'Time=0')]:[instruction('ChangeState',{value:newState,...(mode==='continue'?{continue:1}:{})}),instruction('VarSet',{v:7,value:'Var(7)*10+1'}),instruction('VarSet',{v:7,value:'Var(7)*10+3'})]};
    const fighter={player,state:oldState,anim:0,time:0,animStartTime:0,elem:1,elemTick:0,x:0,y:0,vx:0,vy:0,facing:1,life:500,hitTime:-1,getHit:{},vars:Array(60).fill(0),sysvars:Array(10).fill(0)};
    stepSourceFallM1(fighter);
    rows.push({player,mode,state:fighter.state,time:fighter.time,marker:fighter.vars[7],count:fighter.vars[39]});
   }
   return rows;
  })()`);
  for(const row of transitions){
   const same=row.mode==='same';
   assert.deepEqual(row,{player:row.player,mode:row.mode,state:same?991640:991641,time:1,marker:same?5:row.mode==='continue'?213:2,count:same?3:0});
  }
  console.log('Four original reaction entries and six reaction-body stop/continue/same-generation cases passed');
  const airborne=await run(`(()=>{
   const data=characterProfiles.get(battleCharacters[0]).battle,rows=[];
   data.fallStates[991642]={type:'A',physics:'A',moveType:'H',anim:0,controllers:[{type:'VelSet',params:{y:-10},triggers:{1:['Time=0']},triggerall:[]}]};
   data.fallStates[991643]={type:'S',physics:'N',moveType:'H',anim:0,controllers:[{type:'ChangeState',params:{value:991642},triggers:{1:['1']},triggerall:[]}]};
   for(const player of [1,2]){
    const fighter={player,state:991643,anim:0,time:0,animStartTime:0,elem:1,elemTick:0,x:0,y:-100,vx:2,vy:0,facing:1,life:500,hitTime:-1,getHit:{},vars:[],sysvars:[]};
    stepSourceFallM1(fighter);rows.push({player,state:fighter.state,time:fighter.time,x:fighter.x,y:fighter.y,vy:fighter.vy,gravity:withCharacter(player,()=>constVal('movement.yaccel'))});
   }
   return rows;
  })()`);
  for(const row of airborne)assert.deepEqual(row,{player:row.player,state:991642,time:1,x:2,y:-110,vy:-10+row.gravity,gravity:row.gravity});
  assert.deepEqual(errors,[]);

 }finally{await browser?.close();server.close();clearTimeout(watchdog)}
})().catch(error=>{console.error(error);process.exitCode=1});
