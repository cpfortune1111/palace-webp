import {blendPixel,transBlendPasses} from './trans-blend.js';

export function grayscaleTransPixels(source){
 if(source.length%4)throw Error('Trans grayscale input must contain RGBA pixels');
 const result=new Float32Array(source.length);
 for(let offset=0;offset<source.length;offset+=4){
  const gray=(source[offset]+source[offset+1]+source[offset+2])/3;
  result[offset]=result[offset+1]=result[offset+2]=gray;result[offset+3]=source[offset+3];
 }
 return result;
}

export function compositeOpaqueTransPixels(destination,source,state,{graySource,passes=transBlendPasses(state)}={}){
 if(destination.length!==source.length||destination.length%4)throw Error('Trans pixel surfaces must have matching RGBA lengths');
 if(graySource&&graySource.length!==source.length)throw Error('Trans grayscale surface must match source');
 const result=new Uint8ClampedArray(destination);
 for(let offset=0;offset<source.length;offset+=4){
  if(source[offset+3]===0)continue;
  if(destination[offset+3]!==255)throw Error('Trans composition requires an opaque resolved destination');
  if(passes.some(pass=>pass.gray)&&!graySource)throw Error('SubAdd requires a shader-equivalent grayscale source');
  const color=blendPixel([...destination.slice(offset,offset+3)],[...source.slice(offset,offset+4)],passes,{graySource:graySource?[...graySource.slice(offset,offset+4)]:undefined});
  for(let channel=0;channel<3;channel++)result[offset+channel]=color[channel];
 }
 return result;
}

export function compositeOpaqueTransCanvas(destination,source,state,options={}){
 const width=destination.canvas.width,height=destination.canvas.height;
 if(source.canvas.width!==width||source.canvas.height!==height)throw Error('Trans canvas surfaces must have matching sizes');
 const region=options.region||{x:0,y:0,width,height};
 if(!region.width||!region.height)return;
 const target=destination.getImageData(region.x,region.y,region.width,region.height),input=source.getImageData(region.x,region.y,region.width,region.height);
 target.data.set(compositeOpaqueTransPixels(target.data,input.data,state,options));
 destination.putImageData(target,region.x,region.y);
}

export function compositeOpaqueTransLayers(destination,layers){
 let result=new Uint8ClampedArray(destination);
 for(const layer of layers){
  if(layer.hidden)continue;
  result=compositeOpaqueTransPixels(result,layer.pixels,layer.state,layer.options);
 }
 return result;
}

export function renderOpaqueTransQueue(destination,scratch,queue,{grayscale}={}){
 if(destination.canvas.width!==scratch.canvas.width||destination.canvas.height!==scratch.canvas.height)throw Error('Trans draw queue surfaces must have matching sizes');
 for(const entry of queue.ordered()){
  queue.rasterize(entry,scratch);
  if(!entry.state||entry.state.type==='default'){
   destination.save();destination.setTransform(1,0,0,1,0,0);destination.globalAlpha=1;destination.globalCompositeOperation=entry.composite;destination.drawImage(scratch.canvas,0,0);destination.restore();
  }else{
   const region=queue.bounds(entry,destination.canvas.width,destination.canvas.height);
   if(!region.width||!region.height)continue;
   const options=entry.state.type==='subadd'?{region,graySource:grayscale?.(entry,scratch,region)}:{region};
   compositeOpaqueTransCanvas(destination,scratch,entry.state,options);
  }
 }
}