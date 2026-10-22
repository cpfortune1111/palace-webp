const storageTypes=new WeakMap();

export function normalizeMapValue(sample){
 const value=sample.value;
 const type=typeof value==='string'?'string':value===undefined||Number.isNaN(value)?'undefined':['int','float','bool','undefined'].includes(sample.type)?sample.type:typeof value==='boolean'?'bool':Number.isInteger(value)?'int':'float';
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
