const storageTypes=new WeakMap();

export function normalizeMapValue(sample){
 const value=sample.value;
 const type=typeof value==='string'?'string':value===undefined||Number.isNaN(value)&&sample.type!=='float'?'undefined':['int','float','bool','undefined'].includes(sample.type)?sample.type:typeof value==='boolean'?'bool':Number.isInteger(value)?'int':'float';
 return {type,value:type==='float'?Math.fround(Number(value)):type==='int'?Math.trunc(Number(value))|0:type==='bool'?!!value:type==='string'?String(value):NaN};
}

export function readStoredMapValue(storage,name){
 if(!storage.has(name))return {type:'float',value:0};
 const value=storage.get(name),known=storageTypes.get(storage)?.get(name);
 return known&&Object.is(known.value,value)?{...known}:normalizeMapValue({value});
}

export function writeStoredMapValue(storage,name,sample){
 const result=normalizeMapValue(sample);
 storage.set(name,result.value);
 if(!storageTypes.has(storage))storageTypes.set(storage,new Map());
 storageTypes.get(storage).set(name,result);
 return result;
}

export function forgetStoredMapValue(storage,name){storageTypes.get(storage)?.delete(name)}
export function clearStoredMapTypes(storage){storageTypes.delete(storage)}

export function cloneStoredMapValues(storage){
 const result=new Map();
 for(const name of storage?.keys()||[])writeStoredMapValue(result,name,readStoredMapValue(storage,name));
 return result;
}

export function initializeStoredMaps(current,defaults,bundle){
 for(const storage of [current,defaults]){storage.clear();clearStoredMapTypes(storage)}
 for(const [rawName,value] of Object.entries(bundle.mapDefaults||{})){
  const name=rawName.toLowerCase(),type=bundle.mapDefaultTypes?.[rawName];
  if(type!==undefined&&!['int','float','string'].includes(type))throw Error('Invalid imported Map default type: '+type);
  const sample=type==='float'?{type,value:Number(value)}:{type,value};
  writeStoredMapValue(defaults,name,sample);
  writeStoredMapValue(current,name,sample);
 }
}
