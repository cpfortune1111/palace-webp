export function compileSoundReference(source,{split,evaluate}){
 const text=String(source).trim(),prefix=text.match(/^([FS])\s*(?=[\d.+\-(])/i),parts=split(prefix?text.slice(prefix[0].length):text);
 if(parts.length!==2)throw Error('Sound reference requires group and item');
 return {common:prefix?.[1].toUpperCase()==='F',group:Math.trunc(Number(evaluate(parts[0])))|0,item:Math.trunc(Number(evaluate(parts[1])))|0};
}
