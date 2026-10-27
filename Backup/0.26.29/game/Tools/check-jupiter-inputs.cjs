const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const assert=require('node:assert/strict');
const {chromium}=require('C:/Users/jeffy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..'),vendor=path.resolve(root,'../outputs/three-r180');
const server=http.createServer((request,response)=>{
 const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
 const base=pathname.startsWith('/vendor/')?vendor:root;
 const file=path.resolve(base,pathname.startsWith('/vendor/')?pathname.slice(8):'.'+(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(base+path.sep)||!fs.existsSync(file)){response.writeHead(404);response.end();return}
 let content=fs.readFileSync(file);
 if(file===path.join(root,'index.html')){
  content=Buffer.from(content.toString().replaceAll('https://cdn.jsdelivr.net/npm/three@0.180.0/','/vendor/').replaceAll('requestAnimationFrame(loop);','').replace('</script></body>',`window.runtimeTest={run:source=>eval(source),step:()=>{simStepCore();specialRuntime.step();specialRuntime.finishTick();combatTraceTick++;draw();drawMars();drawSourceExplods()},snapshot:()=>({state,current,posX,posY,runtimeCtrl,runtimeFailed,p2:{state:p2.state,anim:p2.anim,life:p2.life}})};</script></body>`));
 }
 response.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');response.end(content);
});
(async()=>{
 let browser;
 try{
  await new Promise(resolve=>server.listen(8788,'127.0.0.1',resolve));
  browser=await chromium.launch({headless:true,channel:'msedge'});
  const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:8788/');
  await page.waitForFunction(()=>window.runtimeTest?.run('!!dat&&!!stateIR&&!!battleDat&&!!lifecycleDat&&!!specialDat&&!!roundCharDat&&!!cmdDat&&!!airDat&&!!fallDat&&!!guardDat&&!!turnDat'),null,{timeout:90000});
  const run=source=>page.evaluate(source=>window.runtimeTest.run(source),source);

  await run('gameShell.logoIntro.ready');
  await page.keyboard.press('Enter');
  await page.waitForFunction(()=>window.runtimeTest.run('gameShell.logoIntro.finished'),null,{timeout:90000});
  for(const players of [['SailorJupiter','SailorVenus'],['SailorVenus','SailorJupiter'],['SailorJupiter','SailorMoon']]){
   await run(`gameShell.start('training',{players:${JSON.stringify(players)},stage:'training',hardware:['snes','snes'],command:['normal','normal']})`);
   await run('for(let tick=0;tick<1800;tick++)simStep();setP2ControlMode("keyboard");');
   const player=players.indexOf('SailorJupiter')+1;
   const buttons=player===1?['z','x','a','s']:['Numpad0','NumpadDecimal','Numpad1','Numpad2'];
   const down=player===1?'ArrowDown':'Numpad5',up=player===1?'ArrowUp':'Numpad8',modifier=player===1?'q':'NumpadDivide',otherModifier=player===1?'w':'NumpadMultiply';
   for(const [posture,states] of [['stand',[200,210,230,240]],['crouch',[400,410,430,440]],['air',[600,610,630,640]]]){
    for(const [index,expected] of states.entries()){
     await run('roundFlow.begin("training","infinite");for(let tick=0;tick<1800;tick++)simStep();resetPlayerInput();posX=-200;p2.x=200;enterIRState(0);enterP2State(0);simPaused=false;setCommandMode("normal");');
     if(posture!=='stand'){await page.keyboard.down(posture==='crouch'?down:up);await run('for(let tick=0;tick<10;tick++)simStep();');await page.keyboard.up(posture==='crouch'?down:up);if(posture==='crouch')await page.keyboard.down(down);}
     await page.keyboard.down(buttons[index]);
     const entered=await run(`(()=>{const seen=[];for(let tick=0;tick<6;tick++){simStep();seen.push(${player===1?'state':'p2.state'});}return seen;})()`);
     await page.keyboard.up(buttons[index]);if(posture==='crouch')await page.keyboard.up(down);
     assert.ok(entered.includes(expected),JSON.stringify({players,posture,expected,entered}));
    }
   }
   for(const skill of [1100,3000]){
    await run('roundFlow.begin("training","infinite");for(let tick=0;tick<1800;tick++)simStep();resetPlayerInput();specialRuntime.reset();posX=-50;p2.x=50;enterIRState(0);enterP2State(0);p1Life=500;p2.life=500;simPaused=false;setCommandMode("auto");');
    await run(`${player===1?'p1Life':'p2.life'}=200`);
    if(skill===1100){await page.keyboard.down(up);await run('for(let tick=0;tick<12;tick++)simStep();');await page.keyboard.up(up);}
    await page.keyboard.down(modifier);
    await page.keyboard.down(skill===1100?buttons[1]:otherModifier);
    const entered=await run(`(()=>{const seen=[];for(let tick=0;tick<8;tick++){simStep();seen.push(${player===1?'state':'p2.state'});}return seen;})()`);
    await page.keyboard.up(modifier);await page.keyboard.up(skill===1100?buttons[1]:otherModifier);
    assert.ok(entered.includes(skill),JSON.stringify({players,skill,entered}));
    const result=await run('(()=>{const reactions=new Set();for(let tick=0;tick<700;tick++){simStep();reactions.add(state);reactions.add(p2.state);}draw();drawMars();drawSourceExplods();return {runtimeFailed,reactions:[...reactions],p1:state,p2:p2.state};})()');
    assert.equal(result.runtimeFailed,false,JSON.stringify({players,skill,result}));
    if(skill===3000)assert.ok(result.reactions.includes(5800),JSON.stringify({players,skill,result}));
    console.log('Keyboard special and low-HP helpers passed',players.join('/'),skill);
   }
  }
  assert.deepEqual(errors,[]);
  console.log('Jupiter real keyboard normals, specials and mixed electric reactions passed');
 }finally{await browser?.close();server.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
