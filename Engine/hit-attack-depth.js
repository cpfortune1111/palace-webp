export function hitAttackDepth(params,{constants={},evaluate=Number,split=value=>String(value).split(',')}={}){
 if(params['attack.depth']===undefined)return [Math.fround(Number(constants['size.attack.depth.x']??4)),Math.fround(Number(constants['size.attack.depth.y']??4))];
 const components=split(params['attack.depth']);
 if(components.length>2||components.some(value=>String(value).trim()===''))throw Error('Invalid attack.depth component count');
 const first=Math.fround(Number(evaluate(components[0])));
 return [first,components[1]===undefined?first:Math.fround(Number(evaluate(components[1])))];
}
