const libraries=new Map(),pending=new Map();
const idOf=character=>String(character).replace(/^Sailor/,'').toLowerCase();
async function library(character){
 if(!libraries.has(character))libraries.set(character,fetch('./Data/Quote/'+idOf(character)+'.json?v=02408r7').then(r=>{if(!r.ok)throw Error('Portrait timeline unavailable: '+character);return r.json()}).then(manifest=>({manifest,images:new Map(),sounds:new Map()})).catch(error=>{libraries.delete(character);throw error}));
 return libraries.get(character);
}
export async function preloadQuoteAssets(character='SailorVenus',actions=['9000'],progress=()=>{}){
 const assets=await library(character),ids=actions==='all'?Object.keys(assets.manifest.actions):actions,frames=new Set(),sounds=new Set();
 for(const id of ids){const action=assets.manifest.actions[id];if(!action)throw Error(character+' missing portrait action '+id);for(const f of action.frames)frames.add(f.sprite);for(const cue of action.cues)sounds.add(cue.file)}
 let completed=0;const total=frames.size+sounds.size,update=()=>progress(++completed/Math.max(1,total));
 await Promise.all([...frames].map(async key=>{if(assets.images.has(key)){update();return;}const token=character+':'+key;if(!pending.has(token))pending.set(token,(async()=>{const entry=assets.manifest.frames[key],image=new Image();image.src='./'+entry.file;await image.decode();assets.images.set(key,image)})().finally(()=>pending.delete(token)));await pending.get(token);update()}));
 await Promise.all([...sounds].map(async file=>{if(assets.sounds.has(file)){update();return;}const token='audio:'+file;if(!pending.has(token))pending.set(token,fetch('./'+file).then(r=>{if(!r.ok)throw Error('Portrait voice unavailable: '+file);return r.blob()}).then(blob=>assets.sounds.set(file,URL.createObjectURL(blob))).finally(()=>pending.delete(token)));await pending.get(token);update()}));
 return assets;
}
export function quoteFrame(action,tick){
 const duration=action.frames.reduce((sum,f)=>sum+Math.max(0,f.ticks),0);let age=Math.max(0,tick);
 if(action.loop!==null&&age>=duration)age=action.loop+(age-action.loop)%(duration-action.loop);
 for(const frame of action.frames){if(frame.ticks<0||age<frame.ticks)return frame.sprite;age-=frame.ticks}return action.frames.at(-1).sprite;
}
export function quoteDuration(action){return Math.max(action.frames.reduce((sum,f)=>sum+Math.max(0,f.ticks),0),0,...action.cues.map(c=>c.tick+c.duration))}
export function createQuotePortrait(initialCharacter='SailorVenus'){
 let character=initialCharacter,assets,action='9000',tick=0,lastSprite,played=new Set(),clips=[],clocks=[],serial=0,revision=0,loading;
 const canvas=document.createElement('canvas');canvas.width=1280;canvas.height=720;const context=canvas.getContext('2d');
 function stop(){for(const clip of clips)clip.pause();clips=[];clocks=[]}
 function set(next,nextTick=0){stop();action=String(next);tick=Math.max(0,Number(nextTick)||0);played.clear();lastSprite=undefined;render()}
 async function select(next,nextTick=0){const request=++serial;stop();character=next;assets=undefined;action='9000';tick=Math.max(0,Number(nextTick)||0);played.clear();lastSprite=undefined;context.clearRect(0,0,1280,720);canvas.dataset.quotePortrait=next;canvas.dataset.quoteRevision=String(++revision);
  const value=await preloadQuoteAssets(next);if(request!==serial)return;assets=value;render();
 }
 function choose(next,nextTick=0){loading=select(next,nextTick);return loading}
 loading=choose(initialCharacter);
 function render(){if(!assets)return;const definition=assets.manifest.actions[action];if(!definition)throw Error(character+' invalid portrait action '+action);const key=quoteFrame(definition,tick);if(key===lastSprite)return;const image=assets.images.get(key);if(!image)return;lastSprite=key;const entry=assets.manifest.frames[key];context.clearRect(0,0,1280,720);context.drawImage(image,entry.x||0,entry.y||0);canvas.dataset.quoteRevision=String(++revision)}
 function step(amount=1,sound){if(!assets)return;tick+=amount;const voice=clocks.find(c=>!c.clip.ended&&!c.clip.paused&&Number.isFinite(c.clip.currentTime));if(voice)tick=voice.tick+voice.clip.currentTime*60;if(sound)for(const[index,cue]of assets.manifest.actions[action].cues.entries())if(tick>=cue.tick&&!played.has(index)){played.add(index);const url=assets.sounds.get(cue.file);if(!url)throw Error('Voice was not prepared');const clip=sound(new Audio(url));clips.push(clip);clocks.push({clip,tick:cue.tick});clip.play().catch(error=>console.warn('Quote audio',error))}render()}
 function draw(ctx,x,y,width,height,alpha=1,facing=1){if(!assets)return;ctx.save();ctx.globalAlpha*=alpha;ctx.translate(x+width/2,y+height/2);ctx.scale(facing,1);ctx.drawImage(canvas,-width/2,-height/2,width,height);ctx.restore()}
 return {get ready(){return loading},select:choose,async prepare(actions='all'){await loading;await preloadQuoteAssets(character,actions);render()},set,step,draw,stop,canvas,get loaded(){return !!assets},get character(){return character},get manifest(){return assets?.manifest},get revision(){return revision},get tick(){return tick},get action(){return action},get duration(){return assets?quoteDuration(assets.manifest.actions[action]):0},get playing(){return clips.some(c=>!c.ended&&!c.paused)},snapshot:()=>({character,action,tick,sprite:lastSprite,width:1280,height:720,loaded:!!assets,revision})};
}
