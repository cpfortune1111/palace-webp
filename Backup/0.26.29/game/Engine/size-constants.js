const components={
 'size.ground.back':['standbox',0,-1],'size.ground.front':['standbox',2,1],
 'size.air.back':['airbox',0,-1],'size.air.front':['airbox',2,1],
 'size.height':['standbox',1,-1],
 'size.attack.depth.top':['attackDepth',0,1],'size.attack.depth.bottom':['attackDepth',1,1],
 'size.head.pos.x':['headPosition',0,1],'size.head.pos.y':['headPosition',1,1],
 'size.mid.pos.x':['midPosition',0,1],'size.mid.pos.y':['midPosition',1,1],
 'size.draw.offset.x':['drawOffset',0,1],'size.draw.offset.y':['drawOffset',1,1],
 'size.depth.top':['depth',0,1],'size.depth.bottom':['depth',1,1]
};
const direct={'size.xscale':'xscale','size.yscale':'yscale','size.pushfactor':'pushFactor'};
const integers={'size.proj.doscale':'projectileDoScale','size.weight':'weight'};
export const sizeConstantNames=new Set([...Object.keys(components),...Object.keys(direct),...Object.keys(integers),'size.shadowoffset']);

export function sizeConstant(name,definition,{subjectLocalCoord=1280,expressionLocalCoord=subjectLocalCoord}={}){
 const key=String(name).toLowerCase();
 if(!sizeConstantNames.has(key)||!definition)return {handled:false};
 if(Object.hasOwn(direct,key))return {handled:true,value:Math.fround(Number(definition[direct[key]]))};
 if(Object.hasOwn(integers,key))return {handled:true,value:Math.trunc(Number(definition[integers[key]]))|0};
 if(!(subjectLocalCoord>0&&expressionLocalCoord>0&&Number.isFinite(subjectLocalCoord)&&Number.isFinite(expressionLocalCoord)))throw Error('Invalid Size constant coordinates');
 const ratio=Math.fround(Math.fround(320/subjectLocalCoord)/Math.fround(320/expressionLocalCoord));
 const component=components[key],value=component?Math.fround(Number(definition[component[0]][component[1]])*component[2]):Number(definition.shadowOffset);
 return {handled:true,value:Math.fround(Math.fround(value)*ratio)};
}

export function applyHelperSizeOverrides(definition,params,api){
 const result=structuredClone(definition);
 const scalars=[['size.xscale','xscale'],['size.yscale','yscale'],
  ['size.ground.back','standbox',0,-1],['size.ground.front','standbox',2,1],
  ['size.air.back','airbox',0,-1],['size.air.front','airbox',2,1],
  ['size.height','standbox',1,-1],['size.proj.doscale','projectileDoScale'],
  ['size.head.pos','headPosition'],['size.mid.pos','midPosition'],
  ['size.shadowoffset','shadowOffset'],['size.depth','depth'],
  ['size.weight','weight'],['size.pushfactor','pushFactor']];
 for(const [parameter,target,index,sign]of scalars){
  if(params[parameter]===undefined)continue;
  if(index!==undefined){result[target][index]=Math.fround(Math.fround(Number(api.evaluate(params[parameter])))*sign);continue}
  if(Array.isArray(result[target])){
   const expressions=api.split(params[parameter]);
   if(expressions.length>2)throw Error('Helper '+parameter+' expects at most two components');
   for(const [component,expression]of expressions.entries())result[target][component]=Math.fround(Number(api.evaluate(expression)));
  }else result[target]=parameter==='size.weight'||parameter==='size.proj.doscale'?Math.trunc(Number(api.evaluate(params[parameter])))|0:Math.fround(Number(api.evaluate(params[parameter])));
 }
 return result;
}

export function sizeCollisionConstants(definition){
 const number=value=>Math.fround(Number(value));
 return {
  'size.xscale':number(definition.xscale),'size.yscale':number(definition.yscale),
  'size.ground.back':number(-Number(definition.standbox[0])),
  'size.ground.front':number(definition.standbox[2]),'size.height':number(-Number(definition.standbox[1])),
  'size.air.back':number(-Number(definition.airbox[0])),'size.air.front':number(definition.airbox[2]),
  'size.stand.sizebox':definition.standbox.map(number),'size.crouch.sizebox':definition.crouchbox.map(number),
  'size.air.sizebox':definition.airbox.map(number),'size.down.sizebox':definition.downbox.map(number)
 };
}

export function helperSizeDrawing(definition,{localCoord=1280,worldWidth=1280,facing=1}={}){
 if(!definition)return {scale:[1,1],offset:[0,0]};
 if(!(localCoord>0&&worldWidth>0&&Number.isFinite(localCoord)&&Number.isFinite(worldWidth)))throw Error('Invalid Helper drawing coordinates');
 const ratio=Math.fround(worldWidth/localCoord);
 return {scale:[definition.xscale,definition.yscale].map(value=>Math.fround(Math.fround(Number(value))*ratio)),
  offset:[Math.fround(Math.fround(Number(definition.drawOffset[0]))*facing*ratio),Math.fround(Math.fround(Number(definition.drawOffset[1]))*ratio)]};
}

export function projectileSpriteScale(params,definition,api){
 const scale=[1,1];
 if(params.projscale!==undefined){
  const expressions=api.split(params.projscale);
  if(expressions.length>2)throw Error('Projectile projscale expects at most two components');
  for(const [index,expression]of expressions.entries())scale[index]=Math.fround(Number(api.evaluate(expression)));
 }
 if(definition&&Number(definition.projectileDoScale)!==0){
  scale[0]=Math.fround(scale[0]*Math.fround(Number(definition.xscale)));
  scale[1]=Math.fround(scale[1]*Math.fround(Number(definition.yscale)));
 }
 return scale;
}
