// One trimmed neutral animation, cached colour ramps. No pixel reads in draw().
const aliases={sailormoon:'Moon',moon:'Moon',supersailormoon:'SuperMoon',sailorsupermoon:'SuperMoon',supermoon:'SuperMoon',sailormercury:'Mercury',mercury:'Mercury',sailormars:'Mars',mars:'Mars',sailorjupiter:'Jupiter',jupiter:'Jupiter',sailorvenus:'Venus',venus:'Venus',sailorpluto:'Pluto',pluto:'Pluto',sailorneptune:'Neptune',neptune:'Neptune',sailoruranus:'Uranus',uranus:'Uranus',sailorcmoon:'CMoon',sailorchibimoon:'CMoon',chibimoon:'CMoon',cmoon:'CMoon',sailorsaturn:'Saturn',saturn:'Saturn',ladyswatheshia:'LSwatheshia',ladyswathesia:'LSwatheshia',lswatheshia:'LSwatheshia',tuxedomask:'TuxedoMask',txuedomask:'TuxedoMask',txuedo:'TuxedoMask',tuxedo:'TuxedoMask'};
export function sparkRole(name){return aliases[String(name).toLowerCase().replace(/[^a-z]/g,'')]||'Moon'}
export function floatSparkVariant(team){return Number(team)===2?953:951}
export function createSuperSparks(){
 let data;const cache=new Map();let decodedBytes=0;
 const ready=(async()=>{
  const url=new URL('../Data/Fight/super-spark.json?v=02408r24',import.meta.url),response=await fetch(url);if(!response.ok)throw Error('Super spark data HTTP '+response.status);data=await response.json();
  const image=new Image();image.src=new URL(data.atlas,url).href;await image.decode();
  const original=document.createElement('canvas');original.width=image.width;original.height=image.height;const source=original.getContext('2d',{willReadFrequently:true});source.drawImage(image,0,0);
  const neutral=data.frames.map(f=>f.empty?null:source.getImageData(f.x,f.y,f.w,f.h));
  for(const [role,profile]of Object.entries(data.profiles))for(const variant of [951,953]){
   const ramp=profile[String(variant)],table=Array.from({length:256},(_,n)=>ramp.offset.map((v,c)=>Math.max(0,Math.min(255,Math.round(v+ramp.slope[c]*n/255)))));
   cache.set(role+':'+variant,data.frames.map((f,i)=>{
    if(f.empty)return null;const canvas=document.createElement('canvas');canvas.width=f.w;canvas.height=f.h;const ctx=canvas.getContext('2d'),pixels=new ImageData(new Uint8ClampedArray(neutral[i].data),f.w,f.h);
    for(let p=0;p<pixels.data.length;p+=4){const rgb=table[pixels.data[p]];for(let c=0;c<3;c++)pixels.data[p+c]=pixels.data[p+3]?rgb[c]:0}
    ctx.putImageData(pixels,0,0);decodedBytes+=f.w*f.h*4;return canvas;
   }));
  }
 })();
 function frameAt(age){let tick=((Math.floor(age)%data.duration)+data.duration)%data.duration;for(let i=0;i<data.frames.length;i++){if(tick<data.frames[i].time)return i;tick-=data.frames[i].time}return 0}
 return {ready,draw(ctx,{character,variant=953,age=0,x=0,y=0,scale=1,alpha=1}={}){
  if(!data||alpha<=0)return false;const i=frameAt(age),frame=data.frames[i],canvas=cache.get(sparkRole(character)+':'+variant)?.[i];if(!canvas)return false;
  ctx.save();ctx.globalAlpha*=Math.max(0,Math.min(1,alpha));ctx.translate(x,y);ctx.scale(scale,scale);ctx.drawImage(canvas,frame.dx,frame.dy);ctx.restore();return true;
 },floatSpec:()=>data?.float,snapshot:()=>({ready:!!data,styles:cache.size,decodedBytes,frames:data?.frames.length,atlas:data?.atlas}),frameAt:age=>data?frameAt(age):-1};
}
