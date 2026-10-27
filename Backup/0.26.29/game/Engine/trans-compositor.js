import {transBlendPasses,quantizeBlendValue} from './trans-blend.js?v=02483';

export function grayscaleTransPixels(source){
 if(source.length%4)throw Error('Trans grayscale input must contain RGBA pixels');
 const result=new Float32Array(source.length);
 for(let offset=0;offset<source.length;offset+=4){
  const gray=(source[offset]+source[offset+1]+source[offset+2])/3;
  result[offset]=result[offset+1]=result[offset+2]=gray;result[offset+3]=source[offset+3];
 }
 return result;
}

export function compositeOpaqueTransPixels(destination,source,state,{graySource,passSources,passes=transBlendPasses(state),quantize=true}={}){
 if(destination.length!==source.length||destination.length%4)throw Error('Trans pixel surfaces must have matching RGBA lengths');
 if(graySource&&graySource.length!==source.length)throw Error('Trans grayscale surface must match source');
 if(passSources&&(passSources.length!==passes.length||passSources.some(pixels=>pixels.length!==source.length)))throw Error('Trans per-pass sources must match the blend plan and surface');
 const result=new Uint8ClampedArray(destination);
 const needsGray=passes.some(pass=>pass.gray);
 for(let offset=0;offset<source.length;offset+=4){
  if(source[offset+3]===0)continue;
  if(destination[offset+3]!==255)throw Error('Trans composition requires an opaque resolved destination');
  if(needsGray&&!graySource&&!passSources)throw Error('SubAdd requires a shader-equivalent grayscale source');
  for(let channel=0;channel<3;channel++){
   let value=destination[offset+channel];
   for(let passIndex=0;passIndex<passes.length;passIndex++){
    const pass=passes[passIndex],pixel=passSources?passSources[passIndex]:pass.gray?graySource:source,alpha=Math.max(0,Math.min(1,pixel[offset+3]*pass.amount/255));
    const retained=pass.destinationFactor==='one'?1:1-alpha;
    const contribution=pass.sourceFactor==='zero'?0:Math.max(0,Math.min(255,pixel[offset+channel]))*alpha;
    value=Math.max(0,Math.min(255,value*retained+(pass.equation==='subtract'?-contribution:contribution)));
    if(quantize)value=quantizeBlendValue(value);
   }
   result[offset+channel]=value;
  }
 }
 return result;
}

export function compositeOpaqueTransCanvas(destination,source,state,options={}){
 const width=destination.canvas.width,height=destination.canvas.height;
 if(source.canvas.width!==width||source.canvas.height!==height)throw Error('Trans canvas surfaces must have matching sizes');
 const region=options.region||{x:0,y:0,width,height};
 if(!region.width||!region.height)return;
 const target=destination.getImageData(region.x,region.y,region.width,region.height),input=source.getImageData(region.x,region.y,region.width,region.height);
 const shader=options.shader?.(input.data,state)||{};
 target.data.set(compositeOpaqueTransPixels(target.data,shader.source||input.data,state,{...options,...shader}));
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

export function renderOpaqueTransQueue(destination,scratch,queue,{grayscale,shader,layer,under,phase}={}){
 if(destination.canvas.width!==scratch.canvas.width||destination.canvas.height!==scratch.canvas.height)throw Error('Trans draw queue surfaces must have matching sizes');
 for(const entry of queue.ordered({layer,under,phase})){
  queue.rasterize(entry,scratch);
  if(!entry.state||entry.state.type==='default'){
   destination.save();destination.setTransform(1,0,0,1,0,0);destination.globalAlpha=1;destination.globalCompositeOperation=entry.composite;destination.drawImage(scratch.canvas,0,0);destination.restore();
  }else{
   const region=queue.bounds(entry,destination.canvas.width,destination.canvas.height);
   if(!region.width||!region.height)continue;
   const options=entry.state.type==='subadd'?{region,graySource:grayscale?.(entry,scratch,region)}:{region};
   if(shader)options.shader=(pixels,state)=>shader(entry,pixels,state);
   compositeOpaqueTransCanvas(destination,scratch,entry.state,options);
  }
 }
}
