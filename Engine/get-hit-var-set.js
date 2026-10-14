import {compileAttackAttribute} from './attack-attribute.js';

const fields=[
 ['airtype','i'],['animtype','i'],['attr','attr'],['chainid','i','hitid'],['crouch.friction','f'],['ctrltime','i'],['damage','i'],['dizzypoints','i'],['down.recover','b'],['down.recovertime','i'],['fall','b'],['fall.damage','i'],
 ['fall.envshake.time','i'],['fall.envshake.freq','f'],['fall.envshake.phase','f'],['fall.envshake.ampl','ampl'],['fall.envshake.mul','f'],['fall.envshake.dir','f'],['fall.envshake.diradd','f'],['fall.envshake.decay','f'],['fall.kill','b'],['fall.recover','b'],['fall.recovertime','i'],['fall.xvel','scaled'],['fall.yvel','scaled'],['fall.zvel','scaled'],['fallcount','i'],['groundtype','i'],['guardcount','i'],['guarded','b'],['guardpoints','i'],['hitcount','i','hittime'],['hitshaketime','i'],['hittime','i'],['playerid','i'],['playerno','index'],['projid','i'],['redlife','i'],['stand.friction','f'],['slidetime','i'],['teamside','index'],['xvel','scaled'],['xaccel','scaled'],['yaccel','scaled'],['zaccel','scaled'],['yvel','scaled'],['zvel','scaled']
];
export const getHitVarSetFields=Object.freeze(fields.map(field=>Object.freeze([...field])));

export function applyGetHitVarSet(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='gethitvarset')return false;
 const params=controller.params||{},recipient=params.redirectid===undefined?caller:api.findActor(Math.trunc(Number(api.evaluate(params.redirectid)))|0);
 if(!recipient)return true;
 const hit=api.getHit(recipient),ratio=Math.fround(api.localScale(caller)/api.localScale(recipient));
 for(const [name,type,destination=name] of fields){
  if(params[name]===undefined)continue;
  let value=type==='attr'?compileAttackAttribute(params[name]):Number(api.evaluate(params[name]));
  if(type==='i'||type==='index'||type==='ampl')value=Math.trunc(value)|0;
  if(type==='index')value--;
  if(type==='b')value=Number((name==='fall'?(Math.trunc(value)|0):value)!==0);
  if(type==='f'||type==='scaled')value=Math.fround(value);
  if(type==='scaled')value=Math.fround(value*ratio);
  if(type==='ampl')value=Math.trunc(Math.fround(Math.fround(value)*ratio))|0;
  hit[destination]=value;
  if(destination==='hittime'||destination==='hitshaketime')api.setClock?.(recipient,destination,value);
 }
 return true;
}
