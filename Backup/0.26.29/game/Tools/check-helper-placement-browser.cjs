const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/jeffy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..'),vendor=path.resolve(root,'../outputs/three-r180');
const server=http.createServer((request,response)=>{
 const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname),base=pathname.startsWith('/vendor/')?vendor:root,file=path.resolve(base,pathname.startsWith('/vendor/')?pathname.slice(8):'.'+(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(base+path.sep)||!fs.existsSync(file)){response.writeHead(404);response.end();return}
 let content=fs.readFileSync(file);if(file===path.join(root,'index.html'))content=Buffer.from(content.toString().replaceAll('https://cdn.jsdelivr.net/npm/three@0.180.0/','/vendor/').replaceAll('requestAnimationFrame(loop);','').replace('</script></body>',`window.helperPlacementTest={run:source=>eval(source)};</script></body>`));
 response.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');response.end(content);
});
(async()=>{let browser;try{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));browser=await chromium.launch({headless:true,channel:'msedge'});const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('http://127.0.0.1:'+server.address().port+'/');await page.waitForFunction(()=>window.helperPlacementTest?.run('!!dat&&!!stateIR&&!!battleDat&&!!lifecycleDat&&!!specialDat&&!!commonAnimationDat'),null,{timeout:90000});
 const run=source=>page.evaluate(source=>window.helperPlacementTest.run(source),source);await run("prepareCharacters(['SailorSaturn','SailorSaturn'])");
await run("prepareCharacters(['SailorMoon','SailorSaturn'])");
 const result=await run(`(()=>{
  const profiles=[profileFor(1).battle,profileFor(2).battle],number=991995,saved=profiles.map(data=>({coordinates:data.coordinateSystem,definition:data.helperStates[number]})),savedCamera=[cameraX,cameraY,cameraZoom];let cases=0;
  const create=(caller,params)=>{const before=specialRuntime.entities.length;specialRuntime.dispatch({type:'Helper',params},caller,specialRuntime.context(caller),{},caller,caller.player);return specialRuntime.entities.length===before?null:specialRuntime.entities.at(-1)};
  try{
   profiles[0].coordinateSystem={...profiles[0].coordinateSystem,localcoord:[640,480],webWorldWidth:1280};profiles[1].coordinateSystem={...profiles[1].coordinateSystem,localcoord:[1280,720],webWorldWidth:1280};
   for(const data of profiles)data.helperStates[number]={type:'S',physics:'N',moveType:'I',controllers:[]};
   cameraX=41;cameraZoom=1.25;const left=41-512,right=41+512;
   for(const callerPlayer of [1,2])for(const parentHelper of [false,true])for(const facing of [-1,1])for(const flip of [-1,0,1])for(const postype of ['p1','p2','front','back','left','right','none']){
    specialRuntime.reset();sourceExplods.length=0;posX=100;posY=-50;posZ=30;p2.x=-200;p2.y=-80;p2.z=-20;p1Facing=1;p2.facing=-1;p1LifeMax=1500;p2.lifeMax=2500;
    const recipientPlayer=3-callerPlayer;if(recipientPlayer===1)p1Facing=facing;else p2.facing=facing;const caller=specialRoot(callerPlayer);let recipient=specialRoot(recipientPlayer);
    if(parentHelper)recipient=create(recipient,{stateno:String(number),id:'101'});
    const callerVars=callerPlayer===1?runtimeVar:p2.vars,recipientVars=parentHelper?recipient.vars:recipientPlayer===1?runtimeVar:p2.vars;callerVars[19]=7;callerVars[17]=0;callerVars[16]=0;callerVars[15]=10;callerVars[13]=-2;recipientVars[19]=91;
    const id=parentHelper?recipient.instanceId:recipientPlayer,child=create(caller,{redirectid:'('+id+'+(var(16):=var(16)+1)*0)',stateno:String(number),id:'(var(15):=var(15)+1)',postype,pos:'var(19)+(var(17):=var(17)+1)*0,-10,3',facing:String(flip),pausemovetime:'var(13)',supermovetime:'-1'});
    const scale=callerPlayer===1?2:1,delta=[7*scale,-10*scale,3*scale],sign=flip<0?-1:1,enemy=specialRoot(callerPlayer);let expected;
    if(postype==='p1')expected=[recipient.x+delta[0]*facing,recipient.y+delta[1],recipient.z+delta[2],sign*facing];
    else if(postype==='p2')expected=[enemy.x+delta[0]*enemy.facing,enemy.y+delta[1],enemy.z+delta[2],sign*enemy.facing];
    else if(postype==='front'||postype==='back'){const edge=facing>0&&postype==='front'||facing<0&&postype==='back'?right:left;expected=[edge+delta[0]*facing,delta[1],delta[2],sign*facing]}
    else expected=[(postype==='left'?left:postype==='right'?right:0)+delta[0],delta[1],delta[2],sign];
    const actual=[child.x,child.y,child.z,child.facing];if(JSON.stringify(actual)!==JSON.stringify(expected))throw Error('Actual redirect/coordinate/postype/facing mismatch '+JSON.stringify({callerPlayer,parentHelper,facing,flip,postype,actual,expected}));
    if(child.player!==recipientPlayer||child.id!==11||child.lifeMax!==recipient.lifeMax||callerVars[17]!==1||callerVars[16]!==1||callerVars[15]!==11||recipientVars[19]!==91)throw Error('Redirect lost caller RHS or recipient inheritance');
    if(child.pausemovetime!==-2||child.supermovetime!==-1)throw Error('Helper pause fields did not consume caller expressions');
    child.created=combatTraceTick-20;specialRuntime.pauses.normal[0]={remaining:50,movetime:0,created:combatTraceTick-10,player:1};if(specialRuntime.blocked(child.player,child))throw Error('Negative Helper pause allowance was blocked');child.pausemovetime=0;if(!specialRuntime.blocked(child.player,child))throw Error('Zero Helper pause allowance was ignored');specialRuntime.pauses.normal.fill(null);specialRuntime.pauses.super[0]={remaining:50,movetime:0,created:combatTraceTick-10,player:1};if(specialRuntime.blocked(child.player,child))throw Error('Negative Helper super allowance was blocked');specialRuntime.pauses.super.fill(null);
    transDrawQueue.reset();drawSourceExplods();if(!transDrawQueue.ordered().some(entry=>entry.kind==='helper'&&entry.actorId===child.instanceId))throw Error('Placed Helper did not reach actual rendering');
    callerVars[17]=0;const before=specialRuntime.entities.length;create(caller,{redirectid:'99999999',stateno:'(var(17):=99)',pos:'(var(17):=88),0'});if(callerVars[17]!==0||specialRuntime.entities.length!==before)throw Error('Missing redirect evaluated later Helper fields');
    cases++;
   }return {cases};
  }finally{for(let index=0;index<2;index++){profiles[index].coordinateSystem=saved[index].coordinates;if(saved[index].definition===undefined)delete profiles[index].helperStates[number];else profiles[index].helperStates[number]=saved[index].definition}[cameraX,cameraY,cameraZoom]=savedCamera;specialRuntime.reset();sourceExplods.length=0}
 })()`);assert.deepEqual(result,{cases:168});assert.deepEqual(errors,[]);console.log('Helper placement passes 168 real mixed-localcoord/caller-player/root-Helper-recipient/facing/postype cases, caller RHS, missing redirects, pause allowances and real draw consumers');
}finally{await browser?.close();server.close()}})().catch(error=>{console.error(error);process.exitCode=1});
