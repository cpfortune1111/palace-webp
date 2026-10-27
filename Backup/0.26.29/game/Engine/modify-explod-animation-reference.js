import {controllerInteger} from './controller-value-conversion.js';
import {nativeDataPrefix} from './native-data-prefix.js';

export function readModifyExplodAnimation(params,{evaluate,split,ikemen}){
 const animationPlayer=params.animplayerno===undefined?0:controllerInteger(evaluate(params.animplayerno)),spritePlayer=params.spriteplayerno===undefined?0:controllerInteger(evaluate(params.spriteplayerno));
 if(params.anim===undefined||!ikemen)return null;
 const {prefix:literal,value}=nativeDataPrefix(String(params.anim).trim()),parts=split(value);
 if(parts.length<1||parts.length>2||literal&&parts.length!==1||!String(parts.at(-1)).trim())throw Error('Invalid ModifyExplod animation reference');
 const action=controllerInteger(evaluate(parts.at(-1)));
 const prefix=literal||(parts.length===1?'':evaluate(parts[0]));
 if(typeof prefix!=='string')throw Error('ModifyExplod animation prefix requires a string');
 return {action,prefix:prefix.toLowerCase(),animationPlayer,spritePlayer};
}
