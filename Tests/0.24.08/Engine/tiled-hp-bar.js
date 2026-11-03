export function createTiledHPBar(){
 let data,tile,masks,staticLayers;const layers=new Map();
 const ready=(async()=>{const url=new URL('../Data/Fight/hp-tile.json?v=02408r29',import.meta.url),response=await fetch(url);if(!response.ok)throw Error('HP tile data HTTP '+response.status);data=await response.json();const load=async name=>{const image=new Image();image.src=new URL(name,url).href;await image.decode();return image};[tile,masks,staticLayers]=await Promise.all([load(data.tile),load(data.masks),load(data.layers)]);for(const [id,f]of Object.entries(data.variants)){const canvas=document.createElement('canvas');canvas.width=f.w;canvas.height=f.h;const ctx=canvas.getContext('2d');layers.set(Number(id),{canvas,ctx,pattern:ctx.createPattern(tile,'repeat-x'),matrix:new DOMMatrix(),time:null})}})();
 function draw(ctx,{variant=1,amount=1,x=0,y=0,facing=1,time=performance.now()/1000}={}){
  if(!data||!Number.isFinite(amount)||amount<=0)return false;const id=Math.min(4,Math.max(1,Math.trunc(variant)||1)),f=data.variants[id],layer=layers.get(id);if(!layer)return false;
  if(layer.time!==time){const c=layer.ctx;c.clearRect(0,0,f.w,f.h);const phase=((time*data.speed)%tile.width+tile.width)%tile.width;layer.matrix.e=-phase;layer.pattern.setTransform(layer.matrix);c.fillStyle=layer.pattern;c.fillRect(0,0,f.w,f.h);c.globalCompositeOperation='destination-in';c.drawImage(masks,f.x,f.y,f.w,f.h,0,0,f.w,f.h);c.globalCompositeOperation='source-over';layer.time=time}
  const ratio=Math.min(1,amount);ctx.save();ctx.translate(x,y);ctx.scale(facing,1);ctx.beginPath();ctx.rect(f.left+f.w*(1-ratio),f.top,f.w*ratio,f.h);ctx.clip();ctx.drawImage(layer.canvas,f.left,f.top);ctx.restore();return true;
 }
 function drawLayer(ctx,kind,{variant=1,amount=1,x=0,y=0,facing=1}={}){
  if(!staticLayers||amount<=0)return false;const id=Math.min(4,Math.max(1,Math.trunc(variant)||1)),f=data.variants[id],bounds=data.layerBounds;ctx.save();ctx.translate(x,y);ctx.scale(facing,1);
  if(kind===2){const ratio=Math.min(1,amount);ctx.beginPath();ctx.rect(f.left+f.w*(1-ratio),f.top,f.w*ratio,f.h);ctx.clip()}
  ctx.drawImage(staticLayers,0,(id-1)*bounds.h*3+kind*bounds.h,bounds.w,bounds.h,bounds.left,bounds.top,bounds.w,bounds.h);ctx.restore();return true;
 }
 return {ready,draw,drawBackground:(c,o)=>drawLayer(c,0,o),drawFrame:(c,o)=>drawLayer(c,1,o),drawTrail:(c,o)=>drawLayer(c,2,o),snapshot:()=>({ready:!!tile,variants:data?Object.keys(data.variants).map(Number):[],speed:data?.speed,tile:tile?[tile.width,tile.height]:null,layerBytes:[...layers.values()].reduce((n,v)=>n+v.canvas.width*v.canvas.height*4,0)})};
}
