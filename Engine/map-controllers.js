import {normalizeMapValue,readStoredMapValue,writeStoredMapValue,forgetStoredMapValue} from './map-value-types.js';
export {readStoredMapValue,clearStoredMapTypes,writeStoredMapValue} from './map-value-types.js';

const types=new Set(['mapset','mapadd','parentmapset','parentmapadd','rootmapset','rootmapadd','teammapset','teammapadd','mapreset']);

export function applyMapController(controller,actor,api){
 const type=controller.type.toLowerCase();
 if(!types.has(type))return false;
 const params=controller.params||controller;
 const target=params.redirectid===undefined?actor:api.findActor(Math.trunc(Number(api.evaluate(params.redirectid))));
 if(!target)return true;
 if(type==='mapreset'){
  const exclusions=[];
  for(let index=1;index<=8;index++){
   const value=params[index===1?'exclude':'exclude'+index];
   if(value===undefined)continue;
   const name=String(api.evaluate(value)).toLowerCase();
   if(name)exclusions.push(name);
  }
  const excluded=name=>exclusions.some(exclusion=>name.toLowerCase().includes(exclusion));
  const defaults=target.mapDefaults||new Map();
  for(const name of target.maps.keys())if(!excluded(name)){
   forgetStoredMapValue(target.maps,name);
   if(defaults.has(name))writeStoredMapValue(target.maps,name,readStoredMapValue(defaults,name));else target.maps.delete(name);
  }
  for(const name of defaults.keys())if(!target.maps.has(name)&&!excluded(name))writeStoredMapValue(target.maps,name,readStoredMapValue(defaults,name));
  return true;
 }
 const assignments=Object.keys(params).filter(key=>/^map\(.*\)$/i.test(key.trim()));
 if(assignments.length>1)throw Error('Map controller can only assign one key');
 const keyExpression=assignments.length?assignments[0].trim().slice(4,-1):params.map;
 const valueExpression=assignments.length?params[assignments[0]]:params.value;
 if(keyExpression===undefined||valueExpression===undefined)throw Error('Missing map name or value');
 const name=String(api.evaluate(keyExpression)).toLowerCase(),sample=normalizeMapValue(api.sample?api.sample(valueExpression):{value:api.evaluate(valueExpression)}),value=sample.value;
 if(!name)throw Error('Map name cannot be empty');
 const targets=type.startsWith('parent')?[api.parentActor(target)]:type.startsWith('root')?[api.rootActor(target)]:type.startsWith('team')?api.teamActors(target):[target];
 for(const owner of targets.filter(Boolean)){
  if(type.endsWith('add')){
   const stored=readStoredMapValue(owner.maps,name),previous=stored.value;
   if(typeof previous==='string'||typeof value==='string'){api.warn?.('MapAdd cannot add string values');continue}
   const floating=stored.type==='float'||sample.type==='float',numeric=operand=>Number.isNaN(Number(operand))?0:Number(operand),sum=floating?Math.fround(numeric(previous))+Math.fround(numeric(value)):numeric(previous)+numeric(value);
   writeStoredMapValue(owner.maps,name,{type:floating?'float':'int',value:sum});
  }else writeStoredMapValue(owner.maps,name,sample);
 }
 return true;
}
