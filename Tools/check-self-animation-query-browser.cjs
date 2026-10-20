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
 const watchdog=setTimeout(async()=>{console.error('Own animation query regression exceeded deadline');try{await browser?.close()}finally{server.close();process.exit(1)}},300000);
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  browser=await chromium.launch({headless:true,channel:'msedge'});
  const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:'+server.address().port+'/');
  await page.waitForFunction(()=>window.contactPhaseTest?.run('!!dat&&!!stateIR&&!!battleDat&&!!lifecycleDat&&!!specialDat&&!!roundCharDat&&!!cmdDat&&!!airDat&&!!fallDat&&!!guardDat&&!!turnDat'),null,{timeout:90000});
  const run=source=>page.evaluate(source=>window.contactPhaseTest.run(source),source);
  await run("prepareCharacters(['SailorSaturn','SailorSaturn'])");
  await run("prepareCharacters(['SailorSaturn','SailorMoon'])");
  const results=await run(`(()=>{
   const rows=[],savedProfile=combatEngineProfile,savedStates=[...customStateOwners],savedAnimations=[...customAnimationOwners];
   try{for(const profile of ['mugen11','ikemen'])for(const player of [1,2])for(const kind of ['root','helper']){
    combatEngineProfile=profile;specialRuntime.reset();customStateOwners.fill(null);customAnimationOwners.fill(null);
    const ownName=battleCharacters[player-1],otherName=battleCharacters[2-player],own=characterProfiles.get(ownName),other=characterProfiles.get(otherName);
    const ownIds=own.animationIds||new Set(Object.keys(own.data.actions)),otherIds=other.animationIds||new Set(Object.keys(other.data.actions));
    const ownId=[...ownIds].find(id=>!otherIds.has(id)),otherId=[...otherIds].find(id=>!ownIds.has(id));
    if(ownId===undefined||otherId===undefined)throw Error('No actual conflicting animation inventory fixture');
    own.battle.helperStates[991671]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[]};
    let caller=specialRoot(player);
    if(kind==='helper'){
     specialRuntime.dispatch({type:'Helper',params:{stateno:991671,id:991671}},caller,specialRuntime.context(caller),{},caller,player);
     caller=specialRuntime.entities.at(-1);
    }
    caller.vars[0]=Number(ownId);caller.vars[1]=Number(otherId);
    const variants=[];
    for(const borrowed of [false,true]){
     customStateOwners[player-1]=borrowed?otherName:null;customAnimationOwners[player-1]=borrowed?otherName:null;
     if(kind==='helper')caller.stateOwner=borrowed?otherName:null;
     const context=specialRuntime.context(caller),expressions=['SelfAnimExist('+ownId+')','SelfAnimExist('+otherId+')','SelfAnimExist('+ownId+')/2','Enemy,SelfAnimExist(Var(0))','Enemy,SelfAnimExist(Var(1))'];
     const values=expressions.map(value=>evalAST(parseExprAST(value),context));
     for(const [index,value] of expressions.entries())executeControllerM1({type:'VarSet',params:{fv:index+9,value}},caller,context,{owner:caller,player,schedulingApplied:true});
     variants.push({borrowed,values,parameters:caller.fvars.slice(9,14)});
    }
    rows.push({profile,player,kind,ownId,otherId,variants});
   }}finally{combatEngineProfile=savedProfile;customStateOwners.splice(0,2,...savedStates);customAnimationOwners.splice(0,2,...savedAnimations)}
   return rows;
  })()`);
  for(const row of results)for(const variant of row.variants){
   assert.deepEqual(variant.values,[true,false,0,false,true],row.profile+' P'+row.player+' '+row.kind+' borrowed='+variant.borrowed);
   assert.deepEqual(variant.parameters,[1,0,0,0,1]);
  }
  console.log('Actual SelfAnimExist own-versus-borrowed animation inventories and redirected caller ID scope pass in eight actor/profile scenarios');
  assert.deepEqual(errors,[]);

 }finally{await browser?.close();server.close();clearTimeout(watchdog)}
})().catch(error=>{console.error(error);process.exitCode=1});
