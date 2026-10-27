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
 if(file===path.join(root,'Engine','palace-menu.js'))content=Buffer.from(content.toString().replaceAll('logoIntro&&!logoIntro.finished','false'));
 if(file===path.join(root,'index.html')){
  content=Buffer.from(content.toString().replaceAll('https://cdn.jsdelivr.net/npm/three@0.180.0/','/vendor/').replaceAll('requestAnimationFrame(loop);','').replace('</script></body>',`window.runtimeTest={run:source=>eval(source),step:()=>{simStepCore();specialRuntime.step();specialRuntime.finishTick();combatTraceTick++;draw();drawMars();drawSourceExplods()},snapshot:()=>({state,current,posX,posY,runtimeCtrl,runtimeFailed,p2:{state:p2.state,anim:p2.anim,life:p2.life}})};</script></body>`));
 }
 response.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');response.end(content);
});
(async()=>{
 let browser;
 try{
  await new Promise(resolve=>server.listen(8793,'127.0.0.1',resolve));
  browser=await chromium.launch({headless:true,channel:'msedge'});
  const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:8793/');
  await page.waitForFunction(()=>window.runtimeTest?.run('!!dat&&!!battleDat&&!!stageModel'),null,{timeout:90000});
  const run=source=>page.evaluate(source=>window.runtimeTest.run(source),source);
  await run('gameShell.selection.ready');
  for(const mode of ['training','vs','watch']){
   await run(`gameShell.selection.show('${mode}',{players:['SailorNeptune','SailorNeptune'],hardware:['snes','snes'],command:['auto','auto'],stage:'training'})`);
   await page.locator('#confirmSelection0').evaluate(button=>button.click());
   await page.locator('#confirmSelection1').evaluate(button=>button.click());
   assert.equal(await run('gameShell.selection.snapshot().phase'),'stage');
   await page.locator('#startSelection').evaluate(button=>button.click());
   if(mode==='training'){
    await page.waitForFunction(()=>window.runtimeTest.run("battleCharacters.every(character=>character==='SailorNeptune')&&!simPaused"),null,{timeout:90000});
    assert.equal(await run('gameShell.selection.snapshot().visible'),false);
   }else{
    await page.waitForFunction(()=>window.runtimeTest.run('gameShell.acs.snapshot().visible'),null,{timeout:30000});
    await page.waitForTimeout(600);
    await page.locator('#confirmAbilities').evaluate(button=>button.click());
    await page.waitForTimeout(600);
    await page.locator('#confirmAbilities').evaluate(button=>button.click());
    await page.waitForFunction(()=>window.runtimeTest.run('gameShell.acs.snapshot().declaration.phase')!=='idle',null,{timeout:10000});
    await page.waitForFunction(()=>window.runtimeTest.run("battleCharacters.every(character=>character==='SailorNeptune')&&!simPaused&&!gameShell.acs.snapshot().visible"),null,{timeout:30000});
   }
   await run("for(let tick=0;tick<1800;tick++)simStep()");
   assert.equal(await run('runtimeFailed'),false);
   console.log('Neptune selection to battle passed',mode);
  }
  await run("gameShell.selection.show('arcade',{players:['SailorNeptune','SailorNeptune'],hardware:['snes','snes'],command:['auto','auto']})");
  await run('window.savedRandom=Math.random;Math.random=()=>.99999');
  await page.locator('#confirmSelection0').evaluate(button=>button.click());
  await run('Math.random=window.savedRandom');
  await page.waitForFunction(()=>window.runtimeTest.run('gameShell.acs.snapshot().visible'),null,{timeout:30000});
  await page.waitForTimeout(600);
  await page.locator('#confirmAbilities').evaluate(button=>button.click());
  await page.waitForFunction(()=>window.runtimeTest.run("!simPaused&&!gameShell.acs.snapshot().visible"),null,{timeout:30000});
  assert.equal(await run('battleCharacters[1]'),'SailorNeptune');
  assert.equal(await run('activeStage'),'moon');
  assert.deepEqual(errors,[]);
  console.log('Neptune Arcade opponent stage fallback passed');
 }finally{await browser?.close();server.close()}
})().catch(error=>{console.error(error);process.exitCode=1});

