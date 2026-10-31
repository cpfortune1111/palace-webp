// SNES / 1v1 equivalent of the shared Venus H950/H951 rules.
export function superIndicatorReady(life,lifeMax,remainingTicks,elapsedTicks){
 return life>0&&(life<=lifeMax/4||remainingTicks!==null&&remainingTicks>=0&&remainingTicks<=elapsedTicks/5);
}
export function sharedEmblemLayers(data,life,lifeMax,remainingTicks,elapsedTicks){
 if(life<=0)return [952];
 if(!superIndicatorReady(life,lifeMax,remainingTicks,elapsedTicks))return [950];
 return [950,953];
}
export function createSuperIndicatorTracker(onReady){
 const last=[false,false],ages=[0,0];
 return {reset:()=>{last.fill(false);ages.fill(0)},step:(fighters,remainingTicks,elapsedTicks,active=true)=>{
  for(const [index,f]of fighters.entries()){
   const ready=superIndicatorReady(f.life,f.lifeMax,remainingTicks,elapsedTicks);
   if(ready&&last[index])ages[index]++;
   if(!ready)ages[index]=0;
   if(active&&ready&&!last[index]){ages[index]=0;onReady(index+1)}
   if(active||!ready)last[index]=ready;
  }
 },snapshot:()=>[...last],ages:()=>[...ages]};
}
