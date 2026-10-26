const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/jeffy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..'),vendor=path.resolve(root,'../outputs/three-r180');
const server=http.createServer((request,response)=>{
 const name=decodeURIComponent(new URL(request.url,'http://localhost').pathname),base=name.startsWith('/vendor/')?vendor:root,file=path.resolve(base,name.startsWith('/vendor/')?name.slice(8):'.'+(name==='/'?'/index.html':name));
 if(!file.startsWith(base+path.sep)||!fs.existsSync(file)){response.writeHead(404);response.end();return}
 let content=fs.readFileSync(file);
 if(file===path.join(root,'index.html'))content=Buffer.from(content.toString().replaceAll('https://cdn.jsdelivr.net/npm/three@0.180.0/','/vendor/').replaceAll('requestAnimationFrame(loop);','').replace('</script></body>','window.commandTest={run:source=>eval(source)};</script></body>'));
 response.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');response.end(content);
});
(async()=>{
 let browser;const timeout=setTimeout(()=>{console.error('Command browser fixture exceeded deadline');process.exit(1)},240000);
 try{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));browser=await chromium.launch({headless:true,channel:'msedge'});
  const page=await browser.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:'+server.address().port+'/');
  await page.waitForFunction(()=>window.commandTest?.run('!!dat&&!!stateIR&&!!battleDat&&!!cmdDat&&!!roundCharDat'),null,{timeout:90000});
  const run=source=>page.evaluate(source=>window.commandTest.run(source),source);let rows=[];
  for(const character of ['SailorVenus','SailorMoon','SailorJupiter','SailorNeptune','SailorSaturn']){
   await run(`prepareCharacters([${JSON.stringify(character)},${JSON.stringify(character)}])`);
   const result=await run(`(()=>{
    const data=profileFor(1).commands,original=data.commands,rows=[];
    data.commands=original.concat([
     {name:'__cmd_or',command:'a|b',time:15,bufferTime:3},
     {name:'__cmd_charge',command:'~3a',time:15,bufferTime:3},
     {name:'__cmd_left',command:'/L',time:15,bufferTime:1},
     {name:'__cmd_hold',command:'/B+a',time:15,bufferTime:3}]);
    try{for(const player of [1,2]){
     resetCommandList(1);resetCommandList(2);
     const sample=now=>sampleCommandList(player,now,false),active=name=>commandActive(name,player);
     sample({b:true});const or=active('__cmd_or'),query=!!evalM1('command = "__cmd_or"',specialRuntime.context(specialRoot(player))),peer=commandActive('__cmd_or',3-player);
     sample({});sample({});sample({});const expired=!active('__cmd_or');
     sample({a:true});sample({a:true});sample({a:true});sample({});const charge=active('__cmd_charge');
     const oldFacing=player===1?p1Facing:p2.facing;
     if(player===1)p1Facing=1;else p2.facing=1;sample({B:true});
     if(player===1)p1Facing=-1;else p2.facing=-1;sample({F:true});
     const absolute=active('__cmd_left')&&playerCommandLists[player].signed.L===2;
     if(player===1)p1Facing=oldFacing;else p2.facing=oldFacing;
     sample({});for(let i=0;i<4;i++)sample({B:true,a:true});const hold=active('__cmd_hold');
     rows.push({player,definitions:original.length,or,query,peer,expired,charge,absolute,hold});
    }}finally{data.commands=original;resetCommandList(1);resetCommandList(2)}return rows;
   })()`);
   for(const row of result){for(const key of ['or','query','expired','charge','absolute','hold'])assert.equal(row[key],true,character+' '+JSON.stringify(row));assert.equal(row.peer,false);rows.push({character,...row})}
  }
  assert.equal(rows.length,10);assert.equal(rows.reduce((sum,row)=>sum+row.definitions,0),430);assert.deepEqual(errors,[]);
  console.log('PASS five-character P1/P2 battle sampler and actual command expressions: OR, charge, expiry, physical facing continuity, legacy holds and peer isolation');
 }finally{clearTimeout(timeout);await browser?.close();await new Promise(resolve=>server.close(resolve))}
})().catch(error=>{console.error(error);process.exitCode=1});
