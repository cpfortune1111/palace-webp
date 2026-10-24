export function soundRepeatCount(playCount){return playCount<0?-1:Math.max(0,playCount-1)}

export function createSoundSampleLooper(source,{repeatCount=0,loopStart=0,loopEnd=0}={}){
 let repeats=repeatCount,failure=null;
 const start=loopStart<0||loopStart>=source.length?0:loopStart,end=loopEnd<=start||loopEnd>=source.length?source.length:loopEnd;
 return {
  read(count){
   if(!Number.isInteger(count)||count<0)throw Error('Invalid sound sample read size');
   if(failure)return {samples:[],ok:false};
   if(repeats===0)return source.read(count);
   if(source.length===0)throw Error('Cannot loop empty sound');
   const samples=[];
   while(samples.length<count){
    const available=end-source.position;
    if(available<=0){
     if(repeats===0)return {samples,ok:false};
     if(repeats>0)repeats--;
     failure=source.seek(start);if(failure)return {samples,ok:true};
     continue;
    }
    const requested=Math.min(count-samples.length,available),chunk=source.read(requested);
    for(const sample of chunk.samples)samples.push(sample);
    if(chunk.samples.length<requested||!chunk.ok){failure=source.error();return {samples,ok:samples.length>0}}
   }
   return {samples,ok:true};
  },
  position:()=>source.position,
  remaining:()=>repeats,
  error:()=>source.error()
 };
}
