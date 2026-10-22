import {hitPauseVersionProfile} from './hit-pause-version.js';
import {controllerFloat32,controllerBoolean} from './controller-value-conversion.js';

export function createDefenseState(){return {customDefense:1,onHit:false}}

export function effectiveCustomDefense(state,moveType){return state.onHit&&moveType!=='H'?1:state.customDefense}

export function compileDefenseMulType(value){
 const literal=String(value).trim(),match=literal.match(/^[+-]?\d+/);
 const magnitude=match?Number(match[0].replace(/^[+-]/,'')):0;
 const parsed=magnitude>2147483647?(literal.startsWith('-')?-2147483648:2147483647):(literal.startsWith('-')?-magnitude:magnitude);
 if(parsed!==0&&parsed!==1)throw Error('Invalid DefenceMulSet multype');
 return parsed;
}

export function applyDefenseController(controller,actor,api){
 if(controller.type.toLowerCase()!=='defencemulset')return false;
 const params=controller.params||controller;
 const target=params.redirectid===undefined?actor:api.findActor(Math.trunc(Number(api.evaluate(params.redirectid))));
 if(!target)return true;
 if(params.value===undefined)throw Error('Missing DefenceMulSet value');
 const mugen=api.versionData?!hitPauseVersionProfile(api.versionData).ikemen:api.compatibility==='mugen';
 const value=controllerFloat32(api.evaluate(params.value));
 const mulType=compileDefenseMulType(params.multype??params.mulType??(mugen?0:1));
 const onHitExpression=params.onhit??params.onHit;
 const onHit=onHitExpression===undefined?mugen:controllerBoolean(api.evaluate(onHitExpression));
 target.defenseState.customDefense=mulType===0?Math.fround(1/value):value;
 target.defenseState.onHit=onHit;
 return true;
}
