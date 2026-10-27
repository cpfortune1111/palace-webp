const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/jeffy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..'),vendor=path.resolve(root,'../outputs/three-r180');
const server=http.createServer((request,response)=>{
 const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname),base=pathname.startsWith('/vendor/')?vendor:root,file=path.resolve(base,pathname.startsWith('/vendor/')?pathname.slice(8):'.'+(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(base+path.sep)||!fs.existsSync(file)){response.writeHead(404);response.end();return}
 let content=fs.readFileSync(file);if(file===path.join(root,'index.html'))content=Buffer.from(content.toString().replaceAll('https://cdn.jsdelivr.net/npm/three@0.180.0/','/vendor/').replaceAll('requestAnimationFrame(loop);','').replace('</script></body>',`window.helperNameTest={run:source=>eval(source)};</script></body>`));
 response.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');response.end(content);
});
(async()=>{let browser;try{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));browser=await chromium.launch({headless:true,channel:'msedge'});const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('http://127.0.0.1:'+server.address().port+'/');await page.waitForFunction(()=>window.helperNameTest?.run('!!dat&&!!stateIR&&!!battleDat&&!!lifecycleDat&&!!specialDat&&!!commonAnimationDat'),null,{timeout:90000});
 const run=source=>page.evaluate(source=>window.helperNameTest.run(source),source);await run("prepareCharacters(['SailorSaturn','SailorSaturn'])");
const result=await run(`(()=>{
  const data=profileFor(1).battle,number=991996,saved={compatibility:data.compatibility,definition:data.helperStates[number]};let cases=0;
  const spawn=(owner,params={})=>{const before=specialRuntime.entities.length;specialRuntime.dispatch({type:'Helper',params:{stateno:String(number),...params}},owner,specialRuntime.context(owner),{},owner,owner.player);return specialRuntime.entities.length===before?null:specialRuntime.entities.at(-1)};
  const rename=(caller,target,value)=>executeControllerM1({type:'ModifyPlayer',params:{redirectid:String(target.instanceId),helpername:'"'+value+'"'}},caller.kind==='helper'?caller:caller.player===1?p1LifecycleBinding:p2,specialRuntime.context(caller),{owner:caller,player:caller.player,schedulingApplied:true});
  try{data.helperStates[number]={type:'S',physics:'N',moveType:'I',controllers:[]};
   for(const ikemen of [false,true])for(const player of [1,2])for(const nested of [false,true])for(const mode of ['default','literal','character','helper','conditional','undefined','unicode','ordering']){
    specialRuntime.reset();sourceExplods.length=0;data.compatibility=ikemen?'ikemen':'mugen';let owner=specialRoot(player);if(nested)owner=spawn(owner,{name:'"Parent Tag"'});
    const rootName=characterInfo[battleCharacters[player-1]].name,parentName=nested?'Parent Tag':rootName,params={id:'77'},vars=nested?owner.vars:player===1?runtimeVar:p2.vars;let expected;
    if(mode==='default')expected=parentName+"'s helper";
    else if(mode==='literal'){params.name='"Literal Tag"';expected='Literal Tag'}
    else if(mode==='character'){params.name='Name';expected=rootName}
    else if(mode==='helper'){params.name='HelperName';expected=nested?parentName:''}
    else if(mode==='conditional'){vars[19]=0;params.name='Cond((var(19):=var(19)+1),"Selected Tag","Other Tag")';expected='Selected Tag'}
    else if(mode==='undefined'){params.name='Root, HelperName';expected=''}
    else if(mode==='unicode'){params.name='"月の子"';expected='月の子'}
    else{vars[19]=0;params.name='Cond(var(19),"After","Before")';params.stateno='(var(19):='+number+')';expected='Before'}
    const child=spawn(owner,params),context=specialRuntime.context(child);if(child.name!==expected||evalM1('HelperName',context)!==expected||evalM1('Name',context)!==rootName)throw Error('Helper name did not reach actual expression consumers '+JSON.stringify({ikemen,player,nested,mode,actual:child.name,expected}));if(mode==='conditional'&&vars[19]!==1)throw Error('Helper name expression evaluated more than once');
    const copied=child.name;rename(specialRoot(player),child,'Renamed Tag');if(evalM1('HelperName',context)!=='Renamed Tag')throw Error('Existing helper query context did not see renamed name');const grandchild=spawn(child);if(grandchild.name!=="Renamed Tag's helper")throw Error('Nested default did not use current parent helper name');rename(specialRoot(player),child,'Later Tag');if(grandchild.name!=="Renamed Tag's helper"||copied!==expected)throw Error('Existing child name changed with parent');
    cases++;
   }
   for(const player of [1,2]){
    specialRuntime.reset();const caller=spawn(specialRoot(player),{name:'"Caller Tag"'}),recipient=spawn(specialRoot(3-player),{name:'"Recipient Tag"'});const child=spawn(caller,{redirectid:String(recipient.instanceId),name:'HelperName'}),derived=spawn(caller,{redirectid:String(recipient.instanceId)});if(child.player!==3-player||child.name!=='Caller Tag'||derived.name!=="Recipient Tag's helper")throw Error('Redirect mixed name expression source and parent default');
    caller.vars[19]=0;spawn(caller,{redirectid:'99999999',name:'Cond((var(19):=1),"Wrong","Wrong")'});if(caller.vars[19]!==0)throw Error('Missing redirect evaluated name RHS');
   }
   return {cases};
  }finally{data.compatibility=saved.compatibility;if(saved.definition===undefined)delete data.helperStates[number];else data.helperStates[number]=saved.definition;specialRuntime.reset();sourceExplods.length=0}
 })()`);assert.deepEqual(result,{cases:64});assert.deepEqual(errors,[]);console.log('Helper names pass 64 real version/player/root-nested/expression/default/string/order cases plus live rename, nested snapshots, redirect ownership and missing-target suppression');
}finally{await browser?.close();server.close()}})().catch(error=>{console.error(error);process.exitCode=1});
