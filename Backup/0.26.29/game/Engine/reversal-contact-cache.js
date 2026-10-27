export function createReversalContactCache(){
 let tick=null,definitions=new WeakMap();
 return {
  begin(next){if(tick!==next){tick=next;definitions=new WeakMap()}},
  get(source,target,sourceKey,targetKey){return definitions.get(source)?.get(target)?.get(sourceKey)?.get(targetKey)},
  set(source,target,sourceKey,targetKey,value){
   if(typeof value!=='boolean')throw Error('Invalid reversal contact decision');
   let targets=definitions.get(source);if(!targets){targets=new WeakMap();definitions.set(source,targets)}
   let owners=targets.get(target);if(!owners){owners=new Map();targets.set(target,owners)}
   let recipients=owners.get(sourceKey);if(!recipients){recipients=new Map();owners.set(sourceKey,recipients)}
   recipients.set(targetKey,value);
  },
  clear(){tick=null;definitions=new WeakMap()}
 };
}
