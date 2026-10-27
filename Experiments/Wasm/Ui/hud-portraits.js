export function createHudPortraits(){
 const records=new Map(),pending=new Map();
 async function prepare(id){if(!pending.has(id))pending.set(id,(async()=>{const response=await fetch('./Data/HudFaces/'+id+'.json');if(!response.ok)throw Error('HUD portrait '+id);const data=await response.json(),images=[];await Promise.all(Object.values(data.sprites).map(async sprite=>{const image=new Image();image.src='./'+sprite.file;await image.decode();images[sprite.page]=image}));const record={data,images};records.set(id,record);return record})());return pending.get(id)}
 function frameAt(frames,tick){if(!frames?.length)return;let duration=frames.reduce((sum,frame)=>sum+Math.max(0,frame.time),0),age=duration?tick%duration:0;for(const frame of frames){if(frame.time<0||age<frame.time)return frame;age-=frame.time}return frames[0]}
 function draw(context,first,second,tick){for(const[index,actor]of [first,second].entries()){
  const record=records.get(actor.character);if(!record)continue;const other=index?first:second;
  let action=actor.life<=0?919:actor.life>0&&other.life<=0?916:actor.gettingHit&&!(actor.state>=120&&actor.state<=159)?917:actor.life<=actor.lifeMax/4?918:915;
  if(index)action+=10;const frame=frameAt(record.data.actions[String(action)],tick);if(!frame)continue;const sprite=record.data.sprites[frame.group+','+frame.item];if(!sprite)continue;
  const flip=String(frame.flip||'').toUpperCase();context.save();context.globalAlpha=1;context.translate(index?1202:78,123);context.scale(.75*(flip.includes('H')?-1:1),.75*(flip.includes('V')?-1:1));context.drawImage(record.images[sprite.page],-sprite.axisX+frame.ox,-sprite.axisY+frame.oy,sprite.w,sprite.h);context.restore();
 }}
 return {prepare,draw};
}
