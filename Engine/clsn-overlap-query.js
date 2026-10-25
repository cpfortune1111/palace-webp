import {clsnProxyFamily} from './helper-clsn-proxy.js';
import {worldClsnBox,clsnWorldOverlap} from './clsn-world-geometry.js';
import {controllerInteger} from './controller-value-conversion.js';

export function clsnOverlapGroups(args){
 if(args.length!==3)throw Error('ClsnOverlap requires three arguments');
 const groups={clsn1:1,clsn2:2,size:3,dummy:4},read=(node,target)=>{const name=node.t==='id'?String(node.name).toLowerCase():'';if(!Object.hasOwn(groups,name)||target&&name==='dummy')throw Error('Invalid collision box type in ClsnOverlap');return groups[name]};
 return [read(args[0],false),read(args[2],true)];
}

export function characterClsnOverlap(source,target,firstGroup,secondGroup,{helpers,boxes,depthOverlap=()=>true}){
 if(!source||!target||source.clsnProxy||target.clsnProxy||source.disabled||target.disabled||source.standby||target.standby)return false;
 if(!depthOverlap(source,target,firstGroup,secondGroup))return false;
 for(const first of clsnProxyFamily(source,helpers,{group:firstGroup})){
  if(first.disabled||first.standby)continue;
  const firstBoxes=boxes(first,firstGroup).map(box=>worldClsnBox(box,first.x,first.y,first.facing));
  if(!firstBoxes.length)continue;
  for(const second of clsnProxyFamily(target,helpers,{group:secondGroup})){
   if(second.disabled||second.standby)continue;
   const secondBoxes=boxes(second,secondGroup).map(box=>worldClsnBox(box,second.x,second.y,second.facing));
   if(firstBoxes.some(one=>secondBoxes.some(two=>clsnWorldOverlap(one,two))))return true;
  }
 }
 return false;
}

export function projClsnOverlapGroup(args){
 if(args.length!==3)throw Error('ProjClsnOverlap requires three arguments');
 const node=args[2],name=node.t==='id'?String(node.name).toLowerCase():'',groups={clsn1:1,clsn2:2,size:3};
 if(!Object.hasOwn(groups,name))throw Error('Invalid collision box type in ProjClsnOverlap');return groups[name];
}

export function selectQueryProjectile(owner,index,entities){
 const slot=controllerInteger(index);if(slot<0||owner.kind==='helper'&&!owner.ownProjectile)return null;
 const ownerId=owner.kind==='helper'?owner.instanceId:owner.player??owner.id;
 return entities.filter(entity=>entity.kind==='projectile'&&entity.player===owner.player&&entity.projectileOwnerId===ownerId&&!entity.destroyed&&!entity.removing)[slot]??null;
}

export function projectileClsnOverlap(projectile,target,group,{helpers,boxes,projectileBoxes,depthOverlap=()=>true}){
 if(!projectile||!target||target.clsnProxy||target.disabled||target.standby)return false;
 if(!depthOverlap(projectile,target,1,group))return false;
 for(const number of [1,2]){
  const attack=projectileBoxes(projectile,number).map(box=>worldClsnBox(box,projectile.x,projectile.y,projectile.facing));if(!attack.length)continue;
  for(const actor of clsnProxyFamily(target,helpers,{group})){
   if(actor.standby||actor.disabled)continue;
   const body=boxes(actor,group).map(box=>worldClsnBox(box,actor.x,actor.y,actor.facing));
   if(attack.some(one=>body.some(two=>clsnWorldOverlap(one,two))))return true;
  }
 }
 return false;
}
