import {prepareReversalDefinition} from './reversal-definition.js';
import {reversalContactAllowed} from './reversal-contact-filter.js';
import {hitDefCollisionBoxes} from './hitdef-collision-group.js';
import {worldClsnBox,clsnWorldOverlap} from './clsn-world-geometry.js';
import {clsnProxyFamily} from './helper-clsn-proxy.js';

export function reversalAttackBoxContact(reverser,attacker,{reversalSets,attackSets,filterRecipientBoxes,active=true,ignoreReversal=false,unguardable=false,depthOverlap=true}){
 const params=prepareReversalDefinition(reverser.params);
 if(!depthOverlap||!reversalContactAllowed(params,attacker.params,{active,ignoreReversal,unguardable}))return {overlap:false,contact:false};
 const target=hitDefCollisionBoxes(params,attackSets,{reversal:true});
 const sourceBoxes=typeof reversalSets.c1==='function'?reversalSets.c1():reversalSets.c1??[];
 const source=sourceBoxes.map(box=>worldClsnBox(box,reverser.x,reverser.y,reverser.facing));
 const recipient=(filterRecipientBoxes?filterRecipientBoxes(target.boxes,target.group):target.boxes).map(box=>worldClsnBox(box,attacker.x,attacker.y,attacker.facing));
 const overlap=source.some(first=>recipient.some(second=>clsnWorldOverlap(first,second)));
 return {overlap,contact:overlap,group:target.group,requiredMissing:target.requiredMissing};
}

export function reversalProxyBoxContact(reverser,attacker,{helpers,setsFor,filterTargetBoxes,...options}){
 if(reverser.clsnProxy||attacker.clsnProxy||reverser.standby||attacker.standby||reverser.disabled||attacker.disabled)return {overlap:false,contact:false};
 const params=prepareReversalDefinition(reverser.params),sources=clsnProxyFamily(reverser,helpers),targets=clsnProxyFamily(attacker,helpers,{group:String(params.p2clsncheck).toLowerCase()==='size'?3:1});
 let result={overlap:false,contact:false};
 for(const source of sources){
  if(source.standby||source.disabled)continue;
  const sourceParams=source===reverser?params:{...params,p2clsnrequire:source.activeHitDef?.params?.p2clsnrequire??'none'};
  for(const target of targets){
   if(target.standby||target.disabled)continue;
   result=reversalAttackBoxContact({...source,params:sourceParams},{...target,params:attacker.params},{...options,reversalSets:setsFor(source),attackSets:setsFor(target),filterRecipientBoxes:filterTargetBoxes?(boxes,group)=>filterTargetBoxes(source,target,boxes,group):undefined});
   if(result.contact)return result;
  }
 }
 return result;
}
