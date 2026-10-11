export function createDefenseState(){return {customDefense:1,onHit:false}}

export function effectiveCustomDefense(state,moveType){return state.onHit&&moveType!=='H'?1:state.customDefense}

export function applyDefenseController(controller,actor,api){
 if(controller.type.toLowerCase()!=='defencemulset')return false;
 const params=controller.params||controller;
 const target=params.redirectid===undefined?actor:api.findActor(Math.trunc(Number(api.evaluate(params.redirectid))));
 if(!target)return true;
 if(params.value===undefined)throw Error('Missing DefenceMulSet value');
 const mugen=api.compatibility==='mugen';
 const value=Math.fround(Number(api.evaluate(params.value)));
 const mulType=Math.trunc(Number(params.multype??params.mulType??(mugen?0:1)));
 if(mulType!==0&&mulType!==1)throw Error('Invalid DefenceMulSet multype');
 target.defenseState.customDefense=mulType===0?Math.fround(1/value):value;
 target.defenseState.onHit=Number(api.evaluate(params.onhit??params.onHit??(mugen?1:0)))!==0;
 return true;
}
