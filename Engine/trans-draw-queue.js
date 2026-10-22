export function createTransDrawQueue(){
 const entries=[];
 return {
  reset(){entries.length=0},
  record(context,source,args,{state=null,paletteEffect=null,priority=0,ontop=false,layer=ontop?1:0,under=false,syncId=0,syncLayer=0,kind='sprite',opacity=context.globalAlpha}={}){
   const matrix=context.getTransform();
   entries.push({source,args:[...args],matrix:[matrix.a,matrix.b,matrix.c,matrix.d,matrix.e,matrix.f],state:state?{type:state.type,alpha:[...state.alpha]}:null,paletteEffect:paletteEffect?{...paletteEffect,add:[...paletteEffect.add],mul:[...paletteEffect.mul]}:null,priority,ontop,layer,under,syncId,syncLayer,kind,opacity,composite:context.globalCompositeOperation,serial:entries.length});
  },
  ordered({layer,under}={}){
   const selected=entries.filter(entry=>(layer===undefined||entry.layer===layer)&&(layer!==0||under===undefined||entry.under===under));
   if(layer===undefined)return selected.sort((left,right)=>Number(left.ontop)-Number(right.ontop)||left.priority-right.priority||left.serial-right.serial);
   const groups=new Map(),firstById=new Map();
   for(const [index,entry] of selected.entries()){
    if(entry.syncId>0&&!firstById.has(entry.syncId))firstById.set(entry.syncId,index);
    groups.set(entry,entry.syncId>0?firstById.get(entry.syncId):index);
   }
   return selected.sort((left,right)=>left.priority-right.priority||groups.get(right)-groups.get(left)||(left.syncId>0&&left.syncId===right.syncId?left.syncLayer-right.syncLayer:0)||right.serial-left.serial);
  },
  bounds(entry,width,height){
   const args=entry.args,source=entry.source;
   const rectangle=args.length===2?[args[0],args[1],source.width,source.height]:args.length===4?args:args.slice(4);
   const [left,top,drawWidth,drawHeight]=rectangle,[scaleX,shearY,shearX,scaleY,offsetX,offsetY]=entry.matrix;
   const corners=[[left,top],[left+drawWidth,top],[left,top+drawHeight],[left+drawWidth,top+drawHeight]].map(([x,y])=>[scaleX*x+shearX*y+offsetX,shearY*x+scaleY*y+offsetY]);
   const x=Math.max(0,Math.floor(Math.min(...corners.map(point=>point[0])))-1),y=Math.max(0,Math.floor(Math.min(...corners.map(point=>point[1])))-1);
   const right=Math.min(width,Math.ceil(Math.max(...corners.map(point=>point[0])))+1),bottom=Math.min(height,Math.ceil(Math.max(...corners.map(point=>point[1])))+1);
   return {x,y,width:Math.max(0,right-x),height:Math.max(0,bottom-y)};
  },
  rasterize(entry,context){
   context.save();context.setTransform(1,0,0,1,0,0);context.clearRect(0,0,context.canvas.width,context.canvas.height);context.setTransform(...entry.matrix);context.globalAlpha=entry.opacity;context.globalCompositeOperation='source-over';context.drawImage(entry.source,...entry.args);context.restore();
  },
 };
}
