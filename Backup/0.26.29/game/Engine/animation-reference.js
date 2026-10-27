import {controllerInteger} from './controller-value-conversion.js';
import {nativeDataPrefix} from './native-data-prefix.js';

export function compileAnimationReference(source,{split,evaluate,commonDefault=false,prefixes=[]}){
 let {prefix,value}=nativeDataPrefix(String(source).trim(),{prefixes});
 const parts=split(value);
 if(!prefix&&parts.length===2){
  const dynamic=evaluate(parts.shift());
  if(typeof dynamic!=='string')throw Error('Animation resource prefix requires a string');
  prefix=dynamic.toLowerCase();
 }else if(!prefix)prefix=commonDefault?'f':'';
 if(parts.length!==1||!String(parts[0]).trim())throw Error('Animation reference requires one action number');
 return {prefix,action:controllerInteger(evaluate(parts[0]))};
}
