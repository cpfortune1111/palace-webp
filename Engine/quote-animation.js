let prepared;
export function preloadQuoteAssets(){
 if(!prepared)prepared=fetch('./Data/Quote/venus.json?v=02376').then(response=>{if(!response.ok)throw Error('Quote manifest');return response.json()}).then(async manifest=>{const images=new Map(),sounds=new Map();await Promise.all(Object.entries(manifest.frames).map(async([key,entry])=>{const image=new Image();image.src='./'+entry.file+'?v=02376';await image.decode();images.set(key,image)}));await Promise.all([...new Set(Object.values(manifest.actions).flatMap(action=>action.cues.map(cue=>cue.file)))].map(async file=>{const response=await fetch('./'+file);if(!response.ok)throw Error('Quote voice '+file);sounds.set(file,URL.createObjectURL(await response.blob()))}));return {manifest,images,sounds}});
 return prepared;
}
export function quoteFrame(action,tick){
 const duration=action.frames.reduce((total,frame)=>total+Math.max(0,frame.ticks),0);let age=Math.max(0,tick);
 if(action.loop!==null&&age>=duration)age=action.loop+(age-action.loop)%(duration-action.loop);
 for(const frame of action.frames){if(frame.ticks<0||age<frame.ticks)return frame.sprite;age-=frame.ticks}
 return action.frames.at(-1).sprite;
}
export function quoteDuration(action){return Math.max(action.frames.reduce((total,frame)=>total+Math.max(0,frame.ticks),0),0,...action.cues.map(cue=>cue.tick+cue.duration))}
export function createQuotePortrait(){
 let assets,action='9000',tick=0,lastSprite,played=new Set(),clips=[];const canvas=document.createElement('canvas'),context=canvas.getContext('2d');
 canvas.dataset.quotePortrait='SailorVenus';
 const ready=preloadQuoteAssets().then(value=>{assets=value;render()});
 function set(next){for(const clip of clips)clip.pause();clips=[];action=String(next);tick=0;played.clear();lastSprite=undefined;render()}
 function render(){if(!assets)return;const key=quoteFrame(assets.manifest.actions[action],tick);if(key===lastSprite)return;lastSprite=key;const image=assets.images.get(key);canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;context.drawImage(image,0,0)}
 function step(amount=1,sound){if(!assets)return;tick+=amount;if(sound)for(const [index,cue] of assets.manifest.actions[action].cues.entries())if(tick>=cue.tick&&!played.has(index)){played.add(index);const clip=sound(new Audio(assets.sounds.get(cue.file)));clips.push(clip);clip.play().catch(error=>console.warn('Quote audio',error))}render()}
 function draw(context,x,y,width,height,alpha=1){if(!assets)return;context.save();context.globalAlpha*=alpha;const actualWidth=canvas.width/canvas.height*height;context.drawImage(canvas,x+(width-actualWidth)/2,y,actualWidth,height);context.restore()}
 return {ready,set,step,draw,canvas,get tick(){return tick},get action(){return action},get duration(){return assets?quoteDuration(assets.manifest.actions[action]):0},get playing(){return clips.some(clip=>!clip.ended&&!clip.paused)},stop:()=>{for(const clip of clips)clip.pause()},snapshot:()=>({action,tick,sprite:lastSprite})};
}

