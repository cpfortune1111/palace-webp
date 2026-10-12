export function applyAttackDistanceController(controller,actor,api){
 if(controller.type.toLowerCase()!=='attackdist')return false;
 const params=controller.params||controller;
 const target=params.redirectid===undefined?actor:api.findActor(Math.trunc(Number(api.evaluate(params.redirectid)))|0);
 if(!target)return true;
 const scale=(actor.localScale??1)/(target.localScale??1);
 const changes=[];
 for(const [parameter,axis] of [['value','x'],['width','x'],['height','y'],['depth','z']]){
  if(params[parameter]===undefined)continue;
  const expressions=api.splitPair(params[parameter]);
  if(expressions.length>2)throw Error('AttackDist '+parameter+' expects at most two values');
  const values=expressions.map(expression=>Math.max(0,Math.fround(Math.fround(Number(api.evaluate(expression)))*scale)));
  changes.push([axis,values]);
 }
 for(const [axis,values] of changes){
  target.hitDef.guardDistance[axis][0]=values[0];
  if(values.length>1)target.hitDef.guardDistance[axis][1]=values[1];
 }
 return true;
}

export function withinAttackGuardDistance(attacker,defender,range){
 if(attacker.moveType!=='A')return false;
 const x=(defender.x-attacker.x)*attacker.facing,y=defender.y-attacker.y,z=(defender.z??0)-(attacker.z??0);
 return x<range.x[0]&&x>-range.x[1]&&(y===0||y>-range.y[0]&&y<range.y[1])&&(z===0||z>-range.z[0]&&z<range.z[1]);
}

export function applyHitDefGuardDistance(params,range,api){
 for(const [parameter,axis] of [['guard.dist','x'],['guard.dist.width','x'],['guard.dist.height','y'],['guard.dist.depth','z']]){
  if(params[parameter]===undefined)continue;
  const expressions=api.splitPair(params[parameter]);
  if(expressions.length>2)throw Error('HitDef '+parameter+' expects at most two values');
  const values=expressions.map(expression=>Math.fround(Math.trunc(Number(api.evaluate(expression)))|0));
  if(values.length<2)values.push(0);
  for(let index=0;index<2;index++)if(values[index]>=0)range[axis][index]=values[index];
 }
 return range;
}
