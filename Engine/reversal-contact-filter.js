import {allowsHit} from './hit-attribute-mask.js';
import {guardFlagMask} from './get-hit-guard-flag.js';

export function reversalContactAllowed(reversal,attack,{active=true,ignoreReversal=false,unguardable=false}={}){
 if(!active||ignoreReversal||!attack.attr||!reversal['reversal.attr'])return false;
 if(!allowsHit(reversal['reversal.attr'],attack.attr,{compatibility:'ikemen'}))return false;
 const guard=guardFlagMask(attack.guardflag??'');
 if(reversal['reversal.guardflag']!==undefined&&(unguardable||!(guardFlagMask(reversal['reversal.guardflag'])&guard)))return false;
 if(reversal['reversal.guardflag.not']!==undefined&&!unguardable&&(guardFlagMask(reversal['reversal.guardflag.not'])&guard))return false;
 return true;
}
