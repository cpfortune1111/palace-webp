export function compileHitStateParameters(params,{evaluate=Number}={}){
 const result={};
 if(params.p1stateno!==undefined)result.p1stateno=Math.trunc(Number(evaluate(params.p1stateno)))|0;
 if(params.p2stateno!==undefined){result.p2stateno=Math.trunc(Number(evaluate(params.p2stateno)))|0;result.p2getp1state=1;}
 if(params.p2getp1state!==undefined)result.p2getp1state=Number(evaluate(params.p2getp1state))!==0?1:0;
 return result;
}
