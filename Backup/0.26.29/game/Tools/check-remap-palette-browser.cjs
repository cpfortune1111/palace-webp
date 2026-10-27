const assert=require('node:assert/strict');
const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const {chromium}=require('C:/Users/jeffy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..'),vendor=path.resolve(root,'../outputs/three-r180'),assets=path.resolve(root,'../outputs/saturn-indexed-uncropped');
const metadata=JSON.parse(fs.readFileSync(path.join(assets,'indexed.json'),'utf8')),allowed=new Set(['indexed.json',...metadata.pages.map(page=>page.file)]);
const server=http.createServer((request,response)=>{
 const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname),privateAsset=pathname.startsWith('/indexed/'),base=privateAsset?assets:pathname.startsWith('/vendor/')?vendor:root;
 const relative=privateAsset?pathname.slice(9):pathname.startsWith('/vendor/')?pathname.slice(8):'.'+(pathname==='/'?'/index.html':pathname),file=path.resolve(base,relative);
 if(!file.startsWith(base+path.sep)||privateAsset&&!allowed.has(relative)||!fs.existsSync(file)){response.writeHead(404);response.end();return}
 let content=fs.readFileSync(file);
 if(file===path.join(root,'index.html'))content=Buffer.from(content.toString().replaceAll('https://cdn.jsdelivr.net/npm/three@0.180.0/','/vendor/').replaceAll('requestAnimationFrame(loop);','').replace('</script></body>',`window.paletteBattleTest={run:source=>eval(source)};</script></body>`));
 response.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');response.end(content);
});
(async()=>{
 let browser;
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  browser=await chromium.launch({headless:true,channel:'msedge'});const page=await browser.newPage({viewport:{width:1280,height:720}});
  await page.goto('http://127.0.0.1:'+server.address().port+'/');
  await page.waitForFunction(()=>window.paletteBattleTest?.run('!!dat&&!!stateIR&&!!battleDat&&!!lifecycleDat&&!!specialDat&&!!roundCharDat&&!!cmdDat&&!!airDat&&!!fallDat&&!!guardDat&&!!turnDat'),null,{timeout:90000});
  const run=source=>page.evaluate(source=>window.paletteBattleTest.run(source),source);
  await run("prepareCharacters(['SailorSaturn','SailorSaturn'])");
  await run("loadIndexedPaletteAssets(new URL('./Char/Saturn/Battle/Indexed/indexed.json',location.href).href,{createCanvas:(width,height)=>{const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;return canvas}}).then(assets=>characterProfiles.get('SailorSaturn').indexedPalette=assets)");
  assert.equal(await run("Object.keys(characterProfiles.get('SailorSaturn').indexedPalette.metadata.sprites).length"),521);
  const result=await run(`(()=>{
   const results=[],assets=characterProfiles.get('SailorSaturn').indexedPalette;
   for(const player of [1,2]){
    const actor=specialRoot(player),context=specialRuntime.context(actor),frame=framesFor(0,player)[0],key=frame.group+','+frame.item;
    const baseline=spriteCanvasFor(frame,actor),target=assets.metadata.palettes[1];
    executeControllerM1({type:'RemapPal',params:{dest:target.group+','+target.number}},actor,context,{owner:actor,player,schedulingApplied:true});
    const state=actorPaletteRuntime(actor).paletteRemap,source=spriteCanvasFor(frame,actor),sprite=drawingSpriteFor(frame,actor);
    if(source!==assets.surface(key,state)||source===baseline)throw Error('Root drawing did not consume remap');
    if(sprite!==assets.metadata.sprites[key]||source.width!==sprite.w||source.height!==sprite.h)throw Error('Root indexed geometry mismatch');
    if(player===1){current=0;fi=0;draw()}else{p2.anim=0;p2.elem=1;drawMars()}
    const entry=transDrawQueue.ordered().find(entry=>entry.kind==='root'+player);if(!entry||entry.source!==source)throw Error('Production draw queue lost indexed source');
    executeControllerM1({type:'RemapPal',params:{dest:'-1'}},actor,context,{owner:actor,player,schedulingApplied:true});
    if(spriteCanvasFor(frame,actor)!==baseline)throw Error('Root palette reset did not restore original path');
    results.push({player,width:source.width,height:source.height});
   }
   for(const player of [1,2])for(const ownpal of [0,1]){
    specialRuntime.reset();const actor=specialRoot(player),target=assets.metadata.palettes[1],other=assets.metadata.palettes[2];
    const apply=(owner,dest,extra={})=>executeControllerM1({type:'RemapPal',params:{dest,...extra}},owner,specialRuntime.context(owner),{owner,player,schedulingApplied:true});
    apply(actor,target.group+','+target.number);
    characterProfiles.get('SailorSaturn').battle.helperStates[991686]={type:'S',physics:'N',moveType:'I',anim:0,controllers:[]};
    specialRuntime.dispatch({type:'Helper',params:{stateno:991686,id:991686,ownpal}},actor,specialRuntime.context(actor),{},actor,player);
    const helper=specialRuntime.entities.at(-1),parentState=actorPaletteRuntime(actor).paletteRemap,helperState=actorPaletteRuntime(helper).paletteRemap;
    if(!!ownpal===(helperState===parentState))throw Error('Helper palette ownership mismatch');
    if(JSON.stringify(helperState.remap)!==JSON.stringify(parentState.remap))throw Error('Helper failed to inherit remap');
    const frame=framesFor(0,player)[0],key=frame.group+','+frame.item;
    apply(helper,other.group+','+other.number);
    if(ownpal&&JSON.stringify(parentState.remap)===JSON.stringify(helperState.remap))throw Error('Own-palette helper changed parent remap');
    const source=spriteCanvasFor(frame,helper);transDrawQueue.reset();drawSourceExplods();
    const entry=transDrawQueue.ordered().find(entry=>entry.actorId===helper.instanceId);if(!entry||entry.source!==source)throw Error('Helper draw queue lost remapped surface');
    if(source!==assets.surface(key,helperState))throw Error('Helper drawing palette mismatch');
    apply(actor,'-1');if(ownpal&&helperState.remap===null)throw Error('Parent reset erased own helper remap');
    if(!ownpal&&helperState.remap!==null)throw Error('Shared helper missed parent reset');
    apply(actor,target.group+','+target.number,{redirectid:String(helper.instanceId)});
    if(!helperState.remap)throw Error('Redirected helper remap did not apply');
    apply(actor,'-1');results.push({player,ownpal,helper:true});
   }
   for(const player of [1,2])for(const ownpal of [0,1]){
    specialRuntime.reset();const actor=specialRoot(player),context=specialRuntime.context(actor),target=assets.metadata.palettes[1];
    actorPaletteRuntime(actor).paletteRemap=createPaletteRemapState();actor.vars[7]=target.group;actor.vars[8]=target.number;
    specialRuntime.dispatch({type:'Helper',params:{stateno:991686,id:991686,ownpal,remappal:'Var(7),Var(8)'}},actor,context,{},actor,player);
    const helper=specialRuntime.entities.at(-1),parent=actorPaletteRuntime(actor).paletteRemap,state=actorPaletteRuntime(helper).paletteRemap;
    if(ownpal){
     if(JSON.stringify(parent.remap)!==JSON.stringify(assets.catalog.baseMap))throw Error('Own-palette birth did not initialize parent identity map');
     const expected=assets.catalog.names.get(target.group+','+target.number);if(!state.remap.every(index=>index===expected))throw Error('Helper birth remappal did not force destination');
     const before=[...state.remap];executeControllerM1({type:'PalFX',params:{time:'2',add:'1,2,3'}},helper,specialRuntime.context(helper),{owner:helper,player,schedulingApplied:true});
     if(JSON.stringify(state.remap)!==JSON.stringify(before))throw Error('PalFX erased helper remap');
    }else if(parent.remap!==null||state!==parent)throw Error('Shared-palette helper incorrectly applied birth remappal');
    actorPaletteRuntime(actor).paletteRemap=createPaletteRemapState();results.push({player,ownpal,birth:true});
   }
   specialRuntime.reset();
   for(const player of [1,2])for(const ownpal of [0,1]){
    sourceExplods.length=0;const actor=specialRoot(player),context=specialRuntime.context(actor),target=assets.metadata.palettes[1],other=assets.metadata.palettes[2];
    const apply=dest=>executeControllerM1({type:'RemapPal',params:{dest}},actor,context,{owner:actor,player,schedulingApplied:true});
    apply(target.group+','+target.number);
    executeControllerM1({type:'Explod',params:{anim:'0',ownpal:String(ownpal),remappal:other.group+','+other.number}},actor,context,{owner:actor,player,schedulingApplied:true,explod:params=>spawnSourceExplod(params,actor,player,context)});
    const effect=sourceExplods.at(-1),parent=actorPaletteRuntime(actor),state=effect.palFx.paletteRemap;
    if(!!ownpal===(effect.palFx===parent))throw Error('Explod palette ownership mismatch');
    const expected=assets.catalog.names.get((ownpal?other:target).group+','+(ownpal?other:target).number);if(!state.remap.every(index=>index===expected))throw Error('Explod birth remap mismatch');
    const frame=framesFor(0,player)[0],key=frame.group+','+frame.item,source=assets.surface(key,state);transDrawQueue.reset();drawSourceExplods();
    const entry=transDrawQueue.ordered().find(entry=>entry.kind==='explod');if(!entry||entry.source!==source)throw Error('Explod draw queue missed own/shared palette');
    apply('-1');if(ownpal&&state.remap===null||!ownpal&&state.remap!==null)throw Error('Explod parent-reset ownership mismatch');
    results.push({player,ownpal,explod:true});
   }
   sourceExplods.length=0;
   for(const player of [1,2])for(const ownpal of [0,1]){
    specialRuntime.reset();const actor=specialRoot(player),context=specialRuntime.context(actor),target=assets.metadata.palettes[1],other=assets.metadata.palettes[2];
    const apply=dest=>executeControllerM1({type:'RemapPal',params:{dest}},actor,context,{owner:actor,player,schedulingApplied:true});
    apply(target.group+','+target.number);actor.vars[7]=other.group;actor.vars[8]=other.number;
    specialRuntime.dispatch({type:'Projectile',params:{projid:'991687',projanim:'0',ownpal:String(ownpal),remappal:'Var(7),Var(8)'}},actor,context,{},actor,player);
    const projectile=specialRuntime.entities.at(-1),parent=actorPaletteRuntime(actor),state=projectile.palFx.paletteRemap;
    if(!!ownpal===(projectile.palFx===parent))throw Error('Projectile palette ownership mismatch');
    const selected=ownpal?other:target,expected=assets.catalog.names.get(selected.group+','+selected.number);if(!state.remap.every(index=>index===expected))throw Error('Projectile birth remap mismatch');
    const frame=framesFor(0,player)[0],source=assets.surface(frame.group+','+frame.item,state);transDrawQueue.reset();drawSourceExplods();
    const entry=transDrawQueue.ordered().find(entry=>entry.kind==='projectile');if(!entry||entry.source!==source)throw Error('Projectile draw queue missed own/shared palette');
    apply('-1');if(ownpal&&state.remap===null||!ownpal&&state.remap!==null)throw Error('Projectile reset inheritance mismatch');
    results.push({player,ownpal,projectile:true});
   }
   specialRuntime.reset();
   for(const player of [1,2])for(const initialRemap of [0,1]){
    const actor=specialRoot(player),context=specialRuntime.context(actor),target=assets.metadata.palettes[1],other=assets.metadata.palettes[2];
    if(player===1){current=0;fi=0}else{p2.anim=0;p2.elem=1}
    const apply=dest=>executeControllerM1({type:'RemapPal',params:{dest}},actor,context,{owner:actor,player,schedulingApplied:true});
    apply(initialRemap?target.group+','+target.number:'-1');const frame=framesFor(0,player)[0],before=spriteCanvasFor(frame,actor),geometry=drawingSpriteFor(frame,actor);
    executeControllerM1({type:'AfterImage',params:{time:'8',timegap:'1',length:'4'}},actor,context,{owner:actor,player,schedulingApplied:true});stepAfterImages();
    const snapshot=afterImages[player-1].frames[0].spriteSnapshot;if(!snapshot||snapshot.source!==before||snapshot.sprite.w!==geometry.w||snapshot.sprite.axisX!==geometry.axisX)throw Error('Afterimage did not capture palette source and geometry');
    apply(other.group+','+other.number);if(spriteCanvasFor(frame,actor)===before)throw Error('Afterimage fixture did not change current palette');
    transDrawQueue.reset();drawAfterImages(player===1?ctx:mctx,player);const entry=transDrawQueue.ordered().find(entry=>entry.kind==='afterimage');if(!entry||entry.source!==before)throw Error('Afterimage followed current palette instead of captured source');
    if(entry.args[0]!==-snapshot.sprite.axisX+snapshot.frame.ox||entry.args[1]!==-snapshot.sprite.axisY+snapshot.frame.oy)throw Error('Afterimage lost captured origin');
    afterImages[player-1]=null;apply('-1');results.push({player,initialRemap,afterimage:true});
   }
   for(const player of [1,2]){
    const actor=specialRoot(player),context=specialRuntime.context(actor),profile=characterProfiles.get('SailorSaturn'),frame=Object.values(profile.data.actions).flat().find(frame=>Object.hasOwn(assets.metadata.nonIndexedSprites,frame.group+','+frame.item));
    if(!frame)throw Error('Missing truecolor animation fixture');const baseline=spriteCanvasFor(frame,actor),geometry=spriteFor(frame),target=assets.metadata.palettes[1];
    executeControllerM1({type:'RemapPal',params:{dest:target.group+','+target.number}},actor,context,{owner:actor,player,schedulingApplied:true});
    if(spriteCanvasFor(frame,actor)!==baseline||drawingSpriteFor(frame,actor)!==geometry)throw Error('Truecolor sprite incorrectly remapped');
    const empty=Object.values(profile.data.actions).flat().find(frame=>frame.empty);if(!empty)throw Error('Missing real empty AIR fixture');if(drawingSpriteFor(empty,actor)||spriteCanvasFor(empty,actor))throw Error('Empty AIR frame became a drawable sprite');
    const indexedFrame=framesFor(0,player)[0],key=indexedFrame.group+','+indexedFrame.item,saved=assets.metadata.sprites[key];delete assets.metadata.sprites[key];let rejected=false;
    try{spriteCanvasFor(indexedFrame,actor)}catch(error){if(!error.message.includes('Missing indexed sprite'))throw error;rejected=true}finally{assets.metadata.sprites[key]=saved}
    if(!rejected)throw Error('Missing indexed sprite was silently ignored');
    executeControllerM1({type:'RemapPal',params:{dest:'-1'}},actor,context,{owner:actor,player,schedulingApplied:true});results.push({player,truecolor:true});
   }
   return results;
  })()`);
  assert.equal(result.length,24);console.log('Production-loaded Saturn root/Helper/Explod/Projectile/afterimage remaps, truecolor preservation and missing-index rejection pass',result);
 }finally{await browser?.close();server.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
