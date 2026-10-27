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
 const watchdog=setTimeout(async()=>{console.error('Query type controller regression exceeded deadline');try{await browser?.close()}finally{server.close();process.exit(1)}},300000);
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
   const rows=[],saved=combatEngineProfile;
   const integers=['time','stateno','life','lifemax','anim','animtime','facing','backedgebodydist','backedgedist','frontedgebodydist','frontedgedist','gametime','hitcount','hitpausetime','id','movecontact','moveguarded','movehit','movereversed','numenemy','numpartner','numproj','power','powermax','prevstateno','random','roundstate','teamside','uniqhitcount'];
   const booleans=['alive','canrecover','ctrl','hitfall','hitover','hitshakeover','inguarddist'],floats=['pos x','pos y','vel x','vel y','vel z'];
   try{for(const profile of ['mugen11','ikemen'])for(const player of [1,2])for(const kind of ['root','helper']){
    combatEngineProfile=profile;specialRuntime.reset();stateTicks=p2.time=5;
    let caller=specialRoot(player);
    if(kind==='helper'){
     const data=characterProfiles.get(battleCharacters[player-1]).battle;
     data.helperStates[991671]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[]};
     specialRuntime.dispatch({type:'Helper',params:{stateno:991671,id:991671}},caller,specialRuntime.context(caller),{},caller,player);
     caller=specialRuntime.entities.at(-1);caller.time=5;
    }
    caller.randomValue=7;
    const context=specialRuntime.context(caller),values=[];
    for(const [names,type] of [[integers,'int'],[booleans,'bool'],[floats,'float']])for(const name of names){
     const raw=Number(context.query(name)),expected=type==='float'?Math.fround(Math.fround(raw)/2):Math.trunc((type==='bool'?Number(!!raw):Math.trunc(raw)|0)/2)|0;
     executeControllerM1({type:'VarSet',params:{fv:9,value:name+'/2'}},caller,context,{owner:caller,player,schedulingApplied:true});
     values.push({name,type,raw,expected:Math.fround(expected),actual:caller.fvars[9]});
    }
    rows.push({profile,player,kind,values});
   }}finally{combatEngineProfile=saved}
   return rows;
  })()`);
  for(const row of results){
   assert.equal(row.values.length,41);
   for(const value of row.values){
    assert.ok(Number.isFinite(value.raw),row.kind+' '+value.name);
    assert.equal(value.actual,value.expected,row.profile+' P'+row.player+' '+row.kind+' '+value.name);
   }
  }
  console.log('All 41 native query types execute through actual VarSet consumers in eight profile/player/root-or-Helper scenarios');
  assert.deepEqual(errors,[]);

 }finally{await browser?.close();server.close();clearTimeout(watchdog)}
})().catch(error=>{console.error(error);process.exitCode=1});
