let prepared;
export function preloadMoonDeclaration(){
 if(!prepared)prepared=Promise.all(['./Char/Moon/Battle/moon_full.json','./Char/Moon/Battle/moon_runtime.json','./Char/Moon/Sound/sounds.json'].map(file=>fetch(file).then(response=>{if(!response.ok)throw Error('Moon declaration '+file);return response.json()}))).then(async([data,runtime,sounds])=>{
  const image=new Image();image.src='./Char/Moon/Select/portrait.webp';await image.decode();const actions={},clips=new Map();
  const start=(frames,element)=>frames.slice(0,element-1).reduce((total,frame)=>total+Math.max(0,frame.time),0);
  for(const state of [191,192]){const frames=data.actions[String(runtime.states[state].anim)],cues=[0,1].map((item,index)=>({tick:start(frames,index===0?8:state===191?31:40),key:state+'-'+item}));actions[state]={cues}}
  for(const item of [0,1])actions['180-'+item]={cues:[{tick:start(data.actions['181'],7),key:'180-'+item}]};
  actions['170']={cues:[{tick:0,key:'170-0'}]};
  for(const action of Object.values(actions)){action.duration=Math.max(...action.cues.map(cue=>cue.tick+(sounds[cue.key]?.ticks||0)));for(const cue of action.cues){if(clips.has(cue.key))continue;const response=await fetch('./Char/Moon/Sound/'+sounds[cue.key].file);if(!response.ok)throw Error('Moon declaration sound '+cue.key);clips.set(cue.key,URL.createObjectURL(await response.blob()))}}
  return {image,actions,clips};
 });
 return prepared;
}
export function createMoonDeclarationPortrait(){
 let assets,action='ready',tick=0,played=new Set(),clips=[];
 const ready=preloadMoonDeclaration().then(value=>{assets=value});
 function stop(){clips.forEach(clip=>clip.pause());clips=[]}
 function set(next){stop();action=String(next);tick=0;played.clear()}
 function step(amount=1,sound){tick+=amount;if(!assets||!sound)return;for(const [index,cue] of (assets.actions[action]?.cues||[]).entries())if(tick>=cue.tick&&!played.has(index)){played.add(index);const clip=sound(new Audio(assets.clips.get(cue.key)));clips.push(clip);clip.play().catch(()=>{})}}
 function draw(context,x,y,width,height,alpha=1,facing=1){if(!assets)return;const drawWidth=assets.image.naturalWidth/ assets.image.naturalHeight*height;context.save();context.globalAlpha*=alpha;context.translate(x+width/2,y+height);context.scale(facing,1);context.drawImage(assets.image,-drawWidth/2,-height,drawWidth,height);context.restore()}
 return {ready,set,step,draw,stop,get playing(){return clips.some(clip=>!clip.ended&&!clip.paused)},snapshot:()=>({action,tick,width:1280,height:720,character:'SailorMoon',static:true})};
}
