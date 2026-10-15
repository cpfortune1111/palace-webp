export function helperKeyControl(value,{split,evaluate}){
 const enabled=[false,false,false,true];
 if(value===undefined)return enabled;
 const expressions=split(value);
 if(expressions.length>4)throw Error('Helper keyctrl accepts at most four components');
 for(const expression of expressions){
  const index=Math.trunc(Number(evaluate(expression)))|0;
  if(index>0&&index<=4)enabled[index-1]=true;
 }
 return enabled;
}

export function helperCommandAllowed(actor){return actor.kind!=='helper'||!!actor.keyControl?.[0]}

export function helperNegativeStates(actor,{ownState=!actor.stateOwner}={}){
 const states=[],flags=actor.keyControl||[false,false,false,true],playerType=actor.helperType===2;
 if(ownState&&(playerType||flags[2]))states.push(-3);
 if(playerType||flags[1])states.push(-2);
 if(ownState&&flags[0])states.push(-1);
 return states;
}
