export function transBlendPasses({type,alpha},{invertBlend=0,negative=false}={}){
 const source=Math.max(0,Math.min(1,alpha[0]/255)),destination=type==='none'?0:Math.max(0,Math.min(1,alpha[1]/255));
 const add=invertBlend>=1?'subtract':'add',subtract=invertBlend>=1?'add':'subtract',passes=[];
 const pass=(equation,sourceFactor,destinationFactor,amount,gray=false,flags={})=>passes.push({equation,sourceFactor,destinationFactor,amount,gray,...flags});
 const invertFlags={invertAdd:invertBlend>=1,disableNegative:invertBlend===3};
 if(type==='subadd'){
  if(destination>0)pass(negative?'add':'subtract','source-alpha','one',destination,true,{disableNegative:negative});
  if(source>0)pass(negative?'subtract':'add','source-alpha','one',source,false,{disableNegative:negative});
 }else if(type==='sub'){
  if(source===0&&destination===1)return passes;
  if(destination<1)pass('add','zero','one-minus-source-alpha',1-destination);
  if(source>0)pass(subtract,'source-alpha','one',source,false,invertFlags);
 }else{
  if(source===0&&destination===1)return passes;
  if(source===1&&destination===0)pass('add','source-alpha','one-minus-source-alpha',1);
  else if(source===1&&destination===1)pass(add,'source-alpha','one',1,false,invertFlags);
  else{
   if(destination<1)pass(add,'zero','one-minus-source-alpha',1-destination);
   if(source>0)pass(invertBlend>=1&&destination===1?'subtract':'add','source-alpha','one',source,false,{invertAdd:invertBlend>=2&&destination===1,disableNegative:invertBlend===3&&destination===1});
  }
 }
 return passes;
}

export function quantizeBlendValue(value){const integer=Math.floor(value),fraction=value-integer;return integer+(fraction>0.5||fraction===0.5&&(integer&1)?1:0)}

export function blendPixel(destination,source,passes,{graySource=source,quantize=false}={}){
 let result=[...destination];
 for(const pass of passes){
  const pixel=pass.gray?graySource:source,alpha=Math.max(0,Math.min(1,pixel[3]*pass.amount/255));
  const retained=pass.destinationFactor==='one'?1:1-alpha;
  result=result.map((value,channel)=>{
   const contribution=pass.sourceFactor==='zero'?0:Math.max(0,Math.min(255,pixel[channel]))*alpha;
   const blended=Math.max(0,Math.min(255,value*retained+(pass.equation==='subtract'?-contribution:contribution)));
   return quantize?quantizeBlendValue(blended):blended;
  });
 }
 return result;
}