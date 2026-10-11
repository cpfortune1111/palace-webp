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
   if(defaults.has(name))target.maps.set(name,defaults.get(name));else target.maps.delete(name);
  }
  for(const [name,value] of defaults)if(!target.maps.has(name)&&!excluded(name))target.maps.set(name,value);
  return true;
 }
 const assignments=Object.keys(params).filter(key=>/^map\(.*\)$/i.test(key.trim()));
 if(assignments.length>1)throw Error('Map controller can only assign one key');
 const keyExpression=assignments.length?assignments[0].trim().slice(4,-1):params.map;
 const valueExpression=assignments.length?params[assignments[0]]:params.value;
 if(keyExpression===undefined||valueExpression===undefined)throw Error('Missing map name or value');
 const name=String(api.evaluate(keyExpression)).toLowerCase(),value=api.evaluate(valueExpression);
 if(!name)throw Error('Map name cannot be empty');
 const targets=type.startsWith('parent')?[api.parentActor(target)]:type.startsWith('root')?[api.rootActor(target)]:type.startsWith('team')?api.teamActors(target):[target];
 for(const owner of targets.filter(Boolean)){
  if(type.endsWith('add')){
   const previous=owner.maps.get(name)??0;
   if(typeof previous==='string'||typeof value==='string'){api.warn?.('MapAdd cannot add string values');continue}
   const sum=Number(previous)+Number(value);
   owner.maps.set(name,Number.isInteger(previous)&&Number.isInteger(value)?sum|0:Math.fround(sum));
  }else owner.maps.set(name,typeof value==='number'&&!Number.isInteger(value)?Math.fround(value):value);
 }
 return true;
}
