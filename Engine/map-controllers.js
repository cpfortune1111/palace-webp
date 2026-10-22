import {normalizeMapValue,readStoredMapValue,writeStoredMapValue,forgetStoredMapValue} from './map-value-types.js';
import {controllerFloat32} from './controller-value-conversion.js';
export {readStoredMapValue,clearStoredMapTypes,writeStoredMapValue} from './map-value-types.js';

const types=new Set(['mapset','mapadd','parentmapset','parentmapadd','rootmapset','rootmapadd','teammapset','teammapadd','mapreset']);

function quotedStaticName(value){
 const text=String(value).trim();
 if(text.length<2||text[0]!=='"'||text.at(-1)!=='"')throw Error('Map name must be enclosed in quotes');
 return text.slice(1,-1);
}

function conventionalMapParameters(params){
 let text=String(params.map??'').trim(),value=params.value;
 const equal=text.indexOf('=');
 if(equal>0){
  if(text.slice(0,equal).trim().toLowerCase()==='map')text=text.slice(equal+1).trim();
  else{
   const body=text.slice(3).trim();
   const match=/^\(\s*([^ !=<>()|&+\-*/%,\[\]^:;{}#"\t\r\n]+)\s*\)\s*(:=|=)([\s\S]*)$/.exec(body);
   if(!match)throw Error('Invalid embedded Map assignment');
   const token=match[1],number=/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d*)?/.exec(token);
   if(number&&number[0]!==token)throw Error('Invalid embedded Map name token');
   if(!match[3].trim())throw Error('Missing map value');
   return {name:token.toLowerCase(),value:match[3].trim()};
  }
 }
 return {name:quotedStaticName(text).toLowerCase(),value};
}

export function applyMapController(controller,actor,api){
 const type=controller.type.toLowerCase();
 if(!types.has(type))return false;
 const params=controller.params||controller;
 let target=actor;
 if(params.redirectid!==undefined){
  const raw=api.evaluate(params.redirectid),numeric=typeof raw==='string'||raw===undefined||Number.isNaN(Number(raw))?0:Number(raw),id=Math.trunc(numeric);
  target=api.findActor(id);
  if(!target)api.warn?.('invalid RedirectID for '+(type==='mapreset'?'MapReset':'MapSet')+': '+id);
 }
 if(!target)return true;
 if(type==='mapreset'){
  const exclusions=[];
  for(let index=1;index<=8;index++){
   const value=params[index===1?'exclude':'exclude'+index];
   if(value===undefined)continue;
   const name=quotedStaticName(value).toLowerCase();
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
 const conventional=assignments.length?null:conventionalMapParameters(params);
 const keyExpression=assignments.length?assignments[0].trim().slice(4,-1):conventional.name;
 const valueExpression=assignments.length?params[assignments[0]]:conventional.value;
 if(keyExpression===undefined||valueExpression===undefined||String(valueExpression).trim()==='')throw Error('Missing map name or value');
 const name=(assignments.length?keyExpression.trim():keyExpression).toLowerCase();
 if(!name)throw Error('Map name cannot be empty');
 const rawSample=api.sample?api.sample(valueExpression):{value:api.evaluate(valueExpression)},sample=normalizeMapValue(rawSample.constant&&typeof rawSample.value!=='string'?{type:'float',value:controllerFloat32(rawSample.value)}:rawSample),value=sample.value;
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
