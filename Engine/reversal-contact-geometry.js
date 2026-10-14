import {prepareReversalDefinition} from './reversal-definition.js';
import {reversalContactAllowed} from './reversal-contact-filter.js';
import {hitDefCollisionBoxes} from './hitdef-collision-group.js';
import {worldClsnBox,clsnWorldOverlap} from './clsn-world-geometry.js';

export function reversalAttackBoxContact(reverser,attacker,{reversalSets,attackSets,active=true,ignoreReversal=false,unguardable=false,depthOverlap=true}){
 const params=prepareReversalDefinition(reverser.params);
 if(!depthOverlap||!reversalContactAllowed(params,attacker.params,{active,ignoreReversal,unguardable}))return {overlap:false,contact:false};
 const target=hitDefCollisionBoxes(params,attackSets,{reversal:true});
 const sourceBoxes=typeof reversalSets.c1==='function'?reversalSets.c1():reversalSets.c1??[];
 const source=sourceBoxes.map(box=>worldClsnBox(box,reverser.x,reverser.y,reverser.facing));
 const recipient=target.boxes.map(box=>worldClsnBox(box,attacker.x,attacker.y,attacker.facing));
 const overlap=source.some(first=>recipient.some(second=>clsnWorldOverlap(first,second)));
 return {overlap,contact:overlap,group:target.group,requiredMissing:target.requiredMissing};
}
