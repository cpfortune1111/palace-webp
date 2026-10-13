import {attackAttributeMatches} from './attack-attribute.js';

export function createHitOverrides(){return Array(8).fill(null)}

export function hitFlagMask(value){
 const flags={H:1,L:2,M:3,A:4,F:8,D:16,P:32,'-':64,'+':128};
 return [...String(value).toUpperCase()].reduce((mask,flag)=>mask|(flags[flag]||0),0);
}

export function applyHitOverrideController(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='hitoverride')return false;
 const params=controller.params||{},integer=value=>Math.trunc(Number(api.evaluate(value)))|0;
 const owner=params.redirectid===undefined?caller:api.findActor(integer(params.redirectid));if(!owner)return true;
 let slot=Math.max(0,integer(params.slot??0));if(slot>7)slot=0;
 const state=integer(params.stateno??-1);let time=integer(params.time??1);if(time<-1||time===0)time=1;
 const forceAir=Number(api.evaluate(params.forceair??0))!==0,keepState=Number(api.evaluate(params.keepstate??0))!==0,forceGuard=Number(api.evaluate(params.forceguard??0))!==0;
 api.slots(owner)[slot]={attribute:params.attr??'',state,time,forceAir,keepState,forceGuard,guardFlag:params.guardflag===undefined?null:hitFlagMask(params.guardflag),guardFlagNot:params['guardflag.not']===undefined?null:hitFlagMask(params['guardflag.not'])};
 return true;
}

export function selectHitOverride(slots,hit,{attackerState,projectile=false,unguardable=false}={}){
 const guard=hitFlagMask(hit.guardflag??'');
 for(let index=0;index<slots.length;index++){
  const override=slots[index];if(!override||override.time===0||!override.attribute||!attackAttributeMatches(override.attribute,hit.attr,{attackerState,projectile}))continue;
  if(override.guardFlag!==null&&(!(override.guardFlag&guard)||unguardable))continue;
  if(override.guardFlagNot!==null&&(override.guardFlagNot&guard)&&!unguardable)continue;
  const miss=Number(hit.missonoverride??-1)===1||Number(hit.missonoverride??-1)===-1&&!projectile&&(Number(hit.p1stateno??-1)>=0||Number(hit.p2stateno??-1)>=0);
  return {override,index,miss};
 }
 return null;
}

export function tickHitOverrides(slots){for(let index=0;index<slots.length;index++)if(slots[index]?.time>0&&--slots[index].time===0)slots[index]=null}