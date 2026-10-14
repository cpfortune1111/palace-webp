import {compileAttackAttribute} from './attack-attribute.js';

export function getHitAttributeString(value){
 const mask=typeof value==='string'?compileAttackAttribute(value):Number(value??0)&0x7fffffff;
 if(mask===0)return '';
 let result='';
 for(const [name,bit] of [['S',1],['C',2],['A',4]])if(mask&bit)result+=name;
 for(const [name,bit] of [['NA',64],['NT',128],['NP',256],['SA',512],['ST',1024],['SP',2048],['HA',4096],['HT',8192],['HP',16384]])if(mask&bit)result+=', '+name;
 return result;
}

export function getHitAttributeMatches(value,pattern){
 const current=typeof value==='string'?compileAttackAttribute(value):Number(value??0),common=current&compileAttackAttribute(pattern);
 return !!(common&7)&&!!(common&0x7fffffc0);
}
