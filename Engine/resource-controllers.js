import {synchronizeLifeRedLife} from './redlife-controllers.js';

const supported=new Set(['lifeadd','lifeset','poweradd','powerset']);
const integer=value=>Math.trunc(Number(value))|0;
const rounded=value=>Math.sign(value)*Math.floor(Math.abs(value)+0.5);
const clamp=(value,maximum)=>Math.max(0,Math.min(maximum,value));

export function applyResourceController(controller,actor,api){
 const type=controller.type.toLowerCase();
 if(!supported.has(type))return false;
 const params=controller.params||controller;
 const evaluate=expression=>api.evaluate(expression);
 const target=params.redirectid===undefined?actor:api.findActor(integer(evaluate(params.redirectid)));
 if(!target)return true;
 if(params.value===undefined)throw Error('Missing '+controller.type+' value');
 const value=integer(evaluate(params.value));
 if(type.startsWith('power')){
  const owner=api.powerOwner(target);
  if(api.powerLocked?.(owner))return true;
  owner.power=api.maximumPower?.(owner)?owner.powerMax:clamp(type==='powerset'?value:Math.max(-2147483648,Math.min(2147483647,owner.power+value)),owner.powerMax);
  return true;
 }
 if(type==='lifeset'){
  if(!(target.life>0&&api.noDamage?.(target))){target.life=clamp(value,target.lifeMax);synchronizeLifeRedLife(target,target.life,api.redLifeEnabled?.(target)??true)}
  return true;
 }
 const kill=params.kill===undefined||!!evaluate(params.kill);
 const absolute=!!evaluate(params.absolute??0)||(api.compatibility?.(actor)==='mugen'&&value>0);
 target.getHit??={};target.getHit.kill=kill;
 if(value===0)return true;
 let addition=absolute?value:value/target.finalDefense;
 if(addition<0&&addition>-1)addition=-1;
 const delta=rounded(addition);
 const previous=target.life;
 let life=integer(previous+delta);
 if(delta>0&&life<previous||delta<0&&life>previous)life=0;
 if(!kill&&life<=0)life=previous>0||api.compatibility?.(actor)==='mugen'?1:0;
 if(delta<0)target.receivedDamage=(target.receivedDamage||0)+Math.min(previous,-delta);
 if(!(previous>0&&api.noDamage?.(target))){target.life=clamp(life,target.lifeMax);synchronizeLifeRedLife(target,target.life,api.redLifeEnabled?.(target)??true)}
 return true;
}
