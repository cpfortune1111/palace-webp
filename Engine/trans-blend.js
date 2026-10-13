export function transBlendPasses({type,alpha},{invertBlend=0,negative=false}={}){
 const source=Math.max(0,Math.min(1,alpha[0]/255)),destination=type==='none'?0:Math.max(0,Math.min(1,alpha[1]/255));
 const add=invertBlend>=1?'subtract':'add',subtract=invertBlend>=1?'add':'subtract',passes=[];
 const pass=(equation,sourceFactor,destinationFactor,amount,gray=false)=>passes.push({equation,sourceFactor,destinationFactor,amount,gray});
 if(type==='subadd'){
  if(destination>0)pass(negative?'add':'subtract','source-alpha','one',destination,true);
  if(source>0)pass(negative?'subtract':'add','source-alpha','one',source);
 }else if(type==='sub'){
  if(source===0&&destination===1)return passes;
  if(destination<1)pass('add','zero','one-minus-source-alpha',1-destination);
  if(source>0)pass(subtract,'source-alpha','one',source);
 }else{
  if(source===0&&destination===1)return passes;
  if(source===1&&destination===0)pass('add','source-alpha','one-minus-source-alpha',1);
  else if(source===1&&destination===1)pass(add,'source-alpha','one',1);
  else{
   if(destination<1)pass(add,'zero','one-minus-source-alpha',1-destination);
   if(source>0)pass(invertBlend>=1&&destination===1?'subtract':'add','source-alpha','one',source);
  }
 }
 return passes;
}

export function blendPixel(destination,source,passes,{graySource=source}={}){
 let result=[...destination];
 for(const pass of passes){
  const pixel=pass.gray?graySource:source,alpha=pixel[3]*pass.amount/255;
  const retained=pass.destinationFactor==='one'?1:1-alpha;
  result=result.map((value,channel)=>{
   const contribution=pass.sourceFactor==='zero'?0:pixel[channel]*alpha;
   return Math.max(0,Math.min(255,value*retained+(pass.equation==='subtract'?-contribution:contribution)));
  });
 }
 return result;
}