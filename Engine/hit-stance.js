export function hitStanceParameters(params){
 const groundY=Number(String(params['ground.velocity']??'0,0').split(',')[1]??0);
 return {forcestand:params.forcestand===undefined?groundY!==0:Number(params.forcestand)!==0,
  forcecrouch:Number(params.forcecrouch??0)!==0};
}

export function forcedHitStance(type,flags){
 if(type==='C'&&flags.forcestand)return 'S';
 if(type==='S'&&flags.forcecrouch)return 'C';
 return type;
}
