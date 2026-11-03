export function createTiledHPBar(){
 let data,tile,masks,staticLayers;const layers=new Map();
 const ready=(async()=>{const url=new URL('../Data/Fight/hp-tile.json?v=02408r30',import.meta.url),response=await fetch(url);if(!response.ok)throw Error('HP tile data HTTP '+response.status);data=await response.json();const load=async name=>{const image=new Image();image.src=new URL(name,url).href;await image.decode();return image};[tile,masks,staticLayers]=await Promise.all([load(data.tile),load(data.masks),load(data.layers)]);for(const [id,f]of Object.entries(data.variants)){const canvas=document.createElement('canvas');canvas.width=f.w;canvas.height=f.h;const ctx=canvas.getContext('2d');layers.set(Number(id),{canvas,ctx,pattern:ctx.createPattern(tile,'repeat-x'),matrix:new DOMMatrix(),time:null})}})();
 function clipSegments(ctx,f,{amount=1,amounts,segment},paint){
  let painted=false;for(const [index,bounds]of f.segments.entries()){if(segment!==undefined&&index!==segment)continue;const value=Number(amounts?.[index]??amount),ratio=Number.isFinite(value)?Math.max(0,Math.min(1,value)):0;if(ratio<=0)continue;
   ctx.save();ctx.beginPath();ctx.rect(bounds.right-(bounds.right-bounds.left)*ratio,f.top,(bounds.right-bounds.left)*ratio,f.h);ctx.clip();paint();ctx.restore();painted=true;
  }return painted;
 }
 function draw(ctx,{variant=1,amount=1,amounts,segment,x=0,y=0,facing=1,time=performance.now()/1000}={}){
  if(!data)return false;const id=Math.min(4,Math.max(1,Math.trunc(variant)||1)),f=data.variants[id],layer=layers.get(id);if(!layer)return false;
  if(layer.time!==time){const c=layer.ctx;c.clearRect(0,0,f.w,f.h);const phase=((time*data.speed)%tile.width+tile.width)%tile.width;layer.matrix.e=-phase;layer.pattern.setTransform(layer.matrix);c.fillStyle=layer.pattern;c.fillRect(0,0,f.w,f.h);c.globalCompositeOperation='destination-in';c.drawImage(masks,f.x,f.y,f.w,f.h,0,0,f.w,f.h);c.globalCompositeOperation='source-over';layer.time=time}
  ctx.save();ctx.translate(x,y);ctx.scale(facing,1);const painted=clipSegments(ctx,f,{amount,amounts,segment},()=>ctx.drawImage(layer.canvas,f.left,f.top));ctx.restore();return painted;
 }
 function drawLayer(ctx,kind,{variant=1,amount=1,amounts,segment,x=0,y=0,facing=1}={}){
  if(!staticLayers)return false;const id=Math.min(4,Math.max(1,Math.trunc(variant)||1)),f=data.variants[id],bounds=data.layerBounds;ctx.save();ctx.translate(x,y);ctx.scale(facing,1);
  const paint=()=>ctx.drawImage(staticLayers,0,(id-1)*bounds.h*3+kind*bounds.h,bounds.w,bounds.h,bounds.left,bounds.top,bounds.w,bounds.h);const painted=kind===2?clipSegments(ctx,f,{amount,amounts,segment},paint):(paint(),true);ctx.restore();return painted;
 }
 return {ready,draw,drawBackground:(c,o)=>drawLayer(c,0,o),drawFrame:(c,o)=>drawLayer(c,1,o),drawTrail:(c,o)=>drawLayer(c,2,o),snapshot:()=>({ready:!!tile,variants:data?Object.keys(data.variants).map(Number):[],segments:data?Object.fromEntries(Object.entries(data.variants).map(([k,v])=>[k,v.segments.map(s=>({...s}))])):{},speed:data?.speed,tile:tile?[tile.width,tile.height]:null,layerBytes:[...layers.values()].reduce((n,v)=>n+v.canvas.width*v.canvas.height*4,0)})};
}
