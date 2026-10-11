const integer=value=>Math.trunc(Number(value))|0;
const rounded=value=>Math.sign(value)*Math.floor(Math.abs(value)+0.5);

export function applyRedLifeController(controller,actor,api){
 const type=controller.type.toLowerCase();
 if(!['redlifeadd','redlifeset'].includes(type))return false;
 const params=controller.params||controller;
 const target=params.redirectid===undefined?actor:api.findActor(integer(api.evaluate(params.redirectid)));
 if(!target)return true;
 if(params.value===undefined)throw Error('Missing '+controller.type+' value');
 const value=integer(api.evaluate(params.value));
 if(type==='redlifeadd'&&value===0)return true;
 let next=value;
 if(type==='redlifeadd'){
  const addition=Number(api.evaluate(params.absolute??0))!==0?value:value/target.finalDefense;
  next=Math.max(-2147483648,Math.min(2147483647,target.redLife+rounded(addition)));
 }
 if(target.life<=0)target.redLife=0;
 else if(api.enabled(target)&&!api.noDamage(target))target.redLife=Math.max(target.life,Math.min(target.lifeMax,next));
 return true;
}
