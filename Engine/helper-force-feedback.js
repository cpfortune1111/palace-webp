export function excludesLegacyHelperFeedback(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='forcefeedback')return false;
 const params=controller.params||{};
 if(params.lo!==undefined||params.hi!==undefined)return false;
 let target=params.redirectid===undefined?caller:api.findActor(Math.trunc(Number(api.evaluate(params.redirectid)))|0);
 if(!target)return true;
 api.evaluate(params.time??60);
 for(const name of ['freq','ampl'])for(const expression of api.split(params[name]??128).slice(0,4))api.evaluate(expression);
 const self=Number(api.evaluate(params.self??1))!==0;
 if(!self)target=api.opponent(target);
 return !target||target.kind==='helper';
}
