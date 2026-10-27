import {controllerInteger} from './controller-value-conversion.js';
import {nativeDataPrefix} from './native-data-prefix.js';

export function compileSoundReference(source,{split,evaluate}){
 let {prefix,value}=nativeDataPrefix(String(source).trim());
 const parts=split(value);
 if(!prefix&&parts.length===3){const dynamic=evaluate(parts.shift());if(typeof dynamic!=='string')throw Error('Sound resource prefix requires a string');prefix=dynamic.toLowerCase()}
 if(prefix&&!['f','s'].includes(prefix))throw Error('Unsupported sound resource prefix '+prefix);
 if(parts.length<1||parts.length>2||!String(parts[0]).trim())throw Error('Sound reference requires group and optional item');
 return {common:prefix==='f',group:controllerInteger(evaluate(parts[0])),item:parts.length===2?controllerInteger(evaluate(parts[1])):0};
}
