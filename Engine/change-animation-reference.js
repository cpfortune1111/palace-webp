import {nativeDataPrefix} from './native-data-prefix.js';
import {controllerInteger} from './controller-value-conversion.js';
export function changeAnimationReference(source,{evaluate,split,prefixes=[],actionFirst=false}){
 const literal=nativeDataPrefix(String(source).trim(),{prefixes}),parts=split(literal.value);
 if(parts.length<1||parts.length>2||literal.prefix&&parts.length!==1||!String(parts.at(-1)).trim())throw Error('Invalid ChangeAnim animation reference');
 const action=actionFirst?controllerInteger(evaluate(parts.at(-1))):undefined;
 const prefix=literal.prefix||(parts.length===1?'':evaluate(parts[0]));
 if(typeof prefix!=='string')throw Error('ChangeAnim animation prefix must be a string');
 return {prefix:prefix.toLowerCase(),action:actionFirst?action:controllerInteger(evaluate(parts.at(-1)))};
}
