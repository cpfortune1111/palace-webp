"""Generate isolated on-demand UI adapters; leave the main game unchanged."""
import pathlib,sys
web,out=map(pathlib.Path,sys.argv[1:3]);out.mkdir(parents=True,exist_ok=True)
def read(name):return (web/'Engine'/name).read_text(encoding='utf-8')
def save(name,text):(out/name).write_text(text,encoding='utf-8')
def replace(text,before,after):
 assert text.count(before)==1,before[:100]
 return text.replace(before,after)

text=read('palace-menu.js')
text=replace(text,"api.start(next,next==='training'?'infinite':options.timer,choice);api.pause(false);","await api.start(next,next==='training'?'infinite':options.timer,choice);api.pause(false);")
text=replace(text,'resultDeclarations.show(battlePlayers,winner,statistics)','await resultDeclarations.show(battlePlayers,winner,statistics)')
save('palace-menu.js',text)

text=read('quote-animation.js');start=text.index('let prepared;');end=text.index('export function quoteFrame')
loader='''let prepared;
const pendingImages=new Map(),pendingSounds=new Map();
export async function preloadQuoteAssets(ids=['9000']){
 if(!prepared)prepared=fetch('./Data/Quote/venus.json?v=02377').then(response=>{if(!response.ok)throw Error('Quote manifest');return response.json()}).then(manifest=>({manifest,images:new Map(),sounds:new Map()}));
 const assets=await prepared,keys=new Set(),files=new Set();
 for(const id of ids){const action=assets.manifest.actions[id];if(!action)throw Error('Quote action '+id);for(const frame of action.frames)keys.add(frame.sprite);for(const cue of action.cues)files.add(cue.file)}
 await Promise.all([...keys].map(key=>{if(!pendingImages.has(key))pendingImages.set(key,(async()=>{const image=new Image();image.src='./'+assets.manifest.frames[key].file+'?v=02377';await image.decode();assets.images.set(key,image)})());return pendingImages.get(key)}));
 await Promise.all([...files].map(file=>{if(!pendingSounds.has(file))pendingSounds.set(file,(async()=>{const response=await fetch('./'+file);if(!response.ok)throw Error('Quote voice '+file);assets.sounds.set(file,URL.createObjectURL(await response.blob()))})());return pendingSounds.get(file)}));
 return assets;
}
'''
save('quote-animation.js',loader+text[end:])

text=read('declaration-screen.js');start=text.index(' const venusPortraits=');end=text.index(' const flow=')
lazy=''' const venusPortraits=[],moonPortraits=[],jupiterPortraits=[],neptunePortraits=[],saturnPortraits=[];
 const empty=()=>({stop(){},step(){},draw(){},playing:false,snapshot:()=>({action:'unloaded',width:1280,height:720})});
 const portraits=[empty(),empty()];let moonAssets,jupiterAssets,neptuneAssets,saturnAssets,assets,variants=[],active=false;
 const ready=Promise.resolve();
 async function prepare(players,options={}){
  await Promise.all(players.map(async(identifier,index)=>{
   if(identifier==='SailorVenus'){
    assets=await preloadQuoteAssets(options.result?['9019','9020','9021','9030','9031']:['9010','9011','9012']);
    venusPortraits[index]??=createQuotePortrait();await venusPortraits[index].ready;
   }else{
    const choices={SailorMoon:[moonPortraits,createMoonDeclarationPortrait,preloadMoonDeclaration],SailorJupiter:[jupiterPortraits,createJupiterDeclarationPortrait,preloadJupiterDeclaration],SailorNeptune:[neptunePortraits,createNeptuneDeclarationPortrait,preloadNeptuneDeclaration],SailorSaturn:[saturnPortraits,createSaturnDeclarationPortrait,preloadSaturnDeclaration]};
    const entry=choices[identifier];if(!entry)throw Error('Quote animation unavailable');
    entry[0][index]??=entry[1]();const loaded=await entry[2]();await entry[0][index].ready;
    if(identifier==='SailorMoon')moonAssets=loaded;else if(identifier==='SailorJupiter')jupiterAssets=loaded;else if(identifier==='SailorNeptune')neptuneAssets=loaded;else saturnAssets=loaded;
   }
  }));
 }
'''
text=text[:start]+lazy+text[end:];text=replace(text,'return {ready,begin,reset,draw,step,','return {ready,prepare,begin,reset,draw,step,');save('declaration-screen.js',text)

text=read('acs-screen.js');text=replace(text,'async function loadCharacterAssets(){for(const identifier of Object.keys(manifest.characters))','async function loadCharacterAssets(identifiers=[]){for(const identifier of new Set(identifiers))')
text=replace(text,'try{await prepared;if(serial!==entrySerial)return;','try{await prepared;await Promise.all([loadCharacterAssets(nextChoice.players),declaration.prepare(nextChoice.players)]);if(serial!==entrySerial)return;')
save('acs-screen.js',text)

text=read('result-declaration-screen.js');text=replace(text,' function show(players,winner,statistics){',' let showSerial=0;\n async function show(players,winner,statistics){const serial=++showSerial;await Promise.all([ready,declaration.prepare(players,{result:true})]);if(serial!==showSerial)return;')
text=replace(text,'function hide(){view.hidden=true;','function hide(){showSerial++;view.hidden=true;')
text=replace(text,'return {ready,show,hide,handleKey,','return {ready,prepare:players=>declaration.prepare(players,{result:true}),show,hide,handleKey,')
save('result-declaration-screen.js',text)
print('Generated selected-character declaration and action-scoped Venus adapters')

text=read('fight-hud-runtime.js')
text="import {createHudPortraits} from './hud-portraits.js?battle-ready=2';\n"+text
start=text.index(' const emblemReady=');end=text.index(' const ready=',start)
text=text[:start]+' const portraitFaces=createHudPortraits();const emblemReady=Promise.resolve();\n'+text[end:]
text=replace(text,'  for(const [index,actor] of [first,second].entries())','  portraitFaces.draw(context,first,second,ticks);\n  for(const [index,actor] of [first,second].entries())')
text=replace(text,'return {setCharacterEmblem:',"return {prepareCharacter:async id=>{const entry=await portraitFaces.prepare(id);characterEmblems.set(id,entry)},setCharacterEmblem:")
save('fight-hud-runtime.js',text)
