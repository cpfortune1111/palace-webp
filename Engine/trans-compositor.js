import {blendPixel,transBlendPasses} from './trans-blend.js';

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
 const target=destination.getImageData(0,0,width,height),input=source.getImageData(0,0,width,height);
 target.data.set(compositeOpaqueTransPixels(target.data,input.data,state,options));
 destination.putImageData(target,0,0);
}