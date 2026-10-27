import {compileAttackAttribute} from './attack-attribute.js';

export function createHitBySlots(){return Array(8).fill(null)}

export function applyHitByController(controller,caller,api){
 const type=String(controller.type).toLowerCase();if(type!=='hitby'&&type!=='nothitby')return false;
 const params=controller.params||{},integer=value=>Math.trunc(Number(api.evaluate(value)))|0;
 const owner=params.redirectid===undefined?caller:api.findActor(integer(params.redirectid));if(!owner)return true;
 let slot=-1,attribute=params.attr===undefined?null:compileAttackAttribute(params.attr);
 const playerNo=params.playerno===undefined?-1:integer(params.playerno)-1,playerId=params.playerid===undefined?-1:integer(params.playerid);
 if(params.slot!==undefined)slot=Math.max(0,integer(params.slot));
 const stack=Number(api.evaluate(params.stack??0))!==0;
 const groups={all:-1,none:0,clsn1:1,clsn2:2,size:3,dummy:4},group=params['clsn.group']===undefined?-1:groups[String(params['clsn.group']).toLowerCase()];
 if(group===undefined)throw Error('Invalid Clsn type for clsn.group: '+params['clsn.group']);
 const index=params['clsn.index']===undefined?-1:integer(params['clsn.index']),time=integer(params.time??1);
 if(params.value!==undefined){slot=0;attribute=compileAttackAttribute(params.value)}
 else if(params.attr===undefined&&params.playerno===undefined&&params.playerid===undefined&&params.value2!==undefined){slot=1;attribute=compileAttackAttribute(params.value2)}
 else if(params.attr===undefined&&params.playerno===undefined&&params.playerid===undefined)throw Error('No '+controller.type+' parameters specified');
 if(slot<0)return true;if(slot>=8)slot=0;
 api.slots(owner)[slot]={not:type==='nothitby',attribute,time,playerNo,playerId,stack,group,index};return true;
}

export function hitByAllows(slots,hit,{attackerState,projectile=false,compatibility='ikemen',attackerPlayerNo=-1,attackerId=-1,group=-1,index=-1}={}){
 const attribute=compileAttackAttribute(hit.attr,{hitdef:true}),states={S:1,C:2,A:4,L:8,N:16},state=compatibility==='mugen'&&!projectile?(states[String(attackerState).toUpperCase()]??attribute&63):attribute&63;
 let hasStack=false,stackHit=false,nonStackHit=true;
 for(const slot of slots){
  if(!slot||slot.time===0||slot.group>=0&&slot.group!==group||slot.index>=0&&slot.index!==index)continue;
  const stateMatch=Boolean(slot.attribute&state),attackMatch=Boolean(slot.attribute&attribute&~63),numberMatch=slot.playerNo===attackerPlayerNo,idMatch=slot.playerId===attackerId;
  const allowed=slot.not?!((slot.attribute!==null&&(stateMatch||attackMatch))||(slot.playerNo>=0&&numberMatch)||(slot.playerId>=0&&idMatch)):(slot.attribute===null||stateMatch&&attackMatch)&&(slot.playerNo<0||numberMatch)&&(slot.playerId<0||idMatch);
  if(slot.stack){hasStack=true;stackHit||=allowed}else nonStackHit&&=allowed;
 }
 return nonStackHit&&(!hasStack||stackHit);
}

export function tickHitBySlots(slots){for(let index=0;index<slots.length;index++)if(slots[index]?.time>0&&--slots[index].time===0)slots[index]=null}