function soundWeights(count){
 const weights=[1];let value=1;for(let index=1;index<count;index++){value*= (count-index)/index;value=-value;weights.push(value)}return weights;
}

export function createSoundResampler(source,{ratio,quality=4}){
 if(!Number.isInteger(quality)||quality<1||quality>64)throw Error('Invalid sound resampling quality');
 const validRatio=value=>{if(!Number.isFinite(value)||value<=0)throw Error('Invalid sound resampling ratio')};validRatio(ratio);
 const pointCount=quality*2,weights=Array.from({length:pointCount+1},(_,count)=>count?soundWeights(count):[]);
 let previous=Array.from({length:512},()=>[0,0]),current=Array.from({length:512},()=>[0,0]),offset=-512,position=0,end=Number.MAX_SAFE_INTEGER;
 function sampleAt(frame,channel){return frame<offset?previous[frame-(offset-512)][channel]:current[frame-offset][channel]}
 return {
  read(count){
   if(!Number.isInteger(count)||count<0)throw Error('Invalid resampled sound read size');
   const samples=[];
   while(samples.length<count){
    const wanted=position*ratio;let start=Math.trunc(wanted)-Math.trunc((pointCount-1)/2),stop=Math.trunc(wanted)+pointCount/2+1;
    while(stop>offset+512){
     const chunk=source.read(512);for(let index=0;index<chunk.samples.length;index++){previous[index][0]=chunk.samples[index][0];previous[index][1]=chunk.samples[index][1]}
     if(chunk.samples.length<512)end=offset+512+chunk.samples.length;
     [previous,current]=[current,previous];offset+=512;
    }
    if(Math.trunc(wanted)>=end)return {samples,ok:samples.length>0};
    start=Math.max(start,0);stop=Math.min(stop,end);const size=stop-start,distance=wanted-start,output=[];
    for(let channel=0;channel<2;channel++){
     if(size===1){output.push(sampleAt(start,channel));continue}
     const node=Math.trunc(distance);if(distance===node&&node>=0&&node<size){output.push(sampleAt(start+node,channel));continue}
     let numerator=0,denominator=0;for(let index=0;index<size;index++){const value=weights[size][index]/(distance-index);numerator+=value*sampleAt(start+index,channel);denominator+=value}
     output.push(numerator/denominator);
    }
    samples.push(output);position++;
   }
   return {samples,ok:true};
  },
  setRatio(next){validRatio(next);position*=ratio/next;ratio=next},
  ratio:()=>ratio,
  error:()=>source.error()
 };
}
