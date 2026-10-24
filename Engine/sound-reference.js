import {controllerInteger} from './controller-value-conversion.js';

export function compileSoundReference(source,{split,evaluate}){
 const text=String(source).trim(),prefix=text.match(/^([FS])\s*(?=[\d.+\-(])/i),parts=split(prefix?text.slice(prefix[0].length):text);
 if(parts.length!==2)throw Error('Sound reference requires group and item');
 return {common:prefix?.[1].toUpperCase()==='F',group:controllerInteger(evaluate(parts[0])),item:controllerInteger(evaluate(parts[1]))};
}
